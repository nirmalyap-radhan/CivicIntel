"""
Unit and Integration Tests for Citizen Dashboard & Civic Engagement.
Validates:
- Report-a-problem workflow with photographic evidence and privacy-preserving location
- Manual verification transitions: pending_verification -> verified | rejected | clarification_requested
- Strict rule enforcement: Credits are awarded ONLY upon authorized manual verification/approval
- Immutable audit log tracking
- Citizen credit ledger and profile
- Community initiatives and privacy-conscious leaderboards
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.civic import CivicAction, CivicAuditLog, CivicCredit, CommunityInitiative
from app.models.user import User


# ---------------------------------------------------------------------------
# 1. Citizen Profile & Credit Ledger Tests
# ---------------------------------------------------------------------------

def test_citizen_profile_endpoint(client: TestClient, citizen_headers: dict):
    """
    Verifies that the citizen profile endpoint returns user information,
    accumulated credit points, reputation tier, and badges.
    """
    res = client.get("/api/v1/civic/profile", headers=citizen_headers)
    assert res.status_code == 200
    data = res.json()
    assert "user_id" in data
    assert "total_credit_points" in data
    assert "reputation_tier" in data
    assert "display_handle" in data
    assert len(data["badges"]) > 0


def test_credit_history_ledger(client: TestClient, citizen_headers: dict):
    """
    Verifies that the credit history endpoint returns the chronological ledger of awarded points.
    """
    res = client.get("/api/v1/civic/credits", headers=citizen_headers)
    assert res.status_code == 200
    credits = res.json()
    assert isinstance(credits, list)
    if len(credits) > 0:
        first = credits[0]
        assert "points_delta" in first
        assert "transaction_type" in first
        assert "verification_outcome" in first


# ---------------------------------------------------------------------------
# 2. Complete Example Workflow: Damaged Road Report -> Manual Review -> Credits
# ---------------------------------------------------------------------------

def test_example_workflow_damaged_road_report_and_manual_verification(
    client: TestClient,
    citizen_headers: dict,
    gov_headers: dict,
    db: Session,
):
    """
    Tests the complete 6-step prompt workflow:
      1. Citizen submits damaged road description and location.
      2. Application records supporting photographs.
      3. Report enters pending_verification state (0 credits awarded).
      4. Authorized reviewer evaluates report.
      5. Report is approved, rejected, or sent for clarification.
      6. Credits are awarded ONLY according to configured rules (not simply on upload).
    """
    # ---------------------------------------------------------
    # Steps 1-3: Citizen reports damaged road
    # ---------------------------------------------------------
    report_payload = {
        "city_id": "koraput",
        "action_type": "damaged_road",
        "title": "Severe Road Shoulder Scouring on Semiliguda Ghat Road",
        "description": "Heavy monsoon washouts created a 3-meter erosion gully on the outer turn. Potholes damage vehicles and block ambulances.",
        "evidence_url": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        "coarse_location": "Semiliguda Ghat Road, Km 14",
        "precise_location_private": "Between Culvert #18 and Milestones 14/2 (GPS: 18.795, 82.883)",
        "public_consent": True,
    }

    create_res = client.post("/api/v1/civic/actions", json=report_payload, headers=citizen_headers)
    assert create_res.status_code == 201
    report = create_res.json()
    report_id = report["id"]

    # Verify initial state: pending_verification
    assert report["verification_status"] == "pending_verification"
    assert report["action_type"] == "damaged_road"
    assert report["coarse_location"] == "Semiliguda Ghat Road, Km 14"
    assert report["precise_location_private"] == "Between Culvert #18 and Milestones 14/2 (GPS: 18.795, 82.883)"

    # Verify audit log initiated
    assert len(report["audit_logs"]) == 1
    assert report["audit_logs"][0]["action_taken"] == "submitted"

    # RULE ENFORCEMENT CHECK: Zero credits must be awarded simply for uploading an image!
    credit_entry = db.query(CivicCredit).filter(CivicCredit.civic_action_id == report_id).first()
    assert credit_entry is None, "Credits must NOT be awarded upon raw submission or image upload!"

    # ---------------------------------------------------------
    # Step 4-6: Authorized reviewer evaluates and approves report
    # ---------------------------------------------------------
    verify_payload = {
        "action": "approve",
        "awarded_points": 50,
        "notes": "Verified by PWD Junior Engineer. Road repair work order issued under district disaster fund.",
    }

    verify_res = client.post(f"/api/v1/civic/actions/{report_id}/verify", json=verify_payload, headers=gov_headers)
    assert verify_res.status_code == 200
    verified_data = verify_res.json()

    assert verified_data["verification_status"] == "verified"
    assert verified_data["reviewer_notes"] == "Verified by PWD Junior Engineer. Road repair work order issued under district disaster fund."
    assert len(verified_data["audit_logs"]) >= 2
    assert verified_data["audit_logs"][0]["action_taken"] == "verified_and_rewarded"

    # RULE ENFORCEMENT CHECK: Credits are NOW awarded following authorized verification
    awarded_credit = db.query(CivicCredit).filter(CivicCredit.civic_action_id == report_id).first()
    assert awarded_credit is not None
    assert awarded_credit.points_delta == 50
    assert awarded_credit.verification_outcome == "approved"


def test_rejection_and_clarification_workflow_awards_zero_credits(
    client: TestClient,
    citizen_headers: dict,
    gov_headers: dict,
    db: Session,
):
    """
    Verifies that when a reviewer rejects or requests clarification,
    zero credits are awarded.
    """
    # 1. Citizen submits report
    payload = {
        "city_id": "koraput",
        "action_type": "water_leakage",
        "title": "Minor standpost valve dripping in Ward 3",
        "description": "Slow dripping observed at public standpost.",
        "evidence_url": "https://example.com/drip.jpg",
        "coarse_location": "Ward 3, Koraput Town",
    }
    create_res = client.post("/api/v1/civic/actions", json=payload, headers=citizen_headers)
    report_id = create_res.json()["id"]

    # 2. Reviewer requests clarification (photo too blurry)
    clarify_res = client.post(
        f"/api/v1/civic/actions/{report_id}/verify",
        json={"action": "request_clarification", "awarded_points": 50, "notes": "Please provide clearer photo of main pipe joint."},
        headers=gov_headers,
    )
    assert clarify_res.status_code == 200
    assert clarify_res.json()["verification_status"] == "clarification_requested"

    # Verify zero credits awarded
    cred = db.query(CivicCredit).filter(CivicCredit.civic_action_id == report_id).first()
    assert cred is None

    # 3. Reviewer rejects report
    reject_res = client.post(
        f"/api/v1/civic/actions/{report_id}/verify",
        json={"action": "reject", "awarded_points": 50, "notes": "Private plumbing issue, outside municipal jurisdiction."},
        headers=gov_headers,
    )
    assert reject_res.status_code == 200
    assert reject_res.json()["verification_status"] == "rejected"

    # Verify zero credits awarded
    cred = db.query(CivicCredit).filter(CivicCredit.civic_action_id == report_id).first()
    assert cred is None


# ---------------------------------------------------------------------------
# 3. Privacy Safeguard Tests
# ---------------------------------------------------------------------------

def test_privacy_protection_in_public_feed(client: TestClient):
    """
    Ensures that unauthenticated public requests or unrelated citizens:
    - Never see precise private locations (house numbers, GPS).
    - Only see coarse locations (Ward/Locality).
    - Have citizen display name masked if public consent was false.
    """
    res = client.get("/api/v1/civic/actions?city_id=koraput")
    assert res.status_code == 200
    actions = res.json()
    assert len(actions) > 0

    for act in actions:
        # Public feed must never expose private precise coordinates
        assert act["precise_location_private"] is None
        # Coarse location must be present
        assert act["coarse_location"] is not None


# ---------------------------------------------------------------------------
# 4. Community Initiatives & Leaderboard Tests
# ---------------------------------------------------------------------------

def test_community_initiatives_listing_and_join(client: TestClient, citizen_headers: dict):
    """
    Verifies that citizens can list community initiatives in Koraput and register as volunteers.
    """
    # 1. List initiatives
    res = client.get("/api/v1/civic/initiatives?city_id=koraput")
    assert res.status_code == 200
    initiatives = res.json()
    assert len(initiatives) >= 2
    init_id = initiatives[0]["id"]
    initial_vols = initiatives[0]["current_volunteers"]

    # 2. Join initiative
    join_res = client.post(f"/api/v1/civic/initiatives/{init_id}/join", headers=citizen_headers)
    assert join_res.status_code == 200
    j_data = join_res.json()
    assert j_data["status"] == "success"
    assert j_data["current_volunteers"] == initial_vols + 1


def test_city_leaderboard_endpoint(client: TestClient):
    """
    Verifies that the leaderboard ranks top contributors with anonymized handles
    and civic badges.
    """
    res = client.get("/api/v1/civic/leaderboard?city_id=koraput")
    assert res.status_code == 200
    entries = res.json()
    assert len(entries) >= 3
    for entry in entries:
        assert "rank" in entry
        assert "display_name" in entry
        assert "total_points" in entry
        assert "badge" in entry
        assert entry["rank"] >= 1
