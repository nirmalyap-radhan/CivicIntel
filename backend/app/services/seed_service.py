from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.city import City
from app.models.indicator import IndicatorSource, DevelopmentIndicator, CityBenchmark
from app.models.policy import DevelopmentPolicy, PolicyEvaluation
from app.models.user import User
from app.models.civic import CivicAction, CivicCredit, CivicAuditLog, CommunityInitiative
from app.models.investment import Investment, InvestmentEnquiry, LocalResource
from app.ml.investment_engine import CURATED_LOCAL_RESOURCES, CURATED_OPPORTUNITY_METADATA
import json


def seed_database(db: Session) -> None:
    """
    Populates database with realistic, clearly labeled demonstration data
    for Koraput and Bhubaneswar, Odisha.
    """
    # Check if already seeded
    if db.query(City).filter(City.id == "koraput").first():
        seed_marketplace_data(db)
        return

    # 1. Seed Cities
    koraput = City(
        id="koraput",
        name="Koraput",
        state="Odisha",
        category="Aspirational District Hub",
        population=1379647,
        area_sq_km=8807.0,
        literacy_rate=49.2,
        per_capita_income_inr=68500.0,
        subdivisions_count=2,
        wards_or_blocks_count=14,
        latitude=18.8135,
        longitude=82.7123,
        description="Bio-diverse highland district in Southern Odisha with rich agro-forestry and tribal demographic.",
        geography="Highland plateau & Eastern Ghats elevation 870m MSL.",
        administrative_hq="Koraput Town",
    )
    bhubaneswar = City(
        id="bhubaneswar",
        name="Bhubaneswar",
        state="Odisha",
        category="Tier-2 Capital / Benchmark Smart City",
        population=1115000,
        area_sq_km=422.0,
        literacy_rate=91.8,
        per_capita_income_inr=215400.0,
        subdivisions_count=3,
        wards_or_blocks_count=67,
        latitude=20.2961,
        longitude=85.8245,
        description="Capital city and educational/IT powerhouse of Odisha with integrated command operations (BOC).",
        geography="Coastal Mahanadi delta plain fringe.",
        administrative_hq="Bhubaneswar Municipal Corporation (BMC)",
    )
    db.add_all([koraput, bhubaneswar])
    db.flush()

    # 2. Seed Indicator Sources
    source_niti = IndicatorSource(
        id="src-niti-01",
        organization_name="NITI Aayog Aspirational Districts Program",
        publication_title="Aspirational Districts Baseline & Delta Rankings 2025-26",
        collection_date=datetime(2025, 12, 1, tzinfo=timezone.utc),
        methodology="Multi-indicator monthly composite audit across health, education, and basic infra",
        verification_status="Demonstration Model (Synthesized from NITI Framework)",
        is_official=False,
    )
    source_dmf = IndicatorSource(
        id="src-dmf-02",
        organization_name="District Mineral Foundation Koraput Trust",
        publication_title="Annual District Development & Health Intervention Audit",
        collection_date=datetime(2026, 1, 15, tzinfo=timezone.utc),
        methodology="Field verification across 14 blocks for health sub-centers and Jal Jeevan grids",
        verification_status="Demonstration Model (Synthesized from DMF Audits)",
        is_official=False,
    )
    source_smart_city = IndicatorSource(
        id="src-smart-03",
        organization_name="Bhubaneswar Smart City Limited (BSCL)",
        publication_title="Integrated Command & Control Telemetry Monthly Brief",
        collection_date=datetime(2026, 2, 1, tzinfo=timezone.utc),
        methodology="Automated sensor and municipal service level tracking",
        verification_status="Demonstration Model (Synthesized from BOC Datasets)",
        is_official=False,
    )
    db.add_all([source_niti, source_dmf, source_smart_city])
    db.flush()

    # 3. Seed Indicators for Koraput & Bhubaneswar
    indicators_data = [
        # Healthcare
        ("koraput", "src-dmf-02", "healthcare", "doctor_density", "Doctors per 10,000 Population", 4.8, "Doctors / 10k", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "healthcare", "doctor_density", "Doctors per 10,000 Population", 24.2, "Doctors / 10k", "2025-2026"),
        ("koraput", "src-dmf-02", "healthcare", "bed_density", "Hospital Bed Density", 0.95, "Beds / 1,000 pop", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "healthcare", "bed_density", "Hospital Bed Density", 4.10, "Beds / 1,000 pop", "2025-2026"),
        
        # Education
        ("koraput", "src-niti-01", "education", "secondary_retention", "Secondary School Retention Rate", 61.4, "% Students", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "education", "secondary_retention", "Secondary School Retention Rate", 94.6, "% Students", "2025-2026"),
        ("koraput", "src-niti-01", "education", "stem_enrollment", "Higher Secondary STEM Enrollment", 28.5, "% of 11th/12th Students", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "education", "stem_enrollment", "Higher Secondary STEM Enrollment", 68.2, "% of 11th/12th Students", "2025-2026"),

        # Infrastructure
        ("koraput", "src-dmf-02", "infrastructure", "piped_water_coverage", "Piped Drinking Water Household Coverage", 48.2, "% Households", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "infrastructure", "piped_water_coverage", "Piped Drinking Water Household Coverage", 93.8, "% Households", "2025-2026"),
        ("koraput", "src-niti-01", "infrastructure", "road_connectivity", "All-Weather Road Habitation Connectivity", 74.6, "% Eligible Habitations", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "infrastructure", "road_connectivity", "All-Weather Road Habitation Connectivity", 99.2, "% Eligible Habitations", "2025-2026"),
        ("koraput", "src-dmf-02", "infrastructure", "broadband_access", "High-Speed Broadband Household Penetration", 24.1, "% Households", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "infrastructure", "broadband_access", "High-Speed Broadband Household Penetration", 88.5, "% Households", "2025-2026"),

        # Employment
        ("koraput", "src-niti-01", "employment", "formal_jobs_ratio", "Formal Non-Agricultural Employment", 26.8, "% Total Workforce", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "employment", "formal_jobs_ratio", "Formal Non-Agricultural Employment", 84.1, "% Total Workforce", "2025-2026"),

        # Governance
        ("koraput", "src-niti-01", "governance", "digital_services_ratio", "Municipal Digital Service Delivery Ratio", 56.0, "% Services Online", "2025-2026"),
        ("bhubaneswar", "src-smart-03", "governance", "digital_services_ratio", "Municipal Digital Service Delivery Ratio", 96.5, "% Services Online", "2025-2026"),
    ]

    for c_id, src_id, sec, key, name, val, unit, period in indicators_data:
        ind = DevelopmentIndicator(
            city_id=c_id,
            source_id=src_id,
            sector=sec,
            metric_key=key,
            metric_name=name,
            value=val,
            unit=unit,
            reporting_period=period,
            data_source="CivicIntel Synthesized Demonstration Audit",
            collection_date=datetime(2026, 1, 1, tzinfo=timezone.utc),
            verification_status="Demonstration Model",
            is_demonstration=True,
            confidence_score=0.92,
        )
        db.add(ind)

    # 4. Seed City Benchmarks
    benchmarks_data = [
        ("koraput", "bhubaneswar", "healthcare", "doctor_density", "Doctors per 10,000 Population", 4.8, 24.2, -80.2, "Critical", 6.5, "Severe deficit in interior rural sub-centers."),
        ("koraput", "bhubaneswar", "healthcare", "bed_density", "Hospital Bed Density", 0.95, 4.10, -76.8, "Critical", 5.0, "District hospital expansion underway."),
        ("koraput", "bhubaneswar", "education", "secondary_retention", "Secondary School Retention Rate", 61.4, 94.6, -35.1, "High", 4.2, "Language transition Kui/Odia to English."),
        ("koraput", "bhubaneswar", "infrastructure", "piped_water_coverage", "Piped Drinking Water Household Coverage", 48.2, 93.8, -48.6, "High", 3.5, "Solar-gravity reticulation required."),
        ("koraput", "bhubaneswar", "employment", "formal_jobs_ratio", "Formal Non-Agricultural Employment", 26.8, 84.1, -68.1, "Critical", 5.5, "High agro-processing potential in Jeypore."),
    ]

    for t_id, b_id, sec, key, name, t_val, b_val, gap, pri, run, notes in benchmarks_data:
        bench = CityBenchmark(
            target_city_id=t_id,
            benchmark_city_id=b_id,
            sector=sec,
            metric_key=key,
            metric_name=name,
            target_value=t_val,
            benchmark_value=b_val,
            gap_percentage=gap,
            priority=pri,
            estimated_runway_years=run,
            notes=notes,
        )
        db.add(bench)

    # 5. Seed Users
    admin_user = User(
        id="usr-admin-01",
        email="admin@civicintel.in",
        hashed_password=get_password_hash("AdminPass123!"),
        full_name="Dr. Ananya Mishra",
        role="system_admin",
        department_or_org="Odisha State Urban Development Agency",
        is_active=True,
        is_superuser=True,
    )
    official_user = User(
        id="usr-gov-02",
        email="collector.koraput@odisha.gov.in",
        hashed_password=get_password_hash("GovOfficialPass123!"),
        full_name="Rajeev Sharma, IAS",
        role="government_official",
        department_or_org="District Administration Koraput",
        is_active=True,
        is_superuser=False,
    )
    citizen_user = User(
        id="usr-citizen-03",
        email="citizen.sambit@koraput.in",
        hashed_password=get_password_hash("CitizenPass123!"),
        full_name="Sambit Majhi",
        role="citizen",
        department_or_org="Jeypore Resident Welfare Association",
        is_active=True,
        is_superuser=False,
    )
    investor_user = User(
        id="usr-investor-04",
        email="investor.capital@easterninfra.in",
        hashed_password=get_password_hash("InvestorPass123!"),
        full_name="Pooja Agarwal",
        role="investor",
        department_or_org="Eastern India Infrastructure Fund",
        is_active=True,
        is_superuser=False,
    )
    db.add_all([admin_user, official_user, citizen_user, investor_user])
    db.flush()

    # 6. Seed Policies
    pol1 = DevelopmentPolicy(
        id="pol-01",
        city_id="koraput",
        title="Solar-Powered Mobile Telemedicine & 4x4 Emergency Grid",
        sector="healthcare",
        priority="Immediate",
        status="Approved",
        estimated_budget_cr=32.0,
        funding_mechanism="DMF Koraput + National Health Mission (60:40)",
        time_to_implement_months=9,
        created_by_user_id=official_user.id,
        approved_by_user_id=official_user.id,
        approved_at=datetime.now(timezone.utc),
    )
    pol1_eval = PolicyEvaluation(
        policy_id="pol-01",
        impact_score=92.0,
        feasibility_score=88.0,
        cost_benefit_ratio=3.4,
        expected_outcomes='["Expand weekly doctor visits to 180+ remote tribal hamlets", "Reduce maternal referral delays by 42%"]',
        evidence_base="ISRO telemedicine pilot data & SLN Medical College outreach registry",
        risk_assessment="Hilly dead-zones tackled with satellite transponders",
    )
    db.add_all([pol1, pol1_eval])

    pol2 = DevelopmentPolicy(
        id="pol-02",
        city_id="koraput",
        title="GI Koraput Coffee & Millet Mega Food Processing Park",
        sector="employment",
        priority="Strategic",
        status="Under Review",
        estimated_budget_cr=65.0,
        funding_mechanism="OMBADC + Private PPP Concessionaire",
        time_to_implement_months=18,
        created_by_user_id=official_user.id,
    )
    pol2_eval = PolicyEvaluation(
        policy_id="pol-02",
        impact_score=95.0,
        feasibility_score=82.0,
        cost_benefit_ratio=4.1,
        expected_outcomes='["Create 3,500 formal jobs", "Increase coffee farmer farmgate income by 38%"]',
        evidence_base="Odisha Agro Policy 2023 feasibility benchmarks",
        risk_assessment="Power grid stability handled with captive solar rooftop",
    )
    db.add_all([pol2, pol2_eval])

    # 7. Seed Investments
    inv1 = Investment(
        id="inv-01",
        city_id="koraput",
        title="Koraput Valley Organic Coffee & Spices Integrated Curing Complex",
        sector="employment",
        location="Jeypore-Borigumma Highway Corridor",
        project_type="PPP",
        capex_in_cr=85.0,
        expected_irr_percent=18.5,
        esg_rating="A+",
        status="Land Bank Allocated",
        direct_jobs=1450,
        brief="A 40-acre facility for coffee pulping, curing, grading, vacuum sealing and export lab.",
    )
    inv2 = Investment(
        id="inv-02",
        city_id="bhubaneswar",
        title="Infocity-2 Semiconductor Compound & Testing Cleanroom",
        sector="employment",
        location="Infovalley Corridor, Khordha-Bhubaneswar",
        project_type="PPP",
        capex_in_cr=240.0,
        expected_irr_percent=21.0,
        esg_rating="A",
        status="Land Bank Allocated",
        direct_jobs=3200,
        brief="Specialized facility with cleanroom infrastructure for semiconductor design and OSAT units.",
    )
    db.add_all([inv1, inv2])

    # 8. Seed Civic Actions & Credits
    # 8. Seed Civic Actions, Audit Logs, Credits & Initiatives
    act1 = CivicAction(
        id="act-civ-01",
        user_id=citizen_user.id,
        city_id="koraput",
        action_type="water_quality_report",
        category="water_quality_report",
        title="Turbidity test on Kolab catchment feeder stream",
        description="Collected and logged water sample turbidity reading using municipal sensor kit.",
        evidence_url="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
        location_details="Semiliguda Block, Tola 4",
        coarse_location="Semiliguda Block, Ward 4",
        precise_location_private="GPS 18.712, 82.842 (Private Survey Point)",
        public_consent=True,
        verification_status="verified",
        reviewer_notes="Water sample verified against district PHED standards. Sensor turbidity readings validated.",
        verified_by_user_id=official_user.id,
        verified_at=datetime.now(timezone.utc),
    )
    db.add(act1)
    db.flush()

    audit1 = CivicAuditLog(
        civic_action_id=act1.id,
        changed_by_user_id=official_user.id,
        previous_status="pending_verification",
        new_status="verified",
        action_taken="verified_and_rewarded",
        notes="Official inspection complete. 50 civic green credits awarded.",
    )
    db.add(audit1)

    cred1 = CivicCredit(
        user_id=citizen_user.id,
        civic_action_id=act1.id,
        points_delta=50,
        transaction_type="earn_verification",
        verification_outcome="approved",
        notes="Awarded 50 civic green credits for verified water monitoring submission.",
    )
    db.add(cred1)

    # Road damage report (example workflow from prompt)
    act2 = CivicAction(
        id="act-civ-02",
        user_id=citizen_user.id,
        city_id="koraput",
        action_type="damaged_road",
        category="damaged_road",
        title="Monsoon Shoulder Scouring and Asphalt Potholes on Semiliguda Ghat",
        description="Heavy monsoon rains caused 2.5-meter asphalt erosion along the outer curve. Two-wheelers and ambulances forced to swerve into oncoming traffic.",
        evidence_url="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        location_details="Semiliguda - Damanjodi Ghat Corridor",
        coarse_location="Semiliguda Ghat Corridor, Km 14",
        precise_location_private="Between Culvert #18 and Milestones 14/2 (GPS: 18.795, 82.883)",
        public_consent=True,
        verification_status="pending_verification",
        reviewer_notes=None,
    )
    db.add(act2)
    db.flush()

    audit2 = CivicAuditLog(
        civic_action_id=act2.id,
        changed_by_user_id=citizen_user.id,
        previous_status=None,
        new_status="pending_verification",
        action_taken="submitted",
        notes="Report logged by citizen with photographic evidence. Queued for municipal review.",
    )
    db.add(audit2)

    # Community Initiatives
    init1 = CommunityInitiative(
        id="init-01",
        city_id="koraput",
        title="Kolab Watershed Perennial Spring Rejuvenation Drive",
        category="environment",
        description="Community desilting of natural spring aquifers, boulder bunding, and vetiver grass planting along the catchment slopes.",
        organizer="Koraput District Watershed Mission & Tribal Youth SHG Federation",
        location_area="Kolab Reservoir Catchment Zone, Semiliguda",
        target_participants=60,
        current_volunteers=38,
        scheduled_date=datetime(2026, 4, 12, 8, 0, tzinfo=timezone.utc),
        points_reward=100,
        status="Open",
    )
    init2 = CommunityInitiative(
        id="init-02",
        city_id="koraput",
        title="Highland Agro-Forestry Shade Tree Planting Drive",
        category="environment",
        description="Planting 2,000 indigenous Silver Oak and fruit shade-tree saplings across smallholder coffee blocks to prevent topsoil erosion.",
        organizer="Coffee Board Outreach Centre & Mission Shakti WSHGs",
        location_area="Laxmipur Hill Tracts, Koraput",
        target_participants=80,
        current_volunteers=54,
        scheduled_date=datetime(2026, 4, 25, 7, 30, tzinfo=timezone.utc),
        points_reward=75,
        status="Open",
    )
    init3 = CommunityInitiative(
        id="init-03",
        city_id="bhubaneswar",
        title="Gangua Nallah Stormwater Drain Desilting Audit Walk",
        category="sanitation",
        description="Citizen-led inspection and sensor tagging of storm water outfalls in Ward 54 ahead of monsoon flash flooding.",
        organizer="Bhubaneswar Municipal Corporation Civic Volunteers",
        location_area="Sundarpada Lowland Perimeter, Bhubaneswar",
        target_participants=40,
        current_volunteers=40,
        scheduled_date=datetime(2026, 5, 2, 9, 0, tzinfo=timezone.utc),
        points_reward=50,
        status="In Progress",
    )
    db.add_all([init1, init2, init3])

    db.commit()

    # 9. Seed Marketplace Resources & Opportunities
    seed_marketplace_data(db)


def seed_marketplace_data(db: Session) -> None:
    """
    Populates curated Resource Directory, verified Opportunity Listings,
    statutory evidence, regulatory considerations, and sample enquiries.
    """
    try:
        from sqlalchemy import text
        columns = [
            ("is_verified", "BOOLEAN DEFAULT TRUE"),
            ("verification_stage", "VARCHAR(64) DEFAULT 'Verified DPR'"),
            ("supporting_evidence", "TEXT"),
            ("potential_partners", "TEXT"),
            ("regulatory_considerations", "TEXT"),
            ("cost_breakdown_json", "TEXT"),
            ("revenue_range_json", "TEXT"),
            ("risk_factors_json", "TEXT"),
            ("assumptions_disclosed", "TEXT"),
        ]
        for col_name, col_type in columns:
            try:
                db.execute(text(f"ALTER TABLE investments ADD COLUMN IF NOT EXISTS {col_name} {col_type}"))
                db.commit()
            except Exception:
                db.rollback()
    except Exception:
        pass

    # 1. Seed or update Opportunities
    opportunities_data = [
        {
            "id": "inv-01",
            "city_id": "koraput",
            "title": "Koraput Valley Organic Coffee & Spices Integrated Curing Complex",
            "sector": "employment",
            "location": "Jeypore-Borigumma Highway Corridor",
            "project_type": "PPP",
            "capex_in_cr": 85.0,
            "expected_irr_percent": 18.5,
            "esg_rating": "A+",
            "status": "Land Bank Allocated",
            "direct_jobs": 1450,
            "brief": "A 40-acre integrated facility for coffee pulping, curing, grading, vacuum sealing, and international roasting certification lab.",
            "is_verified": True,
            "verification_stage": "Verified DPR",
            "supporting_evidence": "Odisha Food Processing Policy 2023 (Sec 4.2 Capital Subsidy); APICOL Techno-Economic Feasibility Report AGRI-OD-2024-KPT-01; Coffee Board export feasibility study.",
            "potential_partners": "APICOL, Coffee Board of India, TDCCOL, 18 Tribal Primary Agricultural Cooperative Societies (PACS), Mission Shakti WSHG Federations",
            "regulatory_considerations": "Schedule V tribal land tenancy safeguards under Regulation 2 of 1956 strictly observed: project land held in 99-year non-alienable leasehold through IDCO Industrial Land Bank; Forest Rights Act NOC verified; State Pollution Control Board Consent to Establish (Orange Category).",
            "cost_breakdown_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-01"]["cost_breakdown"]),
            "revenue_range_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-01"]["revenue_trajectory"]),
            "risk_factors_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-01"]["risk_factors"]),
            "assumptions_disclosed": "10-year asset horizon, 25% state capital subsidy under Odisha Agriculture Policy, 70:30 senior debt structure, straight-line depreciation at 10% p.a., 25.17% corporate tax rate (Sec 115BAA).",
        },
        {
            "id": "inv-02",
            "city_id": "bhubaneswar",
            "title": "Infocity-2 Semiconductor Compound & Testing Cleanroom",
            "sector": "employment",
            "location": "Infovalley Corridor, Khordha-Bhubaneswar",
            "project_type": "PPP",
            "capex_in_cr": 240.0,
            "expected_irr_percent": 21.0,
            "esg_rating": "A",
            "status": "Land Bank Allocated",
            "direct_jobs": 3200,
            "brief": "Specialized cleanroom testing utility equipped with ultra-pure gas supply, vibration-isolated foundations, and OSAT validation chambers.",
            "is_verified": True,
            "verification_stage": "State Sanctioned",
            "supporting_evidence": "Odisha Semiconductor Manufacturing & Fabless Policy 2023 (Clause 5.1 Cleanroom Subsidy); India Semiconductor Mission (ISM) Guidelines; IDCO Infovalley Master Plan.",
            "potential_partners": "Electronics & IT Department Odisha, IDCO, IIT Bhubaneswar, IIIT Bhubaneswar, MeitY India Semiconductor Mission",
            "regulatory_considerations": "Hazardous Gas Safety Clearance (PESO) for silane and phosphine gases; State Pollution Control Board Consent-to-Establish with mandatory Zero Liquid Discharge (ZLD) plant; Dual redundant 220kV power transmission approval.",
            "cost_breakdown_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-02"]["cost_breakdown"]),
            "revenue_range_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-02"]["revenue_trajectory"]),
            "risk_factors_json": json.dumps(CURATED_OPPORTUNITY_METADATA["inv-02"]["risk_factors"]),
            "assumptions_disclosed": "10-year asset horizon, 30% state capital subsidy under Odisha Semiconductor Policy 2023, 70:30 senior debt structure, straight-line depreciation at 10% p.a., 25.17% corporate tax rate.",
        },
        {
            "id": "inv-03",
            "city_id": "koraput",
            "title": "Kolab Hydro Reservoir Eco-Tourism & Watersports Experiential Circuit",
            "sector": "environment",
            "location": "Upper Kolab Dam Catchment Area, Koraput",
            "project_type": "State Joint Venture",
            "capex_in_cr": 42.0,
            "expected_irr_percent": 16.2,
            "esg_rating": "A",
            "status": "Detailed Project Report",
            "direct_jobs": 620,
            "brief": "Low-impact eco-lodges, solar-powered electric safari catamarans, trekking camps, and an indigenous tribal crafts amphitheater overlooking Kolab lake.",
            "is_verified": True,
            "verification_stage": "Verified DPR",
            "supporting_evidence": "Odisha Eco-Tourism Policy 2022; Department of Water Resources reservoir recreation concession guidelines.",
            "potential_partners": "Odisha Tourism Development Corporation (OTDC), Department of Water Resources, Kolab Catchment Vana Surakshya Samitis (VSS)",
            "regulatory_considerations": "Full environmental impact clearance; strict prohibition on internal combustion motorboats (solar-electric propulsion mandatory); coastal/wetland conservation buffer compliance.",
            "cost_breakdown_json": json.dumps({
                "capex": [
                    {"category": "Solar Eco-Cottages & Floating Jetties", "amount_cr": 18.0, "share_percent": 42.9, "description": "Prefabricated sustainable timber and bamboo villas"},
                    {"category": "Electric Safari Catamarans & Solar Charging Dock", "amount_cr": 12.0, "share_percent": 28.6, "description": "Zero-emission battery swapping watercraft fleet"},
                    {"category": "Bio-filtration Septic & Solar Microgrid", "amount_cr": 7.0, "share_percent": 16.7, "description": "100% off-grid clean energy and closed-loop wastewater recycling"},
                    {"category": "Tribal Heritage Amphitheater & Interpretive Centre", "amount_cr": 5.0, "share_percent": 11.8, "description": "Community performance venue and craft showroom"},
                ],
                "opex": [
                    {"category": "Hospitality & Eco-Guide Community Staffing", "amount_cr": 4.2, "share_percent": 45.0, "description": "Local tribal youth trained as naturalists and hospitality stewards"},
                    {"category": "Vessel & Facility Maintenance", "amount_cr": 2.5, "share_percent": 26.8, "description": "Battery maintenance and marine craft upkeep"},
                    {"category": "Eco-Tourism Marketing & OTDC Channel Fees", "amount_cr": 1.6, "share_percent": 17.2, "description": "State tourism portal booking integration and campaigns"},
                    {"category": "Community Benefit Sharing Fund", "amount_cr": 1.0, "share_percent": 11.0, "description": "Mandatory revenue share with adjacent gram panchayats"},
                ]
            }),
            "revenue_range_json": json.dumps([
                {"year": 1, "min_revenue_cr": 8.0, "expected_revenue_cr": 11.2, "max_revenue_cr": 14.5, "driver_notes": "Phase 1 launch with 18 eco-cottages and 4 catamarans"},
                {"year": 2, "min_revenue_cr": 12.5, "expected_revenue_cr": 16.0, "max_revenue_cr": 20.0, "driver_notes": "Corporate retreat bookings and winter peak season expansion"},
                {"year": 3, "min_revenue_cr": 16.0, "expected_revenue_cr": 21.5, "max_revenue_cr": 26.0, "driver_notes": "Steady-state 72% annual occupancy with adventure sports revenue"},
                {"year": 4, "min_revenue_cr": 19.0, "expected_revenue_cr": 24.8, "max_revenue_cr": 30.5, "driver_notes": "International wellness retreat collaborations"},
                {"year": 5, "min_revenue_cr": 22.0, "expected_revenue_cr": 28.2, "max_revenue_cr": 34.0, "driver_notes": "High-margin experiential tourism with full capacity utilization"},
            ]),
            "risk_factors_json": json.dumps([
                {"risk": "Seasonal Monsoon Tourist Influx Variances", "category": "Market", "severity": "Medium", "probability": "High", "mitigation_strategy": "Monsoon wellness retreat packaging and year-round conference promotions", "residual_risk": "Low"},
                {"risk": "Catchment Environmental Consent Audits", "category": "Regulatory", "severity": "High", "probability": "Low", "mitigation_strategy": "Zero-discharge biological wastewater processing and strict solar propulsion rules", "residual_risk": "Very Low"},
            ]),
            "assumptions_disclosed": "10-year concession period, 20% state tourism capital incentive, 65% base occupancy, corporate tax 25.17%.",
        },
        {
            "id": "inv-04",
            "city_id": "koraput",
            "title": "Decentralized Solar Cold Chain Network for Horticultural Produce",
            "sector": "infrastructure",
            "location": "Distributed across 8 Blocks (Semiliguda, Kundura, Pottangi, etc.)",
            "project_type": "Private Sector",
            "capex_in_cr": 34.5,
            "expected_irr_percent": 19.8,
            "esg_rating": "A+",
            "status": "Expression of Interest",
            "direct_jobs": 480,
            "brief": "A network of 14 modular, thermal-storage 10-MT solar cold rooms preventing distress sales of seasonal ginger, sweet potatoes, organic vegetables, and pineapples.",
            "is_verified": True,
            "verification_stage": "Expression of Interest",
            "supporting_evidence": "Mission for Integrated Development of Horticulture (MIDH) operational norms; PM Formalisation of Micro food processing Enterprises Scheme (PMFME).",
            "potential_partners": "District Mineral Foundation (DMF) Trust Koraput, ORMAS, NABARD, FPO Federations",
            "regulatory_considerations": "Gram Sabha resolution consent for common property installation; Rooftop solar net-metering interconnection approval from SOUTHCO.",
            "cost_breakdown_json": json.dumps({
                "capex": [
                    {"category": "14 Modular Solar Cold Storage Units (10-MT each)", "amount_cr": 19.5, "share_percent": 56.5, "description": "Phase-change material thermal storage cold chambers"},
                    {"category": "Solar PV Arrays (Combined 420 kWp)", "amount_cr": 8.0, "share_percent": 23.2, "description": "High-efficiency monocrystalline solar panels with battery backup"},
                    {"category": "IoT Cold Chain Telemetry & Remote Monitoring", "amount_cr": 3.5, "share_percent": 10.1, "description": "Cloud-connected temperature and humidity sensors"},
                    {"category": "Civil Foundations & Shaded Loading Bays", "amount_cr": 3.5, "share_percent": 10.1, "description": "Paved farmer unloading bays and solar canopies"},
                ],
                "opex": [
                    {"category": "Local Village Operators & Maintenance Technicians", "amount_cr": 3.2, "share_percent": 48.0, "description": "Certified local operators per cold room hub"},
                    {"category": "Telemetry Cloud Infrastructure & Insurance", "amount_cr": 1.5, "share_percent": 22.4, "description": "Sensors and asset breakdown insurance"},
                    {"category": "Periodic Servicing & Refrigerant Audits", "amount_cr": 1.2, "share_percent": 17.9, "description": "Compressor servicing and non-ODS refrigerant checks"},
                    {"category": "FPO Outreach & Capacity Training", "amount_cr": 0.8, "share_percent": 11.7, "description": "Farmer harvest scheduling and storage workshops"},
                ]
            }),
            "revenue_range_json": json.dumps([
                {"year": 1, "min_revenue_cr": 6.5, "expected_revenue_cr": 8.5, "max_revenue_cr": 10.8, "driver_notes": "Initial 8 units operational during ginger harvest"},
                {"year": 2, "min_revenue_cr": 10.0, "expected_revenue_cr": 13.0, "max_revenue_cr": 16.0, "driver_notes": "All 14 units commissioned across 8 blocks"},
                {"year": 3, "min_revenue_cr": 13.5, "expected_revenue_cr": 17.2, "max_revenue_cr": 21.0, "driver_notes": "Price arbitrage realization in Raipur and Vizag wholesale mandis"},
                {"year": 4, "min_revenue_cr": 15.0, "expected_revenue_cr": 19.5, "max_revenue_cr": 24.0, "driver_notes": "Multi-season utilization covering winter vegetables and summer fruits"},
                {"year": 5, "min_revenue_cr": 17.0, "expected_revenue_cr": 22.0, "max_revenue_cr": 27.5, "driver_notes": "Optimal steady-state operations across all 14 nodes"},
            ]),
            "risk_factors_json": json.dumps([
                {"risk": "Solar Thermal Energy Deficits during Extended Monsoons", "category": "Climate", "severity": "Medium", "probability": "Low", "mitigation_strategy": "Hybrid grid tie-in with SOUTHCO net metering and phase-change thermal backup buffers", "residual_risk": "Low"},
                {"risk": "Farmer Adoption & Pre-cooling Compliance", "category": "Execution", "severity": "Medium", "probability": "Medium", "mitigation_strategy": "Direct partnership with ORMAS and FPO board directors with discounted introductory rates", "residual_risk": "Low"},
            ]),
            "assumptions_disclosed": "DMF infrastructure grant supporting 40% civil works cost, 10-year asset horizon, 25.17% corporate tax.",
        },
    ]

    for opp_data in opportunities_data:
        existing = db.query(Investment).filter(Investment.id == opp_data["id"]).first()
        if existing:
            for k, v in opp_data.items():
                setattr(existing, k, v)
        else:
            db.add(Investment(**opp_data))
    db.commit()

    # 2. Seed Local Resources
    if db.query(LocalResource).count() == 0:
        for res in CURATED_LOCAL_RESOURCES:
            db.add(LocalResource(**res))
        db.commit()

    # 3. Seed Sample Investor Enquiry
    if db.query(InvestmentEnquiry).count() == 0:
        sample_enquiry = InvestmentEnquiry(
            id="enq-01",
            investment_id="inv-01",
            investor_name="Siddharth Ray",
            investor_email="siddharth.ray@orientcapital.in",
            organization="Orient Agri-Venture Partners LLP",
            proposed_investment_cr=25.0,
            target_timeline="3-6 months",
            message="We represent an institutional agro-processing impact fund. We are interested in reviewing the Detailed Project Report (DPR) and exploring a minority equity co-investment partnership with APICOL for the organic coffee curing complex.",
            contact_phone="+91-98765-43210",
            status="Under Evaluation",
        )
        db.add(sample_enquiry)
        db.commit()


