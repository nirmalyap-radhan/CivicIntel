from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.city import City
from app.ml.city_dataset import (
    CURATED_CITIES_DATA,
    get_curated_benchmark_pool,
    get_curated_city_by_id,
)
from app.ml.city_matcher import CityBenchmarkMatcher, DEFAULT_CATEGORY_WEIGHTS
from app.schemas.matching import (
    CityMatchRequest,
    CityMatchResponse,
    MethodologyInfo,
)

router = APIRouter()


def _resolve_target_city_profile(city_id: str, db: Session) -> Dict[str, Any]:
    """
    Finds a city profile either from the curated multi-dimensional dataset
    or maps it dynamically from the relational database indicators.
    """
    normalized_id = city_id.strip().lower()

    # 1. Check curated registry
    curated = get_curated_city_by_id(normalized_id)
    if curated:
        return curated

    # 2. Check relational database
    db_city = db.query(City).filter(City.id == normalized_id).first()
    if not db_city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with identifier '{city_id}' was not found in curated registry or database."
        )

    # Build profile from DB attributes and indicators
    indicator_map = {ind.indicator_name: float(ind.value) for ind in db_city.indicators} if db_city.indicators else {}

    db_profile: Dict[str, Any] = {
        "id": db_city.id,
        "name": db_city.name,
        "state": db_city.state,
        "category": db_city.category,
        "elevation_m": indicator_map.get("elevation_m", 500.0),
        "terrain_type": indicator_map.get("terrain_type", "plateau"),
        "forest_cover_pct": indicator_map.get("forest_cover_pct", 25.0),
        "climate_zone": indicator_map.get("climate_zone", "tropical_wet_dry"),
        "annual_rainfall_mm": indicator_map.get("annual_rainfall_mm", 1200.0),
        "summer_max_temp_c": indicator_map.get("summer_max_temp_c", 36.0),
        "population": db_city.population,
        "urbanization_pct": indicator_map.get("urbanization_pct", 30.0),
        "tribal_demographic_pct": indicator_map.get("tribal_demographic_pct", 10.0),
        "primary_economic_pillar": indicator_map.get("primary_economic_pillar", "agriculture_forestry"),
        "formal_employment_pct": indicator_map.get("formal_employment_rate", 35.0),
        "per_capita_income_inr": db_city.per_capita_income_inr,
        "natural_resources": ["groundwater", "solar"],
        "soil_fertility_index": indicator_map.get("soil_fertility_index", 65.0),
        "water_abundance_index": indicator_map.get("water_abundance_index", 70.0),
        "literacy_rate": db_city.literacy_rate,
        "higher_edu_institutes_count": int(indicator_map.get("higher_edu_institutes_count", 10)),
        "doctor_ratio_per_10k": indicator_map.get("doctor_ratio_per_10k", 8.0),
        "hospital_bed_ratio_per_1k": indicator_map.get("hospital_bed_ratio_per_1k", 1.8),
        "paved_road_pct": indicator_map.get("paved_road_pct", 80.0),
        "piped_water_pct": indicator_map.get("piped_water_coverage_pct", 60.0),
        "broadband_pct": indicator_map.get("broadband_penetration_pct", 50.0),
        "cultural_heritage_type": "regional_heritage",
        "eco_tourism_potential": 6.5,
        "annual_tourist_footfall": 250000,
        "development_maturity_score": 60.0,
        "data_sources": ["CivicIntel Relational City Store"],
    }
    return db_profile



@router.get("/matching-weights", response_model=Dict[str, Any])
@router.get("/methodology-weights", response_model=Dict[str, Any])
def get_matching_methodology_weights():
    """
    Retrieves the baseline methodology, mathematical formulations,
    and illustrative parameter weights defined in the CivicIntel Research Paper.
    """
    return {
        "methodology": {
            "formula_similarity": "S(A, B) = 1 / (1 + D(A, B))",
            "formula_distance": "D(A, B) = sum(w_j * d_j(A, B))",
            "normalization": "Min-Max scaling: (x - x_min) / (x_max - x_min)",
            "categorical_distance": "Exact match Gower distance (0.0 if equal, 1.0 if different)",
            "resource_similarity": "Jaccard distance: 1.0 - (|A intersect B| / |A union B|)",
            "maturity_concept": "Development maturity is tracked separately from contextual similarity so planners find aspirational benchmarks rather than lateral replicas of current deficits.",
        },
        "default_weights": DEFAULT_CATEGORY_WEIGHTS,
        "parameter_descriptions": {
            "geography_terrain": "Elevation, terrain topology (hills, plateau, plain), and forest cover (15%)",
            "climate": "Rainfall and temperature ranges impacting agriculture and habitability (10%)",
            "population": "Population size, urbanization rate, and demographic composition (10%)",
            "economic_structure": "Primary economic sector, formal employment, and per-capita income (15%)",
            "natural_resources": "Mineral, agricultural, agro-forestry, and hydro endowments (15%)",
            "education_human_dev": "Literacy rates, educational institutions, and human capital (15%)",
            "infrastructure_healthcare": "Civic utilities, piped water, road network, healthcare capacity (10%)",
            "tourism_cultural": "Cultural heritage type, eco-tourism potential, and annual footfall (10%)",
        },
    }


@router.post("/{city_id}/match-benchmarks", response_model=CityMatchResponse)
def match_city_benchmarks_post(
    city_id: str,
    payload: CityMatchRequest,
    db: Session = Depends(get_db),
):
    """
    Executes AI City Benchmark Matching for the specified city.
    
    Calculates weighted similarity distances across 8 parameter dimensions:
    - Geography & Terrain (15%)
    - Climate (10%)
    - Population (10%)
    - Economic Structure (15%)
    - Natural Resources (15%)
    - Education & HDI (15%)
    - Infrastructure & Healthcare (10%)
    - Tourism & Cultural Profile (10%)
    
    Supports:
    - Custom feature weights
    - Aspirational development maturity filtering
    - Feature-level comparison breakdowns
    - Automated explainability narratives
    """
    target_profile = _resolve_target_city_profile(city_id, db)

    # Prepare weights
    weights = payload.custom_weights.model_dump() if payload.custom_weights else None

    # Prepare candidates
    candidate_pool = (
        payload.custom_candidate_pool
        if payload.custom_candidate_pool is not None
        else get_curated_benchmark_pool(exclude_city_id=city_id)
    )

    try:
        matcher = CityBenchmarkMatcher(custom_weights=weights)
        result = matcher.match_city(
            target_city=target_profile,
            candidate_pool=candidate_pool,
            top_k=payload.top_k,
            min_maturity_delta=payload.min_maturity_delta,
            aspirational_only=payload.aspirational_only,
            sort_by=payload.sort_by,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{city_id}/match-benchmarks", response_model=CityMatchResponse)
def match_city_benchmarks_get(
    city_id: str,
    top_k: int = Query(5, ge=1, le=20, description="Top candidates to return"),
    aspirational_only: bool = Query(False, description="Filter candidates where maturity >= target"),
    min_maturity_delta: Optional[float] = Query(None, description="Minimum maturity gap"),
    sort_by: str = Query("similarity", description="'similarity', 'maturity_delta', or 'benchmark_fit'"),
    db: Session = Depends(get_db),
):
    """
    Convenience GET endpoint to benchmark a city with standard paper weights.
    """
    target_profile = _resolve_target_city_profile(city_id, db)
    candidate_pool = get_curated_benchmark_pool(exclude_city_id=city_id)

    try:
        matcher = CityBenchmarkMatcher()
        return matcher.match_city(
            target_city=target_profile,
            candidate_pool=candidate_pool,
            top_k=top_k,
            min_maturity_delta=min_maturity_delta,
            aspirational_only=aspirational_only,
            sort_by=sort_by,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


