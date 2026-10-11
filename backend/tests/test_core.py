import pytest
from backend.core.agent_loop import AgentLoopCoordinator
from backend.chaos.scenarios import list_scenarios, get_scenario
from backend.adapters.presentation.cli_adapter import generate_sarif_report

def test_all_chaos_scenarios_configured():
    scenarios = list_scenarios()
    assert len(scenarios) >= 4
    scenario_ids = [s.id for s in scenarios]
    assert "race_condition" in scenario_ids
    assert "off_by_one" in scenario_ids
    assert "null_pointer" in scenario_ids
    assert "financial_ledger" in scenario_ids
    assert "stream_interrupt" in scenario_ids

def test_stream_interrupt_self_heal_loop():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("stream_interrupt")

    assert session.stage == "healed"
    assert session.verification.is_verified is True
    assert session.verification.exit_code == 0
    assert session.patch is not None
    assert "sequence_no > self.watermark_sequence" in session.patch.replacement_code
    assert session.invariant_violation.rule_name == "MonotonicWatermarkSequenceInvariant"
    assert session.stream_sync is not None
    assert session.stream_sync.timeline_integrity_verified is True
    assert session.stream_sync.is_out_of_order_detected is True
    assert session.stream_sync.events_reordered > 0
    assert session.stream_sync.interrupt_count >= 1

def test_race_condition_self_heal_loop():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("race_condition")

    assert session.stage == "healed"
    assert session.verification.is_verified is True
    assert session.verification.exit_code == 0
    assert session.patch is not None
    assert "self.balance >= amount" in session.patch.replacement_code
    assert session.invariant_violation.rule_name == "NonNegativeBalanceInvariant"
    assert len(session.snapshots) > 0
    assert len(session.debate_turns) >= 4

def test_off_by_one_self_heal_loop():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("off_by_one")

    assert session.stage == "healed"
    assert session.verification.is_verified is True
    assert session.verification.exit_code == 0
    assert session.patch is not None
    assert "< self.max_requests" in session.patch.replacement_code
    assert session.invariant_violation.rule_name == "CapacityStrictUpperLimitInvariant"

def test_null_pointer_self_heal_loop():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("null_pointer")

    assert session.stage == "healed"
    assert session.verification.is_verified is True
    assert session.verification.exit_code == 0
    assert session.patch is not None
    assert "ANONYMOUS" in session.patch.replacement_code

def test_financial_ledger_self_heal_loop():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("financial_ledger")

    assert session.stage == "healed"
    assert session.verification.is_verified is True
    assert session.verification.exit_code == 0
    assert session.patch is not None
    assert "sender_balance < amount" in session.patch.replacement_code

def test_sarif_export_structure():
    coordinator = AgentLoopCoordinator()
    session = coordinator.run_healing_session("race_condition")
    sarif = generate_sarif_report(session)

    assert sarif["version"] == "2.1.0"
    assert len(sarif["runs"]) == 1
    assert sarif["runs"][0]["tool"]["driver"]["name"] == "GhostSlate-AST-SelfHeal"
    assert len(sarif["runs"][0]["results"]) == 1
