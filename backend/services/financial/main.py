from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import uvicorn
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="UdyamSaathi Financial Service")

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
        raise HTTPException(status_code=400, detail="No eligible scheme found for this project cost.")

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
#  Health Check
# ──────────────────────────────────────────────

@app.get("/api/v1/finance/health")
def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
