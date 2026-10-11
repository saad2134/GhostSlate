import pytest
from starlette.testclient import TestClient
from backend.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_api_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "GhostSlate AST Engine"
    assert "checks" in data
    assert data["checks"]["ast_parser"]["status"] == "UP"
    assert data["checks"]["subprocess_sandbox"]["status"] == "UP"
    assert data["checks"]["resilient_stream"]["status"] == "UP"

def test_api_benchmarks_endpoint(client):
    res = client.get("/api/benchmarks")
    assert res.status_code == 200
    data = res.json()
    assert "metrics" in data
    assert "ast_parsing" in data["metrics"]
    assert "stream_synchronization" in data["metrics"]
    assert "sandbox_verification" in data["metrics"]
    assert data["metrics"]["stream_synchronization"]["watermark_drain_latency_us"] < 20.0

def test_api_compliance_endpoint(client):
    res = client.get("/api/compliance")
    assert res.status_code == 200
    data = res.json()
    assert "zero_exfiltration_guarantee" in data
    assert "sandbox_security_boundary" in data
    assert data["zero_exfiltration_guarantee"]["status"] == "VERIFIED"

def test_api_scenarios_list_and_detail(client):
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    scenarios = res.json()
    assert len(scenarios) >= 5
    
    # Detail existing
    res_det = client.get("/api/scenarios/race_condition")
    assert res_det.status_code == 200
    assert res_det.json()["id"] == "race_condition"

    # Detail 404
    res_404 = client.get("/api/scenarios/non_existent_chaos_id_123")
    assert res_404.status_code == 404

def test_api_heal_and_export_flow(client):
    # Run heal
    heal_res = client.post("/api/heal", json={"scenario_id": "off_by_one"})
    assert heal_res.status_code == 200
    session_data = heal_res.json()
    assert session_data["stage"] == "healed"
    assert session_data["verification"]["is_verified"] is True
    session_id = session_data["session_id"]

    # Retrieve from session cache
    sess_res = client.get(f"/api/sessions/{session_id}")
    assert sess_res.status_code == 200
    assert sess_res.json()["session_id"] == session_id

    # Export PR
    export_res = client.post("/api/export/pr", json={
        "session_id": session_id,
        "scenario_id": "off_by_one"
    })
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert "markdown_body" in export_data
    assert "sarif_report" in export_data
    assert export_data["sarif_report"]["version"] == "2.1.0"
