/**
 * validator.ts
 * Book-agnostic linter and schema validation engine for literary annotation files.
 */

import fs from 'fs';
import path from 'path';
import { Validator as JsonSchemaValidator } from 'jsonschema';
import { getPageAnnotationJsonSchema } from '@winnegans/core';

export interface ValidationIssue {
  filePath?: string;
  id?: string;
  property?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidatorOptions {
  /**
   * Custom JSON Schema. Defaults to @winnegans/core standard schema.
   */
  schema?: Record<string, unknown>;

  /**
   * Maximum characters permitted in target_phrase to prevent copyright infringement.
   * Default: 150.
   */
  maxTargetPhraseLength?: number;

  /**
   * Minimum characters required for annotation gloss text.
   * Default: 10.
   */
  minAnnotationTextLength?: number;

  /**
   * Maximum allowed line number on a page.
   * Default: 50.
   */
  maxLinesPerPage?: number;

  /**
   * Forbid multiline strings in target phrases.
   * Default: true.
   */
  forbidNewlinesInPhrase?: boolean;

  /**
   * Require annotations to appear in non-decreasing line order.
   * Default: true.
   */
  requireNonDecreasingLines?: boolean;

  /**
   * Validate that annotation IDs start with standard page/line coordinate prefix (e.g. PPP.LL).
   * Default: true.
   */
  requireCoordinatePrefix?: boolean;

  /**
   * Optional custom function to validate directory and filename paths.
   */
  validatePath?: (filePath: string, parsedData: any) => string[];
}

export class AnnotationValidator {
  private options: Required<Omit<ValidatorOptions, 'schema' | 'validatePath'>> & {
    schema: Record<string, unknown>;
    validatePath?: (filePath: string, parsedData: any) => string[];
  };
  private jsonValidator: JsonSchemaValidator;

  constructor(options: ValidatorOptions = {}) {
    const maxTargetPhraseLength = options.maxTargetPhraseLength ?? 150;
    const minAnnotationTextLength = options.minAnnotationTextLength ?? 10;
    const maxLinesPerPage = options.maxLinesPerPage ?? 50;

    const schema = options.schema ?? getPageAnnotationJsonSchema({
      maxTargetPhraseLength,
      minAnnotationTextLength,
      maxLinesPerPage,
    });

    this.options = {
      schema,
      maxTargetPhraseLength,
      minAnnotationTextLength,
      maxLinesPerPage,
      forbidNewlinesInPhrase: options.forbidNewlinesInPhrase ?? true,
      requireNonDecreasingLines: options.requireNonDecreasingLines ?? true,
      requireCoordinatePrefix: options.requireCoordinatePrefix ?? true,
      validatePath: options.validatePath,
    };

    this.jsonValidator = new JsonSchemaValidator();
  }

  /**
   * Validates parsed JSON page data against schema and linguistic/copyright rules.
   */
  public validateData(data: any, filePath?: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. JSON Schema validation
    const schemaResult = this.jsonValidator.validate(data, this.options.schema);
    if (!schemaResult.valid) {
      for (const err of schemaResult.errors) {
        issues.push({
          filePath,
          property: err.property || 'root',
          message: `Schema violation: ${err.message}`,
          severity: 'error',
        });
      }
      if (!Array.isArray(data?.annotations)) {
        return issues;
      }
    }

    // 2. Custom path coherence validation if handler provided
    if (filePath && this.options.validatePath) {
      const pathErrs = this.options.validatePath(filePath, data);
      for (const msg of pathErrs) {
        issues.push({ filePath, message: msg, severity: 'error' });
      }
    }

    // 3. Semantic & copyright checks on annotations array
    const annotations = Array.isArray(data.annotations) ? data.annotations : [];
    const seenIds = new Set<string>();
    let prevLine = 0;

    for (let idx = 0; idx < annotations.length; idx++) {
      const ann = annotations[idx];
      const annId = ann.id || `index_${idx}`;
      const lineNum = typeof ann.line_number === 'number' ? ann.line_number : 0;
      const target = ann.target_phrase || '';

      // ID uniqueness
      if (seenIds.has(annId)) {
        issues.push({
          filePath,
          id: annId,
          message: `Duplicate annotation id '${annId}' at index ${idx}.`,
          severity: 'error',
        });
      }
      seenIds.add(annId);

      // Coordinate prefix check
      if (this.options.requireCoordinatePrefix && typeof data.page_number === 'number') {
        const expectedPrefix = `${String(data.page_number).padStart(3, '0')}.${String(lineNum).padStart(2, '0')}`;
        if (!annId.startsWith(expectedPrefix)) {
          issues.push({
            filePath,
            id: annId,
            message: `Annotation id '${annId}' does not start with expected coordinate prefix '${expectedPrefix}'.`,
            severity: 'error',
          });
        }
      }

      // Line ordering
      if (this.options.requireNonDecreasingLines && lineNum < prevLine) {
        issues.push({
          filePath,
          id: annId,
          message: `Annotation line order error: found line ${lineNum} after line ${prevLine}. Annotations must be sorted by line_number.`,
          severity: 'error',
        });
      }
      prevLine = lineNum;

      // Copyright safeguard: target phrase length
      if (target.length > this.options.maxTargetPhraseLength) {
        issues.push({
          filePath,
          id: annId,
          message: `Target phrase exceeds max allowed length of ${this.options.maxTargetPhraseLength} characters (${target.length} chars). Do not include full copyrighted sentences.`,
          severity: 'error',
        });
      }

      // Multiline check
      if (this.options.forbidNewlinesInPhrase && (target.includes('\n') || target.includes('\r'))) {
        issues.push({
          filePath,
          id: annId,
          message: `Target phrase for '${annId}' contains newlines. Anchor phrases must be single-line tokens.`,
          severity: 'error',
        });
      }
    }

    return issues;
  }

  /**
   * Validates a single annotation JSON file from disk.
   */
  public validateFile(filePath: string): ValidationIssue[] {
    let data: any;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(content);
    } catch (err: any) {
      return [{
        filePath,
        message: `Malformed JSON: ${err.message}`,
        severity: 'error',
      }];
    }

    return this.validateData(data, filePath);
  }

  /**
   * Validates an entire directory of annotation files recursively.
   */
  public validateDirectory(dirPath: string): Map<string, ValidationIssue[]> {
    const results = new Map<string, ValidationIssue[]>();
    const files = this.collectJsonFiles(dirPath);

    for (const file of files) {
      const issues = this.validateFile(file);
      if (issues.length > 0) {
        results.set(file, issues);
      }
    }

    return results;
  }

  /**
   * Recursively finds all .json files in a directory.
   */
  public collectJsonFiles(dirPath: string): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dirPath)) return files;

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dirPath, ent.name);
      if (ent.isDirectory()) {
        files.push(...this.collectJsonFiles(full));
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        files.push(full);
      }
    }

    return files.sort();
  }
}
