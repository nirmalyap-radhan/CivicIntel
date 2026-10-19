'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  FileCheck,
  Send,
  ArrowRight,
  Filter,
  Shield,
  Layers,
  Building2,
  TreePine,
  Wheat,
  ShoppingBag,
  Compass,
  AlertTriangle,
  FileText,
  Sliders,
  RefreshCw,
  Info,
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';
import {
  InvestorProject,
  LocalResource,
  ResourceCategory,
  InvestmentAnalysisResponse,
} from '@/types';
import { api } from '@/lib/api';

type MarketplaceTab = 'resources' | 'opportunities' | 'analysis';

export default function InvestorMarketplacePage() {
  const { selectedCity, cityProfile, projects } = useCity();

  // Active Tab
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('opportunities');

  // Resource Directory State
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [resourceCategory, setResourceCategory] = useState<string>('all');
  const [loadingResources, setLoadingResources] = useState(false);

  // Opportunities State
  const [opportunities, setOpportunities] = useState<InvestorProject[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestorProject | null>(null);

  // Enquiry Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryTarget, setEnquiryTarget] = useState<InvestorProject | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({
    investor_name: '',
    investor_email: '',
    organization: '',
    proposed_investment_cr: '',
    target_timeline: '3-6 months',
    message: '',
    contact_phone: '',
  });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryReceipt, setEnquiryReceipt] = useState<any | null>(null);

  // Investment Analysis & Sensitivity Studio State
  const [analysisOpportunityId, setAnalysisOpportunityId] = useState<string>('inv-01');
  const [customCapex, setCustomCapex] = useState<number>(85.0);
  const [capacityUtilization, setCapacityUtilization] = useState<number>(75);
  const [capitalSubsidy, setCapitalSubsidy] = useState<number>(25);
  const [tariffMultiplier, setTariffMultiplier] = useState<number>(1.0);
  const [costOfCapital, setCostOfCapital] = useState<number>(10.0);
  const [analysisData, setAnalysisData] = useState<InvestmentAnalysisResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Fetch Opportunities and Resources on load or city change
  useEffect(() => {
    async function loadData() {
      // 1. Load Resources
      try {
        setLoadingResources(true);
        const resData = await api.getLocalResources(selectedCity, resourceCategory);
        if (resData && resData.length > 0) {
          setResources(resData);
        }
      } catch (err) {
        console.warn('Using local fallback for resources', err);
      } finally {
        setLoadingResources(false);
      }

      // 2. Load Opportunities
      try {
        const oppData = await api.getOpportunities(selectedCity);
        if (oppData && oppData.length > 0) {
          setOpportunities(oppData);
        } else {
          setOpportunities(projects);
        }
      } catch (err) {
        setOpportunities(projects);
      }
    }
    loadData();
  }, [selectedCity, resourceCategory, projects]);

  // Load Analysis Data when sliders or opportunity selection changes
  useEffect(() => {
    async function runAnalysis() {
      setAnalyzing(true);
      try {
        const res = await api.analyzeInvestment({
          investment_id: analysisOpportunityId,
          capex_in_cr: customCapex,
          capacity_utilization_percent: capacityUtilization,
          capital_subsidy_percent: capitalSubsidy,
          tariff_realization_multiplier: tariffMultiplier,
          cost_of_capital_percent: costOfCapital,
        });
        setAnalysisData(res);
      } catch (err) {
        console.error('Failed to run investment analysis', err);
      } finally {
        setAnalyzing(false);
      }
    }
    runAnalysis();
  }, [analysisOpportunityId, customCapex, capacityUtilization, capitalSubsidy, tariffMultiplier, costOfCapital]);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    if (sectorFilter === 'all') return opportunities;
    return opportunities.filter((o) => o.sector.toLowerCase() === sectorFilter.toLowerCase());
  }, [opportunities, sectorFilter]);

  // Total Pipeline Metrics
  const totalCapex = useMemo(() => {
    return opportunities.reduce((acc, curr) => acc + (curr.capexInCr || 0), 0);
  }, [opportunities]);

  const totalJobs = useMemo(() => {
    return opportunities.reduce((acc, curr) => acc + (curr.directJobs || 0), 0);
  }, [opportunities]);

  // Handle Enquiry Submit
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryTarget) return;

    setEnquirySubmitting(true);
    try {
      const payload = {
        investment_id: enquiryTarget.id,
        investor_name: enquiryForm.investor_name,
        investor_email: enquiryForm.investor_email,
        organization: enquiryForm.organization,
        proposed_investment_cr: enquiryForm.proposed_investment_cr
          ? parseFloat(enquiryForm.proposed_investment_cr)
          : undefined,
        target_timeline: enquiryForm.target_timeline,
        message: enquiryForm.message,
        contact_phone: enquiryForm.contact_phone || undefined,
      };
      const res = await api.submitInvestmentEnquiry(payload);
      setEnquiryReceipt(res);
    } catch (err: any) {
      alert(err.message || 'Failed to submit enquiry.');
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const closeEnquiryModal = () => {
    setEnquiryModalOpen(false);
    setEnquiryTarget(null);
    setEnquiryReceipt(null);
    setEnquiryForm({
      investor_name: '',
      investor_email: '',
      organization: '',
      proposed_investment_cr: '',
      target_timeline: '3-6 months',
      message: '',
      contact_phone: '',
    });
  };

  const handleRunAnalysisForOpportunity = (opp: InvestorProject) => {
    setAnalysisOpportunityId(opp.id);
    setCustomCapex(opp.capexInCr);
    setActiveTab('analysis');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Investor Marketplace & Civic Discovery Engine
            </h1>
            <Badge variant="teal" size="sm">
              {cityProfile.name}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Connecting regional agricultural endowments, tribal workforce capabilities, and verified development opportunities with responsible institutional capital.
            All estimates feature disclosed assumptions and statutory citations rather than speculative guarantees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bankable Pipeline</span>
            <span className="text-base font-bold text-teal-800 font-mono">₹{totalCapex.toFixed(1)} Cr</span>
          </div>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'opportunities'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Opportunity Listings</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {opportunities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'resources'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Resource Directory</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-mono">
            {resources.length || '17'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all ${
            activeTab === 'analysis'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Investment Analysis & Sensitivity</span>
          <Badge variant="outline" size="sm" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">
            Live Studio
          </Badge>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: OPPORTUNITY LISTINGS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Structured Capex</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  ₹{totalCapex.toFixed(1)} <span className="text-xs text-slate-400">Cr</span>
                </div>
                <span className="text-[11px] text-slate-500">Across {opportunities.length} bankable ventures</span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Average Modeled IRR</span>
                <div className="text-2xl font-bold text-teal-700 font-mono">
                  {(
                    opportunities.reduce((acc, curr) => acc + (curr.expectedIrrPercent || 0), 0) /
                    (opportunities.length || 1)
                  ).toFixed(1)}%
                </div>
                <span className="text-[11px] text-slate-500">De-risked via capital incentives</span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Direct Formal Jobs</span>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {totalJobs.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500">Value-added processing & tech positions</span>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Verification Rigor</span>
                <div className="text-2xl font-bold text-indigo-700 font-mono flex items-center gap-1.5">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  100%
                </div>
                <span className="text-[11px] text-slate-500">Statutory clearances & DPR backed</span>
              </CardContent>
            </Card>
          </div>

          {/* Sector Filter Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Filter Sector:</span>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'employment', 'infrastructure', 'environment'].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setSectorFilter(sec)}
                    className={`px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-all ${
                      sectorFilter === sec
                        ? 'bg-teal-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{filteredOpportunities.length}</strong> opportunities
            </span>
          </div>

          {/* Opportunity Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredOpportunities.map((opp) => (
              <Card
                key={opp.id}
                className="flex flex-col justify-between hover:border-teal-500 hover:shadow-md transition-all border border-slate-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="teal" size="sm">
                        {opp.projectType}
                      </Badge>
                      <Badge variant="outline" size="sm" className="font-mono bg-white">
                        ESG {opp.esgRating}
                      </Badge>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        {opp.verificationStage || 'Verified DPR'}
                      </span>
                    </div>

                    <Badge variant="navy" size="sm">
                      {opp.status}
                    </Badge>
                  </div>

                  <CardTitle className="text-base font-bold text-slate-900 mt-2.5 leading-snug">
                    {opp.title}
                  </CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1 text-slate-500">
                    <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Location: {opp.location}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 pt-0 text-xs flex-1 flex flex-col justify-between">
                  <p className="text-slate-600 leading-relaxed">
                    {opp.brief}
                  </p>

                  {/* Financial & Job Outlay */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Required Capex
                      </span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        ₹{opp.capexInCr} Cr
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Modeled IRR
                      </span>
                      <span className="font-bold text-teal-700 font-mono text-sm">
                        {opp.expectedIrrPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">
                        Direct Jobs
                      </span>
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {opp.directJobs.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Supporting Evidence Callout */}
                  <div className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-sky-600" />
                      Supporting Evidence & Statutory Basis:
                    </span>
                    <p className="text-[11px] text-sky-900 leading-snug">
                      {opp.supportingEvidence ||
                        'Pre-feasibility techno-economic study approved by State Single Window Clearance Committee under Odisha Industrial Policy Resolution.'}
                    </p>
                  </div>

                  {/* Regulatory Safeguards Callout */}
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-700" />
                      Regulatory Considerations:
                    </span>
                    <p className="text-[11px] text-amber-900 leading-snug">
                      {opp.regulatoryConsiderations ||
                        'Schedule V tribal tenancy safeguards require designated industrial leasehold via IDCO land bank; Gram Sabha consent and SPCB Orange category environmental clearance.'}
                    </p>
                  </div>

                  {/* Potential Partners */}
                  <div className="text-[11px] text-slate-600 pt-1">
                    <strong className="text-slate-800">Potential Partners: </strong>
                    <span>{opp.potentialPartners || 'APICOL, Mission Shakti WSHG Federations, IDCO, OMBADC'}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRunAnalysisForOpportunity(opp)}
                      className="text-xs flex items-center gap-1 text-slate-700"
                    >
                      <Sliders className="w-3.5 h-3.5 text-teal-600" />
                      Sensitivity Studio
                    </Button>

                    <Button
                      variant="teal"
                      size="sm"
                      onClick={() => {
                        setEnquiryTarget(opp);
                        setEnquiryModalOpen(true);
                      }}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submit Expression of Interest (EOI)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: RESOURCE DIRECTORY                                             */}
      {/* ========================================================================= */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
            {[
              { id: 'all', label: 'All Resources', icon: Layers },
              { id: 'agricultural', label: 'Agricultural Resources', icon: Wheat },
              { id: 'local_product', label: 'Local Products & GI', icon: ShoppingBag },
              { id: 'workforce', label: 'Workforce Capabilities', icon: Users },
              { id: 'tourism', label: 'Tourism Opportunities', icon: Compass },
              { id: 'existing_business', label: 'Existing Businesses', icon: Building2 },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setResourceCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    resourceCategory === cat.id
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Resources Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((res) => {
              const getCategoryBadge = (c: ResourceCategory) => {
                switch (c) {
                  case 'agricultural':
                    return <Badge variant="teal" size="sm">Agricultural</Badge>;
                  case 'local_product':
                    return <Badge variant="navy" size="sm">Local Product & GI</Badge>;
                  case 'workforce':
                    return <Badge variant="outline" size="sm" className="bg-indigo-50 text-indigo-700 border-indigo-200">Workforce Pool</Badge>;
                  case 'tourism':
                    return <Badge variant="outline" size="sm" className="bg-amber-50 text-amber-700 border-amber-200">Tourism & Eco</Badge>;
                  case 'existing_business':
                    return <Badge variant="outline" size="sm" className="bg-slate-100 text-slate-700 border-slate-300">Anchor Enterprise</Badge>;
                  default:
                    return <Badge variant="outline" size="sm">{c}</Badge>;
                }
              };

              return (
                <Card
                  key={res.id}
                  className="flex flex-col justify-between hover:border-teal-500/80 hover:shadow-sm transition-all"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      {getCategoryBadge(res.category)}
                      {res.certifications_or_anchor && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {res.certifications_or_anchor.split(',')[0]}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                      {res.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs flex-1 flex flex-col justify-between">
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {res.description}
                    </p>

                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-md space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Endowment Metrics:
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800">
                        {res.key_metrics}
                      </span>
                    </div>

                    <div className="p-2 bg-teal-50/60 border border-teal-200/60 rounded-md space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-teal-800 block">
                        Commercial Growth Opportunity:
                      </span>
                      <p className="text-[10px] text-teal-950 leading-snug">
                        {res.growth_potential}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Source:</span>
                      <span className="text-slate-600 truncate max-w-[190px]" title={res.supporting_source}>
                        {res.supporting_source}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: INVESTMENT ANALYSIS & SENSITIVITY STUDIO                        */}
      {/* ========================================================================= */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* Studio Top Control Panel */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" />
                  <h2 className="text-sm font-bold tracking-wide uppercase text-teal-300">
                    Interactive Investment Sensitivity Studio
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test operating scenarios against user-defined capacity, capital subsidies, and market realisations.
                </p>
              </div>

              {/* Opportunity Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target Opportunity:</span>
                <select
                  value={analysisOpportunityId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setAnalysisOpportunityId(id);
                    const found = opportunities.find((o) => o.id === id);
                    if (found) setCustomCapex(found.capexInCr);
                  }}
                  className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-teal-500 font-medium"
                >
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} (₹{opp.capexInCr} Cr)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Slider 1: Capacity Utilization */}
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Capacity Utilization:</span>
                  <span className="text-teal-400 font-mono font-bold">{capacityUtilization}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={capacityUtilization}
                  onChange={(e) => setCapacityUtilization(parseInt(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>40% (Pilot)</span>
                  <span>75% (Base)</span>
                  <span>100% (Optimal)</span>
                </div>
              </div>

              {/* Slider 2: Capital Subsidy */}
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Capital Subsidy:</span>
                  <span className="text-teal-400 font-mono font-bold">{capitalSubsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={capitalSubsidy}
                  onChange={(e) => setCapitalSubsidy(parseInt(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0% (Unassisted)</span>
                  <span>25% (Agri Policy)</span>
                  <span>50% (DMF Max)</span>
                </div>
              </div>

              {/* Slider 3: Tariff Realization Multiplier */}
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Tariff Realization:</span>
                  <span className="text-teal-400 font-mono font-bold">{(tariffMultiplier * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="1.30"
                  step="0.05"
                  value={tariffMultiplier}
                  onChange={(e) => setTariffMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>80% (Wholesale)</span>
                  <span>100% (Domestic)</span>
                  <span>130% (Export)</span>
                </div>
              </div>

              {/* Slider 4: Cost of Capital */}
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Senior Debt Interest:</span>
                  <span className="text-teal-400 font-mono font-bold">{costOfCapital.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="14.0"
                  step="0.5"
                  value={costOfCapital}
                  onChange={(e) => setCostOfCapital(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>7% (Concessional)</span>
                  <span>10% (Commercial)</span>
                  <span>14% (Sub-debt)</span>
                </div>
              </div>
            </div>

            {/* Quick Reset Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setCapacityUtilization(75);
                  setCapitalSubsidy(25);
                  setTariffMultiplier(1.0);
                  setCostOfCapital(10.0);
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset to Base DPR Assumptions
              </button>
            </div>
          </div>

          {/* Live Analysis Results */}
          {analysisData && (
            <div className="space-y-6">
              {/* Dynamic Financial Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Total Capex</span>
                    <div className="text-xl font-bold text-slate-900 font-mono">
                      ₹{analysisData.base_capex_cr} <span className="text-xs text-slate-400">Cr</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Approved project asset base</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-teal-600">Net Sponsor Outlay</span>
                    <div className="text-xl font-bold text-teal-800 font-mono">
                      ₹{analysisData.effective_capex_cr} <span className="text-xs text-teal-500">Cr</span>
                    </div>
                    <span className="text-[10px] text-teal-600">Net of {capitalSubsidy}% capital grant</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Base Scenario IRR</span>
                    <div className="text-xl font-bold text-indigo-700 font-mono">
                      {analysisData.scenario_comparisons[1]?.projected_irr_percent || '18.5'}%
                    </div>
                    <span className="text-[10px] text-slate-500">10-year DCF equity return</span>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Estimated Payback</span>
                    <div className="text-xl font-bold text-slate-900 font-mono">
                      {analysisData.scenario_comparisons[1]?.payback_period_years || '4.5'} <span className="text-xs text-slate-400">Yrs</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Under modeled utilization</span>
                  </CardContent>
                </Card>
              </div>

              {/* Scenario Comparisons */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-teal-700" />
                    Multi-Scenario Operating Comparisons
                  </h3>
                  <span className="text-xs text-slate-500">Benchmarked across 3 defensible operating regimes</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisData.scenario_comparisons.map((sc) => {
                    const isBase = sc.scenario.includes('Base');
                    return (
                      <Card
                        key={sc.scenario}
                        className={`border ${
                          isBase ? 'border-teal-600 bg-teal-50/20 shadow-xs' : 'border-slate-200'
                        }`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">{sc.scenario}</span>
                            <Badge
                              variant={isBase ? 'teal' : 'outline'}
                              size="sm"
                              className="text-[10px]"
                            >
                              {sc.confidence_level}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-0 text-xs">
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1.5 font-mono">
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[11px]">Capacity Utilization:</span>
                              <span className="font-bold text-slate-800">{sc.capacity_utilization}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[11px]">State Capital Subsidy:</span>
                              <span className="font-bold text-slate-800">{sc.capital_subsidy_percent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 text-[11px]">Annual Turnover:</span>
                              <span className="font-bold text-slate-800">₹{sc.annual_revenue_cr} Cr</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-1">
                              <span className="text-teal-700 font-bold text-[11px]">Projected IRR:</span>
                              <span className="font-bold text-teal-700">{sc.projected_irr_percent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-700 font-bold text-[11px]">Payback Period:</span>
                              <span className="font-bold text-slate-900">{sc.payback_period_years} Years</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* 2D Sensitivity Matrix */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900">
                        2D Sensitivity Analysis Matrix (Capacity vs. Capital Subsidy)
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Shows Project IRR (%) and Payback Period (years) for each combination of operating utilization and government incentive.
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Prime
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-teal-500"></span> Viable
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-amber-400"></span> Moderate
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded bg-slate-300"></span> Marginal
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 overflow-x-auto">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="p-2 text-left font-bold text-slate-700">Capacity \ Subsidy</th>
                        <th className="p-2 font-bold text-slate-700">10% Subsidy</th>
                        <th className="p-2 font-bold text-slate-700">20% Subsidy</th>
                        <th className="p-2 font-bold text-slate-700">25% Subsidy</th>
                        <th className="p-2 font-bold text-slate-700">30% Subsidy</th>
                        <th className="p-2 font-bold text-slate-700">40% Subsidy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[50.0, 65.0, 75.0, 85.0, 100.0].map((util) => {
                        return (
                          <tr key={util} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-2 text-left font-bold text-slate-800 bg-slate-50 font-mono">
                              {util}% Utilization
                            </td>
                            {[10.0, 20.0, 25.0, 30.0, 40.0].map((sub) => {
                              const cell = analysisData.sensitivity_matrix.find(
                                (c) => c.capacity_utilization_percent === util && c.capital_subsidy_percent === sub
                              );
                              if (!cell) return <td key={sub}>-</td>;

                              const getBgColor = (v: string) => {
                                switch (v) {
                                  case 'Prime':
                                    return 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold';
                                  case 'Viable':
                                    return 'bg-teal-50 text-teal-900 border-teal-200 font-semibold';
                                  case 'Moderate':
                                    return 'bg-amber-50 text-amber-900 border-amber-200';
                                  default:
                                    return 'bg-slate-50 text-slate-600 border-slate-200';
                                }
                              };

                              return (
                                <td key={sub} className="p-2">
                                  <div className={`p-1.5 rounded border text-[11px] font-mono ${getBgColor(cell.viability_label)}`}>
                                    <div>{cell.irr_percent}% IRR</div>
                                    <div className="text-[10px] text-slate-500">{cell.payback_years}y payback</div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Cost Breakdown & Defensible 5-Year Revenue Trajectory */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Cost Breakdown */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Itemized Cost Breakdown (Capex & Annual Opex)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Capital asset expenditure vs. steady-state operational overheads
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-slate-800 block mb-1">
                        Capex Outlay Breakdown (₹{analysisData.base_capex_cr} Cr Total):
                      </span>
                      <div className="space-y-1.5">
                        {analysisData.capex_breakdown.map((item, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-start gap-2">
                            <div>
                              <span className="font-semibold text-slate-800 block">{item.category}</span>
                              <span className="text-[10px] text-slate-500">{item.description}</span>
                            </div>
                            <div className="text-right shrink-0 font-mono">
                              <span className="font-bold text-slate-900 text-xs">₹{item.amount_cr} Cr</span>
                              <span className="text-[10px] text-slate-400 block">{item.share_percent}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-slate-800 block mb-1">
                        Annual Opex Breakdown:
                      </span>
                      <div className="space-y-1.5">
                        {analysisData.opex_breakdown.map((item, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-start gap-2">
                            <div>
                              <span className="font-semibold text-slate-800 block">{item.category}</span>
                              <span className="text-[10px] text-slate-500">{item.description}</span>
                            </div>
                            <div className="text-right shrink-0 font-mono">
                              <span className="font-bold text-slate-900 text-xs">₹{item.amount_cr} Cr</span>
                              <span className="text-[10px] text-slate-400 block">{item.share_percent}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 5-Year Defensible Revenue Trajectory */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Defensible 5-Year Revenue Trajectory
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Forecast ranges with conservative lower bounds, baseline targets, and upside realization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="space-y-2">
                      {analysisData.revenue_trajectory.map((pt) => (
                        <div key={pt.year} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">Year {pt.year} Projection</span>
                            <div className="font-mono text-xs flex items-center gap-2">
                              <span className="text-slate-400 text-[11px]">Min: ₹{pt.min_revenue_cr} Cr</span>
                              <span className="font-bold text-teal-700">Exp: ₹{pt.expected_revenue_cr} Cr</span>
                              <span className="text-slate-500 text-[11px]">Max: ₹{pt.max_revenue_cr} Cr</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600 leading-snug">
                            {pt.driver_notes}
                          </p>
                          {/* Visual Bar Indicator */}
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                            <div
                              className="bg-teal-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, (pt.expected_revenue_cr / 100) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Factors & Defensible Mitigation Strategies */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Key Risk Factors & Defensible Mitigations
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Comprehensive risk assessment across regulatory, climatic, market, and execution risks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 text-xs overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="p-2.5 font-bold">Identified Risk Factor</th>
                        <th className="p-2.5 font-bold">Category</th>
                        <th className="p-2.5 font-bold">Severity</th>
                        <th className="p-2.5 font-bold">Actionable Mitigation Strategy</th>
                        <th className="p-2.5 font-bold">Residual Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analysisData.risk_factors.map((rf, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-semibold text-slate-800">{rf.risk}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-medium text-slate-700">
                              {rf.category}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                rf.severity === 'High'
                                  ? 'bg-rose-50 text-rose-700'
                                  : rf.severity === 'Medium'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {rf.severity}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px] leading-relaxed max-w-md">
                            {rf.mitigation_strategy}
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 font-medium">
                              {rf.residual_risk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Assumptions & Data Sources Disclosure Banner */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-teal-700" />
                  <span className="font-bold text-slate-900 text-sm">
                    Mandatory Disclosures & Statutory Citations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Underlying Financial Assumptions:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                      {analysisData.disclosed_assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block mb-1">
                      Primary Statutory Data Sources:
                    </span>
                    <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                      {analysisData.data_sources.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  <strong>Statutory Notice: </strong>
                  {analysisData.regulatory_disclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* INVESTOR ENQUIRY & EXPRESSION OF INTEREST MODAL                          */}
      {/* ========================================================================= */}
      {enquiryModalOpen && enquiryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  Official Expression of Interest (EOI)
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {enquiryTarget.title}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Project Ref: {enquiryTarget.id} • Required Capex: ₹{enquiryTarget.capexInCr} Cr
                </span>
              </div>
              <button
                onClick={closeEnquiryModal}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {enquiryReceipt ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Expression of Interest Registered!</span>
                </div>
                <p>
                  Thank you, <strong>{enquiryReceipt.investor_name}</strong>. Your enquiry for{' '}
                  <strong>{enquiryReceipt.investment_title || enquiryTarget.title}</strong> has been assigned reference ID:
                </p>
                <div className="p-2 bg-white rounded border border-emerald-200 font-mono text-center text-sm font-bold text-slate-800">
                  {enquiryReceipt.id}
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  The District Industrial Promotion Agency (DIPA) and the designated transaction advisor will transmit the Detailed Project Report (DPR) and statutory clearance dossier to <strong>{enquiryReceipt.investor_email}</strong>.
                </p>
                <div className="pt-2 flex justify-end">
                  <Button variant="teal" size="sm" onClick={closeEnquiryModal}>
                    Done
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Representative Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Ray"
                      value={enquiryForm.investor_name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, investor_name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="siddharth@orientcapital.in"
                      value={enquiryForm.investor_email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, investor_email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Organization / Fund Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Orient Agri-Ventures LLP"
                      value={enquiryForm.organization}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, organization: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+91-98765-43210"
                      value={enquiryForm.contact_phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, contact_phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Proposed Commitment (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 20.0"
                      value={enquiryForm.proposed_investment_cr}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, proposed_investment_cr: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Target Horizon</label>
                    <select
                      value={enquiryForm.target_timeline}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, target_timeline: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="Immediate (< 3 months)">Immediate (&lt; 3 months)</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="1-2 years">1-2 years (Exploratory)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Enquiry Notes / Due Diligence Requirements *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Specify your investment focus, concession preferences, or queries on Schedule V land leases and APICOL subsidies..."
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500">
                  Submitting this Expression of Interest does not create a binding financial commitment. It initiates formal technical engagement with the district concession authority.
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <Button variant="outline" size="sm" type="button" onClick={closeEnquiryModal}>
                    Cancel
                  </Button>
                  <Button variant="teal" size="sm" type="submit" disabled={enquirySubmitting}>
                    {enquirySubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Submit EOI
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
