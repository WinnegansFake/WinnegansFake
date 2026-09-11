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
