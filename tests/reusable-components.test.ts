import { describe, it, expect } from 'vitest';
import {
  createWork,
  createDissertation,
  getPageFilePath,
  registerWork,
  getWork,
  segmentAnnotatedLine,
  groupAndSortAnnotations,
  STANDARD_LITERARY_REGISTERS,
  generateDefaultPrMetadata,
  type Annotation,
} from '../packages/core/src/index.js';
import {
  RegexPaginationMapper,
  CustomOffsetMapper,
  registerMapper,
  getMapperForWork,
} from '../packages/epub-reader/src/index.js';


describe('Reusable Digital Humanities SDK & Components', () => {
  describe('@winnegans/core: Work & Dissertation Factories', () => {
    it('creates and registers a new canonical work with defaults', () => {
      const dante = createWork({
        id: 'divine-comedy',
        title: 'Divine Comedy (La Divina Commedia)',
        author: 'Dante Alighieri',
        totalPages: 100,
        divisions: [
          { id: 'inf.1', number: 1, title: 'Inferno Canto I', startPage: 1, endPage: 34 },
          { id: 'purg.1', number: 2, title: 'Purgatorio Canto I', startPage: 35, endPage: 67 },
          { id: 'par.1', number: 3, title: 'Paradiso Canto I', startPage: 68, endPage: 100 },
        ],
        citationFormat: 'DC {page}.{line}',
      });

      expect(dante.id).toBe('divine-comedy');
      expect(dante.shortTitle).toBe('DIVI');
      expect(dante.isPublicDomain).toBe(true);
      expect(dante.citationFormat).toBe('DC {page}.{line}');

      registerWork(dante);
      const retrieved = getWork('divine-comedy');
      expect(retrieved.title).toContain('Divine Comedy');
    });

    it('creates and registers a scholarly dissertation with defaults', () => {
      const diss = createDissertation({
        id: 'dantesque-modernism',
        title: 'Dantesque Topographies in 20th Century Modernism',
        author: 'Beatrice Portinari',
        year: 2026,
        abstract: 'An investigation into theological and geometric structures in epic literature.',
        targetWorks: ['divine-comedy', 'ulysses'],
      });

      expect(diss.id).toBe('dantesque-modernism');
      expect(diss.degree).toBe('Doctor of Philosophy (Ph.D.)');
      expect(diss.filePath).toBe('dantesque-modernism/dissertation.md');
      expect(diss.targetWorks).toContain('divine-comedy');
    });

    it('resolves canonical page file paths for FW, Ulysses, and custom works', () => {
      // Finnegans Wake
      expect(getPageFilePath(3)).toBe('annotations/book_1/chapter_1/page_003.json');
      expect(getPageFilePath(220)).toBe('annotations/book_2/chapter_1/page_220.json');

      // Ulysses
      const ulyssesWork = getWork('ulysses');
      const ulyssesPath = getPageFilePath(15, ulyssesWork);
      expect(ulyssesPath).toContain('annotations/ulysses');
      expect(ulyssesPath).toContain('page_015.json');

      // Custom work
      const danteWork = getWork('divine-comedy');
      const dantePath = getPageFilePath(10, danteWork);
      expect(dantePath).toBe('annotations/divine-comedy/chapter_01/page_010.json');
    });
  });

  describe('@winnegans/core: Line Segmentation & Layer Grouping', () => {
    it('segments text lines with longest-match collision resolution', () => {
      const lineText = 'Midway upon the journey of our life I found myself within a dark forest';
      const annotations: Annotation[] = [
        {
          id: '001.01-01',
          line_number: 1,
          target_phrase: 'journey of our life',
          annotation_text: 'Nel mezzo del cammin di nostra vita.',
          categories: ['topography'],
          contributors: ['dante-scholar'],
        },
        {
          id: '001.01-02',
          line_number: 1,
          target_phrase: 'dark forest',
          annotation_text: 'Selva oscura.',
          categories: ['theological-religious'],
          contributors: ['dante-scholar'],
        },
      ];

      const segments = segmentAnnotatedLine(lineText, annotations);
      expect(segments).toHaveLength(4);
      expect(segments[0].type).toBe('text');

      expect(segments[1].type).toBe('annotated');
      if (segments[1].type === 'annotated') {
        expect(segments[1].phrase).toBe('journey of our life');
      }
      expect(segments[3].type).toBe('annotated');
      if (segments[3].type === 'annotated') {
        expect(segments[3].phrase).toBe('dark forest');
      }
    });

    it('groups and sorts annotations by register using standard or custom registers', () => {
      const annotations: Annotation[] = [
        {
          id: '001.01-01',
          line_number: 1,
          target_phrase: 'dark forest',
          annotation_text: 'Spiritual disorientation and sin.',
          categories: ['theological-religious'],
          sources: ['Singleton, Charles. Dante Studies...'],
          contributors: ['scholar-1'],
        },
        {
          id: '001.02-01',
          line_number: 2,
          target_phrase: 'straight way',
          annotation_text: 'Diritta via.',
          categories: ['etymology'],
          sources: ['Grandgent, C.H. Dante Commentary...'],
          contributors: ['scholar-2'],
        },
      ];

      const groups = groupAndSortAnnotations(annotations, {
        groupBy: 'register',
        sortBy: 'line-asc',
        registers: STANDARD_LITERARY_REGISTERS,
      });

      expect(groups.length).toBeGreaterThanOrEqual(2);
      const etymGroup = groups.find((g) => g.id === 'etymology');
      expect(etymGroup).toBeDefined();
      expect(etymGroup?.count).toBe(1);
    });
  });

  describe('@winnegans/epub-reader: Configurable Regex & Offset Mappers', () => {
    it('maps pages using RegexPaginationMapper', async () => {
      const mockArchive = {
        getSpine: () => ['text/canto1.html', 'text/canto2.html', 'text/toc.html'],
        getText: async (href: string) => {
          if (href.includes('canto1')) return '<div class="page" id="p1">Canto One Text with sufficient length for valid page extraction...</div>';
          if (href.includes('canto2')) return '<div class="page" id="p2">Canto Two Text with sufficient length for valid page extraction...</div>';
          return 'Table of contents';
        },
      };

      const mapper = new RegexPaginationMapper({
        pagePattern: /id="p(\d+)"/,
        minTextLength: 30,
      });

      const pageMap = await mapper.mapPages(mockArchive);
      expect(pageMap.size).toBe(2);
      expect(pageMap.get(1)?.href).toBe('text/canto1.html');
      expect(pageMap.get(2)?.href).toBe('text/canto2.html');
    });

    it('maps pages using CustomOffsetMapper', async () => {
      const mockArchive = {
        getSpine: () => ['cover.html', 'title.html', 'intro.html', 'chap1.html', 'chap2.html'],
        getText: async (href: string) => `Content for ${href} with sufficient character length to pass minTextLength filter.`,
      };

      const offsetMapper = new CustomOffsetMapper({
        startSpineIndex: 3, // start at chap1.html
        startPage: 1,
        minTextLength: 20,
      });

      const pageMap = await offsetMapper.mapPages(mockArchive);
      expect(pageMap.size).toBe(2);
      expect(pageMap.get(1)?.href).toBe('chap1.html');
      expect(pageMap.get(2)?.href).toBe('chap2.html');
    });

    it('allows dynamic mapper registration per work', () => {
      const customMapper = new CustomOffsetMapper({ startSpineIndex: 0 });
      registerMapper('divine-comedy', customMapper);

      const retrieved = getMapperForWork('divine-comedy');
      expect(retrieved.name).toBe('custom-offset');
    });
  });

  describe('Zero-Backend GitHub PR Workflow', () => {
    it('generates customized PR metadata for any arbitrary work', () => {
      const danteWork = getWork('divine-comedy');
      const sampleAnn: Annotation = {
        id: '001.01-01',
        line_number: 1,
        target_phrase: 'Nel mezzo del cammin',
        annotation_text: 'Famous opening tercet in dactylic and hendecasyllabic meter.',
        categories: ['etymology'],
        contributors: ['dante-scholar'],
      };

      const meta = generateDefaultPrMetadata(1, sampleAnn, danteWork);
      expect(meta.prTitle).toContain('DIVI 001.01 ("Nel mezzo del cammin")');
      expect(meta.branchName).toMatch(/^add-note-divi-001-01-[a-z0-9]+$/);
      expect(meta.commitMessage).toContain('feat(annotation): add gloss for DIVI 001.01');
    });

    it('encodes and decodes UTF-8 strings accurately across environments', async () => {
      const { utf8ToBase64, base64ToUtf8, getBookAndChapterInfo } = await import('../packages/core/src/index.js');
      const original = 'HCE & ALP: ∐ and Δ under the Elm (Shem) & Stone (Shaun)';
      const encoded = utf8ToBase64(original);
      const decoded = base64ToUtf8(encoded);
      expect(decoded).toBe(original);

      // Verify getBookAndChapterInfo for FW, Ulysses, and custom work
      const fwInfo = getBookAndChapterInfo(3, 'finnegans-wake');
      expect(fwInfo.book).toBe(1);
      expect(fwInfo.chapter).toBe(1);
      expect(fwInfo.bookRoman).toBe('I');

      const ulyssesInfo = getBookAndChapterInfo(15, 'ulysses');
      expect(ulyssesInfo.book).toBe(1);
      expect(ulyssesInfo.chapter).toBe(1);
      expect(ulyssesInfo.chapterTitle).toContain('Telemachus');

      const danteInfo = getBookAndChapterInfo(10, 'divine-comedy');
      expect(danteInfo.chapterTitle).toContain('Inferno Canto I');
    });
  });

  describe('@winnegans/react: UI Components & Context Suite', () => {
    it('exports all universal components, contexts, and browser services', async () => {
      const reactPkg = await import('../packages/react/src/index.js');

      // Readers & Monograph Viewers
      expect(reactPkg.UniversalReader).toBeDefined();
      expect(reactPkg.WakeReader).toBeDefined();
      expect(reactPkg.DissertationViewer).toBeDefined();

      // Interactive Modals
      expect(reactPkg.EpubSourceModal).toBeDefined();
      expect(reactPkg.BookmarksModal).toBeDefined();
      expect(reactPkg.SearchModal).toBeDefined();
      expect(reactPkg.GithubPrModal).toBeDefined();
      expect(reactPkg.CookieConsentModal).toBeDefined();

      // Editor & Annotations
      expect(reactPkg.InlineEditor).toBeDefined();
      expect(reactPkg.AnnotationHoverPopup).toBeDefined();

      // Theme & Navigation
      expect(reactPkg.ThemeSwitcher).toBeDefined();
      expect(reactPkg.Navigation).toBeDefined();
      expect(reactPkg.Footer).toBeDefined();

      // Contexts & Hooks
      expect(reactPkg.ThemeProvider).toBeDefined();
      expect(reactPkg.useTheme).toBeDefined();
      expect(reactPkg.BookmarkProvider).toBeDefined();
      expect(reactPkg.useBookmarks).toBeDefined();
      expect(reactPkg.SearchProvider).toBeDefined();
      expect(reactPkg.useSearch).toBeDefined();

      // Browser EPUB Service
      expect(reactPkg.browserEpub).toBeDefined();
      expect(typeof reactPkg.browserEpub.isLoaded).toBe('function');
      expect(typeof reactPkg.browserEpub.searchText).toBe('function');
    });
  });

  describe('create-winnegans-app CLI Scaffolder', () => {
    it('scaffolds a valid zero-copyright literary project directory', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const { execSync } = await import('child_process');
      const { AnnotationValidator } = await import('../packages/validator/src/index.js');

      const testDir = path.resolve('tests/fixtures/test-scaffold-output');
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }

      // Execute scaffolder
      execSync(`node ./packages/create-winnegans-app/bin/index.js ${testDir} --work-id homer-odyssey --title "The Odyssey" --author "Homer" --division-type book --pages 24`);

      // Verify files created
      expect(fs.existsSync(path.join(testDir, 'package.json'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, '.gitignore'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'AGENTS.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'validate.js'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'metadata/homer-odyssey.json'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'annotations/homer-odyssey/book_01/page_001.json'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'dissertations/introductory-monograph/dissertation.md'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'README.md'))).toBe(true);

      // Verify .gitignore safeguards data/
      const gitignore = fs.readFileSync(path.join(testDir, '.gitignore'), 'utf-8');
      expect(gitignore).toContain('data/*.epub');

      // Verify generated annotation passes AnnotationValidator
      const validator = new AnnotationValidator({
        maxTargetPhraseLength: 150,
      });
      const issuesMap = validator.validateDirectory(path.join(testDir, 'annotations'));
      expect(issuesMap.size).toBe(0);

      const sampleFile = path.join(testDir, 'annotations/homer-odyssey/book_01/page_001.json');
      const fileIssues = validator.validateFile(sampleFile);
      expect(fileIssues).toEqual([]);

      // Clean up test directory
      fs.rmSync(testDir, { recursive: true, force: true });
    });
  });
});

