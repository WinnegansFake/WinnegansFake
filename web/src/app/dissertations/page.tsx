'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Layers,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Search,
  Library,
  Book,
  FileCode,
  Tag,
  Award,
} from 'lucide-react';
import {
  getAllDissertations,
  GITHUB_REPO_URL,
} from '@/lib/constants';

export default function DissertationsCatalogPage() {
  const allDissertations = useMemo(() => getAllDissertations(), []);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleChapters = (id: string) => {
    setExpandedChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDissertations = useMemo(() => {
    return allDissertations.filter((item) => {
      // Filter tab check
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'finnegans-wake' && !item.targetWorks.includes('finnegans-wake')) return false;
        if (selectedFilter === 'ulysses' && !item.targetWorks.includes('ulysses')) return false;
        if (selectedFilter === 'cybernetics' && !item.field.toLowerCase().includes('information') && !item.field.toLowerCase().includes('graph')) return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesAuthor = item.author.toLowerCase().includes(q);
        const matchesAbstract = item.abstract.toLowerCase().includes(q);
        const matchesField = item.field.toLowerCase().includes(q);
        const matchesKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
        const matchesChapters = item.chapters.some((c) => c.title.toLowerCase().includes(q) || (c.summary && c.summary.toLowerCase().includes(q)));
        return matchesTitle || matchesAuthor || matchesAbstract || matchesField || matchesKeywords || matchesChapters;
      }

      return true;
    });
  }, [allDissertations, selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="border-b border-slate-800 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Scholarly Monograph Repository</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Open Access / CC BY-SA 4.0</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                The Dissertations Library
              </h1>
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                A distinguished scholarly repository of academic dissertations, doctoral treatises, genetic criticism monographs,
                and computational hermeneutics. Distinct from our primary literature library, this collection provides peer-reviewed
                theoretical scaffolding, structural schemas, and deep philosophical analyses across encyclopedic modernist masterworks.
              </p>
            </div>

            {/* Works vs Dissertations Callout Box */}
            <div className="wf-card-surface border border-slate-800 p-5 rounded-2xl max-w-sm shrink-0 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-300">
                <Library className="w-4 h-4 text-emerald-400" />
                <span>Two Distinct Repositories</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-white">Works Library:</strong> Primary canonical literary texts (<span className="italic">Finnegans Wake</span>, <span className="italic">Ulysses</span>) with line coordinates (<code className="text-emerald-400">PPP.LL</code>).
                </p>
                <p>
                  <strong className="text-white">Dissertations Library:</strong> Secondary critical scholarship, doctoral monographs, and multi-chapter theoretical treatises.
                </p>
              </div>
              <div className="pt-1">
                <Link
                  href="/library"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Explore Primary Works Library</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Dissertations ({allDissertations.length})
            </button>
            <button
              onClick={() => setSelectedFilter('finnegans-wake')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                selectedFilter === 'finnegans-wake'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Finnegans Wake
            </button>
            <button
              onClick={() => setSelectedFilter('ulysses')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                selectedFilter === 'ulysses'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Ulysses
            </button>
            <button
              onClick={() => setSelectedFilter('cybernetics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                selectedFilter === 'cybernetics'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Cybernetics & Graphs
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatises, chapters, scholars..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Monographs Grid */}
        <div className="space-y-8">
          {filteredDissertations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
              <GraduationCap className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm font-serif">No dissertations match your filter criteria.</p>
              <button
                onClick={() => { setSelectedFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs font-mono text-emerald-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredDissertations.map((dissertation) => {
              const areChaptersOpen = !!expandedChapters[dissertation.id];
              const borderClass =
                dissertation.coverAccent === 'indigo'
                  ? 'border-indigo-500/30 hover:border-indigo-500/60'
                  : dissertation.coverAccent === 'purple'
                  ? 'border-purple-500/30 hover:border-purple-500/60'
                  : 'border-emerald-500/30 hover:border-emerald-500/60';

              const glowClass =
                dissertation.coverAccent === 'indigo'
                  ? 'from-indigo-950/30 to-slate-900/60'
                  : dissertation.coverAccent === 'purple'
                  ? 'from-purple-950/30 to-slate-900/60'
                  : 'from-emerald-950/30 to-slate-900/60';

              return (
                <div
                  key={dissertation.id}
                  className={`wf-card-surface border rounded-2xl p-6 sm:p-8 shadow-xl transition-all bg-gradient-to-br ${glowClass} ${borderClass}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="space-y-4 max-w-4xl">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{dissertation.degree}</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                          <span>{dissertation.field}</span>
                        </span>
                        {dissertation.targetWorks.map((workId) => (
                          <span
                            key={workId}
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase"
                          >
                            <Book className="w-3 h-3" />
                            <span>{workId.replace(/-/g, ' ')}</span>
                          </span>
                        ))}
                        {dissertation.year && (
                          <span className="text-xs font-mono text-slate-400 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                            {dissertation.year}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight leading-snug">
                          <Link
                            href={`/dissertations/${dissertation.slug}`}
                            className="hover:text-emerald-300 transition-colors"
                          >
                            {dissertation.title}
                          </Link>
                        </h2>
                        <p className="text-sm sm:text-base text-slate-300 font-serif italic mt-1.5 leading-relaxed">
                          {dissertation.subtitle}
                        </p>
                      </div>

                      {/* Author & Defense info */}
                      <div className="text-xs font-mono text-emerald-400 space-y-0.5">
                        <p className="font-semibold">{dissertation.author}</p>
                        <p className="text-slate-400">
                          {dissertation.institution}
                          {dissertation.defenseDate ? ` &bull; Defended ${dissertation.defenseDate}` : ''}
                        </p>
                      </div>

                      {/* Abstract */}
                      <p className="text-sm text-slate-300 leading-relaxed font-sans pt-1">
                        {dissertation.abstract}
                      </p>

                      {/* Keywords */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                        {dissertation.keywords.map((k) => (
                          <span
                            key={k}
                            className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {k}
                          </span>
                        ))}
                      </div>

                      {/* Metadata Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                        {dissertation.wordCount && (
                          <span>~{dissertation.wordCount.toLocaleString()} words</span>
                        )}
                        <span>&bull;</span>
                        <span>{dissertation.chapters.length} Chapters</span>
                        {dissertation.citationsCount && (
                          <>
                            <span>&bull;</span>
                            <span>{dissertation.citationsCount} Citations</span>
                          </>
                        )}
                        {dissertation.doi && (
                          <>
                            <span>&bull;</span>
                            <span className="text-slate-500">DOI: {dissertation.doi}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Column */}
                    <div className="flex flex-row lg:flex-col gap-3 shrink-0 self-start w-full lg:w-48 pt-2 lg:pt-0">
                      <Link
                        href={`/dissertations/${dissertation.slug}`}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all text-center"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Read Monograph</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleChapters(dissertation.id)}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-center"
                      >
                        <Layers className="w-4 h-4" />
                        <span>{areChaptersOpen ? 'Hide Chapters' : 'View Chapters'}</span>
                      </button>

                      <a
                        href={`${GITHUB_REPO_URL}/blob/main/dissertations/${dissertation.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 lg:flex-none inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Source File</span>
                      </a>
                    </div>
                  </div>

                  {/* Collapsible Chapters Drawer */}
                  {areChaptersOpen && (
                    <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center space-x-2">
                          <Layers className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Chapter Outline ({dissertation.chapters.length} Chapters)</span>
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dissertation.chapters.map((ch) => (
                          <div
                            key={ch.number}
                            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                              <span>Chapter {ch.number}</span>
                            </div>
                            <h5 className="text-sm font-serif font-bold text-white leading-snug">
                              {ch.title}
                            </h5>
                            {ch.subtitle && (
                              <p className="text-xs text-slate-400 font-serif italic">
                                {ch.subtitle}
                              </p>
                            )}
                            {ch.summary && (
                              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                                {ch.summary}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Academic Contribution & Submission Footer Card */}
        <div className="wf-card-surface border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 mx-auto flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Submit an Academic Dissertation or Monograph
          </h3>
          <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed">
            The WinnegansFake Consortium welcomes scholarly treatises, doctoral dissertations, and research monographs
            addressing modernist aesthetics, genetic manuscripts, and digital humanities. Contributions are peer-reviewed
            and preserved under Creative Commons attribution licenses.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contribute"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
            >
              <FileCode className="w-4 h-4" />
              <span>Submission Guidelines</span>
            </Link>
            <a
              href={`${GITHUB_REPO_URL}/tree/main/dissertations`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Browse Dissertations on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
