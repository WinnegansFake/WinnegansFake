# WinnegansFake Research Corpus

This directory contains scholarly research documents assembled to support annotation quality, SVG figure accuracy, and eventual dissertation regeneration for the WinnegansFake project.

> [!IMPORTANT]
> No copyrighted text from *Finnegans Wake* (Viking/Faber first edition, 1939) is stored here.
> All FW references use the standard `PPP.LL` (page.line) coordinate system.
> U.S. copyright protection runs through **January 1, 2035**.

---

## Index of Research Files

| File | Topic Coverage |
|:---|:---|
| [`vico-bruno-architecture.md`](./vico-bruno-architecture.md) | Giambattista Vico's *Scienza Nuova* (three ages, ricorso, verum-factum, thunderclap); Giordano Bruno's *Coincidentia Oppositorum*; the four-book structural mapping of FW (pp 3–628); Beckett's 1929 essay; SVG generation guidance |
| [`buffalo-notebooks-sigla.md`](./buffalo-notebooks-sigla.md) | The 48 Buffalo MSS VI.B notebooks (Brepols edition); the complete sigla system (HCE ∐, ALP Δ, Shem ⊏, Shaun ⊐, Issy ⊣, Mamalujo ⊥, The Twelve S); full character studies for all major Dramatis Personae |
| [`scholarship-editions-digital.md`](./scholarship-editions-digital.md) | Chronological foundational scholarship (Beckett 1929 → Hayman 1990); the ten hundred-letter thunderclaps (table with FW locations); the FW p. 293 Euclidean diagram; digital humanities projects (FWEET, JJDA, Brepols, Genetic Joyce Studies); copyright history; publication history |
| [`intertexts-mythology.md`](./intertexts-mythology.md) | Egyptian *Book of the Dead* (Bishop/Osiris-Isis thesis); *Book of Kells* & the Tunc page; Wagner's *Tristan und Isolde* & Bédier; Jonathan Swift (Stella/Vanessa/Issy); Henrik Ibsen's *Master Builder*; Celtic mythology (Finn MacCool, Tuatha Dé Danann); Humpty Dumpty / *Felix Culpa*; Dublin topography as universal landscape |

---

## Key Reference Coordinates

### FW Page/Line References

| Topic | FW Location |
|:---|:---|
| First thunderclap (the Fall) | FW 3.15-17 |
| The Viconian "vicus of recirculation" | FW 3.02 |
| "Sir Tristram" opening (Arthurian/Tristan) | FW 3.04-07 |
| Tower of Babel (second thunder) | FW 23.05-08 |
| The Mamafesta / Letter chapter | FW 104–125 |
| The ALP washerwomen chapter | FW 196–216 |
| Nightlessons chapter (Dolph's diagram) | FW 260–308 |
| The Euclidean diagram | **FW 293** (only diagram in 1939 ed.) |
| Shaun's four Book III manifestations | FW 403–590 |
| ALP's final monologue | FW 619–628 |

### Essential Online Resources

| Resource | URL |
|:---|:---|
| FWEET (100,000+ annotations) | http://www.fweet.org |
| James Joyce Digital Archive | https://jjda.ie |
| Genetic Joyce Studies (journal) | https://www.geneticjoycestudies.org |
| Beckett's *Our Exagmination* (Archive) | https://archive.org/details/ourexagminationr0000unse |
| Egyptian Book of the Dead (Budge trans.) | https://www.gutenberg.org/ebooks/1300 |
| Stanford SEP — Giambattista Vico | https://plato.stanford.edu/entries/vico/ |

---

## Key Scholars Quick Reference

| Scholar | Work | Year | Contribution |
|:---|:---|:---|:---|
| Samuel Beckett | "Dante... Bruno. Vico.. Joyce" | 1929 | First critical framework; Viconian structure |
| Joseph Campbell & H.M. Robinson | *A Skeleton Key to Finnegans Wake* | 1944 | First narrative reconstruction |
| James S. Atherton | *The Books at the Wake* | 1959 | Complete catalogue of literary allusions |
| Clive Hart | *Structure and Motif in Finnegans Wake* | 1962 | Definitive structural/Viconian mapping |
| Roland McHugh | *The Sigla of Finnegans Wake* | 1976 | Sigla system decoding |
| Adaline Glasheen | *A Third Census of Finnegans Wake* | 1977 | Complete character index |
| Roland McHugh | *Annotations to Finnegans Wake* (4th ed.) | 1980/2016 | Line-by-line apparatus (the essential tool) |
| Frances Motz Boldereff | *Hermes to His Son Thoth* | 1968 | Joyce's use of Giordano Bruno |
| John Bishop | *Joyce's Book of the Dark* | 1986 | Egyptian/somatic/physiological reading |
| David Hayman | *The Wake in Transit* | 1990 | Genetic criticism; the Arranger concept |
| Donald Phillip Verene | *Vico and Joyce* | 1987 | Philosophical mapping of Vico→Wake |
| Eric McLuhan | *The Role of Thunder in FW* | 1997 | The ten thunderclaps as grammar |
| Raphael Slepon | FWEET | ongoing | 100,000+ digital glosses |

---

## Notes for Dissertation Regeneration

Once research review is complete, the following steps remain:

1. **Update SVG figures** in `figures/` if research reveals corrections needed (especially sigla colors, thunderclap positions on the Viconian wheel, etc.)
2. **Run** `python3 scripts/write_dissertation.py` to regenerate `dissertation.md` with SVG figure references
3. **Check image rendering** in `DissertationViewer.tsx` — the `markdownComponents` object may need a custom `img` renderer to prepend `getBasePath()` for GitHub Pages deployment
4. **Run validation suite:** `pnpm validate && pnpm test && pnpm build`
5. **Commit:** `git add figures/ research/ scripts/ && git commit -m "feat(dissertation): SVG infographics and research corpus"`
