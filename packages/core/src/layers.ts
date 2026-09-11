import { AnnotationItem, AnalyticalRegister } from './types.js';
import { FINNEGANS_WAKE_REGISTERS } from './works.js';

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
  if (/budgen/i.test(first)) return 'Frank Budgen';
  if (/fweet/i.test(first)) return 'FWEET Concordance';
  if (/gifford/i.test(first)) return 'Don Gifford';
  if (/seidel/i.test(first)) return 'Michael Seidel';
  if (/wikipedia/i.test(first)) return 'Open Reference / Wiki';
  if (/bible|genesis|exodus|vulgate|gospel/i.test(first)) return 'Biblical & Scriptural Sources';
  if (/dante|alighieri/i.test(first)) return 'Dante Alighieri';
  if (/homer|odyssey|iliad/i.test(first)) return 'Homeric Epic';

  // Lastname, Firstname standard citation parsing: "Smith, John. The Book..." -> "John Smith"
  const match = first.match(/^([A-Z][a-zA-Z'\-]+),\s+([A-Z][a-zA-Z'\.\s]+?)(?:\.|\s+and|\s+et\s+al|\s+\()/);
  if (match) {
    return `${match[2].trim()} ${match[1].trim()}`;
  }

  // Fallback: take first part before period/comma
  const chunk = first.split(/[.,(]/)[0].trim();
  if (chunk.length > 30) {
    return chunk.substring(0, 27) + '...';
  }
  return chunk || 'Community / Editorial';
}

/**
 * Maps an annotation to its primary analytical register ID.
 */
export function getPrimaryRegisterId(
  annotation: AnnotationItem,
  registers: AnalyticalRegister[] = FINNEGANS_WAKE_REGISTERS
): string {
  if (annotation.categories && annotation.categories.length > 0) {
    for (const cat of annotation.categories) {
      const direct = registers.find((r) => r.id === cat);
      if (direct) return direct.id;
    }

    // Fuzzy category keyword matching
    for (const cat of annotation.categories) {
      const lower = cat.toLowerCase();
      if (lower.includes('etymolog') || lower.includes('language') || lower.includes('portmanteau') || lower.includes('german') || lower.includes('irish') || lower.includes('norse') || lower.includes('latin') || lower.includes('greek')) {
        return 'etymological-polyglot';
      }
      if (lower.includes('topograph') || lower.includes('dublin') || lower.includes('liffey') || lower.includes('geograph') || lower.includes('river')) {
        return 'dublin-topography';
      }
      if (lower.includes('vico') || lower.includes('ricorso') || lower.includes('cycle') || lower.includes('age') || lower.includes('thunder')) {
        return 'viconian-cycles';
      }
      if (lower.includes('theolog') || lower.includes('liturg') || lower.includes('mass') || lower.includes('church') || lower.includes('hymn') || lower.includes('creed') || lower.includes('saint')) {
        return 'theological-liturgical';
      }
      if (lower.includes('sigla') || lower.includes('hce') || lower.includes('alp') || lower.includes('shem') || lower.includes('shaun') || lower.includes('issy') || lower.includes('mamalujo')) {
        return 'sigla-archetypal';
      }
      if (lower.includes('myth') || lower.includes('celtic') || lower.includes('legend') || lower.includes('folklore') || lower.includes('finn') || lower.includes('ossian')) {
        return 'irish-mythology';
      }
      if (lower.includes('bruno') || lower.includes('coincidentia') || lower.includes('opposites') || lower.includes('dialectic') || lower.includes('philosophy')) {
        return 'philosophical-dialectic';
      }
      if (lower.includes('allusion') || lower.includes('intertext') || lower.includes('literature') || lower.includes('shakespeare') || lower.includes('swift') || lower.includes('ibsen') || lower.includes('carroll')) {
        return 'literary-allusion';
      }
      if (lower.includes('song') || lower.includes('ballad') || lower.includes('music') || lower.includes('opera') || lower.includes('rhythm') || lower.includes('rhyme') || lower.includes('melody')) {
        return 'musical-acoustic';
      }
      if (lower.includes('astronom') || lower.includes('physics') || lower.includes('geometry') || lower.includes('science') || lower.includes('mathematics') || lower.includes('radio') || lower.includes('television')) {
        return 'scientific-cosmological';
      }
      if (lower.includes('rhetoric') || lower.includes('parody') || lower.includes('satire') || lower.includes('comedy') || lower.includes('pun') || lower.includes('carnival')) {
        return 'carnivalesque-satire';
      }
      if (lower.includes('genetic') || lower.includes('notebook') || lower.includes('draft') || lower.includes('manuscript') || lower.includes('buffalo') || lower.includes('variant')) {
        return 'genetic-manuscript';
      }
    }
  }

  // Infer from annotation text
  const text = (annotation.annotation_text + ' ' + (annotation.sources?.join(' ') || '')).toLowerCase();
  if (text.includes('vico') || text.includes('ricorso') || text.includes('thunder')) return 'viconian-cycles';
  if (text.includes('dublin') || text.includes('howth') || text.includes('liffey') || text.includes('phoenix park')) return 'dublin-topography';
  if (text.includes('bruno') || text.includes('coincidentia') || text.includes('dialectic')) return 'philosophical-dialectic';
  if (text.includes('latin') || text.includes('greek') || text.includes('german') || text.includes('irish') || text.includes('etymology') || text.includes('portmanteau')) return 'etymological-polyglot';
  if (text.includes('mass') || text.includes('liturgy') || text.includes('hymn') || text.includes('catholic') || text.includes('prayer')) return 'theological-liturgical';
  if (text.includes('sigla') || text.includes('earwicker') || text.includes('plurabelle')) return 'sigla-archetypal';
  if (text.includes('ballad') || text.includes('song') || text.includes('opera') || text.includes('aria')) return 'musical-acoustic';
  if (text.includes('draft') || text.includes('notebook') || text.includes('manuscript')) return 'genetic-manuscript';

  return registers[0]?.id || 'general';
}

/**
 * Comparator for sorting annotations by various criteria.
 */
export function compareAnnotations(
  a: AnnotationItem,
  b: AnnotationItem,
  sortMode: AnnotationSortMode
): number {
  switch (sortMode) {
    case 'line-asc':
      return a.line_number - b.line_number || a.id.localeCompare(b.id);
    case 'line-desc':
      return b.line_number - a.line_number || a.id.localeCompare(b.id);
    case 'author-asc': {
      const authorA = extractPrimaryAuthor(a.sources);
      const authorB = extractPrimaryAuthor(b.sources);
      const cmp = authorA.localeCompare(authorB);
      if (cmp !== 0) return cmp;
      return a.line_number - b.line_number;
    }
    case 'phrase-asc': {
      const phraseA = a.target_phrase.toLowerCase();
      const phraseB = b.target_phrase.toLowerCase();
      const cmp = phraseA.localeCompare(phraseB);
      if (cmp !== 0) return cmp;
      return a.line_number - b.line_number;
    }
    case 'tag-count': {
      const countA = (a.categories || []).length;
      const countB = (b.categories || []).length;
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

export interface UniqueTagItem {
  tag: string;
  count: number;
}

/**
 * Returns all unique arbitrary category tags across the given annotations list,
 * sorted by frequency (descending) then alphabetically.
 */
export function getUniqueTags(annotations: AnnotationItem[]): UniqueTagItem[] {
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
      const trimmed = c.trim();
      if (trimmed) contribSet.add(trimmed);
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
    registers = FINNEGANS_WAKE_REGISTERS,
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

    // Tag filter
    if (selectedTag !== 'all') {
      const hasTag = (ann.categories || []).some((c) => c.toLowerCase() === selectedTag.toLowerCase());
      if (!hasTag) return false;
    }

    // Analytical register filter
    if (selectedRegister !== 'all') {
      const regId = getPrimaryRegisterId(ann, registers);
      if (regId !== selectedRegister) return false;
    }

    return true;
  });

  // 2. Sort filtered annotations
  const sorted = [...filtered].sort((a, b) => compareAnnotations(a, b, sortBy));

  // 3. Group according to requested layer mode
  switch (groupBy) {
    case 'none': {
      return [
        {
          id: 'all',
          name: 'All Notes',
          subtitle: `${sorted.length} glosses on page`,
          count: sorted.length,
          items: sorted,
        },
      ];
    }

    case 'register': {
      const regMap = new Map<string, AnnotationItem[]>();
      for (const ann of sorted) {
        const regId = getPrimaryRegisterId(ann, registers);
        const list = regMap.get(regId) || [];
        list.push(ann);
        regMap.set(regId, list);
      }

      const groups: AnnotationLayerGroup[] = [];
      for (const reg of registers) {
        const items = regMap.get(reg.id);
        if (items && items.length > 0) {
          groups.push({
            id: reg.id,
            name: reg.name,
            subtitle: reg.category,
            badgeClass: reg.badgeClass,
            icon: reg.icon,
            count: items.length,
            items,
          });
        }
      }

      // Collect any unmapped or custom registers
      for (const [key, items] of regMap.entries()) {
        if (!registers.some((r) => r.id === key)) {
          groups.push({
            id: key,
            name: key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            subtitle: 'Custom Analytical Layer',
            badgeClass: 'bg-slate-900 text-slate-300 border-slate-700',
            icon: 'FileText',
            count: items.length,
            items,
          });
        }
      }

      return groups;
    }

    case 'author': {
      const authorMap = new Map<string, AnnotationItem[]>();
      for (const ann of sorted) {
        const author = extractPrimaryAuthor(ann.sources);
        const list = authorMap.get(author) || [];
        list.push(ann);
        authorMap.set(author, list);
      }

      const groups: AnnotationLayerGroup[] = [];
      for (const [author, items] of authorMap.entries()) {
        groups.push({
          id: `author-${author.toLowerCase().replace(/\s+/g, '-')}`,
          name: author,
          subtitle: `${items.length} contribution${items.length === 1 ? '' : 's'}`,
          badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40',
          icon: 'User',
          count: items.length,
          items,
        });
      }

      // Sort author groups alphabetically, but keep "Community / Editorial" at the end if present
      groups.sort((a, b) => {
        if (a.name === 'Community / Editorial') return 1;
        if (b.name === 'Community / Editorial') return -1;
        return a.name.localeCompare(b.name);
      });

      return groups;
    }

    case 'tag': {
      const tagMap = new Map<string, AnnotationItem[]>();
      for (const ann of sorted) {
        const tags = ann.categories && ann.categories.length > 0 ? ann.categories : ['General'];
        for (const tag of tags) {
          const list = tagMap.get(tag) || [];
          if (!list.includes(ann)) {
            list.push(ann);
          }
          tagMap.set(tag, list);
        }
      }

      const groups: AnnotationLayerGroup[] = [];
      for (const [tag, items] of tagMap.entries()) {
        groups.push({
          id: `tag-${tag.toLowerCase().replace(/\s+/g, '-')}`,
          name: tag,
          subtitle: `${items.length} instance${items.length === 1 ? '' : 's'}`,
          badgeClass: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
          icon: 'Tag',
          count: items.length,
          items,
        });
      }

      // Sort tag groups by count descending, then name
      groups.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      return groups;
    }

    case 'line': {
      const lineMap = new Map<number, AnnotationItem[]>();
      for (const ann of sorted) {
        const list = lineMap.get(ann.line_number) || [];
        list.push(ann);
        lineMap.set(ann.line_number, list);
      }

      const groups: AnnotationLayerGroup[] = [];
      const sortedLineNumbers = Array.from(lineMap.keys()).sort((a, b) => a - b);
      for (const lineNum of sortedLineNumbers) {
        const items = lineMap.get(lineNum)!;
        groups.push({
          id: `line-${lineNum}`,
          name: `Line ${lineNum}`,
          subtitle: `${items.length} note${items.length === 1 ? '' : 's'}`,
          badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
          icon: 'CornerDownRight',
          count: items.length,
          items,
        });
      }

      return groups;
    }

    case 'contributor': {
      const contribMap = new Map<string, AnnotationItem[]>();
      for (const ann of sorted) {
        const contribs = ann.contributors && ann.contributors.length > 0 ? ann.contributors : ['Anonymous'];
        for (const c of contribs) {
          const list = contribMap.get(c) || [];
          if (!list.includes(ann)) {
            list.push(ann);
          }
          contribMap.set(c, list);
        }
      }

      const groups: AnnotationLayerGroup[] = [];
      for (const [contrib, items] of contribMap.entries()) {
        groups.push({
          id: `contrib-${contrib.toLowerCase().replace(/\s+/g, '-')}`,
          name: `@${contrib.replace(/^@/, '')}`,
          subtitle: `${items.length} annotation${items.length === 1 ? '' : 's'}`,
          badgeClass: 'bg-purple-950/60 text-purple-300 border-purple-500/40',
          icon: 'Users',
          count: items.length,
          items,
        });
      }

      groups.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
      return groups;
    }

    default:
      return [
        {
          id: 'all',
          name: 'Annotations',
          count: sorted.length,
          items: sorted,
        },
      ];
  }
}
