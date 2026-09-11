import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '..');

describe('Monorepo & Package Resolution', () => {
  it('should have a valid pnpm-workspace.yaml at root', () => {
    const wsPath = path.join(REPO_ROOT, 'pnpm-workspace.yaml');
    expect(fs.existsSync(wsPath)).toBe(true);
    const content = fs.readFileSync(wsPath, 'utf-8');
    expect(content).toContain('packages/*');
    expect(content).toContain('web');
  });

  it('should not have duplicate pnpm-workspace.yaml in subdirectories', () => {
    const webWsPath = path.join(REPO_ROOT, 'web', 'pnpm-workspace.yaml');
    expect(fs.existsSync(webWsPath)).toBe(false);
  });

  it('should have valid package dependencies linking @winnegans/epub-reader in web', () => {
    const webPkgPath = path.join(REPO_ROOT, 'web', 'package.json');
    const webPkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf-8'));
    const dep = webPkg.dependencies['@winnegans/epub-reader'];
    expect(dep).toBeDefined();
    expect(dep).toMatch(/^link:\.\.\/packages\/epub-reader$/);
  });

  it('should execute pnpm install cleanly inside web without workspace resolution errors', () => {
    const output = execSync('pnpm install', {
      cwd: path.join(REPO_ROOT, 'web'),
      encoding: 'utf-8',
    });
    expect(output).not.toContain('Failed to resolve dependency');
    expect(output).not.toContain('ERR_PNPM');
  });

  it('should verify @winnegans/epub-reader exports and build artifacts exist', () => {
    const readerDist = path.join(REPO_ROOT, 'packages', 'epub-reader', 'dist');
    expect(fs.existsSync(path.join(readerDist, 'index.js'))).toBe(true);
    expect(fs.existsSync(path.join(readerDist, 'index.mjs'))).toBe(true);
    expect(fs.existsSync(path.join(readerDist, 'index.d.ts'))).toBe(true);
  });
});
