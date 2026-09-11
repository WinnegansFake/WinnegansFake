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

## ⚖️ Copyright Notice & Why Book Text is Omitted

James Joyce's *Finnegans Wake* (published in 1939) remains protected under **United States copyright law through the end of 2035** (95 years from publication date). 

To ensure full legal compliance and preserve this project as an enduring public resource:
- **Zero copyrighted text from the book is hosted in this repository.**
- Pull Requests containing lines, stanzas, paragraphs, or substantial portions of the original text will be rejected immediately.
- Annotations map exclusively to standard academic page and line coordinates, referencing only short target lemmas/tokens strictly necessary for scholarly identification.

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

2. **Code & Tooling (`validate.py`, CI workflows, ingestion utilities):**  
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
├── validate.py                            # PR linting & copyright guard script
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
   Ensure you have Python 3.10+ and `jsonschema` installed:
   ```bash
   pip install jsonschema
   python validate.py
   ```
   To validate only your modified file:
   ```bash
   python validate.py --path annotations/book_1/chapter_1/page_004.json
   ```

5. **Commit and Push:**
   ```bash
   git add annotations/book_1/chapter_1/page_004.json
   git commit -m "feat(annotations): add notes for page 004 lines 1-12"
   git push origin add-page-004-notes
   ```

6. **Open a Pull Request:**
   - Submit your PR against the `main` branch.
   - The automated GitHub Actions CI workflow will immediately run `validate.py`.
   - Once all automated checks pass, maintainers will review the submission for scholarly depth and copyright adherence.
