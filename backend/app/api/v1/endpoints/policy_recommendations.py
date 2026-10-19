from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import RoleChecker, get_current_user, get_optional_current_user
from app.models.user import User
from app.schemas.policy_recommendation import (
    GenerateRecommendationsRequest,
    PolicyGenerationResponse,
    PolicyRecommendationItem,
    RecommendationActionRequest,
)
from app.services.policy_recommendation_service import (
    generate_city_recommendations,
    get_city_recommendations,
    get_recommendation_by_id,
    inspect_recommendation_evidence,
    process_recommendation_action,
)
from app.core.llm.factory import get_provider_status

router = APIRouter()


@router.get("/providers/status", response_model=Dict[str, Any])
def get_llm_providers_status_endpoint():
    """
    Returns active LLM provider and detection status of Groq, Gemini, NVIDIA, Mistral, and OpenAI keys.
    """
    return get_provider_status()


@router.post("/generate", response_model=PolicyGenerationResponse)
def generate_recommendations_endpoint(
    request: GenerateRecommendationsRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """
    Executes the multi-stage AI Policy Recommendation pipeline for a city:
    - Stage A: Deterministic Gap Analysis & Missing Data Identification
    - Stage B: Evidence-Grounded Policy Formulation with Real Schemes & Source Citations
    - Persists outputs for Stage C Human Review
    """
    return generate_city_recommendations(db, request=request, current_user=current_user)


@router.get("/cities/{city_id}", response_model=List[PolicyRecommendationItem])
def read_city_recommendations_endpoint(
    city_id: str,
    sector: Optional[str] = Query(None, description="Optional sector filter"),
    status: Optional[str] = Query(None, description="Optional status filter"),
    db: Session = Depends(get_db),
):
    """
    Retrieves stored policy recommendations for a city.
    """
    return get_city_recommendations(db, city_id=city_id, sector=sector, status_filter=status)


@router.get("/{rec_id}", response_model=PolicyRecommendationItem)
def read_single_recommendation_endpoint(
    rec_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves a single policy recommendation with full metadata.
    """
    return get_recommendation_by_id(db, rec_id=rec_id)


@router.get("/{rec_id}/evidence", response_model=Dict[str, Any])
def inspect_evidence_endpoint(
    rec_id: str,
    db: Session = Depends(get_db),
):
    """
    Answers: 'Why did CivicIntel recommend this?'
    Returns underlying source document citations, audit passages,
    statutory funding bases, and remaining data gaps.
    """
    return inspect_recommendation_evidence(db, rec_id=rec_id)


@router.post("/{rec_id}/action", response_model=PolicyRecommendationItem)
def perform_recommendation_action_endpoint(
    rec_id: str,
    action_in: RecommendationActionRequest,
    current_user: User = Depends(
        RoleChecker(["government_official", "system_admin"])
    ),
    db: Session = Depends(get_db),
):
    """
    Stage C: Controlled Government Approval Workflow.
    Permitted actions: 'accept', 'reject', 'request_changes', 'mark_under_review'.
    Only authorized government officials and system admins can approve policies.
    Accepting a recommendation converts it to an active DevelopmentPolicy in the city dossier.
    """
    return process_recommendation_action(
        db,
        rec_id=rec_id,
        action_in=action_in,
        current_user=current_user,
    )
