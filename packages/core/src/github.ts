/**
 * @winnegans/core - github.ts
 *
 * Zero-backend in-browser and programmatic GitHub Pull Request submission service.
 * Allows users and agents to submit annotation pull requests directly via GitHub REST API.
 */

import { AnnotationItem, PageAnnotationsData } from './types.js';
import { WorkDefinition, getWork, getPageFilePath, getBookAndChapterInfo } from './works.js';

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
  work?: WorkDefinition;
  upstreamOwner?: string;
  upstreamRepo?: string;
  upstreamBranch?: string;
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
 * Retrieve saved GitHub token from localStorage or sessionStorage in browser environments.
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
 * Retrieve cached user profile in browser environments.
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
 * Save GitHub token to storage.
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
 * Remove saved GitHub token & user from storage.
 */
export function clearGithubToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Unicode-safe Base64 encoding
 */
export function utf8ToBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Unicode-safe Base64 decoding
 */
export function base64ToUtf8(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf-8');
  }
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
    const errData = (await res.json().catch(() => ({}))) as Record<string, any>;
    throw new Error(errData.message || `GitHub error (status ${res.status})`);
  }

  const scopesHeader = res.headers.get('x-oauth-scopes') || '';
  const scopes = scopesHeader
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const data = (await res.json()) as Record<string, any>;
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
 * Construct default branch name, PR title, commit message, and PR body
 */
export function generateDefaultPrMetadata(
  page: number,
  annotation: AnnotationItem,
  work?: WorkDefinition
): {
  branchName: string;
  prTitle: string;
  commitMessage: string;
  prBody: string;
} {
  const shortTitle = work?.shortTitle || 'FW';
  const padPage = String(page).padStart(3, '0');
  const padLine = String(annotation.line_number).padStart(2, '0');
  const timestamp = Date.now().toString(36).substring(4);
  const branchName =
    work && work.id !== 'finnegans-wake'
      ? `add-note-${shortTitle.toLowerCase()}-${padPage}-${padLine}-${timestamp}`
      : `add-note-${padPage}-${padLine}-${timestamp}`;

  const shortPhrase =
    annotation.target_phrase.length > 35
      ? annotation.target_phrase.substring(0, 32) + '...'
      : annotation.target_phrase;

  const prTitle = `feat(annotation): add note for ${shortTitle} ${padPage}.${padLine} ("${shortPhrase}")`;

  const commitMessage = `feat(annotation): add gloss for ${shortTitle} ${padPage}.${padLine} (${annotation.id})`;

  const categories = annotation.categories?.length
    ? annotation.categories.map((c) => `\`${c}\``).join(', ')
    : 'None';

  const crossRefs = annotation.cross_references?.length
    ? annotation.cross_references.map((c) => `\`${c}\``).join(', ')
    : 'None';

  const sources = annotation.sources?.length
    ? annotation.sources.map((s) => `- ${s}`).join('\n')
    : '- Contributed via Web Interface';

  const contributors = annotation.contributors?.length
    ? annotation.contributors.map((c) => `@${c.replace(/^@/, '')}`).join(', ')
    : 'Community Contributor';

  const workName = work?.title || 'Finnegans Wake';

  const prBody = `### 📖 Scholarly Annotation Submission: ${workName}

**Page / Coordinate:** ${shortTitle} \`${padPage}.${padLine}\` (Annotation ID: \`${annotation.id}\`)  
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
This annotation was contributed via the in-browser crowdsourced interface and is distributed under the **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)** license. It contains no copyrighted text exceeding fair-use line coordination.`;

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
    work,
    onProgress = () => {},
  } = options;

  const upstreamOwner = options.upstreamOwner || UPSTREAM_OWNER;
  const upstreamRepo = options.upstreamRepo || UPSTREAM_REPO;
  const upstreamBranch = options.upstreamBranch || UPSTREAM_BRANCH;

  const cleanToken = token.trim();
  const filePath = getPageFilePath(pageNumber, work);
  const meta = generateDefaultPrMetadata(pageNumber, annotation, work);

  const branchName = options.branchName?.trim() || meta.branchName;
  const prTitle = options.prTitle?.trim() || meta.prTitle;
  const prBody = options.prBody?.trim() || meta.prBody;
  const commitMessage = options.commitMessage?.trim() || meta.commitMessage;

  const headers: Record<string, string> = {
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
    message: `Checking permissions for @${user.login} on ${upstreamOwner}/${upstreamRepo}...`,
  });

  let workingOwner = upstreamOwner;
  let isFork = false;

  try {
    const upstreamRepoRes = await fetch(
      `https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}`,
      { headers }
    );

    if (upstreamRepoRes.ok) {
      const repoData = (await upstreamRepoRes.json()) as Record<string, any>;
      const hasPush = Boolean(repoData.permissions?.push);
      if (!hasPush && user.login.toLowerCase() !== upstreamOwner.toLowerCase()) {
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
      message: `Verifying personal fork at ${workingOwner}/${upstreamRepo}...`,
    });

    const forkCheckRes = await fetch(
      `https://api.github.com/repos/${workingOwner}/${upstreamRepo}`,
      { headers }
    );

    if (forkCheckRes.status === 404) {
      onProgress({
        step: 'checking_repo',
        message: `Creating personal fork of ${upstreamOwner}/${upstreamRepo}...`,
      });

      const forkCreateRes = await fetch(
        `https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/forks`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ default_branch_only: true }),
        }
      );

      if (!forkCreateRes.ok && forkCreateRes.status !== 202) {
        const forkErr = (await forkCreateRes.json().catch(() => ({}))) as Record<string, any>;
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
          `https://api.github.com/repos/${workingOwner}/${upstreamRepo}`,
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
    message: `Fetching latest commit SHA from ${upstreamOwner}/${upstreamRepo}:${upstreamBranch}...`,
  });

  const baseRefRes = await fetch(
    `https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/git/ref/heads/${upstreamBranch}`,
    { headers }
  );

  if (!baseRefRes.ok) {
    const errData = (await baseRefRes.json().catch(() => ({}))) as Record<string, any>;
    throw new Error(
      errData.message || `Could not find upstream branch '${upstreamBranch}'.`
    );
  }

  const baseRefData = (await baseRefRes.json()) as Record<string, any>;
  const baseSha = baseRefData.object.sha;

  // Create feature branch on working repository
  onProgress({
    step: 'creating_branch',
    message: `Creating branch '${branchName}' on ${workingOwner}/${upstreamRepo}...`,
  });

  const createRefRes = await fetch(
    `https://api.github.com/repos/${workingOwner}/${upstreamRepo}/git/refs`,
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
    const refErr = (await createRefRes.json().catch(() => ({}))) as Record<string, any>;
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
    `https://api.github.com/repos/${workingOwner}/${upstreamRepo}/contents/${filePath}?ref=${branchName}`,
    { headers }
  );

  const currentWork = work || getWork('finnegans-wake');
  const info = getBookAndChapterInfo(pageNumber, currentWork.id);

  if (fileGetRes.ok) {
    const fileData = (await fileGetRes.json()) as Record<string, any>;
    existingSha = fileData.sha;
    try {
      const decoded = base64ToUtf8(fileData.content || '');
      pageData = JSON.parse(decoded);
    } catch {
      pageData = {
        schema_version: '1.0.0',
        work: currentWork.id,
        book: info.book,
        chapter: info.chapter,
        page_number: pageNumber,
        annotations: [],
      };
    }
  } else {
    pageData = {
      schema_version: '1.0.0',
      work: currentWork.id,
      book: info.book,
      chapter: info.chapter,
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
    `https://api.github.com/repos/${workingOwner}/${upstreamRepo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(commitPayload),
    }
  );

  if (!commitRes.ok) {
    const commitErr = (await commitRes.json().catch(() => ({}))) as Record<string, any>;
    throw new Error(
      commitErr.message || `Failed to commit file to ${filePath}.`
    );
  }

  // Step 5: Open Pull Request against upstream
  onProgress({
    step: 'opening_pr',
    message: `Opening Pull Request on ${upstreamOwner}/${upstreamRepo}...`,
  });

  const headRef = isFork ? `${workingOwner}:${branchName}` : branchName;

  const prRes = await fetch(
    `https://api.github.com/repos/${upstreamOwner}/${upstreamRepo}/pulls`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: prTitle,
        head: headRef,
        base: upstreamBranch,
        body: prBody,
        maintainer_can_modify: true,
      }),
    }
  );

  if (!prRes.ok) {
    const prErr = (await prRes.json().catch(() => ({}))) as Record<string, any>;
    throw new Error(
      prErr.message || `Failed to open Pull Request on ${upstreamOwner}/${upstreamRepo}.`
    );
  }

  const prData = (await prRes.json()) as Record<string, any>;

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
