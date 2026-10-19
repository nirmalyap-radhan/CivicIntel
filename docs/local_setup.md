# CivicIntel — Local Setup & Development Guide

## Prerequisites
- Node.js >= 18 (Node 20+ recommended)
- Python >= 3.10 (Python 3.11 recommended)
- SQLite3 (included with Python) or PostgreSQL 14+

---

## 1. Backend Setup (FastAPI & SQLAlchemy)

### A. Navigate to backend directory
```bash
cd backend
```

### B. Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### C. Install dependencies
```bash
pip install -r requirements.txt
```

### D. Configure environment
```bash
cp .env.example .env
```
Default `DATABASE_URL` is configured for local zero-dependency SQLite:
`DATABASE_URL="sqlite:///./civicintel.db"`

For PostgreSQL:
`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civicintel"`

### E. Run database migrations
```bash
alembic upgrade head
```

### F. Start the backend development server
```bash
uvicorn app.main:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Swagger UI Documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### G. Run Test Suite
```bash
PYTHONPATH=. pytest tests/ -v
```

---

## 2. Frontend Setup (Next.js & Tailwind CSS)

### A. Navigate to frontend directory
```bash
cd frontend
```

### B. Install dependencies
```bash
npm install
```

### C. Start Next.js development server
```bash
npm run dev
```
- Access application: `http://localhost:3000`

### D. Build for Production
```bash
npm run build
```

---

## 3. Pre-Seeded Demonstration Accounts

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@civicintel.in` | `AdminPass123!` |
| **Government Official** | `collector.koraput@odisha.gov.in` | `GovOfficialPass123!` |
| **Citizen** | `citizen.sambit@koraput.in` | `CitizenPass123!` |
| **Investor** | `investor.capital@easterninfra.in` | `InvestorPass123!` |
