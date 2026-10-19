"""
SQLAlchemy models for CivicIntel RAG (Retrieval-Augmented Generation).
Stores Indian government scheme documents, gazettes, policy frameworks,
and pgvector embeddings for evidence-linked policy synthesis.
"""

from datetime import datetime, timezone
from pgvector.sqlalchemy import Vector
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid, get_utc_now


class RAGDocument(Base, TimestampMixin):
    """
    Authoritative Government Document metadata record.
    Tracks provenance, statutory verification status, and administrative scope.
    """
    __tablename__ = "rag_documents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    
    # 8 Required Fields specified in CivicIntel Civic Architecture:
    document_title = Column(String(256), nullable=False, index=True)
    publishing_organization = Column(String(256), nullable=False, index=True)
    publication_date = Column(Date, nullable=False, index=True)
    source_url_or_reference = Column(String(512), nullable=False)
    applicable_city_or_region = Column(String(128), nullable=False, index=True)
    relevant_sector = Column(String(64), nullable=False, index=True)  # Healthcare, Economy, Water, etc.
    document_version = Column(String(64), nullable=False, default="1.0")
    verification_status = Column(
        String(64),
        nullable=False,
        default="Verified Statutory",
        index=True
    )  # 'Verified Statutory', 'Official Gazette', 'Audit Sanctioned', 'Draft / Review'

    # Extended Civic Provenance
    authority_level = Column(String(64), nullable=False, default="National Statutory")
    document_type = Column(String(64), nullable=False, default="Operational Guidelines")
    summary = Column(Text, nullable=True)
    raw_content = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    chunks = relationship(
        "RAGDocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
        order_by="RAGDocumentChunk.chunk_index"
    )

    def __repr__(self) -> str:
        return f"<RAGDocument {self.document_title} ({self.relevant_sector})>"


class RAGDocumentChunk(Base, TimestampMixin):
    """
    Vector-indexed text chunk from a government document.
    Indexed using PostgreSQL pgvector (1024 dimensions) for cosine semantic search.
    """
    __tablename__ = "rag_document_chunks"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    document_id = Column(String(64), ForeignKey("rag_documents.id", ondelete="CASCADE"), nullable=False, index=True)
    
    chunk_index = Column(Integer, nullable=False, index=True)
    chunk_text = Column(Text, nullable=False)
    section_heading = Column(String(256), nullable=True)
    page_or_paragraph = Column(String(64), nullable=True)
    token_count = Column(Integer, nullable=False, default=0)

    # 1024-dimensional vector embedding (native pgvector in PostgreSQL)
    embedding = Column(Vector(1024), nullable=True)

    # Relationship
    document = relationship("RAGDocument", back_populates="chunks")

    def __repr__(self) -> str:
        return f"<RAGDocumentChunk doc={self.document_id} idx={self.chunk_index}>"
