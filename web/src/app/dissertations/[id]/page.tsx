import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { DissertationViewer } from '@/components/DissertationViewer';
import { getAllDissertations, getDissertation } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const dissertations = getAllDissertations();
  return dissertations.map((d) => ({
    id: d.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const dissertation = getDissertation(id);
  if (!dissertation) {
    return {
      title: 'Dissertation Not Found — WinnegansFake',
    };
  }

  return {
    title: `${dissertation.title} — WinnegansFake Dissertations`,
    description: dissertation.abstract || dissertation.subtitle,
  };
}

export default async function DissertationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const dissertation = getDissertation(id);

  if (!dissertation) {
    notFound();
  }

  const publicPath = path.join(process.cwd(), 'public', 'dissertations', id, 'dissertation.md');
  const repoPath = path.join(process.cwd(), '..', 'dissertations', id, 'dissertation.md');

  let content = '';
  if (fs.existsSync(publicPath)) {
    content = fs.readFileSync(publicPath, 'utf-8');
  } else if (fs.existsSync(repoPath)) {
    content = fs.readFileSync(repoPath, 'utf-8');
  } else {
    console.error(`Could not locate dissertation file for ${id}`);
    content = `# ${dissertation.title}\n\n*${dissertation.subtitle}*\n\n**Author:** ${dissertation.author}\n\n${dissertation.abstract}`;
  }

  return <DissertationViewer content={content} dissertation={dissertation} />;
}
