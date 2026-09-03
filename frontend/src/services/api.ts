/**
 * VyapaarIQ API Client — v2.0
 * Single source of truth for all backend communication.
 * No fake data, no hardcoded fallbacks for business logic.
 */

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface LocationSearchResult {
  village_lgd_code: number;
  village_name: string;
  subdistrict_lgd_code: number;
  subdistrict_name: string;
  district_lgd_code: number;
  district_name: string;
  state_code: number;
  state_name: string;
  latitude?: number;
  longitude?: number;
  provenance: string;
}

export interface LocationSearchResponse {
  query: string;
  total_results: number;
  results: LocationSearchResult[];
}

export interface CoverageInfo {
  supported: boolean;
  region?: string | null;
  message: string;
}

export interface AdministrativeContext {
  village?: string;
  village_lgd_code?: number;
  taluka?: string;
  subdistrict_lgd_code?: number;
  district?: string;
  district_lgd_code?: number;
  state?: string;
  state_code?: number;
}

export interface LocationResolveResponse {
  latitude: number;
  longitude: number;
  coverage: CoverageInfo;
  administrative?: AdministrativeContext | null;
}

export interface FinancialCalculateRequest {
  margin_capital: number;
  project_cost: number;
  interest_rate: number;
  tenure_years: number;
  moratorium_months?: number;
}

export interface FinancialCalculateResponse {
  margin_capital: number;
  project_cost: number;
  required_loan_amount: number;
  max_borrowing_capacity: number;
  interest_rate: number;
  tenure_years: number;
  moratorium_months: number;
  monthly_emi: number;
  total_repayment: number;
  total_interest_payable: number;
  provenance: Record<string, any>;
}

export interface BusinessCategorySchema {
  category_code: string;
  display_name: string;
  target_segments: string[];
  relevant_commodities: string[];
  required_facilities: string[];
  risk_factors: string[];
  pricing_method?: string;
  is_active: boolean;
}

export interface BusinessCategoriesResponse {
  total_categories: number;
  categories: BusinessCategorySchema[];
}

export interface DataPoint {
  label: string;
  value: any;
  source: string; // OFFICIAL | USER_PROVIDED | CALCULATED | PROXY | ESTIMATED | UNAVAILABLE
  source_detail?: string;
}

export interface FeasibilityModule {
  status: string;
  score: number;
  metrics: Record<string, any>;
  insights: string[];
  data_points?: DataPoint[];
}

export interface FinancialTwinScenario {
  label: string;
  revenue_assumption: number;
  monthly_fixed_costs: number;
  monthly_variable_costs: number;
  operating_surplus: number;
  emi: number;
  cash_after_emi: number;
  break_even_months?: number | null;
  note?: string;
}

export interface FinancialDigitalTwin {
  emi: number;
  loan_amount: number;
  conservative: FinancialTwinScenario;
  expected: FinancialTwinScenario;
  optimistic: FinancialTwinScenario;
}

export interface AIReasoning {
  executive_summary: string;
  action_plan: string[];
  evidence: string;
}

export interface DataProvenanceEntry {
  dataset: string;
  source: string;
  date: string;
  status: string;
}

export interface FeasibilityResponse {
  status: string;
  analysis_id: string;
  engine_version: string;
  viability_score: number;
  confidence_score: number;
  recommendation: string;
  market_reach: FeasibilityModule;
  opportunity_analysis: FeasibilityModule;
  competition: FeasibilityModule;
  pricing: FeasibilityModule;
  threats: FeasibilityModule;
  swot: Record<string, string[]>;
  financial_digital_twin: FinancialDigitalTwin;
  ai_reasoning: AIReasoning;
  data_provenance: DataProvenanceEntry[];
  limitations: string[];
}

export interface FeasibilityRequest {
  latitude: number;
  longitude: number;
  village_lgd_code?: number | null;
  district_lgd_code?: number | null;
  category_code: string;
  business_description?: string;
  business_stage?: string;
  target_customers?: string[];
  service_area?: string;
  expected_customers_per_month?: number | null;
  capacity_value?: number | null;
  capacity_unit?: string;
  operating_days_per_month?: number | null;
  margin_capital: number;
  project_cost: number;
  tenure_years: number;
  interest_rate: number;
  existing_debt_monthly?: number;
  monthly_fixed_costs?: number | null;
  monthly_variable_costs?: number | null;
  expected_monthly_revenue?: number | null;
  raw_material_availability?: string;
  electricity_need?: string;
  cold_storage_needed?: boolean | null;
  aware_of_competitors?: string;
  user_competitor_count?: number | null;
  entrepreneur_experience?: string;
  risk_tolerance?: string;
  main_concern?: string;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (netErr) {
    throw new Error(
      'Unable to connect to the VyapaarIQ analysis server. ' +
      'Please check your network connection or verify that the backend API service is online.'
    );
  }
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const errBody = await response.json();
      detail = errBody.detail || detail;
    } catch {}
    throw new Error(`API error ${response.status}: ${detail}`);
  }
  return response.json();
}

// ── API CLIENT ────────────────────────────────────────────────────────────────

export const api = {
  async searchLocations(query: string): Promise<LocationSearchResponse> {
    if (!query.trim()) return { query, total_results: 0, results: [] };
    return apiFetch(`/api/v1/locations/search?q=${encodeURIComponent(query)}`);
  },

  async resolveLocation(latitude: number, longitude: number): Promise<LocationResolveResponse> {
    return apiFetch('/api/v1/locations/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude, longitude }),
    });
  },

  async getBusinessCategories(): Promise<BusinessCategoriesResponse> {
    return apiFetch('/api/v1/business/categories');
  },

  async calculateFinancialPlan(req: FinancialCalculateRequest): Promise<FinancialCalculateResponse> {
    return apiFetch('/api/v1/financial/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  },

  async analyzeFeasibility(req: FeasibilityRequest): Promise<FeasibilityResponse> {
    return apiFetch('/api/v1/feasibility/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  },

  async getFeasibilityAnalysis(analysisId: string): Promise<FeasibilityResponse> {
    return apiFetch(`/api/v1/feasibility/analyze/${analysisId}`);
  },

  async getHealth() {
    return apiFetch('/health');
  },
};
