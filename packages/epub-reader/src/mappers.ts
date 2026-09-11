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
