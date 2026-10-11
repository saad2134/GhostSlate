import pytest
from backend.adapters.telemetry.in_memory_tracer import InMemoryTracer
from backend.core.agent_loop import AgentLoopCoordinator

def test_in_memory_tracer_span_lifecycle():
    tracer = InMemoryTracer(trace_id="test_trace_123")
    span = tracer.start_span("custom_operation", {"environment": "sandbox"})
    
    assert span.name == "custom_operation"
    assert span.attributes["environment"] == "sandbox"
    assert span.status == "RUNNING"
    
    tracer.end_span(span, status="OK")
    assert span.status == "OK"
    assert span.duration_us >= 0.0

    summary = tracer.get_summary()
    assert summary["trace_id"] == "test_trace_123"
    assert summary["span_count"] == 1
    assert summary["spans"][0]["name"] == "custom_operation"

def test_coordinator_pipeline_spans_emitted():
    tracer = InMemoryTracer()
    coordinator = AgentLoopCoordinator(tracer=tracer)

    session = coordinator.run_healing_session(scenario_id="off_by_one")
    assert session.stage == "healed"

    spans = tracer.get_spans()
    span_names = [s["name"] for s in spans]

    # Verify all 5 pipeline phases were captured
    assert "ghostslate.trace_capture" in span_names
    assert "ghostslate.ast_isolation" in span_names
    assert "ghostslate.agent_debate" in span_names
    assert "ghostslate.sandbox_verification" in span_names
    assert "ghostslate.session_storage" in span_names

    # Verify microsecond durations are positive
    for s in spans:
        assert s["duration_us"] > 0.0
        assert s["status"] == "OK"
