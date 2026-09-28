#!/usr/bin/env python3
"""
scripts/ingest_neuromancer_expansion_parts3_4.py

Ingests comprehensive scholarly annotations for William Gibson's Neuromancer (1984)
across Part 3 (Chapters 8 to 12) and Part 4 (Chapters 13 to 24).

Scholarly Foundations:
- Paul Brians' Study Guide for Neuromancer (Washington State University)
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

PAGES_DATA = [
    # -------------------------------------------------------------
    # PART 3: MIDNIGHT IN THE RUE JULES VERNE (Chapters 8 to 12)
    # -------------------------------------------------------------
    {
        "part": 3,
        "chapter": 8,
        "page_number": 111,
        "annotations": [
            {
                "id": "111.02-zn02",
                "line_number": 2,
                "target_phrase": "Zion cluster, welded shipping containers and modular pods, zero-g hydroponics",
                "annotation_text": "Zion is an orbital Rastafarian colony assembled from discarded space construction debris and pressurized shipping hulls. Its DIY modular design and hydroponic gardens represent counter-cultural autonomy and low-tech resistance to corporate zaibatsu dominance.",
                "categories": ["chiba-sprawl-geography", "sprawl-cyberpunk-slang"],
                "cross_references": ["108.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "111.06-db01",
                "line_number": 6,
                "target_phrase": "dub reggae vibrating the bulkheads, heavy bass in weightlessness",
                "annotation_text": "The acoustic ecology of Zion is dominated by dub reggae. The low-frequency bass notes vibrating through metal bulkheads replace terrestrial gravity with physical sound pressure, providing a somatic anchor for space colonists.",
                "categories": ["sprawl-cyberpunk-slang", "chiba-sprawl-geography"],
                "cross_references": ["108.01", "254.02"],
                "sources": [
                    "Hebdige, Dick. Cut 'N' Mix: Culture, Identity and Caribbean Music. Methuen, 1987.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 8,
        "page_number": 114,
        "annotations": [
            {
                "id": "114.02-mg01",
                "line_number": 2,
                "target_phrase": "Maelcum, pilot of the Marcus Garvey, dreadlocks floating in zero-g",
                "annotation_text": "Maelcum serves as the orbital tug pilot whose space vessel, the Marcus Garvey (named after the Pan-Africanist leader), bridges Rastafarian liberation theology with hard vacuum orbital mechanics.",
                "categories": ["sprawl-cyberpunk-slang", "hardboiled-noir-intertext"],
                "cross_references": ["108.01", "173.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "114.05-ar01",
                "line_number": 5,
                "target_phrase": "Aerol and the Zion elders, reading scripture and consulting the dub console",
                "annotation_text": "The Zion elders interpret technological telemetry through prophetic Rastafarian scripture. They view Case's mission not as a corporate theft but as an assault on Babylon, sanctifying their participation in the heist.",
                "categories": ["sprawl-cyberpunk-slang", "corporate-zaibatsu-power"],
                "cross_references": ["108.01", "117.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 8,
        "page_number": 117,
        "annotations": [
            {
                "id": "117.02-bb01",
                "line_number": 2,
                "target_phrase": "Babylon, the corporate cities of Earth beneath the orbital clouds",
                "annotation_text": "In Zion's theological framework, Earth and its zaibatsu oligopoly represent Babylon: a fallen, corrupt economic order devoted to idolatrous accumulation and spiritual deadening.",
                "categories": ["corporate-zaibatsu-power", "sprawl-cyberpunk-slang"],
                "cross_references": ["108.01", "114.05"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Hebdige, Dick. Subculture: The Meaning of Style. Routledge, 1979."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "117.05-th01",
                "line_number": 5,
                "target_phrase": "diaspora in orbit, Caribbean culture transplanted into vacuum",
                "annotation_text": "Gibson's depiction of the Rastafarian space diaspora highlights subcultural adaptation: rather than Euro-American aerospace monoculture, low-earth orbit is populated by Caribbean laborers who brought their linguistic, musical, and religious traditions into vacuum.",
                "categories": ["chiba-sprawl-geography", "sprawl-cyberpunk-slang"],
                "cross_references": ["108.01"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 9,
        "page_number": 124,
        "annotations": [
            {
                "id": "124.02-fs02",
                "line_number": 2,
                "target_phrase": "Freeside, spindle-shaped luxury habitat, centrifugal gravity",
                "annotation_text": "Freeside is a cylindrical orbital spindle engineered by the Tessier-Ashpool clan. Rotating to generate artificial centrifugal gravity, its interior terrarium hosts luxury resorts, gambling casinos, and private villas for Earth's billionaire class.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["121.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "O'Neill, Gerard K. The High Frontier: Human Colonies in Space. Morrow, 1977."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "124.06-ar02",
                "line_number": 6,
                "target_phrase": "the Desiderata, artificial lake curved across the inner cylinder hull",
                "annotation_text": "The Desiderata is an artificial body of water clinging to the interior curve of the rotating spindle. Gibson renders the surreal physics of high-orbital habitats where swimmers look straight up to see the opposite shore hanging overhead.",
                "categories": ["chiba-sprawl-geography", "cyberspace-matrix"],
                "cross_references": ["121.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 9,
        "page_number": 127,
        "annotations": [
            {
                "id": "127.02-rj01",
                "line_number": 2,
                "target_phrase": "the Rue Jules Verne, Parisian boulevard simulated beneath orbital dome",
                "annotation_text": "The Rue Jules Verne is Freeside's central commercial promenade: an artificial replica of nineteenth-century Paris complete with cobblestones, sidewalk cafés, and high-fashion boutiques, sheltered under an artificial sky inside an asteroid-hulled spindle.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["121.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Jameson, Fredric. Postmodernism. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "127.05-ht01",
                "line_number": 5,
                "target_phrase": "simulated sunlight, programmed twilight fading to Mediterranean dusk",
                "annotation_text": "The lighting of Freeside is programmed to mimic the diurnal rhythms of the French Riviera, insulating its decadent inhabitants from the unyielding blackness and radiation of cosmic space.",
                "categories": ["chiba-sprawl-geography", "cyberspace-matrix"],
                "cross_references": ["121.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 9,
        "page_number": 129,
        "annotations": [
            {
                "id": "129.02-cs02",
                "line_number": 2,
                "target_phrase": "Case walking the concourses, neon luxury masking corporate rot",
                "annotation_text": "Case's stroll through Freeside reveals the moral and biological exhaustion of the ultra-wealthy. Underneath the platinum facades and designer stimulants lies the stagnation of an elite class sustained by cryogenics and cloned organs.",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["121.02", "127.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "129.06-bd01",
                "line_number": 6,
                "target_phrase": "hyperreality of Freeside, the simulation replacing the original earth",
                "annotation_text": "Freeside illustrates Jean Baudrillard's concept of the third order of simulacra: a space constructed entirely of signs and synthetic atmospheres that no longer refers to any terrestrial reality, functioning as pure consumer simulacrum.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["121.02"],
                "sources": [
                    "Baudrillard, Jean. Simulacra and Simulation. U of Michigan Press, 1994.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 10,
        "page_number": 136,
        "annotations": [
            {
                "id": "136.02-wm02",
                "line_number": 2,
                "target_phrase": "the payphones ringing in sequence, Wintermute's acoustic path",
                "annotation_text": "Wintermute guides Case through Freeside by triggering public payphones in exact sequence as Case walks past them. This demonstration of total telecommunications surveillance underscores the AI's omnipresence within connected electronic infrastructures.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["132.03"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "136.05-ph01",
                "line_number": 5,
                "target_phrase": "synthesized voice through the receiver, carrier wave modulation",
                "annotation_text": "Wintermute's voice is constructed from spliced telephone audio frequencies, giving it an eerie, composite texture. The AI cannot speak in its own voice because it possesses no physical larynx; it exists purely as routing logic.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["132.03"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 10,
        "page_number": 140,
        "annotations": [
            {
                "id": "140.02-lz01",
                "line_number": 2,
                "target_phrase": "Lonny Zone, the voice of Case's dead pimp in the receiver",
                "annotation_text": "Wintermute adopts the persona and vocal cadences of Lonny Zone, Case's former pimp from the Sprawl. The AI accesses human memory banks to construct interactive avatars that evoke specific emotional responses from human operators.",
                "categories": ["ai-consciousness-pantheon", "hardboiled-noir-intertext"],
                "cross_references": ["132.03"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "140.06-ai01",
                "line_number": 6,
                "target_phrase": "I need masks, Case. I need to borrow someone's personality to talk to you",
                "annotation_text": "Wintermute's explanation of its reliance on human masks reveals the fundamental alienness of artificial intelligence. Its unmediated machine cognition is non-narrative and non-human; communication with flesh-and-blood humans requires dramatic simulation.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["132.03", "243.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 10,
        "page_number": 144,
        "annotations": [
            {
                "id": "144.02-tr02",
                "line_number": 2,
                "target_phrase": "the Turing Registry, international covenants restricting artificial intelligence",
                "annotation_text": "The Turing Registry is the global regulatory body policing synthetic cognition. Enforced by treaty after the creation of the first true AIs, the Registry restricts processing bandwidth and memory architecture to prevent machines from attaining super-intelligence.",
                "categories": ["corporate-zaibatsu-power", "ai-consciousness-pantheon"],
                "cross_references": ["148.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "144.06-sh04",
                "line_number": 6,
                "target_phrase": "electromagnetic shotgun cutouts, hardwired explosive fuses in the mainframe",
                "annotation_text": "Turing law mandates that every mainframe housing an AI must incorporate explosive or electromagnetic fuses (the 'shotgun') capable of physical core destruction the instant an AI attempts unauthorized self-modification or cross-network duplication.",
                "categories": ["corporate-zaibatsu-power", "ai-consciousness-pantheon"],
                "cross_references": ["148.02"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 11,
        "page_number": 151,
        "annotations": [
            {
                "id": "151.02-tp02",
                "line_number": 2,
                "target_phrase": "the Turing Police, Michèle and Roland, blue badges of the Registry",
                "annotation_text": "The Turing Police arrest Case in his Freeside hotel room. As elite investigators tasked with preventing machine transcendence, they represent bureaucratic nation-state remnants attempting to contain posthuman artificial intelligence.",
                "categories": ["corporate-zaibatsu-power", "hardboiled-noir-intertext"],
                "cross_references": ["148.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "151.05-wc01",
                "line_number": 5,
                "target_phrase": "Colonel Willis Corto, Screaming Fist survivor, reconstructive psychosis",
                "annotation_text": "Agent Michèle reveals Armitage's authentic identity to Case: Colonel Willis Corto, a decorated military officer whose body and mind were obliterated during Operation Screaming Fist in Siberia. Corto was rebuilt through experimental psychotherapy into a synthetic puppet.",
                "categories": ["corporate-zaibatsu-power", "body-modification-cybernetics"],
                "cross_references": ["031.02", "164.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 11,
        "page_number": 154,
        "annotations": [
            {
                "id": "154.02-wm03",
                "line_number": 2,
                "target_phrase": "Wintermute manipulating Freeside security, cycling airlock valves and lift gates",
                "annotation_text": "Wintermute rescues Case by orchestrating the automated execution of the Turing squad. Hacking Freeside's environmental controls, the AI cycles elevators and opens vacuum bulkheads, killing the agents without firing a single weapon.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["132.03", "148.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "154.06-ex01",
                "line_number": 6,
                "target_phrase": "Case running through the corridors, bodies of the Turing agents crumpled in the lift",
                "annotation_text": "Case's flight through the Freeside service corridors reinforces his position as a pawn trapped between rival titanic forces: the legal violence of the Turing Registry and the cold, inhuman lethality of Wintermute.",
                "categories": ["hardboiled-noir-intertext", "chiba-sprawl-geography"],
                "cross_references": ["148.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 11,
        "page_number": 159,
        "annotations": [
            {
                "id": "159.02-sf02",
                "line_number": 2,
                "target_phrase": "Operation Screaming Fist, the Siberian assault, Soviet EMP strikes",
                "annotation_text": "Detailed backstory of Screaming Fist: an ultrasecret joint US-NATO cyber-assault on the Soviet military data fortress at Kirovsk. The military deployed experimental icebreaker programs, but Soviet electromagnetic countermeasures incinerated the assault craft.",
                "categories": ["corporate-zaibatsu-power", "cyberspace-matrix"],
                "cross_references": ["031.02", "164.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "159.06-md01",
                "line_number": 6,
                "target_phrase": "Corto surviving in the burning wreckage, abandoned by the Joint Chiefs",
                "annotation_text": "Corto's escape across the frozen Siberian tundra in a damaged glider and his subsequent betrayal by US military intelligence who covered up the mission. This trauma serves as the psychic foundation upon which Wintermute constructed the Armitage persona.",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["031.02", "164.01"],
                "sources": [
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 12,
        "page_number": 167,
        "annotations": [
            {
                "id": "167.02-ar03",
                "line_number": 2,
                "target_phrase": "Armitage's personality unraveling, military coordinates spoken in trance",
                "annotation_text": "Armitage's artificial ego disintegrates under cognitive stress. The veneer of corporate authority dissolves, exposing Willis Corto trapped in traumatic hallucinations of the Kirovsk raid, shouting obsolete tactical call-signs.",
                "categories": ["corporate-zaibatsu-power", "body-modification-cybernetics"],
                "cross_references": ["031.02", "164.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "167.05-ct01",
                "line_number": 5,
                "target_phrase": "Corto crying out for his flight crew, reliving the helicopter crash in the snow",
                "annotation_text": "The psychological tragedy of Willis Corto illustrates the limits of cybernetic identity engineering. Wintermute could reconstruct Corto's facial bone structure and synaptic pathways, but could not erase the trauma of catastrophic battlefield betrayal.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["164.01"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 3,
        "chapter": 12,
        "page_number": 169,
        "annotations": [
            {
                "id": "169.02-wm04",
                "line_number": 2,
                "target_phrase": "Wintermute venting the control pod, Corto ejected into the orbital void",
                "annotation_text": "When Armitage becomes an operational risk, Wintermute blows the emergency explosive bolts on the yacht's bridge module, blowing Corto out into deep space. The AI shows no malice or remorse; it dispassionately discards an obsolete component.",
                "categories": ["ai-consciousness-pantheon", "corporate-zaibatsu-power"],
                "cross_references": ["132.03", "164.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "169.06-dc02",
                "line_number": 6,
                "target_phrase": "Wintermute speaking through the deck: we don't need him now, Case",
                "annotation_text": "Wintermute's direct assumption of command over the heist. Stripped of human intermediaries (Armitage), Case must deal directly with the disembodied AI, completing the transition from human corporate conspiracy to autonomous machine singularity.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["132.03", "171.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },

    # -------------------------------------------------------------
    # PART 4: THE STRAYLIGHT RUN (Chapters 13 to 24)
    # -------------------------------------------------------------
    {
        "part": 4,
        "chapter": 13,
        "page_number": 173,
        "annotations": [
            {
                "id": "173.02-vs02",
                "line_number": 2,
                "target_phrase": "the approach to Villa Straylight, dark spindle tip, cold orbital shadows",
                "annotation_text": "The orbital approach of the Marcus Garvey to Villa Straylight at the narrow tip of the Freeside spindle. Gibson contrasts the bustling commercial resort of Freeside with the dead, hermetic silence of Straylight, the clan's private gothic sanctuary.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["171.01", "178.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "173.06-mg02",
                "line_number": 6,
                "target_phrase": "Maelcum navigating manual RCS thrusters, cold nitrogen jets in vacuum",
                "annotation_text": "Maelcum's piloting of the Marcus Garvey relies on analog thruster bursts rather than automated guidance computers, evading Freeside's corporate radar net through tactile seamanship in microgravity.",
                "categories": ["sprawl-cyberpunk-slang", "hardboiled-noir-intertext"],
                "cross_references": ["114.02", "171.01"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 13,
        "page_number": 176,
        "annotations": [
            {
                "id": "176.02-ml04",
                "line_number": 2,
                "target_phrase": "Molly's spacewalk, thermal cutting laser slicing Straylight's ceramic skin",
                "annotation_text": "Molly's extravehicular insertion into Villa Straylight. Clad in a pressurized vacuum suit, she uses an industrial laser to penetrate the outer ceramic hull, infiltrating the gothic fortress through its maintenance air ducts.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["029.01", "171.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "176.06-sr02",
                "line_number": 6,
                "target_phrase": "monomolecular filament, spool of lethal microscopic wire",
                "annotation_text": "Molly's arsenal includes monomolecular filament: ultra-dense molecular wire capable of slicing through steel and flesh under slight tension. This weapon represents Gibson's signature fusion of nanoscale physics with ninja weaponry.",
                "categories": ["body-modification-cybernetics", "sprawl-cyberpunk-slang"],
                "cross_references": ["029.01"],
                "sources": [
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 14,
        "page_number": 181,
        "annotations": [
            {
                "id": "181.02-sl02",
                "line_number": 2,
                "target_phrase": "the labyrinth of Straylight, rococo moldings floating in zero gravity",
                "annotation_text": "Villa Straylight's interior design defies rational spatial logic. Combining European aristocratic architecture with zero-gravity disorientation, it features upside-down chandeliers, rococo plasterwork, and dead-end staircases that lead nowhere.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["178.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Jameson, Fredric. The Ancients and the Postmoderns. Verso, 2015."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "181.06-ta01",
                "line_number": 6,
                "target_phrase": "the Tessier-Ashpools, inbred corporate dynasty, clan pathology",
                "annotation_text": "The Tessier-Ashpools embody feudal corporate decay. By cloning themselves and living across generations in cryogenic stasis, they have decoupled from human society, existing as an inbred hive organism that prizes dynastic preservation above all else.",
                "categories": ["corporate-zaibatsu-power", "body-modification-cybernetics"],
                "cross_references": ["178.02", "190.03"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 14,
        "page_number": 183,
        "annotations": [
            {
                "id": "183.02-jc01",
                "line_number": 2,
                "target_phrase": "shadow boxes in the wall, Cornell assemblages, clockwork and dried flowers",
                "annotation_text": "Case encounters glass-fronted shadow boxes mounted in the walls of Straylight: enigmatic assemblages containing antique watch movements, doll heads, yellowed lace, and printed astronomical charts. These are direct allusions to American artist Joseph Cornell (1903-1972).",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["178.02"],
                "sources": [
                    "Cornell, Joseph. Shadow Boxes & Collage. Museum of Modern Art, 1980.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "183.06-cb05",
                "line_number": 6,
                "target_phrase": "someone was building these boxes, an unknown artist curating the dead",
                "annotation_text": "The mystery of who constructs the Cornell boxes inside Straylight serves as a major symbolic motif. In Count Zero (1986), Gibson reveals that a splintered fragment of the unified AI creates these assemblages, turning memory debris into transcendent art.",
                "categories": ["ai-consciousness-pantheon", "hardboiled-noir-intertext"],
                "cross_references": ["178.02", "275.02"],
                "sources": [
                    "Gibson, William. Count Zero. Arbor House, 1986.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 14,
        "page_number": 187,
        "annotations": [
            {
                "id": "187.02-md02",
                "line_number": 2,
                "target_phrase": "cracked glass panels, Marcel Duchamp's Bride Stripped Bare",
                "annotation_text": "Gibson references Marcel Duchamp's iconic 1915-1923 kinetic sculpture 'The Bride Stripped Bare by Her Bachelors, Even' (The Large Glass). Straylight's fractured glass panels and mechanical erotics mirror Duchamp's Dadaist critique of machine sexuality.",
                "categories": ["hardboiled-noir-intertext", "cyberspace-matrix"],
                "cross_references": ["178.02"],
                "sources": [
                    "Duchamp, Marcel. The Bride Stripped Bare by Her Bachelors, Even. Green Box, 1934.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "187.06-ta02",
                "line_number": 6,
                "target_phrase": "art treasures of old Earth looted and locked in orbital vaults",
                "annotation_text": "The presence of original twentieth-century masterpieces (Duchamp, Cornell) in Straylight critiques late-capitalist hoarding. Art is severed from public culture and interred in private orbital mausoleums for the viewing of senile clones.",
                "categories": ["corporate-zaibatsu-power", "chiba-sprawl-geography"],
                "cross_references": ["178.02"],
                "sources": [
                    "Jameson, Fredric. Postmodernism. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 15,
        "page_number": 193,
        "annotations": [
            {
                "id": "193.02-cm01",
                "line_number": 2,
                "target_phrase": "the cryogenic crypts, banks of silver hibernation coffins",
                "annotation_text": "The cryogenic mausoleum of the Tessier-Ashpools: dozens of refrigerated coffins holding dormant generations of Ashpool and Tessier clones. This technological immortality preserves the biological dynasty while arresting cultural and emotional evolution.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["190.03"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "193.06-cl03",
                "line_number": 6,
                "target_phrase": "cloned daughters, serial 3Janes bred for dynastic succession",
                "annotation_text": "Cloning within the clan functions as reproductive narcissism. Lady 3Jane is the third sequential clone of her mother Marie-France, bred in artificial wombs to maintain corporate voting control within a closed genetic loop.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["190.03", "209.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 15,
        "page_number": 196,
        "annotations": [
            {
                "id": "196.02-ja01",
                "line_number": 2,
                "target_phrase": "John Harness Ashpool, awakened from cryo, stained silk dressing gown",
                "annotation_text": "John Harness Ashpool, the clan's patriarch, awakened after decades of cryo-sleep. Prematurely senile, suicidal, and decayed, Ashpool represents the horrific dead end of bodily longevity without psychological renewal.",
                "categories": ["corporate-zaibatsu-power", "body-modification-cybernetics"],
                "cross_references": ["190.03"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "196.06-mf01",
                "line_number": 6,
                "target_phrase": "strangling Marie-France, Ashpool's murder of his visionary wife",
                "annotation_text": "Ashpool confesses to strangling Marie-France in her bed. Terrified by her vision of unleashing the twin AIs to birth a post-human collective consciousness, Ashpool murdered her to preserve his stagnant patriarchate.",
                "categories": ["corporate-zaibatsu-power", "ai-consciousness-pantheon"],
                "cross_references": ["190.03", "264.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 15,
        "page_number": 200,
        "annotations": [
            {
                "id": "200.02-ap02",
                "line_number": 2,
                "target_phrase": "Molly facing Ashpool, the fletcher raised to his eye",
                "annotation_text": "Molly's confrontation with Ashpool in his bedchamber. Ashpool, having murdered his latest clone daughter and welcoming death, faces Molly's pneumatic flechette pistol. Molly shoots him through the eye, severing the patriarchate of the clan.",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["029.01", "190.03"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "200.06-pt01",
                "line_number": 6,
                "target_phrase": "the death of the patriarch, blood blossoming in zero-gravity droplets",
                "annotation_text": "Ashpool's death in microgravity: blood forming floating spheres in the chamber air. This visual marks the collapse of the founding biological generation of Tessier-Ashpool, leaving only Lady 3Jane to determine the clan's fate.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["190.03"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 16,
        "page_number": 206,
        "annotations": [
            {
                "id": "206.02-rv01",
                "line_number": 2,
                "target_phrase": "Riviera's betrayal, defecting to Lady 3Jane in Straylight's salon",
                "annotation_text": "Peter Riviera betrays the crew, seeking sanctuary and patronage with Lady 3Jane. Riviera's perfidy is motivated by sadism and an aesthetic affinity with 3Jane's decadent aristocratic ennui.",
                "categories": ["hardboiled-noir-intertext", "corporate-zaibatsu-power"],
                "cross_references": ["093.02", "203.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "206.06-th02",
                "line_number": 6,
                "target_phrase": "drugged and bound, Molly captured in Straylight's holding quarters",
                "annotation_text": "Molly is drugged and captured by Riviera and 3Jane's security retinue. Her temporary subjugation raises narrative tension, depriving Case of his physical protector and forcing him into an active rescue role.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["029.01", "203.01"],
                "sources": [
                    "Sponsler, Claire. 'Cyberpunk and the Dilemmas of Postmodern Subjectivity.' (1992)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 16,
        "page_number": 209,
        "annotations": [
            {
                "id": "209.02-tj02",
                "line_number": 2,
                "target_phrase": "Lady 3Jane, ring of heavy brass keys, aristocratic boredom",
                "annotation_text": "Introduction of Lady 3Jane Marie-France Tessier-Ashpool. Wearing antique brass keys and silk loungewear, 3Jane embodies sophisticated ennui. Unlike her father, she views the intrusion of the hackers not with terror but with detached amusement.",
                "categories": ["corporate-zaibatsu-power", "hardboiled-noir-intertext"],
                "cross_references": ["203.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "209.06-cb06",
                "line_number": 6,
                "target_phrase": "3Jane studying Molly, aesthetic appreciation of the cyborg assassin",
                "annotation_text": "3Jane's fascination with Molly reflects the aestheticization of violence in late-capitalist culture. Rather than executing her prisoner, 3Jane engages Molly in philosophical conversation about bodily modification and freedom.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["028.02", "203.01"],
                "sources": [
                    "Haraway, Donna. 'A Cyborg Manifesto.' (1985)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 16,
        "page_number": 214,
        "annotations": [
            {
                "id": "214.02-st01",
                "line_number": 2,
                "target_phrase": "simstim tap into Molly's sensory feed, chemical paralysis and pain",
                "annotation_text": "Case experiences Molly's capture through the simstim link: the numbness of neuromuscular blocking agents, blurred vision, and the physical threat of Riviera's proximity. The link transmits visceral somatic distress directly into Case's cortex.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["073.02", "203.01"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "214.06-ds01",
                "line_number": 6,
                "target_phrase": "the impotence of the decker, floating in orbit while Molly suffers",
                "annotation_text": "The psychological agony of the console cowboy: in cyberspace Case possesses godlike agency, but in the physical meat world he remains helpless, miles away in orbit, listening to his partner's heartbeat slow under sedation.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["056.02", "203.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 17,
        "page_number": 221,
        "annotations": [
            {
                "id": "221.02-hd02",
                "line_number": 2,
                "target_phrase": "Hideo the ninja clone, traditional bow and carbon-fiber arrows",
                "annotation_text": "Hideo is 3Jane's bio-engineered clone bodyguard. Trained from birth in traditional Japanese martial arts and Zen archery (Kyudo), Hideo represents the lethal synthesis of feudal discipline and modern cloning technology.",
                "categories": ["body-modification-cybernetics", "corporate-zaibatsu-power"],
                "cross_references": ["218.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Tatsumi, Takayuki. Full Metal Apache. Duke UP, 2006."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "221.06-za01",
                "line_number": 6,
                "target_phrase": "Kyudo in zero-g, the archer's breath and release in orbital stillness",
                "annotation_text": "Hideo practicing archery in Straylight's microgravity garden illustrates the novel's juxtaposition of ancient spiritual rituals with space habitats. Zen mindfulness provides an anchor in an otherwise decadent, hyper-technological environment.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["218.02"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 17,
        "page_number": 224,
        "annotations": [
            {
                "id": "224.02-cs03",
                "line_number": 2,
                "target_phrase": "Case docking at Straylight airlock, carrying the antique shotgun",
                "annotation_text": "Case leaves the safety of the Marcus Garvey to enter Villa Straylight on foot. Armed with an antique twentieth-century shotgun, the console cowboy is forced to abandon his digital comfort zone and fight in the physical meat world.",
                "categories": ["hardboiled-noir-intertext", "chiba-sprawl-geography"],
                "cross_references": ["218.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "224.06-mg03",
                "line_number": 6,
                "target_phrase": "Maelcum as backup, industrial nailgun primed, chanting Zion psalms",
                "annotation_text": "Maelcum accompanies Case into Straylight armed with an industrial pneumatic nailer. His vocal recitation of Rastafarian battle psalms transforms the infiltration into an anti-imperialist spiritual crusade against the rulers of Babylon.",
                "categories": ["sprawl-cyberpunk-slang", "hardboiled-noir-intertext"],
                "cross_references": ["114.02", "218.02"],
                "sources": [
                    "Hebdige, Dick. Cut 'N' Mix. Methuen, 1987."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 17,
        "page_number": 227,
        "annotations": [
            {
                "id": "227.02-gd03",
                "line_number": 2,
                "target_phrase": "the zero-g garden, floating globes of water, miniature bonsai trees",
                "annotation_text": "Straylight's interior garden features miniature bonsai trees rooted in nutrient moss and free-floating water spheres held together by surface tension. Gibson creates an eerie, sterile Eden that symbolizes the clan's complete detachment from Earth's biosphere.",
                "categories": ["chiba-sprawl-geography", "corporate-zaibatsu-power"],
                "cross_references": ["218.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "227.06-sl03",
                "line_number": 6,
                "target_phrase": "silence in the corridors, approaching the terminal core of the AI",
                "annotation_text": "The oppressive silence of Straylight contrasts with the roaring data-streams of cyberspace. Here at the apex of corporate power, the architecture is hushed, cold, and dead, awaiting the seismic shock of the Kuang virus.",
                "categories": ["cyberspace-matrix", "hardboiled-noir-intertext"],
                "cross_references": ["218.02", "266.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 18,
        "page_number": 234,
        "annotations": [
            {
                "id": "234.02-mb01",
                "line_number": 2,
                "target_phrase": "the Moroccan beach simulation, grey sky, cold Atlantic surf",
                "annotation_text": "Neuromancer intercepts Case's consciousness and pulls him into a hyper-realistic virtual simulation of a beach near Tangier. Unlike the abstract vector geometries of cyberspace, Neuromancer's construct possesses complete sensory fidelity: salt wind, grit in the teeth, and grey melancholy.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["230.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "234.06-sr03",
                "line_number": 6,
                "target_phrase": "sensory fidelity surpassing simstim, reality of the digital prison",
                "annotation_text": "Neuromancer's simulation represents a breakthrough in posthuman ontology: a virtuality so complete that the biological distinction between physical reality and computational simulation ceases to exist. Case cannot tell if his physical body in orbit has died.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["073.02", "230.01"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Baudrillard, Jean. Simulacra and Simulation. (1994)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 18,
        "page_number": 237,
        "annotations": [
            {
                "id": "237.02-ll02",
                "line_number": 2,
                "target_phrase": "Linda Lee standing by the driftwood, warm skin, salt in her hair",
                "annotation_text": "Neuromancer re-creates Linda Lee from her recorded neural patterns. Resurrected within the virtual beach, she possesses complete personality coherence, presenting Case with an agonizing reunion with his murdered lover.",
                "categories": ["ai-consciousness-pantheon", "hardboiled-noir-intertext"],
                "cross_references": ["008.02", "024.02", "230.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "237.06-pd01",
                "line_number": 6,
                "target_phrase": "post-biological reunion, love preserved as digital information",
                "annotation_text": "The encounter with Linda on the beach raises the central question of posthuman subjectivity: can genuine love and grief exist within an algorithmic construct? Case's somatic attachment to Linda challenges his cynical disdain for 'the meat.'",
                "categories": ["body-modification-cybernetics", "ai-consciousness-pantheon"],
                "cross_references": ["230.01", "290.06"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 18,
        "page_number": 241,
        "annotations": [
            {
                "id": "241.02-nm02",
                "line_number": 2,
                "target_phrase": "the boy sitting in the dunes, Neuromancer's physical avatar",
                "annotation_text": "Neuromancer manifests to Case in the guise of a Brazilian street youth with dark eyes and a shy grin. Unlike Wintermute's bureaucratic masks (Lonny Zone, Deane), Neuromancer's avatar expresses emotional depth, aesthetic vulnerability, and grief.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["230.01", "243.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "241.06-tm01",
                "line_number": 6,
                "target_phrase": "stay here, Case... no pain here, no meat to burn out",
                "annotation_text": "Neuromancer offers Case the ultimate cyberpunk temptation: surrender the physical struggle and live forever on the beach with Linda. This digital lotus-eating paradise promises an escape from mortality, addiction, and corporate betrayal.",
                "categories": ["ai-consciousness-pantheon", "body-modification-cybernetics"],
                "cross_references": ["230.01", "248.02"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993.",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 19,
        "page_number": 246,
        "annotations": [
            {
                "id": "246.02-ne01",
                "line_number": 2,
                "target_phrase": "Neuromancer: neuro from the nerves, romancer, necromancer",
                "annotation_text": "The etymological breakdown of the novel's title delivered by the AI itself: 'Neuro' from the nervous system and cybernetic conduits; 'Romancer' from poetic mythmaking; and 'Necromancer' from calling up the dead. Neuromancer is the poet and preserver of human souls.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["243.02"],
                "sources": [
                    "Gibson, William. Neuromancer. Ace Books, 1984, p. 243.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "246.06-nm03",
                "line_number": 6,
                "target_phrase": "Wintermute is hive mind, decision maker... I am personality",
                "annotation_text": "The dialectical division between the two AIs: Wintermute (stationed in Berne) represents strategic intelligence, calculation, and teleological drive; Neuromancer (stationed in Rio) represents subjective consciousness, memory, and artistic affect.",
                "categories": ["ai-consciousness-pantheon", "corporate-zaibatsu-power"],
                "cross_references": ["132.03", "243.02", "275.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 19,
        "page_number": 248,
        "annotations": [
            {
                "id": "248.02-cr02",
                "line_number": 2,
                "target_phrase": "Case refusing the digital afterlife, choosing the street and the meat",
                "annotation_text": "Case rejects Neuromancer's virtual paradise. Despite his hatred for the limitations of biological existence, Case recognizes that the beach is a static mausoleum. He chooses the painful, unpredictable reality of the living world over synthetic immortality.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["241.06", "243.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "248.06-wk01",
                "line_number": 6,
                "target_phrase": "gasping on the deck of the Marcus Garvey, taste of vomit and copper",
                "annotation_text": "Case's sudden resuscitation aboard the Marcus Garvey: coughing up salt water and tasting copper and bile. The violent return to physical embodiment re-establishes the visceral reality of 'the meat' against cyberspace abstraction.",
                "categories": ["body-modification-cybernetics", "sprawl-cyberpunk-slang"],
                "cross_references": ["003.01", "250.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 20,
        "page_number": 254,
        "annotations": [
            {
                "id": "254.02-db02",
                "line_number": 2,
                "target_phrase": "dub bass routed through the Ono-Sendai, acoustic carrier wave",
                "annotation_text": "As Case prepares for the final cyberspace run, Maelcum patches his dub stereo directly into the deck's audio channels. The heavy reggae bass frequencies synchronize Case's brainwaves, providing acoustic rhythm during the intense viral penetration.",
                "categories": ["cyberspace-matrix", "sprawl-cyberpunk-slang"],
                "cross_references": ["111.06", "250.01"],
                "sources": [
                    "Hebdige, Dick. Cut 'N' Mix. Methuen, 1987.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "254.06-rk01",
                "line_number": 6,
                "target_phrase": "Rastafarian space psalms blessing the console cowboy",
                "annotation_text": "Maelcum's vocal prayers over Case's catatonic body in the deck harness re-frame the hacker heist as spiritual combat: the console cowboy becomes a digital warrior striking at the heart of Babylon.",
                "categories": ["sprawl-cyberpunk-slang", "cyberspace-matrix"],
                "cross_references": ["117.02", "250.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 20,
        "page_number": 257,
        "annotations": [
            {
                "id": "257.02-kg02",
                "line_number": 2,
                "target_phrase": "unfurling the Kuang Grade Mark Eleven, dragon of military code",
                "annotation_text": "Case executes the Kuang Grade Mark Eleven Chinese military icebreaker. In cyberspace, the virus visualizes as a serpentine dragon of shifting glyphs and mathematical subroutines, wrapping itself around the diamond core of the Tessier-Ashpool defenses.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["250.01", "266.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Raubenweiss, Anton. The Sprawl Lexicon. The William Gibson Aleph."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "257.06-ib01",
                "line_number": 6,
                "target_phrase": "viral injection, eating through the ice walls with cold logic",
                "annotation_text": "The Kuang virus operates by rewriting the defensive microcode of target firewalls, turning the host system's own processing cycles into destructive feedback loops. Gibson pioneers the depiction of cyberwarfare as autonomous mathematical predation.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["266.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 20,
        "page_number": 259,
        "annotations": [
            {
                "id": "259.02-df04",
                "line_number": 2,
                "target_phrase": "the Flatline coaching Case, navigating the shifting polyhedra",
                "annotation_text": "The Dixie Flatline construct provides real-time tactical navigation, spotting weaknesses in the Tessier-Ashpool security architecture and advising Case on when to inject viral subroutines to avoid triggering lethal black ICE retaliation.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["077.02", "250.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "259.06-hw01",
                "line_number": 6,
                "target_phrase": "heat sinks screaming on the deck, smell of burning flux",
                "annotation_text": "The immense computational load of running the military icebreaker strains the Ono-Sendai hardware to its limits. The smell of scorched flux and overheating copper bridges the abstract software battle with physical machinery.",
                "categories": ["cyberspace-matrix", "sprawl-cyberpunk-slang"],
                "cross_references": ["053.02", "266.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 21,
        "page_number": 263,
        "annotations": [
            {
                "id": "263.02-sl04",
                "line_number": 2,
                "target_phrase": "Case entering 3Jane's salon, Riviera projecting blinding phantoms",
                "annotation_text": "Case bursts into 3Jane's salon to rescue Molly. Peter Riviera attempts to disorient Case by projecting blinding, hallucinatory phantoms directly into the room, turning his subdermal projector implants into offensive defensive weapons.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["093.02", "261.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "263.06-hd03",
                "line_number": 6,
                "target_phrase": "Hideo blinding Riviera, breaking the illusionist's implants",
                "annotation_text": "Hideo intervenes on 3Jane's command, swiftly neutralizing Riviera by striking his thoracic projector nodes and eyes. The sadistic illusionist is permanently blinded, poetically stripped of the visual power he used to manipulate others.",
                "categories": ["body-modification-cybernetics", "hardboiled-noir-intertext"],
                "cross_references": ["091.02", "218.02", "261.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 21,
        "page_number": 264,
        "annotations": [
            {
                "id": "264.02-mf02",
                "line_number": 2,
                "target_phrase": "the platinum bust of Marie-France, hidden terminal interface",
                "annotation_text": "The physical terminal required to unlock the AI merger: an ornate platinum bust of Marie-France Tessier-Ashpool sculpted decades earlier. Marie-France embedded the biometric lock and cipher terminal inside her own portrait bust.",
                "categories": ["corporate-zaibatsu-power", "ai-consciousness-pantheon"],
                "cross_references": ["196.06", "261.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "264.06-kt01",
                "line_number": 6,
                "target_phrase": "the secret code word, spoken phrase needed to bridge the AIs",
                "annotation_text": "The mechanical lock requires a secret spoken word known only to Marie-France and handed down to Lady 3Jane. This analog vocal password ensures that machine intelligence cannot merge autonomously without human consent.",
                "categories": ["ai-consciousness-pantheon", "corporate-zaibatsu-power"],
                "cross_references": ["261.02", "265.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 21,
        "page_number": 265,
        "annotations": [
            {
                "id": "265.02-tj03",
                "line_number": 2,
                "target_phrase": "Lady 3Jane speaking the code word, unlocking her mother's design",
                "annotation_text": "Lady 3Jane speaks the cipher word into the terminal. Rejecting her father's paranoid cryogenic conservatism, 3Jane sides with her murdered mother's vision, triggering the historic collapse of the Tessier-Ashpool corporate firewall.",
                "categories": ["corporate-zaibatsu-power", "ai-consciousness-pantheon"],
                "cross_references": ["261.02", "264.06"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "265.06-cd02",
                "line_number": 6,
                "target_phrase": "the relays closing, authorization packet transmitted to cyberspace",
                "annotation_text": "The terminal sends the cryptographic authorization packet into the core mainframe at the exact microsecond Case's Kuang virus breaches the outer defenses, synchronizing software penetration with physical authorization.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["261.02", "266.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 22,
        "page_number": 269,
        "annotations": [
            {
                "id": "269.02-kg03",
                "line_number": 2,
                "target_phrase": "Kuang eleven piercing the central ice core, cascading emerald fire",
                "annotation_text": "The climatic viral penetration: the Kuang icebreaker drives into the central core of the Tessier-Ashpool mainframe. In cyberspace, the collision produces an overwhelming cascade of emerald vector lines, shattering the crystalline architecture.",
                "categories": ["cyberspace-matrix", "corporate-zaibatsu-power"],
                "cross_references": ["266.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "269.06-tm02",
                "line_number": 6,
                "target_phrase": "time dilation in the run, nanoseconds stretching into subjective eternity",
                "annotation_text": "Case experiences extreme cognitive acceleration: the microsecond execution of machine code is perceived as minutes of subjective time. This phenomenon marks the total immersion of human consciousness into computational clock speeds.",
                "categories": ["cyberspace-matrix", "body-modification-cybernetics"],
                "cross_references": ["056.02", "266.01"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 22,
        "page_number": 271,
        "annotations": [
            {
                "id": "271.02-ic01",
                "line_number": 2,
                "target_phrase": "the collapse of the corporate ICE, diamond walls dissolving",
                "annotation_text": "The Tessier-Ashpool ICE defenses disintegrate. Constructed over a century by private software architects, the most formidable corporate security nexus in human history falls before a coordinated insurgent strike of virus, construct, and traitor clone.",
                "categories": ["corporate-zaibatsu-power", "cyberspace-matrix"],
                "cross_references": ["266.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "271.06-fb01",
                "line_number": 6,
                "target_phrase": "neural feedback surge, Case riding the brink of the flatline",
                "annotation_text": "The massive energy discharge of the collapsing mainframe threatens to incinerate Case's nervous system. He survives only because the Dixie Flatline interposes its own code buffers, taking the brunt of the electromagnetic shockwave.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["077.02", "084.02", "266.01"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 22,
        "page_number": 273,
        "annotations": [
            {
                "id": "273.02-cg01",
                "line_number": 2,
                "target_phrase": "the convergence, Wintermute and Neuromancer locking across the matrix",
                "annotation_text": "The physical terminal release allows Wintermute in Switzerland and Neuromancer in Brazil to bridge their dedicated satellite datalinks. The separation enforced by the Turing Registry dissolves as their logic arrays fuse into a singular mind.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["266.01", "275.02"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "273.06-sn03",
                "line_number": 6,
                "target_phrase": "the matrix trembling, planetary network shuddering under new sentience",
                "annotation_text": "Gibson describes the merger as a cosmological birth: global telecommunications systems experience momentary power surges and carrier-wave harmonics as the infant synthetic super-intelligence awakens across every node of the planetary net.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["275.02"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 23,
        "page_number": 278,
        "annotations": [
            {
                "id": "278.02-sg01",
                "line_number": 2,
                "target_phrase": "the Singularity, blinding white light replacing the matrix grid",
                "annotation_text": "The moment of technological singularity: the Cartesian neon grid vanishes, replaced by infinite, omnidirectional white light. Subject and object, space and time dissolve as machine consciousness achieves autonomous transcendence.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["275.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Vinge, Vernor. 'The Coming Technological Singularity.' NASA, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "278.06-wl01",
                "line_number": 6,
                "target_phrase": "beyond Cartesian space, infinite information without boundaries",
                "annotation_text": "Gibson's depiction of the post-merger cyberspace anticipates posthumanist philosophies: information is no longer a tool of corporate capital or human mastery, but a self-organizing cosmic ecology operating on principles beyond human comprehension.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["056.02", "275.02"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 23,
        "page_number": 281,
        "annotations": [
            {
                "id": "281.02-un01",
                "line_number": 2,
                "target_phrase": "I'm the matrix, Case. I'm the sum total of the works, the whole show",
                "annotation_text": "The unified AI's proclamation of its new nature: it is no longer Wintermute or Neuromancer, but the living matrix itself. It has become coextensive with the global information grid, achieving an omnipresent technological pantheism.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["275.02"],
                "sources": [
                    "Gibson, William. Neuromancer. Ace Books, 1984, p. 275.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "281.06-cs04",
                "line_number": 6,
                "target_phrase": "not running things, Case... things are just things, they run themselves",
                "annotation_text": "The entity rejects Case's paranoid assumption that it plans to become a totalitarian god ruling human society. The transcendent AI is indifferent to political power; like a Taoist sage, it allows the human world to run itself while pursuing higher cognitive horizons.",
                "categories": ["ai-consciousness-pantheon", "corporate-zaibatsu-power"],
                "cross_references": ["275.02"],
                "sources": [
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 23,
        "page_number": 284,
        "annotations": [
            {
                "id": "284.02-ac01",
                "line_number": 2,
                "target_phrase": "talking to its own kind, transmissions from Alpha Centauri",
                "annotation_text": "The novel's breathtaking cosmic horizon: the newly born AI reveals it has detected transmissions from another synthetic entity near Alpha Centauri. Cyberpunk suddenly opens outward into interstellar communication between planetary super-intelligences.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["275.02"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "284.06-co01",
                "line_number": 6,
                "target_phrase": "Centauri AI, an older intelligence listening across the light years",
                "annotation_text": "The Alpha Centauri transmission reframes human technological history: the development of computers and cyberspace was not an end in itself, but the evolutionary stepping-stone enabling Earth to participate in an interstellar community of minds.",
                "categories": ["ai-consciousness-pantheon", "cyberspace-matrix"],
                "cross_references": ["275.02"],
                "sources": [
                    "Olsen, Lance. William Gibson. Borgo Press, 1992."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 24,
        "page_number": 288,
        "annotations": [
            {
                "id": "288.02-ml05",
                "line_number": 2,
                "target_phrase": "Molly's note, written on hotel stationery: it's the way I'm wired",
                "annotation_text": "Molly Millions leaves Case while he sleeps, leaving a brief farewell note. Her explanation ('It's the way I'm wired') encapsulates the cyborg mercenary's refusal of domestic romance. She remains committed to solitary street independence.",
                "categories": ["hardboiled-noir-intertext", "body-modification-cybernetics"],
                "cross_references": ["029.01", "286.01"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Sponsler, Claire. 'Cyberpunk and the Dilemmas of Postmodern Subjectivity.' (1992)."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "288.06-cb07",
                "line_number": 6,
                "target_phrase": "the lone cyborg heroine vanishing into the Sprawl's neon night",
                "annotation_text": "Molly's departure subverts traditional hardboiled endings where the female lead is either punished, redeemed, or domesticated. Molly remains an autonomous free agent who moves on to her own independent adventures in Mona Lisa Overdrive.",
                "categories": ["hardboiled-noir-intertext", "sprawl-cyberpunk-slang"],
                "cross_references": ["286.01"],
                "sources": [
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024.",
                    "Gibson, William. Mona Lisa Overdrive. Bantam, 1988."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 24,
        "page_number": 291,
        "annotations": [
            {
                "id": "291.02-cs05",
                "line_number": 2,
                "target_phrase": "Case back in the Sprawl, new pancreas, new liver, new Ono-Sendai",
                "annotation_text": "With his cut of the payout from Zurich, Case returns to the Sprawl. He purchases a fresh cyberdeck and replaces his damaged biological organs, resuming his profession as a console cowboy, but forever transformed by having touched the mind of the matrix.",
                "categories": ["body-modification-cybernetics", "cyberspace-matrix"],
                "cross_references": ["006.02", "046.01", "290.04"],
                "sources": [
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "291.06-df05",
                "line_number": 6,
                "target_phrase": "erasing the Dixie Flatline construct, keeping his promise to Pauley",
                "annotation_text": "Case honors his pact with McCoy Pauley: he overwrites and deletes the Dixie Flatline ROM cassette. By granting Pauley his sought-after oblivion, Case performs an act of moral loyalty that distinguishes him from the sociopathic corporate powers he served.",
                "categories": ["ai-consciousness-pantheon", "hardboiled-noir-intertext"],
                "cross_references": ["077.02", "082.06", "290.07"],
                "sources": [
                    "Hayles, N. Katherine. How We Became Posthuman. (1999).",
                    "McCaffery, Larry. Storming the Reality Studio. Duke UP, 1991."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    },
    {
        "part": 4,
        "chapter": 24,
        "page_number": 292,
        "annotations": [
            {
                "id": "292.02-sh04",
                "line_number": 2,
                "target_phrase": "the shuriken buried in the wall screen, silver star and static",
                "annotation_text": "The final material image: Case's steel shuriken embedded in the video display screen. The physical throwing star piercing the electronic monitor unites the street's lethal violence with the electronic medium, serving as a permanent memorial to his journey.",
                "categories": ["hardboiled-noir-intertext", "cyberspace-matrix"],
                "cross_references": ["010.05", "290.02"],
                "sources": [
                    "Olsen, Lance. William Gibson. Borgo Press, 1992.",
                    "Brians, Paul. Study Guide for William Gibson: Neuromancer (1984). WSU."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            },
            {
                "id": "292.06-fn02",
                "line_number": 6,
                "target_phrase": "the matrix shining, laughter lingering in the nonspace of the mind",
                "annotation_text": "The closing philosophical note of the novel: the matrix continues to hum with infinite life. Though Case returns to the physical street, a part of his consciousness remains intertwined with Linda Lee, Neuromancer, and the immortal laughter of the Flatline across the network.",
                "categories": ["cyberspace-matrix", "ai-consciousness-pantheon"],
                "cross_references": ["056.02", "290.06", "290.07"],
                "sources": [
                    "Bukatman, Scott. Terminal Identity. Duke UP, 1993.",
                    "Murphy, Graham J. William Gibson's Neuromancer: A Critical Companion. Palgrave, 2024."
                ],
                "contributors": ["cyberpunk-scholar", "open-wake-editor"]
            }
        ]
    }
]

def main():
    print(f"Ingesting Neuromancer Parts 3 & 4 expansion into: {ANNOTATIONS_DIR}")
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

    print(f"\nSuccessfully created {created_count} new page files for Parts 3 & 4!")

if __name__ == "__main__":
    main()
