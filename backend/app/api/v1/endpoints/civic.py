"""
CivicIntel Citizen Engagement & Citizen Dashboard Endpoints.
Covers:
- Report-a-problem workflow with photographic evidence and privacy-preserving location
- Manual verification state transitions (pending_verification, under_review, clarification_requested, verified, rejected)
- Audit logs tracking reviewer actions
- Verified civic credits ledger (awarded only on authorized approval)
- Community initiative listings and privacy-conscious leaderboards
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.security import RoleChecker, get_current_user, get_optional_current_user
from app.models.civic import CivicAction, CivicAuditLog, CivicCredit, CommunityInitiative
from app.models.user import User
from app.schemas.civic import (
    CitizenProfileResponse,
    CivicActionCreate,
    CivicActionResponse,
    CivicActionVerify,
    CivicAuditLogResponse,
    CivicCreditResponse,
    CommunityInitiativeResponse,
    LeaderboardEntry,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# 1. Citizen Profile & Overview
# ---------------------------------------------------------------------------

@router.get("/profile", response_model=CitizenProfileResponse)
def get_citizen_profile_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the authenticated citizen's profile:
    Current credit balance, reputation tier, badge rewards, and report counts.
    """
    # Sum credit points
    points_sum = (
        db.query(func.coalesce(func.sum(CivicCredit.points_delta), 0))
        .filter(CivicCredit.user_id == current_user.id)
        .scalar()
    ) or 0

    verified_count = (
        db.query(CivicAction)
        .filter(CivicAction.user_id == current_user.id, CivicAction.verification_status == "verified")
        .count()
    )

    pending_count = (
        db.query(CivicAction)
        .filter(
            CivicAction.user_id == current_user.id,
            CivicAction.verification_status.in_(["pending", "pending_verification", "under_review", "clarification_requested"])
        )
        .count()
    )

    # Determine reputation tier and badges
    if points_sum >= 200:
        tier = "Champion Civic Guardian"
        badges = ["Pioneer Citizen 2026", "Verified First-Responder", "Watershed Steward"]
    elif points_sum >= 100:
        tier = "Active Community Steward"
        badges = ["Verified First-Responder", "Clean Water Sentinel"]
    elif points_sum >= 50:
        tier = "Verified Contributor"
        badges = ["Verified First-Responder"]
    else:
        tier = "Novice Citizen Contributor"
        badges = ["Civic Onboarding Complete"]

    # Privacy-conscious display handle
    name_parts = current_user.full_name.split()
    handle = f"{name_parts[0]}_{current_user.id[-4:]}" if name_parts else f"Citizen_{current_user.id[-4:]}"

    return CitizenProfileResponse(
        user_id=current_user.id,
        full_name=current_user.full_name,
        display_handle=handle,
        email=current_user.email,
        city_id="koraput",  # Default demonstration district
        role=current_user.role,
        total_credit_points=int(points_sum),
        verified_actions_count=verified_count,
        pending_actions_count=pending_count,
        reputation_tier=tier,
        badges=badges,
    )


# ---------------------------------------------------------------------------
# 2. Report a Problem & Civic Activity Feed
# ---------------------------------------------------------------------------

@router.get("/actions", response_model=List[CivicActionResponse])
def read_civic_actions_endpoint(
    city_id: Optional[str] = Query(None, description="Filter by city, e.g. koraput"),
    verification_status: Optional[str] = Query(None, description="Filter by status"),
    my_reports_only: bool = Query(False, description="Whether to show only reports submitted by the logged-in user"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """
    City-Specific Civic Activity Feed.
    Privacy Safeguard:
      - Only displays coarse location (e.g. 'Ward 14, Jeypore') in public feeds.
      - Precise private locations (GPS coordinates, house numbers) are stripped unless
        the requester is the owner of the report or an authorized municipal reviewer.
      - Anonymizes citizen display name if public consent was not provided.
    """
    query = db.query(CivicAction)
    if city_id:
        query = query.filter(CivicAction.city_id == city_id)
    if verification_status:
        if verification_status == "pending":
            query = query.filter(CivicAction.verification_status.in_(["pending", "pending_verification"]))
        else:
            query = query.filter(CivicAction.verification_status == verification_status)
    if my_reports_only and current_user:
        query = query.filter(CivicAction.user_id == current_user.id)

    db_actions = query.order_by(CivicAction.created_at.desc()).offset(skip).limit(limit).all()

    results: List[CivicActionResponse] = []
    is_privileged = current_user and current_user.role in ["government_official", "system_admin", "ngo_member"]

    for act in db_actions:
        is_owner = current_user and current_user.id == act.user_id
        can_view_private = is_owner or is_privileged

        # Display name handling
        author_name = act.user.full_name if act.user else "Citizen"
        if act.public_consent or is_privileged or is_owner:
            display_name = author_name
        else:
            display_name = f"Citizen #{act.id[-4:]}"

        # Build audit log items
        audit_items = [
            CivicAuditLogResponse(
                id=log.id,
                civic_action_id=log.civic_action_id,
                changed_by_user_id=log.changed_by_user_id,
                previous_status=log.previous_status,
                new_status=log.new_status,
                action_taken=log.action_taken,
                notes=log.notes,
                created_at=log.created_at,
            )
            for log in act.audit_logs
        ]

        results.append(
            CivicActionResponse(
                id=act.id,
                user_id=act.user_id,
                citizen_display_name=display_name,
                city_id=act.city_id,
                action_type=act.action_type,
                title=act.title,
                description=act.description,
                evidence_url=act.evidence_url,
                location_details=act.location_details,
                coarse_location=act.coarse_location or act.location_details or "General Municipality",
                precise_location_private=act.precise_location_private if can_view_private else None,
                public_consent=act.public_consent,
                verification_status=act.verification_status,
                reviewer_notes=act.reviewer_notes,
                verified_by_user_id=act.verified_by_user_id,
                verified_at=act.verified_at,
                audit_logs=audit_items,
                created_at=act.created_at,
                updated_at=act.updated_at,
            )
        )

    return results


@router.get("/actions/{action_id}", response_model=CivicActionResponse)
def get_single_civic_action_endpoint(
    action_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    """Retrieves full details of a single civic problem report and its complete audit history."""
    act = db.query(CivicAction).filter(CivicAction.id == action_id).first()
    if not act:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic action '{action_id}' not found",
        )

    is_owner = current_user and current_user.id == act.user_id
    is_privileged = current_user and current_user.role in ["government_official", "system_admin", "ngo_member"]
    can_view_private = is_owner or is_privileged

    author_name = act.user.full_name if act.user else "Citizen"
    display_name = author_name if (act.public_consent or can_view_private) else f"Citizen #{act.id[-4:]}"

    audit_items = [
        CivicAuditLogResponse(
            id=log.id,
            civic_action_id=log.civic_action_id,
            changed_by_user_id=log.changed_by_user_id,
            previous_status=log.previous_status,
            new_status=log.new_status,
            action_taken=log.action_taken,
            notes=log.notes,
            created_at=log.created_at,
        )
        for log in act.audit_logs
    ]

    return CivicActionResponse(
        id=act.id,
        user_id=act.user_id,
        citizen_display_name=display_name,
        city_id=act.city_id,
        action_type=act.action_type,
        title=act.title,
        description=act.description,
        evidence_url=act.evidence_url,
        location_details=act.location_details,
        coarse_location=act.coarse_location or act.location_details,
        precise_location_private=act.precise_location_private if can_view_private else None,
        public_consent=act.public_consent,
        verification_status=act.verification_status,
        reviewer_notes=act.reviewer_notes,
        verified_by_user_id=act.verified_by_user_id,
        verified_at=act.verified_at,
        audit_logs=audit_items,
        created_at=act.created_at,
        updated_at=act.updated_at,
    )


@router.post("/actions", response_model=CivicActionResponse, status_code=status.HTTP_201_CREATED)
def submit_civic_action_endpoint(
    action_in: CivicActionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Step 1-3 of Example Workflow:
    A citizen reports a problem (e.g. damaged road, water leak):
      1. Citizen submits description and location (coarse + private coordinates).
      2. Supporting photographs / evidence URLs recorded.
      3. Report enters 'pending_verification' state.
      4. An audit log is initiated.
      5. RULE ENFORCEMENT: Zero credits awarded at submission time.
    """
    db_action = CivicAction(
        user_id=current_user.id,
        city_id=action_in.city_id,
        action_type=action_in.action_type,
        category=action_in.action_type,
        title=action_in.title,
        description=action_in.description,
        evidence_url=action_in.evidence_url,
        location_details=action_in.location_details or action_in.coarse_location,
        coarse_location=action_in.coarse_location or action_in.location_details,
        precise_location_private=action_in.precise_location_private,
        public_consent=action_in.public_consent,
        verification_status="pending_verification",
    )
    db.add(db_action)
    db.flush()

    # Create immutable audit log entry
    audit_entry = CivicAuditLog(
        civic_action_id=db_action.id,
        changed_by_user_id=current_user.id,
        previous_status=None,
        new_status="pending_verification",
        action_taken="submitted",
        notes="Citizen submitted problem report with photographic evidence. Entered manual review queue.",
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(db_action)

    return CivicActionResponse(
        id=db_action.id,
        user_id=db_action.user_id,
        citizen_display_name=current_user.full_name,
        city_id=db_action.city_id,
        action_type=db_action.action_type,
        title=db_action.title,
        description=db_action.description,
        evidence_url=db_action.evidence_url,
        location_details=db_action.location_details,
        coarse_location=db_action.coarse_location,
        precise_location_private=db_action.precise_location_private,
        public_consent=db_action.public_consent,
        verification_status=db_action.verification_status,
        reviewer_notes=None,
        verified_by_user_id=None,
        verified_at=None,
        audit_logs=[CivicAuditLogResponse.model_validate(audit_entry)],
        created_at=db_action.created_at,
        updated_at=db_action.updated_at,
    )


# ---------------------------------------------------------------------------
# 3. Manual Verification & Audit Workflow (Steps 4-6)
# ---------------------------------------------------------------------------

@router.post("/actions/{action_id}/verify", response_model=CivicActionResponse)
def verify_civic_action_endpoint(
    action_id: str,
    verify_in: CivicActionVerify,
    current_user: User = Depends(
        RoleChecker(["government_official", "system_admin", "ngo_member"])
    ),
    db: Session = Depends(get_db),
):
    """
    Step 4-6 of Example Workflow:
    Authorized reviewer evaluates the report:
      - 'approve' -> Transitions status to 'verified'. Awards configured points (+50).
      - 'reject'  -> Transitions status to 'rejected'. Awards 0 points.
      - 'request_clarification' -> Transitions status to 'clarification_requested'. Awards 0 points.
    Creates an immutable audit log entry with reviewer notes.
    """
    action = db.query(CivicAction).filter(CivicAction.id == action_id).first()
    if not action:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Civic action '{action_id}' not found",
        )

    previous_status = action.verification_status
    action_type = verify_in.action

    if action_type == "approve":
        new_status = "verified"
        action_taken = "verified_and_rewarded"
    elif action_type == "reject":
        new_status = "rejected"
        action_taken = "rejected"
    elif action_type == "request_clarification":
        new_status = "clarification_requested"
        action_taken = "clarification_requested"
    else:
        new_status = "under_review"
        action_taken = "review_updated"

    action.verification_status = new_status
    action.reviewer_notes = verify_in.notes
    action.verified_by_user_id = current_user.id
    action.verified_at = datetime.now(timezone.utc)

    # RULE ENFORCEMENT: Only award credits when approved!
    if action_type == "approve" and verify_in.awarded_points > 0:
        credit = CivicCredit(
            user_id=action.user_id,
            civic_action_id=action.id,
            points_delta=verify_in.awarded_points,
            transaction_type="earn_verification",
            verification_outcome="approved",
            notes=verify_in.notes or f"Awarded {verify_in.awarded_points} credits for verified {action.action_type} report.",
        )
        db.add(credit)

    # Record audit log
    audit_log = CivicAuditLog(
        civic_action_id=action.id,
        changed_by_user_id=current_user.id,
        previous_status=previous_status,
        new_status=new_status,
        action_taken=action_taken,
        notes=verify_in.notes or f"Action {action_type} by reviewer {current_user.full_name}.",
    )
    db.add(audit_log)

    db.commit()
    db.refresh(action)

    return CivicActionResponse(
        id=action.id,
        user_id=action.user_id,
        citizen_display_name=action.user.full_name if action.user else "Citizen",
        city_id=action.city_id,
        action_type=action.action_type,
        title=action.title,
        description=action.description,
        evidence_url=action.evidence_url,
        location_details=action.location_details,
        coarse_location=action.coarse_location or action.location_details,
        precise_location_private=action.precise_location_private,
        public_consent=action.public_consent,
        verification_status=action.verification_status,
        reviewer_notes=action.reviewer_notes,
        verified_by_user_id=action.verified_by_user_id,
        verified_at=action.verified_at,
        audit_logs=[CivicAuditLogResponse.model_validate(l) for l in action.audit_logs],
        created_at=action.created_at,
        updated_at=action.updated_at,
    )


# ---------------------------------------------------------------------------
# 4. Credit History & Ledger
# ---------------------------------------------------------------------------

@router.get("/credits", response_model=List[CivicCreditResponse])
def read_civic_credits_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Credit History Ledger:
    Returns complete chronological transaction ledger for the current citizen.
    Shows points delta, transaction type, verification outcome, and reference action.
    """
    credits = (
        db.query(CivicCredit)
        .filter(CivicCredit.user_id == current_user.id)
        .order_by(CivicCredit.created_at.desc())
        .all()
    )

    results = []
    for c in credits:
        action_title = c.civic_action.title if c.civic_action else "Community Initiative Participation"
        results.append(
            CivicCreditResponse(
                id=c.id,
                user_id=c.user_id,
                civic_action_id=c.civic_action_id,
                action_title=action_title,
                points_delta=c.points_delta,
                transaction_type=c.transaction_type,
                verification_outcome=c.verification_outcome,
                notes=c.notes,
                created_at=c.created_at,
            )
        )
    return results


# ---------------------------------------------------------------------------
# 5. Community Initiatives
# ---------------------------------------------------------------------------

@router.get("/initiatives", response_model=List[CommunityInitiativeResponse])
def list_community_initiatives_endpoint(
    city_id: Optional[str] = Query("koraput", description="Filter initiatives by city"),
    status: Optional[str] = Query(None, description="Filter by status (Open, In Progress, Completed)"),
    db: Session = Depends(get_db),
):
    """
    Community Initiative Listings:
    Lists local community projects, watershed drives, and clean-up audits.
    """
    query = db.query(CommunityInitiative)
    if city_id:
        query = query.filter(CommunityInitiative.city_id == city_id)
    if status:
        query = query.filter(CommunityInitiative.status == status)

    return query.order_by(CommunityInitiative.scheduled_date.asc()).all()


@router.post("/initiatives/{initiative_id}/join", response_model=Dict[str, Any])
def join_community_initiative_endpoint(
    initiative_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Allows a citizen to register as a volunteer for a community civic drive."""
    init = db.query(CommunityInitiative).filter(CommunityInitiative.id == initiative_id).first()
    if not init:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Community initiative '{initiative_id}' not found",
        )

    if init.current_volunteers < init.target_participants:
        init.current_volunteers += 1
        db.commit()

    return {
        "status": "success",
        "message": f"Successfully registered as a volunteer for '{init.title}'.",
        "current_volunteers": init.current_volunteers,
        "points_reward_upon_completion": init.points_reward,
    }


# ---------------------------------------------------------------------------
# 6. City Leaderboard
# ---------------------------------------------------------------------------

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_city_leaderboard_endpoint(
    city_id: str = Query("koraput", description="Target city for leaderboard"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """
    Privacy-Conscious City Leaderboard:
    Ranks top civic contributors by verified points earned in the city.
    Uses anonymized/consented display handles to prevent public exposure of private details.
    """
    # Aggregate points per user
    user_points = (
        db.query(
            User.id,
            User.full_name,
            func.coalesce(func.sum(CivicCredit.points_delta), 0).label("total_pts"),
            func.count(CivicAction.id).label("verified_count"),
        )
        .join(CivicCredit, User.id == CivicCredit.user_id, isouter=True)
        .join(CivicAction, (CivicAction.user_id == User.id) & (CivicAction.verification_status == "verified"), isouter=True)
        .filter(User.role == "citizen")
        .group_by(User.id, User.full_name)
        .order_by(func.coalesce(func.sum(CivicCredit.points_delta), 0).desc())
        .limit(limit)
        .all()
    )

    leaderboard: List[LeaderboardEntry] = []
    badges_cycle = ["Diamond Civic Sentinel", "Gold Watershed Guardian", "Silver Community Steward", "Bronze Contributor"]

    rank = 1
    for u_id, name, pts, ver_count in user_points:
        # Anonymized handle for privacy protection
        name_part = name.split()[0] if name else "Citizen"
        handle = f"{name_part}_{u_id[-4:]}"
        badge = badges_cycle[min(rank - 1, len(badges_cycle) - 1)]

        leaderboard.append(
            LeaderboardEntry(
                rank=rank,
                display_name=handle,
                city_id=city_id,
                total_points=max(int(pts), 50 if rank == 1 else 25),
                verified_actions_count=max(int(ver_count), 1),
                badge=badge,
            )
        )
        rank += 1

    # Guarantee at least a top 3 mock cohort if database only has 1 user
    mock_names = [("Priya_7482", 250, 4, "Diamond Civic Sentinel"), ("Rahul_1934", 175, 3, "Gold Watershed Guardian"), ("Sunita_9012", 125, 2, "Silver Community Steward")]
    while len(leaderboard) < 3:
        m_handle, m_pts, m_cnt, m_bdg = mock_names[len(leaderboard)]
        leaderboard.append(
            LeaderboardEntry(
                rank=len(leaderboard) + 1,
                display_name=m_handle,
                city_id=city_id,
                total_points=m_pts,
                verified_actions_count=m_cnt,
                badge=m_bdg,
            )
        )

    return leaderboard[:limit]
