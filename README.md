# CivicIntel — AI-Powered Civic Intelligence Platform

CivicIntel is an AI-powered civic intelligence and urban benchmarking platform designed to help developing Indian cities identify structural development gaps, benchmark against comparable developed urban centers, and uncover data-driven development opportunities.

The platform focuses on:
- **Koraput, Odisha** (Aspirational District Hub)
- **Bhubaneswar, Odisha** (State Capital / Benchmark Smart City)

---

## Architecture Overview

```
civicintel/
│
├── frontend/                     # Next.js 16 (App Router), TypeScript, Tailwind CSS, Recharts
│   ├── app/                      # App router views (Overview, Intelligence, Comparison, Policy Engine, etc.)
│   ├── components/               # Modular UI, dashboard charts, maps, and layout components
│   ├── lib/                      # API client with health checks & formatting utilities
│   ├── hooks/                    # useCivicApi hook for backend state synchronization
│   ├── types/                    # Strict TypeScript domain interfaces
│   └── public/                   # Static assets
│
├── backend/                      # Python FastAPI, SQLAlchemy, Alembic, Pydantic
│   ├── app/
│   │   ├── main.py               # Application entrypoint & CORS lifecycle
│   │   ├── api/v1/endpoints/     # Modular REST API routers (cities, policies, auth, civic, etc.)
│   │   ├── core/                 # Config, security (bcrypt & JWT), database engine
│   │   ├── models/               # 10 Normalized SQLAlchemy models
│   │   ├── schemas/              # Pydantic v2 validation models
│   │   ├── services/             # City scoring, policy RBAC, and database seeding
│   │   └── ml/                   # Benchmark engine, gap analysis, and runway formulas
│   ├── alembic/                  # Database migration scripts
│   ├── tests/                    # Pytest test suite (20 automated tests)
│   ├── requirements.txt          # Python dependencies
│   └── .env.example              # Environment variables template
│
├── docs/                         # Detailed architecture, API docs & setup guides
│   ├── api_documentation.md
│   └── local_setup.md
│
└── README.md
```

---

## Database Design (10 Normalized Tables)

| Table | Purpose |
|---|---|
| `cities` | City identity, geographic location, demographics, and general information |
| `indicator_sources` | Source organization, collection date, methodology, and verification status |
| `development_indicators` | Healthcare, education, infrastructure, employment, and governance metrics |
| `city_benchmarks` | Target-to-benchmark city comparisons, gap percentages, and runway years |
| `development_policies` | Proposed and approved civic interventions with budgets and timelines |
| `policy_evaluations` | Costs, feasibility scores, impact ratings, and evidentiary outcomes |
| `users` | User accounts with strict Role-Based Access Control (RBAC) |
| `civic_actions` | Citizen-submitted activities, geo-tags, and verification audits |
| `civic_credits` | Reward transactions and credit ledger upon verified civic actions |
| `investments` | Bankable PPP and private investment opportunities with IRR and ESG ratings |

---

## Quickstart Commands

### 1. Run Backend Server
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

### 2. Run Test Suite
```bash
cd backend
PYTHONPATH=. venv/bin/pytest tests/ -v
```

### 3. Run Frontend Server
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:3000`

---

## Demonstration Data Disclaimer
All statistics and indicators in this demonstration platform represent modeled civic intelligence synthesized from public census benchmarks, District Mineral Foundation audits, and urban missions. Demonstration data is strictly labeled and never represented as certified real-time official telemetry.
