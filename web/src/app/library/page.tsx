import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Library,
  Compass,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  Clock,
  MapPin,
  FileCode,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { getAllWorks, FINNEGANS_WAKE, ULYSSES } from '@/lib/constants';

export const metadata = {
  title: 'Library Catalog | WinnegansFake Universal Digital Humanities',
  description: 'Explore the complete library of literary works, schemas, and analytical annotations hosted on the WinnegansFake platform.',
};

export default function LibraryPage() {
  const registeredWorks = getAllWorks();

  const roadmapWorks = [
    {
      id: 'divina-commedia',
      title: 'Divina Commedia',
      author: 'Dante Alighieri',
      year: 'c. 1308–1320',
      structure: '3 Cantiche (Inferno, Purgatorio, Paradiso), 100 Cantos',
      status: 'In Curation',
      description: 'The monumental medieval journey through Hell, Purgatory, and Paradise, structured around the four senses of scriptural exegesis and Ptolemaic-Aristotelian cosmology.',
      registers: ['Fourfold Allegory', 'Florentine Topography & Guelf Politics', 'Thomistic Theology', 'Terza Rima Metrics'],
      accentColor: 'rose',
      borderClass: 'border-rose-500/30 hover:border-rose-500/60',
      badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    },
    {
      id: 'the-waste-land',
      title: 'The Waste Land',
      author: 'T.S. Eliot',
      year: '1922',
      structure: '5 Sections, 433 Lines',
      status: 'In Curation',
      description: 'High modernist montage combining the Grail legend of the Fisher King, Baudelaire\'s Paris, Dante\'s Limbo, and the Sanskrit thunder of the Brihadaranyaka Upanishad.',
      registers: ['Grail & Golden Bough Myth', 'London Topography & The City', 'Sanskrit & Buddhist Exegesis', 'Wagnerian Allusion'],
      accentColor: 'amber',
      borderClass: 'border-amber-500/30 hover:border-amber-500/60',
      badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    },
    {
      id: 'tristram-shandy',
      title: 'The Life and Opinions of Tristram Shandy, Gentleman',
      author: 'Laurence Sterne',
      year: '1759–1767',
      structure: '9 Volumes',
      status: 'In Planning',
      description: 'The great eighteenth-century anti-novel of digression, Locke\'s association of ideas, black pages, marbled inserts, and playful disruption of chronological narrative.',
      registers: ['Lockean Association of Ideas', 'Typographic & Visual Metafiction', 'Military Topography (Uncle Toby)', 'Satirical Erudition'],
      accentColor: 'teal',
      borderClass: 'border-teal-500/30 hover:border-teal-500/60',
      badgeClass: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
    },
    {
      id: 'recherche',
      title: 'À la recherche du temps perdu',
      author: 'Marcel Proust',
      year: '1913–1927',
      structure: '7 Volumes (Combray through Le Temps retrouvé)',
      status: 'In Planning',
      description: 'The pinnacle of French modernism: involuntary memory, the madeleine, the Vinteuil sonata, and the exhaustive aesthetic recovery of Parisian and Balbec life.',
      registers: ['Involuntary Memory & Sensation', 'Bergsonian Duration', 'Combray & Parisian Geography', 'Musical & Painterly Motifs'],
      accentColor: 'sky',
      borderClass: 'border-sky-500/30 hover:border-sky-500/60',
      badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="border-b border-slate-800 pb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30">
              <Library className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">
                Universal Digital Humanities Repository
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white">
                The Literary Library
              </h1>
            </div>
          </div>
          <p className="max-w-3xl text-slate-400 text-base sm:text-lg leading-relaxed">
            WinnegansFake provides an extensible, zero-copyright architecture for encyclopedic literature.
            By mapping multi-layered critical glosses, historical topography, and analytical registers directly
            to canonical page coordinates (<code className="text-emerald-400 font-mono text-sm">PPP.LL</code>),
            the platform turns any complex literary text into an interactive, collaborative research corpus.
          </p>
        </div>

        {/* Active Collections Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
                <span>Active Editions</span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                  {registeredWorks.length} Ready
                </span>
              </h2>
              <p className="text-sm text-slate-400">
                Works currently available in the interactive reader with registered schemas and line-coordinate glosses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Finnegans Wake Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-950/20 group hover:border-emerald-500/70 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                        Master Edition
                      </span>
                      <span className="bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[11px] px-2 py-0.5 rounded-full font-mono">
                        Protected (U.S. 2035)
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-black text-white group-hover:text-emerald-300 transition-colors">
                      Finnegans Wake
                    </h3>
                    <p className="text-slate-400 text-sm">James Joyce (1939, Faber & Faber / Viking)</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-serif font-black text-xl">
                    FW
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Joyce&apos;s revolutionary nocturnal epic of cyclical history and universal dreaming,
                  orchestrated across Giambattista Vico&apos;s four ages, Giordano Bruno&apos;s polarity,
                  and multilingual portmanteaus drawing from over 60 global languages.
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Structure</span>
                    <span className="font-semibold text-slate-200">4 Books, 17 Ch.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Pagination</span>
                    <span className="font-semibold text-slate-200">628 Pages</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Citation</span>
                    <span className="font-mono text-emerald-400">FW 003.01</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Status</span>
                    <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>630 Pages</span>
                    </span>
                  </div>
                </div>

                {/* Registers preview */}
                <div>
                  <span className="text-xs text-slate-400 block mb-2 font-medium">
                    10 Analytical Registers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FINNEGANS_WAKE.registers.slice(0, 5).map((reg) => (
                      <span
                        key={reg.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {reg.name.split(' ')[0]} {reg.name.split(' ')[1] || ''}
                      </span>
                    ))}
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                      +5 more
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Zero-Copyright Separation</span>
                </div>
                <Link
                  href="/reader?work=finnegans-wake&page=3"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950/40 hover:scale-[1.02]"
                >
                  <span>Open Wake Reader</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Ulysses Card */}
            <div className="rounded-2xl bg-slate-900/80 border border-indigo-500/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-indigo-950/20 group hover:border-indigo-500/70 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                        Modernist Masterpiece
                      </span>
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[11px] px-2 py-0.5 rounded-full font-mono">
                        Public Domain (1922)
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-black text-white group-hover:text-indigo-300 transition-colors">
                      Ulysses
                    </h3>
                    <p className="text-slate-400 text-sm">James Joyce (February 2, 1922, Shakespeare & Co.)</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-serif font-black text-xl">
                    U
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed">
                  Chronicling Leopold Bloom&apos;s Dublin day on June 16, 1904. Each of the 18 episodes
                  operates with a distinct Homeric parallel, organ of the body, art, color, symbol,
                  and revolutionary narrative technique (from stream of consciousness to gigantism).
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Structure</span>
                    <span className="font-semibold text-slate-200">3 Parts, 18 Ep.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Pagination</span>
                    <span className="font-semibold text-slate-200">732 Pages</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Citation</span>
                    <span className="font-mono text-indigo-400">U 001.01</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block">Schemas</span>
                    <span className="font-semibold text-indigo-400">Gilbert & Linati</span>
                  </div>
                </div>

                {/* Registers preview */}
                <div>
                  <span className="text-xs text-slate-400 block mb-2 font-medium">
                    Gilbert-Linati Schemas & Registers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ULYSSES.registers.slice(0, 5).map((reg) => (
                      <span
                        key={reg.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {reg.name.split(' ')[0]} {reg.name.split(' ')[1] || ''}
                      </span>
                    ))}
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-400 border border-indigo-500/20">
                      +5 more
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Public Domain Worldwide</span>
                </div>
                <Link
                  href="/reader?work=ulysses&page=1"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-950/40 hover:scale-[1.02]"
                >
                  <span>Open Ulysses Reader</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Curatorial Roadmap Shelf */}
        <section className="space-y-6 pt-6">
          <div className="border-t border-slate-800/80 pt-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Curatorial Roadmap: Upcoming Classical & Modernist Works</span>
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              The coordinate-indexed apparatus developed for Joyce easily scales to the great encyclopedic
              and polyphonic texts of world literature. Below are the registered schema blueprints scheduled
              for community curation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapWorks.map((work) => (
              <div
                key={work.id}
                className={`rounded-xl bg-slate-900/60 border ${work.borderClass} p-6 space-y-4 transition-all hover:bg-slate-900/90`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${work.badgeClass}`}>
                        {work.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{work.year}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white">{work.title}</h3>
                    <p className="text-xs text-slate-400">{work.author}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {work.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <span className="text-slate-500 block mb-1">Structure:</span>
                  <span className="font-semibold text-slate-200">{work.structure}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                    Planned Register Layers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {work.registers.map((r, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Universal Architecture Explainer */}
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              <span>Universal Library Architecture</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              How WinnegansFake achieves cross-work scholarly interoperability without legal risk or copyright infringement:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-serif font-bold text-white text-base">Standard Coordinate System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every passage maps to an immutable printed coordinate (<code className="text-emerald-400">PPP.LL</code>).
                For <em>Finnegans Wake</em>, 1939 pagination (pp. 1–628). For <em>Ulysses</em>, the 1922 first edition pagination (pp. 1–732).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-serif font-bold text-white text-base">Zero-Copyright Clean Room</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The repository stores <em>only</em> open-source analytical metadata, glosses, and citations under CC BY-SA 4.0.
                Source EPUBs are rendered dynamically in client memory, cleanly insulating the server from copyright claims.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-serif font-bold text-white text-base">Custom Layer Registers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each work defines its own domain-specific analytical registers (e.g. Viconian cycles for the Wake, Gilbert/Linati schemas for Ulysses, fourfold exegesis for Dante).
              </p>
            </div>
          </div>
        </section>

        {/* Dissertations Library Callout */}
        <section className="rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Secondary Scholarship Catalog</span>
              </span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-white">
              Scholarly Dissertations & Monographs Library
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore our separate repository of academic doctoral dissertations, multi-chapter monographs, and genetic criticism treatises on <em>Finnegans Wake</em>, <em>Ulysses</em>, and computational modernism.
            </p>
          </div>
          <Link
            href="/dissertations"
            className="shrink-0 inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all"
          >
            <span>Explore Dissertations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
