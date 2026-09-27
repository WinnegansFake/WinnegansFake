/**
 * @winnegans/ui / Component Index
 *
 * Universal, modular React components for crowdsourced literary annotation
 * and zero-copyright digital humanities reading applications.
 */

// Readers & Monograph Viewers
export { UniversalReader, WakeReader, type UniversalReaderProps } from './UniversalReader';
export { DissertationViewer } from './DissertationViewer';

// Interactive Modals & Dialogs
export { EpubSourceModal, type EpubPreset } from './EpubSourceModal';
export { BookmarksModal } from './BookmarksModal';
export { SearchModal } from './SearchModal';
export { GithubPrModal } from './GithubPrModal';
export { CookieConsentModal } from './CookieConsentModal';
export { CitationModal, type CitationModalProps } from './CitationModal';
export { KeyboardShortcutsModal, type KeyboardShortcutsModalProps } from './KeyboardShortcutsModal';
export { AcousticPlayer, type AcousticPlayerProps } from './AcousticPlayer';
export { DualPaneComparison, type DualPaneComparisonProps } from './DualPaneComparison';

// Editor & Lemma Annotations
export { InlineEditor } from './InlineEditor';
export { AnnotationHoverPopup, type HoverPopupData } from './AnnotationHoverPopup';
export { CoverageHeatmap } from './CoverageHeatmap';
export { SiglaConstellation, type SigilNode, SIGLA_DATA } from './SiglaConstellation';
export { ViconianWheel, type VicoAge, VICO_AGES } from './ViconianWheel';
export { BookClubFacilitator, type SeminarPreset, SEMINAR_PRESETS } from './BookClubFacilitator';

// Theme & Navigation
export { ThemeSwitcher } from './ThemeSwitcher';
export { Footer } from './Footer';
export { Navigation } from './Navigation';

// Context Providers & Hooks
export { ThemeProvider, useTheme } from './ThemeContext';
export { BookmarkProvider, useBookmarks } from './BookmarkContext';
export {
  SearchProvider,
  useSearch,
  type SearchScope,
  type SearchAnnotationItem,
} from './SearchContext';
