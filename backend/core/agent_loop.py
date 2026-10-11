import time
import uuid
from typing import Optional
from backend.core.models import SelfHealingSession, ChaosScenario, VerificationResult, PatchCandidate
from backend.chaos.scenarios import get_scenario, SCENARIOS
from backend.core.state_trap import StateTrap
from backend.core.ast_engine import ASTEngine
from backend.core.sandbox_runner import SandboxRunner
from backend.adapters.providers.deterministic_engine import DeterministicEngine
from backend.adapters.repositories.in_memory_session_repo import InMemorySessionRepository
from backend.adapters.telemetry.in_memory_metrics import InMemoryMetricsCollector
from backend.core.ports.sandbox import ExecutionSandboxPort
from backend.core.ports.provider import ModelProviderPort
from backend.core.ports.repository import SessionRepositoryPort
from backend.core.ports.metrics import MetricsCollectorPort
from backend.core.ports.tracing import TraceHookPort

class AgentLoopCoordinator:
    """
    Coordinates the end-to-end self-healing lifecycle:
    Trace Capture -> AST Isolation -> Two-Tier Debate -> Sandbox Subprocess Verification
    Supports Hexagonal dependency injection for sandboxes, providers, repositories, metrics, and tracers.
    """

    def __init__(
        self,
        sandbox_runner: Optional[ExecutionSandboxPort] = None,
        model_provider: Optional[ModelProviderPort] = None,
        ast_engine: Optional[ASTEngine] = None,
        state_trap: Optional[StateTrap] = None,
        session_repo: Optional[SessionRepositoryPort] = None,
        metrics_collector: Optional[MetricsCollectorPort] = None,
        tracer: Optional[TraceHookPort] = None
    ):
        self.state_trap = state_trap or StateTrap()
        self.ast_engine = ast_engine or ASTEngine()
        self.sandbox_runner = sandbox_runner or SandboxRunner()
        self.deterministic_provider = model_provider or DeterministicEngine()
        self.session_repo = session_repo or InMemorySessionRepository()
        self.metrics = metrics_collector or InMemoryMetricsCollector()
        self.tracer = tracer

    def run_healing_session(
        self,
        scenario_id: str,
        custom_code: Optional[str] = None,
        custom_test: Optional[str] = None
    ) -> SelfHealingSession:
        start_session_time = time.perf_counter()
        scenario = get_scenario(scenario_id)
        if not scenario:
            # Fall back to race condition if unknown
            scenario = SCENARIOS.get("race_condition")

        source_code = custom_code or scenario.source_code
        test_code = custom_test or scenario.test_code

        session_id = f"sess_{uuid.uuid4().hex[:8]}"

        # Step 1: Trace execution state and capture invariant violation via ResilientInMemoryStream
        span1 = self.tracer.start_span("ghostslate.trace_capture", {"scenario_id": scenario_id}) if self.tracer else None
        snapshots, violation, stream_sync = self.state_trap.capture_trace(
            scenario_id=scenario_id,
            custom_code=source_code if scenario_id == "custom" else None
        )
        if self.metrics:
            self.metrics.record_duration("stream_synchronization", stream_sync.sync_latency_us)
        if self.tracer and span1:
            self.tracer.end_span(span1)

        # Step 2: AST Scoping & Node Isolation with microsecond telemetry
        span2 = self.tracer.start_span("ghostslate.ast_isolation", {"language": scenario.language}) if self.tracer else None
        ast_start = time.perf_counter()
        line_to_target = violation.line_number if violation else 8
        all_ast_nodes = self.ast_engine.get_nodes(source_code, scenario.language)
        isolated_node = self.ast_engine.find_isolated_node(source_code, line_to_target, scenario.language)
        ast_duration_us = (time.perf_counter() - ast_start) * 1_000_000.0
        if self.metrics:
            self.metrics.record_duration("ast_parsing", ast_duration_us)
            self.metrics.increment_counter("ast_nodes_scanned_total", len(all_ast_nodes))
        if self.tracer and span2:
            self.tracer.end_span(span2)

        # Step 3: Two-Tier Agent Loop (Triage + Critic)
        try:
            span3 = self.tracer.start_span("ghostslate.agent_debate", {"scenario_id": scenario_id}) if self.tracer else None
            patch, debate_turns = self.deterministic_provider.synthesize_repair(
                scenario_id=scenario_id,
                original_code=source_code,
                violation=violation,
                isolated_node=isolated_node
            )
            if self.tracer and span3:
                self.tracer.end_span(span3)

            # Step 4: Deterministic Sandbox Runner (Subprocess Red -> Green verification)
            span4 = self.tracer.start_span("ghostslate.sandbox_verification", {"patch_id": patch.patch_id}) if self.tracer else None
            sandbox_start = time.perf_counter()
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

            sandbox_duration_ms = (time.perf_counter() - sandbox_start) * 1000.0
            if self.metrics:
                self.metrics.record_duration("sandbox_verification", sandbox_duration_ms * 1000.0)
                self.metrics.increment_counter("sandbox_runs_total", 2)
            if self.tracer and span4:
                self.tracer.end_span(span4)

        except Exception as err:
            if self.metrics:
                self.metrics.increment_counter("syntax_rejections_total", 1)
            rej_id = f"rejected_{uuid.uuid4().hex[:6]}"
            patch = PatchCandidate(
                patch_id=rej_id,
                target_node_id=isolated_node.node_id if isolated_node else None,
                target_node_type="SyntaxError" if isinstance(err, ValueError) else "ExecutionError",
                start_line=isolated_node.start_point[0] if isolated_node else 1,
                end_line=isolated_node.end_point[0] if isolated_node else 1,
                original_code=source_code,
                replacement_code="# SYNTAX REJECTED",
                full_patched_code=source_code,
                explanation=f"AST pre-flight syntax rejection: {str(err)}",
                diff_unified=""
            )
            debate_turns = []
            verification = VerificationResult(
                patch_id=rej_id,
                is_verified=False,
                pre_patch_test_output="",
                post_patch_test_output=str(err),
                exit_code=-99,
                duration_ms=0.0,
                tests_passed=0,
                tests_failed=1,
                deterministic_proof=f"Pre-flight AST gate rejected candidate syntax: {str(err)}",
                canary_passed=False,
                canary_diagnostics=str(err)
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
        span5 = self.tracer.start_span("ghostslate.session_storage", {"session_id": session_id}) if self.tracer else None
        if self.session_repo:
            self.session_repo.save(session)
        if self.tracer and span5:
            self.tracer.end_span(span5)

        total_session_ms = (time.perf_counter() - start_session_time) * 1000.0
        if self.metrics:
            self.metrics.record_duration("end_to_end_repair", total_session_ms * 1000.0)
            self.metrics.increment_counter("heals_total", 1)

        return session
