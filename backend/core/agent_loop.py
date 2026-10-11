import uuid
from typing import Optional
from backend.core.models import SelfHealingSession, ChaosScenario
from backend.chaos.scenarios import get_scenario, SCENARIOS
from backend.core.state_trap import StateTrap
from backend.core.ast_engine import ASTEngine
from backend.core.sandbox_runner import SandboxRunner
from backend.adapters.providers.deterministic_engine import DeterministicEngine
from backend.adapters.repositories.in_memory_session_repo import InMemorySessionRepository
from backend.core.ports.sandbox import ExecutionSandboxPort
from backend.core.ports.provider import ModelProviderPort
from backend.core.ports.repository import SessionRepositoryPort

class AgentLoopCoordinator:
    """
    Coordinates the end-to-end self-healing lifecycle:
    Trace Capture -> AST Isolation -> Two-Tier Debate -> Sandbox Subprocess Verification
    Supports Hexagonal dependency injection for sandboxes, providers, and session repositories.
    """

    def __init__(
        self,
        sandbox_runner: Optional[ExecutionSandboxPort] = None,
        model_provider: Optional[ModelProviderPort] = None,
        ast_engine: Optional[ASTEngine] = None,
        state_trap: Optional[StateTrap] = None,
        session_repo: Optional[SessionRepositoryPort] = None
    ):
        self.state_trap = state_trap or StateTrap()
        self.ast_engine = ast_engine or ASTEngine()
        self.sandbox_runner = sandbox_runner or SandboxRunner()
        self.deterministic_provider = model_provider or DeterministicEngine()
        self.session_repo = session_repo or InMemorySessionRepository()

    def run_healing_session(
        self,
        scenario_id: str,
        custom_code: Optional[str] = None,
        custom_test: Optional[str] = None
    ) -> SelfHealingSession:
        scenario = get_scenario(scenario_id)
        if not scenario:
            # Fall back to race condition if unknown
            scenario = SCENARIOS.get("race_condition")

        source_code = custom_code or scenario.source_code
        test_code = custom_test or scenario.test_code

        session_id = f"sess_{uuid.uuid4().hex[:8]}"

        # Step 1: Trace execution state and capture invariant violation via ResilientInMemoryStream
        snapshots, violation, stream_sync = self.state_trap.capture_trace(scenario_id)

        # Step 2: AST Scoping & Node Isolation
        line_to_target = violation.line_number if violation else 8
        all_ast_nodes = self.ast_engine.get_nodes(source_code, scenario.language)
        isolated_node = self.ast_engine.find_isolated_node(source_code, line_to_target, scenario.language)

        # Step 3: Two-Tier Agent Loop (Triage + Critic)
        patch, debate_turns = self.deterministic_provider.synthesize_repair(
            scenario_id=scenario_id,
            original_code=source_code,
            violation=violation,
            isolated_node=isolated_node
        )

        # Step 4: Deterministic Sandbox Runner (Subprocess Red -> Green verification)
        if hasattr(self.sandbox_runner, "run_verification"):
            verification = self.sandbox_runner.run_verification(
                original_code=source_code,
                patched_code=patch.full_patched_code,
                test_code=test_code,
                patch_id=patch.patch_id
            )
        else:
            # Conformance fallback for generic ExecutionSandboxPort
            pre_pass, pre_out, pre_code = self.sandbox_runner.run_tests(source_code, test_code)
            post_pass, post_out, post_code = self.sandbox_runner.run_tests(patch.full_patched_code, test_code)
            is_verified = (not pre_pass) and post_pass
            from backend.core.models import VerificationResult
            verification = VerificationResult(
                patch_id=patch.patch_id,
                is_verified=is_verified,
                pre_patch_test_output=pre_out,
                post_patch_test_output=post_out,
                exit_code=post_code,
                duration_ms=150.0,
                tests_passed=1 if is_verified else 0,
                tests_failed=0 if is_verified else 1,
                deterministic_proof="Port sandbox verification completed."
            )

        # Step 5: Determine final stage
        final_stage = "healed" if verification.is_verified else "failed"

        session = SelfHealingSession(
            session_id=session_id,
            scenario_id=scenario.id,
            title=scenario.title,
            language=scenario.language,
            original_code=source_code,
            test_suite=test_code,
            invariant_violation=violation,
            snapshots=snapshots,
            ast_nodes=all_ast_nodes,
            isolated_node=isolated_node,
            debate_turns=debate_turns,
            patch=patch,
            verification=verification,
            stage=final_stage,
            stream_sync=stream_sync
        )

        # Cache session in session repository for instant zero-redundancy exports
        if self.session_repo:
            self.session_repo.save(session)

        return session
