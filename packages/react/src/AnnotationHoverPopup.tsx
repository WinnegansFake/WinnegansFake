'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { AnnotationItem } from '@winnegans/core';
import {
  ExternalLink,
  ChevronRight,
  ChevronDown,
  X,
  Copy,
  Check
} from 'lucide-react';

export interface HoverPopupData {
  phrase: string;
  pageNumber: number;
  lineNumber: number;
  annotations: AnnotationItem[];
  anchorRect: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
  };
}

interface AnnotationHoverPopupProps {
  data: HoverPopupData;
  onClose: () => void;
  onSelectAnnotation?: (id: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Character length threshold: annotations under this limit are displayed in full
const SHORT_TEXT_THRESHOLD = 200;

export function AnnotationHoverPopup({
  data,
  onClose,
  onSelectAnnotation,
  onMouseEnter,
  onMouseLeave,
}: AnnotationHoverPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [coords, setCoords] = useState<{ top: number; left: number; isAbove: boolean }>({
    top: 0,
    left: 0,
    isAbove: true,
  });

  const { phrase, pageNumber, lineNumber, annotations, anchorRect } = data;

  // Calculate smart viewport-aware positioning
  useLayoutEffect(() => {
    if (!popupRef.current) return;
    const el = popupRef.current;
    const width = el.offsetWidth || 360;
    const height = el.offsetHeight || 200;
    const margin = 12;

    let left = anchorRect.left + anchorRect.width / 2 - width / 2;
    // Keep within horizontal bounds
    left = Math.max(margin, Math.min(window.innerWidth - width - margin, left));

    // Determine vertical placement (prefer above, flip below if not enough room)
    let top = anchorRect.top - height - 10;
    let isAbove = true;
    if (top < margin) {
      top = anchorRect.bottom + 10;
      isAbove = false;
      // If bottom also overflows, clamp to viewport bottom
      if (top + height > window.innerHeight - margin) {
        top = Math.max(margin, window.innerHeight - height - margin);
      }
    }

    setCoords({ top, left, isAbove });
  }, [anchorRect, annotations]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (e: React.MouseEvent, ann: AnnotationItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(ann, null, 2));
    setCopiedId(ann.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSelect = (id: string) => {
    if (onSelectAnnotation) {
      onSelectAnnotation(id);
    }
  };

  return (
    <div
      ref={popupRef}
      role="tooltip"
      aria-label={`Annotations for ${phrase}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 60,
      }}
      className="w-80 sm:w-96 max-w-[calc(100vw-24px)] wf-card-surface border rounded-xl shadow-2xl p-3.5 space-y-3 text-xs animate-in fade-in zoom-in-95 duration-150 select-text"
    >
      {/* Header: Phrase & Coordinate badge */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-inherit/40">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 mb-1">
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
              p. {String(pageNumber).padStart(3, '0')}.{String(lineNumber).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-inherit opacity-60 font-mono">
              {annotations.length} gloss{annotations.length > 1 ? 'es' : ''}
            </span>
          </div>
          <p className="font-serif italic font-semibold text-sm truncate" title={phrase}>
            &ldquo;{phrase}&rdquo;
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
          title="Dismiss (Esc)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Annotations List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {annotations.map((ann, idx) => {
          const isShort = ann.annotation_text.length <= SHORT_TEXT_THRESHOLD;
          const isExpanded = !!expandedIds[ann.id];
          const displayText = isShort || isExpanded
            ? ann.annotation_text
            : `${ann.annotation_text.slice(0, 160).trim()}...`;

          return (
            <div
              key={ann.id || idx}
              className="p-2.5 rounded-lg border border-inherit/30 bg-inherit/40 space-y-2 hover:border-inherit/60 transition-colors"
            >
              {/* Category tags & ID */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex flex-wrap gap-1 items-center">
                  {(ann.categories || []).slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center space-x-0.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20"
                    >
                      <span>{cat}</span>
                    </span>
                  ))}
                  {(ann.categories || []).length > 3 && (
                    <span className="text-[9px] text-inherit opacity-50 font-mono">
                      +{ann.categories.length - 3}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => handleCopy(e, ann)}
                  className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
                  title="Copy annotation JSON"
                >
                  {copiedId === ann.id ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Annotation Text (Full if short, or preview + expand) */}
              <div className="space-y-1.5">
                <p className="font-sans leading-relaxed text-[11px] sm:text-xs">
                  {displayText}
                </p>

                {/* If longer than threshold, provide expansion toggle */}
                {!isShort && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(ann.id)}
                    className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-400 hover:underline"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <ChevronDown className="w-3 h-3 rotate-180 transition-transform" />
                      </>
                    ) : (
                      <>
                        <span>Read full gloss ({ann.annotation_text.length} chars)</span>
                        <ChevronRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Sources / Contributors & Jump Link */}
              <div className="pt-1 border-t border-inherit/20 flex items-center justify-between text-[10px] opacity-75">
                <span className="truncate max-w-[170px]" title={ann.sources?.[0] || ann.contributors?.join(', ')}>
                  {ann.sources?.[0]
                    ? ann.sources[0].split('.')[0]
                    : `By: ${(ann.contributors || []).slice(0, 2).join(', ')}`}
                </span>

                {onSelectAnnotation && (
                  <button
                    type="button"
                    onClick={() => handleSelect(ann.id)}
                    className="inline-flex items-center space-x-0.5 text-emerald-400 hover:underline font-mono text-[10px]"
                    title="View in annotations panel"
                  >
                    <span>View Note</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
