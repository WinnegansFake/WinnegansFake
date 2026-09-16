'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Filter,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Tag,
  Layers,
  User,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { SearchScope, SearchAnnotationItem } from '@/components/SearchContext';
import { getBasePath, getBookAndChapterInfo, ANALYTICAL_REGISTERS } from '@/lib/constants';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get('q') || '';
  const initialWork = searchParams?.get('work') || 'all';
  const initialScope = (searchParams?.get('scope') as SearchScope) || 'all';
  const initialRegister = searchParams?.get('register') || 'all';

  const [query, setQuery] = useState<string>(initialQ);
  const [workFilter, setWorkFilter] = useState<string>(initialWork);
  const [scope, setScope] = useState<SearchScope>(initialScope);
  const [registerFilter, setRegisterFilter] = useState<string>(initialRegister);
  const [items, setItems] = useState<SearchAnnotationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams) {
      const q = searchParams.get('q');
      const w = searchParams.get('work');
      const s = searchParams.get('scope') as SearchScope;
      const r = searchParams.get('register');
      if (q !== null) setQuery(q);
      if (w) setWorkFilter(w);
      if (s) setScope(s);
      if (r) setRegisterFilter(r);
    }
  }, [searchParams]);

  // Load search index
  useEffect(() => {
    let isMounted = true;
    async function fetchIndex() {
      setLoading(true);
      try {
        const basePath = getBasePath();
        const res = await fetch(`${basePath}/search_index.json`);
        if (res.ok) {
          const data: SearchAnnotationItem[] = await res.json();
          if (isMounted) setItems(data);
        }
      } catch (err) {
        console.error('Failed to load search index:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchIndex();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL on filter changes
  const updateUrl = (newQuery: string, newWork: string, newScope: string, newReg: string) => {
    const params = new URLSearchParams();
    if (newQuery.trim()) params.set('q', newQuery.trim());
    if (newWork !== 'all') params.set('work', newWork);
    if (newScope !== 'all') params.set('scope', newScope);
    if (newReg !== 'all') params.set('register', newReg);
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : '/search');
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrl(val, workFilter, scope, registerFilter);
  };

  const handleWorkChange = (val: string) => {
    setWorkFilter(val);
    updateUrl(query, val, scope, registerFilter);
  };

  const handleScopeChange = (val: SearchScope) => {
    setScope(val);
    updateUrl(query, workFilter, val, registerFilter);
  };

  const handleRegisterChange = (val: string) => {
    setRegisterFilter(val);
    updateUrl(query, workFilter, scope, val);
  };

  // Filtered results
  const results = useMemo(() => {
    let filtered = items;

    // 1. Work filter
    if (workFilter !== 'all') {
      const norm = (w?: string) => (w || '').replace(/[-_]/g, '').toLowerCase();
      const target = norm(workFilter);
      filtered = filtered.filter((it) => {
        const itemWork = norm(it.work || 'finneganswake');
        return itemWork === target;
      });
    }

    // 2. Register filter
    if (registerFilter !== 'all') {
      filtered = filtered.filter(
        (it) => it.registers && it.registers.includes(registerFilter)
      );
    }

    // 3. Search query filter
    const q = query.trim().toLowerCase();
    if (!q) return filtered;

    return filtered.filter((item) => {
      if (scope === 'lemmas') {
        return (item.lemma || '').toLowerCase().includes(q);
      }
      if (scope === 'glosses') {
        return (item.gloss || '').toLowerCase().includes(q);
      }
      if (scope === 'scholars') {
        return (
          (item.scholars || []).some((s) => s.toLowerCase().includes(q)) ||
          (item.displayAuthor || '').toLowerCase().includes(q)
        );
      }
      if (scope === 'registers') {
        return (item.registers || []).some((r) => r.toLowerCase().includes(q));
      }
      if (scope === 'tags') {
        return (item.tags || []).some((t) => t.toLowerCase().includes(q));
      }

      // Default: 'all'
      return (
        (item.lemma || '').toLowerCase().includes(q) ||
        (item.gloss || '').toLowerCase().includes(q) ||
        (item.displayAuthor || '').toLowerCase().includes(q) ||
        (item.scholars || []).some((s) => s.toLowerCase().includes(q)) ||
        (item.registers || []).some((r) => r.toLowerCase().includes(q)) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, workFilter, scope, registerFilter]);

  const scopeTabs: { id: SearchScope; label: string }[] = [
    { id: 'all', label: 'All Fields' },
    { id: 'lemmas', label: 'Phrases / Lemmas' },
    { id: 'glosses', label: 'Annotation Glosses' },
    { id: 'scholars', label: 'Scholars & Sources' },
    { id: 'registers', label: 'Registers' },
    { id: 'tags', label: 'Tags' },
  ];

  const suggestedQueries = [
    { label: 'Thunderclaps', query: 'thunder' },
    { label: 'River Liffey', query: 'liffey' },
    { label: 'Leopold Bloom', query: 'bloom', work: 'ulysses' },
    { label: 'Buck Mulligan', query: 'mulligan', work: 'ulysses' },
    { label: 'Viconian Cycles', query: 'vico' },
    { label: 'Molly Bloom', query: 'penelope', work: 'ulysses' },
    { label: 'Shem & Shaun', query: 'shaun' },
    { label: 'Sandhyas', query: 'sandhyas' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full Corpus Universal Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          Search Scholarly Annotations
        </h1>
        <p className="text-sm text-slate-400">
          Query over 2,000 glosses, multilingual lemmata, Homeric parallels, and historical registers across Finnegans Wake and Ulysses.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search keywords, phrases, scholars, or coordinates (e.g. 003.15)..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-12 pr-10 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-sans"
            autoFocus
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Work Filter */}
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-medium">Work:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => handleWorkChange('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  workFilter === 'all'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Works
              </button>
              <button
                onClick={() => handleWorkChange('finnegans-wake')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  workFilter === 'finnegans-wake' || workFilter === 'finneganswake'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Finnegans Wake
              </button>
              <button
                onClick={() => handleWorkChange('ulysses')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  workFilter === 'ulysses'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ulysses
              </button>
            </div>
          </div>

          {/* Register Filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-medium">Register:</span>
            <select
              value={registerFilter}
              onChange={(e) => handleRegisterChange(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Registers (19)</option>
              {ANALYTICAL_REGISTERS.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scope Tabs */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {scopeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleScopeChange(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                scope === tab.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Search Prompts (if empty query) */}
      {!query && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Suggested Discoveries
          </h2>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((sug, i) => (
              <button
                key={i}
                onClick={() => {
                  if (sug.work) setWorkFilter(sug.work);
                  handleQueryChange(sug.query);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-all cursor-pointer shadow-sm"
              >
                <span>{sug.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">"{sug.query}"</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 border-b border-slate-800/80 pb-2">
        <div>
          {loading ? (
            <span>Loading annotation corpus...</span>
          ) : (
            <span>
              Showing <strong className="text-slate-200">{results.length}</strong> matching{' '}
              {results.length === 1 ? 'annotation' : 'annotations'}
              {query && (
                <>
                  {' '}for "<span className="text-emerald-400">{query}</span>"
                </>
              )}
            </span>
          )}
        </div>
        {(query || workFilter !== 'all' || registerFilter !== 'all' || scope !== 'all') && (
          <button
            onClick={() => {
              setQuery('');
              setWorkFilter('all');
              setScope('all');
              setRegisterFilter('all');
              router.replace('/search');
            }}
            className="text-xs text-slate-400 hover:text-amber-400 underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-sm animate-pulse space-y-2">
          <div className="w-8 h-8 mx-auto border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p>Searching index across 648 pages...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-900/30 rounded-2xl border border-slate-800/60 p-8">
          <p className="text-base text-slate-300 font-medium">No annotations found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try broadening your search terms, selecting "All Works", or searching for a specific page coordinate like 003.01.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((item) => {
            const isFW = (item.work || 'finneganswake').includes('finnegans');
            const workSlug = isFW ? 'finnegans-wake' : 'ulysses';
            const workBadgeColor = isFW
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40';
            const workLabel = isFW ? 'Finnegans Wake' : 'Ulysses';
            const padP = String(item.page).padStart(3, '0');
            const padL = String(item.line).padStart(2, '0');
            const coord = `${isFW ? 'FW' : 'U'} ${padP}.${padL}`;

            const bookInfo = getBookAndChapterInfo(item.page, workSlug);

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${workBadgeColor}`}>
                        {workLabel}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {coord}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 italic">
                      {isFW
                        ? `Book ${bookInfo.bookRoman}, Ch. ${bookInfo.chapter}`
                        : bookInfo.chapterTitle}
                    </span>
                  </div>

                  {/* Lemma / Target Phrase */}
                  <div className="font-serif font-semibold text-base text-slate-100 group-hover:text-emerald-300 transition-colors">
                    "{item.lemma}"
                  </div>

                  {/* Annotation Gloss Text */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                    {item.gloss}
                  </p>

                  {/* Registers & Tags */}
                  {item.registers && item.registers.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.registers.map((reg) => (
                        <span
                          key={reg}
                          className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950 text-slate-400 border border-slate-800"
                        >
                          #{reg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Scholar & Jump Link */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] truncate max-w-[200px]">
                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{item.displayAuthor || 'Open Wake Scholar'}</span>
                  </div>

                  <Link
                    href={`/reader?work=${workSlug}&page=${item.page}`}
                    className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                  >
                    <span>Read on Page {item.page}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="flex-1 flex flex-col bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <div className="py-20 text-center text-slate-400 text-sm">
            Initializing Universal Search...
          </div>
        }
      >
        <SearchPageContent />
      </Suspense>
    </main>
  );
}
