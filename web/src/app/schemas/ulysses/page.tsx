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
  LayoutGrid,
  Table as TableIcon,
  Network,
  ChevronRight,
} from 'lucide-react';
import { getBasePath } from '@/lib/constants';

interface HomericMapping {
  homerHero: string;
  dublinCounterpart: string;
  significance: string;
}

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
  linatiMeaning: string;
  homerMappings: HomericMapping[];
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
    linatiMeaning: 'Il figlio spodestato alla lotta (The dispossessed son in combat)',
    homerMappings: [
      { homerHero: 'Telemachus', dublinCounterpart: 'Stephen Dedalus', significance: 'The dispossessed spiritual son mourning his mother' },
      { homerHero: 'Antinous', dublinCounterpart: 'Buck Mulligan', significance: 'The insolent usurper mocking religion and asserting dominance' },
      { homerHero: 'Mentor / Pallas', dublinCounterpart: 'Milkwoman / Mother Ireland', significance: 'The archaic messenger of wisdom reduced to poverty' },
    ],
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
    linatiMeaning: 'La saggezza del passato e il debito (The wisdom of the past)',
    homerMappings: [
      { homerHero: 'Nestor', dublinCounterpart: 'Mr. Garrett Deasy', significance: 'The senile sage offering reactionary platitudes and anti-Semitism' },
      { homerHero: 'Pisistratus', dublinCounterpart: 'Sargent', significance: 'The clumsy pupil requiring Stephen’s patient instruction' },
      { homerHero: 'Helen', dublinCounterpart: 'Mrs. O’Shea / Queen Victoria', significance: 'Women as catalysts of political ruin and imperial debt' },
    ],
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
    linatiMeaning: 'La materia primigenia in metamorfosi (Primal matter changing form)',
    homerMappings: [
      { homerHero: 'Proteus', dublinCounterpart: 'Primal Matter / The Sea', significance: 'Ever-shifting linguistic and sensory reality' },
      { homerHero: 'Menelaus', dublinCounterpart: 'Kevin Egan / Stephen Dedalus', significance: 'The wandering exile wrestling with memory and illusion' },
      { homerHero: 'Megapenthes', dublinCounterpart: 'Cockle-picker', significance: 'The solitary shore-dweller gathering remnants of the tide' },
    ],
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
    linatiMeaning: 'La partenza del viandante (The departure of the wanderer)',
    homerMappings: [
      { homerHero: 'Calypso', dublinCounterpart: 'The Nymph / 7 Eccles St Bedroom', significance: 'Sensuous domestic confinement and slumbering desire' },
      { homerHero: 'Ulysses', dublinCounterpart: 'Leopold Bloom', significance: 'The compassionate wanderer entering the somatic Dublin day' },
      { homerHero: 'Penelope', dublinCounterpart: 'Molly Bloom', significance: 'The sensual bed-partner awaiting breakfast and Boylan’s letter' },
    ],
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
    linatiMeaning: 'Il fascino dell’inerzia e dell’oblio (The lure of narcotic oblivion)',
    homerMappings: [
      { homerHero: 'Lotus Eaters', dublinCounterpart: 'Chemists, Churchgoers, Cab-drivers', significance: 'Figures numbed by religion, perfume, and routine' },
      { homerHero: 'Eurylokhos', dublinCounterpart: 'C.P. M’Coy', significance: 'The pestering acquaintance trying to disrupt the solitary reverie' },
      { homerHero: 'Lotus Plant', dublinCounterpart: 'Castor Oil / Bath Flower', significance: 'The narcotic languor of warm water and soap' },
    ],
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
    linatiMeaning: 'La discesa nel regno delle ombre (Descent into the shadow realm)',
    homerMappings: [
      { homerHero: 'Elpenor', dublinCounterpart: 'Paddy Dignam', significance: 'The unburied comrade whose funeral carriage Bloom accompanies' },
      { homerHero: 'Tiresias', dublinCounterpart: 'John O’Connell (Caretaker)', significance: 'The guardian of the dead dispensing grim cemetery humor' },
      { homerHero: 'Cerberus', dublinCounterpart: 'Father Coffey', significance: 'The swollen priest mumbling funeral Latin at the vault' },
    ],
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
    linatiMeaning: 'La beffa del giornalismo e dei venti (The mockery of journalistic gales)',
    homerMappings: [
      { homerHero: 'Aeolus', dublinCounterpart: 'Myles Crawford', significance: 'The fiery, gusty editor blowing wind through printing presses' },
      { homerHero: 'Bag of Winds', dublinCounterpart: 'Newspaper Headlines / Press Galleys', significance: 'Ephemeral rhetoric blowing public opinion to and fro' },
      { homerHero: 'Incest', dublinCounterpart: 'Journalistic Collusion', significance: 'Dublin reporters and legal clerks trading incestuous gossip' },
    ],
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
    linatiMeaning: 'La fame cannibalesca e la peristalsi (Cannibal hunger and digestion)',
    homerMappings: [
      { homerHero: 'Antiphates', dublinCounterpart: 'Burton Restaurant Cannibals', significance: 'Devouring Dubliners wolfing down gristle and blood' },
      { homerHero: 'The Decoy', dublinCounterpart: 'Pastry-cook’s Daughter / Blazes Boylan', significance: 'Appetizing temptations luring the hungry traveler' },
      { homerHero: 'Safe Haven', dublinCounterpart: 'Davy Byrne’s "Moral Pub"', significance: 'Gorgonzola cheese and burgundy wine as civilized refuge' },
    ],
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
    linatiMeaning: 'I due corni del dilemma (Aristotle’s rock and Plato’s whirlpool)',
    homerMappings: [
      { homerHero: 'Scylla (Rock)', dublinCounterpart: 'Aristotelian Dogma / Stratford Fact', significance: 'Hard historical reality anchored in the somatic world' },
      { homerHero: 'Charybdis (Whirlpool)', dublinCounterpart: 'Platonic Idealism / Theosophy', significance: 'Vague mystical whirlpool of AE and the Dublin literati' },
      { homerHero: 'Ulysses', dublinCounterpart: 'William Shakespeare / Stephen', significance: 'The creator weaving his ghost through Hamlet and Dublin' },
    ],
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
    linatiMeaning: 'Il labirinto ostile della città (The circulating city labyrinth)',
    homerMappings: [
      { homerHero: 'Symplegades (Clashing Rocks)', dublinCounterpart: '19 Interlinked Dublin vignettes', significance: 'Entangling cross-currents in urban streets' },
      { homerHero: 'Bosphorus', dublinCounterpart: 'River Liffey', significance: 'The central arterial waterway carrying Elijah’s leaflet' },
      { homerHero: 'Argo', dublinCounterpart: 'Viceroy’s Cavalcade / Father Conmee', significance: 'Imperial and ecclesiastical powers traversing the city' },
    ],
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
    linatiMeaning: 'La seduzione del suono e la fuga (Acoustic seduction and polyphony)',
    homerMappings: [
      { homerHero: 'Sirens', dublinCounterpart: 'Miss Douce & Miss Kennedy', significance: 'Bronze and gold barmaids pouring beer with musical allure' },
      { homerHero: 'Orpheus', dublinCounterpart: 'Ben Dollard / Simon Dedalus', significance: 'Singers casting nostalgic tenor spells over the pub' },
      { homerHero: 'Ulysses Bound to Mast', dublinCounterpart: 'Leopold Bloom', significance: 'Listening to music while Boylan races to Eccles Street' },
    ],
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
    linatiMeaning: 'La cecità dell’odio e dello sciovinismo (Monocular bigotry)',
    homerMappings: [
      { homerHero: 'Polyphemus', dublinCounterpart: 'The Citizen', significance: 'One-eyed militant chauvinist spitting venomous xenophobia' },
      { homerHero: 'Nobody (Ulysses)', dublinCounterpart: 'Leopold Bloom', significance: 'The universal pacifist preaching love against force' },
      { homerHero: 'Boulder', dublinCounterpart: 'Jacob’s Biscuit Tin', significance: 'The hurled missile narrowly missing Bloom’s jaunting car' },
    ],
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
    linatiMeaning: 'Il miraggio del sentimentalismo (Sentimental illusion and fireworks)',
    homerMappings: [
      { homerHero: 'Nausicaa', dublinCounterpart: 'Gerty MacDowell', significance: 'The sentimental maiden dreaming in novelette clichés' },
      { homerHero: 'Alcinous', dublinCounterpart: 'Gerty’s drunken father', significance: 'The patriarchal background of domestic hardship' },
      { homerHero: 'Phaeacian Ball', dublinCounterpart: 'Fireworks / Men’s gazes', significance: 'The luminous visual spectacle at the strand' },
    ],
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
    linatiMeaning: 'L’evoluzione della parola e della stirpe (Language evolution and gestation)',
    homerMappings: [
      { homerHero: 'Helios (Sun God)', dublinCounterpart: 'Hospital / Dr. O’Hare', significance: 'The source of generative fertility and life' },
      { homerHero: 'Sacred Oxen', dublinCounterpart: 'Unborn Children / Motherhood', significance: 'Somatic sanctity desecrated by medical students’ irreverence' },
      { homerHero: 'Thunderbolt of Jove', dublinCounterpart: 'Sudden rainstorm', significance: 'The divine terror shocking the carousing students into silence' },
    ],
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
    linatiMeaning: 'La visione dell’inconscio primordiale (Hallucinatory Walpurgisnacht)',
    homerMappings: [
      { homerHero: 'Circe', dublinCounterpart: 'Bella Cohen (Bello)', significance: 'The brothel mistress transforming men into swine' },
      { homerHero: 'Swine', dublinCounterpart: 'Bloom & Stephen transformed', significance: 'Somatic guilt and repressed desires externalized' },
      { homerHero: 'Moly Herb', dublinCounterpart: 'The Potato Talisman / Art', significance: 'Bloom’s pocket talisman preserving his humanity' },
    ],
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
    linatiMeaning: 'La stanchezza dopo la tempesta (Exhaustion and pseudonymous wanderers)',
    homerMappings: [
      { homerHero: 'Eumaeus', dublinCounterpart: 'Skin-the-Goat Fitzharris', significance: 'The loyal swineherd running the cabman’s haven' },
      { homerHero: 'False Odysseus', dublinCounterpart: 'D.B. Murphy (Red-bearded Sailor)', significance: 'The fabulist sailor spinning tall tales of world voyages' },
      { homerHero: 'Reunion', dublinCounterpart: 'Bloom & Stephen drinking cocoa', significance: 'The quiet communion of surrogate father and son' },
    ],
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
    linatiMeaning: 'La pacificazione cosmica e la ragione (Cosmic catechism and homecoming)',
    homerMappings: [
      { homerHero: 'Ithaca / The Hall', dublinCounterpart: '7 Eccles Street Kitchen', significance: 'The domestic haven restored after 18 hours of wandering' },
      { homerHero: 'Suitors Slain', dublinCounterpart: 'Bloom’s intellectual equanimity', significance: 'Overcoming jealousy through astronomical and cosmic perspective' },
      { homerHero: 'The Great Bow', dublinCounterpart: 'The Water Tap / Scientific Reason', significance: 'The fluid element obeying natural and geometric laws' },
    ],
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
    linatiMeaning: 'L’affermazione incondizionata (The eternal feminine affirmation)',
    homerMappings: [
      { homerHero: 'Penelope', dublinCounterpart: 'Molly Bloom (Marion)', significance: 'The faithful/unfaithful web-weaver resting in bed' },
      { homerHero: 'Earth / Gea-Tellus', dublinCounterpart: 'The Body of Woman', significance: 'The rotating terrestrial globe affirming all physical life' },
      { homerHero: 'Odysseus Reunited', dublinCounterpart: 'Leopold Bloom asleep head-to-toe', significance: 'The returned traveler resting at the beginning and end of all things' },
    ],
  },
];

export default function UlyssesSchemaPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [organFilter, setOrganFilter] = useState<string>('all');
  const [partFilter, setPartFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'homer'>('cards');

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
          e.meaning.toLowerCase().includes(q) ||
          e.linatiMeaning.toLowerCase().includes(q) ||
          e.homerMappings.some(
            (m) =>
              m.homerHero.toLowerCase().includes(q) ||
              m.dublinCounterpart.toLowerCase().includes(q) ||
              m.significance.toLowerCase().includes(q)
          );
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
            <span>Gilbert (1930) &amp; Linati (1920) Schemata Explorer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            Ulysses Canonical Schema Matrix
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-serif">
            James Joyce devised two legendary architectural schema tables for <em>Ulysses</em> to decipher the secret anatomy of Bloomsday:
            the Homeric parallels, Dublin 1904 geography, somatic organs of the body, colors, symbols, and linguistic techniques.
          </p>

          <div className="flex items-center justify-center flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Episodes: <strong className="text-slate-200">18 Episodes</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Structure: <strong className="text-emerald-400">3 Parts (Telemachiad, Odyssey, Nostos)</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Body Matrix: <strong className="text-rose-400">Human Body as Cathedral</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Filter Toolbar & View Toggle */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Homer, organs, techniques, Dublin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Facets & View Mode Toggle */}
          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center flex-wrap gap-2">
              {/* Part Filter */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <span className="text-[11px] font-medium text-slate-500">Part:</span>
                <select
                  value={partFilter}
                  onChange={(e) => setPartFilter(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All 3 Parts</option>
                  <option value="1">Part I: Telemachiad</option>
                  <option value="2">Part II: Odyssey</option>
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
            </div>

            {/* View Mode Segmented Control */}
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Episode Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Gilbert vs Linati Comparative Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Comparative Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('homer')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-colors ${
                  viewMode === 'homer'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Homeric Correspondences Network"
              >
                <Network className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Homer Network</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* VIEW 1: EPISODE CARDS */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEpisodes.map((ep) => (
              <div
                key={ep.episode}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
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

                  {/* Meaning (Gilbert & Linati) */}
                  <div className="space-y-1 border-t border-slate-800/60 pt-2 text-xs">
                    <p className="text-slate-300 font-serif italic text-[11px]">
                      <strong className="text-indigo-400 not-italic font-mono text-[9px] uppercase tracking-wider block">
                        Gilbert Meaning:
                      </strong>
                      &ldquo;{ep.meaning}&rdquo;
                    </p>
                    <p className="text-slate-400 font-serif italic text-[11px] pt-1">
                      <strong className="text-emerald-400 not-italic font-mono text-[9px] uppercase tracking-wider block">
                        Linati Sense (1920):
                      </strong>
                      &ldquo;{ep.linatiMeaning}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Action */}
                <Link
                  href={`/reader?work=ulysses&page=${ep.startPage}`}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center justify-center space-x-1.5 transition-colors group-hover:shadow-md group-hover:shadow-indigo-900/40"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Episode in Universal Reader &rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: COMPARATIVE MATRIX TABLE */}
        {viewMode === 'table' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="p-3">#</th>
                    <th className="p-3">Episode</th>
                    <th className="p-3">Hour &amp; Scene</th>
                    <th className="p-3">Homeric Correspondent</th>
                    <th className="p-3">Organ of Body</th>
                    <th className="p-3">Art / Science</th>
                    <th className="p-3">Color &amp; Symbol</th>
                    <th className="p-3">Technique</th>
                    <th className="p-3">Linati Sense (1920)</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredEpisodes.map((ep) => (
                    <tr key={ep.episode} className="hover:bg-indigo-950/20 transition-colors">
                      <td className="p-3 font-mono font-bold text-indigo-400">{ep.episode}</td>
                      <td className="p-3">
                        <span className="font-serif font-bold text-white block text-sm">{ep.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">p. {ep.startPage}</span>
                      </td>
                      <td className="p-3 text-slate-300">
                        <div className="font-semibold text-amber-300">{ep.hour}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[120px]" title={ep.scene}>
                          {ep.scene}
                        </div>
                      </td>
                      <td className="p-3 text-indigo-300 font-medium max-w-[150px]">{ep.homer}</td>
                      <td className="p-3">
                        {ep.organ !== 'None' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-950/60 text-rose-300 border border-rose-800/40 font-mono">
                            {ep.organ}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">{ep.art}</td>
                      <td className="p-3">
                        <div className="text-slate-300 font-medium">{ep.symbol}</div>
                        {ep.color !== 'None' && <div className="text-[10px] text-slate-500 font-mono">{ep.color}</div>}
                      </td>
                      <td className="p-3 text-amber-200/90 font-mono text-[11px]">{ep.technique}</td>
                      <td className="p-3 text-slate-400 italic font-serif max-w-[180px] truncate" title={ep.linatiMeaning}>
                        {ep.linatiMeaning}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/reader?work=ulysses&page=${ep.startPage}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors"
                        >
                          <span>Read</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: HOMERIC CORRESPONDENCE NETWORK */}
        {viewMode === 'homer' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 flex items-start space-x-3">
              <Network className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-indigo-100 text-sm">
                  The Homeric Parallels: Ancient Myth Translated into Modern Dublin
                </strong>
                In 1920, Joyce explained to Carlo Linati: <em>&ldquo;It is an epic of two races (Israelite-Irish) and at the same time the cycle of the human body as well as a little story of a day (life)... My intention is not only to render the myth sub specie temporis nostri, but also each episode must correspond to a somatic organ and an art.&rdquo;</em>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredEpisodes.map((ep) => (
                <div
                  key={ep.episode}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-xs font-mono font-bold text-indigo-300">
                        {ep.episode}
                      </span>
                      <h3 className="font-serif font-bold text-white text-base">{ep.title}</h3>
                    </div>
                    <Link
                      href={`/reader?work=ulysses&page=${ep.startPage}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-mono inline-flex items-center space-x-1"
                    >
                      <span>Page {ep.startPage}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {ep.homerMappings.map((map, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="font-serif font-bold text-indigo-300 text-sm">
                            {map.homerHero}
                          </span>
                          <span className="font-mono text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40">
                            &rarr; {map.dublinCounterpart}
                          </span>
                        </div>
                        <p className="text-slate-400 font-serif leading-relaxed text-[11px] pt-1">
                          {map.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
