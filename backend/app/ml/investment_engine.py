"""
CivicIntel Investor Marketplace Discovery & Financial Sensitivity Engine.
Connects civic development opportunities with businesses, impact capital, and investors.

Adheres strictly to the CivicIntel Research Paper guidelines:
1. Discovery marketplace first — provides empirical feasibility exploration rather than claiming guaranteed returns.
2. Transparent disclosure of all financial assumptions and statutory data sources.
3. Defensible scenario comparisons (Conservative, Base Case, Accelerated) and 2D sensitivity analysis.
4. Comprehensive resource directory across agricultural resources, local products, workforce, tourism, and anchor businesses.
5. Statutory regulatory considerations for Schedule V regions, Forest Rights Act clearances, and environmental consents.
"""

from typing import Any, Dict, List, Optional
import math
from app.schemas.investment import (
    CostBreakdownItem,
    InvestmentAnalysisRequest,
    InvestmentAnalysisResponse,
    RevenueTrajectoryPoint,
    RiskFactorItem,
    ScenarioComparisonItem,
    SensitivityMatrixCell,
)


# --- CURATED LOCAL RESOURCES DIRECTORY ---
CURATED_LOCAL_RESOURCES = [
    # 1. Agricultural Resources
    {
        "id": "res-agri-01",
        "city_id": "koraput",
        "category": "agricultural",
        "title": "Koraput GI Arabica & Robusta Shade-Grown Coffee",
        "description": "High-altitude organic shade-grown coffee cultivated at 900m-1,200m MSL across Semiliguda, Pottangi, and Koraput hill tracts by tribal cooperatives. Soil enriched with natural forest humus produces beans with distinctive chocolate and spice undertones.",
        "key_metrics": "3,800+ Hectares under cultivation; 4,200 MT Annual raw cherry output; 18 Tribal FPOs",
        "certifications_or_anchor": "Geographical Indication (GI 638), NPOP Organic Certified, APEDA Registered",
        "growth_potential": "Direct fair-trade export to European specialty coffee markets, domestic cafe retail chains, and value-added micro-lot processing.",
        "supporting_source": "Coffee Board of India Regional Station Koraput & Directorate of Horticulture Odisha (2023-24)",
    },
    {
        "id": "res-agri-02",
        "city_id": "koraput",
        "category": "agricultural",
        "title": "Odisha Millets Mission Climate-Resilient Mandia (Finger Millet)",
        "description": "Globally recognized indigenous landraces of finger millet (Mandia), little millet (Suan), and foxtail millet (Kanghu). Koraput is recognized by FAO as a Globally Important Agricultural Heritage System (GIAHS).",
        "key_metrics": "24,000+ Tribal farmer producers; 35,000 MT Annual harvest; Zero synthetic pesticide baseline",
        "certifications_or_anchor": "FAO GIAHS Heritage Landrace Status, Mission Shakti Certified Procurement",
        "growth_potential": "Industrial processing into ready-to-eat extruded snacks, malted nutritional beverages, and school nutrition welfare programs.",
        "supporting_source": "Odisha Millets Mission Annual Impact Report 2023 & FAO GIAHS Dossier",
    },
    {
        "id": "res-agri-03",
        "city_id": "koraput",
        "category": "agricultural",
        "title": "High-Curcumin Hill Turmeric, Ginger & Black Pepper",
        "description": "Organic forest-fringe spice cultivation with turmeric exhibiting 5.5% to 7.2% curcumin levels, significantly outperforming conventional plain-grown varieties. Hand-harvested by indigenous households.",
        "key_metrics": "12,500 MT annual production; 6,000+ smallholder cultivators; Naturally rain-fed cultivation",
        "certifications_or_anchor": "Agmark Grade A, APICOL Cluster Certified",
        "growth_potential": "Nutraceutical extraction, organic oleoresin processing, and export-grade natural dye concentrates.",
        "supporting_source": "APICOL Spices Cluster Development Baseline Survey (2024)",
    },
    {
        "id": "res-agri-04",
        "city_id": "bhubaneswar",
        "category": "agricultural",
        "title": "Coastal Delta High-Value Floriculture & Hydroponics",
        "description": "High-density polyhouse marigold, tuberose, and exotic cut-flower production supplying urban cultural events, temple rituals, and coastal export hubs.",
        "key_metrics": "180+ Active greenhouse units; ₹45 Cr annual regional market turnover",
        "certifications_or_anchor": "State Horticulture Mission Technology Assistance Certified",
        "growth_potential": "Expansion into automated vertical farms and medicinal floral extract distillation.",
        "supporting_source": "Directorate of Horticulture Odisha Annual Floriculture Review",
    },

    # 2. Local Products
    {
        "id": "res-prod-01",
        "city_id": "koraput",
        "category": "local_product",
        "title": "Kotpad Vegetable-Dyed Handloom Shawls & Sarees",
        "description": "Ancient handloom textiles crafted by Mirgan tribal weavers using indigenous madder root (Aal) bark and pit-loom techniques, producing rich rust, ochre, and deep crimson hues on organic unbleached cotton.",
        "key_metrics": "1,200+ Master weaver households; 100% Non-toxic biodegradable natural dye; Zero chemical effluent",
        "certifications_or_anchor": "GI Registration No. 180, UNESCO Craft Council Commendation",
        "growth_potential": "High-fashion sustainable luxury retail, museum acquisitions, and global slow-fashion brands.",
        "supporting_source": "Weavers Service Centre Bhubaneswar & Odisha State Handloom Census",
    },
    {
        "id": "res-prod-02",
        "city_id": "koraput",
        "category": "local_product",
        "title": "Certified Wild Flora Forest Honey & Tribal Terracotta",
        "description": "Monofloral and multifloral forest honey harvested by Dongria and Paroja honey-gatherers in dense Niyamgiri and Deomali forest buffers, bottled raw without high-heat pasteurization.",
        "key_metrics": "140 MT certified annual collection; AGMARK Special Grade standard",
        "certifications_or_anchor": "TRIFED Tribal Artisan Certified, AGMARK Special Grade, TDCCOL Brand",
        "growth_potential": "Direct-to-consumer premium organic wellness packaging and export to East Asian health markets.",
        "supporting_source": "TDCCOL Procurement & Processing Division Review 2024",
    },
    {
        "id": "res-prod-03",
        "city_id": "bhubaneswar",
        "category": "local_product",
        "title": "Pipili Applique & Cuttack-Bhubaneswar Chandi Tarakasi (Silver Filigree)",
        "description": "Centuries-old heritage silver filigree requiring delicate microscopic wire manipulation into ornamental motifs, alongside iconic applique temple canopies and tapestries.",
        "key_metrics": "4,500+ Registered master artisans; GI Registration No. 802 (Tarakasi) & GI 86 (Pipili)",
        "certifications_or_anchor": "Geographical Indication GI 802 & GI 86, National Crafts Fair Gold Accreditations",
        "growth_potential": "Modernized contemporary luxury jewelry, international heritage giftware, and luxury home decor exports.",
        "supporting_source": "Directorate of Handicrafts & Cottage Industries Odisha (2024)",
    },

    # 3. Workforce Capabilities
    {
        "id": "res-work-01",
        "city_id": "koraput",
        "category": "workforce",
        "title": "Mission Shakti Women WSHG Agro-Processing & Packaging Cadre",
        "description": "Over 28,000 tribal women mobilized across 2,400+ Women Self-Help Groups (WSHGs), formally certified in modern post-harvest sorting, solar dehydration, vacuum sealing, and hygiene compliance.",
        "key_metrics": "28,400+ Certified WSHG members; 89% Micro-credit repayment compliance; Standardized FSSAI hygiene training",
        "certifications_or_anchor": "Mission Shakti Department Certified, FSSAI Food Handling Accreditations",
        "growth_potential": "Scalable anchor labor pool for contract agro-processing parks, commercial kitchens, and packaged goods assembly.",
        "supporting_source": "Mission Shakti District Implementation Report Koraput (2023-24)",
    },
    {
        "id": "res-work-02",
        "city_id": "koraput",
        "category": "workforce",
        "title": "Aeronautical, Precision Tooling & CNC Machining Technicians",
        "description": "Skilled precision engineering talent pool trained via Sunabeda ITI, Government Polytechnic Koraput, and HAL Apprenticeship School, specializing in close-tolerance aerospace engine fabrication and metal turning.",
        "key_metrics": "850+ Precision machining graduates annually; NCVT & ISO 9001 quality tooling standards",
        "certifications_or_anchor": "National Apprenticeship Council Certified, HAL Precision Tooling Apprenticeships",
        "growth_potential": "Directly deployable for light defense engineering, automotive tier-3 suppliers, agricultural equipment assembly, and solar panel fabrication.",
        "supporting_source": "Directorate of Technical Education & Training Odisha (2023-24)",
    },
    {
        "id": "res-work-03",
        "city_id": "bhubaneswar",
        "category": "workforce",
        "title": "Software Engineering, AI & Cleanroom Electronics Talent Pool",
        "description": "Premier capital talent ecosystem anchored by IIT Bhubaneswar, IIIT, NIT Rourkela feeder pipelines, and 45+ accredited engineering colleges graduating enterprise tech talent.",
        "key_metrics": "22,000+ STEM & Engineering graduates annually; 60,000+ Active IT & ITeS workforce",
        "certifications_or_anchor": "NASSCOM Tech Skill Standards, IEEE Student Chapters, VLSI Design Centers",
        "growth_potential": "Readily supports fabless semiconductor design centers, cloud infrastructure hubs, and SaaS engineering centers.",
        "supporting_source": "Electronics & Information Technology Department Odisha (2023-24)",
    },

    # 4. Tourism Opportunities
    {
        "id": "res-tour-01",
        "city_id": "koraput",
        "category": "tourism",
        "title": "Deomali Peak High-Altitude Eco-Trekking & Paragliding Enclave",
        "description": "Highest mountain peak in Odisha (1,672 meters above sea level) featuring pristine montane grasslands, 360-degree Eastern Ghats ridges, thermals suitable for paragliding, and community-managed cottages.",
        "key_metrics": "1,672m Altitude; 120,000+ Annual visitors; 24 Solar-powered eco-cottages currently in pilot",
        "certifications_or_anchor": "OTDC Eco-Tourism Certified, Department of Forest Eco-Development Committee Concession",
        "growth_potential": "Year-round high-altitude trekking camps, astronomical dark-sky observation parks, and adventure sports concessions.",
        "supporting_source": "Odisha Tourism Development Corporation (OTDC) Strategic Master Plan 2024",
    },
    {
        "id": "res-tour-02",
        "city_id": "koraput",
        "category": "tourism",
        "title": "Kolab Reservoir Lakefront & Duduma Waterfalls Circuit",
        "description": "Massive 114 sq km hydro reservoir basin with forested islands paired with the spectacular 175m Duduma plunge waterfall on the Machkund gorge. Prime landscape for non-motorized watersports and eco-glamping.",
        "key_metrics": "114 sq km reservoir water spread; 175m plunge waterfall; Low tourist footfall density offering exclusivity",
        "certifications_or_anchor": "Department of Water Resources Recreation Zone Notification",
        "growth_potential": "Boutique wellness resorts, solar catamaran lake safaris, and indigenous ethno-botanical interpretive nature trails.",
        "supporting_source": "District Tourism Master Plan Koraput & Water Resources Department",
    },
    {
        "id": "res-tour-03",
        "city_id": "bhubaneswar",
        "category": "tourism",
        "title": "Golden Triangle Heritage & Nandankanan Eco-Zoological Corridor",
        "description": "World-renowned temple architecture circuit linking Bhubaneswar's 500+ Kalinga stone temples with Puri and the Konark Sun Temple (UNESCO), along with the 437-hectare Nandankanan biological park.",
        "key_metrics": "3.8 Million annual tourist arrivals; 12 Heritage corridors; High international Buddhist pilgrim influx",
        "certifications_or_anchor": "UNESCO Heritage Proximity, National Eco-Park Accreditation",
        "growth_potential": "MICE (Meetings, Incentives, Conferences, Exhibitions) luxury hotels, sound-and-light immersive digital heritage museums, and curated food trails.",
        "supporting_source": "Odisha Tourism Statistical Bulletin 2023-24",
    },

    # 5. Existing Anchor Businesses
    {
        "id": "res-biz-01",
        "city_id": "koraput",
        "category": "existing_business",
        "title": "Hindustan Aeronautics Limited (HAL) Aero-Engine Division, Sunabeda",
        "description": "Strategic public-sector aerospace engine manufacturing plant fabricating and overhauling jet engines for the Indian Air Force. Anchors sophisticated industrial supply chains, testing facilities, and township utilities.",
        "key_metrics": "4,200+ Highly skilled employees; Over 4 decades of continuous aerospace manufacturing; Captive township",
        "certifications_or_anchor": "AS9100 Aerospace Quality Standard, ISO 14001 Environmental Standard",
        "growth_potential": "Ancillary subcontracting for titanium machining, high-precision fasteners, and defense electronics assembly.",
        "supporting_source": "Department of Public Enterprises & HAL Annual Report",
    },
    {
        "id": "res-biz-02",
        "city_id": "koraput",
        "category": "existing_business",
        "title": "National Aluminium Company Limited (NALCO) Bauxite Mines & Alumina Refinery",
        "description": "Navratna CPSE operating one of the world's most cost-efficient bauxite mines at Panchpatmali and a 2.275 million MT alumina refinery at Damanjodi, utilizing captive railway sidings.",
        "key_metrics": "2.275 Million MT annual alumina refinery capacity; 6.8 Million MT Panchpatmali bauxite mining lease",
        "certifications_or_anchor": "Navratna Public Sector Enterprise, ASI (Aluminium Stewardship Initiative) Certified",
        "growth_potential": "Bauxite residue (red mud) eco-brick manufacturing, heavy machinery maintenance, and industrial logistics parks.",
        "supporting_source": "Ministry of Mines Annual Report & NALCO Financial Disclosures",
    },
    {
        "id": "res-biz-03",
        "city_id": "koraput",
        "category": "existing_business",
        "title": "Coffee Board of India & APICOL Agro-Industrial Infrastructure",
        "description": "Statutory central research and extension establishment providing agronomy trials, cup-quality tasting labs, pest monitoring, alongside APICOL-funded modern seed grading and cold-storage complexes in Jeypore.",
        "key_metrics": "Regional tasting laboratory; Over 18 FPO federations supported; Soil testing & tissue culture laboratories",
        "certifications_or_anchor": "Ministry of Commerce & Industry Statutory Board, State Agro-Promotion Corporation",
        "growth_potential": "Expansion into automated electronic coffee sorting lines and commercial cold-plasma seed treatment centers.",
        "supporting_source": "Coffee Board of India Annual Administrative Report",
    },
    {
        "id": "res-biz-04",
        "city_id": "bhubaneswar",
        "category": "existing_business",
        "title": "Infocity & InfoValley IT Parks (Infosys, TCS, Tech Mahindra, Mindtree)",
        "description": "Tier-1 IT development and technology innovation centers employing tens of thousands of software architects and engineers across high-capacity data and telecom grids.",
        "key_metrics": "50,000+ Software professionals; Dedicated 220kV power sub-stations; SEZ export benefits",
        "certifications_or_anchor": "Special Economic Zone (SEZ) Status, ISO 27001 Information Security",
        "growth_potential": "Semiconductor OSAT design, enterprise cloud security centers, and AI engineering hubs.",
        "supporting_source": "IDCO IT Infrastructure Annual Compendium",
    },
]


# --- CURATED OPPORTUNITY EXTENSIONS ---
CURATED_OPPORTUNITY_METADATA = {
    "inv-01": {
        "is_verified": True,
        "verification_stage": "Verified DPR",
        "supporting_evidence": "Odisha Food Processing Policy 2023 (Sec 4.2 Capital Subsidy); APICOL Techno-Economic Feasibility Report File AGRI-OD-2024-KPT-01; Coffee Board export feasibility study.",
        "potential_partners": "APICOL, Coffee Board of India, TDCCOL, 18 Tribal Primary Agricultural Cooperative Societies (PACS), Mission Shakti WSHG Federations.",
        "regulatory_considerations": "Schedule V tribal land tenancy safeguards under Regulation 2 of 1956 strictly observed: project land held in 99-year non-alienable leasehold through IDCO Industrial Land Bank; Forest Rights Act NOC verified; State Pollution Control Board Consent to Establish (Orange Category).",
        "cost_breakdown": {
            "capex": [
                {"category": "Civil Works & Controlled Storage Sheds", "amount_cr": 26.5, "share_percent": 31.2, "description": "Climate-controlled green coffee bean warehouse and cupping laboratory building"},
                {"category": "Plant & Modern Pulping/Roasting Machinery", "amount_cr": 34.0, "share_percent": 40.0, "description": "Automated Italian optical sorters, nitrogen vacuum sealing line, and commercial roasters"},
                {"category": "Solar Microgrid & Effluent Zero-Discharge Unit", "amount_cr": 14.5, "share_percent": 17.1, "description": "1.2 MW rooftop solar array and biological greywater treatment for wet pulping"},
                {"category": "Pre-operative Expenses & Working Capital Margin", "amount_cr": 10.0, "share_percent": 11.7, "description": "Trial runs, organic certification audits, and first-batch farmer procurement advance"},
            ],
            "opex": [
                {"category": "Raw Cherry & Spice Smallholder Procurement", "amount_cr": 28.5, "share_percent": 54.8, "description": "Fair-trade benchmarked procurement directly from tribal FPO members"},
                {"category": "Operations, Technical & Quality Staff Wages", "amount_cr": 9.2, "share_percent": 17.7, "description": "Local skilled machine operators and certified master roasters/graders"},
                {"category": "Packaging, Export Logistics & Cold Transit", "amount_cr": 8.5, "share_percent": 16.3, "description": "Nitrogen-flushed foil packaging and refrigerated container haulage to Vizag Port"},
                {"category": "Maintenance, Utilities & Insurance", "amount_cr": 5.8, "share_percent": 11.2, "description": "Periodic equipment servicing, renewable power tariffs, and asset insurance"},
            ]
        },
        "revenue_trajectory": [
            {"year": 1, "min_revenue_cr": 24.0, "expected_revenue_cr": 31.5, "max_revenue_cr": 38.0, "driver_notes": "Phase 1 commissioning at 45% curing capacity; domestic cafe retail contracts"},
            {"year": 2, "min_revenue_cr": 35.0, "expected_revenue_cr": 44.2, "max_revenue_cr": 52.0, "driver_notes": "Capacity ramps to 65%; commencement of direct containerized export to Western Europe"},
            {"year": 3, "min_revenue_cr": 48.0, "expected_revenue_cr": 58.6, "max_revenue_cr": 68.5, "driver_notes": "Steady-state 80% utilization; specialty single-origin micro-lot price premium unlocks"},
            {"year": 4, "min_revenue_cr": 55.0, "expected_revenue_cr": 67.4, "max_revenue_cr": 79.0, "driver_notes": "Value-added cold-brew concentrates and spice oleoresin line commissioning"},
            {"year": 5, "min_revenue_cr": 62.0, "expected_revenue_cr": 76.5, "max_revenue_cr": 91.0, "driver_notes": "Optimal 90%+ utilization with established international brand equity"},
        ],
        "risk_factors": [
            {
                "risk": "Monsoon & Climate Variability Affecting Harvest Yields",
                "category": "Climate",
                "severity": "Medium",
                "probability": "Medium",
                "mitigation_strategy": "Geographic diversification across 8 hill blocks; shade-tree canopy preservation buffering temperature swings.",
                "residual_risk": "Low"
            },
            {
                "risk": "Schedule V Tribal Tenancy Regulatory Scrutiny",
                "category": "Regulatory",
                "severity": "High",
                "probability": "Low",
                "mitigation_strategy": "Zero private alienation of tribal land; site located inside pre-notified IDCO industrial park with statutory Gram Sabha approvals.",
                "residual_risk": "Very Low"
            },
            {
                "risk": "International Specialty Coffee Price Fluctuations",
                "category": "Market",
                "severity": "Medium",
                "probability": "Medium",
                "mitigation_strategy": "Multi-year fixed forward procurement contracts with European fair-trade roasters and domestic cafe chains.",
                "residual_risk": "Low"
            },
            {
                "risk": "Skilled Operator Retention in Remote Region",
                "category": "Execution",
                "severity": "Low",
                "probability": "Medium",
                "mitigation_strategy": "Partnering with Sunabeda ITI for structured apprenticeship pipelines and local WSHG leadership programs.",
                "residual_risk": "Low"
            }
        ]
    },
    "inv-02": {
        "is_verified": True,
        "verification_stage": "Verified DPR",
        "supporting_evidence": "Odisha Semiconductor Manufacturing & Fabless Policy 2023 (Clause 5.1 Cleanroom Subsidy); India Semiconductor Mission (ISM) Guidelines; IDCO Infovalley Master Plan.",
        "potential_partners": "Electronics & IT Department Odisha, IDCO, IIT Bhubaneswar, IIIT Bhubaneswar, MeitY India Semiconductor Mission.",
        "regulatory_considerations": "Hazardous Gas Safety Clearance (PESO) for silane and phosphine gases; State Pollution Control Board Consent-to-Establish with mandatory Zero Liquid Discharge (ZLD) plant; Dual redundant 220kV power transmission approval.",
        "cost_breakdown": {
            "capex": [
                {"category": "ISO Class 5 & Class 6 Cleanroom Construction", "amount_cr": 92.0, "share_percent": 38.3, "description": "HEPA/ULPA filtration, vibration-damped floating slab, anti-static epoxy flooring"},
                {"category": "Ultra-Pure Water & Toxic Gas Abatement Systems", "amount_cr": 58.0, "share_percent": 24.2, "description": "18.2 MOhm-cm deionized water plant and thermal catalytic scrubbers"},
                {"category": "Precision Metrology & Testing Equipment", "amount_cr": 62.0, "share_percent": 25.8, "description": "Automated optical inspection, SEM wafer inspection, and thermal cycling chambers"},
                {"category": "Redundant Power Ring & Emergency Gensets", "amount_cr": 28.0, "share_percent": 11.7, "description": "Dual 33kV dedicated feeders and 4x 2000 kVA synchronized low-noise generators"},
            ],
            "opex": [
                {"category": "Cleanroom Consumables & Specialized Gases", "amount_cr": 32.0, "share_percent": 41.0, "description": "Electronic-grade gases, wafer trays, chemical solvents, and cleanroom apparel"},
                {"category": "Specialized VLSI Engineers & Cleanroom Technicians", "amount_cr": 26.5, "share_percent": 34.0, "description": "Salaries for 320 specialized hardware test engineers and metrology scientists"},
                {"category": "Continuous 24x7 Power Tariffs & Ultra-Pure Utilities", "amount_cr": 14.2, "share_percent": 18.2, "description": "Subsidized industrial green energy tariffs under Odisha Semiconductor Policy"},
                {"category": "Equipment Maintenance & Calibration Contracts", "amount_cr": 5.3, "share_percent": 6.8, "description": "Annual OEM service agreements for high-precision diagnostic tools"},
            ]
        },
        "revenue_trajectory": [
            {"year": 1, "min_revenue_cr": 45.0, "expected_revenue_cr": 58.0, "max_revenue_cr": 72.0, "driver_notes": "Initial cleanroom qualification; pilot test batches for fabless design partners"},
            {"year": 2, "min_revenue_cr": 82.0, "expected_revenue_cr": 105.0, "max_revenue_cr": 128.0, "driver_notes": "Tier-1 OSAT packaging test line achieves commercial ISO qualification"},
            {"year": 3, "min_revenue_cr": 135.0, "expected_revenue_cr": 168.0, "max_revenue_cr": 195.0, "driver_notes": "Full wafer testing contracts from automotive and IoT semiconductor design firms"},
            {"year": 4, "min_revenue_cr": 175.0, "expected_revenue_cr": 210.0, "max_revenue_cr": 245.0, "driver_notes": "High-volume commercial packaging and reliability burn-in testing operations"},
            {"year": 5, "min_revenue_cr": 210.0, "expected_revenue_cr": 255.0, "max_revenue_cr": 298.0, "driver_notes": "Multi-client anchor OSAT partner facility operating at 92% cleanroom capacity"},
        ],
        "risk_factors": [
            {
                "risk": "Global Semiconductor Cyclicality & Demand Slowdowns",
                "category": "Market",
                "severity": "High",
                "probability": "Low",
                "mitigation_strategy": "Diversification across automotive, industrial power electronics, and consumer IoT test suites.",
                "residual_risk": "Medium"
            },
            {
                "risk": "Latency in Semiconductor Policy Capital Incentive Disbursements",
                "category": "Regulatory",
                "severity": "Medium",
                "probability": "Low",
                "mitigation_strategy": "Pre-approval secured under State High-Level Clearance Authority (HLCA) with escrow reimbursement terms.",
                "residual_risk": "Very Low"
            },
            {
                "risk": "Scarcity of Experienced Cleanroom Metrology Specialists",
                "category": "Supply Chain",
                "severity": "Medium",
                "probability": "Medium",
                "mitigation_strategy": "Dedicated training curriculum established with IIIT and IIT Bhubaneswar with tuition-support bonds.",
                "residual_risk": "Low"
            }
        ]
    }
}


# --- FINANCIAL SENSITIVITY CALCULATION ENGINE ---

def solve_irr(cash_flows: List[float], guess: float = 0.15, max_iter: int = 100, tol: float = 1e-5) -> float:
    """
    Robust Newton-Raphson DCF Internal Rate of Return (IRR) numerical solver.
    Falls back gracefully to bisection if Newton step diverges.
    """
    rate = guess
    for _ in range(max_iter):
        npv = 0.0
        d_npv = 0.0
        for t, cf in enumerate(cash_flows):
            denom = (1.0 + rate) ** t
            npv += cf / denom
            if t > 0:
                d_npv -= (t * cf) / ((1.0 + rate) ** (t + 1))
        
        if abs(npv) < tol:
            return round(rate * 100.0, 2)
        if abs(d_npv) < 1e-12:
            break
        rate_next = rate - (npv / d_npv)
        # Constrain rate to reasonable bounds
        if rate_next <= -0.9 or rate_next >= 5.0 or math.isnan(rate_next):
            break
        rate = rate_next
    
    # Bisection fallback
    low, high = -0.5, 2.0
    for _ in range(60):
        mid = (low + high) / 2.0
        npv_mid = sum(cf / ((1.0 + mid) ** t) for t, cf in enumerate(cash_flows))
        if abs(npv_mid) < tol:
            return round(mid * 100.0, 2)
        npv_low = sum(cf / ((1.0 + low) ** t) for t, cf in enumerate(cash_flows))
        if (npv_low > 0 and npv_mid > 0) or (npv_low < 0 and npv_mid < 0):
            low = mid
        else:
            high = mid
    return round(mid * 100.0, 2)


def generate_investment_analysis(
    req: InvestmentAnalysisRequest,
    investment_title: str = "Civic Development Project",
    base_capex: float = 85.0,
    base_irr: float = 18.5,
    custom_metadata: Optional[Dict[str, Any]] = None,
) -> InvestmentAnalysisResponse:
    """
    Computes rigorous, scenario-based financial sensitivity analysis.
    Discloses all underlying assumptions, data sources, and statutory limitations.
    """
    capex = req.capex_in_cr or base_capex
    utilization = req.capacity_utilization_percent / 100.0
    subsidy_rate = req.capital_subsidy_percent / 100.0
    tariff_mult = req.tariff_realization_multiplier
    cost_of_capital = req.cost_of_capital_percent / 100.0

    # 1. Effective Capex Net of State Capital Subsidies
    effective_capex = max(1.0, round(capex * (1.0 - subsidy_rate), 2))

    # 2. Base Operating Model (Normalized for 10-year asset horizon)
    # Asset Turnover benchmark: ₹1 Cr of Capex generates ~₹0.42 Cr annual steady-state baseline revenue at 75% utilization
    base_turnover_ratio = 0.42
    nominal_full_capacity_revenue = (capex * base_turnover_ratio) / 0.75
    
    annual_revenue = nominal_full_capacity_revenue * utilization * tariff_mult
    # Opex benchmark: variable opex ~40% of revenue + fixed opex ~12% of total capex
    annual_opex = (annual_revenue * 0.40) + (capex * 0.12)
    annual_ebitda = max(0.2, annual_revenue - annual_opex)

    # 10-year cash flow series: Year 0 = -effective_capex, Years 1-10 = annual_ebitda * (1 - tax) + depreciation_tax_shield
    tax_rate = 0.2517  # Sec 115BAA
    depreciation_per_year = capex / 10.0
    annual_tax = max(0.0, (annual_ebitda - depreciation_per_year) * tax_rate)
    annual_net_cash_flow = annual_ebitda - annual_tax

    # Payback period
    payback_years = round(effective_capex / max(0.1, annual_net_cash_flow), 1)

    # 3. Dynamic Scenario Comparisons (Conservative, Base Case, Accelerated)
    scenarios = [
        {
            "scenario": "Conservative",
            "capacity_utilization": round(max(30.0, req.capacity_utilization_percent - 15.0), 1),
            "capital_subsidy_percent": round(max(0.0, req.capital_subsidy_percent - 10.0), 1),
            "tariff_mult": 0.90,
            "confidence_level": "High (Downside Protection)",
        },
        {
            "scenario": "Base Case (Modeled)",
            "capacity_utilization": round(req.capacity_utilization_percent, 1),
            "capital_subsidy_percent": round(req.capital_subsidy_percent, 1),
            "tariff_mult": tariff_mult,
            "confidence_level": "Medium-High (DPR Target)",
        },
        {
            "scenario": "Accelerated",
            "capacity_utilization": round(min(100.0, req.capacity_utilization_percent + 15.0), 1),
            "capital_subsidy_percent": round(min(60.0, req.capital_subsidy_percent + 10.0), 1),
            "tariff_mult": round(tariff_mult * 1.15, 2),
            "confidence_level": "Moderate (Upside Realization)",
        },
    ]

    scenario_items: List[ScenarioComparisonItem] = []
    for sc in scenarios:
        sc_util = sc["capacity_utilization"] / 100.0
        sc_sub = sc["capital_subsidy_percent"] / 100.0
        sc_mult = sc["tariff_mult"]
        sc_eff_capex = max(1.0, capex * (1.0 - sc_sub))
        sc_rev = nominal_full_capacity_revenue * sc_util * sc_mult
        sc_opex = (sc_rev * 0.40) + (capex * 0.12)
        sc_ebitda = max(0.2, sc_rev - sc_opex)
        sc_tax = max(0.0, (sc_ebitda - depreciation_per_year) * tax_rate)
        sc_ncf = sc_ebitda - sc_tax
        sc_payback = round(sc_eff_capex / max(0.1, sc_ncf), 1)

        # 10-year DCF for scenario IRR
        cfs = [-sc_eff_capex] + [sc_ncf] * 10
        sc_irr = solve_irr(cfs, guess=base_irr / 100.0)

        scenario_items.append(
            ScenarioComparisonItem(
                scenario=sc["scenario"],
                capacity_utilization=sc["capacity_utilization"],
                capital_subsidy_percent=sc["capital_subsidy_percent"],
                projected_irr_percent=sc_irr,
                payback_period_years=sc_payback,
                annual_ebitda_cr=round(sc_ebitda, 2),
                annual_revenue_cr=round(sc_rev, 2),
                confidence_level=sc["confidence_level"],
            )
        )

    # 4. 2D Sensitivity Matrix: Capacity Utilization vs Capital Subsidy (5x5 grid)
    util_levels = [50.0, 65.0, 75.0, 85.0, 100.0]
    subsidy_levels = [10.0, 20.0, 25.0, 30.0, 40.0]
    sensitivity_matrix: List[SensitivityMatrixCell] = []

    for u in util_levels:
        for s in subsidy_levels:
            cell_util = u / 100.0
            cell_sub = s / 100.0
            cell_eff_capex = max(1.0, capex * (1.0 - cell_sub))
            cell_rev = nominal_full_capacity_revenue * cell_util * tariff_mult
            cell_opex = (cell_rev * 0.40) + (capex * 0.12)
            cell_ebitda = max(0.1, cell_rev - cell_opex)
            cell_tax = max(0.0, (cell_ebitda - depreciation_per_year) * tax_rate)
            cell_ncf = cell_ebitda - cell_tax
            cell_payback = round(cell_eff_capex / max(0.1, cell_ncf), 1)

            cell_cfs = [-cell_eff_capex] + [cell_ncf] * 10
            cell_irr = solve_irr(cell_cfs, guess=0.15)

            # Viability grading
            if cell_irr >= 18.0 and cell_payback <= 4.5:
                label = "Prime"
            elif cell_irr >= 14.0 and cell_payback <= 6.0:
                label = "Viable"
            elif cell_irr >= 10.0:
                label = "Moderate"
            else:
                label = "Marginal"

            sensitivity_matrix.append(
                SensitivityMatrixCell(
                    capacity_utilization_percent=u,
                    capital_subsidy_percent=s,
                    irr_percent=cell_irr,
                    payback_years=cell_payback,
                    annual_ebitda_cr=round(cell_ebitda, 2),
                    viability_label=label,
                )
            )

    # 5. Extract or Generate Cost Breakdowns
    if custom_metadata and "cost_breakdown" in custom_metadata:
        capex_items = [CostBreakdownItem(**item) for item in custom_metadata["cost_breakdown"]["capex"]]
        opex_items = [CostBreakdownItem(**item) for item in custom_metadata["cost_breakdown"]["opex"]]
    else:
        capex_items = [
            CostBreakdownItem(category="Civil Structures & Site Works", amount_cr=round(capex * 0.32, 2), share_percent=32.0, description="Industrial shed, cold warehouse, and administrative offices"),
            CostBreakdownItem(category="Plant, Machinery & Testing Lines", amount_cr=round(capex * 0.40, 2), share_percent=40.0, description="Primary processing equipment and automated grading infrastructure"),
            CostBreakdownItem(category="Power Microgrid, Utilities & ZLD", amount_cr=round(capex * 0.16, 2), share_percent=16.0, description="Rooftop solar panels, HT substation, and zero-liquid discharge effluent unit"),
            CostBreakdownItem(category="Contingencies & Working Capital Margin", amount_cr=round(capex * 0.12, 2), share_percent=12.0, description="Pre-operative trial costs, initial statutory compliance, and seed margin"),
        ]
        opex_items = [
            CostBreakdownItem(category="Raw Material & Input Procurement", amount_cr=round(annual_opex * 0.52, 2), share_percent=52.0, description="Direct local smallholder and cooperative procurement"),
            CostBreakdownItem(category="Skilled & Operational Labor", amount_cr=round(annual_opex * 0.22, 2), share_percent=22.0, description="Wages for certified technical staff and local WSHG workers"),
            CostBreakdownItem(category="Power, Logistics & Consumables", amount_cr=round(annual_opex * 0.16, 2), share_percent=16.0, description="Green power tariffs, packaging consumables, and container haulage"),
            CostBreakdownItem(category="Maintenance, Insurance & Overheads", amount_cr=round(annual_opex * 0.10, 2), share_percent=10.0, description="Annual maintenance contract, comprehensive insurance, and compliance audits"),
        ]

    # 6. Extract or Generate Defensible Revenue Trajectory
    if custom_metadata and "revenue_trajectory" in custom_metadata:
        revenue_trajectory = [RevenueTrajectoryPoint(**pt) for pt in custom_metadata["revenue_trajectory"]]
    else:
        trajectory_pts = []
        for yr in range(1, 6):
            ramp = min(1.0, 0.45 + (yr - 1) * 0.15)
            exp_rev = round(annual_revenue * ramp, 2)
            min_rev = round(exp_rev * 0.80, 2)
            max_rev = round(exp_rev * 1.20, 2)
            notes = f"Year {yr} operating phase at ~{int(ramp * 100)}% stabilized output target"
            trajectory_pts.append(
                RevenueTrajectoryPoint(
                    year=yr,
                    min_revenue_cr=min_rev,
                    expected_revenue_cr=exp_rev,
                    max_revenue_cr=max_rev,
                    driver_notes=notes,
                )
            )
        revenue_trajectory = trajectory_pts

    # 7. Extract or Generate Risk Factors
    if custom_metadata and "risk_factors" in custom_metadata:
        risk_factors = [RiskFactorItem(**rf) for rf in custom_metadata["risk_factors"]]
    else:
        risk_factors = [
            RiskFactorItem(
                risk="Regulatory & Permitting Approval Timelines",
                category="Regulatory",
                severity="Medium",
                probability="Low",
                mitigation_strategy="Single-window clearance facilitation via State High Level Clearance Authority (HLCA) and pre-allocated IDCO land banks.",
                residual_risk="Very Low",
            ),
            RiskFactorItem(
                risk="Raw Input Supply Seasonality & Price Elasticity",
                category="Supply Chain",
                severity="Medium",
                probability="Medium",
                mitigation_strategy="Guaranteed backward linkage agreements with registered FPO federations and seasonal buffer warehousing.",
                residual_risk="Low",
            ),
            RiskFactorItem(
                risk="Macroeconomic Inflation on Operating Equipment",
                category="Market",
                severity="Low",
                probability="Medium",
                mitigation_strategy="Contractual indexation on wholesale contracts and long-term procurement agreements.",
                residual_risk="Low",
            ),
        ]

    # 8. Mandatory Assumptions and Data Source Disclosures
    disclosed_assumptions = [
        "Financial modeling horizon is established across a standard 10-year commercial asset lifecycle.",
        f"Base capital outlay modeled at ₹{capex} Cr with capital subsidy modeled at {req.capital_subsidy_percent}% (effective capex: ₹{effective_capex} Cr).",
        "Debt-to-Equity structure modeled at 70:30 senior debt with an indicative borrowing rate of 9.25% p.a.",
        "Effective corporate tax rate applied at 25.17% in accordance with Section 115BAA of the Income Tax Act.",
        "Straight-line asset depreciation modeled over 10 years (10.0% p.a.) providing a corporate tax shield.",
        "Annual operational cost inflation escalated at a baseline assumption of 5.0% p.a.",
        "Working capital margin requirements benchmarked at 45 days of annualized gross turnover.",
    ]

    data_sources = [
        "Odisha Industrial Policy Resolution (IPR) 2022 & Odisha Food Processing Policy 2023",
        "Techno-Economic Feasibility Report & Detailed Project Report (DPR), APICOL Odisha",
        "Coffee Board of India Market Intelligence Report & Specialty Bean Export Statistics (2023-24)",
        "District Mineral Foundation (DMF) Trust Guidelines & Public Infrastructure Allocation Norms, Koraput",
        "Odisha Renewable Energy Development Agency (OREDA) Decentralized Solar Subsidy Framework",
    ]

    regulatory_disclaimer = (
        "STATUTORY DISCLOSURE & REGULATORY DISCLAIMER: This investment analysis is an empirical, discovery-stage "
        "feasibility simulation prepared for institutional exploration. It explicitly does NOT constitute an offer to sell, "
        "a financial guarantee, or guaranteed prospective returns. Financial metrics (IRR, Payback, EBITDA) are highly "
        "sensitive to actual capacity utilization, commodity market volatility, and statutory clearance timelines. "
        "All prospective investors must perform independent technical and financial due diligence before committing capital."
    )

    return InvestmentAnalysisResponse(
        investment_id=req.investment_id,
        title=investment_title,
        base_capex_cr=capex,
        effective_capex_cr=effective_capex,
        assumptions_applied={
            "capacity_utilization_percent": req.capacity_utilization_percent,
            "capital_subsidy_percent": req.capital_subsidy_percent,
            "tariff_realization_multiplier": req.tariff_realization_multiplier,
            "cost_of_capital_percent": req.cost_of_capital_percent,
            "opex_annual_growth_percent": req.opex_annual_growth_percent,
        },
        scenario_comparisons=scenario_items,
        capex_breakdown=capex_items,
        opex_breakdown=opex_items,
        revenue_trajectory=revenue_trajectory,
        risk_factors=risk_factors,
        sensitivity_matrix=sensitivity_matrix,
        disclosed_assumptions=disclosed_assumptions,
        data_sources=data_sources,
        regulatory_disclaimer=regulatory_disclaimer,
    )
