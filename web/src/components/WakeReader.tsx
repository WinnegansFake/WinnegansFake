'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnnotationItem, PageAnnotationsData, PageLine } from '@/types/annotations';
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
  UploadCloud,
  FileUp,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  getBasePath,
  getBookAndChapterInfo,
  ANALYTICAL_REGISTERS,
  ARCHIVE_EPUB_URL,
  GITHUB_REPO_URL
} from '@/lib/constants';
import { browserEpub, ParsedEpubPage } from '@/lib/epubReader';

export function WakeReader() {
  const [currentPage, setCurrentPage] = useState<number>(3);
  const [pageInput, setPageInput] = useState<string>('3');
  const [lines, setLines] = useState<PageLine[]>([]);
  const [annotationsData, setAnnotationsData] = useState<PageAnnotationsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [epubLoaded, setEpubLoaded] = useState<boolean>(false);
  const [epubFileName, setEpubFileName] = useState<string>('');
  const [rawHtml, setRawHtml] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'line-indexed' | 'raw-epub'>('line-indexed');

  // Filters & search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegister, setSelectedRegister] = useState<string>('all');

  // Active editor states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreatingForLine, setIsCreatingForLine] = useState<number | null>(null);
  const [isCreatingInPanel, setIsCreatingInPanel] = useState<boolean>(false);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load annotations from static JSON file
  const loadPageData = async (page: number) => {
    setLoading(true);
    setFeedback(null);
    setEditingId(null);
    setIsCreatingForLine(null);
    setIsCreatingInPanel(false);

    const padPage = String(page).padStart(3, '0');
    const basePath = getBasePath();
    const annUrl = `${basePath}/annotations/page_${padPage}.json`;

    try {
      const res = await fetch(annUrl);
      if (res.ok) {
        const json = await res.json();
        setAnnotationsData(json);
      } else {
        // Create empty structure if file not found
        const { book, chapter } = getBookAndChapterInfo(page);
        setAnnotationsData({
          schema_version: '1.0.0',
          book,
          chapter,
          page_number: page,
          annotations: [],
        });
      }
    } catch (err: any) {
      console.error('Failed to load annotations:', err);
      const { book, chapter } = getBookAndChapterInfo(page);
      setAnnotationsData({
        schema_version: '1.0.0',
        book,
        chapter,
        page_number: page,
        annotations: [],
      });
    }

    // If EPUB is loaded in browser memory, load text
    if (browserEpub.isLoaded()) {
      const pageData = await browserEpub.getPage(page);
      if (pageData) {
        setLines(pageData.lines);
        setRawHtml(pageData.rawHtml);
      }
    }

    setLoading(false);
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

  // Handle EPUB file upload
  const handleEpubFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setLoading(true);
      setFeedback({ type: 'info', message: `Unpacking and indexing ${file.name} in browser memory...` });
      const pageCount = await browserEpub.parseFile(file, file.name);
      setEpubLoaded(true);
      setEpubFileName(file.name);

      const pageData = await browserEpub.getPage(currentPage);
      if (pageData) {
        setLines(pageData.lines);
        setRawHtml(pageData.rawHtml);
      }

      setFeedback({
        type: 'success',
        message: `Successfully loaded ${file.name} (${pageCount} pages parsed). Book text is now rendered side-by-side with annotations!`,
      });
    } catch (err: any) {
      console.error('Error parsing EPUB:', err);
      setFeedback({
        type: 'error',
        message: `Failed to parse EPUB archive: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Save annotation (in-memory update with export capability)
  const handleSaveAnnotation = async (updated: AnnotationItem) => {
    if (!annotationsData) return;

    const existingIndex = annotationsData.annotations.findIndex((a) => a.id === updated.id);
    const newAnnotations = [...annotationsData.annotations];

    if (existingIndex >= 0) {
      newAnnotations[existingIndex] = updated;
    } else {
      newAnnotations.push(updated);
    }
    newAnnotations.sort((a, b) => a.line_number - b.line_number);

    const payload: PageAnnotationsData = {
      ...annotationsData,
      annotations: newAnnotations,
    };

    setAnnotationsData(payload);
    setEditingId(null);
    setIsCreatingForLine(null);
    setIsCreatingInPanel(false);
    setSelectedAnnotationId(updated.id);

    setFeedback({
      type: 'success',
      message: `Annotation ${updated.id} drafted in browser! Click "Export JSON" to download the updated page file, or copy the PR snippet.`,
    });
  };

  const handleDeleteAnnotation = async (id: string) => {
    if (!annotationsData) return;
    if (!confirm('Remove this annotation from the current view?')) return;

    const newAnnotations = annotationsData.annotations.filter((a) => a.id !== id);
    setAnnotationsData({
      ...annotationsData,
      annotations: newAnnotations,
    });
    setFeedback({ type: 'info', message: 'Annotation removed from current view.' });
  };

  const exportCurrentPageJson = () => {
    if (!annotationsData) return;
    const jsonStr = JSON.stringify(annotationsData, null, 2) + '\n';
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page_${String(currentPage).padStart(3, '0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyAnnotationSnippet = (ann: AnnotationItem) => {
    navigator.clipboard.writeText(JSON.stringify(ann, null, 2));
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  // Filtered annotations
  const filteredAnnotations = (annotationsData?.annotations || []).filter((ann) => {
    const matchesSearch =
      !searchQuery.trim() ||
      ann.target_phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.annotation_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegister =
      selectedRegister === 'all' ||
      ann.categories.includes(selectedRegister);

    return matchesSearch && matchesRegister;
  });

  const bookInfo = getBookAndChapterInfo(currentPage);

  return (
    <div className="flex flex-col flex-1 min-h-screen transition-colors" style={{ backgroundColor: 'var(--wf-bg)' }}>
      {/* 1. Header Toolbar */}
      <header className="sticky top-16 z-30 wf-card-surface backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-md transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Book & Chapter Breadcrumb */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base text-emerald-400">
                Book {bookInfo.bookRoman}, Chapter {bookInfo.chapter}
              </span>
              <span className="hidden sm:inline text-slate-500">&bull;</span>
              <span className="hidden sm:inline text-xs text-slate-400 italic truncate max-w-[220px]">
                {bookInfo.chapterTitle}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Joyce Page {currentPage} / 628
            </span>
          </div>

          {/* Center: Page Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Previous Page (p)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handlePageSubmit} className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400 font-mono">Page</span>
              <input
                type="number"
                min={1}
                max={628}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-center text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-2 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                Go
              </button>
            </form>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= 628}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
              title="Next Page (n)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: EPUB Loader & View Controls */}
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleEpubFileUpload}
              accept=".epub"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                epubLoaded
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>{epubLoaded ? 'EPUB Loaded' : 'Load Local EPUB'}</span>
            </button>

            <button
              onClick={exportCurrentPageJson}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Download page JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => setIsCreatingInPanel(!isCreatingInPanel)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Note</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Feedback Alert Banner */}
      {feedback && (
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          feedback.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            : feedback.type === 'error'
            ? 'bg-red-950/80 border-red-500/40 text-red-200'
            : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center space-x-2 w-full">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white text-xs">
            &times;
          </button>
        </div>
      )}

      {/* 3. Main Split View: Left = Book Lines, Right = Annotations */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* LEFT COLUMN: Book Text (or Local EPUB Prompt) */}
        <section className="lg:col-span-7 wf-reader-viewport border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">
                JOYCE CANONICAL TEXT (PAGE {String(currentPage).padStart(3, '0')})
              </span>
            </div>
            {epubLoaded && (
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                Loaded: {epubFileName}
              </span>
            )}
          </div>

          {/* If EPUB is NOT loaded, show friendly notice and instructions */}
          {!epubLoaded ? (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>U.S. Copyright Protection Notice (Title 17 U.S.C. § 107)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <em>Finnegans Wake</em> is protected under U.S. copyright law through <strong>December 31, 2035</strong>. To ensure complete legal compliance, this static website does not host or distribute the copyrighted book text.
                </p>
                <p className="text-slate-300 leading-relaxed">
                  All <strong>scholarly annotations and glosses</strong> are 100% open-source and displayed in the right panel. To read the authentic book text alongside these annotations, you have two zero-friction options:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                    <div className="font-semibold text-white text-xs flex items-center space-x-1.5">
                      <FileUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Option 1: Load Local EPUB</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Download the public scan from Archive.org, then click below to unzip and read in your browser:
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all"
                    >
                      Select finneganswake00joycuoft.epub
                    </button>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                    <div className="font-semibold text-white text-xs flex items-center space-x-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Option 2: Download Scan</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Grab the 1.5MB EPUB archive from Internet Archive directly to your laptop:
                    </p>
                    <a
                      href={ARCHIVE_EPUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                    >
                      Download EPUB from Archive.org
                    </a>
                  </div>
                </div>
              </div>

              {/* Annotated Lines Preview */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Lines on Page {String(currentPage).padStart(3, '0')} with Annotations:
                </h4>
                {annotationsData && annotationsData.annotations.length > 0 ? (
                  <div className="space-y-2 font-mono text-xs">
                    {annotationsData.annotations.map((ann) => (
                      <div
                        key={ann.id}
                        onClick={() => setSelectedAnnotationId(ann.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedAnnotationId === ann.id
                            ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                          <span className="text-emerald-400 font-bold">
                            Line {String(ann.line_number).padStart(2, '0')} ({String(currentPage).padStart(3, '0')}.{String(ann.line_number).padStart(2, '0')})
                          </span>
                          <span className="text-[10px] text-slate-500">{ann.id}</span>
                        </div>
                        <div className="text-amber-200 font-serif text-sm">
                          &ldquo;{ann.target_phrase}&rdquo;
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No annotations recorded for page {currentPage} yet. Be the first to add one!
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* EPUB IS LOADED: Render the line segmented text */
            <div className="space-y-1.5 font-serif text-sm leading-relaxed select-text">
              {lines.map((l) => {
                const lineAnns = (annotationsData?.annotations || []).filter((a) => a.line_number === l.line);
                const hasAnns = lineAnns.length > 0;
                const isSelected = lineAnns.some((a) => a.id === selectedAnnotationId);

                return (
                  <div
                    key={l.line}
                    className={`group flex items-start py-1 px-2 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/50 border border-emerald-500/40'
                        : hasAnns
                        ? 'hover:bg-slate-800/60'
                        : 'hover:bg-slate-900'
                    }`}
                  >
                    <span className="font-mono text-[11px] wf-reader-coord w-8 flex-shrink-0 select-none pt-0.5">
                      {String(l.line).padStart(2, '0')}
                    </span>
                    <p className="flex-1 font-serif wf-reader-line">
                      {l.text}
                    </p>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <button
                        onClick={() => setIsCreatingForLine(l.line)}
                        className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
                        title="Add annotation for this line"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {hasAnns && (
                      <span className="ml-2 flex-shrink-0 select-none">
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          {lineAnns.length} note{lineAnns.length > 1 ? 's' : ''}
                        </span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Scholarly Annotations Corpus */}
        <section className="lg:col-span-5 wf-card-surface border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">
                SCHOLARLY ANNOTATIONS ({filteredAnnotations.length})
              </span>
            </div>
          </div>

          {/* Search & Register Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lemmas, glosses, coordinates..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <select
                value={selectedRegister}
                onChange={(e) => setSelectedRegister(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 font-sans"
              >
                <option value="all">All Analytical Registers</option>
                {ANALYTICAL_REGISTERS.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* New Annotation Form Modal / Accordion */}
          {(isCreatingInPanel || isCreatingForLine !== null) && (
            <InlineEditor
              pageNumber={currentPage}
              annotation={{
                id: `${String(currentPage).padStart(3, '0')}.${String(isCreatingForLine || 1).padStart(2, '0')}-${Math.random().toString(16).substring(2, 6)}`,
                line_number: isCreatingForLine || 1,
                target_phrase: '',
                annotation_text: '',
                categories: ['etymological-polyglot'],
                contributors: ['joycean-scholar'],
              }}
              isNew={true}
              onSave={handleSaveAnnotation}
              onCancel={() => {
                setIsCreatingInPanel(false);
                setIsCreatingForLine(null);
              }}
            />
          )}

          {/* Annotations List */}
          <div className="space-y-4 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
            {filteredAnnotations.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs italic space-y-2 border border-dashed border-slate-800 rounded-xl">
                <p>No annotations match your active query on page {currentPage}.</p>
                <button
                  onClick={() => setIsCreatingInPanel(true)}
                  className="text-emerald-400 hover:underline text-xs"
                >
                  + Add an annotation for this page
                </button>
              </div>
            ) : (
              filteredAnnotations.map((ann) => {
                const isSelected = selectedAnnotationId === ann.id;
                const isEditing = editingId === ann.id;

                if (isEditing) {
                  return (
                    <InlineEditor
                      key={ann.id}
                      pageNumber={currentPage}
                      annotation={ann}
                      onSave={handleSaveAnnotation}
                      onDelete={handleDeleteAnnotation}
                      onCancel={() => setEditingId(null)}
                    />
                  );
                }

                return (
                  <div
                    key={ann.id}
                    id={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    className={`p-4 rounded-xl border transition-all text-xs font-sans space-y-2.5 ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/50 shadow-lg'
                        : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {/* Header: Coordinate + ID */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                          Line {String(ann.line_number).padStart(2, '0')}
                        </span>
                        <span className="font-mono text-slate-500 text-[10px]">
                          {ann.id}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAnnotationSnippet(ann);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-slate-300"
                          title="Copy JSON snippet"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(ann.id);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    {/* Target Phrase */}
                    <div className="font-serif text-sm font-semibold text-amber-200">
                      &ldquo;{ann.target_phrase}&rdquo;
                    </div>

                    {/* Gloss Body */}
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {ann.annotation_text}
                    </p>

                    {/* Badges / Categories */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {ann.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Cross references */}
                    {ann.cross_references && ann.cross_references.length > 0 && (
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono pt-1">
                        <CornerDownRight className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        <span>Refs: </span>
                        {ann.cross_references.map((ref) => {
                          const refPage = parseInt(ref.split('.')[0], 10);
                          return (
                            <button
                              key={ref}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isNaN(refPage)) goToPage(refPage);
                              }}
                              className="text-indigo-400 hover:underline hover:text-indigo-300"
                            >
                              {ref}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Academic Sources */}
                    {ann.sources && ann.sources.length > 0 && (
                      <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-900">
                        Source: {ann.sources.join('; ')}
                      </div>
                    )}

                    {/* Contributors */}
                    <div className="text-[10px] text-slate-600 font-mono">
                      By: {ann.contributors.join(', ')}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
