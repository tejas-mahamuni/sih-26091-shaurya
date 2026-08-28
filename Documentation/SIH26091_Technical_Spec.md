# UdyamSaathi — Technical Specification
### SIH 2026 — PS26091: AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant
Pilot scope: Maharashtra, 2-3 districts, full-village coverage within those districts — architecture designed for zero-redesign extension to all India.

---

## PART 1: DATABASE SCHEMA (PostgreSQL + PostGIS)

### Design principles governing every table

1. **Codes are truth, names are display.** Every join uses LGD/Census/state codes, never free-text names. Names are stored for UI display only.
2. **Every table that can scale beyond your pilot already has the columns to do so.** Adding Karnataka later means loading rows, not altering schema.
3. **Every derived/calculated value is traceable to a source, a date, and a confidence level.** No number exists in the system without provenance.
4. **Raw ingested data and derived indicators live in separate tables.** Never overwrite a raw source table with a calculation.

### Schema diagram (logical)

```
states ──┬── districts ──┬── subdistricts (blocks) ──┬── villages ── locations (geom)
         │                │                           │
         │                │                           └── population_stats
         │                │
         │                ├── district_business_summary (Udyam)
         │                ├── district_price_index (CPI)
         │                └── rural_roads / rural_assets (PMGSY, geom)
         │
         └── state_economic_profile (SECC)

villages ──┬── businesses (geom, point-level competitors)
           ├── market_prices (AGMARKNET, commodity-level)
           ├── field_observations (crowd-verified data)
           └── feasibility_reports (final output cache)

category_config (dairy/grocery/tailoring rules — not geography-linked)
users / sessions (app-level, not geography-linked)
```

---

### 1.1 Reference / Identity Layer

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- for fuzzy name matching later

-- ============================================================
-- STATES — top of hierarchy, all-India from day one (36 rows, cheap to fully load)
-- ============================================================
CREATE TABLE states (
    state_code          VARCHAR(2)  PRIMARY KEY,      -- LGD state code, e.g. '27' = Maharashtra
    census_2011_code    VARCHAR(2),
    state_name          TEXT NOT NULL,
    state_name_normalized TEXT NOT NULL,               -- lowercase, trimmed, for fuzzy join
    is_union_territory  BOOLEAN DEFAULT FALSE,
    region              TEXT,                          -- North/South/East/West/Central/NE
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
-- Load ALL states now (cheap, 36 rows) even though you only use Maharashtra —
-- this is what makes "add a state" a data-load operation, not a schema change.

-- ============================================================
-- DISTRICTS — pilot: your 2-3 MH districts; structure supports all 700+ nationally
-- ============================================================
CREATE TABLE districts (
    district_lgd_code   VARCHAR(10) PRIMARY KEY,
    district_census_code VARCHAR(10),
    state_code          VARCHAR(2) NOT NULL REFERENCES states(state_code),
    district_name       TEXT NOT NULL,
    district_name_normalized TEXT NOT NULL,
    is_pilot_active     BOOLEAN DEFAULT FALSE,          -- flag: is this district in your active pilot?
    data_completeness_pct NUMERIC(5,2) DEFAULT 0,       -- % of villages with full data — dashboard metric
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_districts_state ON districts(state_code);
CREATE INDEX idx_districts_name_trgm ON districts USING gin (district_name_normalized gin_trgm_ops);

-- ============================================================
-- SUBDISTRICTS / BLOCKS
-- ============================================================
CREATE TABLE subdistricts (
    subdistrict_lgd_code VARCHAR(10) PRIMARY KEY,
    district_lgd_code    VARCHAR(10) NOT NULL REFERENCES districts(district_lgd_code),
    subdistrict_name     TEXT NOT NULL,
    subdistrict_name_normalized TEXT NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subdistricts_district ON subdistricts(district_lgd_code);

-- ============================================================
-- VILLAGES — the core identity node everything else attaches to
-- ============================================================
CREATE TABLE villages (
    village_lgd_code     VARCHAR(15) PRIMARY KEY,
    village_census_2011_code VARCHAR(15),
    subdistrict_lgd_code VARCHAR(10) NOT NULL REFERENCES subdistricts(subdistrict_lgd_code),
    district_lgd_code    VARCHAR(10) NOT NULL REFERENCES districts(district_lgd_code),  -- denormalized for fast queries
    state_code           VARCHAR(2)  NOT NULL REFERENCES states(state_code),            -- denormalized
    village_name         TEXT NOT NULL,
    village_name_normalized TEXT NOT NULL,
    local_body_code      VARCHAR(15),
    local_body_name      TEXT,
    is_pilot_active       BOOLEAN DEFAULT FALSE,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_villages_district ON villages(district_lgd_code);
CREATE INDEX idx_villages_subdistrict ON villages(subdistrict_lgd_code);
CREATE INDEX idx_villages_name_trgm ON villages USING gin (village_name_normalized gin_trgm_ops);

-- ============================================================
-- LOCATIONS — geospatial point layer (1:1 with villages, separated for clean geom indexing)
-- ============================================================
CREATE TABLE locations (
    location_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_lgd_code      VARCHAR(15) UNIQUE REFERENCES villages(village_lgd_code),
    latitude              DOUBLE PRECISION NOT NULL,
    longitude             DOUBLE PRECISION NOT NULL,
    geom                  GEOMETRY(Point, 4326) NOT NULL,
    coordinate_source     TEXT NOT NULL,               -- 'postal_office_proximity' | 'geonames' | 'field_verified'
    coordinate_accuracy   TEXT,                         -- 'high' | 'medium' | 'low'
    created_at             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_locations_geom ON locations USING GIST(geom);
-- Trigger to auto-populate geom from lat/lon on insert/update
CREATE OR REPLACE FUNCTION set_geom() RETURNS TRIGGER AS $$
BEGIN
    NEW.geom = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_set_geom BEFORE INSERT OR UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION set_geom();
```

### 1.2 Population & Economic Layer

```sql
-- ============================================================
-- POPULATION STATS — village-level where available, district fallback tracked explicitly
-- ============================================================
CREATE TABLE population_stats (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_lgd_code       VARCHAR(15) REFERENCES villages(village_lgd_code),
    district_lgd_code      VARCHAR(10) REFERENCES districts(district_lgd_code),
    geographic_level       TEXT NOT NULL,               -- 'village' | 'district' | 'state' — CRITICAL: always know your granularity
    source                 TEXT NOT NULL,                -- 'Census PCA 2011' | 'SECC 2011'
    source_year             INT NOT NULL,
    total_population        INT,
    male_population          INT,
    female_population        INT,
    total_households          INT,
    sex_ratio                 NUMERIC(6,2),
    data_quality              TEXT DEFAULT 'medium',      -- 'high'|'medium'|'low'
    created_at                 TIMESTAMPTZ DEFAULT NOW(),
    CHECK (geographic_level IN ('village','subdistrict','district','state'))
);
CREATE INDEX idx_popstats_village ON population_stats(village_lgd_code);
CREATE INDEX idx_popstats_district ON population_stats(district_lgd_code);

-- ============================================================
-- STATE ECONOMIC PROFILE — SECC-derived (income bands, deprivation, land ownership)
-- ============================================================
CREATE TABLE state_economic_profile (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code                VARCHAR(2) NOT NULL REFERENCES states(state_code),
    district_lgd_code          VARCHAR(10) REFERENCES districts(district_lgd_code),  -- NULL if state-level only
    geographic_level             TEXT NOT NULL,          -- 'state' | 'district' | 'village'
    total_households               INT,
    deprived_households_pct         NUMERIC(5,2),
    income_lt_5000_pct              NUMERIC(5,2),
    income_5k_10k_pct                NUMERIC(5,2),
    income_gt_10k_pct                 NUMERIC(5,2),
    literacy_rate_pct                  NUMERIC(5,2),
    land_ownership_pct                  NUMERIC(5,2),
    source                                TEXT DEFAULT 'SECC 2011',
    source_year                            INT DEFAULT 2011,
    created_at                              TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_econprofile_state ON state_economic_profile(state_code);
CREATE INDEX idx_econprofile_district ON state_economic_profile(district_lgd_code);

-- ============================================================
-- HCES PURCHASING POWER — regional benchmark, state-level
-- ============================================================
CREATE TABLE purchasing_power_bands (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code          VARCHAR(2) NOT NULL REFERENCES states(state_code),
    rural_urban          TEXT NOT NULL,                  -- 'rural' | 'urban'
    monthly_pcc_expenditure NUMERIC(10,2),                -- MPCE in rupees
    band_classification    TEXT,                          -- 'low' | 'medium' | 'high' — computed vs national avg
    source                   TEXT DEFAULT 'HCES 2023-24',
    survey_year                INT DEFAULT 2024,
    created_at                  TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 Connectivity & Infrastructure Layer

```sql
-- ============================================================
-- RURAL ASSETS — PMGSY facilities (markets, health, schools, veterinary, banks)
-- ============================================================
CREATE TABLE rural_assets (
    asset_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_type            TEXT NOT NULL,                 -- 'market'|'health'|'school'|'veterinary'|'bank'|'milk_collection_point'
    facility_category      TEXT,                          -- finer-grained sub-type
    asset_name               TEXT,
    district_lgd_code          VARCHAR(10) REFERENCES districts(district_lgd_code),
    latitude                     DOUBLE PRECISION,
    longitude                     DOUBLE PRECISION,
    geom                            GEOMETRY(Point, 4326),
    road_class                        TEXT,               -- connectivity metadata
    source                              TEXT DEFAULT 'PMGSY',
    source_date                          DATE,
    created_at                             TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_assets_geom ON rural_assets USING GIST(geom);
CREATE INDEX idx_assets_district ON rural_assets(district_lgd_code);
CREATE INDEX idx_assets_type ON rural_assets(asset_type);
CREATE TRIGGER trg_assets_geom BEFORE INSERT OR UPDATE ON rural_assets
    FOR EACH ROW EXECUTE FUNCTION set_geom();

-- ============================================================
-- RURAL ROADS — PMGSY line geometry, for connectivity scoring
-- ============================================================
CREATE TABLE rural_roads (
    road_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    road_name              TEXT,
    road_class               TEXT,                        -- 'all-weather' | 'seasonal' etc
    district_lgd_code          VARCHAR(10) REFERENCES districts(district_lgd_code),
    geom                          GEOMETRY(LineString, 4326),
    source                          TEXT DEFAULT 'PMGSY',
    source_date                      DATE,
    created_at                         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_roads_geom ON rural_roads USING GIST(geom);
CREATE INDEX idx_roads_district ON rural_roads(district_lgd_code);
```

### 1.4 Business, Competition & Pricing Layer

```sql
-- ============================================================
-- DISTRICT BUSINESS SUMMARY — Udyam/MSME, district-level aggregate (your CSV as-is)
-- ============================================================
CREATE TABLE district_business_summary (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_lgd_code       VARCHAR(10) NOT NULL REFERENCES districts(district_lgd_code),
    sector                    TEXT,                       -- if sector-level breakdown available
    micro_count                 INT DEFAULT 0,
    small_count                   INT DEFAULT 0,
    medium_count                    INT DEFAULT 0,
    manufacturing_count               INT DEFAULT 0,
    service_count                       INT DEFAULT 0,
    trading_count                        INT DEFAULT 0,
    total_registered                       INT DEFAULT 0,
    reference_date                           DATE,
    source                                     TEXT DEFAULT 'Udyam Registration',
    created_at                                   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_bizsummary_district ON district_business_summary(district_lgd_code);

-- ============================================================
-- BUSINESSES — point-level competitor data (best-quality tier, sparse initially)
-- Populated by: field survey > OSM Overpass > district disaggregation
-- ============================================================
CREATE TABLE businesses (
    business_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                      TEXT,
    category                    TEXT NOT NULL,             -- 'dairy_shop'|'grocery'|'tailor' etc, maps to category_config
    village_lgd_code               VARCHAR(15) REFERENCES villages(village_lgd_code),
    district_lgd_code                 VARCHAR(10) REFERENCES districts(district_lgd_code),
    latitude                             DOUBLE PRECISION,
    longitude                             DOUBLE PRECISION,
    geom                                    GEOMETRY(Point, 4326),
    registration_type                        TEXT,          -- 'formal_udyam'|'osm_mapped'|'field_survey'|'district_estimate'
    confidence                                 TEXT DEFAULT 'medium',  -- 'high'|'medium'|'low'
    source                                       TEXT NOT NULL,
    source_date                                    DATE,
    created_at                                       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_businesses_geom ON businesses USING GIST(geom);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_village ON businesses(village_lgd_code);
CREATE TRIGGER trg_businesses_geom BEFORE INSERT OR UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION set_geom();

-- ============================================================
-- MARKET PRICES — AGMARKNET commodity-level daily/periodic prices
-- ============================================================
CREATE TABLE market_prices (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code             VARCHAR(2) REFERENCES states(state_code),
    district_lgd_code         VARCHAR(10) REFERENCES districts(district_lgd_code),
    market_name                  TEXT,
    commodity                       TEXT NOT NULL,
    variety                           TEXT,
    price_date                          DATE NOT NULL,
    min_price                             NUMERIC(10,2),
    max_price                               NUMERIC(10,2),
    modal_price                               NUMERIC(10,2),
    arrival_quantity                            NUMERIC(12,2),
    source                                         TEXT DEFAULT 'AGMARKNET',
    created_at                                       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_prices_district_date ON market_prices(district_lgd_code, price_date);
CREATE INDEX idx_prices_commodity ON market_prices(commodity);

-- ============================================================
-- PRICE INDEX — MoSPI CPI, state/UT-level, monthly time series
-- ============================================================
CREATE TABLE price_index (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_code            VARCHAR(2) REFERENCES states(state_code),   -- NULL = all-India row
    division                 TEXT,                        -- CPI sub-group, e.g. 'Food and beverages'
    month_year                  DATE NOT NULL,             -- store as first-of-month
    general_index                  NUMERIC(8,2),
    inflation_rate_pct                NUMERIC(6,2),
    rural_urban_combined                 TEXT DEFAULT 'combined',  -- 'rural'|'urban'|'combined'
    source                                 TEXT DEFAULT 'MoSPI CPI',
    created_at                               TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(state_code, division, month_year, rural_urban_combined)
);
CREATE INDEX idx_priceindex_state_month ON price_index(state_code, month_year);
```

### 1.5 Crowd-Sourced Validation Layer (your genuine differentiator)

```sql
-- ============================================================
-- FIELD OBSERVATIONS — user/field-worker-submitted ground truth to fill data gaps
-- ============================================================
CREATE TABLE field_observations (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    village_lgd_code        VARCHAR(15) NOT NULL REFERENCES villages(village_lgd_code),
    category                   TEXT NOT NULL,
    observation_type              TEXT NOT NULL,           -- 'competitor_count'|'nearest_market'|'selling_price'|'road_usable_monsoon'
    observed_value_numeric           NUMERIC,
    observed_value_text                 TEXT,
    radius_km                             NUMERIC(5,2),     -- if applicable (e.g. "competitors within 5km")
    observer_type                           TEXT,           -- 'end_user'|'field_worker'|'verified_partner'
    observer_id                               UUID,          -- FK to users, nullable for anonymous
    observation_date                            DATE DEFAULT CURRENT_DATE,
    confidence                                    TEXT DEFAULT 'unverified', -- 'unverified'|'single_report'|'cross_verified'
    created_at                                      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fieldobs_village ON field_observations(village_lgd_code);
CREATE INDEX idx_fieldobs_type ON field_observations(observation_type);
```

### 1.6 Configuration & Application Layer

```sql
-- ============================================================
-- CATEGORY CONFIG — business-type rules, NOT hardcoded in application logic
-- ============================================================
CREATE TABLE category_config (
    category_code         TEXT PRIMARY KEY,               -- 'dairy'|'grocery'|'tailoring'
    display_name            TEXT NOT NULL,
    target_segments             JSONB,                     -- ["households","tea_shops","restaurants"]
    relevant_commodities           JSONB,                  -- ["milk","curd","ghee"]
    required_facilities               JSONB,               -- ["milk_collection_point","veterinary_facility"]
    risk_factors                         JSONB,             -- ["feed_cost","animal_health","seasonality"]
    competitor_categories                   JSONB,          -- ["dairy_shop","milk_vendor"]
    pricing_method                            TEXT,          -- 'local_price_plus_cost_margin'
    demand_formula_params                        JSONB,      -- {"purchase_freq_per_year": 1.5, "participation_rate": 0.55}
    threat_thresholds                              JSONB,    -- {"supply_chain_km": 15, "competitor_density_high": 5}
    is_active                                        BOOLEAN DEFAULT TRUE,
    created_at                                          TIMESTAMPTZ DEFAULT NOW(),
    updated_at                                            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS — application accounts (entrepreneurs, field workers, admins)
-- ============================================================
CREATE TABLE users (
    user_id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number             TEXT UNIQUE,
    name                        TEXT,
    preferred_language             TEXT DEFAULT 'en',
    role                              TEXT DEFAULT 'entrepreneur', -- 'entrepreneur'|'field_worker'|'admin'
    home_village_lgd_code               VARCHAR(15) REFERENCES villages(village_lgd_code),
    created_at                             TIMESTAMPTZ DEFAULT NOW(),
    last_active_at                            TIMESTAMPTZ
);

-- ============================================================
-- FEASIBILITY REPORTS — cached final output (input_hash enables caching)
-- ============================================================
CREATE TABLE feasibility_reports (
    report_id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   UUID REFERENCES users(user_id),
    village_lgd_code             VARCHAR(15) NOT NULL REFERENCES villages(village_lgd_code),
    business_category               TEXT NOT NULL REFERENCES category_config(category_code),
    radius_km                          NUMERIC(5,2) DEFAULT 10,
    margin_capital                        NUMERIC(12,2),      -- from Module 2 input, nullable
    input_hash                               TEXT NOT NULL,   -- hash(village+category+radius+capital) for cache lookup
    report_json                                JSONB NOT NULL, -- full structured output, doc's schema
    overall_feasibility_score                     NUMERIC(5,2),
    confidence_score                                 NUMERIC(5,2),
    status                                              TEXT DEFAULT 'completed', -- 'queued'|'processing'|'completed'|'failed'
    created_at                                             TIMESTAMPTZ DEFAULT NOW(),
    expires_at                                               TIMESTAMPTZ         -- cache invalidation
);
CREATE INDEX idx_reports_hash ON feasibility_reports(input_hash);
CREATE INDEX idx_reports_village ON feasibility_reports(village_lgd_code);
CREATE INDEX idx_reports_user ON feasibility_reports(user_id);

-- ============================================================
-- FINANCIAL CALCULATIONS — Module 2 output log
-- ============================================================
CREATE TABLE financial_calculations (
    calc_id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                   UUID REFERENCES users(user_id),
    margin_capital               NUMERIC(12,2) NOT NULL,
    project_cost                    NUMERIC(12,2) NOT NULL,
    max_loan_amount                    NUMERIC(12,2) NOT NULL,
    scheme_selected                       TEXT NOT NULL,      -- 'Micro Finance Scheme'|'Term Loan Scheme'
    interest_rate                            NUMERIC(5,2),
    tenure_years                                INT,
    moratorium_months                              INT,
    emi_amount                                        NUMERIC(12,2),
    created_at                                           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DATA SOURCE REGISTRY — the "data dictionary" the doc mandates
-- ============================================================
CREATE TABLE data_source_registry (
    source_id              TEXT PRIMARY KEY,               -- 'census_pca_2011', 'agmarknet', etc
    source_name               TEXT NOT NULL,
    meaning                      TEXT,
    geographic_level                TEXT,
    unit                                TEXT,
    update_frequency                       TEXT,
    limitations                               TEXT,
    official_url                                 TEXT,
    last_ingested_at                                TIMESTAMPTZ
);
```

### 1.7 Scalability notes baked into this schema

- **Adding a new state**: insert into `states` (if not already present from your full 36-row seed), bulk-insert `districts`/`subdistricts`/`villages` from that state's LGD file, run the same ingestion pipeline. Zero `ALTER TABLE` statements needed.
- **Partitioning path for scale**: once you're at all-India village count (~650,000), partition `locations`, `population_stats`, and `feasibility_reports` by `state_code` (Postgres native declarative partitioning) — schema-compatible change, not a rewrite.
- **`geographic_level` columns everywhere**: this is what lets the same table hold village-level data for well-covered districts and district-level fallback data for others, without ever silently conflating the two (the doc's core "never silently replace missing village data with district averages" rule is enforced structurally, not just by convention).

---

## PART 2: PRODUCTION SYSTEM ARCHITECTURE

### 2.1 Full architecture diagram

```
                                   ┌─────────────────────────┐
                                   │      CLIENTS            │
                                   │  React Web (Vercel)     │
                                   │  Future: React Native   │
                                   └───────────┬─────────────┘
                                               │ HTTPS
                                   ┌───────────▼─────────────┐
                                   │   CDN / Edge (Vercel)   │
                                   │   Static assets, caching│
                                   └───────────┬─────────────┘
                                               │
                                   ┌───────────▼─────────────┐
                                   │     API GATEWAY          │
                                   │     FastAPI (Render)     │
                                   │  - Auth middleware (JWT) │
                                   │  - Rate limiting          │
                                   │  - Request validation     │
                                   │    (Pydantic)             │
                                   └──┬────────────────────┬──┘
                                      │                    │
              ┌───────────────────────┤                    ├───────────────────────┐
              │                       │                    │                       │
   ┌──────────▼─────────┐  ┌──────────▼─────────┐  ┌──────▼──────────┐  ┌─────────▼────────┐
   │  Location Service   │  │  Feasibility        │  │  Financial       │  │  Auth Service     │
   │  - LGD resolver      │  │  Orchestrator        │  │  Calculator      │  │  - JWT issuance   │
   │  - Fuzzy search       │  │  - Coordinates       │  │  Service (sync,  │  │  - OTP/phone auth │
   │  - Geocode lookup      │  │    the pipeline      │  │  deterministic,  │  └───────────────────┘
   └───────────┬─────────────┘  └──────────┬────────────┘  no queue needed) │
               │                            │              └──────────────────┘
               │                 ┌──────────▼──────────────┐
               │                 │   JOB QUEUE (Redis +      │
               │                 │   FastAPI BackgroundTasks │
               │                 │   or Celery if scale needs)│
               │                 └──────────┬──────────────┘
               │                            │
               │        ┌───────────────────┼───────────────────┬─────────────────────┐
               │        │                   │                   │                     │
     ┌─────────▼──┐ ┌────▼─────────┐ ┌───────▼────────┐ ┌────────▼─────────┐ ┌─────────▼────────┐
     │ Population  │ │ Geospatial   │ │ Competition &   │ │ Threat/SWOT/     │ │ AI Explanation    │
     │ Processor   │ │ Processor    │ │ Pricing Engine  │ │ Scoring Engine    │ │ Service           │
     │ (Census/    │ │ (PostGIS     │ │ (Udyam/         │ │ (pure rules,      │ │ (Groq/Gemini,     │
     │  SECC)      │ │  radius calc)│ │  AGMARKNET)     │ │  no external call)│ │  JSON-only output,│
     │             │ │              │ │                  │ │                   │ │  Pydantic-validated)│
     └──────┬──────┘ └──────┬───────┘ └────────┬─────────┘ └─────────┬─────────┘ └─────────┬─────────┘
            │               │                   │                    │                     │
            └───────────────┴───────────────────┴────────────────────┴─────────────────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │   Report Composer     │
                                    │   - Assembles final    │
                                    │     JSON per doc schema│
                                    │   - Writes to cache     │
                                    │   - Triggers PDF export │
                                    └──────────┬──────────┘
                                               │
              ┌────────────────────────────────┼────────────────────────────────┐
              │                                │                                │
   ┌──────────▼──────────┐          ┌──────────▼──────────┐         ┌──────────▼──────────┐
   │  PostgreSQL +        │          │  Redis                │         │  Object Storage       │
   │  PostGIS              │          │  - Query result cache  │         │  (Supabase Storage /   │
   │  (Supabase)            │          │  - Session store        │         │   S3-compatible)        │
   │  Primary datastore      │          │  - Job status tracking   │         │  Generated PDFs          │
   └─────────────────────────┘          └─────────────────────────┘         └───────────────────────────┘

   ┌──────────────────────────────────────────────────────────────────────────────────────┐
   │  SCHEDULED INGESTION LAYER (separate from request path — runs independently)           │
   │  Cron jobs (or Celery Beat) → LGD sync │ Census refresh │ PMGSY sync │                  │
   │  Udyam sync │ AGMARKNET daily pull │ CPI monthly pull │ → writes to Postgres tables      │
   └──────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Request lifecycle (a real user's journey through the system)

1. **Client → API Gateway**: user submits `{village_lgd_code, category, radius_km, margin_capital}`
2. **Auth middleware**: validates JWT (or allows anonymous with rate-limit-by-IP for MVP)
3. **Feasibility Orchestrator**: computes `input_hash`, checks `feasibility_reports` cache in Postgres first — **cache hit returns in <100ms, no recomputation**
4. **Cache miss**: orchestrator returns `analysis_id` immediately (HTTP 202), pushes job to Redis queue
5. **Background worker** picks up job, runs the 5-stage pipeline (population → geospatial → competition/pricing → scoring → AI explanation) — each stage writes progress state to Redis
6. **Client polls or subscribes via SSE/WebSocket** to `/feasibility/{id}/events` for live progress (`location_verified`, `population_loaded`, etc. — exactly the doc's job-state list)
7. **Final report** written to `feasibility_reports.report_json`, cached with `expires_at` (recommend 30 days — underlying gov data doesn't change that fast)
8. **Client fetches completed result**, renders report UI; PDF export is a separate on-demand endpoint that reads the cached JSON (no recomputation)

### 2.3 Caching strategy (Redis) — three distinct cache layers

| Cache | Key | TTL | Purpose |
|---|---|---|---|
| Report cache | `report:{input_hash}` | 30 days | Avoid recomputing identical village+category+radius+capital requests |
| Geo query cache | `geo:{village_code}:{radius}` | 90 days | Population/asset radius queries are expensive PostGIS calls, reused across categories for the same village |
| Session/job state | `job:{analysis_id}:status` | 1 hour (auto-expire after completion) | Live progress tracking for SSE stream |

### 2.4 Security & user-level architecture

- **Auth**: Phone-number + OTP (via free-tier SMS provider like MSG91's trial, or start with simple email/password for hackathon demo) → JWT with role claim (`entrepreneur`/`field_worker`/`admin`)
- **Role-based access**: `field_worker` role can write to `field_observations`; `admin` role can view `data_source_registry` freshness dashboard; `entrepreneur` (default) can only create/read their own `feasibility_reports`
- **Rate limiting**: `slowapi` (FastAPI-native) — protect both your own API and any downstream free-tier API quotas (Groq, AGMARKNET) from being exhausted by one user's activity
- **Input validation**: every API boundary uses Pydantic schemas — this is also your defense against the "raw user input → AI-generated feasibility claim" anti-pattern the doc explicitly warns against; user input never reaches the LLM directly, only validated, structured facts do

---

## PART 3: SYSTEM DESIGN — HACKATHON PROTOTYPE → REAL PRODUCT

### 3.1 What changes going from prototype to product

| Dimension | Hackathon prototype (your Sep 20 target) | Production product (roadmap) |
|---|---|---|
| Geographic coverage | 2-3 Maharashtra districts | All-India, phased state-by-state rollout |
| Job queue | FastAPI `BackgroundTasks` (in-process) | Celery + Redis (distributed workers) |
| Competitor data | District Udyam + limited OSM | Field-worker network + verified partner data + OSM |
| Auth | Simple/anonymous | Full OTP, Aadhaar-linked eKYC optional (for loan-application handoff) |
| Data freshness | Manual one-time ETL load | Scheduled ingestion (cron → Celery Beat), freshness dashboard |
| Hosting | Free tiers (Render/Vercel/Supabase) | Paid tiers with SLA, possibly government cloud (MeghRaj/NIC) for a ministry-backed product |
| Language support | English + 1 regional language (Hindi/Marathi) | Full 12+ scheduled language support |
| Validation | Manual spot-checks on ~20 villages | Formal accuracy audit against real business outcomes (partnership with SCAs/lending agencies) |
| Report distribution | Web app only | WhatsApp bot integration (the doc explicitly mentions this), SMS fallback for feature phones |

### 3.2 Product roadmap phases (for your pitch's "future scope" section)

**Phase 1 (Hackathon/MVP)**: Maharashtra, 2-3 districts, 3 categories, web-only, manual data refresh
**Phase 2 (Pilot deployment)**: Full Maharashtra, 6-8 categories, WhatsApp bot, field-worker validation network launched
**Phase 3 (Multi-state)**: 5 states, automated ingestion pipelines, partnership with State Channelizing Agencies for real loan-application handoff (this closes the loop from "advisory" to "actual scheme application" — a strong differentiator if you mention it as vision)
**Phase 4 (National)**: All-India, integrated with NBCFDC/NSFDC systems directly (given MoSJE is the requesting ministry, this is the realistic end-state they'd actually want)

### 3.3 Feedback loop design (what makes this a "real product," not a one-shot report generator)

- `field_observations` table exists specifically so real user corrections feed back into data quality over time
- Track **report → actual business outcome** (did the entrepreneur proceed? did the business survive 1 year?) via a simple follow-up survey mechanism — this is the seed of a genuine supervised-learning dataset for a future, real ML model (directly addressing the "Phase 2 roadmap" gap we flagged earlier when discussing the scoring model)
- `data_source_registry.last_ingested_at` powers an internal freshness dashboard — a real product needs to know when Census/AGMARKNET/Udyam data has gone stale, not just trust it forever

---

## PART 4: TECH STACK ARCHITECTURE (implementation-ready reference)

### 4.1 Full stack table

| Layer | Technology | Why |
|---|---|---|
| **Frontend framework** | React 18 (Vite) | Fast dev, huge ecosystem, team likely already knows it |
| **Styling** | Tailwind CSS | Rapid UI, consistent design tokens |
| **Maps** | Leaflet.js + OpenStreetMap tiles | Free, no API key, sufficient for pilot |
| **Charts** | Recharts | SWOT/score visualizations, convergence-style displays if reused from other work |
| **State management** | React Query (TanStack Query) | Handles the async job-polling pattern (analysis_id → status → result) cleanly, built-in caching |
| **Real-time updates** | Server-Sent Events (native `EventSource`) | Simpler than WebSockets for one-directional progress streaming; use `socket.io` only if you need bidirectional later |
| **i18n** | `react-i18next` | Multilingual requirement from the PS itself |
| **Voice input** | Web Speech API (browser-native) | Free, no backend needed, good for low-literacy UX |
| **Backend framework** | FastAPI (Python 3.11+) | Async-native, Pydantic validation built in, matches the doc's spec exactly |
| **ORM** | SQLAlchemy 2.0 (async) + Alembic for migrations | Standard, mature, works cleanly with PostGIS via GeoAlchemy2 |
| **Geospatial** | PostGIS + GeoAlchemy2 + Shapely (Python) | Core spatial calculations |
| **Data processing (ETL)** | Pandas + GeoPandas | Cleaning/transforming government source files |
| **Job queue (MVP)** | FastAPI `BackgroundTasks` | Sufficient at pilot scale, zero extra infra |
| **Job queue (scale-up path)** | Celery + Redis | Swap in when concurrent load requires true distributed workers — same task-function signatures, minimal rewrite |
| **Cache / session store** | Redis (Upstash free tier, or Render's free Redis) | Report cache, geo-query cache, job status |
| **Database** | PostgreSQL 15+ with PostGIS extension (Supabase) | As justified in Part 1 |
| **Object storage** | Supabase Storage (S3-compatible) | Generated PDF reports |
| **AI/LLM** | Groq API (free tier, Llama models) primary, Gemini free tier fallback | Quota-aware routing pattern (as designed earlier in this project) |
| **AI validation** | Pydantic schema validation on every LLM response | Enforces the doc's "AI explains, never invents" rule programmatically |
| **PDF generation** | WeasyPrint (Python, HTML→PDF) or `reportlab` | Free, server-side, matches FastAPI stack |
| **Auth** | `python-jose` (JWT) + simple OTP via free-tier SMS (or email/password for demo) | Lightweight, no vendor lock-in |
| **Rate limiting** | `slowapi` | Protects both your API and downstream free-tier quotas |
| **Testing** | `pytest` + `pytest-asyncio` (backend), `Vitest` + `React Testing Library` (frontend) | Matches the doc's testing strategy section |
| **Hosting — frontend** | Vercel | Free tier, auto-deploy from GitHub |
| **Hosting — backend** | Render | Free tier, supports FastAPI + background workers |
| **Hosting — DB** | Supabase | Free Postgres+PostGIS, generous limits for pilot |
| **CI/CD** | GitHub Actions | Free for public/small repos, auto-test on PR |
| **Monitoring (basic)** | Render's built-in logs + Sentry free tier | Error tracking without extra infra cost |

### 4.2 Repository structure

```
udyamsaathi/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── locations.py       # location search/verify endpoints
│   │   │   │   ├── feasibility.py     # analyze/status/compare/pdf endpoints
│   │   │   │   └── financial.py       # Module 2 calculator endpoint
│   │   ├── services/
│   │   │   ├── location_service.py
│   │   │   ├── population_processor.py
│   │   │   ├── geospatial_processor.py
│   │   │   ├── competition_processor.py
│   │   │   ├── pricing_engine.py
│   │   │   ├── opportunity_engine.py
│   │   │   ├── threat_engine.py
│   │   │   ├── swot_engine.py
│   │   │   ├── scoring_engine.py
│   │   │   └── ai_explanation_service.py
│   │   ├── models/                    # SQLAlchemy models (mirrors Part 1 schema)
│   │   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── cache.py               # Redis client
│   │   └── workers/
│   │       └── feasibility_worker.py  # background job logic
│   ├── ingestion/                     # ETL scripts, run independently of API
│   │   ├── load_lgd.py
│   │   ├── load_census.py
│   │   ├── load_pmgsy.py
│   │   ├── load_udyam.py
│   │   ├── load_agmarknet.py
│   │   └── load_cpi.py
│   ├── alembic/                       # DB migrations
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/                     # 9-screen flow from the doc
│   │   ├── components/
│   │   ├── hooks/                     # useLocationSearch, useFeasibilityAnalysis, etc
│   │   ├── i18n/
│   │   └── api/                       # API client layer
│   └── package.json
├── data/                              # raw source files (gitignored if large)
└── docs/
    └── data_source_registry.md        # human-readable version of the DB table
```

### 4.3 Environment/config checklist before Day 1 coding

- [ ] Supabase project created, PostGIS extension enabled
- [ ] Redis instance provisioned (Upstash or Render)
- [ ] Groq + Gemini free-tier API keys obtained
- [ ] GitHub repo + Actions CI configured
- [ ] Vercel + Render projects linked to repo
- [ ] `.env.example` committed with all required variables documented (never commit real keys)

---

*This document is your build reference — follow Part 1 (schema) → Part 4.3 (env setup) → the implementation roadmap phases from the earlier conversation, in that order.*
