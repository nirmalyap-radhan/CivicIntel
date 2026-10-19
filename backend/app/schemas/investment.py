from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class InvestmentBase(BaseModel):
    city_id: str
    title: str = Field(..., min_length=5, max_length=256)
    sector: str
    location: str
    project_type: str
    capex_in_cr: float = Field(..., gt=0)
    expected_irr_percent: float = Field(..., gt=0)
    esg_rating: str = Field("A", pattern=r"^(A\+|A|B\+|B)$")
    status: str = Field("Expression of Interest")
    direct_jobs: int = Field(0, ge=0)
    brief: str = Field(..., min_length=10)

    # Marketplace statutory & evidence fields
    is_verified: bool = True
    verification_stage: str = Field("Verified DPR")
    supporting_evidence: Optional[str] = None
    potential_partners: Optional[str] = None
    regulatory_considerations: Optional[str] = None
    cost_breakdown_json: Optional[str] = None
    revenue_range_json: Optional[str] = None
    risk_factors_json: Optional[str] = None
    assumptions_disclosed: Optional[str] = None


class InvestmentCreate(InvestmentBase):
    pass


class InvestmentResponse(InvestmentBase):
    id: str
    created_at: datetime
    updated_at: datetime
    enquiry_count: int = 0

    model_config = ConfigDict(from_attributes=True)


# --- Local Resource Directory Schemas ---

class LocalResourceBase(BaseModel):
    city_id: str
    category: str = Field(
        ...,
        description="One of: agricultural, local_product, workforce, tourism, existing_business"
    )
    title: str = Field(..., min_length=3, max_length=256)
    description: str = Field(..., min_length=10)
    key_metrics: str = Field(..., min_length=3, max_length=256)
    certifications_or_anchor: Optional[str] = None
    growth_potential: str = Field(..., min_length=10)
    supporting_source: str = Field(..., min_length=3, max_length=256)


class LocalResourceCreate(LocalResourceBase):
    pass


class LocalResourceResponse(LocalResourceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Investment Enquiry & Expression of Interest Schemas ---

class InvestmentEnquiryCreate(BaseModel):
    investment_id: str
    investor_name: str = Field(..., min_length=2, max_length=128)
    investor_email: str = Field(..., min_length=5, max_length=128)
    organization: str = Field(..., min_length=2, max_length=256)
    proposed_investment_cr: Optional[float] = Field(None, ge=0)
    target_timeline: str = Field("3-6 months", description="Target investment horizon")
    message: str = Field(..., min_length=10)
    contact_phone: Optional[str] = None


class InvestmentEnquiryResponse(BaseModel):
    id: str
    investment_id: str
    investment_title: Optional[str] = None
    investor_name: str
    investor_email: str
    organization: str
    proposed_investment_cr: Optional[float] = None
    target_timeline: str
    message: str
    contact_phone: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Investment Analysis & Sensitivity Schemas ---

class InvestmentAnalysisRequest(BaseModel):
    investment_id: Optional[str] = None
    capex_in_cr: Optional[float] = Field(None, gt=0)
    capacity_utilization_percent: float = Field(75.0, ge=30.0, le=100.0)
    capital_subsidy_percent: float = Field(25.0, ge=0.0, le=60.0)
    tariff_realization_multiplier: float = Field(1.0, ge=0.5, le=2.0)
    cost_of_capital_percent: float = Field(10.0, ge=5.0, le=20.0)
    opex_annual_growth_percent: float = Field(5.0, ge=1.0, le=15.0)


class CostBreakdownItem(BaseModel):
    category: str
    amount_cr: float
    share_percent: float
    description: str


class ScenarioComparisonItem(BaseModel):
    scenario: str  # Conservative, Base Case, Accelerated
    capacity_utilization: float
    capital_subsidy_percent: float
    projected_irr_percent: float
    payback_period_years: float
    annual_ebitda_cr: float
    annual_revenue_cr: float
    confidence_level: str


class RevenueTrajectoryPoint(BaseModel):
    year: int
    min_revenue_cr: float
    expected_revenue_cr: float
    max_revenue_cr: float
    driver_notes: str


class RiskFactorItem(BaseModel):
    risk: str
    category: str  # Regulatory, Supply Chain, Market, Climate, Execution
    severity: str  # Low, Medium, High
    probability: str  # Low, Medium, High
    mitigation_strategy: str
    residual_risk: str


class SensitivityMatrixCell(BaseModel):
    capacity_utilization_percent: float
    capital_subsidy_percent: float
    irr_percent: float
    payback_years: float
    annual_ebitda_cr: float
    viability_label: str  # Prime, Viable, Moderate, Marginal


class InvestmentAnalysisResponse(BaseModel):
    investment_id: Optional[str] = None
    title: str
    base_capex_cr: float
    effective_capex_cr: float
    assumptions_applied: Dict[str, Any]
    scenario_comparisons: List[ScenarioComparisonItem]
    capex_breakdown: List[CostBreakdownItem]
    opex_breakdown: List[CostBreakdownItem]
    revenue_trajectory: List[RevenueTrajectoryPoint]
    risk_factors: List[RiskFactorItem]
    sensitivity_matrix: List[SensitivityMatrixCell]
    disclosed_assumptions: List[str]
    data_sources: List[str]
    regulatory_disclaimer: str
