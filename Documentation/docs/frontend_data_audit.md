# VyapaarIQ Frontend Data Audit & Telemetry Classification

This document classifies every data element, chart, dropdown, and metric currently rendered across the React frontend UI.

---

## 🔍 Page-by-Page Classification Matrix

| Page / Component | UI Element / Widget | Classification | Data Source | Notes |
|------------------|---------------------|----------------|-------------|-------|
| **App Shell** | Location Search Bar | `DATABASE-BACKED` | `GET /api/v1/locations/search?q=` | Queries real PostgreSQL `villages`, `subdistricts`, `districts` hierarchy via `src/services/api.ts` |
| **Analyze Page** | District Dropdown Selector | `DATABASE-BACKED` | `GET /api/v1/locations/search` | Populated dynamically from real database search endpoint |
| **Analyze Page** | Financial Loan Parameters (Capital, Loan) | `REAL API` | `POST /api/v1/financial/calculate` | Computes deterministic reducing-balance EMI and stores calculation in PostgreSQL `financial_calculations` |
| **Analyze Page** | Business Viability Score Output Card | `PLACEHOLDER` | Static Demo State | Visual preview for Phase 3 Feasibility Engine |
| **Market Intelligence** | Catchment Nodes & Mandi Signals Matrix | `STATIC PRODUCT CONTENT` | `src/data/demoData.ts` | Displays Kannauj/Nashik cluster methodology presentation |
| **Market Intelligence** | Demand Index (82/100) & Competitor Density | `PLACEHOLDER` | Static Presentation Cards | Visual preview of market telemetry widgets |
| **Financial Plan** | Interactive Loan Slider Calculator | `DATABASE-BACKED` | `POST /api/v1/financial/calculate` | Uses exact formula matching backend `financial_service.py` |
| **Risk & SWOT** | Off-Season Sensitivity Simulator | `REAL MATH` | Client-side deterministic formula | Simulates cash flow drop during off-season |
| **Compare Businesses** | Opportunity Comparison Grid | `STATIC PRODUCT CONTENT` | `src/pages/CompareBusinesses.tsx` | Visual comparison layout comparing Dairy vs Spices vs Solar |
| **How It Works** | System Methodology Steps (01-06) | `STATIC PRODUCT CONTENT` | `src/pages/HowItWorks.tsx` | Product methodology and decision flow explanation |
| **About Page** | Company Mission & Scheme Alignment | `STATIC PRODUCT CONTENT` | `src/pages/About.tsx` | Informational product documentation |

---

## 🏷️ Classification Definitions

- **`REAL API`**: Connected directly to active backend FastAPI endpoints executing live Python/SQL code.
- **`DATABASE-BACKED`**: Queries real records stored in PostgreSQL (`vyapaariq`).
- **`STATIC PRODUCT CONTENT`**: Legitimate product copy, methodology descriptions, and navigation headers.
- **`PLACEHOLDER`**: UI design widgets representing features to be powered by the Phase 3 Feasibility Engine.
- **`DUMMY DATA`**: Synthetically generated numbers (Zero instances found in backend database).
