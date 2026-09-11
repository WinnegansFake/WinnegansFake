'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnnotationItem, PageAnnotationsData, PageLine } from '@/types/annotations';
import { InlineEditor } from './InlineEditor';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
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
  AlertCircle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Type,
  X,
  ArrowUpDown,
  SlidersHorizontal,
  RotateCcw,
  FolderTree,
  GraduationCap
} from 'lucide-react';
import {
  getBasePath,
  getBookAndChapterInfo,
  ANALYTICAL_REGISTERS,
  ARCHIVE_EPUB_URL,
  GITHUB_REPO_URL
} from '@/lib/constants';
import {
  LayerGroupMode,
  AnnotationSortMode,
  AnnotationLayerGroup,
  extractPrimaryAuthor,
  getPrimaryRegisterId,
  getUniqueAuthors,
  getUniqueTags,
  groupAndSortAnnotations,
} from '@/lib/annotationLayers';
import { browserEpub, ParsedEpubPage } from '@/lib/epubReader';
import { AnnotationHoverPopup, HoverPopupData } from './AnnotationHoverPopup';
import { segmentAnnotatedLine } from '@/lib/lineAnnotator';

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

  // Fullscreen & Reading View states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [fullscreenFontSize, setFullscreenFontSize] = useState<number>(18);
  const [fullscreenShowNotes, setFullscreenShowNotes] = useState<boolean>(false);
  const [hoverPopup, setHoverPopup] = useState<HoverPopupData | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filters, layers & sorting
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegister, setSelectedRegister] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [layerGroupBy, setLayerGroupBy] = useState<LayerGroupMode>('none');
  const [sortBy, setSortBy] = useState<AnnotationSortMode>('line-asc');
  const [collapsedLayers, setCollapsedLayers] = useState<Record<string, boolean>>({});

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

  // Annotations layering, filtering & metadata extraction
  const allPageAnnotations = useMemo(() => annotationsData?.annotations || [], [annotationsData]);

  const availableAuthors = useMemo(() => getUniqueAuthors(allPageAnnotations), [allPageAnnotations]);
  const availableTags = useMemo(() => getUniqueTags(allPageAnnotations), [allPageAnnotations]);

  const annotationLayers = useMemo(() => {
    return groupAndSortAnnotations(allPageAnnotations, {
      groupBy: layerGroupBy,
      sortBy,
      searchQuery,
      selectedAuthor,
      selectedTag,
      selectedRegister,
    });
  }, [allPageAnnotations, layerGroupBy, sortBy, searchQuery, selectedAuthor, selectedTag, selectedRegister]);

  const filteredAnnotations = useMemo(() => {
    if (layerGroupBy === 'none') {
      return annotationLayers[0]?.items || [];
    }
    const seen = new Set<string>();
    const list: AnnotationItem[] = [];
    for (const group of annotationLayers) {
      for (const item of group.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          list.push(item);
        }
      }
    }
    return list;
  }, [annotationLayers, layerGroupBy]);

  const totalFilteredCount = filteredAnnotations.length;

  const toggleLayerCollapse = (layerId: string) => {
    setCollapsedLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const expandAllLayers = () => {
    setCollapsedLayers({});
  };

  const collapseAllLayers = () => {
    const next: Record<string, boolean> = {};
    for (const group of annotationLayers) {
      next[group.id] = true;
    }
    setCollapsedLayers(next);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedRegister !== 'all' ||
    selectedAuthor !== 'all' ||
    selectedTag !== 'all'
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegister('all');
    setSelectedAuthor('all');
    setSelectedTag('all');
  };

  // Hover popup handlers
  const handlePhraseMouseEnter = (
    phrase: string,
    lineNumber: number,
    annotations: AnnotationItem[],
    targetEl: HTMLElement
  ) => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
    const rect = targetEl.getBoundingClientRect();
    setHoverPopup({
      phrase,
      pageNumber: currentPage,
      lineNumber,
      annotations,
      anchorRect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      },
    });
  };

  const handlePhraseMouseLeave = () => {
    popupTimeoutRef.current = setTimeout(() => {
      setHoverPopup(null);
    }, 220);
  };

  const handlePopupMouseEnter = () => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current);
      popupTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    popupTimeoutRef.current = setTimeout(() => {
      setHoverPopup(null);
    }, 220);
  };

  const handleSelectAnnotationFromPopup = (id: string) => {
    setSelectedAnnotationId(id);
    // Expand layer if currently collapsed
    setCollapsedLayers((prev) => {
      const updated = { ...prev };
      for (const group of annotationLayers) {
        if (group.items.some((item) => item.id === id) && updated[group.id]) {
          delete updated[group.id];
        }
      }
      return updated;
    });

    if (isFullscreen) {
      setFullscreenShowNotes(true);
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  };

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
        if (hoverPopup) {
          setHoverPopup(null);
        } else if (isFullscreen) {
          setIsFullscreen(false);
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      } else if (isFullscreen) {
        if (e.key === 'ArrowRight' || e.key === 'n') {
          goToPage(currentPage + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'p') {
          goToPage(currentPage - 1);
        } else if (e.key === '+' || e.key === '=') {
          setFullscreenFontSize((prev) => Math.min(26, prev + 2));
        } else if (e.key === '-' || e.key === '_') {
          setFullscreenFontSize((prev) => Math.max(14, prev - 2));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, hoverPopup, currentPage]);

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

  // Render annotated line with hover popups
  const renderAnnotatedLineText = (l: PageLine, lineAnns: AnnotationItem[]) => {
    const segments = segmentAnnotatedLine(l.text, lineAnns);
    return (
      <p className="flex-1 font-serif wf-reader-line">
        {segments.map((seg, idx) => {
          if (seg.type === 'text') {
            return <span key={idx}>{seg.text}</span>;
          }
          return (
            <span
              key={idx}
              tabIndex={0}
              role="button"
              className="wf-annotated-phrase"
              title={`Hover to see ${seg.annotations.length} annotation${seg.annotations.length > 1 ? 's' : ''}`}
              onMouseEnter={(e) =>
                handlePhraseMouseEnter(seg.phrase, l.line, seg.annotations, e.currentTarget)
              }
              onMouseLeave={handlePhraseMouseLeave}
              onFocus={(e) =>
                handlePhraseMouseEnter(seg.phrase, l.line, seg.annotations, e.currentTarget)
              }
              onBlur={handlePhraseMouseLeave}
              onClick={() => {
                if (seg.annotations[0]) {
                  handleSelectAnnotationFromPopup(seg.annotations[0].id);
                }
              }}
            >
              {seg.text}
            </span>
          );
        })}
      </p>
    );
  };

  // Render an individual annotation card with interactive actions
  const renderAnnotationCard = (ann: AnnotationItem) => {
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

    const primaryAuthor = extractPrimaryAuthor(ann.sources);

    return (
      <div
        key={ann.id}
        id={ann.id}
        onClick={() => setSelectedAnnotationId(ann.id)}
        className={`p-4 rounded-xl border transition-all text-xs font-sans space-y-2.5 ${
          isSelected
            ? 'bg-slate-900 border-indigo-500/50 shadow-lg ring-1 ring-indigo-500/30'
            : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
        }`}
      >
        {/* Header: Coordinate + ID + Scholar Badge + Actions */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
              Line {String(ann.line_number).padStart(2, '0')}
            </span>
            <span className="font-mono text-slate-500 text-[10px]">
              {ann.id}
            </span>
            {primaryAuthor && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAuthor(selectedAuthor === primaryAuthor ? 'all' : primaryAuthor);
                }}
                className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  selectedAuthor === primaryAuthor
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    : 'bg-slate-900/80 text-slate-400 hover:text-emerald-300 border border-slate-800'
                }`}
                title={`Filter layer by scholar: ${primaryAuthor}`}
              >
                {primaryAuthor}
              </button>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyAnnotationSnippet(ann);
              }}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              title="Copy JSON snippet"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(ann.id);
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
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

        {/* Badges / Categories - Click to filter by tag */}
        <div className="flex flex-wrap gap-1 pt-1">
          {ann.categories.map((cat) => {
            const isTagActive = selectedTag === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTag(isTagActive ? 'all' : cat);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  isTagActive
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 font-semibold'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-amber-200'
                }`}
                title={`Filter by tag #${cat}`}
              >
                #{cat}
              </button>
            );
          })}
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
  };

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

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
              title="Enter Fullscreen Zen Reading Mode (Press F)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
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
                        tabIndex={0}
                        onClick={() => setSelectedAnnotationId(ann.id)}
                        onMouseEnter={(e) =>
                          handlePhraseMouseEnter(
                            ann.target_phrase,
                            ann.line_number,
                            [ann],
                            e.currentTarget
                          )
                        }
                        onMouseLeave={handlePhraseMouseLeave}
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
            /* EPUB IS LOADED: Render the line segmented text with interactive hover popups */
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
                    {renderAnnotatedLineText(l, lineAnns)}
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
                      <button
                        type="button"
                        onClick={() => setSelectedAnnotationId(lineAnns[0].id)}
                        onMouseEnter={(e) =>
                          handlePhraseMouseEnter(
                            `Line ${l.line}`,
                            l.line,
                            lineAnns,
                            e.currentTarget
                          )
                        }
                        onMouseLeave={handlePhraseMouseLeave}
                        className="ml-2 flex-shrink-0 select-none cursor-pointer"
                        title="Hover to view glosses, click to select"
                      >
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-colors">
                          {lineAnns.length} note{lineAnns.length > 1 ? 's' : ''}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Scholarly Annotations Corpus */}
        <section className="lg:col-span-5 wf-card-surface border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 transition-colors">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">
                SCHOLARLY ANNOTATIONS ({totalFilteredCount})
              </span>
            </div>
            <button
              onClick={() => setIsCreatingInPanel(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/60 transition-colors"
              title="Add a new annotation to page"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Gloss</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lemmas, glosses, scholars, tags..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Layering & Sorting Toolbar */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            {/* Primary Controls: Layer Grouping & Sorting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Group by Layer */}
              <div className="space-y-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                  <Layers className="w-3 h-3 text-indigo-400" />
                  <span>Layer By:</span>
                </label>
                <select
                  value={layerGroupBy}
                  onChange={(e) => setLayerGroupBy(e.target.value as LayerGroupMode)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="none">Flat (Continuous Order)</option>
                  <option value="register">Analytical Registers (19 Scaffolds)</option>
                  <option value="author">Cited Scholars & Sources</option>
                  <option value="tag">Arbitrary Tags & Categories</option>
                  <option value="line">Line Number Coordinates</option>
                  <option value="contributor">Editorial Contributors</option>
                </select>
              </div>

              {/* Sort by */}
              <div className="space-y-1">
                <label className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                  <span>Sort By:</span>
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as AnnotationSortMode)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
                >
                  <option value="line-asc">Line Number (1 → 36)</option>
                  <option value="line-desc">Line Number (36 → 1)</option>
                  <option value="author-asc">Scholar Name (A → Z)</option>
                  <option value="phrase-asc">Target Lemma (A → Z)</option>
                  <option value="tag-count">Tag Density (Richest First)</option>
                </select>
              </div>
            </div>

            {/* Secondary Filter Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800/60">
              {/* Scholar Filter */}
              <div>
                <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 font-sans truncate"
                  title="Filter by Scholar"
                >
                  <option value="all">All Scholars ({availableAuthors.length})</option>
                  {availableAuthors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>

              {/* Register Filter */}
              <div>
                <select
                  value={selectedRegister}
                  onChange={(e) => setSelectedRegister(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 font-sans truncate"
                  title="Filter by Register"
                >
                  <option value="all">All Registers</option>
                  {ANALYTICAL_REGISTERS.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arbitrary Tag Filter */}
              <div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500 font-sans truncate"
                  title="Filter by Arbitrary Tag"
                >
                  <option value="all">All Tags ({availableTags.length})</option>
                  {availableTags.map((t) => (
                    <option key={t.tag} value={t.tag}>
                      #{t.tag} ({t.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Chips & Clear Action */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-500">Active:</span>
                {selectedAuthor !== 'all' && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <span>Scholar: {selectedAuthor}</span>
                    <button
                      onClick={() => setSelectedAuthor('all')}
                      className="hover:text-emerald-100"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {selectedRegister !== 'all' && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
                    <span>Register: {selectedRegister}</span>
                    <button
                      onClick={() => setSelectedRegister('all')}
                      className="hover:text-indigo-100"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {selectedTag !== 'all' && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    <span>Tag: #{selectedTag}</span>
                    <button
                      onClick={() => setSelectedTag('all')}
                      className="hover:text-amber-100"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    <span>&ldquo;{searchQuery}&rdquo;</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-slate-100"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center space-x-1 text-[10px] font-mono text-slate-400 hover:text-emerald-400 ml-auto cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset filters</span>
                </button>
              </div>
            )}

            {/* Layer View Summary & Accordion Expand/Collapse Controls */}
            {layerGroupBy !== 'none' && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40 text-[11px] font-mono text-slate-400">
                <span>
                  {annotationLayers.length} Layer{annotationLayers.length === 1 ? '' : 's'} Active
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={expandAllLayers}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Expand all
                  </button>
                  <span>&bull;</span>
                  <button
                    onClick={collapseAllLayers}
                    className="hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    Collapse all
                  </button>
                </div>
              </div>
            )}
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

          {/* Annotations List (Layered or Continuous) */}
          <div className="space-y-4 max-h-[calc(100vh-18rem)] overflow-y-auto pr-1">
            {totalFilteredCount === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs italic space-y-2 border border-dashed border-slate-800 rounded-xl">
                <p>No annotations match your active query/layer on page {currentPage}.</p>
                {hasActiveFilters ? (
                  <button
                    onClick={clearAllFilters}
                    className="text-emerald-400 hover:underline text-xs"
                  >
                    Reset all active filters
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCreatingInPanel(true)}
                    className="text-emerald-400 hover:underline text-xs"
                  >
                    + Add an annotation for this page
                  </button>
                )}
              </div>
            ) : layerGroupBy === 'none' ? (
              /* Flat Continuous List */
              filteredAnnotations.map((ann) => renderAnnotationCard(ann))
            ) : (
              /* Grouped Visual Layers */
              annotationLayers.map((group) => {
                const isCollapsed = Boolean(collapsedLayers[group.id]);
                return (
                  <div
                    key={group.id}
                    className="border border-slate-800/80 rounded-xl bg-slate-950/40 overflow-hidden"
                  >
                    {/* Layer Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleLayerCollapse(group.id)}
                      className="w-full flex items-center justify-between p-3 text-left select-none bg-slate-900/60 hover:bg-slate-900/90 transition-colors group focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {layerGroupBy === 'author' && <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {layerGroupBy === 'register' && <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                        {layerGroupBy === 'tag' && <Tag className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        {layerGroupBy === 'line' && <BookOpen className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                        {layerGroupBy === 'contributor' && <Users className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-200 text-xs truncate group-hover:text-emerald-300 transition-colors">
                              {group.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700/60 flex-shrink-0">
                              {group.count}
                            </span>
                          </div>
                          {group.subtitle && (
                            <p className="text-[10px] text-slate-500 truncate">{group.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0 text-slate-500">
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Layer Items */}
                    {!isCollapsed && (
                      <div className="p-3 space-y-3 border-t border-slate-800/60">
                        {group.items.map((ann) => renderAnnotationCard(ann))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* 4. Fullscreen Zen Reading Mode Overlay */}
      {isFullscreen && (
        <div
          role="region"
          aria-label="Fullscreen Zen Reader"
          className="fixed inset-0 z-50 overflow-y-auto wf-fullscreen-overlay flex flex-col select-text transition-colors"
        >
          {/* Zen Sticky Header */}
          <header className="sticky top-0 z-40 wf-nav-surface backdrop-blur-md border-b border-inherit/40 px-4 sm:px-8 py-3 flex items-center justify-between shadow-md transition-colors">
            {/* Left: Book & Chapter Breadcrumb */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-sm sm:text-base leading-tight">
                  Finnegans Wake &bull; Book {bookInfo.bookRoman}, Chapter {bookInfo.chapter}
                </h1>
                <p className="text-[11px] opacity-70 italic truncate max-w-xs sm:max-w-md">
                  {bookInfo.chapterTitle}
                </p>
              </div>
            </div>

            {/* Center: Quick Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-inherit/40 hover:bg-inherit/40 disabled:opacity-30 transition-all"
                title="Previous Page (← or p)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-inherit/40 border border-inherit/30">
                Page {currentPage} / 628
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= 628}
                className="p-1.5 rounded-lg border border-inherit/40 hover:bg-inherit/40 disabled:opacity-30 transition-all"
                title="Next Page (→ or n)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Text Zoom & Controls & Exit Fullscreen */}
            <div className="flex items-center space-x-2">
              {/* Font Size Zoom */}
              <div className="hidden sm:flex items-center space-x-1 border border-inherit/30 rounded-lg p-0.5">
                <button
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
                  onClick={() => setFullscreenFontSize((prev) => Math.min(26, prev + 2))}
                  className="p-1 rounded hover:bg-inherit/60 transition-colors"
                  title="Increase font size (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Toggle Notes Drawer Button in Fullscreen */}
              <button
                onClick={() => setFullscreenShowNotes(!fullscreenShowNotes)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  fullscreenShowNotes
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : 'border-inherit/40 hover:bg-inherit/40'
                }`}
                title="Toggle annotations drawer in fullscreen"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  Notes ({filteredAnnotations.length})
                </span>
              </button>

              {/* Exit Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                title="Exit Fullscreen (Esc or F)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </button>
            </div>
          </header>

          {/* Fullscreen Body Content */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-8 gap-8 items-start">
            {/* Reading Column */}
            <main
              className={`flex-1 transition-all mx-auto ${
                fullscreenShowNotes ? 'max-w-3xl' : 'max-w-4xl'
              }`}
            >
              <div className="p-6 sm:p-12 rounded-2xl wf-card-surface border shadow-2xl space-y-6 transition-colors">
                <div className="flex items-center justify-between pb-3 border-b border-inherit/30 text-xs font-mono opacity-80">
                  <span className="font-semibold">
                    CANONICAL TEXT &bull; JOYCE PAGE {String(currentPage).padStart(3, '0')}
                  </span>
                  <span className="hidden sm:inline">
                    Hover words for instant annotation popups
                  </span>
                </div>

                {!epubLoaded ? (
                  /* Notice when EPUB not yet loaded */
                  <div className="space-y-6 py-6">
                    <div className="p-6 rounded-xl border border-inherit/40 bg-inherit/30 space-y-4 text-center max-w-xl mx-auto">
                      <BookOpen className="w-10 h-10 mx-auto text-emerald-400 opacity-90" />
                      <h2 className="text-base font-serif font-bold">
                        Read the Original Text in Fullscreen
                      </h2>
                      <p className="text-xs leading-relaxed opacity-80">
                        To protect Joyce&apos;s copyrighted text under Title 17 U.S.C. § 107, please select your local EPUB file (or downloaded scan from Archive.org). Text will appear centered with interactive hover popups.
                      </p>
                      <div className="pt-2 flex flex-wrap justify-center gap-3">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-all flex items-center space-x-2"
                        >
                          <FileUp className="w-4 h-4" />
                          <span>Load Local finneganswake00joycuoft.epub</span>
                        </button>
                      </div>
                    </div>

                    {/* Annotated Phrases on this page preview */}
                    <div className="space-y-3 pt-4">
                      <h3 className="text-xs font-mono uppercase tracking-wider font-semibold opacity-75">
                        Annotated Phrases on Page {String(currentPage).padStart(3, '0')} (Hover for Popups):
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {annotationsData?.annotations.map((ann) => (
                          <div
                            key={ann.id}
                            tabIndex={0}
                            onClick={() => handleSelectAnnotationFromPopup(ann.id)}
                            onMouseEnter={(e) =>
                              handlePhraseMouseEnter(
                                ann.target_phrase,
                                ann.line_number,
                                [ann],
                                e.currentTarget
                              )
                            }
                            onMouseLeave={handlePhraseMouseLeave}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              selectedAnnotationId === ann.id
                                ? 'bg-emerald-950/60 border-emerald-500/50 shadow-md'
                                : 'border-inherit/30 hover:border-inherit/60'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] opacity-70 mb-1 font-mono">
                              <span className="text-emerald-400 font-bold">
                                Line {String(ann.line_number).padStart(2, '0')}
                              </span>
                              <span>{ann.id}</span>
                            </div>
                            <div className="font-serif text-sm">
                              &ldquo;{ann.target_phrase}&rdquo;
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* EPUB IS LOADED: Display text lines in fullscreen */
                  <div
                    className="space-y-2 select-text"
                    style={{
                      fontSize: `${fullscreenFontSize}px`,
                      lineHeight: '1.8',
                    }}
                  >
                    {lines.map((l) => {
                      const lineAnns = (annotationsData?.annotations || []).filter(
                        (a) => a.line_number === l.line
                      );
                      const hasAnns = lineAnns.length > 0;
                      const isSelected = lineAnns.some(
                        (a) => a.id === selectedAnnotationId
                      );

                      return (
                        <div
                          key={l.line}
                          className={`group flex items-start py-1 px-3 rounded-xl transition-colors ${
                            isSelected
                              ? 'bg-emerald-950/40 border border-emerald-500/40'
                              : hasAnns
                              ? 'hover:bg-inherit/40'
                              : 'hover:bg-inherit/20'
                          }`}
                        >
                          <span
                            className="font-mono text-xs opacity-50 w-10 flex-shrink-0 select-none pt-1"
                            title={`Page ${currentPage}, Line ${l.line}`}
                          >
                            {String(l.line).padStart(2, '0')}
                          </span>
                          {renderAnnotatedLineText(l, lineAnns)}
                          {hasAnns && (
                            <button
                              type="button"
                              onClick={() => handleSelectAnnotationFromPopup(lineAnns[0].id)}
                              onMouseEnter={(e) =>
                                handlePhraseMouseEnter(
                                  `Line ${l.line}`,
                                  l.line,
                                  lineAnns,
                                  e.currentTarget
                                )
                              }
                              onMouseLeave={handlePhraseMouseLeave}
                              className="ml-3 flex-shrink-0 select-none cursor-pointer pt-1"
                              title="Hover to view glosses, click to inspect"
                            >
                              <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-colors">
                                {lineAnns.length} note{lineAnns.length > 1 ? 's' : ''}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </main>

            {/* Optional Fullscreen Slide-in Notes Drawer */}
            {fullscreenShowNotes && (
              <aside className="w-96 flex-shrink-0 p-5 rounded-2xl wf-card-surface border shadow-2xl space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto sticky top-20 animate-in slide-in-from-right-10 duration-200 select-text">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-inherit/40">
                  <div className="flex items-center space-x-2">
                    <Bookmark className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-semibold text-xs">
                      Page Annotations ({totalFilteredCount})
                    </span>
                  </div>
                  <button
                    onClick={() => setFullscreenShowNotes(false)}
                    className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Close notes drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Zen Drawer Layer & Sort Toolbar */}
                <div className="p-2 rounded-xl bg-inherit/40 border border-inherit/30 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Layer By */}
                    <div>
                      <label className="flex items-center space-x-1 text-[10px] font-mono opacity-70 mb-0.5">
                        <Layers className="w-2.5 h-2.5" />
                        <span>Layer By:</span>
                      </label>
                      <select
                        value={layerGroupBy}
                        onChange={(e) => setLayerGroupBy(e.target.value as LayerGroupMode)}
                        className="w-full bg-inherit border border-inherit/40 rounded px-1.5 py-1 text-[11px] focus:outline-none font-sans"
                      >
                        <option value="none">Flat (Continuous)</option>
                        <option value="register">Registers</option>
                        <option value="author">Scholars & Sources</option>
                        <option value="tag">Arbitrary Tags</option>
                        <option value="line">Line Numbers</option>
                        <option value="contributor">Contributors</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="flex items-center space-x-1 text-[10px] font-mono opacity-70 mb-0.5">
                        <ArrowUpDown className="w-2.5 h-2.5" />
                        <span>Sort By:</span>
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as AnnotationSortMode)}
                        className="w-full bg-inherit border border-inherit/40 rounded px-1.5 py-1 text-[11px] focus:outline-none font-sans"
                      >
                        <option value="line-asc">Line (1 → 36)</option>
                        <option value="line-desc">Line (36 → 1)</option>
                        <option value="author-asc">Scholar (A → Z)</option>
                        <option value="phrase-asc">Lemma (A → Z)</option>
                        <option value="tag-count">Tag Density</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filter Indicators in Fullscreen Drawer */}
                  {hasActiveFilters && (
                    <div className="flex items-center justify-between pt-1 border-t border-inherit/20 text-[10px] font-mono">
                      <span className="opacity-75">
                        Filtered ({totalFilteredCount})
                      </span>
                      <button
                        onClick={clearAllFilters}
                        className="text-emerald-400 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Fullscreen Notes List (Flat or Layered) */}
                <div className="space-y-3 text-xs">
                  {totalFilteredCount === 0 ? (
                    <div className="p-6 text-center opacity-60 text-xs italic space-y-2 border border-dashed border-inherit/40 rounded-xl">
                      <p>No annotations match active layer/query.</p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="text-emerald-400 hover:underline text-xs cursor-pointer"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  ) : layerGroupBy === 'none' ? (
                    filteredAnnotations.map((ann) => {
                      const isSelected = selectedAnnotationId === ann.id;
                      const author = extractPrimaryAuthor(ann.sources);
                      return (
                        <div
                          key={ann.id}
                          id={`fullscreen-note-${ann.id}`}
                          onClick={() => setSelectedAnnotationId(ann.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                            isSelected
                              ? 'bg-emerald-950/50 border-emerald-500/60'
                              : 'border-inherit/30 hover:border-inherit/60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono opacity-80 flex-wrap gap-1">
                            <span className="text-emerald-400 font-bold">
                              Line {String(ann.line_number).padStart(2, '0')}
                            </span>
                            <span className="opacity-60">{ann.id}</span>
                            {author && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-inherit/60 border border-inherit/30">
                                {author}
                              </span>
                            )}
                          </div>
                          <p className="font-serif italic font-semibold">
                            &ldquo;{ann.target_phrase}&rdquo;
                          </p>
                          <p className="leading-relaxed opacity-90 text-[11px]">
                            {ann.annotation_text}
                          </p>
                          {/* Categories */}
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {ann.categories.map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTag(selectedTag === cat ? 'all' : cat);
                                }}
                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded border transition-colors ${
                                  selectedTag === cat
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 font-semibold'
                                    : 'bg-inherit/60 opacity-80 hover:opacity-100 border-inherit/30'
                                }`}
                              >
                                #{cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    annotationLayers.map((group) => {
                      const isCollapsed = Boolean(collapsedLayers[group.id]);
                      return (
                        <div
                          key={group.id}
                          className="border border-inherit/30 rounded-xl overflow-hidden bg-inherit/20"
                        >
                          {/* Accordion Layer Header */}
                          <button
                            type="button"
                            onClick={() => toggleLayerCollapse(group.id)}
                            className="w-full flex items-center justify-between p-2.5 text-left select-none hover:bg-inherit/40 transition-colors group focus:outline-none cursor-pointer"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <span className="font-semibold text-xs truncate">
                                {group.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-inherit/80 border border-inherit/40 flex-shrink-0">
                                {group.count}
                              </span>
                            </div>
                            <div className="flex items-center opacity-60">
                              {isCollapsed ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronUp className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </button>

                          {/* Items */}
                          {!isCollapsed && (
                            <div className="p-2 space-y-2 border-t border-inherit/20">
                              {group.items.map((ann) => {
                                const isSelected = selectedAnnotationId === ann.id;
                                const author = extractPrimaryAuthor(ann.sources);
                                return (
                                  <div
                                    key={ann.id}
                                    id={`fullscreen-note-${ann.id}`}
                                    onClick={() => setSelectedAnnotationId(ann.id)}
                                    className={`p-2.5 rounded-lg border transition-all cursor-pointer space-y-1.5 ${
                                      isSelected
                                        ? 'bg-emerald-950/50 border-emerald-500/60'
                                        : 'border-inherit/20 hover:border-inherit/40'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-[10px] font-mono opacity-80 flex-wrap gap-1">
                                      <span className="text-emerald-400 font-bold">
                                        Line {String(ann.line_number).padStart(2, '0')}
                                      </span>
                                      {author && (
                                        <span className="opacity-70">{author}</span>
                                      )}
                                    </div>
                                    <p className="font-serif italic font-semibold text-xs">
                                      &ldquo;{ann.target_phrase}&rdquo;
                                    </p>
                                    <p className="leading-relaxed opacity-90 text-[11px]">
                                      {ann.annotation_text}
                                    </p>
                                    <div className="flex flex-wrap gap-1 pt-0.5">
                                      {ann.categories.map((cat) => (
                                        <button
                                          key={cat}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedTag(selectedTag === cat ? 'all' : cat);
                                          }}
                                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded border transition-colors ${
                                            selectedTag === cat
                                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/60 font-semibold'
                                              : 'bg-inherit/60 opacity-80 hover:opacity-100 border-inherit/30'
                                          }`}
                                        >
                                          #{cat}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>
            )}
          </div>

          {/* Floating Zen Navigation Pill at bottom */}
          <footer className="sticky bottom-4 z-40 flex justify-center pointer-events-none pb-2">
            <div className="pointer-events-auto flex items-center space-x-3 px-5 py-2.5 rounded-full wf-card-surface border shadow-2xl backdrop-blur-lg text-xs">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center space-x-1 opacity-70 hover:opacity-100 disabled:opacity-30 transition-opacity"
                title="Previous page (← or p)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="opacity-30">&bull;</span>
              <span className="font-mono font-medium">
                Page {currentPage} of 628
              </span>
              <span className="opacity-30">&bull;</span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= 628}
                className="flex items-center space-x-1 opacity-70 hover:opacity-100 disabled:opacity-30 transition-opacity"
                title="Next page (→ or n)"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="opacity-30">&bull;</span>
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-1 text-emerald-400 hover:underline font-mono"
                title="Exit Fullscreen (Esc or F)"
              >
                <span>Exit Fullscreen [Esc]</span>
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* 5. Hover Popup for Annotated Phrases & Lines */}
      {hoverPopup && (
        <AnnotationHoverPopup
          data={hoverPopup}
          onClose={() => setHoverPopup(null)}
          onSelectAnnotation={handleSelectAnnotationFromPopup}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        />
      )}
    </div>
  );
}
