import { ReadingTheme } from './types.js';

export const BUILTIN_THEMES: ReadingTheme[] = [
  // 1. Light Daylight Theme (pure white with deep black font)
  {
    id: 'daylight-pure',
    name: 'Daylight White',
    description: 'Crisp, high-contrast pure white (#FFFFFF) with solid black font for bright sunlight and daytime reading.',
    category: 'light',
    isDark: false,
    colors: {
      bg: '#ffffff',
      text: '#000000',
      textMuted: '#4b5563',
      cardBg: '#f9fafb',
      border: '#e5e7eb',
      accent: '#059669',
      accentHover: '#047857',
      ring: '#10b981',
      readerBg: '#ffffff',
      readerText: '#000000',
      readerCoord: '#6b7280',
      selectionBg: '#a7f3d0',
      selectionText: '#064e3b',
    },
  },

  // 2. Warm Book Parchment
  {
    id: 'warm-parchment',
    name: 'Book Parchment',
    description: 'Subtle warm cream and antique paper tones that eliminate eye fatigue for marathon scholarly reading.',
    category: 'light',
    isDark: false,
    colors: {
      bg: '#fbf7ee',
      text: '#2c2416',
      textMuted: '#786851',
      cardBg: '#f4ede0',
      border: '#e2d5be',
      accent: '#b45309',
      accentHover: '#92400e',
      ring: '#d97706',
      readerBg: '#fefcf8',
      readerText: '#231d12',
      readerCoord: '#8c7b64',
      selectionBg: '#fed7aa',
      selectionText: '#451a03',
    },
  },

  // 3. Obsidian Pure OLED (Absolute #000000 and #FFFFFF)
  {
    id: 'obsidian-oled',
    name: 'Obsidian OLED',
    description: 'True pitch-black (#000000) pixels with stark white (#FFFFFF) text for zero power emission on OLED displays.',
    category: 'oled',
    isDark: true,
    colors: {
      bg: '#000000',
      text: '#ffffff',
      textMuted: '#9ca3af',
      cardBg: '#080808',
      border: '#262626',
      accent: '#10b981',
      accentHover: '#34d399',
      ring: '#059669',
      readerBg: '#000000',
      readerText: '#ffffff',
      readerCoord: '#737373',
      selectionBg: '#064e3b',
      selectionText: '#ecfdf5',
    },
  },

  // 4. Crimson Midnight (Soothing Dark Red for Night Vision)
  {
    id: 'dark-crimson',
    name: 'Crimson Midnight',
    description: 'Deep nocturnal maroon and soft burgundy red to preserve scotopic night vision and circadian rhythm.',
    category: 'dark-red',
    isDark: true,
    colors: {
      bg: '#140507',
      text: '#fecdd3',
      textMuted: '#fda4af',
      cardBg: '#220a0d',
      border: '#4c1117',
      accent: '#e11d48',
      accentHover: '#f43f5e',
      ring: '#fb7185',
      readerBg: '#0e0304',
      readerText: '#ffe4e6',
      readerCoord: '#9f1239',
      selectionBg: '#881337',
      selectionText: '#fff1f2',
    },
  },

  // 5. Blood Orange Ember (Dark Red / Ember)
  {
    id: 'dark-ember',
    name: 'Blood Ember',
    description: 'Smoldering dark embers and ruby tones engineered for dim bedrooms and late-night Joyce study.',
    category: 'dark-red',
    isDark: true,
    colors: {
      bg: '#180806',
      text: '#fed7aa',
      textMuted: '#fb923c',
      cardBg: '#270e0a',
      border: '#541c14',
      accent: '#ea580c',
      accentHover: '#f97316',
      ring: '#fb923c',
      readerBg: '#110504',
      readerText: '#ffedd5',
      readerCoord: '#9a3412',
      selectionBg: '#7c2d12',
      selectionText: '#fff7ed',
    },
  },

  // 6. Deep Wine Burgundy (Velvet Red)
  {
    id: 'dark-burgundy',
    name: 'Burgundy Velvet',
    description: 'Rich vintage port-wine red and aged rose gold highlights for gentle, atmospheric night reading.',
    category: 'dark-red',
    isDark: true,
    colors: {
      bg: '#190a12',
      text: '#fce7f3',
      textMuted: '#f472b6',
      cardBg: '#28101e',
      border: '#581c3f',
      accent: '#db2777',
      accentHover: '#ec4899',
      ring: '#f472b6',
      readerBg: '#12060d',
      readerText: '#fdf2f8',
      readerCoord: '#9d174d',
      selectionBg: '#831843',
      selectionText: '#fdf2f8',
    },
  },

  // 7. Slate Midnight (The Classic Winnegans Dark)
  {
    id: 'slate-midnight',
    name: 'Slate Midnight (Default)',
    description: 'The standard WinnegansFake scholarly palette: deep indigo-slate with radiant emerald annotations.',
    category: 'dark-ambient',
    isDark: true,
    colors: {
      bg: '#020617',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      cardBg: '#0f172a',
      border: '#1e293b',
      accent: '#10b981',
      accentHover: '#34d399',
      ring: '#059669',
      readerBg: '#0b1120',
      readerText: '#f8fafc',
      readerCoord: '#64748b',
      selectionBg: '#065f46',
      selectionText: '#ecfdf5',
    },
  },

  // 8. Cyberpunk Neon (Fun & Vibrant)
  {
    id: 'neon-cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Electrifying dark synthwave with hot neon cyan, electric purple, and high-energy contrasts.',
    category: 'fun',
    isDark: true,
    colors: {
      bg: '#0b0813',
      text: '#f5f3ff',
      textMuted: '#c4b5fd',
      cardBg: '#161026',
      border: '#3b2d5a',
      accent: '#06b6d4',
      accentHover: '#22d3ee',
      ring: '#a855f7',
      readerBg: '#07050d',
      readerText: '#ffffff',
      readerCoord: '#8b5cf6',
      selectionBg: '#4c1d95',
      selectionText: '#f5f3ff',
    },
  },

  // 9. Forest Glade (Earthy Emerald)
  {
    id: 'forest-glade',
    name: 'Emerald Forest',
    description: 'Deep pine woods and mossy greens inspired by the fertile riverbanks of the River Liffey.',
    category: 'creative',
    isDark: true,
    colors: {
      bg: '#04130c',
      text: '#ecfdf5',
      textMuted: '#6ee7b7',
      cardBg: '#0a2318',
      border: '#134e35',
      accent: '#10b981',
      accentHover: '#34d399',
      ring: '#059669',
      readerBg: '#030e09',
      readerText: '#f0fdf4',
      readerCoord: '#059669',
      selectionBg: '#064e3b',
      selectionText: '#d1fae5',
    },
  },

  // 10. Official Solarized Dark (Ethan Schoonover)
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    description: 'Ethan Schoonover’s canonical Solarized Dark: precise LAB color space palette with base03 (#002b36) and base0 (#839496).',
    category: 'solarized',
    isDark: true,
    colors: {
      bg: '#002b36',
      text: '#839496',
      textMuted: '#586e75',
      cardBg: '#073642',
      border: '#073642',
      accent: '#2aa198', // cyan
      accentHover: '#268bd2', // blue
      ring: '#b58900', // yellow
      readerBg: '#002b36',
      readerText: '#93a1a1', // base1 for crisp high readability
      readerCoord: '#586e75', // base01
      selectionBg: '#073642', // base02
      selectionText: '#93a1a1',
    },
  },

  // 11. Official Solarized Light (Ethan Schoonover)
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: 'Ethan Schoonover’s canonical Solarized Light: warm base3 (#fdf6e3) background with base00 (#657b83) text.',
    category: 'solarized',
    isDark: false,
    colors: {
      bg: '#fdf6e3',
      text: '#657b83',
      textMuted: '#93a1a1',
      cardBg: '#eee8d5',
      border: '#eee8d5',
      accent: '#268bd2', // blue
      accentHover: '#2aa198', // cyan
      ring: '#b58900', // yellow
      readerBg: '#fdf6e3',
      readerText: '#586e75', // base01 for crisp high readability
      readerCoord: '#93a1a1', // base1
      selectionBg: '#eee8d5', // base2
      selectionText: '#073642',
    },
  },

  // 12. Solarized Dublin Amber (Scholarly Vintage)
  {
    id: 'solarized-amber',
    name: 'Dublin Amber',
    description: 'Muted warm solarized dark background with incandescent honey and amber highlights.',
    category: 'dark-ambient',
    isDark: true,
    colors: {
      bg: '#14120e',
      text: '#fef3c7',
      textMuted: '#fcd34d',
      cardBg: '#211d17',
      border: '#453a29',
      accent: '#f59e0b',
      accentHover: '#fbbf24',
      ring: '#d97706',
      readerBg: '#0e0c09',
      readerText: '#fffbeb',
      readerCoord: '#b45309',
      selectionBg: '#78350f',
      selectionText: '#fef3c7',
    },
  },
  // 13. Gruvbox Dark (Pavel Pertsev)
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    description: 'Retro groove dark palette by Pavel Pertsev: warm dark background (#282828) with high-contrast light fg (#ebdbb2) and soothing warm accents.',
    category: 'gruvbox',
    isDark: true,
    colors: {
      bg: '#282828', // dark0
      text: '#ebdbb2', // light1
      textMuted: '#a89984', // dark4
      cardBg: '#3c3836', // dark1
      border: '#504945', // dark2
      accent: '#fabd2f', // bright_yellow
      accentHover: '#fe8019', // bright_orange
      ring: '#d79921', // neutral_yellow
      readerBg: '#282828',
      readerText: '#fbf1c7', // light0 for peak reading clarity
      readerCoord: '#928374', // gray
      selectionBg: '#504945', // dark2
      selectionText: '#fbf1c7',
    },
  },

  // 14. Gruvbox Light (Pavel Pertsev)
  {
    id: 'gruvbox-light',
    name: 'Gruvbox Light',
    description: 'Retro groove light palette by Pavel Pertsev: soft light parchment background (#fbf1c7) with dark0 (#282828) text.',
    category: 'gruvbox',
    isDark: false,
    colors: {
      bg: '#fbf1c7', // light0
      text: '#3c3836', // dark1
      textMuted: '#7c6f64', // dark4
      cardBg: '#ebdbb2', // light1
      border: '#d5c4a1', // light2
      accent: '#b57614', // neutral_yellow
      accentHover: '#af3a03', // neutral_orange
      ring: '#b57614', // neutral_yellow
      readerBg: '#fbf1c7',
      readerText: '#282828', // dark0 for sharp high contrast
      readerCoord: '#928374', // gray
      selectionBg: '#d5c4a1', // light2
      selectionText: '#282828',
    },
  },

  // 15. Catppuccin Latte (Soothing Warm Light)
  {
    id: 'catppuccin-latte',
    name: 'Catppuccin Latte',
    description: 'Catppuccin’s light flavor: warm base (#eff1f5) background, text (#4c4f69), and lavender (#7287fd) accents.',
    category: 'catppuccin',
    isDark: false,
    colors: {
      bg: '#eff1f5', // base
      text: '#4c4f69', // text
      textMuted: '#6c6f85', // subtext0
      cardBg: '#e6e9ef', // mantle
      border: '#ccd0da', // surface0
      accent: '#7287fd', // lavender
      accentHover: '#1e66f5', // blue
      ring: '#8839ef', // mauve
      readerBg: '#eff1f5',
      readerText: '#4c4f69',
      readerCoord: '#9ca0b0', // overlay0
      selectionBg: '#ccd0da', // surface0
      selectionText: '#4c4f69',
    },
  },

  // 16. Catppuccin Frappé (Low-contrast Dark)
  {
    id: 'catppuccin-frappe',
    name: 'Catppuccin Frappé',
    description: 'Catppuccin’s balanced dark flavor: muted base (#303446) background, text (#c6d0f5), and mauve (#ca9ee6) accents.',
    category: 'catppuccin',
    isDark: true,
    colors: {
      bg: '#303446', // base
      text: '#c6d0f5', // text
      textMuted: '#a5adce', // subtext0
      cardBg: '#292c3c', // mantle
      border: '#414559', // surface0
      accent: '#ca9ee6', // mauve
      accentHover: '#8caaee', // blue
      ring: '#babbf1', // lavender
      readerBg: '#303446',
      readerText: '#c6d0f5',
      readerCoord: '#737994', // overlay0
      selectionBg: '#414559', // surface0
      selectionText: '#c6d0f5',
    },
  },

  // 17. Catppuccin Macchiato (Medium-contrast Dark)
  {
    id: 'catppuccin-macchiato',
    name: 'Catppuccin Macchiato',
    description: 'Catppuccin’s medium dark flavor: rich base (#24273a) background, text (#cad3f5), and lavender (#b7bdf8) accents.',
    category: 'catppuccin',
    isDark: true,
    colors: {
      bg: '#24273a', // base
      text: '#cad3f5', // text
      textMuted: '#a5adcb', // subtext0
      cardBg: '#1e2030', // mantle
      border: '#363a4f', // surface0
      accent: '#c6a0f6', // mauve
      accentHover: '#8aadf4', // blue
      ring: '#b7bdf8', // lavender
      readerBg: '#24273a',
      readerText: '#cad3f5',
      readerCoord: '#6e738d', // overlay0
      selectionBg: '#363a4f', // surface0
      selectionText: '#cad3f5',
    },
  },

  // 18. Catppuccin Mocha (High-contrast Dark)
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    description: 'Catppuccin’s deep dark flavor: base (#1e1e2e) background, crisp text (#cdd6f4), and mauve (#cba6f7) accents.',
    category: 'catppuccin',
    isDark: true,
    colors: {
      bg: '#1e1e2e', // base
      text: '#cdd6f4', // text
      textMuted: '#a6adc8', // subtext0
      cardBg: '#181825', // mantle
      border: '#313244', // surface0
      accent: '#cba6f7', // mauve
      accentHover: '#89b4fa', // blue
      ring: '#b4befe', // lavender
      readerBg: '#1e1e2e',
      readerText: '#cdd6f4',
      readerCoord: '#6c7086', // overlay0
      selectionBg: '#313244', // surface0
      selectionText: '#cdd6f4',
    },
  },

  // 19. Obsidian Crimson (#000000 background, #9A2F2F foreground)
  {
    id: 'obsidian-crimson',
    name: 'Obsidian Crimson',
    description: 'Pure pitch-black OLED background (#000000) with deep blood-red foreground (#9A2F2F) for darkroom night reading.',
    category: 'dark-red',
    isDark: true,
    colors: {
      bg: '#000000',
      text: '#9a2f2f',
      textMuted: '#6f2222',
      cardBg: '#0a0202',
      border: '#2a0c0c',
      accent: '#9a2f2f',
      accentHover: '#ba3939',
      ring: '#9a2f2f',
      readerBg: '#000000',
      readerText: '#9a2f2f',
      readerCoord: '#5a1d1d',
      selectionBg: '#3d1212',
      selectionText: '#ff8a8a',
    },
  },
];

export const DEFAULT_THEME_ID = 'slate-midnight';

export function getThemeById(themeId: string): ReadingTheme {
  const found = BUILTIN_THEMES.find((t) => t.id === themeId);
  return found || BUILTIN_THEMES[6]; // default to slate-midnight
}
