export type CityId = 'koraput' | 'bhubaneswar';

export type StakeholderRole =
  | 'government'
  | 'citizen'
  | 'investor'
  | 'business'
  | 'ngo';

export type SectorCategory =
  | 'healthcare'
  | 'education'
  | 'employment'
  | 'infrastructure'
  | 'governance'
  | 'environment';

export interface CityProfile {
  id: CityId;
  name: string;
  regionalTitle: string;
  state: string;
  category: 'Aspirational District Hub' | 'Tier-2 Capital / Benchmark Smart City';
  population: number;
  populationLabel: string;
  areaSqKm: number;
  literacyRate: number;
  perCapitaIncomeInr: number;
  subdivisionsOrZones: number;
  blocksOrWardsCount: number;
  description: string;
  geography: string;
  administrativeHQ: string;
  keyStrengths: string[];
  coreChallenges: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface KpiMetric {
  id: string;
  title: string;
  sector: SectorCategory;
  value: number;
  displayValue: string;
  unit: string;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  benchmarkValue: number;
  benchmarkDisplay: string;
  benchmarkCity: string;
  benchmarkDelta: string;
  status: 'positive' | 'warning' | 'critical' | 'benchmark';
  description: string;
  dataConfidence: 'High (Verified Model)' | 'Medium (Census & Survey Proxy)';
  historicalData: {
    year: string;
    value: number;
    benchmark: number;
  }[];
}

export interface CityComparisonMetric {
  id: string;
  category: SectorCategory;
  metricName: string;
  unit: string;
  koraputValue: number;
  koraputDisplay: string;
  bhubaneswarValue: number;
  bhubaneswarDisplay: string;
  stateAvg: number;
  stateAvgDisplay: string;
  nationalTarget: number;
  gapPercentage: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  runwayYears: number;
  notes: string;
}

export interface DevelopmentGap {
  id: string;
  title: string;
  cityId: CityId;
  sector: SectorCategory;
  severity: 'Critical' | 'High' | 'Moderate';
  gapMetric: string;
  currentStatus: string;
  benchmarkStatus: string;
  rootCauses: string[];
  affectedPopulation: string;
  recommendedIntervention: string;
  estimatedInvestmentCr: number;
  projectedImpact: string;
  targetStakeholders: StakeholderRole[];
}

export interface PolicyRecommendation {
  id: string;
  title: string;
  cityId: CityId;
  sector: SectorCategory;
  priority: 'Immediate' | 'Medium Term' | 'Strategic';
  objective: string;
  estimatedBudgetCr: number;
  fundingMechanism: string;
  timeToImplementMonths: number;
  impactScore: number; // 0 - 100
  feasibilityScore: number; // 0 - 100
  keyStakeholders: StakeholderRole[];
  expectedOutcomes: string[];
  kpiImpact: {
    kpi: string;
    delta: string;
  }[];
}

export interface CivicAssetPoint {
  id: string;
  name: string;
  cityId: CityId;
  type: 'healthcare' | 'education' | 'transit' | 'industrial' | 'civic_office' | 'agriculture';
  subType: string;
  locality: string;
  status: 'Operational' | 'Under Upgrade' | 'Proposed Cluster';
  coordinates: {
    lat: number;
    lng: number;
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface RecentActivity {
  id: string;
  type: 'policy' | 'survey' | 'milestone' | 'investment' | 'alert';
  title: string;
  timestamp: string;
  cityId: CityId;
  sector: SectorCategory;
  actor: string;
  summary: string;
  metricTag?: string;
  statusBadge?: string;
}

export interface GrowthForecast {
  year: string;
  statusQuo: number;
  acceleratedPolicy: number;
  benchmarkPace: number;
  milestone?: string;
}

export interface CitizenFeedback {
  id: string;
  cityId: CityId;
  locality: string;
  satisfactionScore: number; // 0-100
  primaryConcern: string;
  respondentsCount: number;
  resolvedTicketsPercent: number;
  topDemands: string[];
}

export interface InvestorProject {
  id: string;
  title: string;
  cityId: CityId;
  sector: SectorCategory;
  location: string;
  projectType: string;
  capexInCr: number;
  expectedIrrPercent: number;
  esgRating: 'A+' | 'A' | 'B+' | 'B';
  status: string;
  directJobs: number;
  brief: string;
  highlights?: string[];
  isVerified?: boolean;
  verificationStage?: string;
  supportingEvidence?: string;
  potentialPartners?: string;
  regulatoryConsiderations?: string;
  costBreakdownJson?: string;
  revenueRangeJson?: string;
  riskFactorsJson?: string;
  assumptionsDisclosed?: string;
  enquiryCount?: number;
}

export type ResourceCategory =
  | 'agricultural'
  | 'local_product'
  | 'workforce'
  | 'tourism'
  | 'existing_business';

export interface LocalResource {
  id: string;
  city_id: CityId;
  category: ResourceCategory;
  title: string;
  description: string;
  key_metrics: string;
  certifications_or_anchor?: string;
  growth_potential: string;
  supporting_source: string;
}

export interface InvestmentEnquiry {
  id?: string;
  investment_id: string;
  investment_title?: string;
  investor_name: string;
  investor_email: string;
  organization: string;
  proposed_investment_cr?: number;
  target_timeline: string;
  message: string;
  contact_phone?: string;
  status?: string;
  created_at?: string;
}

export interface CostBreakdownItem {
  category: string;
  amount_cr: number;
  share_percent: number;
  description: string;
}

export interface ScenarioComparisonItem {
  scenario: string;
  capacity_utilization: number;
  capital_subsidy_percent: number;
  projected_irr_percent: number;
  payback_period_years: number;
  annual_ebitda_cr: number;
  annual_revenue_cr: number;
  confidence_level: string;
}

export interface RevenueTrajectoryPoint {
  year: number;
  min_revenue_cr: number;
  expected_revenue_cr: number;
  max_revenue_cr: number;
  driver_notes: string;
}

export interface RiskFactorItem {
  risk: string;
  category: string;
  severity: string;
  probability: string;
  mitigation_strategy: string;
  residual_risk: string;
}

export interface SensitivityMatrixCell {
  capacity_utilization_percent: number;
  capital_subsidy_percent: number;
  irr_percent: number;
  payback_years: number;
  annual_ebitda_cr: number;
  viability_label: 'Prime' | 'Viable' | 'Moderate' | 'Marginal';
}

export interface InvestmentAnalysisResponse {
  investment_id?: string;
  title: string;
  base_capex_cr: number;
  effective_capex_cr: number;
  assumptions_applied: Record<string, any>;
  scenario_comparisons: ScenarioComparisonItem[];
  capex_breakdown: CostBreakdownItem[];
  opex_breakdown: CostBreakdownItem[];
  revenue_trajectory: RevenueTrajectoryPoint[];
  risk_factors: RiskFactorItem[];
  sensitivity_matrix: SensitivityMatrixCell[];
  disclosed_assumptions: string[];
  data_sources: string[];
  regulatory_disclaimer: string;
}
