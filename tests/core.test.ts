import { describe, it, expect } from 'vitest';
import {
  parseCoordinate,
  formatCoordinate,
  compareCoordinates,
  isCoordinateInRange,
  RegisterRegistry,
  STANDARD_LITERARY_REGISTERS,
  AnnotationConcordance,
  getPageAnnotationJsonSchema,
  DEFAULT_PAGE_ANNOTATION_SCHEMA,
  PageAnnotations,
} from '../packages/core/src/index.js';

describe('@winnegans/core: Coordinates', () => {
  it('should parse standard page.line coordinates', () => {
    const c1 = parseCoordinate('003.01');
    expect(c1.page).toBe(3);
    expect(c1.line).toBe(1);

    const c2 = parseCoordinate('42.15');
    expect(c2.page).toBe(42);
    expect(c2.line).toBe(15);

    const c3 = parseCoordinate('100');
    expect(c3.page).toBe(100);
    expect(c3.line).toBeUndefined();
  });

  it('should parse 4-part hierarchical coordinates (book.chapter.page.line)', () => {
    const c = parseCoordinate('1.2.003.01');
    expect(c.book).toBe(1);
    expect(c.chapter).toBe(2);
    expect(c.page).toBe(3);
    expect(c.line).toBe(1);
  });

  it('should format coordinates with custom padding and separators', () => {
    const coord = { page: 7, line: 4 };
    expect(formatCoordinate(coord)).toBe('007.04');
    expect(formatCoordinate(coord, { padPage: 1, padLine: 1 })).toBe('7.4');
    expect(formatCoordinate({ book: 2, chapter: 3, page: 45, line: 12 }, { includeBook: true, includeChapter: true })).toBe('2.3.045.12');
  });

  it('should compare coordinates correctly for sorting', () => {
    const c1 = { page: 3, line: 1 };
    const c2 = { page: 3, line: 5 };
    const c3 = { page: 4, line: 1 };

    expect(compareCoordinates(c1, c2)).toBeLessThan(0);
    expect(compareCoordinates(c2, c1)).toBeGreaterThan(0);
    expect(compareCoordinates(c2, c3)).toBeLessThan(0);
    expect(compareCoordinates(c1, { page: 3, line: 1 })).toBe(0);
  });

  it('should test range inclusivity', () => {
    const start = { page: 10, line: 1 };
    const end = { page: 12, line: 20 };

    expect(isCoordinateInRange({ page: 11, line: 5 }, start, end)).toBe(true);
    expect(isCoordinateInRange({ page: 10, line: 1 }, start, end)).toBe(true);
    expect(isCoordinateInRange({ page: 12, line: 20 }, start, end)).toBe(true);
    expect(isCoordinateInRange({ page: 9, line: 30 }, start, end)).toBe(false);
    expect(isCoordinateInRange({ page: 13, line: 1 }, start, end)).toBe(false);
  });
});

describe('@winnegans/core: Registers', () => {
  it('should initialize registry with standard literary registers', () => {
    const registry = new RegisterRegistry(STANDARD_LITERARY_REGISTERS);
    expect(registry.getAll().length).toBeGreaterThanOrEqual(8);
    expect(registry.has('etymology')).toBe(true);
    expect(registry.get('topography')?.category).toBe('Spatial');
  });

  it('should register custom registers for any literary work', () => {
    const registry = new RegisterRegistry();
    registry.register({
      id: 'dantean-contrapasso',
      name: 'Contrapasso Law of Retribution',
      category: 'Theological',
      description: 'Dante Divine Comedy punishment fitting the sin',
      color: 'red',
    });

    expect(registry.has('dantean-contrapasso')).toBe(true);
    expect(registry.getByCategory('Theological').length).toBe(1);
  });
});

describe('@winnegans/core: Concordance Index', () => {
  const samplePage: PageAnnotations = {
    schema_version: '1.0.0',
    book: 1,
    chapter: 1,
    page_number: 3,
    annotations: [
      {
        id: '003.01-01',
        line_number: 1,
        target_phrase: 'riverrun',
        annotation_text: 'The river Liffey flowing into Dublin bay.',
        categories: ['etymology', 'river-liffey'],
        cross_references: ['628.16'],
        sources: ['Roland McHugh'],
        contributors: ['joycean-1'],
      },
      {
        id: '003.01-02',
        line_number: 1,
        target_phrase: "Eve and Adam's",
        annotation_text: "Merchant's Quay church and Adam & Eve.",
        categories: ['topography', 'theological-religious'],
        contributors: ['joycean-2'],
      },
      {
        id: '003.04-01',
        line_number: 4,
        target_phrase: 'Sir Tristram',
        annotation_text: 'Tristan and Isolde allusion from Chapelizod.',
        categories: ['classical-mythology'],
        contributors: ['joycean-1'],
      },
    ],
  };

  it('should index pages and retrieve annotations by line', () => {
    const concordance = new AnnotationConcordance();
    concordance.addPage(samplePage);

    expect(concordance.getAnnotationsForPage(3).length).toBe(3);
    expect(concordance.getAnnotationsForLine(3, 1).length).toBe(2);
    expect(concordance.getAnnotationsForLine(3, 4).length).toBe(1);
    expect(concordance.getAnnotationsForLine(3, 10).length).toBe(0);
  });

  it('should search by lemma, gloss, or category', () => {
    const concordance = new AnnotationConcordance();
    concordance.addPage(samplePage);

    expect(concordance.search('riverrun').length).toBe(1);
    expect(concordance.search('Tristan').length).toBe(1);
    expect(concordance.filterByCategory('etymology').length).toBe(1);
    expect(concordance.filterByCategory('non-existent').length).toBe(0);
  });

  it('should track cross-references and concordance statistics', () => {
    const concordance = new AnnotationConcordance();
    concordance.addPage(samplePage);

    expect(concordance.getCrossReferences('003.01-01')).toEqual(['628.16']);
    expect(concordance.getCrossReferences('003.01-02')).toEqual([]);

    const stats = concordance.getStatistics();
    expect(stats.totalAnnotations).toBe(3);
    expect(stats.annotatedPagesCount).toBe(1);
    expect(stats.contributorCounts['joycean-1']).toBe(2);
    expect(stats.crossReferenceLinksCount).toBe(1);
  });
});

describe('@winnegans/core: Schema Generator', () => {
  it('should generate customizable JSON Schemas', () => {
    const customSchema = getPageAnnotationJsonSchema({
      maxTargetPhraseLength: 80,
      maxLinesPerPage: 35,
    });
    expect(customSchema.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(DEFAULT_PAGE_ANNOTATION_SCHEMA).toBeDefined();
  });
});
