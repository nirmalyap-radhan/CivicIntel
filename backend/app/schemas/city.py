from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class CityBase(BaseModel):
    name: str
    state: str = "Odisha"
    category: str
    population: int
    area_sq_km: float
    literacy_rate: float
    per_capita_income_inr: float
    subdivisions_count: int = 1
    wards_or_blocks_count: int = 1
    latitude: float
    longitude: float
    description: Optional[str] = None
    geography: Optional[str] = None
    administrative_hq: Optional[str] = None


class CityCreate(CityBase):
    id: str = Field(..., description="Unique city slug identifier, e.g., 'koraput'")


class CityResponse(CityBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SectorScore(BaseModel):
    sector: str
    score: float
    weight: float
    indicators_count: int


class CityDevelopmentScore(BaseModel):
    city_id: str
    city_name: str
    composite_score: float
    benchmark_city_id: Optional[str] = None
    benchmark_city_name: Optional[str] = None
    benchmark_score: Optional[float] = None
    score_delta: Optional[float] = None
    sector_scores: List[SectorScore]
    methodology: str = "CivicIntel Weighted Multi-Sector Composite Model"
    is_demonstration: bool = True
    data_disclosure: str = "Clearly labeled demonstration model synthesized for urban benchmarking."
