/**
 * CivicIntel API Client
 * Connects the frontend to the FastAPI backend (http://localhost:8000/api/v1).
 * Features graceful fallback to verified demonstration mock datasets if backend is offline.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiCity {
  id: string;
  name: string;
  state: string;
  category: string;
  population: number;
  area_sq_km: number;
  literacy_rate: number;
  per_capita_income_inr: number;
  subdivisions_count: number;
  wards_or_blocks_count: number;
  latitude: number;
  longitude: number;
  description?: string;
  geography?: string;
  administrative_hq?: string;
}

export interface ApiDevelopmentScore {
  city_id: string;
  city_name: string;
  composite_score: number;
  benchmark_city_id?: string;
  benchmark_city_name?: string;
  benchmark_score?: number;
  score_delta?: number;
  sector_scores: {
    sector: string;
    score: number;
    weight: number;
    indicators_count: number;
  }[];
  is_demonstration: boolean;
}

export interface ApiComparison {
  target_city_id: string;
  target_city_name: string;
  benchmark_city_id: string;
  benchmark_city_name: string;
  overall_gap_percentage: number;
  average_runway_years: number;
  metrics: {
    metric_key: string;
    metric_name: string;
    sector: string;
    target_value: number;
    benchmark_value: number;
    gap_percentage: number;
    priority: string;
    estimated_runway_years: number;
    notes?: string;
  }[];
}

class CivicApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkHealth(): Promise<{ status: string; database: string } | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getCities(): Promise<ApiCity[]> {
    try {
      const res = await fetch(`${this.baseUrl}/cities`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch cities');
      return await res.json();
    } catch (err) {
      console.warn('[CivicIntel API] Backend unavailable, using local data fallback.');
      throw err;
    }
  }

  async getCityById(cityId: string): Promise<ApiCity> {
    const res = await fetch(`${this.baseUrl}/cities/${cityId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch city ${cityId}`);
    return await res.json();
  }

  async getDevelopmentScore(cityId: string): Promise<ApiDevelopmentScore> {
    const res = await fetch(`${this.baseUrl}/cities/${cityId}/development-score`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to compute development score for ${cityId}`);
    return await res.json();
  }

  async getComparison(
    targetCityId: string = 'koraput',
    benchmarkCityId: string = 'bhubaneswar'
  ): Promise<ApiComparison> {
    const res = await fetch(
      `${this.baseUrl}/cities/compare?target_city_id=${targetCityId}&benchmark_city_id=${benchmarkCityId}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error('Failed to fetch comparison');
    return await res.json();
  }

  async getPolicies(cityId?: string, sector?: string) {
    let url = `${this.baseUrl}/policies?limit=100`;
    if (cityId) url += `&city_id=${cityId}`;
    if (sector && sector !== 'all') url += `&sector=${sector}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch policies');
    return await res.json();
  }

  async getInvestments(cityId?: string, sector?: string) {
    let url = `${this.baseUrl}/investments?limit=100`;
    if (cityId) url += `&city_id=${cityId}`;
    if (sector && sector !== 'all') url += `&sector=${sector}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch investments');
    return await res.json();
  }

  async getLocalResources(cityId?: string, category?: string): Promise<any[]> {
    let url = `${this.baseUrl}/investments/resources?limit=100`;
    if (cityId) url += `&city_id=${cityId}`;
    if (category && category !== 'all') url += `&category=${category}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch local resources');
    return await res.json();
  }

  async getOpportunities(cityId?: string, sector?: string, status?: string): Promise<any[]> {
    let url = `${this.baseUrl}/investments/opportunities?limit=100`;
    if (cityId) url += `&city_id=${cityId}`;
    if (sector && sector !== 'all') url += `&sector=${sector}`;
    if (status && status !== 'all') url += `&status=${status}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return await res.json();
  }

  async getOpportunityById(id: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/investments/opportunities/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch opportunity ${id}`);
    return await res.json();
  }

  async submitInvestmentEnquiry(enquiry: {
    investment_id: string;
    investor_name: string;
    investor_email: string;
    organization: string;
    proposed_investment_cr?: number;
    target_timeline: string;
    message: string;
    contact_phone?: string;
  }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/investments/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit investor enquiry');
    }
    return await res.json();
  }

  async listInvestmentEnquiries(investmentId?: string): Promise<any[]> {
    let url = `${this.baseUrl}/investments/enquiries`;
    if (investmentId) url += `?investment_id=${investmentId}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to list enquiries');
    return await res.json();
  }

  async analyzeInvestment(payload: {
    investment_id?: string;
    capex_in_cr?: number;
    capacity_utilization_percent: number;
    capital_subsidy_percent: number;
    tariff_realization_multiplier?: number;
    cost_of_capital_percent?: number;
    opex_annual_growth_percent?: number;
  }): Promise<any> {
    const res = await fetch(`${this.baseUrl}/investments/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to analyze investment');
    }
    return await res.json();
  }

  async matchBenchmarks(
    cityId: string = 'koraput',
    options?: {
      custom_weights?: Record<string, number>;
      top_k?: number;
      min_maturity_delta?: number;
      aspirational_only?: boolean;
      sort_by?: string;
    }
  ): Promise<ApiCityMatchResponse> {
    const res = await fetch(`${this.baseUrl}/cities/${cityId}/match-benchmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        custom_weights: options?.custom_weights,
        top_k: options?.top_k ?? 5,
        min_maturity_delta: options?.min_maturity_delta,
        aspirational_only: options?.aspirational_only ?? false,
        sort_by: options?.sort_by ?? 'similarity',
      }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to match benchmarks for ${cityId}`);
    return await res.json();
  }

  async getMatchingWeights(): Promise<any> {
    const res = await fetch(`${this.baseUrl}/cities/matching-weights`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch matching weights');
    return await res.json();
  }

  async generateRecommendations(
    cityId: string = 'koraput',
    options?: {
      budget_constraint_cr?: number;
      prioritized_sectors?: string[];
      benchmark_city_id?: string;
    }
  ): Promise<ApiPolicyGenerationResponse> {
    const res = await fetch(`${this.baseUrl}/policy-recommendations/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city_id: cityId,
        budget_constraint_cr: options?.budget_constraint_cr,
        prioritized_sectors: options?.prioritized_sectors,
        benchmark_city_id: options?.benchmark_city_id,
      }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to generate policy recommendations');
    return await res.json();
  }

  async getPolicyRecommendations(
    cityId: string = 'koraput',
    sector?: string,
    status?: string
  ): Promise<ApiPolicyRecommendation[]> {
    let url = `${this.baseUrl}/policy-recommendations/cities/${cityId}`;
    const params = new URLSearchParams();
    if (sector && sector !== 'all') params.append('sector', sector);
    if (status && status !== 'all') params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch policy recommendations');
    return await res.json();
  }

  async getRecommendationEvidence(recId: string): Promise<ApiEvidenceDossier> {
    const res = await fetch(`${this.baseUrl}/policy-recommendations/${recId}/evidence`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Failed to fetch evidence for recommendation ${recId}`);
    return await res.json();
  }

  async reviewRecommendation(
    recId: string,
    action: 'accept' | 'reject' | 'request_changes' | 'mark_under_review',
    notes: string,
    modificationRequests?: string[],
    authToken?: string
  ): Promise<ApiPolicyRecommendation> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${this.baseUrl}/policy-recommendations/${recId}/action`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action,
        reviewer_notes: notes,
        modification_requests: modificationRequests,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Failed to review recommendation ${recId}`);
    }
    return await res.json();
  }

  // --- RAG Evidence & Government Schemes ---
  async queryRAG(
    query: string,
    sector?: string,
    cityOrRegion?: string,
    topK: number = 5
  ): Promise<ApiRAGQueryResponse> {
    const res = await fetch(`${this.baseUrl}/rag/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        sector: sector && sector !== 'all' ? sector : undefined,
        city_or_region: cityOrRegion && cityOrRegion !== 'all' ? cityOrRegion : undefined,
        top_k: topK,
      }),
    });
    if (!res.ok) throw new Error('Failed to query RAG knowledge base');
    return await res.json();
  }

  async getRAGDocuments(sector?: string, region?: string): Promise<ApiRAGDocument[]> {
    let url = `${this.baseUrl}/rag/documents`;
    const params = new URLSearchParams();
    if (sector && sector !== 'all') params.append('sector', sector);
    if (region && region !== 'all') params.append('region', region);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch RAG documents');
    return await res.json();
  }

  async getRAGDocumentById(docId: string): Promise<ApiRAGDocumentDetail> {
    const res = await fetch(`${this.baseUrl}/rag/documents/${docId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch RAG document ${docId}`);
    return await res.json();
  }
}



export interface ApiBenchmarkCandidate {
  candidate_city: {
    id: string;
    name: string;
    state: string;
    category: string;
  };
  similarity_score: number;
  similarity_pct: number;
  weighted_distance: number;
  benchmark_fit_score: number;
  development_maturity: {
    candidate_score: number;
    target_score: number;
    maturity_delta: number;
    maturity_tier: string;
  };
  category_comparisons: Record<
    string,
    {
      category: string;
      label: string;
      weight: number;
      normalized_distance: number;
      similarity_pct: number;
      weighted_contribution: number;
      features: Record<string, any>;
    }
  >;
  supporting_data_sources: string[];
  missing_data_warnings: string[];
  explanation: string;
}

export interface ApiCityMatchResponse {
  target_city: {
    id: string;
    name: string;
    state: string;
    category: string;
    development_maturity_score: number;
  };
  methodology: {
    formula: string;
    distance_metric: string;
    normalization: string;
    categorical_encoding: string;
    maturity_handling: string;
    active_weights: Record<string, number>;
    sort_criterion: string;
  };
  total_candidates_evaluated: number;
  candidates_returned_count: number;
  top_candidates: ApiBenchmarkCandidate[];
}

export interface ApiSourceCitation {
  document_title: string;
  publisher: string;
  year: number;
  relevant_passage: string;
  citation_reference: string;
}

export interface ApiPolicyRecommendation {
  id: string;
  city_id: string;
  title: string;
  sector: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Strategic';
  problem_statement: string;
  proposed_intervention: string;
  benchmark_evidence: {
    metric: string;
    target_value: number;
    benchmark_value: number;
    gap_percentage: number;
    benchmark_city: string;
    precedent_summary: string;
  }[];
  local_requirements: string[];
  applicable_schemes: {
    scheme_name: string;
    ministry: string;
    funding_share: string;
    statutory_basis?: string;
    source_citation: string;
  }[];
  estimated_cost_cr: number | null;
  cost_status:
    | 'Verified Scheme Budget'
    | 'Estimated from Standard Schedule of Rates'
    | 'Requires Feasibility Study'
    | 'Unsupported / Data Gap';
  cost_breakdown?: Record<string, number> | null;
  expected_outcomes: {
    kpi: string;
    baseline: string;
    projected_target: string;
    target_horizon_months: number;
    confidence_level: string;
  }[];
  implementation_dependencies: string[];
  risks: {
    risk_description: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    mitigation_strategy: string;
  }[];
  data_gaps: string[];
  sources: ApiSourceCitation[];
  confidence_score: number;
  human_review_required: boolean;
  status: 'Proposed' | 'Under Review' | 'Approved' | 'Rejected' | 'Changes Requested';
  reviewer_id?: string | null;
  reviewer_role?: string | null;
  reviewer_notes?: string | null;
  reviewed_at?: string | null;
  model_name: string;
  generation_timestamp: string;
}

export interface ApiPolicyGenerationResponse {
  target_city: {
    id: string;
    name: string;
    state: string;
    development_maturity_score: number;
  };
  benchmark_city: {
    id: string;
    name: string;
    state: string;
    development_maturity_score: number;
  };
  deterministic_gaps: {
    sector: string;
    gap_title: string;
    metric_key: string;
    target_value: number;
    benchmark_value: number;
    gap_percentage: number;
    severity: string;
    required_information: string[];
    available_information: string[];
    missing_information: string[];
    readiness_for_recommendation: boolean;
  }[];
  recommendations: ApiPolicyRecommendation[];
  safeguards_summary: Record<string, any>;
  generation_metadata: Record<string, any>;
}

export interface ApiEvidenceDossier {
  recommendation_id: string;
  title: string;
  sector: string;
  confidence_score: number;
  why_recommended: {
    core_problem: string;
    benchmark_precedents: any[];
    supporting_passages: ApiSourceCitation[];
    applicable_statutory_schemes: any[];
    cost_rigor: {
      estimated_budget_cr: number | null;
      cost_status: string;
      cost_breakdown?: Record<string, number> | null;
    };
    remaining_data_gaps: string[];
    feasibility_risks: any[];
  };
  governance_safeguard: string;
}

export interface ApiRAGDocument {
  id: string;
  document_title: string;
  publishing_organization: string;
  publication_date: string;
  source_url_or_reference: string;
  applicable_city_or_region: string;
  relevant_sector: string;
  document_version: string;
  verification_status: string;
  authority_level: string;
  document_type: string;
  summary?: string;
  chunk_count: number;
  created_at: string;
}

export interface ApiRAGDocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  chunk_text: string;
  section_heading?: string;
  page_or_paragraph?: string;
  token_count: number;
}

export interface ApiRAGDocumentDetail extends ApiRAGDocument {
  raw_content?: string;
  chunks: ApiRAGDocumentChunk[];
}

export interface ApiRAGRetrievalResultItem {
  chunk_id: string;
  document_id: string;
  document_title: string;
  publishing_organization: string;
  publication_date: string;
  source_url_or_reference: string;
  applicable_city_or_region: string;
  relevant_sector: string;
  document_version: string;
  verification_status: string;
  authority_level: string;
  section_heading?: string;
  chunk_text: string;
  similarity_score: number;
  citation_reference: string;
}

export interface ApiRAGQueryResponse {
  query: string;
  sector_filter?: string | null;
  region_filter?: string | null;
  total_chunks_matched: number;
  results: ApiRAGRetrievalResultItem[];
}

export const civicApi = new CivicApiClient();
export const api = civicApi;



