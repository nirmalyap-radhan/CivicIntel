"""
OpenAI LLM Policy Recommendation Provider.
Interfaces with OpenAI GPT-4o / GPT-4o-mini when OPENAI_API_KEY is configured.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.core.llm.base import GenerationContext, LLMProvider
from app.core.llm.deterministic import DeterministicPolicyProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.model = model or getattr(settings, "OPENAI_MODEL", "gpt-4o")
        self.fallback = DeterministicPolicyProvider()

    @property
    def provider_name(self) -> str:
        return f"openai-{self.model}"

    def generate_recommendations(self, context: GenerationContext) -> List[Dict[str, Any]]:
        if not self.api_key:
            logger.warning("[OpenAIProvider] No OPENAI_API_KEY configured. Falling back to deterministic grounded engine.")
            return self.fallback.generate_recommendations(context)

        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)

            system_prompt = (
                "You are CivicIntel's AI Policy Recommendation Engine for Indian Cities. "
                "CRITICAL SAFEGUARDS:\n"
                "1. NEVER invent government schemes or ministries. Only reference verified schemes provided.\n"
                "2. NEVER invent source documents or statistics.\n"
                "3. NEVER fabricate cost estimates or ROI. Clearly mark cost status as 'Verified Scheme Budget', "
                "'Estimated from Standard Schedule of Rates', or 'Requires Feasibility Study'.\n"
                "4. Distinguish observed facts from assumptions and list data gaps.\n"
                "5. Return a strict JSON array conforming to PolicyRecommendationItem schema."
            )

            user_prompt = (
                f"Target City: {context.target_city.get('name')}\n"
                f"Benchmark City: {context.benchmark_city.get('name') if context.benchmark_city else 'None'}\n"
                f"Identified Gaps: {json.dumps(context.identified_gaps, indent=2)}\n"
                f"Applicable Schemes: {json.dumps(context.applicable_schemes, indent=2)}\n"
                f"Supporting Documents: {json.dumps(context.supporting_documents, indent=2)}\n"
                f"Budget Constraint: {context.budget_constraint_cr} Cr\n\n"
                "Generate structured policy recommendations as a valid JSON array of objects."
            )

            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )

            content = response.choices[0].message.content or "{}"
            parsed = json.loads(content)
            recs = parsed.get("recommendations", parsed) if isinstance(parsed, dict) else parsed
            if isinstance(recs, list) and len(recs) > 0:
                return recs
            return self.fallback.generate_recommendations(context)

        except Exception as e:
            logger.error(f"[OpenAIProvider] Generation failed with error: {e}. Falling back to deterministic engine.")
            return self.fallback.generate_recommendations(context)
