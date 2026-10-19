'use client';

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Sliders,
  Database,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { StakeholderRole } from '@/types';

export default function SettingsPage() {
  const {
    selectedCity,
    setSelectedCity,
    activeStakeholder,
    setActiveStakeholder,
    timeRange,
    setTimeRange,
  } = useCity();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [healthWeight, setHealthWeight] = useState(25);
  const [eduWeight, setEduWeight] = useState(20);
  const [infraWeight, setInfraWeight] = useState(25);
  const [economyWeight, setEconomyWeight] = useState(20);
  const [governanceWeight, setGovernanceWeight] = useState(10);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Settings & Intelligence Configuration
            </h1>
            <Badge variant="teal" size="sm">
              Platform Controls
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Customize benchmarking parameters, index weighting formulas, and stakeholder defaults.
          </p>
        </div>

        <Button variant="teal" size="sm" onClick={handleSave}>
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
          Save Preferences
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully. System preferences updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Benchmark & Stakeholder Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              Default Operational Profile
            </CardTitle>
            <CardDescription>
              Configure default demonstration city and persona lenses
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Default Focus City
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCity('koraput')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedCity === 'koraput'
                      ? 'border-teal-500 bg-teal-50/50 font-bold text-teal-900 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>Koraput</div>
                  <span className="text-[10px] font-normal text-slate-500">
                    Aspirational District
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCity('bhubaneswar')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedCity === 'bhubaneswar'
                      ? 'border-teal-500 bg-teal-50/50 font-bold text-teal-900 ring-1 ring-teal-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>Bhubaneswar</div>
                  <span className="text-[10px] font-normal text-slate-500">
                    Benchmark Capital
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Stakeholder Persona Perspective
              </label>
              <select
                value={activeStakeholder}
                onChange={(e) => setActiveStakeholder(e.target.value as StakeholderRole)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="government">Government Officials (Policy & Budget)</option>
                <option value="citizen">Citizens (Grievances & Basic Services)</option>
                <option value="investor">Investors (PPP & Industrial Infrastructure)</option>
                <option value="business">Businesses (Trade & Supply Chain)</option>
                <option value="ngo">NGOs & Civil Society (Tribal & Human Dev)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Historical Trend Window
              </label>
              <div className="flex gap-2">
                {(['1Y', '3Y', '5Y', '2030_Target'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeRange(t)}
                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${
                      timeRange === t
                        ? 'bg-[#0b1528] text-white border-[#1a2b49]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Index Weighting Algorithm */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              Composite Score Weighting Formula
            </CardTitle>
            <CardDescription>
              Adjust weights used in computing the Overall Development Score (Sum: {healthWeight + eduWeight + infraWeight + economyWeight + governanceWeight}%)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Healthcare Access Weight</span>
                <span className="font-mono font-bold text-slate-800">{healthWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={healthWeight}
                onChange={(e) => setHealthWeight(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Education Retention Weight</span>
                <span className="font-mono font-bold text-slate-800">{eduWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={eduWeight}
                onChange={(e) => setEduWeight(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Physical & Digital Infrastructure Weight</span>
                <span className="font-mono font-bold text-slate-800">{infraWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={infraWeight}
                onChange={(e) => setInfraWeight(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Employment & Livelihood Weight</span>
                <span className="font-mono font-bold text-slate-800">{economyWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={economyWeight}
                onChange={(e) => setEconomyWeight(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Municipal Governance & Services Weight</span>
                <span className="font-mono font-bold text-slate-800">{governanceWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                value={governanceWeight}
                onChange={(e) => setGovernanceWeight(Number(e.target.value))}
                className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System & Architecture Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-600" />
            <CardTitle className="text-base">System Architecture & Engine Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Engine Version</span>
            <span className="font-bold text-slate-900">CivicIntel v1.0.4-prod</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Framework</span>
            <span className="font-bold text-slate-900">Next.js App Router & Turbopack</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Type Safety</span>
            <span className="font-bold text-teal-700">Strict TypeScript 5</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Data Mode</span>
            <span className="font-bold text-slate-900">Modeled Demonstration</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
