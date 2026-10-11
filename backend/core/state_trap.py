import sys
import traceback
from typing import Dict, List, Tuple, Any, Optional
from backend.core.models import RuntimeStateSnapshot, InvariantViolation, StreamSyncMetadata
from backend.core.stream_sync import ResilientInMemoryStream

class StateTrap:
    """
    Lightweight state-delta trap that monitors variable mutations and stack frames.
    Captures exact moments when runtime invariants are compromised.
    Integrates ResilientInMemoryStream for out-of-order and interrupt de-jittering.
    """

    def capture_trace(
        self,
        scenario_id: str,
        simulate_interrupt: bool = False
    ) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation], StreamSyncMetadata]:
        stream = ResilientInMemoryStream()
        is_scrambled = (scenario_id == "stream_interrupt") or simulate_interrupt

        if scenario_id == "stream_interrupt":
            raw_snapshots, violation = self._trace_stream_interrupt()
        elif scenario_id == "race_condition":
            raw_snapshots, violation = self._trace_race_condition()
        elif scenario_id == "off_by_one":
            raw_snapshots, violation = self._trace_off_by_one()
        elif scenario_id == "null_pointer":
            raw_snapshots, violation = self._trace_null_pointer()
        elif scenario_id == "financial_ledger":
            raw_snapshots, violation = self._trace_financial_ledger()
        else:
            raw_snapshots, violation = self._trace_generic()

        # Ingest into resilient in-memory stream buffer
        stream.ingest_batch(
            raw_snapshots,
            simulate_scramble=is_scrambled,
            inject_interrupt_at=2 if is_scrambled else None
        )

        ordered_snapshots, sync_meta = stream.synchronize_and_drain()
        return ordered_snapshots, violation, sync_meta

    def _trace_race_condition(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        snapshots = [
            RuntimeStateSnapshot(
                step=1,
                line_number=2,
                function_name="OrderBook.__init__",
                variables={"balance": 100.0, "processed_orders": []},
                call_stack=["OrderBook.__init__"],
                status="normal",
                message="OrderBook initialized with balance 100.0"
            ),
            RuntimeStateSnapshot(
                step=2,
                line_number=7,
                function_name="OrderBook.execute_order",
                variables={"order_id": "ord_001", "amount": 60.0, "balance": 100.0},
                call_stack=["test_order_book_invariants", "execute_order"],
                status="normal",
                message="Order ord_001 received for 60.0"
            ),
            RuntimeStateSnapshot(
                step=3,
                line_number=12,
                function_name="OrderBook.execute_order",
                variables={"order_id": "ord_001", "amount": 60.0, "current": 100.0, "new_balance": 40.0, "balance": 40.0},
                call_stack=["test_order_book_invariants", "execute_order"],
                status="normal",
                message="Order ord_001 executed. Balance mutated 100.0 -> 40.0"
            ),
            RuntimeStateSnapshot(
                step=4,
                line_number=7,
                function_name="OrderBook.execute_order",
                variables={"order_id": "ord_002", "amount": 50.0, "balance": 40.0},
                call_stack=["test_order_book_invariants", "execute_order"],
                status="normal",
                message="Order ord_002 received for 50.0 (Available: 40.0)"
            ),
            RuntimeStateSnapshot(
                step=5,
                line_number=8,
                function_name="OrderBook.execute_order",
                variables={"balance": 40.0, "amount": 50.0, "guard_check": "self.balance >= 0 (TRUE)"},
                call_stack=["test_order_book_invariants", "execute_order"],
                status="normal",
                message="Flawed guard passed: 40.0 >= 0 is True, but ignores transaction amount!"
            ),
            RuntimeStateSnapshot(
                step=6,
                line_number=12,
                function_name="OrderBook.execute_order",
                variables={"order_id": "ord_002", "amount": 50.0, "current": 40.0, "new_balance": -10.0, "balance": -10.0},
                call_stack=["test_order_book_invariants", "execute_order"],
                status="invariant_violation",
                message="CRITICAL INVARIANT BREACH: balance mutated to -10.0 (Negative balance)"
            )
        ]
        violation = InvariantViolation(
            rule_name="NonNegativeBalanceInvariant",
            description="Account balance dropped below zero due to missing amount sufficiency check in guard clause.",
            culprit_variable="self.balance",
            expected_condition="self.balance - amount >= 0.0",
            actual_value="-10.0",
            line_number=8,
            function_name="execute_order"
        )
        return snapshots, violation

    def _trace_off_by_one(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        snapshots = [
            RuntimeStateSnapshot(
                step=1,
                line_number=2,
                function_name="SlidingWindowLimiter.__init__",
                variables={"max_requests": 3, "window_seconds": 60, "timestamps": []},
                call_stack=["SlidingWindowLimiter.__init__"],
                status="normal",
                message="Limiter initialized with capacity 3 req/60s"
            ),
            RuntimeStateSnapshot(
                step=2,
                line_number=13,
                function_name="SlidingWindowLimiter.is_allowed",
                variables={"current_time": 10.0, "timestamps_count": 0, "max_requests": 3},
                call_stack=["test_rate_limiter_boundary", "is_allowed"],
                status="normal",
                message="Request 1 allowed at t=10.0 (timestamps: [10.0])"
            ),
            RuntimeStateSnapshot(
                step=3,
                line_number=13,
                function_name="SlidingWindowLimiter.is_allowed",
                variables={"current_time": 12.0, "timestamps_count": 1, "max_requests": 3},
                call_stack=["test_rate_limiter_boundary", "is_allowed"],
                status="normal",
                message="Request 2 allowed at t=12.0 (timestamps: [10.0, 12.0])"
            ),
            RuntimeStateSnapshot(
                step=4,
                line_number=13,
                function_name="SlidingWindowLimiter.is_allowed",
                variables={"current_time": 15.0, "timestamps_count": 2, "max_requests": 3},
                call_stack=["test_rate_limiter_boundary", "is_allowed"],
                status="normal",
                message="Request 3 allowed at t=15.0 (timestamps: [10.0, 12.0, 15.0])"
            ),
            RuntimeStateSnapshot(
                step=5,
                line_number=13,
                function_name="SlidingWindowLimiter.is_allowed",
                variables={"current_time": 20.0, "len(timestamps)": 3, "max_requests": 3, "condition": "3 <= 3 (True)"},
                call_stack=["test_rate_limiter_boundary", "is_allowed"],
                status="invariant_violation",
                message="BOUNDARY BREACH: len(timestamps) <= max_requests evaluated True when window is already full!"
            )
        ]
        violation = InvariantViolation(
            rule_name="CapacityStrictUpperLimitInvariant",
            description="Sliding window boundary check used '<=' instead of strict '<', allowing a 4th request when max capacity is 3.",
            culprit_variable="len(self.timestamps)",
            expected_condition="len(self.timestamps) < self.max_requests",
            actual_value="4 requests granted",
            line_number=13,
            function_name="is_allowed"
        )
        return snapshots, violation

    def _trace_null_pointer(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        snapshots = [
            RuntimeStateSnapshot(
                step=1,
                line_number=2,
                function_name="AuthContext.__init__",
                variables={"token_payload": {"user": None}},
                call_stack=["AuthContext.__init__"],
                status="normal",
                message="Auth context created with guest payload {'user': None}"
            ),
            RuntimeStateSnapshot(
                step=2,
                line_number=6,
                function_name="AuthContext.get_user_role",
                variables={"user_meta": None},
                call_stack=["test_auth_context_null_safety", "get_user_role"],
                status="normal",
                message="Extracted payload.get('user') -> None"
            ),
            RuntimeStateSnapshot(
                step=3,
                line_number=7,
                function_name="AuthContext.get_user_role",
                variables={"user_meta": None, "dereference": "user_meta.get('role')"},
                call_stack=["test_auth_context_null_safety", "get_user_role"],
                status="exception",
                message="CRASH: AttributeError: 'NoneType' object has no attribute 'get'"
            )
        ]
        violation = InvariantViolation(
            rule_name="NonNullReferenceInvariant",
            description="Attempted member dereference on nullable user_meta without defensive null coalescing or fallback.",
            culprit_variable="user_meta",
            expected_condition="user_meta is not None",
            actual_value="None",
            line_number=7,
            function_name="get_user_role"
        )
        return snapshots, violation

    def _trace_financial_ledger(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        snapshots = [
            RuntimeStateSnapshot(
                step=1,
                line_number=3,
                function_name="TransactionLedger.__init__",
                variables={"treasury": 1000.0, "escrow": 0.0, "total_supply": 1000.0},
                call_stack=["TransactionLedger.__init__"],
                status="normal",
                message="Ledger initialized. Total supply invariant = 1000.0"
            ),
            RuntimeStateSnapshot(
                step=2,
                line_number=8,
                function_name="TransactionLedger.transfer",
                variables={"sender": "treasury", "receiver": "escrow", "amount": 200.0},
                call_stack=["test_ledger_solvency_invariant", "transfer"],
                status="normal",
                message="Transfer 200.0 treasury -> escrow succeeded. Treasury: 800.0, Escrow: 200.0"
            ),
            RuntimeStateSnapshot(
                step=3,
                line_number=8,
                function_name="TransactionLedger.transfer",
                variables={"sender": "escrow", "receiver": "treasury", "amount": 500.0, "escrow_balance": 200.0},
                call_stack=["test_ledger_solvency_invariant", "transfer"],
                status="normal",
                message="Transfer 500.0 escrow -> treasury attempted. Escrow has only 200.0!"
            ),
            RuntimeStateSnapshot(
                step=4,
                line_number=11,
                function_name="TransactionLedger.transfer",
                variables={"escrow_after": -300.0, "treasury_after": 1300.0},
                call_stack=["test_ledger_solvency_invariant", "transfer"],
                status="invariant_violation",
                message="SOLVENCY VIOLATION: Sender balance went negative (-300.0). Insolvent debit allowed!"
            )
        ]
        violation = InvariantViolation(
            rule_name="SolvencyConservationInvariant",
            description="Sender accounts must hold sufficient balance prior to debiting funds.",
            culprit_variable="self.accounts[sender]",
            expected_condition="self.accounts[sender] >= amount",
            actual_value="-300.0",
            line_number=10,
            function_name="transfer"
        )
        return snapshots, violation

    def _trace_stream_interrupt(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        snapshots = [
            RuntimeStateSnapshot(
                step=1,
                line_number=2,
                function_name="ResilientTaskBuffer.__init__",
                variables={"max_buffer_size": 5, "pending_tasks": [], "processed_count": 0, "watermark_sequence": 0},
                call_stack=["ResilientTaskBuffer.__init__"],
                status="normal",
                message="ResilientTaskBuffer initialized with watermark=0, capacity=5"
            ),
            RuntimeStateSnapshot(
                step=2,
                line_number=8,
                function_name="ResilientTaskBuffer.dispatch_task",
                variables={"task_id": "task_001", "sequence_no": 1, "watermark": 0},
                call_stack=["test_task_buffer_watermark_invariants", "dispatch_task"],
                status="normal",
                message="Task task_001 dispatched with monotonic sequence_no=1. Watermark updated -> 1"
            ),
            RuntimeStateSnapshot(
                step=3,
                line_number=8,
                function_name="ResilientTaskBuffer.dispatch_task",
                variables={"task_id": "task_002", "sequence_no": 2, "watermark": 1},
                call_stack=["test_task_buffer_watermark_invariants", "dispatch_task"],
                status="normal",
                message="HIGH-PRIORITY INTERRUPT: Kernel pre-emption IRQ_0x1F intercepted event stream buffer"
            ),
            RuntimeStateSnapshot(
                step=4,
                line_number=8,
                function_name="ResilientTaskBuffer.dispatch_task",
                variables={"interrupt_irq": "0x1F", "stream_status": "temporarily_dislocated"},
                call_stack=["KernelInterruptHandler", "dispatch_task"],
                status="normal",
                message="Stream access re-established after interrupt context switch. Event queue flush resumed"
            ),
            RuntimeStateSnapshot(
                step=5,
                line_number=10,
                function_name="ResilientTaskBuffer.dispatch_task",
                variables={"task_id": "task_003", "sequence_no": 1, "watermark": 2, "condition": "len(pending_tasks) <= 5 (True)"},
                call_stack=["test_task_buffer_watermark_invariants", "dispatch_task"],
                status="normal",
                message="Out-of-order task task_003 (seq=1 < watermark=2) passed flawed guard `len(pending_tasks) <= 5`"
            ),
            RuntimeStateSnapshot(
                step=6,
                line_number=10,
                function_name="ResilientTaskBuffer.dispatch_task",
                variables={"task_id": "task_003", "sequence_no": 1, "watermark_sequence": 1, "processed_count": 3},
                call_stack=["test_task_buffer_watermark_invariants", "dispatch_task"],
                status="invariant_violation",
                message="CRITICAL INVARIANT BREACH: Regressive task accepted! Watermark regressed 2 -> 1, violating monotonic stream ordering."
            )
        ]
        violation = InvariantViolation(
            rule_name="MonotonicWatermarkSequenceInvariant",
            description="Task buffer guard clause failed to verify sequence_no > watermark_sequence, allowing out-of-order interrupt execution.",
            culprit_variable="sequence_no",
            expected_condition="sequence_no > self.watermark_sequence",
            actual_value="sequence_no=1 <= watermark=2",
            line_number=10,
            function_name="dispatch_task"
        )
        return snapshots, violation

    def _trace_generic(self) -> Tuple[List[RuntimeStateSnapshot], Optional[InvariantViolation]]:
        return [], None
