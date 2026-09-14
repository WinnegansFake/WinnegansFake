import { describe, it, expect } from 'vitest';
import path from 'path';
import fs from 'fs';
import { Validator as JsonSchemaValidator } from 'jsonschema';
import {
  getWork,
  getAllWorks,
  registerWork,
  getWorkDivision,
  FINNEGANS_WAKE,
  ULYSSES,
  getPageAnnotationJsonSchema,
  type WorkDefinition,
  getAllDissertations,
  getDissertation,
  getDissertationsForWork,
  registerDissertation,
  DISSERTATION_NIGHT_MIND,
  DISSERTATION_ULYSSES_ANATOMY,
  DISSERTATION_SIGLA_CYBERNETICS,
  type DissertationDefinition,
} from '../packages/core/src/index.js';
import {
  JoyceanPageMapper,
  UlyssesEpisodeMapper,
  getMapperForWork,
} from '../packages/epub-reader/src/index.js';
import { validateFile } from '../validate.js';
import { AnnotationValidator } from '../packages/validator/src/index.js';

describe('Universal Literary Library Catalog (@winnegans/core)', () => {
  it('provides definitions for Finnegans Wake and Ulysses', () => {
    const works = getAllWorks();
    expect(works.length).toBeGreaterThanOrEqual(2);

    const fw = getWork('finnegans-wake');
    expect(fw.title).toBe('Finnegans Wake');
    expect(fw.totalPages).toBe(628);
    expect(fw.isPublicDomain).toBe(false);
    expect(fw.registers.length).toBe(10);

    const ulysses = getWork('ulysses');
    expect(ulysses.title).toBe('Ulysses');
    expect(ulysses.totalPages).toBe(732);
    expect(ulysses.isPublicDomain).toBe(true);
    expect(ulysses.divisions.length).toBe(18);
    expect(ulysses.registers.length).toBe(10);
    expect(ulysses.defaultEpubUrl).toBe('https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub');
    expect(ulysses.archiveId).toBe('ulysses00joyc_1');
    expect(ulysses.epubSha256).toBe('06872aca1d98b412c284c3c8b22afdb09757ec9c702523e3ee75941de5d2010e');
    expect(ulysses.epubFilename).toBe('ulysses00joyc_1.epub');

    expect(fw.defaultEpubUrl).toBe('https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub');
    expect(fw.archiveId).toBe('finneganswake00joycuoft');
    expect(fw.epubSha256).toBe('93f80a2bd54e7c804b7cd0e88553315e3ebdba449a8a08dc83cd3a8c0e00e773');
    expect(fw.epubFilename).toBe('finneganswake00joycuoft.epub');
  });

  it('defaults to Finnegans Wake when work ID is unknown or omitted', () => {
    expect(getWork()).toBe(FINNEGANS_WAKE);
    expect(getWork('unknown-book')).toBe(FINNEGANS_WAKE);
  });

  it('maps page coordinates to work divisions accurately', () => {
    // Finnegans Wake: page 3 is Book 1 Chapter 1
    const fwDiv = getWorkDivision(FINNEGANS_WAKE, 3);
    expect(fwDiv.title).toBe("The Fall & The Giant's Wake");

    // Ulysses: page 1 is Telemachus
    const ulyssesDiv1 = getWorkDivision(ULYSSES, 1);
    expect(ulyssesDiv1.title).toBe('Telemachus');
    expect(ulyssesDiv1.schemaDetails?.homericCorrespondent).toBe('Telemachus, Mentor, Antinous');
    expect(ulyssesDiv1.schemaDetails?.art).toBe('Theology');

    // Ulysses: page 520 is Oxen of the Sun
    const ulyssesDiv14 = getWorkDivision(ULYSSES, 520);
    expect(ulyssesDiv14.title).toBe('Oxen of the Sun');
    expect(ulyssesDiv14.schemaDetails?.organ).toBe('Womb');
    expect(ulyssesDiv14.schemaDetails?.technique).toBe('Embryonic development');
  });

  it('allows dynamic registration of new library works at runtime', () => {
    const dante: WorkDefinition = {
      id: 'divina-commedia',
      title: 'Divina Commedia',
      shortTitle: 'Commedia',
      author: 'Dante Alighieri',
      year: 1320,
      language: 'it',
      description: 'The journey through Inferno, Purgatorio, and Paradiso.',
      isPublicDomain: true,
      copyrightNotice: 'Public Domain',
      totalPages: 100,
      startPage: 1,
      divisionType: 'canto',
      citationFormat: 'Inf. {page}.{line}',
      annotationsPath: 'annotations/divina-commedia',
      coverColor: 'rose',
      divisions: [
        { id: 'inf-1', number: 1, title: 'Nel mezzo del cammin di nostra vita', startPage: 1, endPage: 1 },
      ],
      registers: [
        {
          id: 'allegorical-sense',
          name: 'Fourfold Allegorical Exegesis',
          category: 'Hermeneutic',
          description: 'Literal, allegorical, moral, and anagogical readings.',
          color: 'rose',
        },
      ],
    };

    registerWork(dante);
    const retrieved = getWork('divina-commedia');
    expect(retrieved.title).toBe('Divina Commedia');
    expect(retrieved.author).toBe('Dante Alighieri');
  });
});

describe('Epub Page Mappers (@winnegans/epub-reader)', () => {
  it('resolves correct mapper for work ID', () => {
    expect(getMapperForWork('finnegans-wake')).toBeInstanceOf(JoyceanPageMapper);
    expect(getMapperForWork('ulysses')).toBeInstanceOf(UlyssesEpisodeMapper);
    expect(getMapperForWork('unknown')).toHaveProperty('name', 'sequential-spine');
  });

  it('provides accurate episode info in UlyssesEpisodeMapper', () => {
    const mapper = new UlyssesEpisodeMapper();
    const ep1 = mapper.getEpisodeInfo(1);
    expect(ep1.title).toBe('Telemachus');
    expect(ep1.part).toBe(1);
    expect(ep1.episode).toBe(1);

    const ep18 = mapper.getEpisodeInfo(725);
    expect(ep18.title).toBe('Penelope');
    expect(ep18.part).toBe(3);
    expect(ep18.episode).toBe(18);
  });

  it('maps Archive.org ulysses00joyc_1 page_25.html spine entries to book page 1', async () => {
    const mapper = new UlyssesEpisodeMapper();
    const mockArchive = {
      getSpine: () => [
        'EPUB/notice.html',
        'EPUB/page_1.html',
        'EPUB/page_23.html',
        'EPUB/page_25.html',
        'EPUB/page_26.html',
        'EPUB/page_27.html',
      ],
      getText: async (href: string) => `Content for ${href} - Stately, plump Buck Mulligan`,
    };

    const pageMap = await mapper.mapPages(mockArchive);
    expect(pageMap.get(1)?.href).toBe('EPUB/page_25.html');
    expect(pageMap.get(2)?.href).toBe('EPUB/page_26.html');
    expect(pageMap.get(3)?.href).toBe('EPUB/page_27.html');
  });
});

describe('Multi-Work Annotation Validation & Copyright Guardrails', () => {
  const schemaPath = path.resolve(__dirname, '../schemas/page-annotation.schema.json');
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  const validator = new JsonSchemaValidator();

  it('validates Ulysses seed annotation files with validate.js', () => {
    const ulyssesFiles = [
      path.resolve(__dirname, '../annotations/ulysses/part_1/episode_01/page_001.json'),
      path.resolve(__dirname, '../annotations/ulysses/part_1/episode_01/page_002.json'),
      path.resolve(__dirname, '../annotations/ulysses/part_1/episode_01/page_003.json'),
    ];

    for (const f of ulyssesFiles) {
      expect(fs.existsSync(f)).toBe(true);
      const errors = validateFile(f, validator, schema);
      expect(errors).toEqual([]);
    }
  });

  it('validates Finnegans Wake annotation files with validate.js', () => {
    const fwSample = path.resolve(__dirname, '../annotations/finneganswake/book_1/chapter_1/page_003.json');
    expect(fs.existsSync(fwSample)).toBe(true);
    const errors = validateFile(fwSample, validator, schema);
    expect(errors).toEqual([]);
  });

  it('validates multi-work annotations using AnnotationValidator from @winnegans/validator', () => {
    const annValidator = new AnnotationValidator();
    const ulyssesPage1Path = path.resolve(__dirname, '../annotations/ulysses/part_1/episode_01/page_001.json');
    const issues = annValidator.validateFile(ulyssesPage1Path);
    expect(issues).toEqual([]);
  });

  it('enforces coordinate prefix check on Ulysses annotations', () => {
    const annValidator = new AnnotationValidator();
    const badData = {
      schema_version: '1.0.0',
      work: 'ulysses',
      part: 1,
      episode: 1,
      page_number: 1,
      annotations: [
        {
          id: '999.01-bad', // Wrong page prefix
          line_number: 1,
          target_phrase: 'Test phrase',
          annotation_text: 'Test annotation commentary exceeding ten characters.',
          categories: ['homeric-correspondence'],
          contributors: ['joycean-scholar'],
        },
      ],
    };

    const issues = annValidator.validateData(badData);
    expect(issues.some((i) => i.message.includes('expected coordinate prefix'))).toBe(true);
  });
});

describe('Scholarly Dissertations & Monographs Library (@winnegans/core)', () => {
  it('provides definitions for all registered dissertations', () => {
    const dissertations = getAllDissertations();
    expect(dissertations.length).toBeGreaterThanOrEqual(3);

    const nightMind = getDissertation('the-architecture-of-the-night-mind');
    expect(nightMind.title).toBe('The Architecture of the Night Mind');
    expect(nightMind.author).toContain('MacCool');
    expect(nightMind.year).toBe(2026);
    expect(nightMind.targetWorks).toContain('finnegans-wake');
    expect(nightMind.chapters.length).toBe(5);

    const ulyssesAnatomy = getDissertation('the-anatomy-of-the-city');
    expect(ulyssesAnatomy.title).toContain('The Anatomy of the City');
    expect(ulyssesAnatomy.author).toContain('Dedalus');
    expect(ulyssesAnatomy.targetWorks).toContain('ulysses');
    expect(ulyssesAnatomy.chapters.length).toBe(5);

    const cybernetics = getDissertation('sigla-graph-theory-cybernetics');
    expect(cybernetics.title).toContain('Sigla, Graph Theory, and Cybernetic Joyce');
    expect(cybernetics.author).toContain('Bloom');
    expect(cybernetics.targetWorks).toContain('finnegans-wake');
    expect(cybernetics.targetWorks).toContain('ulysses');
    expect(cybernetics.chapters.length).toBe(4);
  });

  it('defaults to flagship Night Mind dissertation when ID is unknown or omitted', () => {
    expect(getDissertation()).toBe(DISSERTATION_NIGHT_MIND);
    expect(getDissertation('non-existent-thesis')).toBe(DISSERTATION_NIGHT_MIND);
  });

  it('filters dissertations by targeted primary literary work', () => {
    const fwTheses = getDissertationsForWork('finnegans-wake');
    expect(fwTheses.length).toBeGreaterThanOrEqual(2);
    expect(fwTheses.some((d) => d.id === 'the-architecture-of-the-night-mind')).toBe(true);
    expect(fwTheses.some((d) => d.id === 'sigla-graph-theory-cybernetics')).toBe(true);

    const ulyssesTheses = getDissertationsForWork('ulysses');
    expect(ulyssesTheses.length).toBeGreaterThanOrEqual(2);
    expect(ulyssesTheses.some((d) => d.id === 'the-anatomy-of-the-city')).toBe(true);
    expect(ulyssesTheses.some((d) => d.id === 'sigla-graph-theory-cybernetics')).toBe(true);

    const unknownWorkTheses = getDissertationsForWork('non-existent-work');
    expect(unknownWorkTheses).toEqual([]);
  });

  it('allows dynamic registration of new scholarly dissertations at runtime', () => {
    const sampleDissertation: DissertationDefinition = {
      id: 'dante-polysemy-monograph',
      title: 'Fourfold Allegorical Polysemy in the Trecento',
      subtitle: 'From the Epistle to Cangrande to Contemporary Hermeneutics',
      author: 'Dr. Beatrice Portinari',
      degree: 'Ph.D. in Medieval Italian Literature',
      institution: 'Scuola Normale Superiore di Pisa',
      year: 2026,
      field: 'Medieval Philology & Hermeneutics',
      abstract: 'An investigation into Dantean polysemy and allegorical textual stratification.',
      keywords: ['Dante', 'Allegory', 'Hermeneutics'],
      targetWorks: ['divina-commedia'],
      chapters: [
        { number: 1, title: 'The Literal Sense & Historicism' },
        { number: 2, title: 'The Anagogical Ascent' },
      ],
      slug: 'dante-polysemy-monograph',
      filePath: 'dante-polysemy-monograph/dissertation.md',
      coverAccent: 'rose',
    };

    registerDissertation(sampleDissertation);
    const retrieved = getDissertation('dante-polysemy-monograph');
    expect(retrieved.title).toBe('Fourfold Allegorical Polysemy in the Trecento');
    expect(retrieved.author).toBe('Dr. Beatrice Portinari');
    expect(getDissertationsForWork('divina-commedia')).toContain(sampleDissertation);
  });

  it('verifies that physical markdown dissertation files exist on disk', () => {
    const dissertations = [
      DISSERTATION_NIGHT_MIND,
      DISSERTATION_ULYSSES_ANATOMY,
      DISSERTATION_SIGLA_CYBERNETICS,
    ];

    for (const d of dissertations) {
      const fullPath = path.resolve(__dirname, '../dissertations', d.filePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content.length).toBeGreaterThan(1000);
      expect(content).toContain('# ');
      expect(content).toContain('Chapter');
    }
  });
});

describe('Edition Metadata & Cryptographic Integrity (metadata/)', () => {
  it('verifies metadata/editions.json defines verified archive editions', () => {
    const editionsPath = path.resolve(__dirname, '../metadata/editions.json');
    expect(fs.existsSync(editionsPath)).toBe(true);

    const data = JSON.parse(fs.readFileSync(editionsPath, 'utf-8'));
    expect(data.editions.length).toBeGreaterThanOrEqual(2);

    const ulysses = data.editions.find((e: any) => e.id === 'ulysses');
    expect(ulysses).toBeDefined();
    expect(ulysses.archive.downloadUrl).toBe('https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub');
    expect(ulysses.archive.itemId).toBe('ulysses00joyc_1');
    expect(ulysses.hashes.sha256).toBe('06872aca1d98b412c284c3c8b22afdb09757ec9c702523e3ee75941de5d2010e');
    expect(ulysses.pagination.totalPages).toBe(732);

    const fw = data.editions.find((e: any) => e.id === 'finnegans-wake');
    expect(fw).toBeDefined();
    expect(fw.archive.downloadUrl).toBe('https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub');
    expect(fw.archive.itemId).toBe('finneganswake00joycuoft');
    expect(fw.hashes.sha256).toBe('93f80a2bd54e7c804b7cd0e88553315e3ebdba449a8a08dc83cd3a8c0e00e773');
    expect(fw.pagination.totalPages).toBe(628);
  });

  it('verifies metadata/SHA256SUMS.txt contains valid checksums', () => {
    const sumsPath = path.resolve(__dirname, '../metadata/SHA256SUMS.txt');
    expect(fs.existsSync(sumsPath)).toBe(true);
    const content = fs.readFileSync(sumsPath, 'utf-8');
    expect(content).toContain('06872aca1d98b412c284c3c8b22afdb09757ec9c702523e3ee75941de5d2010e  data/ulysses00joyc_1.epub');
    expect(content).toContain('93f80a2bd54e7c804b7cd0e88553315e3ebdba449a8a08dc83cd3a8c0e00e773  data/finneganswake00joycuoft.epub');
  });

  it('verifies metadata/ulysses.json and metadata/finnegans-wake.json exist with valid schemas', () => {
    const ulyssesPath = path.resolve(__dirname, '../metadata/ulysses.json');
    const fwPath = path.resolve(__dirname, '../metadata/finnegans-wake.json');
    expect(fs.existsSync(ulyssesPath)).toBe(true);
    expect(fs.existsSync(fwPath)).toBe(true);

    const uData = JSON.parse(fs.readFileSync(ulyssesPath, 'utf-8'));
    expect(uData.episodes.length).toBe(18);
    expect(uData.pagination.totalPages).toBe(732);

    const fwData = JSON.parse(fs.readFileSync(fwPath, 'utf-8'));
    expect(fwData.books.length).toBe(4);
    expect(fwData.pagination.totalPages).toBe(628);
  });
});


