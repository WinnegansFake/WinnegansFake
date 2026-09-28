'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  Filter,
  BookOpen,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export interface PageCoverage {
  page: number;
  book?: number | string;
  chapter?: number | string;
  count: number;
  density: 'rich' | 'standard' | 'sparse' | 'empty';
  annotatedLines?: number[];
  registers?: string[];
  scholars?: string[];
}

export interface WorkCoverageStats {
  totalPages: number;
  annotatedPages: number;
  totalAnnotations: number;
  richPages: number;
  standardPages: number;
  sparsePages: number;
  emptyPages: number;
  coveragePercentage: number;
}

export interface CoverageMatrixData {
  generatedAt: string;
  stats: Record<string, WorkCoverageStats>;
  pages: Record<string, PageCoverage[]>;
}

export function CoverageHeatmap() {
  const [data, setData] = useState<CoverageMatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<'finneganswake' | 'ulysses' | 'neuromancer'>('finneganswake');
  const [densityFilter, setDensityFilter] = useState<'all' | 'rich' | 'standard' | 'sparse' | 'empty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<PageCoverage | null>(null);
  const [hoveredPage, setHoveredPage] = useState<PageCoverage | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/coverage_matrix.json');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json: CoverageMatrixData = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Failed to load coverage matrix');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (!data?.stats[selectedWork]) return null;
    return data.stats[selectedWork];
  }, [data, selectedWork]);

  // Construct complete grid for all pages from 1 to totalPages
  const fullPageGrid = useMemo(() => {
    if (!data || !stats) return [];
    const annotatedMap = new Map<number, PageCoverage>();
    const pageList = data.pages[selectedWork] || [];
    for (const p of pageList) {
      annotatedMap.set(p.page, p);
    }

    const grid: PageCoverage[] = [];
    for (let p = 1; p <= stats.totalPages; p++) {
      if (annotatedMap.has(p)) {
        grid.push(annotatedMap.get(p)!);
      } else {
        grid.push({
          page: p,
          count: 0,
          density: 'empty',
          annotatedLines: [],
          registers: [],
          scholars: [],
        });
      }
    }
    return grid;
  }, [data, stats, selectedWork]);

  const filteredPages = useMemo(() => {
    return fullPageGrid.filter((p) => {
      if (densityFilter !== 'all' && p.density !== densityFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesPage = p.page.toString() === q;
        const matchesReg = p.registers?.some((r) => r.toLowerCase().includes(q));
        const matchesScholar = p.scholars?.some((s) => s.toLowerCase().includes(q));
        const matchesCh = p.chapter?.toString().toLowerCase().includes(q);
        if (!matchesPage && !matchesReg && !matchesScholar && !matchesCh) {
          return false;
        }
      }
      return true;
    });
  }, [fullPageGrid, densityFilter, searchQuery]);

  const getCellColor = (density: PageCoverage['density']) => {
    switch (density) {
      case 'rich':
        return 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400 text-white shadow-emerald-500/20';
      case 'standard':
        return 'bg-amber-500/90 hover:bg-amber-400 border-amber-400 text-white shadow-amber-500/20';
      case 'sparse':
        return 'bg-orange-500/80 hover:bg-orange-400 border-orange-400 text-white shadow-orange-500/20';
      case 'empty':
      default:
        return 'bg-slate-800/60 hover:bg-slate-700 border-slate-700/60 text-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-mono text-sm">Compiling Joycean annotation coverage matrix...</p>
      </div>
    );
  }

  if (error || !data || !stats) {
    return (
      <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-rose-300 text-center max-w-xl mx-auto my-12">
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-rose-400" />
        <h3 className="font-semibold text-lg">Unable to Load Coverage Data</h3>
        <p className="text-sm mt-1 text-rose-400/80">{error || 'Data format error'}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Digital Humanities Health Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Annotation Coverage Heatmap
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
            Live diagnostic visualization across every canonical page boundary in the Joyce corpus.
            Inspect gloss density, locate unannotated gaps, and contribute missing glosses.
          </p>
        </div>

        {/* Work Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            onClick={() => {
              setSelectedWork('finneganswake');
              setSelectedPage(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedWork === 'finneganswake'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Finnegans Wake (628 pp)
          </button>
          <button
            onClick={() => {
              setSelectedWork('ulysses');
              setSelectedPage(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedWork === 'ulysses'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ulysses (732 pp)
          </button>
          <button
            onClick={() => {
              setSelectedWork('neuromancer');
              setSelectedPage(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedWork === 'neuromancer'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neuromancer (290 pp)
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Pages</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{stats.totalPages}</div>
          <div className="text-xs text-slate-500 mt-1">
            {selectedWork === 'finneganswake' ? '1939 Viking / Faber' : selectedWork === 'ulysses' ? '1922 Shakespeare & Co.' : '1984 Ace Science Fiction'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Annotated</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
            {stats.annotatedPages}{' '}
            <span className="text-xs text-emerald-500 font-normal">({stats.coveragePercentage}%)</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Pages with active glosses</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Glosses</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1">{stats.totalAnnotations}</div>
          <div className="text-xs text-slate-500 mt-1">
            ~{(stats.totalAnnotations / (stats.annotatedPages || 1)).toFixed(1)} glosses / page
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Rich (5+)
          </span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{stats.richPages}</div>
          <div className="text-xs text-slate-500 mt-1">Deep scholarship</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Standard (2–4)
          </span>
          <div className="text-2xl font-mono font-bold text-white mt-1">{stats.standardPages}</div>
          <div className="text-xs text-slate-500 mt-1">Foundational lemmas</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-xs text-orange-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Sparse / Empty
          </span>
          <div className="text-2xl font-mono font-bold text-rose-400 mt-1">
            {stats.sparsePages + stats.emptyPages}
          </div>
          <div className="text-xs text-slate-500 mt-1">Needs enrichment</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['all', 'rich', 'standard', 'sparse', 'empty'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDensityFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                densityFilter === filter
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search page, register, scholar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Heatmap Grid & Inspector Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Grid View */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredPages.length} of {stats.totalPages} pages
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> 5+
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" /> 2–4
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-orange-500" /> 1
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" /> 0
              </span>
            </div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-10 sm:grid-cols-16 md:grid-cols-20 gap-1.5 sm:gap-2 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPages.map((p) => {
              const isSelected = selectedPage?.page === p.page;
              return (
                <button
                  key={p.page}
                  onClick={() => setSelectedPage(p)}
                  onMouseEnter={() => setHoveredPage(p)}
                  className={`relative aspect-square rounded-md border text-[10px] font-mono font-medium transition-all flex items-center justify-center ${getCellColor(
                    p.density
                  )} ${isSelected ? 'ring-2 ring-white scale-110 z-10' : ''}`}
                  title={`Page ${p.page}: ${p.count} annotations`}
                >
                  <span>{p.page}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Inspector Panel */}
        <div className="lg:col-span-1">
          {selectedPage ? (
            <div className="sticky top-24 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-500 uppercase tracking-wider font-semibold">
                    Page Dossier
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    Page {selectedPage.page}
                  </h3>
                  {selectedPage.chapter && (
                    <p className="text-xs text-slate-400 mt-0.5">Chapter: {selectedPage.chapter}</p>
                  )}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                    selectedPage.density === 'rich'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : selectedPage.density === 'standard'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : selectedPage.density === 'sparse'
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {selectedPage.density}
                </span>
              </div>

              <div className="space-y-3 border-t border-b border-slate-800 py-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Annotations:</span>
                  <span className="font-mono font-bold text-white">{selectedPage.count}</span>
                </div>
                {selectedPage.annotatedLines && selectedPage.annotatedLines.length > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Annotated Lines:</span>
                    <span className="font-mono text-amber-400">
                      {selectedPage.annotatedLines.slice(0, 8).join(', ')}
                      {selectedPage.annotatedLines.length > 8 ? '...' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Analytical Registers */}
              {selectedPage.registers && selectedPage.registers.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Primary Registers
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPage.registers.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Scholars Cited */}
              {selectedPage.scholars && selectedPage.scholars.length > 0 && (
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Scholars & Sources
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPage.scholars.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-800/30 text-amber-300 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Link
                  href={`/reader?work=${selectedWork}&page=${selectedPage.page}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-lg shadow-amber-600/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Page {selectedPage.page} in Reader</span>
                </Link>

                <Link
                  href={`/contribute`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors border border-slate-700"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Enrich Glosses for This Page</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 p-8 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-300 text-sm">Select Any Page Block</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Click on any coordinate cell in the heatmap grid to view detailed annotation line
                  indices, analytical registers, and cited scholars.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
