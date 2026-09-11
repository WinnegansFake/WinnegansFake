import { describe, it, expect } from 'vitest';
import { segmentAnnotatedLine } from '../web/src/lib/lineAnnotator';
import { AnnotationItem } from '../web/src/types/annotations';

describe('segmentAnnotatedLine', () => {
  it('should return a single text segment when no annotations are provided', () => {
    const text = 'riverrun, past Eve and Adam’s';
    const segments = segmentAnnotatedLine(text, []);
    expect(segments).toEqual([{ type: 'text', text }]);
  });

  it('should match and segment multiple annotated phrases in a line', () => {
    const text = 'riverrun, past Eve and Adam\'s, from swerve of shore to bend of bay';
    const annotations: AnnotationItem[] = [
      {
        id: 'ann-1',
        line_number: 1,
        target_phrase: 'riverrun',
        annotation_text: 'Opening word of Finnegans Wake.',
        categories: ['ricorso'],
        contributors: ['joycean'],
      },
      {
        id: 'ann-2',
        line_number: 1,
        target_phrase: 'Eve and Adam\'s',
        annotation_text: 'Inversion of Adam and Eve.',
        categories: ['biblical'],
        contributors: ['joycean'],
      },
    ];

    const segments = segmentAnnotatedLine(text, annotations);
    expect(segments).toHaveLength(4);

    expect(segments[0]).toEqual({
      type: 'annotated',
      text: 'riverrun',
      phrase: 'riverrun',
      annotations: [annotations[0]],
    });

    expect(segments[1]).toEqual({
      type: 'text',
      text: ', past ',
    });

    expect(segments[2]).toEqual({
      type: 'annotated',
      text: "Eve and Adam's",
      phrase: "Eve and Adam's",
      annotations: [annotations[1]],
    });

    expect(segments[3]).toEqual({
      type: 'text',
      text: ', from swerve of shore to bend of bay',
    });
  });

  it('should group multiple annotations for the same target phrase together', () => {
    const text = 'riverrun past Eve';
    const annotations: AnnotationItem[] = [
      {
        id: 'ann-1',
        line_number: 1,
        target_phrase: 'riverrun',
        annotation_text: 'First gloss on riverrun.',
        categories: ['ricorso'],
        contributors: ['scholar-a'],
      },
      {
        id: 'ann-2',
        line_number: 1,
        target_phrase: 'riverrun',
        annotation_text: 'Second gloss on riverrun.',
        categories: ['etymology'],
        contributors: ['scholar-b'],
      },
    ];

    const segments = segmentAnnotatedLine(text, annotations);
    expect(segments).toHaveLength(2);
    expect(segments[0].type).toBe('annotated');
    if (segments[0].type === 'annotated') {
      expect(segments[0].annotations).toHaveLength(2);
      expect(segments[0].annotations[0].id).toBe('ann-1');
      expect(segments[0].annotations[1].id).toBe('ann-2');
    }
  });

  it('should prefer longer phrases over shorter substrings when both match', () => {
    const text = 'Howth Castle and Environs';
    const annotations: AnnotationItem[] = [
      {
        id: 'ann-1',
        line_number: 1,
        target_phrase: 'Castle',
        annotation_text: 'Short phrase',
        categories: ['geo'],
        contributors: ['scholar'],
      },
      {
        id: 'ann-2',
        line_number: 1,
        target_phrase: 'Howth Castle and Environs',
        annotation_text: 'Long phrase acronym for HCE',
        categories: ['hce'],
        contributors: ['scholar'],
      },
    ];

    const segments = segmentAnnotatedLine(text, annotations);
    expect(segments).toHaveLength(1);
    expect(segments[0].type).toBe('annotated');
    if (segments[0].type === 'annotated') {
      expect(segments[0].text).toBe('Howth Castle and Environs');
      expect(segments[0].annotations[0].id).toBe('ann-2');
    }
  });
});
