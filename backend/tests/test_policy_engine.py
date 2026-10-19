import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.llm.base import GenerationContext
from app.core.llm.deterministic import DeterministicPolicyProvider
from app.core.llm.factory import get_llm_provider
from app.ml.city_dataset import get_curated_city_by_id
from app.ml.policy_engine import AIPolicyRecommendationEngine
from app.ml.policy_knowledge import (
    VERIFIED_SOURCE_DOCUMENTS,
    get_applicable_schemes_for_sector,
    get_source_document_by_id,
)
from app.models.policy import AIPolicyRecommendation, DevelopmentPolicy
from app.models.user import User
from app.schemas.policy_recommendation import (
    GenerateRecommendationsRequest,
    PolicyRecommendationItem,
    RecommendationActionRequest,
)
from app.services.policy_recommendation_service import (
    generate_city_recommendations,
    get_city_recommendations,
    inspect_recommendation_evidence,
    process_recommendation_action,
)


# ---------------------------------------------------------------------------
# 1. Deterministic Gap Analysis Tests (Stage A)
# ---------------------------------------------------------------------------

def test_deterministic_gap_analysis():
    """
    Validates Stage A deterministic gap analysis.
    Verifies that real indicator gaps are computed and missing info is identified
    before any recommendation is made.
    """
    koraput = get_curated_city_by_id("koraput")
    bhubaneswar = get_curated_city_by_id("bhubaneswar")
    assert koraput is not None
    assert bhubaneswar is not None

    engine = AIPolicyRecommendationEngine()
    gaps = engine._identify_development_gaps(target=koraput, benchmark=bhubaneswar)

    assert len(gaps) >= 3
    doctor_gap = next((g for g in gaps if "doctor" in g["metric_key"]), None)
    assert doctor_gap is not None
    assert doctor_gap["sector"] == "Healthcare"
    assert doctor_gap["target_value"] == 4.8
    assert doctor_gap["benchmark_value"] == 24.2
    assert doctor_gap["gap_percentage"] > 70.0

    # Verify required and missing information lists are explicitly populated
    assert len(doctor_gap["required_information"]) > 0
    assert len(doctor_gap["available_information"]) > 0
    assert len(doctor_gap["missing_information"]) > 0
    assert "specialist vacancy" in doctor_gap["missing_information"][1].lower()


# ---------------------------------------------------------------------------
# 2. Evidence Grounding & Real Source Passages
# ---------------------------------------------------------------------------

def test_evidence_grounding_and_authentic_sources():
    """
    Verifies that recommendations attach authentic government source documents
    and verified statutory schemes rather than hallucinated text.
    """
    koraput = get_curated_city_by_id("koraput")
    engine = AIPolicyRecommendationEngine()

    res = engine.run_pipeline(target_city=koraput)
    assert len(res["recommendations"]) > 0

    for rec in res["recommendations"]:
        # Verify schema compliance
        assert rec["human_review_required"] is True
        assert rec["status"] == "Proposed"
        assert rec["confidence_score"] >= 0.80

        # Verify authentic source documents
        assert len(rec["sources"]) > 0
        for src in rec["sources"]:
            assert src["document_title"] in [d["title"] for d in VERIFIED_SOURCE_DOCUMENTS.values()]
            assert len(src["relevant_passage"]) > 30

        # Verify cost status is explicitly stated and not an arbitrary claim
        assert rec["cost_status"] in [
            "Verified Scheme Budget",
            "Estimated from Standard Schedule of Rates",
            "Requires Feasibility Study",
            "Unsupported / Data Gap",
        ]


# ---------------------------------------------------------------------------
# 3. Budget & Feasibility Constraints Filter
# ---------------------------------------------------------------------------

def test_budget_constraints_filtering():
    """
    Verifies that when a budget ceiling is supplied, the recommendation engine
    respects the financial cap.
    """
    koraput = get_curated_city_by_id("koraput")
    engine = AIPolicyRecommendationEngine()

    # Cap budget at ₹35 Crores
    res_capped = engine.run_pipeline(target_city=koraput, budget_constraint_cr=35.0)
    total_cost = sum(r.get("estimated_cost_cr") or 0.0 for r in res_capped["recommendations"])

    assert total_cost <= 35.0
    assert len(res_capped["recommendations"]) >= 1


# ---------------------------------------------------------------------------
# 4. LLM Provider Abstraction & Fallback
# ---------------------------------------------------------------------------

def test_llm_provider_abstraction():
    """
    Verifies the provider factory returns appropriate provider and gracefully falls back
    to deterministic engine when no external API key is configured.
    """
    provider = get_llm_provider(provider_type="deterministic_fallback")
    assert isinstance(provider, DeterministicPolicyProvider)
    assert "deterministic" in provider.provider_name

    auto_provider = get_llm_provider(provider_type="auto")
    assert auto_provider is not None


# ---------------------------------------------------------------------------
# 5. Government Approval Workflow (Stage C)
# ---------------------------------------------------------------------------

def test_government_approval_workflow_accept(db: Session):
    """
    Stage C: When an authorized official accepts a recommendation,
    it transitions to 'Approved' and creates an active DevelopmentPolicy record.
    """
    admin_user = db.query(User).filter(User.role == "system_admin").first()
    assert admin_user is not None

    req = GenerateRecommendationsRequest(city_id="koraput")
    res = generate_city_recommendations(db, req, current_user=admin_user)
    assert len(res.recommendations) > 0

    first_rec = res.recommendations[0]
    rec_id = first_rec.id

    action_in = RecommendationActionRequest(
        action="accept",
        reviewer_notes="Approved for implementation under DMF high-priority health allocation.",
    )

    updated = process_recommendation_action(
        db, rec_id=rec_id, action_in=action_in, current_user=admin_user
    )

    assert updated["status"] == "Approved"
    assert updated["reviewer_id"] == admin_user.id
    assert "DMF" in updated["reviewer_notes"]

    # Verify that a corresponding DevelopmentPolicy was committed to the city register!
    policy = db.query(DevelopmentPolicy).filter(DevelopmentPolicy.title == first_rec.title).first()
    assert policy is not None
    assert policy.city_id == "koraput"
    assert policy.status == "Approved"
    assert policy.evaluation is not None


def test_government_approval_workflow_reject_and_request_changes(db: Session):
    """
    Tests 'reject' and 'request_changes' workflow actions with modification requests.
    """
    gov_user = db.query(User).filter(User.role == "government_official").first()
    assert gov_user is not None

    req = GenerateRecommendationsRequest(city_id="koraput")
    res = generate_city_recommendations(db, req, current_user=gov_user)
    rec_id = res.recommendations[1].id

    # 1. Request Changes
    change_action = RecommendationActionRequest(
        action="request_changes",
        reviewer_notes="Please revise phasing to include Pottangi block in Year 1.",
        modification_requests=["Include Pottangi block in Year 1", "Increase WSHG equity to 35%"],
    )
    change_res = process_recommendation_action(
        db, rec_id=rec_id, action_in=change_action, current_user=gov_user
    )
    assert change_res["status"] == "Changes Requested"
    assert any("Pottangi" in g for g in change_res["data_gaps"])

    # 2. Reject
    rec_id_3 = res.recommendations[2].id
    reject_action = RecommendationActionRequest(
        action="reject",
        reviewer_notes="Duplicate intervention already funded by state watershed mission.",
    )
    reject_res = process_recommendation_action(
        db, rec_id=rec_id_3, action_in=reject_action, current_user=gov_user
    )
    assert reject_res["status"] == "Rejected"


# ---------------------------------------------------------------------------
# 6. Traceability API ("Why did CivicIntel recommend this?")
# ---------------------------------------------------------------------------

def test_inspect_recommendation_evidence(db: Session):
    """
    Verifies that the traceability inspector returns underlying source citations,
    statutory scheme bases, and remaining data gaps.
    """
    req = GenerateRecommendationsRequest(city_id="koraput")
    res = generate_city_recommendations(db, req)
    rec_id = res.recommendations[0].id

    evidence_dossier = inspect_recommendation_evidence(db, rec_id=rec_id)
    assert evidence_dossier["recommendation_id"] == rec_id
    assert "why_recommended" in evidence_dossier
    why = evidence_dossier["why_recommended"]
    assert len(why["core_problem"]) > 20
    assert len(why["supporting_passages"]) > 0
    assert len(why["applicable_statutory_schemes"]) > 0
    assert "governance_safeguard" in evidence_dossier


# ---------------------------------------------------------------------------
# 7. FastAPI Endpoint Integration Tests
# ---------------------------------------------------------------------------

def test_policy_recommendations_api_endpoints(client: TestClient, gov_headers: dict):
    """
    Tests /api/v1/policy-recommendations endpoints:
    - POST /generate
    - GET /cities/{city_id}
    - GET /{rec_id}/evidence
    - POST /{rec_id}/action (role-gated)
    """
    # 1. POST /generate
    gen_res = client.post(
        "/api/v1/policy-recommendations/generate",
        json={"city_id": "koraput", "budget_constraint_cr": 80.0},
        headers=gov_headers,
    )
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert "recommendations" in gen_data
    assert len(gen_data["recommendations"]) > 0
    rec_id = gen_data["recommendations"][0]["id"]

    # 2. GET /cities/koraput
    list_res = client.get("/api/v1/policy-recommendations/cities/koraput")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert len(list_data) > 0

    # 3. GET /{rec_id}/evidence
    ev_res = client.get(f"/api/v1/policy-recommendations/{rec_id}/evidence")
    assert ev_res.status_code == 200
    ev_data = ev_res.json()
    assert "why_recommended" in ev_data

    # 4. POST /{rec_id}/action (Accept)
    action_res = client.post(
        f"/api/v1/policy-recommendations/{rec_id}/action",
        json={
            "action": "accept",
            "reviewer_notes": "Official sanction under DMF healthcare priority window.",
        },
        headers=gov_headers,
    )
    assert action_res.status_code == 200
    action_data = action_res.json()
    assert action_data["status"] == "Approved"


# ---------------------------------------------------------------------------
# 8. Multi-Provider LLM Routing & Safeguard Tests (Gemini, Groq, NVIDIA, Mistral)
# ---------------------------------------------------------------------------

def test_llm_factory_explicit_routing():
    """
    Verifies that the factory explicitly instantiates each requested provider.
    """
    from app.core.llm.gemini_provider import GeminiProvider
    from app.core.llm.groq_provider import GroqProvider
    from app.core.llm.mistral_provider import MistralProvider
    from app.core.llm.nvidia_provider import NvidiaProvider

    groq = get_llm_provider("groq")
    assert isinstance(groq, GroqProvider)
    assert "groq" in groq.provider_name

    gemini = get_llm_provider("gemini")
    assert isinstance(gemini, GeminiProvider)
    assert "google" in gemini.provider_name

    nvidia = get_llm_provider("nvidia")
    assert isinstance(nvidia, NvidiaProvider)
    assert "nvidia" in nvidia.provider_name

    mistral = get_llm_provider("mistral")
    assert isinstance(mistral, MistralProvider)
    assert "mistral" in mistral.provider_name

    # Check spelling variations (e.g. 'mystaral')
    mystaral = get_llm_provider("mystaral")
    assert isinstance(mystaral, MistralProvider)


def test_llm_auto_routing_priorities(monkeypatch):
    """
    Tests the automatic priority chain:
    Groq -> Gemini -> NVIDIA NIM -> Mistral -> Fallback
    """
    from app.core.config import settings
    from app.core.llm.gemini_provider import GeminiProvider
    from app.core.llm.groq_provider import GroqProvider
    from app.core.llm.mistral_provider import MistralProvider
    from app.core.llm.nvidia_provider import NvidiaProvider

    # 1. When GROQ_API_KEY is present
    monkeypatch.setattr(settings, "LLM_PROVIDER", "auto")
    monkeypatch.setattr(settings, "GROQ_API_KEY", "gsk_test_key_123")
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    monkeypatch.setattr(settings, "NVIDIA_API_KEY", None)
    monkeypatch.setattr(settings, "MISTRAL_API_KEY", None)
    monkeypatch.setattr(settings, "OPENAI_API_KEY", None)
    assert isinstance(get_llm_provider(), GroqProvider)

    # 2. When only GEMINI_API_KEY is present
    monkeypatch.setattr(settings, "GROQ_API_KEY", None)
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "AIzaSy_test_gemini")
    assert isinstance(get_llm_provider(), GeminiProvider)

    # 3. When only NVIDIA_API_KEY is present
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    monkeypatch.setattr(settings, "NVIDIA_API_KEY", "nvapi_test_nvidia")
    assert isinstance(get_llm_provider(), NvidiaProvider)

    # 4. When only MISTRAL_API_KEY is present
    monkeypatch.setattr(settings, "NVIDIA_API_KEY", None)
    monkeypatch.setattr(settings, "MISTRAL_API_KEY", "mistral_test_key")
    assert isinstance(get_llm_provider(), MistralProvider)

    # 5. When no keys are present, falls back safely to DeterministicPolicyProvider
    monkeypatch.setattr(settings, "MISTRAL_API_KEY", None)
    assert isinstance(get_llm_provider(), DeterministicPolicyProvider)


def test_prompt_utils_json_parser():
    """
    Verifies that parse_llm_json_response handles raw JSON, markdown-fenced JSON,
    and dictionary wrapper formats robustly.
    """
    from app.core.llm.prompt_utils import parse_llm_json_response

    # 1. Direct JSON array
    raw_array = '[{"title": "Test Rec 1", "proposed_intervention": "Intervention 1"}]'
    parsed = parse_llm_json_response(raw_array)
    assert len(parsed) == 1
    assert parsed[0]["title"] == "Test Rec 1"

    # 2. Markdown fenced ```json ... ```
    raw_fenced = '```json\n[{"title": "Fenced Rec", "proposed_intervention": "Intervention 2"}]\n```'
    parsed_fenced = parse_llm_json_response(raw_fenced)
    assert len(parsed_fenced) == 1
    assert parsed_fenced[0]["title"] == "Fenced Rec"

    # 3. Object with "recommendations" key
    raw_obj = '{"recommendations": [{"title": "Wrapped Rec", "proposed_intervention": "Intervention 3"}]}'
    parsed_obj = parse_llm_json_response(raw_obj)
    assert len(parsed_obj) == 1
    assert parsed_obj[0]["title"] == "Wrapped Rec"

    # 4. Malformed/empty input does not raise exception
    assert parse_llm_json_response("") == []
    assert parse_llm_json_response("This is not JSON at all") == []


def test_all_providers_fallback_when_keys_missing():
    """
    Verifies that calling generate_recommendations on any provider without an API key
    gracefully defaults to the deterministic engine without throwing errors.
    """
    from app.core.llm.gemini_provider import GeminiProvider
    from app.core.llm.groq_provider import GroqProvider
    from app.core.llm.mistral_provider import MistralProvider
    from app.core.llm.nvidia_provider import NvidiaProvider

    koraput = get_curated_city_by_id("koraput")
    bhubaneswar = get_curated_city_by_id("bhubaneswar")
    engine = AIPolicyRecommendationEngine()
    gaps = engine._identify_development_gaps(target=koraput, benchmark=bhubaneswar)

    context = GenerationContext(
        target_city=koraput,
        benchmark_city=bhubaneswar,
        similarity_score=0.74,
        identified_gaps=gaps,
        applicable_schemes=[],
        supporting_documents=[],
    )

    providers = [
        GroqProvider(api_key=""),
        GeminiProvider(api_key=""),
        NvidiaProvider(api_key=""),
        MistralProvider(api_key=""),
    ]

    for p in providers:
        recs = p.generate_recommendations(context)
        assert isinstance(recs, list)
        assert len(recs) > 0  # Fallback produces high-quality grounded recommendations


def test_provider_status_api_endpoint(client: TestClient):
    """
    Tests GET /api/v1/policy-recommendations/providers/status
    """
    res = client.get("/api/v1/policy-recommendations/providers/status")
    assert res.status_code == 200
    data = res.json()
    assert "active_provider" in data
    assert "available_keys" in data
    assert "groq" in data["available_keys"]
    assert "gemini" in data["available_keys"]
    assert "nvidia" in data["available_keys"]
    assert "mistral" in data["available_keys"]

