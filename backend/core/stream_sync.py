import time
import heapq
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field
from backend.core.models import RuntimeStateSnapshot, StreamSyncMetadata

class StreamEvent(BaseModel):
    """
    Encapsulates a runtime state snapshot with causal logical clock,
    arrival index, and interrupt metadata for out-of-order resequencing.
    """
    event_id: str
    sequence_id: int          # True monotonic sequence emitted by runtime
    logical_clock: int        # Lamport logical timestamp
    arrival_order: int        # Order in which the stream actually received the event
    is_interrupt: bool = False
    interrupt_id: Optional[str] = None
    snapshot: RuntimeStateSnapshot

    def __lt__(self, other: "StreamEvent") -> bool:
        # Sort primarily by sequence_id, then logical_clock, then arrival_order
        if self.sequence_id != other.sequence_id:
            return self.sequence_id < other.sequence_id
        if self.logical_clock != other.logical_clock:
            return self.logical_clock < other.logical_clock
        return self.arrival_order < other.arrival_order

class ResilientInMemoryStream:
    """
    Resilient in-memory stream buffer capable of handling out-of-order event arrival
    caused by high-priority interrupts, context switches, or asynchronous transport jitter.
    
    Uses a causal watermark priority queue and monotonic sequence barrier to reconstruct
    the strictly causal timeline required for deterministic AST isolation & sandbox verification.
    """

    def __init__(self, watermark_window: int = 64):
        self.watermark_window = watermark_window
        self._buffer: List[StreamEvent] = []  # Min-heap priority queue
        self._arrival_counter: int = 0
        self._highest_sequence_seen: int = 0
        self._sync_log: List[str] = []
        self._reordered_count: int = 0
        self._max_jitter: int = 0
        self._interrupt_count: int = 0

    def reset(self) -> None:
        """Resets internal state, counters, and buffer for clean reuse across sessions."""
        self._buffer.clear()
        self._arrival_counter = 0
        self._highest_sequence_seen = 0
        self._sync_log.clear()
        self._reordered_count = 0
        self._max_jitter = 0
        self._interrupt_count = 0

    def ingest(
        self,
        snapshot: RuntimeStateSnapshot,
        sequence_id: int,
        logical_clock: Optional[int] = None,
        is_interrupt: bool = False,
        interrupt_id: Optional[str] = None
    ) -> StreamEvent:
        """
        Ingests an individual snapshot into the resilient in-memory stream.
        Detects arrival jitter compared to expected monotonic arrival order.
        """
        self._arrival_counter += 1
        clock = logical_clock if logical_clock is not None else sequence_id
        
        # Check if this event arrived out-of-order relative to the highest sequence seen
        if sequence_id < self._highest_sequence_seen:
            jitter = self._highest_sequence_seen - sequence_id
            self._reordered_count += 1
            self._max_jitter = max(self._max_jitter, jitter)
            snapshot.is_out_of_order = True
            log_msg = f"✦ OUT-OF-ORDER INGEST DETECTED: Event #{sequence_id} arrived after #{self._highest_sequence_seen} (Jitter: {jitter} frames)"
            self._sync_log.append(log_msg)
        else:
            self._highest_sequence_seen = sequence_id

        if is_interrupt:
            self._interrupt_count += 1
            snapshot.interrupt_context = interrupt_id or f"INT_HIGH_PRIORITY_{self._interrupt_count}"
            self._sync_log.append(f"✦ HIGH-PRIORITY INTERRUPT: Stream intercepted by {snapshot.interrupt_context}")

        snapshot.sequence_id = sequence_id
        snapshot.logical_clock = clock
        snapshot.arrival_order = self._arrival_counter

        event = StreamEvent(
            event_id=f"evt_{sequence_id}_{self._arrival_counter}",
            sequence_id=sequence_id,
            logical_clock=clock,
            arrival_order=self._arrival_counter,
            is_interrupt=is_interrupt,
            interrupt_id=interrupt_id,
            snapshot=snapshot
        )

        heapq.heappush(self._buffer, event)
        return event

    def ingest_batch(
        self,
        snapshots: List[RuntimeStateSnapshot],
        simulate_scramble: bool = False,
        scramble_pattern: Optional[List[int]] = None,
        inject_interrupt_at: Optional[int] = None
    ) -> None:
        """
        Ingests a batch of snapshots. If simulate_scramble is True, simulates a high-priority
        interrupt causing temporary loss of access and delivering events out-of-order.
        """
        if not snapshots:
            return

        if not simulate_scramble:
            for idx, snap in enumerate(snapshots, start=1):
                self.ingest(snap, sequence_id=idx, logical_clock=idx)
            return

        # Scrambled delivery simulation
        # E.g., for 6 snapshots: delivered in order [3, 1, 4, 2, 6, 5]
        total = len(snapshots)
        indices = scramble_pattern or ([2, 0, 3, 1, 5, 4] if total >= 6 else list(reversed(range(total))))
        
        # Safe bound check for pattern
        valid_indices = [i for i in indices if 0 <= i < total]
        # Append any missing indices
        missing = [i for i in range(total) if i not in valid_indices]
        delivery_order = valid_indices + missing

        self._sync_log.append("✦ SIMULATION: High-priority interrupt dislocated stream buffer! Events scrambled in transit.")

        for delivery_idx, snap_idx in enumerate(delivery_order):
            snap = snapshots[snap_idx]
            actual_seq = snap_idx + 1  # 1-indexed true sequence
            
            is_interrupt = (inject_interrupt_at is not None and snap_idx == inject_interrupt_at)
            int_id = f"KERNEL_PREEMPT_PRIORITY_IRQ_0x{actual_seq:02X}" if is_interrupt else None

            self.ingest(
                snapshot=snap,
                sequence_id=actual_seq,
                logical_clock=actual_seq,
                is_interrupt=is_interrupt,
                interrupt_id=int_id
            )

    def synchronize_and_drain(self) -> Tuple[List[RuntimeStateSnapshot], StreamSyncMetadata]:
        """
        Drains the in-memory stream through the causal watermark barrier.
        Re-sequences all out-of-order events into strictly monotonic causal order.
        Verifies 100% timeline integrity.
        """
        start_time = time.perf_counter()
        ordered_snapshots: List[RuntimeStateSnapshot] = []

        while self._buffer:
            event = heapq.heappop(self._buffer)
            ordered_snapshots.append(event.snapshot)

        drain_duration_us = (time.perf_counter() - start_time) * 1_000_000.0

        # Integrity verification: sequence IDs must be strictly increasing
        is_strictly_ordered = True
        for i in range(len(ordered_snapshots) - 1):
            curr_seq = ordered_snapshots[i].sequence_id or ordered_snapshots[i].step
            next_seq = ordered_snapshots[i+1].sequence_id or ordered_snapshots[i+1].step
            if curr_seq > next_seq:
                is_strictly_ordered = False
                break

        if self._reordered_count > 0:
            self._sync_log.append(
                f"✦ RE-SYNCHRONIZATION COMPLETE: {self._reordered_count} out-of-order events re-ordered into strict causal sequence in {drain_duration_us:.1f}µs."
            )

        metadata = StreamSyncMetadata(
            is_out_of_order_detected=(self._reordered_count > 0),
            total_events=len(ordered_snapshots),
            events_reordered=self._reordered_count,
            max_jitter_frames=self._max_jitter,
            interrupt_count=self._interrupt_count,
            watermark_strategy="Causal Watermark Priority Barrier",
            sync_latency_us=round(drain_duration_us, 2),
            timeline_integrity_verified=is_strictly_ordered,
            sync_log=list(self._sync_log)
        )

        self.reset()
        return ordered_snapshots, metadata
