'use client';

import React, { useState } from 'react';
import {
  FileUp,
  Link2,
  Check,
  X,
  Clock,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import {
  CookieDuration,
  getDurationLabel,
  EPUB_COOKIE_NAME,
  EpubCookiePayload,
} from '@winnegans/theme';
import { ARCHIVE_EPUB_URL } from '@/lib/constants';

interface EpubSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  isLoaded: boolean;
  loadedFileName: string;
  savedCookiePayload: EpubCookiePayload | null;
  onLoadFromUrl: (url: string, duration: CookieDuration, customDays?: number) => Promise<boolean>;
  onSelectLocalFile: (file: File, duration: CookieDuration, customDays?: number) => Promise<boolean>;
  onClearCookie: () => void;
}

export function EpubSourceModal({
  isOpen,
  onClose,
  currentLocation,
  isLoaded,
  loadedFileName,
  savedCookiePayload,
  onLoadFromUrl,
  onSelectLocalFile,
  onClearCookie,
}: EpubSourceModalProps) {
  const [inputUrl, setInputUrl] = useState<string>(
    savedCookiePayload?.location || currentLocation || ''
  );
  const [selectedDuration, setSelectedDuration] = useState<CookieDuration>(
    savedCookiePayload?.duration || 'forever'
  );
  const [inputCustomDays, setInputCustomDays] = useState<number>(
    savedCookiePayload?.customDays || 365
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCookieDetails, setShowCookieDetails] = useState<boolean>(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const durations: CookieDuration[] = [
    'session',
    '1-day',
    '7-days',
    '30-days',
    '1-year',
    'forever',
    'custom',
  ];

  const presets = [
    {
      label: 'Local Dev Server (Make / Data)',
      url: '/data/finneganswake00joycuoft.epub',
      description: 'Reads from local data/ directory if served',
    },
    {
      label: 'Localhost Port 8080',
      url: 'http://localhost:8080/data/finneganswake00joycuoft.epub',
      description: 'Useful when running a separate local static server',
    },
    {
      label: 'Internet Archive Public Scan (1.5 MB)',
      url: ARCHIVE_EPUB_URL,
      description: 'Direct public scan download from Archive.org',
    },
  ];

  const handleFetchUrl = async (urlToLoad: string) => {
    const target = urlToLoad.trim();
    if (!target) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid URL or path.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);
    try {
      const ok = await onLoadFromUrl(
        target,
        selectedDuration,
        selectedDuration === 'custom' ? inputCustomDays : undefined
      );
      if (ok) {
        setStatusMessage({
          type: 'success',
          text: `Successfully loaded EPUB and saved location in cookie (${getDurationLabel(selectedDuration, inputCustomDays)})!`,
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatusMessage({
          type: 'error',
          text: 'Failed to fetch or parse EPUB from specified URL. Check CORS or URL validity.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error fetching EPUB from URL.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage(null);
    try {
      const ok = await onSelectLocalFile(
        file,
        selectedDuration,
        selectedDuration === 'custom' ? inputCustomDays : undefined
      );
      if (ok) {
        setStatusMessage({
          type: 'success',
          text: `Loaded "${file.name}" and remembered file in cookie (${getDurationLabel(selectedDuration, inputCustomDays)})!`,
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Error parsing EPUB file.',
      });
    } finally {
      setLoading(false);
    }
  };

  const previewCookie = {
    cookieName: EPUB_COOKIE_NAME,
    location: inputUrl || savedCookiePayload?.location || '(none)',
    duration: selectedDuration,
    customDays: selectedDuration === 'custom' ? inputCustomDays : undefined,
    savedAt: new Date().toISOString(),
    securityFlags: {
      Path: '/',
      SameSite: 'Lax',
      Secure: 'true (if on HTTPS)',
      StoragePolicy: 'Strictly client-side source pointer only (never sends book content)',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="epub-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl wf-card-surface border border-inherit/40 shadow-2xl overflow-hidden text-inherit select-text">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit/30 bg-inherit/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="epub-modal-title" className="text-base sm:text-lg font-serif font-bold">
                EPUB Source Location & Cookie Persistence
              </h2>
              <p className="text-xs opacity-75 font-mono">
                Store EPUB location in cookie for as long as you want
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-inherit/40 transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Bar */}
        <div className="px-5 py-3 border-b border-inherit/20 bg-inherit/20 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-mono opacity-80">Memory Status:</span>
            {isLoaded ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[11px]">
                Active: {loadedFileName}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-mono text-[11px]">
                No EPUB Loaded in Memory
              </span>
            )}
          </div>
          {savedCookiePayload && (
            <div className="flex items-center space-x-2 font-mono text-[11px] text-emerald-400">
              <span>Saved in Cookie ({savedCookiePayload.duration})</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Method A: URL or Endpoint Location */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              <Link2 className="w-4 h-4" />
              <span>Option 1: Set EPUB URL Location</span>
            </label>
            <p className="text-xs opacity-75 leading-relaxed">
              Enter the URL or local web server path to your <em>Finnegans Wake</em> EPUB archive. WinnegansFake will save this location in your client cookie and auto-load it on return.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="https://... or http://localhost:8080/... or /data/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-inherit border border-inherit/40 text-inherit focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => handleFetchUrl(inputUrl)}
                disabled={loading || !inputUrl.trim()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-sm cursor-pointer shrink-0"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Fetch & Load</span>
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-mono opacity-60">Quick Presets:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setInputUrl(preset.url);
                      handleFetchUrl(preset.url);
                    }}
                    className="p-2 rounded-lg border border-inherit/25 hover:border-emerald-500/50 hover:bg-inherit/40 text-left transition-all cursor-pointer"
                  >
                    <div className="text-xs font-medium truncate text-emerald-400">{preset.label}</div>
                    <div className="text-[10px] opacity-60 truncate">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Method B: Pick Local File */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              <FolderOpen className="w-4 h-4" />
              <span>Option 2: Select Local File on Disk</span>
            </label>
            <p className="text-xs opacity-75 leading-relaxed">
              Select an EPUB from your local hard drive (e.g. <code className="font-mono text-emerald-400">data/finneganswake00joycuoft.epub</code> or your Downloads folder). The file name and source reference will be saved in your cookie.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".epub"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border border-indigo-500/50 bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 transition-colors cursor-pointer"
            >
              <FileUp className="w-4 h-4 text-indigo-400" />
              <span>Browse & Load Local .epub File</span>
            </button>
          </div>

          {/* Cookie Duration & Retention Selector */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span>Cookie Storage Duration (Store As Long As You Want):</span>
              </label>
              {savedCookiePayload && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Cookie Active
                </span>
              )}
            </div>

            <p className="text-xs opacity-75 leading-relaxed">
              Select how long the browser should remember your EPUB source location in <code className="font-mono text-emerald-400">{EPUB_COOKIE_NAME}</code>:
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

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
              <span className="text-[11px] font-mono opacity-60">
                Current Setting: {getDurationLabel(selectedDuration, inputCustomDays)}
              </span>
              {savedCookiePayload && (
                <button
                  type="button"
                  onClick={() => {
                    onClearCookie();
                    setStatusMessage({ type: 'success', text: 'EPUB location cookie cleared.' });
                  }}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 border border-red-500/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Cookie</span>
                </button>
              )}
            </div>

            {statusMessage && (
              <div
                className={`p-2.5 rounded-xl text-xs font-mono text-center border animate-in fade-in ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-950 text-red-300 border-red-500/40'
                }`}
              >
                {statusMessage.text}
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
                <span>Inspect EPUB Cookie Data & Zero-Copyright Privacy</span>
              </span>
              {showCookieDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCookieDetails && (
              <div className="p-3 border-t border-inherit/20 text-[11px] font-mono space-y-2 bg-black/40">
                <div className="text-emerald-400 font-semibold">
                  Zero-Copyright Compliance:
                </div>
                <p className="text-[11px] opacity-75 leading-relaxed font-sans">
                  The cookie only stores your preferred URL or file reference string. The underlying copyrighted text of <em>Finnegans Wake</em> is never saved into cookies, never tracked, and never uploaded to any remote server.
                </p>
                <pre className="p-2.5 rounded bg-black/60 border border-inherit/20 overflow-x-auto text-[10px] text-emerald-300">
                  {JSON.stringify(previewCookie, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-inherit/30 bg-inherit/30 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium border border-inherit/40 hover:bg-inherit/40 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
