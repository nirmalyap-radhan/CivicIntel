"""
Unit and Integration Tests for CivicIntel RAG (Retrieval-Augmented Generation).
Validates text chunking, 1024-d embedding generation, pgvector semantic search,
preservation of statutory citations, metadata filtering, and API endpoints.
"""

from datetime import date
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.rag.chunking import DocumentChunker
from app.core.rag.embeddings import embeddings_service
from app.ml.city_dataset import get_curated_city_by_id
from app.ml.policy_engine import AIPolicyRecommendationEngine
from app.models.rag import RAGDocument, RAGDocumentChunk
from app.models.user import User
from app.schemas.rag import RAGDocumentCreate
from app.services.rag_service import (
    get_all_documents,
    get_document_by_id,
    ingest_document,
    retrieve_relevant_chunks,
    seed_curated_documents,
)
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from app.core.rag.langchain_retriever import CivicIntelPGVectorRetriever
from app.ml.policy_graph import civic_policy_langgraph, PolicyGraphState



# ---------------------------------------------------------------------------
# 1. Chunking & Preprocessing Tests
# ---------------------------------------------------------------------------

def test_document_chunker():
    """
    Verifies that DocumentChunker cleanly splits document text into semantic passages,
    detects section headings, and retains hierarchical context.
    """
    sample_text = """
    Section 1: Healthcare Infrastructure in Schedule V Areas
    The district requires deployment of primary health sub-centres with solar power backup.
    All medical officers must be provided with satellite communication telemetry devices.

    Section 2: Emergency Response Fleet Norms
    Each mobile medical unit must have a 4x4 ruggedized chassis to traverse highland slopes.
    Point-of-care rapid testing kits must be replenished on a biweekly cycle.
    """
    chunker = DocumentChunker(target_chunk_size=150, chunk_overlap=30)
    chunks = chunker.chunk_document(sample_text)

    assert len(chunks) >= 2
    for c in chunks:
        assert "chunk_index" in c
        assert "chunk_text" in c
        assert len(c["chunk_text"]) > 20
        assert c["token_count"] > 0
        assert "section_heading" in c


# ---------------------------------------------------------------------------
# 2. Embeddings Service Tests
# ---------------------------------------------------------------------------

def test_embeddings_service_dimension_and_norm():
    """
    Verifies that embeddings_service generates 1024-dimensional normalized vectors
    suitable for PostgreSQL pgvector cosine distance operations.
    """
    texts = [
        "District Mineral Foundation high priority healthcare funding",
        "Jal Jeevan Mission gravity spring drinking water tap connection",
    ]
    vectors = embeddings_service.embed_texts(texts)

    assert len(vectors) == 2
    for vec in vectors:
        assert len(vec) == 1024
        # Verify unit Euclidean length (L2 norm ~ 1.0)
        norm_sq = sum(x * x for x in vec)
        assert abs(norm_sq - 1.0) < 0.05

    query_vec = embeddings_service.embed_query("mobile health unit")
    assert len(query_vec) == 1024


# ---------------------------------------------------------------------------
# 3. Document Ingestion & Required Metadata Verification
# ---------------------------------------------------------------------------

def test_rag_document_ingestion_and_metadata(db: Session):
    """
    Verifies that document ingestion records all 8 mandatory metadata fields:
    - Document title
    - Publishing organization
    - Publication date
    - Source URL or reference
    - Applicable city or region
    - Relevant sector
    - Document version
    - Verification status
    """
    doc_create = RAGDocumentCreate(
        document_title="Odisha Tribal Telemedicine Grid Directive 2025",
        publishing_organization="Department of Health & Family Welfare, Govt of Odisha",
        publication_date=date(2025, 1, 15),
        source_url_or_reference="https://health.odisha.gov.in/gazette/telemedicine-2025.pdf",
        applicable_city_or_region="Koraput",
        relevant_sector="Healthcare",
        document_version="v2025.1",
        verification_status="Verified Statutory",
        authority_level="State Ministry",
        document_type="Gazette Notification",
        summary="Mandating 24/7 tele-consultation uplink from tribal sub-centres to medical colleges.",
        raw_content="""
        Section 1: Mandatory Satellite Connectivity
        Every primary health centre in Koraput, Malkangiri, and Rayagada shall be equipped with ISRO satellite broadband.
        Section 2: Specialist Tele-Rounds
        SLN Medical College shall conduct twice-weekly specialist pediatric and obstetric rounds via high-definition video link.
        """,
    )

    doc = ingest_document(db, doc_create)

    assert doc.id.startswith("doc_")
    assert doc.document_title == "Odisha Tribal Telemedicine Grid Directive 2025"
    assert doc.publishing_organization == "Department of Health & Family Welfare, Govt of Odisha"
    assert doc.publication_date == date(2025, 1, 15)
    assert doc.source_url_or_reference == "https://health.odisha.gov.in/gazette/telemedicine-2025.pdf"
    assert doc.applicable_city_or_region == "Koraput"
    assert doc.relevant_sector == "Healthcare"
    assert doc.document_version == "v2025.1"
    assert doc.verification_status == "Verified Statutory"

    # Verify chunks are stored with 1024-d embeddings
    chunks = db.query(RAGDocumentChunk).filter(RAGDocumentChunk.document_id == doc.id).all()
    assert len(chunks) >= 1
    for chk in chunks:
        assert chk.embedding is not None
        assert len(chk.embedding) == 1024


# ---------------------------------------------------------------------------
# 4. Semantic Vector Retrieval & Citation Preservation
# ---------------------------------------------------------------------------

def test_rag_semantic_retrieval_and_citations(db: Session):
    """
    Tests vector search over government schemes and verifies that statutory citations
    to original materials are preserved.
    """
    # Seed authentic repository
    seed_curated_documents(db, force=False)

    results = retrieve_relevant_chunks(
        db,
        query="mobile medical units doctor hardship allowance remote habitations",
        sector="Healthcare",
        city_or_region="Koraput",
        top_k=3,
        min_similarity=0.30,
    )

    assert len(results) > 0
    top_hit = results[0]

    # Verify statutory metadata and citation preservation
    assert top_hit.relevant_sector == "Healthcare"
    assert len(top_hit.document_title) > 0
    assert len(top_hit.publishing_organization) > 0
    assert len(top_hit.source_url_or_reference) > 0
    assert len(top_hit.citation_reference) > 0
    assert top_hit.similarity_score > 0.30
    assert "District Mineral Foundation" in top_hit.document_title or "National Health Mission" in top_hit.document_title


# ---------------------------------------------------------------------------
# 5. Metadata Filtering (Sector & Region)
# ---------------------------------------------------------------------------

def test_rag_metadata_filtering(db: Session):
    """
    Verifies that RAG retrieval respects sector and region constraints.
    """
    seed_curated_documents(db, force=False)

    # Water query
    water_results = retrieve_relevant_chunks(
        db,
        query="gravity spring tap water 55 lpcd pipeline",
        sector="Water & Sanitation",
        top_k=2,
    )
    assert len(water_results) > 0
    assert "Jal Jeevan Mission" in water_results[0].document_title

    # Livelihoods query
    livelihood_results = retrieve_relevant_chunks(
        db,
        query="organic Arabica shade grown coffee GI tag hulling unit",
        sector="Economy & Livelihoods",
        top_k=2,
    )
    assert len(livelihood_results) > 0
    assert "Coffee" in livelihood_results[0].document_title or "Millets" in livelihood_results[0].document_title


# ---------------------------------------------------------------------------
# 6. Policy Engine RAG Integration
# ---------------------------------------------------------------------------

def test_policy_engine_rag_integration(db: Session):
    """
    Verifies that the central AIPolicyRecommendationEngine integrates dynamic
    RAG evidence retrieval into its 8-step pipeline.
    """
    koraput = get_curated_city_by_id("koraput")
    engine = AIPolicyRecommendationEngine()

    res = engine.run_pipeline(target_city=koraput, db=db)

    assert res["safeguards_summary"]["rag_retrieval_active"] is True
    assert res["safeguards_summary"]["pgvector_indexed"] is True
    assert len(res["recommendations"]) > 0

    # Ensure evidence citations are attached to recommendations
    for rec in res["recommendations"]:
        assert len(rec["sources"]) > 0
        for src in rec["sources"]:
            assert len(src["relevant_passage"]) > 20
            assert len(src["citation_reference"]) > 0


# ---------------------------------------------------------------------------
# 7. RAG REST API Endpoints
# ---------------------------------------------------------------------------

def test_rag_api_endpoints(client: TestClient, admin_headers: dict):
    """
    Tests RAG REST API endpoints:
    - GET /api/v1/rag/documents
    - GET /api/v1/rag/documents/{id}
    - POST /api/v1/rag/query
    - POST /api/v1/rag/documents (role-protected)
    """
    # 1. GET /api/v1/rag/documents
    list_res = client.get("/api/v1/rag/documents")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert len(docs) > 0
    doc_id = docs[0]["id"]

    # 2. GET /api/v1/rag/documents/{id}
    detail_res = client.get(f"/api/v1/rag/documents/{doc_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["id"] == doc_id
    assert "chunks" in detail
    assert len(detail["chunks"]) > 0

    # 3. POST /api/v1/rag/query
    query_res = client.post(
        "/api/v1/rag/query",
        json={
            "query": "mobile telemedicine clinics and specialist retainers",
            "sector": "Healthcare",
            "top_k": 3,
        },
    )
    assert query_res.status_code == 200
    q_data = query_res.json()
    assert q_data["total_chunks_matched"] > 0
    assert len(q_data["results"]) > 0
    assert "similarity_score" in q_data["results"][0]

    # 4. POST /api/v1/rag/documents (Authorized)
    create_payload = {
        "document_title": "Koraput Water Security Action Plan 2025",
        "publishing_organization": "District Water and Sanitation Mission, Koraput",
        "publication_date": "2025-02-10",
        "source_url_or_reference": "https://koraput.nic.in/water-security-2025.pdf",
        "applicable_city_or_region": "Koraput",
        "relevant_sector": "Water & Sanitation",
        "document_version": "1.0",
        "verification_status": "Verified Statutory",
        "authority_level": "District Authority",
        "document_type": "Action Plan",
        "summary": "Hydrological recharge and spring rejuvenation for 48 mountain streams.",
        "raw_content": """
        Section 1: Mountain Spring Hydrology
        Spring discharge surveys conducted in March 2025 identify 48 perennial mountain springs.
        Section 2: Paani Samiti Community Management
        100% of solar pumping systems shall be handed over to women-led Paani Samitis.
        """,
    }
    create_res = client.post("/api/v1/rag/documents", json=create_payload, headers=admin_headers)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["document_title"] == "Koraput Water Security Action Plan 2025"


# ---------------------------------------------------------------------------
# 8. LangChain & LangGraph Orchestration Tests
# ---------------------------------------------------------------------------

def test_langchain_pgvector_retriever(db: Session):
    """
    Verifies that CivicIntelPGVectorRetriever adheres to LangChain's BaseRetriever
    interface, producing langchain_core.documents.Document instances with full
    statutory metadata.
    """
    seed_curated_documents(db, force=False)
    retriever = CivicIntelPGVectorRetriever(
        db=db,
        sector="Healthcare",
        city_or_region="Koraput",
        top_k=3,
        min_similarity=0.30,
    )
    assert isinstance(retriever, BaseRetriever)

    # LangChain standard invocation
    docs = retriever.invoke("District Mineral Foundation healthcare priority")
    assert isinstance(docs, list)
    assert len(docs) > 0
    top_doc = docs[0]
    assert isinstance(top_doc, Document)
    assert len(top_doc.page_content) > 20
    assert "document_title" in top_doc.metadata
    assert "source_url_or_reference" in top_doc.metadata
    assert "citation_reference" in top_doc.metadata


def test_langgraph_corrective_rag_execution(db: Session):
    """
    Verifies end-to-end execution of the LangGraph StateGraph workflow:
    Gap Analysis -> LangChain RAG Retrieval -> Evidence Grading -> Policy Formulation -> Safeguards.
    """
    koraput = get_curated_city_by_id("koraput")
    initial_state = {
        "target_city": koraput,
        "benchmark_city": None,
        "prioritized_sectors": ["Healthcare"],
        "budget_constraint_cr": 50.0,
        "require_verified_schemes": True,
        "deterministic_gaps": [],
        "retrieved_documents": [],
        "evidence_grade": "adequate",
        "rewrite_count": 0,
        "query_rewrites": [],
        "raw_recommendations": [],
        "validated_recommendations": [],
        "safeguards_summary": {},
        "workflow_stage": "initialized",
        "current_node": "START",
    }

    final_state = civic_policy_langgraph.invoke(initial_state)

    assert final_state["workflow_stage"] == "stage_c_human_review"
    assert final_state["current_node"] == "node_enforce_safeguards"
    assert len(final_state["deterministic_gaps"]) > 0
    assert len(final_state["retrieved_documents"]) > 0
    assert final_state["evidence_grade"] in ("adequate", "needs_rewrite")
    assert len(final_state["validated_recommendations"]) > 0

    safeguards = final_state["safeguards_summary"]
    assert safeguards["langgraph_orchestrated"] is True
    assert safeguards["langchain_retriever_active"] is True
    assert safeguards["human_approval_mandatory"] is True


def test_langgraph_topology_api_endpoint(client: TestClient):
    """
    Tests GET /api/v1/rag/graph/topology to ensure the architecture description
    is accurately exposed for inspection.
    """
    res = client.get("/api/v1/rag/graph/topology")
    assert res.status_code == 200
    data = res.json()
    assert data["framework"] == "LangChain + LangGraph"
    assert data["graph_type"] == "Corrective Self-RAG StateGraph"
    assert data["is_compiled"] is True
    assert len(data["nodes"]) == 6
    assert any(n["name"] == "node_grade_evidence" for n in data["nodes"])
    assert any(e["condition"] is not None for e in data["edges"])

