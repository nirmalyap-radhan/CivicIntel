'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  Clock,
  Compass,
  ArrowRight,
  Info,
  RefreshCw,
  Search,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  civicApi,
  ApiPolicyRecommendation,
  ApiPolicyGenerationResponse,
  ApiEvidenceDossier,
} from '@/lib/api';

interface AIPolicyEngineViewProps {
  cityId: string;
  cityName: string;
}

export function AIPolicyRecommendationEngineView({ cityId, cityName }: AIPolicyEngineViewProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [data, setData] = useState<ApiPolicyGenerationResponse | null>(null);
  const [recommendations, setRecommendations] = useState<ApiPolicyRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [budgetCap, setBudgetCap] = useState<number>(100);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Evidence Dossier Modal
  const [inspectingRecId, setInspectingRecId] = useState<string | null>(null);
  const [evidenceDossier, setEvidenceDossier] = useState<ApiEvidenceDossier | null>(null);
  const [loadingEvidence, setLoadingEvidence] = useState<boolean>(false);

  // Workflow Action State
  const [actionRecId, setActionRecId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'request_changes' | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [modRequests, setModRequests] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await civicApi.generateRecommendations(cityId, {
        budget_constraint_cr: budgetCap,
        prioritized_sectors: selectedSector !== 'all' ? [selectedSector] : undefined,
      });
      setData(res);
      setRecommendations(res.recommendations);
    } catch (err: any) {
      console.error('Failed to load policy recommendations:', err);
      // Fallback: try fetching stored recommendations
      try {
        const stored = await civicApi.getPolicyRecommendations(cityId, selectedSector, selectedStatus);
        setRecommendations(stored);
      } catch {
        setError('Unable to load policy recommendations. Please check backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [cityId]);

  const handleInspectEvidence = async (recId: string) => {
    setInspectingRecId(recId);
    setLoadingEvidence(true);
    setEvidenceDossier(null);
    try {
      const dossier = await civicApi.getRecommendationEvidence(recId);
      setEvidenceDossier(dossier);
    } catch (err) {
      console.error('Failed to fetch evidence dossier:', err);
    } finally {
      setLoadingEvidence(false);
    }
  };

  const handleTriggerAction = (recId: string, action: 'accept' | 'reject' | 'request_changes') => {
    setActionRecId(recId);
    setActionType(action);
    setReviewerNotes(
      action === 'accept'
        ? 'Approved for official implementation under statutory DMF allocation guidelines.'
        : action === 'reject'
        ? 'Declined due to duplicate state department watershed sanction.'
        : 'Please modify implementation staging and increase tribal SHG equity.'
    );
    setModRequests('');
    setActionFeedback(null);
  };

  const handleSubmitAction = async () => {
    if (!actionRecId || !actionType) return;
    setIsSubmittingAction(true);
    setActionFeedback(null);
    try {
      const parsedModRequests = modRequests
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updated = await civicApi.reviewRecommendation(
        actionRecId,
        actionType,
        reviewerNotes,
        parsedModRequests.length > 0 ? parsedModRequests : undefined
      );

      // Update local state
      setRecommendations((prev) =>
        prev.map((r) => (r.id === actionRecId ? { ...r, status: updated.status } : r))
      );

      setActionFeedback(
        actionType === 'accept'
          ? 'Recommendation successfully approved and converted into an official Development Policy!'
          : actionType === 'reject'
          ? 'Proposal has been officially rejected with documented rationale.'
          : 'Modification requests logged. Proposal status updated to Changes Requested.'
      );

      setTimeout(() => {
        setActionRecId(null);
        setActionType(null);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to submit workflow action:', err);
      setActionFeedback(err.message || 'Workflow action failed. Note: Action requires authenticated planning role.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const filteredRecommendations = recommendations.filter((r) => {
    const matchSector = selectedSector === 'all' || r.sector.toLowerCase().includes(selectedSector.toLowerCase());
    const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchSector && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="civic-card-navy p-5 sm:p-6 rounded-xl border border-teal-500/20 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                AI Policy Recommendation Engine
              </h2>
              <Badge variant="teal" size="sm">
                Evidence-Grounded & Human-Gated
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizes verified city development deficits, matched benchmark precedents, statutory funding
              mechanisms (District Mineral Foundation / Jal Jeevan Mission), and feasibility constraints for{' '}
              <strong className="text-white">{cityName}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchRecommendations}
              disabled={loading || generating}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Re-Analyze Gaps
            </Button>
          </div>
        </div>

        {/* Safeguards Summary Tags */}
        <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-teal-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            No Hallucinated Schemes
          </span>
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Audit Passages & SOR Costing
          </span>
          <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Human Review Required for All Approvals
          </span>
        </div>
      </div>

      {/* Stage A: Deterministic Gap Analysis Callout */}
      {data && data.deterministic_gaps && data.deterministic_gaps.length > 0 && (
        <Card className="bg-slate-50/70 border border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-teal-100 text-teal-800 text-xs font-bold font-mono">
                  Stage A
                </span>
                <CardTitle className="text-sm font-bold text-slate-900">
                  Deterministic Gap Analysis & Missing Data Identification
                </CardTitle>
              </div>
              <Badge variant="navy" size="sm">
                Benchmark: {data.benchmark_city.name}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Algorithmic verification of empirical indicator deficits and prerequisite data gaps prior to policy formulation.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2.5 pt-1 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.deterministic_gaps.map((gap, i) => (
                <div
                  key={i}
                  className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
                      {gap.sector}
                    </span>
                    <Badge
                      variant={gap.severity === 'Critical' ? 'critical' : 'warning'}
                      size="sm"
                    >
                      {gap.severity}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{gap.gap_title}</h4>
                  <div className="flex items-baseline gap-2 font-mono text-[11px] text-slate-600">
                    <span>
                      Observed: <strong className="text-slate-900">{gap.target_value}</strong>
                    </span>
                    <span>→</span>
                    <span>
                      Benchmark: <strong className="text-slate-900">{gap.benchmark_value}</strong>
                    </span>
                    <span className="text-rose-600 font-bold">(-{gap.gap_percentage}%)</span>
                  </div>

                  {gap.missing_information.length > 0 && (
                    <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                      <span className="font-semibold text-amber-700">Missing Data Checklist:</span>
                      <ul className="list-disc list-inside mt-0.5 text-slate-600 truncate">
                        {gap.missing_information.map((m, idx) => (
                          <li key={idx} className="truncate">
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter and Constraint Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Sectors</option>
              <option value="healthcare">Healthcare</option>
              <option value="economic">Economic Development</option>
              <option value="water">Water & Sanitation</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="Proposed">Proposed</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Budget Filter:</span>
          <span className="font-mono font-bold text-teal-700">₹{budgetCap} Cr</span>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={budgetCap}
            onChange={(e) => setBudgetCap(Number(e.target.value))}
            className="w-24 accent-teal-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <RefreshCw className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Synthesizing Evidence-Grounded Policies...</p>
          <p className="text-xs text-slate-400">
            Matching statutory DMF guidelines, Jal Jeevan Mission norms, and Coffee Board subsidies.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Policy Proposals List */}
      {!loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              Prioritized Policy Interventions ({filteredRecommendations.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Stage C Controlled Approval Workflow
            </span>
          </div>

          <div className="space-y-4">
            {filteredRecommendations.map((rec) => {
              const isApproved = rec.status === 'Approved';
              const isRejected = rec.status === 'Rejected';
              const isChangesRequested = rec.status === 'Changes Requested';

              return (
                <Card
                  key={rec.id}
                  className={`transition-all duration-200 ${
                    isApproved
                      ? 'border-emerald-300 ring-1 ring-emerald-400/40'
                      : isRejected
                      ? 'opacity-70 border-slate-200'
                      : 'hover:border-teal-500/50 shadow-sm'
                  }`}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={rec.priority === 'Immediate' ? 'critical' : 'teal'}
                            size="sm"
                          >
                            {rec.priority} Priority
                          </Badge>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {rec.sector}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-semibold border ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : isRejected
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : isChangesRequested
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Status: {rec.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          {rec.title}
                        </h3>
                      </div>

                      {/* Cost & Timeline Chip */}
                      <div className="text-right shrink-0">
                        <span className="text-lg font-bold text-slate-900 font-mono block">
                          ₹{rec.estimated_cost_cr ? `${rec.estimated_cost_cr} Cr` : 'Pending Study'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {rec.cost_status}
                        </span>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong className="text-slate-900 block mb-0.5">Observed Development Deficit:</strong>
                      {rec.problem_statement}
                    </div>

                    {/* Proposed Intervention */}
                    <div className="text-xs text-slate-700 leading-relaxed space-y-1">
                      <strong className="text-slate-900 block">Proposed Operational Intervention:</strong>
                      <p>{rec.proposed_intervention}</p>
                    </div>

                    {/* Applicable Schemes & Funding Mechanism */}
                    {rec.applicable_schemes.length > 0 && (
                      <div className="space-y-1.5 pt-1 text-xs">
                        <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wide">
                          Statutory Schemes & Funding Mechanism:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {rec.applicable_schemes.map((scheme, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-teal-50 border border-teal-200 rounded px-2.5 py-1 text-[11px] text-teal-950"
                            >
                              <strong className="text-teal-900">{scheme.scheme_name}</strong>{' '}
                              <span className="text-teal-700 font-mono">({scheme.funding_share})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Outcomes & Deliverables */}
                    {rec.expected_outcomes.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {rec.expected_outcomes.map((out, outIdx) => (
                          <div
                            key={outIdx}
                            className="bg-white p-2.5 rounded border border-slate-200 text-[11px] space-y-0.5"
                          >
                            <span className="font-semibold text-slate-800 block">{out.kpi}</span>
                            <div className="flex justify-between text-slate-500 font-mono">
                              <span>Base: {out.baseline}</span>
                              <span>Target: <strong className="text-emerald-700">{out.projected_target}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Data Gaps Warning if any */}
                    {rec.data_gaps.length > 0 && (
                      <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded text-amber-900 text-[11px] space-y-0.5">
                        <span className="font-bold flex items-center gap-1 text-amber-800">
                          <Info className="w-3.5 h-3.5" />
                          Prerequisite Field Data Gaps:
                        </span>
                        <ul className="list-disc list-inside text-amber-800">
                          {rec.data_gaps.map((gap, gIdx) => (
                            <li key={gIdx}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Footer Actions: Evidence Inspector + Government Approval Workflow */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      {/* Evidence Inspector Button ("Why did CivicIntel recommend this?") */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInspectEvidence(rec.id)}
                        className="text-xs text-teal-700 hover:text-teal-800 border-teal-200 hover:bg-teal-50"
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                        Why did CivicIntel recommend this?
                      </Button>

                      {/* Stage C: Government Review Actions */}
                      <div className="flex items-center gap-2">
                        {isApproved ? (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved for Execution
                          </span>
                        ) : isRejected ? (
                          <span className="text-xs font-semibold text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                            <XCircle className="w-3.5 h-3.5" />
                            Declined by Government
                          </span>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTriggerAction(rec.id, 'request_changes')}
                              className="text-xs text-amber-700 hover:bg-amber-50 border-amber-200"
                            >
                              Request Changes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTriggerAction(rec.id, 'reject')}
                              className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                            >
                              Decline
                            </Button>
                            <Button
                              variant="teal"
                              size="sm"
                              onClick={() => handleTriggerAction(rec.id, 'accept')}
                              className="text-xs"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Accept Proposal
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Evidence Dossier Modal ("Why did CivicIntel recommend this?") */}
      {inspectingRecId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Research-Quality Traceability Dossier
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {evidenceDossier?.title || 'Evidence Grounding'}
                </h3>
              </div>
              <button
                onClick={() => setInspectingRecId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-base"
              >
                ✕
              </button>
            </div>

            {loadingEvidence ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-teal-600" />
                <p>Retrieving authentic source documents & audit excerpts...</p>
              </div>
            ) : evidenceDossier ? (
              <div className="space-y-4 text-xs text-slate-700">
                {/* Core Problem Grounding */}
                <div className="space-y-1">
                  <strong className="text-slate-900 block">Empirical Gap Foundation:</strong>
                  <p className="p-3 bg-slate-50 rounded border border-slate-200 leading-relaxed">
                    {evidenceDossier.why_recommended.core_problem}
                  </p>
                </div>

                {/* Real-World Source Documents & Relevant Passages */}
                <div className="space-y-2">
                  <strong className="text-slate-900 block">
                    Underlying Source Documents & Statutory Clauses:
                  </strong>
                  <div className="space-y-2">
                    {evidenceDossier.why_recommended.supporting_passages.map((src, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-teal-50/50 border border-teal-200 space-y-1.5"
                      >
                        <div className="flex justify-between items-start font-semibold text-teal-950">
                          <span>{src.document_title}</span>
                          <span className="font-mono text-teal-700 text-[10px]">
                            {src.publisher} ({src.year})
                          </span>
                        </div>
                        <p className="italic text-slate-700 bg-white p-2 rounded border border-teal-100 text-[11px] leading-relaxed">
                          &quot;{src.relevant_passage}&quot;
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Citation: {src.citation_reference}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Rigor Safeguard */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block">Financial & Cost Rigor:</strong>
                  <p className="text-[11px] text-slate-600">
                    Status: <strong>{evidenceDossier.why_recommended.cost_rigor.cost_status}</strong> (
                    ₹{evidenceDossier.why_recommended.cost_rigor.estimated_budget_cr} Cr).
                    CivicIntel prohibits fabricated ROI. Costs reflect verified scheme unit rates and Standard Schedules of Rates (SOR).
                  </p>
                </div>

                {/* Governance Safeguard */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
                  <span className="font-bold block mb-0.5">Statutory Governance Safeguard:</span>
                  {evidenceDossier.governance_safeguard}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setInspectingRecId(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stage C Review Action Modal */}
      {actionRecId && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  Stage C Government Approval Workflow
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {actionType === 'accept'
                    ? 'Accept & Commit Policy to City Register'
                    : actionType === 'reject'
                    ? 'Decline Policy Proposal'
                    : 'Request Policy Modifications'}
                </h3>
              </div>
              <button
                onClick={() => setActionRecId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-base"
              >
                ✕
              </button>
            </div>

            {actionFeedback && (
              <div
                className={`p-3 rounded border text-xs ${
                  actionFeedback.includes('successfully')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                {actionFeedback}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Official Reviewer Justification & Notes:
                </label>
                <textarea
                  rows={3}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Provide statutory rationale, funding scheme allocation, or rejection justification..."
                />
              </div>

              {actionType === 'request_changes' && (
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Specific Modification Requests (One per line):
                  </label>
                  <textarea
                    rows={3}
                    value={modRequests}
                    onChange={(e) => setModRequests(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="e.g. Include Pottangi block in Year 1&#10;Cap DMF contribution at 50%"
                  />
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                * Note: In compliance with statutory safeguards, public funds and policy commitments require
                authenticated government official approval.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionRecId(null)}
                disabled={isSubmittingAction}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'accept' ? 'teal' : actionType === 'reject' ? 'danger' : 'secondary'}
                size="sm"
                onClick={handleSubmitAction}
                disabled={isSubmittingAction || !reviewerNotes.trim()}
              >
                {isSubmittingAction ? 'Recording Action...' : 'Confirm Decision'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
