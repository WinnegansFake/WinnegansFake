'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBasePath } from '@/lib/constants';

export type SearchScope =
  | 'all'
  | 'text'
  | 'lemmas'
  | 'glosses'
  | 'scholars'
  | 'tags'
  | 'registers';

export interface SearchAnnotationItem {
  id: string;
  page: number;
  line: number;
  lemma: string;
  quote?: string;
  gloss: string;
  registers: string[];
  tags: string[];
  scholars: string[];
  displayAuthor?: string;
}

interface SearchContextType {
  isSearchOpen: boolean;
  searchScope: SearchScope;
  setSearchScope: (scope: SearchScope) => void;
  openSearch: (initialQuery?: string, initialScope?: SearchScope) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  searchIndex: SearchAnnotationItem[];
  isLoadingIndex: boolean;
  loadSearchIndex: () => Promise<void>;
  initialSearchQuery: string;
  navigateHandler: ((page: number, line?: number) => void) | null;
  registerNavigateHandler: (handler: ((page: number, line?: number) => void) | null) => void;
  epubModalHandler: (() => void) | null;
  registerEpubModalHandler: (handler: (() => void) | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');
  const [searchIndex, setSearchIndex] = useState<SearchAnnotationItem[]>([]);
  const [isLoadingIndex, setIsLoadingIndex] = useState<boolean>(false);
  const [indexLoaded, setIndexLoaded] = useState<boolean>(false);
  const [navigateHandler, setNavigateHandler] = useState<((page: number, line?: number) => void) | null>(null);
  const [epubModalHandler, setEpubModalHandler] = useState<(() => void) | null>(null);

  const registerNavigateHandler = useCallback((handler: ((page: number, line?: number) => void) | null) => {
    setNavigateHandler(() => handler);
  }, []);

  const registerEpubModalHandler = useCallback((handler: (() => void) | null) => {
    setEpubModalHandler(() => handler);
  }, []);

  const loadSearchIndex = useCallback(async () => {
    if (indexLoaded || isLoadingIndex) return;
    setIsLoadingIndex(true);
    try {
      const basePath = getBasePath();
      const res = await fetch(`${basePath}/search_index.json`);
      if (res.ok) {
        const data = await res.json();
        setSearchIndex(data);
        setIndexLoaded(true);
      }
    } catch (err) {
      console.warn('Could not load search index:', err);
    } finally {
      setIsLoadingIndex(false);
    }
  }, [indexLoaded, isLoadingIndex]);

  const openSearch = useCallback((initialQuery?: string, initialScope?: SearchScope) => {
    if (initialQuery !== undefined) {
      setInitialSearchQuery(initialQuery);
    }
    if (initialScope !== undefined) {
      setSearchScope(initialScope);
    }
    setIsSearchOpen(true);
    // Ensure index is loaded
    loadSearchIndex();
  }, [loadSearchIndex]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
    }
  }, [isSearchOpen, closeSearch, openSearch]);

  // Global keyboard shortcuts: Ctrl+F, Cmd+F, and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        openSearch();
        return;
      }

      // 2. '/' key when not in an editable element
      if (e.key === '/' && !isSearchOpen) {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const tagName = target.tagName;
        const isEditable =
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable;

        if (!isEditable) {
          e.preventDefault();
          openSearch();
        }
      }

      // 3. Escape key to close
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch, closeSearch]);

  return (
    <SearchContext.Provider
      value={{
        isSearchOpen,
        searchScope,
        setSearchScope,
        openSearch,
        closeSearch,
        toggleSearch,
        searchIndex,
        isLoadingIndex,
        loadSearchIndex,
        initialSearchQuery,
        navigateHandler,
        registerNavigateHandler,
        epubModalHandler,
        registerEpubModalHandler,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
