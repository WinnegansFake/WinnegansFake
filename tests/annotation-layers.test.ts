import { describe, it, expect } from 'vitest';
import {
  extractPrimaryAuthor,
  getPrimaryRegisterId,
  compareAnnotations,
  getUniqueAuthors,
  getUniqueTags,
  getUniqueContributors,
  groupAndSortAnnotations,
  LayerGroupMode,
  AnnotationSortMode,
} from '../web/src/lib/annotationLayers';
import { AnnotationItem } from '../web/src/types/annotations';

describe('Annotation Layers, Grouping, Author Extraction & Sorting', () => {
  const sampleAnnotations: AnnotationItem[] = [
    {
      id: '003.01-c2dc',
      line_number: 1,
      target_phrase: 'riverrun',
      annotation_text: 'Opening word indicating circularity and eternal return (Vico ricorso).',
      categories: ['ricorso', 'vico', 'topography', 'river-liffey', 'alp'],
      sources: [
        'McHugh, Roland. Annotations to Finnegans Wake (4th ed.). https://jhupbooks.press.jhu.edu/title/annotations-finnegans-wake',
      ],
      contributors: ['joycean-scholar', 'open-wake-editor'],
    },
    {
      id: '003.01-2a45',
      line_number: 1,
      target_phrase: 'Eve and Adam\'s',
      annotation_text: 'Inversion of Adam and Eve, Church of Immaculate Conception on Merchant Quay.',
      categories: ['biblical', 'dublin-landmarks', 'eden', 'inversion'],
      sources: [
        'Tindall, William York. A Reader\'s Guide to Finnegans Wake. https://archive.org/details/readersguidetofi00tind',
      ],
      contributors: ['joycean-scholar'],
    },
    {
      id: '003.02-94ed',
      line_number: 2,
      target_phrase: 'commodius vicus of recirculation',
      annotation_text: 'Multilingual pun fusing Commodus, vicus, and Giambattista Vico.',
      categories: ['vico', 'philosophy', 'etymology', 'latin'],
      sources: [
        'Vico, Giambattista. Scienza Nuova (1725). https://plato.stanford.edu/entries/vico/',
      ],
      contributors: ['joycean-scholar'],
    },
    {
      id: '003.02-6de9',
      line_number: 2,
      target_phrase: 'Howth Castle and Environs',
      annotation_text: 'Acronym HCE, establishing Humphrey Chimpden Earwicker.',
      categories: ['hce', 'leitmotif', 'dublin-landmarks', 'earwicker'],
      sources: [
        'Glasheen, Adaline. Third Census of Finnegans Wake. https://archive.org/details/thirdcensusoffin0000glas',
      ],
      contributors: ['open-wake-editor'],
    },
    {
      id: '003.03-bde3',
      line_number: 3,
      target_phrase: 'Sir Tristram, violer d\'amores',
      annotation_text: 'Evokes Sir Tristram and Wagner\'s opera Tristan und Isolde.',
      categories: ['tristan-and-isolde', 'arthurian', 'music', 'wagner'],
      sources: [
        'Campbell, Joseph and Robinson, Henry Morton. A Skeleton Key to Finnegans Wake. https://archive.org/details/skeletonkeytofin00camp',
      ],
      contributors: ['joycean-scholar'],
    },
  ];

  describe('extractPrimaryAuthor', () => {
    it('accurately normalizes canonical Joycean scholars', () => {
      expect(extractPrimaryAuthor(['McHugh, Roland. Annotations to Finnegans Wake'])).toBe('Roland McHugh');
      expect(extractPrimaryAuthor(['Campbell, Joseph and Robinson, Henry Morton. A Skeleton Key'])).toBe('Campbell & Robinson');
      expect(extractPrimaryAuthor(['Tindall, William York. A Reader\'s Guide'])).toBe('William York Tindall');
      expect(extractPrimaryAuthor(['Bishop, John. Joyce\'s Book of the Dark'])).toBe('John Bishop');
      expect(extractPrimaryAuthor(['Glasheen, Adaline. Third Census'])).toBe('Adaline Glasheen');
      expect(extractPrimaryAuthor(['Vico, Giambattista. Scienza Nuova'])).toBe('Giambattista Vico');
      expect(extractPrimaryAuthor(['Beckett, Samuel, et al. Our Exagmination'])).toBe('Samuel Beckett et al.');
    });

    it('falls back gracefully on empty or unattributed sources', () => {
      expect(extractPrimaryAuthor([])).toBe('Community / Editorial');
      expect(extractPrimaryAuthor(undefined)).toBe('Community / Editorial');
      expect(extractPrimaryAuthor([''])).toBe('Community / Editorial');
    });

    it('parses standard Last, First citation strings', () => {
      expect(extractPrimaryAuthor(['Ellmann, Richard. James Joyce.'])).toBe('Richard Ellmann');
      expect(extractPrimaryAuthor(['Kenner, Hugh. Dublin\'s Joyce.'])).toBe('Hugh Kenner');
    });
  });

  describe('getPrimaryRegisterId', () => {
    it('maps categories to appropriate analytical registers', () => {
      expect(getPrimaryRegisterId(sampleAnnotations[0])).toBe('viconian-cycles');
      expect(getPrimaryRegisterId(sampleAnnotations[1])).toBe('theological-liturgical');
      expect(getPrimaryRegisterId(sampleAnnotations[3])).toBe('sigla-archetypal');
      expect(getPrimaryRegisterId(sampleAnnotations[4])).toBe('arthurian-tristan');
    });
  });

  describe('Metadata Extraction', () => {
    it('collects all unique authors on page', () => {
      const authors = getUniqueAuthors(sampleAnnotations);
      expect(authors).toContain('Roland McHugh');
      expect(authors).toContain('William York Tindall');
      expect(authors).toContain('Giambattista Vico');
      expect(authors).toContain('Adaline Glasheen');
      expect(authors).toContain('Campbell & Robinson');
      expect(authors.length).toBe(5);
    });

    it('collects and tallies arbitrary tags across page', () => {
      const tags = getUniqueTags(sampleAnnotations);
      expect(tags.find((t) => t.tag === 'vico')?.count).toBe(2);
      expect(tags.find((t) => t.tag === 'dublin-landmarks')?.count).toBe(2);
      expect(tags.find((t) => t.tag === 'ricorso')?.count).toBe(1);
    });

    it('collects all contributors', () => {
      const contribs = getUniqueContributors(sampleAnnotations);
      expect(contribs).toEqual(['joycean-scholar', 'open-wake-editor']);
    });
  });

  describe('Sorting Algorithms', () => {
    it('sorts by line-asc and line-desc', () => {
      const asc = [...sampleAnnotations].sort((a, b) => compareAnnotations(a, b, 'line-asc'));
      expect(asc[0].line_number).toBe(1);
      expect(asc[asc.length - 1].line_number).toBe(3);

      const desc = [...sampleAnnotations].sort((a, b) => compareAnnotations(a, b, 'line-desc'));
      expect(desc[0].line_number).toBe(3);
      expect(desc[desc.length - 1].line_number).toBe(1);
    });

    it('sorts by author-asc alphabetically', () => {
      const byAuthor = [...sampleAnnotations].sort((a, b) => compareAnnotations(a, b, 'author-asc'));
      const authors = byAuthor.map((a) => extractPrimaryAuthor(a.sources));
      expect(authors[0]).toBe('Adaline Glasheen');
      expect(authors[1]).toBe('Campbell & Robinson');
      expect(authors[authors.length - 1]).toBe('William York Tindall');
    });

    it('sorts by tag-count (density)', () => {
      const byTagCount = [...sampleAnnotations].sort((a, b) => compareAnnotations(a, b, 'tag-count'));
      expect(byTagCount[0].categories.length).toBe(5);
    });

    it('sorts by phrase-asc alphabetically', () => {
      const byPhrase = [...sampleAnnotations].sort((a, b) => compareAnnotations(a, b, 'phrase-asc'));
      expect(byPhrase[0].target_phrase).toBe('commodius vicus of recirculation');
      expect(byPhrase[1].target_phrase).toBe('Eve and Adam\'s');
      expect(byPhrase[2].target_phrase).toBe('Howth Castle and Environs');
      expect(byPhrase[3].target_phrase).toBe('riverrun');
      expect(byPhrase[4].target_phrase).toBe('Sir Tristram, violer d\'amores');
    });
  });

  describe('groupAndSortAnnotations', () => {
    it('groups annotations into author layers', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'author',
        sortBy: 'line-asc',
      });

      expect(layers.length).toBe(5);
      expect(layers.map((l) => l.name)).toEqual([
        'Adaline Glasheen',
        'Campbell & Robinson',
        'Giambattista Vico',
        'Roland McHugh',
        'William York Tindall',
      ]);
      expect(layers[0].items[0].target_phrase).toBe('Howth Castle and Environs');
    });

    it('groups annotations into analytical register layers', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'register',
        sortBy: 'line-asc',
      });

      expect(layers.length).toBeGreaterThan(0);
      const names = layers.map((l) => l.name);
      expect(names).toContain('Viconian Historical Cycles & Ricorso');
      expect(names).toContain('Theological & Liturgical Parody');
      expect(names).toContain('Sigla & Archetypal Characters');
      expect(names).toContain('Arthurian Romance & Tristan and Isolde');
    });

    it('groups annotations into arbitrary tag layers', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'tag',
        sortBy: 'line-asc',
      });

      expect(layers.length).toBeGreaterThan(0);
      // "vico" and "dublin-landmarks" should be first because count is 2
      expect(layers[0].count).toBe(2);
      expect(layers[1].count).toBe(2);
      expect(['#vico', '#dublin-landmarks']).toContain(layers[0].name);
    });

    it('groups annotations by line number', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'line',
        sortBy: 'line-asc',
      });

      expect(layers.length).toBe(3); // lines 1, 2, 3
      expect(layers[0].name).toBe('Line 01');
      expect(layers[0].items.length).toBe(2);
      expect(layers[1].name).toBe('Line 02');
      expect(layers[1].items.length).toBe(2);
      expect(layers[2].name).toBe('Line 03');
      expect(layers[2].items.length).toBe(1);
    });

    it('filters by selectedAuthor', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'none',
        sortBy: 'line-asc',
        selectedAuthor: 'Roland McHugh',
      });

      expect(layers[0].items.length).toBe(1);
      expect(layers[0].items[0].target_phrase).toBe('riverrun');
    });

    it('filters by arbitrary selectedTag', () => {
      const layers = groupAndSortAnnotations(sampleAnnotations, {
        groupBy: 'none',
        sortBy: 'line-asc',
        selectedTag: 'vico',
      });

      expect(layers[0].items.length).toBe(2);
      expect(layers[0].items.map((i) => i.target_phrase)).toEqual([
        'riverrun',
        'commodius vicus of recirculation',
      ]);
    });
  });
});
