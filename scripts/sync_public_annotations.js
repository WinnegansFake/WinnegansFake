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

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        const dest = path.join(TARGET_DIR, ent.name);
        fs.copyFileSync(full, dest);
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
              if (ann.citations && Array.isArray(ann.citations)) {
                for (const cit of ann.citations) {
                  if (typeof cit === 'string') {
                    scholars.push(cit);
                  } else if (cit && cit.author) {
                    scholars.push(cit.author);
                  }
                }
              }

              searchIndex.push({
                id: ann.id,
                page: pageNum,
                line: ann.line_number,
                lemma: ann.target_text || '',
                quote: ann.quote || '',
                gloss: ann.note || '',
                registers: ann.registers || [],
                tags: ann.tags || [],
                scholars: Array.from(new Set(scholars)),
                displayAuthor:
                  ann.author ||
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
  console.log(`✅ Synchronized ${count} annotation files into web/public/annotations/`);

  // Write compiled search index
  const indexDest = path.join(REPO_ROOT, 'web', 'public', 'search_index.json');
  fs.writeFileSync(indexDest, JSON.stringify(searchIndex), 'utf8');
  console.log(`✅ Built search index with ${searchIndex.length} annotations at web/public/search_index.json`);

  const dissSrc = path.join(REPO_ROOT, 'dissertation.md');
  const dissDest = path.join(REPO_ROOT, 'web', 'public', 'dissertation.md');
  if (fs.existsSync(dissSrc)) {
    fs.copyFileSync(dissSrc, dissDest);
    console.log(`✅ Copied dissertation.md to web/public/dissertation.md`);
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
}

syncAnnotations();
