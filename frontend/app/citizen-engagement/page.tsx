'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Send,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Check,
  X,
  HelpCircle,
  Award,
  Trophy,
  MapPin,
  Camera,
  Eye,
  EyeOff,
  Calendar,
  Layers,
  ArrowRight,
  UserCheck,
  FileText,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';

interface ReportItem {
  id: string;
  category: 'damaged_road' | 'water_leakage' | 'waste_management' | 'healthcare_gap' | 'streetlight';
  title: string;
  description: string;
  evidenceUrl: string;
  coarseLocation: string;
  preciseLocationPrivate: string;
  publicConsent: boolean;
  status: 'pending_verification' | 'under_review' | 'clarification_requested' | 'verified' | 'rejected';
  submittedAt: string;
  reviewerNotes?: string;
  awardedCredits?: number;
  auditTrail: {
    timestamp: string;
    action: string;
    actor: string;
    notes: string;
  }[];
}

interface CommunityInitiativeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  organizer: string;
  locationArea: string;
  targetParticipants: number;
  currentVolunteers: number;
  date: string;
  creditsReward: number;
  status: 'Open' | 'In Progress' | 'Completed';
  isJoined?: boolean;
}

interface CreditLedgerItem {
  id: string;
  date: string;
  description: string;
  delta: number;
  outcome: 'approved' | 'bonus';
  refId: string;
}

export default function CitizenEngagementPage() {
  const { selectedCity, cityProfile } = useCity();

  // Active Tab: 'feed' | 'report' | 'my_reports' | 'initiatives' | 'credits_leaderboard'
  const [activeTab, setActiveTab] = useState<'feed' | 'report' | 'my_reports' | 'initiatives' | 'credits_leaderboard'>('feed');

  // Reviewer Audit Mode Toggle (for demonstration of steps 4-6)
  const [isReviewerMode, setIsReviewerMode] = useState(false);

  // Citizen Profile State
  const [citizenProfile, setCitizenProfile] = useState({
    name: 'Sushree Mahapatra',
    handle: 'Sushree_7482',
    tier: 'Active Community Steward',
    totalCredits: 50,
    verifiedCount: 1,
    pendingCount: 1,
    city: cityProfile.name,
    badges: ['Pioneer Citizen 2026', 'Verified First-Responder', 'Clean Water Sentinel'],
  });

  // Submitted Problem Reports (Initial state reflects example workflow)
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-01',
      category: 'water_leakage',
      title: 'Turbidity test & pipeline leak on Kolab catchment feeder',
      description: 'Tested drinking water sample using municipal kit. High turbidity and pipeline flange seepage detected.',
      evidenceUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
      coarseLocation: 'Semiliguda Block, Ward 4',
      preciseLocationPrivate: 'Behind Primary School, GPS: 18.712, 82.842',
      publicConsent: true,
      status: 'verified',
      submittedAt: '2026-04-10 09:30',
      reviewerNotes: 'Verified by PHED Junior Engineer. Repair crew dispatched and 50 civic green credits awarded.',
      awardedCredits: 50,
      auditTrail: [
        {
          timestamp: '2026-04-10 09:30',
          action: 'submitted',
          actor: 'Citizen (Sushree_7482)',
          notes: 'Report logged with water sample photograph. Entered manual review queue.',
        },
        {
          timestamp: '2026-04-10 14:15',
          action: 'verified_and_rewarded',
          actor: 'Reviewer: District PHED Official (usr-gov-01)',
          notes: 'Physical sensor test confirmed. 50 civic green credits awarded according to municipal rules.',
        },
      ],
    },
    {
      id: 'rep-02',
      category: 'damaged_road',
      title: 'Severe Monsoon Road Shoulder Washout on Semiliguda Ghat',
      description: 'Heavy rain caused 2.5m asphalt scouring along the outer hillside curve. Potholes force vehicles into blind oncoming lanes.',
      evidenceUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      coarseLocation: 'Semiliguda - Damanjodi Ghat Corridor, Km 14',
      preciseLocationPrivate: 'Between Culvert #18 and Milestones 14/2 (GPS: 18.795, 82.883)',
      publicConsent: true,
      status: 'pending_verification',
      submittedAt: '2026-04-19 11:45',
      awardedCredits: 0,
      auditTrail: [
        {
          timestamp: '2026-04-19 11:45',
          action: 'submitted',
          actor: 'Citizen (Sushree_7482)',
          notes: 'Report logged with damage photographs. Zero credits awarded at upload; queued for manual engineering evaluation.',
        },
      ],
    },
  ]);

  // Community Initiatives
  const [initiatives, setInitiatives] = useState<CommunityInitiativeItem[]>([
    {
      id: 'init-01',
      title: 'Kolab Watershed Perennial Spring Rejuvenation Drive',
      category: 'Watershed & Ecology',
      description: 'Community desilting of natural mountain spring aquifers, boulder contour bunding, and vetiver grass planting along highland catchment slopes.',
      organizer: 'Koraput District Watershed Mission & Tribal Youth SHG Federation',
      locationArea: 'Kolab Reservoir Catchment Zone, Semiliguda',
      targetParticipants: 60,
      currentVolunteers: 38,
      date: 'April 25, 2026 • 08:00 AM',
      creditsReward: 100,
      status: 'Open',
      isJoined: false,
    },
    {
      id: 'init-02',
      title: 'Highland Agro-Forestry Shade Tree Planting Drive',
      category: 'Agro-Forestry',
      description: 'Planting 2,000 indigenous Silver Oak and fruit shade-tree saplings across smallholder coffee blocks to prevent soil erosion and improve micro-climate.',
      organizer: 'Coffee Board Extension Centre & Mission Shakti WSHGs',
      locationArea: 'Laxmipur Hill Tracts, Koraput',
      targetParticipants: 80,
      currentVolunteers: 54,
      date: 'May 02, 2026 • 07:30 AM',
      creditsReward: 75,
      status: 'Open',
      isJoined: false,
    },
    {
      id: 'init-03',
      title: 'Tribal Sub-Centre Solar Telemetry Battery Maintenance',
      category: 'Public Health',
      description: 'Volunteer logistics check of solar panel rooftop cleanliness and inverter batteries at 6 highland health sub-centres.',
      organizer: 'Saheed Laxman Nayak Medical College Volunteer Wing',
      locationArea: 'Bandhugaon & Narayanpatna Hamlets',
      targetParticipants: 30,
      currentVolunteers: 26,
      date: 'May 10, 2026 • 09:00 AM',
      creditsReward: 120,
      status: 'Open',
      isJoined: false,
    },
  ]);

  // Credit Ledger
  const [creditLedger, setCreditLedger] = useState<CreditLedgerItem[]>([
    {
      id: 'crd-01',
      date: '2026-04-10',
      description: 'Verified Water Quality & Pipeline Seepage Report',
      delta: 50,
      outcome: 'approved',
      refId: 'rep-01',
    },
  ]);

  // Form State for Report-a-Problem
  const [formCategory, setFormCategory] = useState<'damaged_road' | 'water_leakage' | 'waste_management' | 'healthcare_gap' | 'streetlight'>('damaged_road');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCoarseLocation, setFormCoarseLocation] = useState('');
  const [formPrecisePrivate, setFormPrecisePrivate] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [formConsent, setFormConsent] = useState(true);
  const [formSuccessMessage, setFormSuccessMessage] = useState(false);

  // Reviewer Audit State for selected report
  const [selectedReportForReview, setSelectedReportForReview] = useState<ReportItem | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'request_clarification'>('approve');
  const [reviewerAuditNotes, setReviewerAuditNotes] = useState('');

  // Handle Problem Submission
  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formCoarseLocation) return;

    const newReport: ReportItem = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      category: formCategory,
      title: formTitle,
      description: formDescription,
      evidenceUrl: formPhotoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      coarseLocation: formCoarseLocation,
      preciseLocationPrivate: formPrecisePrivate || 'GPS: 18.814, 82.715 (Private Location Stored)',
      publicConsent: formConsent,
      status: 'pending_verification',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      awardedCredits: 0,
      auditTrail: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          action: 'submitted',
          actor: `Citizen (${citizenProfile.handle})`,
          notes: 'Problem report recorded with photographic evidence. Queued for municipal review. Zero credits awarded at upload.',
        },
      ],
    };

    setReports([newReport, ...reports]);
    setCitizenProfile({
      ...citizenProfile,
      pendingCount: citizenProfile.pendingCount + 1,
    });

    setFormTitle('');
    setFormDescription('');
    setFormCoarseLocation('');
    setFormPrecisePrivate('');
    setFormSuccessMessage(true);

    setTimeout(() => {
      setFormSuccessMessage(false);
      setActiveTab('my_reports');
    }, 1500);
  };

  // Handle Reviewer Action (Steps 4-6)
  const handleReviewerDecision = () => {
    if (!selectedReportForReview) return;

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let newStatus: ReportItem['status'] = 'under_review';
    let creditsDelta = 0;
    let auditAction = 'reviewed';

    if (reviewAction === 'approve') {
      newStatus = 'verified';
      creditsDelta = 50;
      auditAction = 'verified_and_rewarded';
    } else if (reviewAction === 'reject') {
      newStatus = 'rejected';
      creditsDelta = 0;
      auditAction = 'rejected';
    } else if (reviewAction === 'request_clarification') {
      newStatus = 'clarification_requested';
      creditsDelta = 0;
      auditAction = 'clarification_requested';
    }

    const updated = reports.map((r) => {
      if (r.id === selectedReportForReview.id) {
        return {
          ...r,
          status: newStatus,
          reviewerNotes: reviewerAuditNotes || `Decision: ${reviewAction} by Authorized Municipal Inspector.`,
          awardedCredits: creditsDelta,
          auditTrail: [
            {
              timestamp: nowStr,
              action: auditAction,
              actor: 'Authorized Reviewer (PWD / Municipal Engineer)',
              notes: reviewerAuditNotes || `Report evaluated as ${reviewAction}.`,
            },
            ...r.auditTrail,
          ],
        };
      }
      return r;
    });

    setReports(updated);

    // If approved, award credits according to rules
    if (reviewAction === 'approve') {
      setCitizenProfile({
        ...citizenProfile,
        totalCredits: citizenProfile.totalCredits + 50,
        verifiedCount: citizenProfile.verifiedCount + 1,
        pendingCount: Math.max(0, citizenProfile.pendingCount - 1),
      });

      setCreditLedger([
        {
          id: `crd-${Date.now().toString().slice(-4)}`,
          date: nowStr.slice(0, 10),
          description: `Verified Report: ${selectedReportForReview.title.slice(0, 36)}...`,
          delta: 50,
          outcome: 'approved',
          refId: selectedReportForReview.id,
        },
        ...creditLedger,
      ]);
    } else if (reviewAction === 'reject') {
      setCitizenProfile({
        ...citizenProfile,
        pendingCount: Math.max(0, citizenProfile.pendingCount - 1),
      });
    }

    setSelectedReportForReview(null);
    setReviewerAuditNotes('');
  };

  // Join Community Initiative
  const handleJoinInitiative = (id: string) => {
    setInitiatives(
      initiatives.map((init) => {
        if (init.id === id && !init.isJoined) {
          return {
            ...init,
            currentVolunteers: init.currentVolunteers + 1,
            isJoined: true,
          };
        }
        return init;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Citizen Profile Header Card */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shadow-md">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold text-lg shadow-inner">
                SM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {citizenProfile.name}
                  </h2>
                  <Badge variant="teal" size="sm">
                    Verified Contributor
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">@{citizenProfile.handle}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-teal-400">
                    <Award className="w-3.5 h-3.5" />
                    {citizenProfile.tier}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {cityProfile.name}, Odisha
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Credits & Counters */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="px-3 border-r border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                  Civic Credits
                </span>
                <span className="text-xl font-bold font-mono text-teal-400">
                  {citizenProfile.totalCredits} <span className="text-xs font-normal text-slate-400">pts</span>
                </span>
              </div>
              <div className="px-3 border-r border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                  Verified
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  {citizenProfile.verifiedCount}
                </span>
              </div>
              <div className="px-3 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">
                  In Review
                </span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  {citizenProfile.pendingCount}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Badges Sub-Bar */}
          <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-teal-200">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px]">
                <strong>Privacy Shield Active:</strong> Precise GPS / home address is strictly private. Only coarse ward-level location is visible publicly.
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {citizenProfile.badges.map((b) => (
                <span
                  key={b}
                  className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-slate-200 font-mono"
                >
                  🏅 {b}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs & Demo Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'feed'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            City Activity Feed
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'report'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Report a Problem
          </button>
          <button
            onClick={() => setActiveTab('my_reports')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'my_reports'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            My Reports & Evidence
            {citizenProfile.pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {citizenProfile.pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('initiatives')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'initiatives'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Community Initiatives ({initiatives.length})
          </button>
          <button
            onClick={() => setActiveTab('credits_leaderboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'credits_leaderboard'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Credit History & Leaderboard
          </button>
        </div>

        {/* Reviewer Audit Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded-lg text-xs self-start sm:self-auto">
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] font-medium text-slate-700">Official Reviewer Mode:</span>
          <button
            onClick={() => setIsReviewerMode(!isReviewerMode)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
              isReviewerMode ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {isReviewerMode ? 'ACTIVE (Steps 4-6)' : 'OFF (Citizen View)'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: City-Specific Civic Activity Feed */}
      {/* ========================================================================= */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              Recent Civic Activity in {cityProfile.name}
            </h3>
            <span className="text-xs text-slate-500">
              Showing public reports with verified status and coarse locality
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <Card key={rep.id} className="hover:border-teal-500/40 transition">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] uppercase font-bold">
                        {rep.category.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {rep.status === 'verified' && (
                        <Badge variant="success" size="sm">
                          ✓ Verified & Repaired (+50 pts)
                        </Badge>
                      )}
                      {rep.status === 'pending_verification' && (
                        <Badge variant="warning" size="sm">
                          ⏳ Pending Manual Verification
                        </Badge>
                      )}
                      {rep.status === 'clarification_requested' && (
                        <Badge variant="outline" size="sm">
                          ❓ Clarification Requested
                        </Badge>
                      )}
                      {rep.status === 'rejected' && (
                        <Badge variant="critical" size="sm">
                          ✕ Rejected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>

                  {/* Evidence Thumbnail & Location */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={rep.evidenceUrl}
                        alt="Submitted Evidence"
                        className="w-16 h-12 object-cover rounded-md border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>{rep.coarseLocation}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Submitted on {rep.submittedAt} by @{citizenProfile.handle}
                        </span>
                      </div>
                    </div>

                    {rep.reviewerNotes && (
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 max-w-sm">
                        <strong className="text-slate-800">Reviewer Note:</strong> {rep.reviewerNotes}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Report-a-Problem Form (Steps 1-3) */}
      {/* ========================================================================= */}
      {activeTab === 'report' && (
        <Card className="border-teal-200 shadow-sm max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-600" />
              Report a Civic Problem (Step 1-3)
            </CardTitle>
            <CardDescription className="text-xs">
              Log potholes, broken water connections, or healthcare gaps. Reports enter a pending-verification state; credits are awarded strictly upon municipal review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formSuccessMessage ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">Report Successfully Logged!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Your report has entered the <strong>pending-verification</strong> queue. An authorized inspector will evaluate the evidence.
                </p>
                <span className="text-[11px] text-slate-500 block">
                  Rule Enforcement: Credits are awarded only according to configured municipal verification rules.
                </span>
              </div>
            ) : (
              <form onSubmit={handleProblemSubmit} className="space-y-4 text-xs">
                {/* Category Selection */}
                <div>
                  <label className="font-semibold text-slate-800 block mb-1.5">
                    Problem Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'damaged_road', label: 'Damaged Road / Pothole' },
                      { key: 'water_leakage', label: 'Drinking Water Leak' },
                      { key: 'waste_management', label: 'Garbage Dump' },
                      { key: 'healthcare_gap', label: 'Health Sub-Centre Gap' },
                      { key: 'streetlight', label: 'Broken Streetlight' },
                    ].map((c) => (
                      <button
                        type="button"
                        key={c.key}
                        onClick={() => setFormCategory(c.key as any)}
                        className={`p-2.5 rounded-lg border text-left font-medium transition ${
                          formCategory === c.key
                            ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dangerous 3-meter shoulder scouring on Semiliguda Ghat Road"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the severity, safety hazard, and impact on emergency vehicles or commuters..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-xs"
                  />
                </div>

                {/* Coarse Location (Public) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">
                      Coarse Location (Publicly Visible)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ward 14, Semiliguda Ghat Road"
                      value={formCoarseLocation}
                      onChange={(e) => setFormCoarseLocation(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-xs"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Visible in community activity feed
                    </span>
                  </div>

                  {/* Precise Location (Private) */}
                  <div>
                    <label className="font-semibold text-slate-800 flex items-center justify-between mb-1">
                      <span>Precise Location (Strictly Private)</span>
                      <Lock className="w-3 h-3 text-teal-600" />
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Between Culvert #18 and Milestones 14/2 (GPS coords)"
                      value={formPrecisePrivate}
                      onChange={(e) => setFormPrecisePrivate(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-xs bg-slate-50"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Hidden from public feed; shared only with municipal inspectors
                    </span>
                  </div>
                </div>

                {/* Supporting Photograph Evidence URL */}
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">
                    Supporting Photograph / Evidence URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-road-damage.jpg"
                      value={formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-teal-500 text-xs font-mono"
                    />
                  </div>
                  {formPhotoUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formPhotoUrl}
                        alt="Preview"
                        className="w-20 h-14 object-cover rounded border border-slate-200"
                      />
                      <span className="text-[11px] text-slate-500">
                        Evidence image loaded. (Rule reminder: Credits are not awarded for uploading an image alone; verification is required.)
                      </span>
                    </div>
                  )}
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={formConsent}
                    onChange={(e) => setFormConsent(e.target.checked)}
                    className="mt-0.5 accent-teal-600"
                  />
                  <label htmlFor="consentCheck" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                    <strong>Privacy & Public Feed Consent:</strong> I consent to displaying this problem report and coarse location on the public city feed to alert fellow citizens. My precise coordinates and personal phone/email remain strictly confidential.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <Button variant="teal" size="md" type="submit">
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit Report for Manual Verification
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: My Reports & Evidence Status Tracker */}
      {/* ========================================================================= */}
      {activeTab === 'my_reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              My Submitted Reports & Evidence Status
            </h3>
            <span className="text-xs text-slate-500">
              Track verification progress, reviewer notes, and audit logs
            </span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => (
              <Card key={rep.id} className="border-slate-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">ID: #{rep.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {rep.status === 'verified' && (
                        <Badge variant="success" size="sm">
                          ✓ Verified & Credited (+{rep.awardedCredits} pts)
                        </Badge>
                      )}
                      {rep.status === 'pending_verification' && (
                        <Badge variant="warning" size="sm">
                          ⏳ Pending Manual Verification (0 pts)
                        </Badge>
                      )}
                      {rep.status === 'clarification_requested' && (
                        <Badge variant="outline" size="sm">
                          ❓ Clarification Requested
                        </Badge>
                      )}
                      {rep.status === 'rejected' && (
                        <Badge variant="critical" size="sm">
                          ✕ Rejected (0 pts)
                        </Badge>
                      )}

                      {/* Official Reviewer Action Button (Steps 4-6 demonstration) */}
                      {isReviewerMode && rep.status !== 'verified' && (
                        <button
                          onClick={() => setSelectedReportForReview(rep)}
                          className="px-2.5 py-1 rounded bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition"
                        >
                          Audit Report
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{rep.description}</p>

                  {/* Private vs Coarse Location Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Coarse Public Location</span>
                      <span className="font-medium text-slate-800">{rep.coarseLocation}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-teal-700 uppercase font-semibold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Precise Private Location (Owner / Reviewer Only)
                      </span>
                      <span className="font-mono text-slate-700">{rep.preciseLocationPrivate}</span>
                    </div>
                  </div>

                  {/* Evidence Photo */}
                  <div className="flex items-center gap-3">
                    <img
                      src={rep.evidenceUrl}
                      alt="Submitted Evidence"
                      className="w-20 h-14 object-cover rounded-md border border-slate-200"
                    />
                    <div className="text-[11px] text-slate-500">
                      <strong>Submitted Evidence Photo:</strong> Timestamped at {rep.submittedAt}.
                    </div>
                  </div>

                  {/* Audit Log Trail */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold font-mono tracking-wider block">
                      Audit Trail & State Transitions:
                    </span>
                    {rep.auditTrail.map((log, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2 text-[11px] text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-mono text-slate-500 font-bold">[{log.timestamp}]</span>{' '}
                          <span className="text-slate-800 font-semibold">{log.action}:</span>{' '}
                          <span>{log.notes}</span> <span className="text-slate-400">({log.actor})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewer Audit Modal (Steps 4-6) */}
      {selectedReportForReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                Reviewer Evaluation Console: #{selectedReportForReview.id}
              </h3>
              <button
                onClick={() => setSelectedReportForReview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-700">
              <div>
                <strong>Title:</strong> {selectedReportForReview.title}
              </div>
              <div>
                <strong>Description:</strong> {selectedReportForReview.description}
              </div>
              <div>
                <strong>Precise Coordinates:</strong> {selectedReportForReview.preciseLocationPrivate}
              </div>
              <img
                src={selectedReportForReview.evidenceUrl}
                alt="Evidence"
                className="w-full h-32 object-cover rounded-md border"
              />
            </div>

            {/* Decision Radio */}
            <div>
              <label className="font-bold text-xs text-slate-800 block mb-1">
                Evaluation Action:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setReviewAction('approve')}
                  className={`p-2 rounded border font-bold text-center ${
                    reviewAction === 'approve'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  ✓ Approve & Award (+50 pts)
                </button>
                <button
                  type="button"
                  onClick={() => setReviewAction('request_clarification')}
                  className={`p-2 rounded border font-bold text-center ${
                    reviewAction === 'request_clarification'
                      ? 'border-amber-600 bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  ❓ Clarify (0 pts)
                </button>
                <button
                  type="button"
                  onClick={() => setReviewAction('reject')}
                  className={`p-2 rounded border font-bold text-center ${
                    reviewAction === 'reject'
                      ? 'border-red-600 bg-red-50 text-red-800'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  ✕ Reject (0 pts)
                </button>
              </div>
            </div>

            {/* Reviewer Audit Notes */}
            <div>
              <label className="font-bold text-xs text-slate-800 block mb-1">
                Reviewer Audit Note (Recorded in Immutable Trail)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Physical site inspection completed. PWD repair sanctioned under maintenance emergency budget."
                value={reviewerAuditNotes}
                onChange={(e) => setReviewerAuditNotes(e.target.value)}
                className="w-full p-2 border rounded text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedReportForReview(null)}>
                Cancel
              </Button>
              <Button variant="teal" size="sm" onClick={handleReviewerDecision}>
                Save & Record Audit Decision
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Community Initiatives */}
      {/* ========================================================================= */}
      {activeTab === 'initiatives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Community Civic Initiatives in {cityProfile.name}
            </h3>
            <span className="text-xs text-slate-500">
              Join grassroots drives to earn verified community civic credits
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initiatives.map((init) => (
              <Card key={init.id} className="border-slate-200 hover:border-teal-400 transition flex flex-col justify-between">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-mono text-[10px] font-bold">
                      {init.category}
                    </span>
                    <Badge variant="teal" size="sm">
                      +{init.creditsReward} credits
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{init.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{init.description}</p>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{init.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{init.locationArea}</span>
                    </div>
                  </div>

                  {/* Volunteer Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Volunteers: {init.currentVolunteers}/{init.targetParticipants}</span>
                      <span>{Math.round((init.currentVolunteers / init.targetParticipants) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, (init.currentVolunteers / init.targetParticipants) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant={init.isJoined ? 'outline' : 'teal'}
                      size="sm"
                      className="w-full"
                      disabled={init.isJoined}
                      onClick={() => handleJoinInitiative(init.id)}
                    >
                      {init.isJoined ? '✓ Registered Volunteer' : 'Join as Volunteer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Credit History & Leaderboard */}
      {/* ========================================================================= */}
      {activeTab === 'credits_leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Credit Ledger */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                Verified Civic Credit History
              </CardTitle>
              <CardDescription className="text-xs">
                Audited ledger of credits awarded upon authorized review
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {creditLedger.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-900 block">{c.description}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: #{c.refId} • {c.date}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    +{c.delta} pts
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Privacy-Preserving City Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {cityProfile.name} Civic Leaderboard
                </CardTitle>
                <span className="text-[10px] text-slate-400 font-mono">Masked Handles</span>
              </div>
              <CardDescription className="text-xs">
                Ranked by verified community contributions and approved audits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {[
                  { rank: 1, handle: 'Priya_7482', pts: 250, count: 4, badge: 'Diamond Civic Sentinel' },
                  { rank: 2, handle: 'Rahul_1934', pts: 175, count: 3, badge: 'Gold Watershed Guardian' },
                  { rank: 3, handle: 'Sunita_9012', pts: 125, count: 2, badge: 'Silver Community Steward' },
                  { rank: 4, handle: citizenProfile.handle, pts: citizenProfile.totalCredits, count: citizenProfile.verifiedCount, badge: citizenProfile.tier, isMe: true },
                ].map((l) => (
                  <div
                    key={l.handle}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      (l as any).isMe
                        ? 'border-teal-500 bg-teal-50/60 font-semibold'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400 w-4">#{l.rank}</span>
                      <div>
                        <span className="text-slate-900 block font-medium">
                          {l.handle} {(l as any).isMe && <span className="text-teal-700 text-[10px] font-bold">(You)</span>}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{l.badge}</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-bold text-teal-800 text-sm">{l.pts} pts</span>
                      <span className="text-[10px] text-slate-400 block">{l.count} verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
