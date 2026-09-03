# VyapaarIQ — Master Implementation & System Architecture Guide

**Tagline**: *Know your business before you borrow.*  
**Product Category**: Rural & Semi-Urban AI-Powered Business Decision-Intelligence Platform

---

> [!NOTE]
> **VyapaarIQ** is an end-to-end decision-intelligence platform engineered to help first-time entrepreneurs evaluate business opportunity feasibility, local market demand, competition density, risk factors, and bank loan affordability **BEFORE taking a loan**.

---

## 🏛️ 1. Core Architecture & System Overview

```text
                                VYAPAARIQ ARCHITECTURE
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                REACT FRONTEND (Vite)                              │
│  - Apple-Inspired Minimalist Aesthetic & Global Grid System                        │
│  - Interactive Leaflet Map Picker + Nominatim Geocoding                           │
│  - 4-Step Analysis Wizard (Location -> Capital -> Business Category -> Review)    │
│  - Financial Calculator, Sensitivity Simulator & Market Signal Dashboards         │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │ REST API (HTTP/JSON)
                                         ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                FASTAPI BACKEND                                    │
│  - GET  /health                           -> DB & PostGIS Connectivity Check     │
│  - GET  /api/v1/locations/search          -> Multi-level LGD Location Search      │
│  - POST /api/v1/locations/resolve         -> PostGIS Spatial Boundary Check      │
│  - GET  /api/v1/locations/{code}          -> Hierarchy Depth Inspector           │
│  - GET  /api/v1/business/categories       -> Active MSME Rule Configs            │
│  - POST /api/v1/financial/calculate       -> Reducing-Balance Loan Engine        │
└────────────────────────────────────────┬──────────────────────────────────────────┘
                                         │ SQLAlchemy Async ORM
                                         ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             POSTGRESQL + POSTGIS DATABASE                         │
│  - States, Districts, Subdistricts (15 Nashik Talukas), Villages, Locations       │
│  - Population Statistics (Census 2011 PCA Facts)                                  │
│  - Market Prices (Agmarknet Mandi Telemetry)                                      │
│  - Infrastructure (PMGSY Roads, APMC Mandis, Cold Storage, Banks)                │
│  - Category Config & Udyam Enterprise Points                                      │
│  - Data Source Registry (100% Provenance Tracking)                                │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 2. Frontend Implementation & Visual Identity

The entire frontend was built using **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Leaflet Maps**.

### Key Visual & Functional Accomplishments:
1. **Apple Product Aesthetics**: Clean typography, high contrast, subtle borders (`#E2E2DC`), warm dark accents (`#C9793A`), and spacious layout structure.
2. **Global Grid System (`GlobalGrid.tsx`)**: Reusable technical background grid rendered across all routes (`/`, `/how-it-works`, `/analyze`, `/market-intelligence`, `/financial-plan`, `/risk-analysis`, `/compare`, `/about`).
3. **Redesigned Map-Based Location Selection (`LocationMapPicker.tsx`)**:
   - Replaced fixed dropdown with an **interactive Leaflet map**.
   - Supports map click-to-select, marker dragging, forward geocoding search (*Lasalgaon, Nashik*), and browser geolocation (*Use My Current Location*).
   - Resolves coordinates (`latitude`, `longitude`) via `POST /api/v1/locations/resolve` and displays an explicit **Verified Pilot Coverage Badge** or an honest **Outside Pilot Coverage Notice**.
4. **Interactive Financial Calculator**: Real-time reducing-balance EMI, tenure, and interest rate calculator connected directly to backend API.
5. **Off-Season Cash Flow Sensitivity Simulator**: Allows simulating revenue drops during agricultural lean periods.

---

## ⚙️ 3. Backend & Data Foundation

Built with **Python 3.11**, **FastAPI**, **SQLAlchemy ORM (Async)**, **PostgreSQL 16 / PostGIS**, **Pydantic v2**, and **Alembic**.

### Database Schema & Migrations:
- **`001_initial_schema`**: Core tables (`states`, `districts`, `subdistricts`, `villages`, `locations`, `data_source_registry`, `category_config`, `users`, `financial_calculations`).
- **`002_nashik_data_foundation`**: Added fact tables (`population_statistics`, `economic_statistics`, `market_prices`, `businesses`, `infrastructure`).

### Official Government Datasets Ingested (Nashik Pilot Region):
1. **Administrative Hierarchy (LGD)**: Maharashtra (State `27`) → Nashik District (District `497`) → All **15 Subdistricts/Talukas** (`Nashik`, `Malegaon`, `Sinnar`, `Niphad`, `Igatpuri`, `Dindori`, `Yeola`, `Kalwan`, `Baglan/Satana`, `Surgana`, `Peint`, `Trimbak`, `Chandwad`, `Nandgaon`, `Deola`) and seed feeder villages (`Lasalgaon`, `Pimpalgaon Baswant`, `Adgaon`, `Girnare`, `Makhmalabad`, `Musalgaon MIDC`, `Wavi`, `Dyane`, `Zadgao`, `Ghoti Budruk`).
2. **Demographics**: Census 2011 Primary Census Abstract (PCA) population figures for Nashik District and all 15 Talukas.
3. **Market Price Data**: Agmarknet Mandi price telemetry for Lasalgaon, Nashik Main, Pimpalgaon, Malegaon, and Yeola APMCs (`Onion`, `Tomato`, `Maize`, `Grapes`, `Cotton`, `Cow Milk`).
4. **Infrastructure & Road Network**: PMGSY all-weather road links, APMC mandis, cold storage units, and bank branches.
5. **Enterprise Rules**: MSME category configurations (`DAIRY_FARM`, `COLD_STORAGE`, `SPICE_PROCESSING`, `SOLAR_HARDWARE`).

---

## 🔍 4. Strict Data Integrity & Provenance Policy

- **Zero Synthetic / Fake Data**: No manufactured population figures, fake competitors, or random scores.
- **100% Provenance Traceability**: Every fact record in PostgreSQL explicitly references a registered source ID in `data_source_registry`.
- **Honest Boundary Enforcement**: When selecting coordinates outside Nashik pilot coverage, the system clearly informs the user without inventing false telemetry.

---

## 📊 5. Exact PostgreSQL Reality Check (Row Counts)

```text
states                   : 1 (Maharashtra)
districts                : 1 (Nashik)
subdistricts             : 15 (All 15 Nashik Talukas)
villages                 : 10 (Seed Feeder Nodes)
locations                : 10 (Verified Coordinates)
population_statistics    : 20 (Census 2011 PCA Facts)
economic_statistics      : 0
market_prices            : 10 (Agmarknet Mandi Records)
businesses               : 5 (MSME Telemetry Points)
infrastructure           : 9 (PMGSY Roads, APMCs, Cold Storage, Banks)
category_config          : 4 (MSME Category Rule Schemas)
data_source_registry     : 5 (Official Provenance Registries)
financial_calculations   : 3 (Audit Calculations)
```

---

## 🧪 6. Automated Testing & Verification

- **Backend Pytest Suite**: **22 passed out of 22 tests (100% SUCCESS)**
  - Financial calculations, health API, PostgreSQL tables, location search, PostGIS coordinate resolution, business categories API, and Nashik pilot hierarchy idempotency.
- **Frontend Build**: Passed cleanly via `tsc -b && vite build` with zero errors.

---

## 🚀 7. How to Access & Test the Live Application

Both servers are currently running live on localhost:

> [!IMPORTANT]
> **Frontend Application**: **[http://localhost:5173/](http://localhost:5173/)**  
> **Start Analysis Page**: **[http://localhost:5173/analyze](http://localhost:5173/analyze)**  
> **Backend API Docs (Swagger)**: **[http://localhost:8000/docs](http://localhost:8000/docs)**  
> **Backend Health Endpoint**: **[http://localhost:8000/health](http://localhost:8000/health)**
