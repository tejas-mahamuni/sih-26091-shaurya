# Nashik Pilot Data Coverage Matrix & Integrity Audit

This document records the exact geographic coverage, dataset inventory, and verification status of all datasets populated in PostgreSQL for **VyapaarIQ — Step 2.5 Audit**.

---

## 📊 Geographic Coverage Matrix

| Dataset | Geographic Level | Expected Nashik Count | Actual DB Count | % Coverage | Official Source | Source Date | Status |
|---------|------------------|----------------------:|----------------:|-----------:|-----------------|-------------|--------|
| **LGD State** | State | 1 (Maharashtra) | 1 | **100.0%** | LGD India | 2024-06 | **COMPLETE** |
| **LGD District** | District | 1 (Nashik) | 1 | **100.0%** | LGD India | 2024-06 | **COMPLETE** |
| **LGD Subdistricts** | Taluka | 15 (All Talukas) | 15 | **100.0%** | LGD India | 2024-06 | **COMPLETE** |
| **LGD Villages** | Village | ~1,930 | 10 | **0.52%** | LGD India | 2024-06 | **PILOT SUBSET** |
| **Census Demographics** | District | 1 | 1 | **100.0%** | Census 2011 PCA | 2011-03 | **COMPLETE** |
| **Census Demographics** | Taluka | 15 | 15 | **100.0%** | Census 2011 PCA | 2011-03 | **COMPLETE** |
| **Census Demographics** | Village | ~1,930 | 4 | **0.21%** | Census 2011 PCA | 2011-03 | **PILOT SUBSET** |
| **Market Prices** | APMC Mandi | ~12 APMCs | 5 APMCs | **41.6%** | Agmarknet DMI | 2026-08-28 | **PILOT SUBSET** |
| **Businesses** | Enterprise Node | ~45,000 MSMEs | 5 Nodes | **< 0.1%** | Udyam MSME Registry | 2024-06 | **PILOT SUBSET** |
| **Infrastructure** | Facility Feature | ~500 Facilities | 9 Features | **1.8%** | PMGSY & NABARD | 2024-01 | **PILOT SUBSET** |

---

## 🏛️ Verification of 15 Nashik Subdistricts (Talukas)

All 15 subdistricts of Nashik district exist in PostgreSQL with valid LGD hierarchy parent bindings (`district_lgd_code: 497`):

1. `Baglan (Satana)` (LGD: `4173`) — 0 villages in pilot subset
2. `Chandwad` (LGD: `4177`) — 0 villages in pilot subset
3. `Deola` (LGD: `4171`) — 0 villages in pilot subset
4. `Dindori` (LGD: `4179`) — 0 villages in pilot subset
5. `Igatpuri` (LGD: `4185`) — 3 village nodes (`Ghoti Budruk`)
6. `Kalwan` (LGD: `4176`) — 0 villages in pilot subset
7. `Malegaon` (LGD: `4174`) — 6 village nodes (`Dyane`, `Zadgao`)
8. `Nandgaon` (LGD: `4172`) — 0 villages in pilot subset
9. `Nashik` (LGD: `4181`) — 9 village nodes (`Adgaon`, `Girnare`, `Makhmalabad`)
10. `Niphad` (LGD: `4182`) — 6 village nodes (`Lasalgaon`, `Pimpalgaon Baswant`)
11. `Peint` (LGD: `4178`) — 0 villages in pilot subset
12. `Sinnar` (LGD: `4184`) — 6 village nodes (`Musalgaon MIDC`, `Wavi`)
13. `Surgana` (LGD: `4175`) — 0 villages in pilot subset
14. `Trimbak` (LGD: `4180`) — 0 villages in pilot subset
15. `Yeola` (LGD: `4183`) — 0 villages in pilot subset

---

## 🏷️ Data Quality Classifications & Temporal Status

| Table Name | Source Type | Temporal Status | Geographic Granularity | Provenance Integrity |
|------------|-------------|-----------------|------------------------|----------------------|
| `states` | `OFFICIAL` | `HISTORICAL` | STATE | 100% |
| `districts` | `OFFICIAL` | `HISTORICAL` | DISTRICT | 100% |
| `subdistricts` | `OFFICIAL` | `HISTORICAL` | TALUKA | 100% |
| `villages` | `OFFICIAL` | `HISTORICAL` | VILLAGE | 100% |
| `population_statistics` | `OFFICIAL` | `HISTORICAL` (2011) | DISTRICT / TALUKA / VILLAGE | 100% |
| `market_prices` | `OFFICIAL` | `PERIODIC` (2026-08-28) | APMC MANDI | 100% |
| `businesses` | `OFFICIAL` | `HISTORICAL` (2024-06) | TALUKA / POINT | 100% |
| `infrastructure` | `OFFICIAL` | `HISTORICAL` (2024-01) | TALUKA / POINT | 100% |
