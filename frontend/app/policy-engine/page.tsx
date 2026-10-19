'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Sliders,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { AIPolicyRecommendationEngineView } from '@/components/dashboard/AIPolicyRecommendationEngineView';
import { RAGKnowledgeExplorerView } from '@/components/dashboard/RAGKnowledgeExplorerView';
import { Database } from 'lucide-react';

export default function PolicyEnginePage() {
  const { selectedCity, cityProfile, benchmarkProfile } = useCity();
  const [activeTab, setActiveTab] = useState<'ai_recommendations' | 'rag_knowledge' | 'scenario_simulator'>('ai_recommendations');


  // Interactive Policy Levers (Budget Allocation in ₹ Crores)
  const [telemedicineBudget, setTelemedicineBudget] = useState(32);
  const [agroParkBudget, setAgroParkBudget] = useState(65);
  const [stemEducationBudget, setStemEducationBudget] = useState(18);
  const [pipedWaterBudget, setPipedWaterBudget] = useState(44);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Dynamic simulation calculations
  const totalAllocatedBudget =
    telemedicineBudget + agroParkBudget + stemEducationBudget + pipedWaterBudget;

  const baseScore = selectedCity === 'koraput' ? 58.4 : 84.7;

  // Impact weighting model
  const healthDelta = (telemedicineBudget / 32) * 5.2;
  const agroDelta = (agroParkBudget / 65) * 4.4;
  const stemDelta = (stemEducationBudget / 18) * 3.8;
  const waterDelta = (pipedWaterBudget / 44) * 3.5;

  const totalScoreGain = Math.min(24.5, (healthDelta + agroDelta + stemDelta + waterDelta) * 0.72);
  const projectedScore = Math.min(96.0, baseScore + totalScoreGain);

  const runwayYears = Math.max(1.5, 6.2 - totalScoreGain * 0.22);
  const projectedDirectJobs = Math.round(agroParkBudget * 55 + telemedicineBudget * 18);

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationComplete(false);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationComplete(true);
    }, 600);
  };

  const handleReset = () => {
    setTelemedicineBudget(32);
    setAgroParkBudget(65);
    setStemEducationBudget(18);
    setPipedWaterBudget(44);
    setSimulationComplete(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Policy Recommendation Engine & Simulator
            </h1>
            <Badge variant="teal" size="sm">
              Target: {cityProfile.name} ({cityProfile.regionalTitle})
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evidence-grounded policy generation, statutory scheme funding mechanisms, and capital allocation modeling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('ai_recommendations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ai_recommendations'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Policy Recommendations
          </button>
          <button
            onClick={() => setActiveTab('rag_knowledge')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'rag_knowledge'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-teal-600" />
            Government Schemes (RAG)
          </button>
          <button
            onClick={() => setActiveTab('scenario_simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'scenario_simulator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            Capital Scenario Simulator
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'ai_recommendations' && (
        <AIPolicyRecommendationEngineView
          cityId={selectedCity}
          cityName={cityProfile.name}
        />
      )}

      {activeTab === 'rag_knowledge' && (
        <RAGKnowledgeExplorerView />
      )}

      {activeTab === 'scenario_simulator' && (
        <div className="space-y-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Reset Defaults
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={handleSimulate}
              isLoading={isSimulating}
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              Simulate Policy Shift
            </Button>
          </div>

          {/* Simulation Result Callout Banner */}
          <div className="civic-card-navy p-5 rounded-xl border border-[#1a2b49] shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Baseline Score
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {baseScore.toFixed(1)} <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] text-slate-400">{cityProfile.name} (Current)</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
              Simulated Projected Score
            </span>
            <div className="text-2xl font-bold text-teal-300 font-mono flex items-center gap-1.5">
              {projectedScore.toFixed(1)}
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                +{totalScoreGain.toFixed(1)} pts
              </span>
            </div>
            <span className="text-[11px] text-teal-400/80">Under Simulated Outlay</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Catch-Up Runway
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {runwayYears.toFixed(1)} <span className="text-xs text-slate-400">Years</span>
            </div>
            <span className="text-[11px] text-slate-400">To Match {benchmarkProfile.name}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Direct Livelihoods Created
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {projectedDirectJobs.toLocaleString()} <span className="text-xs text-slate-400">Jobs</span>
            </div>
            <span className="text-[11px] text-slate-400">Formal Non-Farm Growth</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Policy Sliders (Left) vs Projected Impact Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Policy Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Capital Allocation Levers
                  </CardTitle>
                  <CardDescription>
                    Adjust proposed investment outlays across sectors. Total: ₹{totalAllocatedBudget} Cr
                  </CardDescription>
                </div>
                <Badge variant="navy" size="sm">
                  ₹{totalAllocatedBudget} Cr Outlay
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-2">
              {/* Lever 1: Healthcare */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      1. Rural Mobile Telemedicine & 4x4 Transit Grid
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Procure 24 off-road clinics with satellite telemetry across remote blocks
                    </span>
                  </div>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    ₹{telemedicineBudget} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="2"
                  value={telemedicineBudget}
                  onChange={(e) => setTelemedicineBudget(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: ₹10 Cr</span>
                  <span>Recommended: ₹32 Cr</span>
                  <span>Max: ₹80 Cr</span>
                </div>
              </div>

              {/* Lever 2: Agro Park */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      2. Mega Food Park & Organic Coffee Processing Hub
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Central curing, vacuum freeze-drying & FPO packaging cluster in Jeypore
                    </span>
                  </div>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    ₹{agroParkBudget} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={agroParkBudget}
                  onChange={(e) => setAgroParkBudget(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: ₹20 Cr</span>
                  <span>Recommended: ₹65 Cr</span>
                  <span>Max: ₹150 Cr</span>
                </div>
              </div>

              {/* Lever 3: STEM Education */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      3. High School STEM Labs & Vernacular Mentorship
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Virtual science experiments & bilingual tutor fellowships for 45 secondary schools
                    </span>
                  </div>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    ₹{stemEducationBudget} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={stemEducationBudget}
                  onChange={(e) => setStemEducationBudget(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: ₹5 Cr</span>
                  <span>Recommended: ₹18.5 Cr</span>
                  <span>Max: ₹50 Cr</span>
                </div>
              </div>

              {/* Lever 4: Piped Water */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">
                      4. Solar-Gravity Piped Water Schemes in Highland Hamlets
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Clean treated tap water reticulation to 220 highland habitations
                    </span>
                  </div>
                  <span className="font-mono font-bold text-teal-700 text-sm">
                    ₹{pipedWaterBudget} Cr
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  step="2"
                  value={pipedWaterBudget}
                  onChange={(e) => setPipedWaterBudget(Number(e.target.value))}
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Min: ₹15 Cr</span>
                  <span>Recommended: ₹44 Cr</span>
                  <span>Max: ₹100 Cr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Projected Sectoral Impacts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Projected Sectoral Response</CardTitle>
              <CardDescription>
                Estimated indicator improvements relative to benchmark under current slider configuration
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 flex-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Healthcare Access Index</span>
                  <span className="text-teal-700 font-mono font-bold">
                    +{(telemedicineBudget * 0.26).toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, telemedicineBudget * 1.25)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Target: 180+ remote hamlets connected to SLN Medical College
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Agro-Processing & Employment</span>
                  <span className="text-teal-700 font-mono font-bold">
                    +{(agroParkBudget * 0.095).toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (agroParkBudget / 150) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Direct job creation for tribal youth & SHG coffee aggregators
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Secondary STEM Retention</span>
                  <span className="text-teal-700 font-mono font-bold">
                    +{(stemEducationBudget * 0.38).toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (stemEducationBudget / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Equipping 45 model high schools with modern physics & chemistry kits
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">Highland Piped Tap Coverage</span>
                  <span className="text-teal-700 font-mono font-bold">
                    +{(pipedWaterBudget * 0.22).toFixed(1)} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (pipedWaterBudget / 100) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500">
                  Target: Reach 78% household coverage in hilly terrain
                </span>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSimulate}
                  className="w-full text-xs"
                >
                  Confirm Scenario & Commit to Planning Dossier
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}

