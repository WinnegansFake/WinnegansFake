import { ReadingTheme, CustomThemeOverrides } from './types.js';
import { BUILTIN_THEMES, DEFAULT_THEME_ID, getThemeById } from './themes.js';

export interface ThemeApplyOptions {
  theme: ReadingTheme;
  overrides?: CustomThemeOverrides;
  targetElement?: HTMLElement;
}

/**
 * Injects CSS custom properties on the target document root (or custom element).
 */
export function applyThemeVariables({
  theme,
  overrides = {},
  targetElement,
}: ThemeApplyOptions): void {
  if (typeof document === 'undefined') return;

  const target = targetElement || document.documentElement;
  const colors = { ...theme.colors, ...overrides };

  // Set standard CSS variables
  target.style.setProperty('--wf-bg', colors.bg);
  target.style.setProperty('--wf-text', colors.text);
  target.style.setProperty('--wf-text-muted', colors.textMuted);
  target.style.setProperty('--wf-card-bg', colors.cardBg);
  target.style.setProperty('--wf-border', colors.border);
  target.style.setProperty('--wf-accent', colors.accent);
  target.style.setProperty('--wf-accent-hover', colors.accentHover);
  target.style.setProperty('--wf-ring', colors.ring);
  target.style.setProperty('--wf-reader-bg', colors.readerBg);
  target.style.setProperty('--wf-reader-text', colors.readerText);
  target.style.setProperty('--wf-reader-coord', colors.readerCoord);
  target.style.setProperty('--wf-selection-bg', colors.selectionBg);
  target.style.setProperty('--wf-selection-text', colors.selectionText);

  // Typography overrides
  if (overrides.fontSize) {
    target.style.setProperty('--wf-font-size', `${overrides.fontSize}px`);
  }
  if (overrides.lineHeight) {
    target.style.setProperty('--wf-line-height', `${overrides.lineHeight}`);
  }
  if (overrides.fontFamily) {
    const fontMap = {
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      sans: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
      mono: 'var(--font-geist-mono), ui-monospace, monospace',
    };
    target.style.setProperty('--wf-font-family', fontMap[overrides.fontFamily]);
  }

  // Toggle dark/light class on html element for tailwind compatibility
  if (theme.isDark) {
    target.classList.add('dark');
    target.classList.remove('light');
  } else {
    target.classList.add('light');
    target.classList.remove('dark');
  }

  target.setAttribute('data-theme', theme.id);
}

/**
 * Creates a merged theme combining a base theme with custom color modifications.
 */
export function createCustomTheme(
  baseThemeId: string,
  customName: string,
  overrides: CustomThemeOverrides
): ReadingTheme {
  const base = getThemeById(baseThemeId);
  return {
    id: `custom-${Date.now()}`,
    name: customName || `Custom ${base.name}`,
    description: 'User-customized reading palette',
    category: base.category,
    isDark: base.isDark,
    colors: {
      ...base.colors,
      ...overrides,
    },
  };
}
