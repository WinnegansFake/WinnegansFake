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
      }
    }
  }

  walk(SOURCE_DIR);
  console.log(`✅ Synchronized ${count} annotation files into web/public/annotations/`);

  const dissSrc = path.join(REPO_ROOT, 'dissertation.md');
  const dissDest = path.join(REPO_ROOT, 'web', 'public', 'dissertation.md');
  if (fs.existsSync(dissSrc)) {
    fs.copyFileSync(dissSrc, dissDest);
    console.log(`✅ Copied dissertation.md to web/public/dissertation.md`);
  }
}

syncAnnotations();
