"""
NVIDIA NIM LLM Policy Recommendation Provider for CivicIntel.
Interfaces with NVIDIA Cloud NIM API (Meta Llama-3.1-70B, Nemotron, etc.) via httpx.
"""

import logging
from typing import Any, Dict, List, Optional

import httpx

from app.core.config import settings
from app.core.llm.base import GenerationContext, LLMProvider
from app.core.llm.deterministic import DeterministicPolicyProvider
from app.core.llm.prompt_utils import (
    build_civic_policy_system_prompt,
    build_civic_policy_user_prompt,
    parse_llm_json_response,
)

logger = logging.getLogger(__name__)


class NvidiaProvider(LLMProvider):
    """
    Interfaces with NVIDIA NIM cloud inference for evidence-grounded civic policy recommendations.
    Uses OpenAI-compatible /v1/chat/completions endpoint on integrate.api.nvidia.com.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or getattr(settings, "NVIDIA_API_KEY", None)
        self.model = model or getattr(settings, "NVIDIA_MODEL", "meta/llama-3.1-70b-instruct")
        self.fallback = DeterministicPolicyProvider()

    @property
    def provider_name(self) -> str:
        return f"nvidia-{self.model}"

    def generate_recommendations(self, context: GenerationContext) -> List[Dict[str, Any]]:
        if not self.api_key:
            logger.info("[NvidiaProvider] No NVIDIA_API_KEY configured. Utilizing deterministic grounded engine.")
            return self.fallback.generate_recommendations(context)

        system_prompt = build_civic_policy_system_prompt()
        user_prompt = build_civic_policy_user_prompt(context)

        url = "https://integrate.api.nvidia.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "top_p": 0.7,
            "max_tokens": 4096,
        }

        try:
            with httpx.Client(timeout=40.0) as client:
                resp = client.post(url, headers=headers, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    choices = data.get("choices", [])
                    if choices:
                        content = choices[0].get("message", {}).get("content", "")
                        parsed = parse_llm_json_response(content)
                        if parsed:
                            logger.info(f"[NvidiaProvider] Successfully generated {len(parsed)} policy recommendations via {self.model}.")
                            return parsed
                else:
                    logger.warning(f"[NvidiaProvider] NVIDIA API returned HTTP {resp.status_code}: {resp.text[:200]}")

        except Exception as err:
            logger.warning(f"[NvidiaProvider] NVIDIA API call failed: {err}")

        logger.info("[NvidiaProvider] Falling back to deterministic grounded civic policy engine.")
        return self.fallback.generate_recommendations(context)
