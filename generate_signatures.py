#!/usr/bin/env python3
"""
generate_signatures.py

Generates cryptographic SHA-256 signatures for every source file inside data/.
Stores verification signatures in data_sigs/ so local contributors can verify
integrity and provenance of the source EPUB and extracted files without committing
any copyrighted book content.
"""

import hashlib
import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
DATA_DIR = REPO_ROOT / "data"
SIGS_DIR = REPO_ROOT / "data_sigs"
OUTPUT_CHECKSUMS = SIGS_DIR / "SHA256SUMS.txt"
OUTPUT_MANIFEST = SIGS_DIR / "data_manifest.json"

def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    SIGS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Collect all non-hidden, non-generated local cache files in data
    # Specifically include the downloaded epub, mimetype, META-INF, and EPUB files
    all_files = sorted(
        [
            p for p in DATA_DIR.rglob("*")
            if p.is_file() 
            and not p.name.startswith(".")
            and p.name != "local_page_index.json"
        ],
        key=lambda p: str(p.relative_to(REPO_ROOT))
    )

    print(f"Hashing {len(all_files)} files in {DATA_DIR}...")

    checksum_lines = []
    manifest_entries = []

    for filepath in all_files:
        rel_path = filepath.relative_to(REPO_ROOT)
        data_rel_path = filepath.relative_to(DATA_DIR)
        digest = sha256_file(filepath)
        size_bytes = filepath.stat().st_size

        checksum_lines.append(f"{digest}  {rel_path}")
        manifest_entries.append({
            "path": str(data_rel_path),
            "sha256": digest,
            "size_bytes": size_bytes
        })

    with open(OUTPUT_CHECKSUMS, "w", encoding="utf-8") as f:
        f.write("\n".join(checksum_lines) + "\n")

    with open(OUTPUT_MANIFEST, "w", encoding="utf-8") as f:
        json.dump({
            "total_files": len(manifest_entries),
            "generated_from": "data/",
            "files": manifest_entries
        }, f, indent=2)

    print(f"✅ Generated {OUTPUT_CHECKSUMS} and {OUTPUT_MANIFEST} with {len(all_files)} checksums.")

if __name__ == "__main__":
    main()
