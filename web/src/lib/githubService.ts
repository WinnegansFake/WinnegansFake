/**
 * web/src/lib/githubService.ts
 *
 * Re-exports GitHub Pull Request submission service from @winnegans/core
 * for backwards compatibility.
 */

export {
  UPSTREAM_OWNER,
  UPSTREAM_REPO,
  UPSTREAM_BRANCH,
  type GithubUser,
  type PrSubmissionStep,
  type PrSubmissionStatus,
  type PrSubmissionOptions,
  type PrSubmissionResult,
  getSavedGithubToken,
  getSavedGithubUser,
  saveGithubToken,
  clearGithubToken,
  utf8ToBase64,
  base64ToUtf8,
  verifyGithubToken,
  generateDefaultPrMetadata,
  submitAnnotationPullRequest,
  getPageFilePath,
} from '@winnegans/core';
