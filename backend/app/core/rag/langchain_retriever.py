"""
LangChain BaseRetriever adapter for CivicIntel.
Wraps PostgreSQL pgvector semantic retrieval and returns standard LangChain Document objects
with full statutory metadata and citation preservation.
"""

from typing import Any, List, Optional
from langchain_core.callbacks import CallbackManagerForRetrieverRun
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pydantic import Field
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services.rag_service import retrieve_relevant_chunks


class CivicIntelPGVectorRetriever(BaseRetriever):
    """
    LangChain BaseRetriever adapter connecting directly to PostgreSQL pgvector.
    Produces LangChain Document instances containing verbatim statutory clauses and citations.
    """
    sector: Optional[str] = Field(None, description="Sector taxonomy filter (Healthcare, Economy, etc.)")
    city_or_region: Optional[str] = Field(None, description="Geographic jurisdiction filter (Koraput, Odisha, etc.)")
    verification_status: Optional[str] = Field(None, description="Statutory verification status filter")
    top_k: int = Field(5, description="Max number of relevant passages to retrieve")
    min_similarity: float = Field(0.35, description="Minimum cosine similarity cutoff")

    def _get_relevant_documents(
        self, query: str, *, run_manager: Optional[CallbackManagerForRetrieverRun] = None
    ) -> List[Document]:
        """
        Retrieves relevant statutory chunks from pgvector and converts to LangChain Document format.
        """
        with SessionLocal() as db:
            hits = retrieve_relevant_chunks(
                db=db,
                query=query,
                sector=self.sector,
                city_or_region=self.city_or_region,
                verification_status=self.verification_status,
                top_k=self.top_k,
                min_similarity=self.min_similarity,
            )

        documents: List[Document] = []
        for hit in hits:
            doc = Document(
                page_content=hit.chunk_text,
                metadata={
                    "chunk_id": hit.chunk_id,
                    "document_id": hit.document_id,
                    "document_title": hit.document_title,
                    "publishing_organization": hit.publishing_organization,
                    "publication_date": hit.publication_date,
                    "source_url_or_reference": hit.source_url_or_reference,
                    "applicable_city_or_region": hit.applicable_city_or_region,
                    "relevant_sector": hit.relevant_sector,
                    "document_version": hit.document_version,
                    "verification_status": hit.verification_status,
                    "authority_level": hit.authority_level,
                    "section_heading": hit.section_heading,
                    "similarity_score": hit.similarity_score,
                    "citation_reference": hit.citation_reference,
                },
            )
            documents.append(doc)

        return documents
