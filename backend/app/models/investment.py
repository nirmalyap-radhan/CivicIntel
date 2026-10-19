from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class Investment(Base, TimestampMixin):
    __tablename__ = "investments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(256), nullable=False, index=True)
    sector = Column(String(64), nullable=False, index=True)
    location = Column(String(256), nullable=False)
    project_type = Column(String(64), nullable=False)  # PPP, Private Sector, State Joint Venture, Cooperative
    capex_in_cr = Column(Float, nullable=False)
    expected_irr_percent = Column(Float, nullable=False)
    esg_rating = Column(String(16), nullable=False, default="A")  # A+, A, B+, B
    status = Column(
        String(64),
        nullable=False,
        default="Expression of Interest"
    )  # Expression of Interest, Detailed Project Report, Tendering Active, Land Bank Allocated
    direct_jobs = Column(Integer, nullable=False, default=0)
    brief = Column(Text, nullable=False)

    # Investor Marketplace additions
    is_verified = Column(Boolean, nullable=False, default=True)
    verification_stage = Column(String(64), nullable=False, default="Verified DPR")
    supporting_evidence = Column(Text, nullable=True)
    potential_partners = Column(Text, nullable=True)
    regulatory_considerations = Column(Text, nullable=True)
    cost_breakdown_json = Column(Text, nullable=True)
    revenue_range_json = Column(Text, nullable=True)
    risk_factors_json = Column(Text, nullable=True)
    assumptions_disclosed = Column(Text, nullable=True)

    # Relationships
    city = relationship("City", back_populates="investments")
    enquiries = relationship("InvestmentEnquiry", back_populates="investment", cascade="all, delete-orphan")


class InvestmentEnquiry(Base, TimestampMixin):
    """
    Investor contact & Expression of Interest enquiry workflow.
    Tracks institutional investor inquiries, proposed capital commitments, and DPR dispatches.
    """
    __tablename__ = "investment_enquiries"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    investment_id = Column(String(64), ForeignKey("investments.id", ondelete="CASCADE"), nullable=False, index=True)
    investor_name = Column(String(128), nullable=False)
    investor_email = Column(String(128), nullable=False, index=True)
    organization = Column(String(256), nullable=False)
    proposed_investment_cr = Column(Float, nullable=True)
    target_timeline = Column(String(64), nullable=False, default="3-6 months")
    message = Column(Text, nullable=False)
    contact_phone = Column(String(32), nullable=True)
    status = Column(String(32), nullable=False, default="Pending Review")  # Pending Review, Under Evaluation, DPR Dispatched, Archived

    # Relationships
    investment = relationship("Investment", back_populates="enquiries")


class LocalResource(Base, TimestampMixin):
    """
    Curated resource directory catalog for local economic discovery.
    Covers agricultural resources, local products, workforce capabilities,
    tourism opportunities, and existing anchor businesses.
    """
    __tablename__ = "local_resources"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(64), nullable=False, index=True)  # agricultural, local_product, workforce, tourism, existing_business
    title = Column(String(256), nullable=False, index=True)
    description = Column(Text, nullable=False)
    key_metrics = Column(String(256), nullable=False)
    certifications_or_anchor = Column(String(256), nullable=True)  # e.g., "GI Tag 638", "ODOP Certified", "HAL Engine Division"
    growth_potential = Column(Text, nullable=False)
    supporting_source = Column(String(256), nullable=False)

    # Relationships
    city = relationship("City", back_populates="local_resources")

