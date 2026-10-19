from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.api.v1.endpoints.health import health_check, readiness_check
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.services.seed_service import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed baseline data on startup (skip in automated test suite)
    if not getattr(settings, "TESTING", False):
        try:
            Base.metadata.create_all(bind=engine)
            db = SessionLocal()
            try:
                seed_database(db)
            finally:
                db.close()
        except Exception:
            pass
    yield



app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    CivicIntel REST API — AI-Powered Civic Intelligence & Urban Benchmarking Platform.
    
    Supports:
    * City intelligence and multi-sector development score computation
    * Granular Koraput (Aspirational Hub) vs Bhubaneswar (Benchmark Capital) comparison
    * Role-gated policy proposals and approvals
    * Citizen actions and verified civic credits
    * Bankable PPP investment marketplace
    
    Note: Data served in demonstration mode represents modeled civic analytics.
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Top-level Health & Readiness probes
app.add_api_route("/health", health_check, tags=["Health"])
app.add_api_route("/ready", readiness_check, tags=["Health"])

# Include Main Version 1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root_endpoint():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "demonstration_mode": settings.DEMONSTRATION_MODE,
        "monitored_cities": ["koraput", "bhubaneswar"],
    }
