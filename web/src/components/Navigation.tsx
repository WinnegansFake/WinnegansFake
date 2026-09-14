'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/constants';
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

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { bookmarks, setShowBookmarksModal } = useBookmarks();
  const { openSearch } = useSearch();

  const navLinks = [
    { href: '/', label: 'Overview', icon: Compass },
    { href: '/library', label: 'Works', icon: Library },
    { href: '/reader', label: 'Reader', icon: BookOpen },
    { href: '/bookclub', label: 'Book Club', icon: Users },
    { href: '/dissertations', label: 'Dissertations', icon: GraduationCap },
    { href: '/guide', label: 'Local Setup', icon: Terminal },
    { href: '/contribute', label: 'Contribute', icon: Layers },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '';
    if (href === '/dissertations') return pathname?.startsWith('/dissertation');
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 wf-nav-surface backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      {/* Top Book Club Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/90 border-b border-emerald-500/20 text-xs py-1.5 px-4 text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
              <Users className="w-3 h-3" />
              <span>START A BOOK CLUB</span>
            </span>
            <span className="hidden sm:inline text-slate-400">
              Don&apos;t read Joyce alone! Inspired by the legendary 28-year Venice library reading circle.
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs ml-auto">
            <Link
              href="/bookclub"
              className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Organize Your Group &rarr;</span>
            </Link>
            <span className="text-slate-600">&bull;</span>
            <a
              href="https://www.tiktok.com/@lily76412/video/7661924549893655839?_r=1&_t=ZN-99VlBXRExiY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-indigo-300 hover:text-indigo-200 transition-colors"
              title="Watch TikTok video by @lily76412"
            >
              <span>Watch TikTok Inspiration Video &#9658;</span>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <span className="font-serif font-black text-emerald-400 text-lg leading-none">W</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-lg tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                  WinnegansFake
                </span>
                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight">
                Crowdsourced Annotations for <span className="italic">Finnegans Wake</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Universal Search Trigger */}
            <button
              type="button"
              onClick={() => openSearch()}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer group"
              title="Search text, lemmas, glosses, scholars, tags (Ctrl+F or /)"
              aria-label="Universal Search"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
              <span className="text-slate-300 group-hover:text-white">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800/90 text-slate-400 border border-slate-700/60 shadow-xs">
                Ctrl F
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setShowBookmarksModal(true)}
              className="relative inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              title={`Reading Bookmarks (${bookmarks.length} saved)`}
              aria-label="Open Reading Bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <ThemeSwitcher />
            <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Copyright Architecture</span>
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
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
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openSearch();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Universal Search</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl+F
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setShowBookmarksModal(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span>Reading Bookmarks</span>
            </div>
            {bookmarks.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                {bookmarks.length}
              </span>
            )}
          </button>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
            </div>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800"
            >
              <GithubIcon className="w-3.5 h-3.5" />
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
