/**
 * coordinate.ts
 * Universal book coordinate representation and formatting.
 * Supports standard page-and-line coordinates (e.g. 003.01 or 3.1)
 * as well as hierarchical book/chapter/page/line schemes.
 */

export interface BookCoordinate {
  book?: number | string;
  chapter?: number | string;
  page: number;
  line?: number;
}

export interface FormatOptions {
  padPage?: number; // e.g. 3 -> "003"
  padLine?: number; // e.g. 2 -> "01"
  includeBook?: boolean;
  includeChapter?: boolean;
  separator?: string; // default: '.'
}

/**
 * Parses a coordinate string such as:
 * - "003.01" -> { page: 3, line: 1 }
 * - "3.1" -> { page: 3, line: 1 }
 * - "1.2.003.01" -> { book: 1, chapter: 2, page: 3, line: 1 }
 * - "42" -> { page: 42 }
 */
export function parseCoordinate(coordStr: string): BookCoordinate {
  const trimmed = coordStr.trim();
  const parts = trimmed.split(/[:.]/);

  if (parts.length === 1) {
    const p = parseInt(parts[0], 10);
    if (isNaN(p)) throw new Error(`Invalid coordinate: "${coordStr}"`);
    return { page: p };
  }

  if (parts.length === 2) {
    const page = parseInt(parts[0], 10);
    const line = parseInt(parts[1], 10);
    if (isNaN(page)) throw new Error(`Invalid page in coordinate: "${coordStr}"`);
    return { page, line: isNaN(line) ? undefined : line };
  }

  if (parts.length === 4) {
    const book = isNaN(Number(parts[0])) ? parts[0] : Number(parts[0]);
    const chapter = isNaN(Number(parts[1])) ? parts[1] : Number(parts[1]);
    const page = parseInt(parts[2], 10);
    const line = parseInt(parts[3], 10);
    return { book, chapter, page, line: isNaN(line) ? undefined : line };
  }

  // Fallback for 3 parts: book.chapter.page
  const book = isNaN(Number(parts[0])) ? parts[0] : Number(parts[0]);
  const chapter = isNaN(Number(parts[1])) ? parts[1] : Number(parts[1]);
  const page = parseInt(parts[2], 10);
  return { book, chapter, page };
}

/**
 * Formats a coordinate into a standard string representation.
 */
export function formatCoordinate(coord: BookCoordinate, options: FormatOptions = {}): string {
  const {
    padPage = 3,
    padLine = 2,
    includeBook = false,
    includeChapter = false,
    separator = '.'
  } = options;

  const pageStr = String(coord.page).padStart(padPage, '0');
  const lineStr = coord.line !== undefined ? String(coord.line).padStart(padLine, '0') : undefined;

  let base = lineStr ? `${pageStr}${separator}${lineStr}` : pageStr;

  if (includeBook || includeChapter) {
    const b = coord.book !== undefined ? String(coord.book) : '1';
    const c = coord.chapter !== undefined ? String(coord.chapter) : '1';
    return `${b}${separator}${c}${separator}${base}`;
  }

  return base;
}

/**
 * Comparator for sorting coordinates ascendingly.
 */
export function compareCoordinates(a: BookCoordinate, b: BookCoordinate): number {
  if (a.book !== undefined && b.book !== undefined && a.book !== b.book) {
    return String(a.book).localeCompare(String(b.book), undefined, { numeric: true });
  }
  if (a.chapter !== undefined && b.chapter !== undefined && a.chapter !== b.chapter) {
    return String(a.chapter).localeCompare(String(b.chapter), undefined, { numeric: true });
  }
  if (a.page !== b.page) {
    return a.page - b.page;
  }
  const lineA = a.line ?? 0;
  const lineB = b.line ?? 0;
  return lineA - lineB;
}

/**
 * Checks if a coordinate falls within a closed range [start, end].
 */
export function isCoordinateInRange(
  coord: BookCoordinate,
  start: BookCoordinate,
  end: BookCoordinate
): boolean {
  return compareCoordinates(coord, start) >= 0 && compareCoordinates(coord, end) <= 0;
}
