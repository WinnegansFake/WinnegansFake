import { AnnotationItem } from '@/types/annotations';

export type LineSegment =
  | { type: 'text'; text: string }
  | { type: 'annotated'; text: string; annotations: AnnotationItem[]; phrase: string };

/**
 * Splits a line of text into plain text and annotated phrase segments based on
 * annotations that target words or phrases in this line.
 */
export function segmentAnnotatedLine(
  text: string,
  annotations: AnnotationItem[]
): LineSegment[] {
  if (!text || !annotations || annotations.length === 0) {
    return [{ type: 'text', text: text || '' }];
  }

  // Group annotations by normalized target phrase
  const phraseMap = new Map<string, { phrase: string; annotations: AnnotationItem[] }>();
  for (const ann of annotations) {
    const p = ann.target_phrase?.trim();
    if (!p) continue;
    const key = p.toLowerCase();
    if (!phraseMap.has(key)) {
      phraseMap.set(key, { phrase: p, annotations: [] });
    }
    phraseMap.get(key)!.annotations.push(ann);
  }

  if (phraseMap.size === 0) {
    return [{ type: 'text', text }];
  }

  // Sort candidate phrases by length descending to match longer phrases before shorter substrings
  const phrases = Array.from(phraseMap.values()).sort(
    (a, b) => b.phrase.length - a.phrase.length
  );

  const occupied: [number, number][] = [];
  const matches: {
    start: number;
    end: number;
    text: string;
    phrase: string;
    annotations: AnnotationItem[];
  }[] = [];

  const lowerText = text.toLowerCase();

  for (const { phrase, annotations: phraseAnns } of phrases) {
    const lowerPhrase = phrase.toLowerCase();
    let searchFrom = 0;

    while (searchFrom < text.length) {
      const idx = lowerText.indexOf(lowerPhrase, searchFrom);
      if (idx === -1) break;

      const end = idx + lowerPhrase.length;
      searchFrom = end;

      // Check collision with already claimed ranges
      const collides = occupied.some(([s, e]) => Math.max(idx, s) < Math.min(end, e));
      if (!collides) {
        occupied.push([idx, end]);
        matches.push({
          start: idx,
          end,
          text: text.substring(idx, end),
          phrase,
          annotations: phraseAnns,
        });
      }
    }
  }

  // Sort matches by start position ascending
  matches.sort((a, b) => a.start - b.start);

  const segments: LineSegment[] = [];
  let cur = 0;
  for (const m of matches) {
    if (m.start > cur) {
      segments.push({ type: 'text', text: text.substring(cur, m.start) });
    }
    segments.push({
      type: 'annotated',
      text: m.text,
      phrase: m.phrase,
      annotations: m.annotations,
    });
    cur = m.end;
  }
  if (cur < text.length) {
    segments.push({ type: 'text', text: text.substring(cur) });
  }

  return segments;
}
