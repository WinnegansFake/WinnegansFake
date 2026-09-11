# @winnegans/validator

Configurable linter, schema validator, and zero-copyright guardrail checker for crowdsourced book annotations.

Part of the [WinnegansFake](https://github.com/tekromancy/WinnegansFake) open-source digital humanities project.

---

## 📦 Overview

When crowd-sourcing annotations for protected or modern literature, automated validation is vital to ensure:
1. **Zero-Copyright Safeguards:** Preventing users from pasting entire copyrighted paragraphs into anchor fields (enforcing short lemma/phrase boundaries).
2. **Schema Uniformity:** Ensuring valid JSON syntax, required fields, and category formatting.
3. **Coordinate Coherence:** Verifying that page numbers in file names match JSON content and annotation IDs.
4. **Ordering & Integrity:** Enforcing non-decreasing line sequences and rejecting duplicate IDs.

`@winnegans/validator` provides both a programmatic TypeScript API and a command-line interface (CLI) to lint and validate annotation files for **any** book.

---

## 🚀 Installation

```bash
pnpm add -D @winnegans/validator
# or npm install -D @winnegans/validator
```

---

## 💻 CLI Usage

Validate an entire directory or single file from your terminal or CI/CD workflow:

```bash
# Validate default annotations directory (./annotations)
npx winnegans-validate

# Validate a specific directory or file
npx winnegans-validate --path ./corpus/page_001.json

# Customize maximum allowed anchor phrase characters (default: 150)
npx winnegans-validate --max-length 100

# Use a custom JSON Schema file
npx winnegans-validate --schema ./my-custom-schema.json
```

---

## 🛠️ Programmatic Usage

```typescript
import { AnnotationValidator } from '@winnegans/validator';

const validator = new AnnotationValidator({
  maxTargetPhraseLength: 120, // strict limit on anchor phrase length
  minAnnotationTextLength: 10, // require substantive commentary
  maxLinesPerPage: 45,
  forbidNewlinesInPhrase: true,
  requireNonDecreasingLines: true,
  requireCoordinatePrefix: true,
});

// Validate in-memory object
const issues = validator.validateData({
  schema_version: '1.0.0',
  page_number: 1,
  annotations: [
    {
      id: '001.01-01',
      line_number: 1,
      target_phrase: 'Sing in me, Muse',
      annotation_text: 'Invocatio in classical epic poetry.',
      categories: ['classical-mythology', 'epic-formula'],
      contributors: ['homeric-scholar'],
    },
  ],
});

if (issues.length > 0) {
  console.error('Validation errors:', issues);
} else {
  console.log('✅ Validation passed!');
}

// Or validate files on disk directly:
const fileIssues = validator.validateFile('./path/to/page_001.json');
const dirResults = validator.validateDirectory('./path/to/annotations');
```

---

## ⚖️ License

CC-BY-SA 4.0 International.
