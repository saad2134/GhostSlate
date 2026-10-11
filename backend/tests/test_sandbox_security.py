import pytest
from backend.core.sandbox_runner import SandboxRunner

def test_ast_security_blocks_os_import():
    runner = SandboxRunner()
    target_code = """
import os

def vulnerable():
    os.system("echo compromised")
    return True
"""
    test_code = """
import pytest
from target import vulnerable

def test_vuln():
    assert vulnerable() is True
"""
    passed, output, code = runner.run_tests(target_code, test_code)
    assert passed is False
    assert code == -99
    assert "SECURITY SANDBOX BARRIER" in output
    assert "os" in output

def test_ast_security_blocks_subprocess_from_import():
    runner = SandboxRunner()
    target_code = """
from subprocess import check_output

def run_cmd():
    return check_output(["whoami"])
"""
    test_code = """
import pytest
from target import run_cmd

def test_cmd():
    assert run_cmd() is not None
"""
    passed, output, code = runner.run_tests(target_code, test_code)
    assert passed is False
    assert code == -99
    assert "SECURITY SANDBOX BARRIER" in output

def test_ast_security_blocks_eval_and_exec():
    runner = SandboxRunner()
    target_code = """
def dynamic_exec():
    eval("__import__('os').system('dir')")
    return 42
"""
    test_code = """
import pytest
from target import dynamic_exec

def test_exec():
    assert dynamic_exec() == 42
"""
    passed, output, code = runner.run_tests(target_code, test_code)
    assert passed is False
    assert code == -99
    assert "SECURITY SANDBOX BARRIER" in output

def test_ast_security_permits_safe_code():
    runner = SandboxRunner()
    target_code = """
class SafeMath:
    def add(self, a: int, b: int) -> int:
        return a + b
"""
    test_code = """
import pytest
from target import SafeMath

def test_safe_math():
    calc = SafeMath()
    assert calc.add(2, 3) == 5
"""
    passed, output, code = runner.run_tests(target_code, test_code)
    assert passed is True
    assert code == 0
