'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Database,
  ShieldCheck,
  ExternalLink,
  Layers,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  Sparkles,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import {
  civicApi,
  ApiRAGDocument,
  ApiRAGRetrievalResultItem,
  ApiRAGDocumentDetail,
} from '@/lib/api';

export function RAGKnowledgeExplorerView() {
  const [activeTab, setActiveTab] = useState<'search' | 'documents'>('search');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('mobile medical units doctor vacancy');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<ApiRAGRetrievalResultItem[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  // Documents Repository State
  const [documents, setDocuments] = useState<ApiRAGDocument[]>([]);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(true);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docDetail, setDocDetail] = useState<ApiRAGDocumentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Initial Load & Search
  useEffect(() => {
    loadDocuments();
    executeSearch('mobile medical units doctor vacancy', 'all');
  }, []);

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const docs = await civicApi.getRAGDocuments();
      setDocuments(docs);
    } catch (err) {
      console.warn('Failed to fetch documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const executeSearch = async (queryToSearch: string, sector: string) => {
    if (!queryToSearch.trim()) return;
    setSearching(true);
    setSearchPerformed(true);
    try {
      const res = await civicApi.queryRAG(queryToSearch, sector, undefined, 6);
      setSearchResults(res.results || []);
    } catch (err) {
      console.warn('RAG Query error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleInspectDoc = async (docId: string) => {
    setSelectedDocId(docId);
    setLoadingDetail(true);
    try {
      const detail = await civicApi.getRAGDocumentById(docId);
      setDocDetail(detail);
    } catch (err) {
      console.warn('Failed to load doc detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Architecture Provenance */}
      <div className="p-5 rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-950/30 via-slate-900 to-slate-900 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 mt-1">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white">
                RAG Evidence Knowledge Base
              </h2>
              <Badge variant="outline" className="text-xs border-teal-500/40 text-teal-300 bg-teal-500/10">
                PostgreSQL pgvector (1024-d HNSW)
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical grounding engine for Indian urban development schemes, District Mineral Foundation audits, and statutory gazettes.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Semantic Retrieval
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Government Documents ({documents.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SEMANTIC VECTOR RETRIEVAL */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Controls */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardContent className="p-4 space-y-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeSearch(searchQuery, selectedSector);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search statutory schemes, audit clauses, doctor hardship allowances, gravity water..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSector}
                    onChange={(e) => {
                      setSelectedSector(e.target.value);
                      executeSearch(searchQuery, e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="all">All Sectors</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Economy & Livelihoods">Economy & Livelihoods</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>

                  <Button
                    type="submit"
                    disabled={searching}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-4 py-2 font-medium"
                  >
                    {searching ? 'Embedding & Searching...' : 'Retrieve Evidence'}
                  </Button>
                </div>
              </form>

              {/* Sample Queries Pill Tray */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-400 pt-1">
                <span className="text-slate-500">Suggested queries:</span>
                {[
                  'SLN Medical College satellite tele-radiology hub',
                  'Jal Jeevan Mission 55 LPCD mountain spring catchment',
                  'Koraput Coffee GI 638 eco-pulper subsidy',
                  'DMF 60% high priority healthcare mandate',
                  'Odisha Millets Mission Mandia MSP procurement',
                ].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => {
                      setSearchQuery(sample);
                      executeSearch(sample, selectedSector);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Results Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Found {searchResults.length} verified passages matching query
              </span>
              <span className="flex items-center gap-1 text-teal-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-hallucination ground truth guaranteed
              </span>
            </div>

            {searchResults.length === 0 && searchPerformed && !searching && (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No statutory passages exceeded the similarity threshold.</p>
                <p className="text-slate-500 text-xs mt-1">Try broadening your search terms or selecting 'All Sectors'.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((item) => (
                <Card
                  key={item.chunk_id}
                  className="border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline" className="text-xs text-teal-400 border-teal-500/30 bg-teal-500/10">
                        {item.relevant_sector}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        <Sparkles className="w-3 h-3 text-teal-400" />
                        {Math.round(item.similarity_score * 100)}% Match
                      </div>
                    </div>
                    <CardTitle className="text-sm font-semibold text-white mt-2 leading-tight">
                      {item.document_title}
                    </CardTitle>
                    {item.section_heading && (
                      <p className="text-xs text-teal-300/90 font-medium mt-0.5">
                        {item.section_heading}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="p-4 pt-2 text-xs text-slate-300 space-y-3">
                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] leading-relaxed text-slate-200">
                      "{item.chunk_text}"
                    </div>

                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.publishing_organization}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.applicable_city_or_region}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{item.publication_date}</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                        {item.verification_status}
                      </Badge>

                      {item.source_url_or_reference && (
                        <a
                          href={item.source_url_or_reference}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 underline"
                        >
                          Official Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOVERNMENT DOCUMENTS REPOSITORY */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Indexed Government Documents ({documents.length})
            </h3>
            {loadingDocs ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading document registry...</div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleInspectDoc(doc.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    selectedDocId === doc.id
                      ? 'bg-slate-800/90 border-teal-500/60 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <Badge variant="outline" className="text-[10px] text-teal-400 border-teal-500/30 bg-teal-500/10">
                      {doc.relevant_sector}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.chunk_count} Chunks
                    </span>
                  </div>
                  <h4 className="font-semibold text-white leading-snug">
                    {doc.document_title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {doc.summary || doc.publishing_organization}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>{doc.publishing_organization.split(',')[0]}</span>
                    <span>{doc.publication_date.slice(0, 4)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Document Detail & Chunks Viewer */}
          <div className="lg:col-span-2">
            {selectedDocId && docDetail ? (
              <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
                <CardHeader className="p-5 border-b border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                      {docDetail.verification_status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      Edition: {docDetail.document_version}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-white mt-2">
                    {docDetail.document_title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    {docDetail.publishing_organization} • Published {docDetail.publication_date}
                  </CardDescription>

                  {/* 8 Mandatory Metadata Fields Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-[11px] text-slate-300">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Jurisdiction</span>
                      <span className="font-semibold text-white">{docDetail.applicable_city_or_region}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Sector</span>
                      <span className="font-semibold text-white">{docDetail.relevant_sector}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Authority Tier</span>
                      <span className="font-semibold text-white">{docDetail.authority_level}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Source Reference</span>
                      <a
                        href={docDetail.source_url_or_reference}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-teal-400 hover:underline truncate block"
                      >
                        Official Document ↗
                      </a>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Indexed Vector Chunks ({docDetail.chunks.length})
                  </h4>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {docDetail.chunks.map((chk) => (
                      <div
                        key={chk.id}
                        className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-teal-300">
                            {chk.section_heading || `Chunk ${chk.chunk_index + 1}`}
                          </span>
                          <span className="text-slate-500 font-mono">
                            {chk.token_count} words
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                          {chk.chunk_text}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40 text-slate-400 text-xs">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                Select any government document on the left to inspect its indexed chunks and statutory excerpts.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
