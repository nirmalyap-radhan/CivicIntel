from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class DevelopmentPolicy(Base, TimestampMixin):
    __tablename__ = "development_policies"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(256), nullable=False, index=True)
    sector = Column(String(64), nullable=False, index=True)
    priority = Column(String(32), nullable=False, default="Immediate")  # Immediate, Medium Term, Strategic
    status = Column(
        String(32),
        nullable=False,
        default="Proposed"
    )  # Proposed, Under Review, Approved, In Execution, Completed, Rejected
    estimated_budget_cr = Column(Float, nullable=False)
    funding_mechanism = Column(String(256), nullable=False)
    time_to_implement_months = Column(Integer, nullable=False)

    created_by_user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_by_user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    city = relationship("City", back_populates="policies")
    evaluation = relationship("PolicyEvaluation", back_populates="policy", uselist=False, cascade="all, delete-orphan")
    created_by = relationship("User", foreign_keys=[created_by_user_id], back_populates="proposed_policies")
    approved_by = relationship("User", foreign_keys=[approved_by_user_id], back_populates="approved_policies")


class PolicyEvaluation(Base, TimestampMixin):
    __tablename__ = "policy_evaluations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    policy_id = Column(String(64), ForeignKey("development_policies.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    impact_score = Column(Float, nullable=False, default=85.0)  # 0 to 100
    feasibility_score = Column(Float, nullable=False, default=80.0)  # 0 to 100
    cost_benefit_ratio = Column(Float, nullable=False, default=2.4)
    expected_outcomes = Column(Text, nullable=True)  # JSON formatted strings
    evidence_base = Column(Text, nullable=True)
    risk_assessment = Column(Text, nullable=True)
    evaluator_notes = Column(Text, nullable=True)

    # Relationships
    policy = relationship("DevelopmentPolicy", back_populates="evaluation")


class AIPolicyRecommendation(Base, TimestampMixin):
    __tablename__ = "ai_policy_recommendations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(256), nullable=False, index=True)
    sector = Column(String(64), nullable=False, index=True)
    priority = Column(String(32), nullable=False, default="High")

    problem_statement = Column(Text, nullable=False)
    proposed_intervention = Column(Text, nullable=False)

    benchmark_evidence = Column(Text, nullable=True)  # JSON string
    local_requirements = Column(Text, nullable=True)  # JSON string
    applicable_schemes = Column(Text, nullable=True)  # JSON string

    estimated_cost_cr = Column(Float, nullable=True)
    cost_status = Column(String(64), nullable=False, default="Requires Feasibility Study")
    cost_breakdown = Column(Text, nullable=True)  # JSON string

    expected_outcomes = Column(Text, nullable=True)  # JSON string
    implementation_dependencies = Column(Text, nullable=True)  # JSON string
    risks = Column(Text, nullable=True)  # JSON string
    data_gaps = Column(Text, nullable=True)  # JSON string
    sources = Column(Text, nullable=True)  # JSON string with passages & citations

    confidence_score = Column(Float, nullable=False, default=0.85)
    human_review_required = Column(Boolean, nullable=False, default=True)
    status = Column(
        String(32),
        nullable=False,
        default="Proposed"
    )  # Proposed, Under Review, Approved, Rejected, Changes Requested

    reviewer_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewer_role = Column(String(64), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    committed_policy_id = Column(String(64), ForeignKey("development_policies.id", ondelete="SET NULL"), nullable=True)
    model_name = Column(String(64), nullable=False, default="civicintel-deterministic-grounded-v1")
    generation_timestamp = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    city = relationship("City")
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    committed_policy = relationship("DevelopmentPolicy", foreign_keys=[committed_policy_id])
