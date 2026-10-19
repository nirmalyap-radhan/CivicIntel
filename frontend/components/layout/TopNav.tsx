'use client';

import React, { useState } from 'react';
import {
  MapPin,
  UserCheck,
  Search,
  Download,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  Menu,
} from 'lucide-react';
import { useCity } from '@/context/CityContext';
import { CityId, StakeholderRole, SectorCategory } from '@/types';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

interface TopNavProps {
  onMobileMenuToggle?: () => void;
}

export function TopNav({ onMobileMenuToggle }: TopNavProps) {
  const {
    selectedCity,
    setSelectedCity,
    activeStakeholder,
    setActiveStakeholder,
    selectedSector,
    setSelectedSector,
    searchQuery,
    setSearchQuery,
    cityProfile,
  } = useCity();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isStakeholderDropdownOpen, setIsStakeholderDropdownOpen] = useState(false);

  const stakeholderOptions: { id: StakeholderRole; label: string; iconLabel: string }[] = [
    { id: 'government', label: 'Government Officials', iconLabel: 'Govt' },
    { id: 'citizen', label: 'Citizens & Communities', iconLabel: 'Citizen' },
    { id: 'investor', label: 'Private Investors & PPPs', iconLabel: 'Investor' },
    { id: 'business', label: 'Commercial & Industry', iconLabel: 'Business' },
    { id: 'ngo', label: 'NGOs & Civil Society', iconLabel: 'NGO' },
  ];

  const sectorFilters: { id: SectorCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Sectors' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'education', label: 'Education' },
    { id: 'employment', label: 'Employment' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'environment', label: 'Environment' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 shadow-2xs">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu Trigger + City Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/90 text-left transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 text-teal-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  {selectedCity === 'koraput' ? 'Koraput' : 'Bhubaneswar'}
                  <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">
                    (Odisha)
                  </span>
                </span>
                <span className="text-[10px] text-teal-700 font-medium truncate max-w-[140px] sm:max-w-none">
                  {selectedCity === 'koraput'
                    ? 'Aspirational District'
                    : 'Benchmark Smart City'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isCityDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsCityDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Select Demonstration City
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCity('koraput');
                      setIsCityDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        selectedCity === 'koraput' ? 'bg-teal-500 ring-2 ring-teal-200' : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">Koraput</span>
                        <Badge variant="warning" size="sm">
                          Developing Hub
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        14 Blocks, high tribal demographic, agro-forestry & healthcare focus.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCity('bhubaneswar');
                      setIsCityDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-start gap-2.5 transition-colors border-t border-slate-100"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        selectedCity === 'bhubaneswar' ? 'bg-teal-500 ring-2 ring-teal-200' : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900">Bhubaneswar</span>
                        <Badge variant="teal" size="sm">
                          Capital Benchmark
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        67 Wards, Smart City operations, IT hub & tertiary healthcare baseline.
                      </p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Switch Button */}
          <button
            onClick={() => setSelectedCity(selectedCity === 'koraput' ? 'bhubaneswar' : 'koraput')}
            title="Toggle between Koraput and Bhubaneswar"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
          >
            Switch to {selectedCity === 'koraput' ? 'Bhubaneswar' : 'Koraput'}
          </button>
        </div>

        {/* Center / Right: Stakeholder Lens Switcher + Search + Sector Filter */}
        <div className="flex items-center gap-2.5">
          {/* Stakeholder Lens Selector */}
          <div className="relative">
            <button
              onClick={() => setIsStakeholderDropdownOpen(!isStakeholderDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-slate-400 font-normal hidden md:inline">Lens:</span>
              <span className="font-semibold text-slate-900 capitalize">
                {stakeholderOptions.find((s) => s.id === activeStakeholder)?.iconLabel}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isStakeholderDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsStakeholderDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Stakeholder Perspective
                  </div>
                  {stakeholderOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setActiveStakeholder(opt.id);
                        setIsStakeholderDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <span
                        className={
                          activeStakeholder === opt.id
                            ? 'font-bold text-teal-700'
                            : 'text-slate-700 font-medium'
                        }
                      >
                        {opt.label}
                      </span>
                      {activeStakeholder === opt.id && (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sector Quick Filter Pills (hidden on mobile, visible on desktop) */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {sectorFilters.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  selectedSector === s.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter metrics, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Quick Benchmark Dossier Export button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              window.location.href = '/reports';
            }}
            className="hidden sm:inline-flex text-xs"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden lg:inline">Export Dossier</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
