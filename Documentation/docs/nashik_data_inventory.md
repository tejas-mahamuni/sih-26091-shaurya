# Nashik Pilot Data Inventory & Availability Matrix

This document presents the authoritative data inventory for the **Nashik District Pilot Scope** (State Code: `27`, District LGD Code: `497`).

---

## 📊 Nashik Pilot Data Availability Matrix

| Data Layer | Dataset | Publisher / Source | Geography | Available? | Source Date | Unit | Target Database Table | Limitations |
|------------|---------|-------------------|-----------|------------|-------------|------|----------------------|-------------|
| **1. Administrative Geography** | LGD Hierarchy | Ministry of Panchayati Raj | Village / Taluka | **YES** | 2024-06 | LGD_CODE | `states`, `districts`, `subdistricts`, `villages`, `locations` | Code updates lag real-time GP bifurcations by 30-90 days |
| **2. Demographics** | Primary Census Abstract (PCA) | Office of Registrar General (Census India) | Village / Taluka / District | **YES** | 2011-03 | PERSONS | `population_statistics` | Decennial 2011 baseline requires growth projection for 2026 |
| **3. Economic / Livelihood** | Worker Classification & Economic Census | Ministry of Statistics & Programme Implementation (MOSPI) | Taluka / District | **YES** | 2011 / 2020 | WORKERS | `economic_statistics` | Informal sector micro-enterprises partially captured |
| **4. Business / Enterprise** | Udyam MSME Registry | Ministry of MSME | Taluka / District | **YES** | 2024-06 | ENTERPRISES | `category_config`, `businesses` | Unregistered micro-shops not in Udyam directory |
| **5. Market Price Data** | Agmarknet Mandi Telemetry | DMI, Ministry of Agriculture | APMC Mandi | **YES** | 2026-08-28 | RS_PER_QUINTAL | `market_prices` | Lasalgaon & Nashik APMC price arrivals active |
| **6. Infrastructure & Connectivity** | PMGSY Road Network & NABARD Infra | Ministry of Rural Development & NABARD | Taluka / Node | **YES** | 2024-01 | GEOMETRY_NODE | `infrastructure` | Tracks all-weather paved roads; seasonal dirt tracks excluded |
| **7. Consumer Inflation** | CPI (Rural/Urban) | MOSPI | District / State | **YES** | 2026-07 | INDEX_POINTS | `economic_statistics` | CPI compiled at District/State level; not available per Village |
| **8. Government Schemes** | PMEGP / AIF / PMFME Inventory | Ministry of MSME / MoFPI | National / State | **YES (Schema & Inventory)** | 2024-05 | POLICY_CONFIG | `category_config` | Scheme eligibility rules configured per category |

---

## 🏛️ Government Scheme Inventory (Rural & Semi-Urban MSMEs)

| Scheme Name | Nodal Ministry / Agency | Max Assistance Limit | Subsidy Rate | Interest Subsidy | Target Sectors / Categories | Source URL |
|-------------|------------------------|----------------------|--------------|------------------|-----------------------------|------------|
| **PMEGP (Prime Minister’s Employment Generation Programme)** | Ministry of MSME | ₹50 Lakhs (Manufacturing) / ₹20 Lakhs (Service) | 15% - 35% (Special category rural) | Standard Bank Rate | Dairy, Agro-processing, Rural Retail | https://kviconline.gov.in/pmegpeportal |
| **PMFME (PM Formalisation of Micro Food Processing Enterprises)** | Ministry of Food Processing Industries (MoFPI) | ₹10 Lakhs (35% Project Cost) | 35% Credit-linked | 3% Interest Subvention | Spice Grinding, Fruit/Grape Processing, Bakery | https://pmfme.mofpi.gov.in |
| **Agri Infrastructure Fund (AIF)** | Ministry of Agriculture & Farmers Welfare | ₹2 Crores | Credit Guarantee (CGTMSE) | 3% p.a. for up to 7 years | Cold Storage, Mandi Silos, Sorting/Grading Units | https://agriinfra.dac.gov.in |

---

## 🛑 Missing & Unavailable Datasets (Honest Assessment)

1. **Real-time Village Footfall Telemetry**:
   - *Status*: Unavailable from official sources.
   - *Reason*: No government agency measures hourly footfall at individual village crossroads.
   - *Handling*: Handled via proxy demographic density and PMGSY road connectivity. Never fabricated with fake numbers.

2. **Hyperlocal Street-Level Competitor Revenue**:
   - *Status*: Unavailable from official sources.
   - *Reason*: Private un-audited micro-store revenues are confidential and non-public.
   - *Handling*: Assessed via Udyam registered category density at Taluka/District level.

---

## 🔒 Data Provenance Classifications Used

- `OFFICIAL`: Verified directly from government databases (LGD, Census, Agmarknet, PMGSY, Udyam).
- `FIELD_VERIFIED`: Confirmed on-ground by local telemetry.
- `USER_PROVIDED`: Supplied by entrepreneur during onboarding.
- `ESTIMATED`: Projected by financial stress formulas.
- `AI_INFERRED`: Synthesized via explainable NLP/ML logic.
