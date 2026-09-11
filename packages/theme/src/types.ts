/**
 * @winnegans/theme - Types and Interfaces
 */

export type ThemeCategory = 'light' | 'oled' | 'dark-red' | 'dark-ambient' | 'solarized' | 'gruvbox' | 'fun' | 'creative';

export interface ThemeColors {
  /** Page primary background */
  bg: string;
  /** Primary text color */
  text: string;
  /** Secondary/muted text color */
  textMuted: string;
  /** Container/card/surface background */
  cardBg: string;
  /** Border/divider color */
  border: string;
  /** Accent/highlight color */
  accent: string;
  /** Hover/secondary accent */
  accentHover: string;
  /** Focus ring or glow */
  ring: string;
  /** Reader page viewport background */
  readerBg: string;
  /** Reader primary line font color */
  readerText: string;
  /** Reader line number / coordinate color */
  readerCoord: string;
  /** Selection highlight background */
  selectionBg: string;
  /** Selection highlight text */
  selectionText: string;
}

export interface ReadingTheme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  isDark: boolean;
  colors: ThemeColors;
}

export interface CustomThemeOverrides extends Partial<ThemeColors> {
  fontSize?: number; // in px or rem multiplier (default 16)
  fontFamily?: 'serif' | 'sans' | 'mono';
  lineHeight?: number; // multiplier e.g. 1.75
}

export type CookieDuration = 'session' | '1-day' | '7-days' | '30-days' | '1-year';

export interface ThemeCookiePayload {
  themeId: string;
  overrides?: CustomThemeOverrides;
  savedAt: string; // ISO timestamp
  duration: CookieDuration;
}
