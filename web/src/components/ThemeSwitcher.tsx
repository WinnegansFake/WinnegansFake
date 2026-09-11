'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Palette,
  Check,
  Sparkles,
  Sliders,
  Sun,
  Moon,
  Smartphone,
  Eye,
  RotateCcw,
  Cookie,
  Trash2,
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { ReadingTheme, ThemeCategory } from '@winnegans/theme';

export function ThemeSwitcher() {
  const {
    currentTheme,
    themeId,
    themes,
    selectTheme,
    overrides,
    updateOverrides,
    resetCustomization,
    hasStoredCookie,
    clearCookieAndReset,
    storedCookieDuration,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'customizer'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: { id: ThemeCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'All Themes', icon: Palette },
    { id: 'light', label: 'Daylight', icon: Sun },
    { id: 'oled', label: 'Obsidian OLED', icon: Smartphone },
    { id: 'solarized', label: 'Solarized', icon: Sun },
    { id: 'dark-red', label: 'Dark Red Night', icon: Moon },
    { id: 'dark-ambient', label: 'Dark Ambient', icon: Eye },
    { id: 'fun', label: 'Fun & Creative', icon: Sparkles },
  ];

  const filteredThemes = themes.filter((t) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'fun') return t.category === 'fun' || t.category === 'creative';
    return t.category === selectedCategory;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 hover:border-slate-500 bg-slate-900/90 text-slate-200 hover:text-white shadow-sm transition-all group"
        title="Theme Switcher & Customizer"
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
          style={{ backgroundColor: currentTheme.colors.bg }}
        />
        <span className="hidden sm:inline">{currentTheme.name}</span>
        <Palette className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-4 text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header with Preset vs Customizer tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'presets' ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Presets ({themes.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customizer')}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'customizer' ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Customizer</span>
              </button>
            </div>

            {hasStoredCookie && (
              <button
                type="button"
                onClick={() => clearCookieAndReset()}
                title="Forget saved theme cookie"
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center space-x-1 px-2 py-0.5 rounded bg-red-950/40 border border-red-800/40"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset Cookie</span>
              </button>
            )}
          </div>

          {activeTab === 'presets' ? (
            <div className="space-y-3">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1 pb-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Grid */}
              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {filteredThemes.map((t) => {
                  const isSelected = t.id === themeId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        selectTheme(t.id);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/80 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Swatch representation */}
                        <div
                          className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shadow-inner"
                          style={{
                            backgroundColor: t.colors.bg,
                            color: t.colors.text,
                            borderColor: t.colors.border,
                          }}
                        >
                          Aa
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-semibold text-white">{t.name}</span>
                            {t.category === 'oled' && (
                              <span className="px-1.5 py-0.2 rounded bg-black text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                                True OLED
                              </span>
                            )}
                            {t.category === 'dark-red' && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-950 text-[9px] font-mono text-rose-300 border border-rose-500/30">
                                Night Red
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{t.description}</p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Customizer Panel */
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Page Background:</span>
                  <span className="font-mono text-[11px]">{overrides.bg || currentTheme.colors.bg}</span>
                </div>
                <input
                  type="color"
                  value={overrides.bg || currentTheme.colors.bg}
                  onChange={(e) => updateOverrides({ bg: e.target.value, cardBg: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Text Color:</span>
                  <span className="font-mono text-[11px]">{overrides.text || currentTheme.colors.text}</span>
                </div>
                <input
                  type="color"
                  value={overrides.text || currentTheme.colors.text}
                  onChange={(e) => updateOverrides({ text: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Accent / Highlights:</span>
                  <span className="font-mono text-[11px]">{overrides.accent || currentTheme.colors.accent}</span>
                </div>
                <input
                  type="color"
                  value={overrides.accent || currentTheme.colors.accent}
                  onChange={(e) => updateOverrides({ accent: e.target.value, accentHover: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Reader Background:</span>
                  <span className="font-mono text-[11px]">{overrides.readerBg || currentTheme.colors.readerBg}</span>
                </div>
                <input
                  type="color"
                  value={overrides.readerBg || currentTheme.colors.readerBg}
                  onChange={(e) => updateOverrides({ readerBg: e.target.value })}
                  className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                />
              </div>

              {/* Reset overrides button */}
              <button
                type="button"
                onClick={() => resetCustomization()}
                className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Theme Defaults</span>
              </button>
            </div>
          )}

          {/* Footer info banner */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center space-x-1">
              <Cookie className="w-3 h-3 text-emerald-500" />
              <span>
                {hasStoredCookie
                  ? `Saved: ${storedCookieDuration || 'custom'}`
                  : 'Cookie: unprompted / session temporary'}
              </span>
            </span>
            <span>@winnegans/theme</span>
          </div>
        </div>
      )}
    </div>
  );
}
