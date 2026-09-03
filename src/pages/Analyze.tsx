import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calculator, Building2, Users, Truck, TrendingUp,
  Shield, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';
import { LocationMapPicker } from '@/components/ui/LocationMapPicker';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { api } from '@/services/api';
import type {
  LocationResolveResponse, FinancialCalculateResponse,
  BusinessCategorySchema, FeasibilityRequest
} from '@/services/api';

// ── TYPES ─────────────────────────────────────────────────────────────────────

interface LocationState {
  latitude: number;
  longitude: number;
  address: string;
  village?: string;
  village_lgd_code?: number;
  taluka?: string;
  district?: string;
  district_lgd_code?: number;
  state?: string;
  isSupported: boolean;
  coverageMessage?: string;
  premises?: string;
}

interface FinancingState {
  project_cost: number;
  margin_capital: number;
  tenure_years: number;
  interest_rate: number;
  existing_debt_monthly: number;
}

interface BusinessState {
  category_code: string;
  category_name: string;
  business_description: string;
  business_stage: string;
}

interface MarketState {
  target_customers: string[];
  service_area: string;
  expected_customers_per_month: string;
}

interface OperationsState {
  capacity_value: string;
  capacity_unit: string;
  operating_days_per_month: string;
  monthly_fixed_costs: string;
  monthly_variable_costs: string;
  expected_monthly_revenue: string;
  raw_material_availability: string;
  electricity_need: string;
  cold_storage_needed: string;
}

interface CompetitionState {
  aware_of_competitors: string;
  user_competitor_count: string;
}

interface RiskState {
  entrepreneur_experience: string;
  risk_tolerance: string;
  main_concern: string;
}

const STEPS = [
  { n: 1, label: 'LOCATION', icon: MapPin },
  { n: 2, label: 'BUSINESS', icon: Building2 },
  { n: 3, label: 'MARKET', icon: Users },
  { n: 4, label: 'OPERATIONS', icon: Truck },
  { n: 5, label: 'FINANCING', icon: Calculator },
  { n: 6, label: 'COMPETITION', icon: TrendingUp },
  { n: 7, label: 'RISK PROFILE', icon: Shield },
  { n: 8, label: 'REVIEW', icon: CheckCircle2 },
];

const TARGET_CUSTOMER_OPTIONS = [
  'Farmers', 'Households', 'Retailers', 'Restaurants',
  'Other Businesses', 'Government / Institutions', 'Traders', 'Other'
];

const PREMISES_OPTIONS = ['Owned', 'Rented', 'Leased', 'Not decided'];
const SERVICE_AREA_OPTIONS = ['Local village', 'Multiple nearby villages', 'Taluka', 'District', 'Other'];
const RAW_MAT_OPTIONS = ['Local', 'Nearby district', 'Outside district', 'Not decided'];
const ELECT_OPTIONS = ['Low', 'Medium', 'High'];
const EXP_OPTIONS = ['No prior experience', 'Some experience', 'Experienced', 'Expert'];
const RISK_OPTIONS = ['Conservative', 'Moderate', 'Aggressive'];
const CONCERN_OPTIONS = ['Demand', 'Competition', 'Loan repayment', 'Raw materials', 'Pricing', 'Operations', 'Other'];
const STAGE_OPTIONS = ['New business', 'Existing business', 'Expansion'];

// ── LOADING MESSAGES ─────────────────────────────────────────────────────────

const LOADING_MESSAGES = [
  'Verifying location coordinates...',
  'Loading demographic evidence from Census 2011...',
  'Evaluating registered MSME competition...',
  'Checking Agmarknet market prices...',
  'Evaluating infrastructure facilities...',
  'Calculating loan structure and EMI...',
  'Running feasibility scoring model...',
  'Synthesizing SWOT analysis...',
  'Generating recommendations...',
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export const Analyze: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BusinessCategorySchema[]>([]);
  const [financialCalc, setFinancialCalc] = useState<FinancialCalculateResponse | null>(null);

  const [location, setLocation] = useState<LocationState>({
    latitude: 20.1472, longitude: 74.2300,
    address: 'Lasalgaon, Niphad, Nashik, Maharashtra, India',
    village: 'Lasalgaon', taluka: 'Niphad', district: 'Nashik', state: 'Maharashtra',
    isSupported: true, coverageMessage: 'Verified Nashik pilot coverage active.', premises: 'Not decided',
  });

  const [financing, setFinancing] = useState<FinancingState>({
    project_cost: 1240000, margin_capital: 500000,
    tenure_years: 5, interest_rate: 9.5, existing_debt_monthly: 0,
  });

  const [business, setBusiness] = useState<BusinessState>({
    category_code: '', category_name: '', business_description: '', business_stage: 'New business',
  });

  const [market, setMarket] = useState<MarketState>({
    target_customers: [], service_area: '', expected_customers_per_month: '',
  });

  const [ops, setOps] = useState<OperationsState>({
    capacity_value: '', capacity_unit: '', operating_days_per_month: '26',
    monthly_fixed_costs: '', monthly_variable_costs: '', expected_monthly_revenue: '',
    raw_material_availability: '', electricity_need: '', cold_storage_needed: '',
  });

  const [competition, setCompetition] = useState<CompetitionState>({
    aware_of_competitors: '', user_competitor_count: '',
  });

  const [risk, setRisk] = useState<RiskState>({
    entrepreneur_experience: '', risk_tolerance: 'Moderate', main_concern: '',
  });

  // Fetch categories on mount
  useEffect(() => {
    api.getBusinessCategories()
      .then(res => { if (res.categories?.length) setCategories(res.categories); })
      .catch(err => console.warn('Categories fetch failed:', err.message));
  }, []);

  // Auto-calculate EMI when financing changes
  useEffect(() => {
    if (financing.project_cost > 0 && financing.margin_capital >= 0) {
      api.calculateFinancialPlan({
        margin_capital: financing.margin_capital,
        project_cost: financing.project_cost,
        interest_rate: financing.interest_rate,
        tenure_years: financing.tenure_years,
      }).then(setFinancialCalc).catch(() => {});
    }
  }, [financing.project_cost, financing.margin_capital, financing.interest_rate, financing.tenure_years]);

  const handleLocationChange = useCallback((loc: {
    lat: number; lng: number; address?: string; resolved: LocationResolveResponse | null;
  }) => {
    const admin = loc.resolved?.administrative;
    const isSupported = loc.resolved?.coverage.supported ?? false;
    setLocation(prev => ({
      ...prev,
      latitude: loc.lat,
      longitude: loc.lng,
      address: loc.address || `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`,
      village: admin?.village,
      village_lgd_code: admin?.village_lgd_code,
      taluka: admin?.taluka,
      district: admin?.district || 'Unknown',
      district_lgd_code: admin?.district_lgd_code,
      state: admin?.state || 'Unknown',
      isSupported,
      coverageMessage: loc.resolved?.coverage.message,
    }));
  }, []);

  const toggleCustomer = (c: string) => {
    setMarket(prev => ({
      ...prev,
      target_customers: prev.target_customers.includes(c)
        ? prev.target_customers.filter(x => x !== c)
        : [...prev.target_customers, c]
    }));
  };

  const selectedCategory = categories.find(c => c.category_code === business.category_code);

  // Capacity unit hint by category
  const capacityHint = () => {
    const code = business.category_code;
    if (code.includes('DAIRY')) return 'litres/day';
    if (code.includes('COLD')) return 'tonnes storage';
    if (code.includes('SOLAR')) return 'units/month';
    if (code.includes('SPICE')) return 'kg/month';
    return 'units/month';
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalyzeError(null);
    setLoadingMsgIdx(0);

    // Cycle through loading messages
    const interval = setInterval(() => {
      setLoadingMsgIdx(i => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 1200);

    const req: FeasibilityRequest = {
      latitude: location.latitude,
      longitude: location.longitude,
      village_lgd_code: location.village_lgd_code ?? null,
      district_lgd_code: location.district_lgd_code ?? null,
      category_code: business.category_code || 'DAIRY_FARM',
      business_description: business.business_description || undefined,
      business_stage: business.business_stage,
      target_customers: market.target_customers.length ? market.target_customers : undefined,
      service_area: market.service_area || undefined,
      expected_customers_per_month: market.expected_customers_per_month ? parseInt(market.expected_customers_per_month) : null,
      capacity_value: ops.capacity_value ? parseFloat(ops.capacity_value) : null,
      capacity_unit: ops.capacity_unit || capacityHint(),
      operating_days_per_month: ops.operating_days_per_month ? parseInt(ops.operating_days_per_month) : null,
      margin_capital: financing.margin_capital,
      project_cost: financing.project_cost,
      tenure_years: financing.tenure_years,
      interest_rate: financing.interest_rate,
      existing_debt_monthly: financing.existing_debt_monthly,
      monthly_fixed_costs: ops.monthly_fixed_costs ? parseFloat(ops.monthly_fixed_costs) : null,
      monthly_variable_costs: ops.monthly_variable_costs ? parseFloat(ops.monthly_variable_costs) : null,
      expected_monthly_revenue: ops.expected_monthly_revenue ? parseFloat(ops.expected_monthly_revenue) : null,
      raw_material_availability: ops.raw_material_availability || undefined,
      electricity_need: ops.electricity_need || undefined,
      cold_storage_needed: ops.cold_storage_needed === 'Yes' ? true : ops.cold_storage_needed === 'No' ? false : null,
      aware_of_competitors: competition.aware_of_competitors || undefined,
      user_competitor_count: competition.user_competitor_count ? parseInt(competition.user_competitor_count) : null,
      entrepreneur_experience: risk.entrepreneur_experience || undefined,
      risk_tolerance: risk.risk_tolerance || undefined,
      main_concern: risk.main_concern || undefined,
    };

    try {
      const result = await api.analyzeFeasibility(req);
      clearInterval(interval);
      // Navigate to the report page with the result stored in sessionStorage
      sessionStorage.setItem(`analysis_${result.analysis_id}`, JSON.stringify(result));
      navigate(`/analysis/${result.analysis_id}`);
    } catch (err: any) {
      clearInterval(interval);
      setAnalyzeError(err.message || 'Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-2xl bg-[#F5F5F3]/90 border border-[#E2E2DC] font-mono-data text-sm text-[#111111] focus:border-[#C9793A] focus:outline-none transition-colors";
  const selectCls = inputCls + " cursor-pointer";
  const labelCls = "block text-xs font-mono-data text-[#6B6B6B] uppercase mb-2 tracking-wide";

  const optionBtn = (val: string, current: string, setter: (v: string) => void, label?: string) => (
    <button
      key={val}
      type="button"
      onClick={() => setter(val)}
      className={`px-3 py-2 rounded-xl text-xs font-mono-data border transition-all ${
        current === val
          ? 'bg-[#111111] text-white border-[#111111]'
          : 'bg-white text-[#111111] border-[#E2E2DC] hover:border-[#C9793A]'
      }`}
    >
      {label || val}
    </button>
  );

  // Loading overlay
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 bg-[#0E1116] z-50 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-[#C9793A] animate-spin mb-6" />
        <h2 className="font-display text-2xl font-bold mb-2">Running Feasibility Analysis</h2>
        <p className="font-mono-data text-sm text-white/60 mt-2">
          {LOADING_MESSAGES[loadingMsgIdx]}
        </p>
        <div className="mt-6 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9793A] rounded-full transition-all duration-700"
            style={{ width: `${((loadingMsgIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-[#111111] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-mono-data uppercase tracking-widest text-[#C9793A] font-bold">
          BUSINESS FEASIBILITY ASSESSMENT
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
          Know your business before you borrow.
        </h1>
        <p className="text-sm text-[#6B6B6B]">
          Provide real business details. Get a real data-grounded feasibility analysis.
        </p>
      </div>

      {/* Step indicator — compact scrollable */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1 min-w-max mx-auto">
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.n}>
              <button
                onClick={() => { if (s.n < step) setStep(s.n); }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-mono-data font-bold uppercase transition-all whitespace-nowrap ${
                  step === s.n
                    ? 'bg-[#C9793A] text-white'
                    : step > s.n
                    ? 'bg-[#3F7657]/10 text-[#3F7657] cursor-pointer'
                    : 'bg-[#E2E2DC] text-[#6B6B6B]'
                }`}
              >
                {step > s.n ? '✓' : s.n} {s.label}
              </button>
              {idx < STEPS.length - 1 && <div className="w-3 h-px bg-[#E2E2DC]" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl apple-card shadow-xl"
        >

          {/* ─ STEP 1: LOCATION ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 01 — BUSINESS LOCATION</span>
                <h2 className="font-display text-2xl font-bold">Where exactly do you want to start this business?</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Click on the map, search for your village, or use your current location. Exact coordinates are required for the analysis engine.
                </p>
              </div>

              <LocationMapPicker
                initialLat={location.latitude}
                initialLng={location.longitude}
                onLocationChange={handleLocationChange}
              />

              {/* Coverage badge */}
              {location.address && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  location.isSupported
                    ? 'bg-[#3F7657]/8 border-[#3F7657]/20'
                    : 'bg-[#C9793A]/8 border-[#C9793A]/20'
                }`}>
                  <div className={`font-mono-data font-bold uppercase text-[10px] flex items-center gap-1.5 ${location.isSupported ? 'text-[#3F7657]' : 'text-[#C9793A]'}`}>
                    {location.isSupported ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {location.isSupported ? 'Nashik Pilot Coverage ✓' : 'Outside Current Pilot Coverage'}
                  </div>
                  <p className="text-[#6B6B6B]">{location.coverageMessage}</p>
                  {!location.isSupported && (
                    <p className="text-[#C9793A] font-medium">
                      Detailed feasibility analysis is currently available only for Nashik District. You may proceed, but analysis will have limited data.
                    </p>
                  )}
                  <div className="pt-1 font-mono-data text-[#111111] space-y-0.5">
                    {location.village && <div>Village: <strong>{location.village}</strong></div>}
                    {location.taluka && <div>Taluka: <strong>{location.taluka}</strong></div>}
                    {location.district && <div>District: <strong>{location.district}</strong></div>}
                    <div>Lat: {location.latitude.toFixed(6)} | Lon: {location.longitude.toFixed(6)}</div>
                  </div>
                </div>
              )}

              <div>
                <label className={labelCls}>Business premises type</label>
                <div className="flex flex-wrap gap-2">
                  {PREMISES_OPTIONS.map(p => optionBtn(p, location.premises || '', v => setLocation(prev => ({ ...prev, premises: v }))))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E2E2DC]">
                <PrimaryButton onClick={() => setStep(2)} variant="accent">
                  Next: Business Idea <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 2: BUSINESS ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 02 — BUSINESS IDEA</span>
                <h2 className="font-display text-2xl font-bold">What business are you planning?</h2>
              </div>

              <div>
                <label className={labelCls}>Select a business category <span className="text-[#C9793A]">*</span></label>
                {categories.length === 0 && (
                  <p className="text-xs text-[#C9793A] mb-2 font-mono-data">⚠ Could not fetch categories from backend. Check connectivity.</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map(cat => (
                    <div
                      key={cat.category_code}
                      onClick={() => setBusiness(prev => ({ ...prev, category_code: cat.category_code, category_name: cat.display_name }))}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        business.category_code === cat.category_code
                          ? 'bg-[#111111] text-white border-[#C9793A]'
                          : 'bg-white border-[#E2E2DC] hover:border-[#C9793A]'
                      }`}
                    >
                      <div className="font-bold text-sm mb-1">{cat.display_name}</div>
                      <div className="flex flex-wrap gap-1">
                        {cat.target_segments?.slice(0, 2).map(s => (
                          <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded font-mono-data ${business.category_code === cat.category_code ? 'bg-white/15' : 'bg-[#F5F5F3]'}`}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Describe your business plan (optional)</label>
                <textarea
                  value={business.business_description}
                  onChange={e => setBusiness(prev => ({ ...prev, business_description: e.target.value }))}
                  placeholder="e.g. I want to start a small dairy chilling unit serving 5 nearby villages..."
                  rows={3}
                  className={inputCls + " resize-none"}
                />
              </div>

              <div>
                <label className={labelCls}>Business stage</label>
                <div className="flex flex-wrap gap-2">
                  {STAGE_OPTIONS.map(s => optionBtn(s, business.business_stage, v => setBusiness(prev => ({ ...prev, business_stage: v }))))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(1)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(3)} variant="accent" disabled={!business.category_code}>
                  Next: Customer & Market <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 3: MARKET ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 03 — CUSTOMER & MARKET</span>
                <h2 className="font-display text-2xl font-bold">Who are your customers?</h2>
              </div>

              <div>
                <label className={labelCls}>Target customers (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {TARGET_CUSTOMER_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCustomer(c)}
                      className={`px-3 py-2 rounded-xl text-xs font-mono-data border transition-all ${
                        market.target_customers.includes(c)
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'bg-white text-[#111111] border-[#E2E2DC] hover:border-[#C9793A]'
                      }`}
                    >
                      {market.target_customers.includes(c) ? '✓ ' : ''}{c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Intended service area</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_AREA_OPTIONS.map(s => optionBtn(s, market.service_area, v => setMarket(prev => ({ ...prev, service_area: v }))))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Expected customers per month <span className="text-[#6B6B6B] normal-case">(your estimate — USER PROVIDED)</span></label>
                <input
                  type="number"
                  value={market.expected_customers_per_month}
                  onChange={e => setMarket(prev => ({ ...prev, expected_customers_per_month: e.target.value }))}
                  placeholder="e.g. 200"
                  className={inputCls}
                />
                <p className="text-[10px] text-[#6B6B6B] mt-1 font-mono-data">
                  This is labeled USER PROVIDED in the analysis — not validated against database.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(2)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(4)} variant="accent">
                  Next: Operations <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 4: OPERATIONS ──────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 04 — BUSINESS OPERATIONS</span>
                <h2 className="font-display text-2xl font-bold">Operating capacity & costs</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  These inputs directly determine your break-even calculation. Leave blank if unknown — it will be noted as UNAVAILABLE.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business capacity ({capacityHint()})</label>
                  <input
                    type="number"
                    value={ops.capacity_value}
                    onChange={e => setOps(prev => ({ ...prev, capacity_value: e.target.value }))}
                    placeholder={`e.g. 500`}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Operating days per month</label>
                  <input
                    type="number"
                    value={ops.operating_days_per_month}
                    onChange={e => setOps(prev => ({ ...prev, operating_days_per_month: e.target.value }))}
                    min={1} max={31}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Monthly fixed costs — ₹ <span className="text-[#6B6B6B] normal-case">(rent, salaries, electricity)</span></label>
                  <input
                    type="number"
                    value={ops.monthly_fixed_costs}
                    onChange={e => setOps(prev => ({ ...prev, monthly_fixed_costs: e.target.value }))}
                    placeholder="e.g. 35000"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Monthly variable costs — ₹ <span className="text-[#6B6B6B] normal-case">(raw materials, packaging)</span></label>
                  <input
                    type="number"
                    value={ops.monthly_variable_costs}
                    onChange={e => setOps(prev => ({ ...prev, monthly_variable_costs: e.target.value }))}
                    placeholder="e.g. 55000"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Expected monthly revenue — ₹ <span className="text-[#6B6B6B] normal-case">(your estimate)</span></label>
                <input
                  type="number"
                  value={ops.expected_monthly_revenue}
                  onChange={e => setOps(prev => ({ ...prev, expected_monthly_revenue: e.target.value }))}
                  placeholder="e.g. 130000"
                  className={inputCls}
                />
                <p className="text-[10px] text-[#6B6B6B] mt-1 font-mono-data">
                  If you don't know, leave blank. Engine will flag financial confidence as LIMITED.
                </p>
              </div>

              <div>
                <label className={labelCls}>Raw material availability</label>
                <div className="flex flex-wrap gap-2">
                  {RAW_MAT_OPTIONS.map(r => optionBtn(r, ops.raw_material_availability, v => setOps(prev => ({ ...prev, raw_material_availability: v }))))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Electricity requirement</label>
                  <div className="flex flex-wrap gap-2">
                    {ELECT_OPTIONS.map(e => optionBtn(e, ops.electricity_need, v => setOps(prev => ({ ...prev, electricity_need: v }))))}
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Cold storage needed?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Yes', 'No', 'Not sure'].map(v => optionBtn(v, ops.cold_storage_needed, val => setOps(prev => ({ ...prev, cold_storage_needed: val }))))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(3)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(5)} variant="accent">
                  Next: Financing <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 5: FINANCING ──────────────────────────────────────── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 05 — INVESTMENT & FINANCING</span>
                <h2 className="font-display text-2xl font-bold">How will you fund this business?</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Total planned investment — ₹</label>
                  <input type="number" value={financing.project_cost}
                    onChange={e => setFinancing(prev => ({ ...prev, project_cost: Number(e.target.value) }))}
                    className={inputCls} placeholder="1240000" />
                </div>
                <div>
                  <label className={labelCls}>Your own capital / equity — ₹</label>
                  <input type="number" value={financing.margin_capital}
                    onChange={e => setFinancing(prev => ({ ...prev, margin_capital: Number(e.target.value) }))}
                    className={inputCls} placeholder="500000" />
                </div>
                <div>
                  <label className={labelCls}>Loan tenure (years)</label>
                  <select value={financing.tenure_years}
                    onChange={e => setFinancing(prev => ({ ...prev, tenure_years: Number(e.target.value) }))}
                    className={selectCls}>
                    {[3, 5, 7, 10].map(y => <option key={y} value={y}>{y} Years</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Interest rate (% p.a.)</label>
                  <input type="number" step="0.25" value={financing.interest_rate}
                    onChange={e => setFinancing(prev => ({ ...prev, interest_rate: Number(e.target.value) }))}
                    className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Existing monthly debt repayments — ₹ <span className="text-[#6B6B6B] normal-case">(other loans, if any)</span></label>
                <input type="number" value={financing.existing_debt_monthly}
                  onChange={e => setFinancing(prev => ({ ...prev, existing_debt_monthly: Number(e.target.value) }))}
                  className={inputCls} placeholder="0" />
              </div>

              {/* EMI Preview card */}
              <div className="p-5 rounded-2xl bg-[#0E1116] text-white space-y-3">
                <span className="text-[10px] font-mono-data text-white/50 uppercase">CALCULATED BANK OBLIGATION</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/50 block">LOAN REQUIRED</span>
                    <span className="text-lg font-bold font-mono-data text-[#C9793A]">
                      ₹{Math.max(0, financing.project_cost - financing.margin_capital).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/50 block">MONTHLY EMI</span>
                    <span className="text-lg font-bold font-mono-data">
                      {financialCalc ? `₹${financialCalc.monthly_emi.toLocaleString('en-IN')}` : '...'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/50 block">TOTAL REPAYMENT</span>
                    <span className="text-lg font-bold font-mono-data text-[#3F7657]">
                      {financialCalc ? `₹${financialCalc.total_repayment.toLocaleString('en-IN')}` : '...'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 font-mono-data">CALCULATED by backend EMI engine (reducing balance method)</p>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(4)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(6)} variant="accent">
                  Next: Competition <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 6: COMPETITION ─────────────────────────────────────── */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 06 — COMPETITION</span>
                <h2 className="font-display text-2xl font-bold">Are you aware of existing competitors?</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  The engine independently queries the Udyam MSME database. Your input here is labeled USER PROVIDED.
                </p>
              </div>

              <div>
                <label className={labelCls}>Existing competitors in your area</label>
                <div className="flex flex-wrap gap-2">
                  {['Yes', 'No', 'Not Sure'].map(v => optionBtn(v, competition.aware_of_competitors, val => setCompetition(prev => ({ ...prev, aware_of_competitors: val }))))}
                </div>
              </div>

              {competition.aware_of_competitors === 'Yes' && (
                <div>
                  <label className={labelCls}>How many competitors do you know of? <span className="text-[#6B6B6B] normal-case">(USER PROVIDED)</span></label>
                  <input
                    type="number"
                    value={competition.user_competitor_count}
                    onChange={e => setCompetition(prev => ({ ...prev, user_competitor_count: e.target.value }))}
                    placeholder="e.g. 3"
                    className={inputCls}
                  />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-[#E2E2DC] text-xs font-mono-data text-[#6B6B6B]">
                The analysis engine will separately calculate the count of registered MSME businesses 
                in your category within 10km of your selected coordinates from the official Udyam registry. 
                That number is labeled OFFICIAL and independent from your input here.
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(5)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(7)} variant="accent">
                  Next: Risk Profile <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 7: RISK PROFILE ────────────────────────────────────── */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 07 — BUSINESS EXPERIENCE & RISK</span>
                <h2 className="font-display text-2xl font-bold">Your experience & risk profile</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">
                  Used to personalize recommendations only — does not affect objective market data scores.
                </p>
              </div>

              <div>
                <label className={labelCls}>Your business experience</label>
                <div className="flex flex-wrap gap-2">
                  {EXP_OPTIONS.map(e => optionBtn(e, risk.entrepreneur_experience, v => setRisk(prev => ({ ...prev, entrepreneur_experience: v }))))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Risk tolerance</label>
                <div className="flex flex-wrap gap-2">
                  {RISK_OPTIONS.map(r => optionBtn(r, risk.risk_tolerance, v => setRisk(prev => ({ ...prev, risk_tolerance: v }))))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Your main concern</label>
                <div className="flex flex-wrap gap-2">
                  {CONCERN_OPTIONS.map(c => optionBtn(c, risk.main_concern, v => setRisk(prev => ({ ...prev, main_concern: v }))))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(6)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton onClick={() => setStep(8)} variant="accent">
                  Review & Analyze <ChevronRight className="w-4 h-4 inline" />
                </PrimaryButton>
              </div>
            </div>
          )}

          {/* ─ STEP 8: REVIEW ──────────────────────────────────────────── */}
          {step === 8 && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono-data text-[#C9793A] uppercase font-bold block mb-1">STEP 08 — FINAL REVIEW</span>
                <h2 className="font-display text-2xl font-bold">Confirm your inputs before analysis</h2>
              </div>

              {/* Summary cards */}
              {[
                {
                  title: 'LOCATION', editStep: 1, rows: [
                    ['Address', location.address],
                    ['Coordinates', `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`],
                    ['Village', location.village || '—'],
                    ['Taluka', location.taluka || '—'],
                    ['Coverage', location.isSupported ? '✓ Nashik Pilot' : '⚠ Outside Pilot'],
                  ]
                },
                {
                  title: 'BUSINESS', editStep: 2, rows: [
                    ['Category', business.category_name || business.category_code || '—'],
                    ['Stage', business.business_stage],
                    ['Description', business.business_description || '—'],
                  ]
                },
                {
                  title: 'MARKET', editStep: 3, rows: [
                    ['Target customers', market.target_customers.join(', ') || '—'],
                    ['Service area', market.service_area || '—'],
                    ['Expected customers/month', market.expected_customers_per_month || '—'],
                  ]
                },
                {
                  title: 'FINANCING', editStep: 5, rows: [
                    ['Total Investment', `₹${financing.project_cost.toLocaleString('en-IN')}`],
                    ['Own Equity', `₹${financing.margin_capital.toLocaleString('en-IN')}`],
                    ['Loan Required', `₹${Math.max(0, financing.project_cost - financing.margin_capital).toLocaleString('en-IN')}`],
                    ['Monthly EMI', financialCalc ? `₹${financialCalc.monthly_emi.toLocaleString('en-IN')}` : '—'],
                    ['Tenure', `${financing.tenure_years} Years @ ${financing.interest_rate}%`],
                  ]
                },
                {
                  title: 'OPERATIONS', editStep: 4, rows: [
                    ['Monthly Fixed Costs', ops.monthly_fixed_costs ? `₹${Number(ops.monthly_fixed_costs).toLocaleString('en-IN')}` : 'Not provided'],
                    ['Monthly Variable Costs', ops.monthly_variable_costs ? `₹${Number(ops.monthly_variable_costs).toLocaleString('en-IN')}` : 'Not provided'],
                    ['Expected Revenue/month', ops.expected_monthly_revenue ? `₹${Number(ops.expected_monthly_revenue).toLocaleString('en-IN')}` : 'Not provided'],
                    ['Raw Materials', ops.raw_material_availability || '—'],
                  ]
                },
              ].map(section => (
                <div key={section.title} className="p-4 rounded-2xl bg-[#F5F5F3]/80 border border-[#E2E2DC]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono-data text-[#6B6B6B] uppercase font-bold">{section.title}</span>
                    <button onClick={() => setStep(section.editStep)} className="text-[10px] font-mono-data text-[#C9793A] font-bold hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="space-y-1">
                    {section.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-[#6B6B6B]">{k}</span>
                        <span className="font-medium text-[#111111] text-right max-w-[60%]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {!location.isSupported && (
                <div className="p-4 rounded-2xl bg-[#C9793A]/10 border border-[#C9793A]/30 text-xs space-y-1">
                  <div className="font-bold text-[#C9793A] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Outside Nashik Pilot Coverage
                  </div>
                  <p className="text-[#6B6B6B]">
                    Demographic, competition, and market data will be limited or unavailable for this location.
                    The analysis will explicitly mark these as UNAVAILABLE.
                  </p>
                </div>
              )}

              {!business.category_code && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono-data">
                  ⚠ No business category selected. Please go back to Step 2 and select a category.
                </div>
              )}

              {analyzeError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-mono-data">
                  ⚠ {analyzeError}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-[#E2E2DC]">
                <button onClick={() => setStep(7)} className="text-xs font-mono-data text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1">
                  <ChevronLeft className="w-3 h-3" /> Back
                </button>
                <PrimaryButton
                  onClick={runAnalysis}
                  variant="accent"
                  disabled={!business.category_code}
                >
                  Evaluate Business Feasibility →
                </PrimaryButton>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
