from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    cities,
    civic,
    health,
    investments,
    matching,
    policies,
    policy_recommendations,
    rag,
    development,
)

api_router = APIRouter()

# Core & Readiness
api_router.include_router(health.router, tags=["Health"])

# Authentication & RBAC
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# City Benchmark Matching Engine APIs
api_router.include_router(matching.router, prefix="/cities", tags=["City Benchmark Matching"])
api_router.include_router(matching.router, prefix="/matching", tags=["City Benchmark Matching"])

# City & Benchmarking APIs
api_router.include_router(cities.router, prefix="/cities", tags=["Cities & Benchmarking"])

# Development Scoring & Forecasting APIs (Capabilities A & B)
api_router.include_router(development.router, prefix="/development", tags=["Development Scoring & Forecasting"])

# Policy Engine APIs
api_router.include_router(policies.router, prefix="/policies", tags=["Policies"])
api_router.include_router(policy_recommendations.router, prefix="/policy-recommendations", tags=["AI Policy Recommendations"])

# RAG Government Schemes & Evidence Retrieval
api_router.include_router(rag.router, prefix="/rag", tags=["RAG Government Schemes & Evidence"])

# Civic Actions & Credits
api_router.include_router(civic.router, prefix="/civic", tags=["Civic Engagement"])

# Investor Marketplace
api_router.include_router(investments.router, prefix="/investments", tags=["Investments"])


