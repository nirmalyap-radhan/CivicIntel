'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Filter,
  CheckCircle2,
  TrendingUp,
  Info,
  ShieldAlert,
  Compass,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { civicApi, ApiCityMatchResponse, ApiBenchmarkCandidate } from '@/lib/api';

interface CityBenchmarkMatcherProps {
  selectedCityId: string;
  selectedCityName: string;
  onSelectBenchmark?: (benchmarkId: string) => void;
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  geography_terrain: 0.15,
  climate: 0.10,
  population: 0.10,
  economic_structure: 0.15,
  natural_resources: 0.15,
  education_human_dev: 0.15,
  infrastructure_healthcare: 0.10,
  tourism_cultural: 0.10,
};

const PRESETS = [
  {
    name: 'Research Paper Baseline',
    desc: 'Balanced 8-dimensional model from CivicIntel paper',
    weights: DEFAULT_WEIGHTS,
  },
  {
    name: 'Agro-Ecological & Resources',
    desc: 'Emphasizes terrain congruence and GI coffee/spice resources',
    weights: {
      geography_terrain: 0.25,
      climate: 0.15,
      population: 0.05,
      economic_structure: 0.10,
      natural_resources: 0.30,
      education_human_dev: 0.05,
      infrastructure_healthcare: 0.05,
      tourism_cultural: 0.05,
    },
  },
  {
    name: 'Human Capital & Education',
    desc: 'Prioritizes literacy, higher education, and formal employment',
    weights: {
      geography_terrain: 0.05,
      climate: 0.05,
      population: 0.10,
      economic_structure: 0.20,
      natural_resources: 0.05,
      education_human_dev: 0.35,
      infrastructure_healthcare: 0.15,
      tourism_cultural: 0.05,
    },
  },
  {
    name: 'Infrastructure & Civic Utilities',
    desc: 'Targets tap water, road connectivity, and digital penetration',
    weights: {
      geography_terrain: 0.10,
      climate: 0.05,
      population: 0.10,
      economic_structure: 0.15,
      natural_resources: 0.05,
      education_human_dev: 0.10,
      infrastructure_healthcare: 0.40,
      tourism_cultural: 0.05,
    },
  },
];

export function CityBenchmarkMatcher({
  selectedCityId,
  selectedCityName,
  onSelectBenchmark,
}: CityBenchmarkMatcherProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<ApiCityMatchResponse | null>(null);

  // Configuration state
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);
  const [aspirationalOnly, setAspirationalOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('benchmark_fit');
  const [topK, setTopK] = useState<number>(5);
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await civicApi.matchBenchmarks(selectedCityId, {
        custom_weights: weights,
        top_k: topK,
        aspirational_only: aspirationalOnly,
        sort_by: sortBy,
      });
      setMatchData(res);
      if (res.top_candidates.length > 0) {
        setExpandedCardId(res.top_candidates[0].candidate_city.id);
      }
    } catch (err: any) {
      console.error('Failed to run AI matching engine:', err);
      setError('Unable to load benchmark matching engine. Please verify the backend service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedCityId, aspirationalOnly, sortBy, topK]);

  const handleWeightChange = (key: string, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleApplyCustomWeights = () => {
    fetchMatches();
  };

  const handlePresetSelect = (presetWeights: Record<string, number>) => {
    setWeights(presetWeights);
  };

  return (
    <div className="space-y-6">
      {/* Engine Hero Header */}
      <div className="civic-card-navy p-5 sm:p-6 rounded-xl border border-teal-500/20 shadow-lg relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI City Benchmark Matching Engine
              </h2>
              <Badge variant="teal" size="sm">
                CivicIntel Core ML
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating multi-dimensional similarity across terrain, climate, natural resources, economy,
              and human capital. Separates contextual congruence from development maturity so{' '}
              <strong className="text-white">{selectedCityName}</strong> identifies actionable, progressive benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className="text-xs bg-slate-800/80 hover:bg-slate-700 text-teal-300 border-teal-500/30"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              {showWeightSliders ? 'Hide Weights' : 'Tune Weights'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchMatches}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Re-Match
            </Button>
          </div>
        </div>

        {/* Weights Tuning Panel */}
        {showWeightSliders && (
          <div className="mt-5 pt-5 border-t border-slate-700/60 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                  Illustrative Parameter Weights (CivicIntel Paper)
                </span>
                <span className="text-[11px] text-slate-400">
                  Weights are automatically normalized to sum to 100%.
                </span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handlePresetSelect(p.weights)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {Object.entries(weights).map(([catKey, val]) => {
                const labelMap: Record<string, string> = {
                  geography_terrain: 'Geography & Terrain',
                  climate: 'Climate',
                  population: 'Population Demographics',
                  economic_structure: 'Economic Structure',
                  natural_resources: 'Natural Resources',
                  education_human_dev: 'Education & HDI',
                  infrastructure_healthcare: 'Infrastructure & Health',
                  tourism_cultural: 'Tourism & Culture',
                };
                return (
                  <div key={catKey} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/50 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium text-[11px]">{labelMap[catKey] || catKey}</span>
                      <span className="font-mono text-teal-400 font-bold">{(val * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.5}
                      step={0.05}
                      value={val}
                      onChange={(e) => handleWeightChange(catKey, parseFloat(e.target.value))}
                      className="w-full accent-teal-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="teal"
                size="sm"
                onClick={handleApplyCustomWeights}
                className="text-xs"
              >
                Apply Custom Weights
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Control & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Aspirational Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={aspirationalOnly}
              onChange={(e) => setAspirationalOnly(e.target.checked)}
              className="accent-teal-600 rounded w-3.5 h-3.5 cursor-pointer"
            />
            <span className="font-medium text-slate-700">
              Aspirational Benchmarks Only (Maturity &gt;= Target)
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Rank by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="benchmark_fit">Balanced Benchmark Fit (Recommended)</option>
            <option value="similarity">Pure Contextual Similarity</option>
            <option value="maturity_delta">Maximum Maturity Leap</option>
          </select>

          <select
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={8}>Top 8</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Computing Multi-Dimensional Feature Similarity...</p>
          <p className="text-xs text-slate-400">
            Normalizing numerical metrics, calculating Jaccard resource sets, and evaluating maturity deltas.
          </p>
        </div>
      )}

      {error && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Engine Error</p>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Top Candidates Results Grid */}
      {!loading && matchData && matchData.top_candidates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              Top {matchData.top_candidates.length} Benchmark Cities for {matchData.target_city.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Formula: {matchData.methodology.formula}
            </span>
          </div>

          <div className="space-y-3">
            {matchData.top_candidates.map((cand, idx) => {
              const isExpanded = expandedCardId === cand.candidate_city.id;
              const isPrime = idx === 0;

              return (
                <Card
                  key={cand.candidate_city.id}
                  className={`transition-all duration-200 ${
                    isPrime ? 'ring-1 ring-teal-500/50 shadow-md' : ''
                  }`}
                >
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPrime
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                              {cand.candidate_city.name}
                            </h3>
                            <span className="text-xs font-normal text-slate-500">
                              {cand.candidate_city.state}
                            </span>
                            <Badge
                              variant={isPrime ? 'teal' : 'navy'}
                              size="sm"
                            >
                              {cand.candidate_city.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Development Maturity: <strong className="text-slate-800">{cand.development_maturity.candidate_score.toFixed(1)}/100</strong>{' '}
                            (vs {cand.development_maturity.target_score.toFixed(1)} in {matchData.target_city.name})
                          </p>
                        </div>
                      </div>

                      {/* Score Badges */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                            Similarity Score
                          </span>
                          <span className="text-lg font-bold text-teal-700 font-mono">
                            {cand.similarity_pct.toFixed(1)}%
                          </span>
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200" />

                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                            Maturity Delta
                          </span>
                          <span
                            className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                              cand.development_maturity.maturity_delta >= 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cand.development_maturity.maturity_delta >= 0 ? '+' : ''}
                            {cand.development_maturity.maturity_delta.toFixed(1)} pts
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setExpandedCardId(isExpanded ? null : cand.candidate_city.id)
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors ml-1"
                          title="Toggle feature breakdown"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* AI Rationale Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs leading-relaxed text-slate-700">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                        <Compass className="w-3.5 h-3.5 text-teal-600" />
                        AI Benchmark Rationale:
                      </div>
                      <p>{cand.explanation}</p>
                    </div>

                    {/* Category Congruence Progress Overview */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {Object.entries(cand.category_comparisons).map(([catKey, cat]) => (
                        <div
                          key={catKey}
                          className="bg-white p-2 rounded border border-slate-100 text-[11px] space-y-1"
                        >
                          <div className="flex justify-between items-center text-slate-600">
                            <span className="truncate pr-1 font-medium">{cat.label}</span>
                            <span className="font-mono font-bold text-slate-800">
                              {cat.similarity_pct.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                            <div
                              className="bg-teal-600 h-full rounded-full"
                              style={{ width: `${Math.max(5, cat.similarity_pct)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detailed Feature Breakdown (Accordion) */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Feature-Level Metric Comparison Breakdown
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {Object.entries(cand.category_comparisons).map(([catKey, cat]) => (
                            <div
                              key={catKey}
                              className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2"
                            >
                              <div className="flex justify-between items-center pb-1 border-b border-slate-200 font-semibold text-slate-800">
                                <span>{cat.label}</span>
                                <Badge variant="teal" size="sm">
                                  {cat.similarity_pct.toFixed(1)}% match
                                </Badge>
                              </div>

                              <div className="space-y-1.5 text-[11px]">
                                {Object.entries(cat.features).map(([featKey, featData]: [string, any]) => {
                                  if (featKey === 'natural_resources') {
                                    return (
                                      <div key={featKey} className="space-y-1 pt-1">
                                        <div className="text-slate-500 font-medium">Resources Congruence:</div>
                                        <div className="flex flex-wrap gap-1">
                                          {featData.shared.map((r: string) => (
                                            <span
                                              key={r}
                                              className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                                            >
                                              ✓ {r}
                                            </span>
                                          ))}
                                          {featData.candidate
                                            .filter((r: string) => !featData.shared.includes(r))
                                            .map((r: string) => (
                                              <span
                                                key={r}
                                                className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]"
                                              >
                                                + {r}
                                              </span>
                                            ))}
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={featKey}
                                      className="flex justify-between items-center py-0.5 text-slate-600"
                                    >
                                      <span className="capitalize">{featKey.replace(/_/g, ' ')}</span>
                                      <div className="font-mono text-right">
                                        <span className="text-slate-500">{String(featData.target)}</span>
                                        <span className="text-slate-400 mx-1">→</span>
                                        <span className="font-bold text-slate-900">
                                          {String(featData.candidate)}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Metadata, Sources & Warnings */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-slate-700">Supporting Sources:</span>
                            {cand.supporting_data_sources.map((s) => (
                              <Badge key={s} variant="navy" size="sm">
                                {s}
                              </Badge>
                            ))}
                          </div>

                          {onSelectBenchmark && (
                            <Button
                              variant="teal"
                              size="sm"
                              onClick={() => onSelectBenchmark(cand.candidate_city.id)}
                              className="text-xs"
                            >
                              Adopt as Primary Benchmark Matrix
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>

                        {/* Missing Data Warnings if any */}
                        {cand.missing_data_warnings.length > 0 && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800 text-[11px] space-y-1">
                            <span className="font-bold flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" />
                              Data Notes:
                            </span>
                            <ul className="list-disc list-inside">
                              {cand.missing_data_warnings.map((w, wIdx) => (
                                <li key={wIdx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
