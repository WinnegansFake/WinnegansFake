import React from 'react';
import type { Metadata } from 'next';
import { ViconianWheel } from '@/components/ViconianWheel';

export const metadata: Metadata = {
  title: 'Viconian Historical Cycle & Ouroboros Wheel | WinnegansFake',
  description:
    'Interactive radial multi-ring visualization of Giambattista Vico’s Scienza Nuova four-stage cyclical history (Gods, Heroes, Men, Ricorso) and the eternal Ouroboros loop of Finnegans Wake.',
};

export default function VicoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <ViconianWheel />
    </main>
  );
}
