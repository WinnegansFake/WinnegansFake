import React from 'react';
import type { Metadata } from 'next';
import { CoverageHeatmap } from '@/components/CoverageHeatmap';

export const metadata: Metadata = {
  title: 'Annotation Coverage Heatmap | WinnegansFake',
  description:
    'Visual digital humanities diagnostic heatmap across all 628 pages of Finnegans Wake and 732 pages of Ulysses. Inspect gloss density, line coverage, and analytical registers.',
};

export default function CoveragePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <CoverageHeatmap />
    </main>
  );
}
