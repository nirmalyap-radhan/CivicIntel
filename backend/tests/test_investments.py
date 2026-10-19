import pytest
from fastapi.testclient import TestClient


def test_get_resource_directory(client: TestClient):
    """Verifies that the Resource Directory serves curated local resources across all categories."""
    response = client.get("/api/v1/investments/resources")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    
    categories = {item["category"] for item in data}
    assert "agricultural" in categories
    assert "local_product" in categories
    assert "workforce" in categories
    assert "tourism" in categories
    assert "existing_business" in categories

    # Verify Koraput Coffee GI 638 is present
    titles = [item["title"] for item in data]
    assert any("Coffee" in title for title in titles)


def test_get_resource_directory_filtered(client: TestClient):
    """Verifies filtering resource directory by city and category."""
    # Filter by Koraput + agricultural
    response = client.get("/api/v1/investments/resources?city_id=koraput&category=agricultural")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    for item in data:
        assert item["city_id"] == "koraput"
        assert item["category"] == "agricultural"
        assert "supporting_source" in item
        assert "growth_potential" in item


def test_get_investment_opportunities(client: TestClient):
    """Verifies retrieval of bankable investment opportunities with evidence and regulatory notes."""
    response = client.get("/api/v1/investments/opportunities")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2

    first = data[0]
    assert "capex_in_cr" in first
    assert "expected_irr_percent" in first
    assert "verification_stage" in first
    assert "supporting_evidence" in first
    assert "regulatory_considerations" in first
    assert "potential_partners" in first


def test_get_single_opportunity_by_id(client: TestClient):
    """Verifies single opportunity endpoint and 404 handling."""
    response = client.get("/api/v1/investments/opportunities/inv-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "inv-01"
    assert "Koraput Valley Organic Coffee" in data["title"]
    assert "Schedule V" in data["regulatory_considerations"]

    # Test non-existent ID
    response_404 = client.get("/api/v1/investments/opportunities/non-existent-id")
    assert response_404.status_code == 404


def test_submit_and_list_investment_enquiry(client: TestClient):
    """Verifies contact and enquiry workflow for prospective investors."""
    enquiry_payload = {
        "investment_id": "inv-01",
        "investor_name": "Ananya Patnaik",
        "investor_email": "ananya.patnaik@kalingacapital.com",
        "organization": "Kalinga Impact Ventures",
        "proposed_investment_cr": 15.0,
        "target_timeline": "Within 6 months",
        "message": "We are evaluating debt-equity co-financing for the organic coffee curing plant under the APICOL scheme.",
        "contact_phone": "+91-99887-76655",
    }
    response = client.post("/api/v1/investments/enquiries", json=enquiry_payload)
    assert response.status_code == 201
    created = response.json()
    assert created["investor_name"] == "Ananya Patnaik"
    assert created["proposed_investment_cr"] == 15.0
    assert created["status"] == "Pending Review"
    assert created["investment_title"] is not None

    # Verify listing enquiries
    list_resp = client.get("/api/v1/investments/enquiries?investment_id=inv-01")
    assert list_resp.status_code == 200
    enquiries = list_resp.json()
    assert len(enquiries) >= 1
    assert any(e["investor_email"] == "ananya.patnaik@kalingacapital.com" for e in enquiries)


def test_submit_enquiry_invalid_investment(client: TestClient):
    """Verifies enquiry submission fails cleanly if opportunity ID does not exist."""
    invalid_payload = {
        "investment_id": "invalid-opp-999",
        "investor_name": "Test User",
        "investor_email": "test@example.com",
        "organization": "Test Corp",
        "message": "Test message for invalid opportunity.",
    }
    response = client.post("/api/v1/investments/enquiries", json=invalid_payload)
    assert response.status_code == 404


def test_investment_sensitivity_analysis(client: TestClient):
    """Verifies dynamic investment sensitivity analysis and scenario comparisons."""
    analysis_payload = {
        "investment_id": "inv-01",
        "capacity_utilization_percent": 80.0,
        "capital_subsidy_percent": 30.0,
        "tariff_realization_multiplier": 1.05,
        "cost_of_capital_percent": 9.5,
        "opex_annual_growth_percent": 4.5,
    }
    response = client.post("/api/v1/investments/analyze", json=analysis_payload)
    assert response.status_code == 200
    data = response.json()

    # 1. Base Metrics
    assert data["base_capex_cr"] == 85.0
    assert data["effective_capex_cr"] == 59.5  # 85 * (1 - 0.30)
    assert "Organic Coffee" in data["title"]

    # 2. Scenario Comparisons (Conservative, Base Case, Accelerated)
    scenarios = data["scenario_comparisons"]
    assert len(scenarios) == 3
    scenario_names = [s["scenario"] for s in scenarios]
    assert any("Conservative" in name for name in scenario_names)
    assert any("Base Case" in name for name in scenario_names)
    assert any("Accelerated" in name for name in scenario_names)

    # Accelerated should have higher IRR and shorter payback than Conservative
    conservative = next(s for s in scenarios if "Conservative" in s["scenario"])
    accelerated = next(s for s in scenarios if "Accelerated" in s["scenario"])
    assert accelerated["projected_irr_percent"] > conservative["projected_irr_percent"]
    assert accelerated["payback_period_years"] < conservative["payback_period_years"]

    # 3. 2D Sensitivity Matrix
    matrix = data["sensitivity_matrix"]
    assert len(matrix) == 25  # 5 utilization levels x 5 subsidy levels
    for cell in matrix:
        assert cell["capacity_utilization_percent"] in [50.0, 65.0, 75.0, 85.0, 100.0]
        assert cell["capital_subsidy_percent"] in [10.0, 20.0, 25.0, 30.0, 40.0]
        assert isinstance(cell["irr_percent"], (int, float))
        assert cell["payback_years"] > 0
        assert cell["viability_label"] in ["Prime", "Viable", "Moderate", "Marginal"]

    # Verify high efficiency cells qualify as Prime
    prime_cells = [c for c in matrix if c["viability_label"] == "Prime"]
    assert len(prime_cells) >= 1
    for pc in prime_cells:
        assert pc["irr_percent"] >= 18.0

    # 4. Cost Breakdown & Defensible Revenue Trajectory
    assert len(data["capex_breakdown"]) >= 3
    assert len(data["opex_breakdown"]) >= 3
    assert len(data["revenue_trajectory"]) == 5
    for pt in data["revenue_trajectory"]:
        assert pt["min_revenue_cr"] <= pt["expected_revenue_cr"] <= pt["max_revenue_cr"]

    # 5. Risk Factors & Disclosures
    assert len(data["risk_factors"]) >= 2
    assert len(data["disclosed_assumptions"]) >= 4
    assert len(data["data_sources"]) >= 3
    assert "DISCLOSURE & REGULATORY DISCLAIMER" in data["regulatory_disclaimer"]
