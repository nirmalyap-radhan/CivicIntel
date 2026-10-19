"""
Embeddings Service for CivicIntel RAG.
Produces 1024-dimensional unit-normalized semantic embeddings.
Utilizes Mistral mistral-embed via direct REST API with automatic deterministic fallback.
"""

import logging
import time
from typing import List, Optional
import httpx
import numpy as np
from langchain_core.embeddings import Embeddings
from sklearn.feature_extraction.text import HashingVectorizer

from app.core.config import settings

logger = logging.getLogger(__name__)

EMBEDDING_DIM = 1024


class EmbeddingsService(Embeddings):
    """
    Produces dense 1024-dimensional embeddings compatible with PostgreSQL pgvector
    and LangChain VectorStore ecosystems.
    Prioritizes active Mistral API key; falls back smoothly to deterministic normalized hashing.
    Includes a 60-second circuit breaker cooldown on HTTP 429 rate limits.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or getattr(settings, "MISTRAL_API_KEY", None)
        self._cooldown_until = 0.0
        self.offline_vectorizer = HashingVectorizer(
            n_features=EMBEDDING_DIM,
            norm="l2",
            alternate_sign=False,
            ngram_range=(1, 2),
        )

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """LangChain Embeddings interface method for batch documents."""
        return self.embed_texts(texts)

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Embeds a batch of texts into 1024-dimensional float vectors.
        """
        if not texts:
            return []

        # In testing mode, bypass network calls to ensure deterministic embeddings across all test runs
        from app.core.config import settings
        if getattr(settings, "TESTING", False):
            return self._embed_offline(texts)

        now = time.time()

        # 1. Try Mistral Embeddings API if key is present and not in cooldown
        if self.api_key and now >= self._cooldown_until:
            try:
                url = "https://api.mistral.ai/v1/embeddings"
                headers = {
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                }
                payload = {
                    "model": "mistral-embed",
                    "input": texts[:32],  # batch limit
                }
                with httpx.Client(timeout=8.0) as client:
                    resp = client.post(url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        embeddings = [item["embedding"] for item in data.get("data", [])]
                        if len(embeddings) == len(texts[:32]):
                            if len(texts) > 32:
                                rest = self.embed_texts(texts[32:])
                                return embeddings + rest
                            return embeddings
                    elif resp.status_code == 429:
                        self._cooldown_until = now + 60.0
                        logger.warning("[Embeddings] Mistral rate limited (429). Activating 60s cooldown for instant fallback.")
                    else:
                        logger.warning(f"[Embeddings] Mistral returned HTTP {resp.status_code}: {resp.text[:120]}")
            except Exception as e:
                self._cooldown_until = now + 30.0
                logger.warning(f"[Embeddings] Mistral embed call failed: {e}. Utilizing deterministic fallback.")

        # 2. Deterministic high-precision offline embedding fallback
        return self._embed_offline(texts)


    def embed_query(self, text: str) -> List[float]:
        """Embeds a single query string into a 1024-d float vector."""
        res = self.embed_texts([text])
        return res[0] if res else [0.0] * EMBEDDING_DIM

    def _embed_offline(self, texts: List[str]) -> List[List[float]]:
        """
        Generates 1024-dimensional normalized dense vectors using scikit-learn feature hashing.
        Guarantees deterministic, reproducible vector generation with zero network overhead.
        """
        clean_texts = [t.strip() if t and t.strip() else "civic text" for t in texts]
        matrix = self.offline_vectorizer.transform(clean_texts).toarray()
        
        # Ensure exact unit norm
        result: List[List[float]] = []
        for row in matrix:
            norm = np.linalg.norm(row)
            if norm > 0:
                normalized = (row / norm).tolist()
            else:
                row[0] = 1.0
                normalized = row.tolist()
            result.append(normalized)

        return result


# Singleton instance
embeddings_service = EmbeddingsService()
