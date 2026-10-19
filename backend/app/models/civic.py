"""
SQLAlchemy Models for CivicIntel Citizen Dashboard & Civic Engagement.
Supports:
- Report-a-problem workflow with photographic evidence and privacy-preserving location
- Manual verification state transitions (pending_verification, under_review, clarification_requested, verified, rejected)
- Audit logs tracking reviewer actions
- Verified civic credits ledger
- Community initiative listings
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid, get_utc_now


class CivicAction(Base, TimestampMixin):
    """
    Citizen-reported civic problem or community action.
    Separates coarse public location from private precise coordinates to protect citizen privacy.
    """
    __tablename__ = "civic_actions"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    
    action_type = Column(String(64), nullable=False)  # damaged_road, water_leakage, tree_plantation, etc.
    category = Column(String(64), nullable=False, default="civic_issue")
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    evidence_url = Column(String(512), nullable=True)  # Primary evidence image / document
    
    # Privacy Safeguards: Coarse location is public, precise location is strictly private for authorized officials
    location_details = Column(String(256), nullable=True)  # Legacy compatibility field
    coarse_location = Column(String(128), nullable=True)  # e.g. "Ward 14, Jeypore Sub-Division"
    precise_location_private = Column(String(256), nullable=True)  # e.g. "House 42, Main Road (GPS: 18.814, 82.712)"
    public_consent = Column(Boolean, default=True, nullable=False)  # Consent to display in public feed
    
    # State Machine: pending_verification | under_review | clarification_requested | verified | rejected
    verification_status = Column(String(32), nullable=False, default="pending_verification", index=True)
    reviewer_notes = Column(Text, nullable=True)
    
    verified_by_user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="civic_actions")
    verified_by = relationship("User", foreign_keys=[verified_by_user_id], back_populates="verified_actions")
    city = relationship("City", back_populates="civic_actions")
    credits = relationship("CivicCredit", back_populates="civic_action", cascade="all, delete-orphan")
    audit_logs = relationship("CivicAuditLog", back_populates="civic_action", cascade="all, delete-orphan", order_by="CivicAuditLog.created_at.desc()")


class CivicAuditLog(Base):
    """
    Immutable audit trail recording every state change and reviewer evaluation.
    Enforces accountability for manual approvals, rejections, and clarifications.
    """
    __tablename__ = "civic_audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    civic_action_id = Column(String(64), ForeignKey("civic_actions.id", ondelete="CASCADE"), nullable=False, index=True)
    changed_by_user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    previous_status = Column(String(32), nullable=True)
    new_status = Column(String(32), nullable=False)
    action_taken = Column(String(64), nullable=False)  # submitted, assigned_review, clarification_requested, verified_and_rewarded, rejected
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    # Relationships
    civic_action = relationship("CivicAction", back_populates="audit_logs")
    changed_by = relationship("User")


class CivicCredit(Base):
    """
    Transaction ledger for Civic Green / Governance Credits.
    Enforces rule: Credits are only awarded upon authorized verification, never on raw upload.
    """
    __tablename__ = "civic_credits"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    civic_action_id = Column(String(64), ForeignKey("civic_actions.id", ondelete="SET NULL"), nullable=True, index=True)
    
    points_delta = Column(Integer, nullable=False)  # +50, +100
    transaction_type = Column(String(64), nullable=False)  # earn_verification, initiative_completion, bonus_challenge
    verification_outcome = Column(String(64), nullable=False, default="approved")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="civic_credits")
    civic_action = relationship("CivicAction", back_populates="credits")


class CommunityInitiative(Base, TimestampMixin):
    """
    Community civic campaigns (e.g. spring rejuvenation, lake cleanup, sapling plantation).
    Citizens can volunteer, submit participation proof, and earn credits upon verification.
    """
    __tablename__ = "community_initiatives"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    
    title = Column(String(256), nullable=False)
    category = Column(String(64), nullable=False)  # environment, sanitation, public_health, heritage
    description = Column(Text, nullable=False)
    organizer = Column(String(128), nullable=False)
    location_area = Column(String(128), nullable=False)  # e.g. "Kolab Reservoir Perimeter, Koraput"
    target_participants = Column(Integer, nullable=False, default=50)
    current_volunteers = Column(Integer, nullable=False, default=0)
    scheduled_date = Column(DateTime(timezone=True), nullable=False)
    points_reward = Column(Integer, nullable=False, default=100)
    status = Column(String(32), nullable=False, default="Open")  # Open, In Progress, Completed

    # Relationships
    city = relationship("City")
