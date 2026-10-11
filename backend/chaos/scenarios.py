from typing import Dict, List
from backend.core.models import ChaosScenario

SCENARIOS: Dict[str, ChaosScenario] = {
    "race_condition": ChaosScenario(
        id="race_condition",
        title="Concurrent Order Book Race Condition",
        category="Concurrency & State Corruption",
        language="python",
        description="A high-frequency order buffer mutates account balances without atomic locking or invariant validation, causing double-spending and negative balances.",
        bug_type="Race Condition & Negative State Violation",
        source_code="""class OrderBook:
    def __init__(self, initial_balance: float):
        self.balance = initial_balance
        self.processed_orders = []

    def execute_order(self, order_id: str, amount: float) -> bool:
        # BUG: Check occurs without atomic invariant guard; balance can dip negative
        if self.balance >= 0:
            # Simulated concurrency race window
            current = self.balance
            new_balance = current - amount
            self.balance = new_balance
            self.processed_orders.append(order_id)
            return True
        return False
""",
        test_code="""import pytest
from target import OrderBook

def test_order_book_invariants():
    book = OrderBook(initial_balance=100.0)
    
    # First order succeeds
    assert book.execute_order("ord_001", 60.0) is True
    assert book.balance == 40.0
    
    # Second order exceeds remaining funds and must be rejected
    assert book.execute_order("ord_002", 50.0) is False, "Overdraft order should be rejected!"
    assert book.balance == 40.0, "Balance must never drop below 0!"
""",
        expected_invariant="balance >= 0.0 and (balance - amount) >= 0.0"
    ),

    "off_by_one": ChaosScenario(
        id="off_by_one",
        title="Sliding Window Rate Limiter Off-By-One",
        category="Boundary & Index Overflow",
        language="python",
        description="A token sliding window uses an inclusive `<= max_requests` boundary on an unpruned slice, allowing one excess unauthorized request per window cycle.",
        bug_type="Off-By-One Boundary Violation",
        source_code="""class SlidingWindowLimiter:
    def __init__(self, max_requests: int, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.timestamps = []

    def is_allowed(self, current_time: float) -> bool:
        # Prune older timestamps
        cutoff = current_time - self.window_seconds
        self.timestamps = [t for t in self.timestamps if t > cutoff]
        
        # BUG: Off-by-one error using <= instead of <
        if len(self.timestamps) <= self.max_requests:
            self.timestamps.append(current_time)
            return True
        return False
""",
        test_code="""import pytest
from target import SlidingWindowLimiter

def test_rate_limiter_boundary():
    limiter = SlidingWindowLimiter(max_requests=3, window_seconds=60)
    
    # First 3 requests must be allowed
    assert limiter.is_allowed(10.0) is True
    assert limiter.is_allowed(12.0) is True
    assert limiter.is_allowed(15.0) is True
    
    # 4th request in the same window must be strictly rejected
    assert limiter.is_allowed(20.0) is False, "4th request must be rejected when limit is 3!"
    assert len(limiter.timestamps) == 3
""",
        expected_invariant="len(timestamps) < max_requests"
    ),

    "null_pointer": ChaosScenario(
        id="null_pointer",
        title="JWT Auth Context Null Pointer / NoneType Crash",
        category="Type Safety & Invariant Null Dereference",
        language="python",
        description="Authentication interceptor assumes user profile metadata is always non-null, crashing with AttributeError / TypeError when guest tokens omit the profile object.",
        bug_type="Unhandled Null/None Dereference",
        source_code="""class AuthContext:
    def __init__(self, token_payload: dict):
        self.payload = token_payload

    def get_user_role(self) -> str:
        # BUG: profile dictionary can be None or missing, causing AttributeError
        user_meta = self.payload.get("user")
        role = user_meta.get("role")
        return role.upper()
""",
        test_code="""import pytest
from target import AuthContext

def test_auth_context_null_safety():
    # Valid user
    auth1 = AuthContext({"user": {"role": "admin"}})
    assert auth1.get_user_role() == "ADMIN"
    
    # Guest user with empty or None user payload
    auth2 = AuthContext({"user": None})
    assert auth2.get_user_role() == "ANONYMOUS", "None user payload should safely fallback to ANONYMOUS"
    
    # Missing user key
    auth3 = AuthContext({})
    assert auth3.get_user_role() == "ANONYMOUS", "Missing user payload should safely fallback to ANONYMOUS"
""",
        expected_invariant="user_meta is not None and role is not None"
    ),

    "financial_ledger": ChaosScenario(
        id="financial_ledger",
        title="Double-Entry Financial Ledger Imbalance",
        category="State Invariant Corruption",
        language="python",
        description="A ledger transaction pipeline updates debit and credit balances non-atomically and fails to enforce zero-sum invariant check, corrupting total supply.",
        bug_type="State Invariant Violation (Debit != Credit)",
        source_code="""class TransactionLedger:
    def __init__(self):
        self.accounts = {"treasury": 1000.0, "escrow": 0.0}
        self.audit_log = []

    def transfer(self, sender: str, receiver: str, amount: float) -> bool:
        if amount <= 0:
            return False
        # BUG: Deducts from sender without verifying sender balance, causing phantom currency
        self.accounts[sender] -= amount
        self.accounts[receiver] += amount
        self.audit_log.append((sender, receiver, amount))
        return True
""",
        test_code="""import pytest
from target import TransactionLedger

def test_ledger_solvency_invariant():
    ledger = TransactionLedger()
    
    # Valid transfer
    assert ledger.transfer("treasury", "escrow", 200.0) is True
    assert ledger.accounts["treasury"] == 800.0
    assert ledger.accounts["escrow"] == 200.0
    
    # Insolvent transfer should fail cleanly without corrupting state
    assert ledger.transfer("escrow", "treasury", 500.0) is False, "Cannot transfer more than escrow balance!"
    assert ledger.accounts["escrow"] == 200.0
    assert ledger.accounts["treasury"] == 800.0
""",
        expected_invariant="accounts[sender] >= amount"
    ),

    "stream_interrupt": ChaosScenario(
        id="stream_interrupt",
        title="High-Priority Interrupt ✦ Out-of-Order Stream Sync",
        category="Stream Asynchrony & Interrupt Recovery",
        language="python",
        description="A high-priority interrupt dislocates the runtime event stream during asynchronous queue processing, delivering out-of-order causal frames. The resilient stream synchronizes causal watermarks to enable surgical AST repair.",
        bug_type="Out-of-Order Stream Asynchrony & Regressive Watermark",
        source_code="""class ResilientTaskBuffer:
    def __init__(self, max_buffer_size: int = 5):
        self.max_buffer_size = max_buffer_size
        self.pending_tasks = []
        self.processed_count = 0
        self.watermark_sequence = 0

    def dispatch_task(self, task_id: str, sequence_no: int) -> bool:
        # BUG: Accepts tasks out of sequence without enforcing causal watermark invariant
        if len(self.pending_tasks) <= self.max_buffer_size:
            self.pending_tasks.append(task_id)
            self.watermark_sequence = sequence_no
            self.processed_count += 1
            return True
        return False
""",
        test_code="""import pytest
from target import ResilientTaskBuffer

def test_task_buffer_watermark_invariants():
    buffer = ResilientTaskBuffer(max_buffer_size=5)
    
    # In-order task dispatch succeeds
    assert buffer.dispatch_task("task_001", sequence_no=1) is True
    assert buffer.watermark_sequence == 1
    assert buffer.processed_count == 1
    
    # Sequential task dispatch advances watermark
    assert buffer.dispatch_task("task_002", sequence_no=2) is True
    assert buffer.watermark_sequence == 2
    
    # Regressive sequence caused by high-priority interrupt must be strictly rejected
    assert buffer.dispatch_task("task_003", sequence_no=1) is False, "Regressive sequence_no must not be dispatched out-of-order!"
    assert buffer.watermark_sequence == 2
    assert buffer.processed_count == 2
""",
        expected_invariant="sequence_no > watermark_sequence and len(pending_tasks) < max_buffer_size"
    )
}

def get_scenario(scenario_id: str) -> ChaosScenario:
    return SCENARIOS.get(scenario_id, SCENARIOS["race_condition"])

def list_scenarios() -> List[ChaosScenario]:
    return list(SCENARIOS.values())
