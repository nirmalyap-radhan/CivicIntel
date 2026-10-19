'use client';

import React, { useState } from 'react';
import {
  Lightbulb,
  AlertOctagon,
  ArrowRight,
  Filter,
  DollarSign,
  Users,
  CheckCircle,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { useCity } from '@/context/CityContext';
import { DevelopmentGap, SectorCategory } from '@/types';

export default function InsightsPage() {
  const { gaps, cityProfile, selectedCity } = useCity();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGap, setSelectedGap] = useState<DevelopmentGap | null>(null);

  const filteredGaps = gaps.filter((gap) => {
    const matchSeverity = selectedSeverity === 'all' || gap.severity === selectedSeverity;
    const matchSearch =
      searchQuery === '' ||
      gap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gap.rootCauses.some((rc) => rc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSeverity && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Diagnostic Development Insights: {cityProfile.name}
            </h1>
            <Badge variant="teal" size="sm">
              Root-Cause Matrix
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic detection of developmental bottlenecks, systemic root causes, and targeted capital interventions.
          </p>
        </div>

        {/* Severity filter & search */}
        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search root causes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {['all', 'Critical', 'High', 'Moderate'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  selectedSeverity === sev
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev === 'all' ? 'All' : sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Insights Grid */}
      {filteredGaps.length === 0 ? (
        <EmptyState
          title="No development gaps match criteria"
          description="Try clearing your search query or setting severity to 'All'."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedSeverity('all');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGaps.map((gap) => {
            const isCritical = gap.severity === 'Critical';

            return (
              <Card
                key={gap.id}
                className="flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-xs"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isCritical ? 'critical' : gap.severity === 'High' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {gap.severity} Severity
                      </Badge>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {gap.sector}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      ₹{gap.estimatedInvestmentCr} Cr Capex
                    </span>
                  </div>

                  <CardTitle className="text-sm sm:text-base font-bold text-slate-900 mt-1 leading-snug">
                    {gap.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Deficit Badge */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Deficit Gap Metric
                    </span>
                    <span className="text-slate-800 font-mono font-semibold">
                      {gap.gapMetric}
                    </span>
                  </div>

                  {/* Root causes */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Systemic Root Causes:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {gap.rootCauses.map((rc, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold shrink-0">•</span>
                          <span>{rc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Intervention Box */}
                  <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs space-y-1">
                    <span className="text-teal-900 font-bold block flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-teal-600" />
                      Recommended High-Impact Intervention:
                    </span>
                    <p className="text-teal-950 leading-relaxed">
                      {gap.recommendedIntervention}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {gap.affectedPopulation}
                    </span>
                    <span className="text-teal-700 font-medium">
                      {gap.projectedImpact}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
