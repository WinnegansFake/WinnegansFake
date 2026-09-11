'use client';

import React, { useState, useEffect } from 'react';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  Key,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  X,
  Shield,
  Loader2,
  FileCode,
  ArrowRight,
  Sparkles,
  Info,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { AnnotationItem } from '@/types/annotations';
import {
  UPSTREAM_OWNER,
  UPSTREAM_REPO,
  UPSTREAM_BRANCH,
  GithubUser,
  PrSubmissionStatus,
  getSavedGithubToken,
  getSavedGithubUser,
  saveGithubToken,
  clearGithubToken,
  verifyGithubToken,
  getPageFilePath,
  generateDefaultPrMetadata,
  submitAnnotationPullRequest,
} from '@/lib/githubService';

interface GithubPrModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageNumber: number;
  annotation: AnnotationItem;
  onPrCreated?: (prUrl: string, prNumber: number) => void;
}

export function GithubPrModal({
  isOpen,
  onClose,
  pageNumber,
  annotation,
  onPrCreated,
}: GithubPrModalProps) {
  // Wizard steps: 1: Auth & Token, 2: Review & Submit, 3: Success
  const [activeStep, setActiveStep] = useState<'auth' | 'review' | 'submitting' | 'success'>('auth');
  const [authMode, setAuthMode] = useState<'token' | 'manual'>('token');

  // Token management
  const [tokenInput, setTokenInput] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [rememberToken, setRememberToken] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<GithubUser | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // PR Form fields
  const meta = generateDefaultPrMetadata(pageNumber, annotation);
  const [branchName, setBranchName] = useState<string>(meta.branchName);
  const [prTitle, setPrTitle] = useState<string>(meta.prTitle);
  const [commitMessage, setCommitMessage] = useState<string>(meta.commitMessage);
  const [prBody, setPrBody] = useState<string>(meta.prBody);

  // Submission state
  const [submissionStatus, setSubmissionStatus] = useState<PrSubmissionStatus>({
    step: 'idle',
    message: '',
  });
  const [createdPrData, setCreatedPrData] = useState<{ url: string; number: number } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Initialize saved token & metadata when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedToken = getSavedGithubToken();
      const savedUser = getSavedGithubUser();
      const freshMeta = generateDefaultPrMetadata(pageNumber, annotation);

      setBranchName(freshMeta.branchName);
      setPrTitle(freshMeta.prTitle);
      setCommitMessage(freshMeta.commitMessage);
      setPrBody(freshMeta.prBody);
      setCreatedPrData(null);
      setSubmissionStatus({ step: 'idle', message: '' });
      setAuthError(null);

      if (savedToken) {
        setTokenInput(savedToken);
        if (savedUser) {
          setCurrentUser(savedUser);
          setActiveStep('review');
        } else {
          // Verify saved token
          setIsVerifying(true);
          verifyGithubToken(savedToken)
            .then((u) => {
              setCurrentUser(u);
              saveGithubToken(savedToken, true, u);
              setActiveStep('review');
            })
            .catch((err) => {
              setAuthError(err.message);
              setActiveStep('auth');
            })
            .finally(() => setIsVerifying(false));
        }
      } else {
        setActiveStep('auth');
      }
    }
  }, [isOpen, pageNumber, annotation]);

  if (!isOpen) return null;

  const targetFile = getPageFilePath(pageNumber);

  // Verify and connect with token
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setAuthError('Please enter a GitHub Personal Access Token.');
      return;
    }

    setIsVerifying(true);
    setAuthError(null);

    try {
      const user = await verifyGithubToken(tokenInput.trim());
      setCurrentUser(user);
      saveGithubToken(tokenInput.trim(), rememberToken, user);
      setActiveStep('review');
    } catch (err: any) {
      setAuthError(err.message || 'Token verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Disconnect token
  const handleDisconnect = () => {
    clearGithubToken();
    setCurrentUser(null);
    setTokenInput('');
    setActiveStep('auth');
  };

  // Submit PR
  const handleExecutePr = async () => {
    const token = tokenInput.trim() || getSavedGithubToken();
    if (!token) {
      setActiveStep('auth');
      setAuthError('Authentication required. Please connect your GitHub token.');
      return;
    }

    setActiveStep('submitting');

    try {
      const result = await submitAnnotationPullRequest({
        token,
        pageNumber,
        annotation,
        branchName,
        prTitle,
        prBody,
        commitMessage,
        onProgress: (status) => {
          setSubmissionStatus(status);
        },
      });

      setCreatedPrData({
        url: result.prUrl,
        number: result.prNumber,
      });
      setActiveStep('success');
      if (onPrCreated) {
        onPrCreated(result.prUrl, result.prNumber);
      }
    } catch (err: any) {
      setSubmissionStatus({
        step: 'error',
        message: 'Pull Request submission failed.',
        details: err.message || 'An unexpected error occurred while communicating with GitHub.',
      });
    }
  };

  const copyPrUrl = () => {
    if (!createdPrData) return;
    navigator.clipboard.writeText(createdPrData.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyAnnotationJson = () => {
    const snippet = JSON.stringify(annotation, null, 2);
    navigator.clipboard.writeText(snippet);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-pr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && activeStep !== 'submitting') {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h2 id="github-pr-modal-title" className="text-base font-serif font-bold text-white flex items-center space-x-2">
                <span>Submit Scholarly Pull Request</span>
                <span className="font-mono text-xs font-normal px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  FW {String(pageNumber).padStart(3, '0')}.{String(annotation.line_number).padStart(2, '0')}
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">
                Lemma: <span className="font-mono text-emerald-300 font-medium">&ldquo;{annotation.target_phrase}&rdquo;</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={activeStep === 'submitting'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="px-5 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (activeStep !== 'submitting') setActiveStep('auth');
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
                activeStep === 'auth'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : currentUser
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>1. GitHub Auth</span>
              {currentUser && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
            </button>

            <span className="text-slate-600">&rarr;</span>

            <button
              onClick={() => {
                if (currentUser && activeStep !== 'submitting') setActiveStep('review');
              }}
              disabled={!currentUser}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md transition-colors ${
                activeStep === 'review' || activeStep === 'submitting'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : currentUser
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>2. Review &amp; Submit</span>
            </button>

            <span className="text-slate-600">&rarr;</span>

            <span
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md ${
                activeStep === 'success'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'text-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Complete</span>
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-2">
              <img
                src={currentUser.avatar_url}
                alt={currentUser.login}
                className="w-4 h-4 rounded-full border border-slate-700"
              />
              <span className="text-slate-300 hidden sm:inline">@{currentUser.login}</span>
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-[11px] text-slate-500 hover:text-red-400 transition-colors ml-1"
                title="Disconnect GitHub Token"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm scrollbar-thin">
          {/* STEP 1: GitHub Authentication */}
          {activeStep === 'auth' && (
            <div className="space-y-4">
              {/* Authenticated banner if already logged in */}
              {currentUser ? (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={currentUser.avatar_url}
                      alt={currentUser.login}
                      className="w-10 h-10 rounded-full border border-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{currentUser.name || currentUser.login}</span>
                        <span className="font-mono text-xs text-emerald-400">@{currentUser.login}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Token authenticated with scopes: {currentUser.scopes.length > 0 ? currentUser.scopes.join(', ') : 'repo access'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep('review')}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Disconnect token"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVerifyToken} className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                        <Key className="w-3.5 h-3.5 text-indigo-400" />
                        <span>GitHub Personal Access Token (PAT)</span>
                      </label>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=public_repo&description=WinnegansFake+Scholarly+Contributor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline inline-flex items-center space-x-1"
                      >
                        <span>Generate Token on GitHub</span>
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
                        className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300"
                        title={showToken ? 'Hide token' : 'Show token'}
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberToken}
                          onChange={(e) => setRememberToken(e.target.checked)}
                          className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                        />
                        <span>Remember token in this browser (localStorage)</span>
                      </label>
                      <button
                        type="submit"
                        disabled={isVerifying || !tokenInput.trim()}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Verify &amp; Save Token</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Verification Error: </span>
                        <span>{authError}</span>
                      </div>
                    </div>
                  )}

                  {/* Token Instructions Accordion / Card */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2.5">
                    <div className="flex items-center space-x-1.5 text-indigo-300 font-semibold">
                      <Shield className="w-4 h-4" />
                      <span>Security &amp; Permissions Safeguards</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
                      <li>
                        <strong>Token Scope:</strong> Only <code className="text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">public_repo</code> (Classic) or <code className="text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">Contents: Read &amp; Write</code> + <code className="text-emerald-300 bg-slate-900 px-1 py-0.2 rounded font-mono">Pull Requests: Read &amp; Write</code> (Fine-grained) is required.
                      </li>
                      <li>
                        <strong>100% Client-Side:</strong> Your token is stored only in your local browser and connects directly to <code className="text-slate-300 font-mono">api.github.com</code>. It is never transmitted to any proxy, server, or database.
                      </li>
                      <li>
                        <strong>Zero Copyright:</strong> Pull Requests modify only the structured open-source JSON annotation catalog under CC BY-SA 4.0.
                      </li>
                    </ul>
                  </div>
                </form>
              )}

              {/* Alternative: Manual Submission Link */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Prefer not using a token?</span>
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'manual' ? 'token' : 'manual')}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  {authMode === 'manual' ? 'Back to Token Assistant' : 'View 1-Click Web & Git Instructions'}
                </button>
              </div>

              {authMode === 'manual' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 animate-in fade-in">
                  <p className="text-slate-300">
                    You can copy the annotation JSON and open GitHub&apos;s web editor directly:
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={copyAnnotationJson}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs border border-slate-700 transition-colors"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedJson ? 'JSON Copied!' : 'Copy Annotation JSON'}</span>
                    </button>
                    <a
                      href={`https://github.com/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/new/${UPSTREAM_BRANCH}/${targetFile.replace(/[^/]+$/, '')}?filename=page_${String(pageNumber).padStart(3, '0')}.json`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                    >
                      <span>Open GitHub Web Editor</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Review & Submit */}
          {activeStep === 'review' && (
            <div className="space-y-4">
              {/* Target File & Upstream summary */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono flex items-center space-x-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Target Repository:</span>
                  </span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {UPSTREAM_OWNER}/{UPSTREAM_REPO} : {UPSTREAM_BRANCH}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-mono flex items-center space-x-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Target JSON File:</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-medium">{targetFile}</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pull Request Title
                  </label>
                  <input
                    type="text"
                    value={prTitle}
                    onChange={(e) => setPrTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-sans text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Git Branch Name
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Commit Message
                    </label>
                    <input
                      type="text"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 font-sans text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Pull Request Description &amp; Scholarly Provenance (Markdown)
                  </label>
                  <textarea
                    rows={6}
                    value={prBody}
                    onChange={(e) => setPrBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-indigo-500 scrollbar-thin"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep('auth')}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  &larr; Back to Auth
                </button>
                <button
                  type="button"
                  onClick={handleExecutePr}
                  className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 rounded-lg transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <GitPullRequest className="w-4 h-4" />
                  <span>Submit Pull Request to GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Submitting Progress */}
          {activeStep === 'submitting' && (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-950/60 border border-indigo-500/40 text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-serif font-bold text-white">
                  Creating Your Pull Request on GitHub
                </h3>
                <p className="text-xs font-mono text-indigo-300">
                  {submissionStatus.message || 'Processing GitHub API requests...'}
                </p>
              </div>

              {/* Progress Stepper List */}
              <div className="max-w-md mx-auto text-left p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs font-mono">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">Verified credentials as @{currentUser?.login}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {['creating_branch', 'updating_file', 'opening_pr', 'success'].includes(submissionStatus.step) ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  )}
                  <span className="text-slate-300">Synchronized repository &amp; created feature branch</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {['opening_pr', 'success'].includes(submissionStatus.step) ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : submissionStatus.step === 'updating_file' ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className="text-slate-300">Committed JSON note to {targetFile}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  {submissionStatus.step === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : submissionStatus.step === 'opening_pr' ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span className="text-slate-300">Opened Pull Request to {UPSTREAM_OWNER}/{UPSTREAM_REPO}</span>
                </div>
              </div>

              {submissionStatus.step === 'error' && (
                <div className="p-4 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs space-y-2 text-left">
                  <div className="flex items-center space-x-2 font-semibold">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Submission Failed</span>
                  </div>
                  <p className="text-slate-300">{submissionStatus.details || submissionStatus.message}</p>
                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveStep('review')}
                      className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-white rounded-lg text-xs transition-colors"
                    >
                      Back to Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleExecutePr}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs transition-colors"
                    >
                      Retry Submission
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {activeStep === 'success' && createdPrData && (
            <div className="py-6 px-4 text-center space-y-5 animate-in zoom-in-95">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-serif font-bold text-white">
                  Pull Request #{createdPrData.number} Created!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Your scholarly annotation has been committed and submitted as a live Pull Request on GitHub. Once CI tests validate the JSON rules, it will be merged into the canonical edition!
                </p>
              </div>

              {/* PR Info Box */}
              <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-mono space-y-2 text-left">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Pull Request URL:</span>
                  <button
                    type="button"
                    onClick={copyPrUrl}
                    className="text-emerald-400 hover:text-emerald-300 inline-flex items-center space-x-1"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-indigo-300 break-all select-all">
                  {createdPrData.url}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Branch: <span className="text-slate-400">{branchName}</span></span>
                  <span>Target: <span className="text-slate-400">{targetFile}</span></span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 flex items-center justify-center space-x-3">
                <a
                  href={createdPrData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25"
                >
                  <span>View Pull Request on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Return to Reader
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
