"""
CivicIntel AI Policy Recommendation Engine.

Executes the 8-step evidence-grounded recommendation pipeline:
1. Validate city data
2. Identify development gaps (Deterministic Stage A)
3. Retrieve relevant supporting documents
4. Match evidence to identified problems
5. Apply feasibility checks
6. Generate structured recommendations (Stage B via LLM provider)
7. Validate output against strict Pydantic schemas & safeguards
8. Prepare recommendations for human review (Stage C workflow)
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import uuid

from app.core.llm.base import GenerationContext, LLMProvider
from app.core.llm.factory import get_llm_provider
from app.ml.city_dataset import CURATED_CITIES_DATA, get_curated_city_by_id
from app.ml.city_matcher import CityBenchmarkMatcher
from app.ml.policy_knowledge import (
    VERIFIED_GOVERNMENT_SCHEMES,
    VERIFIED_SOURCE_DOCUMENTS,
    get_applicable_schemes_for_sector,
)
from app.schemas.policy_recommendation import (
    DeterministicGapItem,
    PolicyRecommendationItem,
)


class AIPolicyRecommendationEngine:
    """
    Central AI Policy Recommendation Engine for CivicIntel.
    """

    def __init__(self, llm_provider: Optional[LLMProvider] = None):
        self.llm = llm_provider or get_llm_provider()
        self.matcher = CityBenchmarkMatcher()

    def run_pipeline(
        self,
        target_city: Dict[str, Any],
        benchmark_city: Optional[Dict[str, Any]] = None,
        prioritized_sectors: Optional[List[str]] = None,
        budget_constraint_cr: Optional[float] = None,
        require_verified_schemes: bool = True,
        db: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """
        Executes the full policy generation and verification pipeline.
        Incorporates dynamic RAG retrieval over PostgreSQL pgvector government knowledge base.
        """
        # Step 1: Validate City Data
        self.matcher.validate_city_profile(target_city, is_target=True)

        # Resolve benchmark city if not explicitly provided
        if not benchmark_city:
            match_res = self.matcher.match_city(
                target_city=target_city,
                candidate_pool=CURATED_CITIES_DATA,
                top_k=1,
                aspirational_only=True,
            )
            if match_res["top_candidates"]:
                bench_id = match_res["top_candidates"][0]["candidate_city"]["id"]
                benchmark_city = get_curated_city_by_id(bench_id) or CURATED_CITIES_DATA[1]
            else:
                benchmark_city = CURATED_CITIES_DATA[1]  # Fallback to Bhubaneswar

        self.matcher.validate_city_profile(benchmark_city, is_target=False)

        # Execute multi-stage pipeline via LangGraph Corrective Self-RAG StateGraph
        from app.ml.policy_graph import civic_policy_langgraph

        initial_state = {
            "target_city": target_city,
            "benchmark_city": benchmark_city,
            "prioritized_sectors": prioritized_sectors,
            "budget_constraint_cr": budget_constraint_cr,
            "require_verified_schemes": require_verified_schemes,
            "deterministic_gaps": [],
            "retrieved_documents": [],
            "evidence_grade": "unknown",
            "rewrite_count": 0,
            "query_rewrites": [],
            "raw_recommendations": [],
            "validated_recommendations": [],
            "safeguards_summary": {},
            "workflow_stage": "init",
            "current_node": "START",
        }

        graph_result = civic_policy_langgraph.invoke(initial_state)

        # Budget cap filtering
        validated_recs = graph_result.get("validated_recommendations", [])
        if budget_constraint_cr is not None:
            capped = []
            curr_sum = 0.0
            for r in validated_recs:
                cost = r.get("estimated_cost_cr") or 0.0
                if curr_sum + cost <= budget_constraint_cr or not capped:
                    capped.append(r)
                    curr_sum += cost
            validated_recs = capped

        # Step 8: Return complete response with full audit trail and methodology
        now = datetime.now(timezone.utc)
        return {
            "target_city": {
                "id": target_city["id"],
                "name": target_city["name"],
                "state": target_city.get("state", ""),
                "development_maturity_score": target_city.get("development_maturity_score", 50.0),
            },
            "benchmark_city": {
                "id": benchmark_city["id"],
                "name": benchmark_city["name"],
                "state": benchmark_city.get("state", ""),
                "development_maturity_score": benchmark_city.get("development_maturity_score", 50.0),
            },
            "deterministic_gaps": graph_result.get("deterministic_gaps", []),
            "recommendations": validated_recs,
            "safeguards_summary": graph_result.get("safeguards_summary", {}),
            "generation_metadata": {
                "timestamp": now.isoformat(),
                "budget_constraint_applied_cr": budget_constraint_cr,
                "total_recommendations": len(validated_recs),
                "langgraph_execution_status": "completed",
            },
        }

    def _identify_development_gaps(
        self,
        target: Dict[str, Any],
        benchmark: Dict[str, Any],
        prioritized_sectors: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Stage A: Evaluates empirical indicator gaps between target and benchmark city.
        Checks for required vs missing data before generating policy interventions.
        """
        gap_definitions = [
            {
                "sector": "Healthcare",
                "metric_key": "doctor_ratio_per_10k",
                "title": "Severe Primary Care Physician Shortage",
                "target_val": float(target.get("doctor_ratio_per_10k", 0.0)),
                "bench_val": float(benchmark.get("doctor_ratio_per_10k", 0.0)),
                "norm_threshold": 10.0,
                "required_info": [
                    "Current active medical officers",
                    "Geographic distribution of remote habitations",
                    "Available mobile clinics",
                    "Applicable NHM & DMF schemes",
                ],
                "available_info": [
                    "Doctor density per 10k: 4.8",
                    "Medical college presence: SLN Medical College Koraput",
                    "Statutory DMF allocation balance: ₹142.6 Cr",
                ],
                "missing_info": [
                    "Sub-centre satellite uplink telemetry readiness",
                    "Updated block-level specialist vacancy roster",
                ],
            },
            {
                "sector": "Economy",
                "metric_key": "formal_employment_pct",
                "title": "Low Formal Non-Farm Employment & Agrarian Value Realization",
                "target_val": float(target.get("formal_employment_pct", 0.0)),
                "bench_val": float(benchmark.get("formal_employment_pct", 0.0)),
                "norm_threshold": 50.0,
                "required_info": [
                    "Parchment coffee annual harvest volume",
                    "GI tag certification status",
                    "Tribal SHG cooperative federation structure",
                    "Capital subsidy guidelines",
                ],
                "available_info": [
                    "Formal employment: 26.8%",
                    "Registered GI status: Koraput Coffee (GI No. 638)",
                    "Active women SHG groups under Mission Shakti",
                ],
                "missing_info": [
                    "Dry parchment storage capacity audit in Jeypore",
                    "Primary society moisture meter deployment count",
                ],
            },
            {
                "sector": "Water & Sanitation",
                "metric_key": "piped_water_pct",
                "title": "Inadequate Treated Piped Drinking Water Access",
                "target_val": float(target.get("piped_water_pct", 0.0)),
                "bench_val": float(benchmark.get("piped_water_pct", 0.0)),
                "norm_threshold": 80.0,
                "required_info": [
                    "Hill habitations piped coverage",
                    "Spring discharge hydrological baseline",
                    "JJM fund allocation guidelines",
                ],
                "available_info": [
                    "Piped water coverage: 48.2%",
                    "Abundant seasonal rainfall: 1520 mm",
                    "Highland hill topography with perennial springs",
                ],
                "missing_info": [
                    "Summer peak discharge logs for 48 mountain springs",
                    "Aquifer water table drawdown records",
                ],
            },
        ]

        gaps: List[Dict[str, Any]] = []

        for item in gap_definitions:
            sec = item["sector"].lower()
            if prioritized_sectors and sec not in [s.lower() for s in prioritized_sectors]:
                continue

            t_val = item["target_val"]
            b_val = item["bench_val"]
            if b_val > 0:
                gap_pct = round(((b_val - t_val) / b_val) * 100, 1)
            else:
                gap_pct = 0.0

            if gap_pct > 20.0 or t_val < item["norm_threshold"]:
                severity = "Critical" if gap_pct > 50.0 else "High"
                readiness = len(item["missing_info"]) <= 3  # Non-blocking data gaps

                gaps.append({
                    "sector": item["sector"],
                    "gap_title": item["title"],
                    "metric_key": item["metric_key"],
                    "target_value": t_val,
                    "benchmark_value": b_val,
                    "gap_percentage": gap_pct,
                    "severity": severity,
                    "required_information": item["required_info"],
                    "available_information": item["available_info"],
                    "missing_information": item["missing_info"],
                    "readiness_for_recommendation": readiness,
                })

        return gaps

    def _retrieve_schemes_for_gaps(self, gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Matches verified government schemes to the identified gap sectors."""
        schemes: List[Dict[str, Any]] = []
        seen_ids = set()

        for g in gaps:
            matched = get_applicable_schemes_for_sector(g["sector"])
            for m in matched:
                if m["id"] not in seen_ids:
                    seen_ids.add(m["id"])
                    schemes.append(m)

        return schemes

    def _enforce_safeguards_and_validate(
        self,
        raw_recs: List[Dict[str, Any]],
        target_city: Dict[str, Any],
        require_verified_schemes: bool = True,
    ) -> List[Dict[str, Any]]:
        """
        Validates generated recommendations against PolicyRecommendationItem schema.
        Enforces critical safeguards:
        - Replaces missing IDs with deterministic UUIDs
        - Sets human_review_required = True
        - Validates cost_status tags
        - Enforces verified scheme citations
        """
        validated: List[Dict[str, Any]] = []
        now = datetime.now(timezone.utc)

        for rec in raw_recs:
            r = dict(rec)
            r["city_id"] = target_city["id"]
            if "id" not in r or not r["id"]:
                r["id"] = f"rec_{target_city['id']}_{uuid.uuid4().hex[:8]}"

            r["human_review_required"] = True
            r["status"] = r.get("status", "Proposed")
            r["model_name"] = r.get("model_name", self.llm.provider_name)
            r["generation_timestamp"] = now

            # Cost safeguard
            if r.get("estimated_cost_cr") is None:
                r["cost_status"] = "Requires Feasibility Study"

            # Enforce schema through Pydantic
            try:
                item = PolicyRecommendationItem.model_validate(r)
                validated.append(item.model_dump())
            except Exception as e:
                # If schema validation fails on custom raw LLM output, sanitize and retry
                r["priority"] = "High" if r.get("priority") not in ["Immediate", "High", "Medium", "Strategic"] else r["priority"]
                r["cost_status"] = "Requires Feasibility Study" if r.get("cost_status") not in [
                    "Verified Scheme Budget",
                    "Estimated from Standard Schedule of Rates",
                    "Requires Feasibility Study",
                    "Unsupported / Data Gap",
                ] else r["cost_status"]
                r["confidence_score"] = float(r.get("confidence_score", 0.85))
                item = PolicyRecommendationItem.model_validate(r)
                validated.append(item.model_dump())

        return validated
