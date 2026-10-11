import pytest
from backend.core.sandbox_runner import SandboxRunner

TARGET_CODE_BASE = """
def compute_total(values):
    return sum(values)
"""

TEST_CODE = """
from target import compute_total

def test_compute_total():
    assert compute_total([1, 2, 3]) == 6
"""

def test_canary_passes_normal_fast_patch():
    runner = SandboxRunner(max_post_duration_ms=2500.0, max_blowup_ratio=3.5)
    
    # Pre-code has a deliberate bug
    broken_code = """
def compute_total(values):
    return sum(values) + 999
"""
    # Clean patched code
    patched_code = """
def compute_total(values):
    return sum(values)
"""
    result = runner.run_verification(
        original_code=broken_code,
        patched_code=patched_code,
        test_code=TEST_CODE,
        patch_id="patch_canary_fast"
    )
    assert result.is_verified is True
    assert result.canary_passed is True
    assert result.exit_code == 0
    assert result.pre_duration_ms > 0.0
    assert result.post_duration_ms > 0.0

def test_canary_catches_synthetic_computation_explosion():
    # Set a sensitive canary threshold: max 300ms post duration
    runner = SandboxRunner(max_post_duration_ms=300.0, max_blowup_ratio=2.0)
    
    broken_code = """
def compute_total(values):
    return sum(values) + 999
"""
    # Heavy loop injected into patch
    slow_patched_code = """
def compute_total(values):
    _ = sum(i for i in range(12_000_000))
    return sum(values)
"""
    result = runner.run_verification(
        original_code=broken_code,
        patched_code=slow_patched_code,
        test_code=TEST_CODE,
        patch_id="patch_canary_slow"
    )
    # The patch is logically correct according to pytest assertions, but the canary must reject it!
    assert result.is_verified is False
    assert result.canary_passed is False
    assert "AST Resource Canary Regression" in result.deterministic_proof
