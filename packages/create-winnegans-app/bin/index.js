#!/usr/bin/env node

/**
 * create-winnegans-app
 *
 * Scaffolds a complete crowdsourced, zero-copyright literary annotation platform
 * for any arbitrary literary library (e.g. Dante, Proust, Homer, Shakespeare, Melville).
 */

import fs from 'fs';
import path from 'path';

function printBanner() {
  console.log('\x1b[32m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
  console.log('\x1b[1m\x1b[36m%s\x1b[0m', ' 📚 create-winnegans-app');
  console.log('\x1b[90m%s\x1b[0m', ' Zero-Copyright Literary Annotation & Reader Platform Scaffolder');
  console.log('\x1b[32m%s\x1b[0m', '════════════════════════════════════════════════════════════════');
}

function parseArgs() {
  const args = process.argv.slice(2);
  let targetDir = '';
  let workId = 'divine-comedy';
  let title = 'La Divina Commedia';
  let author = 'Dante Alighieri';
  let divisionType = 'canto';
  let totalPages = 100;
  let defaultEpubUrl = 'https://archive.org/download/ladivinacommedia00dant/ladivinacommedia00dant.epub';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--work-id' && args[i + 1]) {
      workId = args[++i];
    } else if (arg === '--title' && args[i + 1]) {
      title = args[++i];
    } else if (arg === '--author' && args[i + 1]) {
      author = args[++i];
    } else if (arg === '--division-type' && args[i + 1]) {
      divisionType = args[++i];
    } else if (arg === '--pages' && args[i + 1]) {
      totalPages = parseInt(args[++i], 10) || 100;
    } else if (arg === '--epub-url' && args[i + 1]) {
      defaultEpubUrl = args[++i];
    } else if (!targetDir && !arg.startsWith('-')) {
      targetDir = arg;
    }
  }

  return {
    targetDir: targetDir || 'my-literary-library',
    workId,
    title,
    author,
    divisionType,
    totalPages,
    defaultEpubUrl,
  };
}

async function main() {
  printBanner();
  const config = parseArgs();
  const destDir = path.resolve(process.cwd(), config.targetDir);

  console.log(`\nCreating new annotation platform in \x1b[1m${destDir}\x1b[0m...\n`);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 1. package.json
  const pkgJson = {
    name: path.basename(destDir),
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      validate: 'node ./validate.js',
      test: 'vitest run',
    },
    dependencies: {
      '@winnegans/core': '^0.1.0',
      '@winnegans/epub-reader': '^0.1.0',
      '@winnegans/theme': '^0.1.0',
      '@winnegans/validator': '^0.1.0',
      '@winnegans/react': '^0.1.0',
    },
  };
  fs.writeFileSync(path.join(destDir, 'package.json'), JSON.stringify(pkgJson, null, 2) + '\n');
  console.log('  \x1b[32m✓\x1b[0m Created package.json');

  // 2. .gitignore (guaranteeing zero-copyright)
  const gitignoreContent = `# Zero-copyright enforcement
data/*.epub
data/*.html
data/*.txt
data/extracted/
data/local_page_index.json

# Dependencies and build outputs
node_modules/
dist/
.next/
.turbo/
*.log
.DS_Store
`;
  fs.writeFileSync(path.join(destDir, '.gitignore'), gitignoreContent);
  console.log('  \x1b[32m✓\x1b[0m Created .gitignore (strictly safeguarding zero-copyright)');

  // 3. AGENTS.md
  const agentsMdContent = `# AGENTS.md — Contributor & Agent Guide

This repository contains crowdsourced digital humanities annotations for **${config.title}** by **${config.author}**.

---

## ⚖️ Zero-Copyright Architecture & Rules

- **No copyrighted book text may ever be committed to git.**
- Source EPUB files and extracted HTML chapters must remain strictly local under \`data/\` and must always remain gitignored.
- Annotations are stored purely as metadata glosses mapped to standard coordinates in \`annotations/${config.workId}/\`.
- Target lemma phrases must remain strictly below 150 characters.

---

## 🛠️ Verification & Testing

Before committing changes:
\`\`\`bash
# Validate JSON schema and line coordinates
node validate.js
\`\`\`
`;
  fs.writeFileSync(path.join(destDir, 'AGENTS.md'), agentsMdContent);
  console.log('  \x1b[32m✓\x1b[0m Created AGENTS.md');

  // 4. validate.js
  const validateJsContent = `import { AnnotationValidator } from '@winnegans/validator';
import path from 'path';

const validator = new AnnotationValidator({
  maxTargetPhraseLength: 150,
});

const issuesMap = validator.validateDirectory(path.resolve('./annotations'));
if (issuesMap.size > 0) {
  console.error('Validation failed! Found issues in:', Array.from(issuesMap.keys()));
  process.exit(1);
} else {
  console.log('✅ All annotation files passed verification!');
}
`;
  fs.writeFileSync(path.join(destDir, 'validate.js'), validateJsContent);
  console.log('  \x1b[32m✓\x1b[0m Created validate.js');

  // 5. Metadata work definition
  const metaDir = path.join(destDir, 'metadata');
  fs.mkdirSync(metaDir, { recursive: true });

  const metadataJson = {
    id: config.workId,
    title: config.title,
    author: config.author,
    divisionType: config.divisionType,
    totalPages: config.totalPages,
    defaultEpubUrl: config.defaultEpubUrl,
    registers: [
      {
        id: 'etymological-linguistic',
        name: 'Etymology & Linguistic Gloss',
        category: 'Linguistic',
        description: 'Word origins, archaic idioms, and multilingual etymologies.',
        color: 'emerald',
      },
      {
        id: 'topographical-historical',
        name: 'Topography & Historical Realia',
        category: 'Historical',
        description: 'Geographical landmarks, historical figures, and real-world places.',
        color: 'amber',
      },
      {
        id: 'theological-mythological',
        name: 'Theology & Mythological Motifs',
        category: 'Hermetic & Theological',
        description: 'Biblical, classical, and cultural allegories.',
        color: 'purple',
      },
    ],
  };
  fs.writeFileSync(path.join(destDir, 'metadata', `${config.workId}.json`), JSON.stringify(metadataJson, null, 2) + '\n');
  console.log(`  \x1b[32m✓\x1b[0m Created metadata/${config.workId}.json`);

  // 6. Starter annotation file
  const annDir = path.join(destDir, 'annotations', config.workId, `${config.divisionType}_01`);
  fs.mkdirSync(annDir, { recursive: true });

  const sampleAnnotation = {
    schema_version: '1.0.0',
    work: config.workId,
    book: 1,
    chapter: 1,
    page_number: 1,
    annotations: [
      {
        id: '001.01-01',
        line_number: 1,
        target_phrase: 'opening lemma phrase',
        annotation_text: 'Scholarly gloss explaining the historical and thematic allusions of this opening line.',
        categories: ['topographical-historical'],
        sources: ['Scholarly Commentary Vol 1.'],
        contributors: ['community-scholar'],
      },
    ],
  };
  fs.writeFileSync(path.join(annDir, 'page_001.json'), JSON.stringify(sampleAnnotation, null, 2) + '\n');
  console.log(`  \x1b[32m✓\x1b[0m Created annotations/${config.workId}/${config.divisionType}_01/page_001.json`);

  // 7. Starter dissertation
  const dissDir = path.join(destDir, 'dissertations', 'introductory-monograph');
  fs.mkdirSync(dissDir, { recursive: true });

  const dissMarkdown = `# The Critical Topography of ${config.title}

*By Dr. Scholarly Researcher (2026)*  
*Field: Comparative Literature & Digital Humanities*

---

## Abstract
This inaugural monograph explores the hermeneutic architecture, allegorical structures, and digital humanities annotation framework for ${config.title}.

## Chapter 1: Structural Hermeneutics
Every page coordinate in our zero-copyright system maps line-by-line annotations without duplicating copyrighted prose.

---

### Citation (BibTeX)
\`\`\`bibtex
@phdthesis{researcher2026topography,
  author = {Researcher, Scholarly},
  title = {The Critical Topography of ${config.title}},
  school = {Department of Digital Humanities},
  year = {2026}
}
\`\`\`
`;
  fs.writeFileSync(path.join(dissDir, 'dissertation.md'), dissMarkdown);
  console.log('  \x1b[32m✓\x1b[0m Created dissertations/introductory-monograph/dissertation.md');

  // 8. README.md
  const readmeContent = `# ${config.title} — Digital Humanities Annotation Platform

An open-source, zero-copyright digital apparatus and polyphonic scholarly gloss for **${config.title}** by **${config.author}**.

Powered by the **Winnegans SDK** (\`@winnegans/core\`, \`@winnegans/epub-reader\`, \`@winnegans/theme\`, \`@winnegans/validator\`, and \`@winnegans/react\`).

---

## 🚀 Getting Started

1. **Install Dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Verify Annotations:**
   \`\`\`bash
   pnpm validate
   \`\`\`

3. **Start Reading:**
   Import \`<UniversalReader />\` from \`@winnegans/react\` in your Next.js or Vite frontend!
`;
  fs.writeFileSync(path.join(destDir, 'README.md'), readmeContent);
  console.log('  \x1b[32m✓\x1b[0m Created README.md');

  console.log('\n\x1b[32m✨ Success! Project initialized.\x1b[0m');
  console.log(`\nNext steps:\n  cd ${config.targetDir}\n  pnpm install\n  pnpm validate\n`);
}

main().catch((err) => {
  console.error('\x1b[31mError:\x1b[0m', err);
  process.exit(1);
});
