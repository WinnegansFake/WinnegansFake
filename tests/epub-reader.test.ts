import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import fs from 'fs';
import { EpubArchive } from '../packages/epub-reader/src/index';

const REPO_ROOT = path.resolve(__dirname, '..');
const EPUB_PATH = path.join(REPO_ROOT, 'data', 'finneganswake00joycuoft.epub');

describe('@winnegans/epub-reader Core Engine', () => {
  let archive: EpubArchive;

  beforeAll(async () => {
    if (!fs.existsSync(EPUB_PATH)) {
      throw new Error(`Test prerequisite missing: ${EPUB_PATH}. Run 'make -C data'.`);
    }
    archive = await EpubArchive.open(EPUB_PATH);
  });

  it('should initialize and load EPUB spine', () => {
    const spine = archive.getSpine();
    expect(spine.length).toBeGreaterThan(500);
    expect(spine.some((s) => s.includes('page_17.html'))).toBe(true);
  });

  it('should retrieve page 3 ("riverrun") accurately', async () => {
    const page3 = await archive.getPage(3);
    expect(page3.pageNumber).toBe(3);
    expect(page3.book).toBe(1);
    expect(page3.chapter).toBe(1);
    expect(page3.sourceFile).toContain('page_17.html');
    expect(page3.lines.length).toBeGreaterThan(10);
    expect(page3.lines[0].text).toContain('riverrun');
    expect(page3.lines[0].text).toContain("Eve and Adam's");
    expect(page3.lines[1].text).toContain('commodius vicus');
  });

  it('should retrieve page 628 (final page) accurately', async () => {
    const page628 = await archive.getPage(628);
    expect(page628.pageNumber).toBe(628);
    expect(page628.book).toBe(4);
    expect(page628.chapter).toBe(1);
    expect(page628.sourceFile).toContain('page_1272.html');
    const fullText = page628.lines.map((l) => l.text).join(' ');
    expect(fullText).toContain('A way a lone a last a loved a long the');
  });

  it('should fetch internal asset buffers safely', async () => {
    const cssBuffer = await archive.getFile('style/style.css');
    expect(cssBuffer).toBeInstanceOf(Buffer);
    expect(cssBuffer.length).toBeGreaterThan(50);
  });
});
