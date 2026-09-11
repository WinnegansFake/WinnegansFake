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
    color: 'emerald',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    icon: 'Compass'
  },
  {
    id: 'philosophical-dialectic',
    name: 'Philosophical Dialectic & Coincidentia',
    category: 'Philosophical & Cosmological',
    description: 'Giordano Bruno\'s coincidence of opposites, Nicholas of Cusa, Spinoza, and German idealism.',
    color: 'blue',
    badgeClass: 'bg-blue-950/60 text-blue-300 border-blue-500/40',
    icon: 'Layers'
  },
  {
    id: 'musical-ballad',
    name: 'Musical Allusions & Ballad Culture',
    category: 'Aural & Popular Culture',
    description: 'The comic ballad of Tim Finnegan, Thomas Moore\'s Irish Melodies, opera (Wagner, Gilbert & Sullivan).',
    color: 'amber',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    icon: 'Music'
  },
  {
    id: 'somatic-oneiric',
    name: 'Somatic & Oneiric Sleep Physiology',
    category: 'Psychological & Bodily',
    description: 'John Bishop\'s physiological thesis: dormant body functions, dream logic, sensory deprivation in the dark.',
    color: 'teal',
    badgeClass: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
    icon: 'Moon'
  },
  {
    id: 'structural-genetic',
    name: 'Genetic & Textual Apparatus',
    category: 'Editorial & Textual',
    description: 'Draft lineages, Buffalo notebook citations, printer errors, transition magazine variants, and Gabler/Rose editions.',
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
  annotationsPath: 'annotations',
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
 * Universal Library Catalog
 */
const LIBRARY_WORKS: Map<string, WorkDefinition> = new Map([
  [FINNEGANS_WAKE.id, FINNEGANS_WAKE],
  [ULYSSES.id, ULYSSES],
]);

/**
 * Retrieve a work by its unique identifier.
 * Defaults to Finnegans Wake if work not found or omitted.
 */
export function getWork(id?: string): WorkDefinition {
  if (!id) return FINNEGANS_WAKE;
  const match = LIBRARY_WORKS.get(id.toLowerCase().trim());
  return match || FINNEGANS_WAKE;
}

/**
 * Retrieve all registered works in the library.
 */
export function getAllWorks(): WorkDefinition[] {
  return Array.from(LIBRARY_WORKS.values());
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

  if (currentWork.id === 'finnegans-wake') {
    const div = getWorkDivision(currentWork, page);
    const parts = String(div.id).split('.');
    const book = parts[0] || '1';
    const chapter = parts[1] || '1';
    return `annotations/book_${book}/chapter_${chapter}/page_${padPage}.json`;
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

  if (work.id === 'ulysses') {
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

  if (work.id === 'finnegans-wake') {
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
export const GITHUB_REPO_URL = "https://github.com/tekromancy/WinnegansFake";


