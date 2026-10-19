'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  FileCheck,
  Calendar,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useCity } from '@/context/CityContext';

export default function ReportsPage() {
  const { selectedCity, cityProfile, benchmarkProfile, kpis, gaps } = useCity();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (reportName: string) => {
    setDownloadSuccess(reportName);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  const dossiers = [
    {
      id: 'dossier-01',
      title: `${cityProfile.name} Comprehensive Civic Diagnostic Dossier`,
      date: 'October 2026 Edition',
      pages: '28 Pages',
      format: 'PDF (A4 Print Ready)',
      description: `Complete sectoral audit across healthcare access, secondary education retention, agro-industrial processing, and piped water infrastructure in ${cityProfile.name}.`,
      badge: 'Official Dossier',
    },
    {
      id: 'dossier-02',
      title: `Koraput vs Bhubaneswar Benchmarking Memo`,
      date: 'Q1 2026 Analytical Series',
      pages: '14 Pages',
      format: 'Executive PDF + Data Appendix',
      description:
        'Standardized 10-indicator comparative matrix detailing structural deficits, capital multipliers, and 2032 convergence runway projections.',
      badge: 'Benchmarking Special',
    },
    {
      id: 'dossier-03',
      title: 'District Mineral Foundation (DMF) Capital Allocation Audit',
      date: 'FY 2025-26 Report',
      pages: '18 Pages',
      format: 'Financial Briefing PDF',
      description:
        'Audited expenditure tracking and recommended prioritization of ₹32 Cr rural telemedicine grid and solar gravity water schemes.',
      badge: 'Capital Strategy',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Civic Intelligence Reports & Dossiers
            </h1>
            <Badge variant="teal" size="sm">
              Executive Briefings
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export verified planning memoranda, cross-city benchmarking dossiers, and raw indicator tables for municipal review and cabinet briefings.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => window.print()}
          className="text-xs"
        >
          <Printer className="w-3.5 h-3.5 mr-1" />
          Print / Save PDF
        </Button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{downloadSuccess}</strong> prepared successfully. Initiating secure PDF download.
            </span>
          </div>
          <Badge variant="success" size="sm">
            Completed
          </Badge>
        </div>
      )}

      {/* Dossier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dossiers.map((doc) => (
          <Card key={doc.id} className="flex flex-col justify-between hover:border-slate-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant="navy" size="sm">
                  {doc.badge}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">{doc.pages}</span>
              </div>
              <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                {doc.title}
              </CardTitle>
              <CardDescription>{doc.date}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 text-xs">
              <p className="text-slate-600 leading-relaxed">{doc.description}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{doc.format}</span>
                <Button
                  variant="teal"
                  size="sm"
                  onClick={() => handleDownload(doc.title)}
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Briefing Memo Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              <CardTitle className="text-base">
                Executive Briefing Memo Preview: {cityProfile.name}
              </CardTitle>
            </div>
            <span className="text-xs text-slate-400">Classified: Official Planning Use</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] border-b border-slate-200 pb-2">
              <div>
                <strong className="text-slate-900 block">SUBJECT:</strong>
                <span>Urban Benchmarking Strategy</span>
              </div>
              <div>
                <strong className="text-slate-900 block">PRIMARY ZONE:</strong>
                <span>{cityProfile.name}, Odisha</span>
              </div>
              <div>
                <strong className="text-slate-900 block">BENCHMARK:</strong>
                <span>{benchmarkProfile.name}</span>
              </div>
              <div>
                <strong className="text-slate-900 block">CONFIDENCE:</strong>
                <span className="text-teal-700 font-semibold">Verified Model</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                1. Executive Summary & Diagnostic Assessment
              </h4>
              <p>
                The composite Civic Intelligence Score for <strong>{cityProfile.name}</strong> currently stands at{' '}
                <strong>{selectedCity === 'koraput' ? '58.4 / 100' : '84.7 / 100'}</strong>.
                {selectedCity === 'koraput' ? (
                  <>
                    {' '}While basic all-weather road connectivity under PMGSY has expanded to 74.6% of habitations,
                    critical bottlenecks persist in <em>Secondary Healthcare Access (52.1 pts)</em>, particularly emergency transit across Bandhugaon and Narayanpatna blocks.
                    Furthermore, over 85% of GI-tagged Koraput Arabica Coffee and spices are exported without primary processing, causing substantial value-loss.
                  </>
                ) : (
                  <>
                    {' '}Bhubaneswar exhibits superior tertiary health facilities, bus rapid transit mode shares, and university clusters.
                    However, rapid peri-urban concretization requires urgent interventions in <em>Lowland Stormwater Retention along Gangua Nallah (Ward 54)</em> and peak corridor congestion.
                  </>
                )}
              </p>
            </div>

            <div className="pt-2 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                2. Immediate Policy & Budgetary Directives
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {gaps.slice(0, 3).map((g) => (
                  <li key={g.id}>
                    <strong>{g.title}:</strong> Allocate ₹{g.estimatedInvestmentCr} Cr capex via {g.recommendedIntervention.slice(0, 80)}...
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
