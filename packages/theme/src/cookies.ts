import {
  CookieDuration,
  ThemeCookiePayload,
  BookmarkCookiePayload,
  BookmarkItem,
  EpubCookiePayload,
} from './types.js';

export const THEME_COOKIE_NAME = 'wf_theme_prefs';
export const BOOKMARK_COOKIE_NAME = 'wf_bookmarks';
export const EPUB_COOKIE_NAME = 'wf_epub';

/**
 * Converts a human-readable duration and optional customDays into seconds for Max-Age.
 * Allows users to store cookies for as long as they desire.
 */
export function getDurationSeconds(
  duration: CookieDuration,
  customDays?: number
): number | null {
  switch (duration) {
    case 'session':
      return null; // Session cookie (no Max-Age/Expires)
    case '1-day':
      return 86400;
    case '7-days':
      return 604800;
    case '30-days':
      return 2592000;
    case '1-year':
      return 31536000;
    case 'forever':
      // 10 years (315,360,000s) — requests maximum browser storage persistence
      return 315360000;
    case 'custom':
      return customDays && customDays > 0 ? Math.round(customDays * 86400) : 2592000;
    default:
      return 2592000;
  }
}

/**
 * Returns human-readable description for UI transparency.
 */
export function getDurationLabel(
  duration: CookieDuration,
  customDays?: number
): string {
  switch (duration) {
    case 'session':
      return 'Session only (cleared when browser closes)';
    case '1-day':
      return '1 Day (24 hours)';
    case '7-days':
      return '7 Days (1 week)';
    case '30-days':
      return '30 Days (recommended)';
    case '1-year':
      return '1 Year (persistent)';
    case 'forever':
      return 'Forever / Maximum (store as long as browser allows)';
    case 'custom':
      return customDays ? `${customDays} Days (custom duration)` : 'Custom duration';
    default:
      return '30 Days';
  }
}

/**
 * Parses client document.cookie string for the theme preference payload.
 */
export function readThemeCookie(): ThemeCookiePayload | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split('=');
    if (name === THEME_COOKIE_NAME) {
      try {
        const decoded = decodeURIComponent(rest.join('='));
        return JSON.parse(decoded) as ThemeCookiePayload;
      } catch (err) {
        console.warn('Failed to parse theme cookie:', err);
        return null;
      }
    }
  }
  return null;
}

/**
 * Writes the theme cookie to document.cookie with explicit SameSite and Secure flags.
 */
export function writeThemeCookie(payload: ThemeCookiePayload): void {
  if (typeof document === 'undefined') return;

  const serialized = encodeURIComponent(JSON.stringify(payload));
  const maxAge = getDurationSeconds(payload.duration, payload.customDays);

  let cookieString = `${THEME_COOKIE_NAME}=${serialized}; path=/; SameSite=Lax`;
  if (maxAge !== null) {
    cookieString += `; max-age=${maxAge}`;
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Deletes the theme cookie.
 */
export function deleteThemeCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Parses client document.cookie string for the reading bookmarks payload.
 */
export function readBookmarkCookie(): BookmarkCookiePayload | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split('=');
    if (name === BOOKMARK_COOKIE_NAME) {
      try {
        const decoded = decodeURIComponent(rest.join('='));
        return JSON.parse(decoded) as BookmarkCookiePayload;
      } catch (err) {
        console.warn('Failed to parse bookmarks cookie:', err);
        return null;
      }
    }
  }
  return null;
}

/**
 * Writes the bookmarks payload to document.cookie with explicit SameSite and Secure flags.
 */
export function writeBookmarkCookie(payload: BookmarkCookiePayload): void {
  if (typeof document === 'undefined') return;

  const serialized = encodeURIComponent(JSON.stringify(payload));
  const maxAge = getDurationSeconds(payload.duration, payload.customDays);

  let cookieString = `${BOOKMARK_COOKIE_NAME}=${serialized}; path=/; SameSite=Lax`;
  if (maxAge !== null) {
    cookieString += `; max-age=${maxAge}`;
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Deletes the bookmarks cookie.
 */
export function deleteBookmarkCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${BOOKMARK_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Parses client document.cookie string for the EPUB source location payload.
 */
export function readEpubCookie(): EpubCookiePayload | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split('=');
    if (name === EPUB_COOKIE_NAME) {
      try {
        const decoded = decodeURIComponent(rest.join('='));
        return JSON.parse(decoded) as EpubCookiePayload;
      } catch (err) {
        console.warn('Failed to parse EPUB location cookie:', err);
        return null;
      }
    }
  }
  return null;
}

/**
 * Writes the EPUB source location to document.cookie with user-configured duration.
 */
export function writeEpubCookie(payload: EpubCookiePayload): void {
  if (typeof document === 'undefined') return;

  const serialized = encodeURIComponent(JSON.stringify(payload));
  const maxAge = getDurationSeconds(payload.duration, payload.customDays);

  let cookieString = `${EPUB_COOKIE_NAME}=${serialized}; path=/; SameSite=Lax`;
  if (maxAge !== null) {
    cookieString += `; max-age=${maxAge}`;
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Deletes the EPUB location cookie.
 */
export function deleteEpubCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${EPUB_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}


