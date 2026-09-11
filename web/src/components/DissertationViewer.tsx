'use client';

import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  Download,
  Copy,
  Check,
  ExternalLink,
  Search,
  List,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Shield
} from 'lucide-react';
import { getBasePath, GITHUB_REPO_URL } from '@/lib/constants';

interface DissertationViewerProps {
  content: string;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function DissertationViewer({ content }: DissertationViewerProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tocOpen, setTocOpen] = useState(false);

  // Generate Table of Contents from markdown headings
  const toc = useMemo<TocItem[]>(() => {
    const lines = content.split('\n');
    const items: TocItem[] = [];

    for (const line of lines) {
      const h2Match = line.match(/^##\s+(.*)$/);
      if (h2Match) {
        const rawTitle = h2Match[1].replace(/[*_]/g, '').trim();
        const id = rawTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, title: rawTitle, level: 2 });
        continue;
      }

      const h3Match = line.match(/^###\s+(.*)$/);
      if (h3Match) {
        const rawTitle = h3Match[1].replace(/[*_]/g, '').trim();
        const id = rawTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        items.push({ id, title: rawTitle, level: 3 });
      }
    }

    return items;
  }, [content]);

  const filteredToc = useMemo(() => {
    if (!searchTerm.trim()) return toc;
    const term = searchTerm.toLowerCase();
    return toc.filter((t) => t.title.toLowerCase().includes(term));
  }, [toc, searchTerm]);

  const handleCopyCitation = () => {
    const bibtex = `@misc{winnegansfake2026,
  author = {WinnegansFake Initiative},
  title = {The Architecture of the Night Mind: A Polyphonic Dissertation on the Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics of James Joyce's Finnegans Wake},
  year = {2026},
  publisher = {WinnegansFake Open-Source Scholarly Apparatus},
  url = {https://tekromancy.github.io/WinnegansFake/dissertation/}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dissertation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).length;
  }, [content]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="wf-card-surface border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Doctoral-Grade Scholarly Monograph</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Shield className="w-3 h-3" />
                <span>CC BY-SA 4.0</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
              The Architecture of the Night Mind
            </h1>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              A Polyphonic Dissertation on the Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics of James Joyce’s <em>Finnegans Wake</em>.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Length: ~{wordCount.toLocaleString()} words</span>
              <span>&bull;</span>
              <span>Est. Reading Time: ~45 min</span>
              <span>&bull;</span>
              <span>Updated: September 2026</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5">
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download (.md)</span>
            </button>
            <button
              onClick={handleCopyCitation}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              {copiedCitation ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCitation ? 'Copied BibTeX!' : 'Cite Monograph'}</span>
            </button>
            <a
              href={`${GITHUB_REPO_URL}/blob/main/dissertation.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar TOC + Markdown Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Table of Contents */}
        <aside className="lg:col-span-4 sticky top-24 z-20">
          <div className="wf-card-surface border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-semibold">
                  Table of Contents
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                {toc.length} sections
              </span>
            </div>

            {/* TOC Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter chapters & topics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* TOC Link List */}
            <nav className="space-y-1 text-xs">
              {filteredToc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1.5 px-2.5 rounded-lg transition-colors leading-snug ${
                    item.level === 2
                      ? 'font-medium text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 font-serif'
                      : 'text-slate-400 hover:text-white pl-5 text-[11px] font-sans'
                  }`}
                >
                  <div className="flex items-start space-x-1.5">
                    {item.level === 2 ? (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-500/70 flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 flex-shrink-0 mt-1.5" />
                    )}
                    <span>{item.title}</span>
                  </div>
                </a>
              ))}
              {filteredToc.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2 text-center">
                  No matching chapters found.
                </p>
              )}
            </nav>
          </div>
        </aside>

        {/* Dissertation Markdown Article */}
        <main className="lg:col-span-8 wf-reading-surface border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl transition-colors">
          <article className="prose prose-invert prose-emerald max-w-none space-y-6 text-slate-300 font-sans text-sm sm:text-base leading-relaxed wf-reading-surface">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-2xl sm:text-3xl font-serif font-bold text-white border-b border-slate-800 pb-3 mt-8 mb-4 tracking-tight"
                    {...props}
                  />
                ),
                h2: ({ node, children, ...props }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                  return (
                    <h2
                      id={id}
                      className="text-xl sm:text-2xl font-serif font-bold text-emerald-300 border-b border-slate-800/80 pb-2 mt-10 mb-4 tracking-tight scroll-mt-24"
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3: ({ node, children, ...props }) => {
                  const text = String(children);
                  const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                  return (
                    <h3
                      id={id}
                      className="text-lg sm:text-xl font-serif font-semibold text-slate-100 mt-6 mb-3 scroll-mt-24"
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                h4: ({ node, ...props }) => (
                  <h4
                    className="text-base font-serif font-semibold text-slate-200 mt-4 mb-2"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="mb-4 leading-relaxed text-slate-300" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-emerald-500/60 pl-4 py-1.5 my-4 bg-slate-950/60 rounded-r-lg italic text-slate-300 font-serif"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 border border-slate-800 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-slate-950 text-emerald-400 font-mono text-xs border-b border-slate-800" {...props} />
                ),
                th: ({ node, ...props }) => (
                  <th className="p-3 font-semibold tracking-wider" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-3 border-b border-slate-800/60 text-slate-300 align-top" {...props} />
                ),
                code: ({ node, className, children, ...props }) => {
                  return (
                    <code
                      className="font-mono text-xs bg-slate-950 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-800"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre: ({ node, ...props }) => (
                  <pre
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto my-4 text-xs font-mono text-slate-200"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 space-y-1.5 my-3" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5 space-y-1.5 my-3" {...props} />
                ),
                hr: ({ node, ...props }) => (
                  <hr className="border-slate-800 my-8" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                    {...props}
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
