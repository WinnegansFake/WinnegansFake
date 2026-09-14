/**
 * @winnegans/react
 *
 * Modular React components and hooks for crowdsourced literary annotation platforms
 * and zero-copyright digital humanities reading applications.
 */

// Readers & Monograph Viewers
export { UniversalReader, type UniversalReaderProps } from './UniversalReader';
export { UniversalReader as WakeReader } from './UniversalReader';
export { DissertationViewer, type DissertationViewerProps } from './DissertationViewer';

// Interactive Modals & Dialogs
export { EpubSourceModal, type EpubPreset } from './EpubSourceModal';
export { BookmarksModal, type BookmarksModalProps } from './BookmarksModal';
export { SearchModal, type SearchModalProps } from './SearchModal';
export { GithubPrModal } from './GithubPrModal';
export { CookieConsentModal } from './CookieConsentModal';

// Editor & Lemma Annotations
export { InlineEditor } from './InlineEditor';
export { AnnotationHoverPopup, type HoverPopupData } from './AnnotationHoverPopup';

// Theme & Navigation
export { ThemeSwitcher } from './ThemeSwitcher';
export { Navigation, type NavigationProps } from './Navigation';
export { Footer, type FooterProps } from './Footer';

// Context Providers & Hooks
export { ThemeProvider, useTheme } from './ThemeContext';
export { BookmarkProvider, useBookmarks } from './BookmarkContext';
export {
  SearchProvider,
  useSearch,
  type SearchScope,
  type SearchAnnotationItem,
  type SearchProviderProps,
} from './SearchContext';

// Client-Side EPUB Reader Service
export {
  browserEpub,
  BrowserEpubService,
  type ParsedEpubPage,
  type TextSearchResult,
} from './epubService';
