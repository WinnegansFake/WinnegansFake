import React from 'react';
import type { Metadata } from 'next';
import { SiglaConstellation } from '@/components/SiglaConstellation';

export const metadata: Metadata = {
  title: 'Sigla Constellation & Dialectical Graph | WinnegansFake',
  description:
    'Interactive visualization of James Joyce’s Buffalo Notebooks hieroglyphic sigla (HCE, ALP, Shem, Shaun, Issy, Mamalujo) and Giordano Bruno’s coincidentia oppositorum.',
};

export default function SiglaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <SiglaConstellation />
    </main>
  );
}
