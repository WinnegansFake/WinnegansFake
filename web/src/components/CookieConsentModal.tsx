'use client';

import React, { useState } from 'react';
import {
  Cookie,
  ShieldCheck,
  Clock,
  Check,
  X,
  Info,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { CookieDuration, getDurationLabel } from '@winnegans/theme';

export function CookieConsentModal() {
  const {
    pendingCookieChange,
    proposedThemeId,
    proposedOverrides,
    currentTheme,
    savePreferencesAsCookie,
    dismissCookiePrompt,
  } = useTheme();

  const [selectedDuration, setSelectedDuration] = useState<CookieDuration>('30-days');
  const [showDataDetails, setShowDataDetails] = useState<boolean>(false);

  if (!pendingCookieChange) return null;

  const durations: CookieDuration[] = ['session', '1-day', '7-days', '30-days', '1-year'];

  // Prepare exact payload preview so user has 100% transparency
  const previewPayload = {
    cookieName: 'wf_theme_prefs',
    themeId: proposedThemeId || currentTheme.id,
    themeName: currentTheme.name,
    overrides: proposedOverrides && Object.keys(proposedOverrides).length > 0 ? proposedOverrides : 'none',
    duration: selectedDuration,
    savedAt: new Date().toISOString(),
    securityFlags: {
      Path: '/',
      SameSite: 'Lax',
      Secure: 'true (if on HTTPS)',
      HttpOnly: 'false (read client-side by theme loader)',
    },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-7 text-slate-100 space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cookie-dialog-title" className="text-lg font-serif font-bold text-white">
                Save Theme Preference?
              </h2>
              <p className="text-xs text-slate-400">
                You switched to <span className="text-emerald-400 font-semibold">{currentTheme.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => dismissCookiePrompt()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss without saving"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Would you like to preserve this reading theme across sessions? Under our <strong>Zero-Tracking Policy</strong>, cookies are strictly restricted to local display preferences.
        </p>

        {/* Duration Selection */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Cookie Expiration:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {durations.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setSelectedDuration(dur)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                  selectedDuration === dur
                    ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{getDurationLabel(dur).split('(')[0]}</span>
                {selectedDuration === dur && <Check className="w-3.5 h-3.5 text-emerald-400 ml-2 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Data Transparency Accordion */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/70">
          <button
            type="button"
            onClick={() => setShowDataDetails(!showDataDetails)}
            className="w-full flex items-center justify-between p-3 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Info className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Exact Data Saved in Cookie</span>
            </span>
            {showDataDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDataDetails && (
            <div className="p-3 border-t border-slate-800 text-[11px] font-mono space-y-2 bg-black/40 text-slate-300">
              <div className="text-emerald-400 font-semibold mb-1">
                Zero Personal Data • Local Only:
              </div>
              <pre className="p-2.5 rounded bg-slate-950/90 border border-slate-800 overflow-x-auto text-[10px] text-emerald-300">
                {JSON.stringify(previewPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => dismissCookiePrompt()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent transition-all"
          >
            Don't Save (Session Temporary)
          </button>
          <button
            type="button"
            onClick={() => savePreferencesAsCookie(selectedDuration)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save Theme Cookie</span>
          </button>
        </div>
      </div>
    </div>
  );
}
