import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { validateFile } from '../validate.js';
import { Validator } from 'jsonschema';

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(REPO_ROOT, 'schemas', 'page-annotation.schema.json');
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf-8'));
const validator = new Validator();

describe('validate.js CLI & module checks', () => {
  it('should validate all annotation files without error via node validate.js', () => {
    const output = execSync('node validate.js', {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    expect(output).toContain('Validating 630 annotation file(s)...');
    expect(output).toContain('passed validation successfully!');
  });

  it('should validate a single file via node validate.js --path', () => {
    const output = execSync('node validate.js --path annotations/book_1/chapter_1/page_003.json', {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    expect(output).toContain('Validating 1 annotation file(s)...');
    expect(output).toContain('passed validation successfully!');
  });

  it('should return errors for invalid directory conventions or book mismatches', () => {
    const dummyPath = path.join(REPO_ROOT, 'annotations', 'book_1', 'chapter_1', 'page_999.json');
    const errors = validateFile(dummyPath, validator, schema);
    expect(errors.length).toBeGreaterThan(0);
  });
});
