from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.policy import DevelopmentPolicy, PolicyEvaluation
from app.models.city import City
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyStatusUpdate


def get_policies(
    db: Session,
    city_id: Optional[str] = None,
    sector: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[DevelopmentPolicy]:
    """Retrieves policies with optional filters for city, sector, and lifecycle status."""
    query = db.query(DevelopmentPolicy)
    if city_id:
        query = query.filter(DevelopmentPolicy.city_id == city_id)
    if sector and sector != "all":
        query = query.filter(DevelopmentPolicy.sector == sector.lower())
    if status_filter and status_filter != "all":
        query = query.filter(DevelopmentPolicy.status == status_filter)
    return query.offset(skip).limit(limit).all()


def get_policy_by_id(db: Session, policy_id: str) -> DevelopmentPolicy:
    """Retrieves a single policy by id."""
    policy = db.query(DevelopmentPolicy).filter(DevelopmentPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy with id '{policy_id}' not found",
        )
    return policy


def create_policy(
    db: Session,
    policy_in: PolicyCreate,
    current_user: Optional[User] = None
) -> DevelopmentPolicy:
    """Creates a new policy intervention, optionally with initial evaluation."""
    # Verify city exists
    city = db.query(City).filter(City.id == policy_in.city_id).first()
    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target city '{policy_in.city_id}' does not exist",
        )

    db_policy = DevelopmentPolicy(
        city_id=policy_in.city_id,
        title=policy_in.title,
        sector=policy_in.sector.lower(),
        priority=policy_in.priority,
        estimated_budget_cr=policy_in.estimated_budget_cr,
        funding_mechanism=policy_in.funding_mechanism,
        time_to_implement_months=policy_in.time_to_implement_months,
        created_by_user_id=current_user.id if current_user else None,
        status="Proposed",
    )
    db.add(db_policy)
    db.flush()

    if policy_in.evaluation:
        db_eval = PolicyEvaluation(
            policy_id=db_policy.id,
            impact_score=policy_in.evaluation.impact_score,
            feasibility_score=policy_in.evaluation.feasibility_score,
            cost_benefit_ratio=policy_in.evaluation.cost_benefit_ratio,
            expected_outcomes=policy_in.evaluation.expected_outcomes,
            evidence_base=policy_in.evaluation.evidence_base,
            risk_assessment=policy_in.evaluation.risk_assessment,
            evaluator_notes=policy_in.evaluation.evaluator_notes,
        )
        db.add(db_eval)

    db.commit()
    db.refresh(db_policy)
    return db_policy


def update_policy_status(
    db: Session,
    policy_id: str,
    status_in: PolicyStatusUpdate,
    current_user: User
) -> DevelopmentPolicy:
    """
    Updates policy status with strict RBAC:
    Only government_official or system_admin can transition policies to Approved or Rejected!
    """
    policy = get_policy_by_id(db, policy_id)

    # Security check: Prevent unauthorized policy approvals
    if status_in.status in ["Approved", "Rejected"]:
        privileged_roles = ["government_official", "system_admin"]
        if not current_user.is_superuser and current_user.role not in privileged_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Unauthorized: Only government officials and administrators can approve or reject policies.",
            )

    policy.status = status_in.status

    if status_in.status == "Approved":
        policy.approved_by_user_id = current_user.id
        policy.approved_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(policy)
    return policy
