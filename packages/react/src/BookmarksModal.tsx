'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  ExternalLink,
  Clock,
  ShieldCheck,
  Check,
  X,
  Download,
  RotateCcw,
  Sliders,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useBookmarks } from './BookmarkContext';
import { CookieDuration, getDurationLabel, BOOKMARK_COOKIE_NAME } from '@winnegans/theme';
import { getWork, getWorkDivision, getAllWorks } from '@winnegans/core';

export interface BookmarksModalProps {
  onNavigateToPage?: (page: number, line?: number, workId?: string) => void;
  onNavigate?: (url: string) => void;
  currentPage?: number;
  currentWorkId?: string;
}

export function BookmarksModal({
  onNavigateToPage,
  onNavigate,
  currentPage,
  currentWorkId = 'finnegans-wake',
}: BookmarksModalProps) {
  const {
    bookmarks,
    removeBookmark,
    toggleBookmark,
    isPageBookmarked,
    cookieDuration,
    customDays,
    setCookieDuration,
    clearAllBookmarks,
    hasStoredCookie,
    storedCookieDuration,
    showBookmarksModal,
    setShowBookmarksModal,
  } = useBookmarks();

  const [selectedDuration, setSelectedDuration] = useState<CookieDuration>(cookieDuration);
  const [inputCustomDays, setInputCustomDays] = useState<number>(customDays || 365);
  const [workFilter, setWorkFilter] = useState<string>(currentWorkId || 'all');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [showCookieDetails, setShowCookieDetails] = useState<boolean>(false);

  React.useEffect(() => {
    if (currentWorkId) {
      setWorkFilter(currentWorkId);
    }
  }, [currentWorkId, showBookmarksModal]);

  if (!showBookmarksModal) return null;

  const durations: CookieDuration[] = [
    'session',
    '1-day',
    '7-days',
    '30-days',
    '1-year',
    'forever',
    'custom',
  ];

  const handleSaveDuration = () => {
    setCookieDuration(selectedDuration, selectedDuration === 'custom' ? inputCustomDays : undefined);
    setCopiedNotification('Cookie duration updated!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `winnegansfake-bookmarks-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const activeCurrentWork = getWork(currentWorkId);
  const currentDivInfo = currentPage ? getWorkDivision(activeCurrentWork, currentPage) : null;

  const handleNavigate = (page: number, line?: number, workId?: string) => {
    setShowBookmarksModal(false);
    if (onNavigateToPage) {
      onNavigateToPage(page, line, workId);
      return;
    }
    const targetWorkId = workId || currentWorkId;
    const workQuery = targetWorkId && targetWorkId !== 'finnegans-wake' ? `&work=${targetWorkId}` : '';
    const targetUrl = `/reader?page=${page}${line ? `&line=${line}` : ''}${workQuery}`;
    if (onNavigate) {
      onNavigate(targetUrl);
    } else if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }
  };

  const isCurrentPageSaved = currentPage ? isPageBookmarked(currentPage, currentWorkId) : false;

  const filteredBookmarks = bookmarks.filter((b) => {
    if (workFilter === 'all') return true;
    return (b.workId || 'finnegans-wake') === workFilter;
  });

  const allWorks = getAllWorks();

  const previewPayload = {
    cookieName: BOOKMARK_COOKIE_NAME,
    totalBookmarks: bookmarks.length,
    duration: selectedDuration,
    customDays: selectedDuration === 'custom' ? inputCustomDays : undefined,
    savedAt: new Date().toISOString(),
    securityFlags: {
      Path: '/',
      SameSite: 'Lax',
      Secure: 'true (if on HTTPS)',
      StoragePolicy: 'Strictly local user-defined reading coordinates only',
    },
    sampleBookmarks: bookmarks.slice(0, 3),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookmarks-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl wf-card-surface border border-inherit/40 shadow-2xl overflow-hidden text-inherit select-text">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit/30 bg-inherit/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 id="bookmarks-modal-title" className="text-base sm:text-lg font-serif font-bold">
                Reading Bookmarks ({bookmarks.length})
              </h2>
              <p className="text-xs opacity-75 font-mono">
                Preserved across sessions via client cookies & local storage
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowBookmarksModal(false)}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-inherit/40 transition-all cursor-pointer"
            title="Close bookmarks"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Current Page Bookmark Action */}
        {currentPage && (
          <div className="px-5 py-3 border-b border-inherit/20 bg-inherit/20 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40">
                {activeCurrentWork.shortTitle}
              </span>
              <span className="font-mono opacity-80">
                Page {String(currentPage).padStart(3, '0')}
              </span>
              {currentDivInfo && (
                <>
                  <span className="opacity-40">&bull;</span>
                  <span className="opacity-70 text-[11px]">
                    {currentDivInfo.subtitle || currentDivInfo.title}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => toggleBookmark(currentPage, undefined, undefined, undefined, currentWorkId)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isCurrentPageSaved
                  ? 'bg-amber-950/70 text-amber-300 border-amber-500/60'
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900/60'
              }`}
            >
              {isCurrentPageSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Page Bookmarked (Click to Remove)</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>+ Bookmark Current Page</span>
                </>
              )}
            </button>
          </div>
        )}


        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Bookmarks List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono opacity-80">
              <span>Saved Reading Points:</span>
              {bookmarks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExport}
                    className="hover:text-emerald-400 flex items-center space-x-1 cursor-pointer"
                    title="Export bookmarks as JSON"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export JSON</span>
                  </button>
                  <span>&bull;</span>
                  <button
                    onClick={() => {
                      if (confirm('Clear all bookmarks and delete bookmark cookie?')) {
                        clearAllBookmarks();
                      }
                    }}
                    className="hover:text-red-400 flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Work Filter Bar */}
            {allWorks.length > 1 && (
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setWorkFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                    workFilter === 'all'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : 'opacity-60 hover:opacity-100 hover:bg-inherit/40 border border-transparent'
                  }`}
                >
                  All Works ({bookmarks.length})
                </button>
                {allWorks.map((w) => {
                  const count = bookmarks.filter((b) => (b.workId || 'finnegans-wake') === w.id).length;
                  if (count === 0 && workFilter !== w.id) return null;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setWorkFilter(w.id)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer flex items-center space-x-1 ${
                        workFilter === w.id
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : 'opacity-60 hover:opacity-100 hover:bg-inherit/40 border border-transparent'
                      }`}
                    >
                      <span>{w.shortTitle}</span>
                      <span className="opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredBookmarks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-inherit/30 rounded-2xl opacity-60 space-y-2">
                <Bookmark className="w-8 h-8 mx-auto text-emerald-400 opacity-60" />
                <p className="text-xs font-serif italic">
                  No bookmarks saved yet. Click &ldquo;+ Bookmark Current Page&rdquo; or the bookmark icon on any line to preserve your place.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredBookmarks.map((bm) => {
                  const bmWork = getWork(bm.workId || currentWorkId || 'finnegans-wake');
                  const info = getWorkDivision(bmWork, bm.page);
                  return (
                    <div
                      key={bm.id}
                      className="p-3 rounded-xl border border-inherit/30 hover:border-inherit/60 transition-all flex items-start justify-between gap-3 bg-inherit/30"
                    >
                      <div
                        onClick={() => handleNavigate(bm.page, bm.line, bm.workId)}
                        className="flex-1 cursor-pointer space-y-1"
                      >
                        <div className="flex items-center space-x-2 text-xs font-mono">
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-950/70 text-indigo-300 border border-indigo-500/40">
                            {bmWork.shortTitle}
                          </span>
                          <span className="text-emerald-400 font-bold">
                            Page {String(bm.page).padStart(3, '0')}
                            {bm.line ? `.${String(bm.line).padStart(2, '0')}` : ''}
                          </span>
                          <span className="opacity-50">&bull;</span>
                          <span className="opacity-70 text-[11px]">
                            {info.subtitle || info.title}
                          </span>
                          {bm.page === currentPage && (!bm.workId || bm.workId === currentWorkId) && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-serif font-medium opacity-90">
                          {bm.title}
                        </div>
                        {bm.excerpt && (
                          <div className="text-[11px] font-serif italic opacity-75 line-clamp-2">
                            &ldquo;{bm.excerpt}&rdquo;
                          </div>
                        )}
                        <div className="text-[10px] opacity-50 font-mono">
                          Saved: {new Date(bm.createdAt).toLocaleDateString()} {new Date(bm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 pt-1">
                        <button
                          onClick={() => handleNavigate(bm.page, bm.line, bm.workId)}
                          className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:text-emerald-400 hover:bg-inherit/60 transition-all cursor-pointer"
                          title="Jump to this page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => removeBookmark(bm.id)}
                          className="p-1.5 rounded-lg opacity-50 hover:opacity-100 hover:text-red-400 hover:bg-inherit/60 transition-all cursor-pointer"
                          title="Delete bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cookie Persistence & Duration Controls */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Cookie Storage Duration (Store As Long As You Want):</span>
              </label>
              {hasStoredCookie && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Cookie Active
                </span>
              )}
            </div>

            <p className="text-xs opacity-75 leading-relaxed">
              WinnegansFake stores bookmarks directly in client cookies (named <code className="font-mono text-emerald-400">wf_bookmarks</code>) with zero external tracking. Select your preferred retention window below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {durations.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setSelectedDuration(dur)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                    selectedDuration === dur
                      ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-sm'
                      : 'border-inherit/30 opacity-75 hover:opacity-100 hover:bg-inherit/40'
                  }`}
                >
                  <span className="truncate">
                    {dur === 'custom' ? 'Custom Days...' : getDurationLabel(dur).split('(')[0]}
                  </span>
                  {selectedDuration === dur && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 ml-2 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Days Input */}
            {selectedDuration === 'custom' && (
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-emerald-500/40 bg-inherit/40 animate-in fade-in duration-150">
                <label className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5 shrink-0">
                  <span>Store for:</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={36500}
                  value={inputCustomDays}
                  onChange={(e) => setInputCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 px-2 py-1 text-xs font-mono rounded bg-inherit border border-inherit/50 text-inherit focus:outline-none focus:border-emerald-400"
                />
                <span className="text-xs opacity-80">
                  Days (~{Math.round((inputCustomDays / 365) * 10) / 10} years)
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono opacity-60">
                Current: {getDurationLabel(cookieDuration, customDays)}
              </span>
              <button
                type="button"
                onClick={handleSaveDuration}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Save Cookie Duration</span>
              </button>
            </div>

            {copiedNotification && (
              <div className="p-2 rounded bg-emerald-950 text-emerald-300 text-xs font-mono text-center border border-emerald-500/40 animate-in fade-in">
                {copiedNotification}
              </div>
            )}
          </div>

          {/* Cookie Transparency Accordion */}
          <div className="border border-inherit/30 rounded-xl overflow-hidden bg-inherit/20">
            <button
              type="button"
              onClick={() => setShowCookieDetails(!showCookieDetails)}
              className="w-full flex items-center justify-between p-3 text-xs opacity-75 hover:opacity-100 transition-colors cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inspect Bookmark Cookie Data & Privacy</span>
              </span>
              {showCookieDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCookieDetails && (
              <div className="p-3 border-t border-inherit/20 text-[11px] font-mono space-y-2 bg-black/40">
                <div className="text-emerald-400 font-semibold">
                  Zero-Tracking Architecture &bull; Client Cookie Payload:
                </div>
                <pre className="p-2.5 rounded bg-black/60 border border-inherit/20 overflow-x-auto text-[10px] text-emerald-300">
                  {JSON.stringify(previewPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit/30 bg-inherit/30 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShowBookmarksModal(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium border border-inherit/40 hover:bg-inherit/40 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
