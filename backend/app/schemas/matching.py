from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CategoryWeightsInput(BaseModel):
    geography_terrain: Optional[float] = Field(0.15, ge=0.0, description="Geography & terrain weight (default: 15%)")
    climate: Optional[float] = Field(0.10, ge=0.0, description="Climate & environment weight (default: 10%)")
    population: Optional[float] = Field(0.10, ge=0.0, description="Population characteristics weight (default: 10%)")
    economic_structure: Optional[float] = Field(0.15, ge=0.0, description="Economic structure weight (default: 15%)")
    natural_resources: Optional[float] = Field(0.15, ge=0.0, description="Natural resources weight (default: 15%)")
    education_human_dev: Optional[float] = Field(0.15, ge=0.0, description="Education & HDI weight (default: 15%)")
    infrastructure_healthcare: Optional[float] = Field(0.10, ge=0.0, description="Infrastructure weight (default: 10%)")
    tourism_cultural: Optional[float] = Field(0.10, ge=0.0, description="Tourism & culture weight (default: 10%)")


class CityMatchRequest(BaseModel):
    custom_weights: Optional[CategoryWeightsInput] = None
    top_k: int = Field(5, ge=1, le=20, description="Number of benchmark cities to return")
    min_maturity_delta: Optional[float] = Field(None, description="Minimum maturity score difference")
    aspirational_only: bool = Field(False, description="Filter for cities with development maturity >= target")
    sort_by: str = Field("similarity", description="Ranking strategy: 'similarity', 'maturity_delta', or 'benchmark_fit'")
    custom_candidate_pool: Optional[List[Dict[str, Any]]] = Field(None, description="Optional custom candidate city profiles")


class CandidateCityMeta(BaseModel):
    id: str
    name: str
    state: str
    category: str


class DevelopmentMaturityComparison(BaseModel):
    candidate_score: float
    target_score: float
    maturity_delta: float
    maturity_tier: str


class CategoryComparison(BaseModel):
    category: str
    label: str
    weight: float
    normalized_distance: float
    similarity_pct: float
    weighted_contribution: float
    features: Dict[str, Any]


class CandidateBenchmarkResult(BaseModel):
    candidate_city: CandidateCityMeta
    similarity_score: float
    similarity_pct: float
    weighted_distance: float
    benchmark_fit_score: float
    development_maturity: DevelopmentMaturityComparison
    category_comparisons: Dict[str, CategoryComparison]
    supporting_data_sources: List[str]
    missing_data_warnings: List[str]
    explanation: str


class TargetCityMeta(BaseModel):
    id: str
    name: str
    state: str
    category: str
    development_maturity_score: float


class MethodologyInfo(BaseModel):
    formula: str
    distance_metric: str
    normalization: str
    categorical_encoding: str
    maturity_handling: str
    active_weights: Dict[str, float]
    sort_criterion: str


class CityMatchResponse(BaseModel):
    target_city: TargetCityMeta
    methodology: MethodologyInfo
    total_candidates_evaluated: int
    candidates_returned_count: int
    top_candidates: List[CandidateBenchmarkResult]
