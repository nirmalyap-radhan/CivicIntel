"""
Pydantic schemas for CivicIntel RAG (Retrieval-Augmented Generation).
Covers document ingestion, pgvector semantic search, and evidence citation preservation.
"""

from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class RAGDocumentBase(BaseModel):
    # 8 Required Fields specified in Civic Architecture
    document_title: str = Field(..., description="Official title of government document")
    publishing_organization: str = Field(..., description="Issuing ministry, department, or administrative board")
    publication_date: date = Field(..., description="Official publication date (YYYY-MM-DD)")
    source_url_or_reference: str = Field(..., description="Official gazette URL, order number, or statutory reference")
    applicable_city_or_region: str = Field(..., description="Target geographic jurisdiction (e.g. Koraput, Odisha, National)")
    relevant_sector: str = Field(..., description="Sector taxonomy (Healthcare, Economy, Water, Infrastructure, etc.)")
    document_version: str = Field("1.0", description="Document edition or version (e.g. v2024.1, Audit 2024-25)")
    verification_status: str = Field(
        "Verified Statutory",
        description="Verification tier: 'Verified Statutory', 'Official Gazette', 'Audit Sanctioned', 'Draft / Review'"
    )

    authority_level: str = Field("National Statutory", description="Authority tier: National Statutory, State Ministry, District Authority")
    document_type: str = Field("Operational Guidelines", description="Type: Operational Guidelines, Audit Report, Gazette, Mission Framework")
    summary: Optional[str] = Field(None, description="Executive summary of policy or scheme")


class RAGDocumentCreate(RAGDocumentBase):
    raw_content: str = Field(..., min_length=50, description="Full text or statutory excerpts to chunk and embed")
    chunk_size: Optional[int] = Field(500, description="Target character length per chunk")
    chunk_overlap: Optional[int] = Field(80, description="Character overlap between consecutive chunks")


class RAGDocumentChunkItem(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    chunk_text: str
    section_heading: Optional[str] = None
    page_or_paragraph: Optional[str] = None
    token_count: int

    model_config = ConfigDict(from_attributes=True)


class RAGDocumentResponse(RAGDocumentBase):
    id: str
    is_active: bool
    created_at: datetime
    chunk_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class RAGDocumentDetailResponse(RAGDocumentResponse):
    chunks: List[RAGDocumentChunkItem] = Field(default_factory=list)


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Search term, gap description, or policy question")
    sector: Optional[str] = Field(None, description="Optional sector filter (Healthcare, Economy, etc.)")
    city_or_region: Optional[str] = Field(None, description="Optional region filter (Koraput, Odisha, National)")
    verification_status: Optional[str] = Field(None, description="Filter for verification tier")
    top_k: int = Field(5, ge=1, le=20, description="Maximum number of relevant chunks to retrieve")
    min_similarity: float = Field(0.35, ge=0.0, le=1.0, description="Minimum cosine similarity cutoff")


class RAGRetrievalResultItem(BaseModel):
    chunk_id: str
    document_id: str
    document_title: str
    publishing_organization: str
    publication_date: str
    source_url_or_reference: str
    applicable_city_or_region: str
    relevant_sector: str
    document_version: str
    verification_status: str
    authority_level: str
    section_heading: Optional[str] = None
    chunk_text: str
    similarity_score: float
    citation_reference: str

    model_config = ConfigDict(from_attributes=True)


class RAGQueryResponse(BaseModel):
    query: str
    sector_filter: Optional[str] = None
    region_filter: Optional[str] = None
    total_chunks_matched: int
    results: List[RAGRetrievalResultItem]


class GraphNodeInfo(BaseModel):
    name: str
    stage: str
    description: str


class GraphEdgeInfo(BaseModel):
    source: str
    target: str
    type: str  # "direct" | "conditional"
    condition: Optional[str] = None


class RAGGraphTopologyResponse(BaseModel):
    framework: str = "LangChain + LangGraph"
    graph_type: str = "Corrective Self-RAG StateGraph"
    version: str = "1.0.0"
    is_compiled: bool = True
    embeddings_adapter: str = "app.core.rag.embeddings.EmbeddingsService (LangChain Embeddings)"
    retriever_adapter: str = "app.core.rag.langchain_retriever.CivicIntelPGVectorRetriever (LangChain BaseRetriever)"
    nodes: List[GraphNodeInfo]
    edges: List[GraphEdgeInfo]
    state_schema: List[str]

