import { describe, it, expect, beforeEach } from 'vitest';
import {
  BUILTIN_THEMES,
  getThemeById,
  DEFAULT_THEME_ID,
  getDurationSeconds,
  getDurationLabel,
  writeThemeCookie,
  readThemeCookie,
  deleteThemeCookie,
  createCustomTheme,
  applyThemeVariables,
  THEME_COOKIE_NAME,
} from '../packages/theme/src/index.js';

describe('@winnegans/theme Package', () => {
  it('should include Daylight White theme with pure #ffffff background and #000000 text', () => {
    const daylight = getThemeById('daylight-pure');
    expect(daylight).toBeDefined();
    expect(daylight.colors.bg.toLowerCase()).toBe('#ffffff');
    expect(daylight.colors.text.toLowerCase()).toBe('#000000');
    expect(daylight.isDark).toBe(false);
  });

  it('should include Obsidian OLED theme with pure #000000 background and #ffffff text', () => {
    const obsidian = getThemeById('obsidian-oled');
    expect(obsidian).toBeDefined();
    expect(obsidian.colors.bg.toLowerCase()).toBe('#000000');
    expect(obsidian.colors.text.toLowerCase()).toBe('#ffffff');
    expect(obsidian.category).toBe('oled');
    expect(obsidian.isDark).toBe(true);
  });

  it('should include soothing dark-red themes for night reading', () => {
    const crimson = getThemeById('dark-crimson');
    const ember = getThemeById('dark-ember');
    const burgundy = getThemeById('dark-burgundy');

    expect(crimson.category).toBe('dark-red');
    expect(ember.category).toBe('dark-red');
    expect(burgundy.category).toBe('dark-red');

    // All should be dark mode
    expect(crimson.isDark).toBe(true);
    expect(ember.isDark).toBe(true);
    expect(burgundy.isDark).toBe(true);
  });

  it('should provide fun and creative themes (e.g. Cyberpunk Neon)', () => {
    const cyberpunk = getThemeById('neon-cyberpunk');
    expect(cyberpunk).toBeDefined();
    expect(cyberpunk.category).toBe('fun');
  });

  it('should calculate cookie durations accurately', () => {
    expect(getDurationSeconds('session')).toBeNull();
    expect(getDurationSeconds('1-day')).toBe(86400);
    expect(getDurationSeconds('7-days')).toBe(604800);
    expect(getDurationSeconds('30-days')).toBe(2592000);
    expect(getDurationSeconds('1-year')).toBe(31536000);

    expect(getDurationLabel('30-days')).toContain('30 Days');
  });

  it('should include official Solarized Dark and Light themes per Ethan Schoonover specification', () => {
    const solDark = getThemeById('solarized-dark');
    expect(solDark).toBeDefined();
    expect(solDark.category).toBe('solarized');
    expect(solDark.isDark).toBe(true);
    expect(solDark.colors.bg.toLowerCase()).toBe('#002b36'); // base03
    expect(solDark.colors.cardBg.toLowerCase()).toBe('#073642'); // base02
    expect(solDark.colors.textMuted.toLowerCase()).toBe('#586e75'); // base01
    expect(solDark.colors.text.toLowerCase()).toBe('#839496'); // base0
    expect(solDark.colors.readerBg.toLowerCase()).toBe('#002b36');
    expect(solDark.colors.readerText.toLowerCase()).toBe('#93a1a1'); // base1

    const solLight = getThemeById('solarized-light');
    expect(solLight).toBeDefined();
    expect(solLight.category).toBe('solarized');
    expect(solLight.isDark).toBe(false);
    expect(solLight.colors.bg.toLowerCase()).toBe('#fdf6e3'); // base3
    expect(solLight.colors.cardBg.toLowerCase()).toBe('#eee8d5'); // base2
    expect(solLight.colors.textMuted.toLowerCase()).toBe('#93a1a1'); // base1
    expect(solLight.colors.text.toLowerCase()).toBe('#657b83'); // base00
    expect(solLight.colors.readerBg.toLowerCase()).toBe('#fdf6e3');
    expect(solLight.colors.readerText.toLowerCase()).toBe('#586e75'); // base01
  });

  it('should include Gruvbox Dark and Light themes with authentic palette', () => {
    const gruvDark = getThemeById('gruvbox-dark');
    expect(gruvDark).toBeDefined();
    expect(gruvDark.category).toBe('gruvbox');
    expect(gruvDark.isDark).toBe(true);
    expect(gruvDark.colors.bg.toLowerCase()).toBe('#282828');
    expect(gruvDark.colors.cardBg.toLowerCase()).toBe('#3c3836');
    expect(gruvDark.colors.text.toLowerCase()).toBe('#ebdbb2');
    expect(gruvDark.colors.readerBg.toLowerCase()).toBe('#282828');
    expect(gruvDark.colors.readerText.toLowerCase()).toBe('#fbf1c7');

    const gruvLight = getThemeById('gruvbox-light');
    expect(gruvLight).toBeDefined();
    expect(gruvLight.category).toBe('gruvbox');
    expect(gruvLight.isDark).toBe(false);
    expect(gruvLight.colors.bg.toLowerCase()).toBe('#fbf1c7');
    expect(gruvLight.colors.text.toLowerCase()).toBe('#3c3836');
    expect(gruvLight.colors.cardBg.toLowerCase()).toBe('#ebdbb2');
    expect(gruvLight.colors.readerBg.toLowerCase()).toBe('#fbf1c7');
    expect(gruvLight.colors.readerText.toLowerCase()).toBe('#282828');
  });

  it('should include all 4 Catppuccin flavors (Latte, Frappé, Macchiato, Mocha)', () => {
    const latte = getThemeById('catppuccin-latte');
    expect(latte).toBeDefined();
    expect(latte.category).toBe('catppuccin');
    expect(latte.isDark).toBe(false);
    expect(latte.colors.bg.toLowerCase()).toBe('#eff1f5'); // base
    expect(latte.colors.cardBg.toLowerCase()).toBe('#e6e9ef'); // mantle
    expect(latte.colors.text.toLowerCase()).toBe('#4c4f69'); // text

    const frappe = getThemeById('catppuccin-frappe');
    expect(frappe).toBeDefined();
    expect(frappe.category).toBe('catppuccin');
    expect(frappe.isDark).toBe(true);
    expect(frappe.colors.bg.toLowerCase()).toBe('#303446');
    expect(frappe.colors.text.toLowerCase()).toBe('#c6d0f5');

    const macchiato = getThemeById('catppuccin-macchiato');
    expect(macchiato).toBeDefined();
    expect(macchiato.category).toBe('catppuccin');
    expect(macchiato.isDark).toBe(true);
    expect(macchiato.colors.bg.toLowerCase()).toBe('#24273a');
    expect(macchiato.colors.text.toLowerCase()).toBe('#cad3f5');

    const mocha = getThemeById('catppuccin-mocha');
    expect(mocha).toBeDefined();
    expect(mocha.category).toBe('catppuccin');
    expect(mocha.isDark).toBe(true);
    expect(mocha.colors.bg.toLowerCase()).toBe('#1e1e2e');
    expect(mocha.colors.text.toLowerCase()).toBe('#cdd6f4');
    expect(mocha.colors.accent.toLowerCase()).toBe('#cba6f7');
  });

  it('should include Obsidian Crimson theme with #000000 bg and #9A2F2F fg and no white fonts', () => {
    const crimsonOled = getThemeById('obsidian-crimson');
    expect(crimsonOled).toBeDefined();
    expect(crimsonOled.isDark).toBe(true);
    expect(crimsonOled.colors.bg.toLowerCase()).toBe('#000000');
    expect(crimsonOled.colors.text.toLowerCase()).toBe('#9a2f2f');
    expect(crimsonOled.colors.readerBg.toLowerCase()).toBe('#000000');
    expect(crimsonOled.colors.readerText.toLowerCase()).toBe('#9a2f2f');
    expect(crimsonOled.colors.textMuted.toLowerCase()).toBe('#6f2222');
    expect(crimsonOled.colors.readerCoord.toLowerCase()).toBe('#5a1d1d');
    expect(crimsonOled.colors.selectionBg.toLowerCase()).toBe('#330a0a');
    expect(crimsonOled.colors.selectionText.toLowerCase()).toBe('#b83a3a');

    // Verify absolutely no color in the Obsidian Crimson palette is white or near-white
    const colorValues = Object.values(crimsonOled.colors);
    for (const hex of colorValues) {
      expect(hex.toLowerCase()).not.toBe('#ffffff');
      expect(hex.toLowerCase()).not.toBe('#fff');

      // Parse hex to RGB and ensure red dominance (no white/gray/light shades)
      const cleanHex = hex.replace('#', '');
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);

      // Either pure black (#000000) or subdued red where R is strictly greater than G and B
      if (r === 0 && g === 0 && b === 0) {
        // Pure pitch black
        expect(r).toBe(0);
      } else {
        // Subdued red: Red must dominate green and blue by a significant margin, and green/blue must be dark
        expect(r).toBeGreaterThan(g);
        expect(r).toBeGreaterThan(b);
        expect(g).toBeLessThan(80); // Subdued, not bright or white
        expect(b).toBeLessThan(80);
      }
    }
  });

  it('should allow building a custom theme with overrides', () => {
    const custom = createCustomTheme('obsidian-oled', 'My Custom Ruby OLED', {
      accent: '#ff0055',
      fontSize: 18,
    });
    expect(custom.name).toBe('My Custom Ruby OLED');
    expect(custom.colors.bg).toBe('#000000');
    expect(custom.colors.accent).toBe('#ff0055');
  });
});
