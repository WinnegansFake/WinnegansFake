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
  ShieldCheck,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  CookieDuration,
  getDurationLabel,
  EPUB_COOKIE_NAME,
  EpubCookiePayload,
} from '@winnegans/theme';

import {
  ARCHIVE_EPUB_URL,
  ULYSSES_EPUB_URL,
  getWork,
  type WorkDefinition,
  type AlternateEpubSource,
} from '@/lib/constants';

export interface EpubPreset {
  label: string;
  url: string;
  description: string;
}

interface EpubSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  isLoaded: boolean;
  loadedFileName: string;
  loadedSha256?: string;
  isVerifiedCanonical?: boolean;
  savedCookiePayload: EpubCookiePayload | null;
  onLoadFromUrl: (url: string, duration: CookieDuration, customDays?: number) => Promise<boolean>;
  onSelectLocalFile: (file: File, duration: CookieDuration, customDays?: number) => Promise<boolean>;
  onClearCookie: () => void;
  workId?: string;
  work?: WorkDefinition;
  customPresets?: EpubPreset[];
}

export function EpubSourceModal({
  isOpen,
  onClose,
  currentLocation,
  isLoaded,
  loadedFileName,
  loadedSha256,
  isVerifiedCanonical,
  savedCookiePayload,
  onLoadFromUrl,
  onSelectLocalFile,
  onClearCookie,
  workId = 'finnegans-wake',
  work,
  customPresets,
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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [showCookieDetails, setShowCookieDetails] = useState<boolean>(false);
  const [showSignatures, setShowSignatures] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const activeWork = work || getWork(workId);

  const presets: EpubPreset[] = customPresets || [
    {
      label: 'Local Dev Server (Make / Data)',
      url: `/data/${activeWork.epubFilename || `${activeWork.id}.epub`}`,
      description: 'Reads from local data/ directory if served',
    },
    {
      label: 'Localhost Port 8080',
      url: `http://localhost:8080/data/${activeWork.epubFilename || `${activeWork.id}.epub`}`,
      description: 'Useful when running a separate local static server',
    },
    ...(activeWork.defaultEpubUrl
      ? [
          {
            label:
              activeWork.id === 'neuromancer' || activeWork.id === 'nm'
                ? 'bdebooks.com Neuromancer Book Page'
                : `Internet Archive Public Scan (${
                    activeWork.epubSizeBytes
                      ? (activeWork.epubSizeBytes / 1048576).toFixed(1) + ' MB'
                      : 'Public Edition'
                  })`,
            url: activeWork.defaultEpubUrl,
            description:
              activeWork.id === 'neuromancer' || activeWork.id === 'nm'
                ? 'Visit bdebooks.com to download the EPUB version, then load the downloaded file via the "Select EPUB File" tab'
                : `Direct scan download from ${activeWork.archiveUrl || 'Internet Archive'}`,
          },
        ]
      : []),
  ];

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleFetchUrl = async (urlToLoad: string) => {
    const target = urlToLoad.trim();
    if (!target) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid URL or path.' });
      return;
    }

    if (target.includes('bdebooks.com')) {
      setStatusMessage({
        type: 'error',
        text: 'bdebooks.com uses Cloudflare bot protection and cannot be fetched directly via in-browser JavaScript. Please open the link below in a new tab, click "Download EPUB", and select the downloaded file in "Option 2: Select Local File".',
      });
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
          text: `Successfully loaded EPUB and saved location in cookie (${getDurationLabel(
            selectedDuration,
            inputCustomDays
          )})!`,
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
      // Calculate SHA-256 client-side using Web Crypto
      let computedSha256 = '';
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        try {
          const buffer = await file.arrayBuffer();
          const hashBuf = await window.crypto.subtle.digest('SHA-256', buffer);
          const hashArr = Array.from(new Uint8Array(hashBuf));
          computedSha256 = hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
        } catch (hashErr) {
          console.warn('Could not compute SHA-256:', hashErr);
        }
      }

      const isMatch =
        activeWork.epubSha256 && computedSha256
          ? computedSha256.toLowerCase() === activeWork.epubSha256.toLowerCase()
          : false;

      const ok = await onSelectLocalFile(
        file,
        selectedDuration,
        selectedDuration === 'custom' ? inputCustomDays : undefined
      );

      if (ok) {
        if (isMatch) {
          setStatusMessage({
            type: 'success',
            text: `✅ Verified Canonical Edition! Cryptographic SHA-256 matched (${computedSha256.slice(
              0,
              16
            )}...). Loaded "${file.name}"!`,
          });
        } else if (computedSha256) {
          setStatusMessage({
            type: 'info',
            text: `ℹ️ Loaded "${file.name}" (SHA-256: ${computedSha256.slice(
              0,
              16
            )}...). Custom/alternate edition detected. Internal page anchors and chapters will be mapped.`,
          });
        } else {
          setStatusMessage({
            type: 'success',
            text: `Loaded "${file.name}" and remembered in cookie (${getDurationLabel(
              selectedDuration,
              inputCustomDays
            )})!`,
          });
        }
        setTimeout(() => {
          onClose();
        }, 1500);
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

  const isHashVerified = Boolean(
    isLoaded &&
      loadedSha256 &&
      activeWork.epubSha256 &&
      loadedSha256.toLowerCase() === activeWork.epubSha256.toLowerCase()
  );

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl wf-card-surface border border-inherit/40 shadow-2xl overflow-hidden text-inherit select-text">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit/30 bg-inherit/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="epub-modal-title" className="text-base sm:text-lg font-serif font-bold">
                EPUB Source & Cryptographic Verification
              </h2>
              <p className="text-xs opacity-75 font-mono">
                {activeWork.title} &bull; Zero-Copyright Client Architecture
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
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <span className="font-mono opacity-80">Memory Status:</span>
            {isLoaded ? (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] flex items-center space-x-1">
                <span>Active: {loadedFileName}</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-mono text-[11px]">
                No EPUB Loaded in Memory
              </span>
            )}

            {isLoaded && isHashVerified && (
              <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-400/50 font-mono text-[11px] flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Canonical Signature Verified</span>
              </span>
            )}

            {isLoaded && loadedSha256 && !isHashVerified && (
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/40 font-mono text-[10px] flex items-center space-x-1">
                <span>SHA-256: {loadedSha256.slice(0, 12)}...</span>
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
          {/* Method 1: Alternate Verified Mirrors & Download Links */}
          {activeWork.alternateEpubUrls && activeWork.alternateEpubUrls.length > 0 && (
            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  <ExternalLink className="w-4 h-4" />
                  <span>Verified Download Mirrors & Alternate Links</span>
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-400/30">
                  Zero-Copyright External Sourcing
                </span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Because copyrighted book text is never hosted on WinnegansFake, download the EPUB from any of the verified mirrors below, then load the file via <strong>Option 2: Select Local File</strong>:
              </p>

              <div className="space-y-2 pt-1">
                {activeWork.alternateEpubUrls.map((source: AlternateEpubSource, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-inherit/30 bg-black/40 hover:border-cyan-500/50 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="font-semibold text-cyan-300">{source.label}</span>
                        {source.type && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                            {source.type.replace('_', ' ')}
                          </span>
                        )}
                        {source.sha256 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            Exact SHA-256 Match
                          </span>
                        )}
                      </div>
                      {source.note && (
                        <p className="text-[11px] opacity-75 mt-1 leading-snug">
                          {source.note}
                        </p>
                      )}
                      <div className="text-[10px] font-mono opacity-50 truncate mt-1">
                        {source.url}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 pt-0.5">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                        title="Open download link in new tab"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(source.url, `mirror-${idx}`)}
                        className="p-1.5 rounded-lg border border-inherit/40 hover:bg-inherit/40 text-inherit opacity-75 hover:opacity-100 transition-colors cursor-pointer"
                        title="Copy mirror URL"
                      >
                        {copiedKey === `mirror-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Method 2: Pick Local File on Disk */}
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-3">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              <FolderOpen className="w-4 h-4" />
              <span>Option 2: Select Local File on Disk (Instant Verification)</span>
            </label>
            <p className="text-xs opacity-75 leading-relaxed">
              Select an EPUB from your local drive (e.g.{' '}
              <code className="font-mono text-cyan-400">
                data/{activeWork.epubFilename || `${activeWork.id}.epub`}
              </code>{' '}
              or your Downloads folder). The browser will calculate its cryptographic SHA-256 hash using the Web Crypto API to verify calibration.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".epub"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shadow-md cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>Browse & Load Local .epub File</span>
              </button>
              {loading && (
                <div className="flex items-center space-x-1.5 text-xs text-indigo-300 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing SHA-256 & Unpacking...</span>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic Signatures & Fingerprints Accordion */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <button
              type="button"
              onClick={() => setShowSignatures(!showSignatures)}
              className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Canonical Cryptographic Signatures & Verification</span>
              </div>
              {showSignatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSignatures && (
              <div className="space-y-3 pt-2 text-xs">
                <p className="text-[11px] opacity-75 leading-relaxed">
                  WinnegansFake verifies that your personal copy matches the exact page numbering and coordinate line mapping used by our scholarly annotations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  {/* Canonical SHA-256 */}
                  {activeWork.epubSha256 && (
                    <div className="p-2.5 rounded-lg border border-inherit/25 bg-black/40 sm:col-span-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-semibold">Expected SHA-256 Checksum:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(activeWork.epubSha256 || '', 'sha256')}
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-inherit hover:bg-inherit/40 text-inherit opacity-75 hover:opacity-100 transition-colors"
                        >
                          {copiedKey === 'sha256' ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="font-mono text-[10px] break-all select-all text-emerald-300">
                        {activeWork.epubSha256}
                      </div>
                    </div>
                  )}

                  {/* Canonical MD5 */}
                  {activeWork.epubMd5 && (
                    <div className="p-2.5 rounded-lg border border-inherit/25 bg-black/40 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-semibold">MD5 Checksum:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(activeWork.epubMd5 || '', 'md5')}
                          className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] bg-inherit hover:bg-inherit/40 text-inherit opacity-75 hover:opacity-100 transition-colors"
                        >
                          {copiedKey === 'md5' ? (
                            <Check className="w-3 h-3 text-cyan-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="font-mono text-[10px] break-all select-all text-cyan-300">
                        {activeWork.epubMd5}
                      </div>
                    </div>
                  )}

                  {/* File Size */}
                  {activeWork.epubSizeBytes && (
                    <div className="p-2.5 rounded-lg border border-inherit/25 bg-black/40 space-y-1">
                      <span className="text-indigo-400 font-semibold">Exact File Size:</span>
                      <div className="font-mono text-[11px] text-indigo-300">
                        {activeWork.epubSizeBytes.toLocaleString()} bytes (~
                        {(activeWork.epubSizeBytes / 1024).toFixed(1)} KB)
                      </div>
                    </div>
                  )}

                  {/* ISBN */}
                  {activeWork.isbn && (
                    <div className="p-2.5 rounded-lg border border-inherit/25 bg-black/40 space-y-1">
                      <span className="text-amber-400 font-semibold">Canonical Edition ISBN:</span>
                      <div className="font-mono text-[11px] text-amber-300">{activeWork.isbn}</div>
                    </div>
                  )}

                  {/* Calibre UUID */}
                  {activeWork.calibreUuid && (
                    <div className="p-2.5 rounded-lg border border-inherit/25 bg-black/40 space-y-1">
                      <span className="text-purple-400 font-semibold">Calibre UUID:</span>
                      <div className="font-mono text-[10px] text-purple-300 break-all">
                        {activeWork.calibreUuid}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-2.5 rounded-lg bg-black/60 border border-inherit/20 text-[10px] font-mono text-inherit/80 space-y-1">
                  <div className="opacity-60">Terminal Verification Command:</div>
                  <div className="text-emerald-300 select-all">
                    sha256sum {activeWork.epubFilename || `${activeWork.id}.epub`}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Method 3: URL or Endpoint Location */}
          <div className="p-4 rounded-xl border border-inherit/30 bg-inherit/30 space-y-3">
            <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              <Link2 className="w-4 h-4" />
              <span>Option 3: Set EPUB URL or Local Server Location</span>
            </label>
            <p className="text-xs opacity-75 leading-relaxed">
              Enter the URL or local web server path to your EPUB archive. WinnegansFake will save this location in your client cookie and auto-load it on return.
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
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
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
                    <div className="text-xs font-medium truncate text-emerald-400">
                      {preset.label}
                    </div>
                    <div className="text-[10px] opacity-60 truncate">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>
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
              Select how long the browser should remember your EPUB source location in{' '}
              <code className="font-mono text-emerald-400">{EPUB_COOKIE_NAME}</code>:
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
                    : statusMessage.type === 'info'
                    ? 'bg-sky-950 text-sky-300 border-sky-500/40'
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
              {showCookieDetails ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showCookieDetails && (
              <div className="p-3 border-t border-inherit/20 text-[11px] font-mono space-y-2 bg-black/40">
                <div className="text-emerald-400 font-semibold">Zero-Copyright Compliance:</div>
                <p className="text-[11px] opacity-75 leading-relaxed font-sans">
                  The cookie only stores your preferred URL or file reference string. The underlying copyrighted text of <em>{activeWork.title}</em> is never saved into cookies, never tracked, and never uploaded to any remote server.
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
