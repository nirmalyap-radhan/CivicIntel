from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class BenchmarkEvidenceItem(BaseModel):
    metric: str
    target_value: float
    benchmark_value: float
    gap_percentage: float
    benchmark_city: str
    precedent_summary: str


class GovernmentSchemeItem(BaseModel):
    scheme_name: str
    ministry: str
    funding_share: str
    statutory_basis: Optional[str] = None
    source_citation: str


class ExpectedOutcomeItem(BaseModel):
    kpi: str
    baseline: str
    projected_target: str
    target_horizon_months: int
    confidence_level: str = "High"


class ImplementationRiskItem(BaseModel):
    risk_description: str
    severity: str = Field(..., pattern="^(Low|Medium|High|Critical)$")
    mitigation_strategy: str


class SourceCitationItem(BaseModel):
    document_title: str
    publisher: str
    year: int
    relevant_passage: str
    citation_reference: str


class PolicyRecommendationItem(BaseModel):
    id: str
    city_id: str
    title: str
    sector: str
    priority: str = Field(..., pattern="^(Immediate|High|Medium|Strategic)$")
    problem_statement: str
    proposed_intervention: str
    benchmark_evidence: List[BenchmarkEvidenceItem] = Field(default_factory=list)
    local_requirements: List[str] = Field(default_factory=list)
    applicable_schemes: List[GovernmentSchemeItem] = Field(default_factory=list)
    estimated_cost_cr: Optional[float] = None
    cost_status: str = Field(
        ...,
        pattern="^(Verified Scheme Budget|Estimated from Standard Schedule of Rates|Requires Feasibility Study|Unsupported / Data Gap)$"
    )
    cost_breakdown: Optional[Dict[str, float]] = None
    expected_outcomes: List[ExpectedOutcomeItem] = Field(default_factory=list)
    implementation_dependencies: List[str] = Field(default_factory=list)
    risks: List[ImplementationRiskItem] = Field(default_factory=list)
    data_gaps: List[str] = Field(default_factory=list)
    sources: List[SourceCitationItem] = Field(default_factory=list)
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    human_review_required: bool = True
    status: str = Field("Proposed", pattern="^(Proposed|Under Review|Approved|Rejected|Changes Requested)$")
    reviewer_id: Optional[str] = None
    reviewer_role: Optional[str] = None
    reviewer_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    model_name: str
    generation_timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class GenerateRecommendationsRequest(BaseModel):
    city_id: str = Field("koraput", description="Identifier of target city to analyze")
    benchmark_city_id: Optional[str] = Field(None, description="Optional specific benchmark city (defaults to AI matcher top choice)")
    prioritized_sectors: Optional[List[str]] = Field(None, description="Optional sector filter, e.g. ['healthcare', 'agriculture']")
    budget_constraint_cr: Optional[float] = Field(None, ge=1.0, description="Optional available budget cap in INR Crores")
    require_verified_schemes: bool = Field(True, description="Enforces real government schemes and statutory allocations")


class DeterministicGapItem(BaseModel):
    sector: str
    gap_title: str
    metric_key: str
    target_value: float
    benchmark_value: float
    gap_percentage: float
    severity: str
    required_information: List[str]
    available_information: List[str]
    missing_information: List[str]
    readiness_for_recommendation: bool


class PolicyGenerationResponse(BaseModel):
    target_city: Dict[str, Any]
    benchmark_city: Dict[str, Any]
    deterministic_gaps: List[DeterministicGapItem]
    recommendations: List[PolicyRecommendationItem]
    safeguards_summary: Dict[str, Any]
    generation_metadata: Dict[str, Any]


class RecommendationActionRequest(BaseModel):
    action: str = Field(..., pattern="^(accept|reject|request_changes|mark_under_review)$")
    reviewer_notes: str = Field(..., min_length=5, description="Documented rationale for approval, rejection, or requested modifications")
    modification_requests: Optional[List[str]] = None
