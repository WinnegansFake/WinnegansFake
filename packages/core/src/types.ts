/**
 * types.ts
 * Generic core data structures for coordinate-based literary annotations.
 */

import { BookCoordinate } from './coordinate.js';

export interface Annotation {
  /**
   * Unique identifier for this annotation. Typically prefixed with coordinate (e.g. "003.01-01").
   */
  id: string;

  /**
   * Line number on the page (1-based), or full BookCoordinate object.
   */
  line_number: number;

  /**
   * Anchor phrase or lemma from the text (under strict length limits to prevent copyright infringement).
   */
  target_phrase: string;

  /**
   * Scholarly critical gloss, translation, or analytical commentary.
   */
  annotation_text: string;

  /**
   * Thematic registers or tags (e.g. "viconian-cycles", "etymology", "topography").
   */
  categories: string[];

  /**
   * Cross-reference coordinates to other passages (e.g. ["004.18", "628.16"]).
   */
  cross_references?: string[];

  /**
   * Bibliographic or academic sources cited.
   */
  sources?: string[];

  /**
   * Contributor usernames or academic attribution identifiers.
   */
  contributors: string[];

  /**
   * Optional work identifier for the annotation (e.g. "finnegans-wake", "ulysses").
   */
  work?: string;

  /**
   * Optional custom metadata fields for specialized editions.
   */
  metadata?: Record<string, unknown>;
}

export interface PageAnnotations {
  schema_version: string;
  work?: string;
  book?: number | string;
  chapter?: number | string;
  part?: number | string;
  episode?: number | string;
  page_number: number;
  annotations: Annotation[];
}

export interface BookMetadata {
  title: string;
  author: string;
  year?: number;
  totalPages: number;
  startPage?: number;
  copyrightNotice?: string;
  license?: string;
  divisionName?: 'Book' | 'Canto' | 'Part' | 'Volume' | 'Act';
  subdivisionName?: 'Chapter' | 'Section' | 'Scene' | 'Stanza';
}

export interface AnalyticalRegister {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
  badgeClass?: string;
  icon?: string;
}

/** Alias for Annotation commonly used in UI layers */
export type AnnotationItem = Annotation;

/** Alias for PageAnnotations commonly used in UI layers */
export type PageAnnotationsData = PageAnnotations;

export interface PageLine {
  line: number;
  text: string;
}

export type LineSegment =
  | { type: 'text'; text: string }
  | { type: 'annotated'; text: string; annotations: Annotation[]; phrase: string };

