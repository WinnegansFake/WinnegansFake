/**
 * index.ts
 * High-level EPUB reader for Finnegans Wake and standard EPUB archives.
 */

import path from 'path';
import { SimpleZip } from './zip.js';

export { SimpleZip, ZipEntry } from './zip.js';

export interface EpubManifestItem {
  id: string;
  href: string;
  mediaType: string;
}

export interface EpubPage {
  pageNumber: number;
  book: number;
  chapter: number;
  sourceFile: string;
  html: string;
  rawText: string;
  lines: Array<{ line: number; text: string }>;
}

export class EpubArchive {
  private zip: SimpleZip;
  private opfDir: string = '';
  private manifest: Map<string, EpubManifestItem> = new Map();
  private spine: string[] = [];
  private pageMap: Map<number, { href: string; text: string }> = new Map();

  private constructor(zip: SimpleZip) {
    this.zip = zip;
  }

  public static async open(epubPath: string): Promise<EpubArchive> {
    const zip = await SimpleZip.fromFile(epubPath);
    const epub = new EpubArchive(zip);
    await epub.init();
    return epub;
  }

  public getSpine(): string[] {
    return [...this.spine];
  }

  public async getFile(href: string): Promise<Buffer> {
    const fullPath = this.opfDir ? `${this.opfDir}/${href}` : href;
    return await this.zip.readEntry(fullPath);
  }

  public async getText(href: string): Promise<string> {
    const fullPath = this.opfDir ? `${this.opfDir}/${href}` : href;
    return await this.zip.readText(fullPath);
  }

  public getIndexedPageCount(): number {
    return this.pageMap.size;
  }

  public hasPage(pageNumber: number): boolean {
    return this.pageMap.has(pageNumber);
  }

  public async getPage(pageNumber: number): Promise<EpubPage> {
    const entry = this.pageMap.get(pageNumber);
    const { book, chapter } = this.getBookAndChapter(pageNumber);

    if (!entry) {
      // For unmapped pages (or blank divider pages)
      const placeholderText = pageNumber === 2 
        ? '[Page 2: Blank / Facing Page]' 
        : `[Page ${pageNumber} is a title/divider section in Finnegans Wake]`;

      return {
        pageNumber,
        book,
        chapter,
        sourceFile: '',
        html: `<p>${placeholderText}</p>`,
        rawText: placeholderText,
        lines: [{ line: 1, text: placeholderText }],
      };
    }

    const html = await this.getText(entry.href);
    const lines = this.segmentLines(entry.text, pageNumber);

    return {
      pageNumber,
      book,
      chapter,
      sourceFile: entry.href,
      html,
      rawText: entry.text,
      lines,
    };
  }

  private async init(): Promise<void> {
    const containerXml = await this.zip.readText('META-INF/container.xml');
    const fullPathMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
    if (!fullPathMatch) {
      throw new Error('Invalid EPUB: META-INF/container.xml missing full-path attribute.');
    }

    const opfPath = fullPathMatch[1];
    this.opfDir = path.dirname(opfPath).replace(/\\/g, '/');
    if (this.opfDir === '.') this.opfDir = '';

    const opfContent = await this.zip.readText(opfPath);

    const itemRegex = /<item\s+[^>]*?id=["']([^"']+)["'][^>]*?href=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>|<item\s+[^>]*?href=["']([^"']+)["'][^>]*?id=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>/gi;
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(opfContent)) !== null) {
      const id = m[1] || m[5];
      const href = m[2] || m[4];
      const mediaType = m[3] || m[6];
      this.manifest.set(id, { id, href, mediaType });
    }

    const itemrefRegex = /<itemref\s+[^>]*?idref=["']([^"']+)["'][^>]*?\/?>/gi;
    while ((m = itemrefRegex.exec(opfContent)) !== null) {
      const idref = m[1];
      const item = this.manifest.get(idref);
      if (item) {
        this.spine.push(item.href);
      }
    }

    await this.scanBookPages();
  }

  private async scanBookPages(): Promise<void> {
    // 1. Map Front Matter (pages 1 and 2)
    // In standard archive.org EPUB:
    // page_7.html is the Half-Title ("FINNEGANS WAKE")
    // page_8.html / page_16.html is the frontispiece / facing blank page
    this.pageMap.set(1, {
      href: 'page_7.html',
      text: 'FINNEGANS WAKE',
    });

    this.pageMap.set(2, {
      href: 'page_8.html',
      text: '[Page 2: Frontispiece / Facing Page: Blank]',
    });

    // 2. Map standard pages starting at page 3 (page_17.html)
    const p17Idx = this.spine.findIndex((s) => s.includes('page_17.html'));
    const startIdx = p17Idx >= 0 ? p17Idx : 0;
    const textPages: Array<{ href: string; text: string; explicitNum?: number }> = [];

    for (let i = startIdx; i < this.spine.length; i++) {
      const href = this.spine[i];
      try {
        const fullPath = this.opfDir ? `${this.opfDir}/${href}` : href;
        const textContent = await this.zip.readText(fullPath);

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

    // Assign sequential page numbers calibrated by explicit printed page markings
    let curr = 3;
    for (const item of textPages) {
      if (item.explicitNum !== undefined && Math.abs(item.explicitNum - curr) <= 4) {
        curr = item.explicitNum;
      }

      if (curr > 628) break;

      this.pageMap.set(curr, {
        href: item.href,
        text: item.text,
      });

      curr++;
    }
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

  private segmentLines(rawText: string, pageNum: number): Array<{ line: number; text: string }> {
    let text = rawText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');

    if (pageNum === 3 && text.startsWith('7 riverrun')) {
      text = text.substring(2);
    }

    const trailingPagePat = new RegExp(`\\b${pageNum}\\s*$`);
    text = text.replace(trailingPagePat, '').trim();

    const words = text.split(/\s+/);
    const lines: Array<{ line: number; text: string }> = [];
    let currentLine: string[] = [];
    let currentLen = 0;
    const targetLineLen = 70;

    for (const w of words) {
      currentLine.push(w);
      currentLen += w.length + 1;
      if (currentLen >= targetLineLen) {
        lines.push({ line: lines.length + 1, text: currentLine.join(' ') });
        currentLine = [];
        currentLen = 0;
      }
    }

    if (currentLine.length > 0) {
      lines.push({ line: lines.length + 1, text: currentLine.join(' ') });
    }

    return lines;
  }
}
