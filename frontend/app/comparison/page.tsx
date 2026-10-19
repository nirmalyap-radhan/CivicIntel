'use client';

import React, { useState } from 'react';
import {
  GitCompare,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Download,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { COMPARISON_METRICS } from '@/data/metrics';
import { CityComparisonMetric, SectorCategory } from '@/types';
import { CityBenchmarkMatcher } from '@/components/dashboard/CityBenchmarkMatcher';

export default function ComparisonPage() {
  const { selectedCity, cityProfile, selectedSector, setSelectedSector } = useCity();
  const [activeTab, setActiveTab] = useState<'ai_matcher' | 'indicator_matrix'>('ai_matcher');
  const [sectorFilter, setSectorFilter] = useState<SectorCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof CityComparisonMetric>('gapPercentage');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredMetrics = COMPARISON_METRICS.filter((m) => {
    const matchSector = sectorFilter === 'all' || m.category === sectorFilter;
    const matchPriority = priorityFilter === 'all' || m.priority === priorityFilter;
    return matchSector && matchPriority;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: keyof CityComparisonMetric) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              City Benchmarking Matrix
            </h1>
            <Badge variant="navy" size="sm">
              Target: {cityProfile.name} ({cityProfile.regionalTitle})
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Systematic multi-dimensional similarity matching and indicator-level catch-up runway projection.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('ai_matcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ai_matcher'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Benchmark Matching Engine
          </button>
          <button
            onClick={() => setActiveTab('indicator_matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'indicator_matrix'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            Direct Indicator Matrix
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ai_matcher' ? (
        <CityBenchmarkMatcher
          selectedCityId={selectedCity}
          selectedCityName={cityProfile.name}
          onSelectBenchmark={() => setActiveTab('indicator_matrix')}
        />
      ) : (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-700">
              Sector & Priority Indicator Filters
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Sectors</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="employment">Employment</option>
                <option value="governance">Governance</option>
                <option value="environment">Environment</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical Only</option>
                <option value="High">High Only</option>
                <option value="Medium">Medium Only</option>
              </select>
            </div>
          </div>

      {/* Analytical Callout */}
      <div className="civic-card p-4 bg-teal-50/50 border border-teal-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-teal-950 flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-teal-600" />
            Key Benchmarking Finding:
          </span>
          <p className="text-teal-900 leading-relaxed">
            The largest structural gap between Koraput and Bhubaneswar lies in <strong>Doctors per 10,000 population (-80.2%)</strong> and <strong>Formal Non-Agricultural Employment (-68.1%)</strong>. Addressing these two levers through mobile telemedicine grids and GI-tagged agro-processing parks will yield the fastest multi-factor development score convergence.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <div className="bg-white px-3 py-2 rounded-lg border border-teal-200 text-center">
            <span className="text-[10px] text-slate-500 block uppercase">Average Catch-Up</span>
            <span className="text-base font-bold text-teal-700">4.4 Years</span>
          </div>
        </div>
      </div>

      {/* Benchmarking Comparison Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Standardized Indicator Comparison</CardTitle>
              <CardDescription>
                Click table headers to re-sort by gap severity or projected convergence runway years.
              </CardDescription>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredMetrics.length} indicators
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('metricName')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Indicator Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-teal-800 font-bold bg-teal-50/50">
                  Koraput (Developing)
                </th>
                <th className="px-4 py-3 text-slate-900 font-bold">
                  Bhubaneswar (Capital)
                </th>
                <th className="px-4 py-3">State Avg</th>
                <th
                  onClick={() => handleSort('gapPercentage')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Deficit Delta <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('runwayYears')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Catch-Up Runway <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMetrics.map((m) => {
                const isCritical = m.priority === 'Critical';
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{m.metricName}</div>
                      <div className="text-[10px] text-slate-400 max-w-xs truncate">
                        {m.notes}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-600">
                      <Badge variant="outline" size="sm" className="text-[10px]">
                        {m.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-teal-900 bg-teal-50/30">
                      {m.koraputDisplay}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {m.bhubaneswarDisplay}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {m.stateAvgDisplay}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <span
                        className={`font-bold px-1.5 py-0.5 rounded ${
                          m.gapPercentage < -50
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : m.gapPercentage < -25
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {m.gapPercentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {m.runwayYears} yrs
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          isCritical ? 'critical' : m.priority === 'High' ? 'warning' : 'default'
                        }
                        size="sm"
                      >
                        {m.priority}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}

