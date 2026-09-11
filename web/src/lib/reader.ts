import fs from 'fs/promises';
import path from 'path';
import { DATA_DIR, getBookAndChapter } from './annotations';

export interface PageTextResponse {
  page: number;
  book: number;
  chapter: number;
  lines: Array<{ line: number; text: string }>;
  sourceAvailable: boolean;
  message?: string;
}

export async function getLocalPageText(page: number): Promise<PageTextResponse> {
  const { book, chapter } = getBookAndChapter(page);
  const indexPath = path.join(DATA_DIR, 'local_page_index.json');

  try {
    const raw = await fs.readFile(indexPath, 'utf-8');
    const index = JSON.parse(raw);
    const pageData = index[page];

    if (pageData && pageData.lines) {
      return {
        page,
        book,
        chapter,
        lines: pageData.lines,
        sourceAvailable: true,
      };
    }
  } catch {
    // If local_page_index.json is missing or unreadable
  }

  // Fallback if user hasn't downloaded the epub or generated the index yet
  return {
    page,
    book,
    chapter,
    lines: [
      {
        line: 1,
        text: `[Source text for page ${page} is not present in your local 'data/' directory. Run 'make -C data' and 'python3 build_page_index.py' to extract local text from your offline EPUB.]`,
      },
    ],
    sourceAvailable: false,
    message: "Local source text missing. You can still view, create, and edit JSON annotations for this page.",
  };
}
