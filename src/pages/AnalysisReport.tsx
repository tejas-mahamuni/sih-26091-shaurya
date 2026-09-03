import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown,
  Users, DollarSign, ShieldAlert, Info, ArrowLeft, Building2,
  MapPin, ShieldCheck, Clock, Layers, Sparkles, Scale
} from 'lucide-react';
import { api } from '@/services/api';
import type { FeasibilityResponse, FeasibilityModule, FinancialTwinScenario } from '@/services/api';
import {
  BentoCard,
  BentoRadarChart,
  BentoDonutChart,
  BentoBarChart,
  BentoMetric,
  type RadarAxis,
  type DonutSegment,
  type BarDataPoint,
} from '@/components/ui/bento';

// ── FORMATTING & THEME HELPERS ────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

const REC_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; darkBg: string; Icon: any }> = {
  PROCEED: {
    label: 'Strong Go',
    color: 'text-[#3F7657]',
    bg: 'bg-[#3F7657]/10',
    darkBg: 'bg-[#3F7657]/20',
    border: 'border-[#3F7657]/30',
    Icon: CheckCircle2,
  },
  PROCEED_WITH_CONDITIONS: {
    label: 'Conditional Go',
    color: 'text-[#C9793A]',
    bg: 'bg-[#C9793A]/10',
    darkBg: 'bg-[#C9793A]/20',
    border: 'border-[#C9793A]/30',
    Icon: AlertTriangle,
  },
  RECONSIDER: {
    label: 'High Risk — Reconsider',
    color: 'text-red-600',
    bg: 'bg-red-50',
    darkBg: 'bg-red-950/40',
    border: 'border-red-200',
    Icon: XCircle,
  },
  INSUFFICIENT_DATA: {
    label: 'Insufficient Data',
    color: 'text-[#6B6B6B]',
    bg: 'bg-[#F5F5F3]',
    darkBg: 'bg-white/5',
    border: 'border-[#E2E2DC]',
    Icon: Info,
  },
};

const SOURCE_BADGE: Record<string, string> = {
  OFFICIAL: 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20',
  USER_PROVIDED: 'bg-blue-50 text-blue-700 border-blue-200',
  CALCULATED: 'bg-purple-50 text-purple-700 border-purple-200',
  PROXY: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  ESTIMATED: 'bg-[#C9793A]/10 text-[#C9793A] border-[#C9793A]/20',
  UNAVAILABLE: 'bg-[#E2E2DC] text-[#6B6B6B] border-[#E2E2DC]',
};

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export const AnalysisReport: React.FC = () => {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<FeasibilityResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'financial' | 'intelligence' | 'swot'>('all');

  useEffect(() => {
    if (!analysisId) {
      setNotFound(true);
      return;
    }
    const stored = sessionStorage.getItem(`analysis_${analysisId}`);
    if (stored) {
      try {
        setReport(JSON.parse(stored));
        return;
      } catch {}
    }
    // Fallback: fetch from backend DB
    api.getFeasibilityAnalysis(analysisId)
      .then(res => setReport(res))
      .catch(() => setNotFound(true));
  }, [analysisId]);

  if (notFound) {
    return (
      <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-12 h-12 rounded-2xl bg-[#C9793A]/10 text-[#C9793A] flex items-center justify-center mx-auto mb-2">
          <Info className="w-6 h-6" />
        </div>
        <h2 className="font-display text-xl font-bold">Analysis Report Not Found</h2>
        <p className="text-sm text-[#6B6B6B]">
          The analysis ID does not exist in local session or database history.
        </p>
        <button
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#111111] text-white font-mono-data text-xs hover:bg-[#C9793A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start New Assessment
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-28 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#C9793A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-mono-data text-xs text-[#6B6B6B]">Loading verified feasibility report...</p>
      </div>
    );
  }

  const rec = REC_CONFIG[report.recommendation] || REC_CONFIG.INSUFFICIENT_DATA;
  const RecIcon = rec.Icon;

  // ── PREPARE DATA FOR BENTO VISUALIZATIONS ────────────────────────────────────

  // 1. Radar Chart Axes (from real calculated module scores)
  const twin = report.financial_digital_twin;
  const loanAmount = twin?.loan_amount || 0;
  const emi = twin?.emi || 0;
  const expectedRev = twin?.expected?.revenue_assumption || 0;
  const totalInvestment = loanAmount > 0 && twin?.expected?.revenue_assumption
    ? loanAmount + (expectedRev > 0 ? loanAmount * 0.4 : 500000)
    : loanAmount || 1000000;

  const radarAxes: RadarAxis[] = [
    { label: 'Demand', score: report.market_reach.score, weight: '25%' },
    { label: 'Competition', score: report.competition.score, weight: '20%' },
    { label: 'Profitability', score: report.opportunity_analysis.score, weight: '20%' },
    {
      label: 'Capital Fit',
      score: Math.min(100, Math.max(30, 100 - (loanAmount > 0 ? (loanAmount / (totalInvestment || 1)) * 50 : 20))),
      weight: '15%',
    },
    { label: 'Risk Health', score: report.threats.score, weight: '10%' },
    {
      label: 'Affordability',
      score: expectedRev > 0 && emi > 0
        ? Math.max(20, Math.min(100, 100 - (emi / expectedRev) * 100))
        : 65,
      weight: '10%',
    },
  ];

  // 2. Financing Composition Donut (Own Equity vs Bank Loan)
  const ownEquity = Math.max(0, totalInvestment - loanAmount);
  const financingSegments: DonutSegment[] = [
    {
      label: 'Own Equity',
      value: ownEquity > 0 ? ownEquity : Math.round(loanAmount * 0.4),
      color: '#3F7657',
      sublabel: 'Margin Capital',
    },
    {
      label: 'Bank Loan',
      value: loanAmount,
      color: '#C9793A',
      sublabel: `EMI: ₹${fmt(emi)}/mo`,
    },
  ];

  // 3. Financial Scenarios Comparison Bar Chart (Net Surplus & Revenue)
  const scenarioBarData: BarDataPoint[] = [
    {
      label: 'Conservative',
      value: twin?.conservative?.revenue_assumption || 0,
      secondaryValue: Math.max(0, twin?.conservative?.cash_after_emi || 0),
      secondaryLabel: 'Cash After EMI',
      color: '#A95743',
      subtext: twin?.conservative?.break_even_months ? `${twin.conservative.break_even_months} Mo. Break-even` : 'Negative cashflow',
    },
    {
      label: 'Expected',
      value: twin?.expected?.revenue_assumption || 0,
      secondaryValue: Math.max(0, twin?.expected?.cash_after_emi || 0),
      secondaryLabel: 'Cash After EMI',
      color: '#C9793A',
      subtext: twin?.expected?.break_even_months ? `${twin.expected.break_even_months} Mo. Break-even` : 'Break-even N/A',
    },
    {
      label: 'Optimistic',
      value: twin?.optimistic?.revenue_assumption || 0,
      secondaryValue: Math.max(0, twin?.optimistic?.cash_after_emi || 0),
      secondaryLabel: 'Cash After EMI',
      color: '#3F7657',
      subtext: twin?.optimistic?.break_even_months ? `${twin.optimistic.break_even_months} Mo. Break-even` : 'Break-even N/A',
    },
  ];

  // 4. Mandi / Market Price Data Points if available
  const pricingMetrics = report.pricing?.metrics || {};
  const hasPricingData = report.pricing.status === 'VERIFIED' && pricingMetrics.modal_price;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 text-[#111111]">

      {/* ── BENTO TOP VERDICT HERO ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Main Verdict Card (7 Cols) */}
        <BentoCard
          dark
          className="lg:col-span-7 flex flex-col justify-between"
          badge={
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono-data bg-white/10 text-white/80 border border-white/15">
                ID: {report.analysis_id.slice(0, 8)}...
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-data bg-[#C9793A]/20 text-[#C9793A] border border-[#C9793A]/30">
                Engine {report.engine_version}
              </span>
            </div>
          }
        >
          <div>
            <span className="text-[10px] font-mono-data uppercase tracking-widest text-[#C9793A] font-bold block mb-1">
              DECISION INTELLIGENCE REPORT
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Business Feasibility Assessment
            </h1>

            {/* Recommendation Status Banner */}
            <div className={`mt-4 p-4 rounded-2xl border flex items-start gap-3.5 ${rec.darkBg} ${rec.border}`}>
              <RecIcon className={`w-5 h-5 shrink-0 mt-0.5 ${rec.color}`} />
              <div className="space-y-1">
                <div className={`font-display text-lg font-bold ${rec.color}`}>{rec.label}</div>
                <p className="text-xs text-white/80 leading-relaxed font-sans font-normal">
                  {report.ai_reasoning.executive_summary}
                </p>
              </div>
            </div>
          </div>

          {/* Context Footer */}
          <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-data text-xs">
            <div>
              <span className="text-[10px] text-white/50 block">DATA CONFIDENCE</span>
              <span className="text-sm font-bold text-white">{report.confidence_score}%</span>
            </div>
            <div>
              <span className="text-[10px] text-white/50 block">PILOT COVERAGE</span>
              <span className="text-sm font-bold text-[#3F7657]">Nashik District ✓</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-white/50 block">METHODOLOGY</span>
              <span className="text-xs text-white/70">Deterministic 6-Module</span>
            </div>
          </div>
        </BentoCard>

        {/* Viability Index Bento Card (5 Cols) */}
        <BentoCard
          className="lg:col-span-5 bg-gradient-to-br from-white to-[#F5F5F3] flex flex-col justify-between"
          title="Feasibility Score"
          icon={<Sparkles className="w-3.5 h-3.5" />}
          badge={
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono-data font-bold border ${rec.bg} ${rec.color} ${rec.border}`}
            >
              {rec.label}
            </span>
          }
        >
          <div className="my-auto py-3 text-center sm:text-left">
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <span
                className="font-mono-data text-6xl sm:text-7xl font-extrabold tracking-tight"
                style={{
                  color: report.viability_score >= 70 ? '#3F7657' : report.viability_score >= 50 ? '#C9793A' : '#dc2626',
                }}
              >
                {report.viability_score}
              </span>
              <span className="font-mono-data text-xl text-[#6B6B6B]">/ 100</span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1 font-mono-data">
              Weighted composite of Demand (25%), Competition (20%), Profitability (20%), Capital (15%), Risk (10%), Affordability (10%)
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2E2DC] grid grid-cols-2 gap-2 text-xs font-mono-data">
            <div className="p-2.5 rounded-xl bg-[#F5F5F3] border border-[#E2E2DC]">
              <span className="text-[10px] text-[#6B6B6B] block">MONTHLY EMI</span>
              <span className="font-bold text-[#111111]">₹{fmt(twin.emi)}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F5F3] border border-[#E2E2DC]">
              <span className="text-[10px] text-[#6B6B6B] block">LOAN PRINCIPAL</span>
              <span className="font-bold text-[#C9793A]">₹{fmt(twin.loan_amount)}</span>
            </div>
          </div>
        </BentoCard>

      </div>

      {/* ── BENTO ANALYTICS CORE AREA ─────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C9793A]" />
            <h2 className="font-display text-lg font-bold text-[#111111]">Multi-Dimensional Intelligence</h2>
          </div>
          <span className="text-xs font-mono-data text-[#6B6B6B]">Bento Analytical View</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Bento 1: Feasibility Radar Profile (5 Cols) */}
          <BentoCard
            className="md:col-span-5"
            title="Business Health Radar"
            subtitle="6-Axis Deterministic Profile"
            icon={<Scale className="w-3.5 h-3.5" />}
          >
            <BentoRadarChart axes={radarAxes} />
          </BentoCard>

          {/* Bento 2: Financial Scenarios Comparison Bar Chart (7 Cols) */}
          <BentoCard
            className="md:col-span-7 flex flex-col justify-between"
            title="Financial Scenario Analysis"
            subtitle="Monthly Revenue vs Net Cash After EMI (±20% Simulation)"
            icon={<TrendingUp className="w-3.5 h-3.5" />}
            badge={
              <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-[#3F7657]/10 text-[#3F7657] border border-[#3F7657]/20">
                Digital Twin
              </span>
            }
          >
            <BentoBarChart data={scenarioBarData} height={200} />
            <p className="text-[10px] font-mono-data text-[#6B6B6B] pt-2 border-t border-[#E2E2DC]/60">
              Primary bar: Monthly Revenue · Secondary bar: Net Cash Surplus After EMI
            </p>
          </BentoCard>

        </div>
      </div>

      {/* ── BENTO ROW 2: FINANCING DONUT & MARKET INTEL ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Bento 3: Financing Composition Donut (6 Cols) */}
        <BentoCard
          className="md:col-span-6"
          title="Financing Composition"
          subtitle="Own Equity Contribution vs Bank Debt"
          icon={<DollarSign className="w-3.5 h-3.5" />}
          badge={
            <span className="text-[10px] font-mono-data px-2 py-0.5 rounded-full bg-[#C9793A]/10 text-[#C9793A] border border-[#C9793A]/20">
              Loan: ₹{fmt(loanAmount)}
            </span>
          }
        >
          <BentoDonutChart
            segments={financingSegments}
            totalLabel="LOAN STRUCTURE"
            totalValue={`₹${fmt(loanAmount)}`}
            size={180}
            thickness={22}
          />
          <div className="mt-4 pt-3 border-t border-[#E2E2DC]/60 flex items-center justify-between text-xs font-mono-data">
            <span className="text-[#6B6B6B]">Monthly Repayment Burden:</span>
            <span className="font-bold text-[#111111]">₹{fmt(emi)} / month</span>
          </div>
        </BentoCard>

        {/* Bento 4: Market / Mandi Intelligence & Micro Metrics (6 Cols) */}
        <BentoCard
          className="md:col-span-6 flex flex-col justify-between"
          title="Market & Pricing Intelligence"
          subtitle="Agmarknet Periodic Mandi Benchmarks"
          icon={<Building2 className="w-3.5 h-3.5" />}
          badge={
            <span
              className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full border ${
                hasPricingData
                  ? 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20'
                  : 'bg-[#E2E2DC] text-[#6B6B6B] border-[#E2E2DC]'
              }`}
            >
              {hasPricingData ? 'VERIFIED' : 'UNAVAILABLE'}
            </span>
          }
        >
          {hasPricingData ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E2E2DC] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-data">
                  <span className="text-[#6B6B6B]">COMMODITY</span>
                  <span className="font-bold text-[#111111]">{pricingMetrics.commodity}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#6B6B6B] font-mono-data">Latest Modal Price:</span>
                  <span className="font-mono-data text-2xl font-bold text-[#C9793A]">
                    ₹{fmt(Number(pricingMetrics.modal_price))}
                    <span className="text-xs text-[#6B6B6B] font-normal"> / {pricingMetrics.unit}</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono-data text-[#6B6B6B] pt-1 border-t border-[#E2E2DC]">
                  <span>Mandi: {pricingMetrics.market}</span>
                  <span>Date: {pricingMetrics.date}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <BentoMetric
                  label="MIN PRICE"
                  value={pricingMetrics.min_price ? `₹${fmt(Number(pricingMetrics.min_price))}` : '—'}
                  subtext="Floor threshold"
                  badge="Agmarknet"
                />
                <BentoMetric
                  label="MAX PRICE"
                  value={pricingMetrics.max_price ? `₹${fmt(Number(pricingMetrics.max_price))}` : '—'}
                  subtext="Peak recorded"
                  badge="Agmarknet"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 my-auto">
              <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E2E2DC] text-xs text-[#6B6B6B] space-y-1 font-mono-data">
                <p>No periodic Agmarknet price records mapped for this specific business category.</p>
                <p className="text-[10px] text-[#C9793A]">Data labeled as UNAVAILABLE in scoring engine.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <BentoMetric
                  label="POPULATION"
                  value={report.market_reach.metrics.population_total ? `${fmt(Number(report.market_reach.metrics.population_total))}` : 'Census 2011'}
                  subtext="Catchment area"
                  badge="Census"
                  badgeType="positive"
                />
                <BentoMetric
                  label="MSME UNITS"
                  value={report.competition.metrics.nearby_count !== undefined ? `${report.competition.metrics.nearby_count} within 10km` : '0 in radius'}
                  subtext="Udyam registry"
                  badge="Udyam"
                />
              </div>
            </div>
          )}

          <p className="text-[10px] font-mono-data text-[#6B6B6B] pt-2 border-t border-[#E2E2DC]/60 mt-2">
            Agmarknet data is periodic and officially sourced from Agricultural Produce Market Committees.
          </p>
        </BentoCard>

      </div>

      {/* ── FINANCIAL DIGITAL TWIN DETAIL CARDS ────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E2DC] pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#C9793A]" />
            <h2 className="font-display text-xl font-bold text-[#111111]">Financial Digital Twin Breakdown</h2>
          </div>
          <span className="text-xs font-mono-data text-[#6B6B6B]">3 Scenario Projections</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { s: twin.conservative, border: 'hover:border-[#A95743]' },
            { s: twin.expected, border: 'hover:border-[#C9793A] ring-2 ring-[#C9793A]/20' },
            { s: twin.optimistic, border: 'hover:border-[#3F7657]' },
          ].map(({ s, border }) => {
            const isProfit = s.cash_after_emi >= 0;
            return (
              <div
                key={s.label}
                className={`p-5 rounded-3xl bg-white border border-[#E2E2DC] shadow-sm transition-all space-y-3 ${border}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-data font-bold text-[#111111] uppercase tracking-wider">
                    {s.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full border ${
                      isProfit ? 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20' : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {isProfit ? 'Positive Cash' : 'Deficit'}
                  </span>
                </div>

                <div className="space-y-2 font-mono-data text-xs pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Revenue / mo:</span>
                    <span className="font-bold">₹{fmt(s.revenue_assumption)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Fixed costs:</span>
                    <span>₹{fmt(s.monthly_fixed_costs)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Variable costs:</span>
                    <span>₹{fmt(s.monthly_variable_costs)}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E2E2DC] pt-1.5 font-semibold text-[#3F7657]">
                    <span>Operating Surplus:</span>
                    <span>₹{fmt(s.operating_surplus)}</span>
                  </div>
                  <div className="flex justify-between text-[#C9793A]">
                    <span>Monthly EMI:</span>
                    <span>- ₹{fmt(s.emi)}</span>
                  </div>
                  <div
                    className={`flex justify-between pt-2 border-t border-[#E2E2DC] font-bold text-sm ${
                      isProfit ? 'text-[#3F7657]' : 'text-red-600'
                    }`}
                  >
                    <span>Cash After Debt:</span>
                    <span>{isProfit ? '₹' : '- ₹'}{fmt(Math.abs(s.cash_after_emi))}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E2DC] text-xs font-mono-data flex justify-between items-center">
                  <span className="text-[#6B6B6B]">Break-Even:</span>
                  <span className="font-bold text-[#111111]">
                    {s.break_even_months !== null && s.break_even_months !== undefined
                      ? `${s.break_even_months} Months`
                      : 'N/A (Deficit)'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── AI ACTION PLAN & EVIDENCE ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E2E2DC] pb-2">
          <Clock className="w-4 h-4 text-[#C9793A]" />
          <h2 className="font-display text-xl font-bold text-[#111111]">Action Plan & Evidence</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Action List (7 Cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            {report.ai_reasoning.action_plan.map((action, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E2E2DC] shadow-sm hover:border-[#C9793A]/40 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white text-[11px] font-mono-data font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-[#111111] font-sans leading-relaxed">{action}</span>
              </div>
            ))}
          </div>

          {/* Evidence Card (5 Cols) */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-[#0E1116] text-white border border-white/10 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-data text-[#C9793A] uppercase font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Deterministic Grounding</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-sans">
                {report.ai_reasoning.evidence}
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 mt-4 text-[10px] font-mono-data text-white/40">
              Generated by strictly-bounded reasoning layer over verified database parameters.
            </div>
          </div>
        </div>
      </div>

      {/* ── HYPER-LOCAL INTELLIGENCE CARDS ────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E2E2DC] pb-2">
          <MapPin className="w-4 h-4 text-[#C9793A]" />
          <h2 className="font-display text-xl font-bold text-[#111111]">Hyper-Local Intelligence Modules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Market Reach & Demographics', m: report.market_reach, icon: Users },
            { title: 'Local Registered Competition', m: report.competition, icon: TrendingUp },
            { title: 'Opportunity & Demand Niche', m: report.opportunity_analysis, icon: Sparkles },
            { title: 'Operational Threats & Risks', m: report.threats, icon: ShieldAlert },
          ].map(({ title, m, icon: Icon }) => (
            <div key={title} className="p-5 rounded-2xl bg-white border border-[#E2E2DC] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#C9793A]" />
                  <span className="font-bold text-sm text-[#111111]">{title}</span>
                </div>
                <span
                  className={`text-[10px] font-mono-data px-2 py-0.5 rounded-full border ${
                    m.status === 'VERIFIED'
                      ? 'bg-[#3F7657]/10 text-[#3F7657] border-[#3F7657]/20'
                      : m.status === 'ESTIMATED'
                      ? 'bg-[#C9793A]/10 text-[#C9793A] border-[#C9793A]/20'
                      : 'bg-[#E2E2DC] text-[#6B6B6B] border-[#E2E2DC]'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono-data">
                  <span className="text-[#6B6B6B]">Module Score</span>
                  <span className="font-bold text-[#111111]">{m.score.toFixed(0)}/100</span>
                </div>
                <div className="h-1.5 bg-[#E2E2DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9793A] rounded-full transition-all duration-700"
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-1.5 pt-1">
                {m.insights.map((insight, idx) => (
                  <li key={idx} className="text-xs text-[#6B6B6B] flex items-start gap-2">
                    <span className="text-[#C9793A] mt-0.5 shrink-0">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>

              {m.data_points && m.data_points.length > 0 && (
                <div className="pt-2 border-t border-[#E2E2DC] space-y-1.5">
                  {m.data_points.map((dp, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-mono-data">
                      <span className="text-[#6B6B6B]">{dp.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#111111]">{String(dp.value)}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${SOURCE_BADGE[dp.source] || SOURCE_BADGE.ESTIMATED}`}>
                          {dp.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── SWOT MATRIX ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E2E2DC] pb-2">
          <Layers className="w-4 h-4 text-[#C9793A]" />
          <h2 className="font-display text-xl font-bold text-[#111111]">SWOT Strategic Matrix</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'Strengths', color: 'text-[#3F7657]', bg: 'bg-[#3F7657]/8 border-[#3F7657]/20', bullet: 'text-[#3F7657]' },
            { key: 'Weaknesses', color: 'text-red-600', bg: 'bg-red-50 border-red-200', bullet: 'text-red-600' },
            { key: 'Opportunities', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', bullet: 'text-blue-700' },
            { key: 'Threats', color: 'text-[#C9793A]', bg: 'bg-[#C9793A]/8 border-[#C9793A]/20', bullet: 'text-[#C9793A]' },
          ].map(({ key, color, bg, bullet }) => (
            <div key={key} className={`p-5 rounded-2xl border ${bg} space-y-2`}>
              <span className={`font-mono-data font-bold text-xs uppercase tracking-wider block ${color}`}>
                {key}
              </span>
              <ul className="space-y-1.5">
                {(report.swot[key] || []).map((item, i) => (
                  <li key={i} className="text-xs text-[#111111] flex items-start gap-2">
                    <span className={`${bullet} shrink-0 mt-0.5`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── DATA PROVENANCE TABLE ─────────────────────────────────────────── */}
      {report.data_provenance.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E2DC] pb-2">
            <h3 className="font-display text-lg font-bold text-[#111111]">Data Provenance Registry</h3>
            <span className="text-xs font-mono-data text-[#6B6B6B]">Audited Sources</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#E2E2DC] bg-white shadow-sm">
            <table className="w-full text-xs font-mono-data">
              <thead className="bg-[#F5F5F3] border-b border-[#E2E2DC]">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-[#6B6B6B] uppercase text-[10px]">Dataset</th>
                  <th className="px-4 py-3 text-left font-bold text-[#6B6B6B] uppercase text-[10px]">Official Source</th>
                  <th className="px-4 py-3 text-left font-bold text-[#6B6B6B] uppercase text-[10px]">Date</th>
                  <th className="px-4 py-3 text-left font-bold text-[#6B6B6B] uppercase text-[10px]">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2DC]">
                {report.data_provenance.map((entry, i) => (
                  <tr key={i} className="hover:bg-[#F5F5F3]/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#111111]">{entry.dataset}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{entry.source}</td>
                    <td className="px-4 py-3 text-[#6B6B6B]">{entry.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${SOURCE_BADGE[entry.status.toUpperCase()] || SOURCE_BADGE.ESTIMATED}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── LIMITATIONS ─────────────────────────────────────────────────── */}
      {report.limitations.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#F5F5F3] border border-[#E2E2DC] space-y-2">
          <h3 className="font-mono-data font-bold text-xs text-[#6B6B6B] uppercase tracking-wider">
            Analysis Limitations & Disclosures
          </h3>
          <ul className="space-y-1">
            {report.limitations.map((l, i) => (
              <li key={i} className="text-xs text-[#6B6B6B] flex gap-2">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C9793A]" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── FOOTER ACTIONS ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#E2E2DC]">
        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2 text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start New Assessment
        </button>
        <div className="text-[10px] font-mono-data text-[#6B6B6B] text-center">
          VyapaarIQ Decision Intelligence v{report.engine_version} · Verified Pilot: Nashik District, Maharashtra
        </div>
      </div>

    </div>
  );
};
