from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class PolicyEvaluationBase(BaseModel):
    impact_score: float = Field(..., ge=0, le=100)
    feasibility_score: float = Field(..., ge=0, le=100)
    cost_benefit_ratio: float = Field(..., ge=0)
    expected_outcomes: Optional[str] = None
    evidence_base: Optional[str] = None
    risk_assessment: Optional[str] = None
    evaluator_notes: Optional[str] = None


class PolicyEvaluationCreate(PolicyEvaluationBase):
    pass


class PolicyEvaluationResponse(PolicyEvaluationBase):
    id: str
    policy_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PolicyBase(BaseModel):
    city_id: str
    title: str = Field(..., min_length=5, max_length=256)
    sector: str = Field(..., description="Target civic sector")
    priority: str = Field("Immediate", description="Immediate, Medium Term, Strategic")
    estimated_budget_cr: float = Field(..., gt=0, description="Budget in INR Crores")
    funding_mechanism: str = Field(..., min_length=3, max_length=256)
    time_to_implement_months: int = Field(..., gt=0)


class PolicyCreate(PolicyBase):
    evaluation: Optional[PolicyEvaluationCreate] = None


class PolicyStatusUpdate(BaseModel):
    status: str = Field(
        ...,
        pattern="^(Proposed|Under Review|Approved|In Execution|Completed|Rejected)$",
        description="Updated policy lifecycle status"
    )
    notes: Optional[str] = None


class PolicyResponse(PolicyBase):
    id: str
    status: str
    created_by_user_id: Optional[str] = None
    approved_by_user_id: Optional[str] = None
    approved_at: Optional[datetime] = None
    evaluation: Optional[PolicyEvaluationResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
