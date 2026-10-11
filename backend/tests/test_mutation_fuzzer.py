"""Unit Tests for AST Mutation Fuzzer
Validates syntactic mutation operators, mutant generation, and campaign execution.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
import pytest
from backend.adapters.chaos.mutation_fuzzer import ASTMutationFuzzerAdapter
from backend.core.ports.fuzzer import FuzzingCandidate, FuzzingCampaignResult

SAMPLE_CODE = """def calculate_discount(price, customer_age):
    if price < 0:
        return 0
    if customer_age >= 65:
        discount = price * 0.20
        return price - discount
    return price
"""

SAMPLE_TEST = """def test_discount():
    from target import calculate_discount
    assert calculate_discount(100, 70) == 80
    assert calculate_discount(100, 20) == 100
"""

class MockSandbox:
    def __init__(self, should_fail_on_mutant=True):
        self.should_fail_on_mutant = should_fail_on_mutant

    def execute_test(self, code: str, test_code: str):
        # Simulate catching mutants
        if self.should_fail_on_mutant:
            return False, "AssertionError: Expected 80 got 120", 1
        return True, "1 passed in 0.02s", 0

def test_fuzzer_generates_mutants():
    fuzzer = ASTMutationFuzzerAdapter()
    candidates = fuzzer.generate_mutants(SAMPLE_CODE, max_mutants=10)

    assert len(candidates) > 0
    assert len(candidates) <= 10

    # Ensure various mutation types were captured
    types = {c.mutation_type for c in candidates}
    assert any(t in types for t in ["INVERT_COMPARISON", "SWAP_ARITHMETIC_OPERATOR", "STRIP_DEFENSIVE_GUARD", "BOUNDARY_OFF_BY_ONE"])

    for c in candidates:
        assert c.target_line > 0
        assert c.candidate_id.startswith("mutant_")
        assert len(c.mutated_code) > 0

def test_fuzzer_syntax_error_resilience():
    fuzzer = ASTMutationFuzzerAdapter()
    # Invalid syntax should not crash the generator
    candidates = fuzzer.generate_mutants("def invalid_syntax(::: return", max_mutants=5)
    assert candidates == []

def test_fuzzer_campaign_evaluation_caught():
    fuzzer = ASTMutationFuzzerAdapter()
    mock_sandbox = MockSandbox(should_fail_on_mutant=True)
    result = fuzzer.evaluate_campaign(SAMPLE_CODE, SAMPLE_TEST, mock_sandbox, max_mutants=4)

    assert isinstance(result, FuzzingCampaignResult)
    assert result.total_mutants > 0
    assert result.caught_mutants == result.total_mutants
    assert result.survived_mutants == 0
    assert result.mutation_score == 1.0
    assert result.duration_ms >= 0.0

def test_fuzzer_campaign_evaluation_survived():
    fuzzer = ASTMutationFuzzerAdapter()
    mock_sandbox = MockSandbox(should_fail_on_mutant=False)
    result = fuzzer.evaluate_campaign(SAMPLE_CODE, SAMPLE_TEST, mock_sandbox, max_mutants=4)

    assert result.total_mutants > 0
    assert result.caught_mutants == 0
    assert result.survived_mutants == result.total_mutants
    assert result.mutation_score == 0.0
