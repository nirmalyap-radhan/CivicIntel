'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, DollarSign, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { DevelopmentGap } from '@/types';

export function GapAnalysisCard() {
  const { gaps, cityProfile } = useCity();
  const [selectedGap, setSelectedGap] = useState<DevelopmentGap | null>(null);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">
                Structural Development Gaps
              </CardTitle>
              <CardDescription>
                AI-diagnosed deficits in {cityProfile.name} vs benchmark standards
              </CardDescription>
            </div>
          </div>
          <Badge variant="warning" size="sm">
            {gaps.length} Actionable Gaps
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-1 space-y-3">
        {gaps.slice(0, 3).map((gap) => {
          const isCritical = gap.severity === 'Critical';

          return (
            <div
              key={gap.id}
              onClick={() => setSelectedGap(gap)}
              className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                  {gap.title}
                </h4>
                <Badge
                  variant={isCritical ? 'critical' : gap.severity === 'High' ? 'warning' : 'default'}
                  size="sm"
                  className="shrink-0"
                >
                  {gap.severity}
                </Badge>
              </div>

              {/* Metric deficit pill */}
              <div className="text-[11px] font-mono text-slate-700 bg-white/90 border border-slate-200/80 px-2 py-1 rounded mb-2">
                {gap.gapMetric}
              </div>

              {/* Bottom stats: Affected pop & estimated capex */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 truncate">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{gap.affectedPopulation}</span>
                </span>
                <span className="font-semibold text-slate-700 shrink-0 flex items-center gap-0.5">
                  ₹{gap.estimatedInvestmentCr} Cr
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-0.5 ml-1" />
                </span>
              </div>
            </div>
          );
        })}

        {gaps.length > 3 && (
          <div className="pt-1 text-center">
            <a
              href="/insights"
              className="text-xs font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              View all {gaps.length} diagnostic gaps
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </CardContent>

      {/* Modal / Slide-over Details for Selected Gap */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Badge
                  variant={
                    selectedGap.severity === 'Critical'
                      ? 'critical'
                      : selectedGap.severity === 'High'
                      ? 'warning'
                      : 'default'
                  }
                  size="sm"
                >
                  {selectedGap.severity} Severity
                </Badge>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedGap.title}
                </h3>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Sector: {selectedGap.sector} | City: {cityProfile.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedGap(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">Deficit Metric:</div>
              <div className="text-slate-700 font-mono">{selectedGap.gapMetric}</div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">Current Local Status:</div>
              <p className="text-slate-600 leading-relaxed">{selectedGap.currentStatus}</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">Benchmark Baseline:</div>
              <p className="text-slate-600 leading-relaxed">{selectedGap.benchmarkStatus}</p>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">Identified Root Causes:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {selectedGap.rootCauses.map((rc, i) => (
                  <li key={i}>{rc}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-teal-50/70 rounded-lg border border-teal-200 text-xs space-y-1.5">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Recommended AI Policy Intervention
              </div>
              <p className="text-teal-950 leading-relaxed">
                {selectedGap.recommendedIntervention}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-teal-200/60 font-medium text-teal-800">
                <span>Estimated Capex: ₹{selectedGap.estimatedInvestmentCr} Cr</span>
                <span>Impact: {selectedGap.projectedImpact}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedGap(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
