'use client';

import React, { useState } from 'react';
import {
  Building2,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle,
  AlertTriangle,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Wifi,
  Leaf,
  ShieldAlert,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import { SectorCategory } from '@/types';
import { CityBenchmarkMatcher } from '@/components/dashboard/CityBenchmarkMatcher';

interface BlockOrWardData {
  id: string;
  name: string;
  type: string;
  population: number;
  healthCenterRatio: string;
  schoolsCount: number;
  pipedWaterPercent: number;
  roadConnectivityPercent: number;
  developmentIndex: number;
  status: 'Needs Priority Intervention' | 'Moderate Progress' | 'Advanced Benchmark';
}

export default function CityIntelligencePage() {
  const { selectedCity, cityProfile, kpis } = useCity();
  const [activeTab, setActiveTab] = useState<'spatial_blocks' | 'ai_matcher'>('spatial_blocks');
  const [activeSector, setActiveSector] = useState<SectorCategory | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortField, setSortField] = useState<keyof BlockOrWardData>('developmentIndex');
  const [sortAsc, setSortAsc] = useState(false);

  // Granular locality breakdown for Koraput (Blocks) vs Bhubaneswar (Wards/Zones)
  const koraputBlocks: BlockOrWardData[] = [
    {
      id: 'k-b1',
      name: 'Jeypore Sub-Division',
      type: 'Sub-Divisional Urban & Rural Hub',
      population: 182400,
      healthCenterRatio: '1 Sub-Div Hospital + 3 CHCs',
      schoolsCount: 142,
      pipedWaterPercent: 74.2,
      roadConnectivityPercent: 88.5,
      developmentIndex: 68.4,
      status: 'Moderate Progress',
    },
    {
      id: 'k-b2',
      name: 'Koraput Sadar Block',
      type: 'District Administrative Core',
      population: 135800,
      healthCenterRatio: 'SLN Medical College + 2 PHCs',
      schoolsCount: 118,
      pipedWaterPercent: 68.9,
      roadConnectivityPercent: 84.0,
      developmentIndex: 65.2,
      status: 'Moderate Progress',
    },
    {
      id: 'k-b3',
      name: 'Sunabeda NAC Belt',
      type: 'Industrial Defense Township',
      population: 94500,
      healthCenterRatio: 'HAL Hospital + 1 CHC',
      schoolsCount: 76,
      pipedWaterPercent: 86.4,
      roadConnectivityPercent: 92.1,
      developmentIndex: 72.8,
      status: 'Moderate Progress',
    },
    {
      id: 'k-b4',
      name: 'Kotpad Block',
      type: 'Handloom & Agro-Weaving Hub',
      population: 88200,
      healthCenterRatio: '1 CHC + 4 PHCs',
      schoolsCount: 84,
      pipedWaterPercent: 44.5,
      roadConnectivityPercent: 71.3,
      developmentIndex: 51.6,
      status: 'Needs Priority Intervention',
    },
    {
      id: 'k-b5',
      name: 'Semiliguda Block',
      type: 'Horticulture & Coffee Foothills',
      population: 112000,
      healthCenterRatio: '1 CHC + 5 PHCs',
      schoolsCount: 96,
      pipedWaterPercent: 52.8,
      roadConnectivityPercent: 76.4,
      developmentIndex: 58.9,
      status: 'Moderate Progress',
    },
    {
      id: 'k-b6',
      name: 'Bandhugaon Block',
      type: 'Ghat Highland Tribal Hinterland',
      population: 64200,
      healthCenterRatio: '1 CHC (Doctor Vacancies)',
      schoolsCount: 62,
      pipedWaterPercent: 28.1,
      roadConnectivityPercent: 52.4,
      developmentIndex: 38.5,
      status: 'Needs Priority Intervention',
    },
    {
      id: 'k-b7',
      name: 'Narayanpatna Block',
      type: 'Interior Forest Watershed',
      population: 58900,
      healthCenterRatio: '1 CHC + 2 Sub-Centers',
      schoolsCount: 54,
      pipedWaterPercent: 31.4,
      roadConnectivityPercent: 56.2,
      developmentIndex: 41.2,
      status: 'Needs Priority Intervention',
    },
    {
      id: 'k-b8',
      name: 'Pottangi Block',
      type: 'Border Horticultural Plateau',
      population: 78500,
      healthCenterRatio: '1 CHC + 3 PHCs',
      schoolsCount: 72,
      pipedWaterPercent: 46.2,
      roadConnectivityPercent: 74.8,
      developmentIndex: 54.1,
      status: 'Needs Priority Intervention',
    },
  ];

  const bhubaneswarWards: BlockOrWardData[] = [
    {
      id: 'b-w1',
      name: 'North Zone (Patia & Infocity)',
      type: 'IT Corridor & Education Cluster',
      population: 265000,
      healthCenterRatio: 'KIMS + 4 Urban PHCs',
      schoolsCount: 68,
      pipedWaterPercent: 96.2,
      roadConnectivityPercent: 99.5,
      developmentIndex: 91.4,
      status: 'Advanced Benchmark',
    },
    {
      id: 'b-w2',
      name: 'Central Zone (Saheed Nagar & Unit-9)',
      type: 'Administrative & Commercial Heart',
      population: 310000,
      healthCenterRatio: 'Capital Hospital + 6 UPHCs',
      schoolsCount: 92,
      pipedWaterPercent: 97.8,
      roadConnectivityPercent: 100.0,
      developmentIndex: 89.6,
      status: 'Advanced Benchmark',
    },
    {
      id: 'b-w3',
      name: 'South-West Zone (Khandagiri & Baramunda)',
      type: 'Inter-State Transit & Heritage Gate',
      population: 285000,
      healthCenterRatio: 'AIIMS Fringe + 5 UPHCs',
      schoolsCount: 84,
      pipedWaterPercent: 94.1,
      roadConnectivityPercent: 98.4,
      developmentIndex: 86.8,
      status: 'Advanced Benchmark',
    },
    {
      id: 'b-w4',
      name: 'South-East Zone (Old Town & Lingaraj)',
      type: 'Heritage Core & Temple Precinct',
      population: 145000,
      healthCenterRatio: '2 UPHCs + Ayurvedic Inst',
      schoolsCount: 46,
      pipedWaterPercent: 91.5,
      roadConnectivityPercent: 96.0,
      developmentIndex: 82.3,
      status: 'Advanced Benchmark',
    },
    {
      id: 'b-w5',
      name: 'Peripheral Lowland Zone (Sundarpada & Gangua)',
      type: 'Rapidly Growing Peri-Urban Sector',
      population: 110000,
      healthCenterRatio: '1 UPHC + 2 Sub-centers',
      schoolsCount: 32,
      pipedWaterPercent: 79.4,
      roadConnectivityPercent: 89.2,
      developmentIndex: 73.5,
      status: 'Moderate Progress',
    },
  ];

  const currentLocalities = selectedCity === 'koraput' ? koraputBlocks : bhubaneswarWards;

  const filteredLocalities = currentLocalities
    .filter((loc) => loc.name.toLowerCase().includes(searchFilter.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

  const handleSort = (field: keyof BlockOrWardData) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              City Intelligence Dossier: {cityProfile.name}
            </h1>
            <Badge variant="teal" size="sm">
              Sectoral & Spatial Deep Dive
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Granular analysis of administrative blocks, municipal service delivery rates, and benchmark matching.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('spatial_blocks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'spatial_blocks'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            {selectedCity === 'koraput' ? 'Blocks & Localities' : 'Wards & Zones'}
          </button>
          <button
            onClick={() => setActiveTab('ai_matcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ai_matcher'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            AI Benchmark Engine
          </button>
        </div>
      </div>

      {activeTab === 'ai_matcher' ? (
        <CityBenchmarkMatcher
          selectedCityId={selectedCity}
          selectedCityName={cityProfile.name}
        />
      ) : (
        <div className="space-y-6">
          {/* Sector Performance Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Healthcare Reach</span>
              <HeartPulse className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCity === 'koraput' ? '52.1 / 100' : '88.5 / 100'}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{ width: `${selectedCity === 'koraput' ? 52.1 : 88.5}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedCity === 'koraput'
                ? '4.8 doctors / 10k pop • High referral delay in Bandhugaon'
                : '24.2 doctors / 10k pop • AIIMS, SUM, Capital Hospital core'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Education Quality</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCity === 'koraput' ? '54.8 / 100' : '89.2 / 100'}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${selectedCity === 'koraput' ? 54.8 : 89.2}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedCity === 'koraput'
                ? '61.4% secondary retention • 180 Model 5T High Schools'
                : '94.6% secondary retention • Eastern India university hub'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Water & Sanitation</span>
              <Leaf className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCity === 'koraput' ? '48.2%' : '93.8%'}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${selectedCity === 'koraput' ? 48.2 : 93.8}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedCity === 'koraput'
                ? 'Piped tap water coverage • Solar gravity reticulation priority'
                : 'Drink from Tap 24x7 coverage across majority wards'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">Digital Connectivity</span>
              <Wifi className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {selectedCity === 'koraput' ? '24.1%' : '88.5%'}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-500 h-full rounded-full"
                style={{ width: `${selectedCity === 'koraput' ? 24.1 : 88.5}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedCity === 'koraput'
                ? 'Household broadband penetration • BharatNet Phase-2 active'
                : 'High-speed FTTH & 5G urban penetration rate'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sub-divisional and Locality Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {selectedCity === 'koraput' ? 'District Block Breakdown' : 'Municipal Zone Breakdown'}
              </CardTitle>
              <CardDescription>
                Detailed socio-economic indicators across {cityProfile.name} subdivisions. Click column headers to sort.
              </CardDescription>
            </div>

            {/* Table Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${selectedCity === 'koraput' ? 'blocks' : 'zones'}...`}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Locality Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('population')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Population <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Health Infrastructure</th>
                <th
                  onClick={() => handleSort('pipedWaterPercent')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Piped Tap % <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('roadConnectivityPercent')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    All-Weather Roads <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('developmentIndex')}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    Index Score <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocalities.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div>{loc.name}</div>
                    <div className="text-[10px] font-normal text-slate-400">{loc.type}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {loc.population.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{loc.healthCenterRatio}</td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">
                    {loc.pipedWaterPercent}%
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">
                    {loc.roadConnectivityPercent}%
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {loc.developmentIndex.toFixed(1)}
                    </span>
                    <span className="text-slate-400 text-[10px]"> / 100</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        loc.status === 'Needs Priority Intervention'
                          ? 'critical'
                          : loc.status === 'Moderate Progress'
                          ? 'warning'
                          : 'success'
                      }
                      size="sm"
                    >
                      {loc.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}

