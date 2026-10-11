import pytest
from typing import Tuple, List, Optional
from backend.core.ports.sandbox import ExecutionSandboxPort
from backend.core.ports.parser import ASTParserPort
from backend.core.ports.provider import ModelProviderPort
from backend.core.ports.repository import SessionRepositoryPort
from backend.core.models import (
    ASTNodeInfo, PatchCandidate, AgentDebateTurn,
    InvariantViolation, SelfHealingSession, VerificationResult
)
from backend.core.agent_loop import AgentLoopCoordinator
from backend.adapters.repositories.in_memory_session_repo import InMemorySessionRepository

class MockSandbox(ExecutionSandboxPort):
    def run_tests(self, target_code: str, test_code: str, filename: str = "target.py") -> Tuple[bool, str, int]:
        return True, "Mock sandbox output", 0

    def run_verification(self, original_code: str, patched_code: str, test_code: str, patch_id: str, timeout_seconds: float = 6.0) -> VerificationResult:
        return VerificationResult(
            patch_id=patch_id,
            is_verified=True,
            pre_patch_test_output="FAILED (Red)",
            post_patch_test_output="PASSED (Green)",
            exit_code=0,
            duration_ms=45.0,
            tests_passed=1,
            tests_failed=0,
            deterministic_proof="Mock verification proof"
        )

def test_session_repository_lru_and_retrieval():
    repo = InMemorySessionRepository(capacity=3)
    
    # Create fake sessions
    s1 = SelfHealingSession(
        session_id="s1", scenario_id="race_condition", title="Test 1", language="python",
        original_code="", test_suite="", invariant_violation=None, snapshots=[],
        ast_nodes=[], isolated_node=None, debate_turns=[], patch=None, verification=None, stage="healed"
    )
    s2 = SelfHealingSession(
        session_id="s2", scenario_id="off_by_one", title="Test 2", language="python",
        original_code="", test_suite="", invariant_violation=None, snapshots=[],
        ast_nodes=[], isolated_node=None, debate_turns=[], patch=None, verification=None, stage="healed"
    )
    repo.save(s1)
    repo.save(s2)

    assert repo.get_by_id("s1") is not None
    assert repo.get_latest_by_scenario("race_condition").session_id == "s1"
    assert repo.get_latest_by_scenario("off_by_one").session_id == "s2"
    assert len(repo.list_recent()) == 2

def test_coordinator_dependency_injection():
    mock_sandbox = MockSandbox()
    custom_repo = InMemorySessionRepository(capacity=10)

    coordinator = AgentLoopCoordinator(
        sandbox_runner=mock_sandbox,
        session_repo=custom_repo
    )

    session = coordinator.run_healing_session("race_condition")
    assert session.session_id.startswith("sess_")
    assert session.stage == "healed"
    assert session.verification.deterministic_proof == "Mock verification proof"

    # Verify session was automatically cached in injected repository
    cached = custom_repo.get_by_id(session.session_id)
    assert cached is not None
    assert cached.session_id == session.session_id
