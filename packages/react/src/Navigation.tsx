'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  Terminal,
  Compass,
  Menu,
  X,
  Shield,
  Layers,
  Bookmark,
  Search,
  Library,
  Users,
  Zap,
  BarChart3,
  Sparkles,
  RotateCw,
  ChevronDown,
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@winnegans/core';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useBookmarks } from './BookmarkContext';
import { useSearch } from './SearchContext';
import { BookmarksModal } from './BookmarksModal';

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

export interface DropdownItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavSection {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: DropdownItem[];
}

export interface NavigationProps {
  currentPath?: string;
  LinkComponent?: React.ComponentType<{
    href: string;
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
  }>;
  onNavigate?: (url: string) => void;
  brandTitle?: string;
  brandSubtitle?: string;
  version?: string;
}

export function Navigation({
  currentPath,
  LinkComponent,
  onNavigate,
  brandTitle = 'WinnegansFake',
  brandSubtitle = 'Zero-Copyright Joycean Gloss',
  version = 'v2.3',
}: NavigationProps = {}) {
  const pathname = currentPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { bookmarks, setShowBookmarksModal } = useBookmarks();
  const { openSearch } = useSearch();

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const DefaultLink = LinkComponent || (({ href, className, children, onClick }: any) => (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (onClick) onClick();
        if (onNavigate) {
          e.preventDefault();
          onNavigate(href);
        }
      }}
    >
      {children}
    </a>
  ));

  const navSections: NavSection[] = [
    {
      href: '/reader',
      label: 'Reader',
      icon: BookOpen,
    },
    {
      href: '/library',
      label: 'Library',
      icon: Library,
      subItems: [
        {
          href: '/library',
          label: 'Works Catalog',
          description: 'Browse Finnegans Wake, Ulysses, Neuromancer & upcoming editions',
          icon: Library,
          badge: '3 Editions',
        },
        {
          href: '/library/coverage',
          label: 'Coverage Heatmap',
          description: 'Line-by-line annotation matrix & scholarly density diagnostic',
          icon: BarChart3,
          badge: '782 Pages',
        },
      ],
    },
    {
      href: '/schemas',
      label: 'Schemata',
      icon: Compass,
      subItems: [
        {
          href: '/schemas',
          label: 'All Schemata & Apparatus',
          description: 'Central hub for visual hermeneutics and critical architectures',
          icon: Compass,
        },
        {
          href: '/schemas/ulysses',
          label: 'Ulysses Schema Matrix',
          description: 'Gilbert & Linati 18-episode somatic organs and Homeric parallels',
          icon: Compass,
          badge: 'Joyce 1922',
        },
        {
          href: '/schemas/neuromancer',
          label: 'Matrix Dossier',
          description: 'Tessier-Ashpool dynasty, AI duality & Sprawl cyberpunk argot',
          icon: Terminal,
          badge: 'Gibson 1984',
        },
        {
          href: '/sigla',
          label: 'Sigla Constellation',
          description: 'Buffalo Notebooks hieroglyphic characters & Brunonian dialectic',
          icon: Sparkles,
          badge: 'Genetic Joyce',
        },
        {
          href: '/vico',
          label: 'Vico Cycles Wheel',
          description: 'Scienza Nuova four-stage radial cyclical cosmogram & Ricorso',
          icon: RotateCw,
          badge: '4 Ages',
        },
        {
          href: '/thunders',
          label: '10 Thunderwords Laboratory',
          description: 'Acoustic laboratory decoding 1,001 letters across 60+ tongues',
          icon: Zap,
          badge: '1,001 Letters',
        },
      ],
    },
    {
      href: '/dissertations',
      label: 'Dissertations',
      icon: GraduationCap,
    },
    {
      href: '/bookclub',
      label: 'Book Club',
      icon: Users,
    },
    {
      href: '/contribute',
      label: 'Contribute',
      icon: Layers,
    },
  ];

  const isSectionActive = (section: NavSection) => {
    if (section.href === '/reader') return pathname?.startsWith('/reader');
    if (section.href === '/dissertations') return pathname?.startsWith('/dissertation');
    if (section.subItems) {
      return section.subItems.some((sub) =>
        sub.href === '/' ? pathname === '/' : pathname?.startsWith(sub.href)
      );
    }
    return pathname?.startsWith(section.href);
  };

  const handleMouseEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 wf-nav-surface backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <DefaultLink href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <span className="font-serif font-black text-emerald-400 text-lg leading-none">
                  {brandTitle.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                  {brandTitle}
                </span>
                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {version}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight hidden sm:block">
                {brandSubtitle}
              </p>
            </div>
          </DefaultLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navSections.map((section) => {
              const Icon = section.icon;
              const active = isSectionActive(section);
              const hasDropdown = Boolean(section.subItems && section.subItems.length > 0);
              const isDropdownOpen = openDropdown === section.label;

              if (!hasDropdown) {
                return (
                  <DefaultLink
                    key={section.href}
                    href={section.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{section.label}</span>
                  </DefaultLink>
                );
              }

              return (
                <div
                  key={section.href}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(section.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <DefaultLink
                    href={section.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{section.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180 opacity-100 text-emerald-400' : ''
                      }`}
                    />
                  </DefaultLink>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && section.subItems && (
                    <div className="absolute top-full left-0 w-72 sm:w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2.5 backdrop-blur-xl space-y-1">
                        {section.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const subActive =
                            sub.href === '/'
                              ? pathname === '/'
                              : pathname === sub.href ||
                                (sub.href !== '/library' &&
                                  sub.href !== '/schemas' &&
                                  pathname?.startsWith(sub.href));

                          return (
                            <DefaultLink
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                                subActive
                                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-white'
                                  : 'hover:bg-slate-800/70 text-slate-300 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                  subActive
                                    ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-semibold truncate text-white">
                                    {sub.label}
                                  </span>
                                  {sub.badge && (
                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/80 text-emerald-400 shrink-0">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                  {sub.description}
                                </p>
                              </div>
                            </DefaultLink>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center space-x-2">
            {/* Universal Search Trigger */}
            <button
              type="button"
              onClick={() => openSearch()}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
              title="Search text, lemmas, glosses, scholars, tags (Ctrl+F or /)"
              aria-label="Universal Search"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-slate-300 group-hover:text-white hidden md:inline">Search</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 shadow-xs">
                Ctrl F
              </kbd>
            </button>

            {/* Reading Bookmarks */}
            <button
              type="button"
              onClick={() => setShowBookmarksModal(true)}
              className="relative inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              title={`Reading Bookmarks (${bookmarks.length} saved)`}
              aria-label="Open Reading Bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <ThemeSwitcher />

            {/* Compact Zero-Copyright Link */}
            <DefaultLink
              href="/guide"
              className="hidden 2xl:flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900/80 px-2.5 py-1.5 rounded-md border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Copyright</span>
            </DefaultLink>

            {/* GitHub Repo Link */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
              title="View repository on GitHub"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden xl:inline">GitHub</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              type="button"
              onClick={() => openSearch()}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              title="Search (Ctrl+F or /)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={() => setShowBookmarksModal(true)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative"
              title="Reading Bookmarks"
              aria-label="Reading Bookmarks"
            >
              <Bookmark className="w-4 h-4 text-emerald-400" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 rounded-full text-[9px] font-mono font-bold bg-emerald-500 text-black flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Structured Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Reading Core */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
              Reading Core
            </div>
            <DefaultLink
              href="/reader"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                pathname?.startsWith('/reader')
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Scholarly Reader</span>
            </DefaultLink>
            <DefaultLink
              href="/library"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === '/library'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Library className="w-4 h-4 text-indigo-400" />
              <span>Works Catalog</span>
            </DefaultLink>
            <DefaultLink
              href="/library/coverage"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === '/library/coverage'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Coverage Matrix</span>
            </DefaultLink>
          </div>

          {/* Section 2: Critical Apparatus & Schemata */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Critical Schemata &amp; Apparatus
              </span>
              <DefaultLink
                href="/schemas"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[10px] font-mono text-emerald-400 hover:underline"
              >
                View Hub &rarr;
              </DefaultLink>
            </div>
            <DefaultLink
              href="/schemas/ulysses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Ulysses Linati &amp; Gilbert Schemata</span>
            </DefaultLink>
            <DefaultLink
              href="/schemas/neuromancer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Neuromancer Matrix Dossier</span>
            </DefaultLink>
            <DefaultLink
              href="/sigla"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Sigla Constellation Graph</span>
            </DefaultLink>
            <DefaultLink
              href="/vico"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <RotateCw className="w-4 h-4 text-emerald-400" />
              <span>Viconian Historical Cycles Wheel</span>
            </DefaultLink>
            <DefaultLink
              href="/thunders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>10 Thunderwords Laboratory</span>
            </DefaultLink>
          </div>

          {/* Section 3: Scholarship & Community */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-semibold">
              Scholarship &amp; Community
            </div>
            <DefaultLink
              href="/dissertations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Doctoral Dissertations</span>
            </DefaultLink>
            <DefaultLink
              href="/bookclub"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Start a Book Club</span>
            </DefaultLink>
            <DefaultLink
              href="/contribute"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-900"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Contributing Guide</span>
            </DefaultLink>
          </div>

          {/* Mobile Footer Links */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1 font-mono">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Copyright</span>
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-white text-slate-300"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      )}

      {/* Global Bookmarks Modal when not on reader page */}
      {pathname !== '/reader' && <BookmarksModal />}
    </header>
  );
}
