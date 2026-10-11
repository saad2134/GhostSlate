import pytest
from backend.adapters.sandbox.resource_profiler import SubprocessResourceProfiler
from backend.core.sandbox_runner import SandboxRunner

def test_resource_profiler_profile_current_process():
    import os
    profiler = SubprocessResourceProfiler()
    stats = profiler.profile_process(os.getpid())
    assert "rss_mb" in stats
    assert "cpu_time_s" in stats
    assert stats["rss_mb"] >= 0.0

def test_resource_profiler_evaluates_normal_delta():
    profiler = SubprocessResourceProfiler(default_max_growth_mb=64.0)
    passed, reason = profiler.evaluate_memory_delta(pre_rss_mb=50.0, post_rss_mb=65.0)
    assert passed is True
    assert reason is None

def test_resource_profiler_catches_memory_blowup():
    profiler = SubprocessResourceProfiler(default_max_growth_mb=64.0)
    passed, reason = profiler.evaluate_memory_delta(pre_rss_mb=50.0, post_rss_mb=180.0)
    assert passed is False
    assert "AST Memory Canary Regression" in reason
    assert "130.0MB" in reason

def test_sandbox_runner_memory_canary_rejection():
    # Setup mock profiler simulating large memory growth
    class MockLeakingProfiler(SubprocessResourceProfiler):
        def evaluate_memory_delta(self, pre_rss_mb, post_rss_mb, max_growth_mb=64.0):
            return False, "AST Memory Canary Regression: Simulated heap leak"

    runner = SandboxRunner(profiler=MockLeakingProfiler())
    
    original = "def f(): return False\n"
    patched = "def f(): return True\n"
    test = "from target import f\ndef test_f(): assert f() is True\n"

    result = runner.run_verification(
        original_code=original,
        patched_code=patched,
        test_code=test,
        patch_id="patch_leak_test"
    )

    assert result.is_verified is False
    assert result.memory_canary_passed is False
    assert "AST Memory Canary Regression" in result.deterministic_proof
