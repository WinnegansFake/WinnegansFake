'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Shield,
  Download,
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  Laptop,
  HelpCircle,
  GitBranch,
  Layers
} from 'lucide-react';
import { ARCHIVE_EPUB_URL, GITHUB_REPO_URL } from '@/lib/constants';

interface CodeSnippetProps {
  code: string;
  language?: string;
  title?: string;
}

function CodeSnippet({ code, language = 'bash', title }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
          <span>{title}</span>
          <span className="uppercase text-[10px] text-slate-500">{language}</span>
        </div>
      )}
      <div className="relative p-4">
        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Copy command"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <pre className="text-slate-200 overflow-x-auto pr-10">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>Local Deployment & Offline Reading Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight">
          How to Run Locally & Read with the EPUB
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed">
          Everything you need to set up WinnegansFake on your own laptop, download the public scan of <em>Finnegans Wake</em> from Internet Archive, and explore the complete text alongside the collected wisdom of 80+ years of Joycean scholarship.
        </p>
      </div>

      {/* 2. Critical Legal Notice Callout */}
      <div className="bg-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center space-x-3 text-amber-400 font-bold text-lg">
          <Shield className="w-6 h-6 flex-shrink-0" />
          <h2>Zero-Copyright Imperative: Why the EPUB Must Stay Strictly Local</h2>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          James Joyce died in Zurich in 1941, meaning his works are in the public domain throughout much of the world. However, under the <strong>United States Sonny Bono Copyright Term Extension Act of 1998</strong>, works first published with notice between 1929 and 1977 enjoy statutory protection for <strong>95 years from publication date</strong>:
        </p>
        <div className="bg-slate-950/90 border border-amber-500/30 p-4 rounded-xl font-mono text-xs text-amber-200/90 space-y-1">
          <div>Publication Year: 1939 (Faber &amp; Faber / Viking Press)</div>
          <div>Statutory Term: 95 Years</div>
          <div>U.S. Public Domain Entry: <strong>January 1, 2036</strong></div>
        </div>
        <div className="text-xs sm:text-sm text-slate-300 space-y-2">
          <p>
            Because of this, <strong>no copyrighted text from Finnegans Wake may ever be committed to git, uploaded to GitHub, or hosted on our public web servers</strong>.
          </p>
          <p>
            The entire source archive (<code className="text-amber-300">data/finneganswake00joycuoft.epub</code>) and extracted chapters remain strictly confined to your local <code className="text-amber-300">data/</code> directory, which is permanently ignored by git via <code className="text-amber-300">.gitignore</code>.
          </p>
          <p className="italic text-slate-400">
            By keeping the book text strictly on the reader&rsquo;s device, everyone can read the authentic Joyce text alongside the open-source scholarly metadata glosses with 100% legal compliance!
          </p>
        </div>
      </div>

      {/* 3. Option A: Browser-Only Reading (No Terminal Required!) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Laptop className="w-4 h-4" />
          <span>OPTION A &bull; ZERO CODING OR TERMINAL REQUIRED</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Read Directly in Your Web Browser
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          You don&rsquo;t even need to install Node.js or use a terminal to read with your local EPUB! Our web application includes an in-browser EPUB engine powered by JSZip that runs 100% on your laptop:
        </p>

        <ol className="space-y-4 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center flex-shrink-0 text-xs mt-0.5">1</span>
            <div>
              <strong>Download the EPUB file</strong> from Internet Archive to your Downloads folder:
              <div className="mt-2">
                <a
                  href={ARCHIVE_EPUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download finneganswake00joycuoft.epub (1.5 MB)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </li>

          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center flex-shrink-0 text-xs mt-0.5">2</span>
            <div>
              <strong>Open the Web Reader</strong>:
              <div className="mt-2">
                <Link
                  href="/reader"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Go to Interactive Reader</span>
                </Link>
              </div>
            </div>
          </li>

          <li className="flex items-start space-x-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center flex-shrink-0 text-xs mt-0.5">3</span>
            <div>
              <strong>Click &ldquo;Load Local EPUB File&rdquo;</strong> in the reader toolbar and select your downloaded file. The reader immediately unzips the archive in browser memory and renders the book lines side-by-side with all annotations!
            </div>
          </li>
        </ol>
      </div>

      {/* 4. Option B: Complete Local Laptop Setup with pnpm */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400">
          <Terminal className="w-4 h-4" />
          <span>OPTION B &bull; FULL LOCAL DEVELOPER ENVIRONMENT</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          Full Local Laptop Setup (CLI &amp; Dev Server)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Running WinnegansFake locally gives you full offline capabilities, access to the high-performance TypeScript EPUB parsing engine, and the ability to draft, validate, and contribute scholarly annotations.
        </p>

        {/* Prerequisites */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-wider text-slate-200 font-semibold flex items-center space-x-2">
            <span>System Prerequisites</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>Node.js:</strong> v20.0.0 or later</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>pnpm:</strong> v9.0.0 or later (Mandatory!)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>Python:</strong> 3.8+ (for page indexer)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>Make &amp; curl:</strong> standard Unix utilities</span>
            </li>
          </ul>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-6 pt-2">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">1</span>
              <span>Clone the Repository</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Clone the project from GitHub to your workspace:
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Clone via Git"
                code="git clone https://github.com/tekromancy/WinnegansFake.git
cd WinnegansFake"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">2</span>
              <span>Install Dependencies with pnpm</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Install monorepo dependencies. Per <code className="text-emerald-300">AGENTS.md</code>, this repo uses <strong>pnpm</strong> exclusively (never npm or yarn):
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Install with pnpm"
                code="pnpm install"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">3</span>
              <span>Fetch the EPUB Source Data</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Run the automated Makefile target to download the public scan of <em>Finnegans Wake</em> into your local <code className="text-amber-300">data/</code> directory:
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Fetch local data"
                code="pnpm fetch:data"
              />
              <div className="text-[11px] text-slate-400 italic mt-1">
                Under the hood, this runs <code className="text-slate-300">make -C data</code>, which downloads <code className="text-slate-300">finneganswake00joycuoft.epub</code> and extracts chapter HTMLs.
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">4</span>
              <span>Verify Cryptographic Signatures &amp; Generate Index</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Verify the SHA-256 hashes of the downloaded EPUB to ensure data integrity, and calibrate printed page coordinates:
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Verify & Index"
                code="pnpm signatures:verify
pnpm index:epub"
              />
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">5</span>
              <span>Validate Annotation Corpus</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Validate all 630 page annotation files against the JSON Schema and ensure zero copyright phrase violations:
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Validate schema & rules"
                code="pnpm validate"
              />
            </div>
          </div>

          {/* Step 6 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-semibold text-white">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono flex items-center justify-center text-xs">6</span>
              <span>Launch Local Development Server</span>
            </div>
            <p className="text-xs text-slate-300 pl-8">
              Start the Next.js local server:
            </p>
            <div className="pl-8">
              <CodeSnippet
                title="Start dev server"
                code="pnpm dev"
              />
              <p className="text-xs text-slate-300 mt-2">
                Open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-mono">http://localhost:3000</a> in your browser to read and edit offline!
              </p>
            </div>
          </div>

          {/* All in one shortcut */}
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
              <span>Quick One-Liner (Automated Setup)</span>
            </div>
            <p className="text-xs text-slate-300">
              If you have all prerequisites installed, run the full pipeline in one command:
            </p>
            <CodeSnippet
              title="One-line setup & run"
              code="pnpm setup && pnpm dev"
            />
          </div>
        </div>
      </div>

      {/* 5. Contributing Scholarly Annotations */}
      <div id="contributing" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl scroll-mt-24">
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
          <GitBranch className="w-4 h-4" />
          <span>COMMUNITY CONTRIBUTIONS</span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white">
          How to Contribute Annotations via Pull Request
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          WinnegansFake is a crowdsourced communal project. If you have identified a multilingual pun, Dublin topographical reference, Viconian cycle, or literary allusion, you can contribute directly via GitHub:
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-semibold text-white text-xs font-mono">Annotation File Structure:</h4>
            <p className="text-xs text-slate-400">
              Each page is stored under <code className="text-emerald-300">annotations/book_&lt;B&gt;/chapter_&lt;C&gt;/page_&lt;PPP&gt;.json</code>.
            </p>
            <CodeSnippet
              language="json"
              title="Example annotation entry in page_003.json"
              code='{
  "id": "003.01-01",
  "line_number": 1,
  "target_phrase": "riverrun",
  "annotation_text": "Anna Livia Plurabelle as the River Liffey beginning her course toward the sea; connects to final sentence on page 628. Also French riverain (riverbank dweller).",
  "categories": ["viconian-cycles", "river-liffey", "etymological-polyglot"],
  "cross_references": ["628.16"],
  "sources": ["McHugh, Roland. Annotations to Finnegans Wake (4th ed.), p. 3"],
  "contributors": ["your-github-username"]
}'
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs font-mono">Contributor Rules:</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li><strong>Target Phrase Limit:</strong> <code className="text-emerald-300">target_phrase</code> must be strictly under 150 characters (only the anchor lemma, never full copyrighted paragraphs).</li>
              <li><strong>Line Number Range:</strong> <code className="text-emerald-300">line_number</code> must be between 1 and 40.</li>
              <li><strong>Coordinates:</strong> Must match standard page pagination (1 to 628).</li>
              <li><strong>Validation:</strong> Run <code className="text-emerald-300">pnpm validate</code> before committing. Automated CI rejects invalid schemas.</li>
              <li><strong>License:</strong> All contributed notes are published under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
