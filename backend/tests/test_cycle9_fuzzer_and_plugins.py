"""Unit Tests for Cycle 9 Hardening: Fuzzer, Language Plugins, and Audit Ledger
Validates contract alignment, endpoint resilience, and null-byte safety.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app
from backend.adapters.chaos.mutation_fuzzer import ASTMutationFuzzerAdapter
from backend.adapters.plugins.language_registry import DynamicLanguageRegistryAdapter

client = TestClient(app)

class MockSandboxWithRunTests:
    """Mock sandbox runner matching the SubprocessSandboxRunnerPort interface."""
    def __init__(self, should_fail_on_mutant=True):
        self.should_fail_on_mutant = should_fail_on_mutant

    def run_tests(self, code: str, test_code: str):
        if self.should_fail_on_mutant:
            return False, "AssertionError: Expected 80 got 120", 1
        return True, "1 passed in 0.02s", 0

def test_ast_mutation_fuzzer_executes_via_run_tests():
    """Validates that ASTMutationFuzzerAdapter calls run_tests without AttributeError."""
    fuzzer = ASTMutationFuzzerAdapter()
    sample_code = "def add(a, b):\n    return a + b\n"
    sample_test = "def test_add():\n    assert add(1, 2) == 3\n"
    sandbox = MockSandboxWithRunTests(should_fail_on_mutant=True)

    result = fuzzer.evaluate_campaign(sample_code, sample_test, sandbox, max_mutants=3)
    assert result.total_mutants > 0
    assert result.caught_mutants == result.total_mutants
    assert result.mutation_score == 1.0

def test_chaos_fuzz_endpoint_default_and_scenario():
    """Validates POST /api/chaos/fuzz with default body and specific scenario."""
    # Test default request (resolves to 'off_by_one' scenario)
    res_default = client.post("/api/chaos/fuzz", json={})
    assert res_default.status_code == 200
    data_def = res_default.json()
    assert "campaign_id" in data_def
    assert "total_mutants" in data_def
    assert "mutation_score" in data_def
    assert "candidates" in data_def
    assert isinstance(data_def["candidates"], list)

    # Test explicit scenario request
    res_scen = client.post("/api/chaos/fuzz", json={"scenario_id": "off_by_one", "max_mutants": 3})
    assert res_scen.status_code == 200
    data_scen = res_scen.json()
    assert data_scen["total_mutants"] <= 3

def test_chaos_fuzz_endpoint_custom_code():
    """Validates POST /api/chaos/fuzz with custom user-provided source and test code."""
    payload = {
        "custom_code": "def clamp(val, low, high):\n    if val < low:\n        return low\n    if val > high:\n        return high\n    return val\n",
        "custom_test": "def test_clamp():\n    assert clamp(5, 0, 10) == 5\n    assert clamp(-1, 0, 10) == 0\n    assert clamp(15, 0, 10) == 10\n",
        "max_mutants": 2
    }
    res = client.post("/api/chaos/fuzz", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_mutants"] > 0
    assert "mutation_score" in data

def test_language_registry_null_byte_safety():
    """Validates that DynamicLanguageRegistryAdapter.scope_ast_node safely handles null bytes."""
    registry = DynamicLanguageRegistryAdapter()
    null_byte_code = "def malicious_function():\n    \x00x = 1\n    return x\n"

    # Must not raise unhandled exception; must return valid fallback scope
    scope = registry.scope_ast_node(source_code=null_byte_code, language_id="python", target_line=2)
    assert scope.start_line >= 1
    assert scope.end_line >= scope.start_line

def test_audit_ledger_endpoint_integrity():
    """Validates GET /api/ledger exposes unbroken cryptographic chain integrity."""
    res = client.get("/api/ledger")
    assert res.status_code == 200
    data = res.json()
    assert data["chain_valid"] is True
    assert "total_blocks" in data
    assert "verified_blocks" in data
    assert "entries" in data
    assert isinstance(data["entries"], list)
