import { AnnotationItem } from '@/types/annotations';
import { ANALYTICAL_REGISTERS, AnalyticalRegister } from './constants';

export type LayerGroupMode = 'none' | 'register' | 'author' | 'tag' | 'line' | 'contributor';
export type AnnotationSortMode = 'line-asc' | 'line-desc' | 'author-asc' | 'phrase-asc' | 'tag-count';

export interface AnnotationLayerGroup {
  id: string;
  name: string;
  count: number;
  subtitle?: string;
  badgeClass?: string;
  icon?: string;
  items: AnnotationItem[];
}

/**
 * Extracts a clean, normalized primary author / scholarly source name
 * from source citation strings (e.g. "McHugh, Roland. Annotations..." -> "Roland McHugh").
 */
export function extractPrimaryAuthor(sources?: string[]): string {
  if (!sources || sources.length === 0 || !sources[0]?.trim()) {
    return 'Community / Editorial';
  }

  const first = sources[0].trim();

  // Known Joycean scholars & historical author patterns
  if (/mchugh/i.test(first)) return 'Roland McHugh';
  if (/campbell/i.test(first) && /robinson/i.test(first)) return 'Campbell & Robinson';
  if (/campbell/i.test(first)) return 'Joseph Campbell';
  if (/tindall/i.test(first)) return 'William York Tindall';
  if (/bishop/i.test(first)) return 'John Bishop';
  if (/glasheen/i.test(first)) return 'Adaline Glasheen';
  if (/atherton/i.test(first)) return 'James S. Atherton';
  if (/beckett/i.test(first)) return 'Samuel Beckett et al.';
  if (/vico/i.test(first)) return 'Giambattista Vico';
  if (/ellmann/i.test(first)) return 'Richard Ellmann';
  if (/kenner/i.test(first)) return 'Hugh Kenner';
  if (/hayman/i.test(first)) return 'David Hayman';
  if (/o'hehir/i.test(first)) return "Brendan O'Hehir";
  if (/hart/i.test(first)) return 'Clive Hart';
  if (/senn/i.test(first)) return 'Fritz Senn';
  if (/norris/i.test(first)) return 'David Norris';
  if (/swift/i.test(first)) return 'Jonathan Swift';
  if (/wagner/i.test(first)) return 'Richard Wagner';
  if (/twain/i.test(first)) return 'Mark Twain';
  if (/blackstone/i.test(first)) return 'Sir William Blackstone';
  if (/frazer/i.test(first)) return 'Sir James George Frazer';
  if (/keble/i.test(first)) return 'John Keble';
  if (/curtis/i.test(first)) return 'Edmund Curtis';
  if (/mackillop/i.test(first)) return 'James MacKillop';
  if (/grose/i.test(first)) return 'Francis Grose';
  if (/borrow/i.test(first)) return 'George Borrow';
  if (/caesar/i.test(first)) return 'Julius Caesar';
  if (/opie/i.test(first)) return 'Iona & Peter Opie';
  if (/budgen/i.test(first)) return 'Frank Budgen';
  if (/fweet/i.test(first)) return 'FWEET Concordance';
  if (/finnegans web/i.test(first)) return 'Finnegans Web';
  if (/wikipedia/i.test(first)) return 'Open Reference / Wiki';
  if (/bible|genesis|exodus|vulgate|gospel/i.test(first)) return 'Biblical & Scriptural Sources';
  if (/confession of saint patrick/i.test(first)) return 'St. Patrick / Epigraphy';
  if (/ballad/i.test(first)) return 'Ballad & Street Songs';
  if (/dublin historical record/i.test(first)) return 'Dublin Historical Record';

  // Lastname, Firstname standard citation parsing
  const match = first.match(/^([A-Z][a-zA-Z'\-]+),\s+([A-Z][a-zA-Z'\.\s]+?)(?:\.|\s+and|\s+et\s+al|\s+\()/);
  if (match) {
    return `${match[2].trim()} ${match[1].trim()}`;
  }

  // Sentence-start before period
  const dotIndex = first.indexOf('.');
  if (dotIndex > 0 && dotIndex < 35) {
    return first.slice(0, dotIndex).trim();
  }

  return 'Scholarly Commentary';
}

export function getPrimaryRegisterId(
  annotation: AnnotationItem,
  registers: AnalyticalRegister[] = ANALYTICAL_REGISTERS
): string {
  const cats = annotation.categories || [];

  // Check direct matches first
  for (const reg of registers) {
    if (cats.includes(reg.id)) {
      return reg.id;
    }
  }


  // Semantic category mapping
  for (const cat of cats) {
    const c = cat.toLowerCase();
    if (['vico', 'ricorso', 'cycle-of-history', 'giambattista-vico'].some((k) => c.includes(k))) {
      return 'viconian-cycles';
    }
    if (['topography', 'dublin', 'liffey', 'phoenix-park', 'howth', 'landmarks'].some((k) => c.includes(k))) {
      return 'dublin-topography';
    }
    if (['hce', 'alp', 'shem', 'shaun', 'issies', 'earwicker', 'sigla', 'mamalujo'].some((k) => c.includes(k))) {
      return 'sigla-archetypal';
    }
    if (['biblical', 'genesis', 'eden', 'theology', 'creation', 'scripture', 'hymnology'].some((k) => c.includes(k))) {
      return 'theological-liturgical';
    }
    if (['thunderclap', 'thunder', 'voice-of-god'].some((k) => c.includes(k))) {
      return 'thunderclaps';
    }
    if (['swift', 'vanessa', 'stella', 'carroll'].some((k) => c.includes(k))) {
      return 'swift-carroll';
    }
    if (['tristan', 'isolde', 'arthurian', 'wagner'].some((k) => c.includes(k))) {
      return 'arthurian-tristan';
    }
    if (['humpty', 'nursery', 'rhyme', 'games'].some((k) => c.includes(k))) {
      return 'nursery-rhymes';
    }
    if (['ballad', 'music', 'song', 'finnegan', 'rhythm'].some((k) => c.includes(k))) {
      return 'musical-rhythms';
    }
    if (['french', 'german', 'latin', 'etymology', 'polyglot', 'linguistics', 'languages', 'romani', 'italian'].some((k) => c.includes(k))) {
      return 'etymological-polyglot';
    }
    if (['bruno', 'polarity', 'coincidentia'].some((k) => c.includes(k))) {
      return 'bruno-polarity';
    }
    if (['egyptian', 'osiris', 'isis', 'book-of-the-dead', 'resurrection'].some((k) => c.includes(k))) {
      return 'egyptian-resurrection';
    }
    if (['finn', 'maccool', 'celtic', 'mythology', 'folklore', 'irish'].some((k) => c.includes(k))) {
      return 'irish-mythology';
    }
    if (['dream', 'psychoanalytic', 'freud', 'jung', 'unconscious'].some((k) => c.includes(k))) {
      return 'psychoanalytic-oneiric';
    }
    if (['law', 'trial', 'juridical', 'inquest'].some((k) => c.includes(k))) {
      return 'juridical-inquest';
    }
    if (['kells', 'manuscript', 'illumination', 'tunc'].some((k) => c.includes(k))) {
      return 'book-of-kells';
    }
    if (['river', 'botanical', 'zoological', 'insects'].some((k) => c.includes(k))) {
      return 'botanical-zoological';
    }
    if (['radio', 'television', 'science', 'quantum', 'technology'].some((k) => c.includes(k))) {
      return 'scientific-technological';
    }
    if (['draft', 'notebook', 'buffalo', 'genetic'].some((k) => c.includes(k))) {
      return 'genetic-notebooks';
    }
  }

  return 'etymological-polyglot';
}

/**
 * Compares two annotations according to the chosen sort mode.
 */
export function compareAnnotations(
  a: AnnotationItem,
  b: AnnotationItem,
  mode: AnnotationSortMode
): number {
  switch (mode) {
    case 'line-asc':
      return a.line_number - b.line_number || a.id.localeCompare(b.id);
    case 'line-desc':
      return b.line_number - a.line_number || a.id.localeCompare(b.id);
    case 'author-asc': {
      const authorA = extractPrimaryAuthor(a.sources);
      const authorB = extractPrimaryAuthor(b.sources);
      const authorComp = authorA.localeCompare(authorB);
      if (authorComp !== 0) return authorComp;
      return a.line_number - b.line_number || a.id.localeCompare(b.id);
    }
    case 'phrase-asc': {
      const phraseComp = a.target_phrase.toLowerCase().localeCompare(b.target_phrase.toLowerCase());
      if (phraseComp !== 0) return phraseComp;
      return a.line_number - b.line_number;
    }
    case 'tag-count': {
      const countA = a.categories?.length || 0;
      const countB = b.categories?.length || 0;
      if (countB !== countA) return countB - countA;
      return a.line_number - b.line_number;
    }
    default:
      return a.line_number - b.line_number;
  }
}

/**
 * Returns all unique cited authors across the given annotations list.
 */
export function getUniqueAuthors(annotations: AnnotationItem[]): string[] {
  const authorSet = new Set<string>();
  for (const ann of annotations) {
    authorSet.add(extractPrimaryAuthor(ann.sources));
  }
  return Array.from(authorSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Returns all unique arbitrary category tags across the given annotations list,
 * sorted by frequency (descending) then alphabetically.
 */
export function getUniqueTags(annotations: AnnotationItem[]): Array<{ tag: string; count: number }> {
  const tagCounts = new Map<string, number>();
  for (const ann of annotations) {
    for (const cat of ann.categories || []) {
      const trimmed = cat.trim();
      if (trimmed) {
        tagCounts.set(trimmed, (tagCounts.get(trimmed) || 0) + 1);
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Returns all unique contributors across the given annotations list.
 */
export function getUniqueContributors(annotations: AnnotationItem[]): string[] {
  const contribSet = new Set<string>();
  for (const ann of annotations) {
    for (const c of ann.contributors || []) {
      if (c.trim()) contribSet.add(c.trim());
    }
  }
  return Array.from(contribSet).sort((a, b) => a.localeCompare(b));
}

export interface GroupAndSortOptions {
  groupBy: LayerGroupMode;
  sortBy: AnnotationSortMode;
  searchQuery?: string;
  selectedAuthor?: string;
  selectedTag?: string;
  selectedRegister?: string;
  registers?: AnalyticalRegister[];
}

/**
 * Filters, sorts, and groups annotations into structured visual layers.
 */
export function groupAndSortAnnotations(
  annotations: AnnotationItem[],
  options: GroupAndSortOptions
): AnnotationLayerGroup[] {
  const {
    groupBy,
    sortBy,
    searchQuery = '',
    selectedAuthor = 'all',
    selectedTag = 'all',
    selectedRegister = 'all',
    registers = ANALYTICAL_REGISTERS,
  } = options;


  const normalizedQuery = searchQuery.trim().toLowerCase();

  // 1. Filter annotations
  const filtered = annotations.filter((ann) => {
    // Text search
    if (normalizedQuery) {
      const matchesPhrase = ann.target_phrase.toLowerCase().includes(normalizedQuery);
      const matchesText = ann.annotation_text.toLowerCase().includes(normalizedQuery);
      const matchesId = ann.id.toLowerCase().includes(normalizedQuery);
      const matchesCat = (ann.categories || []).some((c) => c.toLowerCase().includes(normalizedQuery));
      const matchesSource = (ann.sources || []).some((s) => s.toLowerCase().includes(normalizedQuery));
      if (!matchesPhrase && !matchesText && !matchesId && !matchesCat && !matchesSource) {
        return false;
      }
    }

    // Author filter
    if (selectedAuthor !== 'all') {
      const author = extractPrimaryAuthor(ann.sources);
      if (author !== selectedAuthor) return false;
    }

    // Arbitrary tag filter
    if (selectedTag !== 'all') {
      if (!(ann.categories || []).includes(selectedTag)) return false;
    }

    // Register filter
    if (selectedRegister !== 'all') {
      const regId = getPrimaryRegisterId(ann);
      const hasCat = (ann.categories || []).includes(selectedRegister);
      if (regId !== selectedRegister && !hasCat) return false;
    }

    return true;
  });

  // Helper to sort a list of annotations
  const sortItems = (items: AnnotationItem[]) => [...items].sort((a, b) => compareAnnotations(a, b, sortBy));

  // 2. Group into layers
  if (groupBy === 'none') {
    const sorted = sortItems(filtered);
    return [
      {
        id: 'flat-layer',
        name: 'All Page Annotations',
        count: sorted.length,
        subtitle: `${sorted.length} gloss${sorted.length === 1 ? '' : 'es'} indexed`,
        items: sorted,
      },
    ];
  }

  if (groupBy === 'author') {
    const groupsMap = new Map<string, AnnotationItem[]>();
    for (const ann of filtered) {
      const author = extractPrimaryAuthor(ann.sources);
      if (!groupsMap.has(author)) {
        groupsMap.set(author, []);
      }
      groupsMap.get(author)!.push(ann);
    }

    // Sort author groups alphabetically
    const sortedAuthors = Array.from(groupsMap.keys()).sort((a, b) => a.localeCompare(b));

    return sortedAuthors.map((author) => {
      const items = sortItems(groupsMap.get(author)!);
      return {
        id: `author-${author.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
        name: author,
        count: items.length,
        subtitle: `Scholarly Source Layer (${items.length} citation${items.length === 1 ? '' : 's'})`,
        items,
      };
    });
  }

  if (groupBy === 'register') {
    const groupsMap = new Map<string, AnnotationItem[]>();
    for (const ann of filtered) {
      const regId = getPrimaryRegisterId(ann, registers);
      if (!groupsMap.has(regId)) {
        groupsMap.set(regId, []);
      }
      groupsMap.get(regId)!.push(ann);
    }

    // Order groups by canonical register order
    const registerLookup = new Map<string, AnalyticalRegister>(registers.map((r) => [r.id, r]));
    const result: AnnotationLayerGroup[] = [];

    // First add canonical registers present
    for (const reg of registers) {
      if (groupsMap.has(reg.id)) {
        const items = sortItems(groupsMap.get(reg.id)!);
        result.push({
          id: `register-${reg.id}`,
          name: reg.name,
          count: items.length,
          subtitle: reg.category,
          badgeClass: reg.badgeClass,
          icon: reg.icon,
          items,
        });
        groupsMap.delete(reg.id);
      }
    }


    // Any remaining registers
    for (const [otherId, rawItems] of groupsMap.entries()) {
      const items = sortItems(rawItems);
      result.push({
        id: `register-${otherId}`,
        name: otherId,
        count: items.length,
        subtitle: 'Analytical Register',
        items,
      });
    }

    return result;
  }

  if (groupBy === 'tag') {
    const groupsMap = new Map<string, AnnotationItem[]>();
    for (const ann of filtered) {
      const cats = ann.categories && ann.categories.length > 0 ? ann.categories : ['uncategorized'];
      for (const cat of cats) {
        if (!groupsMap.has(cat)) {
          groupsMap.set(cat, []);
        }
        const list = groupsMap.get(cat)!;
        if (!list.some((existing) => existing.id === ann.id)) {
          list.push(ann);
        }
      }
    }

    // Sort tag groups by count descending, then alphabetical
    const sortedTags = Array.from(groupsMap.keys()).sort((a, b) => {
      const diff = groupsMap.get(b)!.length - groupsMap.get(a)!.length;
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });

    return sortedTags.map((tag) => {
      const items = sortItems(groupsMap.get(tag)!);
      return {
        id: `tag-${tag}`,
        name: `#${tag}`,
        count: items.length,
        subtitle: `Semantic Tag Layer (${items.length} annotation${items.length === 1 ? '' : 's'})`,
        items,
      };
    });
  }

  if (groupBy === 'line') {
    const groupsMap = new Map<number, AnnotationItem[]>();
    for (const ann of filtered) {
      const line = ann.line_number;
      if (!groupsMap.has(line)) {
        groupsMap.set(line, []);
      }
      groupsMap.get(line)!.push(ann);
    }

    const sortedLines = Array.from(groupsMap.keys()).sort((a, b) =>
      sortBy === 'line-desc' ? b - a : a - b
    );

    return sortedLines.map((line) => {
      const items = sortItems(groupsMap.get(line)!);
      return {
        id: `line-${line}`,
        name: `Line ${String(line).padStart(2, '0')}`,
        count: items.length,
        subtitle: `${items.length} gloss${items.length === 1 ? '' : 'es'} on this line`,
        items,
      };
    });
  }

  if (groupBy === 'contributor') {
    const groupsMap = new Map<string, AnnotationItem[]>();
    for (const ann of filtered) {
      const contribs = ann.contributors && ann.contributors.length > 0 ? ann.contributors : ['unattributed'];
      for (const c of contribs) {
        if (!groupsMap.has(c)) {
          groupsMap.set(c, []);
        }
        const list = groupsMap.get(c)!;
        if (!list.some((existing) => existing.id === ann.id)) {
          list.push(ann);
        }
      }
    }

    const sortedContribs = Array.from(groupsMap.keys()).sort((a, b) => a.localeCompare(b));

    return sortedContribs.map((contrib) => {
      const items = sortItems(groupsMap.get(contrib)!);
      return {
        id: `contrib-${contrib}`,
        name: `@${contrib}`,
        count: items.length,
        subtitle: `Contributor Layer (${items.length} contribution${items.length === 1 ? '' : 's'})`,
        items,
      };
    });
  }

  return [];
}
