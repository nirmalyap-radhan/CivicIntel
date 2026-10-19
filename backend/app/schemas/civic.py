"""
Pydantic Schemas for CivicIntel Citizen Dashboard & Civic Engagement.
Covers:
- Report-a-problem submissions with privacy-preserving locations and evidence
- Manual verification transitions and audit logs
- Citizen profile, credit ledger, and privacy-conscious leaderboards
- Community initiative listings
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# 1. Problem Report & Civic Action Schemas
# ---------------------------------------------------------------------------

class CivicActionBase(BaseModel):
    city_id: str
    action_type: str = Field(..., description="Action category: damaged_road, water_leakage, waste_management, etc.")
    title: str = Field(..., min_length=3, max_length=256)
    description: str = Field(..., min_length=5)
    evidence_url: Optional[str] = None
    location_details: Optional[str] = None  # Legacy field
    coarse_location: Optional[str] = Field(None, description="Public ward/locality, e.g. 'Ward 14, Jeypore'")
    precise_location_private: Optional[str] = Field(None, description="Private street/GPS info, hidden from public feed")
    public_consent: bool = Field(True, description="Consent to show coarse report on public civic feed")


class CivicActionCreate(CivicActionBase):
    pass


class CivicAuditLogResponse(BaseModel):
    id: str
    civic_action_id: str
    changed_by_user_id: Optional[str] = None
    previous_status: Optional[str] = None
    new_status: str
    action_taken: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CivicActionResponse(CivicActionBase):
    id: str
    user_id: str
    citizen_display_name: Optional[str] = None
    verification_status: str
    reviewer_notes: Optional[str] = None
    verified_by_user_id: Optional[str] = None
    verified_at: Optional[datetime] = None
    audit_logs: List[CivicAuditLogResponse] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CivicActionVerify(BaseModel):
    action: str = Field(
        ...,
        pattern="^(approve|reject|request_clarification)$",
        description="'approve' (verifies and awards points), 'reject' (0 points), or 'request_clarification' (0 points)"
    )
    awarded_points: int = Field(50, ge=0, le=500, description="Civic credits awarded ONLY upon approved verification")
    notes: Optional[str] = Field(None, description="Mandatory audit log / reviewer explanation")


# ---------------------------------------------------------------------------
# 2. Civic Credits & Ledger Schemas
# ---------------------------------------------------------------------------

class CivicCreditResponse(BaseModel):
    id: str
    user_id: str
    civic_action_id: Optional[str] = None
    action_title: Optional[str] = None
    points_delta: int
    transaction_type: str
    verification_outcome: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# 3. Citizen Profile & Leaderboard Schemas
# ---------------------------------------------------------------------------

class CitizenProfileResponse(BaseModel):
    user_id: str
    full_name: str
    display_handle: str
    email: str
    city_id: str
    role: str
    total_credit_points: int
    verified_actions_count: int
    pending_actions_count: int
    reputation_tier: str
    badges: List[str] = Field(default_factory=list)


class LeaderboardEntry(BaseModel):
    rank: int
    display_name: str
    city_id: str
    total_points: int
    verified_actions_count: int
    badge: str


# ---------------------------------------------------------------------------
# 4. Community Initiative Schemas
# ---------------------------------------------------------------------------

class CommunityInitiativeResponse(BaseModel):
    id: str
    city_id: str
    title: str
    category: str
    description: str
    organizer: str
    location_area: str
    target_participants: int
    current_volunteers: int
    scheduled_date: datetime
    points_reward: int
    status: str

    model_config = ConfigDict(from_attributes=True)


class CommunityInitiativeJoinRequest(BaseModel):
    initiative_id: str
