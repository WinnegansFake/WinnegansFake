import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  utf8ToBase64,
  base64ToUtf8,
  getPageFilePath,
  generateDefaultPrMetadata,
  saveGithubToken,
  getSavedGithubToken,
  clearGithubToken,
  verifyGithubToken,
  UPSTREAM_OWNER,
  UPSTREAM_REPO,
  UPSTREAM_BRANCH,
} from '../web/src/lib/githubService';
import { AnnotationItem } from '../web/src/types/annotations';

describe('GitHub PR Service & Token Management', () => {
  const sampleAnnotation: AnnotationItem = {
    id: '003.01-c2dc',
    line_number: 1,
    target_phrase: 'riverrun',
    annotation_text: 'Opening word indicating circularity and eternal return in Vico ricorso.',
    categories: ['vico', 'ricorso', 'topography'],
    cross_references: ['628.16'],
    sources: [
      'McHugh, Roland. Annotations to Finnegans Wake (4th ed.).',
    ],
    contributors: ['joycean-scholar'],
  };

  it('correctly maps page numbers to canonical repository JSON file paths', () => {
    expect(getPageFilePath(3)).toBe('annotations/book_1/chapter_1/page_003.json');
    expect(getPageFilePath(35)).toBe('annotations/book_1/chapter_2/page_035.json');
    expect(getPageFilePath(104)).toBe('annotations/book_1/chapter_5/page_104.json');
    expect(getPageFilePath(220)).toBe('annotations/book_2/chapter_1/page_220.json');
    expect(getPageFilePath(400)).toBe('annotations/book_3/chapter_1/page_400.json');
    expect(getPageFilePath(600)).toBe('annotations/book_4/chapter_1/page_600.json');
  });

  it('performs lossless UTF-8 Base64 encoding and decoding', () => {
    const original = 'commodius vicus of recirculation — Giambattista Vico & Anna Livia (Δ)';
    const encoded = utf8ToBase64(original);
    const decoded = base64ToUtf8(encoded);
    expect(decoded).toBe(original);
  });

  it('generates compliant PR metadata and markdown body', () => {
    const meta = generateDefaultPrMetadata(3, sampleAnnotation);

    expect(meta.prTitle).toContain('FW 003.01 ("riverrun")');
    expect(meta.branchName).toMatch(/^add-note-003-01-[a-z0-9]+$/);
    expect(meta.commitMessage).toContain('feat(annotation): add gloss for FW 003.01 (003.01-c2dc)');
    expect(meta.prBody).toContain('Creative Commons Attribution-ShareAlike 4.0 International');
    expect(meta.prBody).toContain('003.01-c2dc');
    expect(meta.prBody).toContain('@joycean-scholar');
  });

  it('verifies upstream repository constants', () => {
    expect(UPSTREAM_OWNER).toBe('tekromancy');
    expect(UPSTREAM_REPO).toBe('WinnegansFake');
    expect(UPSTREAM_BRANCH).toBe('main');
  });

  it('rejects empty or whitespace-only tokens in verifyGithubToken', async () => {
    await expect(verifyGithubToken('')).rejects.toThrow('Please enter a GitHub Personal Access Token');
    await expect(verifyGithubToken('   ')).rejects.toThrow('Please enter a GitHub Personal Access Token');
  });
});
