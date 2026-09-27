'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Copy,
  Check,
  Download,
  X,
  FileText,
  Quote,
  Code,
  BookOpen,
} from 'lucide-react';
import { WorkDefinition, AnnotationItem } from '@winnegans/core';

export interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  work: WorkDefinition;
  currentPage: number;
  chapterInfo: { bookTitle?: string; chapterTitle: string; bookRoman?: string };
  annotations: AnnotationItem[];
}

type CitationStyle = 'mla' | 'chicago' | 'apa' | 'bibtex' | 'markdown';

export function CitationModal({
  isOpen,
  onClose,
  work,
  currentPage,
  chapterInfo,
  annotations,
}: CitationModalProps) {
  const [activeTab, setActiveTab] = useState<CitationStyle>('mla');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const paddedPage = String(currentPage).padStart(3, '0');
  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reader?work=${work.id}&page=${currentPage}`
    : `https://winnegansfake.com/reader?work=${work.id}&page=${currentPage}`;

  // Unique scholars cited on this page
  const scholarsCited = Array.from(
    new Set(
      annotations.flatMap((a) => {
        const list: string[] = [];
        if (a.contributors && Array.isArray(a.contributors)) {
          list.push(...a.contributors);
        }
        if (a.sources && Array.isArray(a.sources)) {
          for (const s of a.sources) {
            list.push(s.split('.')[0]);
          }
        }
        const anyA = a as unknown as Record<string, unknown>;
        if (typeof anyA.author === 'string') list.push(anyA.author);
        if (Array.isArray(anyA.citations)) {
          for (const c of anyA.citations) {
            if (typeof c === 'string') list.push(c);
            else if (c && typeof c === 'object' && 'author' in c) {
              list.push(String((c as { author: string }).author));
            }
          }
        }
        return list;
      })
    )
  );

  const authorPrefix =
    scholarsCited.length > 0
      ? `${scholarsCited.slice(0, 2).join(', ')}${scholarsCited.length > 2 ? ', et al.' : ''}`
      : 'WinnegansFake Contributors';

  // MLA 9th Edition
  const mlaCitation = `${authorPrefix}. "Scholarly Glosses on ${work.title} Page ${currentPage} (${chapterInfo.chapterTitle})." WinnegansFake: Modernist Zero-Copyright Annotation Repository, v2.1, 2026, ${currentUrl}. Accessed ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}.`;

  // Chicago 17th Edition (Notes & Bibliography)
  const chicagoCitation = `${authorPrefix}. "Scholarly Apparatus to ${work.title}, Page ${currentPage}." WinnegansFake: Modernist Zero-Copyright Annotation Repository. 2026. ${currentUrl}.`;

  // APA 7th Edition
  const apaCitation = `${authorPrefix}. (2026). Scholarly annotations for ${work.title} (Page ${currentPage}) [Digital critical apparatus]. WinnegansFake. ${currentUrl}`;

  // BibTeX
  const bibtexKey = `winnegans_${work.id}_p${paddedPage}`;
  const bibtexCitation = `@misc{${bibtexKey},
  author       = {${authorPrefix}},
  title        = {Scholarly Apparatus to {${work.title}}, Page ${currentPage} (${chapterInfo.chapterTitle})},
  howpublished = {\\url{${currentUrl}}},
  year         = {2026},
  note         = {WinnegansFake Digital Humanities Corpus v2.1}
}`;

  const divisionLabel = chapterInfo.bookTitle || (chapterInfo.bookRoman ? `Book ${chapterInfo.bookRoman}` : '');
  const divisionHeader = divisionLabel ? `${divisionLabel} • ${chapterInfo.chapterTitle}` : chapterInfo.chapterTitle;

  // Markdown Export
  const markdownExport = `# Scholarly Glosses: ${work.title} — Page ${currentPage}
**Division**: ${divisionHeader}  
**URL**: [${currentUrl}](${currentUrl})  
**Annotations Count**: ${annotations.length}  
**Cited Authorities**: ${scholarsCited.join(', ') || 'Community Scribes'}

---

${annotations
  .map((a) => {
    const anyA = a as unknown as Record<string, unknown>;
    const lemma = a.target_phrase || (typeof anyA.target_text === 'string' ? anyA.target_text : 'Gloss');
    const gloss = a.annotation_text || (typeof anyA.note === 'string' ? anyA.note : '');
    const cats = a.categories || (Array.isArray(anyA.registers) ? anyA.registers : []);
    const contribs = a.contributors?.join(', ') || (typeof anyA.author === 'string' ? anyA.author : '');
    return `### Line ${a.line_number}: "${lemma}"
- **Registers**: ${cats.join(', ') || 'General'}
- **Gloss**: ${gloss}
${contribs ? `- **Attribution/Source**: ${contribs}` : ''}`;
  })
  .join('\n\n')}

---
*Exported from WinnegansFake Digital Humanities Platform on ${new Date().toISOString().split('T')[0]}*
`;

  const getActiveText = (): string => {
    switch (activeTab) {
      case 'mla':
        return mlaCitation;
      case 'chicago':
        return chicagoCitation;
      case 'apa':
        return apaCitation;
      case 'bibtex':
        return bibtexCitation;
      case 'markdown':
        return markdownExport;
    }
  };

  const handleCopy = () => {
    const text = getActiveText();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownExport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${work.id}_page_${paddedPage}_glosses.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="citation-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 id="citation-modal-title" className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>Cite Scholarly Apparatus</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-mono">
                  p. {currentPage}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-serif italic">
                {work.title} • {chapterInfo.chapterTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close citation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex items-center space-x-1 px-6 pt-4 border-b border-slate-800/80 overflow-x-auto">
          {(
            [
              { id: 'mla', label: 'MLA 9th', icon: Quote },
              { id: 'chicago', label: 'Chicago 17th', icon: BookOpen },
              { id: 'apa', label: 'APA 7th', icon: FileText },
              { id: 'bibtex', label: 'BibTeX', icon: Code },
              { id: 'markdown', label: 'Markdown', icon: FileText },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-indigo-500 text-indigo-300 bg-slate-800/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="relative group">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap break-words leading-relaxed select-all">
              {getActiveText()}
            </pre>
          </div>

          {scholarsCited.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">Authorities cited on p. {currentPage}:</span>
              {scholarsCited.map((scholar, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]"
                >
                  {scholar}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/60">
          <div className="text-xs text-slate-400">
            <span>Standard academic citation for digital humanities scholarship.</span>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === 'markdown' && (
              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Citation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
