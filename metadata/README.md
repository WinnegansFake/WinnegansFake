# Library Edition Metadata & Cryptographic Integrity

This directory provides authoritative, machine-readable metadata and cryptographic checksums for the canonical literary editions integrated into the WinnegansFake platform.

---

## 🔒 Zero-Copyright Architecture Notice

Under the WinnegansFake zero-copyright architecture:
- **No copyrighted prose or book texts are committed to version control.**
- Canonical source EPUBs remain strictly external or local under `data/` (which is gitignored).
- All files in this directory (`metadata/`) consist exclusively of non-copyrightable factual bibliographic data, mathematical coordinates, structural schemas, and cryptographic hash digests (SHA-256, SHA-1, MD5).

---

## 📦 Verified Primary Editions

### 1. *Ulysses* by James Joyce (1922)
- **Status:** Public Domain worldwide.
- **First Edition:** Shakespeare and Company (12 Rue de l'Odéon, Paris, Feb 2, 1922).
- **Internet Archive Item:** [`ulysses00joyc_1`](https://archive.org/details/ulysses00joyc_1)
- **Download URL:** `https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub`
- **Filename:** `ulysses00joyc_1.epub`
- **File Size:** 2,040,050 bytes (~2.0 MB)
- **SHA-256:** `06872aca1d98b412c284c3c8b22afdb09757ec9c702523e3ee75941de5d2010e`
- **SHA-1:** `e3b3738a01ef74212901b8aebaaca3f4c7c33def`
- **MD5:** `921d52e61cdf443771aa452ed196a02a`
- **Pagination:** 732 pages (1922 canonical pagination, mapping `EPUB/page_25.html` to page 1 through `EPUB/page_754.html` to page 732).

### 2. *Finnegans Wake* by James Joyce (1939)
- **Status:** Protected under U.S. copyright law through December 31, 2035; Public domain in EU / life+70.
- **First Edition:** Faber and Faber (London) / Viking Press (New York, May 4, 1939).
- **Internet Archive Item:** [`finneganswake00joycuoft`](https://archive.org/details/finneganswake00joycuoft)
- **Download URL:** `https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub`
- **Fallback URL:** `https://archive.org/download/finnegans-wake-joyce-james/FinnegansWakeJoyceJames.epub`
- **Filename:** `finneganswake00joycuoft.epub`
- **File Size:** 41,793,329 bytes (~41.8 MB)
- **SHA-256:** `93f80a2bd54e7c804b7cd0e88553315e3ebdba449a8a08dc83cd3a8c0e00e773`
- **SHA-1:** `84c3c0f7ee5c5670906b251c54bdd61ffc6dd639`
- **MD5:** `882eade4ca44389a4882b73c0c6ff5d4`
- **Pagination:** 628 pages (1939 canonical pagination, starting at page 3 with `EPUB/page_17.html`).

---

## 🛠️ Verification Command

To verify local source files in `data/` against this manifest:
```bash
sha256sum -c metadata/SHA256SUMS.txt
```
