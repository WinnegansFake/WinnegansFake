import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('SSR Hydration Safety & Guard Suite', () => {
  const rootDir = path.resolve(__dirname, '..');
  const webDir = path.resolve(rootDir, 'web');
  const layoutPath = path.resolve(webDir, 'src/app/layout.tsx');
  const themeContextPath = path.resolve(webDir, 'src/components/ThemeContext.tsx');
  const themeSwitcherPath = path.resolve(webDir, 'src/components/ThemeSwitcher.tsx');
  const cookieConsentPath = path.resolve(webDir, 'src/components/CookieConsentModal.tsx');

  it('verifies root layout contains suppressHydrationWarning on <html>', () => {
    expect(fs.existsSync(layoutPath)).toBe(true);
    const layoutSrc = fs.readFileSync(layoutPath, 'utf8');

    // Root layout <html> must have suppressHydrationWarning to prevent warnings when
    // dynamic theme attributes (class/data-theme) or browser extensions alter <html>.
    expect(layoutSrc).toMatch(/<html[^>]*suppressHydrationWarning/);
  });

  it('verifies ThemeContext defines and exports isMounted guard for client hydration', () => {
    expect(fs.existsSync(themeContextPath)).toBe(true);
    const themeContextSrc = fs.readFileSync(themeContextPath, 'utf8');

    // Must declare isMounted in context interface and state
    expect(themeContextSrc).toContain('isMounted: boolean');
    expect(themeContextSrc).toMatch(/const\s*\[\s*isMounted\s*,\s*setIsMounted\s*\]\s*=\s*useState<\s*boolean\s*>\(\s*false\s*\)/);
    
    // Must set isMounted to true inside useEffect after client mount
    expect(themeContextSrc).toMatch(/useEffect\(\s*\(\)\s*=>\s*\{[^}]*setIsMounted\(\s*true\s*\)/s);
  });

  it('verifies ThemeSwitcher guards SSR button text and styling with isMounted', () => {
    expect(fs.existsSync(themeSwitcherPath)).toBe(true);
    const switcherSrc = fs.readFileSync(themeSwitcherPath, 'utf8');

    // ThemeSwitcher must consume isMounted from useTheme()
    expect(switcherSrc).toMatch(/isMounted/);

    // Initial render must match deterministic default server values so client matches SSR HTML
    // even when localStorage / cookie has a custom theme selected
    expect(switcherSrc).toMatch(/isMounted\s*\?\s*currentTheme\.colors\.bg\s*:\s*['"]#020617['"]/);
    expect(switcherSrc).toMatch(/isMounted\s*\?\s*currentTheme\.name\s*:\s*['"]Midnight Slate['"]/);
  });

  it('verifies CookieConsentModal does not render in initial SSR pass', () => {
    expect(fs.existsSync(cookieConsentPath)).toBe(true);
    const modalSrc = fs.readFileSync(cookieConsentPath, 'utf8');

    // Pending cookie change must be initially false, causing early null return
    expect(modalSrc).toMatch(/if\s*\(\s*!pendingCookieChange\s*\)\s*return\s*null;/);
  });

  it('ensures no unmounted non-deterministic attributes (Math.random, Date.now) exist in client components', () => {
    // Scan all tsx files in web/src/components and web/src/app
    function getTsxFiles(dir: string): string[] {
      let results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.resolve(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          results = results.concat(getTsxFiles(fullPath));
        } else if (file.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const componentFiles = [
      ...getTsxFiles(path.resolve(webDir, 'src/components')),
      ...getTsxFiles(path.resolve(webDir, 'src/app')),
    ];

    expect(componentFiles.length).toBeGreaterThan(0);

    const problematicPatterns = [
      { name: 'Direct Math.random in render/JSX', regex: /(?:className|id|key|style|aria-[a-z]+)\s*=\s*\{[^}]*Math\.random\(\)/ },
      { name: 'Direct Date.now() in JSX attributes', regex: /(?:className|id|key|style|aria-[a-z]+)\s*=\s*\{[^}]*Date\.now\(\)/ },
      { name: 'typeof window !== "undefined" in JSX attributes without isMounted', regex: /(?:className|id|style)\s*=\s*\{[^}]*typeof\s+window\s*!==\s*['"]undefined['"][^}]*\}/ },
    ];

    for (const filePath of componentFiles) {
      const relativePath = path.relative(rootDir, filePath);
      const content = fs.readFileSync(filePath, 'utf8');

      for (const pattern of problematicPatterns) {
        const match = content.match(pattern.regex);
        expect(
          match,
          `Hydration risk found in ${relativePath}: ${pattern.name} matched "${match?.[0]}"`
        ).toBeNull();
      }
    }
  });
});
