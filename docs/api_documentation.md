# CivicIntel REST API Documentation

## Base URL
- Local: `http://localhost:8000/api/v1`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 1. Health & Readiness
- `GET /health`: Returns service health and database connection status.
- `GET /ready`: Kubernetes/container readiness probe.

---

## 2. City & Benchmarking APIs

### `GET /api/v1/cities`
List all monitored cities (Koraput, Bhubaneswar).

### `GET /api/v1/cities/{city_id}`
Get full profile for a city by ID (`koraput` or `bhubaneswar`).

### `GET /api/v1/cities/{city_id}/indicators`
Retrieve verified and modeled development indicators for a city.
- Query Parameter: `sector` (optional: `healthcare`, `education`, `infrastructure`, `employment`, `governance`)
- Data Validation Fields returned:
  - `value`: Numerical reading
  - `unit`: Measurement unit
  - `reporting_period`: e.g. "2025-2026"
  - `data_source`: Source entity
  - `collection_date`: UTC ISO timestamp
  - `verification_status`: Status label
  - `is_demonstration`: Boolean flag

### `GET /api/v1/cities/{city_id}/development-score`
Computes composite multi-factor development score (0-100) using weighted sector indicators and compares against reference benchmark city.

### `GET /api/v1/cities/compare`
Cross-city comparative analysis.
- Query Parameters: `target_city_id=koraput`, `benchmark_city_id=bhubaneswar`
- Returns:
  - `overall_gap_percentage`
  - `average_runway_years`
  - `metrics`: Array of indicator-level comparisons with delta, priority level, and runway years.

---

## 3. Development Policy APIs

### `GET /api/v1/policies`
List development policy interventions with optional filters:
- `city_id`
- `sector`
- `status` (Proposed, Under Review, Approved, In Execution, Completed, Rejected)

### `GET /api/v1/cities/{city_id}/policies`
List policies targeted for a given city.

### `POST /api/v1/policies`
Propose a new policy intervention.
- **Authorization**: Requires Bearer token (`government_official`, `system_admin`, `investor`, `ngo_member`).
- Accepts policy metadata and initial evaluation scores.

### `PATCH /api/v1/policies/{policy_id}/status`
Update policy lifecycle status (e.g., transition to `Approved` or `Rejected`).
- **Authorization**: **Strictly role-gated** to `government_official` or `system_admin`.
- Automatically stamps `approved_by_user_id` and `approved_at`.

---

## 4. Authentication & Security

### `POST /api/v1/auth/login/json`
Authenticate using email and password to receive a JWT access token.

### `POST /api/v1/auth/register`
Public user registration.
- **Security Constraint**: Self-registering users cannot assign themselves privileged roles (`government_official`, `system_admin`). Attempts will fail with HTTP 422.

### `GET /api/v1/auth/me`
Retrieve profile of currently authenticated user.

---

## 5. Civic Engagement & Credits

### `GET /api/v1/civic/actions`
List citizen community actions.

### `POST /api/v1/civic/actions`
Submit a new community action with evidence link.

### `POST /api/v1/civic/actions/{action_id}/verify`
Audit and verify a submitted action, awarding civic green credits upon verification.

### `GET /api/v1/civic/credits`
List credit ledger transactions for the authenticated user.

---

## 6. Investor Marketplace

### `GET /api/v1/investments`
List bankable PPP and private civic infrastructure projects.

### `POST /api/v1/investments`
Register a new project opportunity (Authorized roles).
