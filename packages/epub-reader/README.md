# @winnegans/epub-reader

Zero-dependency, high-performance pure TypeScript library to read, parse, and calibrate pagination for standard EPUB archives.

Part of the [WinnegansFake](https://github.com/tekromancy/WinnegansFake) open-source digital humanities project.

---

## 📦 Overview

Digital humanities and literary annotation tools often need to read local offline EPUB archives without sending copyrighted text to servers.

`@winnegans/epub-reader` provides:
1. **Zero External Dependencies:** Built on pure TypeScript with a custom built-in deflate zip reader.
2. **Universal EPUB Support:** Reads standard EPUB 2 and EPUB 3 files (`META-INF/container.xml`, OPF manifests, and spine documents).
3. **Pluggable Pagination Mappers:** Bridges the gap between reflowable EPUB chapters and canonical printed book page numbers (`PPP.LL`).
4. **Deterministic Line Segmentation:** Formats extracted chapter paragraphs into consistent lines suitable for dual-column reading and terminal annotation.

---

## 🚀 Installation

```bash
pnpm add @winnegans/epub-reader
# or npm install @winnegans/epub-reader
```

---

## 🛠️ Usage

### 1. Reading Any Standard EPUB

```typescript
import { EpubArchive, SequentialSpineMapper } from '@winnegans/epub-reader';

// Open EPUB with standard sequential chapter mapping
const archive = await EpubArchive.open('./books/my-book.epub', {
  mapper: new SequentialSpineMapper(),
});

// Read metadata
const metadata = archive.getMetadata();
console.log(metadata.title, metadata.creator);

// Inspect spine reading order
const spine = archive.getSpine();
console.log(`Book contains ${spine.length} chapters.`);

// Extract cleaned text from a chapter
const chapterText = await archive.getPlainText(spine[0]);
```

---

### 2. Calibrating Printed Book Pagination

If your EPUB was scanned from a printed edition or contains paragraph-end page numbers:

```typescript
import { EpubArchive, CalibratedNumberMapper } from '@winnegans/epub-reader';

const archive = await EpubArchive.open('./books/digitized-facsimile.epub', {
  mapper: new CalibratedNumberMapper(1000),
  lineOptions: { targetLineLen: 70 },
});

// Retrieve specific printed page
const page42 = await archive.getPage(42);
console.log(`Page 42 has ${page42.lines.length} lines:`);
for (const line of page42.lines) {
  console.log(`  Line ${line.line}: ${line.text}`);
}
```

---

### 3. Custom Page Mapping for Any Literary Work

Implement the `EpubPageMapper` interface to create bespoke pagination rules for any author or edition:

```typescript
import { EpubPageMapper, EpubArchive } from '@winnegans/epub-reader';

export class HomericCantoMapper implements EpubPageMapper {
  public readonly name = 'homeric-canto';

  public async mapPages(archive: EpubArchive) {
    const pageMap = new Map<number, { href: string; text: string }>();
    const spine = archive.getSpine();

    // Map your spine files to custom canto or page coordinates
    let canto = 1;
    for (const href of spine) {
      const text = await archive.getText(href);
      pageMap.set(canto++, { href, text });
    }

    return pageMap;
  }
}
```

---

## ⚖️ License

GPL-3.0-only.
