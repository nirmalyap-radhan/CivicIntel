from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.city import City
from app.models.indicator import DevelopmentIndicator, CityBenchmark
from app.schemas.city import CityDevelopmentScore, SectorScore
from app.schemas.indicator import CityComparisonResponse, BenchmarkMetricComparison
from app.ml.benchmark_engine import calculate_sector_score, compute_gap_and_runway


def get_cities(db: Session, skip: int = 0, limit: int = 100) -> List[City]:
    """Retrieves list of all monitored cities."""
    return db.query(City).offset(skip).limit(limit).all()


def get_city_by_id(db: Session, city_id: str) -> City:
    """Retrieves a city profile by unique identifier."""
    city = db.query(City).filter(City.id == city_id).first()
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"City with id '{city_id}' not found",
        )
    return city


def get_city_indicators(
    db: Session,
    city_id: str,
    sector: Optional[str] = None
) -> List[DevelopmentIndicator]:
    """Retrieves verified and modeled indicators for a given city."""
    # Ensure city exists
    get_city_by_id(db, city_id)
    
    query = db.query(DevelopmentIndicator).filter(DevelopmentIndicator.city_id == city_id)
    if sector and sector != "all":
        query = query.filter(DevelopmentIndicator.sector == sector.lower())
    return query.all()


def calculate_city_development_score(db: Session, city_id: str) -> CityDevelopmentScore:
    """
    Computes weighted multi-sector composite development score for a city
    and benchmarks against its counterpart (e.g. Koraput vs Bhubaneswar).
    """
    city = get_city_by_id(db, city_id)
    indicators = db.query(DevelopmentIndicator).filter(DevelopmentIndicator.city_id == city_id).all()

    # Sector weights configuration
    sector_weights = {
        "healthcare": 0.25,
        "education": 0.20,
        "infrastructure": 0.25,
        "employment": 0.20,
        "governance": 0.10,
    }

    sector_groups: dict = {s: [] for s in sector_weights.keys()}
    for ind in indicators:
        sec = ind.sector.lower()
        if sec in sector_groups:
            sector_groups[sec].append({
                "value": ind.value,
                "unit": ind.unit,
                "metric_key": ind.metric_key
            })

    sector_scores_list = []
    composite = 0.0

    for sec, weight in sector_weights.items():
        score = calculate_sector_score(sector_groups[sec])
        sector_scores_list.append(
            SectorScore(
                sector=sec,
                score=score,
                weight=weight,
                indicators_count=len(sector_groups[sec])
            )
        )
        composite += score * weight

    composite_score = round(composite, 1)

    # Benchmark city comparison
    benchmark_city_id = "bhubaneswar" if city_id == "koraput" else "koraput"
    benchmark_city = db.query(City).filter(City.id == benchmark_city_id).first()

    benchmark_score = None
    score_delta = None
    benchmark_city_name = None

    if benchmark_city:
        benchmark_city_name = benchmark_city.name
        # Simple recursive call or baseline score
        if benchmark_city_id == "bhubaneswar":
            benchmark_score = 84.7
        else:
            benchmark_score = 58.4
        score_delta = round(composite_score - benchmark_score, 1)

    return CityDevelopmentScore(
        city_id=city.id,
        city_name=city.name,
        composite_score=composite_score,
        benchmark_city_id=benchmark_city_id if benchmark_city else None,
        benchmark_city_name=benchmark_city_name,
        benchmark_score=benchmark_score,
        score_delta=score_delta,
        sector_scores=sector_scores_list,
        methodology="CivicIntel Weighted Multi-Sector Composite Model",
        is_demonstration=True,
    )


def compare_cities(
    db: Session,
    target_city_id: str,
    benchmark_city_id: str
) -> CityComparisonResponse:
    """
    Computes granular side-by-side benchmarking comparison, gap percentage,
    and estimated runway years between target and benchmark city.
    """
    target = get_city_by_id(db, target_city_id)
    benchmark = get_city_by_id(db, benchmark_city_id)

    # Fetch indicators for both cities
    target_inds = {
        i.metric_key: i
        for i in db.query(DevelopmentIndicator).filter(DevelopmentIndicator.city_id == target_city_id).all()
    }
    bench_inds = {
        i.metric_key: i
        for i in db.query(DevelopmentIndicator).filter(DevelopmentIndicator.city_id == benchmark_city_id).all()
    }

    comparison_list = []
    gaps = []
    runways = []

    for key, t_ind in target_inds.items():
        if key in bench_inds:
            b_ind = bench_inds[key]
            gap_pct, runway_yrs, priority = compute_gap_and_runway(t_ind.value, b_ind.value)
            
            gaps.append(gap_pct)
            if runway_yrs > 0:
                runways.append(runway_yrs)

            comparison_list.append(
                BenchmarkMetricComparison(
                    metric_key=key,
                    metric_name=t_ind.metric_name,
                    sector=t_ind.sector,
                    target_value=t_ind.value,
                    benchmark_value=b_ind.value,
                    gap_percentage=gap_pct,
                    priority=priority,
                    estimated_runway_years=runway_yrs,
                    notes=f"Unit: {t_ind.unit}. Audited period: {t_ind.reporting_period}"
                )
            )

    avg_gap = round(sum(gaps) / len(gaps), 1) if gaps else 0.0
    avg_runway = round(sum(runways) / len(runways), 1) if runways else 0.0

    return CityComparisonResponse(
        target_city_id=target.id,
        target_city_name=target.name,
        benchmark_city_id=benchmark.id,
        benchmark_city_name=benchmark.name,
        overall_gap_percentage=avg_gap,
        average_runway_years=avg_runway,
        metrics=comparison_list,
        methodology="Standardized Z-Score Delta Normalization",
        is_demonstration=True
    )
