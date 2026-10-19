from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class IndicatorSourceBase(BaseModel):
    organization_name: str
    publication_title: str
    collection_date: datetime
    methodology: Optional[str] = None
    verification_status: str = "Demonstration Model"
    is_official: bool = False
    source_url: Optional[str] = None


class IndicatorSourceCreate(IndicatorSourceBase):
    pass


class IndicatorSourceResponse(IndicatorSourceBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DevelopmentIndicatorBase(BaseModel):
    city_id: str
    sector: str
    metric_key: str
    metric_name: str
    value: float
    unit: str
    reporting_period: str = Field(..., description="Reporting period, e.g. 2025-2026")
    data_source: str = Field(..., description="Originating source organization")
    collection_date: datetime = Field(..., description="Date indicator was audited/collected")
    verification_status: str = Field("Demonstration Model", description="Audit or model status")
    is_demonstration: bool = True
    confidence_score: float = 0.90
    source_id: Optional[str] = None


class DevelopmentIndicatorCreate(DevelopmentIndicatorBase):
    pass


class DevelopmentIndicatorResponse(DevelopmentIndicatorBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BenchmarkMetricComparison(BaseModel):
    metric_key: str
    metric_name: str
    sector: str
    target_value: float
    benchmark_value: float
    gap_percentage: float
    priority: str
    estimated_runway_years: float
    notes: Optional[str] = None


class CityComparisonResponse(BaseModel):
    target_city_id: str
    target_city_name: str
    benchmark_city_id: str
    benchmark_city_name: str
    overall_gap_percentage: float
    average_runway_years: float
    metrics: List[BenchmarkMetricComparison]
    methodology: str = "Standardized Z-Score Delta Normalization"
    is_demonstration: bool = True
