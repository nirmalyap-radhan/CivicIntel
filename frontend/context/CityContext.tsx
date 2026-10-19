'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  CityId,
  StakeholderRole,
  SectorCategory,
  CityProfile,
  KpiMetric,
  DevelopmentGap,
  PolicyRecommendation,
  InvestorProject,
  CitizenFeedback,
  RecentActivity,
  GrowthForecast,
  CivicAssetPoint,
} from '@/types';
import { CITIES_DATA } from '@/data/cities';
import { CITY_KPIS, COMPARISON_METRICS } from '@/data/metrics';
import { DEVELOPMENT_GAPS } from '@/data/gaps';
import { POLICY_RECOMMENDATIONS } from '@/data/recommendations';
import { GROWTH_FORECASTS } from '@/data/forecasts';
import { CIVIC_ASSETS } from '@/data/mapData';
import { CITIZEN_FEEDBACK_DATA } from '@/data/citizenData';
import { INVESTOR_PROJECTS } from '@/data/projects';
import { RECENT_ACTIVITIES } from '@/data/activities';

interface CityContextType {
  selectedCity: CityId;
  setSelectedCity: (city: CityId) => void;
  activeStakeholder: StakeholderRole;
  setActiveStakeholder: (role: StakeholderRole) => void;
  selectedSector: SectorCategory | 'all';
  setSelectedSector: (sector: SectorCategory | 'all') => void;
  timeRange: '1Y' | '3Y' | '5Y' | '2030_Target';
  setTimeRange: (range: '1Y' | '3Y' | '5Y' | '2030_Target') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  // Derived state helpers
  cityProfile: CityProfile;
  benchmarkProfile: CityProfile;
  kpis: KpiMetric[];
  gaps: DevelopmentGap[];
  recommendations: PolicyRecommendation[];
  projects: InvestorProject[];
  feedback: CitizenFeedback[];
  activities: RecentActivity[];
  forecasts: GrowthForecast[];
  assets: CivicAssetPoint[];
  comparisonMetrics: typeof COMPARISON_METRICS;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<CityId>('koraput');
  const [activeStakeholder, setActiveStakeholder] = useState<StakeholderRole>('government');
  const [selectedSector, setSelectedSector] = useState<SectorCategory | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y' | '2030_Target'>('5Y');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const cityProfile = useMemo(() => CITIES_DATA[selectedCity] || CITIES_DATA.koraput, [selectedCity]);
  const benchmarkProfile = useMemo(
    () => (selectedCity === 'koraput' ? CITIES_DATA.bhubaneswar : CITIES_DATA.koraput),
    [selectedCity]
  );

  const kpis = useMemo(() => {
    const list = CITY_KPIS[selectedCity] || [];
    if (selectedSector === 'all') return list;
    return list.filter((k) => k.sector === selectedSector);
  }, [selectedCity, selectedSector]);

  const gaps = useMemo(() => {
    return DEVELOPMENT_GAPS.filter((gap) => {
      const matchCity = gap.cityId === selectedCity;
      const matchSector = selectedSector === 'all' || gap.sector === selectedSector;
      const matchRole =
        activeStakeholder === 'government' ||
        gap.targetStakeholders.includes(activeStakeholder);
      return matchCity && matchSector && matchRole;
    });
  }, [selectedCity, selectedSector, activeStakeholder]);

  const recommendations = useMemo(() => {
    return POLICY_RECOMMENDATIONS.filter((rec) => {
      const matchCity = rec.cityId === selectedCity;
      const matchSector = selectedSector === 'all' || rec.sector === selectedSector;
      const matchRole =
        activeStakeholder === 'government' ||
        rec.keyStakeholders.includes(activeStakeholder);
      return matchCity && matchSector && matchRole;
    });
  }, [selectedCity, selectedSector, activeStakeholder]);

  const projects = useMemo(() => {
    const list = INVESTOR_PROJECTS[selectedCity] || [];
    if (selectedSector === 'all') return list;
    return list.filter((p) => p.sector === selectedSector);
  }, [selectedCity, selectedSector]);

  const feedback = useMemo(() => {
    return CITIZEN_FEEDBACK_DATA[selectedCity] || [];
  }, [selectedCity]);

  const activities = useMemo(() => {
    return RECENT_ACTIVITIES.filter((act) => {
      const matchCity = act.cityId === selectedCity;
      const matchSector = selectedSector === 'all' || act.sector === selectedSector;
      return matchCity && matchSector;
    });
  }, [selectedCity, selectedSector]);

  const forecasts = useMemo(() => {
    return GROWTH_FORECASTS[selectedCity] || [];
  }, [selectedCity]);

  const assets = useMemo(() => {
    return CIVIC_ASSETS[selectedCity] || [];
  }, [selectedCity]);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        activeStakeholder,
        setActiveStakeholder,
        selectedSector,
        setSelectedSector,
        timeRange,
        setTimeRange,
        searchQuery,
        setSearchQuery,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,

        cityProfile,
        benchmarkProfile,
        kpis,
        gaps,
        recommendations,
        projects,
        feedback,
        activities,
        forecasts,
        assets,
        comparisonMetrics: COMPARISON_METRICS,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
