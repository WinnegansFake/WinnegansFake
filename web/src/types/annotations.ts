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
