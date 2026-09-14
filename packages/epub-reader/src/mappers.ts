/**
 * mappers.ts
 * Page calibration and mapping strategies for EPUB archives.
 */

import { EpubPageMapper } from './types.js';

/**
 * Generic mapper: Maps each spine item in reading order to consecutive page numbers (1..N).
 */
export class SequentialSpineMapper implements EpubPageMapper {
  public readonly name = 'sequential-spine';

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();
    let pageNum = 1;

    for (const href of spine) {
      try {
        const text = await archive.getText(href);
        if (text.trim().length > 30) {
          pageMap.set(pageNum++, { href, text: text.trim() });
        }
      } catch {
        continue;
      }
    }

    return pageMap;
  }
}

/**
 * Generic mapper: Scans spine documents for printed page numbers at the end of paragraphs.
 * Ideal for books digitized from print facsimiles.
 */
export class CalibratedNumberMapper implements EpubPageMapper {
  public readonly name = 'calibrated-number';
  private maxPages: number;

  constructor(maxPages = 2000) {
    this.maxPages = maxPages;
  }

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();
    const candidatePages: Array<{ href: string; text: string; explicitNum?: number }> = [];

    for (const href of spine) {
      try {
        const textContent = await archive.getText(href);
        if (textContent.length < 100) continue;

        const endMatch = textContent.match(/\b([1-9]\d{0,3})\s*$/);
        const explicitNum = endMatch ? parseInt(endMatch[1], 10) : undefined;
        candidatePages.push({ href, text: textContent, explicitNum });
      } catch {
        continue;
      }
    }

    let curr = 1;
    for (const item of candidatePages) {
      if (item.explicitNum !== undefined && Math.abs(item.explicitNum - curr) <= 4) {
        curr = item.explicitNum;
      }
      if (curr > this.maxPages) break;
      pageMap.set(curr++, { href: item.href, text: item.text });
    }

    return pageMap;
  }
}

/**
 * Specialized Joycean Page Mapper for Finnegans Wake (1939 Faber / Archive.org edition).
 * Handles the unique frontispiece offset and 17 chapter division boundaries.
 */
export class JoyceanPageMapper implements EpubPageMapper {
  public readonly name = 'joycean-wake';

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();

    // 1. Front Matter (pages 1 and 2)
    pageMap.set(1, {
      href: 'page_7.html',
      text: 'FINNEGANS WAKE',
    });

    pageMap.set(2, {
      href: 'page_8.html',
      text: '[Page 2: Frontispiece / Facing Page: Blank]',
    });

    // 2. Standard text starting at page 3 (page_17.html)
    const spine = archive.getSpine();
    const p17Idx = spine.findIndex((s: string) => s.includes('page_17.html'));
    const startIdx = p17Idx >= 0 ? p17Idx : 0;
    const textPages: Array<{ href: string; text: string; explicitNum?: number }> = [];

    for (let i = startIdx; i < spine.length; i++) {
      const href = spine[i];
      try {
        const textContent = await archive.getText(href);

        if (
          textContent.length < 300 ||
          textContent.includes('only 0.00% accurate') ||
          textContent.includes('only 9.00% accurate') ||
          textContent.includes('only 10.00% accurate')
        ) {
          continue;
        }

        const pMatch = textContent.match(/<p>([\s\S]*?)<\/p>/i);
        if (!pMatch) continue;

        const rawP = pMatch[1].trim();
        if (rawP.length < 100) continue;

        const endMatch = rawP.match(/\b([3-9]|[1-5][0-9]{2}|6[0-2][0-9])\s*$/);
        const explicitNum = endMatch ? parseInt(endMatch[1], 10) : undefined;

        textPages.push({ href, text: rawP, explicitNum });
      } catch {
        continue;
      }
    }

    let curr = 3;
    for (const item of textPages) {
      if (item.explicitNum !== undefined && Math.abs(item.explicitNum - curr) <= 4) {
        curr = item.explicitNum;
      }

      if (curr > 628) break;

      pageMap.set(curr, {
        href: item.href,
        text: item.text,
      });

      curr++;
    }

    return pageMap;
  }

  public getBookAndChapter(page: number): { book: number; chapter: number } {
    if (page >= 1 && page <= 29) return { book: 1, chapter: 1 };
    if (page >= 30 && page <= 47) return { book: 1, chapter: 2 };
    if (page >= 48 && page <= 74) return { book: 1, chapter: 3 };
    if (page >= 75 && page <= 103) return { book: 1, chapter: 4 };
    if (page >= 104 && page <= 125) return { book: 1, chapter: 5 };
    if (page >= 126 && page <= 168) return { book: 1, chapter: 6 };
    if (page >= 169 && page <= 195) return { book: 1, chapter: 7 };
    if (page >= 196 && page <= 216) return { book: 1, chapter: 8 };

    if (page >= 217 && page <= 259) return { book: 2, chapter: 1 };
    if (page >= 260 && page <= 308) return { book: 2, chapter: 2 };
    if (page >= 309 && page <= 382) return { book: 2, chapter: 3 };
    if (page >= 383 && page <= 399) return { book: 2, chapter: 4 };

    if (page >= 400 && page <= 428) return { book: 3, chapter: 1 };
    if (page >= 429 && page <= 473) return { book: 3, chapter: 2 };
    if (page >= 474 && page <= 554) return { book: 3, chapter: 3 };
    if (page >= 555 && page <= 590) return { book: 3, chapter: 4 };

    return { book: 4, chapter: 1 };
  }
}

/**
 * Specialized Joycean Page Mapper for Ulysses (1922 Shakespeare & Co. / Standard Ebooks edition).
 * Maps spine entries or pagination to 18 episodes across 3 parts.
 */
export class UlyssesEpisodeMapper implements EpubPageMapper {
  public readonly name = 'joycean-ulysses';

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();

    // 1. Check if archive is Internet Archive 1922 scan format (starts at page_25.html)
    const p25Idx = spine.findIndex((s: string) => s.includes('page_25.html'));
    if (p25Idx >= 0) {
      let bookPage = 1;
      for (let i = p25Idx; i < spine.length && bookPage <= 732; i++) {
        const href = spine[i];
        try {
          const text = await archive.getText(href);
          pageMap.set(bookPage++, { href, text: text.trim() });
        } catch {
          continue;
        }
      }
      if (pageMap.size > 0) return pageMap;
    }

    // 2. Generic fallback: filter boilerplate and map spine items sequentially
    let pageNum = 1;
    for (const href of spine) {
      try {
        const text = await archive.getText(href);
        if (text.length > 200 && !href.includes('toc') && !href.includes('colophon')) {
          pageMap.set(pageNum++, { href, text: text.trim() });
        }
      } catch {
        continue;
      }
    }

    if (pageMap.size === 0) {
      pageNum = 1;
      for (const href of spine) {
        try {
          const text = await archive.getText(href);
          pageMap.set(pageNum++, { href, text: text.trim() });
        } catch {
          continue;
        }
      }
    }

    return pageMap;
  }

  public getEpisodeInfo(page: number): { part: number; episode: number; title: string } {
    const episodes = [
      { part: 1, episode: 1, title: 'Telemachus', startPage: 1, endPage: 28 },
      { part: 1, episode: 2, title: 'Nestor', startPage: 29, endPage: 50 },
      { part: 1, episode: 3, title: 'Proteus', startPage: 51, endPage: 70 },
      { part: 2, episode: 4, title: 'Calypso', startPage: 71, endPage: 94 },
      { part: 2, episode: 5, title: 'Lotus Eaters', startPage: 95, endPage: 116 },
      { part: 2, episode: 6, title: 'Hades', startPage: 117, endPage: 152 },
      { part: 2, episode: 7, title: 'Aeolus', startPage: 153, endPage: 198 },
      { part: 2, episode: 8, title: 'Lestrygonians', startPage: 199, endPage: 242 },
      { part: 2, episode: 9, title: 'Scylla and Charybdis', startPage: 243, endPage: 282 },
      { part: 2, episode: 10, title: 'Wandering Rocks', startPage: 283, endPage: 328 },
      { part: 2, episode: 11, title: 'Sirens', startPage: 329, endPage: 372 },
      { part: 2, episode: 12, title: 'Cyclops', startPage: 373, endPage: 444 },
      { part: 2, episode: 13, title: 'Nausicaa', startPage: 445, endPage: 486 },
      { part: 2, episode: 14, title: 'Oxen of the Sun', startPage: 487, endPage: 538 },
      { part: 2, episode: 15, title: 'Circe', startPage: 539, endPage: 658 },
      { part: 3, episode: 16, title: 'Eumaeus', startPage: 659, endPage: 702 },
      { part: 3, episode: 17, title: 'Ithaca', startPage: 703, endPage: 720 },
      { part: 3, episode: 18, title: 'Penelope', startPage: 721, endPage: 732 },
    ];
    const match = episodes.find((ep) => page >= ep.startPage && page <= ep.endPage);
    if (match) return { part: match.part, episode: match.episode, title: match.title };
    return { part: 1, episode: 1, title: 'Telemachus' };
  }
}

export interface RegexPaginationMapperOptions {
  name?: string;
  /** Regex with first capture group representing the extracted page number */
  pagePattern?: RegExp;
  /** Skip href filter (e.g. toc, colophon, cover, titlepage) */
  skipFilter?: (href: string, text: string) => boolean;
  /** Minimum character length of extracted text to be considered a page */
  minTextLength?: number;
  /** Page number to start counting from if explicit numbers aren't found */
  startPage?: number;
  /** Max pages to extract */
  maxPages?: number;
  /** Strategy for unnumbered spine items: 'sequential' increments, 'skip' ignores */
  unmatchedStrategy?: 'sequential' | 'skip';
}

/**
 * Highly configurable pagination mapper using regular expressions.
 * Ideal for third-party works digitized with custom HTML tags, page break spans, or anchors.
 */
export class RegexPaginationMapper implements EpubPageMapper {
  public readonly name: string;
  private options: Required<RegexPaginationMapperOptions>;

  constructor(options: RegexPaginationMapperOptions = {}) {
    this.name = options.name || 'regex-pagination';
    this.options = {
      name: this.name,
      pagePattern: options.pagePattern || /\b(?:page|p\.?)\s*([0-9]{1,4})\b/i,
      skipFilter: options.skipFilter || ((href: string) => /toc|colophon|cover|titlepage/i.test(href)),
      minTextLength: options.minTextLength ?? 80,
      startPage: options.startPage ?? 1,
      maxPages: options.maxPages ?? 2000,
      unmatchedStrategy: options.unmatchedStrategy ?? 'sequential',
    };
  }

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();
    let currentSeqPage = this.options.startPage;

    for (const href of spine) {
      try {
        const text = await archive.getText(href);
        const trimmed = text.trim();
        if (trimmed.length < this.options.minTextLength) continue;
        if (this.options.skipFilter(href, trimmed)) continue;

        let targetPage: number | null = null;
        const match = trimmed.match(this.options.pagePattern);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed) && parsed > 0 && parsed <= this.options.maxPages) {
            targetPage = parsed;
          }
        }

        if (targetPage === null) {
          if (this.options.unmatchedStrategy === 'sequential') {
            targetPage = currentSeqPage;
          } else {
            continue;
          }
        }

        if (targetPage > this.options.maxPages) break;
        pageMap.set(targetPage, { href, text: trimmed });
        currentSeqPage = targetPage + 1;
      } catch {
        continue;
      }
    }

    return pageMap;
  }
}

export interface CustomOffsetMapperOptions {
  name?: string;
  startSpineIndex: number;
  endSpineIndex?: number;
  startPage?: number;
  maxPages?: number;
  minTextLength?: number;
}

/**
 * Maps a slice of spine items directly by index offset.
 */
export class CustomOffsetMapper implements EpubPageMapper {
  public readonly name: string;
  private options: CustomOffsetMapperOptions;

  constructor(options: CustomOffsetMapperOptions) {
    this.name = options.name || 'custom-offset';
    this.options = {
      startPage: 1,
      maxPages: 2000,
      minTextLength: 50,
      ...options,
    };
  }

  public async mapPages(archive: any): Promise<Map<number, { href: string; text: string }>> {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();
    const startIndex = Math.max(0, this.options.startSpineIndex);
    const endIndex =
      this.options.endSpineIndex !== undefined
        ? Math.min(spine.length, this.options.endSpineIndex)
        : spine.length;

    let currPage = this.options.startPage ?? 1;
    for (let i = startIndex; i < endIndex && currPage <= (this.options.maxPages ?? 2000); i++) {
      const href = spine[i];
      try {
        const text = await archive.getText(href);
        const trimmed = text.trim();
        if (trimmed.length < (this.options.minTextLength ?? 50)) continue;
        pageMap.set(currPage++, { href, text: trimmed });
      } catch {
        continue;
      }
    }

    return pageMap;
  }
}

/** Runtime registry for work-specific page mappers */
const WORK_MAPPERS = new Map<string, EpubPageMapper>();

/**
 * Register a custom page mapper for any literary work.
 */
export function registerMapper(workId: string, mapper: EpubPageMapper): void {
  WORK_MAPPERS.set(workId.toLowerCase().trim(), mapper);
}

/**
 * Returns the appropriate EpubPageMapper for a given work identifier.
 */
export function getMapperForWork(workId?: string): EpubPageMapper {
  if (!workId) return new JoyceanPageMapper();
  const normalized = workId.toLowerCase().trim();
  if (WORK_MAPPERS.has(normalized)) {
    return WORK_MAPPERS.get(normalized)!;
  }
  if (normalized === 'ulysses') {
    return new UlyssesEpisodeMapper();
  }
  if (normalized === 'finnegans-wake' || normalized === 'fw') {
    return new JoyceanPageMapper();
  }
  return new SequentialSpineMapper();
}

