import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '..');

describe('Zero-Copyright & GitIgnore Guardrails', () => {
  it('should ignore data/ source files in git status', () => {
    const gitStatus = execSync('git status --porcelain', {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });

    expect(gitStatus).not.toMatch(/\sdata\/finneganswake/);
    expect(gitStatus).not.toMatch(/\sdata\/EPUB\//);
    expect(gitStatus).not.toMatch(/\sdata\/META-INF\//);
    expect(gitStatus).not.toMatch(/\sdata\/local_page_index\.json/);
  });

  it('should verify git check-ignore matches all source data files', () => {
    const filesToTest = [
      'data/finneganswake00joycuoft.epub',
      'data/EPUB/page_17.html',
      'data/local_page_index.json',
      'data/mimetype',
    ];

    for (const relPath of filesToTest) {
      const isIgnored = execSync(`git check-ignore ${relPath}`, {
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      }).trim();
      expect(isIgnored).toBe(relPath);
    }
  });

  it('should verify no annotation target_phrase exceeds 150 characters (Copyright safety check)', () => {
    const annotationsDir = path.join(REPO_ROOT, 'annotations');
    const jsonFiles: string[] = [];

    function findJson(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) findJson(full);
        else if (ent.name.endsWith('.json')) jsonFiles.push(full);
      }
    }

    findJson(annotationsDir);
    expect(jsonFiles.length).toBeGreaterThan(0);

    for (const file of jsonFiles) {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      for (const ann of data.annotations || []) {
        expect(ann.target_phrase.length).toBeLessThanOrEqual(150);
        expect(ann.target_phrase).not.toContain('\n');
      }
    }
  });
});
