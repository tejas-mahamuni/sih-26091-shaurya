import React, { useState, useEffect } from 'react';
import { Calculator, Loader2, ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Shield, Info } from 'lucide-react';
import { ConfidenceBadge } from '@/components/ui/ConfidenceBadge';
import { auth, db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// ─── Types ───────────────────────────────────
interface Scheme {
  scheme_id: string;
  scheme_code: string;
  scheme_name: string;
  category: string;
  min_project_cost: number;
  max_project_cost: number;
  loan_percentage: number;
  max_loan_amount: number;
  annual_interest_rate: number;
  tenure_months: number;
  moratorium_months: number;
}

interface AmortizationRow {
  month: number;
  phase: 'moratorium' | 'repayment';
  opening_balance: number;
  emi: number;
  interest: number;
  principal: number;
  closing_balance: number;
}

interface StressScenario {
  label: string;
  interest_rate: number;
  monthly_emi: number;
  total_paid: number;
  total_interest: number;
  effective_principal: number;
}

interface CalculationResult {
  calculation_id: string;
  status: string;
  currency: string;
  available_margin: number;
  project_cost: number;
  scheme: {
    code: string;
    name: string;
    category: string;
    interest_rate: number;
    tenure_months: number;
    moratorium_months: number;
    maximum_loan: number;
    loan_percentage: number;
  };
  loan: {
    theoretical_amount: number;
    eligible_amount: number;
    required_margin: number;
    funding_gap: number;
  };
  repayment: {
    repayment_months: number;
    monthly_emi: number;
    total_interest: number;
    total_paid: number;
    interest_to_principal_ratio: number;
    moratorium_interest_policy: string;
  };
  amortization: AmortizationRow[];
  stress_scenarios: StressScenario[];
  affordability: {
    expected_monthly_revenue: number;
    emi_to_income_ratio: number;
    risk_level: 'low' | 'medium' | 'high';
  } | null;
  warnings: string[];
}

// ─── Helpers ─────────────────────────────────
const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
const fmtDec = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ─── Component ───────────────────────────────
export const FinancialPlan: React.FC = () => {
  // Form state
  const [margin, setMargin] = useState('');
  const [projectCost, setProjectCost] = useState('');
  const [moratorium, setMoratorium] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showAmortization, setShowAmortization] = useState(false);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [showSchemes, setShowSchemes] = useState(false);

  // Fetch schemes on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/v1/finance/schemes`)
      .then(r => r.json())
      .then(setSchemes)
      .catch(() => { /* schemes table is optional UI */ });
  }, []);

  const calculateFinance = async () => {
    if (!margin || Number(margin) <= 0) {
      setError('Please enter your available margin (capital).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        available_margin: Number(margin),
        user_id: auth.currentUser?.uid || null,
      };
      if (projectCost) payload.requested_project_cost = Number(projectCost);
      if (moratorium !== '') payload.moratorium_months_override = Number(moratorium);
      if (expectedRevenue) payload.expected_monthly_revenue = Number(expectedRevenue);

      const response = await fetch(`${API_BASE}/api/v1/finance/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Calculation failed.');

      setResult(data);

      // Save to Firestore if logged in
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, `users/${auth.currentUser.uid}/calculations`), {
            ...data,
            timestamp: serverTimestamp(),
          });
        } catch {
          // Firestore save is best-effort
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const gaugeColor = (level: string) => {
    if (level === 'low') return { bg: 'bg-green-500', text: 'text-green-400', label: 'SAFE — Low Risk' };
    if (level === 'medium') return { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'CAUTION — Moderate Risk' };
    return { bg: 'bg-red-500', text: 'text-red-400', label: 'HIGH RISK — EMI Burden' };
  };

  return (
    <div className="w-full text-[#111111] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">

      {/* ── Header ── */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C9793A] block mb-2">
          MODULE 2 — FINANCIAL STRUCTURE & LOAN STRESSING
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#111111] mb-4">
          Financial Feasibility & Repayment Plan
        </h1>
        <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
          Structures real setup costs, mandatory working capital reserves, bank EMI obligations,
          and stress-tests repayment capacity — based on NBCFDC entrepreneurial schemes.
        </p>
      </div>

      {/* ── Schemes Reference Table ── */}
      {schemes.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => setShowSchemes(!showSchemes)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C9793A]" />
              <span className="text-sm font-semibold text-gray-900">Available NBCFDC Schemes Reference</span>
              <span className="text-xs text-gray-500">({schemes.length} schemes)</span>
            </div>
            {showSchemes ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          {showSchemes && (
            <div className="overflow-x-auto border-t border-gray-100">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Scheme</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Max Loan</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Loan %</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Interest</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Tenure</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600 whitespace-nowrap">Moratorium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schemes.map(s => (
                    <tr key={s.scheme_id} className="hover:bg-amber-50/30 transition">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{s.scheme_name}</td>
                      <td className="px-4 py-3 text-gray-500">{s.category}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">{fmt(s.max_loan_amount)}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">{s.loan_percentage}%</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">{s.annual_interest_rate}%</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">{s.tenure_months} mo</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-mono">{s.moratorium_months} mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Calculator: Input + Output ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Left: Input Controls ── */}
        <div className="lg:col-span-5 p-8 rounded-3xl apple-card space-y-5 shadow-xs border border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9793A] uppercase font-bold">
            <Calculator className="w-4 h-4" />
            <span>LOAN STRUCTURING PARAMETERS</span>
          </div>

          {/* Margin input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">AVAILABLE MARGIN (YOUR CAPITAL) *</label>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:border-[#C9793A] focus-within:bg-white transition">
              <span className="flex items-center px-3 text-sm font-semibold text-gray-500 border-r border-gray-200 bg-gray-100 rounded-l-lg">₹</span>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={margin}
                onChange={e => setMargin(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Project Cost input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">ESTIMATED PROJECT COST (OPTIONAL)</label>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:border-[#C9793A] focus-within:bg-white transition">
              <span className="flex items-center px-3 text-sm font-semibold text-gray-500 border-r border-gray-200 bg-gray-100 rounded-l-lg">₹</span>
              <input
                type="number"
                placeholder="Auto-calculated if blank"
                value={projectCost}
                onChange={e => setProjectCost(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Moratorium input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">MORATORIUM PERIOD (MONTHS)</label>
            <input
              type="number"
              min={0}
              max={24}
              placeholder="Scheme default if blank"
              value={moratorium}
              onChange={e => setMoratorium(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C9793A] focus:bg-white"
            />
          </div>

          {/* Expected Revenue input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">EXPECTED MONTHLY REVENUE (OPTIONAL)</label>
            <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:border-[#C9793A] focus-within:bg-white transition">
              <span className="flex items-center px-3 text-sm font-semibold text-gray-500 border-r border-gray-200 bg-gray-100 rounded-l-lg">₹</span>
              <input
                type="number"
                placeholder="For affordability gauge"
                value={expectedRevenue}
                onChange={e => setExpectedRevenue(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <p className="text-[10px] text-gray-400">Powers the EMI-to-Income affordability meter</p>
          </div>

          <button
            onClick={calculateFinance}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Calculate Feasibility'}
          </button>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}

          {!auth.currentUser && (
            <p className="text-xs text-gray-400 text-center">Not logged in — results won't be saved to history.</p>
          )}
        </div>

        {/* ── Right: Calculated Output ── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Summary Card */}
          <div className="p-8 rounded-3xl bg-[#0E1116] text-[#F5F5F3] border border-white/10 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-white/70">CALCULATED OBLIGATIONS</span>
              <ConfidenceBadge type="official" />
            </div>

            {result ? (
              <div className="space-y-4 font-mono">
                {/* Scheme */}
                <div className="p-4 rounded-xl bg-[#171A20] border border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] text-white/50 uppercase">MATCHED SCHEME</span>
                  <span className="text-lg font-bold text-white">{result.scheme.name}</span>
                  <span className="text-xs text-white/40">
                    {result.scheme.interest_rate}% p.a. • {result.scheme.tenure_months} months
                    • {result.scheme.moratorium_months} mo moratorium
                    • {result.scheme.loan_percentage}% funding
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#171A20] border border-white/10 flex flex-col gap-1">
                    <span className="text-[10px] text-white/50">PROJECT COST</span>
                    <span className="text-lg font-extrabold text-white">{fmt(result.project_cost)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171A20] border border-white/10 flex flex-col gap-1">
                    <span className="text-[10px] text-white/50">ELIGIBLE LOAN</span>
                    <span className="text-lg font-extrabold text-[#C9793A]">{fmt(result.loan.eligible_amount)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#171A20] border border-white/10 flex flex-col gap-1">
                    <span className="text-[10px] text-white/50">FUNDING GAP</span>
                    <span className={`text-lg font-extrabold ${result.loan.funding_gap > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {result.loan.funding_gap > 0 ? fmt(result.loan.funding_gap) : '₹0 ✓'}
                    </span>
                  </div>
                </div>

                {/* EMI + Totals */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#171A20] border border-white/10 flex justify-between items-center">
                    <span className="text-[10px] text-white/50">MONTHLY EMI</span>
                    <span className="text-2xl font-extrabold text-[#C9793A]">{fmtDec(result.repayment.monthly_emi)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#171A20] border border-white/10 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-white/50">TOTAL INTEREST</span>
                      <span className="text-sm font-bold text-white/80">{fmt(result.repayment.total_interest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-white/50">TOTAL PAYABLE</span>
                      <span className="text-sm font-bold text-white">{fmt(result.repayment.total_paid)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-white/50">INTEREST RATIO</span>
                      <span className="text-sm font-bold text-[#C9793A]">{result.repayment.interest_to_principal_ratio}%</span>
                    </div>
                  </div>
                </div>

                {/* Affordability Gauge */}
                {result.affordability && (
                  <div className="p-4 rounded-xl bg-[#171A20] border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-white/50" />
                      <span className="text-[10px] text-white/50 uppercase">AFFORDABILITY GAUGE (FOIR)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${gaugeColor(result.affordability.risk_level).bg}`}
                            style={{ width: `${Math.min(result.affordability.emi_to_income_ratio, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-lg font-extrabold ${gaugeColor(result.affordability.risk_level).text}`}>
                        {result.affordability.emi_to_income_ratio}%
                      </span>
                    </div>
                    <p className={`text-xs ${gaugeColor(result.affordability.risk_level).text}`}>
                      {gaugeColor(result.affordability.risk_level).label}
                      {' — '}EMI is {result.affordability.emi_to_income_ratio}% of your ₹{result.affordability.expected_monthly_revenue.toLocaleString('en-IN')} monthly revenue
                    </p>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-200 text-sm flex flex-col gap-1">
                    <span className="font-bold text-xs uppercase text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> ADVISORY
                    </span>
                    {result.warnings.map((w, i) => <span key={i} className="text-xs">{w}</span>)}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 flex items-center justify-center text-white/30 font-mono text-sm text-center">
                Enter your available margin and calculate<br />to see matched schemes, EMI, and stress tests.
              </div>
            )}

            <p className="text-[10px] text-white/40 font-mono pt-2 border-t border-white/10 mt-4">
              *Powered by deterministic Python Decimal engine. Validated against official NBCFDC rules.
            </p>
          </div>

          {/* ── Stress Test Scenarios ── */}
          {result?.stress_scenarios && (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C9793A]" />
                <span className="text-sm font-semibold text-gray-900">Stress Test — What If Interest Rates Rise?</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold text-gray-600">Scenario</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-600">Rate</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-600">Monthly EMI</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-600">Total Interest</th>
                      <th className="px-5 py-3 text-right font-semibold text-gray-600">Total Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.stress_scenarios.map((s, i) => (
                      <tr key={i} className={i === 0 ? 'bg-green-50/50' : i === 2 ? 'bg-red-50/50' : ''}>
                        <td className="px-5 py-3 font-medium text-gray-900">{s.label}</td>
                        <td className="px-5 py-3 text-right font-mono text-gray-900">{s.interest_rate}%</td>
                        <td className="px-5 py-3 text-right font-mono font-bold text-gray-900">{fmtDec(s.monthly_emi)}</td>
                        <td className="px-5 py-3 text-right font-mono text-gray-600">{fmt(s.total_interest)}</td>
                        <td className="px-5 py-3 text-right font-mono text-gray-900">{fmt(s.total_paid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Amortization Schedule ── */}
          {result?.amortization && result.amortization.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
              >
                <span className="text-sm font-semibold text-gray-900">
                  Month-by-Month EMI Schedule ({result.amortization.length} months)
                </span>
                {showAmortization
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {showAmortization && (
                <div className="overflow-x-auto border-t border-gray-100 max-h-96 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Month</th>
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-600">Phase</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Opening Bal.</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">EMI</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Interest</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Principal</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-600">Closing Bal.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {result.amortization.map(row => (
                        <tr
                          key={row.month}
                          className={row.phase === 'moratorium' ? 'bg-amber-50/40 text-gray-500' : 'hover:bg-gray-50'}
                        >
                          <td className="px-4 py-2 font-mono font-medium text-gray-900">{row.month}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              row.phase === 'moratorium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {row.phase === 'moratorium' ? 'Moratorium' : 'Repayment'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right font-mono text-gray-700">{fmt(row.opening_balance)}</td>
                          <td className="px-4 py-2 text-right font-mono font-bold text-gray-900">
                            {row.emi > 0 ? fmtDec(row.emi) : '—'}
                          </td>
                          <td className="px-4 py-2 text-right font-mono text-red-600">{fmtDec(row.interest)}</td>
                          <td className="px-4 py-2 text-right font-mono text-green-700">
                            {row.principal > 0 ? fmtDec(row.principal) : '—'}
                          </td>
                          <td className="px-4 py-2 text-right font-mono text-gray-900">{fmt(row.closing_balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
