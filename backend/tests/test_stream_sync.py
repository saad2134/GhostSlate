import pytest
from backend.core.models import RuntimeStateSnapshot
from backend.core.stream_sync import ResilientInMemoryStream, StreamEvent

def create_mock_snapshot(step: int, line_number: int = 10, function_name: str = "worker") -> RuntimeStateSnapshot:
    return RuntimeStateSnapshot(
        step=step,
        line_number=line_number,
        function_name=function_name,
        variables={"step_counter": step, "state": f"state_{step}"},
        call_stack=[function_name],
        status="normal" if step < 6 else "invariant_violation",
        message=f"Trace step {step}"
    )

def test_stream_in_order_ingest():
    stream = ResilientInMemoryStream()
    snapshots = [create_mock_snapshot(i) for i in range(1, 6)]
    
    stream.ingest_batch(snapshots, simulate_scramble=False)
    ordered, metadata = stream.synchronize_and_drain()

    assert len(ordered) == 5
    assert [s.sequence_id for s in ordered] == [1, 2, 3, 4, 5]
    assert metadata.is_out_of_order_detected is False
    assert metadata.events_reordered == 0
    assert metadata.timeline_integrity_verified is True

def test_stream_out_of_order_resequencing():
    stream = ResilientInMemoryStream()
    snapshots = [create_mock_snapshot(i) for i in range(1, 7)]

    # Simulate severe interrupt scramble: delivered as [4, 1, 5, 2, 6, 3]
    scramble_pattern = [3, 0, 4, 1, 5, 2]
    stream.ingest_batch(
        snapshots,
        simulate_scramble=True,
        scramble_pattern=scramble_pattern,
        inject_interrupt_at=3
    )

    ordered, metadata = stream.synchronize_and_drain()

    # Re-sequenced into strict causal order [1, 2, 3, 4, 5, 6]
    assert len(ordered) == 6
    assert [s.sequence_id for s in ordered] == [1, 2, 3, 4, 5, 6]
    assert metadata.is_out_of_order_detected is True
    assert metadata.events_reordered > 0
    assert metadata.max_jitter_frames >= 2
    assert metadata.interrupt_count == 1
    assert metadata.timeline_integrity_verified is True
    assert any("OUT-OF-ORDER INGEST DETECTED" in msg for msg in metadata.sync_log)

def test_stream_high_priority_interrupt_interception():
    stream = ResilientInMemoryStream()
    s1 = create_mock_snapshot(1)
    s2 = create_mock_snapshot(2)
    s3 = create_mock_snapshot(3)

    # Ingest s2, then s1 with interrupt, then s3
    stream.ingest(s2, sequence_id=2, logical_clock=2)
    stream.ingest(s1, sequence_id=1, logical_clock=1, is_interrupt=True, interrupt_id="IRQ_CRITICAL_TIMER")
    stream.ingest(s3, sequence_id=3, logical_clock=3)

    ordered, metadata = stream.synchronize_and_drain()

    assert [s.sequence_id for s in ordered] == [1, 2, 3]
    assert ordered[0].interrupt_context == "IRQ_CRITICAL_TIMER"
    assert metadata.interrupt_count == 1
    assert metadata.timeline_integrity_verified is True

def test_stream_latency_and_watermark_metadata():
    stream = ResilientInMemoryStream()
    snapshots = [create_mock_snapshot(i) for i in range(1, 11)]
    stream.ingest_batch(snapshots, simulate_scramble=True)
    ordered, metadata = stream.synchronize_and_drain()

    assert metadata.watermark_strategy == "Causal Watermark Priority Barrier"
    assert metadata.sync_latency_us >= 0.0
    assert metadata.total_events == 10
    assert metadata.timeline_integrity_verified is True
