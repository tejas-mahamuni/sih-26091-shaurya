# VyapaarIQ Data Source Registry & Provenance Standard

Every dataset ingested into VyapaarIQ must be registered in the `data_source_registry` table. No metric, viability score, or financial calculation can exist without explicit provenance tracking.

---

## 1. Local Government Directory (LGD) Hierarchy
- **Dataset Name**: Local Government Directory (LGD)
- **Source Agency**: Ministry of Panchayati Raj, Government of India
- **Official URL**: https://lgdirectory.gov.in
- **Purpose**: Establishes standard administrative hierarchy (State → District → Subdistrict/Block → Village/Panchayat) with official numeric codes.
- **Geographic Granularity**: Village / Gram Panchayat
- **Update Frequency**: Monthly
- **Target Tables**: `states`, `districts`, `subdistricts`, `villages`, `locations`
- **Limitations**: Code updates may lag real-time panchayat bifurcations by 30-90 days.

---

## 2. Primary Census Abstract (PCA 2011)
- **Dataset Name**: Census 2011 Primary Census Abstract
- **Source Agency**: Office of the Registrar General & Census Commissioner of India
- **Official URL**: https://censusindia.gov.in
- **Purpose**: Establishes baseline population counts, household numbers, literacy rates, and worker classification per village.
- **Geographic Granularity**: Village
- **Update Frequency**: Decennial (2011 Baseline)
- **Target Tables**: `village_demographics` (Phase 2)
- **Limitations**: 2011 baseline requires growth projections for 2026.

---

## 3. Pradhan Mantri Gram Sadak Yojana (PMGSY)
- **Dataset Name**: PMGSY Rural Road Connectivity Dataset
- **Source Agency**: Ministry of Rural Development, Government of India
- **Official URL**: https://omms.nic.in
- **Purpose**: Assesses all-weather road connectivity and transport reach from villages to nearest commercial mandis.
- **Geographic Granularity**: Village / Habitation
- **Update Frequency**: Annual
- **Target Tables**: `village_connectivity` (Phase 2)
- **Limitations**: Tracks paved roads only; unpaved seasonal tracks require satellite verification.

---

## 4. MSME Udyam Registration Registry
- **Dataset Name**: Udyam MSME Registration Directory
- **Source Agency**: Ministry of Micro, Small and Medium Enterprises
- **Official URL**: https://udyamregistration.gov.in
- **Purpose**: Calculates registered competitor density and industrial enterprise growth rates per district.
- **Geographic Granularity**: District / PIN Code
- **Update Frequency**: Monthly
- **Target Tables**: `competitor_density` (Phase 2)
- **Limitations**: Unregistered informal micro-enterprises are not captured in Udyam.

---

## 5. Agmarknet Wholesale Mandi Prices
- **Dataset Name**: Agricultural Marketing Information Network (Agmarknet)
- **Source Agency**: Directorate of Marketing & Inspection (DMI), Ministry of Agriculture
- **Official URL**: https://agmarknet.gov.in
- **Purpose**: Tracks daily arrivals, minimum, maximum, and modal wholesale prices for agricultural & livestock commodities.
- **Geographic Granularity**: Mandi / District
- **Update Frequency**: Daily
- **Target Tables**: `mandi_prices` (Phase 2)
- **Limitations**: Coverage varies on local mandi holiday schedules.

---

## Data Provenance Classifications

All derived scores and metrics in VyapaarIQ map to one of these 5 trust classifications:

1. `OFFICIAL`: Verified directly from government/bank databases (e.g. Census, LGD, RBI interest rates).
2. `FIELD_VERIFIED`: Confirmed on-ground by trade surveyors or local panchayat telemetry.
3. `ESTIMATED`: Projected by financial stress models and demand formulas.
4. `USER_PROVIDED`: Input directly by the entrepreneur (e.g. available margin capital).
5. `AI_INFERRED`: Synthesized via explainable ML/NLP logic.
