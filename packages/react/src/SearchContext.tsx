'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

export interface SearchContextType {
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

export interface SearchProviderProps {
  children: React.ReactNode;
  basePath?: string;
  searchIndexPath?: string;
}

export function SearchProvider({
  children,
  basePath = '',
  searchIndexPath,
}: SearchProviderProps) {
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
      const url = searchIndexPath || (basePath ? `${basePath}/search_index.json` : '/search_index.json');
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSearchIndex(Array.isArray(data) ? data : []);
        setIndexLoaded(true);
      }
    } catch {
      // Offline fallback: keep empty array
    } finally {
      setIsLoadingIndex(false);
    }
  }, [indexLoaded, isLoadingIndex, basePath, searchIndexPath]);

  const openSearch = useCallback((initialQuery?: string, initialScope?: SearchScope) => {
    if (initialQuery !== undefined) {
      setInitialSearchQuery(initialQuery);
    }
    if (initialScope !== undefined) {
      setSearchScope(initialScope);
    }
    setIsSearchOpen(true);
    loadSearchIndex();
  }, [loadSearchIndex]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (next) loadSearchIndex();
      return next;
    });
  }, [loadSearchIndex]);

  // Global hotkeys: Ctrl+F, Cmd+F, or pressing '/' opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkey if user is actively typing in an input/textarea/select
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable;

      // Ctrl+F or Cmd+F
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        openSearch();
        return;
      }

      // '/' shortcut (standard documentation / GitHub search hotkey)
      if (e.key === '/' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openSearch();
        return;
      }

      // Escape closes
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch, closeSearch, isSearchOpen]);

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
