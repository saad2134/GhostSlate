import pytest
from backend.core.state_trap import StateTrap

def test_dynamic_trace_synthesizer_discovers_class_and_methods():
    trap = StateTrap()
    custom_code = """
class TokenBucketLimiter:
    def __init__(self, rate: int = 10):
        self.rate = rate
        self.tokens = rate

    def consume(self, amount: int = 1) -> bool:
        if self.tokens >= amount:
            self.tokens -= amount
            return True
        return False
"""
    snapshots, violation, sync_meta = trap.capture_trace(scenario_id="custom", custom_code=custom_code)
    assert len(snapshots) >= 4
    assert violation is not None
    assert "TokenBucketLimiter" in snapshots[0].function_name
    assert "consume" in violation.function_name
    assert violation.line_number > 0
    assert sync_meta.timeline_integrity_verified is True
