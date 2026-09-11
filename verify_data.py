#!/usr/bin/env python3
"""
verify_data.py

Verifies local data/ files against data_sigs/SHA256SUMS.txt.
"""

import hashlib
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
CHECKSUMS_FILE = REPO_ROOT / "data_sigs" / "SHA256SUMS.txt"

def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    if not CHECKSUMS_FILE.exists():
        print(f"ERROR: Checksums file {CHECKSUMS_FILE} not found.", file=sys.stderr)
        sys.exit(1)

    with open(CHECKSUMS_FILE, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    print(f"Verifying {len(lines)} files against data_sigs...")

    mismatches = []
    missing = []

    for line in lines:
        expected_hash, rel_path = line.split("  ", 1)
        full_path = REPO_ROOT / rel_path

        if not full_path.exists():
            missing.append(rel_path)
            continue

        actual_hash = sha256_file(full_path)
        if actual_hash != expected_hash:
            mismatches.append((rel_path, expected_hash, actual_hash))

    if missing:
        print(f"\n❌ {len(missing)} file(s) missing from data/:")
        for m in missing[:10]:
            print(f"   - {m}")
        if len(missing) > 10:
            print(f"   ... and {len(missing) - 10} more.")

    if mismatches:
        print(f"\n❌ {len(mismatches)} hash mismatch(es):")
        for p, exp, act in mismatches:
            print(f"   - {p}: expected {exp[:12]}..., got {act[:12]}...")

    if not missing and not mismatches:
        print("✅ All local data files verified and match SHA-256 signatures perfectly!")
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
