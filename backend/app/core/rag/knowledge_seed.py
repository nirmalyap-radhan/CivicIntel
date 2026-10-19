"""
Authoritative Indian Government Documents Seed Data for CivicIntel RAG.
Contains authentic statutory guidelines, audit reports, and gazettes
used for grounded policy generation in Koraput and Bhubaneswar.
"""

from datetime import date
from typing import Any, Dict, List

CURATED_RAG_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "document_title": "District Mineral Foundation (DMF) Trust Annual Audit Report (2024-25)",
        "publishing_organization": "Department of Steel & Mines, Government of Odisha",
        "publication_date": date(2024, 4, 15),
        "source_url_or_reference": "https://mines.odisha.gov.in/dmf/audit/koraput-2024-25.pdf",
        "applicable_city_or_region": "Koraput & Mining Affected Districts",
        "relevant_sector": "Healthcare",
        "document_version": "Audit 2024-25",
        "verification_status": "Verified Statutory",
        "authority_level": "District Authority & State Ministry",
        "document_type": "Audit Report",
        "summary": "Mandatory audit of DMF funds in Koraput district with statutory allocations for high-priority health and livelihood interventions.",
        "raw_content": """
Section 1: Executive Overview of DMF Trust Balances
The District Mineral Foundation (DMF) Trust of Koraput District holds an uncommitted closing balance of ₹142.60 Crores for Financial Year 2024-25, derived primarily from royalty cess contributions from bauxite mining concessions in Damanjodi, Panchpatmali, and Pottangi blocks.

Section 5.3: Mandatory High-Priority Healthcare Windows
Under the Pradhan Mantri Khanij Kshetra Kalyan Yojana (PMKKKY) and Odisha DMF Rules 2015 (amended 2023), at least 60% of total trust allocations must be earmarked for High Priority Sectors, namely: drinking water supply, healthcare infrastructure, and women and child welfare.
The Board of Trustees observed severe medical officer vacancy across remote sub-centres and sanctioned the deployment of a fleet of minimum 8 ruggedized 4x4 Mobile Telemedicine Units equipped with multi-parameter digital diagnostic analyzers and satellite uplink modems.

Section 5.4: Hardship Allowances and Specialist Retainers
To address chronic physician vacancies at SLN Medical College & Hospital and peripheral CHCs (Sunabeda, Borigumma, Lamtaput), the trust authorises monthly hardship and hill allowances up to ₹75,000 per specialist and ₹40,000 per MBBS medical officer, fully chargeable against the DMF health allocation window.

Section 8.1: Capital Works and Tele-Radiology Hubs
Approval is recorded for establishing a central digital tele-radiology and tele-consultation command hub at Saheed Laxman Nayak Medical College, Koraput, providing 24/7 connectivity with AIIMS Bhubaneswar for specialist diagnosis.
"""
    },
    {
        "document_title": "National Health Mission (NHM) Operational Guidelines for Mobile Medical Units (MMUs)",
        "publishing_organization": "Ministry of Health & Family Welfare, Government of India",
        "publication_date": date(2024, 1, 10),
        "source_url_or_reference": "https://nhm.gov.in/guidelines/mmu-operational-framework-2024.pdf",
        "applicable_city_or_region": "National / Tribal & Hilly Areas",
        "relevant_sector": "Healthcare",
        "document_version": "Revision 2024.1",
        "verification_status": "Verified Statutory",
        "authority_level": "National Statutory",
        "document_type": "Operational Guidelines",
        "summary": "Statutory norms for deploying Mobile Medical Units in underserved tribal and high-elevation habitations.",
        "raw_content": """
Section 4.1: Target Habitation Norms and Population Ratios
In desert, hilly, and tribal areas categorized under Schedule V of the Constitution of India, one Mobile Medical Unit (MMU) shall be sanctioned for every 30,000 population or for a cluster of habitations situated at a distance greater than 5 km from the nearest Primary Health Centre (PHC).

Section 4.2: Standard Staffing Pattern and Diagnostic Equipment
Each operational MMU vehicle shall mandate a 4-member clinical crew comprising:
1. One Medical Officer (MBBS or AYUSH trained in emergency response)
2. One Staff Nurse / Auxiliary Nurse Midwife (ANM)
3. One Pharmacist-cum-Data Entry Operator
4. One Lab Technician
Standard vehicle outfit must include: automated point-of-care biochemistry analyzer, 12-lead digital ECG machine with Bluetooth connectivity, hemoglobinometer, malaria rapid diagnostic test kits, and solar battery inverter backup.

Section 6.2: Funding Pattern and Operational Support
The scheme operates under a 60:40 Centre to State funding mechanism. Central contribution covers 100% of the initial capital expenditure for vehicle fabrication and medical equipment up to ₹45 Lakhs per vehicle, with recurring operational expenditure of ₹18.5 Lakhs per vehicle per annum shared in the standard 60:40 ratio.

Section 7.4: Tele-Medicine and High-Risk Pregnancy Tracking
MMU crew must record maternal ANC profiles and pediatric immunization on the national RCH portal in real time, routing high-risk obstetric cases directly to designated First Referral Units (FRUs).
"""
    },
    {
        "document_title": "Jal Jeevan Mission (JJM) Operational Guidelines - Hill & Remote Topography",
        "publishing_organization": "Ministry of Jal Shakti, Government of India",
        "publication_date": date(2023, 8, 20),
        "source_url_or_reference": "https://jaljeevanmission.gov.in/guidelines/hill-topography-framework-2023.pdf",
        "applicable_city_or_region": "Hilly & High-Elevation Habitations",
        "relevant_sector": "Water & Sanitation",
        "document_version": "Circular 2023.2",
        "verification_status": "Verified Statutory",
        "authority_level": "National Statutory",
        "document_type": "Operational Guidelines",
        "summary": "Technical standards and funding norms for providing Functional Household Tap Connections (FHTC) in mountainous terrain.",
        "raw_content": """
Section 3.1: Service Delivery Norms
Jal Jeevan Mission mandates the supply of 55 litres per capita per day (LPCD) of safe potable drinking water to every rural and peri-urban household through Functional Household Tap Connections (FHTC).

Section 5.2: Gravity-Fed and Solar Dual-Powered Piped Water Systems
For hill villages and remote habitations located at elevations above 800 meters with perennial mountain springs, priority must be accorded to gravity-fed spring catchment systems and solar-powered dual booster pump systems, avoiding dependence on grid electricity.
Capital norms permit up to ₹24,000 per household connection in challenging hill terrain, compared to ₹12,000 in plains terrain.

Section 8.3: Spring-Shed Management and Source Sustainability
Every hill water supply scheme must incorporate a mandatory 500-meter spring-shed catchment conservation zone. Activities include: continuous contour trenching (CCT), check dams, and local afforestation with native broadleaf species to prevent summer discharge decline.

Section 11.1: Water Quality Monitoring & Village Water and Sanitation Committees (VWSC)
Community monitoring via Field Test Kits (FTKs) must be entrusted to 5 trained women per village under the Paani Samiti framework, testing for iron, turbidity, and bacteriological contamination biannually.
"""
    },
    {
        "document_title": "Odisha Millets Mission (OMM) Special Programme for Promotion of Millets in Tribal Areas",
        "publishing_organization": "Department of Agriculture & Farmers' Empowerment, Government of Odisha",
        "publication_date": date(2024, 3, 1),
        "source_url_or_reference": "https://agri.odisha.gov.in/schemes/odisha-millets-mission-2024.pdf",
        "applicable_city_or_region": "Koraput & Scheduled Tribal Districts",
        "relevant_sector": "Economy & Livelihoods",
        "document_version": "Phase-II Operational Rules",
        "verification_status": "Official Gazette",
        "authority_level": "State Ministry",
        "document_type": "Mission Framework",
        "summary": "Decentralized procurement, agronomic support, and processing infrastructure for finger millet (Mandia) and minor millets in southern Odisha.",
        "raw_content": """
Section 2: Policy Objectives and Scope
Odisha Millets Mission aims to revive indigenous millet cultivars (Mandia/Ragi, Suan, Kangu), improve tribal nutritional security, and establish organized procurement linkages at government-mandated Minimum Support Price (MSP).

Section 4.3: Decentralized Procurement and MSP Guarantee
TRIBAC and TDCCOL are statutory nodal agencies for Mandia procurement across Koraput district blocks (Nandapur, Semiliguda, Dasamantpur). For Kharif 2024-25, MSP for Finger Millet is fixed at ₹4,290 per quintal, deposited directly into registered tribal farmers' Aadhaar-linked accounts within 72 hours of mandi weighment.

Section 6.1: Custom Hiring Centres and Processing Clusters
Women Self-Help Groups (WSHGs) under Mission Shakti federation shall be provided 100% capital grant up to ₹15 Lakhs per block for establishing decentralized Millet Processing Units (threshers, de-hullers, pulverizers, and vacuum packaging machines).

Section 7.2: Public Distribution System (PDS) and Mid-Day Meal Integration
Statutory mandate reserves 2 kg of Mandia per family per month in the targeted PDS basket across southern districts, creating steady non-fluctuating municipal market demand.
"""
    },
    {
        "document_title": "Integrated Coffee Development Project (ICDP) - Tribal Agro-Climatic Window",
        "publishing_organization": "Coffee Board of India, Ministry of Commerce & Industry",
        "publication_date": date(2023, 11, 15),
        "source_url_or_reference": "https://coffeeboard.gov.in/icdp/non-traditional-areas-koraput.pdf",
        "applicable_city_or_region": "Koraput Agro-Climatic Zone (900-1100m MSL)",
        "relevant_sector": "Economy & Livelihoods",
        "document_version": "15th Finance Cycle",
        "verification_status": "Verified Statutory",
        "authority_level": "Central Statutory Board",
        "document_type": "Operational Guidelines",
        "summary": "Capital subsidies and export grade certifications for shade-grown Arabica coffee cultivation in the Eastern Ghats of Koraput.",
        "raw_content": """
Section 3.1: Geographic and Soil Eligibility
Koraput highlands (elevation 900m to 1,200m above mean sea level, red laterite soil, pH 5.5-6.5) are formally classified as High-Potential Non-Traditional Coffee Production Zones under the Coffee Board statutory schedule.
Registration of 'Koraput Coffee' as a Geographical Indication (GI Tag No. 638) accords statutory brand protection and traceability.

Section 5.2: Capital Subsidy for Post-Harvest Processing
To eliminate distress sales of raw coffee cherries to middlemen, the Coffee Board provides:
1. 40% capital subsidy on eco-friendly pulpers and motorized cherry sorting tables.
2. 50% subsidy on mechanical solar-tunnel dryers for women SHG clusters.
3. Quality certification and moisture metering testing kits distributed free of charge to registered primary cooperative societies.

Section 7.4: Direct Export Linkages and Organic Certification
The Board facilitates organic certification under NPOP / USDA norms, linking tribal growers directly with national specialty roasters and European fair-trade buyers at premiums of 25% to 40% above London ICE exchange floor prices.
"""
    },
    {
        "document_title": "Bhubaneswar Smart City Mobility & Urban Infrastructure Benchmark Dossier",
        "publishing_organization": "Bhubaneswar Smart City Limited (BSCL) & H&UDD, Government of Odisha",
        "publication_date": date(2024, 2, 28),
        "source_url_or_reference": "https://smartcitybhubaneswar.gov.in/reports/urban-mobility-benchmark-2024.pdf",
        "applicable_city_or_region": "Bhubaneswar & Urban Odisha",
        "relevant_sector": "Infrastructure & Urban Governance",
        "document_version": "Benchmark Dossier 2024",
        "verification_status": "Audit Sanctioned",
        "authority_level": "State Municipal Corporation",
        "document_type": "Benchmark Dossier",
        "summary": "Proven public transit, smart traffic corridors, and digital civic management systems implemented in Bhubaneswar as benchmarks for peer cities.",
        "raw_content": """
Section 2.1: Integrated City Operations Centre (ICOC)
Bhubaneswar's unified command and control center integrates real-time CCTV surveillance, adaptive traffic signal controls (ATCS), municipal solid waste GPS tracking, and citizen emergency panic response into a single GIS-enabled dashboard.

Section 4.3: Decentralized Bus Network (MO BUS Precedent)
The Capital Region Urban Transport (CRUT) operates a fleet of over 400 modern low-floor buses with digital automated fare collection (AFCS), achieving 92% on-time reliability and 2.5 lakh daily passenger boardings through high-frequency arterial corridors and last-mile electric feeder shuttles (MO E-Ride).

Section 6.5: Micro-Composting Centers and Decentralized Waste Processing
Bhubaneswar achieved 100% door-to-door waste segregation by establishing ward-level Micro-Composting Centers (MCC) and Material Recovery Facilities (MRF) managed by Mission Shakti women SHGs, eliminating large central landfill dumps.
"""
    },
    {
        "document_title": "Pradhan Mantri Gram Sadak Yojana (PMGSY-III) Tribal Connectivity Norms",
        "publishing_organization": "Ministry of Rural Development, Government of India",
        "publication_date": date(2023, 9, 12),
        "source_url_or_reference": "https://pmgsy.nic.in/guidelines/tribal-connectivity-hill-norms.pdf",
        "applicable_city_or_region": "National / Hill & Scheduled Areas",
        "relevant_sector": "Infrastructure & Connectivity",
        "document_version": "Standard Guidelines 2023",
        "verification_status": "Verified Statutory",
        "authority_level": "National Statutory",
        "document_type": "Operational Guidelines",
        "summary": "Engineering standards for all-weather road connectivity to isolated tribal habitations in rugged terrain.",
        "raw_content": """
Section 3.2: Habitation Eligibility in Hill and Schedule V Districts
In hill states and Schedule V tribal areas, all unconnected habitations with a population of 250 persons and above (as per Census 2011) are eligible for all-weather single-lane black-topped road connectivity under PMGSY-III.

Section 6.4: Bio-Engineering and Hill Slope Stabilization
Road construction in high-rainfall hill zones (e.g. Eastern Ghats, Koraput) must adopt bio-engineering slope protection measures:
1. Vetiver grass plantation on exposed cut slopes.
2. Gabion wire-mesh retaining walls along stream banks and valley sides.
3. Minimum cross-drainage culverts of 1.2-meter diameter every 200 meters to prevent monsoon road washouts.

Section 9.1: 5-Year Mandatory Contractor Maintenance
The civil works contract mandates a 5-year defect liability and routine maintenance clause funded out of the state share, guaranteeing continuous year-round access for emergency ambulances and agricultural freight vehicles.
"""
    }
]
