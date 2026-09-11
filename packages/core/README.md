# @winnegans/core

Universal coordinate system, data models, analytical registers, and concordance index for zero-copyright literary annotations.

Part of the [WinnegansFake](https://github.com/tekromancy/WinnegansFake) open-source digital humanities project.

---

## 📦 Overview

Annotating complex modernist and classical literature (*Finnegans Wake*, *Ulysses*, *The Waste Land*, *The Divine Comedy*, *The Cantos*, *In Search of Lost Time*) poses two major technical challenges:
1. **Zero-Copyright Preservation:** Decoupling copyrighted book text from open scholarly glosses by anchoring notes purely to universal coordinates (`PPP.LL`).
2. **Polyphonic Analysis:** Layering annotations across multiple thematic and hermeneutic registers (etymology, realia, mythology, liturgical parody, motifs).

`@winnegans/core` provides the foundational TypeScript data models, coordinate parsers, register registries, and in-memory concordance index for building annotation tools for **any** literary work.

---

## 🚀 Installation

```bash
pnpm add @winnegans/core
# or npm install @winnegans/core
```

---

## 🛠️ Key Features & Usage

### 1. Universal Coordinate System

Supports both standard two-part coordinates (`003.01` $\rightarrow$ page 3, line 1) and hierarchical coordinates (`1.2.003.01` $\rightarrow$ book 1, chapter 2, page 3, line 1):

```typescript
import { parseCoordinate, formatCoordinate, compareCoordinates } from '@winnegans/core';

// Parse
const coord = parseCoordinate('003.01');
console.log(coord); // { page: 3, line: 1 }

// Format with custom padding or separators
const formatted = formatCoordinate({ page: 7, line: 4 }, { padPage: 3, padLine: 2 });
console.log(formatted); // "007.04"

// Sort coordinates
const coords = [
  { page: 4, line: 1 },
  { page: 3, line: 15 },
  { page: 3, line: 1 },
];
coords.sort(compareCoordinates);
// Sorted: 3.1, 3.15, 4.1
```

---

### 2. Custom Analytical Registers for Any Book

Register thematic categories tailored to any author or literary tradition:

```typescript
import { RegisterRegistry, STANDARD_LITERARY_REGISTERS } from '@winnegans/core';

// Initialize with standard registers or define custom ones
const registry = new RegisterRegistry(STANDARD_LITERARY_REGISTERS);

registry.register({
  id: 'dantean-contrapasso',
  name: 'Contrapasso (Retributive Justice)',
  category: 'Theological',
  description: 'Punishment symbolically fitting the nature of the sin',
  color: 'red',
});

console.log(registry.getByCategory('Theological'));
```

---

### 3. In-Memory Concordance & Cross-Reference Graph

Search, filter, and inspect connections across thousands of annotations:

```typescript
import { AnnotationConcordance } from '@winnegans/core';

const concordance = new AnnotationConcordance();

// Load page annotations
concordance.addPage({
  schema_version: '1.0.0',
  page_number: 3,
  annotations: [
    {
      id: '003.01-01',
      line_number: 1,
      target_phrase: 'riverrun',
      annotation_text: 'The River Liffey beginning her course to the sea.',
      categories: ['etymology', 'river-liffey'],
      cross_references: ['628.16'],
      contributors: ['scholar-1'],
    },
  ],
});

// Full-text search across lemmas and commentary
const results = concordance.search('Liffey');

// Get notes for a specific line
const lineNotes = concordance.getAnnotationsForLine(3, 1);

// Query cross-reference graph
const crossRefs = concordance.getCrossReferences('003.01-01'); // ['628.16']
```

---

### 4. Customizable JSON Schema Generator

Generate tailored JSON Schemas for validating page annotation files:

```typescript
import { getPageAnnotationJsonSchema } from '@winnegans/core';

const schema = getPageAnnotationJsonSchema({
  maxTargetPhraseLength: 100, // copyright safeguard
  maxLinesPerPage: 40,
});
```

---

## ⚖️ License

CC-BY-SA 4.0 International.
