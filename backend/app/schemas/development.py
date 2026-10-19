"""
Pydantic Schemas for CivicIntel Development Scoring & Forecasting Engines.
Enforces transparent indicator normalization breakdowns, chronological error metrics,
and scientific labeling.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# 1. Capability A: Development Scoring Schemas
# ---------------------------------------------------------------------------

class IndicatorScoringDetail(BaseModel):
    metric_key: str = Field(..., description="Unique key of the indicator")
    metric_name: str = Field(..., description="Human-readable title")
    sector: str = Field(..., description="Sector taxonomy (Healthcare, Infrastructure, etc.)")
    unit: str = Field(..., description="Measurement unit (e.g. Doctors / 10k, % Households)")
    direction: str = Field(..., description="'higher_is_better' | 'lower_is_better'")
    observed_value: float = Field(..., description="Observed raw indicator value x_i")
    lower_bound_L: float = Field(..., description="Justified lower reference value L_i")
    upper_bound_U: float = Field(..., description="Justified upper reference value U_i")
    lower_justification: str = Field(..., description="Source rationale for lower threshold")
    upper_justification: str = Field(..., description="Source rationale for upper threshold")
    normalized_score_N_i: float = Field(..., description="Normalized score N_i in [0, 100]")
    weight_w_i: float = Field(..., description="Indicator weight w_i (weights sum to 1.0)")
    weighted_contribution: float = Field(..., description="w_i * N_i contribution to composite score")
    methodological_limitations: str = Field(..., description="Documented caveats (e.g., geographic access, potability)")


class SectorScoreDetail(BaseModel):
    sector: str
    sector_score: float = Field(..., description="Sector sub-score (0-100)")
    sector_weight: float = Field(..., description="Sector cumulative weight")


class MethodologyMetadata(BaseModel):
    baseline_type: str = Field(..., description="Methodology status notice")
    formula_higher_is_better: str
    formula_lower_is_better: str
    composite_formula: str
    weights_sum_to_one: bool
    general_limitations: List[str]


class DevelopmentScoreResponse(BaseModel):
    city_id: str
    city_name: str
    composite_score: float = Field(..., description="Composite development score D (0-100)")
    maturity_tier: str
    indicator_breakdown: List[IndicatorScoringDetail]
    sector_scores: List[SectorScoreDetail]
    methodology_metadata: MethodologyMetadata


class DevelopmentScoringCustomRequest(BaseModel):
    city_id: Optional[str] = "custom_city"
    city_name: Optional[str] = "Custom Scenario City"
    indicators: Dict[str, float] = Field(..., description="Key-value mapping of metric_key to observed value")
    weights_override: Optional[Dict[str, float]] = Field(None, description="Optional custom weights")


# ---------------------------------------------------------------------------
# 2. Capability B: Development Forecasting Schemas
# ---------------------------------------------------------------------------

class ErrorMetrics(BaseModel):
    mae: float = Field(..., description="Mean Absolute Error: (1/n) * sum(|y_i - y_hat_i|)")
    rmse: float = Field(..., description="Root Mean Squared Error: sqrt((1/n) * sum((y_i - y_hat_i)^2))")
    mape: float = Field(..., description="Mean Absolute Percentage Error (%)")
    sample_size: int = Field(..., description="Holdout sample count evaluated")


class ModelComparisonItem(BaseModel):
    model_name: str
    description: str
    metrics: ErrorMetrics


class ConfidenceInterval(BaseModel):
    lower: float
    upper: float
    margin: float


class TrajectoryPoint(BaseModel):
    year: str
    year_num: int
    status_quo: float
    accelerated_policy: float
    benchmark_pace: float
    policy_net_gain: float
    confidence_interval_95: ConfidenceInterval
    milestone: Optional[str] = None


class DevelopmentForecastResponse(BaseModel):
    city_id: str
    simulation_status: str = Field(..., description="'Chronologically Validated Model' or 'Scenario Simulator'")
    is_validated_predictive_model: bool
    validation_label: str
    champion_model: str
    error_metrics: ErrorMetrics
    model_comparisons: Dict[str, ModelComparisonItem]
    annual_secular_drift_rate: float
    trajectories: List[TrajectoryPoint]
    methodology_caveat: str
    governance_note: str


class ForecastSimulationRequest(BaseModel):
    city_id: str = "koraput"
    policy_boost_factor: float = Field(1.0, ge=0.0, le=3.0, description="Multiplier for policy reform intensity")
    custom_target_years: Optional[List[int]] = Field(None, description="Custom projection horizon years")
