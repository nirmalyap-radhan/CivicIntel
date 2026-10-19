"""
LLM Provider Factory for CivicIntel Recommendation Engine.
Selects and routes to providers based on available API keys or explicit configuration.
Supports Groq, Google Gemini, NVIDIA NIM, Mistral AI, OpenAI, and Deterministic Grounded Engine.
"""

import logging
from typing import Any, Dict, Optional

from app.core.config import settings
from app.core.llm.base import LLMProvider
from app.core.llm.deterministic import DeterministicPolicyProvider
from app.core.llm.gemini_provider import GeminiProvider
from app.core.llm.groq_provider import GroqProvider
from app.core.llm.mistral_provider import MistralProvider
from app.core.llm.nvidia_provider import NvidiaProvider
from app.core.llm.openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)


def get_llm_provider(provider_type: Optional[str] = None) -> LLMProvider:
    """
    Factory function returning an instantiated LLMProvider.
    Respects settings.LLM_PROVIDER and auto-routes across available API keys.
    Priority in 'auto' mode:
      1. Groq (Llama 3.3 70B - ultra-fast inference)
      2. Google Gemini (Gemini 1.5 Pro / Flash)
      3. NVIDIA NIM (Llama 3.1 70B / Nemotron)
      4. Mistral AI (Mistral Large)
      5. OpenAI (GPT-4o)
      6. Deterministic Policy Provider (Zero-hallucination grounded baseline)
    """
    ptype = (provider_type or getattr(settings, "LLM_PROVIDER", "auto")).lower().strip()

    # Explicit routing
    if ptype == "groq":
        return GroqProvider()
    elif ptype == "gemini":
        return GeminiProvider()
    elif ptype in ("nvidia", "nvda", "nim"):
        return NvidiaProvider()
    elif ptype in ("mistral", "mystaral"):
        return MistralProvider()
    elif ptype == "openai":
        return OpenAIProvider()
    elif ptype in ("deterministic", "deterministic_fallback", "rule_based"):
        return DeterministicPolicyProvider()

    # 'auto' routing: inspect configured keys in priority order
    if getattr(settings, "GROQ_API_KEY", None):
        logger.info("[LLM Factory] Auto-routed to GroqProvider (GROQ_API_KEY detected).")
        return GroqProvider()

    if getattr(settings, "GEMINI_API_KEY", None):
        logger.info("[LLM Factory] Auto-routed to GeminiProvider (GEMINI_API_KEY detected).")
        return GeminiProvider()

    if getattr(settings, "NVIDIA_API_KEY", None):
        logger.info("[LLM Factory] Auto-routed to NvidiaProvider (NVIDIA_API_KEY detected).")
        return NvidiaProvider()

    if getattr(settings, "MISTRAL_API_KEY", None):
        logger.info("[LLM Factory] Auto-routed to MistralProvider (MISTRAL_API_KEY detected).")
        return MistralProvider()

    if getattr(settings, "OPENAI_API_KEY", None):
        logger.info("[LLM Factory] Auto-routed to OpenAIProvider (OPENAI_API_KEY detected).")
        return OpenAIProvider()

    # Zero-config default: high-precision deterministic grounded engine
    logger.info("[LLM Factory] No external LLM keys detected. Auto-routed to DeterministicPolicyProvider.")
    return DeterministicPolicyProvider()


def get_provider_status() -> Dict[str, Any]:
    """
    Returns diagnostic status of LLM providers and configured API keys.
    Useful for health checks and settings inspection.
    """
    active = get_llm_provider()
    return {
        "active_provider": active.provider_name,
        "configured_mode": getattr(settings, "LLM_PROVIDER", "auto"),
        "available_keys": {
            "groq": bool(getattr(settings, "GROQ_API_KEY", None)),
            "gemini": bool(getattr(settings, "GEMINI_API_KEY", None)),
            "nvidia": bool(getattr(settings, "NVIDIA_API_KEY", None)),
            "mistral": bool(getattr(settings, "MISTRAL_API_KEY", None)),
            "openai": bool(getattr(settings, "OPENAI_API_KEY", None)),
        },
        "default_models": {
            "groq": getattr(settings, "GROQ_MODEL", "llama-3.3-70b-versatile"),
            "gemini": getattr(settings, "GEMINI_MODEL", "gemini-1.5-pro"),
            "nvidia": getattr(settings, "NVIDIA_MODEL", "meta/llama-3.1-70b-instruct"),
            "mistral": getattr(settings, "MISTRAL_MODEL", "mistral-large-latest"),
            "openai": getattr(settings, "OPENAI_MODEL", "gpt-4o"),
        },
    }
