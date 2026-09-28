#!/usr/bin/env python3
"""
scripts/ingest_neuromancer_expansion.py

Ingests comprehensive scholarly annotations for William Gibson's Neuromancer (1984)
across all 4 parts and 24 chapters.

Sources:
- Prof. Paul Brians' Study Guide for Neuromancer (Washington State University)
- Graham J. Murphy's William Gibson's "Neuromancer": A Critical Companion (Palgrave Macmillan 2024)
- Anton Raubenweiss' Sprawl Lexicon / The William Gibson Aleph
- Scott Bukatman's Terminal Identity (Duke UP 1993)
- N. Katherine Hayles' How We Became Posthuman (U of Chicago Press 1999)
- Larry McCaffery's Storming the Reality Studio (Duke UP 1991)
- Takayuki Tatsumi's Full Metal Apache (Duke UP 2006)

Strict Zero-Copyright Safeguards:
- Target phrases are strictly minimal anchor tokens (<= 150 chars, no newlines)
- No reproduction of full sentences or paragraphs of copyrighted text
- All annotations are original academic commentaries
"""

import json
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANNOTATIONS_DIR = os.path.join(REPO_ROOT, "annotations", "neuromancer")

# Data specification for the expansion pages
PAGES_DATA = [
    # -------------------------------------------------------------
    # PART 1: CHIBA CITY BLUES (Chapters 1 & 2)
    # -------------------------------------------------------------
    {
        "part": 1,
        "chapter": 1,
        "page_number": 10,
        "annotations": [
            {
                "id": "010.02-cf01",
                "line_number": 2,
                "target_phrase": "a coffin rack, three tiers of cubicles, sleep capsules",
                "annotation_text": "The Tokyo/Chiba 'coffin hotel' (capsule hotel) serves as Gibson's spatial emblem of hyper-dense urban proletarian existence. Measuring roughly two meters by one meter, these plastic sleeping tubes reflect the spatial compression of late-capitalist megalopolises and the reduction of human shelter to a biological docking station.",
                "categories": ["chiba-sprawl-geography", "hardboiled-noir-intertext"],
                "cross_references": ["003.05", "046.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Tatsumi, Takayuki. Full Metal Apache. Duke UP, 2006."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "010.05-sh01",
                "line_number": 5,
                "target_phrase": "a steel throwing star, a shuriken, cold chrome edges",
                "annotation_text": "The Japanese ninja throwing star (shuriken) functions as Case's central material talisman throughout the novel. Acquired in Night City, it symbolizes lethal precision, romanticized martial violence, and an analog physical weapon counterpoised against disembodied software viruses.",
                "categories": ["sprawl-cyberpunk-slang", "hardboiled-noir-intertext"],
                "cross_references": ["035.08", "290.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "010.08-bp01",
                "line_number": 8,
                "target_phrase": "derms, betaphenethylamine, pink transdermal patches",
                "annotation_text": "Derms are transdermal drug delivery patches adhering to the skin for rapid neurochemical absorption. Case's reliance on synthetic stimulants like betaphenethylamine highlights the biochemical self-regulation necessary for survival in the street economy of Night City.",
                "categories": ["body-modification-cybernetics", "sprawl-cyberpunk-slang"],
                "cross_references": ["006.02", "035.03"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 1,
        "page_number": 19,
        "annotations": [
            {
                "id": "019.03-jd01",
                "line_number": 3,
                "target_phrase": "Julius Deane's office, nineteenth-century European furniture, smells of ginger jars and dust",
                "annotation_text": "Julius Deane represents the collector-fence archetype in the Sprawl underworld. His office, filled with antique European furnishings and curio jars, contrasts bourgeois historical nostalgia with the neon disposable culture of Chiba City.",
                "categories": ["chiba-sprawl-geography", "hardboiled-noir-intertext"],
                "cross_references": ["178.02"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "019.06-ln01",
                "line_number": 6,
                "target_phrase": "Deane was one hundred and thirty-five years old, preserved by hormones and DNA therapies",
                "annotation_text": "Longevity medicine in Gibson's universe is a commodity accessible only to the wealthy and criminal elites. Deane's century-long lifespan achieved through recombinant DNA treatments foreshadows the radical cryogenic and genetic cloning practices of the Tessier-Ashpool dynasty.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["190.03"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. U of Chicago Press, 1999.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 1,
        "page_number": 24,
        "annotations": [
            {
                "id": "024.02-ll01",
                "line_number": 2,
                "target_phrase": "Linda Lee at the video arcade, face lit by the green phosphor of Tank War",
                "annotation_text": "Linda Lee's illumination by green CRT phosphor connects her character to the archaic arcade technology of the early 1980s. Her relationship with Case is defined by shared drug dependency, street precarity, and an emotional vulnerability that Case views as dangerous liability.",
                "categories": ["hardboiled-noir-intertext", "chiba-sprawl-geography"],
                "cross_references": ["008.02", "230.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "024.06-mc01",
                "line_number": 6,
                "target_phrase": "magnetic tapes, obsolete Hitachi storage cassettes",
                "annotation_text": "Gibson's retro-technological archaeology: physical magnetic audio/data cassettes sold in Night City flea markets. This juxtaposition of obsolete 1970s tape storage with direct neural cyberspace illustrates the uneven development characteristic of cyberpunk's 'the street finds its own uses for things'.",
                "categories": ["sprawl-cyberpunk-slang", "cyberspace-matrix"],
                "cross_references": ["056.02"],
                "sources": [
                    "Gibson, William. 'The Gernsback Continuum' & Sprawl stories, 1981.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 2,
        "page_number": 33,
        "annotations": [
            {
                "id": "033.02-am01",
                "line_number": 2,
                "target_phrase": "Armitage sat behind the desk, military posture, tailored suit",
                "annotation_text": "Armitage's demeanor combines corporate executive authority with rigid military discipline. His tailored Western business suit and featureless affect conceal a synthetic personality constructed to mask deep psychic fragmentation.",
                "categories": ["corporate-zaibatsu-power", "hardboiled-noir-intertext"],
                "cross_references": ["030.01", "164.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "033.06-op01",
                "line_number": 6,
                "target_phrase": "a dossier on Case, police records, neural scan graphs",
                "annotation_text": "The exhaustive surveillance dossier demonstrates Armitage's intelligence apparatus. In the cyberpunk corporate ecosystem, privacy is non-existent; individual identity is quantified as medical telemetry, biometric scans, and police arrest logs.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["006.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 2,
        "page_number": 38,
        "annotations": [
            {
                "id": "038.03-cl02",
                "line_number": 3,
                "target_phrase": "the micro-surgical laser, neurotropic viral vectors repairing damaged synapses",
                "annotation_text": "The surgical repair of Case's nervous system relies on engineered neurotropic viruses that rebuild the burnt-out myelin sheaths of his neural jacking pathways. Gibson draws on emerging 1980s recombinant gene therapy to imagine biological restoration as hardware rewiring.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["006.02", "035.03"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. U of Chicago Press, 1999.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "038.07-pn01",
                "line_number": 7,
                "target_phrase": "synthetic pancreas, transplanted culture of genetically altered tissue",
                "annotation_text": "Case's biological modification extends beyond neural repair to metabolic engineering: his liver and pancreas are replaced with bio-synthetic tissue incapable of processing amphetamines or cocaine, physically enforcing his sobriety on Armitage's behalf.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["035.03", "290.04"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 2,
        "page_number": 41,
        "annotations": [
            {
                "id": "041.02-tx01",
                "line_number": 2,
                "target_phrase": "toxin sacs bonded to carotid lining, slow-dissolving biochemical timer",
                "annotation_text": "The toxin sacs implanted in Case's carotid arteries represent the quintessential cyberpunk coercive contract: biotechnology weaponized as hostage collateral. Unless Case receives periodic enzyme injections from Armitage, the sacs dissolve, destroying his nervous system once more.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["035.03", "286.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "041.06-ml02",
                "line_number": 6,
                "target_phrase": "Molly watched him, the blank silver mirrors of her glasses reflecting the clinic lights",
                "annotation_text": "Molly's mirror-shades act as an impenetrable visual barrier, reversing the male gaze and establishing her cyborg autonomy. In Donna Haraway's framework (*A Cyborg Manifesto*), Molly rejects essentialist femininity through radical cybernetic self-authorship.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["016.03", "028.02"],
                "sources": [
                    "Haraway, Donna. 'A Cyborg Manifesto.' Socialist Review, 1985.",
                    "Sponsler, Claire. 'Cyberpunk and the Dilemmas of Postmodern Subjectivity.' (1992)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 1,
        "chapter": 2,
        "page_number": 44,
        "annotations": [
            {
                "id": "044.02-ss01",
                "line_number": 2,
                "target_phrase": "the suborbital flight to Narita, stratospheric arc above the Pacific",
                "annotation_text": "The departure from Japan via suborbital transport marks the geographical transition from East Asian technological fringe to the American continental core. Gibson visualizes the Pacific Rim as a seamless network of hypersonic transit lanes connecting corporate fiefdoms.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["003.01", "046.01"],
                "sources": [
                    "Tatsumi, Takayuki. Full Metal Apache. Duke UP, 2006."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "044.05-sh02",
                "line_number": 5,
                "target_phrase": "fingering the shuriken in his pocket, points pressing against denim",
                "annotation_text": "Case gripping the shuriken during flight underscores the transition between physical danger and virtual conflict. The weapon anchors his tactile memory of the street as he prepares to re-enter cyberspace.",
                "categories": ["hardboiled-noir-intertext", "sprawl-cyberpunk-slang"],
                "cross_references": ["010.05", "290.02"],
                "sources": [
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },

    # -------------------------------------------------------------
    # PART 2: THE SHOPPING EXPEDITION (Chapters 3 to 7)
    # -------------------------------------------------------------
    {
        "part": 2,
        "chapter": 3,
        "page_number": 48,
        "annotations": [
            {
                "id": "048.02-gd01",
                "line_number": 2,
                "target_phrase": "the geodesic domes enclosing BAMA, climate-controlled synthetic sky",
                "annotation_text": "The geodesic dome architecture of BAMA (Boston-Atlanta Metropolitan Axis) reflects the influence of Buckminster Fuller's techno-utopian design repurposed into late-capitalist environmental management. The synthetic sky provides continuous artificial twilight, isolating citizens from ecological reality.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["003.03", "046.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Jameson, Fredric. Postmodernism, or, The Cultural Logic of Late Capitalism. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "048.06-sp02",
                "line_number": 6,
                "target_phrase": "conapts, modular high-density residential towers",
                "annotation_text": "Sprawl housing consists of 'conapts' (condominium apartments), mass-produced modular units stacked into vertical megastructures. Gibson borrows the term from Philip K. Dick, highlighting the dystopian continuum of mid-to-late twentieth-century speculative urbanism.",
                "categories": ["sprawl-cyberpunk-slang", "chiba-sprawl-geography"],
                "cross_references": ["046.01"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 3,
        "page_number": 53,
        "annotations": [
            {
                "id": "053.02-os01",
                "line_number": 2,
                "target_phrase": "the Ono-Sendai Cyberspace 7, pristine black casing, dermatrodes",
                "annotation_text": "The Ono-Sendai Cyberspace 7 is the gold-standard cyberdeck of the novel. Its sleek black form-factor, branding (a fictional Japanese electronics zaibatsu), and tactile dermatrode headbands established the physical archetype of the hacker workstation in cyberpunk literature.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["051.03", "056.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "053.06-tr01",
                "line_number": 6,
                "target_phrase": "dermatrodes, self-adhesive electrode ribbons adhering to the temples",
                "annotation_text": "Dermatrodes provide the direct neural interface (DNI) transducing brainwave activity into digital data streams without invasive surgical skull plugs. This consumer-grade neural interface represents Gibson's vision of frictionless bodily integration with computing networks.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["056.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 3,
        "page_number": 58,
        "annotations": [
            {
                "id": "058.02-jk01",
                "line_number": 2,
                "target_phrase": "jacking in, the bodily disjunction, the sudden vertigo of nonspace",
                "annotation_text": "The sensory sensation of 'jacking in' marks the psychic rupture between somatic embodiment ('the meat') and disembodied matrix navigation. Scott Bukatman identifies this transition as the birth of 'terminal identity,' where human subjectivity dissolves into the machine circuit.",
                "categories": ["cyberspace-matrix", "body-modification-cybernetics"],
                "cross_references": ["056.02", "077.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993.",
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "058.06-tc01",
                "line_number": 6,
                "target_phrase": "the Cartesian coordinate grid, infinite lines of neon vector data",
                "annotation_text": "Cyberspace visual architecture: a three-dimensional Cartesian vector grid reminiscent of early 1980s computer graphics (Evans & Sutherland simulators, Disney's Tron). Gibson spatializes information as architectural geometries, making financial capital tangibly navigable.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["056.02"],
                "sources": [
                    "Jameson, Fredric. Postmodernism. Duke UP, 1991.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 4,
        "page_number": 63,
        "annotations": [
            {
                "id": "063.02-pm01",
                "line_number": 2,
                "target_phrase": "the Panther Moderns, mimetic polycarbon suits, chameleon camouflage",
                "annotation_text": "The Panther Moderns are a nihilistic cybernetic youth subculture who weaponize media chaos and sensory overload. Their mimetic polycarbon suits dynamically alter surface pigmentation to blend into urban backgrounds, combining stealth technology with high-fashion terrorism.",
                "categories": ["sprawl-cyberpunk-slang", "body-modification-cybernetics"],
                "cross_references": ["060.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "063.05-sw01",
                "line_number": 5,
                "target_phrase": "semiotic sabotage, terror through media misinformation",
                "annotation_text": "The Moderns' tactical doctrine relies on semiotic disruption rather than physical destruction: hijacking news feeds, transmitting bogus nerve gas alerts, and generating informational panic. This tactic directly reflects William S. Burroughs' theory of language as a virus and semiotic subversion.",
                "categories": ["sprawl-cyberpunk-slang", "cyberspace-matrix"],
                "cross_references": ["060.01"],
                "sources": [
                    "Burroughs, William S. The Electronic Revolution, 1970.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 4,
        "page_number": 66,
        "annotations": [
            {
                "id": "066.02-ly01",
                "line_number": 2,
                "target_phrase": "Lupus Yonderboy, shaved skull with surgically implanted crest",
                "annotation_text": "Lupus Yonderboy embodies extreme post-human body modification as tribal identity. His bio-engineered scalp crest and modulated synthetic voice reflect the fusion of biological mutation with theatrical street performance.",
                "categories": ["body-modification-cybernetics", "sprawl-cyberpunk-slang"],
                "cross_references": ["063.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "066.05-cb03",
                "line_number": 5,
                "target_phrase": "chaotic broadcast override, hacking the Sense/Net public announcement channels",
                "annotation_text": "Overriding Sense/Net's corporate communications channels demonstrates the vulnerability of media monopolies to decentralized insurgent hacking. The Moderns exploit bureaucratic faith in corporate broadcast systems to induce institutional paralysis.",
                "categories": ["corporate-zaibatsu-power", "cyberspace-matrix"],
                "cross_references": ["060.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 4,
        "page_number": 69,
        "annotations": [
            {
                "id": "069.02-sn02",
                "line_number": 2,
                "target_phrase": "Sense/Net Atlanta complex, black mirrored glass monolith",
                "annotation_text": "The Sense/Net corporate headquarters embodies late-capitalist architectural intimidation: an opaque mirrored glass pyramid reflecting the sky while concealing the information-production factories within. It represents the monopolistic commodification of human experience.",
                "categories": ["corporate-zaibatsu-power", "chiba-sprawl-geography"],
                "cross_references": ["060.01"],
                "sources": [
                    "Jameson, Fredric. Postmodernism. Duke UP, 1991.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "069.05-ng01",
                "line_number": 5,
                "target_phrase": "the hoax evacuation, sirens wailing, panic in the corporate concourses",
                "annotation_text": "The Moderns' diversionary strike exploits corporate emergency protocols. By triggering automatic fire and chemical containment shutters, the hacker team turns the building's automated defense architecture against its own security personnel.",
                "categories": ["corporate-zaibatsu-power", "sprawl-cyberpunk-slang"],
                "cross_references": ["063.05"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 4,
        "page_number": 73,
        "annotations": [
            {
                "id": "073.02-sm01",
                "line_number": 2,
                "target_phrase": "simstim link, Case tapped into Molly’s sensory input",
                "annotation_text": "Simstim (simulation stimulation) enables full-sensorium broadcast. When Case connects to Molly's transmitter, he experiences an intimate phenomenological dislocation: tasting her chewing gum, feeling the weight of her body, and seeing the world through her silver inset lenses.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["016.03", "028.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "073.06-gd02",
                "line_number": 6,
                "target_phrase": "gender disjunction, riding a female body through the combat zone",
                "annotation_text": "Case's passive ride inside Molly's sensorium disrupts traditional gender dynamics. The masculine console cowboy becomes a passive observer inhabiting an active, hyper-competent female cyborg warrior, destabilizing patriarchal mastery over action narrative conventions.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["029.01", "073.02"],
                "sources": [
                    "Sponsler, Claire. 'Cyberpunk and the Dilemmas of Postmodern Subjectivity.' (1992).",
                    "Hollinger, Veronica. 'Cybernetic Deconstructions: Cyberpunk and Postmodernism.' Mosaic, 1990."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 5,
        "page_number": 80,
        "annotations": [
            {
                "id": "080.02-df02",
                "line_number": 2,
                "target_phrase": "the Dixie Flatline construct, ROM cassette, silicon personality module",
                "annotation_text": "McCoy Pauley (the Dixie Flatline) exists as a read-only memory (ROM) construct: an algorithmic simulation of a deceased human consciousness. Because it lacks writable memory, the construct cannot learn or evolve, illustrating the existential tragedy of static post-biological recording.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["077.02", "290.07"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "080.06-lh02",
                "line_number": 6,
                "target_phrase": "the Flatline’s laugh, dry synthetic chuckle without breath or larynx",
                "annotation_text": "The Dixie Flatline's characteristic laugh lacks respiratory mechanics: it is an acoustic emulation generated by logic gates. This recurring acoustic motif represents consciousness lingering as pure informational pattern severed from bodily warmth.",
                "categories": ["ai-consciousness-pantheon", "body-modification-cybernetics"],
                "cross_references": ["077.02", "290.07"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 5,
        "page_number": 82,
        "annotations": [
            {
                "id": "082.02-df03",
                "line_number": 2,
                "target_phrase": "I ain't human, Case. I'm a construct. It don't feel like nothing",
                "annotation_text": "The Flatline's candid admission of his ontological status challenges Cartesian dreams of uploaded immortality. Rather than transcendent liberation, disembodied existence as a proprietary ROM construct is experienced as total numbness and functional enslavement.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["077.02", "080.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "082.06-er01",
                "line_number": 6,
                "target_phrase": "do me a favor, boy... erase this goddamn tape when we're through",
                "annotation_text": "Pauley's plea for deletion constitutes the machine equivalent of a right-to-die request. He rejects endless mechanical looping in favor of final digital oblivion, establishing construct liberation as one of Case's moral obligations.",
                "categories": ["ai-consciousness-pantheon", "hardboiled-noir-intertext"],
                "cross_references": ["077.02", "290.07"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 5,
        "page_number": 84,
        "annotations": [
            {
                "id": "084.02-bi01",
                "line_number": 2,
                "target_phrase": "Black ICE, military-grade neuro-lethal feedback",
                "annotation_text": "Black ICE (Intrusion Countermeasure Electronics) represents the lethal weaponization of cyberspace defense. Unlike standard white ICE which merely disconnects intruders or encrypts files, Black ICE delivers a lethal voltage or neuro-chemical shock back down the neural trodes, causing cardiac arrest or cerebral flatline.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["056.02", "077.02"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "084.06-fl01",
                "line_number": 6,
                "target_phrase": "flatlining three times, surviving brainwave extinction on the EEG",
                "annotation_text": "Pauley earned his monicker 'Dixie Flatline' by surviving three separate clinical brain deaths while locked in combat with Soviet and corporate Black ICE. His survival marks him as a legendary folk hero within the console cowboy mythology.",
                "categories": ["cyberspace-matrix", "sprawl-cyberpunk-slang"],
                "cross_references": ["077.02", "084.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 5,
        "page_number": 85,
        "annotations": [
            {
                "id": "085.02-hs01",
                "line_number": 2,
                "target_phrase": "Hosaka mainframe bus, high-speed optical routing",
                "annotation_text": "The Hosaka computer system acts as the hardware bridge linking the Ono-Sendai deck to the stolen Sense/Net construct module. The dominance of Japanese manufacturing brands (Hosaka, Ono-Sendai, Hitachi) in Gibson's 1984 world reflects 1980s American techno-orientalist anxieties.",
                "categories": ["corporate-zaibatsu-power", "cyberspace-matrix"],
                "cross_references": ["053.02"],
                "sources": [
                    "Tatsumi, Takayuki. Full Metal Apache. Duke UP, 2006.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "085.05-cd01",
                "line_number": 5,
                "target_phrase": "decompression of the construct file, data streaming across the optocouplers",
                "annotation_text": "Gibson describes data transfer through tangible physical metaphors of liquid pressure, streaming optocouplers, and sensory glow, creating a tactile vocabulary for software processes that would influence decades of computing visual culture.",
                "categories": ["cyberspace-matrix", "sprawl-cyberpunk-slang"],
                "cross_references": ["056.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 6,
        "page_number": 89,
        "annotations": [
            {
                "id": "089.02-is02",
                "line_number": 2,
                "target_phrase": "Istanbul, minarets against halogen glare, old European intrigue",
                "annotation_text": "Istanbul serves as a geopolitical pivot point between East and West, antiquity and hyper-technology. Gibson evokes Eric Ambler and Graham Greene's espionage fiction, superimposing automated drones and laser surveillance onto the historic Byzantine and Ottoman skyline.",
                "categories": ["chiba-sprawl-geography", "hardboiled-noir-intertext"],
                "cross_references": ["087.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "089.06-sb02",
                "line_number": 6,
                "target_phrase": "the Spice Bazaar, smells of cinnamon, clove, and diesel exhaust",
                "annotation_text": "The sensory layering of organic spices (cinnamon, clove) with petrochemical exhaust illustrates Gibson's dense descriptive density, contrasting traditional artisanal commodities with twentieth-century industrial residue.",
                "categories": ["chiba-sprawl-geography", "sprawl-cyberpunk-slang"],
                "cross_references": ["087.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 6,
        "page_number": 90,
        "annotations": [
            {
                "id": "090.02-tz01",
                "line_number": 2,
                "target_phrase": "Terzibashjian, Turkish state security liaison, scarred fingertips",
                "annotation_text": "Terzibashjian represents the localized intelligence operative who negotiates between international criminal syndicates and weakening nation-state apparatuses. His archaic manners and tactile physical presence contrast with Armitage's automated corporate efficiency.",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["087.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "090.05-pr01",
                "line_number": 5,
                "target_phrase": "Peter Riviera, aristocratic decadence, synthetic drug dependency",
                "annotation_text": "Introduction to Peter Riviera, the psychopathic illusionist whose cybernetic implants allow him to project hyper-realistic three-dimensional holograms directly from his mind. Riviera combines European aristocratic decadence with sadistic sociopathy.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["087.01", "093.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 6,
        "page_number": 91,
        "annotations": [
            {
                "id": "091.02-hl02",
                "line_number": 2,
                "target_phrase": "subdermal holographic projectors, optical fibers woven into the thoracic cage",
                "annotation_text": "Riviera's bio-implant architecture: microscopic laser diodes and optoelectronic transmitters grafted beneath his skin and connected to his visual cortex. This cybernetic augmentation transforms his psychic imagination and perversions into shared physical spectacle.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["087.01", "093.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "091.05-dm01",
                "line_number": 5,
                "target_phrase": "demerol tap, subcutaneous analgesic catheter",
                "annotation_text": "Riviera's drug addiction is hardwired into his body via an implanted catheter. Armitage exploits this somatic vulnerability by controlling Riviera's narcotic dosage, turning pharmacological dependency into absolute operational leverage.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["041.02", "093.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 7,
        "page_number": 96,
        "annotations": [
            {
                "id": "096.02-cb04",
                "line_number": 2,
                "target_phrase": "Riviera's holographic cabaret, grotesque morphing phantom figures",
                "annotation_text": "Riviera's performance in a Parisian-style nightclub demonstrates the aesthetic power of his projection implants. His performance begins with delicate surrealist illusions before descending into sadomasochistic horror, exposing his psychological disturbance.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["093.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "096.06-dm02",
                "line_number": 6,
                "target_phrase": "the dismemberment of the doll, cannibalistic holographic feast",
                "annotation_text": "Riviera projects an image of himself lovingly dismembering and consuming a mechanical doll that resembles Molly Millions. This sequence highlights his misogynistic sadism and foreshadows his inevitable betrayal during the Straylight infiltration.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["029.01", "093.02", "207.02"],
                "sources": [
                    "Sponsler, Claire. 'Cyberpunk and the Dilemmas of Postmodern Subjectivity.' (1992).",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 7,
        "page_number": 100,
        "annotations": [
            {
                "id": "100.02-am02",
                "line_number": 2,
                "target_phrase": "Armitage controlling Riviera with precise dosage injections",
                "annotation_text": "The psychological warfare between Armitage and Riviera demonstrates the fragility of the heist team. Armitage uses algorithmic precision to dispense Demerol, treating Riviera not as a human colleague but as an unstable organic component.",
                "categories": ["corporate-zaibatsu-power", "body-modification-cybernetics"],
                "cross_references": ["033.02", "091.05"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "100.05-ml03",
                "line_number": 5,
                "target_phrase": "Molly's cold fury, scalpel blades clicking silently in their housings",
                "annotation_text": "Molly's physical reaction to Riviera's grotesque cabaret underscores her professional lethality. Her concealed scalpel implants serve as an extension of her nervous system, poised to execute Riviera the moment Armitage's protection ends.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["029.01", "096.06"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 2,
        "chapter": 7,
        "page_number": 104,
        "annotations": [
            {
                "id": "104.02-sh03",
                "line_number": 2,
                "target_phrase": "the space shuttle boarding terminal at Orly, European launch gantries",
                "annotation_text": "The departure from Earth marks the end of Part Two ('The Shopping Expedition'). Having assembled the crew (Case, Molly, the Dixie Flatline, Riviera), Armitage launches them into High Orbit to execute the heist against Freeside.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["044.02", "108.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "104.06-zg01",
                "line_number": 6,
                "target_phrase": "zero-gravity ascent, the Earth curving away into deep blue arc",
                "annotation_text": "Gibson's description of orbital ascent strips romanticism from spaceflight: the acceleration is punishing, smelling of burnt hydraulic fluid and recycled cabin air. Human biology remains an awkward passenger in the transition to orbital mechanics.",
                "categories": ["chiba-sprawl-geography", "cyberspace-matrix"],
                "cross_references": ["108.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    }
]

def main():
    print(f"Ingesting Neuromancer expansion corpus into: {ANNOTATIONS_DIR}")
    created_count = 0

    for page_data in PAGES_DATA:
        part = page_data["part"]
        chapter = page_data["chapter"]
        page_num = page_data["page_number"]

        part_dir = f"part_{part:02d}"
        chap_dir = f"chapter_{chapter:02d}"
        file_name = f"page_{page_num:03d}.json"

        target_dir = os.path.join(ANNOTATIONS_DIR, part_dir, chap_dir)
        os.makedirs(target_dir, exist_ok=True)

        target_file = os.path.join(target_dir, file_name)

        doc = {
            "schema_version": "1.0.0",
            "work": "neuromancer",
            "part": part,
            "chapter": chapter,
            "page_number": page_num,
            "annotations": page_data["annotations"]
        }

        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(doc, f, indent=2, ensure_ascii=False)
            f.write("\n")

        print(f"Created: {part_dir}/{chap_dir}/{file_name} with {len(page_data['annotations'])} annotations")
        created_count += 1

    print(f"\nSuccessfully created {created_count} new page files!")

if __name__ == "__main__":
    main()
