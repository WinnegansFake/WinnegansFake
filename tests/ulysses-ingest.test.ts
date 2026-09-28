import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AnnotationValidator } from '../packages/validator/src/index.js';

const REPO_ROOT = path.resolve(__dirname, '..');
const ULYSSES_DIR = path.join(REPO_ROOT, 'annotations', 'ulysses');

describe('Ulysses Ingestion & Schema Enrichment', () => {
  const validator = new AnnotationValidator();

  it('should find ingested Ulysses annotation files across parts 1 and 2', () => {
    expect(fs.existsSync(ULYSSES_DIR)).toBe(true);

    const jsonFiles: string[] = [];
    function scan(dir: string) {
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) scan(full);
        else if (ent.name.endsWith('.json')) jsonFiles.push(full);
      }
    }
    scan(ULYSSES_DIR);

    expect(jsonFiles.length).toBeGreaterThanOrEqual(25);
  });

  it('should verify all Ulysses annotations respect Zero-Copyright rules (target_phrase <= 150 chars)', () => {
    const jsonFiles: string[] = [];
    function scan(dir: string) {
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) scan(full);
        else if (ent.name.endsWith('.json')) jsonFiles.push(full);
      }
    }
    scan(ULYSSES_DIR);

    let totalAnnotations = 0;
    for (const file of jsonFiles) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      expect(data.work).toBe('ulysses');
      expect(data.page_number).toBeGreaterThan(0);

      for (const ann of data.annotations || []) {
        totalAnnotations++;
        expect(ann.target_phrase.length).toBeLessThanOrEqual(150);
        expect(ann.target_phrase).not.toContain('\n');
        expect(ann.id).toMatch(/^[0-9]{3,4}\.[0-9]{2}-[a-zA-Z0-9_-]{2,16}$/);
        expect(ann.annotation_text.length).toBeGreaterThan(5);
      }
    }

    expect(totalAnnotations).toBeGreaterThanOrEqual(100);
  });

  it('should verify external_links structure when present', () => {
    const jsonFiles: string[] = [];
    function scan(dir: string) {
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) scan(full);
        else if (ent.name.endsWith('.json')) jsonFiles.push(full);
      }
    }
    scan(ULYSSES_DIR);

    let foundExternalLinks = 0;
    for (const file of jsonFiles) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      for (const ann of data.annotations || []) {
        if (ann.external_links && ann.external_links.length > 0) {
          foundExternalLinks++;
          for (const link of ann.external_links) {
            expect(link.title).toBeDefined();
            expect(link.title.length).toBeGreaterThan(0);
            expect(link.url).toMatch(/^https?:\/\//);
            if (link.source) {
              expect(['joyce-project', 'joyceproject', 'wikisource', 'fweet', 'open-editions', 'other']).toContain(link.source);
            }
          }
        }
      }
    }

    expect(foundExternalLinks).toBeGreaterThan(0);
  });

  it('should validate all Ulysses files against AnnotationValidator', () => {
    const jsonFiles: string[] = [];
    function scan(dir: string) {
      const ents = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of ents) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) scan(full);
        else if (ent.name.endsWith('.json')) jsonFiles.push(full);
      }
    }
    scan(ULYSSES_DIR);

    for (const file of jsonFiles) {
      const issues = validator.validateFile(file);
      const errors = issues.filter((i) => i.severity === 'error');
      expect(errors).toEqual([]);
    }
  });

  it('should verify Telemachus opening page 003 contains key landmark annotations', () => {
    const p3Path = path.join(ULYSSES_DIR, 'part_1', 'episode_01', 'page_003.json');
    expect(fs.existsSync(p3Path)).toBe(true);

    const data = JSON.parse(fs.readFileSync(p3Path, 'utf-8'));
    expect(data.page_number).toBe(3);
    expect(data.episode).toBe(1);
    expect(data.part).toBe(1);

    const phrases = (data.annotations || []).map((a: any) => a.target_phrase.toLowerCase());
    expect(phrases.some((p: string) => p.includes('stately'))).toBe(true);
    expect(phrases.some((p: string) => p.includes('introibo') || p.includes('buck mulligan'))).toBe(true);
  });
});
