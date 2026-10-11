import pytest
from starlette.testclient import TestClient
from backend.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_health_live_probe(client):
    res = client.get("/api/health/live")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "alive"
    assert "timestamp" in data

def test_health_ready_probe(client):
    res = client.get("/api/health/ready")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert data["checks"]["session_repository"] == "READY"
    assert data["checks"]["ephemeral_storage"] == "READY"
    assert data["checks"]["worker_pool"] == "READY"
    assert data["checks"]["ast_engine"] == "READY"

def test_audit_ledger_endpoint(client):
    res = client.get("/api/ledger")
    assert res.status_code == 200
    data = res.json()
    assert "chain_valid" in data
    assert data["chain_valid"] is True
    assert "total_blocks" in data
    assert isinstance(data["entries"], list)
