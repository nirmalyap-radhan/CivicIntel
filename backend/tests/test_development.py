"""
Unit and Integration Tests for Capabilities A & B:
Capability A: Development Scoring Engine (Clipped Normalization, Weights, Caveats)
Capability B: Development Forecasting Engine (Chronological MAE Validation, Data Sufficiency Gate)
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.ml.development_scoring import development_scoring_engine, INDICATOR_CATALOG
from app.ml.development_forecasting import (
    development_forecasting_engine,
    compute_error_metrics,
    ChronologicalModelValidator,
)


# ---------------------------------------------------------------------------
# 1. Capability A: Mathematical Normalization & Clipping Tests
# ---------------------------------------------------------------------------

def test_higher_is_better_normalization_and_clipping():
    """
    Verifies N_i = 100 * clip((x_i - L_i)/(U_i - L_i), 0, 1):
    - Below L_i -> 0.0
    - Above U_i -> 100.0
    - Intermediate -> Exact linear percentage
    """
    # Doctor density: L = 1.0, U = 25.0
    L = 1.0
    U = 25.0

    # Below lower bound
    assert development_scoring_engine.normalize_higher_is_better(0.5, L, U) == 0.0
    assert development_scoring_engine.normalize_higher_is_better(1.0, L, U) == 0.0

    # Above upper bound
    assert development_scoring_engine.normalize_higher_is_better(30.0, L, U) == 100.0
    assert development_scoring_engine.normalize_higher_is_better(25.0, L, U) == 100.0

    # Midpoint: x = 13.0 -> (13 - 1) / (25 - 1) = 12 / 24 = 50.0
    assert development_scoring_engine.normalize_higher_is_better(13.0, L, U) == 50.0

    # Koraput value: x = 4.8 -> (4.8 - 1.0) / 24.0 = 3.8 / 24.0 = 15.83
    assert development_scoring_engine.normalize_higher_is_better(4.8, L, U) == 15.83


def test_lower_is_better_normalization_and_clipping():
    """
    Verifies N_i = 100 * clip((U_i - x_i)/(U_i - L_i), 0, 1):
    - Lower values receive higher scores (e.g. low infant mortality is good)
    - Below L_i -> 100.0 (exceptional performance)
    - Above U_i -> 0.0 (critical deficit)
    """
    # Infant mortality: L = 10.0 (good), U = 60.0 (bad)
    L = 10.0
    U = 60.0

    # Exceptional performance (better than aspirational target)
    assert development_scoring_engine.normalize_lower_is_better(8.0, L, U) == 100.0
    assert development_scoring_engine.normalize_lower_is_better(10.0, L, U) == 100.0

    # Worse than upper bound
    assert development_scoring_engine.normalize_lower_is_better(65.0, L, U) == 0.0
    assert development_scoring_engine.normalize_lower_is_better(60.0, L, U) == 0.0

    # Midpoint: x = 35.0 -> (60 - 35) / 50 = 25 / 50 = 50.0
    assert development_scoring_engine.normalize_lower_is_better(35.0, L, U) == 50.0

    # Koraput baseline: x = 42.0 -> (60 - 42) / 50 = 18 / 50 = 36.0
    assert development_scoring_engine.normalize_lower_is_better(42.0, L, U) == 36.0


def test_composite_score_and_weights_sum_to_one():
    """
    Verifies that catalog weights sum to 1.00 and composite score equals sum(w_i * N_i).
    """
    total_weights = sum(ref.weight for ref in INDICATOR_CATALOG.values())
    assert abs(total_weights - 1.0) < 1e-4

    sample_obs = {
        "doctor_ratio_per_10k": 4.8,
        "hospital_bed_ratio_per_1k": 0.95,
        "infant_mortality_rate": 42.0,
        "piped_water_coverage": 48.2,
        "road_connectivity": 74.6,
        "broadband_access": 24.1,
        "literacy_rate": 49.2,
        "secondary_retention": 61.4,
        "formal_jobs_ratio": 26.8,
        "per_capita_income_inr": 68500.0,
        "digital_services_ratio": 56.0,
    }

    result = development_scoring_engine.calculate_composite_score(sample_obs)

    assert "composite_score" in result
    assert 0.0 <= result["composite_score"] <= 100.0
    assert len(result["indicator_breakdown"]) == len(sample_obs)

    # Verify manual sum matches composite
    manual_sum = sum(item["weighted_contribution"] for item in result["indicator_breakdown"])
    assert abs(round(manual_sum, 1) - result["composite_score"]) <= 0.1

    # Verify sector sub-scores exist
    assert len(result["sector_scores"]) >= 4
    for sec in result["sector_scores"]:
        assert "sector" in sec
        assert 0.0 <= sec["sector_score"] <= 100.0


def test_methodology_limitations_and_caveats():
    """
    Ensures that limitations (specifically healthcare access, terrain, and potability)
    are explicitly articulated in the output payload.
    """
    sample_obs = {"doctor_ratio_per_10k": 4.8}
    result = development_scoring_engine.calculate_composite_score(sample_obs)

    metadata = result["methodology_metadata"]
    assert "Proposed baseline methodology, not a validated national development index" in metadata["baseline_type"]
    assert len(metadata["general_limitations"]) >= 3

    # Check doctor ratio specific limitation
    doc_breakdown = next(item for item in result["indicator_breakdown"] if item["metric_key"] == "doctor_ratio_per_10k")
    limitations_text = doc_breakdown["methodological_limitations"]
    assert "geographic accessibility" in limitations_text.lower()
    assert "transit times" in limitations_text.lower() or "quality" in limitations_text.lower()


# ---------------------------------------------------------------------------
# 2. Capability B: Chronological Validation & Error Metrics Tests
# ---------------------------------------------------------------------------

def test_error_metrics_calculation():
    """
    Verifies MAE, RMSE, and MAPE formulas on deterministic test vectors.
    """
    y_true = [50.0, 60.0, 70.0, 80.0]
    y_pred = [52.0, 58.0, 73.0, 79.0]
    # Differences: |52-50|=2, |58-60|=2, |73-70|=3, |79-80|=1
    # MAE = (2 + 2 + 3 + 1) / 4 = 2.0
    # MSE = (4 + 4 + 9 + 1) / 4 = 18 / 4 = 4.5 -> RMSE = sqrt(4.5) = 2.121
    metrics = compute_error_metrics(y_true, y_pred)

    assert metrics["mae"] == 2.0
    assert abs(metrics["rmse"] - 2.121) < 0.01
    assert metrics["sample_size"] == 4


def test_chronological_holdout_validation():
    """
    Verifies that ChronologicalModelValidator trains on past observations
    and tests on future holdout records without data leakage.
    """
    observations = [
        {"year": 2018, "composite_score": 40.0},
        {"year": 2019, "composite_score": 42.0},
        {"year": 2020, "composite_score": 44.0},
        {"year": 2021, "composite_score": 46.0},
        {"year": 2022, "composite_score": 48.0},
        {"year": 2023, "composite_score": 50.0},  # Test holdout
        {"year": 2024, "composite_score": 52.0},  # Test holdout
    ]
    validator = ChronologicalModelValidator(split_year=2023)
    champion_name, metrics, comparisons = validator.evaluate_models(observations)

    assert champion_name in ["linear_regression", "random_forest", "gradient_boosting"]
    assert metrics["mae"] >= 0.0
    assert metrics["sample_size"] == 2  # 2023 and 2024 in test set
    assert "linear_regression" in comparisons
    assert "random_forest" in comparisons
    assert "gradient_boosting" in comparisons


def test_data_sufficiency_gate():
    """
    Verifies that when observation count < 5, the engine strictly labels the output
    as a 'Scenario Simulator' and flags is_validated_predictive_model = False.
    When observations >= 5, it labels it as 'Chronologically Validated Model'.
    """
    # 1. Sparse data (N = 2) -> Must trigger Scenario Simulator label
    sparse_obs = [
        {"year": 2023, "composite_score": 54.0},
        {"year": 2024, "composite_score": 56.0},
    ]
    sparse_res = development_forecasting_engine.forecast_city_development(
        city_id="sparse_city",
        custom_observations=sparse_obs,
    )
    assert sparse_res["simulation_status"] == "Scenario Simulator"
    assert sparse_res["is_validated_predictive_model"] is False
    assert "Scenario Simulator" in sparse_res["validation_label"]
    assert "Insufficient" in sparse_res["validation_label"] or "Constrained" in sparse_res["validation_label"]

    # 2. Sufficient data (N = 7 for Koraput) -> Validated Model
    full_res = development_forecasting_engine.forecast_city_development(city_id="koraput")
    assert full_res["simulation_status"] == "Chronologically Validated Model"
    assert full_res["is_validated_predictive_model"] is True
    assert "Holdout MAE" in full_res["validation_label"]
    assert len(full_res["trajectories"]) > 0


# ---------------------------------------------------------------------------
# 3. REST API Integration Tests
# ---------------------------------------------------------------------------

def test_development_scoring_api_endpoints(client: TestClient):
    """
    Tests GET /api/v1/development/scoring/{city_id}
    and POST /api/v1/development/scoring/custom
    """
    # 1. GET scoring for Koraput
    res = client.get("/api/v1/development/scoring/koraput")
    assert res.status_code == 200
    data = res.json()
    assert data["city_id"] == "koraput"
    assert "composite_score" in data
    assert len(data["indicator_breakdown"]) > 0
    assert len(data["sector_scores"]) > 0
    assert "Proposed baseline methodology" in data["methodology_metadata"]["baseline_type"]

    # 2. POST custom scoring
    custom_payload = {
        "city_id": "test_district",
        "city_name": "Test Aspirational District",
        "indicators": {
            "doctor_ratio_per_10k": 12.0,
            "piped_water_coverage": 70.0,
            "literacy_rate": 65.0,
        },
    }
    custom_res = client.post("/api/v1/development/scoring/custom", json=custom_payload)
    assert custom_res.status_code == 200
    c_data = custom_res.json()
    assert c_data["city_id"] == "test_district"
    assert c_data["composite_score"] > 0


def test_development_forecasting_api_endpoints(client: TestClient):
    """
    Tests GET /api/v1/development/forecasting/{city_id}
    and POST /api/v1/development/forecasting/simulate
    """
    # 1. GET forecast for Koraput
    get_res = client.get("/api/v1/development/forecasting/koraput")
    assert get_res.status_code == 200
    f_data = get_res.json()
    assert f_data["city_id"] == "koraput"
    assert f_data["simulation_status"] == "Chronologically Validated Model"
    assert "mae" in f_data["error_metrics"]
    assert len(f_data["trajectories"]) >= 5

    # 2. POST custom simulation
    sim_payload = {
        "city_id": "koraput",
        "policy_boost_factor": 1.5,
        "custom_target_years": [2024, 2026, 2028, 2030, 2032],
    }
    sim_res = client.post("/api/v1/development/forecasting/simulate", json=sim_payload)
    assert sim_res.status_code == 200
    s_data = sim_res.json()
    assert len(s_data["trajectories"]) == 5
    # Accelerated policy should exceed status quo
    last_point = s_data["trajectories"][-1]
    assert last_point["accelerated_policy"] > last_point["status_quo"]
