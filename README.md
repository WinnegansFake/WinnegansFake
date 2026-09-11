# WinnegansFake: Collaborative Annotations for *Finnegans Wake*

An open-source, crowdsourced scholarly annotation engine for James Joyce’s *Finnegans Wake*.

Inspired by this [tiktok video](https://www.tiktok.com/@lily76412/video/7661924549893655839?_r=1&_t=ZN-99VlBXRExiY)

---

## 🎓 Central Thesis & Critical Monograph: `dissertation.md`

The intellectual foundation and central focus of this entire repository is articulated in our comprehensive academic treatise:

### 📖 [Read the Full Dissertation: `dissertation.md`](dissertation.md)
> **"The Architecture of the Night Mind: A Polyphonic Dissertation on the Cosmology, Philology, Genetic Manuscripts, and Computational Hermeneutics of James Joyce’s *Finnegans Wake*"**

This 6,300+ word monograph synthesizes the collected knowledge of the *WinnegansFake* corpus into an enduring theoretical and computational reference work, exploring:
1. **The Epistemological Horizon & The Zero-Copyright Imperative:** The 17-year nocturnal composition in Paris (1922–1939), John Bishop’s somatic philology of the sleeping body, and the software engineering architecture that decouples copyrighted source texts from open-source CC BY-SA 4.0 metadata coordinates (`PPP.LL`).
2. **Macro-Cosmology:** Giambattista Vico’s *Scienza Nuova* (1725), the ideal eternal history (*storia ideale eterna*), the three cyclical ages (Divine, Heroic, Human), the cataclysmic *ricorso*, and Giordano Bruno of Nola’s dialectic of *coincidentia oppositorum*.
3. **Micro-Cosmology & Sigla:** Analysis of the Buffalo Notebooks and Joyce's hieroglyphic sigla notation—$\rotatebox[origin=c]{180}{\text{E}}$ (HCE), $\Delta$ (ALP), $[$ (Shem the Penman), $]$ (Shaun the Post), $\vdash$ (Issy and the 28 Rainbow Girls), and $\top$ (Mamalujo / The Four Masters).
4. **Philological Polyphony & The Intertextual Tapestry:** The quantum portmanteau across sixty languages, acoustic theology of the ten 100-letter thunderclaps (1,001 letters), the *Book of Kells* (*Tunc* page), the Egyptian *Book of the Dead* (Osiris/Isis), *Tristan und Isolde*, Jonathan Swift's dual loves (Stella & Vanessa), Henrik Ibsen's *Master Builder*, and the ballad of Tim Finnegan.
5. **Computational Hermeneutics & The Digital Humanities:** The evolution of *Wake* scholarship from Campbell & Robinson and Roland McHugh to FWEET, the James Joyce Digital Archive (JJDA), and the modern *WinnegansFake* monorepo spanning 19 analytical registers across nearly 2,000 curated, context-aware annotations.
6. **Comprehensive Web Bibliography:** Active, curated links to authoritative digital scans on the Internet Archive, Project Gutenberg, CELT (UCC), Stanford Encyclopedia of Philosophy, and genetic scholarship portals.

---

## 🌐 The Mission: Bringing the World's Annotations Together

James Joyce famously remarked that he wrote *Finnegans Wake* *"to keep the critics busy for three hundred years."* Composed across seventeen years in Paris (1922–1939) in an experimental idiom interweaving more than sixty languages, world mythologies, theological debates, and Dublin street ballads, the *Wake* is widely regarded as the most challenging—and rewarding—monument in world literature. 

No single reader, scholar, or commentary has ever decoded it alone. Over the last century, brilliant readers, local reading circles, literary detectives, and academic pioneers have produced extraordinary elucidations—yet this vast reservoir of knowledge has historically remained fractured:
- Scattered across out-of-print reference tomes (Atherton, Campbell & Robinson, Glasheen, Mink, O Hehir)
- Locked inside paywalled scholarly journals or university archives
- Dispersed across private reading group notes, blogs, wikis, and internet forums

**The central mission of WinnegansFake is to bring all the annotations out there that exist into one unified, collaborative, line-indexed commons.** By connecting the text line-by-line (`PPP.LL`) to the collected wisdom of the global Joycean community, we seek to democratize this masterpiece so that all may read, understand, and enjoy this great work with the accumulated insights, polyglot translations, and genetic histories of everyone else.

---

## 📖 How to Download the Book & Read with Live Annotations

Because copyrighted text cannot be hosted directly in this repository, the web application is architected to dynamically parse and render a local EPUB archive stored on your machine. This allows you to read the full original text side-by-side with synchronized annotations without infringing copyright.

### Quickstart Guide

1. **Clone the Repository and Install Dependencies:**
   ```bash
   git clone https://github.com/WinnegansFake/WinnegansFake.git
   cd WinnegansFake
   pnpm install
   ```

2. **Download the Source EPUB into `data/`:**
   Run our built-in fetching target, which downloads the verified 1939 edition scan from the Internet Archive directly into the local, gitignored `data/` directory:
   ```bash
   pnpm fetch:data
   # Alternatively: make -C data
   ```
   *Manual Download Option:* If you prefer to download manually via `wget` or browser, fetch the file and save it to `data/finneganswake00joycuoft.epub`:
   ```bash
   mkdir -p data
   wget -O data/finneganswake00joycuoft.epub https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub
   ```

3. **Start the Interactive Web Application:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser:
   - The reader streams the local EPUB text page by page (standard pages 1 through 628).
   - Click or hover any highlighted word or phrase to reveal line-by-line annotations, multilingual etymologies, and clickable bibliographical links.
   - Filter by analytical registers (HCE, ALP, Viconian cycles, Egyptian Book of the Dead, thunderclaps, Dublin topography, and more).

---

## ⚖️ Zero-Copyright Architecture & Why the EPUB Must Remain Gitignored

> [!IMPORTANT]
> **CRITICAL LEGAL & ARCHITECTURAL RULE:** Never upload, commit, or push the EPUB, extracted HTML chapters, or raw book text to any part of this repository.

### Why James Joyce's *Finnegans Wake* is Protected
- *Finnegans Wake* was published in May 1939.
- Under **United States copyright law** (specifically the 1998 Sonny Bono Copyright Term Extension Act), works published with notice between 1929 and 1977 remain protected for **95 years from the publication date**.
- Consequently, James Joyce's text remains under U.S. copyright protection **through December 31, 2035**, entering the public domain on **January 1, 2036**.

### Why the Local Source Files MUST Stay Gitignored
To protect the project, its contributors, and the public repository from copyright infringement and DMCA takedowns:
1. **Strict `.gitignore` Exclusion:** The repository's [`.gitignore`](.gitignore) explicitly excludes all book source data:
   ```gitignore
   data/finneganswake*
   data/EPUB/
   data/META-INF/
   data/*.epub
   data/*.html
   ```
2. **Never Force-Add Book Files:** Never use `git add -f` or bypass gitignore rules to commit files inside `data/` or any local `.epub` / `.html` files. Pull Requests containing copyrighted source files will be rejected immediately.
3. **Target Phrases Are Limited to Minimal Tokens:** The JSON annotations in `annotations/` reference only short anchor phrases ($\le 150$ characters) strictly necessary for lexical identification, accompanied by original commentary, etymologies, and citations.
4. **Architectural Decoupling:** The commentary and annotations are 100% free and open-source under Creative Commons (CC BY-SA 4.0), while the source book remains in the private, local custody of the individual reader. This separation ensures that the collected wisdom of the community remains resilient, permanent, and accessible to the entire world without legal jeopardy.

---

## 📖 The Standard Academic Citation System

Scholarly Joyce studies index *Finnegans Wake* using standardized pagination established in the first Faber & Faber / Viking editions (consisting of 628 pages, Book I through Book IV).

Every line in the work is referenced in the notation:
$$\mathbf{PPP.LL}$$
- `PPP` is the 3-digit zero-padded page number ($003 \dots 628$).
- `LL` is the 2-digit zero-padded line number on that page ($01 \dots 36$, up to $40$ for margin/footnote dense layouts such as Book II, Chapter 2).

For example:
- `003.01` refers to page 3, line 1 (`riverrun...`).
- `003.04` refers to page 3, line 4 (`commodius vicus of recirculation...`).
- `628.16` refers to page 628, line 16 (`A way a lone a last a loved a long the`).

---

## 📜 Dual-Licensing Strategy

To protect both scholarly open access and community software tools, this project is licensed under a dual model:

1. **Content & Annotations (`annotations/`):**  
   Licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).  
   Any commentary, glosses, etymologies, or analyses contributed to this repository belong to the commons and can be shared and adapted with attribution.

2. **Code & Tooling (`validate.js`, CI workflows, ingestion utilities):**  
   Licensed under the [GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.en.html).

---

## 🗂️ Directory Architecture

Annotations are organized strictly by Book, Chapter, and Page:

```text
WinnegansFake/
├── .github/
│   └── workflows/
│       └── validate-pr.yml                 # Automated PR validation CI
├── annotations/
│   ├── book_1/
│   │   ├── chapter_1/
│   │   │   ├── page_003.json              # Annotations for page 3
│   │   │   └── page_004.json
│   │   └── ...
│   ├── book_2/
│   ├── book_3/
│   └── book_4/
├── schemas/
│   └── page-annotation.schema.json        # JSON Schema Draft 2020-12
├── validate.js                            # PR linting & copyright guard script
└── README.md
```

This normalized folder structure enables:
- Fast parallel git merges without merge conflicts across different pages.
- Direct mapping to relational databases (e.g., PostgreSQL `books`, `chapters`, `pages`, `annotations` tables).

---

## 🛠️ Data Model & JSON Format

Each file represents a single page (`page_PPP.json`) and must conform to [`schemas/page-annotation.schema.json`](schemas/page-annotation.schema.json):

```json
{
  "schema_version": "1.0.0",
  "book": 1,
  "chapter": 1,
  "page_number": 3,
  "annotations": [
    {
      "id": "003.01-8f2c",
      "line_number": 1,
      "target_phrase": "riverrun",
      "annotation_text": "Compound opening word indicating circularity and eternal return (Giambattista Vico's ricorso). Resumes the incomplete sentence closing the novel on page 628 ('A way a lone a last a loved a long the'). Also invokes the River Liffey flowing through Dublin, personified as Anna Livia Plurabelle (ALP).",
      "categories": ["ricorso", "vico", "topography", "river-liffey", "alp"],
      "cross_references": ["628.16"],
      "sources": [
        "McHugh, Roland. Annotations to Finnegans Wake (4th ed.).",
        "Campbell, Joseph and Robinson, Henry Morton. A Skeleton Key to Finnegans Wake."
      ],
      "contributors": ["joycean-scholar", "open-wake-editor"]
    }
  ]
}
```

### Key Field Requirements
- `id`: Formatted as `PPP.LL-<token>` (e.g. `003.01-8f2c`). Unique within the page.
- `line_number`: Integer line on the standard page.
- `target_phrase`: Minimal lemma or anchor token. Must be $\le 150$ characters and cannot contain newline breaks.
- `annotation_text`: Detailed critical exposition, etymological breakdown, or context.
- `categories`: Array of kebab-case tags (`[a-z0-9-]+`).
- `contributors`: List of GitHub handles for credit attribution.

---

## 🚀 How to Contribute via Pull Request

We welcome contributions from scholars, readers, students, and enthusiasts!

### Step-by-Step Contribution Guide

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/WinnegansFake.git
   cd WinnegansFake
   ```

2. **Create a Feature Branch:**
   ```bash
   git checkout -b add-page-004-notes
   ```

3. **Locate or Create the Target Page JSON:**
   Navigate to the correct book and chapter directory:
   ```bash
   # Example: Book 1, Chapter 1, Page 4
   mkdir -p annotations/book_1/chapter_1
   # Edit or create annotations/book_1/chapter_1/page_004.json
   ```

4. **Verify Locally with the Validation Tool:**
   Ensure your annotations conform strictly to the schema and zero-copyright guardrails:
   ```bash
   pnpm validate
   # Or run directly:
   node validate.js
   ```
   To validate only your modified file:
   ```bash
   pnpm validate:file annotations/book_1/chapter_1/page_004.json
   # Or run directly:
   node validate.js --path annotations/book_1/chapter_1/page_004.json
   ```

5. **Commit and Push:**
   ```bash
   git add annotations/book_1/chapter_1/page_004.json
   git commit -m "feat(annotations): add notes for page 004 lines 1-12"
   git push origin add-page-004-notes
   ```

6. **Open a Pull Request:**
   - Submit your PR against the `main` branch.
   - The automated GitHub Actions CI workflow will immediately run `node validate.js`.
   - Once all automated checks pass, maintainers will review the submission for scholarly depth and copyright adherence.
