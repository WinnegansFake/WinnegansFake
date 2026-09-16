# Changelog

All notable changes to the **WinnegansFake** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-09-16

### Added
- **Multi-Work Modernist Digital Humanities Architecture**:
  - Full support for multi-work literary cataloging across James Joyce's *Finnegans Wake* (1939) and *Ulysses* (1922).
  - New `@winnegans/core` universal work definition system (`WorkDefinition`, `DivisionInfo`, `getAllWorks`).
  - Unified annotations directory structure partitioned cleanly by title: `annotations/finneganswake/` and `annotations/ulysses/`.
- **Complete 18-Episode Ulysses Annotation Pilot**:
  - Landmark opening annotations for all 18 episodes of *Ulysses* (Telemachus, Nestor, Proteus, Calypso, Lotus Eaters, Hades, Aeolus, Lestrygonians, Scylla and Charybdis, Wandering Rocks, Sirens, Cyclops, Nausicaa, Oxen of the Sun, Circe, Eumaeus, Ithaca, Penelope).
  - Full Gilbert/Linati schema integration (scenes, hours, organs, arts, colors, symbols, techniques) and Homeric correspondences.
- **Dedicated Universal Corpus Search**:
  - New full-page search route at `/search` supporting real-time querying, work filtering (All, FW, Ulysses), register filtering, and field scopes (lemmas, glosses, scholars, registers, tags).
  - Chunked client search indices (`search_index_finneganswake.json` and `search_index_ulysses.json`) alongside monolithic `search_index.json`.
- **Reading Progress Tracker**:
  - In-browser reading progress tracker persisted to `localStorage` per work.
  - One-click "Mark Page as Read" toggle in the reader navigation bar with dynamic completion percentage and progress bar.
- **Start a Book Club Guide & Toolkit**:
  - New dedicated `/bookclub` route with curriculum, 4 reading paces (including the 28-year Venice Public Library pace), meeting agendas, and copyable invite generator.
  - Offline Facilitator Toolkit with one-click printable meeting worksheet.
  - Top navigation banner and homepage feature spotlight.
- **Canonical Chapter Boundary Validation**:
  - Enforced strict canonical page range validation in `validate.js` and `@winnegans/validator` (`FW_CHAPTER_PAGE_RANGES` and `ULYSSES_EPISODE_PAGE_RANGES`).
  - Automated prevention of misplaced duplicate page files across chapters or episodes.
- **SEO & Discoverability**:
  - Dynamic `sitemap.ts` and `robots.ts` mapping all static and digital humanities routes for `winnegansfake.com`.

### Fixed
- **Ulysses Reader Header and Notice Bleed**:
  - Fixed hardcoded "Finnegans Wake" strings in fullscreen Zen mode header and fallback EPUB notices when viewing *Ulysses*.
  - Added public domain notice for *Ulysses* (1922) and accurate U.S. CTEA statutory protection notice through December 31, 2035 (entering public domain on January 1, 2036) for *Finnegans Wake*.
- **Duplicate File Overwrite Bug**:
  - Removed duplicate misplaced files `annotations/finneganswake/book_2/chapter_2/page_257.json` and `annotations/finneganswake/book_3/chapter_2/page_424.json`.
  - Unified legitimate annotations into canonical locations: Book 2 Chapter 1 Page 257 (with authentic 7th thunderword) and restored the rich 7.5 KB Book 3 Chapter 1 Page 424.
- **Phantom Files Replacement**:
  - Replaced empty or synthetic placeholder files (pages 001, 002, 400, 401, 402, 591, 592) with authentic bibliographic, editorial, and structural threshold annotations.
- **Register Count & Upstream Repository Alignment**:
  - Unified analytical registers to 19 across `@winnegans/core`, `web/src/lib/constants.ts`, and scholarly monographs.
  - Corrected `UPSTREAM_OWNER` in `packages/core/src/github.ts` and `GITHUB_REPO_URL` in `packages/core/src/works.ts` to `WinnegansFake/WinnegansFake`.

---

## [1.0.0] - 2026-09-10

### Initial Release
- **Zero-Copyright Architecture**: Strict separation of copyrighted raw EPUB text and open-source line-indexed metadata (`PPP.LL` coordinates).
- **Core Package Suite**:
  - `@winnegans/core`: Coordinate parsing, schemas, and register definitions.
  - `@winnegans/react`: Universal line annotator and reader components.
  - `@winnegans/validator`: JSON Schema Draft 2020-12 validator with copyright phrase length limits ($\le 150$ characters).
  - `@winnegans/epub-reader`: Pure client-side browser EPUB unpacking using Web Workers.
  - `@winnegans/theme`: Scholarly dark and sepia aesthetic palettes.
- **Full Corpus Coverage**: Initial line-indexed metadata across all 628 canonical pages of *Finnegans Wake*.
- **Next.js 16 Web Application**: Interactive reader with side-by-side annotations, in-browser EPUB rendering, and GitHub PR submission.
