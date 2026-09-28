import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  NEUROMANCER,
  NEUROMANCER_REGISTERS,
  NEUROMANCER_EPUB_URL,
  getWork,
  getBookAndChapterInfo,
  getPageFilePath,
} from '../packages/core/src/index.js';
import { AnnotationValidator } from '../packages/validator/src/index.js';
import { NeuromancerPageMapper, getMapperForWork } from '../packages/epub-reader/src/index.js';

const REPO_ROOT = path.resolve(__dirname, '..');
const NEUROMANCER_DIR = path.join(REPO_ROOT, 'annotations', 'neuromancer');

describe('Neuromancer (1984) Integration & Zero-Copyright Architecture', () => {
  const validator = new AnnotationValidator();

  describe('Core Work & Register Catalog', () => {
    it('should define Neuromancer correctly in @winnegans/core', () => {
      expect(NEUROMANCER.id).toBe('neuromancer');
      expect(NEUROMANCER.title).toBe('Neuromancer');
      expect(NEUROMANCER.author).toBe('William Gibson');
      expect(NEUROMANCER.year).toBe(1984);
      expect(NEUROMANCER.totalPages).toBe(290);
      expect(NEUROMANCER.startPage).toBe(3);
      expect(NEUROMANCER.divisions.length).toBe(24);
      expect(NEUROMANCER.citationFormat).toBe('NM {page}.{line}');
      expect(NEUROMANCER.isPublicDomain).toBe(false);
      expect(NEUROMANCER.defaultEpubUrl).toBe('https://bdebooks.com/en/books/neuromancer-by-william-gibson/');
      expect(NEUROMANCER_EPUB_URL).toBe('https://bdebooks.com/en/books/neuromancer-by-william-gibson/');
      expect(NEUROMANCER.epubFilename).toBe('neuromancer.epub');
    });

    it('should retrieve Neuromancer via getWork() with aliases', () => {
      expect(getWork('neuromancer').id).toBe('neuromancer');
      expect(getWork('nm').id).toBe('neuromancer');
      expect(getWork('NEUROMANCER').id).toBe('neuromancer');
    });

    it('should have 7 distinct cyberpunk analytical registers', () => {
      expect(NEUROMANCER_REGISTERS.length).toBe(7);
      const ids = NEUROMANCER_REGISTERS.map((r) => r.id);
      expect(ids).toContain('cyberspace-matrix');
      expect(ids).toContain('sprawl-cyberpunk-slang');
      expect(ids).toContain('body-modification-cybernetics');
      expect(ids).toContain('corporate-zaibatsu-power');
      expect(ids).toContain('ai-consciousness-pantheon');
      expect(ids).toContain('hardboiled-noir-intertext');
      expect(ids).toContain('chiba-sprawl-geography');
    });

    it('should resolve correct chapter and part info across the 4 parts', () => {
      // Part 1: Chiba City Blues (Ch 1)
      const p3Info = getBookAndChapterInfo(3, 'neuromancer');
      expect(p3Info.book).toBe(1);
      expect(p3Info.chapter).toBe(1);
      expect(p3Info.bookRoman).toBe('I');
      expect(p3Info.chapterTitle).toContain('Dead Channel');

      // Part 2: The Shopping Expedition (Ch 3)
      const p46Info = getBookAndChapterInfo(46, 'neuromancer');
      expect(p46Info.book).toBe(2);
      expect(p46Info.chapter).toBe(3);
      expect(p46Info.bookRoman).toBe('II');

      // Part 3: Midnight in the Rue Jules Verne (Ch 8)
      const p108Info = getBookAndChapterInfo(108, 'neuromancer');
      expect(p108Info.book).toBe(3);
      expect(p108Info.chapter).toBe(8);
      expect(p108Info.bookRoman).toBe('III');

      // Part 4: The Straylight Run (Ch 13)
      const p171Info = getBookAndChapterInfo(171, 'neuromancer');
      expect(p171Info.book).toBe(4);
      expect(p171Info.chapter).toBe(13);
      expect(p171Info.bookRoman).toBe('IV');
    });

    it('should compute canonical filesystem annotation paths', () => {
      expect(getPageFilePath(3, NEUROMANCER)).toBe('annotations/neuromancer/part_01/chapter_01/page_003.json');
      expect(getPageFilePath(50, NEUROMANCER)).toBe('annotations/neuromancer/part_02/chapter_03/page_050.json');
    });
  });

  describe('Annotations & Zero-Copyright Guardrails', () => {
    it('should validate all Neuromancer annotation files against schema', () => {
      expect(fs.existsSync(NEUROMANCER_DIR)).toBe(true);

      const jsonFiles: string[] = [];
      function scan(dir: string) {
        const ents = fs.readdirSync(dir, { withFileTypes: true });
        for (const ent of ents) {
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) scan(full);
          else if (ent.name.endsWith('.json')) jsonFiles.push(full);
        }
      }
      scan(NEUROMANCER_DIR);

      expect(jsonFiles.length).toBeGreaterThanOrEqual(35);

      for (const file of jsonFiles) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const issues = validator.validateData(data, file);
        expect(issues).toHaveLength(0);
      }
    });

    it('should strictly uphold Zero-Copyright limits (target_phrase <= 150 chars, no newlines)', () => {
      const jsonFiles: string[] = [];
      function scan(dir: string) {
        const ents = fs.readdirSync(dir, { withFileTypes: true });
        for (const ent of ents) {
          const full = path.join(dir, ent.name);
          if (ent.isDirectory()) scan(full);
          else if (ent.name.endsWith('.json')) jsonFiles.push(full);
        }
      }
      scan(NEUROMANCER_DIR);

      let totalAnnotations = 0;
      const partsFound = new Set<number>();
      const chaptersFound = new Set<number>();

      for (const file of jsonFiles) {
        const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
        expect(data.work).toBe('neuromancer');
        expect(data.page_number).toBeGreaterThanOrEqual(3);
        if (data.part) partsFound.add(Number(data.part));
        if (data.chapter) chaptersFound.add(Number(data.chapter));

        for (const ann of data.annotations) {
          totalAnnotations++;
          expect(ann.target_phrase.length).toBeLessThanOrEqual(150);
          expect(ann.target_phrase).not.toContain('\n');
          expect(ann.id).toMatch(/^[0-9]{3}\.[0-9]{2}-[a-zA-Z0-9_-]{2,16}$/);
          expect(ann.annotation_text.length).toBeGreaterThan(15);
        }
      }

      expect(totalAnnotations).toBeGreaterThanOrEqual(90);
      expect(partsFound.has(1)).toBe(true);
      expect(partsFound.has(2)).toBe(true);
      expect(partsFound.has(3)).toBe(true);
      expect(partsFound.has(4)).toBe(true);
      expect(chaptersFound.size).toBeGreaterThanOrEqual(20);
    });

    it('should provide the interactive Matrix Dossier explorer route', () => {
      const schemaPage = path.join(REPO_ROOT, 'web', 'src', 'app', 'schemas', 'neuromancer', 'page.tsx');
      expect(fs.existsSync(schemaPage)).toBe(true);
      const code = fs.readFileSync(schemaPage, 'utf-8');
      expect(code).toContain('NeuromancerSchemaPage');
      expect(code).toContain('Tessier-Ashpool');
      expect(code).toContain('Wintermute');
    });
  });

  describe('EPUB Reader Page Mapping', () => {
    it('should return NeuromancerPageMapper from getMapperForWork', () => {
      const mapper = new NeuromancerPageMapper();
      expect(mapper.name).toBe('neuromancer-anchor');
      expect(getMapperForWork('neuromancer')).toBeInstanceOf(NeuromancerPageMapper);
      expect(getMapperForWork('nm')).toBeInstanceOf(NeuromancerPageMapper);
    });

    it('should split HTML text across <a id="p(\\d+)"> anchors into canonical pages', async () => {
      const mapper = new NeuromancerPageMapper();
      const mockArchive = {
        getSpine: () => ['OEBPS/text/index_split_000.html'],
        getText: async (href: string) => `
          <div>
            <a id="p3"></a>
            <p>The sky above the port was the color of television, tuned to a dead channel.</p>
            <a id="p4"></a>
            <p>The black clinics of Chiba were the cutting edge.</p>
            <a id="p5"></a>
            <p>A year here and he still dreamed of cyberspace.</p>
          </div>
        `,
      };

      const pages = await mapper.mapPages(mockArchive);
      expect(pages.has(3)).toBe(true);
      expect(pages.has(4)).toBe(true);
      expect(pages.has(5)).toBe(true);

      const p3 = pages.get(3)!;
      expect(p3.href).toBe('OEBPS/text/index_split_000.html');
      expect(p3.text).toContain('color of television');

      const p4 = pages.get(4)!;
      expect(p4.text).toContain('black clinics');
    });
  });
});
