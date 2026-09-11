#!/usr/bin/env python3
"""
build_page_index.py

Parses the local EPUB spine in data/EPUB/ to map every page from 3 to 628.
Extracts lines, cleans up OCR anomalies, and builds a fast local lookup index.
Outputs data/local_page_index.json (which is gitignored!).
"""

import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET

REPO_ROOT = Path(__file__).resolve().parent
DATA_DIR = REPO_ROOT / "data"
EPUB_DIR = DATA_DIR / "EPUB"
OUTPUT_FILE = DATA_DIR / "local_page_index.json"

# Joyce Finnegans Wake book and chapter division ranges
def get_book_and_chapter(page: int) -> tuple[int, int]:
    # Book I (pp. 3 - 216)
    if 3 <= page <= 29:
        return 1, 1
    elif 30 <= page <= 47:
        return 1, 2
    elif 48 <= page <= 74:
        return 1, 3
    elif 75 <= page <= 103:
        return 1, 4
    elif 104 <= page <= 125:
        return 1, 5
    elif 126 <= page <= 168:
        return 1, 6
    elif 169 <= page <= 195:
        return 1, 7
    elif 196 <= page <= 216:
        return 1, 8
    # Book II (pp. 219 - 399)
    elif 217 <= page <= 259:
        return 2, 1
    elif 260 <= page <= 308:
        return 2, 2
    elif 309 <= page <= 382:
        return 2, 3
    elif 383 <= page <= 399:
        return 2, 4
    # Book III (pp. 403 - 590)
    elif 400 <= page <= 428:
        return 3, 1
    elif 429 <= page <= 473:
        return 3, 2
    elif 474 <= page <= 554:
        return 3, 3
    elif 555 <= page <= 590:
        return 3, 4
    # Book IV (pp. 593 - 628)
    else:
        return 4, 1

def clean_ocr_text(text: str, page_num: int) -> list[str]:
    """Clean raw OCR text and segment into lines with proper numbering."""
    # Unescape HTML entities
    text = text.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").replace("&quot;", '"')
    
    # Strip any leading page marker artifact on first page like "7 riverrun"
    if page_num == 3 and text.startswith("7 riverrun"):
        text = text[2:]
        
    # Remove trailing page number artifact like "erigenating from 4" -> "erigenating from"
    # or "628" at the end of page 628
    trailing_page_pat = re.compile(rf'\b{page_num}\s*$')
    text = trailing_page_pat.sub('', text).strip()

    # Normalization of whitespace
    words = text.split()
    if not words:
        return []

    # Format into lines of ~10-12 words (approx standard line length for FW editions, ~36 lines/page)
    # Standard Viking edition has approximately 36 lines per page (ranging 34-38).
    lines = []
    current_line = []
    current_len = 0
    target_line_len = 70  # target character length for reading flow

    for w in words:
        current_line.append(w)
        current_len += len(w) + 1
        if current_len >= target_line_len:
            lines.append(" ".join(current_line))
            current_line = []
            current_len = 0

    if current_line:
        lines.append(" ".join(current_line))

    return lines

def main():
    if not EPUB_DIR.exists():
        print(f"Directory {EPUB_DIR} not found. Run 'make -C data' first.")
        return

    tree = ET.parse(EPUB_DIR / "content.opf")
    root = tree.getroot()
    ns = {"opf": "http://www.idpf.org/2007/opf"}
    manifest = {item.get("id"): item.get("href") for item in root.findall(".//opf:item", ns)}
    spine = [manifest[itemref.get("idref")] for itemref in root.findall(".//opf:itemref", ns) if itemref.get("idref") in manifest]

    start_idx = spine.index("page_17.html")
    book_pages = []

    for href in spine[start_idx:]:
        path = EPUB_DIR / href
        try:
            with open(path, "r", encoding="utf-8") as f:
                t = f.read()
        except Exception:
            continue
        
        if len(t) < 300 or "accurate" in t and ("0.00%" in t or "9.00%" in t or "10.00%" in t):
            continue
        m = re.search(r"<p>(.*?)</p>", t, re.DOTALL)
        if not m:
            continue
        raw_text = m.group(1).strip()
        if len(raw_text) < 150:
            continue
        book_pages.append((href, raw_text))

    print(f"Found {len(book_pages)} raw text pages.")

    # Map sequence to pages 3 through 628
    pages_index = {}
    for idx, (href, raw_text) in enumerate(book_pages):
        page_num = idx + 3
        if page_num > 628:
            break
        book, chapter = get_book_and_chapter(page_num)
        lines = clean_ocr_text(raw_text, page_num)
        
        pages_index[page_num] = {
            "page": page_num,
            "book": book,
            "chapter": chapter,
            "source_file": href,
            "raw_text": raw_text,
            "lines": [{"line": i + 1, "text": l} for i, l in enumerate(lines)]
        }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(pages_index, f, indent=2)

    print(f"Generated {OUTPUT_FILE} with {len(pages_index)} pages (pp. 3 to {max(pages_index.keys())}).")

if __name__ == "__main__":
    main()
