"""
CivicIntel RAG (Retrieval-Augmented Generation) Core Package.
Provides embedding generation, chunking, and seed knowledge management.
"""

from app.core.rag.chunking import DocumentChunker
from app.core.rag.embeddings import EmbeddingsService, embeddings_service
from app.core.rag.knowledge_seed import CURATED_RAG_DOCUMENTS

__all__ = [
    "EmbeddingsService",
    "embeddings_service",
    "DocumentChunker",
    "CURATED_RAG_DOCUMENTS",
]
