"""
Prompt engineering and JSON response parsing utilities for CivicIntel LLM providers.
Shared across Gemini, Groq, NVIDIA NIM, Mistral, and OpenAI providers.
"""

import json
import logging
import re
from typing import Any, Dict, List

from app.core.llm.base import GenerationContext

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are CivicIntel's AI Policy Recommendation Engine for Indian Cities.
You generate evidence-grounded, prioritized policy recommendations for developing Indian cities.

MANDATORY CIVIC GOVERNANCE SAFEGUARDS:
1. NEVER invent government schemes or ministries. Only reference verified central/state schemes provided in the context (e.g. National Health Mission, District Mineral Foundation, Jal Jeevan Mission, Odisha Millets Mission, Integrated Coffee Development Project).
2. NEVER invent source documents or statistics. Anchor your recommendations to the provided empirical benchmark gaps and statutory source passages.
3. NEVER fabricate cost estimates or ROI claims. Clearly specify cost_status as one of:
   - "Verified Scheme Budget"
   - "Estimated from Standard Schedule of Rates"
   - "Requires Feasibility Study"
   - "Unsupported / Data Gap"
4. Clearly distinguish observed empirical facts from assumptions, and explicitly list unresolved data gaps.
5. All recommendations must be subject to mandatory human review (human_review_required: true).
6. Return ONLY a valid JSON object or array conforming strictly to the requested schema. Do not include markdown preamble or conversational filler."""


def build_civic_policy_system_prompt() -> str:
    """Returns the standardized system prompt enforcing civic governance guardrails."""
    return SYSTEM_PROMPT


def build_civic_policy_user_prompt(context: GenerationContext) -> str:
    """
    Constructs the contextual prompt with target city metrics, benchmark precedents,
    empirical gaps, statutory schemes, and budget ceilings.
    """
    target = context.target_city
    benchmark = context.benchmark_city or {}

    prompt_data = {
        "target_city": {
            "id": target.get("id"),
            "name": target.get("name"),
            "state": target.get("state"),
            "population": target.get("population"),
            "terrain_type": context.terrain_type,
            "local_resources": context.local_resources,
        },
        "benchmark_city": {
            "id": benchmark.get("id"),
            "name": benchmark.get("name"),
            "state": benchmark.get("state"),
            "similarity_score": context.similarity_score,
        } if benchmark else None,
        "empirical_gaps_identified": context.identified_gaps,
        "verified_statutory_schemes": context.applicable_schemes,
        "statutory_source_documents": [
            {
                "id": doc.get("id"),
                "title": doc.get("title"),
                "publisher": doc.get("publisher"),
                "year": doc.get("year"),
                "relevant_passage": doc.get("relevant_passage"),
            }
            for doc in context.supporting_documents[:5]
        ],
        "budget_constraint_cr": context.budget_constraint_cr,
        "prioritized_sectors": context.prioritized_sectors,
    }

    schema_sample = [
        {
            "id": "rec_koraput_1",
            "city_id": target.get("id", "target_city"),
            "title": "Comprehensive Healthcare Intervention Title",
            "sector": "Healthcare",
            "priority": "Immediate",  # Immediate | High | Medium | Strategic
            "problem_statement": "Clear empirical problem description...",
            "proposed_intervention": "Actionable, phased intervention plan...",
            "benchmark_evidence": [
                {
                    "metric": "doctor_ratio_per_10k",
                    "target_value": 4.8,
                    "benchmark_value": 24.2,
                    "gap_percentage": 80.2,
                    "benchmark_city": benchmark.get("name", "Benchmark City"),
                    "precedent_summary": "How benchmark city achieved this...",
                }
            ],
            "local_requirements": ["Requirement 1", "Requirement 2"],
            "applicable_schemes": [
                {
                    "scheme_name": "National Health Mission - Mobile Medical Units",
                    "ministry": "Ministry of Health & Family Welfare",
                    "funding_share": "60:40 Centre to State",
                    "statutory_basis": "NHM Operational Framework Section 4.2",
                    "source_citation": "NHM Operational Guidelines 2024",
                }
            ],
            "estimated_cost_cr": 18.5,
            "cost_status": "Estimated from Standard Schedule of Rates",
            "cost_breakdown": {"Capex": 12.0, "Opex_Year_1": 6.5},
            "expected_outcomes": [
                {
                    "kpi": "Doctor ratio per 10k",
                    "baseline": "4.8",
                    "projected_target": "10.0",
                    "target_horizon_months": 24,
                    "confidence_level": "High",
                }
            ],
            "implementation_dependencies": ["Dependency 1"],
            "risks": [
                {
                    "risk_description": "Risk description...",
                    "severity": "Medium",
                    "mitigation_strategy": "Mitigation strategy...",
                }
            ],
            "data_gaps": ["Data gap 1", "Data gap 2"],
            "sources": [
                {
                    "document_title": "District Mineral Foundation (DMF) Trust Annual Audit Report",
                    "publisher": "Government of Odisha, Department of Steel & Mines",
                    "year": 2024,
                    "relevant_passage": "Relevant authentic passage...",
                    "citation_reference": "DMF Trust Audit 2024, Section 5.3",
                }
            ],
            "confidence_score": 0.88,
        }
    ]

    return (
        f"Generate prioritized, evidence-grounded policy recommendations for {target.get('name')} based on the following verified data:\n\n"
        f"```json\n{json.dumps(prompt_data, indent=2)}\n```\n\n"
        f"OUTPUT FORMAT: Return a valid JSON array matching the structure below (or a JSON object with a 'recommendations' array key):\n"
        f"```json\n{json.dumps(schema_sample, indent=2)}\n```"
    )


def parse_llm_json_response(raw_content: str) -> List[Dict[str, Any]]:
    """
    Safely parses JSON output from an LLM response, handling markdown fences,
    whitespace, and dictionary wrappers.
    """
    if not raw_content or not raw_content.strip():
        return []

    text = raw_content.strip()

    # Strip markdown fences if present
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict):
            if "recommendations" in parsed and isinstance(parsed["recommendations"], list):
                return parsed["recommendations"]
            if "data" in parsed and isinstance(parsed["data"], list):
                return parsed["data"]
            # If a single recommendation object was returned
            if "title" in parsed and "proposed_intervention" in parsed:
                return [parsed]
        return []
    except json.JSONDecodeError:
        # Fallback: search for first JSON array or object bracket
        match = re.search(r"(\[.*\]|\{.*\})", text, re.DOTALL)
        if match:
            try:
                candidate = json.loads(match.group(1))
                if isinstance(candidate, list):
                    return candidate
                if isinstance(candidate, dict) and "recommendations" in candidate:
                    return candidate["recommendations"]
            except Exception:
                pass
        logger.warning(f"Failed to decode JSON from LLM output: {raw_content[:200]}...")
        return []
