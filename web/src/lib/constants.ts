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
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    return '/WinnegansFake';
  }
  return '';
}

export function getBookAndChapterInfo(page: number): {
  book: number;
  chapter: number;
  bookRoman: string;
  chapterTitle: string;
} {
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
export const GITHUB_REPO_URL = "https://github.com/tekromancy/WinnegansFake";
