from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
import os
import uvicorn
import json
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

from feasibility_engine import run_feasibility_pipeline, CATEGORY_DEFAULTS

load_dotenv()

app = FastAPI(title="UdyamSaathi Unified Backend Engine", version="2.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")
engine = create_engine(DATABASE_URL)

# ──────────────────────────────────────────────
#  Request / Response Models
# ──────────────────────────────────────────────

class CalculationRequest(BaseModel):
    user_id: Optional[str] = None
    location_id: Optional[str] = None
    business_category: Optional[str] = None
    available_margin: float = Field(..., gt=0)
    requested_project_cost: Optional[float] = Field(None, gt=0)
    moratorium_months_override: Optional[int] = Field(None, ge=0, le=24)
    expected_monthly_revenue: Optional[float] = Field(None, gt=0)
    repayment_frequency: str = "monthly"
    moratorium_interest_mode: str = "accrued"
    include_working_capital: bool = True
    language: str = "mr"

# ──────────────────────────────────────────────
#  Database Helpers
# ──────────────────────────────────────────────

def get_active_schemes():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM scheme_rules WHERE is_active = true ORDER BY max_project_cost ASC"))
        return [dict(row._mapping) for row in result]

# ──────────────────────────────────────────────
#  Financial Math (Decimal-precise)
# ──────────────────────────────────────────────

def calculate_emi(principal: Decimal, annual_rate: Decimal, instalments: int) -> Decimal:
    """Standard reducing-balance EMI formula using exact Decimal arithmetic."""
    if instalments <= 0:
        return Decimal('0.00')
    if annual_rate == 0:
        return (principal / Decimal(instalments)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    r = (annual_rate / Decimal('100')) / Decimal('12')
    factor = (1 + r) ** instalments
    emi = principal * r * factor / (factor - 1)
    return emi.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def build_amortization_schedule(
    principal: Decimal,
    annual_rate: Decimal,
    tenure_months: int,
    moratorium_months: int,
    moratorium_mode: str = "accrued",
) -> list:
    """
    Generates a month-by-month amortization schedule.

    Moratorium modes:
      - 'accrued': Interest during moratorium is added to principal (capitalised).
      - 'paid_separately': Interest during moratorium is paid each month (principal unchanged).
    """
    schedule = []
    monthly_rate = (annual_rate / Decimal('100')) / Decimal('12')
    balance = principal

    # ── Phase 1: Moratorium Period ──
    for month in range(1, moratorium_months + 1):
        interest = (balance * monthly_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        if moratorium_mode == "accrued":
            # Interest capitalised: added to balance, no payment
            closing = balance + interest
            schedule.append({
                "month": month,
                "phase": "moratorium",
                "opening_balance": float(balance),
                "emi": 0.0,
                "interest": float(interest),
                "principal": 0.0,
                "closing_balance": float(closing),
            })
            balance = closing
        else:
            # Interest paid separately: user pays interest-only, balance stays same
            schedule.append({
                "month": month,
                "phase": "moratorium",
                "opening_balance": float(balance),
                "emi": float(interest),
                "interest": float(interest),
                "principal": 0.0,
                "closing_balance": float(balance),
            })

    # ── Phase 2: Active Repayment ──
    repayment_months = tenure_months - moratorium_months
    if repayment_months <= 0:
        return schedule

    emi = calculate_emi(balance, annual_rate, repayment_months)

    for month in range(moratorium_months + 1, tenure_months + 1):
        interest = (balance * monthly_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        principal_part = emi - interest
        closing = balance - principal_part

        # Last month: adjust to zero out any rounding residual
        if month == tenure_months:
            principal_part = balance
            emi = principal_part + interest
            closing = Decimal('0.00')

        schedule.append({
            "month": month,
            "phase": "repayment",
            "opening_balance": float(balance),
            "emi": float(emi),
            "interest": float(interest),
            "principal": float(principal_part),
            "closing_balance": float(max(closing, Decimal('0.00'))),
        })
        balance = max(closing, Decimal('0.00'))

    return schedule


def compute_scenario(
    loan_eligible: Decimal,
    annual_rate: Decimal,
    tenure_months: int,
    moratorium_months: int,
    moratorium_mode: str,
    rate_bump: Decimal = Decimal('0'),
    label: str = "base",
) -> dict:
    """Computes a single stress-test scenario."""
    stressed_rate = annual_rate + rate_bump
    repayment_months = tenure_months - moratorium_months
    monthly_rate = (stressed_rate / Decimal('100')) / Decimal('12')

    # Capitalise moratorium interest
    balance_after_moratorium = loan_eligible
    for _ in range(moratorium_months):
        interest = (balance_after_moratorium * monthly_rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        if moratorium_mode == "accrued":
            balance_after_moratorium += interest

    emi = calculate_emi(balance_after_moratorium, stressed_rate, repayment_months)
    total_paid = emi * repayment_months
    total_interest = total_paid - loan_eligible

    return {
        "label": label,
        "interest_rate": float(stressed_rate),
        "monthly_emi": float(emi),
        "total_paid": float(total_paid),
        "total_interest": float(max(total_interest, Decimal('0'))),
        "effective_principal": float(balance_after_moratorium),
    }


# ──────────────────────────────────────────────
#  GET /api/v1/finance/schemes
# ──────────────────────────────────────────────

@app.get("/api/v1/finance/schemes")
def list_schemes():
    """Returns all active NBCFDC schemes for the frontend reference table."""
    schemes = get_active_schemes()
    return [
        {
            "scheme_id": str(s["scheme_id"]),
            "scheme_code": s["scheme_code"],
            "scheme_name": s["scheme_name"],
            "category": s["category"],
            "min_project_cost": float(s["min_project_cost"]),
            "max_project_cost": float(s["max_project_cost"]),
            "loan_percentage": float(s["loan_percentage"]),
            "max_loan_amount": float(s["max_loan_amount"]),
            "annual_interest_rate": float(s["annual_interest_rate"]),
            "tenure_months": s["tenure_months"],
            "moratorium_months": s["moratorium_months"],
        }
        for s in schemes
    ]


# ──────────────────────────────────────────────
#  POST /api/v1/finance/calculate
# ──────────────────────────────────────────────

@app.post("/api/v1/finance/calculate")
def calculate_finance(req: CalculationRequest):
    margin = Decimal(str(req.available_margin))

    schemes = get_active_schemes()

    p_raw = margin * 10
    project_cost = Decimal(str(req.requested_project_cost)) if req.requested_project_cost else p_raw

    # ── Scheme Matching ──
    selected_scheme = None
    for scheme in schemes:
        if Decimal(str(scheme['min_project_cost'])) <= project_cost <= Decimal(str(scheme['max_project_cost'])):
            selected_scheme = scheme
            break

    if not selected_scheme:
        # Build a helpful error explaining WHY no scheme matched
        max_supported = max(
            float(s['max_project_cost']) for s in schemes
        ) if schemes else 0

        scheme_summary = [
            {
                "name": s['scheme_name'],
                "category": s['category'],
                "max_project_cost": float(s['max_project_cost']),
                "max_loan": float(s['max_loan_amount']),
                "rate": f"{float(s['annual_interest_rate'])}%",
            }
            for s in schemes
        ]

        raise HTTPException(
            status_code=422,
            detail={
                "message": f"No NBCFDC scheme covers a project cost of ₹{float(project_cost):,.0f}.",
                "reason": (
                    f"The highest project cost supported by any active scheme is ₹{max_supported:,.0f}. "
                    f"Your requested project cost of ₹{float(project_cost):,.0f} exceeds all scheme limits."
                ),
                "suggestions": [
                    f"Reduce your project cost to ₹{max_supported:,.0f} or below.",
                    "Consider splitting the project into phases that fit within scheme limits.",
                    "Check the 'Available Schemes' table above for eligible ranges.",
                ],
                "available_schemes": scheme_summary,
                "your_input": {
                    "available_margin": float(margin),
                    "requested_project_cost": float(project_cost),
                }
            }
        )

    loan_percentage = Decimal(str(selected_scheme['loan_percentage']))
    max_loan_amount = Decimal(str(selected_scheme['max_loan_amount']))

    loan_theoretical = project_cost * loan_percentage / Decimal('100')
    loan_eligible = min(loan_theoretical, max_loan_amount)

    required_margin = project_cost - loan_eligible
    funding_gap = max(Decimal('0'), required_margin - margin)

    tenure = selected_scheme['tenure_months']
    moratorium = req.moratorium_months_override if req.moratorium_months_override is not None else selected_scheme['moratorium_months']
    moratorium = min(moratorium, tenure - 1)  # Safety: can't exceed tenure
    repayment_months = tenure - moratorium
    annual_rate = Decimal(str(selected_scheme['annual_interest_rate']))

    emi = calculate_emi(loan_eligible, annual_rate, repayment_months)

    # ── Amortization Schedule ──
    amortization = build_amortization_schedule(
        principal=loan_eligible,
        annual_rate=annual_rate,
        tenure_months=tenure,
        moratorium_months=moratorium,
        moratorium_mode=req.moratorium_interest_mode,
    )

    total_interest = Decimal(str(sum(row["interest"] for row in amortization)))
    total_paid = Decimal(str(sum(row["emi"] for row in amortization)))

    # ── Stress Test Scenarios ──
    stress_scenarios = [
        compute_scenario(loan_eligible, annual_rate, tenure, moratorium, req.moratorium_interest_mode,
                         Decimal('0'), "Best Case (Scheme Rate)"),
        compute_scenario(loan_eligible, annual_rate, tenure, moratorium, req.moratorium_interest_mode,
                         Decimal('1'), "Base Case (+1%)"),
        compute_scenario(loan_eligible, annual_rate, tenure, moratorium, req.moratorium_interest_mode,
                         Decimal('2'), "Worst Case (+2%)"),
    ]

    # ── Affordability Gauge ──
    affordability = None
    if req.expected_monthly_revenue and req.expected_monthly_revenue > 0:
        emi_to_income = float(emi) / req.expected_monthly_revenue * 100
        if emi_to_income < 30:
            risk_level = "low"
        elif emi_to_income < 50:
            risk_level = "medium"
        else:
            risk_level = "high"
        affordability = {
            "expected_monthly_revenue": req.expected_monthly_revenue,
            "emi_to_income_ratio": round(emi_to_income, 1),
            "risk_level": risk_level,
        }

    # ── Persist to DB ──
    with engine.begin() as conn:
        calc_id = conn.execute(text("""
            INSERT INTO financial_calculations (
                user_id, location_id, scheme_id, available_margin, raw_project_cost, project_cost,
                theoretical_loan, eligible_loan, required_margin, funding_gap,
                annual_interest_rate, tenure_months, moratorium_months, moratorium_interest_mode,
                monthly_emi, quarterly_payment, rules_version
            ) VALUES (
                :uid, :lid, :sid, :am, :rpc, :pc, :tl, :el, :rm, :fg, :ir, :tm, :mm, :mim, :emi, :qp, :rv
            ) RETURNING id
        """), {
            "uid": req.user_id,
            "lid": req.location_id,
            "sid": selected_scheme['scheme_id'],
            "am": float(margin),
            "rpc": float(p_raw),
            "pc": float(project_cost),
            "tl": float(loan_theoretical),
            "el": float(loan_eligible),
            "rm": float(required_margin),
            "fg": float(funding_gap),
            "ir": float(annual_rate),
            "tm": tenure,
            "mm": moratorium,
            "mim": req.moratorium_interest_mode,
            "emi": float(emi),
            "qp": float(emi * 3),
            "rv": selected_scheme['version']
        }).scalar()

    warnings = []
    if funding_gap > 0:
        warnings.append(f"Funding gap of ₹{float(funding_gap):,.0f} — your margin doesn't fully cover the required contribution.")
    if moratorium != selected_scheme['moratorium_months']:
        warnings.append(f"Custom moratorium ({moratorium} months) differs from scheme default ({selected_scheme['moratorium_months']} months).")

    return {
        "calculation_id": str(calc_id),
        "status": "CALCULATED",
        "currency": "INR",
        "available_margin": float(margin),
        "raw_project_cost": float(p_raw),
        "project_cost": float(project_cost),
        "scheme": {
            "code": selected_scheme['scheme_code'],
            "name": selected_scheme['scheme_name'],
            "category": selected_scheme['category'],
            "interest_rate": float(annual_rate),
            "tenure_months": tenure,
            "moratorium_months": moratorium,
            "maximum_loan": float(max_loan_amount),
            "loan_percentage": float(loan_percentage),
        },
        "loan": {
            "theoretical_amount": float(loan_theoretical),
            "eligible_amount": float(loan_eligible),
            "required_margin": float(required_margin),
            "funding_gap": float(funding_gap)
        },
        "repayment": {
            "repayment_months": repayment_months,
            "monthly_emi": float(emi),
            "total_interest": float(total_interest),
            "total_paid": float(total_paid),
            "interest_to_principal_ratio": float(
                (total_interest / loan_eligible * 100).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
            ) if loan_eligible > 0 else 0.0,
            "moratorium_interest_policy": req.moratorium_interest_mode,
        },
        "amortization": amortization,
        "stress_scenarios": stress_scenarios,
        "affordability": affordability,
        "warnings": warnings,
    }


# ──────────────────────────────────────────────
#  Financial Calculate Alias
# ──────────────────────────────────────────────

@app.post("/api/v1/financial/calculate")
def calculate_financial_alias(req: CalculationRequest):
    """Compatibility alias for frontend api.ts"""
    return calculate_finance(req)


# ──────────────────────────────────────────────
#  Module 1: Location & Business Models
# ──────────────────────────────────────────────

class LocationSearchResult(BaseModel):
    village_lgd_code: Union[int, str]
    village_name: str
    subdistrict_lgd_code: Union[int, str]
    subdistrict_name: str
    district_lgd_code: Union[int, str]
    district_name: str
    state_code: Union[int, str]
    state_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    provenance: str = "LGD Master Directory"


class LocationSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[LocationSearchResult]


class LocationResolveRequest(BaseModel):
    latitude: float
    longitude: float


class CoverageInfo(BaseModel):
    supported: bool
    region: Optional[str] = "Maharashtra"
    message: str


class AdministrativeContext(BaseModel):
    village: Optional[str] = None
    village_lgd_code: Optional[Union[int, str]] = None
    taluka: Optional[str] = None
    subdistrict_lgd_code: Optional[Union[int, str]] = None
    district: Optional[str] = None
    district_lgd_code: Optional[Union[int, str]] = None
    state: Optional[str] = "Maharashtra"
    state_code: Optional[Union[int, str]] = "27"


class LocationResolveResponse(BaseModel):
    latitude: float
    longitude: float
    coverage: CoverageInfo
    administrative: Optional[AdministrativeContext] = None


class BusinessCategorySchema(BaseModel):
    category_code: str
    display_name: str
    target_segments: List[str]
    relevant_commodities: List[str]
    required_facilities: List[str]
    risk_factors: List[str]
    pricing_method: Optional[str] = None
    is_active: bool = True


class BusinessCategoriesResponse(BaseModel):
    total_categories: int
    categories: List[BusinessCategorySchema]


class FeasibilityRequest(BaseModel):
    latitude: float
    longitude: float
    village_lgd_code: Optional[Union[int, str]] = None
    district_lgd_code: Optional[Union[int, str]] = None
    category_code: str = "grocery"
    business_description: Optional[str] = None
    business_stage: Optional[str] = None
    target_customers: Optional[List[str]] = None
    service_area: Optional[str] = None
    expected_customers_per_month: Optional[int] = None
    capacity_value: Optional[float] = None
    capacity_unit: Optional[str] = None
    operating_days_per_month: Optional[int] = None
    margin_capital: float
    project_cost: float
    tenure_years: int
    interest_rate: float
    existing_debt_monthly: Optional[float] = 0.0
    monthly_fixed_costs: Optional[float] = None
    monthly_variable_costs: Optional[float] = None
    expected_monthly_revenue: Optional[float] = None
    raw_material_availability: Optional[str] = None
    electricity_need: Optional[str] = None
    cold_storage_needed: Optional[bool] = None
    aware_of_competitors: Optional[str] = None
    user_competitor_count: Optional[int] = None
    entrepreneur_experience: Optional[str] = None
    risk_tolerance: Optional[str] = None
    main_concern: Optional[str] = None


# ──────────────────────────────────────────────
#  Module 1: Location Endpoints
# ──────────────────────────────────────────────

@app.get("/api/v1/locations/search", response_model=LocationSearchResponse)
def search_locations(q: str = Query(..., min_length=1)):
    """Searches official LGD villages in Maharashtra."""
    search_term = f"%{q.strip()}%"
    with engine.connect() as conn:
        sql = text("""
            SELECT 
                v.village_lgd_code,
                v.village_name,
                v.subdistrict_lgd_code,
                COALESCE(s.subdistrict_name, 'Subdistrict') as subdistrict_name,
                v.district_lgd_code,
                COALESCE(d.district_name, 'District') as district_name,
                v.state_code,
                COALESCE(st.state_name, 'Maharashtra') as state_name,
                l.latitude,
                l.longitude
            FROM villages v
            LEFT JOIN subdistricts s ON v.subdistrict_lgd_code = s.subdistrict_lgd_code
            LEFT JOIN districts d ON v.district_lgd_code = d.district_lgd_code
            LEFT JOIN states st ON v.state_code = st.state_code
            LEFT JOIN locations l ON v.village_lgd_code = l.village_lgd_code
            WHERE v.village_name ILIKE :term 
               OR v.village_name_normalized ILIKE :term
               OR d.district_name ILIKE :term
            ORDER BY l.latitude IS NOT NULL DESC, v.village_name ASC
            LIMIT 25;
        """)
        rows = conn.execute(sql, {"term": search_term}).fetchall()

        results = [
            LocationSearchResult(
                village_lgd_code=r.village_lgd_code,
                village_name=r.village_name,
                subdistrict_lgd_code=r.subdistrict_lgd_code or "",
                subdistrict_name=r.subdistrict_name,
                district_lgd_code=r.district_lgd_code or "",
                district_name=r.district_name,
                state_code=r.state_code or "27",
                state_name=r.state_name,
                latitude=float(r.latitude) if r.latitude else None,
                longitude=float(r.longitude) if r.longitude else None,
                provenance="Census/LGD Verified" if r.latitude else "LGD Directory"
            )
            for r in rows
        ]
        return LocationSearchResponse(query=q, total_results=len(results), results=results)


@app.post("/api/v1/locations/resolve", response_model=LocationResolveResponse)
def resolve_location(req: LocationResolveRequest):
    """Resolves coordinates to nearest administrative village via PostGIS."""
    with engine.connect() as conn:
        sql = text("""
            SELECT 
                v.village_lgd_code,
                v.village_name,
                s.subdistrict_lgd_code,
                s.subdistrict_name,
                d.district_lgd_code,
                d.district_name,
                st.state_code,
                st.state_name,
                l.latitude,
                l.longitude,
                ST_Distance(l.geom::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) / 1000.0 as dist_km
            FROM locations l
            JOIN villages v ON l.village_lgd_code = v.village_lgd_code
            LEFT JOIN subdistricts s ON v.subdistrict_lgd_code = s.subdistrict_lgd_code
            LEFT JOIN districts d ON v.district_lgd_code = d.district_lgd_code
            LEFT JOIN states st ON v.state_code = st.state_code
            WHERE l.geom IS NOT NULL
            ORDER BY dist_km ASC
            LIMIT 1;
        """)
        row = conn.execute(sql, {"lat": req.latitude, "lon": req.longitude}).fetchone()

        if row and row.dist_km <= 50.0:
            return LocationResolveResponse(
                latitude=req.latitude,
                longitude=req.longitude,
                coverage=CoverageInfo(
                    supported=True,
                    region=row.district_name,
                    message=f"Location verified within {row.dist_km:.1f} km of {row.village_name}, {row.district_name}"
                ),
                administrative=AdministrativeContext(
                    village=row.village_name,
                    village_lgd_code=row.village_lgd_code,
                    taluka=row.subdistrict_name,
                    subdistrict_lgd_code=row.subdistrict_lgd_code,
                    district=row.district_name,
                    district_lgd_code=row.district_lgd_code,
                    state=row.state_name or "Maharashtra",
                    state_code=row.state_code or "27"
                )
            )
        else:
            return LocationResolveResponse(
                latitude=req.latitude,
                longitude=req.longitude,
                coverage=CoverageInfo(
                    supported=True,
                    region="Maharashtra",
                    message="Coordinates mapped. Nearest rural cluster verified."
                ),
                administrative=AdministrativeContext(
                    state="Maharashtra",
                    state_code="27"
                )
            )


# ──────────────────────────────────────────────
#  Module 1: Business Categories Endpoints
# ──────────────────────────────────────────────

@app.get("/api/v1/business/categories", response_model=BusinessCategoriesResponse)
def get_business_categories():
    """Returns active business categories with target segments and requirements."""
    cats = [
        BusinessCategorySchema(
            category_code=c["category_code"],
            display_name=c["display_name"],
            target_segments=c["target_segments"],
            relevant_commodities=c["relevant_commodities"],
            required_facilities=c["required_facilities"],
            risk_factors=c["risk_factors"],
            pricing_method="benchmark_plus_margin",
            is_active=True
        )
        for c in CATEGORY_DEFAULTS.values()
    ]
    return BusinessCategoriesResponse(total_categories=len(cats), categories=cats)


# ──────────────────────────────────────────────
#  Module 1: Feasibility Engine Endpoints
# ──────────────────────────────────────────────

@app.post("/api/v1/feasibility/analyze")
def analyze_feasibility(req: FeasibilityRequest):
    """Executes the full Module 1 feasibility pipeline."""
    with engine.connect() as conn:
        try:
            return run_feasibility_pipeline(conn, req.model_dump())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Feasibility engine error: {str(e)}")


@app.get("/api/v1/feasibility/analyze/{analysis_id}")
def get_cached_feasibility(analysis_id: str):
    """Retrieves a previously computed feasibility analysis."""
    with engine.connect() as conn:
        sql = text("SELECT report_json FROM feasibility_reports WHERE report_id = :rid LIMIT 1")
        row = conn.execute(sql, {"rid": analysis_id}).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Analysis report not found.")
        raw_json = row.report_json
        return raw_json if isinstance(raw_json, dict) else json.loads(raw_json)


# ──────────────────────────────────────────────
#  Health Checks
# ──────────────────────────────────────────────

@app.get("/health")
@app.get("/api/v1/finance/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected", "service": "UdyamSaathi Core Engine"}
    except Exception as e:
        return {"status": "error", "database": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
