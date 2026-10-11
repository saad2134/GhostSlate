import logging
from typing import Tuple, List, Optional
from backend.core.ports.provider import ModelProviderPort
from backend.core.ports.metrics import MetricsCollectorPort
from backend.core.models import PatchCandidate, AgentDebateTurn, InvariantViolation, ASTNodeInfo
from backend.adapters.providers.deterministic_engine import DeterministicEngine

logger = logging.getLogger("ghostslate.failover_provider")

class FailoverModelProvider(ModelProviderPort):
    """
    Resilient multi-tier model provider adapter.
    Implements ModelProviderPort with automatic fallback to the offline DeterministicEngine
    when a primary remote LLM times out, rate limits, or suffers an outage.
    """

    def __init__(
        self,
        primary_provider: ModelProviderPort,
        fallback_provider: Optional[ModelProviderPort] = None,
        metrics_collector: Optional[MetricsCollectorPort] = None
    ):
        self.primary_provider = primary_provider
        self.fallback_provider = fallback_provider or DeterministicEngine()
        self.metrics = metrics_collector
        self.failover_count = 0

    def synthesize_repair(
        self,
        scenario_id: str,
        original_code: str,
        violation: Optional[InvariantViolation] = None,
        isolated_node: Optional[ASTNodeInfo] = None
    ) -> Tuple[PatchCandidate, List[AgentDebateTurn]]:
        try:
            return self.primary_provider.synthesize_repair(
                scenario_id=scenario_id,
                original_code=original_code,
                violation=violation,
                isolated_node=isolated_node
            )
        except Exception as err:
            logger.warning(
                f"Primary model provider failed: {str(err)}. "
                f"Initiating transparent fallback to DeterministicEngine."
            )
            self.failover_count += 1
            if self.metrics:
                self.metrics.increment_counter("failover_events_total", 1)

            # Fall back to offline deterministic AST repair engine
            patch, debate_turns = self.fallback_provider.synthesize_repair(
                scenario_id=scenario_id,
                original_code=original_code,
                violation=violation,
                isolated_node=isolated_node
            )

            # Append failover notice to debate turns for transparent auditability
            failover_turn = AgentDebateTurn(
                id="turn_failover_notice",
                speaker="System",
                avatar="🛡️",
                timestamp="0.00s",
                message=f"Primary model provider degraded ({str(err)}). Transparently fell back to DeterministicEngine.",
                status="approved",
                confidence_score=0.99
            )
            return patch, [failover_turn] + debate_turns
