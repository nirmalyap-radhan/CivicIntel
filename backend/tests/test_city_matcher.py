import pytest
from copy import deepcopy
from fastapi.testclient import TestClient

from app.ml.city_dataset import CURATED_CITIES_DATA, get_curated_city_by_id
from app.ml.city_matcher import CityBenchmarkMatcher, DEFAULT_CATEGORY_WEIGHTS


# ---------------------------------------------------------
# Test Fixtures & Synthetic Base Data
# ---------------------------------------------------------

@pytest.fixture
def synthetic_base_city():
    return {
        "id": "synthetic_target",
        "name": "Synthetic Target City",
        "state": "Odisha",
        "category": "Test Target",
        "elevation_m": 800.0,
        "terrain_type": "highland_hills",
        "forest_cover_pct": 35.0,
        "climate_zone": "subtropical_highland",
        "annual_rainfall_mm": 1500.0,
        "summer_max_temp_c": 32.0,
        "population": 1000000,
        "urbanization_pct": 20.0,
        "tribal_demographic_pct": 45.0,
        "primary_economic_pillar": "agriculture_forestry",
        "formal_employment_pct": 25.0,
        "per_capita_income_inr": 70000.0,
        "natural_resources": ["coffee", "spices", "timber"],
        "soil_fertility_index": 70.0,
        "water_abundance_index": 75.0,
        "literacy_rate": 50.0,
        "higher_edu_institutes_count": 8,
        "doctor_ratio_per_10k": 5.0,
        "hospital_bed_ratio_per_1k": 1.0,
        "paved_road_pct": 70.0,
        "piped_water_pct": 45.0,
        "broadband_pct": 25.0,
        "cultural_heritage_type": "indigenous_tribal_crafts",
        "eco_tourism_potential": 8.0,
        "annual_tourist_footfall": 120000,
        "development_maturity_score": 55.0,
        "data_sources": ["CivicIntel Unit Test Registry"],
    }


@pytest.fixture
def synthetic_benchmark_pool(synthetic_base_city):
    # Candidate 1: Developed Highland Benchmark (similar context, higher maturity)
    c1 = deepcopy(synthetic_base_city)
    c1["id"] = "benchmark_coorg_like"
    c1["name"] = "Benchmark Coorg-Like"
    c1["development_maturity_score"] = 80.0
    c1["formal_employment_pct"] = 55.0
    c1["per_capita_income_inr"] = 180000.0
    c1["literacy_rate"] = 85.0
    c1["piped_water_pct"] = 85.0

    # Candidate 2: Different Geography (coastal plain, service economy)
    c2 = deepcopy(synthetic_base_city)
    c2["id"] = "benchmark_coastal"
    c2["name"] = "Benchmark Coastal City"
    c2["terrain_type"] = "coastal_plain"
    c2["climate_zone"] = "tropical_wet_dry"
    c2["elevation_m"] = 50.0
    c2["primary_economic_pillar"] = "services_it_admin"
    c2["natural_resources"] = ["groundwater", "solar"]
    c2["development_maturity_score"] = 85.0

    # Candidate 3: Developing Peer (similar context, low maturity)
    c3 = deepcopy(synthetic_base_city)
    c3["id"] = "peer_low_maturity"
    c3["name"] = "Peer Developing City"
    c3["development_maturity_score"] = 48.0
    c3["literacy_rate"] = 44.0

    return [c1, c2, c3]


# ---------------------------------------------------------
# 1. Identical City Profiles Test
# ---------------------------------------------------------

def test_identical_city_profiles(synthetic_base_city):
    """
    Identical city profiles must yield 0 distance and exactly 1.0 similarity (100%).
    """
    matcher = CityBenchmarkMatcher()
    identical_candidate = deepcopy(synthetic_base_city)
    identical_candidate["id"] = "identical_candidate"
    identical_candidate["name"] = "Identical Twin City"

    res = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=[identical_candidate],
        top_k=1,
    )

    candidate_res = res["top_candidates"][0]
    assert candidate_res["weighted_distance"] == 0.0
    assert candidate_res["similarity_score"] == 1.0
    assert candidate_res["similarity_pct"] == 100.0
    assert candidate_res["development_maturity"]["maturity_delta"] == 0.0


# ---------------------------------------------------------
# 2. Missing Features & Imputation Test
# ---------------------------------------------------------

def test_missing_features_imputation_and_warning(synthetic_base_city, synthetic_benchmark_pool):
    """
    Missing features must be imputed with pool median and explicit warnings attached.
    """
    incomplete_target = deepcopy(synthetic_base_city)
    # Remove some numeric, categorical, and multi-label features
    del incomplete_target["piped_water_pct"]
    incomplete_target["summer_max_temp_c"] = None
    del incomplete_target["terrain_type"]
    incomplete_target["natural_resources"] = None

    matcher = CityBenchmarkMatcher()
    res = matcher.match_city(
        target_city=incomplete_target,
        candidate_pool=synthetic_benchmark_pool,
        top_k=3,
    )

    top_candidate = res["top_candidates"][0]
    warnings = top_candidate["missing_data_warnings"]

    # Verify warnings were recorded for target
    assert any("piped_water_pct" in w for w in warnings)
    assert any("summer_max_temp_c" in w for w in warnings)
    assert any("terrain_type" in w for w in warnings)
    assert any("natural_resources" in w for w in warnings)

    # Calculation must still complete successfully with valid score
    assert 0.0 < top_candidate["similarity_score"] <= 1.0


# ---------------------------------------------------------
# 3. Invalid Values Validation Test
# ---------------------------------------------------------

def test_invalid_values_validation(synthetic_base_city, synthetic_benchmark_pool):
    """
    Out of bounds or negative invalid values must raise ValueError.
    """
    matcher = CityBenchmarkMatcher()

    # Case A: Negative population
    invalid_city_pop = deepcopy(synthetic_base_city)
    invalid_city_pop["population"] = -50000
    with pytest.raises(ValueError, match="below minimum allowed"):
        matcher.match_city(target_city=invalid_city_pop, candidate_pool=synthetic_benchmark_pool)

    # Case B: Percentage over 100%
    invalid_city_pct = deepcopy(synthetic_base_city)
    invalid_city_pct["literacy_rate"] = 145.0
    with pytest.raises(ValueError, match="exceeds maximum allowed"):
        matcher.match_city(target_city=invalid_city_pct, candidate_pool=synthetic_benchmark_pool)

    # Case C: Non-numeric invalid value
    invalid_city_str = deepcopy(synthetic_base_city)
    invalid_city_str["elevation_m"] = "not-a-number"
    with pytest.raises(ValueError, match="must be numeric"):
        matcher.match_city(target_city=invalid_city_str, candidate_pool=synthetic_benchmark_pool)


# ---------------------------------------------------------
# 4. Duplicate Cities Handling Test
# ---------------------------------------------------------

def test_duplicate_cities_handling(synthetic_base_city, synthetic_benchmark_pool):
    """
    Candidate pool with duplicate IDs must be deduplicated without crashing or skewing.
    """
    matcher = CityBenchmarkMatcher()
    pool_with_dupes = synthetic_benchmark_pool + [
        deepcopy(synthetic_benchmark_pool[0]),
        deepcopy(synthetic_benchmark_pool[1]),
        # Also include target itself in candidate pool to verify exclusion
        deepcopy(synthetic_base_city),
    ]

    res = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=pool_with_dupes,
        top_k=10,
    )

    # Check that candidate count matches distinct pool (3 distinct, target excluded)
    assert res["candidates_returned_count"] == 3
    candidate_ids = [c["candidate_city"]["id"] for c in res["top_candidates"]]
    assert len(candidate_ids) == len(set(candidate_ids))
    assert synthetic_base_city["id"] not in candidate_ids


# ---------------------------------------------------------
# 5. Different Feature Scales Normalization Test
# ---------------------------------------------------------

def test_different_feature_scales_normalization(synthetic_base_city):
    """
    Normalization must map all numerical dimensions into [0, 1]
    so that huge scales (e.g. population in millions) don't overpower
    tiny scales (e.g. doctor ratio in single digits).
    """
    matcher = CityBenchmarkMatcher()

    # City differing ONLY in population (1M vs 5M)
    c_pop = deepcopy(synthetic_base_city)
    c_pop["id"] = "cand_pop"
    c_pop["name"] = "Candidate Pop Delta"
    c_pop["population"] = 5000000

    # City differing ONLY in doctor ratio (5.0 vs 25.0)
    c_doc = deepcopy(synthetic_base_city)
    c_doc["id"] = "cand_doc"
    c_doc["name"] = "Candidate Doctor Delta"
    c_doc["doctor_ratio_per_10k"] = 25.0

    res = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=[c_pop, c_doc],
        top_k=2,
    )

    # In both cases, distances must be strictly bounded in [0, 1]
    for cand in res["top_candidates"]:
        assert 0.0 <= cand["weighted_distance"] <= 1.0
        assert 0.5 <= cand["similarity_score"] <= 1.0


# ---------------------------------------------------------
# 6. Incomplete Benchmark Data Test
# ---------------------------------------------------------

def test_incomplete_benchmark_data(synthetic_base_city):
    """
    Candidates with missing attributes must still be processed safely with median imputation.
    """
    incomplete_cand = {
        "id": "partial_city",
        "name": "Partial City Profile",
        "state": "Karnataka",
        "category": "Partial Benchmark",
        "elevation_m": 900.0,
        "population": 600000,
        # Many features intentionally omitted!
        "development_maturity_score": 75.0,
    }

    matcher = CityBenchmarkMatcher()
    res = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=[incomplete_cand],
        top_k=1,
    )

    assert res["candidates_returned_count"] == 1
    cand_res = res["top_candidates"][0]
    assert cand_res["candidate_city"]["id"] == "partial_city"
    assert len(cand_res["missing_data_warnings"]) > 0
    assert 0.0 < cand_res["similarity_score"] <= 1.0


# ---------------------------------------------------------
# 7. Aspirational Maturity Filtering & Separation Test
# ---------------------------------------------------------

def test_aspirational_maturity_filtering(synthetic_base_city, synthetic_benchmark_pool):
    """
    When aspirational_only is True, candidate cities with lower maturity than target
    must be filtered out.
    """
    matcher = CityBenchmarkMatcher()

    # Target has maturity 55.0.
    # synthetic_benchmark_pool has:
    # - benchmark_coorg_like: 80.0 (delta +25)
    # - benchmark_coastal: 85.0 (delta +30)
    # - peer_low_maturity: 48.0 (delta -7)

    # 1. Without filtering: returns all 3
    res_all = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=synthetic_benchmark_pool,
        aspirational_only=False,
    )
    assert res_all["candidates_returned_count"] == 3

    # 2. With aspirational_only=True: peer_low_maturity (48.0) must be excluded
    res_asp = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=synthetic_benchmark_pool,
        aspirational_only=True,
    )
    assert res_asp["candidates_returned_count"] == 2
    for cand in res_asp["top_candidates"]:
        assert cand["development_maturity"]["maturity_delta"] >= 0.0
        assert cand["candidate_city"]["id"] != "peer_low_maturity"


# ---------------------------------------------------------
# 8. Custom Weights Configuration Test
# ---------------------------------------------------------

def test_custom_weights_configuration(synthetic_base_city, synthetic_benchmark_pool):
    """
    Matcher must accept custom weights, normalize them to sum to 1.0,
    and prioritize the weighted categories.
    """
    # Heavily weight geography & natural resources
    custom_weights = {
        "geography_terrain": 0.50,
        "climate": 0.0,
        "population": 0.0,
        "economic_structure": 0.0,
        "natural_resources": 0.50,
        "education_human_dev": 0.0,
        "infrastructure_healthcare": 0.0,
        "tourism_cultural": 0.0,
    }

    matcher = CityBenchmarkMatcher(custom_weights=custom_weights)
    res = matcher.match_city(
        target_city=synthetic_base_city,
        candidate_pool=synthetic_benchmark_pool,
        top_k=2,
    )

    # Benchmark Coorg-like (same terrain & resources) should achieve very high similarity
    top_cand = res["top_candidates"][0]
    assert top_cand["candidate_city"]["id"] == "benchmark_coorg_like"
    assert top_cand["similarity_pct"] >= 95.0
    assert sum(res["methodology"]["active_weights"].values()) == pytest.approx(1.0)


# ---------------------------------------------------------
# 9. Real Curated Koraput Benchmark Test & Explainability
# ---------------------------------------------------------

def test_real_koraput_curated_benchmarks():
    """
    Validates the matching engine on real curated Koraput data from CivicIntel paper.
    Koraput should find Kodagu (Coorg) and Shillong as top aspirational benchmarks.
    """
    koraput = get_curated_city_by_id("koraput")
    assert koraput is not None

    matcher = CityBenchmarkMatcher()
    res = matcher.match_city(
        target_city=koraput,
        candidate_pool=CURATED_CITIES_DATA,
        top_k=5,
        aspirational_only=True,
    )

    assert res["candidates_returned_count"] >= 3
    top_cand = res["top_candidates"][0]

    # Coorg should be ranked top due to shared highland terrain, coffee/spices, and high maturity
    assert top_cand["candidate_city"]["id"] == "coorg_madikeri"
    assert top_cand["similarity_score"] > 0.70
    assert top_cand["similarity_pct"] >= 70.0
    assert top_cand["development_maturity"]["maturity_delta"] > 15.0

    # Ensure explanation contains data citations and key narrative
    assert "was selected because it" in top_cand["explanation"]
    assert len(top_cand["supporting_data_sources"]) > 0
    assert "geography_terrain" in top_cand["category_comparisons"]


# ---------------------------------------------------------
# 10. API Endpoints Test (GET & POST)
# ---------------------------------------------------------

def test_matching_api_endpoints(client: TestClient):
    """
    Tests GET and POST /api/v1/cities/{city_id}/match-benchmarks and methodology weights.
    """
    # 1. GET matching-weights metadata
    weights_res = client.get("/api/v1/cities/matching-weights")
    assert weights_res.status_code == 200
    weights_data = weights_res.json()
    assert "methodology" in weights_data
    assert "default_weights" in weights_data
    assert weights_data["default_weights"]["geography_terrain"] == 0.15

    # 2. GET Koraput benchmarks
    get_res = client.get("/api/v1/cities/koraput/match-benchmarks?top_k=5&aspirational_only=true")
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["target_city"]["id"] == "koraput"
    assert len(data["top_candidates"]) <= 5
    assert data["top_candidates"][0]["candidate_city"]["id"] == "coorg_madikeri"

    # 3. POST with custom weights
    post_res = client.post(
        "/api/v1/cities/koraput/match-benchmarks",
        json={
            "top_k": 3,
            "aspirational_only": True,
            "sort_by": "benchmark_fit",
            "custom_weights": {
                "geography_terrain": 0.30,
                "natural_resources": 0.30,
                "economic_structure": 0.20,
                "education_human_dev": 0.20,
            },
        },
    )
    assert post_res.status_code == 200
    post_data = post_res.json()
    assert post_data["candidates_returned_count"] == 3
    assert post_data["methodology"]["sort_criterion"] == "benchmark_fit"
