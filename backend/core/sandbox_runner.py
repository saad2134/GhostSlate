import os
import sys
import time
import tempfile
import subprocess
import ast
import shutil
from typing import Tuple, Optional, Set
from backend.core.models import VerificationResult
from backend.core.ports.sandbox import ExecutionSandboxPort
from backend.core.ports.profiler import ResourceProfilerPort
from backend.adapters.sandbox.resource_profiler import SubprocessResourceProfiler

FORBIDDEN_MODULES: Set[str] = {
    "os", "subprocess", "socket", "shutil", "sys", "ctypes",
    "builtins", "posix", "nt", "importlib", "pty", "commands",
    "multiprocessing", "webbrowser", "http", "urllib", "requests"
}

FORBIDDEN_CALLS: Set[str] = {
    "eval", "exec", "__import__", "compile"
}

class SandboxRunner(ExecutionSandboxPort):
    """
    Isolated Subprocess Test Runner: executes pytest in a sandboxed temporary directory.
    Guarantees that no patch is marked verified unless pytest exits with returncode 0.
    Enforces AST Resource Canary Gate against algorithmic complexity regressions and memory leaks.
    Implements ExecutionSandboxPort.
    """

    def __init__(
        self,
        max_post_duration_ms: float = 2500.0,
        max_blowup_ratio: float = 3.5,
        max_memory_growth_mb: float = 64.0,
        profiler: Optional[ResourceProfilerPort] = None
    ):
        self.max_post_duration_ms = max_post_duration_ms
        self.max_blowup_ratio = max_blowup_ratio
        self.max_memory_growth_mb = max_memory_growth_mb
        self.profiler = profiler if profiler is not None else SubprocessResourceProfiler()

    def run_tests(
        self,
        target_code: str,
        test_code: str,
        filename: str = "target.py"
    ) -> Tuple[bool, str, int]:
        """Implements ExecutionSandboxPort for single test execution runs."""
        success, output, code, _ = self._execute_in_sandbox(target_code, test_code, timeout=5.0)
        return success, output, code

    def run_verification(
        self,
        original_code: str,
        patched_code: str,
        test_code: str,
        patch_id: str,
        timeout_seconds: float = 6.0
    ) -> VerificationResult:
        start_time = time.time()

        # Step 1: Run against original code (expecting failure / Red test)
        pre_t0 = time.perf_counter()
        pre_success, pre_output, pre_code, pre_rss = self._execute_in_sandbox(original_code, test_code, timeout_seconds)
        pre_duration_ms = (time.perf_counter() - pre_t0) * 1000.0

        # Step 2: Run against patched code (expecting 100% pass / Green test)
        post_t0 = time.perf_counter()
        post_success, post_output, post_code, post_rss = self._execute_in_sandbox(patched_code, test_code, timeout_seconds)
        post_duration_ms = (time.perf_counter() - post_t0) * 1000.0

        duration_ms = (time.time() - start_time) * 1000.0

        canary_passed = True
        canary_diagnostics = None
        memory_canary_passed = True
        peak_rss = max(pre_rss, post_rss)

        # Strict Verification Gate: Must transition strictly from RED (pre failed) to GREEN (post passed)
        if pre_success:
            # If the test already passed before the patch, the patch did not heal anything
            is_verified = False
            proof = (
                f"SANDBOX VERIFICATION REJECTED [Invalid Test State]\n"
                f"Pre-Patch Exit: {pre_code} (UNEXPECTED PASS - Test already passed prior to patch)\n"
                f"Post-Patch Exit: {post_code}\n"
                f"Verification Invariant: Must strictly demonstrate Red (Fail) -> Green (Pass) transition."
            )
        else:
            is_verified = post_success
            proof = (
                f"SANDBOX VERIFICATION PROOF [Deterministic Subprocess Isolation]\n"
                f"Pre-Patch Exit: {pre_code} (FAILED - Invariant violation confirmed)\n"
                f"Post-Patch Exit: {post_code} ({'PASSED - 100% Green verified' if post_success else 'FAILED'})\n"
                f"Execution Duration: {duration_ms:.1f}ms\n"
                f"Sandbox Isolation: Ephemeral Subprocess (Sanitized Environment & Resource Bounds)"
            )

        # Step 3: AST Resource Canary Gate
        # Prevent algorithmic regressions, infinite loops, and quadratic complexity blowups
        if post_success:
            ratio = post_duration_ms / max(pre_duration_ms, 50.0)
            if post_duration_ms > self.max_post_duration_ms or (post_duration_ms > 200.0 and ratio > self.max_blowup_ratio):
                canary_passed = False
                is_verified = False
                canary_diagnostics = (
                    f"AST Resource Canary Regression detected: post duration {post_duration_ms:.1f}ms "
                    f"vs pre duration {pre_duration_ms:.1f}ms (blowup ratio: {ratio:.1f}x)."
                )
                proof = (
                    f"SANDBOX VERIFICATION REJECTED [AST Resource Canary Regression]\n"
                    f"Pre-Patch Duration: {pre_duration_ms:.1f}ms\n"
                    f"Post-Patch Duration: {post_duration_ms:.1f}ms (Blowup Factor: {ratio:.1f}x)\n"
                    f"Canary Invariant: Candidate patch introduces computational complexity regression.\n"
                    f"Execution Duration: {duration_ms:.1f}ms"
                )

        # Step 4: AST Memory Canary Gate
        # Prevent candidate patches from inducing excessive heap accumulation or memory bloat
        if post_success and self.profiler:
            mem_ok, mem_diag = self.profiler.evaluate_memory_delta(
                pre_rss, post_rss, self.max_memory_growth_mb
            )
            if not mem_ok:
                memory_canary_passed = False
                is_verified = False
                canary_diagnostics = mem_diag
                proof = (
                    f"SANDBOX VERIFICATION REJECTED [AST Memory Canary Regression]\n"
                    f"Pre-Patch RSS: {pre_rss:.1f}MB\n"
                    f"Post-Patch RSS: {post_rss:.1f}MB (Growth: {post_rss - pre_rss:.1f}MB > {self.max_memory_growth_mb:.1f}MB limit)\n"
                    f"Memory Invariant: Candidate patch introduces memory bloat or unbounded state accumulation.\n"
                    f"Execution Duration: {duration_ms:.1f}ms"
                )

        passed_count = 1 if is_verified else 0
        failed_count = 0 if is_verified else 1

        return VerificationResult(
            patch_id=patch_id,
            is_verified=is_verified,
            pre_patch_test_output=pre_output,
            post_patch_test_output=post_output,
            exit_code=post_code,
            duration_ms=round(duration_ms, 2),
            tests_passed=passed_count,
            tests_failed=failed_count,
            deterministic_proof=proof,
            pre_duration_ms=round(pre_duration_ms, 2),
            post_duration_ms=round(post_duration_ms, 2),
            canary_passed=canary_passed,
            canary_diagnostics=canary_diagnostics,
            pre_rss_mb=round(pre_rss, 2),
            post_rss_mb=round(post_rss, 2),
            peak_rss_mb=round(peak_rss, 2),
            memory_canary_passed=memory_canary_passed
        )

    def _validate_ast_security(self, code: str) -> Tuple[bool, Optional[str]]:
        """
        GS-SEC-01: Deep AST-level inspection to prevent arbitrary code execution,
        dynamic imports, and unsafe runtime evaluations.
        """
        try:
            tree = ast.parse(code)
        except SyntaxError:
            # Syntax errors will fail gracefully during compilation/execution
            return True, None

        for node in ast.walk(tree):
            # Check direct imports: import os, subprocess, etc.
            if isinstance(node, ast.Import):
                for alias in node.names:
                    root_pkg = alias.name.split(".")[0]
                    if root_pkg in FORBIDDEN_MODULES:
                        return False, f"SECURITY SANDBOX BARRIER: Prohibited module import '{root_pkg}' detected."

            # Check from imports: from os import system, etc.
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    root_pkg = node.module.split(".")[0]
                    if root_pkg in FORBIDDEN_MODULES:
                        return False, f"SECURITY SANDBOX BARRIER: Prohibited module import 'from {root_pkg}' detected."

            # Check calls: eval(), exec(), __import__()
            elif isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    if node.func.id in FORBIDDEN_CALLS:
                        return False, f"SECURITY SANDBOX BARRIER: Prohibited execution call '{node.func.id}()' detected."

        return True, None

    def _execute_in_sandbox(self, target_code: str, test_code: str, timeout: float) -> Tuple[bool, str, int, float]:
        # Fast string pattern check
        dangerous_patterns = ["os.system(", "subprocess.Popen(", "shutil.rmtree(", "eval(__import__"]
        combined = target_code + "\n" + test_code
        for pattern in dangerous_patterns:
            if pattern in combined:
                return False, f"SECURITY SANDBOX BARRIER: Dangerous pattern '{pattern}' prohibited.", -99, 0.0

        # GS-SEC-01: Rigorous AST security pre-flight check
        target_valid, target_err = self._validate_ast_security(target_code)
        if not target_valid:
            return False, target_err or "Security violation in target code", -99, 0.0

        test_valid, test_err = self._validate_ast_security(test_code)
        if not test_valid:
            return False, test_err or "Security violation in test code", -99, 0.0

        tmpdir = None
        peak_rss = 0.0
        try:
            tmpdir = tempfile.mkdtemp(prefix="ghostslate_sandbox_")
            target_path = os.path.join(tmpdir, "target.py")
            test_path = os.path.join(tmpdir, "test_target.py")

            with open(target_path, "w", encoding="utf-8") as f:
                f.write(target_code)

            with open(test_path, "w", encoding="utf-8") as f:
                f.write(test_code)

            # Sanitized execution environment: prevent leaking parent secrets
            clean_env = {
                "PYTHONPATH": tmpdir,
                "PATH": os.environ.get("PATH", ""),
                "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
                "TEMP": tmpdir,
                "TMP": tmpdir,
                "PYTHONDONTWRITEBYTECODE": "1"
            }

            cmd = [sys.executable, "-m", "pytest", test_path, "-v", "--no-header", "--tb=short"]

            proc = subprocess.Popen(
                cmd,
                cwd=tmpdir,
                env=clean_env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            # Sample peak memory while process runs
            t_start = time.time()
            max_wait = min(timeout, 5.0)
            while proc.poll() is None and (time.time() - t_start) < max_wait:
                if self.profiler:
                    try:
                        stats = self.profiler.profile_process(proc.pid)
                        peak_rss = max(peak_rss, stats.get("rss_mb", 0.0))
                    except Exception:
                        pass
                time.sleep(0.01)

            stdout, stderr = proc.communicate(timeout=1.0)
            output = (stdout + "\n" + stderr).strip()
            success = (proc.returncode == 0)
            return success, output, proc.returncode, peak_rss

        except subprocess.TimeoutExpired:
            if 'proc' in locals() and proc:
                try:
                    proc.kill()
                    proc.wait(timeout=0.5)
                except Exception:
                    pass
            return False, f"TIMEOUT: Sandbox execution exceeded {timeout}s limit.", -1, peak_rss
        except Exception as e:
            return False, f"SANDBOX RUNNER ERROR: {str(e)}", -2, peak_rss
        finally:
            if tmpdir and os.path.exists(tmpdir):
                try:
                    shutil.rmtree(tmpdir, ignore_errors=True)
                except Exception:
                    pass
