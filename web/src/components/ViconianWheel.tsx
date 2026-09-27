'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCw,
  BookOpen,
  Zap,
  Sparkles,
  ArrowRight,
  Info,
  Compass,
  Volume2,
  Calendar,
} from 'lucide-react';

export interface VicoAge {
  id: string;
  bookNum: number;
  bookRoman: string;
  name: string;
  vicoAge: string;
  pageSpan: string;
  pages: { start: number; end: number };
  chaptersCount: number;
  institution: string;
  languageType: string;
  color: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
  thunders: number[];
  thematicSummary: string;
  beckettNote: string;
  chapters: { num: string; title: string; startPage: number }[];
}

export const VICO_AGES: VicoAge[] = [
  {
    id: 'gods',
    bookNum: 1,
    bookRoman: 'Book I',
    name: 'The Parents & The Giant',
    vicoAge: 'The Age of Gods (Theocratic / Divine)',
    pageSpan: 'pp. 3–216',
    pages: { start: 3, end: 216 },
    chaptersCount: 8,
    institution: 'Religion, Sacred Fear, Burial of Dead',
    languageType: 'Hieroglyphic / Sacred Signs',
    color: '#f59e0b', // amber
    accentClass: 'text-amber-400',
    borderClass: 'border-amber-500/40',
    bgClass: 'bg-amber-950/20',
    thunders: [1, 2, 3, 4, 5, 6],
    thematicSummary:
      'The cosmic genesis, the primordial fall of Finnegan/Humpty Dumpty, the terror of thunderclaps 1–6, the emergence of the patriarchal mountain (HCE), the hen digging the sacred letter from the dung-heap, and the washerwomen talking by the river at twilight.',
    beckettNote:
      '"In the first age, religion; in the second, marriage; in the third, burial. The thunder is the voice of God startling the giants into reverence and caves." — Samuel Beckett (1929)',
    chapters: [
      { num: 'I.1', title: 'The Fall & The Museyroom', startPage: 3 },
      { num: 'I.2', title: 'The Encounter with the Cad', startPage: 30 },
      { num: 'I.3', title: 'The Trial & Slander of HCE', startPage: 48 },
      { num: 'I.4', title: 'The Inquest & The Fox Hunt', startPage: 75 },
      { num: 'I.5', title: 'The Hen & The Sacred Letter', startPage: 104 },
      { num: 'I.6', title: 'The Twelve Riddles of Shem', startPage: 126 },
      { num: 'I.7', title: 'Portrait of Shem the Penman', startPage: 169 },
      { num: 'I.8', title: 'Anna Livia Plurabelle (Washerwomen)', startPage: 196 },
    ],
  },
  {
    id: 'heroes',
    bookNum: 2,
    bookRoman: 'Book II',
    name: 'The Sons & The Games',
    vicoAge: 'The Age of Heroes (Aristocratic / Heroic)',
    pageSpan: 'pp. 219–399',
    pages: { start: 219, end: 399 },
    chaptersCount: 4,
    institution: 'Marriage, Chivalric Feuds, Aristocracy',
    languageType: 'Symbolic / Heroic Metaphor',
    color: '#10b981', // emerald
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/40',
    bgClass: 'bg-emerald-950/20',
    thunders: [7, 8, 9],
    thematicSummary:
      'The domestic children take center stage. Feuds of youth, twilight theater (Mime of Mick, Nick and the Maggies), the nocturnal geometry lesson where Shem shows Shaun the triangle of motherhood, and the chaotic drinking feast in the tavern.',
    beckettNote:
      '"The second age is that of the heroic patriciate. The passions are military, violent, and theatrical; language operates through emblems and heroic metaphors." — Donald Phillip Verene',
    chapters: [
      { num: 'II.1', title: 'The Mime of Mick, Nick & the Maggies', startPage: 219 },
      { num: 'II.2', title: 'Nightlessons (Dolph & Kev Geometry)', startPage: 260 },
      { num: 'II.3', title: 'The Tavern Host & The Norwegian Captain', startPage: 310 },
      { num: 'II.4', title: 'Mamalujo & Tristan and Isolde', startPage: 383 },
    ],
  },
  {
    id: 'men',
    bookNum: 3,
    bookRoman: 'Book III',
    name: 'The People & The Bureaucrat',
    vicoAge: 'The Age of Men (Human / Democratic)',
    pageSpan: 'pp. 403–590',
    pages: { start: 403, end: 590 },
    chaptersCount: 4,
    institution: 'Human Law, Civil Liberty, Commercial Decay',
    languageType: 'Epistolary / Commercial Demotic Prose',
    color: '#38bdf8', // sky
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/40',
    bgClass: 'bg-sky-950/20',
    thunders: [10],
    thematicSummary:
      'Shaun the Post journeys across the night with his post-bag in four successive avatars (Shaun, Jaun, Yawn, and HCE reborn). Rationalistic inquests, civil cross-examinations, and the gradual dissolution of all authority into legalistic babble.',
    beckettNote:
      '"The third age is that of human equality and civil law. Language becomes intellectual, philosophical, and eventually bureaucratic and corrupt." — Clive Hart (1962)',
    chapters: [
      { num: 'III.1', title: 'Shaun the Postman & The Barrel', startPage: 403 },
      { num: 'III.2', title: 'Jaun’s Sermon to the 28 Rainbow Girls', startPage: 429 },
      { num: 'III.3', title: 'Yawn Interrogated on the Sacred Mound', startPage: 474 },
      { num: 'III.4', title: 'The Royal Bed of HCE & ALP', startPage: 555 },
    ],
  },
  {
    id: 'ricorso',
    bookNum: 4,
    bookRoman: 'Book IV',
    name: 'The Ricorso & The Dawn',
    vicoAge: 'The Ricorso (The Cyclical Return)',
    pageSpan: 'pp. 593–628',
    pages: { start: 593, end: 628 },
    chaptersCount: 1,
    institution: 'Resurrection, Renewal, The Ouroboros Join',
    languageType: 'Poetic Awakening & Lyrical Soliloquy',
    color: '#ec4899', // pink
    accentClass: 'text-pink-400',
    borderClass: 'border-pink-500/40',
    bgClass: 'bg-pink-950/20',
    thunders: [],
    thematicSummary:
      'The morning breaks over Dublin Bay. Saint Kevin bathes in his holy tub, Patrick disputes with the Druid of the Sun, and Anna Livia Plurabelle whispers her bittersweet final soliloquy as she flows out to sea to meet her cold father the Ocean.',
    beckettNote:
      '"The Ricorso is not a fifth age, but the wheel revolving back upon itself. The final incomplete syllable of page 628 pours directly into page 3." — Samuel Beckett',
    chapters: [
      { num: 'IV.1', title: 'The Dawn, Saint Kevin & ALP’s Monologue', startPage: 593 },
    ],
  },
];

export function ViconianWheel() {
  const [selectedAge, setSelectedAge] = useState<VicoAge>(VICO_AGES[0]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Viconian Philosophy & Ouroboros Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          The Viconian Historical Cycle & Ouroboros Wheel
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          In his 1725 treatise <em>Scienza Nuova</em> (The New Science), Giambattista Vico formulated
          the <strong>storia ideale eterna</strong> (ideal eternal history)—a recurring cycle of three
          historical ages followed by a <em>ricorso</em>. James Joyce constructed the four books of{' '}
          <em>Finnegans Wake</em> upon this very cyclical wheel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Radial Wheel Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Interactive Cyclical Wheel (Click any quadrant)</span>
          </div>

          <svg viewBox="0 0 600 600" className="w-full h-auto max-w-lg select-none my-4">
            <defs>
              <filter id="ouroboros-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background circular guides */}
            <circle cx="300" cy="300" r="260" fill="none" stroke="#1e293b" strokeWidth="1" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="300" cy="300" r="120" fill="none" stroke="#334155" strokeWidth="1.5" />

            {/* Quadrant 1: Book I - Gods (Top-Right: -90° to 0°) */}
            <path
              d="M 300 300 L 300 50 A 250 250 0 0 1 550 300 Z"
              fill={selectedAge.id === 'gods' ? '#f59e0b' : '#f59e0b'}
              fillOpacity={selectedAge.id === 'gods' ? 0.35 : 0.15}
              stroke="#f59e0b"
              strokeWidth={selectedAge.id === 'gods' ? 3 : 1.5}
              className="cursor-pointer transition-all hover:fill-opacity-40"
              onClick={() => setSelectedAge(VICO_AGES[0])}
            />

            {/* Quadrant 2: Book II - Heroes (Bottom-Right: 0° to 90°) */}
            <path
              d="M 300 300 L 550 300 A 250 250 0 0 1 300 550 Z"
              fill={selectedAge.id === 'heroes' ? '#10b981' : '#10b981'}
              fillOpacity={selectedAge.id === 'heroes' ? 0.35 : 0.15}
              stroke="#10b981"
              strokeWidth={selectedAge.id === 'heroes' ? 3 : 1.5}
              className="cursor-pointer transition-all hover:fill-opacity-40"
              onClick={() => setSelectedAge(VICO_AGES[1])}
            />

            {/* Quadrant 3: Book III - Men (Bottom-Left: 90° to 180°) */}
            <path
              d="M 300 300 L 300 550 A 250 250 0 0 1 50 300 Z"
              fill={selectedAge.id === 'men' ? '#38bdf8' : '#38bdf8'}
              fillOpacity={selectedAge.id === 'men' ? 0.35 : 0.15}
              stroke="#38bdf8"
              strokeWidth={selectedAge.id === 'men' ? 3 : 1.5}
              className="cursor-pointer transition-all hover:fill-opacity-40"
              onClick={() => setSelectedAge(VICO_AGES[2])}
            />

            {/* Quadrant 4: Book IV - The Ricorso (Top-Left: 180° to 270°) */}
            <path
              d="M 300 300 L 50 300 A 250 250 0 0 1 300 50 Z"
              fill={selectedAge.id === 'ricorso' ? '#ec4899' : '#ec4899'}
              fillOpacity={selectedAge.id === 'ricorso' ? 0.35 : 0.15}
              stroke="#ec4899"
              strokeWidth={selectedAge.id === 'ricorso' ? 3 : 1.5}
              className="cursor-pointer transition-all hover:fill-opacity-40"
              onClick={() => setSelectedAge(VICO_AGES[3])}
            />

            {/* Quadrant Labels */}
            <text x="420" y="180" fill="#f59e0b" fontSize="14" fontFamily="serif" fontWeight="bold" textAnchor="middle">
              I. AGE OF GODS
            </text>
            <text x="420" y="200" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">
              pp. 3–216 (8 Ch.)
            </text>

            <text x="420" y="410" fill="#10b981" fontSize="14" fontFamily="serif" fontWeight="bold" textAnchor="middle">
              II. AGE OF HEROES
            </text>
            <text x="420" y="430" fill="#34d399" fontSize="11" fontFamily="monospace" textAnchor="middle">
              pp. 219–399 (4 Ch.)
            </text>

            <text x="180" y="410" fill="#38bdf8" fontSize="14" fontFamily="serif" fontWeight="bold" textAnchor="middle">
              III. AGE OF MEN
            </text>
            <text x="180" y="430" fill="#7dd3fc" fontSize="11" fontFamily="monospace" textAnchor="middle">
              pp. 403–590 (4 Ch.)
            </text>

            <text x="180" y="180" fill="#ec4899" fontSize="14" fontFamily="serif" fontWeight="bold" textAnchor="middle">
              IV. THE RICORSO
            </text>
            <text x="180" y="200" fill="#f472b6" fontSize="11" fontFamily="monospace" textAnchor="middle">
              pp. 593–628 (1 Ch.)
            </text>

            {/* Center Ouroboros Hub */}
            <circle cx="300" cy="300" r="90" fill="#0f172a" stroke="#64748b" strokeWidth="2" filter="url(#ouroboros-glow)" />

            <circle
              cx="300"
              cy="300"
              r="76"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-spin"
              style={{ animationDuration: '24s', transformOrigin: '300px 300px' }}
            />

            <text x="300" y="290" fill="#ffffff" fontSize="13" fontFamily="serif" fontWeight="bold" textAnchor="middle">
              THE OUROBOROS
            </text>
            <text x="300" y="310" fill="#fbbf24" fontSize="10" fontFamily="monospace" textAnchor="middle">
              p. 628 ➔ p. 3
            </text>
            <text x="300" y="325" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
              &quot;A way a lone...&quot;
            </text>
          </svg>

          {/* Quick Quadrant Switcher Tabs */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-slate-800">
            {VICO_AGES.map((age) => (
              <button
                key={age.id}
                onClick={() => setSelectedAge(age)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedAge.id === age.id
                    ? `${age.bgClass} ${age.borderClass} shadow-md`
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold uppercase block ${age.accentClass}`}>
                  {age.bookRoman}
                </span>
                <span className="text-xs font-semibold text-white truncate block">{age.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Vico Age Dossier */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-5">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedAge.accentClass}`}>
                {selectedAge.bookRoman} &bull; {selectedAge.pageSpan}
              </span>
              <h3 className="text-2xl font-serif font-bold text-white mt-1">
                {selectedAge.vicoAge}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedAge.name}</p>
            </div>

            {/* Viconian Institution */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
                  Viconian Institution:
                </span>
                <span className="font-semibold text-slate-200">{selectedAge.institution}</span>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Thematic Architecture</h4>
                <p className="text-slate-400 leading-relaxed">{selectedAge.thematicSummary}</p>
              </div>

              {/* Samuel Beckett / Scholar Quote */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-amber-200/90 text-xs italic">
                {selectedAge.beckettNote}
              </div>

              {/* Associated Thunders */}
              {selectedAge.thunders.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Thunders in This Age
                    </span>
                    <Link
                      href="/thunders"
                      className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      View in Lab &rarr;
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAge.thunders.map((t) => (
                      <Link
                        key={t}
                        href={`/thunders#thunder-${t}`}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs hover:bg-amber-500/20 transition-colors"
                      >
                        Thunder {t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapters List */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Chapters in {selectedAge.bookRoman}
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {selectedAge.chapters.map((ch, idx) => (
                  <Link
                    key={idx}
                    href={`/reader?work=finneganswake&page=${ch.startPage}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <span className="font-mono text-amber-400 font-semibold mr-2">{ch.num}</span>
                      <span>{ch.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-amber-400 shrink-0">
                      p. {ch.startPage}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Primary Action */}
            <div className="pt-2">
              <Link
                href={`/reader?work=finneganswake&page=${selectedAge.pages.start}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-lg shadow-amber-600/20"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Opening of {selectedAge.bookRoman} (Page {selectedAge.pages.start})</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
