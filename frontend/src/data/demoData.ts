export interface ConfidenceMetric {
  label: string;
  value: string | number;
  confidence: 'official' | 'local' | 'estimated';
  trend?: 'up' | 'stable' | 'down';
  description?: string;
}

export interface BusinessAnalysisData {
  businessViabilityScore: number;
  maxScore: number;
  recommendation: string;
  recommendationType: 'proceed' | 'conditional' | 'high_risk';
  whyExplanation: string;
  
  metrics: {
    marketDemand: number;
    marketDemandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    competition: number;
    competitionLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    capitalAdequacy: number;
    profitPotential: number;
    loanAffordability: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };

  financialSummary: {
    estimatedProjectCost: string;
    ownContribution: string;
    requiredLoan: string;
    monthlyEmi: string;
    paybackPeriod: string;
    breakEvenMonths: number;
    debtServiceCoverageRatio: number; // e.g. 1.85
  };

  locationContext: {
    region: string;
    district: string;
    catchmentPopulation: string;
    nearestMandiDistance: string;
    activeCompetitorsCount: number;
  };

  confidenceBreakdown: {
    officialCount: number;
    localCount: number;
    estimatedCount: number;
  };

  locationNodes: Array<{
    id: string;
    name: string;
    x: number; // percentage 0-100 for canvas/svg layout
    y: number;
    type: 'hub' | 'competitor' | 'demand_center' | 'supplier' | 'financial';
    signal: string;
    intensity: number;
  }>;
}

export const defaultDemoAnalysis: BusinessAnalysisData = {
  businessViabilityScore: 86,
  maxScore: 100,
  recommendation: 'PROCEED WITH CONDITIONS',
  recommendationType: 'conditional',
  whyExplanation: 'Strong local demand and manageable competition support the opportunity, but retaining working capital reduces repayment risk.',
  
  metrics: {
    marketDemand: 82,
    marketDemandLevel: 'HIGH',
    competition: 61,
    competitionLevel: 'LOW',
    capitalAdequacy: 91,
    profitPotential: 79,
    loanAffordability: 88,
    riskLevel: 'MEDIUM'
  },

  financialSummary: {
    estimatedProjectCost: '₹12.4L',
    ownContribution: '₹5.0L',
    requiredLoan: '₹7.4L',
    monthlyEmi: '₹31K / month',
    paybackPeriod: '18 months',
    breakEvenMonths: 7,
    debtServiceCoverageRatio: 1.84
  },

  locationContext: {
    region: 'Kannauj Micro-Cluster',
    district: 'Kannauj Rural North',
    catchmentPopulation: '42,000 households',
    nearestMandiDistance: '3.4 km',
    activeCompetitorsCount: 3
  },

  confidenceBreakdown: {
    officialCount: 14,
    localCount: 8,
    estimatedCount: 5
  },

  locationNodes: [
    { id: 'n1', name: 'Central Mandi Hub', x: 28, y: 35, type: 'hub', signal: 'High Demand Flow', intensity: 0.9 },
    { id: 'n2', name: 'Competitor B (Stale inventory)', x: 62, y: 28, type: 'competitor', signal: 'Low Speed', intensity: 0.4 },
    { id: 'n3', name: 'Panchayat Agri Cluster', x: 44, y: 64, type: 'demand_center', signal: '+18% Buyer Growth', intensity: 0.85 },
    { id: 'n4', name: 'Rural Bank Node', x: 75, y: 72, type: 'financial', signal: 'Priority Sector Loan', intensity: 0.95 },
    { id: 'n5', name: 'Feeder Highway Junction', x: 18, y: 78, type: 'supplier', signal: 'Freight Route', intensity: 0.7 }
  ]
};

export const sampleBusinessTypes = [
  { label: 'Cold Storage & Agro Processing', category: 'Agriculture & Food' },
  { label: 'Solar Powered Dairy Chilling Unit', category: 'Dairy & Livestock' },
  { label: 'Semi-Automated Garment Workshop', category: 'Textiles & Manufacturing' },
  { label: 'Hardware & Solar Equipment Supply', category: 'Retail & Distribution' },
  { label: 'Custom Hire Agri-Machinery Hub', category: 'Services' }
];

export const sampleDistricts = [
  'Kannauj Rural North, Uttar Pradesh',
  'Mandya Agri-Cluster, Karnataka',
  'Satara Western Zone, Maharashtra',
  'Darbhanga East, Bihar',
  'Warangal Industrial Outer, Telangana'
];
