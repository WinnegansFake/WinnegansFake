# Digital Humanities Annotation & Reader SDK — Architecture & Reusability Guide

This guide details the reusable component architecture of the **WinnegansFake** platform and explains how to publish, adapt, or build digital humanities projects for any arbitrary literary corpus (e.g., Dante's *Commedia*, Marcel Proust's *À la recherche du temps perdu*, Homer's *Odyssey*, Shakespeare's First Folio, or Herman Melville's *Moby-Dick*) as well as independent scholarly dissertation libraries.

---

## 🏛️ System Architecture Overview

The platform is designed around a strict **5-Layer Architecture** that isolates domain-specific literary knowledge from generic digital humanities primitives, zero-copyright EPUB extraction, theme styling, and crowdsourced contribution workflows.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Layer 5: UI & React Component Suite                  │
│  <UniversalReader>  <DissertationViewer>  <EpubSourceModal>           │
│  <BookmarksModal>    <SearchModal>        <GithubPrModal>             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼────────────────────────────────────┐
│ Layer 2: Zero-Copyright EPUB      │ Layer 3: Theme & Cookie Engine     │
│       (@winnegans/epub-reader)    │        (@winnegans/theme)          │
│ • In-memory ZIP & OPF parser      │ • 9 Scholarly Theme Palettes       │
│ • RegexPaginationMapper           │ • Multi-Work Bookmark Cookies      │
│ • CustomOffsetMapper              │ • EPUB Location Persistence        │
│ • Dynamic Mapper Registry         │ • Configurable Expiry (TTL)        │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│             Layer 1: Universal Core Data Models & Schemas               │
│                        (@winnegans/core)                               │
│ • BookCoordinate Math (PPP.LL)    • Work Catalog & createWork()        │
│ • Line Segmentation Engine         • Dissertations & Monograph Catalog  │
│ • Annotation Layer Grouper/Sorter • Analytical Registers Registry     │
│ • Concordance Search Index        • JSON Schema Generator              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│               Layer 4: Verification & Linter Engine                    │
│                     (@winnegans/validator)                             │
│ • Strict JSON Schema Validator    • Phrase Length & Copyright Guard    │
│ • Coordinate Ordering Rules       • CLI Linter Runner                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Package Summary & Reusable Surface

### 1. `@winnegans/core` — Foundational Data Models & Algorithms
Pure TypeScript, zero external dependencies. Can run in Node.js, browsers, Deno, Bun, or Cloudflare Workers.

- **Coordinate System (`src/coordinate.ts`)**:
  - `parseCoordinate(coordStr: string): BookCoordinate`
  - `formatCoordinate(coord: BookCoordinate, options?: FormatOptions): string`
  - `compareCoordinates(a: BookCoordinate, b: BookCoordinate): number`
  - `isCoordinateInRange(coord, start, end): boolean`
- **Work Catalog & Registration (`src/works.ts`)**:
  - `createWork(definition): WorkDefinition`: Factory with validated defaults.
  - `registerWork(work: WorkDefinition): void`: Registers any work into the global catalog at runtime.
  - `getWork(id?: string): WorkDefinition`: Looks up work by ID.
  - `getAllWorks(): WorkDefinition[]`: Catalog listing.
  - `getWorkDivision(work, page): DivisionInfo`: Dynamic chapter/canto/episode resolver.
  - `getPageFilePath(page, work?): string`: Universal annotation filesystem path resolver.
- **Dissertations & Monographs Catalog (`src/dissertations.ts`)**:
  - `createDissertation(definition): DissertationDefinition`: Factory with validated defaults.
  - `registerDissertation(dissertation): void`: Runtime dissertation registration.
  - `getDissertation(id?: string): DissertationDefinition`
  - `getAllDissertations(): DissertationDefinition[]`
  - `getDissertationsForWork(workId: string): DissertationDefinition[]`
- **Line Segmentation Engine (`src/lineAnnotator.ts`)**:
  - `segmentAnnotatedLine(text: string, annotations: Annotation[]): LineSegment[]`:
    Splits any line of text into plain text and clickable annotated phrase spans using a greedy longest-match algorithm with collision prevention.
- **Annotation Layering & Hermeneutics (`src/layers.ts`)**:
  - `groupAndSortAnnotations(annotations, options): AnnotationLayerGroup[]`:
    Groups and sorts glosses by analytical register, scholar, tag, line number, or contributor.
  - `extractPrimaryAuthor(sources?: string[]): string`
  - `getPrimaryRegisterId(annotation, registers?): string`
- **Analytical Registers (`src/registers.ts`)**:
  - `RegisterRegistry`: Class for maintaining custom registers.
  - `STANDARD_LITERARY_REGISTERS`: Pre-configured standard registers for general literature (Etymology, Topography, Mythology, Theology, Allusion, Chronicle, Musical, Philosophy).
- **Concordance Search Index (`src/concordance.ts`)**:
  - `AnnotationConcordance`: In-memory inverted index for phrase, gloss, and lemma querying.
- **JSON Schema Generator (`src/schema.ts`)**:
  - `getPageAnnotationJsonSchema(options?): Record<string, unknown>`: Configurable JSON schema generator.

---

### 2. `@winnegans/epub-reader` — Client-Side Zero-Copyright Ingestion
Reads and parses `.epub` archives directly in browser memory without sending files or text to a server.

- **Archive Reader (`src/archive.ts` & `src/zip.ts`)**:
  - `EpubArchive`: Parses container.xml, content.opf, and spine entries.
- **Configurable Mappers (`src/mappers.ts`)**:
  - `RegexPaginationMapper`: Allows developers to extract pages using arbitrary regex patterns (e.g. `/<div class="page" id="p(\d+)">/` or `<span class="page-break" data-page="(\d+)">`).
  - `CustomOffsetMapper`: Maps spine items sequentially starting from a defined spine index and page number.
  - `SequentialSpineMapper`: Sequential 1..N spine item mapper.
  - `CalibratedNumberMapper`: Auto-detects trailing page numbers in HTML.
  - `registerMapper(workId: string, mapper: EpubPageMapper): void`: Binds custom mappers dynamically to any registered work.
  - `getMapperForWork(workId?: string): EpubPageMapper`: Resolves mapper for active work.

---

### 3. `@winnegans/theme` — Reading Themes & Privacy-First Cookies
- **Palettes (`src/themes.ts`)**:
  - 9 scholarly color palettes: Classic Ivory, Dublin Night, Scholarly Sepia, Manuscript Parchment, Cyber Wake, Gruvbox Academic, Solarized Scholar, Catppuccin Macchiato, OLED Midnight.
- **Theme Manager (`src/manager.ts`)**:
  - `ThemeManager`: Generates CSS custom properties (`--wf-bg`, `--wf-text`, `--wf-accent`, etc.).
- **Cookie Store (`src/cookies.ts`)**:
  - `readThemeCookie()`, `writeThemeCookie()`
  - `readBookmarkCookie()`, `writeBookmarkCookie()` (supports multi-work `workId` tagging)
  - `readEpubCookie()`, `writeEpubCookie()`
  - `getDurationSeconds(duration, customDays)`: Flexible persistence (session, 1-day, 7-days, 30-days, 1-year, forever, custom).

---

### 4. `@winnegans/validator` — Schema & Copyright Rule Enforcement
- **Linter Engine (`src/validator.ts`)**:
  - `AnnotationValidator`: Validates JSON annotation files against schema rules, phrase length caps, line number ranges, coordinate prefixing, and non-decreasing line ordering.
- **CLI Runner (`src/cli.ts`)**:
  - Can be run as a standalone binary or in CI pipelines: `winnegans-validator --dir ./annotations`.

---

### 5. `@winnegans/react` — Universal UI Components & Hooks
Dedicated React component suite published in `packages/react`. Universal across Next.js, Remix, Vite, Astro, or plain React:

- **`<UniversalReader />` (and alias `<WakeReader />`)**:
  - Work-aware reader supporting any registered work (`initialWorkId`, `initialPage`, `basePath`).
  - Split-pane layout: synchronized text viewport and layered annotations panel.
  - Fullscreen Zen reading mode with interactive font scaling and line spacing.
- **`<DissertationViewer />`**:
  - Scholarly monograph renderer with markdown parsing, auto-generated table of contents, dynamic BibTeX/MLA citation copying, reading time estimation, and fullscreen reading mode.
  - Framework-agnostic back button (`onBack`, `backHref`, `LinkComponent`).
- **`<EpubSourceModal />`**:
  - EPUB loading modal supporting URLs, local files, or preset Internet Archive downloads dynamically derived from `WorkDefinition`.
  - Privacy-first cookie persistence with transparency dialog.
- **`<BookmarksModal />`**:
  - Multi-work bookmark manager with work filtering, page/line jump, JSON export, and cookie TTL control.
- **`<SearchModal />`**:
  - Multimodal modal search (lemmas, glosses, scholars, tags, registers, and full text in the EPUB).
- **`<GithubPrModal />`**:
  - Zero-backend GitHub PR submission wizard: Personal Access Token verification, automatic fork creation, feature branch generation, JSON file commit, and Pull Request opening.
- **`<InlineEditor />` & `<AnnotationHoverPopup />`**:
  - In-page note creation/editing with register selection, tag badges, and rich hover tooltips.
- **`<Navigation />` & `<Footer />`**:
  - Header navigation and footer with configurable `LinkComponent`, `brandTitle`, and `brandSubtitle`.
- **Hooks & Contexts**:
  - `BookmarkProvider`, `useBookmarks`
  - `ThemeProvider`, `useTheme`
  - `SearchProvider`, `useSearch`
- **Browser Service**:
  - `browserEpub`: Client-side in-memory EPUB parser and search engine.

---

### 6. `create-winnegans-app` — Project Scaffolding CLI
Run `pnpm create winnegans-app <project-name>` to scaffold a zero-copyright annotation platform in seconds:

```bash
# Interactive or CLI invocation
pnpm create winnegans-app my-dante-project \
  --work-id divine-comedy \
  --title "La Divina Commedia" \
  --author "Dante Alighieri" \
  --division-type canto \
  --pages 100 \
  --epub-url "https://archive.org/download/ladivinacommedia00dant/ladivinacommedia00dant.epub"
```

Generates:
- `package.json` with `@winnegans/*` dependencies
- `AGENTS.md` & `.gitignore` guaranteeing zero copyrighted text in git
- `validate.js` checking schema and phrase length limits
- `metadata/<work_id>.json` defining analytical registers and divisions
- `annotations/<work_id>/...` with starter validated page annotation
- `dissertations/` with starter markdown monograph and BibTeX citations


## 🚀 Quickstart: Creating a Digital Humanities Platform for a New Work

Here is a complete, minimal example showing how to add a third-party work (e.g. Dante's *Divine Comedy*) to the system:

### Step 1: Define and Register the Work
```typescript
import { createWork, registerWork, STANDARD_LITERARY_REGISTERS } from '@winnegans/core';
import { RegexPaginationMapper, registerMapper } from '@winnegans/epub-reader';

// 1. Define Dante's Divine Comedy
export const DIVINE_COMEDY = createWork({
  id: 'divine-comedy',
  title: 'La Divina Commedia (The Divine Comedy)',
  shortTitle: 'DC',
  author: 'Dante Alighieri',
  year: 1320,
  language: 'it',
  description: 'Dante\'s medieval theological epic journey through Inferno, Purgatorio, and Paradiso.',
  totalPages: 100,
  startPage: 1,
  divisionType: 'canto',
  citationFormat: 'DC {page}.{line}',
  defaultEpubUrl: 'https://archive.org/download/ladivinacommedia00dant/ladivinacommedia00dant.epub',
  epubFilename: 'divine-comedy.epub',
  coverColor: 'rose',
  registers: [
    ...STANDARD_LITERARY_REGISTERS,
    {
      id: 'terza-rima',
      name: 'Terza Rima & Metric Prosody',
      category: 'Poetic & Prosodic',
      description: 'Hendecasyllabic meter and ABA BCB CDC rhyming schemes.',
      color: 'purple',
    },
    {
      id: 'florentine-allegory',
      name: 'Florentine Politics & Guelph History',
      category: 'Political & Historical',
      description: 'Historical figures from 13th-century Florence and the Papacy.',
      color: 'amber',
    },
  ],
  divisions: [
    { id: 'inf.1', number: 1, title: 'Inferno: Canto I', subtitle: 'The Dark Wood and the Three Beasts', startPage: 1, endPage: 34 },
    { id: 'purg.1', number: 2, title: 'Purgatorio: Canto I', subtitle: 'The Shores of Mount Purgatory', startPage: 35, endPage: 67 },
    { id: 'par.1', number: 3, title: 'Paradiso: Canto I', subtitle: 'Ascent to the Sphere of Fire', startPage: 68, endPage: 100 },
  ],
});

// 2. Register work into the global catalog
registerWork(DIVINE_COMEDY);

// 3. Register custom EPUB pagination mapper
registerMapper('divine-comedy', new RegexPaginationMapper({
  pagePattern: /id="canto-(\d+)"/,
  minTextLength: 100,
}));
```

### Step 2: Render with the Universal Reader
```tsx
import { UniversalReader } from '@/components/UniversalReader';

export default function DanteReaderPage() {
  return (
    <main className="min-h-screen">
      <UniversalReader initialWorkId="divine-comedy" initialPage={1} />
    </main>
  );
}
```

---

## 🎓 Registering an Associated Dissertation or Monograph

```typescript
import { createDissertation, registerDissertation } from '@winnegans/core';

const DANTE_DISSERTATION = createDissertation({
  id: 'dantesque-geometry-modernism',
  title: 'Sacred Geometry and Dialectic in Dante and Joyce',
  subtitle: 'From the Empyrean to the Midden Heap',
  author: 'Dr. Beatrice Portinari',
  year: 2026,
  field: 'Comparative Literature & Computational Poetics',
  abstract: 'A comparative spatial analysis examining Dante’s circles and Joyce’s Viconian cycles.',
  targetWorks: ['divine-comedy', 'finnegans-wake'],
  keywords: ['Dante', 'Joyce', 'Sacred Geometry', 'Modernism'],
});

registerDissertation(DANTE_DISSERTATION);
```

Render it with `<DissertationViewer content={markdownString} dissertation={DANTE_DISSERTATION} />`.

---

## 🛠️ Zero-Backend GitHub Pull Request Integration

Crowdsourced annotations can be submitted directly from the reader interface without needing an API server:

```typescript
import { submitAnnotationPullRequest } from '@/lib/githubService';

const result = await submitAnnotationPullRequest({
  token: userGithubPersonalAccessToken,
  pageNumber: 1,
  annotation: newAnnotation,
  work: DIVINE_COMEDY,
  upstreamOwner: 'your-organization',
  upstreamRepo: 'your-annotation-repo',
  upstreamBranch: 'main',
  onProgress: (status) => console.log(status.message),
});

console.log(`Pull request opened at ${result.prUrl}!`);
```

---

## 🚢 Publishing to npm

To publish the packages to npm or an internal registry:

```bash
# 1. Build all packages and generate .d.ts declarations
pnpm build:packages

# 2. Run schema validation and tests
pnpm validate
pnpm test

# 3. Publish packages recursively
pnpm --filter "./packages/*" publish --access public
```

---

## 📜 Copyright & Legal Architecture

1. **Zero Text In Git:**
   Never commit full book text to git repositories. All text is read from EPUB scans stored locally in `data/` or fetched in-browser from public archives (such as Internet Archive or Project Gutenberg).
2. **Short Target Phrases Only:**
   Annotations only store short anchor lemmas or phrases (`target_phrase`) strictly below the maximum length limit (default: 150 characters) to comply with fair use and avoid copyrighted text reproduction.
3. **Open Commentary:**
   Scholarly glosses, dissertations, and metadata are licensed under **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.
