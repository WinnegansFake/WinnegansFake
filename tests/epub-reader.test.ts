import { describe, it, expect, beforeAll } from 'vitest';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  EpubArchive,
  SequentialSpineMapper,
  JoyceanPageMapper,
} from '../packages/epub-reader/src/index';

const REPO_ROOT = path.resolve(__dirname, '..');
const FIXTURE_EPUB_PATH = path.join(REPO_ROOT, 'tests', 'fixtures', 'sample.epub');
const WAKE_EPUB_PATH = path.join(REPO_ROOT, 'data', 'finneganswake00joycuoft.epub');
const ARCHIVE_DOWNLOAD_URL = 'https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub';

// Ensure sample fixture EPUB exists (generate if missing)
function ensureFixtureEpub(): void {
  if (!fs.existsSync(FIXTURE_EPUB_PATH)) {
    fs.mkdirSync(path.dirname(FIXTURE_EPUB_PATH), { recursive: true });
    execSync(`python3 -c '
import zipfile, os
epub_path = "${FIXTURE_EPUB_PATH}"
with zipfile.ZipFile(epub_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
    z.writestr("META-INF/container.xml", """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>""")
    z.writestr("OEBPS/content.opf", """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Sample Test Book</dc:title>
    <dc:creator>Test Author</dc:creator>
    <dc:language>en</dc:language>
    <dc:identifier id="id">sample-test-uuid-12345</dc:identifier>
  </metadata>
  <manifest>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="chap1" href="chap1.xhtml" media-type="application/xhtml+xml"/>
    <item id="chap2" href="chap2.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chap1"/>
    <itemref idref="chap2"/>
  </spine>
</package>""")
    z.writestr("OEBPS/style.css", "body { font-family: sans-serif; color: #333; }")
    z.writestr("OEBPS/chap1.xhtml", """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter 1</title><link rel="stylesheet" href="style.css"/></head>
  <body>
    <h1>Chapter One</h1>
    <p>Call me Ishmael. Some years ago never mind how long precisely having little or no money in my purse.</p>
  </body>
</html>""")
    z.writestr("OEBPS/chap2.xhtml", """<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head><title>Chapter 2</title><link rel="stylesheet" href="style.css"/></head>
  <body>
    <h1>Chapter Two</h1>
    <p>There now is your insular city of the Manhattoes belted round by wharves.</p>
  </body>
</html>""")
'`);
  }
}

/**
 * 1. UNIVERSAL EPUB ENGINE TESTS (OFFLINE FIXTURE)
 * Guaranteed to pass in any environment without internet access or proprietary downloads.
 */
describe('@winnegans/epub-reader Engine (Offline Fixture)', () => {
  let fixtureArchive: EpubArchive;

  beforeAll(async () => {
    ensureFixtureEpub();
    fixtureArchive = await EpubArchive.open(FIXTURE_EPUB_PATH, {
      mapper: new SequentialSpineMapper(),
    });
  });

  it('should parse metadata from standard OPF package', () => {
    const meta = fixtureArchive.getMetadata();
    expect(meta.title).toBe('Sample Test Book');
    expect(meta.creator).toBe('Test Author');
    expect(meta.language).toBe('en');
    expect(meta.identifier).toBe('sample-test-uuid-12345');
  });

  it('should traverse spine and extract chapter documents', () => {
    const spine = fixtureArchive.getSpine();
    expect(spine.length).toBe(2);
    expect(spine).toEqual(['chap1.xhtml', 'chap2.xhtml']);
  });

  it('should map sequential chapters to pages and segment lines', async () => {
    const p1 = await fixtureArchive.getPage(1);
    expect(p1.pageNumber).toBe(1);
    expect(p1.sourceFile).toBe('chap1.xhtml');
    expect(p1.lines.length).toBeGreaterThan(0);
    const p1Text = p1.lines.map((l) => l.text).join(' ');
    expect(p1Text).toContain('Call me Ishmael');

    const p2 = await fixtureArchive.getPage(2);
    expect(p2.pageNumber).toBe(2);
    expect(p2.sourceFile).toBe('chap2.xhtml');
    expect(p2.lines.map((l) => l.text).join(' ')).toContain('Manhattoes');
  });

  it('should extract internal assets (style.css)', async () => {
    const cssBuf = await fixtureArchive.getFile('style.css');
    expect(cssBuf).toBeInstanceOf(Buffer);
    expect(cssBuf.toString('utf-8')).toContain('font-family');
  });
});

/**
 * 2. FINNEGANS WAKE INTEGRATION TESTS
 * Intelligently attempts to download the source EPUB if missing,
 * and gracefully falls back if offline or rate-limited.
 */
describe('@winnegans/epub-reader Finnegans Wake Integration', () => {
  let wakeArchive: EpubArchive | null = null;
  let hasWakeEpub = false;

  beforeAll(async () => {
    // Check if real EPUB exists; if not, attempt to fetch it
    if (!fs.existsSync(WAKE_EPUB_PATH)) {
      try {
        console.log(`[test] Attempting to download source EPUB from Archive.org...`);
        fs.mkdirSync(path.dirname(WAKE_EPUB_PATH), { recursive: true });
        execSync(
          `curl -fSL --connect-timeout 10 --max-time 60 -o "${WAKE_EPUB_PATH}" "${ARCHIVE_DOWNLOAD_URL}"`,
          { stdio: 'ignore' }
        );
      } catch (err: any) {
        console.warn(`[test] Archive.org download failed or offline (${err.message}). Finnegans Wake integration tests will be skipped.`);
      }
    }

    hasWakeEpub = fs.existsSync(WAKE_EPUB_PATH);
    if (hasWakeEpub) {
      wakeArchive = await EpubArchive.open(WAKE_EPUB_PATH, {
        mapper: new JoyceanPageMapper(),
      });
    }
  });

  it('should load full 628-page spine if Finnegans Wake EPUB is present', () => {
    if (!hasWakeEpub || !wakeArchive) {
      console.log('Skipping Wake spine test: EPUB not available.');
      return;
    }
    const spine = wakeArchive.getSpine();
    expect(spine.length).toBeGreaterThan(500);
    expect(spine.some((s) => s.includes('page_17.html'))).toBe(true);
  });

  it('should retrieve page 3 ("riverrun") accurately when EPUB is present', async () => {
    if (!hasWakeEpub || !wakeArchive) {
      console.log('Skipping page 3 test: EPUB not available.');
      return;
    }
    const page3 = await wakeArchive.getPage(3);
    expect(page3.pageNumber).toBe(3);
    expect(page3.book).toBe(1);
    expect(page3.chapter).toBe(1);
    expect(page3.sourceFile).toContain('page_17.html');
    expect(page3.lines.length).toBeGreaterThan(10);
    expect(page3.lines[0].text).toContain('riverrun');
    expect(page3.lines[0].text).toContain("Eve and Adam's");
    expect(page3.lines[1].text).toContain('commodius vicus');
  });

  it('should retrieve page 628 (final page) accurately when EPUB is present', async () => {
    if (!hasWakeEpub || !wakeArchive) {
      console.log('Skipping page 628 test: EPUB not available.');
      return;
    }
    const page628 = await wakeArchive.getPage(628);
    expect(page628.pageNumber).toBe(628);
    expect(page628.book).toBe(4);
    expect(page628.chapter).toBe(1);
    expect(page628.sourceFile).toContain('page_1272.html');
    const fullText = page628.lines.map((l) => l.text).join(' ');
    expect(fullText).toContain('A way a lone a last a loved a long the');
  });
});
