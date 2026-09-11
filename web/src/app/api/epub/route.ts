import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { EpubArchive } from '@winnegans/epub-reader';

// Repo root is one level above web/
const REPO_ROOT = path.resolve(process.cwd(), '..');
const EPUB_PATH = path.join(REPO_ROOT, 'data', 'finneganswake00joycuoft.epub');

// Cached archive instance
let cachedArchive: EpubArchive | null = null;

async function getArchive(): Promise<EpubArchive> {
  if (!cachedArchive) {
    try {
      await fs.access(EPUB_PATH);
    } catch {
      throw new Error(
        `Source epub not found at ${EPUB_PATH}. Run 'make -C data' to download the local source.`
      );
    }
    cachedArchive = await EpubArchive.open(EPUB_PATH);
  }
  return cachedArchive;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get('page');
  const fileParam = searchParams.get('file');

  try {
    const archive = await getArchive();

    // 1. Direct asset within the .epub archive (e.g. style/style.css, images)
    if (fileParam) {
      const safePath = path.normalize(fileParam).replace(/^(\.\.[\/\\])+/, '');
      const buffer = await archive.getFile(safePath);
      const ext = path.extname(safePath).toLowerCase();
      let contentType = 'text/plain';

      if (ext === '.css') contentType = 'text/css';
      else if (ext === '.jpeg' || ext === '.jpg') contentType = 'image/jpeg';
      else if (ext === '.html' || ext === '.xhtml') contentType = 'text/html; charset=utf-8';
      else if (ext === '.xml' || ext === '.opf' || ext === '.ncx') contentType = 'application/xml';

      return new NextResponse(new Uint8Array(buffer), {
        headers: { 'Content-Type': contentType },
      });
    }

    // 2. Query page directly from .epub (pages 1 to 628)
    const pageNum = parseInt(pageParam || '1', 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 628) {
      return NextResponse.json(
        { error: 'Page parameter must be between 1 and 628' },
        { status: 400 }
      );
    }

    const pageData = await archive.getPage(pageNum);

    return NextResponse.json({
      page: pageData.pageNumber,
      book: pageData.book,
      chapter: pageData.chapter,
      source_file: pageData.sourceFile,
      html: pageData.html,
      raw_text: pageData.rawText,
      lines: pageData.lines,
      archive_type: 'direct_epub',
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Error reading from .epub archive.',
        message: err.message,
      },
      { status: 500 }
    );
  }
}
