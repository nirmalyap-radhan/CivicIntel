def test_get_policies_list(client):
    response = client.get("/api/v1/policies")
    assert response.status_code == 200
    policies = response.json()
    assert len(policies) > 0


def test_get_city_policies(client):
    response = client.get("/api/v1/policies/cities/koraput/policies")
    assert response.status_code == 200
    policies = response.json()
    assert len(policies) > 0
    for p in policies:
        assert p["city_id"] == "koraput"


def test_propose_policy_unauthorized(client):
    payload = {
        "city_id": "koraput",
        "title": "Decentralized Solar Cold Storage",
        "sector": "infrastructure",
        "priority": "Immediate",
        "estimated_budget_cr": 25.0,
        "funding_mechanism": "State Agriculture Grant",
        "time_to_implement_months": 12
    }
    # Unauthenticated request should fail with 401
    response = client.post("/api/v1/policies", json=payload)
    assert response.status_code == 401


def test_propose_policy_authorized_gov(client, gov_headers):
    payload = {
        "city_id": "koraput",
        "title": "Decentralized Solar Cold Storage Grid",
        "sector": "infrastructure",
        "priority": "Immediate",
        "estimated_budget_cr": 25.0,
        "funding_mechanism": "State Agriculture Grant + DMF",
        "time_to_implement_months": 12,
        "evaluation": {
            "impact_score": 88.0,
            "feasibility_score": 85.0,
            "cost_benefit_ratio": 2.8,
            "expected_outcomes": "Reduce perishable agro loss by 40%",
            "evidence_base": "Pilot horticultural cold rooms in Pottangi",
            "risk_assessment": "Monsoon solar generation intermittency"
        }
    }
    response = client.post("/api/v1/policies", json=payload, headers=gov_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["status"] == "Proposed"
    assert data["evaluation"] is not None
    assert data["evaluation"]["impact_score"] == 88.0


def test_prevent_unauthorized_policy_approval(client, citizen_headers, gov_headers):
    # 1. Propose policy as government official
    payload = {
        "city_id": "koraput",
        "title": "Highland Watershed Micro-Reservoirs",
        "sector": "environment",
        "priority": "Medium Term",
        "estimated_budget_cr": 14.0,
        "funding_mechanism": "CAMPA + State Green Fund",
        "time_to_implement_months": 8
    }
    create_res = client.post("/api/v1/policies", json=payload, headers=gov_headers)
    assert create_res.status_code == 201
    policy_id = create_res.json()["id"]

    # 2. Attempt approval as Citizen -> MUST BE REJECTED with 403 Forbidden!
    patch_payload = {"status": "Approved", "notes": "Unauthorized citizen approval attempt"}
    citizen_attempt = client.patch(
        f"/api/v1/policies/{policy_id}/status",
        json=patch_payload,
        headers=citizen_headers
    )
    assert citizen_attempt.status_code == 403
    assert "operation not permitted" in citizen_attempt.json()["detail"].lower()

    # 3. Legitimate approval as Government Official -> MUST SUCCEED with 200
    gov_approval = client.patch(
        f"/api/v1/policies/{policy_id}/status",
        json=patch_payload,
        headers=gov_headers
    )
    assert gov_approval.status_code == 200
    assert gov_approval.json()["status"] == "Approved"
    assert gov_approval.json()["approved_at"] is not None
