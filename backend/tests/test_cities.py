def test_get_cities_list(client):
    response = client.get("/api/v1/cities")
    assert response.status_code == 200
    cities = response.json()
    assert len(cities) >= 2
    city_ids = [c["id"] for c in cities]
    assert "koraput" in city_ids
    assert "bhubaneswar" in city_ids


def test_get_city_by_id(client):
    response = client.get("/api/v1/cities/koraput")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Koraput"
    assert data["state"] == "Odisha"
    assert data["category"] == "Aspirational District Hub"
    assert data["population"] > 1000000


def test_get_city_not_found(client):
    response = client.get("/api/v1/cities/non_existent_city")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_city_indicators_data_validation(client):
    response = client.get("/api/v1/cities/koraput/indicators")
    assert response.status_code == 200
    indicators = response.json()
    assert len(indicators) > 0

    # Strict Data Validation Requirement Check:
    # Every indicator must support: Value, Unit, Reporting period, Data source, Collection date, Verification status
    for ind in indicators:
        assert "value" in ind and isinstance(ind["value"], (int, float))
        assert "unit" in ind and len(ind["unit"]) > 0
        assert "reporting_period" in ind and len(ind["reporting_period"]) > 0
        assert "data_source" in ind and len(ind["data_source"]) > 0
        assert "collection_date" in ind
        assert "verification_status" in ind
        # Demonstration data must be explicitly flagged
        assert ind["is_demonstration"] is True


def test_get_city_indicators_filtered_by_sector(client):
    response = client.get("/api/v1/cities/koraput/indicators?sector=healthcare")
    assert response.status_code == 200
    indicators = response.json()
    assert len(indicators) > 0
    for ind in indicators:
        assert ind["sector"] == "healthcare"


def test_get_city_development_score(client):
    response = client.get("/api/v1/cities/koraput/development-score")
    assert response.status_code == 200
    data = response.json()
    assert data["city_id"] == "koraput"
    assert data["city_name"] == "Koraput"
    assert 0 <= data["composite_score"] <= 100
    assert data["benchmark_city_id"] == "bhubaneswar"
    assert len(data["sector_scores"]) > 0
    assert data["is_demonstration"] is True


def test_compare_cities(client):
    response = client.get("/api/v1/cities/compare?target_city_id=koraput&benchmark_city_id=bhubaneswar")
    assert response.status_code == 200
    data = response.json()
    assert data["target_city_id"] == "koraput"
    assert data["benchmark_city_id"] == "bhubaneswar"
    assert len(data["metrics"]) > 0
    
    first_metric = data["metrics"][0]
    assert "metric_key" in first_metric
    assert "target_value" in first_metric
    assert "benchmark_value" in first_metric
    assert "gap_percentage" in first_metric
    assert "priority" in first_metric
    assert "estimated_runway_years" in first_metric
