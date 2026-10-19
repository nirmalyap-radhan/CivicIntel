from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.city import CityResponse, CityDevelopmentScore
from app.schemas.indicator import DevelopmentIndicatorResponse, CityComparisonResponse
from app.services.city_service import (
    get_cities,
    get_city_by_id,
    get_city_indicators,
    calculate_city_development_score,
    compare_cities,
)

router = APIRouter()


@router.get("/compare", response_model=CityComparisonResponse)
def compare_cities_endpoint(
    target_city_id: str = Query("koraput", description="Identifier of city to benchmark"),
    benchmark_city_id: str = Query("bhubaneswar", description="Identifier of reference benchmark city"),
    db: Session = Depends(get_db)
):
    """
    Computes comparative gap analysis and runway projection between two cities.
    Note: Registered before /{city_id} to ensure proper path routing.
    """
    return compare_cities(db, target_city_id=target_city_id, benchmark_city_id=benchmark_city_id)


@router.get("", response_model=List[CityResponse])
def read_cities(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Lists all monitored cities."""
    return get_cities(db, skip=skip, limit=limit)


@router.get("/{city_id}", response_model=CityResponse)
def read_city(
    city_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves full profile for a specific city (e.g. 'koraput' or 'bhubaneswar')."""
    return get_city_by_id(db, city_id=city_id)


@router.get("/{city_id}/indicators", response_model=List[DevelopmentIndicatorResponse])
def read_city_indicators(
    city_id: str,
    sector: Optional[str] = Query(None, description="Optional sector filter, e.g. 'healthcare'"),
    db: Session = Depends(get_db)
):
    """Retrieves verified and modeled development indicators for a city."""
    return get_city_indicators(db, city_id=city_id, sector=sector)


@router.get("/{city_id}/development-score", response_model=CityDevelopmentScore)
def read_city_development_score(
    city_id: str,
    db: Session = Depends(get_db)
):
    """
    Computes weighted multi-sector composite development score and benchmark comparison.
    """
    return calculate_city_development_score(db, city_id=city_id)
