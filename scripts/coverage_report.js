#!/usr/bin/env node
/**
 * scripts/coverage_report.js
 *
 * Generates an analytical coverage report and density metric breakdown
 * across all chapters, books, and episodes in the WinnegansFake corpus.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const ANNOTATIONS_DIR = path.join(REPO_ROOT, 'annotations');

function generateReport() {
  const stats = {
    works: {},
    totalFiles: 0,
    totalAnnotations: 0,
    categories: {},
    scholars: new Set(),
  };

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        const rel = path.relative(ANNOTATIONS_DIR, full).split(path.sep).join('/');
        const isLegacyFW = rel.startsWith('book_');
        const rawWork = isLegacyFW ? 'finneganswake' : rel.split('/')[0];
        const workId = rawWork === 'finnegans-wake' ? 'finneganswake' : rawWork;

        if (!stats.works[workId]) {
          stats.works[workId] = {
            files: 0,
            annotations: 0,
            density: { rich: 0, standard: 0, sparse: 0 },
            divisions: {},
          };
        }

        try {
          const raw = fs.readFileSync(full, 'utf8');
          const data = JSON.parse(raw);
          const anns = data.annotations || [];
          const count = anns.length;

          stats.totalFiles++;
          stats.totalAnnotations += count;
          stats.works[workId].files++;
          stats.works[workId].annotations += count;

          if (count >= 5) stats.works[workId].density.rich++;
          else if (count >= 2) stats.works[workId].density.standard++;
          else stats.works[workId].density.sparse++;

          const divKey = isLegacyFW
            ? rel.split('/')[0]
            : rel.split('/').slice(1, 3).join('/');

          if (divKey) {
            stats.works[workId].divisions[divKey] =
              (stats.works[workId].divisions[divKey] || 0) + count;
          }

          for (const a of anns) {
            const cats = a.categories || a.registers || [];
            for (const c of cats) {
              stats.categories[c] = (stats.categories[c] || 0) + 1;
            }
            if (a.author) stats.scholars.add(a.author);
            if (a.contributors && Array.isArray(a.contributors)) {
              a.contributors.forEach((s) => stats.scholars.add(s));
            }
          }
        } catch (err) {
          console.error(`Error reading ${rel}:`, err.message);
        }
      }
    }
  }

  walk(ANNOTATIONS_DIR);

  console.log('\n📊 WINNEGANSFAKE CORPUS COVERAGE REPORT');
  console.log('========================================================================');
  console.log(`Total Annotation Files: ${stats.totalFiles}`);
  console.log(`Total Scholarly Glosses: ${stats.totalAnnotations}`);
  console.log(`Unique Scholars Cited:   ${stats.scholars.size}`);
  console.log('------------------------------------------------------------------------');

  for (const [wId, wData] of Object.entries(stats.works)) {
    const avg = wData.files > 0 ? (wData.annotations / wData.files).toFixed(1) : 0;
    console.log(`\n📚 Work: [${wId.toUpperCase()}]`);
    console.log(`   • Files Annotated:  ${wData.files}`);
    console.log(`   • Total Glosses:    ${wData.annotations} (avg ${avg}/page)`);
    console.log(`   • Rich (>=5 glosses):     ${wData.density.rich} pages`);
    console.log(`   • Standard (2-4 glosses): ${wData.density.standard} pages`);
    console.log(`   • Sparse (1 gloss):       ${wData.density.sparse} pages`);
  }

  console.log('\n🏷️  TOP ANALYTICAL REGISTERS:');
  const sortedCats = Object.entries(stats.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  for (const [cat, count] of sortedCats) {
    console.log(`   • ${cat.padEnd(28)} : ${count} occurrences`);
  }
  console.log('========================================================================\n');
}

generateReport();
