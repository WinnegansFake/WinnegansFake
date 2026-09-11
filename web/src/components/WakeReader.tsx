'use client';

import React, { useState, useEffect } from 'react';
import { AnnotationItem, PageAnnotationsData } from '@/lib/annotations';
import { InlineEditor } from './InlineEditor';
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  BookOpen,
  FileCode2,
  Bookmark,
  ExternalLink,
  Tag,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Users,
  Info,
  Archive,
  Compass,
  CornerDownRight,
} from 'lucide-react';

interface PageLine {
  line: number;
  text: string;
}

export function WakeReader() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>('1');
  const [lines, setLines] = useState<PageLine[]>([]);
  const [bookInfo, setBookInfo] = useState<{ book: number; chapter: number }>({ book: 1, chapter: 1 });
  const [annotationsData, setAnnotationsData] = useState<PageAnnotationsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sourceAvailable, setSourceAvailable] = useState<boolean>(true);
  const [sourceMessage, setSourceMessage] = useState<string | null>(null);
  const [sourceHtml, setSourceHtml] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'line-indexed' | 'raw-epub'>('line-indexed');

  // Active editor states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingForLine, setIsCreatingForLine] = useState<number | null>(null);
  const [isCreatingInPanel, setIsCreatingInPanel] = useState<boolean>(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch page text, raw EPUB HTML, and annotations directly from .epub
  const loadPageData = async (page: number) => {
    setLoading(true);
    setFeedback(null);
    setEditingId(null);
    setIsCreatingForLine(null);
    setIsCreatingInPanel(false);

    try {
      const [epubRes, annRes] = await Promise.all([
        fetch(`/api/epub?page=${page}`),
        fetch(`/api/annotations?page=${page}`),
      ]);

      let epubJson: any = null;
      let annJson: any = null;

      try {
        epubJson = await epubRes.json();
      } catch (err: any) {
        console.error('Error parsing epub JSON:', err);
      }

      try {
        annJson = await annRes.json();
      } catch (err: any) {
        console.error('Error parsing annotations JSON:', err);
      }

      if (epubRes.ok && epubJson) {
        setLines(epubJson.lines || []);
        setBookInfo({ book: epubJson.book, chapter: epubJson.chapter });
        setSourceHtml(epubJson.html || null);
        setSourceFile(epubJson.source_file || null);
        setSourceAvailable(true);
        setSourceMessage(null);
      } else {
        setSourceAvailable(false);
        setSourceMessage(epubJson?.message || epubJson?.error || `HTTP ${epubRes.status} reading page ${page}`);
      }

      setAnnotationsData(annJson);
    } catch (err: any) {
      console.error('Failed to load page data:', err);
      setFeedback({ type: 'error', message: err?.message || 'Failed to load page data directly from .epub.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData(currentPage);
    setPageInput(String(currentPage));
  }, [currentPage]);

  const goToPage = (p: number) => {
    const valid = Math.max(1, Math.min(628, p));
    setCurrentPage(valid);
    setPageInput(String(valid));
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput.trim(), 10);
    if (!isNaN(p)) {
      goToPage(p);
    } else {
      setPageInput(String(currentPage));
    }
  };

  // Save or update annotation
  const handleSaveAnnotation = async (updated: AnnotationItem) => {
    if (!annotationsData) return;

    const existingIndex = annotationsData.annotations.findIndex((a) => a.id === updated.id);
    const newAnnotations = [...annotationsData.annotations];

    if (existingIndex >= 0) {
      newAnnotations[existingIndex] = updated;
    } else {
      newAnnotations.push(updated);
    }

    const payload: PageAnnotationsData = {
      ...annotationsData,
      annotations: newAnnotations,
    };

    const res = await fetch('/api/annotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();
    if (!res.ok) {
      throw new Error(resJson.details ? resJson.details.join(', ') : resJson.error);
    }

    setAnnotationsData(payload);
    setEditingId(null);
    setIsCreatingForLine(null);
    setIsCreatingInPanel(false);
    setSelectedAnnotationId(updated.id);
    setFeedback({
      type: 'success',
      message: `Annotation saved to annotations/book_${payload.book}/chapter_${payload.chapter}/page_${String(currentPage).padStart(3, '0')}.json`,
    });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Delete annotation
  const handleDeleteAnnotation = async (id: string) => {
    if (!annotationsData) return;
    if (!confirm('Are you sure you want to delete this annotation from the JSON file?')) return;

    const newAnnotations = annotationsData.annotations.filter((a) => a.id !== id);
    const payload: PageAnnotationsData = {
      ...annotationsData,
      annotations: newAnnotations,
    };

    const res = await fetch('/api/annotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const resJson = await res.json();
    if (!res.ok) {
      setFeedback({ type: 'error', message: resJson.error || 'Failed to delete' });
      return;
    }

    setAnnotationsData(payload);
    setEditingId(null);
    if (selectedAnnotationId === id) setSelectedAnnotationId(null);
    setFeedback({ type: 'success', message: 'Annotation deleted successfully.' });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Group annotations by line number
  const annotationsByLine = (annotationsData?.annotations || []).reduce<Record<number, AnnotationItem[]>>(
    (acc, ann) => {
      acc[ann.line_number] = acc[ann.line_number] || [];
      acc[ann.line_number].push(ann);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-serif font-bold text-white shadow-md">
            FW
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-slate-100 leading-none">
              WinnegansFake
            </h1>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Direct .EPUB Stream & Scholarly Annotation Workbench
            </p>
          </div>
        </div>

        {/* Navigation Controls: Jump, Prev, Next, Chapter selects */}
        <div className="flex items-center space-x-3">
          {/* Quick jump input and buttons */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs font-mono shadow-sm">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <form onSubmit={handlePageSubmit} className="flex items-center px-2">
              <span className="text-slate-400 text-xs mr-1 select-none">p.</span>
              <input
                type="number"
                min={1}
                max={628}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageSubmit}
                className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                title="Enter any page number between 1 and 628 and press Enter"
              />
              <span className="text-slate-500 text-xs ml-1 select-none">/ 628</span>
              <button
                type="submit"
                className="ml-1.5 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-mono transition-colors"
                title="Go to page"
              >
                Go
              </button>
            </form>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= 628}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Book Jump Selector */}
          <div className="hidden sm:flex items-center space-x-1 text-xs font-mono">
            <span className="text-slate-500 text-[11px] mr-1">Jump:</span>
            {[
              { label: 'Front (p.1)', page: 1 },
              { label: 'Bk I (p.3)', page: 3 },
              { label: 'Bk II (p.219)', page: 219 },
              { label: 'Bk III (p.403)', page: 403 },
              { label: 'Bk IV (p.593)', page: 593 },
              { label: 'Fin (p.628)', page: 628 },
            ].map((bk) => (
              <button
                key={bk.label}
                onClick={() => goToPage(bk.page)}
                className={`px-2 py-1 rounded text-[11px] transition-colors ${
                  currentPage === bk.page
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {bk.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
            <span className="bg-slate-800/80 px-2 py-1 rounded">
              Book {bookInfo.book}
            </span>
            <span className="bg-slate-800/80 px-2 py-1 rounded">
              Chapter {bookInfo.chapter}
            </span>
          </div>
        </div>

        {/* Safeguard & View Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('line-indexed')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'line-indexed'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line-Indexed
            </button>
            <button
              onClick={() => setViewMode('raw-epub')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'raw-epub'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw EPUB View
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Source: Local .epub Streamed</span>
            <span className="xl:hidden">Local Safe</span>
          </span>
        </div>
      </header>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-6 py-2.5 text-xs flex items-center justify-between border-b transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/80 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Main Reader & Annotation Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
        {/* Left Column: Local Page Reader with Inline Hotspots */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h2 className="font-serif text-sm font-semibold text-slate-200 tracking-wide uppercase">
                  Page {String(currentPage).padStart(3, '0')} of 628
                  {currentPage <= 2 && (
                    <span className="ml-2 text-xs normal-case font-sans text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      Front Matter
                    </span>
                  )}
                </h2>
                {sourceFile && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded">
                    {sourceFile}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 font-mono">
                  {lines.length} lines parsed
                </span>
                <button
                  onClick={() => {
                    setIsCreatingForLine(1);
                    setEditingId(null);
                  }}
                  className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded-lg transition-colors font-mono"
                  title="Create annotation on line 1"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" />
                  Annotate Line 1
                </button>
              </div>
            </div>

            {sourceMessage && (
              <div className="p-3 mb-4 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>{sourceMessage}</span>
              </div>
            )}

            {loading ? (
              <div className="flex-1 flex items-center justify-center py-24 text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
                <span>Reading page directly from local .epub archive...</span>
              </div>
            ) : viewMode === 'raw-epub' && sourceHtml ? (
              /* Raw EPUB render mode */
              <div className="flex-1 flex flex-col">
                <div className="mb-2 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Rendering raw HTML streamed from .epub:</span>
                  <span className="text-indigo-400">{sourceFile}</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl overflow-y-auto max-h-[70vh] font-serif text-slate-200 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sourceHtml.replace(/<head[\s\S]*?<\/head>/i, ''),
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Line-indexed reading & inline annotation mode */
              <div className="font-serif leading-relaxed text-slate-200 space-y-1.5 overflow-y-auto max-h-[72vh] pr-2 scrollbar-thin">
                {lines.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    <p>No line text available for page {String(currentPage).padStart(3, '0')}.</p>
                  </div>
                ) : (
                  lines.map(({ line, text }) => {
                    const lineAnns = annotationsByLine[line] || [];
                    const isAnnotated = lineAnns.length > 0;
                    const isCreatingHere = isCreatingForLine === line;

                    return (
                      <div key={line} className="group relative">
                        <div
                          className={`flex items-start rounded-lg px-2 py-1 transition-colors ${
                            isAnnotated
                              ? 'bg-indigo-950/30 hover:bg-indigo-950/50'
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          {/* Line number gutter */}
                          <div className="w-10 flex-shrink-0 font-mono text-[11px] text-slate-600 group-hover:text-indigo-400 pt-0.5 select-none">
                            {String(line).padStart(2, '0')}
                          </div>

                          {/* Line Text with inline annotation triggers */}
                          <div className="flex-1 text-[15px] text-slate-200 selection:bg-indigo-600 selection:text-white">
                            <span>{text}</span>

                            {/* Inline annotation chips */}
                            {lineAnns.map((ann) => (
                              <button
                                key={ann.id}
                                onClick={() => {
                                  setSelectedAnnotationId(ann.id);
                                  setEditingId(null);
                                  setIsCreatingInPanel(false);
                                }}
                                className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border transition-all ${
                                  selectedAnnotationId === ann.id
                                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                                    : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900'
                                }`}
                                title={ann.target_phrase}
                              >
                                <Bookmark className="w-3 h-3 mr-1" />
                                {ann.target_phrase.length > 18
                                  ? `${ann.target_phrase.slice(0, 18)}…`
                                  : ann.target_phrase}
                              </button>
                            ))}
                          </div>

                          {/* Quick action button to annotate line */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                            <button
                              onClick={() => {
                                setIsCreatingForLine(line);
                                setEditingId(null);
                                setIsCreatingInPanel(false);
                              }}
                              className="text-slate-500 hover:text-indigo-400 p-1 rounded hover:bg-slate-800 transition-colors"
                              title={`Add new annotation to line ${line}`}
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Form when adding annotation directly at this line */}
                        {isCreatingHere && (
                          <InlineEditor
                            pageNumber={currentPage}
                            annotation={{
                              id: '',
                              line_number: line,
                              target_phrase: '',
                              annotation_text: '',
                              categories: ['etymology'],
                              cross_references: [],
                              sources: [],
                              contributors: ['community-scholar'],
                            }}
                            isNew={true}
                            onSave={handleSaveAnnotation}
                            onCancel={() => setIsCreatingForLine(null)}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Annotation Details & JSON Editor Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-indigo-400" />
                <h2 className="font-serif text-sm font-semibold text-slate-200 uppercase tracking-wide">
                  Page {String(currentPage).padStart(3, '0')} Notes ({annotationsData?.annotations.length || 0})
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsCreatingInPanel(true);
                  setEditingId(null);
                  setIsCreatingForLine(null);
                }}
                className="inline-flex items-center text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                New Note
              </button>
            </div>

            {/* List of Annotations for Page & New Note Form */}
            <div className="space-y-4 overflow-y-auto max-h-[72vh] pr-1 scrollbar-thin">
              {/* If user clicked 'New Note' button in top panel */}
              {isCreatingInPanel && (
                <InlineEditor
                  pageNumber={currentPage}
                  annotation={{
                    id: '',
                    line_number: 1,
                    target_phrase: '',
                    annotation_text: '',
                    categories: currentPage <= 2 ? ['front-matter'] : ['etymology'],
                    cross_references: [],
                    sources: [],
                    contributors: ['community-scholar'],
                  }}
                  isNew={true}
                  onSave={handleSaveAnnotation}
                  onCancel={() => setIsCreatingInPanel(false)}
                />
              )}

              {annotationsData?.annotations.length === 0 && !isCreatingInPanel ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                  <p className="font-medium text-slate-400">No annotations on page {String(currentPage).padStart(3, '0')} yet.</p>
                  <p className="mt-1 text-slate-600">
                    Click "New Note" above or click the + icon next to any line in the text to begin the first annotation for this page.
                  </p>
                  <button
                    onClick={() => setIsCreatingInPanel(true)}
                    className="mt-4 inline-flex items-center text-xs text-white bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 rounded-lg font-medium transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Begin First Annotation
                  </button>
                </div>
              ) : (
                annotationsData?.annotations.map((ann) => {
                  const isEditingThis = editingId === ann.id;
                  const isSelected = selectedAnnotationId === ann.id;

                  if (isEditingThis) {
                    return (
                      <InlineEditor
                        key={ann.id}
                        pageNumber={currentPage}
                        annotation={ann}
                        isNew={false}
                        onSave={handleSaveAnnotation}
                        onDelete={handleDeleteAnnotation}
                        onCancel={() => setEditingId(null)}
                      />
                    );
                  }

                  return (
                    <div
                      key={ann.id}
                      onClick={() => setSelectedAnnotationId(ann.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-indigo-500 shadow-lg'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/70 border border-indigo-500/30 px-2 py-0.5 rounded">
                            {ann.id}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            Line {ann.line_number}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(ann.id);
                            setIsCreatingInPanel(false);
                          }}
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="font-mono text-sm font-semibold text-amber-300/90 mb-2">
                        "{ann.target_phrase}"
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed font-sans mb-3">
                        {ann.annotation_text}
                      </p>

                      {/* Tags and categories */}
                      {ann.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {ann.categories.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1 text-slate-500" />
                              {c}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Cross references */}
                      {ann.cross_references && ann.cross_references.length > 0 && (
                        <div className="text-[11px] font-mono text-slate-500 mb-2">
                          <span>Refs: </span>
                          {ann.cross_references.map((ref) => (
                            <button
                              key={ref}
                              onClick={(e) => {
                                e.stopPropagation();
                                const p = parseInt(ref.split('.')[0], 10);
                                if (!isNaN(p)) goToPage(p);
                              }}
                              className="text-indigo-400 hover:underline mr-2"
                            >
                              {ref}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Contributors footer */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {ann.contributors.join(', ')}
                        </span>
                        <span className="text-[10px] text-slate-600">CC BY-SA 4.0</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
