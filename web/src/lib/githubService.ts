/**
 * GitHub API Service for WinnegansFake In-Browser Pull Request Submission
 *
 * Handles:
 * 1. Personal Access Token (PAT) storage & validation
 * 2. User profile & scope verification via GET /user
 * 3. Fork creation & branch generation
 * 4. In-browser page JSON committing via GitHub Contents API
 * 5. Pull Request creation against tekromancy/WinnegansFake:main
 */

import { AnnotationItem, PageAnnotationsData } from '@/types/annotations';
import { getBookAndChapterInfo, GITHUB_REPO_URL } from './constants';

export const UPSTREAM_OWNER = 'tekromancy';
export const UPSTREAM_REPO = 'WinnegansFake';
export const UPSTREAM_BRANCH = 'main';

const TOKEN_STORAGE_KEY = 'wf_github_token';
const USER_STORAGE_KEY = 'wf_github_user';

export interface GithubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  scopes: string[];
}

export type PrSubmissionStep =
  | 'idle'
  | 'verifying_auth'
  | 'checking_repo'
  | 'creating_branch'
  | 'updating_file'
  | 'opening_pr'
  | 'success'
  | 'error';

export interface PrSubmissionStatus {
  step: PrSubmissionStep;
  message: string;
  details?: string;
  prUrl?: string;
  prNumber?: number;
  branchName?: string;
}

export interface PrSubmissionOptions {
  token: string;
  pageNumber: number;
  annotation: AnnotationItem;
  branchName?: string;
  prTitle?: string;
  prBody?: string;
  commitMessage?: string;
  onProgress?: (status: PrSubmissionStatus) => void;
}

export interface PrSubmissionResult {
  success: boolean;
  prUrl: string;
  prNumber: number;
  branchName: string;
  targetFile: string;
}

/**
 * Retrieve saved GitHub token from localStorage or sessionStorage
 */
export function getSavedGithubToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
    null
  );
}

/**
 * Retrieve cached user profile
 */
export function getSavedGithubUser(): GithubUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Save GitHub token
 */
export function saveGithubToken(token: string, remember: boolean = true, user?: GithubUser): void {
  if (typeof window === 'undefined') return;
  const clean = token.trim();
  if (remember) {
    localStorage.setItem(TOKEN_STORAGE_KEY, clean);
    if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  } else {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, clean);
    if (user) sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

/**
 * Remove saved GitHub token & user
 */
export function clearGithubToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Unicode-safe Base64 encoding & decoding
 */
export function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

export function base64ToUtf8(str: string): string {
  return decodeURIComponent(
    atob(str.replace(/\s/g, ''))
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Verify GitHub token against GET /user
 */
export async function verifyGithubToken(token: string): Promise<GithubUser> {
  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('Please enter a GitHub Personal Access Token.');
  }

  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Invalid or expired GitHub token. Please verify your token and try again.');
    }
    if (res.status === 403) {
      throw new Error('GitHub API rate limit exceeded or access forbidden. Check token permissions.');
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub error (status ${res.status})`);
  }

  const scopesHeader = res.headers.get('x-oauth-scopes') || '';
  const scopes = scopesHeader
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const data = await res.json();
  const user: GithubUser = {
    login: data.login,
    id: data.id,
    name: data.name,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    scopes,
  };

  return user;
}

/**
 * Determine repository path for a given page
 */
export function getPageFilePath(page: number): string {
  const { book, chapter } = getBookAndChapterInfo(page);
  const padPage = String(page).padStart(3, '0');
  return `annotations/book_${book}/chapter_${chapter}/page_${padPage}.json`;
}

/**
 * Construct default branch name, PR title, and PR body
 */
export function generateDefaultPrMetadata(page: number, annotation: AnnotationItem) {
  const padPage = String(page).padStart(3, '0');
  const padLine = String(annotation.line_number).padStart(2, '0');
  const timestamp = Date.now().toString(36).substring(4);
  const branchName = `add-note-${padPage}-${padLine}-${timestamp}`;

  const shortPhrase =
    annotation.target_phrase.length > 35
      ? annotation.target_phrase.substring(0, 32) + '...'
      : annotation.target_phrase;

  const prTitle = `feat(annotation): add note for FW ${padPage}.${padLine} ("${shortPhrase}")`;

  const commitMessage = `feat(annotation): add gloss for FW ${padPage}.${padLine} (${annotation.id})`;

  const categories = annotation.categories?.length
    ? annotation.categories.map((c) => `\`${c}\``).join(', ')
    : 'None';

  const crossRefs = annotation.cross_references?.length
    ? annotation.cross_references.map((c) => `\`${c}\``).join(', ')
    : 'None';

  const sources = annotation.sources?.length
    ? annotation.sources.map((s) => `- ${s}`).join('\n')
    : '- Contributed via WinnegansFake Web Interface';

  const contributors = annotation.contributors?.length
    ? annotation.contributors.map((c) => `@${c.replace(/^@/, '')}`).join(', ')
    : 'Community Contributor';

  const prBody = `### 📖 WinnegansFake Scholarly Annotation Submission

**Page / Coordinate:** FW \`${padPage}.${padLine}\` (Annotation ID: \`${annotation.id}\`)  
**Target Lemma / Phrase:** \`${annotation.target_phrase}\`  
**Contributors:** ${contributors}  

---

#### 💡 Critical Gloss & Scholarly Commentary
> ${annotation.annotation_text.replace(/\n/g, '\n> ')}

- **Analytical Categories & Tags:** ${categories}
- **Cross-References:** ${crossRefs}

#### 📚 Academic Citations & Sources
${sources}

---

*Zero-Copyright Compliance Statement:*  
This annotation was contributed via the WinnegansFake in-browser interface and is distributed under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** license. It contains no copyrighted text exceeding fair-use line coordination.`;

  return {
    branchName,
    prTitle,
    commitMessage,
    prBody,
  };
}

/**
 * Execute end-to-end Pull Request submission via GitHub REST API
 */
export async function submitAnnotationPullRequest(
  options: PrSubmissionOptions
): Promise<PrSubmissionResult> {
  const {
    token,
    pageNumber,
    annotation,
    onProgress = () => {},
  } = options;

  const cleanToken = token.trim();
  const filePath = getPageFilePath(pageNumber);
  const meta = generateDefaultPrMetadata(pageNumber, annotation);

  const branchName = options.branchName?.trim() || meta.branchName;
  const prTitle = options.prTitle?.trim() || meta.prTitle;
  const prBody = options.prBody?.trim() || meta.prBody;
  const commitMessage = options.commitMessage?.trim() || meta.commitMessage;

  const headers = {
    Authorization: `Bearer ${cleanToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };

  // Step 1: Verify user authentication
  onProgress({
    step: 'verifying_auth',
    message: 'Verifying GitHub credentials and token scopes...',
  });

  let user: GithubUser;
  try {
    user = await verifyGithubToken(cleanToken);
  } catch (err: any) {
    onProgress({
      step: 'error',
      message: 'Authentication failed',
      details: err.message,
    });
    throw err;
  }

  // Step 2: Determine working repository (upstream vs fork)
  onProgress({
    step: 'checking_repo',
    message: `Checking permissions for @${user.login} on ${UPSTREAM_OWNER}/${UPSTREAM_REPO}...`,
  });

  let workingOwner = UPSTREAM_OWNER;
  let isFork = false;

  try {
    const upstreamRepoRes = await fetch(
      `https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}`,
      { headers }
    );

    if (upstreamRepoRes.ok) {
      const repoData = await upstreamRepoRes.json();
      const hasPush = Boolean(repoData.permissions?.push);
      if (!hasPush && user.login.toLowerCase() !== UPSTREAM_OWNER.toLowerCase()) {
        isFork = true;
        workingOwner = user.login;
      }
    } else {
      isFork = true;
      workingOwner = user.login;
    }
  } catch {
    isFork = true;
    workingOwner = user.login;
  }

  // If using a fork, ensure user has forked the repository
  if (isFork) {
    onProgress({
      step: 'checking_repo',
      message: `Verifying personal fork at ${workingOwner}/${UPSTREAM_REPO}...`,
    });

    const forkCheckRes = await fetch(
      `https://api.github.com/repos/${workingOwner}/${UPSTREAM_REPO}`,
      { headers }
    );

    if (forkCheckRes.status === 404) {
      onProgress({
        step: 'checking_repo',
        message: `Creating personal fork of ${UPSTREAM_OWNER}/${UPSTREAM_REPO}...`,
      });

      const forkCreateRes = await fetch(
        `https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/forks`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ default_branch_only: true }),
        }
      );

      if (!forkCreateRes.ok && forkCreateRes.status !== 202) {
        const forkErr = await forkCreateRes.json().catch(() => ({}));
        throw new Error(
          forkErr.message || `Failed to create fork: ${forkCreateRes.statusText}`
        );
      }

      // Allow GitHub a moment to provision the new fork repository
      let attempts = 0;
      let forkReady = false;
      while (attempts < 6 && !forkReady) {
        await new Promise((r) => setTimeout(r, 1500));
        attempts++;
        const poll = await fetch(
          `https://api.github.com/repos/${workingOwner}/${UPSTREAM_REPO}`,
          { headers }
        );
        if (poll.ok) {
          forkReady = true;
          break;
        }
      }
    }
  }

  // Step 3: Get base branch commit SHA from upstream
  onProgress({
    step: 'creating_branch',
    message: `Fetching latest commit SHA from ${UPSTREAM_OWNER}/${UPSTREAM_REPO}:${UPSTREAM_BRANCH}...`,
  });

  const baseRefRes = await fetch(
    `https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/git/ref/heads/${UPSTREAM_BRANCH}`,
    { headers }
  );

  if (!baseRefRes.ok) {
    const errData = await baseRefRes.json().catch(() => ({}));
    throw new Error(
      errData.message || `Could not find upstream branch '${UPSTREAM_BRANCH}'.`
    );
  }

  const baseRefData = await baseRefRes.json();
  const baseSha = baseRefData.object.sha;

  // Create feature branch on working repository
  onProgress({
    step: 'creating_branch',
    message: `Creating branch '${branchName}' on ${workingOwner}/${UPSTREAM_REPO}...`,
  });

  const createRefRes = await fetch(
    `https://api.github.com/repos/${workingOwner}/${UPSTREAM_REPO}/git/refs`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: baseSha,
      }),
    }
  );

  if (!createRefRes.ok) {
    const refErr = await createRefRes.json().catch(() => ({}));
    throw new Error(
      refErr.message || `Failed to create branch '${branchName}'.`
    );
  }

  // Step 4: Fetch existing file, merge annotation, and commit
  onProgress({
    step: 'updating_file',
    message: `Reading ${filePath} on branch '${branchName}'...`,
  });

  let existingSha: string | undefined = undefined;
  let pageData: PageAnnotationsData;

  const fileGetRes = await fetch(
    `https://api.github.com/repos/${workingOwner}/${UPSTREAM_REPO}/contents/${filePath}?ref=${branchName}`,
    { headers }
  );

  const { book, chapter } = getBookAndChapterInfo(pageNumber);

  if (fileGetRes.ok) {
    const fileData = await fileGetRes.json();
    existingSha = fileData.sha;
    try {
      const decoded = base64ToUtf8(fileData.content || '');
      pageData = JSON.parse(decoded);
    } catch {
      pageData = {
        schema_version: '1.0.0',
        book,
        chapter,
        page_number: pageNumber,
        annotations: [],
      };
    }
  } else {
    pageData = {
      schema_version: '1.0.0',
      book,
      chapter,
      page_number: pageNumber,
      annotations: [],
    };
  }

  // Merge annotation into pageData
  const currentAnns = Array.isArray(pageData.annotations) ? [...pageData.annotations] : [];
  const existingIdx = currentAnns.findIndex((a) => a.id === annotation.id);

  if (existingIdx >= 0) {
    currentAnns[existingIdx] = annotation;
  } else {
    currentAnns.push(annotation);
  }

  currentAnns.sort((a, b) => a.line_number - b.line_number);

  pageData.annotations = currentAnns;
  const newContentJson = JSON.stringify(pageData, null, 2) + '\n';
  const base64Content = utf8ToBase64(newContentJson);

  onProgress({
    step: 'updating_file',
    message: `Committing changes to ${filePath} on '${branchName}'...`,
  });

  const commitPayload: Record<string, any> = {
    message: commitMessage,
    content: base64Content,
    branch: branchName,
  };
  if (existingSha) {
    commitPayload.sha = existingSha;
  }

  const commitRes = await fetch(
    `https://api.github.com/repos/${workingOwner}/${UPSTREAM_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitPayload),
    }
  );

  if (!commitRes.ok) {
    const commitErr = await commitRes.json().catch(() => ({}));
    throw new Error(
      commitErr.message || `Failed to commit file to ${filePath}.`
    );
  }

  // Step 5: Open Pull Request against upstream
  onProgress({
    step: 'opening_pr',
    message: `Opening Pull Request on ${UPSTREAM_OWNER}/${UPSTREAM_REPO}...`,
  });

  const headRef = isFork ? `${workingOwner}:${branchName}` : branchName;

  const prRes = await fetch(
    `https://api.github.com/repos/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/pulls`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: prTitle,
        head: headRef,
        base: UPSTREAM_BRANCH,
        body: prBody,
        maintainer_can_modify: true,
      }),
    }
  );

  if (!prRes.ok) {
    const prErr = await prRes.json().catch(() => ({}));
    throw new Error(
      prErr.message || `Failed to open Pull Request on ${UPSTREAM_OWNER}/${UPSTREAM_REPO}.`
    );
  }

  const prData = await prRes.json();

  onProgress({
    step: 'success',
    message: `Pull Request #${prData.number} successfully created!`,
    prUrl: prData.html_url,
    prNumber: prData.number,
    branchName,
  });

  return {
    success: true,
    prUrl: prData.html_url,
    prNumber: prData.number,
    branchName,
    targetFile: filePath,
  };
}
