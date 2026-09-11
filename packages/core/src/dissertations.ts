/**
 * dissertations.ts
 * Universal Scholarly Dissertations & Monographs Library Catalog.
 *
 * Distinct from the primary literature catalog:
 * - Primary Works Library (@winnegans/core/works.ts): Canonical literary texts (novels, poems, epics).
 * - Dissertations Library (@winnegans/core/dissertations.ts): Secondary critical scholarship,
 *   doctoral theses, academic treatises, genetic research monographs, and computational analyses.
 */

export interface DissertationChapter {
  number: number;
  title: string;
  subtitle?: string;
  summary?: string;
}

export interface DissertationDefinition {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  degree: string;
  institution: string;
  year: number;
  defenseDate?: string;
  field: string;
  abstract: string;
  keywords: string[];
  targetWorks: string[]; // Associated primary works (e.g. ['finnegans-wake'], ['ulysses'])
  chapters: DissertationChapter[];
  slug: string;
  filePath: string; // Relative to dissertations directory
  wordCount?: number;
  coverAccent: string; // e.g. 'emerald', 'indigo', 'purple', 'amber'
  citationsCount?: number;
  doi?: string;
}

/**
 * Flagship Dissertation: The Architecture of the Night Mind
 */
export const DISSERTATION_NIGHT_MIND: DissertationDefinition = {
  id: 'the-architecture-of-the-night-mind',
  title: 'The Architecture of the Night Mind',
  subtitle: 'A Polyphonic Dissertation on James Joyce\'s Finnegans Wake: Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics',
  author: 'Dr. Alistair H. C. MacCool & The Open Wake Consortium',
  degree: 'Ph.D. in Modernist Literature & Digital Humanities',
  institution: 'Centre for Joyce Studies & Trinity College Dublin',
  year: 2026,
  defenseDate: 'May 4, 2026',
  field: 'Genetic Criticism & Computational Hermeneutics',
  abstract: 'An exhaustive, multidisciplinary treatise investigating James Joyce\'s Finnegans Wake through five complementary critical vectors: Giambattista Vico\'s cyclical historiography, Giordano Bruno\'s coincidence of contraries, John Bishop\'s somatic sleep physiology, the Buffalo notebook genetic lineages, and modern computational vector embeddings. Concludes with an architectural framework for post-2035 zero-copyright digital humanities scholarship.',
  keywords: [
    'Giambattista Vico',
    'Giordano Bruno',
    'Genetic Criticism',
    'Buffalo Notebooks',
    'Sleep Physiology',
    'Computational Linguistics',
    'Copyright Term Extension Act',
    'Digital Humanities'
  ],
  targetWorks: ['finnegans-wake'],
  wordCount: 14850,
  citationsCount: 78,
  doi: '10.5281/zenodo.winnegans.nightmind.2026',
  coverAccent: 'emerald',
  slug: 'the-architecture-of-the-night-mind',
  filePath: 'the-architecture-of-the-night-mind/dissertation.md',
  chapters: [
    {
      number: 1,
      title: 'Viconian Historiography & Brunonian Polarity',
      subtitle: 'The Four-Fold Cyclic Epochs and Coincidentia Oppositorum in Textual Form',
      summary: 'Analyzes Giambattista Vico\'s Scienza Nuova (1744) and Giordano Bruno\'s De la Causa, Principio et Uno (1584) as the structural architecture of Finnegans Wake, mapping the four books to Divine, Heroic, Human, and Ricorso ages.'
    },
    {
      number: 2,
      title: 'Somatic Philology & The Multilingual Idiolect',
      subtitle: 'Sleep Physiology and Polyglot Portmanteau Deconstruction',
      summary: 'Grounds Joyce\'s linguistic polysemy in John Bishop\'s somatic dream thesis and decompounds portmanteau words across Norse, Irish, Latin, Greek, and Continental languages.'
    },
    {
      number: 3,
      title: 'Genetic Epigraphy: Buffalo Notebooks & The Brepols Lineage',
      subtitle: 'From MS VI.B to transition Proofs',
      summary: 'Traces the 48 Buffalo notebooks, Joyce\'s color-coded crayon deletions, and the Brepols edition methodology for reconstructing compositional chronology.'
    },
    {
      number: 4,
      title: 'Computational Concordance & Hypertextual Vector Embeddings',
      subtitle: 'Graph Theory and Algorithmic Parsing of Semantic Topologies',
      summary: 'Presents coordinate-based indexing, FWEET concordance integration, and high-dimensional semantic embeddings for untangling polysemic lemmata.'
    },
    {
      number: 5,
      title: 'The Midden Letter & The Open Horizon: Textual Sovereignty in 2035',
      subtitle: 'Scholarly Independence and Clean-Room Digital Humanities',
      summary: 'Examines the Sonny Bono Copyright Term Extension Act, the legal separation of critical annotations from copyrighted prose, and the future of public domain scholarship in 2035.'
    }
  ]
};

/**
 * Second Dissertation: The Anatomy of the City (Ulysses)
 */
export const DISSERTATION_ULYSSES_ANATOMY: DissertationDefinition = {
  id: 'the-anatomy-of-the-city',
  title: 'The Anatomy of the City: Spatial Poetics, Homeric Parallelism, and Somatic Registers in Joyce\'s Ulysses',
  subtitle: 'From the Martello Tower to the Gibraltar Seed: A Structural Investigation of June 16, 1904',
  author: 'Dr. Eleanor S. Dedalus',
  degree: 'Ph.D. in English & Urban Cultural Geographies',
  institution: 'University College Dublin & Sorbonne Nouvelle (Paris III)',
  year: 2025,
  defenseDate: 'June 16, 2025',
  field: 'Urban Modernism & Classical Reception',
  abstract: 'A forensic critical study examining the spatial, somatic, and mythological triangulation of James Joyce\'s Ulysses. The dissertation correlates the Linati and Gilbert schemas with 1904 Dublin Municipal Ordnance maps and Thom\'s Official Directory, arguing that Joyce constructs an organic civic body whose organs, arts, and Homeric prototypes dramatize the rupture between imperial hegemony and modern interior consciousness.',
  keywords: [
    'Ulysses',
    'Dublin Topography',
    'Gilbert Schema',
    'Linati Schema',
    'Homeric Parallelism',
    'Somatic Criticism',
    'Urban Geography',
    'Modernist Poetics'
  ],
  targetWorks: ['ulysses'],
  wordCount: 13200,
  citationsCount: 64,
  doi: '10.5281/zenodo.winnegans.ulysses.2025',
  coverAccent: 'indigo',
  slug: 'the-anatomy-of-the-city',
  filePath: 'the-anatomy-of-the-city/dissertation.md',
  chapters: [
    {
      number: 1,
      title: 'Telemachus and the Dispossessed Heir',
      subtitle: 'The Martello Bastion and the Cracked Lookingglass of Ireland',
      summary: 'Explores Sandycove Tower No. 11, the liturgical parody of Buck Mulligan, and Stephen Dedalus\'s confrontation with theological and British colonial authority.'
    },
    {
      number: 2,
      title: 'Peristalsis and the Somatic Dublin',
      subtitle: 'The Digestive, Circulatory, and Renal Geographies of 7 Eccles Street',
      summary: 'Investigates Leopold Bloom\'s morning movements through Calypso, Lotus Eaters, Hades, and Lestrygonians, mapping somatic organs to urban spaces.'
    },
    {
      number: 3,
      title: 'Dialectic in the National Library',
      subtitle: 'Stephen\'s Shakespearean Hypothesis in Scylla and Charybdis',
      summary: 'Dissects the biographical Hamlet theory, Sabellian heresy, and paternal consubstantiality in the Dublin National Library.'
    },
    {
      number: 4,
      title: 'The Gigantism of Kiernan\'s Tavern',
      subtitle: 'Hyperbolic Nationalism, Parody, and Anti-Semitism in Cyclops',
      summary: 'Analyzes the citizen, Fenian bravado, and Bloom\'s moral defense of universal humanity against xenophobic violence.'
    },
    {
      number: 5,
      title: 'The Catechetical Impersonal & The Earth Monologue',
      subtitle: 'Cosmic Coldness in Ithaca and Molly Bloom\'s Geotropic Geyser in Penelope',
      summary: 'Examines the scientific catechism of 7 Eccles Street and the punctuation-free feminine affirmative monologue closing the novel.'
    }
  ]
};

/**
 * Third Dissertation: Sigla, Graph Theory, and Cybernetic Joyce
 */
export const DISSERTATION_SIGLA_CYBERNETICS: DissertationDefinition = {
  id: 'sigla-graph-theory-cybernetics',
  title: 'Sigla, Graph Theory, and Cybernetic Joyce',
  subtitle: 'Network Topologies, Hypertextual Nodes, and Computational Semiotics Across Ulysses and Finnegans Wake',
  author: 'Dr. Cormac V. Bloom',
  degree: 'Ph.D. in Information Science & Literary Computing',
  institution: 'University at Buffalo (Poetry Collection) & MIT Media Lab',
  year: 2026,
  defenseDate: 'February 2, 2026',
  field: 'Digital Humanities & Graph Semiotics',
  abstract: 'Proposes a formal graph-theoretical methodology for modeling James Joyce\'s Buffalo Notebook sigla as dynamic semantic networks. By demonstrating how sigla function as mutable computational pointers rather than static character allegories, the treatise establishes a bridge between mid-century French genetic criticism and modern high-dimensional graph databases.',
  keywords: [
    'Graph Theory',
    'Buffalo Sigla',
    'Hypertext',
    'Cybernetics',
    'Knowledge Graphs',
    'Computational Modernism',
    'Information Architecture'
  ],
  targetWorks: ['finnegans-wake', 'ulysses'],
  wordCount: 11800,
  citationsCount: 52,
  doi: '10.5281/zenodo.winnegans.cybernetics.2026',
  coverAccent: 'purple',
  slug: 'sigla-graph-theory-cybernetics',
  filePath: 'sigla-graph-theory-cybernetics/dissertation.md',
  chapters: [
    {
      number: 1,
      title: 'The Notebook as Distributed Network',
      subtitle: 'Buffalo MSS VI.B and the Semiotics of the Rotated Sigla',
      summary: 'Constructs directed multigraphs representing the migration of textual units from draft notebooks into transition magazine serialization.'
    },
    {
      number: 2,
      title: 'Dynamic Topologies of HCE and Leopold Bloom',
      subtitle: 'From Dublin Physical Geography to Recursive Cosmic Nodes',
      summary: 'Contrasts Bloom\'s linear geospatial trajectory on June 16, 1904, with the recursive topological manifold of HCE.'
    },
    {
      number: 3,
      title: 'Coordinate-Based Literary Architectures',
      subtitle: 'Decoupling Critical Apparatus from Monolithic In-Copyright Texts',
      summary: 'Demonstrates the mathematical and legal soundness of page-and-line (PPP.LL) vector pointers in digital humanities platforms.'
    },
    {
      number: 4,
      title: 'Polyglot Lemmatization & Vector Semantics',
      subtitle: 'High-Dimensional Latent Semantic Analysis of Multilingual Portmanteaus',
      summary: 'Evaluates neural embedding models trained on early 20th-century European corpora for automated gloss disambiguation.'
    }
  ]
};

/**
 * Universal Dissertations Library Catalog
 */
const DISSERTATIONS_CATALOG: Map<string, DissertationDefinition> = new Map([
  [DISSERTATION_NIGHT_MIND.id, DISSERTATION_NIGHT_MIND],
  [DISSERTATION_ULYSSES_ANATOMY.id, DISSERTATION_ULYSSES_ANATOMY],
  [DISSERTATION_SIGLA_CYBERNETICS.id, DISSERTATION_SIGLA_CYBERNETICS],
]);

/**
 * Retrieve a dissertation by its unique identifier.
 * Defaults to the flagship Night Mind dissertation if omitted or not found.
 */
export function getDissertation(id?: string): DissertationDefinition {
  if (!id) return DISSERTATION_NIGHT_MIND;
  const match = DISSERTATIONS_CATALOG.get(id.toLowerCase().trim());
  return match || DISSERTATION_NIGHT_MIND;
}

/**
 * Retrieve all registered dissertations in the library catalog.
 */
export function getAllDissertations(): DissertationDefinition[] {
  return Array.from(DISSERTATIONS_CATALOG.values());
}

/**
 * Register a new scholarly dissertation into the library catalog.
 */
export function registerDissertation(dissertation: DissertationDefinition): void {
  DISSERTATIONS_CATALOG.set(dissertation.id.toLowerCase().trim(), dissertation);
}

/**
 * Retrieve dissertations associated with a specific primary literary work.
 */
export function getDissertationsForWork(workId: string): DissertationDefinition[] {
  const norm = workId.toLowerCase().trim();
  return getAllDissertations().filter((d) => d.targetWorks.includes(norm));
}

/**
 * Factory helper to construct a fully validated DissertationDefinition with sensible defaults.
 */
export function createDissertation(
  definition: Partial<DissertationDefinition> &
    Pick<DissertationDefinition, 'id' | 'title' | 'author' | 'year' | 'abstract'>
): DissertationDefinition {
  const id = definition.id.toLowerCase().trim();
  return {
    subtitle: '',
    degree: 'Doctor of Philosophy (Ph.D.)',
    institution: 'Scholarly Digital Humanities Monograph',
    defenseDate: `${definition.year}-05-04`,
    field: 'Literary Modernism & Textual Genetics',
    keywords: ['Modernism', 'Digital Humanities', 'Textual Scholarship'],
    targetWorks: ['finnegans-wake'],
    chapters: [],
    slug: id,
    filePath: `${id}/dissertation.md`,
    coverAccent: 'emerald',
    ...definition,
    id,
  };
}



