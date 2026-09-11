'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Shield,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  X,
  ArrowUp,
  ArrowLeft,
  Book,
} from 'lucide-react';
import Link from 'next/link';
import { getBasePath, GITHUB_REPO_URL, type DissertationDefinition } from '@/lib/constants';

interface DissertationViewerProps {
  content: string;
  dissertation?: DissertationDefinition;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export function DissertationViewer({ content, dissertation }: DissertationViewerProps) {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tocOpen, setTocOpen] = useState(false);

  // Fullscreen zen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenFontSize, setFullscreenFontSize] = useState(18);
  const [fullscreenShowToc, setFullscreenShowToc] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Keyboard navigation & Fullscreen shortcut (F to toggle, Esc to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (fullscreenShowToc) {
          setFullscreenShowToc(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      } else if (isFullscreen) {
        if (e.key === '+' || e.key === '=') {
          setFullscreenFontSize((prev) => Math.min(26, prev + 2));
        } else if (e.key === '-' || e.key === '_') {
          setFullscreenFontSize((prev) => Math.max(14, prev - 2));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, fullscreenShowToc]);

  // Sync state if user exits native fullscreen via browser Esc
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

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
    let bibtex = '';
    if (dissertation) {
      const citeKey = `${dissertation.author.split(' ').pop()?.toLowerCase() || 'dissertation'}${dissertation.year}`;
      bibtex = `@phdthesis{${citeKey},
  author = {${dissertation.author}},
  title = {${dissertation.title}},
  school = {${dissertation.institution}},
  year = {${dissertation.year}},
  url = {https://tekromancy.github.io/WinnegansFake/dissertations/${dissertation.slug}/}${dissertation.doi ? `,\n  doi = {${dissertation.doi}}` : ''}
}`;
    } else {
      bibtex = `@misc{winnegansfake2026,
  author = {WinnegansFake Initiative},
  title = {The Architecture of the Night Mind: A Polyphonic Dissertation on the Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics of James Joyce's Finnegans Wake},
  year = {2026},
  publisher = {WinnegansFake Open-Source Scholarly Apparatus},
  url = {https://tekromancy.github.io/WinnegansFake/dissertation/}
}`;
    }
    navigator.clipboard.writeText(bibtex);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handleDownload = () => {
    const filename = dissertation ? `${dissertation.slug}.md` : 'dissertation.md';
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = useMemo(() => {
    return content.trim().split(/\s+/).length;
  }, [content]);

  const markdownComponents = useMemo(() => ({
    h1: ({ node, ...props }: any) => (
      <h1
        className="text-2xl sm:text-3xl font-serif font-bold text-white border-b border-slate-800 pb-3 mt-8 mb-4 tracking-tight"
        {...props}
      />
    ),
    h2: ({ node, children, ...props }: any) => {
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
    h3: ({ node, children, ...props }: any) => {
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
    h4: ({ node, ...props }: any) => (
      <h4
        className="text-base font-serif font-semibold text-slate-200 mt-4 mb-2"
        {...props}
      />
    ),
    p: ({ node, ...props }: any) => (
      <p className="mb-4 leading-relaxed text-slate-300" {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <blockquote
        className="border-l-4 border-emerald-500/60 pl-4 py-1.5 my-4 bg-slate-950/60 rounded-r-lg italic text-slate-300 font-serif"
        {...props}
      />
    ),
    table: ({ node, ...props }: any) => (
      <div className="overflow-x-auto my-6 border border-slate-800 rounded-xl">
        <table className="w-full text-left border-collapse text-xs sm:text-sm" {...props} />
      </div>
    ),
    thead: ({ node, ...props }: any) => (
      <thead className="bg-slate-950 text-emerald-400 font-mono text-xs border-b border-slate-800" {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th className="p-3 font-semibold tracking-wider" {...props} />
    ),
    td: ({ node, ...props }: any) => (
      <td className="p-3 border-b border-slate-800/60 text-slate-300 align-top" {...props} />
    ),
    code: ({ node, className, children, ...props }: any) => {
      return (
        <code
          className="font-mono text-xs bg-slate-950 text-emerald-300 px-1.5 py-0.5 rounded border border-slate-800"
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ node, ...props }: any) => (
      <pre
        className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto my-4 text-xs font-mono text-slate-200"
        {...props}
      />
    ),
    ul: ({ node, ...props }: any) => (
      <ul className="list-disc pl-5 space-y-1.5 my-3" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol className="list-decimal pl-5 space-y-1.5 my-3" {...props} />
    ),
    hr: ({ node, ...props }: any) => (
      <hr className="border-slate-800 my-8" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <a
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        {...props}
      />
    ),
    img: ({ node, src, alt, ...props }: any) => {
      let resolvedSrc = src || '';
      if (resolvedSrc.startsWith('figures/')) {
        resolvedSrc = `${getBasePath()}/${resolvedSrc}`;
      } else if (resolvedSrc.startsWith('/figures/')) {
        resolvedSrc = `${getBasePath()}${resolvedSrc}`;
      }
      return (
        <figure className="my-8 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
          <img
            src={resolvedSrc}
            alt={alt || 'Figure illustration'}
            className="w-full h-auto max-h-[620px] object-contain mx-auto block"
            loading="lazy"
            {...props}
          />
          {alt && (
            <figcaption className="px-4 py-2.5 text-center text-xs font-mono text-slate-400 bg-slate-900/60 border-t border-slate-800/80">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
  }), []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="wf-card-surface border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8 transition-colors">
        {dissertation && (
          <div className="mb-4">
            <Link
              href="/dissertations"
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dissertations Library</span>
            </Link>
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{dissertation?.degree || 'Doctoral-Grade Scholarly Monograph'}</span>
              </span>
              {dissertation?.field && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  <span>{dissertation.field}</span>
                </span>
              )}
              {dissertation?.targetWorks && dissertation.targetWorks.map((workId) => (
                <span
                  key={workId}
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase"
                >
                  <Book className="w-3 h-3" />
                  <span>{workId.replace(/-/g, ' ')}</span>
                </span>
              ))}
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Shield className="w-3 h-3" />
                <span>CC BY-SA 4.0</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-white leading-tight">
              {dissertation?.title || 'The Architecture of the Night Mind'}
            </h1>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              {dissertation?.subtitle || (
                <>A Polyphonic Dissertation on the Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics of James Joyce’s <em>Finnegans Wake</em>.</>
              )}
            </p>
            {dissertation && (
              <p className="text-xs font-mono text-emerald-400 font-semibold">
                {dissertation.author} &bull; {dissertation.institution} {dissertation.defenseDate ? `(Defended: ${dissertation.defenseDate})` : `(${dissertation.year})`}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Length: ~{wordCount.toLocaleString()} words</span>
              <span>&bull;</span>
              <span>Est. Reading Time: ~{Math.ceil(wordCount / 220)} min</span>
              <span>&bull;</span>
              <span>Year: {dissertation?.year || 2026}</span>
              {dissertation?.doi && (
                <>
                  <span>&bull;</span>
                  <span className="text-slate-400">DOI: {dissertation.doi}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
              title="Read Monograph in Fullscreen Zen Mode (Press F)"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Read Fullscreen</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
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
              href={`${GITHUB_REPO_URL}/blob/main/${dissertation ? `dissertations/${dissertation.filePath}` : 'dissertation.md'}`}
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </article>
        </main>
      </div>

      {/* Fullscreen Zen Reading Mode Overlay */}
      {isFullscreen && (
        <div
          role="region"
          aria-label="Fullscreen Dissertation Reader"
          className="fixed inset-0 z-50 overflow-y-auto wf-fullscreen-overlay flex flex-col select-text transition-colors"
        >
          {/* Zen Top Header */}
          <header className="sticky top-0 z-40 wf-nav-surface backdrop-blur-md border-b border-inherit/40 px-4 sm:px-8 py-3 flex items-center justify-between shadow-md transition-colors">
            {/* Left: Monograph Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-sm sm:text-base leading-tight truncate max-w-xs sm:max-w-md md:max-w-xl">
                  The Architecture of the Night Mind
                </h1>
                <p className="text-[11px] opacity-70 italic truncate">
                  Monograph &bull; ~{wordCount.toLocaleString()} words &bull; CC BY-SA 4.0
                </p>
              </div>
            </div>

            {/* Right: Controls & Exit */}
            <div className="flex items-center space-x-2">
              {/* Table of Contents Toggle */}
              <button
                type="button"
                onClick={() => setFullscreenShowToc(!fullscreenShowToc)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  fullscreenShowToc
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'border-inherit/40 hover:bg-inherit/40'
                }`}
                title="Toggle Table of Contents drawer"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Contents ({toc.length})</span>
              </button>

              {/* Font Size Zoom */}
              <div className="hidden sm:flex items-center space-x-1 border border-inherit/30 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setFullscreenFontSize((prev) => Math.max(14, prev - 2))}
                  className="p-1 rounded hover:bg-inherit/60 transition-colors"
                  title="Decrease font size (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 select-none">
                  {fullscreenFontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setFullscreenFontSize((prev) => Math.min(26, prev + 2))}
                  className="p-1 rounded hover:bg-inherit/60 transition-colors"
                  title="Increase font size (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exit Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                title="Exit Fullscreen (Esc or F)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </header>

          {/* Fullscreen Body */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-8 gap-8 items-start">
            {/* Reading Column */}
            <main
              className={`flex-1 transition-all mx-auto ${
                fullscreenShowToc ? 'max-w-3xl' : 'max-w-4xl'
              }`}
            >
              <article
                style={{
                  fontSize: `${fullscreenFontSize}px`,
                  lineHeight: '1.8',
                }}
                className="prose prose-invert prose-emerald max-w-none space-y-6 font-sans leading-relaxed wf-reading-surface p-6 sm:p-12 rounded-2xl wf-card-surface border shadow-2xl transition-colors"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {content}
                </ReactMarkdown>
              </article>
            </main>

            {/* Slide-in TOC Drawer */}
            {fullscreenShowToc && (
              <aside className="w-80 sm:w-96 flex-shrink-0 p-5 rounded-2xl wf-card-surface border shadow-2xl space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto sticky top-20 animate-in slide-in-from-right-10 duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-inherit/40">
                  <div className="flex items-center space-x-2">
                    <List className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-semibold text-xs">
                      Table of Contents ({toc.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setFullscreenShowToc(false)}
                    className="p-1 rounded opacity-60 hover:opacity-100"
                    title="Close Table of Contents"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 opacity-50" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter sections..."
                    className="w-full bg-inherit/40 border border-inherit/30 rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder-inherit/50 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <nav className="space-y-1 text-xs">
                  {filteredToc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setFullscreenShowToc(false)}
                      className={`block py-1.5 px-2.5 rounded-lg transition-colors leading-snug ${
                        item.level === 2
                          ? 'font-medium hover:text-emerald-300 hover:bg-inherit/40 font-serif'
                          : 'opacity-75 hover:opacity-100 pl-5 text-[11px] font-sans'
                      }`}
                    >
                      <div className="flex items-start space-x-1.5">
                        {item.level === 2 ? (
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500/70 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 flex-shrink-0 mt-1.5" />
                        )}
                        <span>{item.title}</span>
                      </div>
                    </a>
                  ))}
                </nav>
              </aside>
            )}
          </div>

          {/* Floating Zen Pill at bottom */}
          <footer className="sticky bottom-4 z-40 flex justify-center pointer-events-none pb-2">
            <div className="pointer-events-auto flex items-center space-x-3 px-5 py-2.5 rounded-full wf-card-surface border shadow-2xl backdrop-blur-lg text-xs">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity"
                title="Back to Top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Top</span>
              </button>
              <span className="opacity-30">&bull;</span>
              <button
                onClick={() => setFullscreenShowToc(!fullscreenShowToc)}
                className="flex items-center space-x-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <List className="w-3.5 h-3.5" />
                <span>Contents</span>
              </button>
              <span className="opacity-30">&bull;</span>
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-1 text-emerald-400 hover:underline font-mono"
                title="Exit Fullscreen (Esc or F)"
              >
                <span>Exit [Esc]</span>
              </button>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
