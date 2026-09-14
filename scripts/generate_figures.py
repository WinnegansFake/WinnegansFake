#!/usr/bin/env python3
"""
scripts/generate_figures.py

Generates professional, high-resolution vector SVG graphics for:
1. figures/viconian-cycle.svg (Vico's Ideal Eternal History & 4 Ages of Finnegans Wake)
2. figures/data-isolation-pipeline.svg (Zero-Copyright Architecture & Memory Stream)
3. figures/joyce-sigla-constellation.svg (Buffalo Notebooks Sigla and Characters)
4. figures/ouroboros-circulation.svg (The Endless Ouroboric Sentence FW 628 -> FW 3)
"""

import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
FIGURES_DIR = REPO_ROOT / "figures"
PUBLIC_FIGURES_DIR = REPO_ROOT / "web" / "public" / "figures"

FIGURES_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_FIGURES_DIR.mkdir(parents=True, exist_ok=True)


def build_viconian_cycle_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 750" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080c16"/>
      <stop offset="50%" stop-color="#0e1526"/>
      <stop offset="100%" stop-color="#070a12"/>
    </linearGradient>

    <!-- Card Gradients -->
    <linearGradient id="cardGods" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#241403" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#140b02" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cardHeroes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#260909" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#150505" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cardMen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071830" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#040e1e" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="cardRicorso" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042217" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#02140d" stop-opacity="0.95"/>
    </linearGradient>

    <!-- Center Hub Gradient -->
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.25"/>
      <stop offset="50%" stop-color="#10b981" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop Shadows -->
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#f59e0b" flood-opacity="0.5"/>
    </filter>
    <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#ef4444" flood-opacity="0.5"/>
    </filter>
    <filter id="glowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#3b82f6" flood-opacity="0.5"/>
    </filter>
    <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#10b981" flood-opacity="0.5"/>
    </filter>

    <!-- Markers for Cyclical Arrows -->
    <marker id="arrowGold" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#f59e0b" />
    </marker>
    <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
    </marker>
    <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
    </marker>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
    </marker>
  </defs>

  <style>
    .title { font-family: ui-serif, Georgia, Cambria, serif; font-weight: 700; fill: #ffffff; }
    .subtitle { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; fill: #94a3b8; }
    .card-title { font-family: ui-serif, Georgia, Cambria, serif; font-size: 18px; font-weight: 700; }
    .card-tag { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; }
    .label { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; fill: #cbd5e1; }
    .value-bold { font-weight: 600; }
    .hub-title { font-family: ui-serif, Georgia, Cambria, serif; font-size: 16px; font-weight: 700; fill: #e2e8f0; }
    .hub-sub { font-family: ui-monospace, monospace; font-size: 10px; fill: #10b981; letter-spacing: 0.1em; }
  </style>

  <!-- Background Surface -->
  <rect width="1000" height="750" fill="url(#bgGrad)" rx="16"/>
  <rect width="998" height="748" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="1" rx="16"/>

  <!-- Subtle Coordinate Grid Background -->
  <g opacity="0.07" stroke="#94a3b8" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="750"/>
    <line x1="250" y1="0" x2="250" y2="750"/>
    <line x1="500" y1="0" x2="500" y2="750"/>
    <line x1="750" y1="0" x2="750" y2="750"/>
    <line x1="900" y1="0" x2="900" y2="750"/>
    <line x1="0" y1="100" x2="1000" y2="100"/>
    <line x1="0" y1="250" x2="1000" y2="250"/>
    <line x1="0" y1="375" x2="1000" y2="375"/>
    <line x1="0" y1="500" x2="1000" y2="500"/>
    <line x1="0" y1="650" x2="1000" y2="650"/>
  </g>

  <!-- Header Section -->
  <g transform="translate(500, 42)" text-anchor="middle">
    <text class="title" font-size="22" letter-spacing="-0.02em">THE VICONIAN COSMOLOGICAL CYCLE</text>
    <text class="subtitle" y="22">Giambattista Vico's Ideal Eternal History (Storia Ideale Eterna) Across the 4 Books of Finnegans Wake</text>
  </g>

  <!-- Central Hub (The Ouroboros of Recirculation) -->
  <g transform="translate(500, 400)">
    <!-- Radial Glow Behind Hub -->
    <circle cx="0" cy="0" r="140" fill="url(#centerGlow)"/>

    <!-- Orbital Cycle Rings -->
    <circle cx="0" cy="0" r="95" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
    <circle cx="0" cy="0" r="75" fill="#0b1120" stroke="#1e293b" stroke-width="2" filter="url(#shadow)"/>

    <!-- Hub Icon / Text -->
    <text class="hub-sub" text-anchor="middle" y="-28">VICO &amp; BRUNO</text>
    <text class="hub-title" text-anchor="middle" y="-6">RECIRCULATION</text>
    <text class="value" text-anchor="middle" y="14" font-size="10" fill="#94a3b8">Coincidentia Oppositorum</text>
    <text class="hub-sub" text-anchor="middle" y="32" fill="#38bdf8">1 → 2 → 3 → 4 → 1</text>
  </g>

  <!-- Large Cyclical Connecting Arcs -->
  <g fill="none" stroke-width="3" stroke-linecap="round">
    <!-- 1 -> 2 (Top horizontal arrow: Gods to Heroes) -->
    <path d="M 445,170 Q 500,125 550,170" stroke="#f59e0b" marker-end="url(#arrowGold)" filter="url(#glowGold)"/>
    <text x="500" y="130" text-anchor="middle" class="card-tag" fill="#f59e0b">FEUDAL EMERGENCE</text>

    <!-- 2 -> 3 (Right vertical arrow: Heroes to Men) -->
    <path d="M 770,335 Q 815,395 770,460" stroke="#ef4444" marker-end="url(#arrowRed)" filter="url(#glowRed)"/>
    <text x="825" y="405" text-anchor="middle" class="card-tag" fill="#ef4444" transform="rotate(90, 825, 405)">DEMOCRATIZATION</text>

    <!-- 3 -> 4 (Bottom horizontal arrow: Men to Ricorso) -->
    <path d="M 555,625 Q 500,670 445,625" stroke="#3b82f6" marker-end="url(#arrowBlue)" filter="url(#glowBlue)"/>
    <text x="500" y="670" text-anchor="middle" class="card-tag" fill="#38bdf8">CATACLYSMIC FALL</text>

    <!-- 4 -> 1 (Left vertical arrow: Ricorso returning to Gods) -->
    <path d="M 230,460 Q 185,395 230,335" stroke="#10b981" marker-end="url(#arrowGreen)" filter="url(#glowGreen)"/>
    <text x="175" y="405" text-anchor="middle" class="card-tag" fill="#34d399" transform="rotate(-90, 175, 405)">THE RICORSO RETURN</text>
  </g>

  <!-- ==================== QUADRANT 1: AGE OF GODS ==================== -->
  <g transform="translate(45, 90)" filter="url(#shadow)">
    <!-- Card Frame -->
    <rect width="400" height="235" rx="14" fill="url(#cardGods)" stroke="#d97706" stroke-width="1.5"/>
    <rect width="398" height="4" x="1" y="1" fill="#f59e0b" rx="2"/>

    <!-- Header & Badge -->
    <g transform="translate(20, 32)">
      <rect x="0" y="-14" width="105" height="18" rx="4" fill="#78350f"/>
      <text class="card-tag" x="52" y="-1" text-anchor="middle" fill="#fde68a">BOOK I • pp. 3–216</text>

      <text class="card-title" x="0" y="24" fill="#fbbf24">1. The Age of Gods</text>
      <text class="subtitle" x="0" y="42" fill="#d97706">Divine &amp; Theocratic Genesis • The Patriarch HCE</text>
    </g>

    <!-- Details Grid -->
    <g transform="translate(20, 95)">
      <!-- Row 1: Language -->
      <text class="label" fill="#b45309" y="0">Language</text>
      <text class="value" y="16">Hieroglyphic, Mute, Sacred Poetic Myth</text>

      <!-- Row 2: Institutions -->
      <text class="label" fill="#b45309" y="42">Institutions</text>
      <text class="value" y="58">Religion, Auspices, Patriarchal Rule, Marriage from Fear</text>

      <!-- Row 3: Cosmic Voice -->
      <text class="label" fill="#b45309" y="84">Cosmic Voice</text>
      <text class="value" y="100">
        <tspan class="value-bold" fill="#fef3c7">The Thunderclap:</tspan> Awaken holy dread; retreat to caves
      </text>

      <!-- Row 4: Wake Symbol -->
      <rect x="0" y="112" width="360" height="20" rx="4" fill="#291804" stroke="#78350f" stroke-width="0.75"/>
      <text class="value" x="10" y="126" font-size="11" fill="#fef08a">
        <tspan font-weight="700">Wake Totem:</tspan> The Mountain, The Hod, Giant Finn MacCool
      </text>
    </g>
  </g>

  <!-- ==================== QUADRANT 2: AGE OF HEROES ==================== -->
  <g transform="translate(555, 90)" filter="url(#shadow)">
    <!-- Card Frame -->
    <rect width="400" height="235" rx="14" fill="url(#cardHeroes)" stroke="#dc2626" stroke-width="1.5"/>
    <rect width="398" height="4" x="1" y="1" fill="#ef4444" rx="2"/>

    <!-- Header & Badge -->
    <g transform="translate(20, 32)">
      <rect x="0" y="-14" width="115" height="18" rx="4" fill="#7f1d1d"/>
      <text class="card-tag" x="57" y="-1" text-anchor="middle" fill="#fecaca">BOOK II • pp. 217–399</text>

      <text class="card-title" x="0" y="24" fill="#f87171">2. The Age of Heroes</text>
      <text class="subtitle" x="0" y="42" fill="#ef4444">Aristocratic &amp; Feudal Warfare • The Sons Clash</text>
    </g>

    <!-- Details Grid -->
    <g transform="translate(20, 95)">
      <!-- Row 1: Language -->
      <text class="label" fill="#b91c1c" y="0">Language</text>
      <text class="value" y="16">Metaphorical, Symbolic, Heraldic, Chivalric</text>

      <!-- Row 2: Institutions -->
      <text class="label" fill="#b91c1c" y="42">Institutions</text>
      <text class="value" y="58">Feudal Castes, Faction, Noble Chivalry, Clientship</text>

      <!-- Row 3: Dominance -->
      <text class="label" fill="#b91c1c" y="84">Dominance</text>
      <text class="value" y="100">
        <tspan class="value-bold" fill="#fee2e2">Castes &amp; Noble Might:</tspan> Shields, arms, martial prowess
      </text>

      <!-- Row 4: Wake Symbol -->
      <rect x="0" y="112" width="360" height="20" rx="4" fill="#2a0a0a" stroke="#7f1d1d" stroke-width="0.75"/>
      <text class="value" x="10" y="126" font-size="11" fill="#fca5a5">
        <tspan font-weight="700">Wake Totem:</tspan> Nightlessons, Shem vs. Shaun, The Tavern
      </text>
    </g>
  </g>

  <!-- ==================== QUADRANT 3: AGE OF MEN ==================== -->
  <g transform="translate(555, 475)" filter="url(#shadow)">
    <!-- Card Frame -->
    <rect width="400" height="235" rx="14" fill="url(#cardMen)" stroke="#2563eb" stroke-width="1.5"/>
    <rect width="398" height="4" x="1" y="1" fill="#3b82f6" rx="2"/>

    <!-- Header & Badge -->
    <g transform="translate(20, 32)">
      <rect x="0" y="-14" width="120" height="18" rx="4" fill="#1e3a8a"/>
      <text class="card-tag" x="60" y="-1" text-anchor="middle" fill="#bfdbfe">BOOK III • pp. 403–590</text>

      <text class="card-title" x="0" y="24" fill="#60a5fa">3. The Age of Men</text>
      <text class="subtitle" x="0" y="42" fill="#3b82f6">Human, Democratic &amp; Civil Law • The Skeptical Disintegration</text>
    </g>

    <!-- Details Grid -->
    <g transform="translate(20, 95)">
      <!-- Row 1: Language -->
      <text class="label" fill="#1d4ed8" y="0">Language</text>
      <text class="value" y="16">Epistolary, Vulgar Common Speech, Conceptual Law</text>

      <!-- Row 2: Institutions -->
      <text class="label" fill="#1d4ed8" y="42">Institutions</text>
      <text class="value" y="58">Burial, Courts of Justice, Commerce, Civil Equality</text>

      <!-- Row 3: Degeneration -->
      <text class="label" fill="#1d4ed8" y="84">Degeneration</text>
      <text class="value" y="100">
        <tspan class="value-bold" fill="#dbeafe">Barbarie della riflessione:</tspan> Individual skepticism &amp; decay
      </text>

      <!-- Row 4: Wake Symbol -->
      <rect x="0" y="112" width="360" height="20" rx="4" fill="#071b38" stroke="#1e3a8a" stroke-width="0.75"/>
      <text class="value" x="10" y="126" font-size="11" fill="#93c5fd">
        <tspan font-weight="700">Wake Totem:</tspan> Shaun rolling in barrel, Yawn's trial, The Bed
      </text>
    </g>
  </g>

  <!-- ==================== QUADRANT 4: THE RICORSO ==================== -->
  <g transform="translate(45, 475)" filter="url(#shadow)">
    <!-- Card Frame -->
    <rect width="400" height="235" rx="14" fill="url(#cardRicorso)" stroke="#059669" stroke-width="1.5"/>
    <rect width="398" height="4" x="1" y="1" fill="#10b981" rx="2"/>

    <!-- Header & Badge -->
    <g transform="translate(20, 32)">
      <rect x="0" y="-14" width="118" height="18" rx="4" fill="#064e3b"/>
      <text class="card-tag" x="59" y="-1" text-anchor="middle" fill="#a7f3d0">BOOK IV • pp. 591–628</text>

      <text class="card-title" x="0" y="24" fill="#34d399">4. The Ricorso</text>
      <text class="subtitle" x="0" y="42" fill="#10b981">The Cataclysmic Return &amp; Dawn • River Dissolves into Sea</text>
    </g>

    <!-- Details Grid -->
    <g transform="translate(20, 95)">
      <!-- Row 1: Language -->
      <text class="label" fill="#047857" y="0">Language</text>
      <text class="value" y="16">Cataclysmic, Polyphonic Dissolution, Lyrical Dawn</text>

      <!-- Row 2: Action -->
      <text class="label" fill="#047857" y="42">Cosmic Action</text>
      <text class="value" y="58">10th Thunderclap ("restituted"), Cleansing Ocean Tide</text>

      <!-- Row 3: Restart -->
      <text class="label" fill="#047857" y="84">Restart</text>
      <text class="value" y="100">
        <tspan class="value-bold" fill="#d1fae5">Circular Recirculation:</tspan> "...a long the" → "riverrun..."
      </text>

      <!-- Row 4: Wake Symbol -->
      <rect x="0" y="112" width="360" height="20" rx="4" fill="#04261a" stroke="#064e3b" stroke-width="0.75"/>
      <text class="value" x="10" y="126" font-size="11" fill="#6ee7b7">
        <tspan font-weight="700">Wake Totem:</tspan> St. Kevin, St. Patrick vs. Balkelly, ALP's Monologue
      </text>
    </g>
  </g>
</svg>
"""


def build_data_isolation_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680" width="100%" height="100%">
  <defs>
    <linearGradient id="isoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#060910"/>
    </linearGradient>
    <linearGradient id="publicBox" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#022c22" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="localBox" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7f1d1d" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#450a0a" stop-opacity="0.35"/>
    </linearGradient>
    <filter id="boxShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <style>
    .header-title { font-family: ui-serif, Georgia, serif; font-size: 22px; font-weight: 700; fill: #ffffff; }
    .header-sub { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; fill: #94a3b8; }
    .zone-title { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; }
    .card-head { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 13px; font-weight: 700; }
    .card-text { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #cbd5e1; }
    .badge { font-family: ui-monospace, monospace; font-size: 10px; font-weight: 600; }
  </style>

  <!-- Background -->
  <rect width="1000" height="680" fill="url(#isoBg)" rx="16"/>
  <rect width="998" height="678" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="1" rx="16"/>

  <!-- Title Header -->
  <g transform="translate(500, 42)" text-anchor="middle">
    <text class="header-title">ZERO-COPYRIGHT DATA ISOLATION ARCHITECTURE</text>
    <text class="header-sub" y="22">Air-Gapped Decoupling of Open Metadata Coordinates (PPP.LL) from Local Copyrighted EPUB Streaming</text>
  </g>

  <!-- ==================== UPPER ZONE: PUBLIC REPOSITORY ==================== -->
  <g transform="translate(40, 85)">
    <!-- Zone Boundary Frame -->
    <rect width="920" height="230" rx="12" fill="url(#publicBox)" stroke="#059669" stroke-width="1.5" stroke-dasharray="8 4"/>
    
    <!-- Zone Label -->
    <g transform="translate(20, -10)">
      <rect width="360" height="22" rx="6" fill="#065f46" stroke="#10b981" stroke-width="1"/>
      <text class="zone-title" x="180" y="15" text-anchor="middle" fill="#d1fae5">
        PUBLIC GITHUB MONOREPO • CC BY-SA 4.0 &amp; GPL-3.0
      </text>
    </g>

    <!-- Card 1: Schemas -->
    <g transform="translate(30, 30)" filter="url(#boxShadow)">
      <rect width="260" height="170" rx="10" fill="#062018" stroke="#10b981" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#34d399" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#6ee7b7">schemas/page-annotation</text>
        <text class="badge" y="20" fill="#10b981">JSON SCHEMA DRAFT 2020-12</text>
        <path d="M 0,28 L 230,28" stroke="#064e3b" stroke-width="1"/>
        <text class="card-text" y="46">• Page bounds: canonical 1–628</text>
        <text class="card-text" y="66">• Line bounds: canonical 01–40</text>
        <text class="card-text" y="86">• Target Lemma: ≤ 150 chars max</text>
        <text class="card-text" y="106">• Register enum &amp; web citations</text>
        <text class="card-text" y="126" fill="#a7f3d0" font-weight="600">✓ Enforced by node validate.js</text>
      </g>
    </g>

    <!-- Card 2: Annotations -->
    <g transform="translate(330, 30)" filter="url(#boxShadow)">
      <rect width="260" height="170" rx="10" fill="#062018" stroke="#10b981" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#34d399" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#6ee7b7">annotations/&lt;title&gt;/...</text>
        <text class="badge" y="20" fill="#10b981">628 CANONICAL PAGE FILES</text>
        <path d="M 0,28 L 230,28" stroke="#064e3b" stroke-width="1"/>
        <text class="card-text" y="46">• 1,850+ scholarly line glosses</text>
        <text class="card-text" y="66">• 18 analytical registers</text>
        <text class="card-text" y="86">• Multilingual etymologies (60+)</text>
        <text class="card-text" y="106">• Internet Archive deep links</text>
        <text class="card-text" y="126" fill="#a7f3d0" font-weight="600">✓ Zero copyrighted paragraphs</text>
      </g>
    </g>

    <!-- Card 3: Web App Client -->
    <g transform="translate(630, 30)" filter="url(#boxShadow)">
      <rect width="260" height="170" rx="10" fill="#062018" stroke="#10b981" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#34d399" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#6ee7b7">web/ &amp; packages/reader</text>
        <text class="badge" y="20" fill="#10b981">NEXT.JS 16 &amp; REACT 19</text>
        <path d="M 0,28 L 230,28" stroke="#064e3b" stroke-width="1"/>
        <text class="card-text" y="46">• Static export on GitHub Pages</text>
        <text class="card-text" y="66">• 19 reading themes (Solarized, etc.)</text>
        <text class="card-text" y="86">• Zen Fullscreen Mode (F / Esc)</text>
        <text class="card-text" y="106">• Client-side index coordinate join</text>
        <text class="card-text" y="126" fill="#a7f3d0" font-weight="600">✓ Pure browser-side hydration</text>
      </g>
    </g>
  </g>

  <!-- ==================== MIDDLE AIR GAP / LEGAL BOUNDARY ==================== -->
  <g transform="translate(50, 340)">
    <!-- Barrier Bar -->
    <rect width="900" height="42" rx="8" fill="#1e1b2e" stroke="#dc2626" stroke-width="2"/>
    <g transform="translate(450, 26)" text-anchor="middle">
      <text font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="700" fill="#fca5a5" letter-spacing="0.1em">
        ⛔ STRICT LEGAL EXECUTION BOUNDARY • GITIGNORED AIR GAP (17 U.S.C. § 107) ⛔
      </text>
    </g>
  </g>

  <!-- Flow Arrows Crossing Boundary via Coordinate Pointer Only -->
  <g stroke="#38bdf8" stroke-width="2" fill="none" stroke-dasharray="4 4">
    <path d="M 270,315 L 270,395" marker-end="url(#arrowBlue)"/>
    <path d="M 730,395 L 730,315" marker-end="url(#arrowBlue)"/>
  </g>
  <text x="215" y="365" font-family="ui-monospace, monospace" font-size="10" fill="#38bdf8" text-anchor="end">Query: PPP.LL</text>
  <text x="785" y="365" font-family="ui-monospace, monospace" font-size="10" fill="#38bdf8" text-anchor="start">Ephemeral Stream</text>

  <!-- ==================== LOWER ZONE: LOCAL CLIENT RUNTIME ==================== -->
  <g transform="translate(40, 400)">
    <!-- Zone Boundary Frame -->
    <rect width="920" height="235" rx="12" fill="url(#localBox)" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="8 4"/>

    <!-- Zone Label -->
    <g transform="translate(20, -10)">
      <rect width="420" height="22" rx="6" fill="#7f1d1d" stroke="#ef4444" stroke-width="1"/>
      <text class="zone-title" x="210" y="15" text-anchor="middle" fill="#fee2e2">
        STRICTLY LOCAL HOST ENVIRONMENT (NEVER COMMITTED TO GIT)
      </text>
    </g>

    <!-- Card 1: Local EPUB -->
    <g transform="translate(30, 30)" filter="url(#boxShadow)">
      <rect width="260" height="175" rx="10" fill="#1f0707" stroke="#ef4444" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#f87171" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#fca5a5">data/*.epub (Local Archive)</text>
        <text class="badge" y="20" fill="#ef4444">USER-SUPPLIED LEGAL COPY</text>
        <path d="M 0,28 L 230,28" stroke="#7f1d1d" stroke-width="1"/>
        <text class="card-text" y="46">• Downloaded via pnpm fetch:data</text>
        <text class="card-text" y="66">• Internet Archive 1939 Viking scan</text>
        <text class="card-text" y="86">• Excluded by .gitignore rule</text>
        <text class="card-text" y="106">• Never committed, pushed or shared</text>
        <text class="card-text" y="126" fill="#fca5a5" font-weight="600">✓ US Copyright safe until 2036</text>
      </g>
    </g>

    <!-- Card 2: Memory Streaming Reader -->
    <g transform="translate(330, 30)" filter="url(#boxShadow)">
      <rect width="260" height="175" rx="10" fill="#1f0707" stroke="#ef4444" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#f87171" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#fca5a5">Memory Stream Inflation</text>
        <text class="badge" y="20" fill="#ef4444">ZERO DISK PERSISTENCE</text>
        <path d="M 0,28 L 230,28" stroke="#7f1d1d" stroke-width="1"/>
        <text class="card-text" y="46">• Pure TypeScript ZIP central dir</text>
        <text class="card-text" y="66">• Dynamic inflateRaw in Node/Browser</text>
        <text class="card-text" y="86">• Spine &amp; TOC pagination parser</text>
        <text class="card-text" y="106">• Streamed directly to DOM nodes</text>
        <text class="card-text" y="126" fill="#fca5a5" font-weight="600">✓ Ephemeral buffer discarded</text>
      </g>
    </g>

    <!-- Card 3: Cryptographic Provenance -->
    <g transform="translate(630, 30)" filter="url(#boxShadow)">
      <rect width="260" height="175" rx="10" fill="#1f0707" stroke="#ef4444" stroke-width="1"/>
      <rect width="258" height="3" x="1" y="1" fill="#f87171" rx="1.5"/>
      <g transform="translate(15, 25)">
        <text class="card-head" fill="#fca5a5">data_sigs/SHA256SUMS</text>
        <text class="badge" y="20" fill="#ef4444">CRYPTOGRAPHIC PROVENANCE</text>
        <path d="M 0,28 L 230,28" stroke="#7f1d1d" stroke-width="1"/>
        <text class="card-text" y="46">• Verifies 1,047 data file hashes</text>
        <text class="card-text" y="66">• Authoritative public manifest</text>
        <text class="card-text" y="86">• python3 verify_data.py check</text>
        <text class="card-text" y="106">• Prevents corrupted archives</text>
        <text class="card-text" y="126" fill="#fca5a5" font-weight="600">✓ 100% scientific reproducibility</text>
      </g>
    </g>
  </g>
</svg>
"""


def build_joyce_sigla_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="100%" height="100%">
  <defs>
    <linearGradient id="siglaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070913"/>
      <stop offset="50%" stop-color="#0f1424"/>
      <stop offset="100%" stop-color="#05070f"/>
    </linearGradient>

    <linearGradient id="hceCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c1917" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0c0a09" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="alpCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042f2e" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#021a19" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="shemCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0f0d26" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="shaunCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#312e81" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="issyCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4a044e" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#28022a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="mamaCard" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#0a2a16" stop-opacity="0.95"/>
    </linearGradient>

    <filter id="sigShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <style>
    .title { font-family: ui-serif, Georgia, serif; font-size: 22px; font-weight: 700; fill: #ffffff; }
    .sub { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; fill: #94a3b8; }
    .sigla-symbol { font-family: "Courier New", Courier, monospace, serif; font-size: 44px; font-weight: 700; }
    .card-title { font-family: ui-serif, Georgia, serif; font-size: 16px; font-weight: 700; }
    .archetype { font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
    .desc { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #cbd5e1; }
    .relation-label { font-family: ui-monospace, monospace; font-size: 10px; font-weight: 700; fill: #e2e8f0; }
  </style>

  <!-- Background -->
  <rect width="1000" height="700" fill="url(#siglaBg)" rx="16"/>
  <rect width="998" height="698" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="1" rx="16"/>

  <!-- Header -->
  <g transform="translate(500, 42)" text-anchor="middle">
    <text class="title">THE BUFFALO NOTEBOOKS SIGLA CONSTELLATION</text>
    <text class="sub" y="22">James Joyce’s Hieroglyphic Notation for the Mythic Dramatis Personae of Finnegans Wake</text>
  </g>

  <!-- Relational Connector Lines Behind Cards -->
  <g stroke-width="2" fill="none" opacity="0.6">
    <!-- HCE <-> ALP (Marriage/Union) -->
    <path d="M 330,170 L 670,170" stroke="#f59e0b" stroke-dasharray="6 4"/>
    <!-- Parents -> Children -->
    <path d="M 280,245 L 200,340" stroke="#94a3b8" stroke-dasharray="4 4"/>
    <path d="M 500,170 L 500,340" stroke="#94a3b8" stroke-dasharray="4 4"/>
    <path d="M 720,245 L 800,340" stroke="#94a3b8" stroke-dasharray="4 4"/>
    <!-- Shem <-> Shaun (Dialectical Opposition) -->
    <path d="M 300,420 L 700,420" stroke="#a855f7" stroke-dasharray="6 4"/>
  </g>

  <!-- Central Relationship Badges -->
  <g transform="translate(500, 170)" text-anchor="middle">
    <rect x="-70" y="-12" width="140" height="24" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="1"/>
    <text class="relation-label" y="4">MARRIAGE / L&amp;H</text>
  </g>
  <g transform="translate(500, 420)" text-anchor="middle">
    <rect x="-95" y="-12" width="190" height="24" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="1"/>
    <text class="relation-label" y="4" fill="#c084fc">COINCIDENTIA OPPOSITORUM</text>
  </g>

  <!-- ==================== TOP ROW: THE PARENTS ==================== -->
  
  <!-- 1. HCE (The Mountain) -->
  <g transform="translate(80, 85)" filter="url(#sigShadow)">
    <rect width="260" height="170" rx="14" fill="url(#hceCard)" stroke="#d97706" stroke-width="1.5"/>
    <g transform="translate(20, 35)">
      <!-- Siglum Symbol -->
      <text class="sigla-symbol" x="0" y="25" fill="#f59e0b">∐</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#fbbf24">HCE</text>
        <text class="archetype" y="16" fill="#f59e0b">THE MOUNTAIN / PATRIARCH</text>
        <text class="desc" y="32">Humphrey Chimpden Earwicker</text>
      </g>
      <path d="M 0,45 L 220,45" stroke="#78350f" stroke-width="1"/>
      <g transform="translate(0, 62)">
        <text class="desc" y="0">• "Here Comes Everybody" / Howth Head</text>
        <text class="desc" y="18">• Entombed Giant Finn MacCool in hills</text>
        <text class="desc" y="36">• Guilt in Phoenix Park; stutter of fear</text>
        <text class="desc" y="54" fill="#fde68a" font-weight="600">Totem: Boulder, Oak, Chapelizod Tavern</text>
      </g>
    </g>
  </g>

  <!-- 2. ALP (The River) -->
  <g transform="translate(660, 85)" filter="url(#sigShadow)">
    <rect width="260" height="170" rx="14" fill="url(#alpCard)" stroke="#14b8a6" stroke-width="1.5"/>
    <g transform="translate(20, 35)">
      <!-- Siglum Symbol -->
      <text class="sigla-symbol" x="0" y="25" fill="#2dd4bf">Δ</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#5eead4">ALP</text>
        <text class="archetype" y="16" fill="#14b8a6">THE RIVER / MOTHER &amp; WIFE</text>
        <text class="desc" y="32">Anna Livia Plurabelle</text>
      </g>
      <path d="M 0,45 L 220,45" stroke="#134e4a" stroke-width="1"/>
      <g transform="translate(0, 62)">
        <text class="desc" y="0">• The River Liffey; stream of renewal</text>
        <text class="desc" y="18">• Dictates the Midden Letter of defense</text>
        <text class="desc" y="36">• Dissolves into bitter sea at daybreak</text>
        <text class="desc" y="54" fill="#99f6e4" font-weight="600">Totem: Fresh water, Hen, Washerwomen</text>
      </g>
    </g>
  </g>

  <!-- ==================== MIDDLE ROW: THE CHILDREN ==================== -->

  <!-- 3. SHEM THE PENMAN -->
  <g transform="translate(60, 335)" filter="url(#sigShadow)">
    <rect width="260" height="170" rx="14" fill="url(#shemCard)" stroke="#818cf8" stroke-width="1.5"/>
    <g transform="translate(20, 35)">
      <text class="sigla-symbol" x="0" y="25" fill="#a5b4fc">[</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#c7d2fe">Shem the Penman</text>
        <text class="archetype" y="16" fill="#818cf8">THE TREE / INWARD ARTIST</text>
        <text class="desc" y="32">Joyce's Alter Ego (Jerry)</text>
      </g>
      <path d="M 0,45 L 220,45" stroke="#312e81" stroke-width="1"/>
      <g transform="translate(0, 62)">
        <text class="desc" y="0">• Outcast rebel, blasphemer, alchemist</text>
        <text class="desc" y="18">• Writes on own skin with bodily ink</text>
        <text class="desc" y="36">• Associated with elm tree, dark, time</text>
        <text class="desc" y="54" fill="#c7d2fe" font-weight="600">Totem: Elm tree, Crow, Sorrow, Night</text>
      </g>
    </g>
  </g>

  <!-- 4. ISSY (The Looking-Glass) -->
  <g transform="translate(370, 335)" filter="url(#sigShadow)">
    <rect width="260" height="170" rx="14" fill="url(#issyCard)" stroke="#d946ef" stroke-width="1.5"/>
    <g transform="translate(20, 35)">
      <text class="sigla-symbol" x="0" y="25" fill="#f0abfc">⊣</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#f5d0fe">Issy</text>
        <text class="archetype" y="16" fill="#d946ef">THE MIRROR / DAUGHTER</text>
        <text class="desc" y="32">Isolde / Stella &amp; Vanessa</text>
      </g>
      <path d="M 0,45 L 220,45" stroke="#701a75" stroke-width="1"/>
      <g transform="translate(0, 62)">
        <text class="desc" y="0">• Prismatic looking-glass mirror-self</text>
        <text class="desc" y="18">• Dual split personality in boudoir</text>
        <text class="desc" y="36">• Surrounded by 28 Rainbow Girls</text>
        <text class="desc" y="54" fill="#f5d0fe" font-weight="600">Totem: Cloud, Vapour, Rainbow, Maggies</text>
      </g>
    </g>
  </g>

  <!-- 5. SHAUN THE POST -->
  <g transform="translate(680, 335)" filter="url(#sigShadow)">
    <rect width="260" height="170" rx="14" fill="url(#shaunCard)" stroke="#6366f1" stroke-width="1.5"/>
    <g transform="translate(20, 35)">
      <text class="sigla-symbol" x="0" y="25" fill="#a5b4fc">]</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#c7d2fe">Shaun the Post</text>
        <text class="archetype" y="16" fill="#6366f1">THE STONE / EXTERNAL VOICE</text>
        <text class="desc" y="32">The Conformist (Kevin)</text>
      </g>
      <path d="M 0,45 L 220,45" stroke="#312e81" stroke-width="1"/>
      <g transform="translate(0, 62)">
        <text class="desc" y="0">• Favorite of Church &amp; State; orator</text>
        <text class="desc" y="18">• Delivers letter he cannot comprehend</text>
        <text class="desc" y="36">• Rolls down Liffey in a floating barrel</text>
        <text class="desc" y="54" fill="#c7d2fe" font-weight="600">Totem: Stone, Postman's Bag, White, Day</text>
      </g>
    </g>
  </g>

  <!-- ==================== BOTTOM ROW: CHORUS & JUDGES ==================== -->

  <!-- 6. MAMALUJO (The Four) -->
  <g transform="translate(140, 525)" filter="url(#sigShadow)">
    <rect width="330" height="145" rx="12" fill="url(#mamaCard)" stroke="#16a34a" stroke-width="1.5"/>
    <g transform="translate(20, 25)">
      <text class="sigla-symbol" x="0" y="25" fill="#4ade80">⊥</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#86efac">⊥ Mamalujo (The Four)</text>
        <text class="archetype" y="16" fill="#16a34a">EVANGELISTS, PROVINCES &amp; GULLS</text>
        <text class="desc" y="32">Matt Gregory, Mark Lyons, Luke Tarpey, Johnny MacDougall</text>
      </g>
      <path d="M 0,42 L 290,42" stroke="#14532d" stroke-width="1"/>
      <g transform="translate(0, 56)">
        <text class="desc" y="0">• Four Gospels, 4 Irish Provinces (Ulster, Munster, Leinster, Connaught)</text>
        <text class="desc" y="18">• 4 Bedposts of HCE's bed; four squawking gulls over Dublin Bay</text>
        <text class="desc" y="36" fill="#bbf7d0" font-weight="600">Role: Senile voyeurs, chroniclers, historians of the Fall</text>
      </g>
    </g>
  </g>

  <!-- 7. THE TWELVE CUSTOMERS (S) -->
  <g transform="translate(530, 525)" filter="url(#sigShadow)">
    <rect width="330" height="145" rx="12" fill="#111827" stroke="#64748b" stroke-width="1.5"/>
    <g transform="translate(20, 25)">
      <text class="sigla-symbol" x="0" y="25" fill="#94a3b8">S</text>
      <g transform="translate(60, 0)">
        <text class="card-title" fill="#e2e8f0">S The Twelve</text>
        <text class="archetype" y="16" fill="#94a3b8">JURORS, ZODIAC &amp; PUBLIC OPINION</text>
        <text class="desc" y="32">The Customers of HCE's Chapelizod Pub</text>
      </g>
      <path d="M 0,42 L 290,42" stroke="#334155" stroke-width="1"/>
      <g transform="translate(0, 56)">
        <text class="desc" y="0">• 12 Jurors at HCE's trial, 12 Zodiac signs, 12 Apostles</text>
        <text class="desc" y="18">• Constant Greek chorus of Dublin gossip, gossipers, and drinkers</text>
        <text class="desc" y="36" fill="#e2e8f0" font-weight="600">Role: Condemning, discussing, and ordering another round of porter</text>
      </g>
    </g>
  </g>
</svg>
"""


def build_ouroboros_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" width="100%" height="100%">
  <defs>
    <linearGradient id="ouroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12"/>
      <stop offset="50%" stop-color="#0b1329"/>
      <stop offset="100%" stop-color="#050810"/>
    </linearGradient>

    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="30%" stop-color="#3b82f6"/>
      <stop offset="70%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>

    <filter id="ouroShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <style>
    .title { font-family: ui-serif, Georgia, serif; font-size: 22px; font-weight: 700; fill: #ffffff; }
    .sub { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; fill: #94a3b8; }
    .quote { font-family: ui-serif, Georgia, serif; font-style: italic; font-size: 15px; }
    .page-tag { font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; }
    .stage-title { font-family: ui-serif, Georgia, serif; font-size: 15px; font-weight: 700; fill: #ffffff; }
    .stage-desc { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; fill: #cbd5e1; }
  </style>

  <rect width="1000" height="600" fill="url(#ouroBg)" rx="16"/>
  <rect width="998" height="598" x="1" y="1" fill="none" stroke="#1e293b" stroke-width="1" rx="16"/>

  <!-- Header -->
  <g transform="translate(500, 42)" text-anchor="middle">
    <text class="title">THE OUROBORIC RECIRCULATION</text>
    <text class="sub" y="22">The Endless Circular Sentence Linking the Book's Final Page (FW 628) Directly to its Opening Word (FW 003)</text>
  </g>

  <!-- Large Infinity / Loop Path -->
  <g transform="translate(500, 310)">
    <!-- Outer Glow Circle -->
    <ellipse cx="0" cy="0" rx="360" ry="160" fill="none" stroke="url(#ringGrad)" stroke-width="6" stroke-dasharray="12 6" opacity="0.8"/>
    <ellipse cx="0" cy="0" rx="340" ry="140" fill="none" stroke="#1e293b" stroke-width="1.5"/>

    <!-- Central Core -->
    <circle cx="0" cy="0" r="60" fill="#0c1322" stroke="#334155" stroke-width="2" filter="url(#ouroShadow)"/>
    <text font-family="ui-serif, Georgia, serif" font-size="28" fill="#38bdf8" text-anchor="middle" y="9">∞</text>
    <text font-family="ui-monospace, monospace" font-size="9" fill="#94a3b8" text-anchor="middle" y="26">ENDLESS RETURN</text>
  </g>

  <!-- Node 1 (Left): Closing of Book IV (Page 628.15-16) -->
  <g transform="translate(60, 180)" filter="url(#ouroShadow)">
    <rect width="360" height="240" rx="14" fill="#041a1a" stroke="#14b8a6" stroke-width="1.5"/>
    <rect width="358" height="4" x="1" y="1" fill="#2dd4bf" rx="2"/>
    <g transform="translate(20, 30)">
      <rect x="0" y="-12" width="130" height="18" rx="4" fill="#134e4a"/>
      <text class="page-tag" x="65" y="1" text-anchor="middle" fill="#99f6e4">BOOK IV • PAGE 628</text>
      
      <text class="stage-title" y="32" fill="#2dd4bf">The Dying Whisper of ALP</text>
      <text class="quote" y="65" fill="#f0fdfa">
        "A way a lone a last a loved a long the"
      </text>
      <path d="M 0,85 L 320,85" stroke="#115e59" stroke-width="1"/>
      <g transform="translate(0, 105)">
        <text class="stage-desc" y="0">• Anna Livia Plurabelle's river waters reach Dublin Bay</text>
        <text class="stage-desc" y="18">• Dissolves into the cold, bitter brine of the Atlantic ocean</text>
        <text class="stage-desc" y="36">• The sentence ends without a period or closing stop</text>
        <text class="stage-desc" y="54" fill="#5eead4" font-weight="600">The mother dies into the sea; the waters rise into mist</text>
      </g>
    </g>
  </g>

  <!-- Node 2 (Right): Opening of Book I (Page 003.01) -->
  <g transform="translate(580, 180)" filter="url(#ouroShadow)">
    <rect width="360" height="240" rx="14" fill="#08182b" stroke="#3b82f6" stroke-width="1.5"/>
    <rect width="358" height="4" x="1" y="1" fill="#60a5fa" rx="2"/>
    <g transform="translate(20, 30)">
      <rect x="0" y="-12" width="130" height="18" rx="4" fill="#1e3a8a"/>
      <text class="page-tag" x="65" y="1" text-anchor="middle" fill="#bfdbfe">BOOK I • PAGE 003</text>
      
      <text class="stage-title" y="32" fill="#60a5fa">The Resumption of the Riverrun</text>
      <text class="quote" y="65" fill="#eff6ff">
        "riverrun, past Eve and Adam's, from swerve of shore..."
      </text>
      <path d="M 0,85 L 320,85" stroke="#1e40af" stroke-width="1"/>
      <g transform="translate(0, 105)">
        <text class="stage-desc" y="0">• Resumes without a capital letter, completing page 628</text>
        <text class="stage-desc" y="18">• "brings us by a commodius vicus of recirculation"</text>
        <text class="stage-desc" y="36">• Returns us back to Howth Castle and Environs (HCE)</text>
        <text class="stage-desc" y="54" fill="#93c5fd" font-weight="600">Rain falls in Wicklow mountains; the cycle re-begins</text>
      </g>
    </g>
  </g>

  <!-- Top Synthesis Bar -->
  <g transform="translate(160, 480)" filter="url(#ouroShadow)">
    <rect width="680" height="75" rx="12" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
    <g transform="translate(340, 28)" text-anchor="middle">
      <text class="stage-desc" fill="#38bdf8" font-size="11" font-weight="700">THE SYNTACTIC &amp; HYDROLOGICAL SYNTHESIS:</text>
      <text class="quote" y="24" fill="#f8fafc" font-size="14">
        "A way a lone a last a loved a long the riverrun, past Eve and Adam's..."
      </text>
    </g>
  </g>
</svg>
"""


def main():
    figs = {
        "viconian-cycle.svg": build_viconian_cycle_svg(),
        "data-isolation-pipeline.svg": build_data_isolation_svg(),
        "joyce-sigla-constellation.svg": build_joyce_sigla_svg(),
        "ouroboros-circulation.svg": build_ouroboros_svg(),
        "euclidean-dolph-diagram.svg": build_euclidean_dolph_diagram_svg(),
    }

    for fname, content in figs.items():
        p1 = FIGURES_DIR / fname
        p2 = PUBLIC_FIGURES_DIR / fname
        p1.write_text(content.strip() + "\n", encoding="utf-8")
        p2.write_text(content.strip() + "\n", encoding="utf-8")
        print(f"✅ Generated {fname} -> {p1.relative_to(REPO_ROOT)} and {p2.relative_to(REPO_ROOT)}")

def build_euclidean_dolph_diagram_svg() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 650" width="100%" height="100%">
  <defs>
    <linearGradient id="bgEuclid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070a12"/>
      <stop offset="50%" stop-color="#0c1322"/>
      <stop offset="100%" stop-color="#050810"/>
    </linearGradient>

    <radialGradient id="vesicaGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <filter id="euclidShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>
    </filter>

    <clipPath id="circleLeftClip">
      <circle cx="370" cy="310" r="150"/>
    </clipPath>
  </defs>

  <style>
    .title { font-family: 'Cinzel', serif, system-ui; font-weight: 700; fill: #f8fafc; }
    .subtitle { font-family: system-ui, -apple-system, sans-serif; fill: #94a3b8; font-size: 13px; }
    .point-label { font-family: 'Cinzel', serif, monospace; font-weight: 700; font-size: 18px; fill: #fbbf24; }
    .geom-note { font-family: system-ui, -apple-system, sans-serif; font-size: 12px; fill: #cbd5e1; }
    .card-title { font-family: system-ui, -apple-system, sans-serif; font-weight: 700; font-size: 14px; }
  </style>

  <!-- Background -->
  <rect width="900" height="650" fill="url(#bgEuclid)" rx="16" stroke="#1e293b" stroke-width="1.5"/>

  <!-- Header -->
  <g transform="translate(450, 45)" text-anchor="middle">
    <text class="title" font-size="22" letter-spacing="1.5">THE EUCLIDEAN VESICA PISCIS &amp; THE DELTA (FW 293)</text>
    <text class="subtitle" y="24">The Sole Geometric Diagram in the 1939 First Edition • Dolph's Nightlesson to Kev (II.2)</text>
  </g>

  <!-- Left/Center: The Diagram Construction -->
  <g transform="translate(0, 0)">
    <!-- Vesica Piscis Intersect Glow -->
    <path d="M 450,180 A 150,150 0 0,1 450,440 A 150,150 0 0,1 450,180 Z" fill="url(#vesicaGlow)"/>

    <!-- Circle 1 (Center at (370, 310)) -->
    <circle cx="370" cy="310" r="150" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>
    <!-- Circle 2 (Center at (530, 310)) -->
    <circle cx="530" cy="310" r="150" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="6,4" opacity="0.6"/>

    <!-- Intersection contour (Vesica Piscis) -->
    <path d="M 450,180 A 150,150 0 0,1 450,440 A 150,150 0 0,1 450,180 Z" fill="none" stroke="#ec4899" stroke-width="2.5"/>

    <!-- Equilateral Delta Triangle (A, L, P / vertices) -->
    <!-- Top Apex: A (450, 180) -->
    <!-- Bottom Left: L (370, 310) -->
    <!-- Bottom Right: P (530, 310) -->
    <polygon points="450,180 370,310 530,310" fill="#ec4899" fill-opacity="0.15" stroke="#f43f5e" stroke-width="2.5"/>

    <!-- Inverted Triangle (Reflection / Coincidentia Oppositorum) -->
    <polygon points="450,440 370,310 530,310" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,4"/>

    <!-- Horizontal Axis (Base of Delta) -->
    <line x1="320" y1="310" x2="580" y2="310" stroke="#64748b" stroke-width="1.5"/>

    <!-- Vertical Axis -->
    <line x1="450" y1="140" x2="450" y2="480" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3"/>

    <!-- Center Point Markers -->
    <circle cx="450" cy="180" r="5" fill="#fbbf24"/>
    <circle cx="370" cy="310" r="5" fill="#38bdf8"/>
    <circle cx="530" cy="310" r="5" fill="#a855f7"/>
    <circle cx="450" cy="440" r="5" fill="#34d399"/>
    <circle cx="450" cy="310" r="4" fill="#f8fafc"/>

    <!-- Labels on points (matching Joyce's diagram) -->
    <text class="point-label" x="450" y="165" text-anchor="middle">A</text>
    <text class="point-label" x="350" y="315" text-anchor="end" fill="#38bdf8">L</text>
    <text class="point-label" x="550" y="315" text-anchor="start" fill="#a855f7">P</text>
    <text class="point-label" x="450" y="465" text-anchor="middle" fill="#34d399">α</text>
    <text class="point-label" x="462" y="305" font-size="14" fill="#94a3b8">C</text>
  </g>

  <!-- Explanatory Side Panels -->
  <!-- Left Side: Dolph & Euclid -->
  <g transform="translate(35, 120)" filter="url(#euclidShadow)">
    <rect width="210" height="360" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <g transform="translate(16, 26)">
      <text class="card-title" fill="#38bdf8">DOLPH (SHEM)</text>
      <text class="geom-note" y="24" fill="#94a3b8">• The Inward Teacher / Artist</text>
      <text class="geom-note" y="44" fill="#94a3b8">• Euclid Elements Book I, Prop 1</text>
      <text class="geom-note" y="64" fill="#94a3b8">• Constructing equilateral triangle</text>
      <line x1="0" y1="80" x2="178" y2="80" stroke="#1e293b"/>
      <text class="card-title" y="105" fill="#fbbf24">HERMETIC READING</text>
      <text class="geom-note" y="125">• Triangle = Delta = ALP (Δ)</text>
      <text class="geom-note" y="145">• Vesica Piscis = Sacred Yoni</text>
      <text class="geom-note" y="165">• "The mudder's anatomy"</text>
      <text class="geom-note" y="185">• Source of all creation</text>
      <text class="geom-note" y="205">• Geometry as ontology</text>
      <line x1="0" y1="225" x2="178" y2="225" stroke="#1e293b"/>
      <text class="card-title" y="250" fill="#ec4899">TEXTUAL ORIGIN</text>
      <text class="geom-note" y="270">Book II, Ch. 2, Page 293</text>
      <text class="geom-note" y="290">Trivium &amp; Quadrivium</text>
      <text class="geom-note" y="310">Only visual cut in 1939 ed.</text>
    </g>
  </g>

  <!-- Right Side: Kev & Brunonian Coincidentia -->
  <g transform="translate(655, 120)" filter="url(#euclidShadow)">
    <rect width="210" height="360" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <g transform="translate(16, 26)">
      <text class="card-title" fill="#a855f7">KEV (SHAUN)</text>
      <text class="geom-note" y="24" fill="#94a3b8">• The Literal Pupil / Conformist</text>
      <text class="geom-note" y="44" fill="#94a3b8">• Shocked at the anatomical truth</text>
      <text class="geom-note" y="64" fill="#94a3b8">• Punches Dolph in the eye</text>
      <line x1="0" y1="80" x2="178" y2="80" stroke="#1e293b"/>
      <text class="card-title" y="105" fill="#34d399">BRUNONIAN AXIS</text>
      <text class="geom-note" y="125">• Upper Triangle (A-L-P): Spirit</text>
      <text class="geom-note" y="145">• Lower Triangle (α-L-P): Matter</text>
      <text class="geom-note" y="165">• Coincidence of Opposites</text>
      <text class="geom-note" y="185">• Hexagram / Seal of Solomon</text>
      <text class="geom-note" y="205">• Center point C = Cosmic Axis</text>
      <line x1="0" y1="225" x2="178" y2="225" stroke="#1e293b"/>
      <text class="card-title" y="250" fill="#38bdf8">MATHEMATICAL LOGIC</text>
      <text class="geom-note" y="270">Compass = Space / Shaun</text>
      <text class="geom-note" y="290">Ruler = Time / Shem</text>
      <text class="geom-note" y="310">Intersection = Eternal Return</text>
    </g>
  </g>

  <!-- Bottom Synthesis Banner -->
  <g transform="translate(120, 520)" filter="url(#euclidShadow)">
    <rect width="660" height="95" rx="12" fill="#0b1120" stroke="#3b82f6" stroke-width="1.2"/>
    <g transform="translate(330, 26)" text-anchor="middle">
      <text class="geom-note" fill="#38bdf8" font-weight="700">THE CONJUNCTIVE GEOMETRY OF JOYCE'S UNIVERSE:</text>
      <text class="geom-note" y="22" fill="#f8fafc" font-size="13">
        "Vieus empeor! amCalculation! First mull a circle round your hebb. Then cast an equilateral across her."
      </text>
      <text class="geom-note" y="42" fill="#94a3b8" font-size="11">
        Euclid's Proposition 1 transformed into maternal genesis, biological origin, and the reconciliation of Shem &amp; Shaun.
      </text>
    </g>
  </g>
</svg>
"""

if __name__ == "__main__":
    main()
