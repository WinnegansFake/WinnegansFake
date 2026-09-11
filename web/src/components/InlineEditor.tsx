'use client';

import React, { useState, useEffect } from 'react';
import { AnnotationItem } from '@/lib/annotations';
import { Save, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InlineEditorProps {
  pageNumber: number;
  annotation: AnnotationItem;
  isNew?: boolean;
  onSave: (updated: AnnotationItem) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel: () => void;
}

export function InlineEditor({
  pageNumber,
  annotation,
  isNew = false,
  onSave,
  onDelete,
  onCancel,
}: InlineEditorProps) {
  const [lineNumber, setLineNumber] = useState(annotation.line_number || 1);
  const [targetPhrase, setTargetPhrase] = useState(annotation.target_phrase || '');
  const [annotationText, setAnnotationText] = useState(annotation.annotation_text || '');
  const [categoriesStr, setCategoriesStr] = useState(annotation.categories.join(', '));
  const [crossRefsStr, setCrossRefsStr] = useState((annotation.cross_references || []).join(', '));
  const [sourcesStr, setSourcesStr] = useState((annotation.sources || []).join('\n'));
  const [contributorsStr, setContributorsStr] = useState(annotation.contributors.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side quick validations
    if (!targetPhrase.trim()) {
      setError('Target phrase is required.');
      return;
    }
    if (targetPhrase.length > 150) {
      setError('Target phrase must be under 150 characters (Copyright safeguard).');
      return;
    }
    if (targetPhrase.includes('\n')) {
      setError('Target phrase cannot contain newlines.');
      return;
    }
    if (annotationText.trim().length < 10) {
      setError('Annotation text must be at least 10 characters.');
      return;
    }

    const categories = categoriesStr
      .split(',')
      .map((c) => c.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean);

    const crossRefs = crossRefsStr
      .split(',')
      .map((c) => c.trim())
      .filter((c) => /^[0-9]{3}\.[0-9]{2}$/.test(c));

    const sources = sourcesStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const contributors = contributorsStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (contributors.length === 0) {
      setError('At least one contributor username is required.');
      return;
    }

    // Generate or preserve ID
    const randomHex = Math.random().toString(16).substring(2, 6);
    const id = isNew
      ? `${String(pageNumber).padStart(3, '0')}.${String(lineNumber).padStart(2, '0')}-${randomHex}`
      : annotation.id;

    const updatedItem: AnnotationItem = {
      id,
      line_number: lineNumber,
      target_phrase: targetPhrase.trim(),
      annotation_text: annotationText.trim(),
      categories,
      cross_references: crossRefs,
      sources,
      contributors,
    };

    setSaving(true);
    try {
      await onSave(updatedItem);
    } catch (err: any) {
      setError(err.message || 'Failed to save annotation.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-5 shadow-2xl my-4 text-slate-100 font-sans text-sm transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <span className="bg-indigo-600/30 text-indigo-400 font-mono text-xs px-2.5 py-1 rounded-md border border-indigo-500/30">
            {isNew ? 'New Annotation' : `Edit ${annotation.id}`}
          </span>
          <span className="text-slate-400 text-xs font-mono">
            Page {String(pageNumber).padStart(3, '0')} : Line {lineNumber}
          </span>
        </div>
        <button
          onClick={onCancel}
          type="button"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-950/70 border border-red-500/40 rounded-lg text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Line Number (1–40)
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={lineNumber}
              onChange={(e) => setLineNumber(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Target Lemma / Anchor Phrase <span className="text-amber-400 text-[10px]">(Strict max 150 chars, no copyright text)</span>
            </label>
            <input
              type="text"
              value={targetPhrase}
              maxLength={150}
              onChange={(e) => setTargetPhrase(e.target.value)}
              placeholder="e.g. riverrun, commodius vicus"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Annotation Commentary / Critical Gloss <span className="text-indigo-400 text-[10px]">(CC BY-SA 4.0)</span>
          </label>
          <textarea
            rows={4}
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Provide scholarly interpretation, motif cross-links, linguistic origins, or Dublin topography context..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Thematic Categories (comma-separated)
            </label>
            <input
              type="text"
              value={categoriesStr}
              onChange={(e) => setCategoriesStr(e.target.value)}
              placeholder="vico, etymology, topography, river-liffey"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Cross-References (comma-separated, e.g. 004.18, 628.16)
            </label>
            <input
              type="text"
              value={crossRefsStr}
              onChange={(e) => setCrossRefsStr(e.target.value)}
              placeholder="004.18, 628.16"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Academic Sources (one per line)
            </label>
            <textarea
              rows={2}
              value={sourcesStr}
              onChange={(e) => setSourcesStr(e.target.value)}
              placeholder="McHugh, Roland. Annotations to Finnegans Wake..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Contributors (GitHub handles, comma-separated)
            </label>
            <input
              type="text"
              value={contributorsStr}
              onChange={(e) => setContributorsStr(e.target.value)}
              placeholder="joycean-scholar, your-github-handle"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            {!isNew && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(annotation.id)}
                className="inline-flex items-center text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1.5 rounded hover:bg-red-950/50"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete Annotation
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {saving ? 'Validating & Saving...' : 'Save JSON Note'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
