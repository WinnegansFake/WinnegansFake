'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Code2,
  Cpu,
  Compass,
  CheckCircle2,
  FileSearch,
  BookMarked
} from 'lucide-react';
import { ANALYTICAL_REGISTERS, ARCHIVE_EPUB_URL, GITHUB_REPO_URL } from '@/lib/constants';

export default function HomePage() {
  const [activeRegister, setActiveRegister] = useState(ANALYTICAL_REGISTERS[0]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Decoupled Digital Apparatus for James Joyce’s Masterpiece</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-white leading-tight">
              Decrypting the <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Night Mind
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              <strong>WinnegansFake</strong> is a zero-copyright scholarly annotation engine and crowdsourced concordance for James Joyce’s <em className="italic text-white">Finnegans Wake</em> (1939). By decoupling copyrighted text from open-source metadata, we bring together the collected wisdom of world Joycean scholarship into a free, community-driven digital edition.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/reader"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
              >
                <BookOpen className="w-4 h-4" />
                <span>Launch Interactive Reader</span>
              </Link>
              <Link
                href="/dissertation"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all hover:scale-105"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Read the Dissertation</span>
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
              >
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Local Setup & EPUB Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Stats Grid */}
      <section className="py-12 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-emerald-400 mb-1">
                630
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Canonical Pages (003–628)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-indigo-400 mb-1">
                19
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Analytical Registers
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-amber-400 mb-1">
                0%
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Copyright Infringement
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-mono font-bold text-teal-400 mb-1">
                60+
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                World Languages Decoded
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Zero-Copyright Legal Architecture */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                <Shield className="w-3.5 h-3.5" />
                <span>Title 17 U.S.C. § 107 & Sonny Bono CTEA</span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-white leading-snug">
                Why WinnegansFake is 100% Legal & Free Forever
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                James Joyce died in 1941, but under the United States <strong>1998 Sonny Bono Copyright Term Extension Act</strong>, works published in 1939 remain protected for <strong>95 years from publication date</strong>—expiring only on <strong>January 1, 2036</strong>.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                To prevent repository takedown or copyright infringement, WinnegansFake pioneered the <strong>Decoupled Coordinate Architecture</strong>:
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Book Text in Git:</strong> No copyrighted sentences or paragraphs are stored in git. The repo contains purely academic commentary, etymologies, and metadata glosses.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Universal Coordinate Standard:</strong> Every note targets the universal pagination format (<code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">PPP.LL</code>, e.g. <code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded font-mono">003.01</code>) established by the 1939 Faber & Faber edition.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Client-Side & Local Reading:</strong> Readers download the public archive scan from Archive.org onto their personal devices. Our web app processes the file client-side in browser memory without sending a single byte to any server.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/guide"
                  className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                >
                  <span>Read our detailed setup and download guide &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Visual Architecture Diagram */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span>ARCHITECTURAL DECOUPLING</span>
                <span className="text-emerald-400">LEGAL COMPLIANCE</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-red-500/30">
                  <div className="flex items-center justify-between text-red-400 mb-1 font-semibold">
                    <span>Source Text (Copyrighted until 2036)</span>
                    <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded border border-red-500/40">STRICTLY LOCAL</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Stored in <code className="text-slate-200">data/finneganswake00joycuoft.epub</code>. Always gitignored. Loaded only in browser memory or local laptop runtime.
                  </p>
                </div>

                <div className="flex justify-center my-1 text-slate-500">
                  <span className="text-xs">&darr; Linked via Coordinates (003.01 &rarr; 628.16) &uarr;</span>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/40">
                  <div className="flex items-center justify-between text-emerald-400 mb-1 font-semibold">
                    <span>Scholarly Annotations Corpus</span>
                    <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">100% OPEN SOURCE</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-normal">
                    Stored in <code className="text-slate-200">annotations/book_B/chapter_C/page_PPP.json</code>. Pure metadata, glosses, cross-references, and academic citations. CC BY-SA 4.0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 19 Analytical Registers Showcase */}
      <section className="py-16 bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif font-bold text-white">
              The Nineteen Analytical Registers
            </h2>
            <p className="text-sm text-slate-400">
              Joyce composed the <em>Wake</em> through layers of simultaneous polysemy. Our schema categorizes notes across 19 critical registers:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {ANALYTICAL_REGISTERS.map((reg) => {
              const isSelected = activeRegister.id === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setActiveRegister(reg)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs font-sans ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.02]'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-semibold text-slate-200 truncate">
                      {reg.name.split(' ')[0]} {reg.name.split(' ')[1] || ''}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {reg.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Register Spotlight */}
          {activeRegister && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    {activeRegister.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {activeRegister.name}
                  </h3>
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-md border ${activeRegister.badgeClass}`}>
                  tag: {activeRegister.id}
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                {activeRegister.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/reader?tag=${activeRegister.id}`}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center space-x-1"
                >
                  <span>Explore annotations with this register in the Reader &rarr;</span>
                </Link>
                <Link
                  href="/dissertation#chapter-iv-philological-polyphony-linguistic-alchemy-and-intertextuality"
                  className="text-xs text-slate-400 hover:text-white"
                >
                  <span>Read Chapter in Dissertation &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Incipit Annotation Interactive Preview */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/40">
              <BookMarked className="w-3.5 h-3.5" />
              <span>Anatomy of a Joyce Line Annotation</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Page 003, Line 01 (003.01)
            </h2>
            <p className="text-sm text-slate-400">
              The famous opening sentence begins mid-stream, looping directly from the unfinished ending on page 628.16:
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/90 font-serif text-base sm:text-lg text-amber-200 leading-relaxed italic">
              &ldquo;riverrun, past Eve and Adam&rsquo;s, from swerve of shore to bend of bay, brings us by a commodius vicus of recirculation back to Howth Castle and Environs.&rdquo;
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Corpus Annotations Mapped to 003.01:
              </h4>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    &ldquo;riverrun&rdquo;
                  </span>
                  <div className="flex space-x-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      viconian-cycles
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      river-liffey
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The river Liffey (Anna Livia Plurabelle) flowing into Dublin Bay. Also French <em>riverain</em> (living along riverbanks) and German <em>erinnern</em> (to remember). Links syntactically to the final sentence on 628.15-16: <em>&ldquo;A way a lone a last a loved a long the / riverrun...&rdquo;</em>
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    &ldquo;Eve and Adam&rsquo;s&rdquo;
                  </span>
                  <div className="flex space-x-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                      dublin-topography
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                      theological-liturgical
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The Church of the Immaculate Conception on Merchant&rsquo;s Quay, Dublin, colloquially known as &ldquo;Adam and Eve&rsquo;s&rdquo; (because Catholics attended secret masses under penal laws through the Adam and Eve Tavern). Also reverses the biblical patriarch and matriarch (Eve before Adam).
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    &ldquo;commodius vicus of recirculation&rdquo;
                  </span>
                  <div className="flex space-x-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                      viconian-cycles
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      etymological-polyglot
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Italian philosopher Giambattista Vico (1668–1744), author of <em>Scienza Nuova</em>, theorizing the cyclical evolution of human civilization. Latin <em>vicus</em>: lane, hamlet, neighborhood. Also Commodore John Barry (Father of the American Navy, born in Wexford).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Three Action Pathways */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-serif font-bold text-white">
              Get Started with WinnegansFake
            </h2>
            <p className="text-sm text-slate-400">
              Three ways to engage with the text, the scholarship, and the codebase:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Interactive Reader
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Browse all 630 pages in your browser. Filter glosses by register, search annotations, or drag-and-drop your local EPUB file to read the book text side-by-side in browser memory.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/reader"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Open Web Reader</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  The Full Dissertation
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Read our 12,000+ word scholarly monograph detailing the cosmology of Vico and Bruno, Joyce&rsquo;s Buffalo notebook sigla, acoustic thunderclaps, and the decoupled software architecture.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/dissertation"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <span>Read Dissertation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Run Locally & Contribute
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clone the repository, fetch the EPUB to your local laptop, run validation tests, and contribute scholarly annotations via GitHub Pull Requests under CC-BY-SA 4.0.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/guide"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <span>Setup Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
