'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  BookOpen,
  FileText,
  User,
  Tag,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Filter,
  CornerDownLeft,
  FileUp,
  Link2,
} from 'lucide-react';
import { useSearch, SearchScope, SearchAnnotationItem } from './SearchContext';
import { browserEpub, TextSearchResult } from '@/lib/epubReader';
import { getBookAndChapterInfo, ANALYTICAL_REGISTERS } from '@/lib/constants';

interface SearchModalProps {
  onNavigateToPage?: (page: number, line?: number) => void;
  onOpenEpubModal?: () => void;
}

export function SearchModal({ onNavigateToPage, onOpenEpubModal }: SearchModalProps) {
  const router = useRouter();
  const {
    isSearchOpen,
    closeSearch,
    searchScope,
    setSearchScope,
    searchIndex,
    isLoadingIndex,
    loadSearchIndex,
    initialSearchQuery,
    navigateHandler,
    epubModalHandler,
  } = useSearch();

  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened
  useEffect(() => {
    if (isSearchOpen) {
      loadSearchIndex();
      if (initialSearchQuery) {
        setQuery(initialSearchQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isSearchOpen, initialSearchQuery, loadSearchIndex]);

  // Reset selected index when query or scope changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, searchScope]);

  const epubLoaded = browserEpub.isLoaded();

  // Search through Annotations index
  const annotationResults = useMemo(() => {
    if (!query.trim() || searchIndex.length === 0) return [];
    const q = query.trim().toLowerCase();

    return searchIndex.filter((item) => {
      const matchLemma = item.lemma.toLowerCase().includes(q);
      const matchGloss = item.gloss.toLowerCase().includes(q);
      const matchScholar = item.scholars.some((s) => s.toLowerCase().includes(q));
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchRegister = item.registers.some((r) => r.toLowerCase().includes(q));

      switch (searchScope) {
        case 'lemmas':
          return matchLemma;
        case 'glosses':
          return matchGloss;
        case 'scholars':
          return matchScholar;
        case 'tags':
          return matchTag;
        case 'registers':
          return matchRegister;
        case 'all':
          return matchLemma || matchGloss || matchScholar || matchTag || matchRegister;
        case 'text':
          return false;
        default:
          return true;
      }
    });
  }, [query, searchScope, searchIndex]);

  // Search through authentic EPUB book text
  const textResults: TextSearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    if (searchScope !== 'all' && searchScope !== 'text') return [];
    if (!epubLoaded) return [];

    return browserEpub.searchText(query, 60);
  }, [query, searchScope, epubLoaded]);

  // Combined results with type classification
  interface UnifiedSearchResult {
    type: 'text' | 'lemma' | 'gloss' | 'scholar' | 'tag' | 'register';
    id: string;
    page: number;
    line: number;
    title: string;
    snippet: string;
    badgeLabel: string;
    details?: string[];
  }

  const combinedResults: UnifiedSearchResult[] = useMemo(() => {
    const combined: UnifiedSearchResult[] = [];
    const q = query.trim().toLowerCase();

    // 1. Add Text results
    if (searchScope === 'all' || searchScope === 'text') {
      for (const t of textResults) {
        combined.push({
          type: 'text',
          id: `text-${t.page}-${t.line}-${t.matchIndex}`,
          page: t.page,
          line: t.line,
          title: `Joyce Text (Page ${String(t.page).padStart(3, '0')}.${String(t.line).padStart(2, '0')})`,
          snippet: t.snippet,
          badgeLabel: 'BOOK TEXT',
        });
      }
    }

    // 2. Add Annotation results
    if (searchScope !== 'text') {
      for (const ann of annotationResults) {
        let matchType: 'lemma' | 'gloss' | 'scholar' | 'tag' | 'register' = 'lemma';
        let badge = 'LEMMA';

        if (searchScope === 'scholars' || (!ann.lemma.toLowerCase().includes(q) && ann.scholars.some(s => s.toLowerCase().includes(q)))) {
          matchType = 'scholar';
          badge = 'SCHOLAR';
        } else if (searchScope === 'tags' || (!ann.lemma.toLowerCase().includes(q) && ann.tags.some(t => t.toLowerCase().includes(q)))) {
          matchType = 'tag';
          badge = 'TAG';
        } else if (searchScope === 'registers' || (!ann.lemma.toLowerCase().includes(q) && ann.registers.some(r => r.toLowerCase().includes(q)))) {
          matchType = 'register';
          badge = 'REGISTER';
        } else if (searchScope === 'glosses' || (!ann.lemma.toLowerCase().includes(q) && ann.gloss.toLowerCase().includes(q))) {
          matchType = 'gloss';
          badge = 'GLOSS';
        }

        combined.push({
          type: matchType,
          id: ann.id,
          page: ann.page,
          line: ann.line,
          title: ann.lemma || `Annotation at ${ann.page}.${ann.line}`,
          snippet: ann.gloss || ann.quote || '',
          badgeLabel: badge,
          details: ann.scholars.length > 0 ? ann.scholars : undefined,
        });
      }
    }

    return combined;
  }, [annotationResults, textResults, searchScope, query]);

  // Counts for each tab badge
  const counts = useMemo(() => {
    if (!query.trim()) return {};
    const q = query.trim().toLowerCase();
    const textCount = epubLoaded ? browserEpub.searchText(query, 100).length : 0;
    const lemmaCount = searchIndex.filter(a => a.lemma.toLowerCase().includes(q)).length;
    const glossCount = searchIndex.filter(a => a.gloss.toLowerCase().includes(q)).length;
    const scholarCount = searchIndex.filter(a => a.scholars.some(s => s.toLowerCase().includes(q))).length;
    const tagCount = searchIndex.filter(a => a.tags.some(t => t.toLowerCase().includes(q))).length;
    const regCount = searchIndex.filter(a => a.registers.some(r => r.toLowerCase().includes(q))).length;

    return {
      all: textCount + searchIndex.filter(a =>
        a.lemma.toLowerCase().includes(q) ||
        a.gloss.toLowerCase().includes(q) ||
        a.scholars.some(s => s.toLowerCase().includes(q)) ||
        a.tags.some(t => t.toLowerCase().includes(q)) ||
        a.registers.some(r => r.toLowerCase().includes(q))
      ).length,
      text: textCount,
      lemmas: lemmaCount,
      glosses: glossCount,
      scholars: scholarCount,
      tags: tagCount,
      registers: regCount,
    };
  }, [query, searchIndex, epubLoaded]);

  const handleNavigate = (page: number, line?: number) => {
    if (onNavigateToPage) {
      onNavigateToPage(page, line);
    } else if (navigateHandler) {
      navigateHandler(page, line);
    } else {
      router.push(`/reader?page=${page}${line ? `&line=${line}` : ''}`);
    }
    closeSearch();
  };

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < combinedResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : combinedResults.length - 1));
    } else if (e.key === 'Enter' && combinedResults[selectedIndex]) {
      e.preventDefault();
      const r = combinedResults[selectedIndex];
      handleNavigate(r.page, r.line);
    }
  };

  // Highlight matches helper
  const highlightMatches = (text: string, searchTerm: string) => {
    if (!searchTerm.trim() || !text) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-500/30 text-amber-200 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isSearchOpen) return null;

  const scopes: Array<{ id: SearchScope; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'text', label: 'Text Itself', icon: BookOpen },
    { id: 'lemmas', label: 'Lemmas', icon: FileText },
    { id: 'glosses', label: 'Glosses', icon: Sparkles },
    { id: 'scholars', label: 'Scholars', icon: User },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'registers', label: 'Registers', icon: Layers },
  ];

  const suggestions = [
    'riverrun',
    'bababadalgharaghtakamminarronnkonn',
    'Vico',
    'Bruno',
    'McHugh',
    'thunder',
    'Phoenix Park',
    'Anna Livia',
    'Shem',
    'Shaun',
    'Book of Kells',
    'Tristan',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSearch();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl wf-card-surface border border-inherit/40 shadow-2xl overflow-hidden text-inherit select-text">
        {/* Top Search Input Bar */}
        <div className="p-4 border-b border-inherit/30 bg-inherit/40 flex items-center space-x-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lemmas, glosses, scholars, tags, or book text..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-sm sm:text-base font-medium text-inherit placeholder:opacity-50 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-inherit/40 transition-all cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono opacity-50 select-none">
            <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">ESC</kbd>
            <span>to close</span>
          </div>
        </div>

        {/* Scope Type Selector Tabs */}
        <div className="px-4 py-2.5 border-b border-inherit/20 bg-inherit/20 flex items-center space-x-1 overflow-x-auto scrollbar-thin">
          <span className="text-[11px] font-mono opacity-50 mr-2 flex items-center space-x-1 shrink-0">
            <Filter className="w-3 h-3" />
            <span>Scope:</span>
          </span>
          {scopes.map((s) => {
            const Icon = s.icon;
            const count = counts[s.id];
            const active = searchScope === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSearchScope(s.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'border border-transparent opacity-70 hover:opacity-100 hover:bg-inherit/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'opacity-60'}`} />
                <span>{s.label}</span>
                {query.trim() && count !== undefined && (
                  <span className={`text-[10px] font-mono px-1 rounded ${active ? 'bg-emerald-950 text-emerald-300' : 'bg-black/30 opacity-70'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* EPUB Text Status Notice (when searching Text or All) */}
        {(searchScope === 'all' || searchScope === 'text') && (
          <div className="px-4 py-2 border-b border-inherit/20 bg-inherit/10 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-[11px] font-mono opacity-80">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {epubLoaded
                  ? `Full-text search active across all 628 pages in browser memory (${browserEpub.getLoadedFileName()})`
                  : 'Full-text prose search requires your local EPUB file to be loaded in browser memory'}
              </span>
            </div>
            {!epubLoaded && (
              <button
                onClick={() => {
                  closeSearch();
                  if (onOpenEpubModal) {
                    onOpenEpubModal();
                  } else if (epubModalHandler) {
                    epubModalHandler();
                  } else {
                    router.push('/guide');
                  }
                }}
                className="inline-flex items-center space-x-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                <Link2 className="w-3 h-3" />
                <span>Load EPUB File / Set URL</span>
              </button>
            )}
          </div>
        )}

        {/* Modal Body / Results */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[60vh] scrollbar-thin"
        >
          {isLoadingIndex && searchIndex.length === 0 ? (
            <div className="p-8 text-center opacity-60 text-xs font-mono space-y-2">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p>Loading universal annotation search index...</p>
            </div>
          ) : !query.trim() ? (
            /* Empty State: Suggestions & Guide */
            <div className="p-6 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold">Universal Wake Search Engine</h3>
                <p className="text-xs opacity-75 max-w-md mx-auto">
                  Search across 1,997+ crowdsourced annotations, 19 analytical registers, cited scholarship, or search the text itself.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono opacity-60">Try searching for:</div>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono border border-inherit/30 hover:border-emerald-500/50 hover:bg-inherit/40 text-emerald-400 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-inherit/20 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left text-[11px] opacity-75">
                <div className="p-2 rounded border border-inherit/20 bg-inherit/20 space-y-1">
                  <div className="font-semibold text-emerald-400">Lemmas & Phrases</div>
                  <div>Search multilingual portmanteau words and puns.</div>
                </div>
                <div className="p-2 rounded border border-inherit/20 bg-inherit/20 space-y-1">
                  <div className="font-semibold text-amber-400">Scholars & Citations</div>
                  <div>Filter by McHugh, Atherton, Campbell, Tindall, etc.</div>
                </div>
                <div className="p-2 rounded border border-inherit/20 bg-inherit/20 space-y-1">
                  <div className="font-semibold text-indigo-400">The Text Itself</div>
                  <div>Search authentic prose when EPUB is loaded in memory.</div>
                </div>
              </div>
            </div>
          ) : combinedResults.length === 0 ? (
            /* No results found */
            <div className="p-8 text-center opacity-60 space-y-2">
              <p className="text-sm font-serif italic">
                No matches found for &ldquo;{query}&rdquo; in {searchScope.toUpperCase()}.
              </p>
              <p className="text-xs font-mono">
                Try switching scope to &ldquo;All&rdquo; or searching for a different phrase or keyword.
              </p>
            </div>
          ) : (
            /* Results list */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono opacity-60 px-1 pb-1">
                <span>
                  {combinedResults.length} result{combinedResults.length !== 1 ? 's' : ''} found
                </span>
                <span>Press [Enter] to jump</span>
              </div>

              {combinedResults.map((res, idx) => {
                const isSelected = idx === selectedIndex;
                const info = getBookAndChapterInfo(res.page);

                return (
                  <div
                    key={res.id}
                    onClick={() => handleNavigate(res.page, res.line)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/40'
                        : 'border-inherit/30 hover:border-inherit/60 bg-inherit/20'
                    }`}
                  >
                    {/* Result Header */}
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider ${
                            res.type === 'text'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : res.type === 'scholar'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                              : res.type === 'tag'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : res.type === 'register'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                              : res.type === 'gloss'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {res.badgeLabel}
                        </span>
                        <span className="text-emerald-400 font-bold">
                          Page {String(res.page).padStart(3, '0')}.{String(res.line).padStart(2, '0')}
                        </span>
                        <span className="opacity-40">&bull;</span>
                        <span className="opacity-70 text-[11px] truncate">
                          {info.bookRoman}, {info.chapterTitle}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 opacity-50 shrink-0">
                        <span className="text-[10px]">Jump</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Result Title / Lemma */}
                    <div className="text-xs font-serif font-semibold text-inherit">
                      {highlightMatches(res.title, query)}
                    </div>

                    {/* Snippet */}
                    {res.snippet && (
                      <div className="text-xs font-serif italic opacity-85 line-clamp-2 leading-relaxed">
                        &ldquo;{highlightMatches(res.snippet, query)}&rdquo;
                      </div>
                    )}

                    {/* Scholar / Tag details if present */}
                    {res.details && res.details.length > 0 && (
                      <div className="flex items-center space-x-2 pt-0.5 text-[10px] font-mono opacity-60">
                        <User className="w-3 h-3 text-purple-400" />
                        <span>Cited: {res.details.join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-inherit/30 bg-inherit/30 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-3 text-[11px] font-mono opacity-70">
            <span>
              <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">↓</kbd> to navigate
            </span>
            <span>&bull;</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">Enter</kbd> to select
            </span>
            <span>&bull;</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">/</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 rounded border border-inherit/40 bg-black/30">Ctrl+F</kbd> anywhere
            </span>
          </div>

          <button
            type="button"
            onClick={closeSearch}
            className="px-3.5 py-1.5 rounded-xl text-xs font-medium border border-inherit/40 hover:bg-inherit/40 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
