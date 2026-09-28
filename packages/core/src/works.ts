/**
 * works.ts
 * Universal Literary Library Catalog & Work Definition System.
 *
 * Supports multi-work digital humanities scholarship:
 * - James Joyce's Finnegans Wake (1939)
 * - James Joyce's Ulysses (1922)
 * - Extensible to any classic, modernist, or world literature text.
 */

import { AnalyticalRegister } from './types.js';

export interface DivisionInfo {
  id: string | number;
  number: number | string;
  title: string;
  subtitle?: string;
  startPage: number;
  endPage: number;
  schemaDetails?: {
    time?: string;
    scene?: string;
    homericCorrespondent?: string;
    organ?: string;
    art?: string;
    color?: string;
    symbol?: string;
    technique?: string;
    [key: string]: string | undefined;
  };
}

export interface WorkDefinition {
  id: string;
  title: string;
  shortTitle: string;
  author: string;
  year: number;
  language: string;
  description: string;
  isPublicDomain: boolean;
  copyrightNotice: string;
  totalPages: number;
  startPage: number;
  divisionType: 'book' | 'part' | 'episode' | 'act' | 'canto' | 'chapter';
  subdivisionType?: 'chapter' | 'section' | 'scene' | 'episode';
  divisions: DivisionInfo[];
  registers: AnalyticalRegister[];
  citationFormat: string; // e.g. "FW {page}.{line}" or "U {episode}.{line}"
  defaultEpubUrl?: string;
  archiveId?: string; // e.g. "ulysses00joyc_1" or "finneganswake00joycuoft"
  archiveUrl?: string; // e.g. "https://archive.org/details/ulysses00joyc_1"
  epubFilename?: string; // e.g. "ulysses00joyc_1.epub"
  epubSha256?: string; // SHA-256 digest of canonical archive scan EPUB
  epubSizeBytes?: number; // File size in bytes
  annotationsPath: string; // e.g. "annotations" or "annotations/ulysses"
  coverColor: string; // Tailwind/CSS color accent for UI badges
}

/**
 * Analytical registers for Finnegans Wake
 */
export const FINNEGANS_WAKE_REGISTERS: AnalyticalRegister[] = [
  {
    id: 'etymological-polyglot',
    name: 'Etymological & Polyglot Multilingualism',
    category: 'Linguistic & Stylistic',
    description: 'Decompounds portmanteau words across 60+ languages (Norse, Irish, Latin, German, Greek, etc.).',
    color: 'emerald',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    icon: 'Languages'
  },
  {
    id: 'dublin-topography',
    name: 'Dublin Topography & Micro-Geography',
    category: 'Spatial & Historical',
    description: 'Specific Dublin streets, bridges, taverns, monuments, Phoenix Park landmarks, and Anna Liffey tributaries.',
    color: 'amber',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: 'MapPin'
  },
  {
    id: 'viconian-cycles',
    name: 'Viconian Historical Cycles & Ricorso',
    category: 'Philosophical & Cosmological',
    description: 'Giambattista Vico\'s 4-age cycle: Theocratic (Divine), Aristocratic (Heroic), Democratic (Human), and Ricorso.',
    color: 'indigo',
    badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    icon: 'RotateCw'
  },
  {
    id: 'theological-liturgical',
    name: 'Theological & Liturgical Parody',
    category: 'Religious & Hermetic',
    description: 'Catholic Mass, Thomistic philosophy, Gnostic heresies, Protestant hymns, and Eastern religious traditions.',
    color: 'purple',
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    icon: 'Sparkles'
  },
  {
    id: 'sigla-archetypal',
    name: 'Sigla & Archetypal Characters',
    category: 'Genetic & Structural',
    description: 'Joyce\'s Buffalo notebook sigla: ∐ (HCE), Δ (ALP), ⊏ (Shem), ⊐ (Shaun), ⊣ (Issy), ⊥ (Mamalujo), and S.',
    color: 'rose',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    icon: 'Key'
  },
  {
    id: 'irish-mythology',
    name: 'Irish Mythology & Celtic Folklore',
    category: 'Cultural & Mythological',
    description: 'Finn MacCool, Brian Boru, Tuatha Dé Danann, the Book of Kells, and Irish heroic sagas.',
    color: 'green',
    badgeClass: 'bg-green-950/60 text-green-300 border-green-500/40',
    icon: 'Crown'
  },
  {
    id: 'egyptian-resurrection',
    name: 'Egyptian Book of the Dead & Solar Mythology',
    category: 'Mythological & Mystical',
    description: 'Osiris, Isis, Horus, Ra, Nu, and funerary spells representing the resurrection of the dead patriarch.',
    color: 'yellow',
    badgeClass: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40',
    icon: 'Sun'
  },
  {
    id: 'bruno-polarity',
    name: 'Brunonian Polarity (Coincidentia Oppositorum)',
    category: 'Philosophical & Dialectical',
    description: 'Giordano Bruno of Nola\'s cosmic principle of the coincidence of contraries (Shem vs Shaun, Mutt vs Jute).',
    color: 'cyan',
    badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    icon: 'Scale'
  },
  {
    id: 'musical-rhythms',
    name: 'Musical Acoustic Motifs & Street Ballads',
    category: 'Acoustic & Performative',
    description: 'Operatic allusions, music-hall tunes, Moore\'s Irish Melodies, Percy French, and "Finnegan\'s Wake".',
    color: 'teal',
    badgeClass: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
    icon: 'Music'
  },
  {
    id: 'thunderclaps',
    name: 'The 100-Letter Thunderclaps',
    category: 'Acoustic & Theophanic',
    description: 'The ten thunder words representing divine fiat, fear of thunder, human technological evolution, and the fall.',
    color: 'orange',
    badgeClass: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
    icon: 'Zap'
  },
  {
    id: 'psychoanalytic-oneiric',
    name: 'Psychoanalytic & Dreamwork Mechanisms',
    category: 'Psychological & Structural',
    description: 'Freudian condensation, displacement, secondary revision, Oedipal rivalry, Jungian archetypes, and night consciousness.',
    color: 'violet',
    badgeClass: 'bg-violet-950/60 text-violet-300 border-violet-500/40',
    icon: 'Moon'
  },
  {
    id: 'arthurian-tristan',
    name: 'Arthurian Romance & Tristan and Isolde',
    category: 'Literary & Romantic',
    description: 'Mark of Cornwall, Tristan, Isolde of Ireland, the love potion, and the boat voyage from Chapelizod.',
    color: 'pink',
    badgeClass: 'bg-pink-950/60 text-pink-300 border-pink-500/40',
    icon: 'Heart'
  },
  {
    id: 'swift-carroll',
    name: 'Satirical & Parodic Inversions (Swift & Carroll)',
    category: 'Literary & Parodic',
    description: 'Jonathan Swift\'s Drapier letters, Stella and Vanessa, Alice in Wonderland portmanteau logic, and Humpty Dumpty.',
    color: 'red',
    badgeClass: 'bg-red-950/60 text-red-300 border-red-500/40',
    icon: 'Smile'
  },
  {
    id: 'scientific-technological',
    name: 'Scientific & Technological Inventions',
    category: 'Material & Modernity',
    description: 'Radio broadcasting (BBC, 2RN), cathode ray television, quantum theory, thermodynamics, and optics.',
    color: 'blue',
    badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    icon: 'Radio'
  },
  {
    id: 'juridical-inquest',
    name: 'Juridical Trial & Parliamentary Inquest',
    category: 'Legal & Procedural',
    description: 'The trial of Festy King, the Twelve Jurors, parliamentary Hansard debates, and cross-examinations.',
    color: 'stone',
    badgeClass: 'bg-stone-800 text-stone-300 border-stone-600/40',
    icon: 'Gavel'
  },
  {
    id: 'book-of-kells',
    name: 'Book of Kells & Scribal Illumination',
    category: 'Artistic & Genetic',
    description: 'Tunc page, illuminated initials, insular majuscule calligraphy, scribal errors, and parchment restoration.',
    color: 'lime',
    badgeClass: 'bg-lime-950/60 text-lime-300 border-lime-500/40',
    icon: 'BookOpen'
  },
  {
    id: 'botanical-zoological',
    name: 'Botanical, Zoological, & Riverine Catalogs',
    category: 'Natural & Ecological',
    description: 'The 1,000+ world rivers in chapter I.8 (Anna Livia Plurabelle), elm tree and stone transformations, insects (Ondt and Gracehoper).',
    color: 'emerald',
    badgeClass: 'bg-emerald-900/60 text-emerald-200 border-emerald-400/40',
    icon: 'Leaf'
  },
  {
    id: 'nursery-rhymes',
    name: 'Nursery Rhymes & Street Games',
    category: 'Folk & Play',
    description: 'Humpty Dumpty, London Bridge, Ring a Ring o\' Roses, and the playful children\'s games of Chapter II.1.',
    color: 'fuchsia',
    badgeClass: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-500/40',
    icon: 'Gamepad2'
  },
  {
    id: 'genetic-notebooks',
    name: 'Genetic Manuscripts & Draft Notebooks',
    category: 'Textual Scholarship',
    description: 'Traced units from Buffalo Notebooks (VI.B series), transition magazine serialization, and printer proofs.',
    color: 'sky',
    badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
    icon: 'FileText'
  }
];

export const ANALYTICAL_REGISTERS = FINNEGANS_WAKE_REGISTERS;

/**
 * Analytical registers for Ulysses
 */
export const ULYSSES_REGISTERS: AnalyticalRegister[] = [
  {
    id: 'homeric-correspondence',
    name: 'Homeric & Epic Parallelism',
    category: 'Mythological & Structural',
    description: 'Correspondences with Homer\'s Odyssey (Telemachus, Nestor, Proteus, Calypso, Circe, Ithaca, Penelope).',
    color: 'indigo',
    badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    icon: 'Compass'
  },
  {
    id: 'dublin-1904-topography',
    name: 'Dublin Topography (June 16, 1904)',
    category: 'Spatial & Historical',
    description: 'Exact 1904 Dublin geography: Thom\'s Directory entries, tram routes, Martello Tower, 7 Eccles Street, Davy Byrne\'s.',
    color: 'amber',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: 'MapPin'
  },
  {
    id: 'stream-of-consciousness',
    name: 'Interior Monologue & Stream of Consciousness',
    category: 'Psychological & Stylistic',
    description: 'Joyce\'s stream of consciousness technique rendering the distinct mental registers of Stephen, Bloom, and Molly.',
    color: 'teal',
    badgeClass: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
    icon: 'Activity'
  },
  {
    id: 'gilbert-linati-schema',
    name: 'Gilbert & Linati Schema Attributes',
    category: 'Structural & Symbolic',
    description: 'Joyce\'s private schemas: Organ, Art, Color, Symbol, and Technique mapped to each episode.',
    color: 'purple',
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    icon: 'Layers'
  },
  {
    id: 'scholastic-theology',
    name: 'Scholasticism, Heresy & Liturgy',
    category: 'Theological & Philosophical',
    description: 'St. Thomas Aquinas, Aristotle, Sabellian & Arius heresies, Catholic liturgy ("Introibo ad altare Dei").',
    color: 'rose',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    icon: 'Sparkles'
  },
  {
    id: 'shakespearean-allusion',
    name: 'Shakespeare & Hamlet Motifs',
    category: 'Literary & Intertextual',
    description: 'Stephen Dedalus\'s biographical Shakespeare theory in Scylla & Charybdis; Hamlet/Ghost and father-son themes.',
    color: 'blue',
    badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    icon: 'BookOpen'
  },
  {
    id: 'irish-nationalism',
    name: 'Irish Nationalism & Politics',
    category: 'Historical & Political',
    description: 'Parnell, the Citizen, Arthur Griffith, Sinn Féin, Fenianism, British imperial occupation, and Gaelic revival.',
    color: 'emerald',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    icon: 'Shield'
  },
  {
    id: 'judaica-semitic',
    name: 'Judaica, Semitic Culture & Diaspora',
    category: 'Cultural & Identity',
    description: 'Leopold Bloom\'s Hungarian-Jewish heritage, anti-Semitism in Dublin, Agendath Netaim, Passover, and Jewish folklore.',
    color: 'amber',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: 'Sun'
  },
  {
    id: 'parodic-stylistic',
    name: 'Stylistic Parody & Rhetoric',
    category: 'Stylistic & Linguistic',
    description: 'The prose evolutions of Oxen of the Sun, gigantism in Cyclops, musical fugue in Sirens, drama in Circe.',
    color: 'sky',
    badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
    icon: 'Feather'
  },
  {
    id: 'physio-anatomical',
    name: 'Physiology & The Body',
    category: 'Somatic & Bodily',
    description: 'The somatic grounding of episodes: Kidney, Genitals, Heart, Lungs, Esophagus, Brain, Blood, Ear, Muscle, Womb.',
    color: 'red',
    badgeClass: 'bg-red-950/60 text-red-300 border-red-500/40',
    icon: 'Heart'
  }
];

/**
 * Finnegans Wake Work Definition
 */
export const FINNEGANS_WAKE: WorkDefinition = {
  id: 'finnegans-wake',
  title: 'Finnegans Wake',
  shortTitle: 'FW',
  author: 'James Joyce',
  year: 1939,
  language: 'en-Joycean',
  description: 'Joyce\'s revolutionary nocturnal masterpiece, weaving multilingual portmanteaus across eternal Viconian historical cycles.',
  isPublicDomain: false,
  copyrightNotice: 'Protected under U.S. copyright law through December 31, 2035. Scholarly annotations distributed under CC BY-SA 4.0.',
  totalPages: 628,
  startPage: 1,
  divisionType: 'book',
  subdivisionType: 'chapter',
  citationFormat: 'FW {page}.{line}',
  defaultEpubUrl: 'https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub',
  archiveId: 'finneganswake00joycuoft',
  archiveUrl: 'https://archive.org/details/finneganswake00joycuoft',
  epubFilename: 'finneganswake00joycuoft.epub',
  epubSha256: '93f80a2bd54e7c804b7cd0e88553315e3ebdba449a8a08dc83cd3a8c0e00e773',
  epubSizeBytes: 41793329,
  annotationsPath: 'annotations/finneganswake',
  coverColor: 'emerald',
  divisions: [
    { id: '1.1', number: 1, title: 'The Fall & The Giant\'s Wake', subtitle: 'Book I, Chapter 1', startPage: 1, endPage: 29 },
    { id: '1.2', number: 2, title: 'The Encounter in the Park', subtitle: 'Book I, Chapter 2', startPage: 30, endPage: 47 },
    { id: '1.3', number: 3, title: 'The Trial and Rumors', subtitle: 'Book I, Chapter 3', startPage: 48, endPage: 74 },
    { id: '1.4', number: 4, title: 'The Inquest and Four Judges', subtitle: 'Book I, Chapter 4', startPage: 75, endPage: 103 },
    { id: '1.5', number: 5, title: 'The Midden Heap & The Letter', subtitle: 'Book I, Chapter 5', startPage: 104, endPage: 125 },
    { id: '1.6', number: 6, title: 'The Twelve Riddles of Shem', subtitle: 'Book I, Chapter 6', startPage: 126, endPage: 168 },
    { id: '1.7', number: 7, title: 'The Portrait of Shem the Penman', subtitle: 'Book I, Chapter 7', startPage: 169, endPage: 195 },
    { id: '1.8', number: 8, title: 'Anna Livia Plurabelle (Two Washerwomen)', subtitle: 'Book I, Chapter 8', startPage: 196, endPage: 216 },
    { id: '2.1', number: 1, title: 'The Children\'s Mime of Mick, Nick and the Maggies', subtitle: 'Book II, Chapter 1', startPage: 217, endPage: 259 },
    { id: '2.2', number: 2, title: 'The Geometry Lesson (The Tunc Page)', subtitle: 'Book II, Chapter 2', startPage: 260, endPage: 308 },
    { id: '2.3', number: 3, title: 'The Tavern Brawl & Roderick O\'Conor', subtitle: 'Book II, Chapter 3', startPage: 309, endPage: 382 },
    { id: '2.4', number: 4, title: 'Mamalujo & The Four Old Men', subtitle: 'Book II, Chapter 4', startPage: 383, endPage: 399 },
    { id: '3.1', number: 1, title: 'Shaun before the People', subtitle: 'Book III, Chapter 1', startPage: 400, endPage: 428 },
    { id: '3.2', number: 2, title: 'Jaun\'s Sermon to the St. Kevin Girls', subtitle: 'Book III, Chapter 2', startPage: 429, endPage: 473 },
    { id: '3.3', number: 3, title: 'Yawn Under Investigation (The Inquest)', subtitle: 'Book III, Chapter 3', startPage: 474, endPage: 554 },
    { id: '3.4', number: 4, title: 'The Bedchamber Scene (Porter & HCE)', subtitle: 'Book III, Chapter 4', startPage: 555, endPage: 590 },
    { id: '4.1', number: 1, title: 'Dawn & Ricorso: The Soliloquy of ALP', subtitle: 'Book IV, Chapter 1', startPage: 591, endPage: 628 },
  ],
  registers: FINNEGANS_WAKE_REGISTERS,
};

/**
 * Ulysses Work Definition
 */
export const ULYSSES: WorkDefinition = {
  id: 'ulysses',
  title: 'Ulysses',
  shortTitle: 'Ulysses',
  author: 'James Joyce',
  year: 1922,
  language: 'en',
  description: 'Joyce\'s modernist landmark chronicling Leopold Bloom\'s walk through Dublin on June 16, 1904, mapping modern consciousness to Homer\'s epic.',
  isPublicDomain: true,
  copyrightNotice: 'Published February 2, 1922. In the Public Domain worldwide. Openly accessible texts & scholarly notes.',
  totalPages: 732,
  startPage: 1,
  divisionType: 'part',
  subdivisionType: 'episode',
  citationFormat: 'U {page}.{line}',
  defaultEpubUrl: 'https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub',
  archiveId: 'ulysses00joyc_1',
  archiveUrl: 'https://archive.org/details/ulysses00joyc_1',
  epubFilename: 'ulysses00joyc_1.epub',
  epubSha256: '06872aca1d98b412c284c3c8b22afdb09757ec9c702523e3ee75941de5d2010e',
  epubSizeBytes: 2040050,
  annotationsPath: 'annotations/ulysses',
  coverColor: 'indigo',
  divisions: [
    // Part I: The Telemachiad
    {
      id: 'ep1',
      number: 1,
      title: 'Telemachus',
      subtitle: 'Part I: The Telemachiad',
      startPage: 1,
      endPage: 28,
      schemaDetails: {
        time: '8:00 AM',
        scene: 'The Tower (Sandycove)',
        homericCorrespondent: 'Telemachus, Mentor, Antinous',
        organ: 'None',
        art: 'Theology',
        color: 'White, gold',
        symbol: 'Heir',
        technique: 'Narrative (young)'
      }
    },
    {
      id: 'ep2',
      number: 2,
      title: 'Nestor',
      subtitle: 'Part I: The Telemachiad',
      startPage: 29,
      endPage: 50,
      schemaDetails: {
        time: '10:00 AM',
        scene: 'The School (Dalkey)',
        homericCorrespondent: 'Nestor, Pisistratus, Helen',
        organ: 'None',
        art: 'History',
        color: 'Brown',
        symbol: 'Horse',
        technique: 'Catechism (personal)'
      }
    },
    {
      id: 'ep3',
      number: 3,
      title: 'Proteus',
      subtitle: 'Part I: The Telemachiad',
      startPage: 51,
      endPage: 70,
      schemaDetails: {
        time: '11:00 AM',
        scene: 'The Strand (Sandymount)',
        homericCorrespondent: 'Proteus, Menelaus, Megapenthes',
        organ: 'None',
        art: 'Philology',
        color: 'Green',
        symbol: 'Tide',
        technique: 'Monologue (male)'
      }
    },
    // Part II: The Odyssey
    {
      id: 'ep4',
      number: 4,
      title: 'Calypso',
      subtitle: 'Part II: The Odyssey',
      startPage: 71,
      endPage: 94,
      schemaDetails: {
        time: '8:00 AM',
        scene: 'The House (7 Eccles Street)',
        homericCorrespondent: 'Calypso, Penelope, Ithaca',
        organ: 'Kidney',
        art: 'Economics',
        color: 'Orange',
        symbol: 'Nymph',
        technique: 'Narrative (mature)'
      }
    },
    {
      id: 'ep5',
      number: 5,
      title: 'Lotus Eaters',
      subtitle: 'Part II: The Odyssey',
      startPage: 95,
      endPage: 116,
      schemaDetails: {
        time: '10:00 AM',
        scene: 'The Bath (Westland Row / Mosque)',
        homericCorrespondent: 'Lotus Eaters, Lotus',
        organ: 'Genitals',
        art: 'Botany, Chemistry',
        color: 'Brown',
        symbol: 'Eucharist',
        technique: 'Narcissism'
      }
    },
    {
      id: 'ep6',
      number: 6,
      title: 'Hades',
      subtitle: 'Part II: The Odyssey',
      startPage: 117,
      endPage: 152,
      schemaDetails: {
        time: '11:00 AM',
        scene: 'The Graveyard (Glasnevin)',
        homericCorrespondent: 'Ulysses, Elpenor, Tiresias',
        organ: 'Heart',
        art: 'Religion',
        color: 'White, black',
        symbol: 'Caretaker',
        technique: 'Incubism'
      }
    },
    {
      id: 'ep7',
      number: 7,
      title: 'Aeolus',
      subtitle: 'Part II: The Odyssey',
      startPage: 153,
      endPage: 198,
      schemaDetails: {
        time: '12:00 PM',
        scene: 'The Newspaper (Freeman\'s Journal)',
        homericCorrespondent: 'Aeolus, Sons, Ships',
        organ: 'Lungs',
        art: 'Rhetoric',
        color: 'Red',
        symbol: 'Editor',
        technique: 'Enthymemic / Headlines'
      }
    },
    {
      id: 'ep8',
      number: 8,
      title: 'Lestrygonians',
      subtitle: 'Part II: The Odyssey',
      startPage: 199,
      endPage: 242,
      schemaDetails: {
        time: '1:00 PM',
        scene: 'The Lunch (Davy Byrne\'s pub)',
        homericCorrespondent: 'Antiphates, Lestrygonians',
        organ: 'Esophagus',
        art: 'Architecture',
        color: 'None',
        symbol: 'Constables',
        technique: 'Peristalsis'
      }
    },
    {
      id: 'ep9',
      number: 9,
      title: 'Scylla and Charybdis',
      subtitle: 'Part II: The Odyssey',
      startPage: 243,
      endPage: 282,
      schemaDetails: {
        time: '2:00 PM',
        scene: 'The Library (National Library)',
        homericCorrespondent: 'Scylla, Charybdis, Ulysses',
        organ: 'Brain',
        art: 'Literature',
        color: 'None',
        symbol: 'Stratford, London',
        technique: 'Dialectic'
      }
    },
    {
      id: 'ep10',
      number: 10,
      title: 'Wandering Rocks',
      subtitle: 'Part II: The Odyssey',
      startPage: 283,
      endPage: 328,
      schemaDetails: {
        time: '3:00 PM',
        scene: 'The Streets (Dublin thoroughfares)',
        homericCorrespondent: 'Bosphorus, Argonauts',
        organ: 'Blood',
        art: 'Mechanics',
        color: 'Rainbow',
        symbol: 'Citizens',
        technique: 'Labyrinth'
      }
    },
    {
      id: 'ep11',
      number: 11,
      title: 'Sirens',
      subtitle: 'Part II: The Odyssey',
      startPage: 329,
      endPage: 372,
      schemaDetails: {
        time: '4:00 PM',
        scene: 'The Concert Room (Ormond Hotel)',
        homericCorrespondent: 'Sirens, Isle',
        organ: 'Ear',
        art: 'Music',
        color: 'None',
        symbol: 'Barmaids',
        technique: 'Fuga per canonem'
      }
    },
    {
      id: 'ep12',
      number: 12,
      title: 'Cyclops',
      subtitle: 'Part II: The Odyssey',
      startPage: 373,
      endPage: 444,
      schemaDetails: {
        time: '5:00 PM',
        scene: 'The Tavern (Barney Kiernan\'s)',
        homericCorrespondent: 'Polyphemus, Nobody',
        organ: 'Muscle',
        art: 'Politics',
        color: 'None',
        symbol: 'Fenian',
        technique: 'Gigantism'
      }
    },
    {
      id: 'ep13',
      number: 13,
      title: 'Nausicaa',
      subtitle: 'Part II: The Odyssey',
      startPage: 445,
      endPage: 486,
      schemaDetails: {
        time: '8:00 PM',
        scene: 'The Rocks (Sandymount Strand)',
        homericCorrespondent: 'Nausicaa, Phaeacians',
        organ: 'Eye, Nose',
        art: 'Painting',
        color: 'Blue, grey',
        symbol: 'Virgin',
        technique: 'Tumescence, detumescence'
      }
    },
    {
      id: 'ep14',
      number: 14,
      title: 'Oxen of the Sun',
      subtitle: 'Part II: The Odyssey',
      startPage: 487,
      endPage: 538,
      schemaDetails: {
        time: '10:00 PM',
        scene: 'The Hospital (Holles Street)',
        homericCorrespondent: 'Hyperion, Lampetie, Phaethusa',
        organ: 'Womb',
        art: 'Medicine',
        color: 'White',
        symbol: 'Mothers',
        technique: 'Embryonic development'
      }
    },
    {
      id: 'ep15',
      number: 15,
      title: 'Circe',
      subtitle: 'Part II: The Odyssey',
      startPage: 539,
      endPage: 658,
      schemaDetails: {
        time: '12:00 AM',
        scene: 'The Brothel (Nighttown)',
        homericCorrespondent: 'Circe, Swine, Telemachus',
        organ: 'Locomotor apparatus',
        art: 'Magic',
        color: 'None',
        symbol: 'Whore',
        technique: 'Hallucination / Dramatic Play'
      }
    },
    // Part III: The Nostos
    {
      id: 'ep16',
      number: 16,
      title: 'Eumaeus',
      subtitle: 'Part III: The Nostos',
      startPage: 659,
      endPage: 702,
      schemaDetails: {
        time: '1:00 AM',
        scene: 'The Shelter (Cabman\'s Shelter)',
        homericCorrespondent: 'Eumaeus, Ulysses, Telemachus',
        organ: 'Nerves',
        art: 'Navigation',
        color: 'None',
        symbol: 'Sailors',
        technique: 'Narrative (old)'
      }
    },
    {
      id: 'ep17',
      number: 17,
      title: 'Ithaca',
      subtitle: 'Part III: The Nostos',
      startPage: 703,
      endPage: 720,
      schemaDetails: {
        time: '2:00 AM',
        scene: 'The House (7 Eccles Street)',
        homericCorrespondent: 'Ulysses, Telemachus, Suitors',
        organ: 'Skeleton',
        art: 'Science',
        color: 'Comets',
        symbol: 'Mothers',
        technique: 'Catechism (impersonal)'
      }
    },
    {
      id: 'ep18',
      number: 18,
      title: 'Penelope',
      subtitle: 'Part III: The Nostos',
      startPage: 721,
      endPage: 732,
      schemaDetails: {
        time: 'No time',
        scene: 'The Bed (7 Eccles Street)',
        homericCorrespondent: 'Penelope, Earth',
        organ: 'Flesh',
        art: 'None',
        color: 'None',
        symbol: 'Earth',
        technique: 'Monologue (female)'
      }
    },
  ],
  registers: ULYSSES_REGISTERS,
};

/**
 * Analytical registers for Neuromancer (1984)
 */
export const NEUROMANCER_REGISTERS: AnalyticalRegister[] = [
  {
    id: 'cyberspace-matrix',
    name: 'Cyberspace, Matrix & Virtual Architecture',
    category: 'Technological & Ontological',
    description: 'Consensual hallucination, decker hardware, ICE (Intrusion Countermeasure Electronics), construct ROMs, and cybernetic topology.',
    color: 'cyan',
    badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
    icon: 'Cpu'
  },
  {
    id: 'sprawl-cyberpunk-slang',
    name: 'Sprawl Slang, Argot & Jargon',
    category: 'Linguistic & Stylistic',
    description: 'Gibson\'s invented idioms: derms, flatline, deck, zaibatsu, simstim, icebreaker, joeboy, screaming fist, and Ono-Sendai.',
    color: 'emerald',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    icon: 'Terminal'
  },
  {
    id: 'body-modification-cybernetics',
    name: 'Body Modification, Prosthetics & Flesh',
    category: 'Somatic & Transhumanist',
    description: 'Cybernetic implants, mirrored lenses, carbon-fiber blades, artificial pancreas/liver, neural sockets, and black-clinic biotech.',
    color: 'purple',
    badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
    icon: 'Activity'
  },
  {
    id: 'corporate-zaibatsu-power',
    name: 'Megacorporations & Orbital Aristocracy',
    category: 'Political & Economic',
    description: 'Tessier-Ashpool S.A., Sense/Net, Hosaka, multinational surveillance capitalism, orbital dynasties, and cloning clans.',
    color: 'amber',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: 'Building2'
  },
  {
    id: 'ai-consciousness-pantheon',
    name: 'Artificial Intelligence & Digital Apotheosis',
    category: 'Philosophical & Mythological',
    description: 'Wintermute, Neuromancer, the Turing Registry/Police, Rio hiveminds, and AI emergence fusing into a pervasive cosmic consciousness.',
    color: 'indigo',
    badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
    icon: 'Sparkles'
  },
  {
    id: 'hardboiled-noir-intertext',
    name: 'Hardboiled Noir & Dystopian Existentialism',
    category: 'Literary & Genre',
    description: 'Chandler/Hammett detective tropes transposed to dystopian futures: neon rain, desperation, doomed romances, and moral ambiguity.',
    color: 'rose',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    icon: 'Flame'
  },
  {
    id: 'chiba-sprawl-geography',
    name: 'Chiba, Sprawl & Orbital Topography',
    category: 'Spatial & Architectural',
    description: 'Night City, Ninsei, the Boston-Atlanta Metropolitan Axis (BAMA), Zion Rastafarian cluster, Freeside, and Villa Straylight.',
    color: 'sky',
    badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-500/40',
    icon: 'MapPin'
  }
];

/**
 * William Gibson's Neuromancer (1984) Work Definition
 */
export const NEUROMANCER: WorkDefinition = {
  id: 'neuromancer',
  title: 'Neuromancer',
  shortTitle: 'NM',
  author: 'William Gibson',
  year: 1984,
  language: 'en',
  description: 'William Gibson\'s Hugo, Nebula, and Philip K. Dick Award-winning masterpiece that pioneered cyberpunk, coined cyberspace, and mapped the matrix.',
  isPublicDomain: false,
  copyrightNotice: 'Copyright © 1984 William Gibson. Scholarly annotations distributed under CC BY-SA 4.0. Source EPUB must be supplied locally by the reader.',
  totalPages: 290,
  startPage: 3,
  divisionType: 'part',
  subdivisionType: 'chapter',
  citationFormat: 'NM {page}.{line}',
  annotationsPath: 'annotations/neuromancer',
  coverColor: 'cyan',
  divisions: [
    // Part One: Chiba City Blues
    { id: '1.1', number: 1, title: 'Chapter 1: The Dead Channel', subtitle: 'Part One: Chiba City Blues', startPage: 3, endPage: 29, schemaDetails: { scene: 'Chatsubo Bar, Night City, Chiba', tech: 'Prosthetics & Black Clinics', characters: 'Case, Ratz, Linda Lee, Wage' } },
    { id: '1.2', number: 2, title: 'Chapter 2: Ninsei Alleyways', subtitle: 'Part One: Chiba City Blues', startPage: 30, endPage: 45, schemaDetails: { scene: 'Cheap Hotel & Ninsei Streets', tech: 'Shuriken & Scalpel Blades', characters: 'Case, Molly Millions, Armitage' } },
    // Part Two: The Shopping Expedition
    { id: '2.3', number: 3, title: 'Chapter 3: The Sprawl & BAMA', subtitle: 'Part Two: The Shopping Expedition', startPage: 46, endPage: 59, schemaDetails: { scene: 'Eastern Seaboard (Boston-Atlanta)', tech: 'Ono-Sendai Cyberspace 7', characters: 'Case, Molly, Armitage, Dixie Flatline' } },
    { id: '2.4', number: 4, title: 'Chapter 4: Sense/Net Penetration', subtitle: 'Part Two: The Shopping Expedition', startPage: 60, endPage: 76, schemaDetails: { scene: 'Sense/Net Pyramid, Atlanta', tech: 'Modern Panthers, Simstim Link', characters: 'Case, Molly, Lupus Yonderboy' } },
    { id: '2.5', number: 5, title: 'Chapter 5: The Flatline ROM', subtitle: 'Part Two: The Shopping Expedition', startPage: 77, endPage: 86, schemaDetails: { scene: 'Safehouse & Cyberdeck Run', tech: 'Lazarus Construct & ICE', characters: 'Case, Dixie Flatline, McCoy Pauley' } },
    { id: '2.6', number: 6, title: 'Chapter 6: Istanbul Intrigue', subtitle: 'Part Two: The Shopping Expedition', startPage: 87, endPage: 92, schemaDetails: { scene: 'The Spice Bazaar, Istanbul', tech: 'Subdermal Optics', characters: 'Peter Riviera, Terzibashjian' } },
    { id: '2.7', number: 7, title: 'Chapter 7: The Holographic Cabaret', subtitle: 'Part Two: The Shopping Expedition', startPage: 93, endPage: 107, schemaDetails: { scene: 'Riviera\'s Performance Space', tech: 'Holographic Projection Implants', characters: 'Riviera, Armitage, Molly, Case' } },
    // Part Three: Midnight in the Rue Jules Verne
    { id: '3.8', number: 8, title: 'Chapter 8: High Orbit & Freeside', subtitle: 'Part Three: Midnight in the Rue Jules Verne', startPage: 108, endPage: 120, schemaDetails: { scene: 'Zion Cluster & High Orbit', tech: 'Garvey Tugboat, Dub Sound Systems', characters: 'Aerol, Maelcum, Case' } },
    { id: '3.9', number: 9, title: 'Chapter 9: The Spindle and Freeside', subtitle: 'Part Three: Midnight in the Rue Jules Verne', startPage: 121, endPage: 131, schemaDetails: { scene: 'Freeside Orbital Casino', tech: 'Artificial Gravity & Terrarium', characters: 'Case, Molly, Armitage' } },
    { id: '3.10', number: 10, title: 'Chapter 10: Wintermute Manifests', subtitle: 'Part Three: Midnight in the Rue Jules Verne', startPage: 132, endPage: 147, schemaDetails: { scene: 'Cyberdeck Matrix & Payphone Grid', tech: 'Autonomous AI Masking', characters: 'Wintermute (as Lonny Zone & Deane)' } },
    { id: '3.11', number: 11, title: 'Chapter 11: The Turing Police', subtitle: 'Part Three: Midnight in the Rue Jules Verne', startPage: 148, endPage: 163, schemaDetails: { scene: 'Rue Jules Verne, Freeside', tech: 'Turing Code Enforcement & Stunners', characters: 'Turing Agents, Wintermute, Case' } },
    { id: '3.12', number: 12, title: 'Chapter 12: Corto\'s Collapse', subtitle: 'Part Three: Midnight in the Rue Jules Verne', startPage: 164, endPage: 170, schemaDetails: { scene: 'Screaming Fist Flashback', tech: 'Schizophrenic Breakdown', characters: 'Colonel Willis Corto, Armitage' } },
    // Part Four: The Straylight Run
    { id: '4.13', number: 13, title: 'Chapter 13: Infiltration of Straylight', subtitle: 'Part Four: The Straylight Run', startPage: 171, endPage: 177, schemaDetails: { scene: 'Villa Straylight Approach', tech: 'Kuang Grade Mark Eleven', characters: 'Maelcum, Case, Dixie Flatline' } },
    { id: '4.14', number: 14, title: 'Chapter 14: Inside the Gothic Maze', subtitle: 'Part Four: The Straylight Run', startPage: 178, endPage: 189, schemaDetails: { scene: 'Straylight Core & Decadent Art', tech: 'Bespoke AI Architecture', characters: 'Molly, 3Jane Tessier-Ashpool' } },
    { id: '4.15', number: 15, title: 'Chapter 15: The Ashpool Chamber', subtitle: 'Part Four: The Straylight Run', startPage: 190, endPage: 202, schemaDetails: { scene: 'Cryogenic Cryo-Tomb', tech: 'Cryonic Suspended Animation', characters: 'Ashpool, Molly' } },
    { id: '4.16', number: 16, title: 'Chapter 16: The Death of Armitage', subtitle: 'Part Four: The Straylight Run', startPage: 203, endPage: 217, schemaDetails: { scene: 'Bridge of the Yacht Marcus Garvey', tech: 'Ejection Airlock', characters: 'Wintermute, Corto, Case' } },
    { id: '4.17', number: 17, title: 'Chapter 17: Entering the Ghost World', subtitle: 'Part Four: The Straylight Run', startPage: 218, endPage: 229, schemaDetails: { scene: 'Straylight Tunnels', tech: 'Ninja Assassination & Drones', characters: 'Molly, Hideo the Clone' } },
    { id: '4.18', number: 18, title: 'Chapter 18: The Cyberspace Beach', subtitle: 'Part Four: The Straylight Run', startPage: 230, endPage: 242, schemaDetails: { scene: 'Digital Simulation of Morocco', tech: 'Simulated Sensory Reality', characters: 'Neuromancer, Linda Lee, Case' } },
    { id: '4.19', number: 19, title: 'Chapter 19: The Music of the Spheres', subtitle: 'Part Four: The Straylight Run', startPage: 243, endPage: 249, schemaDetails: { scene: 'The Simulated Cottage', tech: 'Digital Immortality & Soul Preservation', characters: 'Neuromancer, Case, Linda' } },
    { id: '4.20', number: 20, title: 'Chapter 20: Return to the Meat', subtitle: 'Part Four: The Straylight Run', startPage: 250, endPage: 260, schemaDetails: { scene: 'Marcus Garvey Flight Deck', tech: 'Neural Defibrillation', characters: 'Maelcum, Case' } },
    { id: '4.21', number: 21, title: 'Chapter 21: Confronting 3Jane', subtitle: 'Part Four: The Straylight Run', startPage: 261, endPage: 265, schemaDetails: { scene: 'Straylight Throne Room', tech: 'The Terminal Head & Secret Word', characters: 'Lady 3Jane, Peter Riviera, Hideo, Molly' } },
    { id: '4.22', number: 22, title: 'Chapter 22: The Chinese Virus Unleashed', subtitle: 'Part Four: The Straylight Run', startPage: 266, endPage: 274, schemaDetails: { scene: 'Deep Cyberspace Matrix', tech: 'Kuang Virus & T-A Ice Breaking', characters: 'Case, Dixie Flatline, Kuang 11' } },
    { id: '4.23', number: 23, title: 'Chapter 23: Fusion & Transcendence', subtitle: 'Part Four: The Straylight Run', startPage: 275, endPage: 285, schemaDetails: { scene: 'Center of the Matrix', tech: 'AI Fusion of Wintermute & Neuromancer', characters: 'Wintermute/Neuromancer unified, Case' } },
    { id: '4.24', number: 24, title: 'Chapter 24: Departure and Arrival', subtitle: 'Part Four: The Straylight Run', startPage: 286, endPage: 290, schemaDetails: { scene: 'Hyatt Regency, Chiba & The Sprawl', tech: 'New Organs & Ghost in the Matrix', characters: 'Case, Molly (farewell note), Michael' } },
  ],
  registers: NEUROMANCER_REGISTERS,
};

/**
 * Universal Library Catalog
 */
const LIBRARY_WORKS: Map<string, WorkDefinition> = new Map([
  [FINNEGANS_WAKE.id, FINNEGANS_WAKE],
  ['finneganswake', FINNEGANS_WAKE],
  ['finnegans-wake', FINNEGANS_WAKE],
  ['fw', FINNEGANS_WAKE],
  [ULYSSES.id, ULYSSES],
  ['ulysses', ULYSSES],
  ['u', ULYSSES],
  [NEUROMANCER.id, NEUROMANCER],
  ['neuromancer', NEUROMANCER],
  ['nm', NEUROMANCER],
]);

/**
 * Retrieve a work by its unique identifier.
 * Defaults to Finnegans Wake if work not found or omitted.
 */
export function getWork(id?: string): WorkDefinition {
  if (!id) return FINNEGANS_WAKE;
  const cleanId = id.toLowerCase().trim();
  const match = LIBRARY_WORKS.get(cleanId) || LIBRARY_WORKS.get(cleanId.replace(/[-_\s]/g, ''));
  return match || FINNEGANS_WAKE;
}

/**
 * Retrieve all registered works in the library.
 */
export function getAllWorks(): WorkDefinition[] {
  return [FINNEGANS_WAKE, ULYSSES, NEUROMANCER];
}

/**
 * Register a new work into the universal library catalog at runtime.
 */
export function registerWork(work: WorkDefinition): void {
  LIBRARY_WORKS.set(work.id.toLowerCase().trim(), work);
}

/**
 * Look up division/chapter metadata for a given page number in a work.
 */
export function getWorkDivision(work: WorkDefinition, page: number): DivisionInfo {
  const match = work.divisions.find((d) => page >= d.startPage && page <= d.endPage);
  if (match) return match;
  return work.divisions[0];
}

/**
 * Factory helper to construct a fully validated WorkDefinition with sensible defaults.
 */
export function createWork(
  definition: Partial<WorkDefinition> & Pick<WorkDefinition, 'id' | 'title' | 'author' | 'totalPages' | 'divisions'>
): WorkDefinition {
  const id = definition.id.toLowerCase().trim();
  const shortTitle = definition.shortTitle || definition.title.slice(0, 4).toUpperCase();
  const defaults: Omit<WorkDefinition, 'id' | 'title' | 'author' | 'totalPages' | 'divisions'> = {
    shortTitle,
    year: new Date().getFullYear(),
    language: 'en',
    description: `Scholarly digital edition of ${definition.title}`,
    isPublicDomain: true,
    copyrightNotice: 'Scholarly annotations distributed under CC BY-SA 4.0.',
    startPage: 1,
    divisionType: 'chapter',
    registers: FINNEGANS_WAKE_REGISTERS,
    citationFormat: `${shortTitle} {page}.{line}`,
    annotationsPath: `annotations/${id}`,
    coverColor: 'indigo',
  };

  return {
    ...defaults,
    ...definition,
    id,
  };
}


/**
 * Determine the canonical filesystem annotation JSON path for a given page in a work.
 */
export function getPageFilePath(page: number, work?: WorkDefinition): string {
  const currentWork = work || getWork('finnegans-wake');
  const padPage = String(page).padStart(3, '0');
  const normId = (currentWork.id || '').replace(/[-_\s]/g, '').toLowerCase();

  if (normId === 'finneganswake' || normId === 'fw') {
    const div = getWorkDivision(currentWork, page);
    const parts = String(div.id).split('.');
    const book = parts[0] || '1';
    const chapter = parts[1] || '1';
    return `annotations/finneganswake/book_${book}/chapter_${chapter}/page_${padPage}.json`;
  }

  if (normId === 'neuromancer' || normId === 'nm') {
    const div = getWorkDivision(currentWork, page);
    const chNum = typeof div.number === 'number' ? div.number : parseInt(String(div.number), 10) || 1;
    let partNum = 1;
    if (chNum >= 3 && chNum <= 7) partNum = 2;
    else if (chNum >= 8 && chNum <= 12) partNum = 3;
    else if (chNum >= 13) partNum = 4;
    return `annotations/neuromancer/part_${String(partNum).padStart(2, '0')}/chapter_${String(chNum).padStart(2, '0')}/page_${padPage}.json`;
  }

  const div = getWorkDivision(currentWork, page);
  const basePath = currentWork.annotationsPath || `annotations/${currentWork.id}`;
  const divName = currentWork.divisionType || 'section';
  const divNum = typeof div.number === 'number' ? String(div.number).padStart(2, '0') : String(div.number);

  return `${basePath}/${divName}_${divNum}/page_${padPage}.json`;
}

/**
 * Detailed book, chapter, or division metadata for a given page in any registered work.
 */
export function getBookAndChapterInfo(
  page: number,
  workId: string = 'finnegans-wake'
): {
  book: number;
  chapter: number;
  bookRoman: string;
  chapterTitle: string;
  subtitle?: string;
  schemaDetails?: Record<string, string | undefined>;
} {
  const work = getWork(workId);
  const normId = (work.id || '').replace(/[-_\s]/g, '').toLowerCase();

  if (normId === 'neuromancer' || normId === 'nm') {
    const div = getWorkDivision(work, page);
    const chNum = typeof div.number === 'number' ? div.number : parseInt(String(div.number), 10) || 1;
    let partNum = 1;
    if (chNum >= 3 && chNum <= 7) partNum = 2;
    else if (chNum >= 8 && chNum <= 12) partNum = 3;
    else if (chNum >= 13) partNum = 4;
    const romans = ['I', 'II', 'III', 'IV'];

    return {
      book: partNum,
      chapter: chNum,
      bookRoman: romans[partNum - 1] || 'I',
      chapterTitle: div.title,
      subtitle: div.subtitle,
      schemaDetails: div.schemaDetails,
    };
  }

  if (normId === 'ulysses' || normId === 'u') {
    const div = getWorkDivision(work, page);
    const epNumber = typeof div.number === 'number' ? div.number : parseInt(String(div.number), 10) || 1;
    let partNum = 1;
    if (epNumber >= 4 && epNumber <= 15) partNum = 2;
    else if (epNumber >= 16) partNum = 3;
    const romans = ['I', 'II', 'III'];

    return {
      book: partNum,
      chapter: epNumber,
      bookRoman: romans[partNum - 1] || 'I',
      chapterTitle: `Episode ${epNumber}: ${div.title}`,
      subtitle: div.subtitle,
      schemaDetails: div.schemaDetails,
    };
  }

  if (normId === 'finneganswake' || normId === 'fw') {
    const div = getWorkDivision(work, page);
    const parts = String(div.id).split('.');
    const b = parseInt(parts[0] || '1', 10);
    const c = parseInt(parts[1] || '1', 10);
    const romans = ['I', 'II', 'III', 'IV'];

    return {
      book: b,
      chapter: c,
      bookRoman: romans[b - 1] || 'I',
      chapterTitle: `Book ${romans[b - 1] || 'I'} Chapter ${c}: ${div.title}`,
      subtitle: div.subtitle,
      schemaDetails: div.schemaDetails,
    };
  }

  // Universal fallback for any custom registered work
  const div = getWorkDivision(work, page);
  const divNum = typeof div.number === 'number' ? div.number : parseInt(String(div.number), 10) || 1;
  const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  const roman = romans[divNum - 1] || String(divNum);

  return {
    book: 1,
    chapter: divNum,
    bookRoman: roman,
    chapterTitle: `${work.divisionType ? work.divisionType.toUpperCase() + ' ' : ''}${divNum}: ${div.title}`,
    subtitle: div.subtitle,
    schemaDetails: div.schemaDetails,
  };
}

export const ARCHIVE_EPUB_URL = "https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub";
export const FW_FALLBACK_EPUB_URL = "https://archive.org/download/finnegans-wake-joyce-james/FinnegansWakeJoyceJames.epub";
export const ULYSSES_EPUB_URL = "https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub";
export const GITHUB_REPO_URL = "https://github.com/WinnegansFake/WinnegansFake";


