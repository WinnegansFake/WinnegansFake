import fs from 'fs';
import path from 'path';
import { DissertationViewer } from '@/components/DissertationViewer';
import { DISSERTATION_NIGHT_MIND } from '@/lib/constants';

export const metadata = {
  title: "Dissertation: The Architecture of the Night Mind — WinnegansFake",
  description: "A polyphonic dissertation on the cosmology, philology, genetic manuscripts, and computational hermeneutics of James Joyce's Finnegans Wake.",
};

export default function DissertationPage() {
  const filePath = path.join(process.cwd(), 'public', 'dissertation.md');
  let content = '';

  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error('Failed to read dissertation.md at build time:', err);
    content = '# Error loading dissertation\n\nCould not load dissertation.md from public directory.';
  }

  return <DissertationViewer content={content} dissertation={DISSERTATION_NIGHT_MIND} />;
}
