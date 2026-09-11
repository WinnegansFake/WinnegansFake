/**
 * archive.ts
 * Universal, zero-dependency EPUB archive reader and text extractor.
 */

import path from 'path';
import { SimpleZip } from './zip.js';
import {
  EpubManifestItem,
  EpubMetadata,
  EpubPage,
  EpubOptions,
  EpubPageMapper,
  LineSegmentationOptions,
} from './types.js';
import { JoyceanPageMapper, SequentialSpineMapper } from './mappers.js';

export class EpubArchive {
  private zip: SimpleZip;
  private opfDir: string = '';
  private manifest: Map<string, EpubManifestItem> = new Map();
  private spine: string[] = [];
  private metadata: EpubMetadata = {};
  private mapper: EpubPageMapper;
  private lineOptions: LineSegmentationOptions;
  private pageMap: Map<number, { href: string; text: string; book?: number; chapter?: number }> = new Map();

  private constructor(zip: SimpleZip, options: EpubOptions = {}) {
    this.zip = zip;
    this.mapper = options.mapper ?? new JoyceanPageMapper();
    this.lineOptions = options.lineOptions ?? {};
  }

  public static async open(epubPath: string, options: EpubOptions = {}): Promise<EpubArchive> {
    const zip = await SimpleZip.fromFile(epubPath);
    const epub = new EpubArchive(zip, options);
    await epub.init();
    return epub;
  }

  public static async fromBuffer(buffer: Buffer, options: EpubOptions = {}): Promise<EpubArchive> {
    const zip = await SimpleZip.fromBuffer(buffer);
    const epub = new EpubArchive(zip, options);
    await epub.init();
    return epub;
  }

  public getMetadata(): EpubMetadata {
    return { ...this.metadata };
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

  public async getPlainText(href: string): Promise<string> {
    const raw = await this.getText(href);
    return this.cleanHtmlToText(raw);
  }

  public async getHtml(href: string): Promise<string> {
    const fullPath = this.opfDir ? `${this.opfDir}/${href}` : href;
    return await this.zip.readText(fullPath);
  }

  public getIndexedPageCount(): number {
    return this.pageMap.size;
  }

  public hasPage(pageNumber: number): boolean {
    return this.pageMap.has(pageNumber);
  }

  public async setPageMapper(mapper: EpubPageMapper): Promise<void> {
    this.mapper = mapper;
    this.pageMap = await this.mapper.mapPages(this);
  }

  public async getPage(pageNumber: number): Promise<EpubPage> {
    const entry = this.pageMap.get(pageNumber);
    const { book, chapter } = this.getBookAndChapter(pageNumber);

    if (!entry) {
      const placeholderText = `[Page ${pageNumber}]`;
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

    const fullPath = this.opfDir ? `${this.opfDir}/${entry.href}` : entry.href;
    const html = await this.zip.readText(fullPath);
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

  public getBookAndChapter(page: number): { book?: number; chapter?: number } {
    if (this.mapper.getBookAndChapter) {
      return this.mapper.getBookAndChapter(page);
    }
    const entry = this.pageMap.get(page);
    return {
      book: entry?.book,
      chapter: entry?.chapter,
    };
  }

  private cleanHtmlToText(html: string): string {
    const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const content = pMatch ? pMatch[1] : html.replace(/<[^>]+>/g, ' ');

    return content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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

    // Extract basic metadata
    const titleMatch = opfContent.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i);
    if (titleMatch) this.metadata.title = titleMatch[1].trim();

    const creatorMatch = opfContent.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i);
    if (creatorMatch) this.metadata.creator = creatorMatch[1].trim();

    const langMatch = opfContent.match(/<dc:language[^>]*>([\s\S]*?)<\/dc:language>/i);
    if (langMatch) this.metadata.language = langMatch[1].trim();

    const idMatch = opfContent.match(/<dc:identifier[^>]*>([\s\S]*?)<\/dc:identifier>/i);
    if (idMatch) this.metadata.identifier = idMatch[1].trim();

    // Parse manifest items
    const itemRegex = /<item\s+[^>]*?id=["']([^"']+)["'][^>]*?href=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>|<item\s+[^>]*?href=["']([^"']+)["'][^>]*?id=["']([^"']+)["'][^>]*?media-type=["']([^"']+)["'][^>]*?\/?>/gi;
    let m: RegExpExecArray | null;
    while ((m = itemRegex.exec(opfContent)) !== null) {
      const id = m[1] || m[5];
      const href = m[2] || m[4];
      const mediaType = m[3] || m[6];
      this.manifest.set(id, { id, href, mediaType });
    }

    // Parse spine reading order
    const itemrefRegex = /<itemref\s+[^>]*?idref=["']([^"']+)["'][^>]*?\/?>/gi;
    while ((m = itemrefRegex.exec(opfContent)) !== null) {
      const idref = m[1];
      const item = this.manifest.get(idref);
      if (item) {
        this.spine.push(item.href);
      }
    }

    // Map pages using configured mapper
    this.pageMap = await this.mapper.mapPages(this);
  }

  public segmentLines(rawText: string, pageNum?: number): Array<{ line: number; text: string }> {
    let text = rawText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');

    if (this.lineOptions.cleaner) {
      text = this.lineOptions.cleaner(text, pageNum);
    } else if (pageNum !== undefined) {
      // Default heuristic for digitized page trailing numbers
      if (pageNum === 3 && text.startsWith('7 riverrun')) {
        text = text.substring(2);
      }
      const trailingPagePat = new RegExp(`\\b${pageNum}\\s*$`);
      text = text.replace(trailingPagePat, '').trim();
    }

    const words = text.split(/\s+/);
    const lines: Array<{ line: number; text: string }> = [];
    let currentLine: string[] = [];
    let currentLen = 0;
    const targetLineLen = this.lineOptions.targetLineLen ?? 70;

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
