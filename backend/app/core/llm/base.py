from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class GenerationContext(BaseModel):
    """
    Context supplied to the LLM Recommendation Engine.
    Contains verified indicators, benchmark comparisons, government schemes,
    feasibility constraints, and budget limits.
    """
    target_city: Dict[str, Any]
    benchmark_city: Optional[Dict[str, Any]] = None
    similarity_score: Optional[float] = None
    identified_gaps: List[Dict[str, Any]] = Field(default_factory=list)
    applicable_schemes: List[Dict[str, Any]] = Field(default_factory=list)
    supporting_documents: List[Dict[str, Any]] = Field(default_factory=list)
    local_resources: List[str] = Field(default_factory=list)
    terrain_type: str = "unspecified"
    budget_constraint_cr: Optional[float] = None
    prioritized_sectors: Optional[List[str]] = None


class LLMProvider(ABC):
    """
    Abstract interface for Policy Recommendation LLM Providers.
    Allows swappable backends (Gemini, OpenAI, Anthropic, or Deterministic Rule Engine).
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Name of the provider (e.g. 'gemini-1.5-pro', 'gpt-4o', 'deterministic_grounded')."""
        pass

    @abstractmethod
    def generate_recommendations(self, context: GenerationContext) -> List[Dict[str, Any]]:
        """
        Generates structured, evidence-grounded policy recommendations
        strictly conforming to the CivicIntel Pydantic specification.
        """
        pass
