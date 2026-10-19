import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import RoleChecker, get_current_user
from app.ml.investment_engine import (
    CURATED_LOCAL_RESOURCES,
    CURATED_OPPORTUNITY_METADATA,
    generate_investment_analysis,
)
from app.models.investment import Investment, InvestmentEnquiry, LocalResource
from app.models.user import User
from app.schemas.investment import (
    InvestmentAnalysisRequest,
    InvestmentAnalysisResponse,
    InvestmentCreate,
    InvestmentEnquiryCreate,
    InvestmentEnquiryResponse,
    InvestmentResponse,
    LocalResourceCreate,
    LocalResourceResponse,
)

router = APIRouter()


# ==========================================
# 1. RESOURCE DIRECTORY ENDPOINTS
# ==========================================

@router.get("/resources", response_model=List[LocalResourceResponse])
def get_resource_directory(
    city_id: Optional[str] = Query(None, description="Filter resources by city (e.g. koraput, bhubaneswar)"),
    category: Optional[str] = Query(None, description="agricultural, local_product, workforce, tourism, existing_business"),
    db: Session = Depends(get_db),
):
    """
    Retrieves the curated Resource Directory catalog:
    * Agricultural resources (GI coffee, millets, hill spices)
    * Local products (GI textiles, wild forest honey, silver filigree)
    * Workforce capabilities (WSHG agro-processing, precision machinists, software engineers)
    * Tourism opportunities (high-altitude trekking, lake circuits, heritage temples)
    * Existing anchor businesses (HAL Aero-Engine, NALCO, Coffee Board, IT Parks)
    """
    query = db.query(LocalResource)
    if city_id:
        query = query.filter(LocalResource.city_id == city_id)
    if category and category != "all":
        query = query.filter(LocalResource.category == category)
    
    results = query.all()
    # In case table was not yet seeded in active session, fallback to curated in-memory dataset
    if not results:
        filtered = CURATED_LOCAL_RESOURCES
        if city_id:
            filtered = [r for r in filtered if r["city_id"] == city_id]
        if category and category != "all":
            filtered = [r for r in filtered if r["category"] == category]
        return [
            LocalResourceResponse(
                id=r["id"],
                city_id=r["city_id"],
                category=r["category"],
                title=r["title"],
                description=r["description"],
                key_metrics=r["key_metrics"],
                certifications_or_anchor=r.get("certifications_or_anchor"),
                growth_potential=r["growth_potential"],
                supporting_source=r["supporting_source"],
                created_at=r.get("created_at") or "2026-01-01T00:00:00Z",
                updated_at=r.get("updated_at") or "2026-01-01T00:00:00Z",
            )
            for r in filtered
        ]
    return results


@router.post("/resources", response_model=LocalResourceResponse, status_code=status.HTTP_201_CREATED)
def create_local_resource(
    res_in: LocalResourceCreate,
    current_user: User = Depends(RoleChecker(["government_official", "system_admin"])),
    db: Session = Depends(get_db),
):
    """Adds a new verified resource entry to the local economic directory."""
    new_res = LocalResource(
        city_id=res_in.city_id,
        category=res_in.category,
        title=res_in.title,
        description=res_in.description,
        key_metrics=res_in.key_metrics,
        certifications_or_anchor=res_in.certifications_or_anchor,
        growth_potential=res_in.growth_potential,
        supporting_source=res_in.supporting_source,
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res


# ==========================================
# 2. OPPORTUNITY LISTINGS ENDPOINTS
# ==========================================

@router.get("/opportunities", response_model=List[InvestmentResponse])
@router.get("", response_model=List[InvestmentResponse])
def read_investments(
    city_id: Optional[str] = Query(None),
    sector: Optional[str] = Query(None),
    project_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Lists bankable investment opportunities with verified status, supporting evidence,
    potential institutional partners, and statutory regulatory considerations.
    """
    query = db.query(Investment)
    if city_id:
        query = query.filter(Investment.city_id == city_id)
    if sector and sector != "all":
        query = query.filter(Investment.sector == sector.lower())
    if project_type:
        query = query.filter(Investment.project_type == project_type)
    if status_filter and status_filter != "all":
        query = query.filter(Investment.status == status_filter)
    
    investments = query.offset(skip).limit(limit).all()
    # Populate enquiry count for each opportunity
    response_list = []
    for inv in investments:
        resp = InvestmentResponse.model_validate(inv)
        resp.enquiry_count = len(inv.enquiries) if hasattr(inv, "enquiries") and inv.enquiries else 0
        response_list.append(resp)
    return response_list


@router.get("/opportunities/{opportunity_id}", response_model=InvestmentResponse)
def get_opportunity_by_id(
    opportunity_id: str,
    db: Session = Depends(get_db),
):
    """Retrieves full details for a single investment opportunity."""
    inv = db.query(Investment).filter(Investment.id == opportunity_id).first()
    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investment opportunity with ID '{opportunity_id}' not found.",
        )
    resp = InvestmentResponse.model_validate(inv)
    resp.enquiry_count = len(inv.enquiries) if hasattr(inv, "enquiries") and inv.enquiries else 0
    return resp


@router.get("/cities/{city_id}/investments", response_model=List[InvestmentResponse])
def read_city_investments(
    city_id: str,
    db: Session = Depends(get_db),
):
    """Retrieves all investment opportunities targeted for a specific city."""
    investments = db.query(Investment).filter(Investment.city_id == city_id).all()
    response_list = []
    for inv in investments:
        resp = InvestmentResponse.model_validate(inv)
        resp.enquiry_count = len(inv.enquiries) if hasattr(inv, "enquiries") and inv.enquiries else 0
        response_list.append(resp)
    return response_list


@router.post("", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
def create_investment_opportunity(
    inv_in: InvestmentCreate,
    current_user: User = Depends(
        RoleChecker(["government_official", "system_admin", "investor"])
    ),
    db: Session = Depends(get_db),
):
    """Creates a new bankable investment opportunity in the marketplace."""
    db_inv = Investment(
        city_id=inv_in.city_id,
        title=inv_in.title,
        sector=inv_in.sector.lower(),
        location=inv_in.location,
        project_type=inv_in.project_type,
        capex_in_cr=inv_in.capex_in_cr,
        expected_irr_percent=inv_in.expected_irr_percent,
        esg_rating=inv_in.esg_rating,
        status=inv_in.status,
        direct_jobs=inv_in.direct_jobs,
        brief=inv_in.brief,
        is_verified=inv_in.is_verified,
        verification_stage=inv_in.verification_stage,
        supporting_evidence=inv_in.supporting_evidence,
        potential_partners=inv_in.potential_partners,
        regulatory_considerations=inv_in.regulatory_considerations,
        cost_breakdown_json=inv_in.cost_breakdown_json,
        revenue_range_json=inv_in.revenue_range_json,
        risk_factors_json=inv_in.risk_factors_json,
        assumptions_disclosed=inv_in.assumptions_disclosed,
    )
    db.add(db_inv)
    db.commit()
    db.refresh(db_inv)
    return db_inv


# ==========================================
# 3. CONTACT & ENQUIRY WORKFLOW
# ==========================================

@router.post("/enquiries", response_model=InvestmentEnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_investment_enquiry(
    enq_in: InvestmentEnquiryCreate,
    db: Session = Depends(get_db),
):
    """
    Submits an investor enquiry or Expression of Interest (EOI) for an opportunity.
    Registers proposed investment commitments, target timelines, and records an official receipt.
    """
    inv = db.query(Investment).filter(Investment.id == enq_in.investment_id).first()
    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investment opportunity with ID '{enq_in.investment_id}' not found.",
        )

    enquiry = InvestmentEnquiry(
        investment_id=enq_in.investment_id,
        investor_name=enq_in.investor_name,
        investor_email=enq_in.investor_email,
        organization=enq_in.organization,
        proposed_investment_cr=enq_in.proposed_investment_cr,
        target_timeline=enq_in.target_timeline,
        message=enq_in.message,
        contact_phone=enq_in.contact_phone,
        status="Pending Review",
    )
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    resp = InvestmentEnquiryResponse.model_validate(enquiry)
    resp.investment_title = inv.title
    return resp


@router.get("/enquiries", response_model=List[InvestmentEnquiryResponse])
def list_investment_enquiries(
    investment_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
):
    """Lists investor expressions of interest and enquiry records."""
    query = db.query(InvestmentEnquiry)
    if investment_id:
        query = query.filter(InvestmentEnquiry.investment_id == investment_id)
    if status_filter:
        query = query.filter(InvestmentEnquiry.status == status_filter)
    
    enquiries = query.order_by(InvestmentEnquiry.created_at.desc()).all()
    results = []
    for enq in enquiries:
        item = InvestmentEnquiryResponse.model_validate(enq)
        item.investment_title = enq.investment.title if enq.investment else None
        results.append(item)
    return results


# ==========================================
# 4. INVESTMENT SENSITIVITY & ANALYSIS ENGINE
# ==========================================

@router.post("/analyze", response_model=InvestmentAnalysisResponse)
def analyze_investment_opportunity(
    req: InvestmentAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    Performs dynamic, transparent financial sensitivity analysis:
    * User-defined assumptions: capacity utilization, capital subsidy %, tariff multiplier, cost of capital.
    * Scenario comparisons: Conservative, Base Case, Accelerated.
    * Estimated costs: Capex & Opex itemized breakdown.
    * Potential revenue ranges (where defensible): 5-year projections with min, expected, and max bounds.
    * Risk factors & mitigation strategies.
    * 2D Sensitivity Matrix: 5x5 matrix varying utilization and subsidy against IRR & Payback.
    * Explicit disclosure of assumptions and data sources.
    """
    investment_title = "Modeled Civic Development Venture"
    base_capex = req.capex_in_cr or 85.0
    base_irr = 18.5
    custom_metadata = None

    if req.investment_id:
        inv = db.query(Investment).filter(Investment.id == req.investment_id).first()
        if inv:
            investment_title = inv.title
            base_capex = inv.capex_in_cr
            base_irr = inv.expected_irr_percent
            # Parse custom metadata if available
            custom_metadata = {}
            if inv.cost_breakdown_json:
                try:
                    custom_metadata["cost_breakdown"] = json.loads(inv.cost_breakdown_json)
                except Exception:
                    pass
            if inv.revenue_range_json:
                try:
                    custom_metadata["revenue_trajectory"] = json.loads(inv.revenue_range_json)
                except Exception:
                    pass
            if inv.risk_factors_json:
                try:
                    custom_metadata["risk_factors"] = json.loads(inv.risk_factors_json)
                except Exception:
                    pass
        elif req.investment_id in CURATED_OPPORTUNITY_METADATA:
            custom_metadata = CURATED_OPPORTUNITY_METADATA[req.investment_id]

    return generate_investment_analysis(
        req=req,
        investment_title=investment_title,
        base_capex=base_capex,
        base_irr=base_irr,
        custom_metadata=custom_metadata,
    )
