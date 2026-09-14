import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { Validator } from 'jsonschema';

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'schemas', 'page-annotation.schema.json');
const SAMPLE_PAGE_PATH = path.join(REPO_ROOT, 'annotations', 'finneganswake', 'book_1', 'chapter_1', 'page_003.json');

describe('Annotations Schema & Validation', () => {
  it('should validate page_003.json against schemas/page-annotation.schema.json', () => {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
    const data = JSON.parse(fs.readFileSync(SAMPLE_PAGE_PATH, 'utf-8'));

    const validator = new Validator();
    const result = validator.validate(data, schema);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should reject invalid annotation IDs or malformed schemas', () => {
    const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
    const invalidData = {
      schema_version: '1.0.0',
      book: 1,
      chapter: 1,
      page_number: 3,
      annotations: [
        {
          id: 'invalid-id-format',
          line_number: 1,
          target_phrase: 'riverrun',
          annotation_text: 'Short', // under 10 chars should fail
          categories: ['invalid category! with spaces'],
          contributors: [],
        },
      ],
    };

    const validator = new Validator();
    const result = validator.validate(invalidData, schema);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
