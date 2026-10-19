from sqlalchemy import BigInteger, Column, Float, Integer, String, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class City(Base, TimestampMixin):
    __tablename__ = "cities"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, index=True)
    state = Column(String(64), nullable=False, default="Odisha")
    category = Column(String(64), nullable=False)
    population = Column(BigInteger, nullable=False)
    area_sq_km = Column(Float, nullable=False)
    literacy_rate = Column(Float, nullable=False)
    per_capita_income_inr = Column(Float, nullable=False)
    subdivisions_count = Column(Integer, default=1, nullable=False)
    wards_or_blocks_count = Column(Integer, default=1, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    geography = Column(Text, nullable=True)
    administrative_hq = Column(String(128), nullable=True)

    # Relationships
    indicators = relationship("DevelopmentIndicator", back_populates="city", cascade="all, delete-orphan")
    policies = relationship("DevelopmentPolicy", back_populates="city", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="city", cascade="all, delete-orphan")
    civic_actions = relationship("CivicAction", back_populates="city", cascade="all, delete-orphan")
    local_resources = relationship("LocalResource", back_populates="city", cascade="all, delete-orphan")
    
    target_benchmarks = relationship(
        "CityBenchmark",
        foreign_keys="CityBenchmark.target_city_id",
        back_populates="target_city",
        cascade="all, delete-orphan"
    )
    benchmark_references = relationship(
        "CityBenchmark",
        foreign_keys="CityBenchmark.benchmark_city_id",
        back_populates="benchmark_city",
        cascade="all, delete-orphan"
    )
