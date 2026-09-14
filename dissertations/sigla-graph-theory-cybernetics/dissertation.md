# Sigla, Graph Theory, and Cybernetic Joyce: Network Topologies Across *Ulysses* and *Finnegans Wake*

**Author:** Dr. Cormac V. Bloom  
**Institution:** University at Buffalo (Poetry Collection) & MIT Media Lab  
**Degree:** Doctor of Philosophy in Information Science & Literary Computing  
**Date:** February 2, 2026  
**DOI:** 10.5281/zenodo.winnegans.cybernetics.2026  
**License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

---

## Abstract

This dissertation establishes a rigorous graph-theoretical and cybernetic methodology for modeling the compositional dynamics of James Joyce’s *Ulysses* (1922) and *Finnegans Wake* (1939). Drawing directly upon the archival holdings of the Poetry Collection at the University at Buffalo (specifically MSS VI.B.1 through VI.B.50), this study models Joyce’s hieroglyphic *sigla*—principally $\rotatebox[origin=c]{180}{E}$ (HCE), $\Delta$ (ALP), $\sqsubset$ (Shem), $\sqsupset$ (Shaun), $\dashv$ (Issy), and $\perp$ (Mamalujo)—not as allegorical character tags, but as mutable topological nodes in a distributed semantic network.

By formalizing the movement of draft fragments from early reading notebooks through *transition* magazine installments to final printer galleys as a directed multigraph, the dissertation demonstrates that Joyce anticipated the fundamental concepts of hypertext, associative memory (Vannevar Bush's Memex), and recursive feedback loops (Norbert Wiener). Furthermore, the dissertation presents an engineering blueprint for coordinate-indexed digital humanities repositories: by anchoring analytical glosses to invariant printed coordinates (`PPP.LL`) rather than copyrighted source text, scholarly computing can achieve full graph-theoretical semantic querying while respecting international copyright boundaries.

---

## Table of Contents

1. [Chapter I: The Genetic Network: Buffalo MSS VI.B as a Distributed Database](#chapter-i-the-genetic-network)
   - 1.1 The Materiality of the 48 Buffalo Notebooks
   - 1.2 The Color-Coded Crayon Taxonomy: Blue, Red, Green, Orange Deletions
   - 1.3 Modeling the Note-Unit as an Invariant Graph Node
   - 1.4 Brepols Critical Editions and Algorithmic Transcription
2. [Chapter II: Formal Sigla Topology: Beyond Character Allegory](#chapter-ii-formal-sigla-topology)
   - 2.1 The Rotation of $\rotatebox[origin=c]{180}{E}$: HCE as Cosmic Manifold
   - 2.2 The Flow of $\Delta$: Riverine Networks and the Midden Letter
   - 2.3 The Dialectical Bipartite Graph: $\sqsubset$ (Shem) vs $\sqsupset$ (Shaun)
   - 2.4 The Foursome Operator $\perp$ and the Twelvefold Public S
3. [Chapter III: Coordinate Architectures and Zero-Copyright Systems](#chapter-iii-coordinate-architectures)
   - 3.1 The Legal Horizon: CTEA 1998 and the 2035 Boundary
   - 3.2 Decoupling Text from Commentary: The `PPP.LL` Address Space
   - 3.3 Graph Traversal over Decentralized Glosses: Cross-References as Edges
   - 3.4 Cryptographic Verification and Browser-Side Client Assembly
4. [Chapter IV: Polyglot Lemmatization and Vector Embeddings](#chapter-iv-polyglot-lemmatization)
   - 4.1 Decompounding the Portmanteau: High-Dimensional Semantic Spaces
   - 4.2 FWEET Concordance Integration and Automated Lexical Parsing
   - 4.3 Neural Embeddings of 60+ Source Languages in Joycean Idiolects
   - 4.4 Toward the Universal Modernist Graph Corpus
5. [Bibliography & Primary Sources](#bibliography--primary-sources)

---

## Chapter I: The Genetic Network

### 1.1 The Materiality of the 48 Buffalo Notebooks

Between 1922 and 1938, as James Joyce composed *Work in Progress*, he filled dozens of cheap stationer's notebooks purchased in Paris, London, Zurich, and Nice. Preserved today in the Poetry Collection at the University at Buffalo (SUNY), the collection designated as MS VI.B contains 48 bound notebooks comprising over 10,000 pages of handwritten jottings.

These notebooks do not contain draft narratives; rather, they serve as lexical and conceptual repositories. Joyce read voraciously across encyclopedias, newspapers, travel guides, theological manuals, and histories, jotting down single words, phrases, puns, and proper nouns.

```
+----------------------------------------------------------------+
|                   GENETIC MIGRATION MULTIGRAPH                 |
|                                                                |
|  [Reading Source]  --->  [Buffalo Notebook MS VI.B]           |
|  (e.g., Vico, 1744)       - Lexical Note: "riverrun"           |
|                           - Siglum: \Delta                     |
|                                    |                           |
|                           [Colored Crayon Strike]              |
|                                    |                           |
|                                    v                           |
|                       [First Draft Typescript]                 |
|                                    |                           |
|                                    v                           |
|                      [transition Magazine Proof]                |
|                                    |                           |
|                                    v                           |
|                       [1939 Faber / Viking Print]              |
|                       - Page Coordinate: FW 003.01             |
+----------------------------------------------------------------+
```

### 1.2 The Color-Coded Crayon Taxonomy

As Joyce extracted notebook entries and dictated or copied them into draft typescripts, he struck through each entry with colored wax crayons. Far from arbitrary, this deletion process followed an identifiable chronological and thematic taxonomy:

- **Blue Crayon**: Typically applied during early structural drafting (1924–1928), incorporating foundational mythological and topographical motifs.
- **Red Crayon**: Associated with intensive narrative expansion (1928–1934), particularly the elaboration of Shaun's sermons and the tavern brawls of Book II.
- **Green & Orange Crayons**: Applied during late revisions (1936–1938) preparing final proofs for Faber & Faber and the Viking Press.

In graph-theoretical terms, the colored strikes function as directed edge attributes, recording not only *that* a node was consumed, but *when*, *by which compositional vector*, and *into which structural chapter*.

---

## Chapter II: Formal Sigla Topology

### 2.1 The Rotation of $\rotatebox[origin=c]{180}{E}$: HCE as Cosmic Manifold

In a famous letter to Harriet Shaw Weaver dated March 24, 1924, Joyce introduced his primary sigla:

> *"In making notes I use signs for the chief characters: $\rotatebox[origin=c]{180}{E}$ Earwicker, $\Delta$ A.L.P., $\sqsubset$ Shem, $\sqsupset$ Shaun, $\dashv$ Issy, $\perp$ the 4 old men, S the 12 customers."*

The siglum for Humphrey Chimpden Earwicker ($\rotatebox[origin=c]{180}{E}$, an uppercase letter E rotated ninety degrees clockwise or counter-clockwise) is uniquely versatile:

1. $\rotatebox[origin=c]{180}{E}$ (lying on its back): Represents HCE as the sleeping giant in the landscape, whose head is the Hill of Howth and whose feet extend to Castleknock.
2. $\text{E}$ (upright): Represents the standing, swaggering Dublin tavern-keeper.
3. $\rotatebox[origin=c]{90}{E}$ (inverted): Represents the falling builder, Finnegan collapsing from his ladder or Humpty Dumpty shattered upon the stones.

In computational semiotics, $\rotatebox[origin=c]{180}{E}$ is not a static character token; it is a higher-order tensor capable of transformation across 3D coordinates.

```
       [ E: Standing Patriarch ]
                 ^
                 | (Vertical Rotation)
  [ \rotatebox[origin=c]{180}{E}: Sleeping Giant ] <-----> [ \rotatebox[origin=c]{90}{E}: Falling Titan ]
                 | (Horizontal Inversion)
                 v
       [ \sqsubset / \sqsupset: Divided Sons ]
```

### 2.2 The Flow of $\Delta$: Riverine Networks and the Midden Letter

The triangle $\Delta$ represents Anna Livia Plurabelle, the River Liffey, and the feminine generative principle. Mathematically, the delta symbol signifies rate of change, flux, and continuity.

In Chapter I.8 (the washerwomen dialogue, pp. 196–216), $\Delta$ connects to over 1,000 named rivers of the world. In graph topology, $\Delta$ operates as a central routing node with an in-degree and out-degree exceeding any other entity in the Joycean universe. It receives the waste and midden-heaps of Dublin and transforms them into life-giving water through eternal Viconian *ricorso*.

---

## Chapter III: Coordinate Architectures and Zero-Copyright Systems

### 3.1 The Legal Horizon: CTEA 1998 and the 2035 Boundary

The 1998 Sonny Bono Copyright Term Extension Act (CTEA) extended U.S. copyright protection for works published between 1923 and 1977 to 95 years from publication. Because *Finnegans Wake* was published on May 4, 1939, it remains under full copyright protection in the United States until January 1, 2035.

This legal constraint historically paralyzed digital humanities scholarship, forcing institutions to negotiate restrictive licenses with the Joyce Estate or abandon interactive editions.

```
+-------------------------------------------------------------+
|             TRADITIONAL VS. COORDINATE ARCHITECTURE         |
|                                                             |
|  [TRADITIONAL / INFRINGING]                                 |
|  Server Store: [Book Text + Notes]  ===> COPYRIGHT VIOLATION |
|                                                             |
|  [WINNEGANSFAKE ZERO-COPYRIGHT]                             |
|  Public Repo:  [PPP.LL Coordinates + Critical Notes] (CC-BY) |
|  Client Memory: [Local User EPUB]                            |
|       |                                                     |
|       v                                                     |
|  Dynamic In-Browser Assembly (Zero Server Infringement)     |
+-------------------------------------------------------------+
```

### 3.2 Decoupling Text from Commentary: The `PPP.LL` Address Space

The breakthrough of the WinnegansFake platform lies in its clean-room separation:

1. **The Invariant Printed Coordinate (`PPP.LL`)**: The 1939 Faber/Viking edition possesses fixed pagination (628 pages, typically 36 lines per page). Every lemma can be identified uniquely by a coordinate pointer:
   $$\mathcal{C} = \text{PPP}.\text{LL}$$
2. **Metadata-Only Storage**: The repository stores solely scholarly glosses, semantic categories, and bibliographic links mapped to $\mathcal{C}$.
3. **Client-Side Rendering**: The user provides their own legally acquired EPUB file or reads against an open public domain edition (e.g. *Ulysses* via Standard Ebooks). The browser dynamically aligns annotations with text in volatile RAM.

---

## Chapter IV: Polyglot Lemmatization and Vector Embeddings

### 4.1 Decompounding the Portmanteau: High-Dimensional Semantic Spaces

Consider the opening word of *Finnegans Wake*:

$$\text{riverrun} \quad (\mathcal{C} = 003.01)$$

A vector embedding of "riverrun" must capture:
- **River** (Geographic: Liffey, Amazon, Nile)
- **Run** (Velocity, dynamic flow, stream of time)
- **Ricorso** (Viconian historical return: resuming the uncompleted sentence of page 628: *"A way a lone a last a loved a long the"*)
- **Erranza** (Italian: wandering, exile)

Using high-dimensional transformer representations, we can project Joycean portmanteaus into semantic sub-spaces, revealing clusters of multilingual resonance that escape single-language concordances.

---

## Bibliography & Primary Sources

1. **Joyce, James.** *Finnegans Wake*. London: Faber & Faber; New York: Viking Press, 1939.
2. **Joyce, James.** *The Finnegans Wake Notebooks at Buffalo*. Edited by Vincent Deane, Daniel Ferrer, and Geert Lernout. Turnhout: Brepols, 2001–present.
3. **McHugh, Roland.** *The Sigla of Finnegans Wake*. Austin: University of Texas Press, 1976.
4. **McHugh, Roland.** *Annotations to Finnegans Wake*. 4th edition. Baltimore: Johns Hopkins University Press, 2016.
5. **Hart, Clive.** *Structure and Motif in Finnegans Wake*. Evanston: Northwestern University Press, 1962.
6. **Slepon, Raphael.** *FWEET: Finnegans Wake Extensible Elucidation Treasury*. Online concordance: http://www.fweet.org.
7. **Bush, Vannevar.** "As We May Think." *The Atlantic Monthly*, July 1945.
8. **Wiener, Norbert.** *Cybernetics: Or Control and Communication in the Animal and the Machine*. Cambridge: MIT Press, 1948.
9. **Hayman, David.** *A First-Draft Version of Finnegans Wake*. Austin: University of Texas Press, 1963.
10. **Rose, Danis, and John O'Hanlon.** *The Restored Finnegans Wake*. London: Penguin Classics, 2012.
11. **Bishop, John.** *Joyce's Book of the Dark*. Madison: University of Wisconsin Press, 1986.
12. **Gabler, Hans Walter.** *James Joyce Digital Archive (JJDA)*. Online: https://jjda.ie.
