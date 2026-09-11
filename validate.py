#!/usr/bin/env python3
"""
validate.py

Validation script for crowdsourced Finnegans Wake annotations.
Enforces:
  1. JSON validity & conformity to schemas/page-annotation.schema.json
  2. Structural & path integrity (book, chapter, page matching directory & filename)
  3. Strict zero-copyright safeguards (target phrases kept to short identification tokens,
     strict character length checks, forbidding reproduction of full sentences/paragraphs)
  4. Logical sequence and unique IDs across all annotation entries
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    import jsonschema
    from jsonschema import Draft202012Validator
except ImportError:
    print(
        "ERROR: 'jsonschema' is required. Run 'pip install jsonschema' or use GitHub Actions environment.",
        file=sys.stderr,
    )
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parent
DEFAULT_SCHEMA_PATH = REPO_ROOT / "schemas" / "page-annotation.schema.json"
ANNOTATIONS_DIR = REPO_ROOT / "annotations"

# Guardrail: Maximum characters permitted in target_phrase to prevent text leak
MAX_TARGET_PHRASE_LEN = 150
# Regex to detect page file name format: page_003.json
PAGE_FILE_PATTERN = re.compile(r"^page_(\d{3})\.json$")
DIR_BOOK_PATTERN = re.compile(r"^book_([1-4])$")
DIR_CHAPTER_PATTERN = re.compile(r"^chapter_([1-8])$")


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def validate_file(
    file_path: Path,
    validator: Draft202012Validator,
) -> list[str]:
    errors = []
    rel_path = file_path.relative_to(REPO_ROOT)

    # 1. Filename & Directory convention check
    parts = rel_path.parts
    if len(parts) != 4 or parts[0] != "annotations":
        errors.append(
            f"File path '{rel_path}' is invalid. Expected format: 'annotations/book_<B>/chapter_<C>/page_<PPP>.json'"
        )
        return errors

    book_match = DIR_BOOK_PATTERN.match(parts[1])
    chap_match = DIR_CHAPTER_PATTERN.match(parts[2])
    page_match = PAGE_FILE_PATTERN.match(parts[3])

    if not book_match:
        errors.append(
            f"Invalid book folder '{parts[1]}'. Expected 'book_1' through 'book_4'."
        )
    if not chap_match:
        errors.append(
            f"Invalid chapter folder '{parts[2]}'. Expected 'chapter_1' through 'chapter_8'."
        )
    if not page_match:
        errors.append(
            f"Invalid page filename '{parts[3]}'. Expected 3-digit zero-padded name like 'page_003.json'."
        )

    expected_book = int(book_match.group(1)) if book_match else None
    expected_chap = int(chap_match.group(1)) if chap_match else None
    expected_page = int(page_match.group(1)) if page_match else None

    # 2. JSON Parse and Schema Validation
    try:
        data = load_json(file_path)
    except json.JSONDecodeError as exc:
        return [f"Malformed JSON in '{rel_path}': {exc}"]

    schema_errors = sorted(validator.iter_errors(data), key=lambda e: e.path)
    for err in schema_errors:
        loc = " -> ".join([str(p) for p in err.path]) if err.path else "root"
        errors.append(f"Schema violation in '{rel_path}' at [{loc}]: {err.message}")

    # If schema failed at top level, skip semantic sub-checks
    if errors:
        return errors

    # 3. Path vs Content Coherence
    if expected_book is not None and data.get("book") != expected_book:
        errors.append(
            f"Mismatch in '{rel_path}': book folder is {expected_book} but JSON 'book' is {data.get('book')}."
        )
    if expected_chap is not None and data.get("chapter") != expected_chap:
        errors.append(
            f"Mismatch in '{rel_path}': chapter folder is {expected_chap} but JSON 'chapter' is {data.get('chapter')}."
        )
    if expected_page is not None and data.get("page_number") != expected_page:
        errors.append(
            f"Mismatch in '{rel_path}': file name implies page {expected_page} but JSON 'page_number' is {data.get('page_number')}."
        )

    # 4. Copyright Guardrails & Semantic Annotation Checks
    seen_ids = set()
    prev_line = 0

    for idx, ann in enumerate(data.get("annotations", [])):
        ann_id = ann.get("id", "")
        line_num = ann.get("line_number", 0)
        target = ann.get("target_phrase", "")

        # Uniqueness of ID within the page file
        if ann_id in seen_ids:
            errors.append(
                f"Duplicate annotation id '{ann_id}' in '{rel_path}' at index {idx}."
            )
        seen_ids.add(ann_id)

        # ID prefix consistency: ID should start with PPP.LL
        expected_id_prefix = f"{data.get('page_number'):03d}.{line_num:02d}"
        if not ann_id.startswith(expected_id_prefix):
            errors.append(
                f"Annotation id '{ann_id}' in '{rel_path}' does not start with expected page/line prefix '{expected_id_prefix}'."
            )

        # Non-decreasing line order check for readability & DB indexing
        if line_num < prev_line:
            errors.append(
                f"Annotations in '{rel_path}' should be in non-decreasing order of line_number (found line {line_num} after line {prev_line})."
            )
        prev_line = line_num

        # Strict target_phrase length safeguard to avoid pasting copyrighted chunks
        if len(target) > MAX_TARGET_PHRASE_LEN:
            errors.append(
                f"target_phrase in '{rel_path}' for ID '{ann_id}' exceeds maximum allowed length of {MAX_TARGET_PHRASE_LEN} chars. "
                "Do NOT store full sentences or book passages (U.S. copyright protection)."
            )

        # Guard against multiline blocks in target_phrase
        if "\n" in target or "\r" in target:
            errors.append(
                f"target_phrase in '{rel_path}' for ID '{ann_id}' contains newlines. "
                "Keep target_phrase to short single-line lemmas or anchor phrases."
            )

    return errors


def main():
    parser = argparse.ArgumentParser(
        description="Validate Finnegans Wake annotation JSON files."
    )
    parser.add_argument(
        "--schema",
        type=Path,
        default=DEFAULT_SCHEMA_PATH,
        help="Path to JSON Schema file.",
    )
    parser.add_argument(
        "--path",
        type=Path,
        default=ANNOTATIONS_DIR,
        help="Path to annotation directory or individual JSON file.",
    )
    args = parser.parse_args()

    if not args.schema.is_file():
        print(f"ERROR: Schema not found at {args.schema}", file=sys.stderr)
        sys.exit(1)

    schema_data = load_json(args.schema)
    validator_cls = jsonschema.validators.validator_for(schema_data)
    validator_cls.check_schema(schema_data)
    validator = validator_cls(schema_data)

    target_files = []
    if args.path.is_file():
        target_files.append(args.path)
    elif args.path.is_dir():
        target_files = sorted(args.path.glob("**/*.json"))
    else:
        print(f"ERROR: Target path does not exist: {args.path}", file=sys.stderr)
        sys.exit(1)

    if not target_files:
        print(f"No JSON files found to validate in '{args.path}'.")
        sys.exit(0)

    print(f"Validating {len(target_files)} annotation file(s)...")
    all_errors = {}
    for file_path in target_files:
        errs = validate_file(file_path, validator)
        if errs:
            all_errors[str(file_path.relative_to(REPO_ROOT))] = errs

    if all_errors:
        print(f"\n❌ Validation FAILED with errors in {len(all_errors)} file(s):\n")
        for fpath, errs in all_errors.items():
            print(f"  File: {fpath}")
            for e in errs:
                print(f"    - {e}")
            print()
        sys.exit(1)

    print(f"✅ All {len(target_files)} annotation file(s) passed validation successfully!")
    sys.exit(0)


if __name__ == "__main__":
    main()
