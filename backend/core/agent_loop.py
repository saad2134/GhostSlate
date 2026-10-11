import uuid
from typing import Optional
from backend.core.models import SelfHealingSession
from backend.chaos.scenarios import get_scenario
from backend.core.state_trap import StateTrap
from backend.core.ast_engine import ASTEngine
from backend.core.sandbox_runner import SandboxRunner
from backend.adapters.providers.deterministic_engine import DeterministicEngine

class AgentLoopCoordinator:
    """
    Coordinates the end-to-end self-healing lifecycle:
    Trace Capture -> AST Isolation -> Two-Tier Debate -> Sandbox Subprocess Verification
    """

    def __init__(self):
        self.state_trap = StateTrap()
        self.ast_engine = ASTEngine()
        self.sandbox_runner = SandboxRunner()
        self.deterministic_provider = DeterministicEngine()

    def run_healing_session(
        self,
        scenario_id: str,
        custom_code: Optional[str] = None,
        custom_test: Optional[str] = None
    ) -> SelfHealingSession:
        scenario = get_scenario(scenario_id)
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
        verification = self.sandbox_runner.run_verification(
            original_code=source_code,
            patched_code=patch.full_patched_code,
            test_code=test_code,
            patch_id=patch.patch_id
        )

        # Step 5: Determine final stage
        final_stage = "healed" if verification.is_verified else "failed"

        return SelfHealingSession(
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
