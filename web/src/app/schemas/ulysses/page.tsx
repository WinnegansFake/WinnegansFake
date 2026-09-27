'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Filter,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  Activity,
  Palette,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { getBasePath } from '@/lib/constants';

interface EpisodeSchema {
  episode: number;
  part: number;
  title: string;
  startPage: number;
  hour: string;
  scene: string;
  homer: string;
  organ: string;
  art: string;
  color: string;
  symbol: string;
  technique: string;
  meaning: string;
}

const ULYSSES_SCHEMAS: EpisodeSchema[] = [
  {
    episode: 1,
    part: 1,
    title: 'Telemachus',
    startPage: 1,
    hour: '8 AM',
    scene: 'The Tower (Sandycove)',
    homer: 'Telemachus, Mentor, Antinous',
    organ: 'None',
    art: 'Theology',
    color: 'White, Gold',
    symbol: 'Heir',
    technique: 'Narrative (young)',
    meaning: 'The Dispossessed Son in the Tower',
  },
  {
    episode: 2,
    part: 1,
    title: 'Nestor',
    startPage: 29,
    hour: '10 AM',
    scene: 'The School (Dalkey)',
    homer: 'Nestor, Pisistratus, Helen',
    organ: 'None',
    art: 'History',
    color: 'Brown',
    symbol: 'Horse',
    technique: 'Catechism (personal)',
    meaning: 'The Wisdom of the Past and Debt',
  },
  {
    episode: 3,
    part: 1,
    title: 'Proteus',
    startPage: 51,
    hour: '11 AM',
    scene: 'The Strand (Sandymount)',
    homer: 'Proteus, Menelaus, Megapenthes',
    organ: 'None',
    art: 'Philology',
    color: 'Green',
    symbol: 'Tide',
    technique: 'Monologue (male)',
    meaning: 'Primal Matter in Metamorphosis',
  },
  {
    episode: 4,
    part: 2,
    title: 'Calypso',
    startPage: 71,
    hour: '8 AM',
    scene: 'The House (7 Eccles Street)',
    homer: 'Calypso, Ulysses, Penelope',
    organ: 'Kidney',
    art: 'Economics',
    color: 'Orange',
    symbol: 'Nymph',
    technique: 'Narrative (mature)',
    meaning: 'The Departure of the Wanderer',
  },
  {
    episode: 5,
    part: 2,
    title: 'Lotus Eaters',
    startPage: 95,
    hour: '10 AM',
    scene: 'The Bath (Westland Row)',
    homer: 'Lotus Eaters, Eurylokhos',
    organ: 'Genitals',
    art: 'Botany, Chemistry',
    color: 'Dark Brown',
    symbol: 'Eucharist',
    technique: 'Narcissism',
    meaning: 'The Seduction of Inertia and Fragrance',
  },
  {
    episode: 6,
    part: 2,
    title: 'Hades',
    startPage: 117,
    hour: '11 AM',
    scene: 'The Graveyard (Glasnevin)',
    homer: 'Elpenor, Ulysses, Tiresias',
    organ: 'Heart',
    art: 'Religion',
    color: 'White, Black',
    symbol: 'Caretaker',
    technique: 'Incubism',
    meaning: 'The Descent into the Underworld of Dublin',
  },
  {
    episode: 7,
    part: 2,
    title: 'Aeolus',
    startPage: 153,
    hour: '12 PM',
    scene: 'The Newspaper (Evening Telegraph)',
    homer: 'Aeolus, Sons, Daughters',
    organ: 'Lungs',
    art: 'Rhetoric',
    color: 'Red',
    symbol: 'Editor',
    technique: 'Fuga per canonem (Headlines)',
    meaning: 'The Mockery of Journalism and Gusts',
  },
  {
    episode: 8,
    part: 2,
    title: 'Lestrygonians',
    startPage: 199,
    hour: '1 PM',
    scene: 'The Lunch (Davy Byrne’s Pub)',
    homer: 'Antiphates, The Decoy',
    organ: 'Esophagus',
    art: 'Architecture',
    color: 'Blood-red',
    symbol: 'Constables',
    technique: 'Peristalsis',
    meaning: 'The Digestion of Food and Emotion',
  },
  {
    episode: 9,
    part: 2,
    title: 'Scylla and Charybdis',
    startPage: 243,
    hour: '2 PM',
    scene: 'The Library (Kildare Street)',
    homer: 'Scylla, Charybdis, Ulysses',
    organ: 'Brain',
    art: 'Literature',
    color: 'None',
    symbol: 'Stratford, London',
    technique: 'Dialectic',
    meaning: 'The Two Horns of the Dilemma (Shakespeare Theory)',
  },
  {
    episode: 10,
    part: 2,
    title: 'Wandering Rocks',
    startPage: 283,
    hour: '3 PM',
    scene: 'The Streets (Dublin Thoroughfares)',
    homer: 'Bosphorus, Symplegades',
    organ: 'Blood',
    art: 'Mechanics',
    color: 'Rainbow',
    symbol: 'Citizens',
    technique: 'Labyrinth',
    meaning: 'The Hostile Environment of the City Organism',
  },
  {
    episode: 11,
    part: 2,
    title: 'Sirens',
    startPage: 329,
    hour: '4 PM',
    scene: 'The Concert Room (Ormond Hotel)',
    homer: 'Sirens, Isle of Sirens',
    organ: 'Ear',
    art: 'Music',
    color: 'Coral',
    symbol: 'Barmaids',
    technique: 'Fuga per canonem',
    meaning: 'The Seduction of Sound and Acoustic Trap',
  },
  {
    episode: 12,
    part: 2,
    title: 'Cyclops',
    startPage: 373,
    hour: '5 PM',
    scene: 'The Tavern (Little Britain Street)',
    homer: 'Polyphemus, Nobody (Ulysses)',
    organ: 'Muscle',
    art: 'Politics',
    color: 'Emerald',
    symbol: 'Fenian',
    technique: 'Gigantism (Parody)',
    meaning: 'Egocidal Chauvinism and Narrow Vision',
  },
  {
    episode: 13,
    part: 2,
    title: 'Nausicaa',
    startPage: 445,
    hour: '8 PM',
    scene: 'The Rocks (Sandymount Strand)',
    homer: 'Nausicaa, Phaeacians',
    organ: 'Eye, Nose',
    art: 'Painting',
    color: 'Blue, Grey',
    symbol: 'Virgin',
    technique: 'Tumescence, Detumescence',
    meaning: 'The Mirage of Sentimental Romance',
  },
  {
    episode: 14,
    part: 2,
    title: 'Oxen of the Sun',
    startPage: 487,
    hour: '10 PM',
    scene: 'The Hospital (Holles Street)',
    homer: 'Helios, Lampetie, Phaethusa',
    organ: 'Womb',
    art: 'Medicine',
    color: 'White',
    symbol: 'Mothers',
    technique: 'Embryonic Development (Prose Styles)',
    meaning: 'The Evolution of the English Language and Birth',
  },
  {
    episode: 15,
    part: 2,
    title: 'Circe',
    startPage: 539,
    hour: '12 AM',
    scene: 'The Brothel (Nighttown / Monto)',
    homer: 'Circe, Swine, Telemachus',
    organ: 'Locomotor Apparatus',
    art: 'Magic',
    color: 'Violet',
    symbol: 'Whore',
    technique: 'Hallucination (Dramatic Play)',
    meaning: 'The Anthropoid Vision of the Unconscious',
  },
  {
    episode: 16,
    part: 3,
    title: 'Eumaeus',
    startPage: 659,
    hour: '1 AM',
    scene: 'The Shelter (Butt Bridge)',
    homer: 'Eumaeus, Ulysses, Telemachus',
    organ: 'Nerves',
    art: 'Navigation',
    color: 'None',
    symbol: 'Sailors',
    technique: 'Narrative (old, exhausted)',
    meaning: 'The Fatigue of Post-Climactic Exhaustion',
  },
  {
    episode: 17,
    part: 3,
    title: 'Ithaca',
    startPage: 703,
    hour: '2 AM',
    scene: 'The House (7 Eccles Street)',
    homer: 'Eurymachus, Antinous, Bow',
    organ: 'Skeleton',
    art: 'Science',
    color: 'Comets',
    symbol: 'Mothers',
    technique: 'Catechism (impersonal)',
    meaning: 'Cosmic Pacification in Mathematical Order',
  },
  {
    episode: 18,
    part: 3,
    title: 'Penelope',
    startPage: 721,
    hour: '∞',
    scene: 'The Bed',
    homer: 'Penelope, Earth, Ulysses',
    organ: 'Flesh',
    art: 'None',
    color: 'Orange',
    symbol: 'Earth',
    technique: 'Monologue (female, unpunctuated)',
    meaning: 'The Final Unconditional Affirmation ("Yes")',
  },
];

export default function UlyssesSchemaPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [organFilter, setOrganFilter] = useState<string>('all');
  const [partFilter, setPartFilter] = useState<string>('all');

  // Unique organs
  const organs = useMemo(() => {
    return Array.from(new Set(ULYSSES_SCHEMAS.map((e) => e.organ).filter((o) => o !== 'None'))).sort();
  }, []);

  const filteredEpisodes = useMemo(() => {
    return ULYSSES_SCHEMAS.filter((e) => {
      if (partFilter !== 'all' && e.part !== parseInt(partFilter, 10)) return false;
      if (organFilter !== 'all' && e.organ !== organFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          e.title.toLowerCase().includes(q) ||
          e.scene.toLowerCase().includes(q) ||
          e.homer.toLowerCase().includes(q) ||
          e.art.toLowerCase().includes(q) ||
          e.technique.toLowerCase().includes(q) ||
          e.symbol.toLowerCase().includes(q) ||
          e.meaning.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [searchQuery, organFilter, partFilter]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>Gilbert (1921) &amp; Linati (1920) Schemas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            Ulysses Canonical Schema Matrix
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-serif">
            James Joyce devised two legendary schema tables for <em>Ulysses</em> to reveal the hidden architectural matrix of Bloomsday:
            the Homeric correspondences, Dublin topography, somatic organs of the body, colors, symbols, and narrative techniques.
          </p>

          <div className="flex items-center justify-center flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Episodes: <strong className="text-slate-200">18 Episodes</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Structure: <strong className="text-emerald-400">3 Parts (Telemachiad, Odyssey, Nostos)</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Organ Matrix: <strong className="text-rose-400">Human Body as Cathedral</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Homer, organs, techniques..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Facets */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
            {/* Part Filter */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <span className="text-[11px] font-medium text-slate-500">Part:</span>
              <select
                value={partFilter}
                onChange={(e) => setPartFilter(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All 3 Parts</option>
                <option value="1">Part I: The Telemachiad</option>
                <option value="2">Part II: The Odyssey</option>
                <option value="3">Part III: Nostos</option>
              </select>
            </div>

            {/* Organ Filter */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <span className="text-[11px] font-medium text-slate-500">Organ:</span>
              <select
                value={organFilter}
                onChange={(e) => setOrganFilter(e.target.value)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Organs</option>
                {organs.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {(searchQuery || organFilter !== 'all' || partFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setOrganFilter('all');
                  setPartFilter('all');
                }}
                className="text-[11px] text-indigo-400 hover:underline px-2 py-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Episodes */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEpisodes.map((ep) => (
            <div
              key={ep.episode}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-bold text-indigo-300">
                      {ep.episode}
                    </span>
                    <h2 className="text-base font-bold font-serif text-white">{ep.title}</h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    p. {ep.startPage}
                  </span>
                </div>

                {/* Spatio-Temporal Anchor */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{ep.hour}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate" title={ep.scene}>
                      {ep.scene}
                    </span>
                  </div>
                </div>

                {/* Homeric & Organ */}
                <div className="space-y-1.5 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-slate-500">Homer Parallel</span>
                      <span className="text-indigo-300 font-medium text-right text-[11px] truncate max-w-[170px]">
                        {ep.homer}
                      </span>
                    </div>
                    {ep.organ !== 'None' && (
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-1">
                        <span className="text-[10px] uppercase font-mono text-slate-500">Organ of Body</span>
                        <span className="text-rose-400 font-medium text-right text-[11px]">{ep.organ}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Art & Technique */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Art / Science:</span>
                    <span className="text-slate-300 font-medium">{ep.art}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Technique:</span>
                    <span className="text-amber-300 font-medium truncate max-w-[180px]" title={ep.technique}>
                      {ep.technique}
                    </span>
                  </div>
                  {ep.color !== 'None' && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Color:</span>
                      <span className="text-slate-400 font-medium">{ep.color}</span>
                    </div>
                  )}
                </div>

                {/* Meaning */}
                <p className="text-xs text-slate-400 font-serif italic border-t border-slate-800/60 pt-2">
                  &ldquo;{ep.meaning}&rdquo;
                </p>
              </div>

              {/* Action */}
              <Link
                href={`/reader?work=ulysses&page=${ep.startPage}`}
                className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Episode in Reader</span>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
