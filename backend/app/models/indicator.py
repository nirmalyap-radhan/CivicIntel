from datetime import datetime, timezone
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid, get_utc_now


class IndicatorSource(Base, TimestampMixin):
    __tablename__ = "indicator_sources"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    organization_name = Column(String(128), nullable=False, index=True)
    publication_title = Column(String(256), nullable=False)
    collection_date = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    methodology = Column(Text, nullable=True)
    verification_status = Column(String(64), nullable=False, default="Demonstration Model")
    is_official = Column(Boolean, default=False, nullable=False)
    source_url = Column(String(512), nullable=True)

    # Relationships
    indicators = relationship("DevelopmentIndicator", back_populates="source")


class DevelopmentIndicator(Base, TimestampMixin):
    __tablename__ = "development_indicators"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    source_id = Column(String(64), ForeignKey("indicator_sources.id", ondelete="SET NULL"), nullable=True, index=True)
    
    sector = Column(String(64), nullable=False, index=True)  # healthcare, education, etc.
    metric_key = Column(String(64), nullable=False, index=True)  # e.g., 'doctor_density'
    metric_name = Column(String(128), nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(64), nullable=False)
    
    # Required data validation fields
    reporting_period = Column(String(64), nullable=False)  # e.g., '2025-2026'
    data_source = Column(String(128), nullable=False)
    collection_date = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
    verification_status = Column(String(64), nullable=False, default="Demonstration Model")
    
    is_demonstration = Column(Boolean, default=True, nullable=False)
    confidence_score = Column(Float, default=0.90, nullable=False)

    # Relationships
    city = relationship("City", back_populates="indicators")
    source = relationship("IndicatorSource", back_populates="indicators")


class CityBenchmark(Base, TimestampMixin):
    __tablename__ = "city_benchmarks"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    target_city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    benchmark_city_id = Column(String(64), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False, index=True)
    
    sector = Column(String(64), nullable=False, index=True)
    metric_key = Column(String(64), nullable=False)
    metric_name = Column(String(128), nullable=False)
    target_value = Column(Float, nullable=False)
    benchmark_value = Column(Float, nullable=False)
    gap_percentage = Column(Float, nullable=False)
    priority = Column(String(32), nullable=False, default="Medium")  # Critical, High, Medium, Low
    estimated_runway_years = Column(Float, nullable=False, default=4.0)
    notes = Column(Text, nullable=True)

    # Relationships
    target_city = relationship("City", foreign_keys=[target_city_id], back_populates="target_benchmarks")
    benchmark_city = relationship("City", foreign_keys=[benchmark_city_id], back_populates="benchmark_references")
