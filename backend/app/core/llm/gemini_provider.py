"""
Google Gemini LLM Policy Recommendation Provider for CivicIntel.
Supports Gemini 1.5 Pro, Gemini 1.5 Flash, and Gemini 2.0 via direct REST API (httpx)
or optional google-generativeai package if available.
"""

import json
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


class GeminiProvider(LLMProvider):
    """
    Interfaces with Google Gemini (1.5 Pro / Flash) for evidence-grounded civic policy recommendations.
    Direct REST integration ensures zero vendor lock-in and zero SDK bloat.
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or getattr(settings, "GEMINI_API_KEY", None)
        self.model = model or getattr(settings, "GEMINI_MODEL", "gemini-1.5-pro")
        self.fallback = DeterministicPolicyProvider()

    @property
    def provider_name(self) -> str:
        return f"google-{self.model}"

    def generate_recommendations(self, context: GenerationContext) -> List[Dict[str, Any]]:
        if not self.api_key:
            logger.info("[GeminiProvider] No GEMINI_API_KEY configured. Utilizing deterministic grounded engine.")
            return self.fallback.generate_recommendations(context)

        system_prompt = build_civic_policy_system_prompt()
        user_prompt = build_civic_policy_user_prompt(context)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"

        # 1. Try google.generativeai if installed
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            model_instance = genai.GenerativeModel(self.model)
            res = model_instance.generate_content(full_prompt)
            if res and res.text:
                parsed = parse_llm_json_response(res.text)
                if parsed:
                    return parsed
        except ImportError:
            pass
        except Exception as e:
            logger.warning(f"[GeminiProvider] google-generativeai SDK call failed: {e}. Trying direct REST API...")

        # 2. Direct HTTP REST API via httpx
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": full_prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json",
            },
        }

        try:
            with httpx.Client(timeout=35.0) as client:
                resp = client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            raw_text = parts[0].get("text", "")
                            parsed = parse_llm_json_response(raw_text)
                            if parsed:
                                return parsed
                else:
                    logger.warning(f"[GeminiProvider] REST returned HTTP {resp.status_code}: {resp.text[:200]}")

        except Exception as err:
            logger.warning(f"[GeminiProvider] Direct REST call failed: {err}")

        # 3. Graceful fallback to deterministic grounded engine
        logger.info("[GeminiProvider] Falling back to deterministic grounded civic policy engine.")
        return self.fallback.generate_recommendations(context)
