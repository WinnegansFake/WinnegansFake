'use client';

import JSZip from 'jszip';
import { PageLine } from '@/types/annotations';
import { getBookAndChapterInfo } from './constants';

export interface ParsedEpubPage {
  pageNumber: number;
  book: number;
  chapter: number;
  lines: PageLine[];
  rawHtml: string;
  sourceFile: string;
}

class BrowserEpubService {
  private zip: JSZip | null = null;
  private opfDir: string = '';
  private spine: string[] = [];
  private manifest: Map<string, { id: string; href: string; mediaType: string }> = new Map();
  private pageMap: Map<number, { href: string; text: string }> = new Map();
  private loaded: boolean = false;
  private fileName: string = '';

  public isLoaded(): boolean {
    return this.loaded;
  }

  public getLoadedFileName(): string {
    return this.fileName;
  }

  public async parseFile(file: File | ArrayBuffer, name: string = 'finneganswake00joycuoft.epub'): Promise<number> {
    const zip = await JSZip.loadAsync(file);
    this.zip = zip;
    this.fileName = name;
    this.manifest.clear();
    this.spine = [];
    this.pageMap.clear();

    // 1. Read container.xml
    const containerFile = zip.file('META-INF/container.xml');
    if (!containerFile) {
      throw new Error('Invalid EPUB archive: missing META-INF/container.xml');
    }
    const containerXml = await containerFile.async('text');
    const fullPathMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
    if (!fullPathMatch) {
      throw new Error('Invalid EPUB archive: container.xml missing full-path');
    }

    const opfPath = fullPathMatch[1];
    const lastSlash = opfPath.lastIndexOf('/');
    this.opfDir = lastSlash >= 0 ? opfPath.substring(0, lastSlash) : '';

    const opfFile = zip.file(opfPath);
    if (!opfFile) {
      throw new Error(`Invalid EPUB: package OPF file not found at ${opfPath}`);
    }
    const opfContent = await opfFile.async('text');

    // 2. Parse manifest
    const itemRegex = /<item\s+[^>]*?id=["']([^"']+)["'][^>]*?href=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>|<item\s+[^>]*?href=["']([^"']+)["'][^>]*?id=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>/gi;
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(opfContent)) !== null) {
      const id = m[1] || m[5];
      const href = m[2] || m[4];
      const mediaType = m[3] || m[6];
      this.manifest.set(id, { id, href, mediaType });
    }

    // 3. Parse spine
    const itemrefRegex = /<itemref\s+[^>]*?idref=["']([^"']+)["'][^>]*?\/?>/gi;
    while ((m = itemrefRegex.exec(opfContent)) !== null) {
      const idref = m[1];
      const item = this.manifest.get(idref);
      if (item) {
        this.spine.push(item.href);
      }
    }

    // 4. Map pages
    // Front matter
    this.pageMap.set(1, { href: 'page_7.html', text: 'FINNEGANS WAKE' });
    this.pageMap.set(2, { href: 'page_8.html', text: '[Page 2: Frontispiece / Facing Page: Blank]' });

    // Find page_17.html (Joyce page 3)
    const p17Idx = this.spine.findIndex((s) => s.includes('page_17.html'));
    const startIdx = p17Idx >= 0 ? p17Idx : 0;
    const textPages: Array<{ href: string; text: string; explicitNum?: number }> = [];

    for (let i = startIdx; i < this.spine.length; i++) {
      const href = this.spine[i];
      const fullPath = this.opfDir ? `${this.opfDir}/${href}` : href;
      const fileEntry = zip.file(fullPath);
      if (!fileEntry) continue;

      try {
        const textContent = await fileEntry.async('text');
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

      this.pageMap.set(curr, {
        href: item.href,
        text: item.text,
      });
      curr++;
    }

    this.loaded = true;
    return this.pageMap.size;
  }

  public async getPage(pageNumber: number): Promise<ParsedEpubPage | null> {
    if (!this.loaded || !this.zip) return null;

    const entry = this.pageMap.get(pageNumber);
    const { book, chapter } = getBookAndChapterInfo(pageNumber);

    if (!entry) {
      return {
        pageNumber,
        book,
        chapter,
        sourceFile: '',
        rawHtml: `<p class="italic text-slate-400">[Page ${pageNumber} has no text or is a structural divider]</p>`,
        lines: [{ line: 1, text: `[Page ${pageNumber} has no text or is a structural divider]` }],
      };
    }

    const fullPath = this.opfDir ? `${this.opfDir}/${entry.href}` : entry.href;
    const fileEntry = this.zip.file(fullPath);
    const rawHtml = fileEntry ? await fileEntry.async('text') : `<p>${entry.text}</p>`;
    const lines = this.segmentLines(entry.text, pageNumber);

    return {
      pageNumber,
      book,
      chapter,
      sourceFile: entry.href,
      rawHtml,
      lines,
    };
  }

  private segmentLines(rawText: string, pageNum: number): PageLine[] {
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
    const lines: PageLine[] = [];
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

export const browserEpub = new BrowserEpubService();
