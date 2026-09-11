import fs from 'fs/promises';
import path from 'path';
import { Validator } from 'jsonschema';

// Repo root is one level above web/
export const REPO_ROOT = path.resolve(process.cwd(), '..');
export const ANNOTATIONS_DIR = path.join(REPO_ROOT, 'annotations');
export const DATA_DIR = path.join(REPO_ROOT, 'data');
export const SCHEMA_PATH = path.join(REPO_ROOT, 'schemas', 'page-annotation.schema.json');

export interface AnnotationItem {
  id: string;
  line_number: number;
  target_phrase: string;
  annotation_text: string;
  categories: string[];
  cross_references?: string[];
  sources?: string[];
  contributors: string[];
}

export interface PageAnnotationsData {
  schema_version: string;
  book: number;
  chapter: number;
  page_number: number;
  annotations: AnnotationItem[];
}

export function getBookAndChapter(page: number): { book: number; chapter: number } {
  // Front matter (pages 1 and 2: half-title and blank/frontispiece)
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

export function getAnnotationFilePath(page: number): string {
  const { book, chapter } = getBookAndChapter(page);
  const paddedPage = String(page).padStart(3, '0');
  return path.join(ANNOTATIONS_DIR, `book_${book}`, `chapter_${chapter}`, `page_${paddedPage}.json`);
}

export async function readPageAnnotations(page: number): Promise<PageAnnotationsData> {
  const filePath = getAnnotationFilePath(page);
  const { book, chapter } = getBookAndChapter(page);

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // If file does not exist yet, return empty template
    return {
      schema_version: '1.0.0',
      book,
      chapter,
      page_number: page,
      annotations: [],
    };
  }
}

export async function writePageAnnotations(data: PageAnnotationsData): Promise<{ success: boolean; errors?: string[] }> {
  // Validate against JSON schema
  try {
    const schemaRaw = await fs.readFile(SCHEMA_PATH, 'utf-8');
    const schema = JSON.parse(schemaRaw);
    const validator = new Validator();
    const result = validator.validate(data, schema);

    if (!result.valid) {
      const errMsgs = result.errors.map((e) => `${e.property}: ${e.message}`);
      return { success: false, errors: errMsgs };
    }
  } catch (err: any) {
    return { success: false, errors: [`Schema validation failed: ${err.message}`] };
  }

  // Ensure annotations are sorted by line_number
  data.annotations.sort((a, b) => a.line_number - b.line_number);

  const filePath = getAnnotationFilePath(data.page_number);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

  return { success: true };
}
