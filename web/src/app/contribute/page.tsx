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
  AlertCircle,
  FileCode,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Shield,
  BookOpen,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  UserCheck,
  LogOut,
  Loader2,
  ArrowRight,
  Bookmark,
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/constants';
import {
  getSavedGithubToken,
  getSavedGithubUser,
  saveGithubToken,
  clearGithubToken,
  verifyGithubToken,
  GithubUser,
} from '@/lib/githubService';

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
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<GithubUser | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    const saved = getSavedGithubToken();
    const user = getSavedGithubUser();
    if (saved) {
      setTokenInput(saved);
      if (user) {
        setCurrentUser(user);
      } else {
        verifyGithubToken(saved)
          .then((u) => {
            setCurrentUser(u);
            saveGithubToken(saved, true, u);
          })
          .catch(() => {});
      }
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setIsVerifying(true);
    setAuthError(null);
    setAuthSuccess(null);
    try {
      const user = await verifyGithubToken(tokenInput.trim());
      setCurrentUser(user);
      saveGithubToken(tokenInput.trim(), rememberToken, user);
      setAuthSuccess(`Authenticated as @${user.login}! In-browser Pull Request submissions are now unlocked across the Interactive Reader.`);
    } catch (err: any) {
      setAuthError(err.message || 'Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisconnect = () => {
    clearGithubToken();
    setCurrentUser(null);
    setTokenInput('');
    setAuthSuccess(null);
    setAuthError(null);
  };

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

      {/* 2. IN-BROWSER PULL REQUEST & GITHUB AUTH FACILITY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white flex items-center space-x-2">
                <span>In-Browser 1-Click Pull Request Facility</span>
                <span className="bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                  Live UI Wizard
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Save your GitHub Personal Access Token in your browser to fork, branch, commit, and submit PRs with zero command-line tools.
              </p>
            </div>
          </div>
          <Link
            href="/reader"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
          >
            <span>Launch Reader</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {currentUser ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.login}
                className="w-12 h-12 rounded-full border-2 border-emerald-500/50 shadow-md"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white text-sm">{currentUser.name || currentUser.login}</span>
                  <span className="font-mono text-xs text-emerald-400">@{currentUser.login}</span>
                </div>
                <p className="text-xs text-slate-300">
                  GitHub Token Connected &bull; Scopes:{' '}
                  <span className="font-mono text-emerald-300">
                    {currentUser.scopes.length > 0 ? currentUser.scopes.join(', ') : 'public_repo'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Ready to submit live Pull Requests from the Interactive Reader!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/reader"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <span>Go to Reader &amp; Annotate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 transition-colors"
                title="Disconnect token"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Connect GitHub Personal Access Token (PAT)</span>
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=public_repo&description=WinnegansFake+Scholarly+Contributor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline inline-flex items-center space-x-1"
                >
                  <span>Create Token on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxxxxxxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 pr-10 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberToken}
                    onChange={(e) => setRememberToken(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <span>Save token in this browser (localStorage)</span>
                </label>
                <button
                  type="submit"
                  disabled={isVerifying || !tokenInput.trim()}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Save &amp; Connect Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {authSuccess && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {authError && (
              <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Verification Error: </span>
                  <span>{authError}</span>
                </div>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-xs">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Intermediary Privacy:</span>
              </div>
              <p className="leading-relaxed">
                Your token never touches any server other than <code className="text-slate-300 font-mono">api.github.com</code> directly via your browser. It is solely used to fork <code className="text-slate-300 font-mono">tekromancy/WinnegansFake</code> to your account and submit PRs with your name.
              </p>
            </div>
          </form>
        )}
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
