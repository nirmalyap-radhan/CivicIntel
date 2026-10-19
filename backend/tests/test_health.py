def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "CivicIntel API"
    assert data["database"] == "healthy"


def test_readiness_check(client):
    response = client.get("/ready")
    assert response.status_code == 200
    assert response.json()["ready"] is True
