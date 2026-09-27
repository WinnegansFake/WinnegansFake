'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Search,
  ExternalLink,
  Info,
  Compass,
  Zap,
  Layers,
  ArrowRight,
  GitCommit,
  CheckCircle2,
} from 'lucide-react';

export interface SigilNode {
  id: string;
  glyph: string;
  name: string;
  title: string;
  aliases: string[];
  element: string;
  nature: string;
  polarityPartner?: string;
  polarityConcept?: string;
  notebookRef: string;
  description: string;
  significance: string;
  keyPages: { page: number; line?: number; label: string }[];
  cx: number;
  cy: number;
  color: string;
}

export const SIGLA_DATA: SigilNode[] = [
  {
    id: 'hce',
    glyph: '∐',
    name: 'HCE',
    title: 'Humphrey Chimpden Earwicker',
    aliases: ['Here Comes Everybody', 'Haveth Childers Everywhere', 'Howth Castle & Environs', 'Finn MacCool', 'The Mountain'],
    element: 'Earth / Bedrock',
    nature: 'The Patriarch / Static Topography',
    polarityPartner: 'alp',
    polarityConcept: 'Mountain & River (Static Mass ↔ Dynamic Flow)',
    notebookRef: 'Buffalo MSS VI.B.1, VI.B.6, VI.B.14',
    description: 'The primordial father and sleeping giant whose dormant body forms the Dublin landscape from Howth Head (his head) to Castleknock (his feet). Embodies universal human guilt (the Phoenix Park incident), civic architecture, and cyclical regeneration.',
    significance: 'Synthesizes Adam, Noah, Tristram, Duke of Wellington, Tim Finnegan, and Finn MacCool. He is the mountain that stands while the river washes his feet.',
    keyPages: [
      { page: 3, line: 1, label: 'FW 003: Swerve of shore & Howth Castle' },
      { page: 30, line: 1, label: 'FW 030: The Trial and rumor of HCE' },
      { page: 126, line: 1, label: 'FW 126: Shem’s riddle of the Patriarch' },
      { page: 532, line: 6, label: 'FW 532: Haveth Childers Everywhere' },
    ],
    cx: 400,
    cy: 220,
    color: '#10b981', // emerald
  },
  {
    id: 'alp',
    glyph: 'Δ',
    name: 'ALP',
    title: 'Anna Livia Plurabelle',
    aliases: ['River Liffey', 'Isis', 'The Midden Hen', 'Biddy the Hen', 'Alma Mater'],
    element: 'Water / Current',
    nature: 'The Matriarch / Eternal Circulation',
    polarityPartner: 'hce',
    polarityConcept: 'River & Mountain (Living Water ↔ Sleeping Giant)',
    notebookRef: 'Buffalo MSS VI.B.3, VI.B.8, VI.B.11',
    description: 'The eternal feminine and living waters of the River Liffey, flowing from the Wicklow mountains through Dublin Bay into the cold Irish Sea. She collects, pardons, and cleanses the sins of HCE and distributes life.',
    significance: 'Embodiment of Eve, Isis reassembling the dismembered Osiris, and the Hen scratching the sacred letter from the dung-heap. Her final monologue (pp. 619–628) delivers the book into dawn.',
    keyPages: [
      { page: 104, line: 1, label: 'FW 104: The Hen scratching the Midden Letter' },
      { page: 196, line: 1, label: 'FW 196: The Washerwomen by twilight' },
      { page: 213, line: 11, label: 'FW 213: Joyce 1929 ALP Audio Reading' },
      { page: 619, line: 20, label: 'FW 619: Anna Livia’s Final Monologue' },
    ],
    cx: 400,
    cy: 420,
    color: '#06b6d4', // cyan
  },
  {
    id: 'shem',
    glyph: '⊏',
    name: 'Shem the Penman',
    title: 'Shem / Jerry / Mercius',
    aliases: ['The Penman', 'The Elm Tree', 'Mercius', 'Glugg', 'Cain', 'Esau'],
    element: 'Tree / Wood / Organic Ink',
    nature: 'The Artist / Introverted Exile',
    polarityPartner: 'shaun',
    polarityConcept: 'Coincidentia Oppositorum (Tree ↔ Stone / Artist ↔ Scribe)',
    notebookRef: 'Buffalo MSS VI.B.1, VI.B.6, VI.B.19',
    description: 'The younger twin, autobiographical portrait of James Joyce himself. The rebellious writer who uses bodily excretions as ink to transcribe forbidden truths onto his own skin in exile.',
    significance: 'Rooted in Giordano Bruno’s coincidence of opposites with Shaun. He is the Elm tree murmuring by the river bank while Shaun is the rigid boundary stone.',
    keyPages: [
      { page: 169, line: 1, label: 'FW 169: Portrait of Shem the Penman' },
      { page: 185, line: 27, label: 'FW 185: Writing with his own bodily secretions' },
      { page: 282, line: 1, label: 'FW 282: Nightlessons left-hand marginalia' },
    ],
    cx: 250,
    cy: 320,
    color: '#a855f7', // purple
  },
  {
    id: 'shaun',
    glyph: '⊐',
    name: 'Shaun the Post',
    title: 'Shaun / Kevin / Justius',
    aliases: ['The Postman', 'The Stone', 'Justius', 'Chuff', 'Abel', 'Jacob'],
    element: 'Stone / Mineral / Legalistic Stamp',
    nature: 'The Bureaucrat / Conformist Citizen',
    polarityPartner: 'shem',
    polarityConcept: 'Coincidentia Oppositorum (Stone ↔ Tree / Delivery ↔ Creation)',
    notebookRef: 'Buffalo MSS VI.B.1, VI.B.6, VI.B.19',
    description: 'The elder twin, moralistic, corpulent, and respectable. The deliveryman carrying Shem’s sealed letter without understanding its contents. Moves through four avatars in Book III (Shaun, Jaun, Yawn, HCE reborn).',
    significance: 'The pillar of church, state, and bourgeois civic respectability. In the Nightlessons, represented by Kev who punches Dolph (Shem) for revealing sacred anatomical geometry.',
    keyPages: [
      { page: 403, line: 1, label: 'FW 403: Shaun the Post appears with his bag' },
      { page: 429, line: 1, label: 'FW 429: Jaun’s sermon to the Rainbow Girls' },
      { page: 474, line: 1, label: 'FW 474: Yawn lying on the sacred mound' },
    ],
    cx: 550,
    cy: 320,
    color: '#f59e0b', // amber
  },
  {
    id: 'issy',
    glyph: '⊣',
    name: 'Issy',
    title: 'Isolde / The Divided Daughter',
    aliases: ['Isolde of the White Hands', 'Nuvoletta', 'The 28 Rainbow Girls', 'Stella & Vanessa'],
    element: 'Air / Light Refraction',
    nature: 'The Daughter / Multiplied Reflection',
    notebookRef: 'Buffalo MSS VI.B.1, VI.B.14, VI.B.33',
    description: 'The daughter of HCE and ALP, embodiment of youthful female narcissism, split into mirror-reflections and accompanied by the 28 Rainbow Girls (representing the days of February in a leap year).',
    significance: 'Parallels Jonathan Swift’s bifurcated love for Stella (Esther Johnson) and Vanessa (Esther Vanhomrigh), and Wagner’s Isolde. In chapter II.2, her teasing commentary appears in the bottom footnotes.',
    keyPages: [
      { page: 157, line: 8, label: 'FW 157: Nuvoletta on the cloud' },
      { page: 260, line: 1, label: 'FW 260: Footnotes in the Nightlessons' },
      { page: 556, line: 1, label: 'FW 556: Issy in the nursery bed' },
    ],
    cx: 650,
    cy: 190,
    color: '#ec4899', // pink
  },
  {
    id: 'mamalujo',
    glyph: '⊥',
    name: 'Mamalujo',
    title: 'The Four Old Men / Historians',
    aliases: ['Matthew, Mark, Luke & John', 'Four Provinces', 'Four Bedposts', 'Four Evangelists', 'Four Master Annalists'],
    element: 'Ether / Senile Memory',
    nature: 'The Voyeurs / Provincial Chroniclers',
    notebookRef: 'Buffalo MSS VI.B.1, VI.B.6, VI.B.11',
    description: 'Matt Gregory, Marcus Lyons, Luke Tarpey, and Johnny MacDougall: four senile, gossiping old men who observe the action from the four bedposts or the four corners of Ireland.',
    significance: 'Represent the Four Evangelists and the Annals of the Four Masters (historical chroniclers of Donegal). They speak in rambling, repetitive chorus and eavesdrop on Tristan and Isolde.',
    keyPages: [
      { page: 383, line: 1, label: 'FW 383: The Four Old Men voyeurs' },
      { page: 397, line: 1, label: 'FW 397: Tristan & Isolde aboard ship' },
      { page: 523, line: 1, label: 'FW 523: Interrogation of Yawn' },
    ],
    cx: 150,
    cy: 190,
    color: '#3b82f6', // blue
  },
  {
    id: 'twelve',
    glyph: 'S',
    name: 'The Twelve',
    title: 'The Twelve Customers / Jurors',
    aliases: ['The Jurymen', 'The Mourners', 'The Zodiac', 'The Apostles', 'The Dublin Mob'],
    element: 'Collective Voice',
    nature: 'The Public Jury / Middle-Class Gossip',
    notebookRef: 'Buffalo MSS VI.B.6, VI.B.10',
    description: 'The twelve customers drinking in HCE’s Chapelizod public house. They serve as the jury deliberating his guilt, the twelve signs of the zodiac, and the Greek chorus of Dublin middle-class consensus.',
    significance: 'Always speak in flowery, polysyllabic, Latinate phrases terminating with "—ation" or "—ity". They assess and sentence HCE.',
    keyPages: [
      { page: 142, line: 1, label: 'FW 142: The Twelve Apostles question' },
      { page: 370, line: 1, label: 'FW 370: Closing time in the tavern' },
    ],
    cx: 400,
    cy: 80,
    color: '#eab308', // yellow
  },
  {
    id: 'crossroads',
    glyph: 'X',
    name: 'The Crossroads',
    title: 'The Intersection / The Foursome',
    aliases: ['The Four Crossroads', 'St. Andrew’s Cross', 'The Meeting Point'],
    element: 'Space-Time Matrix',
    nature: 'Spatial Coordinates / Cardinal Points',
    notebookRef: 'Buffalo MSS VI.B.6, VI.B.14',
    description: 'The spatial intersection of North, South, East, and West; the crossroads of Chapelizod where the murder or confrontation occurs; the meeting point where contradictory narratives cross.',
    significance: 'The structural locus of the Wake where the four provinces intersect and where Vico’s cyclic history turns on its axis.',
    keyPages: [
      { page: 55, line: 1, label: 'FW 055: The cross-road encounter' },
      { page: 293, line: 1, label: 'FW 293: The Euclidean diagram intersection' },
    ],
    cx: 400,
    cy: 320,
    color: '#94a3b8', // slate
  },
];

export function SiglaConstellation() {
  const [selectedSigil, setSelectedSigil] = useState<SigilNode>(SIGLA_DATA[0]);
  const [hoveredSigil, setHoveredSigil] = useState<SigilNode | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Genetic Joyce & Buffalo Notebooks</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
          The Sigla Constellation & Dialectical Graph
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          In his working notebooks preserved at the University at Buffalo (MSS VI.B), James Joyce abandoned alphabetic names
          and encoded the dramatis personæ of <em>Finnegans Wake</em> into hieroglyphic <strong>sigla</strong>.
          These archetypes operate through Giordano Bruno’s <em>coincidentia oppositorum</em>—where opposing polarities
          collapse into singular mythical forms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Subtle cosmic background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

          {/* Canvas Title Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Archetype Graph (Click any node)</span>
          </div>

          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto max-w-2xl select-none relative z-10"
          >
            <defs>
              {/* Glow filter */}
              <filter id="sigil-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dialectical Axis 1: Shem ↔ Shaun (coincidentia oppositorum) */}
            <line
              x1="250"
              y1="320"
              x2="550"
              y2="320"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-40 animate-pulse"
            />
            <text
              x="400"
              y="308"
              fill="#c084fc"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
              className="opacity-75"
            >
              Bruno Dialectic: Tree ⊏ ↔ ⊐ Stone
            </text>

            {/* Dialectical Axis 2: HCE ↔ ALP (Mountain ↔ River) */}
            <line
              x1="400"
              y1="220"
              x2="400"
              y2="420"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="opacity-40 animate-pulse"
            />
            <text
              x="410"
              y="370"
              fill="#38bdf8"
              fontSize="10"
              fontFamily="monospace"
              textAnchor="start"
              className="opacity-75"
            >
              Mountain ∐ ↔ Δ River
            </text>

            {/* Diagonal Connection Lines to Issy & Mamalujo */}
            <line x1="400" y1="220" x2="650" y2="190" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="400" y1="220" x2="150" y2="190" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <line x1="400" y1="220" x2="400" y2="80" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

            {/* Nodes */}
            {SIGLA_DATA.map((node) => {
              const isSelected = selectedSigil.id === node.id;
              const isHovered = hoveredSigil?.id === node.id;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedSigil(node)}
                  onMouseEnter={() => setHoveredSigil(node)}
                  onMouseLeave={() => setHoveredSigil(null)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{
                    transform: isSelected || isHovered ? 'scale(1.08)' : 'scale(1)',
                    transformOrigin: `${node.cx}px ${node.cy}px`,
                  }}
                >
                  {/* Outer circle halo */}
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={isSelected ? 36 : 28}
                    fill={node.color}
                    fillOpacity={isSelected ? 0.25 : 0.12}
                    stroke={node.color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter={isSelected ? 'url(#sigil-glow)' : undefined}
                  />

                  {/* Sigil glyph symbol */}
                  <text
                    x={node.cx}
                    y={node.cy + 7}
                    fill="#ffffff"
                    fontSize={isSelected ? 22 : 18}
                    fontFamily="serif"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.glyph}
                  </text>

                  {/* Node label below */}
                  <text
                    x={node.cx}
                    y={node.cy + (isSelected ? 52 : 44)}
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Archetype Badges underneath */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-800/80">
            {SIGLA_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSigil(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all ${
                  selectedSigil.id === s.id
                    ? 'bg-slate-700 text-white border border-slate-500 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span className="font-bold text-sm" style={{ color: s.color }}>{s.glyph}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Sigil Dossier Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-serif font-black" style={{ color: selectedSigil.color }}>
                    {selectedSigil.glyph}
                  </span>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white leading-none">
                      {selectedSigil.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedSigil.title}</p>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {selectedSigil.element}
              </span>
            </div>

            {/* Polarity Partner Alert */}
            {selectedSigil.polarityConcept && (
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-purple-300 text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-[10px] text-purple-400 block">
                  Giordano Bruno Polarity
                </span>
                <p>{selectedSigil.polarityConcept}</p>
              </div>
            )}

            {/* Description & Significance */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Archetypal Role</h4>
                <p className="text-slate-400">{selectedSigil.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Scholarly Significance</h4>
                <p className="text-slate-400">{selectedSigil.significance}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 font-mono text-[11px] block">
                  Buffalo Archive Catalog:
                </span>
                <span className="text-slate-300 font-mono text-[11px]">
                  {selectedSigil.notebookRef}
                </span>
              </div>
            </div>

            {/* Aliases */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Aliases & Expansions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSigil.aliases.map((alias, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Passages with Direct Reader Jumps */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Landmark Page Jumps
              </span>
              <div className="space-y-1.5">
                {selectedSigil.keyPages.map((kp, idx) => (
                  <Link
                    key={idx}
                    href={`/reader?work=finneganswake&page=${kp.page}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 hover:text-white transition-colors group"
                  >
                    <span className="truncate pr-2">{kp.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <Link
                href={`/search?q=${encodeURIComponent(selectedSigil.name)}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shadow-lg shadow-purple-600/20"
              >
                <Search className="w-4 h-4" />
                <span>Search All Corpus Annotations for {selectedSigil.name}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
