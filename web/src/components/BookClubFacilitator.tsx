'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Download,
  Share2,
  HelpCircle,
  Volume2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface SeminarPreset {
  id: string;
  work: 'finneganswake' | 'ulysses';
  title: string;
  subtitle: string;
  pages: { start: number; end: number };
  theme: string;
  situation: string;
  wordsToUnpack: { word: string; gloss: string }[];
  mythologicalParallels: string;
  acousticAdvice: string;
  philosophicalQuestion: string;
}

export const SEMINAR_PRESETS: SeminarPreset[] = [
  {
    id: 'fw-fall',
    work: 'finneganswake',
    title: 'The Primordial Fall & The Wake',
    subtitle: 'Book I Chapter 1 (FW pp. 3–15)',
    pages: { start: 3, end: 15 },
    theme: 'Cosmic beginnings, original sin, Dublin geography, the 100-letter thunder',
    situation:
      'Tim Finnegan falls from his ladder; the giant Finn MacCool / HCE lies buried in the Dublin landscape from Howth Head to Castleknock while mourners hold a noisy wake over his corpse.',
    wordsToUnpack: [
      { word: 'riverrun', gloss: 'Circular ricorso; the River Liffey flowing through time; resumes page 628.' },
      { word: 'bababadalgharaghtakamminarronnkonn...', gloss: '100-letter thunderclap uniting 10 world words for thunder (Viconian terror-event).' },
      { word: 'museyroom', gloss: 'Museum + tea-room + mushroom; the Wellington monument in Phoenix Park as battlefield.' },
    ],
    mythologicalParallels:
      'Vico’s Age of Gods initiated by divine thunder; the dismemberment of Osiris; Adam’s fall in Genesis; Humpty Dumpty falling from the cosmic wall.',
    acousticAdvice:
      'Read page 3 aloud in turns. Do not pause to decipher each word; let the Hiberno-English rhythm and musical cadence wash over the room.',
    philosophicalQuestion:
      'Why does Joyce open a modern encyclopedic book with a fall from a ladder? How does catastrophic failure function as the prerequisite for resurrection?',
  },
  {
    id: 'fw-hen',
    work: 'finneganswake',
    title: 'The Hen’s Midden Letter',
    subtitle: 'Book I Chapter 5 (FW pp. 104–125)',
    pages: { start: 104, end: 125 },
    theme: 'Textual archaeology, the Book of Kells, epistolary gossip, the origins of writing',
    situation:
      'Biddy the Hen (an avatar of ALP) scratches through a mound of household garbage (the midden heap) and unearths an orange-stained letter written in stain and tea-leaves.',
    wordsToUnpack: [
      { word: 'teatime', gloss: 'The ritual hour of Irish domestic gossip and the tea-stains on the sacred parchment.' },
      { word: 'Tunc page', gloss: 'Matthew 27:38 in the illuminated Book of Kells; the crucifixion manuscript as forensic evidence.' },
      { word: 'pappis', gloss: 'Papyrus + popes + pap (soft food) + Paris; the material fragility of human documentation.' },
    ],
    mythologicalParallels:
      'Isis searching the marshes of the Nile for Osiris’s fragments; Irish monastic scribes illuminating sacred gospels in the 8th century.',
    acousticAdvice:
      'Adopt the rapid, excited, conspiratorial tone of neighborhood gossip deciphering a confidential intercepted letter.',
    philosophicalQuestion:
      'If all great literature originates as garbage re-excavated from a historical dump, what does Joyce imply about the sanctity of the canon?',
  },
  {
    id: 'fw-alp',
    work: 'finneganswake',
    title: 'Anna Livia’s Twilight Wash',
    subtitle: 'Book I Chapter 8 (FW pp. 196–216)',
    pages: { start: 196, end: 216 },
    theme: 'Maternal forgiveness, river geography, twilight metamorphosis into tree and stone',
    situation:
      'Two washerwomen wash the dirty linen of HCE and ALP on opposite banks of the River Liffey. As darkness falls and the river widens, their voices fade and they turn into an elm tree and a stone.',
    wordsToUnpack: [
      { word: 'O tell me all about Anna Livia!', gloss: 'The opening pastoral invocation of the entire washerwomen dialogue.' },
      { word: 'Beside the rivering waters of, hitherandthithering waters of', gloss: 'The famous lyrical cadence recorded by Joyce in 1929.' },
      { word: 'stemning', gloss: 'Norwegian stemning (twilight mood) + English stemming (halting the river flow).' },
    ],
    mythologicalParallels:
      'Ovid’s Metamorphoses; over 1,000 global river names embedded in the prose; Giordano Bruno’s Shem-Elm and Shaun-Stone transformation.',
    acousticAdvice:
      'Play the historic 1929 recording of James Joyce reading pages 213–216 directly in the reader, then have the group mirror his singing lilt.',
    philosophicalQuestion:
      'How does gossip between working women at dusk become the universal cosmological carrier of historical memory?',
  },
  {
    id: 'fw-nightlessons',
    work: 'finneganswake',
    title: 'Dolph & Kev’s Sacred Geometry',
    subtitle: 'Book II Chapter 2 (FW pp. 260–308)',
    pages: { start: 260, end: 308 },
    theme: 'School homework, Euclidean geometry, sibling rivalry, anatomical mystery',
    situation:
      'The twin brothers Dolph (Shem) and Kev (Shaun) do their evening homework at the kitchen table. Dolph constructs a Euclidean diagram of intersecting circles on page 293 to reveal the mystery of their mother’s body; Kev is scandalized and punches him.',
    wordsToUnpack: [
      { word: 'A.L.P. triangle', gloss: 'The geometric diagram at page 293 constructing the equilateral triangle of maternal anatomy.' },
      { word: 'marginalia', gloss: 'Left column (Shem: cynical/somatic), Right column (Shaun: pedantic/academic), Footnotes (Issy).' },
      { word: 'hecitency', gloss: 'Hesitancy; Pigott’s misspelling that exposed the Parnell forgery; scholastic doubt.' },
    ],
    mythologicalParallels:
      'Pythagorean sacred geometry; Cain and Abel; Giordano Bruno’s coincidence of opposites between the intellectual rebel and the dogmatic conformist.',
    acousticAdvice:
      'Assign three different members to read simultaneously: one for Shem’s left marginalia, one for Shaun’s right marginalia, and one for Issy’s bottom footnotes.',
    philosophicalQuestion:
      'Why is geometry—the most abstract science of pure reason—revealed by Joyce to be an inquiry into the maternal body?',
  },
  {
    id: 'fw-dawn',
    work: 'finneganswake',
    title: 'The Final Monologue & The Ricorso',
    subtitle: 'Book IV (FW pp. 619–628)',
    pages: { start: 619, end: 628 },
    theme: 'Dying into the sea, morning light, maternal farewell, eternal return',
    situation:
      'Anna Livia Plurabelle, an old woman and dying river, flows past Dublin in the dawn light out into the Irish Sea. She accepts her dissolution and looks forward to being reborn as rain in the Wicklow hills.',
    wordsToUnpack: [
      { word: 'Soft morning, city!', gloss: 'The waking salute to Dublin as the long nightmare of history dissolves.' },
      { word: 'cold mad feary father', gloss: 'The vast, salt, terrifying Ocean into which the sweet river must surrender her identity.' },
      { word: 'A way a lone a last a loved a long the', gloss: 'The final incomplete sentence that reconnects without punctuation to "riverrun" on page 3.' },
    ],
    mythologicalParallels:
      'The Egyptian Book of the Dead (coming forth by day); the Vedic Sandhyas (dawn hymns); the Ouroboros serpent swallowing its own tail.',
    acousticAdvice:
      'Read slowly, quietly, and tenderly. Let the final ten words hang in the room, then immediately read the opening sentence of page 3.',
    philosophicalQuestion:
      'Is Anna Livia’s ending a tragedy of death or a triumph of renewal? How does the circular structure challenge Western ideas of progress and endings?',
  },
  {
    id: 'ulysses-telemachus',
    work: 'ulysses',
    title: 'Telemachus at the Martello Tower',
    subtitle: 'Ulysses Episode 1 (pp. 1–28)',
    pages: { start: 1, end: 28 },
    theme: 'Morning, usurpation, mother’s death, theological mockery, snotgreen sea',
    situation:
      '8:00 AM on June 16, 1904. Buck Mulligan mocks the Catholic mass atop the Martello Tower in Sandycove; Stephen Dedalus broods over his refusal to pray at his mother’s deathbed and feels evicted from his home.',
    wordsToUnpack: [
      { word: 'Introibo ad altare Dei', gloss: 'Opening of Latin Catholic mass; Mulligan parodying the priest with shaving bowl.' },
      { word: 'snotgreen sea', gloss: 'Homeric wine-dark sea transformed into Dublin somatic phlegm.' },
      { word: 'agenbite of inwit', gloss: 'Middle English for the remorse of conscience; Stephen’s guilt over his mother.' },
    ],
    mythologicalParallels:
      'Homer’s Odyssey Book 1: Telemachus in Ithaca dealing with the arrogant suitors usurping Odysseus’s house.',
    acousticAdvice:
      'Emphasize the contrast between Mulligan’s booming, theatrical baritone and Stephen’s quiet, bitter interior monologue.',
    philosophicalQuestion:
      'How does Stephen’s refusal to submit to the demands of church and state define the modern condition of spiritual exile?',
  },
  {
    id: 'ulysses-penelope',
    work: 'ulysses',
    title: 'Penelope: Molly Bloom’s Soliloquy',
    subtitle: 'Ulysses Episode 18 (pp. 700–732)',
    pages: { start: 700, end: 732 },
    theme: 'Stream of consciousness, nocturnal intimacy, somatic truth, universal affirmation',
    situation:
      '2:00 AM in the bedroom at 7 Eccles Street. Leopold Bloom sleeps upside-down at her feet; Molly Bloom lies awake reviewing her lovers, youth in Gibraltar, marriage, and saying Yes to life.',
    wordsToUnpack: [
      { word: 'Yes', gloss: 'The opening and closing word of the entire eight-sentence, unpunctuated monologue.' },
      { word: 'Gibraltar', gloss: 'Molly’s sun-drenched childhood; Moorish walls, rhododendrons, and youthful passion.' },
      { word: 'Howth Head', gloss: 'Where Leopold Bloom proposed and she fed him seedcake from her mouth.' },
    ],
    mythologicalParallels:
      'Penelope weaving and unweaving her web; the Earth Mother (Gea-Tellus) affirming existence.',
    acousticAdvice:
      'Read without pausing for breath at imaginary commas. Let the musical phrasing dictate the emotional tempo.',
    philosophicalQuestion:
      'Why did Joyce conclude this encyclopedic, cerebral novel with an unpunctuated affirmative monologue from a woman lying in bed?',
  },
];

export function BookClubFacilitator() {
  const [selectedPreset, setSelectedPreset] = useState<SeminarPreset>(SEMINAR_PRESETS[0]);
  const [copied, setCopied] = useState(false);

  const getFullMarkdown = () => {
    return `# Reading Seminar Plan: ${selectedPreset.title}
*${selectedPreset.subtitle}*
**Corpus**: ${selectedPreset.work === 'finneganswake' ? 'Finnegans Wake' : 'Ulysses'} (Pages ${selectedPreset.pages.start}–${selectedPreset.pages.end})

---

### 1. Narrative & Somatic Situation
${selectedPreset.situation}

### 2. Words to Unpack Aloud
${selectedPreset.wordsToUnpack.map((w) => `- **${w.word}**: ${w.gloss}`).join('\n')}

### 3. Mythological & Archetypal Undercurrents
${selectedPreset.mythologicalParallels}

### 4. Acoustic Performance Advice
${selectedPreset.acousticAdvice}

### 5. Seminar Discussion Question
> "${selectedPreset.philosophicalQuestion}"

---
*Generated by WinnegansFake Book Club Apparatus (https://winnegansfake.com/bookclub)*
`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getFullMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([getFullMarkdown()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seminar-plan-${selectedPreset.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seminar Facilitator Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Curated Discussion Prompts & Seminar Plans
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Select an assigned passage to instantly generate structured discussion questions, acoustic reading guides, and compound word breakdowns for your book club meeting.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Plan'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Chips */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
          Select Reading Milestone / Episode
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SEMINAR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`p-3 rounded-xl text-left border transition-all ${
                selectedPreset.id === preset.id
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-semibold mb-1">
                <span>{preset.work === 'finneganswake' ? 'Finnegans Wake' : 'Ulysses'}</span>
                <span>pp. {preset.pages.start}–{preset.pages.end}</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{preset.title}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{preset.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active Seminar Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Situation */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> 1. Narrative & Somatic Situation
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedPreset.situation}</p>
          </div>

          {/* 2. Compound Words to Unpack */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2. Portmanteau & Wordplay to Unpack Aloud
            </span>
            <div className="space-y-2">
              {selectedPreset.wordsToUnpack.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="font-mono font-bold text-amber-300 mr-2">{item.word}:</span>
                  <span className="text-slate-300">{item.gloss}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Mythological Parallels */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 3. Mythological & Cosmological Undercurrents
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedPreset.mythologicalParallels}</p>
          </div>

          {/* 4. Acoustic Performance */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> 4. Group Acoustic Reading Exercise
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedPreset.acousticAdvice}</p>
          </div>
        </div>

        {/* Big Seminar Discussion Prompt Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 to-purple-950/30 border border-amber-500/30 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> 5. The Big Discussion Question
            </span>
            <blockquote className="font-serif italic text-base sm:text-lg text-slate-200 leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
              &quot;{selectedPreset.philosophicalQuestion}&quot;
            </blockquote>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use this central question to initiate debate once the group has concluded reading the passage aloud.
            </p>
          </div>

          {/* Launch in Reader CTA */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Read Assigned Passage
            </span>
            <Link
              href={`/reader?work=${selectedPreset.work}&page=${selectedPreset.pages.start}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-lg shadow-amber-600/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Page {selectedPreset.pages.start} in Reader</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
