"""
CivicIntel Development Scoring Engine.
Implements a transparent, mathematically rigorous normalization and composite scoring methodology:

For higher-is-better indicators:
    N_i = 100 * clip((x_i - L_i) / (U_i - L_i), 0, 1)

For lower-is-better indicators:
    N_i = 100 * clip((U_i - x_i) / (U_i - L_i), 0, 1)

Composite Development Score:
    D = sum(w_i * N_i), where sum(w_i) == 1.0

Explicitly documents baseline nature and indicator limitations (e.g., healthcare access nuances).
"""

from dataclasses import dataclass, field
import logging
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


@dataclass
class IndicatorReference:
    metric_key: str
    metric_name: str
    sector: str
    unit: str
    direction: str  # "higher_is_better" | "lower_is_better"
    lower_bound_L: float
    upper_bound_U: float
    lower_bound_justification: str
    upper_bound_U_justification: str
    weight: float
    methodological_limitations: str


# ---------------------------------------------------------------------------
# 1. Justified Reference Catalog (Sum of weights == 1.00)
# ---------------------------------------------------------------------------

INDICATOR_CATALOG: Dict[str, IndicatorReference] = {
    # Healthcare Sector (Weight: 0.28 total)
    "doctor_ratio_per_10k": IndicatorReference(
        metric_key="doctor_ratio_per_10k",
        metric_name="Physicians per 10,000 Population",
        sector="Healthcare",
        unit="Doctors / 10k pop",
        direction="higher_is_better",
        lower_bound_L=1.0,
        upper_bound_U=25.0,
        lower_bound_justification="Severe rural/tribal deficit baseline observed in remote blocks (WHO minimum benchmark is 10.0).",
        upper_bound_U_justification="Tier-1 capital/medical college benchmark (e.g. Bhubaneswar/Chandigarh standard of ~25.0).",
        weight=0.12,
        methodological_limitations=(
            "A simple ratio of doctors to population does not by itself capture geographic accessibility, "
            "difficult terrain transit times (e.g. highland ghat roads exceeding 4h), specialist retention rates, "
            "sub-centre telemedicine uplink readiness, or clinical service quality."
        ),
    ),
    "hospital_bed_ratio_per_1k": IndicatorReference(
        metric_key="hospital_bed_ratio_per_1k",
        metric_name="Hospital Bed Density per 1,000 Population",
        sector="Healthcare",
        unit="Beds / 1,000 pop",
        direction="higher_is_better",
        lower_bound_L=0.5,
        upper_bound_U=4.0,
        lower_bound_justification="Minimal emergency stabilization capacity baseline in aspirational districts.",
        upper_bound_U_justification="National Health Policy target of 3.0-4.0 beds per 1,000 population with secondary and tertiary referral.",
        weight=0.08,
        methodological_limitations=(
            "Bed density reflects static physical capacity. It does not measure critical care (ICU/ventilator) "
            "readiness, neonatal stabilization units, oxygen manifold continuity, or medical staffing sufficiency."
        ),
    ),
    "infant_mortality_rate": IndicatorReference(
        metric_key="infant_mortality_rate",
        metric_name="Infant Mortality Rate (IMR)",
        sector="Healthcare",
        unit="Deaths / 1,000 live births",
        direction="lower_is_better",
        lower_bound_L=10.0,
        upper_bound_U=60.0,
        lower_bound_justification="SDG-3 global aspirational target (<12 per 1,000) achieved by advanced health systems.",
        upper_bound_U_justification="High-burden historical rural/tribal district upper bound from NFHS baseline data.",
        weight=0.08,
        methodological_limitations=(
            "Civil registration of births and infant mortality can suffer from under-reporting in remote interior "
            "hamlets without Accredited Social Health Activist (ASHA) digital tablet connectivity."
        ),
    ),

    # Infrastructure Sector (Weight: 0.30 total)
    "piped_water_coverage": IndicatorReference(
        metric_key="piped_water_coverage",
        metric_name="Piped Drinking Water Household Coverage",
        sector="Infrastructure",
        unit="% Households",
        direction="higher_is_better",
        lower_bound_L=15.0,
        upper_bound_U=100.0,
        lower_bound_justification="Dispersed highland standpost baseline prior to major mission retrofits.",
        upper_bound_U_justification="Jal Jeevan Mission statutory target of 100% individual functional household tap connections (FHTC).",
        weight=0.12,
        methodological_limitations=(
            "Measures tap connection infrastructure presence. Does not measure water potability, chemical/bacteriological "
            "safety, diurnal supply duration, or seasonal water table and mountain spring discharge drawdown during summer."
        ),
    ),
    "road_connectivity": IndicatorReference(
        metric_key="road_connectivity",
        metric_name="All-Weather Road Habitation Connectivity",
        sector="Infrastructure",
        unit="% Eligible Habitations",
        direction="higher_is_better",
        lower_bound_L=40.0,
        upper_bound_U=100.0,
        lower_bound_justification="Baseline in hilly/Schedule V tribal areas with deep forest habitations.",
        upper_bound_U_justification="Pradhan Mantri Gram Sadak Yojana (PMGSY) mandate of 100% all-weather connectivity for habitations >250 pop.",
        weight=0.10,
        methodological_limitations=(
            "All-weather classification tracks asphalt/concrete surfacing; it does not measure seasonal susceptibility "
            "to monsoon hill washouts, culvert erosion, or public transit bus frequency."
        ),
    ),
    "broadband_access": IndicatorReference(
        metric_key="broadband_access",
        metric_name="High-Speed Broadband Household Penetration",
        sector="Infrastructure",
        unit="% Households",
        direction="higher_is_better",
        lower_bound_L=10.0,
        upper_bound_U=90.0,
        lower_bound_justification="Limited 2G/basic cellular coverage in deep valleys.",
        upper_bound_U_justification="National Digital Communications Policy target for high-speed fiber/4G-5G household access.",
        weight=0.08,
        methodological_limitations=(
            "BharatNet optical fiber connection to a Gram Panchayat office does not guarantee household last-mile "
            "affordability, reliable domestic electrical power for charging, or uptime during extreme weather."
        ),
    ),

    # Education & Human Development (Weight: 0.16 total)
    "literacy_rate": IndicatorReference(
        metric_key="literacy_rate",
        metric_name="Effective Adult Literacy Rate",
        sector="Education",
        unit="% Population >= 7 yrs",
        direction="higher_is_better",
        lower_bound_L=35.0,
        upper_bound_U=95.0,
        lower_bound_justification="Historic baseline in marginalized multilingual tribal tracts.",
        upper_bound_U_justification="Universal functional literacy ceiling achieved by leading Indian municipal districts.",
        weight=0.08,
        methodological_limitations=(
            "Census literacy tracks rudimentary ability to sign or decode text; it does not evaluate foundational "
            "learning outcomes (ASER reading/arithmetic standards), digital literacy, or indigenous mother-tongue bridge education."
        ),
    ),
    "secondary_retention": IndicatorReference(
        metric_key="secondary_retention",
        metric_name="Secondary School Retention Rate (Grades 9-10)",
        sector="Education",
        unit="% Students Retained",
        direction="higher_is_better",
        lower_bound_L=40.0,
        upper_bound_U=98.0,
        lower_bound_justification="Severe drop-off following upper primary transition in interior residential schools.",
        upper_bound_U_justification="Universal secondary completion standard aligned with National Education Policy (NEP 2020).",
        weight=0.08,
        methodological_limitations=(
            "Aggregate annual retention rates can mask seasonal dropout during monsoon planting and harvest periods, "
            "and gender-differentiated attrition due to distance to high schools."
        ),
    ),

    # Economy & Livelihoods (Weight: 0.20 total)
    "formal_jobs_ratio": IndicatorReference(
        metric_key="formal_jobs_ratio",
        metric_name="Formal Non-Agricultural Employment Rate",
        sector="Economy",
        unit="% Total Workforce",
        direction="higher_is_better",
        lower_bound_L=15.0,
        upper_bound_U=85.0,
        lower_bound_justification="Predominantly subsistence agrarian rural economy baseline.",
        upper_bound_U_justification="Diversified urban services and manufacturing employment structure in leading hubs.",
        weight=0.12,
        methodological_limitations=(
            "Formal non-farm employment omits resilient, community-owned informal agrarian value chains, "
            "Minor Forest Produce (MFP) cooperatives, and high-value tribal coffee/millets self-help group enterprises."
        ),
    ),
    "per_capita_income_inr": IndicatorReference(
        metric_key="per_capita_income_inr",
        metric_name="Annual Per Capita Income",
        sector="Economy",
        unit="INR / annum",
        direction="higher_is_better",
        lower_bound_L=40000.0,
        upper_bound_U=250000.0,
        lower_bound_justification="Subsistence agricultural district income floor.",
        upper_bound_U_justification="Tier-2 state capital economic output standard (e.g. Bhubaneswar per capita income).",
        weight=0.08,
        methodological_limitations=(
            "Macroeconomic district per capita aggregates disguise extreme intra-district Gini inequality between "
            "mining/industrial hubs and non-monetized remote tribal forest economies."
        ),
    ),

    # Governance & Civic Services (Weight: 0.06 total)
    "digital_services_ratio": IndicatorReference(
        metric_key="digital_services_ratio",
        metric_name="Municipal Digital Service Delivery Ratio",
        sector="Governance",
        unit="% Municipal Services Online",
        direction="higher_is_better",
        lower_bound_L=20.0,
        upper_bound_U=100.0,
        lower_bound_justification="Manual physical paper processing baseline in remote sub-divisional offices.",
        upper_bound_U_justification="Full digital integration under National e-Governance Plan (NeGP) and Smart Cities mandate.",
        weight=0.06,
        methodological_limitations=(
            "Digital availability on a web portal does not guarantee meaningful citizen accessibility for non-literate "
            "citizens or indigenous language speakers without Common Service Centre (CSC) human assistance."
        ),
    ),
}

# Verify weights sum exactly to 1.0 (with floating point tolerance)
_total_weights = sum(ref.weight for ref in INDICATOR_CATALOG.values())
assert abs(_total_weights - 1.0) < 1e-4, f"Indicator catalog weights must sum to 1.0, got {_total_weights}"


# ---------------------------------------------------------------------------
# 2. Mathematical Normalization & Scoring Logic
# ---------------------------------------------------------------------------

class DevelopmentScoringEngine:
    """
    Transparent Development Scoring Engine.
    Computes clipped indicator scores and composite development maturity index
    with documented reference thresholds, justifications, and caveats.
    """

    def __init__(self, catalog: Optional[Dict[str, IndicatorReference]] = None):
        self.catalog = catalog or INDICATOR_CATALOG

    @staticmethod
    def normalize_higher_is_better(x: float, L: float, U: float) -> float:
        """
        N_i = 100 * clip((x_i - L_i) / (U_i - L_i), 0, 1)
        """
        if U <= L:
            return 50.0
        val = (x - L) / (U - L)
        clipped = max(0.0, min(1.0, val))
        return round(100.0 * clipped, 2)

    @staticmethod
    def normalize_lower_is_better(x: float, L: float, U: float) -> float:
        """
        N_i = 100 * clip((U_i - x_i) / (U_i - L_i), 0, 1)
        """
        if U <= L:
            return 50.0
        val = (U - x) / (U - L)
        clipped = max(0.0, min(1.0, val))
        return round(100.0 * clipped, 2)

    def normalize_indicator(
        self,
        metric_key: str,
        observed_value: float,
        override_ref: Optional[IndicatorReference] = None,
    ) -> Tuple[float, IndicatorReference]:
        """
        Computes the normalized score N_i in [0, 100] using the appropriate direction formula.
        """
        ref = override_ref or self.catalog.get(metric_key)
        if not ref:
            # Fallback for unknown indicators (default higher is better, 0-100 scale)
            ref = IndicatorReference(
                metric_key=metric_key,
                metric_name=metric_key.replace("_", " ").title(),
                sector="General",
                unit="Score",
                direction="higher_is_better",
                lower_bound_L=0.0,
                upper_bound_U=100.0,
                lower_bound_justification="Default lower reference scale (0.0).",
                upper_bound_U_justification="Default upper reference scale (100.0).",
                weight=0.0,
                methodological_limitations="Generic uncataloged indicator. Use cautiously.",
            )

        if ref.direction == "lower_is_better":
            norm_score = self.normalize_lower_is_better(observed_value, ref.lower_bound_L, ref.upper_bound_U)
        else:
            norm_score = self.normalize_higher_is_better(observed_value, ref.lower_bound_L, ref.upper_bound_U)

        return norm_score, ref

    def calculate_composite_score(
        self,
        observed_indicators: Dict[str, float],
        weights_override: Optional[Dict[str, float]] = None,
    ) -> Dict[str, Any]:
        """
        Computes the composite development score D = sum(w_i * N_i), where sum(w_i) == 1.0.
        Returns full transparent breakdown, sector aggregates, and documented limitations.
        """
        breakdown: List[Dict[str, Any]] = []
        sector_accumulators: Dict[str, Dict[str, float]] = {}

        # Normalize weights if custom weights are passed
        active_weights: Dict[str, float] = {}
        matched_keys = [k for k in self.catalog.keys() if k in observed_indicators]

        if not matched_keys:
            # Match by normalized metric key aliases if needed
            matched_keys = list(self.catalog.keys())

        if weights_override:
            total_custom = sum(weights_override.get(k, 0.0) for k in matched_keys)
            if total_custom > 0:
                active_weights = {k: weights_override.get(k, 0.0) / total_custom for k in matched_keys}
            else:
                active_weights = {k: self.catalog[k].weight for k in matched_keys}
        else:
            raw_weights_sum = sum(self.catalog[k].weight for k in matched_keys)
            scale = 1.0 / raw_weights_sum if raw_weights_sum > 0 else 1.0
            active_weights = {k: self.catalog[k].weight * scale for k in matched_keys}

        composite_score = 0.0

        for key, ref in self.catalog.items():
            if key not in observed_indicators and key not in matched_keys:
                continue

            obs_val = float(observed_indicators.get(key, (ref.lower_bound_L + ref.upper_bound_U) / 2.0))
            norm_score, _ = self.normalize_indicator(key, obs_val, override_ref=ref)
            w = active_weights.get(key, 0.0)
            contrib = round(norm_score * w, 3)
            composite_score += contrib

            breakdown.append({
                "metric_key": key,
                "metric_name": ref.metric_name,
                "sector": ref.sector,
                "unit": ref.unit,
                "direction": ref.direction,
                "observed_value": obs_val,
                "lower_bound_L": ref.lower_bound_L,
                "upper_bound_U": ref.upper_bound_U,
                "lower_justification": ref.lower_bound_justification,
                "upper_justification": ref.upper_bound_U_justification,
                "normalized_score_N_i": norm_score,
                "weight_w_i": round(w, 4),
                "weighted_contribution": contrib,
                "methodological_limitations": ref.methodological_limitations,
            })

            # Accumulate sector scores
            sec = ref.sector
            if sec not in sector_accumulators:
                sector_accumulators[sec] = {"weighted_sum": 0.0, "total_weight": 0.0}
            sector_accumulators[sec]["weighted_sum"] += norm_score * w
            sector_accumulators[sec]["total_weight"] += w

        # Calculate sector sub-scores
        sector_scores: List[Dict[str, Any]] = []
        for sec, acc in sector_accumulators.items():
            sec_w = acc["total_weight"]
            sec_score = round(acc["weighted_sum"] / sec_w, 2) if sec_w > 0 else 50.0
            sector_scores.append({
                "sector": sec,
                "sector_score": sec_score,
                "sector_weight": round(sec_w, 4),
            })

        final_composite = round(composite_score, 1)

        return {
            "composite_score": final_composite,
            "maturity_tier": self._classify_maturity(final_composite),
            "indicator_breakdown": breakdown,
            "sector_scores": sector_scores,
            "methodology_metadata": {
                "baseline_type": "Proposed baseline methodology, not a validated national development index.",
                "formula_higher_is_better": "N_i = 100 * clip((x_i - L_i) / (U_i - L_i), 0, 1)",
                "formula_lower_is_better": "N_i = 100 * clip((U_i - x_i) / (U_i - L_i), 0, 1)",
                "composite_formula": "D = sum(w_i * N_i), where sum(w_i) == 1.0",
                "weights_sum_to_one": True,
                "general_limitations": [
                    "Single scalar development indices necessarily compress multidimensional socio-spatial realities.",
                    "Indicators such as doctor-to-population ratio do not reflect geographic reach across mountainous topography, absenteeism, or diagnostic drug availability.",
                    "Piped water connection coverage does not capture diurnal water availability or chemical/bacteriological safety.",
                    "Formal employment metrics omit informal agricultural livelihoods and self-help group micro-economies.",
                ],
            },
        }

    @staticmethod
    def _classify_maturity(score: float) -> str:
        if score >= 80.0:
            return "Advanced / Tier-1 Parity"
        elif score >= 65.0:
            return "Transitioning / High Potential"
        elif score >= 50.0:
            return "Aspirational / Developing Baseline"
        else:
            return "Priority Intervention / Critical Need"


# Global singleton instance
development_scoring_engine = DevelopmentScoringEngine()
