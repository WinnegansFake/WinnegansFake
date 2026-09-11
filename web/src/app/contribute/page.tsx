'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  GitFork,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Shield,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/constants';

interface CodeBlockProps {
  code: string;
  title?: string;
}

function CodeBlock({ code, title }: CodeBlockProps) {
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
          <span className="uppercase text-[10px] text-slate-500">BASH</span>
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
        <pre className="text-slate-200 overflow-x-auto pr-10 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default function ContributePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-12">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 text-xs font-mono">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Community Philology & Open Source Contribution</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-white leading-tight">
          Contributing Annotations &amp; Submitting Pull Requests
        </h1>
        <p className="text-base text-slate-300 font-sans leading-relaxed">
          WinnegansFake is a decentralized scholarly apparatus. Every reader who discovers a multilingual portmanteau, Dublin topographical reference, Viconian cycle, or musical motif is invited to contribute annotations directly through GitHub Pull Requests.
        </p>
      </div>

      {/* 2. Overview: How Pull Requests Work */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
          <GitFork className="w-6 h-6 text-emerald-400" />
          <span>How Pull Requests Work</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          A <strong>Pull Request (PR)</strong> is the standard collaborative mechanism used across open-source software. When contributing to WinnegansFake, you do not edit the main repository directly. Instead, you:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-mono font-bold text-xs flex items-center space-x-1.5">
              <span>1. Fork</span>
            </div>
            <p className="text-xs text-slate-400">
              Create your own personal copy of the repository on your GitHub account.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-indigo-400 font-mono font-bold text-xs flex items-center space-x-1.5">
              <span>2. Branch &amp; Edit</span>
            </div>
            <p className="text-xs text-slate-400">
              Create a feature branch, locate the target page JSON file, and add your annotation item.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-mono font-bold text-xs flex items-center space-x-1.5">
              <span>3. Validate</span>
            </div>
            <p className="text-xs text-slate-400">
              Run automated schema and copyright checks locally with <code className="text-amber-300">pnpm validate</code>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-mono font-bold text-xs flex items-center space-x-1.5">
              <span>4. Open PR</span>
            </div>
            <p className="text-xs text-slate-400">
              Submit your proposed addition on GitHub for peer review and automated CI validation.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start space-x-2.5">
          <BookOpen className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            For thorough deep-dives into Git version control and GitHub features, consult the official documentation at{' '}
            <a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center space-x-0.5">
              <span>git-scm.com/doc</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>{' '}
            and{' '}
            <a href="https://docs.github.com/en/pull-requests" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline inline-flex items-center space-x-0.5">
              <span>docs.github.com/en/pull-requests</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>.
          </span>
        </div>
      </div>

      {/* 3. Step-by-Step Git Commands Tutorial */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
          <Terminal className="w-6 h-6 text-amber-400" />
          <span>Step-by-Step Git Workflow with Example</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Here is the complete sequence of Git terminal commands to contribute an annotation from start to finish:
        </p>

        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">1</span>
            <span>Fork the Repository &amp; Clone to Your Laptop</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Go to <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">github.com/tekromancy/WinnegansFake</a> and click the <strong>Fork</strong> button in the top right. Then clone your fork locally:
          </p>
          <div className="pl-8">
            <CodeBlock
              title="Clone your personal fork"
              code="git clone https://github.com/YOUR-USERNAME/WinnegansFake.git
cd WinnegansFake
pnpm install"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">2</span>
            <span>Create a Descriptive Feature Branch</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Never commit directly to <code className="text-slate-300">main</code>. Create a dedicated branch named after the page or topic:
          </p>
          <div className="pl-8">
            <CodeBlock
              title="Create branch"
              code="git checkout -b annotate-page-003-commodius-vicus"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">3</span>
            <span>Locate and Edit the Target Page Annotation File</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            All annotations are organized cleanly by book, chapter, and page: <br />
            <code className="text-emerald-300 bg-slate-950 px-2 py-0.5 rounded font-mono text-[11px]">
              annotations/book_&lt;B&gt;/chapter_&lt;C&gt;/page_&lt;PPP&gt;.json
            </code>
          </p>
          <p className="text-xs text-slate-400 pl-8">
            For example, open <code className="text-slate-300">annotations/book_1/chapter_1/page_003.json</code> in your code editor and add your annotation object to the <code className="text-slate-300">annotations</code> array:
          </p>
          <div className="pl-8">
            <div className="my-2 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre><code>{`{
  "id": "003.01-03",
  "line_number": 1,
  "target_phrase": "commodius vicus of recirculation",
  "annotation_text": "Allusion to Giambattista Vico (1668–1744) and his Scienza Nuova, positing the cyclical evolution of human civilization through four recurring ages. Also Latin vicus (lane, hamlet) and Commodore John Barry.",
  "categories": ["viconian-cycles", "etymological-polyglot", "dublin-topography"],
  "cross_references": ["004.18", "628.16"],
  "sources": [
    "McHugh, Roland. Annotations to Finnegans Wake (4th ed.), p. 3",
    "Atherton, James S. The Books at the Wake, pp. 29-34"
  ],
  "contributors": ["your-github-username"]
}`}</code></pre>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">4</span>
            <span>Validate Your Changes Locally</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Before committing, run our validation tool. It checks JSON schema syntax, coordinates, character length safeguards, and line rules:
          </p>
          <div className="pl-8">
            <CodeBlock
              title="Run schema and rule validation"
              code="pnpm validate
# or validate just your modified file:
node validate.js --path annotations/book_1/chapter_1/page_003.json"
            />
            <p className="text-[11px] text-slate-400 italic mt-1">
              You should see: <code className="text-emerald-400 font-semibold">✅ All annotation file(s) passed validation successfully!</code>
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">5</span>
            <span>Stage, Commit, and Push Your Branch</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Stage the modified file, write a clear commit message, and push to your GitHub fork:
          </p>
          <div className="pl-8">
            <CodeBlock
              title="Git stage, commit, and push"
              code={`git add annotations/book_1/chapter_1/page_003.json
git commit -m "feat(annotations): add Vico recirculation gloss for 003.01"
git push -u origin annotate-page-003-commodius-vicus`}
            />
          </div>
        </div>

        {/* Step 6 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-semibold text-white">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center justify-center text-xs">6</span>
            <span>Open the Pull Request on GitHub</span>
          </div>
          <p className="text-xs text-slate-400 pl-8">
            Visit your fork on GitHub or the upstream repo. You will see a banner saying <strong>&ldquo;Compare &amp; pull request&rdquo;</strong>.
          </p>
          <ul className="list-disc pl-12 space-y-1 text-xs text-slate-300">
            <li>Title your PR clearly, e.g. <code className="text-emerald-300 font-mono">feat(003): add Vico gloss for 003.01</code></li>
            <li>In the description, briefly describe the scholarly source or motif reference.</li>
            <li>Submit! Our GitHub Actions CI will automatically run tests and validate your annotations.</li>
          </ul>
        </div>
      </div>

      {/* 4. Strict Contributor & Schema Rules */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
        <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          <span>Annotation Rules &amp; Zero-Copyright Constraints</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-emerald-400 font-semibold block">Target Phrase Length Limit</span>
            <p className="text-slate-400">
              <code className="text-slate-200 font-mono">target_phrase</code> must be strictly under <strong>150 characters</strong> and contain no newlines. Target only the anchor lemma or phrase, never full copyrighted book passages.
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-emerald-400 font-semibold block">Coordinate &amp; Line Rules</span>
            <p className="text-slate-400">
              <code className="text-slate-200 font-mono">line_number</code> must be an integer between <strong>1 and 40</strong>, corresponding to the standard Faber/Viking line count for that page.
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-emerald-400 font-semibold block">Annotation Text Length</span>
            <p className="text-slate-400">
              <code className="text-slate-200 font-mono">annotation_text</code> must be at least <strong>10 characters</strong>, providing substantive scholarly commentary, translation, or motif context.
            </p>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-emerald-400 font-semibold block">Open License Grant</span>
            <p className="text-slate-400">
              By contributing, you agree that your annotations are dedicated to the public commons under <strong>CC BY-SA 4.0</strong> (Creative Commons Attribution-ShareAlike 4.0 International).
            </p>
          </div>
        </div>
      </div>

      {/* 5. Official External References */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
          Official Documentation &amp; Reference Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
          >
            <div>
              <span className="font-semibold block text-emerald-400">Pro Git: Contributing to a Project</span>
              <span className="text-[11px] text-slate-400">Official Git book chapter on fork &amp; branch workflows</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>

          <a
            href="https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
          >
            <div>
              <span className="font-semibold block text-indigo-400">GitHub Docs: Contributing to Projects</span>
              <span className="text-[11px] text-slate-400">Creating branches, commits, and pull requests on GitHub</span>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
}
