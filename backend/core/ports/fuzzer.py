"""Chaos Fuzzer Port
Abstract port contract defining AST-level mutation fuzzing campaigns.
Generates adversarial syntactic defects to stress-test AST repair robustness.
Author: Saaduddin Mohammed (github.com/saad2134)
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class FuzzingCandidate:
    candidate_id: str
    mutation_type: str
    target_line: int
    original_snippet: str
    mutated_snippet: str
    mutated_code: str
    caught: Optional[bool] = None
    diagnostics: Optional[str] = None

@dataclass
class FuzzingCampaignResult:
    campaign_id: str
    total_mutants: int
    caught_mutants: int
    survived_mutants: int
    mutation_score: float  # caught / total (0.0 to 1.0)
    candidates: List[FuzzingCandidate] = field(default_factory=list)
    duration_ms: float = 0.0

class ChaosFuzzerPort(ABC):
    """
    Port contract for AST mutation fuzzing.
    Synthesizes deliberate bugs to prove test suite coverage and repair resilience.
    """

    @abstractmethod
    def generate_mutants(self, source_code: str, max_mutants: int = 10) -> List[FuzzingCandidate]:
        """Generates a list of AST mutation candidates from source code."""
        pass

    @abstractmethod
    def evaluate_campaign(
        self,
        source_code: str,
        test_code: str,
        sandbox_runner: Any,
        max_mutants: int = 5
    ) -> FuzzingCampaignResult:
        """Executes a full mutation campaign against the deterministic sandbox."""
        pass
