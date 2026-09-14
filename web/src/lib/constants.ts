export interface AnalyticalRegister {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  badgeClass: string;
  icon: string;
}

export const ANALYTICAL_REGISTERS: AnalyticalRegister[] = [
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
    description: 'Joyce\'s Buffalo notebook sigla: ⠃ (HCE), Δ (ALP), ⊏ (Shem), ⊐ (Shaun), ⊣ (Issy), ⊥ (Mamalujo), and ⌕ (Earwicker).',
    color: 'rose',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/40',
    icon: 'Key'
  },
  {
    id: 'irish-mythology',
    name: 'Irish Mythology & Celtic Folklore',
    category: 'Cultural & Mythological',
    description: 'Finn MacCool, Tuatha Dé Danann, Cú Chulainn, Book of Invasions, Ossianic cycles, and fairy legends.',
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

export function getBasePath(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  return '';
}

export {
  getWork,
  getAllWorks,
  getWorkDivision,
  FINNEGANS_WAKE,
  ULYSSES,
  FINNEGANS_WAKE_REGISTERS,
  ULYSSES_REGISTERS,
  type WorkDefinition,
  type DivisionInfo,
  getAllDissertations,
  getDissertation,
  getDissertationsForWork,
  DISSERTATION_NIGHT_MIND,
  DISSERTATION_ULYSSES_ANATOMY,
  DISSERTATION_SIGLA_CYBERNETICS,
  type DissertationDefinition,
  type DissertationChapter,
} from '@winnegans/core';

export function getBookAndChapterInfo(page: number, workId: string = 'finnegans-wake'): {
  book: number;
  chapter: number;
  bookRoman: string;
  chapterTitle: string;
  subtitle?: string;
  schemaDetails?: Record<string, string | undefined>;
} {
  if (workId === 'ulysses') {
    const episodes = [
      { part: 1, episode: 1, title: 'Telemachus', subtitle: 'Part I: The Telemachiad', startPage: 1, endPage: 28, schemaDetails: { time: '8:00 AM', scene: 'The Tower (Sandycove)', art: 'Theology', color: 'White, gold', symbol: 'Heir', technique: 'Narrative (young)' } },
      { part: 1, episode: 2, title: 'Nestor', subtitle: 'Part I: The Telemachiad', startPage: 29, endPage: 50, schemaDetails: { time: '10:00 AM', scene: 'The School (Dalkey)', art: 'History', color: 'Brown', symbol: 'Horse', technique: 'Catechism (personal)' } },
      { part: 1, episode: 3, title: 'Proteus', subtitle: 'Part I: The Telemachiad', startPage: 51, endPage: 70, schemaDetails: { time: '11:00 AM', scene: 'The Strand (Sandymount)', art: 'Philology', color: 'Green', symbol: 'Tide', technique: 'Monologue (male)' } },
      { part: 2, episode: 4, title: 'Calypso', subtitle: 'Part II: The Odyssey', startPage: 71, endPage: 94, schemaDetails: { time: '8:00 AM', scene: 'The House (7 Eccles St)', organ: 'Kidney', art: 'Economics', color: 'Orange', symbol: 'Nymph', technique: 'Narrative (mature)' } },
      { part: 2, episode: 5, title: 'Lotus Eaters', subtitle: 'Part II: The Odyssey', startPage: 95, endPage: 116, schemaDetails: { time: '10:00 AM', scene: 'The Bath (Westland Row)', organ: 'Genitals', art: 'Botany', color: 'Brown', symbol: 'Eucharist', technique: 'Narcissism' } },
      { part: 2, episode: 6, title: 'Hades', subtitle: 'Part II: The Odyssey', startPage: 117, endPage: 152, schemaDetails: { time: '11:00 AM', scene: 'The Graveyard (Glasnevin)', organ: 'Heart', art: 'Religion', color: 'White, black', symbol: 'Caretaker', technique: 'Incubism' } },
      { part: 2, episode: 7, title: 'Aeolus', subtitle: 'Part II: The Odyssey', startPage: 153, endPage: 198, schemaDetails: { time: '12:00 PM', scene: 'The Newspaper', organ: 'Lungs', art: 'Rhetoric', color: 'Red', symbol: 'Editor', technique: 'Enthymemic' } },
      { part: 2, episode: 8, title: 'Lestrygonians', subtitle: 'Part II: The Odyssey', startPage: 199, endPage: 242, schemaDetails: { time: '1:00 PM', scene: 'The Lunch (Davy Byrne\'s)', organ: 'Esophagus', art: 'Architecture', symbol: 'Constables', technique: 'Peristalsis' } },
      { part: 2, episode: 9, title: 'Scylla and Charybdis', subtitle: 'Part II: The Odyssey', startPage: 243, endPage: 282, schemaDetails: { time: '2:00 PM', scene: 'The National Library', organ: 'Brain', art: 'Literature', symbol: 'Stratford, London', technique: 'Dialectic' } },
      { part: 2, episode: 10, title: 'Wandering Rocks', subtitle: 'Part II: The Odyssey', startPage: 283, endPage: 328, schemaDetails: { time: '3:00 PM', scene: 'The Streets of Dublin', organ: 'Blood', art: 'Mechanics', color: 'Rainbow', symbol: 'Citizens', technique: 'Labyrinth' } },
      { part: 2, episode: 11, title: 'Sirens', subtitle: 'Part II: The Odyssey', startPage: 329, endPage: 372, schemaDetails: { time: '4:00 PM', scene: 'The Concert Room (Ormond)', organ: 'Ear', art: 'Music', symbol: 'Barmaids', technique: 'Fuga per canonem' } },
      { part: 2, episode: 12, title: 'Cyclops', subtitle: 'Part II: The Odyssey', startPage: 373, endPage: 444, schemaDetails: { time: '5:00 PM', scene: 'The Tavern (Barney Kiernan\'s)', organ: 'Muscle', art: 'Politics', symbol: 'Fenian', technique: 'Gigantism' } },
      { part: 2, episode: 13, title: 'Nausicaa', subtitle: 'Part II: The Odyssey', startPage: 445, endPage: 486, schemaDetails: { time: '8:00 PM', scene: 'The Rocks (Sandymount)', organ: 'Eye, Nose', art: 'Painting', color: 'Blue, grey', symbol: 'Virgin', technique: 'Tumescence' } },
      { part: 2, episode: 14, title: 'Oxen of the Sun', subtitle: 'Part II: The Odyssey', startPage: 487, endPage: 538, schemaDetails: { time: '10:00 PM', scene: 'The Hospital (Holles St)', organ: 'Womb', art: 'Medicine', color: 'White', symbol: 'Mothers', technique: 'Embryonic development' } },
      { part: 2, episode: 15, title: 'Circe', subtitle: 'Part II: The Odyssey', startPage: 539, endPage: 658, schemaDetails: { time: '12:00 AM', scene: 'The Brothel (Nighttown)', organ: 'Locomotor', art: 'Magic', symbol: 'Whore', technique: 'Hallucination' } },
      { part: 3, episode: 16, title: 'Eumaeus', subtitle: 'Part III: The Nostos', startPage: 659, endPage: 702, schemaDetails: { time: '1:00 AM', scene: 'The Shelter (Cabman\'s)', organ: 'Nerves', art: 'Navigation', symbol: 'Sailors', technique: 'Narrative (old)' } },
      { part: 3, episode: 17, title: 'Ithaca', subtitle: 'Part III: The Nostos', startPage: 703, endPage: 720, schemaDetails: { time: '2:00 AM', scene: 'The House (7 Eccles St)', organ: 'Skeleton', art: 'Science', color: 'Comets', symbol: 'Mothers', technique: 'Catechism' } },
      { part: 3, episode: 18, title: 'Penelope', subtitle: 'Part III: The Nostos', startPage: 721, endPage: 732, schemaDetails: { time: 'No time', scene: 'The Bed (7 Eccles St)', organ: 'Flesh', art: 'None', symbol: 'Earth', technique: 'Monologue (female)' } },
    ];
    const match = episodes.find((ep) => page >= ep.startPage && page <= ep.endPage) || episodes[0];
    const romans = ['I', 'II', 'III'];
    return {
      book: match.part,
      chapter: match.episode,
      bookRoman: romans[match.part - 1] || 'I',
      chapterTitle: `Episode ${match.episode}: ${match.title}`,
      subtitle: match.subtitle,
      schemaDetails: match.schemaDetails,
    };
  }

  let book = 1;
  let chapter = 1;
  let title = "The Fall and Rise of Finnegan";

  if (page >= 1 && page <= 29) {
    book = 1; chapter = 1; title = "The Fall & The Giant's Wake";
  } else if (page >= 30 && page <= 47) {
    book = 1; chapter = 2; title = "The Encounter in the Park";
  } else if (page >= 48 && page <= 74) {
    book = 1; chapter = 3; title = "The Trial and Rumors";
  } else if (page >= 75 && page <= 103) {
    book = 1; chapter = 4; title = "The Inquest and Four Judges";
  } else if (page >= 104 && page <= 125) {
    book = 1; chapter = 5; title = "The Midden Heap & The Letter";
  } else if (page >= 126 && page <= 168) {
    book = 1; chapter = 6; title = "The Twelve Riddles of Shem";
  } else if (page >= 169 && page <= 195) {
    book = 1; chapter = 7; title = "The Portrait of Shem the Penman";
  } else if (page >= 196 && page <= 216) {
    book = 1; chapter = 8; title = "Anna Livia Plurabelle (Two Washerwomen)";
  } else if (page >= 217 && page <= 259) {
    book = 2; chapter = 1; title = "The Children's Mime of Mick, Nick and the Maggies";
  } else if (page >= 260 && page <= 308) {
    book = 2; chapter = 2; title = "The Geometry Lesson (The Tunc Page)";
  } else if (page >= 309 && page <= 382) {
    book = 2; chapter = 3; title = "The Tavern Brawl & Roderick O'Conor";
  } else if (page >= 383 && page <= 399) {
    book = 2; chapter = 4; title = "Mamalujo & The Four Old Men";
  } else if (page >= 400 && page <= 428) {
    book = 3; chapter = 1; title = "Shaun before the People";
  } else if (page >= 429 && page <= 473) {
    book = 3; chapter = 2; title = "Jaun's Sermon to the St. Kevin Girls";
  } else if (page >= 474 && page <= 554) {
    book = 3; chapter = 3; title = "Yawn Under Investigation (The Inquest)";
  } else if (page >= 555 && page <= 590) {
    book = 3; chapter = 4; title = "The Bedchamber Scene (Porter & HCE)";
  } else {
    book = 4; chapter = 1; title = "Dawn & Ricorso: The Soliloquy of ALP";
  }

  const romans = ['I', 'II', 'III', 'IV'];
  return {
    book,
    chapter,
    bookRoman: romans[book - 1] || 'I',
    chapterTitle: title,
  };
}

export const ARCHIVE_EPUB_URL = "https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub";
export const FW_FALLBACK_EPUB_URL = "https://archive.org/download/finnegans-wake-joyce-james/FinnegansWakeJoyceJames.epub";
export const ULYSSES_EPUB_URL = "https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub";
export const GITHUB_REPO_URL = "https://github.com/tekromancy/WinnegansFake";
