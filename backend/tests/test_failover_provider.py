import pytest
from backend.adapters.providers.failover_provider import FailoverModelProvider
from backend.adapters.providers.deterministic_engine import DeterministicEngine
from backend.adapters.telemetry.in_memory_metrics import InMemoryMetricsCollector
from backend.core.ports.provider import ModelProviderPort
from backend.core.models import PatchCandidate, AgentDebateTurn
from backend.chaos.scenarios import SCENARIOS

class FailingMockProvider(ModelProviderPort):
    def synthesize_repair(self, scenario_id, original_code, violation=None, isolated_node=None):
        raise ConnectionError("Simulated remote LLM API 503 service unavailable outage")

def test_failover_provider_fallback_to_deterministic():
    failing_primary = FailingMockProvider()
    metrics = InMemoryMetricsCollector()
    
    provider = FailoverModelProvider(
        primary_provider=failing_primary,
        fallback_provider=DeterministicEngine(),
        metrics_collector=metrics
    )

    source_code = SCENARIOS["race_condition"].source_code
    patch, debate_turns = provider.synthesize_repair(
        scenario_id="race_condition",
        original_code=source_code
    )

    assert provider.failover_count == 1
    assert patch is not None
    assert patch.patch_id.startswith("patch_")
    
    # Check that failover notice was recorded in debate turns
    speakers = [t.speaker for t in debate_turns]
    assert "System" in speakers
    assert any("Transparently fell back to DeterministicEngine" in t.message for t in debate_turns)
    
    # Check operational metric was incremented
    summary = metrics.get_summary()
    assert summary["counters"].get("failover_events_total", 0) == 1

def test_failover_provider_happy_path_primary():
    healthy_primary = DeterministicEngine()
    metrics = InMemoryMetricsCollector()

    provider = FailoverModelProvider(
        primary_provider=healthy_primary,
        metrics_collector=metrics
    )

    source_code = SCENARIOS["race_condition"].source_code
    patch, debate_turns = provider.synthesize_repair(
        scenario_id="race_condition",
        original_code=source_code
    )

    assert provider.failover_count == 0
    assert patch is not None
    assert not any(t.id == "turn_failover_notice" for t in debate_turns)
