import { WakeReader } from '@/components/WakeReader';

export const metadata = {
  title: "Interactive Scholarly Reader — WinnegansFake",
  description: "Read James Joyce's Finnegans Wake and Ulysses alongside crowdsourced scholarly annotations, 19 analytical registers, and client-side EPUB rendering.",
};

export default function ReaderPage() {
  return (
    <main className="flex-1 flex flex-col">
      <WakeReader />
    </main>
  );
}
