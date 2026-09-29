'use client';

import React, { useState, useEffect } from 'react';
import {
  Columns,
  ArrowLeftRight,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Layers,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { AnnotationItem, PageLine, getBookAndChapterInfo, getWork, getAllWorks } from '@winnegans/core';
import { AcousticPlayer } from './AcousticPlayer';

export interface DualPaneComparisonProps {
  primaryWorkId: string;
  primaryPage: number;
  primaryLines: PageLine[];
  primaryAnnotations: AnnotationItem[];
  epubLoaded: boolean;
  onNavigatePrimaryPage: (page: number) => void;
  onSwitchPrimaryWork?: (workId: string) => void;
  onClose: () => void;
  basePath?: string;
}

export function DualPaneComparison({
  primaryWorkId,
  primaryPage,
  primaryLines,
  primaryAnnotations,
  epubLoaded,
  onNavigatePrimaryPage,
  onSwitchPrimaryWork,
  onClose,
  basePath = '',
}: DualPaneComparisonProps) {
  const [secondaryWorkId, setSecondaryWorkId] = useState<string>(
    primaryWorkId === 'finneganswake' || primaryWorkId === 'finnegans-wake'
      ? 'finneganswake'
      : 'finneganswake'
  );
  const [secondaryPage, setSecondaryPage] = useState<number>(primaryPage === 3 ? 628 : 3);
  const [secondaryAnnotations, setSecondaryAnnotations] = useState<AnnotationItem[]>([]);
  const [secondaryLoading, setSecondaryLoading] = useState<boolean>(false);
  const [secondaryActiveLine, setSecondaryActiveLine] = useState<number | null>(null);
  const [primaryActiveLine, setPrimaryActiveLine] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState<'ouroboros' | 'intertextual' | 'custom'>(
    primaryPage === 3 || primaryPage === 628 ? 'ouroboros' : 'custom'
  );

  // Load secondary annotations when secondaryWorkId or secondaryPage changes
  useEffect(() => {
    let isCancelled = false;
    async function loadSecondary() {
      setSecondaryLoading(true);
      const padPage = String(secondaryPage).padStart(3, '0');
      const normWork = secondaryWorkId.replace(/[-_\s]/g, '').toLowerCase();
      const isFW = normWork === 'finneganswake' || normWork === 'fw';

      const candidateUrls = isFW
        ? [
            `${basePath}/annotations/finneganswake/page_${padPage}.json`,
            `${basePath}/annotations/finnegans-wake/page_${padPage}.json`,
            `${basePath}/annotations/page_${padPage}.json`,
          ]
        : [`${basePath}/annotations/${secondaryWorkId}/page_${padPage}.json`];

      let loaded = false;
      for (const url of candidateUrls) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (!isCancelled) {
              setSecondaryAnnotations(data.annotations || []);
              loaded = true;
            }
            break;
          }
        } catch {
          // try next candidate
        }
      }
      if (!isCancelled && !loaded) {
        setSecondaryAnnotations([]);
      }
      if (!isCancelled) {
        setSecondaryLoading(false);
      }
    }
    loadSecondary();
    return () => {
      isCancelled = true;
    };
  }, [secondaryWorkId, secondaryPage, basePath]);

  // Presets
  const applyOuroborosPreset = () => {
    setActivePreset('ouroboros');
    if (onSwitchPrimaryWork) onSwitchPrimaryWork('finneganswake');
    onNavigatePrimaryPage(628);
    setSecondaryWorkId('finneganswake');
    setSecondaryPage(3);
  };

  const applyIntertextualPreset = () => {
    setActivePreset('intertextual');
    if (onSwitchPrimaryWork) onSwitchPrimaryWork('ulysses');
    onNavigatePrimaryPage(1);
    setSecondaryWorkId('finneganswake');
    setSecondaryPage(126);
  };

  const swapPanes = () => {
    const curSecWork = secondaryWorkId;
    const curSecPage = secondaryPage;
    setSecondaryWorkId(primaryWorkId);
    setSecondaryPage(primaryPage);
    if (onSwitchPrimaryWork) onSwitchPrimaryWork(curSecWork);
    onNavigatePrimaryPage(curSecPage);
  };

  const primaryInfo = getBookAndChapterInfo(primaryPage, primaryWorkId);
  const secondaryInfo = getBookAndChapterInfo(secondaryPage, secondaryWorkId);
  const primaryWorkObj = getWork(primaryWorkId);
  const secondaryWorkObj = getWork(secondaryWorkId);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Comparative Toolbar Ribbon */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Columns className="w-3.5 h-3.5 text-amber-400" />
            <span>Dual-Pane Comparative Reader</span>
          </div>

          {/* Preset Buttons */}
          <button
            type="button"
            onClick={applyOuroborosPreset}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'ouroboros'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Compare FW Page 628 (The Dissolution) side-by-side with FW Page 3 (The Riverrun Loop)"
          >
            🌀 Ouroboros Mode (pp. 628 ↔ 3)
          </button>

          <button
            type="button"
            onClick={applyIntertextualPreset}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'intertextual'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
            title="Compare Ulysses Episode 1 (Telemachus) side-by-side with FW Book I Ch 6 (Shem's Riddles)"
          >
            🏛️ Intertextual (Ulysses ↔ FW)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={swapPanes}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            title="Swap Left and Right Panes"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
            <span>Swap Panes</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Exit Dual-Pane Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ================= LEFT PANE (PRIMARY) ================= */}
        <div className="wf-reader-viewport border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Left Pane &bull; {primaryWorkObj.shortTitle}
              </span>
              <h3 className="font-serif font-bold text-white text-base">
                {primaryWorkId === 'ulysses'
                  ? primaryInfo.chapterTitle
                  : `Book ${primaryInfo.bookRoman}, Chapter ${primaryInfo.chapter}`}
              </h3>
            </div>

            {/* Left Page Nav */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onNavigatePrimaryPage(Math.max(1, primaryPage - 1))}
                disabled={primaryPage <= 1}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
                p. {primaryPage}
              </span>
              <button
                onClick={() => onNavigatePrimaryPage(primaryPage + 1)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Left Acoustic Player */}
          <AcousticPlayer
            pageNumber={primaryPage}
            workId={primaryWorkId}
            lines={
              primaryLines.length > 0
                ? primaryLines
                : primaryAnnotations.map((a) => ({
                    line: a.line_number,
                    text: a.target_phrase
                      ? `Line ${a.line_number}: "${a.target_phrase}". ${a.annotation_text || ''}`
                      : `Line ${a.line_number}: ${a.annotation_text || ''}`,
                  }))
            }
            onActiveLineChange={setPrimaryActiveLine}
          />

          {/* Left Text / Lines View */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {primaryLines.length > 0 ? (
              primaryLines.map((l) => {
                const lineNum = l.line ?? (l as any).line_number ?? 1;
                const isSpoken = primaryActiveLine === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-start text-xs font-serif leading-relaxed px-2 py-1 rounded transition-colors ${
                      isSpoken
                        ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="w-8 font-mono text-[10px] text-slate-500 shrink-0 select-none pt-0.5">
                      {String(lineNum).padStart(2, '0')}
                    </span>
                    <span>{l.text}</span>
                  </div>
                );
              })
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  <span>Page {primaryPage} Gloss Apparatus ({primaryAnnotations.length} annotations)</span>
                </div>
                {primaryAnnotations.map((a) => (
                  <div key={a.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="font-mono text-emerald-400 font-bold mr-2">Line {a.line_number}:</span>
                    <strong className="text-white">{a.target_phrase}</strong>
                    <p className="text-slate-400 text-[11px]">{a.annotation_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANE (SECONDARY) ================= */}
        <div className="wf-reader-viewport border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold tracking-wider">
                Right Pane &bull; {secondaryWorkObj.shortTitle}
              </span>
              <h3 className="font-serif font-bold text-white text-base">
                {secondaryWorkId === 'ulysses'
                  ? secondaryInfo.chapterTitle
                  : `Book ${secondaryInfo.bookRoman}, Chapter ${secondaryInfo.chapter}`}
              </h3>
            </div>

            {/* Right Page Nav & Work Selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={secondaryWorkId}
                onChange={(e) => setSecondaryWorkId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-[11px] text-slate-300 rounded px-1.5 py-0.5"
              >
                {getAllWorks().map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.shortTitle}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSecondaryPage(Math.max(1, secondaryPage - 1))}
                disabled={secondaryPage <= 1}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200">
                p. {secondaryPage}
              </span>
              <button
                onClick={() => setSecondaryPage(secondaryPage + 1)}
                className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Acoustic Player */}
          <AcousticPlayer
            pageNumber={secondaryPage}
            workId={secondaryWorkId}
            lines={secondaryAnnotations.map((a) => ({
              line: a.line_number,
              text: a.target_phrase
                ? `Line ${a.line_number}: "${a.target_phrase}". ${a.annotation_text || ''}`
                : `Line ${a.line_number}: ${a.annotation_text || ''}`,
            }))}
            onActiveLineChange={setSecondaryActiveLine}
          />

          {/* Right Text / Annotations View */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
            {secondaryLoading ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                Loading comparative page {secondaryPage}...
              </div>
            ) : secondaryAnnotations.length > 0 ? (
              secondaryAnnotations.map((a) => {
                const isSpoken = secondaryActiveLine === a.line_number;
                return (
                  <div
                    key={a.id}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 transition-colors ${
                      isSpoken
                        ? 'bg-sky-950/40 border-sky-400 text-sky-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-sky-400 font-bold mr-2">Line {a.line_number}:</span>
                        <strong className="text-white">{a.target_phrase}</strong>
                      </div>
                      {a.categories && a.categories.length > 0 && (
                        <span className="text-[10px] font-mono text-slate-500">#{a.categories[0]}</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{a.annotation_text}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 border border-slate-800/80 rounded-xl">
                No critical annotations recorded yet for Page {secondaryPage} of {secondaryWorkObj.shortTitle}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
