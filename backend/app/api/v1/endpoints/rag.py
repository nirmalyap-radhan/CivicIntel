"""
CivicIntel RAG REST Endpoints.
Provides semantic retrieval over Indian government documents and schemes,
document ingestion, and statutory citation inspection.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import RoleChecker, get_current_user, get_optional_current_user
from app.models.user import User
from app.schemas.rag import (
    GraphEdgeInfo,
    GraphNodeInfo,
    RAGDocumentCreate,
    RAGDocumentDetailResponse,
    RAGDocumentResponse,
    RAGGraphTopologyResponse,
    RAGQueryRequest,
    RAGQueryResponse,
    RAGRetrievalResultItem,
)
from app.services.rag_service import (
    get_all_documents,
    get_document_by_id,
    ingest_document,
    retrieve_relevant_chunks,
    seed_curated_documents,
)

router = APIRouter()


@router.get("/graph/topology", response_model=RAGGraphTopologyResponse)
def get_rag_graph_topology_endpoint():
    """
    Returns the compiled LangGraph Corrective Self-RAG StateGraph architecture topology,
    including node responsibilities, conditional evaluation edges, query rewrite routing,
    and LangChain retriever/embeddings adapters.
    """
    nodes = [
        GraphNodeInfo(
            name="node_stage_a_gap_analysis",
            stage="Stage A: Deterministic Gap Analysis",
            description="Identifies quantitative civic and infrastructure deficits using deterministic benchmarks prior to LLM invocation.",
        ),
        GraphNodeInfo(
            name="node_rag_retrieval",
            stage="LangChain RAG Retrieval",
            description="Retrieves evidence passages from Supabase PostgreSQL pgvector using CivicIntelPGVectorRetriever (BaseRetriever).",
        ),
        GraphNodeInfo(
            name="node_grade_evidence",
            stage="Corrective Self-RAG Evaluation",
            description="Evaluates retrieved passages for statutory relevance, semantic alignment, and domain completeness.",
        ),
        GraphNodeInfo(
            name="node_rewrite_query",
            stage="Adaptive Query Rewriting",
            description="Expands query vocabulary with administrative terminology and statutory keywords when relevance is insufficient.",
        ),
        GraphNodeInfo(
            name="node_stage_b_formulate_policy",
            stage="Stage B: Policy Synthesis",
            description="Formulates evidence-grounded policy recommendations with authentic citations and budget constraints.",
        ),
        GraphNodeInfo(
            name="node_enforce_safeguards",
            stage="Stage C Safeguards & Validation Gate",
            description="Enforces zero-hallucination constraints, validates Pydantic schemas, and marks proposals for human official approval.",
        ),
    ]

    edges = [
        GraphEdgeInfo(source="__start__", target="node_stage_a_gap_analysis", type="direct"),
        GraphEdgeInfo(source="node_stage_a_gap_analysis", target="node_rag_retrieval", type="direct"),
        GraphEdgeInfo(source="node_rag_retrieval", target="node_grade_evidence", type="direct"),
        GraphEdgeInfo(
            source="node_grade_evidence",
            target="node_rewrite_query",
            type="conditional",
            condition="should_rewrite_query: evidence_grade == 'needs_rewrite' and rewrite_count < 1",
        ),
        GraphEdgeInfo(
            source="node_grade_evidence",
            target="node_stage_b_formulate_policy",
            type="conditional",
            condition="should_rewrite_query: evidence_grade == 'adequate' or rewrite_count >= 1",
        ),
        GraphEdgeInfo(source="node_rewrite_query", target="node_rag_retrieval", type="direct"),
        GraphEdgeInfo(source="node_stage_b_formulate_policy", target="node_enforce_safeguards", type="direct"),
        GraphEdgeInfo(source="node_enforce_safeguards", target="__end__", type="direct"),
    ]

    state_schema = [
        "target_city",
        "benchmark_city",
        "prioritized_sectors",
        "budget_constraint_cr",
        "require_verified_schemes",
        "deterministic_gaps",
        "retrieved_documents",
        "evidence_grade",
        "rewrite_count",
        "query_rewrites",
        "raw_recommendations",
        "validated_recommendations",
        "safeguards_summary",
        "workflow_stage",
        "current_node",
    ]

    return RAGGraphTopologyResponse(
        framework="LangChain + LangGraph",
        graph_type="Corrective Self-RAG StateGraph",
        version="1.0.0",
        is_compiled=True,
        embeddings_adapter="app.core.rag.embeddings.EmbeddingsService (LangChain Embeddings)",
        retriever_adapter="app.core.rag.langchain_retriever.CivicIntelPGVectorRetriever (LangChain BaseRetriever)",
        nodes=nodes,
        edges=edges,
        state_schema=state_schema,
    )



@router.post("/query", response_model=RAGQueryResponse)
def query_rag_knowledge_endpoint(
    request: RAGQueryRequest,
    db: Session = Depends(get_db),
):
    """
    Executes semantic vector retrieval against the indexed government knowledge base.
    Uses PostgreSQL pgvector cosine similarity to retrieve evidence-grounded passages.
    Preserves authoritative statutory citations and provenance.
    """
    results = retrieve_relevant_chunks(
        db,
        query=request.query,
        sector=request.sector,
        city_or_region=request.city_or_region,
        verification_status=request.verification_status,
        top_k=request.top_k,
        min_similarity=request.min_similarity,
    )
    return RAGQueryResponse(
        query=request.query,
        sector_filter=request.sector,
        region_filter=request.city_or_region,
        total_chunks_matched=len(results),
        results=results,
    )


@router.get("/documents", response_model=List[RAGDocumentResponse])
def list_rag_documents_endpoint(
    sector: Optional[str] = Query(None, description="Optional sector filter (Healthcare, Economy, etc.)"),
    region: Optional[str] = Query(None, description="Optional region filter (Koraput, Odisha, etc.)"),
    verification_status: Optional[str] = Query(None, description="Optional verification filter"),
    db: Session = Depends(get_db),
):
    """
    Lists all indexed government documents with their publishing organizations,
    publication dates, and chunk counts.
    """
    return get_all_documents(
        db,
        sector=sector,
        city_or_region=region,
        verification_status=verification_status,
    )


@router.get("/documents/{doc_id}", response_model=RAGDocumentDetailResponse)
def get_single_rag_document_endpoint(
    doc_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves full details of a government document including its indexed chunk passages.
    """
    doc = get_document_by_id(db, doc_id=doc_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID '{doc_id}' not found in RAG knowledge base.",
        )
    return doc


@router.post("/documents", response_model=RAGDocumentResponse, status_code=status.HTTP_201_CREATED)
def ingest_new_rag_document_endpoint(
    doc_in: RAGDocumentCreate,
    current_user: User = Depends(RoleChecker(["government_official", "system_admin"])),
    db: Session = Depends(get_db),
):
    """
    Ingests an official government scheme, gazette, or audit document into the RAG repository.
    Automatically segments content into semantic chunks and computes 1024-d pgvector embeddings.
    Restricted to authorized government officials and system administrators.
    """
    created_doc = ingest_document(db, doc_in)
    return created_doc


@router.post("/seed", response_model=Dict[str, Any])
def seed_rag_repository_endpoint(
    force: bool = Query(False, description="Whether to re-seed even if documents exist"),
    current_user: User = Depends(RoleChecker(["system_admin"])),
    db: Session = Depends(get_db),
):
    """
    Seeds the verified repository of Indian statutory schemes and audit documents
    (DMF Trust Audit, NHM MMU guidelines, JJM hill rules, Odisha Millets Mission, etc.).
    """
    count = seed_curated_documents(db, force=force)
    return {
        "status": "success",
        "message": f"Successfully processed seed for {count} government documents.",
        "documents_count": count,
    }
