#!/usr/bin/env node
/**
 * scripts/sync_public_annotations.js
 *
 * Synchronizes all page annotation JSON files from annotations/book_<B>/chapter_<C>/page_<PPP>.json
 * into web/public/annotations/page_<PPP>.json for static site export.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(REPO_ROOT, 'annotations');
const TARGET_DIR = path.join(REPO_ROOT, 'web', 'public', 'annotations');

function syncAnnotations() {
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  let count = 0;
  const searchIndex = [];
  const workCounts = {};

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        const rel = path.relative(SOURCE_DIR, full).split(path.sep).join('/');
        const isLegacyFW = rel.startsWith('book_');
        const rawWorkId = isLegacyFW ? 'finneganswake' : rel.split('/')[0];
        const isFW = isLegacyFW || rawWorkId === 'finneganswake' || rawWorkId === 'finnegans-wake';
        const workId = isFW ? 'finneganswake' : rawWorkId;

        workCounts[workId] = (workCounts[workId] || 0) + 1;

        // 1. If FW, copy directly to web/public/annotations/page_PPP.json and finnegans-wake/ for backward compat
        if (isFW) {
          const destLegacy = path.join(TARGET_DIR, ent.name);
          fs.copyFileSync(full, destLegacy);

          const fwHyphenDir = path.join(TARGET_DIR, 'finnegans-wake');
          if (!fs.existsSync(fwHyphenDir)) {
            fs.mkdirSync(fwHyphenDir, { recursive: true });
          }
          fs.copyFileSync(full, path.join(fwHyphenDir, ent.name));
        }

        // 2. Always copy to work-scoped destination: web/public/annotations/<workId>/page_PPP.json
        const workTargetDir = path.join(TARGET_DIR, workId);
        if (!fs.existsSync(workTargetDir)) {
          fs.mkdirSync(workTargetDir, { recursive: true });
        }
        const workDest = path.join(workTargetDir, ent.name);
        fs.copyFileSync(full, workDest);

        count++;

        try {
          const raw = fs.readFileSync(full, 'utf8');
          const content = JSON.parse(raw);
          const pageMatch = ent.name.match(/page_(\d+)\.json/);
          const pageNum = pageMatch ? parseInt(pageMatch[1], 10) : content.page_number;

          if (content.annotations && Array.isArray(content.annotations)) {
            for (const ann of content.annotations) {
              const scholars = [];
              if (ann.author) scholars.push(ann.author);
              if (ann.contributors && Array.isArray(ann.contributors)) {
                scholars.push(...ann.contributors);
              }
              if (ann.citations && Array.isArray(ann.citations)) {
                for (const cit of ann.citations) {
                  if (typeof cit === 'string') {
                    scholars.push(cit);
                  } else if (cit && cit.author) {
                    scholars.push(cit.author);
                  }
                }
              }
              if (ann.sources && Array.isArray(ann.sources)) {
                for (const src of ann.sources) {
                  scholars.push(src.split('.')[0]);
                }
              }

              const lemma = ann.target_phrase || ann.target_text || '';
              const gloss = ann.annotation_text || ann.note || '';
              const registers = ann.categories || ann.registers || [];
              const tags = ann.tags || ann.categories || [];

              searchIndex.push({
                id: ann.id,
                work: workId,
                page: pageNum,
                line: ann.line_number,
                episode: content.episode !== undefined ? content.episode : undefined,
                part: content.part !== undefined ? content.part : undefined,
                chapter: content.chapter !== undefined ? content.chapter : undefined,
                book: content.book !== undefined ? content.book : undefined,
                lemma,
                quote: ann.quote || lemma,
                gloss,
                registers,
                tags,
                scholars: Array.from(new Set(scholars)),
                hasExternalLinks: Boolean(ann.external_links && ann.external_links.length > 0),
                externalLinks: ann.external_links || [],
                displayAuthor:
                  ann.author ||
                  (ann.contributors && ann.contributors[0]) ||
                  (ann.citations && ann.citations[0]
                    ? typeof ann.citations[0] === 'string'
                      ? ann.citations[0]
                      : ann.citations[0].author
                    : undefined),
              });
            }
          }
        } catch (err) {
          // ignore parse errors for non-page JSONs
        }
      }
    }
  }

  walk(SOURCE_DIR);
  console.log(`✅ Synchronized ${count} annotation files across works:`, workCounts);

  // Compile coverage matrix for all works
  const coverageMatrix = {
    generatedAt: new Date().toISOString(),
    stats: {},
    pages: {}
  };

  const canonicalTotals = {
    finneganswake: 628,
    ulysses: 732,
    neuromancer: 290,
  };

  for (const [wId, total] of Object.entries(canonicalTotals)) {
    coverageMatrix.stats[wId] = {
      totalPages: total,
      annotatedPages: 0,
      totalAnnotations: 0,
      richPages: 0,     // 5+
      standardPages: 0, // 2-4
      sparsePages: 0,   // 1
      emptyPages: 0,    // 0
      coveragePercentage: 0,
    };
    coverageMatrix.pages[wId] = [];
  }

  // Populate coverage matrix from files
  function indexCoverage(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        indexCoverage(full);
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        const rel = path.relative(SOURCE_DIR, full).split(path.sep).join('/');
        const isLegacyFW = rel.startsWith('book_');
        const rawWorkId = isLegacyFW ? 'finneganswake' : rel.split('/')[0];
        const isFW = isLegacyFW || rawWorkId === 'finneganswake' || rawWorkId === 'finnegans-wake';
        const workId = isFW ? 'finneganswake' : rawWorkId;

        try {
          const raw = fs.readFileSync(full, 'utf8');
          const content = JSON.parse(raw);
          const pageMatch = ent.name.match(/page_(\d+)\.json/);
          const pageNum = pageMatch ? parseInt(pageMatch[1], 10) : content.page_number;
          const annotations = Array.isArray(content.annotations) ? content.annotations : [];
          const count = annotations.length;

          const registers = new Set();
          const scholars = new Set();
          const lines = new Set();

          for (const a of annotations) {
            if (a.line_number) lines.add(a.line_number);
            const cats = a.categories || a.registers || [];
            cats.forEach(c => registers.add(c));
            if (a.author) scholars.add(a.author);
            if (a.contributors) a.contributors.forEach(c => scholars.add(c));
            if (a.sources) a.sources.forEach(s => scholars.add(s.split('.')[0]));
          }

          const density = count >= 5 ? 'rich' : count >= 2 ? 'standard' : count === 1 ? 'sparse' : 'empty';

          if (coverageMatrix.pages[workId]) {
            coverageMatrix.pages[workId].push({
              page: pageNum,
              book: content.book || content.part,
              chapter: content.chapter || content.episode,
              count,
              density,
              annotatedLines: Array.from(lines).sort((a,b) => a-b),
              registers: Array.from(registers).slice(0, 5),
              scholars: Array.from(scholars).slice(0, 5)
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }

  indexCoverage(SOURCE_DIR);

  for (const [wId, pageList] of Object.entries(coverageMatrix.pages)) {
    pageList.sort((a,b) => a.page - b.page);
    const stat = coverageMatrix.stats[wId];
    if (stat) {
      stat.annotatedPages = pageList.length;
      stat.emptyPages = Math.max(0, stat.totalPages - pageList.length);
      stat.coveragePercentage = Number(((stat.annotatedPages / stat.totalPages) * 100).toFixed(1));
      for (const p of pageList) {
        stat.totalAnnotations += p.count;
        if (p.density === 'rich') stat.richPages++;
        else if (p.density === 'standard') stat.standardPages++;
        else if (p.density === 'sparse') stat.sparsePages++;
      }
    }
  }

  const coverageDest = path.join(REPO_ROOT, 'web', 'public', 'coverage_matrix.json');
  fs.writeFileSync(coverageDest, JSON.stringify(coverageMatrix, null, 2), 'utf8');
  console.log(`✅ Built coverage matrix at web/public/coverage_matrix.json`);

  // Write compiled search index (monolithic and per-work chunked)
  const indexDest = path.join(REPO_ROOT, 'web', 'public', 'search_index.json');
  fs.writeFileSync(indexDest, JSON.stringify(searchIndex), 'utf8');

  const fwIndex = searchIndex.filter((item) => item.work === 'finneganswake');
  const ulyssesIndex = searchIndex.filter((item) => item.work === 'ulysses');
  const nmIndex = searchIndex.filter((item) => item.work === 'neuromancer');
  fs.writeFileSync(path.join(REPO_ROOT, 'web', 'public', 'search_index_finneganswake.json'), JSON.stringify(fwIndex), 'utf8');
  fs.writeFileSync(path.join(REPO_ROOT, 'web', 'public', 'search_index_ulysses.json'), JSON.stringify(ulyssesIndex), 'utf8');
  fs.writeFileSync(path.join(REPO_ROOT, 'web', 'public', 'search_index_neuromancer.json'), JSON.stringify(nmIndex), 'utf8');
  console.log(`✅ Built search index with ${searchIndex.length} annotations at web/public/search_index.json (FW: ${fwIndex.length}, Ulysses: ${ulyssesIndex.length}, Neuromancer: ${nmIndex.length})`);

  // Write works.json catalog
  let allWorks = [];
  try {
    const core = require('../packages/core/dist/index.js');
    if (core && typeof core.getAllWorks === 'function') {
      allWorks = core.getAllWorks();
    }
  } catch {
    // fallback if core dist is not yet built
    allWorks = [
      { id: 'finnegans-wake', title: 'Finnegans Wake', totalPages: 628 },
      { id: 'ulysses', title: 'Ulysses', totalPages: 732 },
      { id: 'neuromancer', title: 'Neuromancer', totalPages: 290 },
    ];
  }

  const worksCatalogDest = path.join(REPO_ROOT, 'web', 'public', 'works.json');
  fs.writeFileSync(worksCatalogDest, JSON.stringify(allWorks, null, 2), 'utf8');
  console.log(`✅ Exported library catalog with ${allWorks.length} works at web/public/works.json`);

  // Write dissertations.json catalog
  let allDissertations = [];
  try {
    const core = require('../packages/core/dist/index.js');
    if (core && typeof core.getAllDissertations === 'function') {
      allDissertations = core.getAllDissertations();
    }
  } catch {
    allDissertations = [
      {
        id: 'the-architecture-of-the-night-mind',
        title: 'The Architecture of the Night Mind',
        subtitle: "A Polyphonic Dissertation on James Joyce's Finnegans Wake",
        author: 'Dr. Alistair H. C. MacCool & The Open Wake Consortium',
        year: 2026,
        targetWorks: ['finnegans-wake'],
      },
    ];
  }

  const dissertationsCatalogDest = path.join(REPO_ROOT, 'web', 'public', 'dissertations.json');
  fs.writeFileSync(dissertationsCatalogDest, JSON.stringify(allDissertations, null, 2), 'utf8');
  console.log(`✅ Exported dissertations catalog with ${allDissertations.length} monographs at web/public/dissertations.json`);

  // Synchronize dissertations/ directory into web/public/dissertations/
  const dissertationsSrcDir = path.join(REPO_ROOT, 'dissertations');
  const dissertationsTargetDir = path.join(REPO_ROOT, 'web', 'public', 'dissertations');
  if (fs.existsSync(dissertationsSrcDir)) {
    if (!fs.existsSync(dissertationsTargetDir)) {
      fs.mkdirSync(dissertationsTargetDir, { recursive: true });
    }
    const dissDirs = fs.readdirSync(dissertationsSrcDir, { withFileTypes: true });
    let dissCount = 0;
    for (const d of dissDirs) {
      if (d.isDirectory()) {
        const itemSrcDir = path.join(dissertationsSrcDir, d.name);
        const itemDestDir = path.join(dissertationsTargetDir, d.name);
        if (!fs.existsSync(itemDestDir)) {
          fs.mkdirSync(itemDestDir, { recursive: true });
        }
        const files = fs.readdirSync(itemSrcDir);
        for (const file of files) {
          fs.copyFileSync(path.join(itemSrcDir, file), path.join(itemDestDir, file));
        }
        dissCount++;
      }
    }
    console.log(`✅ Synchronized ${dissCount} dissertations into web/public/dissertations/`);
  }

  // Backward compatibility: copy flagship dissertation to web/public/dissertation.md
  const flagshipSrc = path.join(dissertationsSrcDir, 'the-architecture-of-the-night-mind', 'dissertation.md');
  const fallbackSrc = path.join(REPO_ROOT, 'dissertation.md');
  const dissDest = path.join(REPO_ROOT, 'web', 'public', 'dissertation.md');
  if (fs.existsSync(flagshipSrc)) {
    fs.copyFileSync(flagshipSrc, dissDest);
    console.log(`✅ Copied flagship dissertation to web/public/dissertation.md`);
  } else if (fs.existsSync(fallbackSrc)) {
    fs.copyFileSync(fallbackSrc, dissDest);
    console.log(`✅ Copied root dissertation.md to web/public/dissertation.md`);
  }

  const figuresSrc = path.join(REPO_ROOT, 'figures');
  const figuresDest = path.join(REPO_ROOT, 'web', 'public', 'figures');
  if (fs.existsSync(figuresSrc)) {
    if (!fs.existsSync(figuresDest)) {
      fs.mkdirSync(figuresDest, { recursive: true });
    }
    const figs = fs.readdirSync(figuresSrc);
    for (const f of figs) {
      if (f.endsWith('.svg') || f.endsWith('.png')) {
        fs.copyFileSync(path.join(figuresSrc, f), path.join(figuresDest, f));
      }
    }
    console.log(`✅ Synchronized ${figs.length} figures to web/public/figures/`);
  }

  // Synchronize metadata/ directory into web/public/metadata/
  const metadataSrcDir = path.join(REPO_ROOT, 'metadata');
  const metadataTargetDir = path.join(REPO_ROOT, 'web', 'public', 'metadata');
  if (fs.existsSync(metadataSrcDir)) {
    if (!fs.existsSync(metadataTargetDir)) {
      fs.mkdirSync(metadataTargetDir, { recursive: true });
    }
    const metaFiles = fs.readdirSync(metadataSrcDir);
    let metaCount = 0;
    for (const f of metaFiles) {
      const srcFile = path.join(metadataSrcDir, f);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, path.join(metadataTargetDir, f));
        metaCount++;
      }
    }
    console.log(`✅ Synchronized ${metaCount} metadata files to web/public/metadata/`);
  }
}

syncAnnotations();
