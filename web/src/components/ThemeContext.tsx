'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import {
  ReadingTheme,
  CustomThemeOverrides,
  CookieDuration,
  ThemeCookiePayload,
  BUILTIN_THEMES,
  DEFAULT_THEME_ID,
  getThemeById,
  readThemeCookie,
  writeThemeCookie,
  deleteThemeCookie,
  applyThemeVariables,
  createCustomTheme,
} from '@winnegans/theme';

interface ThemeContextValue {
  currentTheme: ReadingTheme;
  themeId: string;
  overrides: CustomThemeOverrides;
  themes: ReadingTheme[];
  selectTheme: (themeId: string) => void;
  updateOverrides: (newOverrides: Partial<CustomThemeOverrides>) => void;
  resetCustomization: () => void;
  // Cookie Consent Modal State
  pendingCookieChange: boolean;
  proposedThemeId: string | null;
  proposedOverrides: CustomThemeOverrides | null;
  savePreferencesAsCookie: (duration: CookieDuration) => void;
  dismissCookiePrompt: (rememberChoice?: boolean) => void;
  clearCookieAndReset: () => void;
  hasStoredCookie: boolean;
  storedCookieDuration: CookieDuration | null;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);
  const [overrides, setOverrides] = useState<CustomThemeOverrides>({});
  const [hasStoredCookie, setHasStoredCookie] = useState<boolean>(false);
  const [storedCookieDuration, setStoredCookieDuration] = useState<CookieDuration | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Cookie Prompt Modal State
  const [pendingCookieChange, setPendingCookieChange] = useState<boolean>(false);
  const [proposedThemeId, setProposedThemeId] = useState<string | null>(null);
  const [proposedOverrides, setProposedOverrides] = useState<CustomThemeOverrides | null>(null);

  const initialMountDone = useRef<boolean>(false);

  // Load from cookie or local state on mount
  useEffect(() => {
    setIsMounted(true);
    const cookieData = readThemeCookie();
    if (cookieData && cookieData.themeId) {
      setThemeId(cookieData.themeId);
      setHasStoredCookie(true);
      setStoredCookieDuration(cookieData.duration);
      if (cookieData.overrides) {
        setOverrides(cookieData.overrides);
      }
      const theme = getThemeById(cookieData.themeId);
      applyThemeVariables({ theme, overrides: cookieData.overrides });
    } else {
      const defaultTheme = getThemeById(DEFAULT_THEME_ID);
      applyThemeVariables({ theme: defaultTheme });
    }
    initialMountDone.current = true;
  }, []);

  const currentTheme = getThemeById(themeId);

  // Apply CSS variables when theme or overrides change
  useEffect(() => {
    if (!initialMountDone.current) return;
    applyThemeVariables({ theme: currentTheme, overrides });
  }, [currentTheme, overrides]);

  /**
   * Called when user selects a new theme.
   * Requirement: "If, and only if, the user changes the theme ask them if they want to save that as a cookie"
   */
  const selectTheme = useCallback(
    (newThemeId: string) => {
      if (newThemeId === themeId && Object.keys(overrides).length === 0) return;

      // Immediately apply for preview so user sees instant satisfaction
      setThemeId(newThemeId);
      const theme = getThemeById(newThemeId);
      applyThemeVariables({ theme, overrides });

      // Trigger cookie prompt
      setProposedThemeId(newThemeId);
      setProposedOverrides(overrides);
      setPendingCookieChange(true);
    },
    [themeId, overrides]
  );

  const updateOverrides = useCallback(
    (newOverrides: Partial<CustomThemeOverrides>) => {
      const merged = { ...overrides, ...newOverrides };
      setOverrides(merged);
      applyThemeVariables({ theme: currentTheme, overrides: merged });

      // Trigger cookie prompt
      setProposedThemeId(themeId);
      setProposedOverrides(merged);
      setPendingCookieChange(true);
    },
    [currentTheme, overrides, themeId]
  );

  const resetCustomization = useCallback(() => {
    setOverrides({});
    applyThemeVariables({ theme: currentTheme, overrides: {} });
  }, [currentTheme]);

  /**
   * User confirms they want to save as a cookie with their chosen duration.
   */
  const savePreferencesAsCookie = useCallback(
    (duration: CookieDuration) => {
      const targetId = proposedThemeId || themeId;
      const targetOverrides = proposedOverrides || overrides;

      const payload: ThemeCookiePayload = {
        themeId: targetId,
        overrides: Object.keys(targetOverrides).length > 0 ? targetOverrides : undefined,
        savedAt: new Date().toISOString(),
        duration,
      };

      writeThemeCookie(payload);
      setHasStoredCookie(true);
      setStoredCookieDuration(duration);
      setPendingCookieChange(false);
      setProposedThemeId(null);
      setProposedOverrides(null);
    },
    [proposedThemeId, themeId, proposedOverrides, overrides]
  );

  /**
   * User dismisses without saving to a cookie.
   */
  const dismissCookiePrompt = useCallback(() => {
    setPendingCookieChange(false);
    setProposedThemeId(null);
    setProposedOverrides(null);
  }, []);

  /**
   * User clears their cookie.
   */
  const clearCookieAndReset = useCallback(() => {
    deleteThemeCookie();
    setHasStoredCookie(false);
    setStoredCookieDuration(null);
    setThemeId(DEFAULT_THEME_ID);
    setOverrides({});
    const defaultTheme = getThemeById(DEFAULT_THEME_ID);
    applyThemeVariables({ theme: defaultTheme });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeId,
        overrides,
        themes: BUILTIN_THEMES,
        selectTheme,
        updateOverrides,
        resetCustomization,
        pendingCookieChange,
        proposedThemeId,
        proposedOverrides,
        savePreferencesAsCookie,
        dismissCookiePrompt,
        clearCookieAndReset,
        hasStoredCookie,
        storedCookieDuration,
        isMounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
