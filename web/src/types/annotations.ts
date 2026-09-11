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
  work?: string;
  book?: number | string;
  chapter?: number | string;
  part?: number | string;
  episode?: number | string;
  page_number: number;
  annotations: AnnotationItem[];
}

export interface PageLine {
  line: number;
  text: string;
}

export interface BookChapterInfo {
  book: number;
  chapter: number;
  bookRoman: string;
  title: string;
}
