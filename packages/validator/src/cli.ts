#!/usr/bin/env node
/**
 * cli.ts
 * Command-line runner for @winnegans/validator.
 */

import path from 'path';
import fs from 'fs';
import { AnnotationValidator, ValidationIssue } from './validator.js';

function printHelp(): void {
  console.log(`
Usage: winnegans-validate [options]

Options:
  --path <dir|file>      Directory or file to validate (default: ./annotations)
  --schema <file>        Path to custom JSON Schema file
  --max-length <num>     Maximum characters for target_phrase (default: 150)
  --min-length <num>     Minimum characters for annotation_text (default: 10)
  -h, --help             Show this help message
`);
}

export function runCli(argv: string[] = process.argv): void {
  let targetPath = path.resolve('annotations');
  let schemaPath: string | undefined;
  let maxLength = 150;
  let minLength = 10;

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--path' && i + 1 < argv.length) {
      targetPath = path.resolve(argv[++i]);
    } else if (arg === '--schema' && i + 1 < argv.length) {
      schemaPath = path.resolve(argv[++i]);
    } else if (arg === '--max-length' && i + 1 < argv.length) {
      maxLength = parseInt(argv[++i], 10);
    } else if (arg === '--min-length' && i + 1 < argv.length) {
      minLength = parseInt(argv[++i], 10);
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      targetPath = path.resolve(arg);
    }
  }

  let customSchema: Record<string, unknown> | undefined;
  if (schemaPath) {
    if (!fs.existsSync(schemaPath)) {
      console.error(`ERROR: Schema file not found: ${schemaPath}`);
      process.exit(1);
    }
    customSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  }

  const validator = new AnnotationValidator({
    schema: customSchema,
    maxTargetPhraseLength: maxLength,
    minAnnotationTextLength: minLength,
  });

  if (!fs.existsSync(targetPath)) {
    console.error(`ERROR: Target path does not exist: ${targetPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(targetPath);
  let hasErrors = false;

  if (stat.isFile()) {
    console.log(`Validating single file: ${targetPath}`);
    const issues = validator.validateFile(targetPath);
    if (issues.length > 0) {
      hasErrors = true;
      console.error(`\n❌ Validation failed with ${issues.length} issue(s):`);
      for (const iss of issues) {
        console.error(`  - ${iss.message}`);
      }
    }
  } else {
    const files = validator.collectJsonFiles(targetPath);
    console.log(`Validating ${files.length} annotation file(s) in ${targetPath}...`);
    const results = validator.validateDirectory(targetPath);

    if (results.size > 0) {
      hasErrors = true;
      console.error(`\n❌ Validation failed across ${results.size} file(s):\n`);
      for (const [f, issues] of results) {
        console.error(`File: ${f}`);
        for (const iss of issues) {
          console.error(`  - ${iss.message}`);
        }
        console.error();
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('✅ Validation passed successfully!');
    process.exit(0);
  }
}

if (require.main === module || (typeof process !== 'undefined' && process.argv[1]?.endsWith('cli.js'))) {
  runCli();
}
