'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { PolicyRecommendation } from '@/types';

export function PriorityRecommendations() {
  const { recommendations, cityProfile } = useCity();
  const [selectedRec, setSelectedRec] = useState<PolicyRecommendation | null>(null);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base">
                Priority Policy Interventions
              </CardTitle>
              <CardDescription>
                AI-ranked governance & investment levers for {cityProfile.name}
              </CardDescription>
            </div>
          </div>

          <Link href="/policy-engine">
            <Button variant="teal" size="sm" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Policy Engine
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-1 space-y-3">
        {recommendations.slice(0, 3).map((rec) => {
          const isImmediate = rec.priority === 'Immediate';

          return (
            <div
              key={rec.id}
              onClick={() => setSelectedRec(rec)}
              className="p-3.5 rounded-lg border border-slate-200/90 bg-white hover:border-teal-500/60 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isImmediate ? 'teal' : 'default'}
                    size="sm"
                    className="font-medium"
                  >
                    {rec.priority}
                  </Badge>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {rec.sector}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  <span>Impact {rec.impactScore}/100</span>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1 mb-1">
                {rec.title}
              </h4>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                {rec.objective}
              </p>

              {/* Bottom specs */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                <span className="truncate max-w-[200px]">
                  Fund: <strong className="text-slate-700">{rec.fundingMechanism.split('+')[0]}</strong>
                </span>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {rec.timeToImplementMonths}m runway
                  </span>
                  <span className="font-bold text-slate-800">
                    ₹{rec.estimatedBudgetCr} Cr
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {recommendations.length > 3 && (
          <div className="pt-1 text-center">
            <Link
              href="/policy-engine"
              className="text-xs font-medium text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              Explore all {recommendations.length} policy levers in the Simulator
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </CardContent>

      {/* Detail Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="teal" size="sm">
                    {selectedRec.priority} Priority
                  </Badge>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    {selectedRec.sector}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRec.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRec(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedRec.objective}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Estimated Outlay
                </span>
                <span className="text-base font-bold text-slate-900">
                  ₹{selectedRec.estimatedBudgetCr} Crores
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px] uppercase">
                  Execution Horizon
                </span>
                <span className="text-base font-bold text-slate-900">
                  {selectedRec.timeToImplementMonths} Months
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">Funding Mechanism:</div>
              <p className="text-slate-600">{selectedRec.fundingMechanism}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-slate-800">Expected Civic Deliverables:</div>
              <ul className="space-y-1">
                {selectedRec.expectedOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs">
              <div className="font-bold text-teal-900 mb-1">Projected KPI Deliberations:</div>
              <div className="flex flex-wrap gap-2">
                {selectedRec.kpiImpact.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded border border-teal-300 text-teal-800 font-medium"
                  >
                    <strong>{item.kpi}:</strong> {item.delta}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="/policy-engine">
                <Button variant="teal" size="sm">
                  Simulate in AI Policy Engine
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setSelectedRec(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
