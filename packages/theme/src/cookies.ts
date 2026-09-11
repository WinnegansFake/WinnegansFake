import { CookieDuration, ThemeCookiePayload } from './types.js';

export const THEME_COOKIE_NAME = 'wf_theme_prefs';

/**
 * Converts a human-readable duration into seconds for Max-Age.
 */
export function getDurationSeconds(duration: CookieDuration): number | null {
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
    default:
      return 2592000;
  }
}

/**
 * Returns human-readable description for UI transparency.
 */
export function getDurationLabel(duration: CookieDuration): string {
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
      return '1 Year (permanent)';
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
  const maxAge = getDurationSeconds(payload.duration);

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
