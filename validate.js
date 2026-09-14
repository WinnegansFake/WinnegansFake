#!/usr/bin/env node
/**
 * validate.js
 *
 * Validation script for crowdsourced Finnegans Wake annotations.
 * Enforces:
 *   1. JSON validity & conformity to schemas/page-annotation.schema.json
 *   2. Structural & path integrity (book, chapter, page matching directory & filename)
 *   3. Strict zero-copyright safeguards (target phrases kept to short identification tokens,
 *      strict character length checks, forbidding reproduction of full sentences/paragraphs)
 *   4. Logical sequence and unique IDs across all annotation entries
 */

const fs = require('fs');
const path = require('path');
const { Validator } = require('jsonschema');

const REPO_ROOT = path.resolve(__dirname);
const DEFAULT_SCHEMA_PATH = path.join(REPO_ROOT, 'schemas', 'page-annotation.schema.json');
const ANNOTATIONS_DIR = path.join(REPO_ROOT, 'annotations');

// Guardrail: Maximum characters permitted in target_phrase to prevent text leak
const MAX_TARGET_PHRASE_LEN = 150;

// Regex patterns for directory and file conventions
const PAGE_FILE_PATTERN = /^page_(\d{3,4})\.json$/;
const DIR_BOOK_PATTERN = /^book_([1-4])$/;
const DIR_CHAPTER_PATTERN = /^chapter_([1-8])$/;

/**
 * Recursively collects all JSON files under a directory.
 */
function getJsonFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }

  return results.sort();
}

/**
 * Validates a single annotation JSON file against schema, path conventions, and copyright rules.
 */
function validateFile(filePath, validator, schema) {
  const errors = [];
  const relPath = path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
  const parts = relPath.split('/');

  if (parts.length < 3 || parts[0] !== 'annotations') {
    errors.push(
      `File path '${relPath}' is invalid. Must be inside 'annotations/' with valid book/work hierarchy.`
    );
    return errors;
  }

  let expectedWork = null;
  let expectedBook = null;
  let expectedChap = null;
  let expectedPart = null;
  let expectedEpisode = null;
  let expectedPage = null;

  const isLegacyFW = DIR_BOOK_PATTERN.test(parts[1]);

  if (isLegacyFW) {
    // Legacy Finnegans Wake format: annotations/book_<B>/chapter_<C>/page_<PPP>.json
    if (parts.length !== 4) {
      errors.push(
        `File path '${relPath}' is invalid. Expected format: 'annotations/book_<B>/chapter_<C>/page_<PPP>.json'`
      );
      return errors;
    }

    const bookMatch = DIR_BOOK_PATTERN.exec(parts[1]);
    const chapMatch = DIR_CHAPTER_PATTERN.exec(parts[2]);
    const pageMatch = PAGE_FILE_PATTERN.exec(parts[3]);

    if (!bookMatch) {
      errors.push(`Invalid book folder '${parts[1]}'. Expected 'book_1' through 'book_4'.`);
    }
    if (!chapMatch) {
      errors.push(`Invalid chapter folder '${parts[2]}'. Expected 'chapter_1' through 'chapter_8'.`);
    }
    if (!pageMatch) {
      errors.push(`Invalid page filename '${parts[3]}'. Expected 3-digit zero-padded name like 'page_003.json'.`);
    }

    expectedBook = bookMatch ? parseInt(bookMatch[1], 10) : null;
    expectedChap = chapMatch ? parseInt(chapMatch[1], 10) : null;
    expectedPage = pageMatch ? parseInt(pageMatch[1], 10) : null;
  } else {
    // Multi-work library format: annotations/<workId>/...
    expectedWork = parts[1];
    const fileName = parts[parts.length - 1];
    const pageMatch = PAGE_FILE_PATTERN.exec(fileName);
    if (!pageMatch) {
      errors.push(`Invalid page filename '${fileName}'. Expected zero-padded name like 'page_001.json'.`);
    } else {
      expectedPage = parseInt(pageMatch[1], 10);
    }

    for (let i = 2; i < parts.length - 1; i++) {
      const seg = parts[i];
      const partM = /^part_(\d+)$/.exec(seg);
      const epM = /^episode_(\d+)$/.exec(seg);
      const bookM = /^book_(\d+)$/.exec(seg);
      const chapM = /^chapter_(\d+)$/.exec(seg);
      if (partM) expectedPart = parseInt(partM[1], 10);
      else if (epM) expectedEpisode = parseInt(epM[1], 10);
      else if (bookM) expectedBook = parseInt(bookM[1], 10);
      else if (chapM) expectedChap = parseInt(chapM[1], 10);
    }
  }

  // 2. JSON Parse and Schema Validation
  let data;
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent);
  } catch (exc) {
    return [`Malformed JSON in '${relPath}': ${exc.message}`];
  }

  const validationResult = validator.validate(data, schema);
  if (!validationResult.valid) {
    for (const err of validationResult.errors) {
      const loc = err.property ? err.property : 'root';
      errors.push(`Schema violation in '${relPath}' at [${loc}]: ${err.message}`);
    }
    return errors;
  }

  // 3. Path vs Content Coherence
  const norm = (w) => (w || '').replace(/[-_]/g, '').toLowerCase();
  if (isLegacyFW) {
    if (data.work && norm(data.work) !== 'finneganswake') {
      errors.push(`Mismatch in '${relPath}': legacy Finnegans Wake folder cannot have work '${data.work}'.`);
    }
    if (expectedBook !== null && data.book !== expectedBook) {
      errors.push(`Mismatch in '${relPath}': book folder is ${expectedBook} but JSON 'book' is ${data.book}.`);
    }
    if (expectedChap !== null && data.chapter !== expectedChap) {
      errors.push(`Mismatch in '${relPath}': chapter folder is ${expectedChap} but JSON 'chapter' is ${data.chapter}.`);
    }
  } else {
    if (expectedWork) {
      const normExpected = norm(expectedWork);
      const normData = norm(data.work);
      if (!data.work && normExpected !== 'finneganswake') {
        errors.push(`Missing 'work' in '${relPath}': expected '${expectedWork}'.`);
      } else if (data.work && normData !== normExpected) {
        errors.push(`Mismatch in '${relPath}': directory work is '${expectedWork}' but JSON 'work' is '${data.work}'.`);
      }
    }
    if (expectedPart !== null && data.part !== undefined && data.part !== expectedPart) {
      errors.push(`Mismatch in '${relPath}': part folder is ${expectedPart} but JSON 'part' is ${data.part}.`);
    }
    if (expectedEpisode !== null && data.episode !== undefined && data.episode !== expectedEpisode) {
      errors.push(`Mismatch in '${relPath}': episode folder is ${expectedEpisode} but JSON 'episode' is ${data.episode}.`);
    }
    if (expectedBook !== null && data.book !== undefined && data.book !== expectedBook) {
      errors.push(`Mismatch in '${relPath}': book folder is ${expectedBook} but JSON 'book' is ${data.book}.`);
    }
    if (expectedChap !== null && data.chapter !== undefined && data.chapter !== expectedChap) {
      errors.push(`Mismatch in '${relPath}': chapter folder is ${expectedChap} but JSON 'chapter' is ${data.chapter}.`);
    }
  }

  if (expectedPage !== null && data.page_number !== expectedPage) {
    errors.push(
      `Mismatch in '${relPath}': file name implies page ${expectedPage} but JSON 'page_number' is ${data.page_number}.`
    );
  }

  // 4. Copyright Guardrails & Semantic Annotation Checks
  const seenIds = new Set();
  let prevLine = 0;
  const annotations = Array.isArray(data.annotations) ? data.annotations : [];

  for (let idx = 0; idx < annotations.length; idx++) {
    const ann = annotations[idx];
    const annId = ann.id || '';
    const lineNum = typeof ann.line_number === 'number' ? ann.line_number : 0;
    const target = ann.target_phrase || '';

    // Uniqueness of ID within the page file
    if (seenIds.has(annId)) {
      errors.push(`Duplicate annotation id '${annId}' in '${relPath}' at index ${idx}.`);
    }
    seenIds.add(annId);

    // ID prefix consistency: ID should start with PPP.LL
    const expectedPrefix = `${String(data.page_number).padStart(3, '0')}.${String(lineNum).padStart(2, '0')}`;
    if (!annId.startsWith(expectedPrefix)) {
      errors.push(
        `Annotation id '${annId}' in '${relPath}' does not start with expected page/line prefix '${expectedPrefix}'.`
      );
    }

    // Non-decreasing line order check for readability & DB indexing
    if (lineNum < prevLine) {
      errors.push(
        `Annotations in '${relPath}' should be in non-decreasing order of line_number (found line ${lineNum} after line ${prevLine}).`
      );
    }
    prevLine = lineNum;

    // Strict target_phrase length safeguard to avoid pasting copyrighted chunks
    if (target.length > MAX_TARGET_PHRASE_LEN) {
      errors.push(
        `target_phrase in '${relPath}' for ID '${annId}' exceeds maximum allowed length of ${MAX_TARGET_PHRASE_LEN} chars. ` +
          'Do NOT store full sentences or book passages (U.S. copyright protection).'
      );
    }

    // Guard against multiline blocks in target_phrase
    if (target.includes('\n') || target.includes('\r')) {
      errors.push(
        `target_phrase in '${relPath}' for ID '${annId}' contains newlines. ` +
          'Keep target_phrase to short single-line lemmas or anchor phrases.'
      );
    }

    // Strict isolation safeguard: annotation item work must match file work
    const targetWorkForFile = isLegacyFW ? 'finnegans-wake' : (expectedWork || data.work);
    if (ann.work && targetWorkForFile && ann.work !== targetWorkForFile) {
      errors.push(
        `Annotation id '${annId}' in '${relPath}' specifies work '${ann.work}' which does not match expected file work '${targetWorkForFile}'.`
      );
    }
  }

  return errors;
}

/**
 * Parses command line arguments.
 */
function parseArgs(argv) {
  let schemaPath = DEFAULT_SCHEMA_PATH;
  let targetPath = ANNOTATIONS_DIR;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--schema' && i + 1 < argv.length) {
      schemaPath = path.resolve(argv[++i]);
    } else if (arg === '--path' && i + 1 < argv.length) {
      targetPath = path.resolve(argv[++i]);
    } else if (arg === '-h' || arg === '--help') {
      console.log('Usage: node validate.js [options]');
      console.log('Options:');
      console.log('  --schema <file>   Path to JSON Schema file (default: schemas/page-annotation.schema.json)');
      console.log('  --path <path>     Path to annotation directory or individual JSON file (default: annotations/)');
      console.log('  -h, --help        Show this help message');
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      targetPath = path.resolve(arg);
    }
  }

  return { schemaPath, targetPath };
}

function main() {
  const { schemaPath, targetPath } = parseArgs(process.argv);

  if (!fs.existsSync(schemaPath) || !fs.statSync(schemaPath).isFile()) {
    console.error(`ERROR: Schema not found at ${schemaPath}`);
    process.exit(1);
  }

  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  } catch (err) {
    console.error(`ERROR: Failed to parse schema JSON: ${err.message}`);
    process.exit(1);
  }

  const validator = new Validator();

  let targetFiles = [];
  if (!fs.existsSync(targetPath)) {
    console.error(`ERROR: Target path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    targetFiles.push(targetPath);
  } else if (stat.isDirectory()) {
    targetFiles = getJsonFiles(targetPath);
  }

  if (targetFiles.length === 0) {
    console.log(`No JSON files found to validate in '${targetPath}'.`);
    process.exit(0);
  }

  console.log(`Validating ${targetFiles.length} annotation file(s)...`);
  const allErrors = {};

  for (const filePath of targetFiles) {
    const errs = validateFile(filePath, validator, schema);
    if (errs && errs.length > 0) {
      const rel = path.relative(REPO_ROOT, filePath).split(path.sep).join('/');
      allErrors[rel] = errs;
    }
  }

  const errorFileCount = Object.keys(allErrors).length;
  if (errorFileCount > 0) {
    console.error(`\n❌ Validation FAILED with errors in ${errorFileCount} file(s):\n`);
    for (const [fpath, errs] of Object.entries(allErrors)) {
      console.error(`  File: ${fpath}`);
      for (const e of errs) {
        console.error(`    - ${e}`);
      }
      console.error();
    }
    process.exit(1);
  }

  console.log(`✅ All ${targetFiles.length} annotation file(s) passed validation successfully!`);
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {
  validateFile,
  getJsonFiles,
  MAX_TARGET_PHRASE_LEN,
};
