from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import RoleChecker, get_current_user
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyResponse, PolicyStatusUpdate
from app.services.policy_service import (
    create_policy,
    get_policies,
    get_policy_by_id,
    update_policy_status,
)

router = APIRouter()


@router.get("", response_model=List[PolicyResponse])
def read_policies(
    city_id: Optional[str] = Query(None, description="Filter by city identifier"),
    sector: Optional[str] = Query(None, description="Filter by sector"),
    status: Optional[str] = Query(None, description="Filter by policy lifecycle status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieves list of development policies with optional filtering."""
    return get_policies(
        db,
        city_id=city_id,
        sector=sector,
        status_filter=status,
        skip=skip,
        limit=limit
    )


@router.get("/cities/{city_id}/policies", response_model=List[PolicyResponse])
def read_city_policies(
    city_id: str,
    sector: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieves policies targeted for a specific city."""
    return get_policies(db, city_id=city_id, sector=sector, status_filter=status)


@router.get("/{policy_id}", response_model=PolicyResponse)
def read_single_policy(
    policy_id: str,
    db: Session = Depends(get_db)
):
    """Retrieves a specific policy by its identifier."""
    return get_policy_by_id(db, policy_id=policy_id)


@router.post("", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def propose_policy(
    policy_in: PolicyCreate,
    current_user: User = Depends(
        RoleChecker(["government_official", "system_admin", "investor", "ngo_member"])
    ),
    db: Session = Depends(get_db)
):
    """
    Submits a new policy intervention.
    Requires authenticated user belonging to allowed planning roles.
    """
    return create_policy(db, policy_in=policy_in, current_user=current_user)


@router.patch("/{policy_id}/status", response_model=PolicyResponse)
def patch_policy_status(
    policy_id: str,
    status_in: PolicyStatusUpdate,
    current_user: User = Depends(
        RoleChecker(["government_official", "system_admin"])
    ),
    db: Session = Depends(get_db)
):
    """
    Updates policy lifecycle status (e.g. Approve, Reject, In Execution).
    Strictly role-gated: Only government officials and system administrators can approve policies.
    """
    return update_policy_status(
        db,
        policy_id=policy_id,
        status_in=status_in,
        current_user=current_user
    )
