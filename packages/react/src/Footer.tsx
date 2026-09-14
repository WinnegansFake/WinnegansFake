import React from 'react';
import { Shield, BookOpen, ExternalLink, Heart, Terminal } from 'lucide-react';
import { ARCHIVE_EPUB_URL, GITHUB_REPO_URL } from '@winnegans/core';

export interface FooterProps {
  LinkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>;
  brandTitle?: string;
  brandDescription?: string;
}

export function Footer({
  LinkComponent,
  brandTitle = 'WinnegansFake',
  brandDescription = 'An open-source, zero-copyright digital apparatus and polyphonic scholarly gloss on classic literature.',
}: FooterProps = {}) {
  const DefaultLink = LinkComponent || (({ href, className, children }: any) => (
    <a href={href} className={className}>{children}</a>
  ));

  return (
    <footer className="wf-nav-surface border-t border-slate-800/80 text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <span className="font-serif font-black text-emerald-400 text-lg">{brandTitle}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {brandDescription}
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Metadata Licensed under CC-BY-SA 4.0
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <DefaultLink href="/" className="hover:text-emerald-300 transition-colors">
                  Overview & Philosophy
                </DefaultLink>
              </li>
              <li>
                <DefaultLink href="/library" className="hover:text-emerald-300 transition-colors">
                  Works Library Catalog
                </DefaultLink>
              </li>
              <li>
                <DefaultLink href="/reader" className="hover:text-emerald-300 transition-colors">
                  Interactive Scholarly Reader
                </DefaultLink>
              </li>
              <li>
                <DefaultLink href="/dissertations" className="hover:text-emerald-300 transition-colors">
                  Dissertations Library
                </DefaultLink>
              </li>
              <li>
                <DefaultLink href="/guide" className="hover:text-emerald-300 transition-colors">
                  Local Setup & EPUB Guide
                </DefaultLink>
              </li>
              <li>
                <DefaultLink href="/contribute" className="hover:text-emerald-300 transition-colors">
                  How to Contribute Annotations (PRs)
                </DefaultLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal Architecture */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Copyright & Legality
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
              <li className="flex items-start space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>U.S. Law Notice:</strong> Works published in 1939 remain under copyright in the U.S. through <strong>December 31, 2035</strong> (1998 Sonny Bono CTEA).
                </span>
              </li>
              <li>
                Zero book text is stored or hosted on this site.
              </li>
              <li>
                Annotations are pure academic commentary mapped to standard page & line coordinates (<code className="text-emerald-300">PPP.LL</code>).
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Open Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={ARCHIVE_EPUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-emerald-300 transition-colors"
                >
                  <span>Archive.org Source EPUB</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-emerald-300 transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <DefaultLink href="/guide#contributing" className="hover:text-emerald-300 transition-colors">
                  Contribute Annotations (PR)
                </DefaultLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>
            &copy; {new Date().getFullYear()} WinnegansFake Contributors. Made for scholars, readers, and nocturnal voyagers worldwide.
          </p>
          <div className="flex items-center space-x-4">
            <span className="font-mono">19 Registers</span>
            <span>&bull;</span>
            <span className="font-mono">630 Pages</span>
            <span>&bull;</span>
            <span className="font-mono">0 Infringements</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
