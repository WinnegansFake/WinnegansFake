/**
 * types.ts
 * Core interfaces and types for the universal EPUB reader engine.
 */

export interface EpubManifestItem {
  id: string;
  href: string;
  mediaType: string;
}

export interface EpubMetadata {
  title?: string;
  creator?: string;
  language?: string;
  identifier?: string;
  publisher?: string;
  rights?: string;
}

export interface EpubLine {
  line: number;
  text: string;
}

export interface EpubPage {
  pageNumber: number;
  book?: number | string;
  chapter?: number | string;
  sourceFile: string;
  html: string;
  rawText: string;
  lines: EpubLine[];
}

export interface LineSegmentationOptions {
  /**
   * Target character length per line for terminal or dual-column reading.
   * Default: 70.
   */
  targetLineLen?: number;

  /**
   * Optional custom text preprocessor / cleanup function.
   */
  cleaner?: (rawText: string, pageNumber?: number) => string;
}

export interface EpubOptions {
  /**
   * Optional custom page mapping strategy to calibrate printed pagination.
   */
  mapper?: EpubPageMapper;

  /**
   * Optional line segmentation settings.
   */
  lineOptions?: LineSegmentationOptions;
}

export interface EpubPageMapper {
  name: string;
  mapPages(archive: any): Promise<Map<number, { href: string; text: string; book?: number; chapter?: number }>>;
  getBookAndChapter?(page: number): { book: number; chapter: number };
}
