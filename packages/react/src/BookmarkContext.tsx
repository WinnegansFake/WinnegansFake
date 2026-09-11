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
  CookieDuration,
  BookmarkItem,
  BookmarkCookiePayload,
  readBookmarkCookie,
  writeBookmarkCookie,
  deleteBookmarkCookie,
  getDurationLabel,
  getDurationSeconds,
} from '@winnegans/theme';

interface BookmarkContextValue {
  bookmarks: BookmarkItem[];
  addBookmark: (item: {
    workId?: string;
    page: number;
    line?: number;
    annotationId?: string;
    title?: string;
    excerpt?: string;
    note?: string;
  }) => void;
  removeBookmark: (id: string) => void;
  toggleBookmark: (
    page: number,
    line?: number,
    title?: string,
    excerpt?: string,
    workId?: string
  ) => void;
  isPageBookmarked: (page: number, workId?: string) => boolean;
  isLineBookmarked: (page: number, line: number, workId?: string) => boolean;

  cookieDuration: CookieDuration;
  customDays: number;
  setCookieDuration: (duration: CookieDuration, customDays?: number) => void;
  clearAllBookmarks: () => void;
  hasStoredCookie: boolean;
  storedCookieDuration: CookieDuration | null;
  showBookmarksModal: boolean;
  setShowBookmarksModal: (show: boolean) => void;
  isMounted: boolean;
}

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'wf_bookmarks_backup';

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [cookieDuration, setCookieDurationState] = useState<CookieDuration>('forever');
  const [customDays, setCustomDays] = useState<number>(365);
  const [hasStoredCookie, setHasStoredCookie] = useState<boolean>(false);
  const [storedCookieDuration, setStoredCookieDuration] = useState<CookieDuration | null>(null);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const initialMountDone = useRef<boolean>(false);

  // Load bookmarks on mount: first check cookie, then localStorage backup
  useEffect(() => {
    setIsMounted(true);

    const cookieData = readBookmarkCookie();
    if (cookieData && Array.isArray(cookieData.bookmarks) && cookieData.bookmarks.length > 0) {
      setBookmarks(cookieData.bookmarks);
      setHasStoredCookie(true);
      setStoredCookieDuration(cookieData.duration);
      if (cookieData.duration) {
        setCookieDurationState(cookieData.duration);
      }
      if (cookieData.customDays) {
        setCustomDays(cookieData.customDays);
      }
    } else if (typeof window !== 'undefined') {
      // Check localStorage backup
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBookmarks(parsed);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }

    initialMountDone.current = true;
  }, []);

  // Save to cookie and localStorage whenever bookmarks or duration settings change
  const persistBookmarks = useCallback(
    (
      currentBookmarks: BookmarkItem[],
      duration: CookieDuration,
      days?: number
    ) => {
      if (typeof window === 'undefined') return;

      const payload: BookmarkCookiePayload = {
        version: '1.0.0',
        bookmarks: currentBookmarks,
        savedAt: new Date().toISOString(),
        duration,
        customDays: duration === 'custom' ? days : undefined,
      };

      writeBookmarkCookie(payload);
      setHasStoredCookie(true);
      setStoredCookieDuration(duration);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentBookmarks));
      } catch {
        // Ignore quota/access errors
      }
    },
    []
  );

  const addBookmark = useCallback(
    (item: {
      workId?: string;
      page: number;
      line?: number;
      annotationId?: string;
      title?: string;
      excerpt?: string;
      note?: string;
    }) => {
      setBookmarks((prev) => {
        // Avoid exact duplicate
        const exists = prev.some(
          (b) =>
            (!item.workId || !b.workId || b.workId === item.workId) &&
            b.page === item.page &&
            (item.line ? b.line === item.line : !b.line)
        );
        if (exists) return prev;

        const padPage = String(item.page).padStart(3, '0');
        const linePart = item.line ? `.${String(item.line).padStart(2, '0')}` : '';
        const workPart = item.workId ? `-${item.workId}` : '';
        const id = `bm${workPart}-${padPage}${linePart}-${Date.now().toString(36)}`;

        const newBookmark: BookmarkItem = {
          id,
          workId: item.workId,
          page: item.page,
          line: item.line,
          annotationId: item.annotationId,
          title: item.title || (item.line ? `Page ${padPage}, Line ${item.line}` : `Page ${padPage}`),
          excerpt: item.excerpt,
          note: item.note,
          createdAt: new Date().toISOString(),
        };

        const updated = [newBookmark, ...prev];
        persistBookmarks(updated, cookieDuration, customDays);
        return updated;
      });
    },
    [cookieDuration, customDays, persistBookmarks]
  );

  const removeBookmark = useCallback(
    (id: string) => {
      setBookmarks((prev) => {
        const updated = prev.filter((b) => b.id !== id);
        persistBookmarks(updated, cookieDuration, customDays);
        return updated;
      });
    },
    [cookieDuration, customDays, persistBookmarks]
  );

  const toggleBookmark = useCallback(
    (page: number, line?: number, title?: string, excerpt?: string, workId?: string) => {
      setBookmarks((prev) => {
        const existingIdx = prev.findIndex(
          (b) =>
            (!workId || !b.workId || b.workId === workId) &&
            b.page === page &&
            (line ? b.line === line : !b.line)
        );

        if (existingIdx >= 0) {
          // Remove
          const updated = prev.filter((_, idx) => idx !== existingIdx);
          persistBookmarks(updated, cookieDuration, customDays);
          return updated;
        } else {
          // Add
          const padPage = String(page).padStart(3, '0');
          const linePart = line ? `.${String(line).padStart(2, '0')}` : '';
          const workPart = workId ? `-${workId}` : '';
          const id = `bm${workPart}-${padPage}${linePart}-${Date.now().toString(36)}`;

          const newBookmark: BookmarkItem = {
            id,
            workId,
            page,
            line,
            title: title || (line ? `Page ${padPage}, Line ${line}` : `Page ${padPage}`),
            excerpt,
            createdAt: new Date().toISOString(),
          };

          const updated = [newBookmark, ...prev];
          persistBookmarks(updated, cookieDuration, customDays);
          return updated;
        }
      });
    },
    [cookieDuration, customDays, persistBookmarks]
  );

  const isPageBookmarked = useCallback(
    (page: number, workId?: string) => {
      return bookmarks.some(
        (b) => (!workId || !b.workId || b.workId === workId) && b.page === page && !b.line
      );
    },
    [bookmarks]
  );

  const isLineBookmarked = useCallback(
    (page: number, line: number, workId?: string) => {
      return bookmarks.some(
        (b) => (!workId || !b.workId || b.workId === workId) && b.page === page && b.line === line
      );
    },
    [bookmarks]
  );


  const setCookieDuration = useCallback(
    (duration: CookieDuration, days?: number) => {
      setCookieDurationState(duration);
      if (days) setCustomDays(days);
      persistBookmarks(bookmarks, duration, days || customDays);
    },
    [bookmarks, customDays, persistBookmarks]
  );

  const clearAllBookmarks = useCallback(() => {
    deleteBookmarkCookie();
    setBookmarks([]);
    setHasStoredCookie(false);
    setStoredCookieDuration(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        isPageBookmarked,
        isLineBookmarked,
        cookieDuration,
        customDays,
        setCookieDuration,
        clearAllBookmarks,
        hasStoredCookie,
        storedCookieDuration,
        showBookmarksModal,
        setShowBookmarksModal,
        isMounted,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks(): BookmarkContextValue {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}
