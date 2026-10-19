'use client';

import React from 'react';
import {
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCity } from '@/context/CityContext';
import { useCivicApi } from '@/hooks/useCivicApi';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { DevelopmentTrendChart } from '@/components/dashboard/DevelopmentTrendChart';
import { CityComparisonChart } from '@/components/dashboard/CityComparisonChart';
import { GapAnalysisCard } from '@/components/dashboard/GapAnalysisCard';
import { CityOverviewMap } from '@/components/dashboard/CityOverviewMap';
import { PriorityRecommendations } from '@/components/dashboard/PriorityRecommendations';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

export default function OverviewPage() {
  const {
    selectedCity,
    setSelectedCity,
    activeStakeholder,
    cityProfile,
    benchmarkProfile,
    kpis,
  } = useCity();

  const { isBackendConnected, liveScore } = useCivicApi(selectedCity);

  return (
    <div className="space-y-6">
      {/* Top City Profile & Executive Context Banner */}
      <div className="civic-card-navy p-5 sm:p-6 rounded-xl relative overflow-hidden shadow-md">
        {/* Subtle geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, #2dd4bf 0%, transparent 40%), radial-gradient(circle at 10% 80%, #3b82f6 0%, transparent 40%)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" size="sm">
                Civic Intelligence Platform
              </Badge>
              {isBackendConnected ? (
                <Badge variant="teal" size="sm" className="bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse mr-1" />
                  FastAPI PostgreSQL/SQLite Live
                </Badge>
              ) : (
                <Badge variant="navy" size="sm" className="bg-[#15233c] text-slate-300 border-[#223961]">
                  Demonstration Baseline: 2026 Q1
                </Badge>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                Updated Today
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {cityProfile.name}
                <span className="text-sm font-normal text-teal-300">
                  ({cityProfile.regionalTitle})
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {cityProfile.description}
              </p>
            </div>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-[#0f1d35] p-2.5 rounded-lg border border-[#1d335c]">
                <span className="text-slate-400 block text-[10px] uppercase">Population</span>
                <span className="font-bold text-white text-sm">{cityProfile.populationLabel}</span>
              </div>
              <div className="bg-[#0f1d35] p-2.5 rounded-lg border border-[#1d335c]">
                <span className="text-slate-400 block text-[10px] uppercase">Geography / Area</span>
                <span className="font-bold text-white text-sm">{cityProfile.areaSqKm.toLocaleString()} km²</span>
              </div>
              <div className="bg-[#0f1d35] p-2.5 rounded-lg border border-[#1d335c]">
                <span className="text-slate-400 block text-[10px] uppercase">Literacy Rate</span>
                <span className="font-bold text-teal-300 text-sm">{cityProfile.literacyRate}%</span>
              </div>
              <div className="bg-[#0f1d35] p-2.5 rounded-lg border border-[#1d335c]">
                <span className="text-slate-400 block text-[10px] uppercase">Per Capita Income</span>
                <span className="font-bold text-white text-sm">₹{cityProfile.perCapitaIncomeInr.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* City Switching & Benchmarking Action Card */}
          <div className="shrink-0 bg-[#0e1c34] p-4 rounded-xl border border-[#1d335c] flex flex-col gap-3 min-w-[240px]">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Benchmark Reference:</span>
              <span className="text-teal-400 font-bold">{benchmarkProfile.name}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {selectedCity === 'koraput'
                ? 'Targeting structural parity with Bhubaneswar smart urban standards by 2032.'
                : 'Benchmarking state capital infrastructure against national tier-1 smart cities.'}
            </p>

            <Button
              variant="teal"
              size="sm"
              onClick={() => setSelectedCity(selectedCity === 'koraput' ? 'bhubaneswar' : 'koraput')}
              className="w-full text-xs font-semibold"
            >
              Switch Focus to {benchmarkProfile.name}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stakeholder Lens Context Notice */}
      <div className="bg-teal-50/70 border border-teal-200/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-teal-950">
            Active Intelligence Lens:{' '}
            <strong className="capitalize text-teal-900 font-bold">
              {activeStakeholder}
            </strong>
            . Metrics and AI recommendations are weighted for your governance responsibilities.
          </span>
        </div>
        <span className="text-[11px] text-teal-800 font-medium">
          Ref: {selectedCity === 'koraput' ? 'Aspirational District Framework' : 'Smart Cities Mission Framework'}
        </span>
      </div>

      {/* 5 Core KPI Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Core Civic Intelligence Indicators
            </h2>
            <Badge variant="outline" size="sm">
              5 Dimensions
            </Badge>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click cards to focus multi-year trajectory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} metric={kpi} />
          ))}
        </div>
      </div>

      {/* Visual Analytics Grid: Multi-Year Trajectory & Cross-City Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DevelopmentTrendChart />
        <CityComparisonChart />
      </div>

      {/* Deep-Dive Grid: Structural Gap Analysis & Spatial Asset Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GapAnalysisCard />
        <CityOverviewMap />
      </div>

      {/* Operational Levers Grid: Priority Recommendations & Recent Governance Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriorityRecommendations />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>

      {/* Verified Data Integrity Footnote */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Data Disclosure:</strong> Statistics in this demonstration platform represent modeled civic intelligence synthesized from public census benchmarks, District Mineral Foundation audits, and urban missions.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[11px]">
          <span>Odisha State Informatics</span>
          <span>•</span>
          <span>CivicIntel v1.0</span>
        </div>
      </div>
    </div>
  );
}
