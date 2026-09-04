# Implementation Walkthrough: Modules 1 & 2 + Backend Microservice Architecture

## Overview of Changes

### 1. Folder Restructuring & Microservice Architecture
The backend services are now organized into two clean, self-contained microservices:
- `backend/services/core_api/` (Python FastAPI on port 8000):
  - Hosts both **Module 1 (Feasibility Engine)** and **Module 2 (Financial Structuring)**.
  - Connects to Supabase PostgreSQL with PostGIS 3.3.7 enabled.
  - Contains its own virtual environment (`venv/`), `.env`, dependencies (`requirements.txt`), `main.py`, and `feasibility_engine.py`.
- `backend/services/rag/` (Node.js Express on port 3000):
  - Ingestion, vector storage (Qdrant), and LLM question-answering (Ollama).

---

### 2. Part 1: Auth & Firestore Calculation History
- **Frontend File Modified**: `frontend/src/pages/Auth.tsx`
- **Functionality**:
  - When users authenticate (Email/Password, Google), the profile card displays their info alongside their **persisted calculation history** fetched directly from Firestore collection `users/{uid}/calculations` ordered by timestamp.
  - Calculation cards show scheme name, category, interest rate, tenure, and monthly EMI.
  - Expanding a card exposes the full breakdown: Project Cost, Eligible Loan, Total Interest, Margin, and any policy advisories.
  - Added a deletion trigger to remove calculations from Firestore with immediate UI state sync.
  - Verified with `npm run build` passing with 0 errors.

---

### 3. Part 2: Module 2 Scheme Explanation Error Fix
- **Backend File**: `backend/services/core_api/main.py`
- **Frontend File**: `frontend/src/pages/FinancialPlan.tsx`
- **Functionality**:
  - Previously, if a user requested a project cost that exceeded all active NBCFDC schemes (e.g., Margin ₹1,50,000 + Project Cost ₹10,00,000), the backend returned a bare 400 error.
  - Replaced with a structured **422 Unprocessable Entity** response explaining:
    1. Exact upper limit of active schemes (₹11,76,470 for Term Loans / ₹55,555 for Micro Finance).
    2. Concrete suggestions (split project into phases, reduce requested cost, or inspect active schemes).
    3. An embedded summary of all available schemes and their max caps.
  - Frontend renders an amber advisory card with the explanation and a reference table so users understand the rules.

---

### 4. Part 3: Module 1 Feasibility Engine
- **Engine File**: `backend/services/core_api/feasibility_engine.py`
- **API File**: `backend/services/core_api/main.py`
- **Endpoints Implemented & Tested**:
  1. `GET /api/v1/locations/search?q={query}`: Searches official Maharashtra LGD villages, returning verified LGD codes and coordinates.
  2. `POST /api/v1/locations/resolve`: Resolves input coordinates to the nearest administrative cluster via PostGIS `ST_Distance`.
  3. `GET /api/v1/business/categories`: Exposes active business categories (`dairy`, `grocery`, `tailoring`) with target segments and requirements.
  4. `POST /api/v1/feasibility/analyze`: Executes the complete Module 1 pipeline:
     - **Geospatial Processing**: PostGIS `ST_DWithin` spatial queries across 68,357 PMGSY `rural_assets` and 2,797 geocoded villages in `locations`.
     - **Market Reach**: 5 km and 10 km catchment calculations using official formula `Practical Reach = Population × Accessibility × Target × Serviceability`.
     - **Opportunity Gap**: Quantified `Business Gap = Estimated Demand - Existing Supply`.
     - **Competitor Density**: Measured competitors per 1,000 households with Low/Medium/High classification.
     - **Pricing Engine**: Cost floor, sustainable price margins, and benchmark comparison.
     - **Local Threats**: Rule-based detection (mandi distance, competitor concentration, veterinary access).
     - **SWOT Analysis**: Grounded in calculated facts.
     - **Scoring**: 5-axis feasibility score (0–100) and data confidence score (0–100).
     - **Financial Digital Twin**: 3-scenario projections (Conservative, Expected, Optimistic) with operating surplus, cash after EMI, and break-even timeline.
     - **Database Persistence**: Caches the report JSON into Supabase `feasibility_reports` table.
  5. `GET /api/v1/feasibility/analyze/{analysis_id}`: Retrieves cached reports.
  6. `POST /api/v1/financial/calculate` & `GET /health`: Compatibility aliases matching `frontend/src/services/api.ts`.

---

## Verification & Test Results

| Test | Route / Component | Result | Notes |
|---|---|---|---|
| Health Check | `GET /health` | **PASSED (200)** | Database connected |
| Categories | `GET /api/v1/business/categories` | **PASSED (200)** | Returns Dairy, Grocery, Tailoring |
| Location Search | `GET /api/v1/locations/search?q=Akole` | **PASSED (200)** | Returns verified LGD villages |
| Location Resolve | `POST /api/v1/locations/resolve` | **PASSED (200)** | Resolves coordinates via PostGIS |
| Feasibility Pipeline | `POST /api/v1/feasibility/analyze` | **PASSED (200)** | 74.5/100 Viability, 6,267 market reach, SWOT & Digital Twin generated |
| Report Cache | `GET /api/v1/feasibility/analyze/{id}` | **PASSED (200)** | Successfully retrieves cached report from Supabase |
| Frontend Build | `npm run build` | **PASSED (0 errors)** | Bundle created in 1.93s |

---

## Running the Complete System

### Backend (Python Core Engine):
```powershell
cd d:\FSD\sih-26091-shaurya\backend\services\core_api
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Frontend:
```powershell
cd d:\FSD\sih-26091-shaurya\frontend
npm run dev
```

You can now:
1. Open `http://localhost:5173/auth` (or 5174): Sign in and review saved calculation history.
2. Open `/finance`: Structure loans, check amortization schedules, and test out-of-range inputs to see the helpful error explanation.
3. Open `/analyze`: Walk through the 8-step feasibility wizard to generate an explainable report!
