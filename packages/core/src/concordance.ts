/**
 * concordance.ts
 * In-memory concordance, search index, and cross-reference graph for book annotations.
 */

import { Annotation, PageAnnotations } from './types.js';
import { BookCoordinate, formatCoordinate } from './coordinate.js';

export interface ConcordanceStatistics {
  totalAnnotations: number;
  annotatedPagesCount: number;
  categoryDistribution: Record<string, number>;
  contributorCounts: Record<string, number>;
  crossReferenceLinksCount: number;
}

export class AnnotationConcordance {
  private pages: Map<number, PageAnnotations> = new Map();
  private annotationsById: Map<string, Annotation> = new Map();
  private crossRefGraph: Map<string, Set<string>> = new Map();

  public addPage(pageData: PageAnnotations): void {
    this.pages.set(pageData.page_number, pageData);
    for (const ann of pageData.annotations) {
      this.annotationsById.set(ann.id, ann);

      if (ann.cross_references && ann.cross_references.length > 0) {
        if (!this.crossRefGraph.has(ann.id)) {
          this.crossRefGraph.set(ann.id, new Set());
        }
        for (const ref of ann.cross_references) {
          this.crossRefGraph.get(ann.id)!.add(ref);
        }
      }
    }
  }

  public loadPages(pages: PageAnnotations[]): void {
    for (const p of pages) {
      this.addPage(p);
    }
  }

  public getPage(pageNumber: number): PageAnnotations | undefined {
    return this.pages.get(pageNumber);
  }

  public getAnnotationsForPage(pageNumber: number): Annotation[] {
    return this.pages.get(pageNumber)?.annotations || [];
  }

  public getAnnotationsForLine(pageNumber: number, lineNumber: number): Annotation[] {
    const anns = this.getAnnotationsForPage(pageNumber);
    return anns.filter((a) => a.line_number === lineNumber);
  }

  public getById(id: string): Annotation | undefined {
    return this.annotationsById.get(id);
  }

  public search(query: string): Annotation[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: Annotation[] = [];
    for (const ann of this.annotationsById.values()) {
      if (
        ann.target_phrase.toLowerCase().includes(q) ||
        ann.annotation_text.toLowerCase().includes(q) ||
        ann.id.toLowerCase().includes(q) ||
        ann.categories.some((c) => c.toLowerCase().includes(q))
      ) {
        results.push(ann);
      }
    }
    return results;
  }

  public filterByCategory(category: string): Annotation[] {
    const target = category.trim().toLowerCase();
    const results: Annotation[] = [];
    for (const ann of this.annotationsById.values()) {
      if (ann.categories.some((c) => c.toLowerCase() === target)) {
        results.push(ann);
      }
    }
    return results;
  }

  public getCrossReferences(annotationId: string): string[] {
    const refs = this.crossRefGraph.get(annotationId);
    return refs ? Array.from(refs) : [];
  }

  public getStatistics(): ConcordanceStatistics {
    const categoryDistribution: Record<string, number> = {};
    const contributorCounts: Record<string, number> = {};
    let crossReferenceLinksCount = 0;

    for (const ann of this.annotationsById.values()) {
      for (const cat of ann.categories) {
        categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      }
      for (const author of ann.contributors) {
        contributorCounts[author] = (contributorCounts[author] || 0) + 1;
      }
      if (ann.cross_references) {
        crossReferenceLinksCount += ann.cross_references.length;
      }
    }

    return {
      totalAnnotations: this.annotationsById.size,
      annotatedPagesCount: this.pages.size,
      categoryDistribution,
      contributorCounts,
      crossReferenceLinksCount,
    };
  }
}
