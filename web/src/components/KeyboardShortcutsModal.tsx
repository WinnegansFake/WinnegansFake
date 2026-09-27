'use client';

import React from 'react';
import { Keyboard, X, Sparkles } from 'lucide-react';

export interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Page Navigation',
      shortcuts: [
        { keys: ['n', '→'], description: 'Next page' },
        { keys: ['p', '←'], description: 'Previous page' },
        { keys: ['j', '↓'], description: 'Step next line / highlight' },
        { keys: ['k', '↑'], description: 'Step previous line / highlight' },
      ],
    },
    {
      title: 'Scholarly Tools & Overlays',
      shortcuts: [
        { keys: ['c'], description: 'Open Academic Citation modal (MLA/Chicago/BibTeX)' },
        { keys: ['/', 'Ctrl+F'], description: 'Open Universal Search' },
        { keys: ['b'], description: 'Toggle bookmark for current page' },
        { keys: ['m'], description: 'Toggle "Mark Page as Read" progress' },
        { keys: ['a'], description: 'Toggle side annotations drawer' },
      ],
    },
    {
      title: 'Acoustics & Zen Reading',
      shortcuts: [
        { keys: ['r'], description: 'Toggle Web Speech "Listen Aloud" audio playback' },
        { keys: ['f'], description: 'Toggle Fullscreen Zen Reading Mode' },
        { keys: ['+ / -'], description: 'Adjust typography size in Zen mode' },
        { keys: ['Esc'], description: 'Close any open modal or exit Zen mode' },
        { keys: ['?'], description: 'Show / hide this shortcuts cheat-sheet' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-base font-semibold text-slate-100">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-400">
                Fast keyboard-driven digital humanities reader navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">
                {group.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {group.shortcuts.map((sc, scIdx) => (
                  <div
                    key={scIdx}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="text-xs text-slate-300 font-sans">{sc.description}</span>
                    <div className="flex items-center space-x-1">
                      {sc.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700/80 text-[11px] font-mono text-emerald-300 shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tip: Press <kbd className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">?</kbd> anywhere in the reader to summon this dialog</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
