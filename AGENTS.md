# AGENTS.md - WinnegansFake Contributor & Agent Guide

This repository uses **pnpm** (NOT `npm` or `yarn`) as the sole package manager for all JavaScript/TypeScript and web development tooling.

---

## 📦 Package Management Rules

1. **Always Use `pnpm`:**
   - Install dependencies: `pnpm install`
   - Add dependencies: `pnpm add <pkg>` (or `pnpm add -D <pkg>`)
   - Run development server: `pnpm dev`
   - Run production build: `pnpm build`
   - Run linter: `pnpm lint`

2. **Never Commit `package-lock.json` or `yarn.lock`:**
   - Only `pnpm-lock.yaml` and `pnpm-workspace.yaml` should be used and committed.
   - Any PR introducing `package-lock.json` will be rejected.

---

## ⚖️ Zero-Copyright Architecture & Rules

- James Joyce's *Finnegans Wake* remains protected under **U.S. copyright law through 2035**.
- **No copyrighted book text may ever be committed to git.**
- Source EPUB files and extracted HTML chapters must remain strictly local under `data/` and must always remain gitignored.
- Annotations are stored purely as metadata glosses mapped to standard page and line coordinates (`PPP.LL`) in `annotations/book_<B>/chapter_<C>/page_<PPP>.json`.

---

## 🛠️ Verification & Testing

- Before creating a PR or committing changes, run:
  ```bash
  # Validate JSON schema and line rules
  pnpm validate
  # (or: node validate.js)

  # Run vitest suite
  pnpm test

  # Test build the web app
  pnpm build
  ```
