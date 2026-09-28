import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Compass,
  Terminal,
  Sparkles,
  RotateCw,
  Zap,
  BookOpen,
  ArrowRight,
  Layers,
  Library,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Critical Apparatus & Literary Schemata | WinnegansFake',
  description:
    'Interactive visual hermeneutics, cosmological wheels, Linati/Gilbert matrices, cyberpunk dossiers, and Buffalo sigla graphs across the WinnegansFake corpus.',
};

export default function SchemasHubPage() {
  const schemata = [
    {
      id: 'ulysses-schema',
      title: 'Ulysses Linati & Gilbert Schema Matrix',
      work: 'Ulysses (1922)',
      author: 'James Joyce',
      href: '/schemas/ulysses',
      readerHref: '/reader?work=ulysses',
      icon: Compass,
      badge: '18 Episodes &bull; Gilbert & Linati 1920/1930',
      accentColor: 'indigo',
      badgeClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
      borderClass: 'border-indigo-500/30 hover:border-indigo-500/60',
      description:
        'James Joyce devised two legendary architectural schema tables to decode the secret anatomy of Bloomsday: Homeric parallels, Dublin 1904 topography, somatic organs of the body, colors, symbols, and narrative techniques for all 18 episodes.',
      features: [
        'Somatic organ mapping (Kidney, Heart, Lungs, Brain, Womb, Nerves)',
        'Homeric correspondences (Telemachus, Calypso, Circe, Penelope)',
        'Linati and Gilbert esoteric meanings & Dublin counterparts',
        'Interactive filtering by body organ, part, and keywords',
      ],
    },
    {
      id: 'neuromancer-dossier',
      title: 'Neuromancer Matrix Dossier & Technical Lexicon',
      work: 'Neuromancer (1984)',
      author: 'William Gibson',
      href: '/schemas/neuromancer',
      readerHref: '/reader?work=neuromancer',
      icon: Terminal,
      badge: '24 Chapters &bull; Sprawl Trilogy Architecture',
      accentColor: 'cyan',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      borderClass: 'border-cyan-500/30 hover:border-cyan-500/60',
      description:
        'A comprehensive cyberpunk apparatus decoding the Tessier-Ashpool corporate dynasty in Villa Straylight, the Wintermute/Neuromancer artificial intelligence duality, deck hardware specifications, and the Sprawl lexicon.',
      features: [
        'Tessier-Ashpool dynastic genealogical dossier & cryonic vaults',
        'Wintermute vs Neuromancer dual-AI consciousness architecture',
        'Hardware specs (Ono-Sendai Cyberspace 7, Kuang 11, Braun pistol)',
        'Sprawl street slang & tech etymological glossary (ICE, Simstim, Deck)',
      ],
    },
    {
      id: 'sigla-graph',
      title: 'Sigla Constellation & Dialectical Graph',
      work: 'Finnegans Wake (1939)',
      author: 'James Joyce',
      href: '/sigla',
      readerHref: '/reader?work=finnegans-wake',
      icon: Sparkles,
      badge: 'Buffalo Notebooks &bull; Genetic Joyce Notation',
      accentColor: 'rose',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
      borderClass: 'border-rose-500/30 hover:border-rose-500/60',
      description:
        'Interactive dialectical constellation of James Joyce’s Buffalo Notebooks hieroglyphic sigla. Explores Giordano Bruno’s coincidentia oppositorum through the polar dynamics of HCE, ALP, Shem, Shaun, Issy, and Mamalujo.',
      features: [
        'Interactive SVG network graph with force-directed physics',
        'Complete Buffalo notebook sigla glyphs (∐, Δ, ⊏, ⊐, ⊣, ⊥, S, X)',
        'Brunonian dialectic: Shem/Shaun polarity and coincidental union',
        'Detailed character archetype profiles and textual manifestations',
      ],
    },
    {
      id: 'vico-wheel',
      title: 'Viconian Historical Cycles & Ouroboros Wheel',
      work: 'Finnegans Wake (1939)',
      author: 'James Joyce',
      href: '/vico',
      readerHref: '/reader?work=finnegans-wake',
      icon: RotateCw,
      badge: 'Scienza Nuova &bull; Four-Age Radial Cosmogram',
      accentColor: 'emerald',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      borderClass: 'border-emerald-500/30 hover:border-emerald-500/60',
      description:
        'Radial multi-ring visualization of Giambattista Vico’s Scienza Nuova four-stage cyclical history—Age of Gods (Divine), Age of Heroes (Aristocratic), Age of Men (Democratic), and the cataclysmic Ricorso—mapped directly to the 4 books of the Wake.',
      features: [
        'Interactive SVG radial wheel with rotatable age sectors',
        'Mapping of all 17 chapters across the 4 books to Viconian eras',
        'The Three Viconian Institutions: Religion, Marriage, Burial',
        'The Ouroboros ricorso connecting page 628 back to page 3',
      ],
    },
    {
      id: 'thunderwords',
      title: 'The 10 Hundred-Letter Thunderwords Laboratory',
      work: 'Finnegans Wake (1939)',
      author: 'James Joyce',
      href: '/thunders',
      readerHref: '/reader?work=finnegans-wake',
      icon: Zap,
      badge: '1,001 Letters &bull; Acoustic & Etymological Exegesis',
      accentColor: 'amber',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      borderClass: 'border-amber-500/30 hover:border-amber-500/60',
      description:
        'A multimedia linguistic acoustic laboratory for the ten 100-letter thunderclaps (totaling 1,001 letters to echo The Thousand and One Nights). Unpacks 60+ global languages, phonetic IPA transcriptions, and speech synthesis.',
      features: [
        'Complete deconstruction of all 10 thunders across 60+ languages',
        'Browser Text-to-Speech audio pronunciation engine with pitch control',
        'Phonetic IPA transcriptions and syllable-by-syllable glosses',
        'Theological fall & Viconian thunderclap commentary',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Contextual Sub-Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Link
              href="/library"
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Library className="w-3.5 h-3.5 text-indigo-400" />
              <span>Works Catalog</span>
            </Link>
            <Link
              href="/library/coverage"
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Coverage Heatmap</span>
            </Link>
            <Link
              href="/schemas"
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 text-white shadow-md shadow-sky-600/30"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Critical Schemata</span>
            </Link>
          </div>
          <Link
            href="/reader"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-950/70 transition-colors ml-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Launch Reader &rarr;</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>Visual Hermeneutics &amp; Critical Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            Critical Schemata &amp; Visual Apparatus
          </h1>

          <p className="max-w-4xl text-slate-300 text-base sm:text-lg leading-relaxed">
            Encyclopedic literature requires architectural blueprints. Explore our five specialized visual hermeneutic instruments, designed to illuminate structural archetypes, cosmological cycles, genetic sigla, somatic body schemas, and cyberpunk cyberspace topologies across the WinnegansFake corpus.
          </p>
        </div>

        {/* Schemata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {schemata.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-7 rounded-2xl bg-slate-900/60 border ${item.borderClass} shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:bg-slate-900/80 group`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-inherit/40 flex items-center justify-center text-inherit group-hover:scale-105 transition-transform shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono tracking-wider opacity-75 uppercase">
                          {item.work} &bull; {item.author}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {item.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="inline-block">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono border ${item.badgeClass}`}
                      dangerouslySetInnerHTML={{ __html: item.badge }}
                    />
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Key Analytical Features:
                    </div>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
                      {item.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-400 font-bold shrink-0">&bull;</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <Link
                    href={item.href}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md group-hover:shadow-emerald-500/20"
                  >
                    <span>Launch Explorer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={item.readerHref}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in Reader</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Cross Links to Dissertations & Methodology */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-serif font-bold text-white">
              Want the theoretical foundation behind these schemata?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Read our peer-reviewed doctoral dissertations exploring the cosmology, genetic manuscripts, and algorithmic philology of modernism.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/dissertations"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
            >
              <span>Explore Dissertations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
