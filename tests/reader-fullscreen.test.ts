import { describe, it, expect } from 'vitest';
import { segmentAnnotatedLine } from '../web/src/lib/lineAnnotator';
import { AnnotationItem } from '../web/src/types/annotations';

describe('Reader Fullscreen & Annotation Hover Popup Integration', () => {
  const shortAnnotation: AnnotationItem = {
    id: '003.01-short',
    line_number: 1,
    target_phrase: 'riverrun',
    annotation_text: 'Short concise gloss on the opening word of Finnegans Wake.',
    categories: ['ricorso', 'vico'],
    contributors: ['joycean-scholar'],
  };

  const longAnnotation: AnnotationItem = {
    id: '003.01-long',
    line_number: 1,
    target_phrase: 'Eve and Adam\'s',
    annotation_text: 'Inversion of Adam and Eve, evoking original sin and human genesis while locating the reader precisely in Dublin: the popular name for the Church of the Immaculate Conception on Merchant\'s Quay near the Liffey. This foundational Dublin landmark establishes the sacred topography of the entire chapter while reversing Genesis causality.',
    categories: ['biblical', 'dublin-landmarks', 'eden', 'inversion'],
    contributors: ['joycean-scholar'],
  };

  it('correctly segments canonical text into annotated hover triggers', () => {
    const text = 'riverrun, past Eve and Adam\'s, from swerve of shore to bend of bay';
    const segments = segmentAnnotatedLine(text, [shortAnnotation, longAnnotation]);

    expect(segments.length).toBe(4);

    // Segment 1: "riverrun"
    expect(segments[0].type).toBe('annotated');
    if (segments[0].type === 'annotated') {
      expect(segments[0].text).toBe('riverrun');
      expect(segments[0].phrase).toBe('riverrun');
      expect(segments[0].annotations[0].id).toBe('003.01-short');
    }

    // Segment 2: text between
    expect(segments[1].type).toBe('text');
    expect(segments[1].text).toBe(', past ');

    // Segment 3: "Eve and Adam's"
    expect(segments[2].type).toBe('annotated');
    if (segments[2].type === 'annotated') {
      expect(segments[2].text).toBe("Eve and Adam's");
      expect(segments[2].annotations[0].id).toBe('003.01-long');
    }

    // Segment 4: trailing text
    expect(segments[3].type).toBe('text');
    expect(segments[3].text).toBe(', from swerve of shore to bend of bay');

    // Reconstruction matches original text exactly
    const reconstructed = segments.map((s) => s.text).join('');
    expect(reconstructed).toBe(text);
  });

  it('determines short annotations for direct full-text popup display (<= 200 chars)', () => {
    const SHORT_THRESHOLD = 200;

    expect(shortAnnotation.annotation_text.length).toBeLessThanOrEqual(SHORT_THRESHOLD);
    expect(longAnnotation.annotation_text.length).toBeGreaterThan(SHORT_THRESHOLD);

    // Short annotation displays completely in popup
    const shortDisplay = shortAnnotation.annotation_text.length <= SHORT_THRESHOLD
      ? shortAnnotation.annotation_text
      : `${shortAnnotation.annotation_text.slice(0, 160).trim()}...`;
    expect(shortDisplay).toBe(shortAnnotation.annotation_text);

    // Long annotation displays excerpt with ellipsis
    const longDisplay = longAnnotation.annotation_text.length <= SHORT_THRESHOLD
      ? longAnnotation.annotation_text
      : `${longAnnotation.annotation_text.slice(0, 160).trim()}...`;
    expect(longDisplay.endsWith('...')).toBe(true);
    expect(longDisplay.length).toBeLessThan(longAnnotation.annotation_text.length);
  });

  it('handles multiple annotations attached to the same phrase without losing metadata', () => {
    const secondShortAnnotation: AnnotationItem = {
      id: '003.01-riverrun-2',
      line_number: 1,
      target_phrase: 'riverrun',
      annotation_text: 'French rêverons (let us dream together) connection.',
      categories: ['french', 'dream'],
      contributors: ['etymologist'],
    };

    const text = 'riverrun, past Eve and Adam\'s';
    const segments = segmentAnnotatedLine(text, [shortAnnotation, secondShortAnnotation]);

    expect(segments[0].type).toBe('annotated');
    if (segments[0].type === 'annotated') {
      expect(segments[0].annotations).toHaveLength(2);
      expect(segments[0].annotations.map((a) => a.id)).toEqual([
        '003.01-short',
        '003.01-riverrun-2',
      ]);
    }
  });
});
