import { describe, it, expect } from 'vitest';
import path from 'path';
import { AnnotationValidator } from '../packages/validator/src/index.js';

describe('@winnegans/validator: AnnotationValidator', () => {
  const validator = new AnnotationValidator();

  const validPageData = {
    schema_version: '1.0.0',
    book: 1,
    chapter: 1,
    page_number: 3,
    annotations: [
      {
        id: '003.01-01',
        line_number: 1,
        target_phrase: 'riverrun',
        annotation_text: 'The river Liffey flowing through Dublin into the Irish Sea.',
        categories: ['etymology', 'river-liffey'],
        contributors: ['scholar-1'],
      },
      {
        id: '003.02-01',
        line_number: 2,
        target_phrase: 'swerve of shore',
        annotation_text: 'Topography of Dublin Bay along Sandymount strand.',
        categories: ['topography'],
        contributors: ['scholar-2'],
      },
    ],
  };

  it('should pass valid page data with 0 issues', () => {
    const issues = validator.validateData(validPageData);
    expect(issues.length).toBe(0);
  });

  it('should flag target phrases that exceed max length limit (copyright safeguard)', () => {
    const customValidator = new AnnotationValidator({ maxTargetPhraseLength: 50 });
    const invalidData = {
      ...validPageData,
      annotations: [
        {
          id: '003.01-01',
          line_number: 1,
          target_phrase: 'This is a very long text phrase that definitely exceeds fifty characters in total length to simulate text copying.',
          annotation_text: 'Scholarly gloss text that is valid.',
          categories: ['etymology'],
          contributors: ['scholar-1'],
        },
      ],
    };

    const issues = customValidator.validateData(invalidData);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((i) => i.message.includes('exceeds max allowed length'))).toBe(true);
  });

  it('should reject multiline target phrases', () => {
    const invalidData = {
      ...validPageData,
      annotations: [
        {
          id: '003.01-01',
          line_number: 1,
          target_phrase: 'first line\nsecond line',
          annotation_text: 'Scholarly commentary with valid length.',
          categories: ['etymology'],
          contributors: ['scholar-1'],
        },
      ],
    };

    const issues = validator.validateData(invalidData);
    expect(issues.some((i) => i.message.includes('contains newlines'))).toBe(true);
  });

  it('should detect duplicate annotation IDs', () => {
    const invalidData = {
      ...validPageData,
      annotations: [
        {
          id: '003.01-01',
          line_number: 1,
          target_phrase: 'first',
          annotation_text: 'First valid note on line one.',
          categories: ['etymology'],
          contributors: ['scholar-1'],
        },
        {
          id: '003.01-01', // duplicate ID!
          line_number: 1,
          target_phrase: 'second',
          annotation_text: 'Second valid note on line one with duplicate ID.',
          categories: ['etymology'],
          contributors: ['scholar-2'],
        },
      ],
    };

    const issues = validator.validateData(invalidData);
    expect(issues.some((i) => i.message.includes('Duplicate annotation id'))).toBe(true);
  });

  it('should enforce non-decreasing line numbers on a page', () => {
    const invalidData = {
      ...validPageData,
      annotations: [
        {
          id: '003.05-01',
          line_number: 5,
          target_phrase: 'fifth line',
          annotation_text: 'Valid annotation for line five.',
          categories: ['etymology'],
          contributors: ['scholar-1'],
        },
        {
          id: '003.02-01',
          line_number: 2, // out of order!
          target_phrase: 'second line',
          annotation_text: 'Valid annotation for line two.',
          categories: ['etymology'],
          contributors: ['scholar-1'],
        },
      ],
    };

    const issues = validator.validateData(invalidData);
    expect(issues.some((i) => i.message.includes('line order error'))).toBe(true);
  });

  it('should validate actual file on disk (annotations/finneganswake/book_1/chapter_1/page_003.json)', () => {
    const targetFile = path.resolve(__dirname, '..', 'annotations', 'finneganswake', 'book_1', 'chapter_1', 'page_003.json');
    const issues = validator.validateFile(targetFile);
    expect(issues.length).toBe(0);
  });

  it('should detect canonical chapter boundary violations', () => {
    const boundaryViolator = {
      ...validPageData,
      book: 2,
      chapter: 2, // Chapter 2 is pages 260-308
      page_number: 257, // page 257 belongs in Chapter 1 (217-259)!
    };
    const issues = validator.validateData(boundaryViolator);
    expect(issues.some((i) => i.message.includes('outside canonical range'))).toBe(true);
  });
});
