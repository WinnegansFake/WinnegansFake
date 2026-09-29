'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Zap,
  Volume2,
  BookOpen,
  ArrowRight,
  Globe,
  Sparkles,
  Layers,
  Info,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { getBasePath } from '@/lib/constants';

interface ThunderwordData {
  number: number;
  letters: number;
  page: number;
  line: number;
  word: string;
  age: string;
  book: string;
  theme: string;
  languages: { language: string; syllable: string; meaning: string }[];
  ipa: string;
  commentary: string;
}

const THUNDERWORDS: ThunderwordData[] = [
  {
    number: 1,
    letters: 101,
    page: 3,
    line: 15,
    word: 'bababadalgharaghtakamminarronnkonnbronntonnerronntuonnthunntrovarrhounawnskawntoohoohoordenenthurnuk!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 1',
    theme: 'The Primordial Fall: Adam in Eden, Lucifer from Heaven, Tim Finnegan from the Ladder, and the onset of Human Speech.',
    ipa: '/ˌbɑːbəbədælˌɡɑːrəxtəˌkɑːmɪnɑːrənkɒnˌbrɒntɒnˌɛərəntuːɒnˌθʌntroʊvɑːrˌhuːnɔːnskɔːntuːˌhuːhʊərdənɛnˌθɜːrnʊk/',
    languages: [
      { language: 'Hindi', syllable: 'badal / gharaghta', meaning: 'Cloud / Thundering roar' },
      { language: 'Japanese', syllable: 'kaminari', meaning: 'Thunder (雷)' },
      { language: 'Ancient Greek', syllable: 'bronte', meaning: 'Thunder (βροντή)' },
      { language: 'French', syllable: 'tonnerre', meaning: 'Thunder' },
      { language: 'Italian', syllable: 'tuono', meaning: 'Thunder' },
      { language: 'Old English / Norse', syllable: 'thunn / trovar', meaning: 'Thunder / Thor’s roar' },
      { language: 'Portuguese', syllable: 'trovão', meaning: 'Thunder' },
      { language: 'Swedish', syllable: 'tordön', meaning: 'Thunder peal' },
      { language: 'Irish / Gaelic', syllable: 'torann', meaning: 'Thunder sound' },
      { language: 'Romanian', syllable: 'tunet', meaning: 'Thunder' },
    ],
    commentary:
      'The opening thunderclap that shatters the silence of the dawn of civilization. In Vico’s New Science, primitive giants were terrorized by thunder into caves, where they founded the first human institutions: religion, marriage, and burial.',
  },
  {
    number: 2,
    letters: 100,
    page: 23,
    line: 5,
    word: 'perkodhuskurunbarggruauyagokgorlayorgromgremmitghundhurthrumathunaradidillifaititillibumalooraloorrumsklkk!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 1',
    theme: 'Construction of the City: The Enclosure of the Primordial Forest and the Erecting of Walls against Chaos.',
    ipa: '/ˌpɛərkɒdhʊskʊrʊnˌbɑːrɡruːˌaʊjæɡɒkˌɡɔːrlæjɔːrˌɡrɒmɡrɛmɪtˌɡʌndʊrˌθruːməθuːnˌærədɪdɪliːˌfeɪtɪtɪliːˌbuːməlʊərəˌluːrəmzklk/',
    languages: [
      { language: 'Albanian', syllable: 'perëndi', meaning: 'God / Supreme Divinity' },
      { language: 'Old Norse', syllable: 'thruma', meaning: 'Thunderclap' },
      { language: 'Turkish', syllable: 'gök gürültüsü', meaning: 'Roar of the sky' },
      { language: 'Armenian', syllable: 'gorgor', meaning: 'Rumbling sound' },
      { language: 'Gaelic', syllable: 'dillifaititilli', meaning: 'Dilly-dallying lightning' },
      { language: 'Russian', syllable: 'grom', meaning: 'Thunder (гром)' },
    ],
    commentary:
      'Echoes the building of the city walls of Dublin/Babel and the dread of divine intervention overturning human arrogance.',
  },
  {
    number: 3,
    letters: 100,
    page: 44,
    line: 20,
    word: 'klkkrafjjavalakkaranakkapanapanovannakannalankalakkakakkatuoustoustoustou!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 2',
    theme: 'The Encounter in Phoenix Park: Scandal, Cloacal Rumors, and the Humiliation of the Patriarch HCE.',
    ipa: '/klkˌkræfjæˌvæləkɑːrəˌnækəˌpænəpæˌnoʊvænəˌkænəlænˌkæləkəˌkækətuːuːstuːuːstuːuːstuː/',
    languages: [
      { language: 'Sanskrit', syllable: 'kala / kshana', meaning: 'Time / Destructive Moment' },
      { language: 'Pali', syllable: 'kapan', meaning: 'Miserable condition' },
      { language: 'Breton', syllable: 'karr', meaning: 'Chariot / Crash' },
      { language: 'Greek', syllable: 'kakon', meaning: 'Evil / Foul report' },
      { language: 'Cockney', syllable: 'kakatuoustoustou', meaning: 'Chattering cockatoos gossip' },
    ],
    commentary:
      'Synthesized with bird-calls and stuttering sounds representing the gossip and chatter of the three soldiers in the park watching HCE’s transgression.',
  },
  {
    number: 4,
    letters: 100,
    page: 90,
    line: 31,
    word: 'bladynghellagthorpe-boonavoore-plump-dun-der-blass-kavell-fann-att-flocc-an-off-flabbergasted-gush-gush-gush!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 4',
    theme: 'The Trial of Festy King: Legal Quibbling, Juridical Confusion, and Perjury in the Courtroom.',
    ipa: '/ˈbleɪdɪŋˌhɛləɡˌθɔːrpˌbuːnəˌvuːrˌplʌmpˌdʌndərˌblæsˌkævɛlˌfænætˌflɒkənˌɒfˌflæbərɡæstɪdˌɡʌʃˌɡʌʃˌɡʌʃ/',
    languages: [
      { language: 'Old English / Norse', syllable: 'thorpe', meaning: 'Village settlement' },
      { language: 'Dutch', syllable: 'donderbus', meaning: 'Blunderbuss / Thunder rifle' },
      { language: 'German', syllable: 'Donnerblitz', meaning: 'Thunder and lightning' },
      { language: 'Gaelic', syllable: 'bun a bhóthair', meaning: 'Bottom of the road' },
      { language: 'Irish Slang', syllable: 'flabbergasted gush', meaning: 'Overwhelmed speech' },
    ],
    commentary:
      'The law court degenerates into slapstick. The thunder marks the collapse of legalistic human justice under the weight of perjured testimony.',
  },
  {
    number: 5,
    letters: 100,
    page: 113,
    line: 9,
    word: 'thingcrooklyexineclacked-picall-illi-path-trunck-lum-pam-por-to-por-to-por-too-pun-tuck-al-uck-al-uck-al-uck!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 5',
    theme: 'The Hen Scratching the Letter: Biddy Doran unearthing the sacred midden letter in Boston, Mass.',
    ipa: '/θɪŋkˌkrʊkliːˌɛksɪnɪˌklæktˌpɪkɔːlˌɪliːˌpæθˌtrʌŋkˌlʌmˌpæmpɔːrˌtuːpɔːrtuːˌpuːntʌkˌæləkˌælək/',
    languages: [
      { language: 'Lithuanian', syllable: 'perkūnas', meaning: 'Thunder deity' },
      { language: 'Latin', syllable: 'exire / clack', meaning: 'To hatch / egg-cluck' },
      { language: 'Barnyard Onomatopoeia', syllable: 'clacked-picall-illi', meaning: 'The clucking of the hen' },
      { language: 'Portuguese', syllable: 'porto-porto', meaning: 'Harbor / Entrance' },
    ],
    commentary:
      'The thunder of literature! The scratching hen resurrects the buried text of human history from the domestic dung-heap.',
  },
  {
    number: 6,
    letters: 100,
    page: 139,
    line: 14,
    word: 'lukkedcarrack-fann-gladd-goss-brot-thor-thor-thor-thun-der-grom-grom-grom-bum-bamb-bum-bamb-bum-bamb-oh-oh!',
    age: 'Age of Gods (Divine Age)',
    book: 'Book I, Chapter 6',
    theme: 'The Twelve Questions of Shem: The Intellectual Interrogation and Demystification of the Mythic Father.',
    ipa: '/lʊktˌkærəkˌfænˌɡlædˌɡɒsˌbroʊtˌθɔːrˌθɔːrˌθɔːrˌθʌndərˌɡrɒmˌɡrɒmˌbʌmˌbæmbˌoʊˌoʊ/',
    languages: [
      { language: 'Russian', syllable: 'grom', meaning: 'Thunder (гром)' },
      { language: 'German', syllable: 'Brot / Gott', meaning: 'Bread / God' },
      { language: 'Norse', syllable: 'Thor', meaning: 'Thunder god (Þórr)' },
      { language: 'Danish', syllable: 'lukket', meaning: 'Closed / Locked away' },
      { language: 'Breton', syllable: 'karrac', meaning: 'Rock / Fortress' },
    ],
    commentary:
      'Concludes Book I’s examination of the titan HCE. The sons dissect the father’s authority through theological riddles and accusations.',
  },
  {
    number: 7,
    letters: 100,
    page: 257,
    line: 27,
    word: 'Bothallchoractorschumminaroundgansumuminarumdrumstrumtruminahumptadumpwaultopoofoolooderamaunsturnup!',
    age: 'Age of Heroes (Aristocratic Age)',
    book: 'Book II, Chapter 1',
    theme: 'The Mime of Mick, Nick and the Maggies: Children’s games, pantomime theatre, and Humpty Dumpty’s carnival tumble.',
    ipa: '/boʊθˌɔːlkɔːrækˌtɔːrsˌʃʌmɪnəˌraʊndˌɡænsʊˌmjuːmɪˌnærʊmˌdrʌmstrʌmˌtrʌmɪnəˌhʌmptədʌmpˌwɔːltəˌpuːfʊˌluːdəræmɔːnzˌtɜːrnʌp/',
    languages: [
      { language: 'English Nursery Rhyme', syllable: 'humptadumpwaulto', meaning: 'Humpty Dumpty on the wall' },
      { language: 'German', syllable: 'schummeln', meaning: 'To cheat at games / play tricks' },
      { language: 'Latin', syllable: 'omnes / choractores', meaning: 'All actors / characters' },
      { language: 'Irish Slang', syllable: 'turnup', meaning: 'Arrival / unexpected appearance' },
    ],
    commentary:
      'Opens Book II’s theatrical world. The nursery rhyme of Humpty Dumpty becomes a cosmic drama of universal falling and reassembling.',
  },
  {
    number: 8,
    letters: 100,
    page: 314,
    line: 8,
    word: 'Pappappappadorrr-muck-muck-muck-puck-puck-puck-bick-bick-bick-flick-flick-flick-patter-patter-patter-oh-oh!',
    age: 'Age of Heroes (Aristocratic Age)',
    book: 'Book II, Chapter 3',
    theme: 'The Norwegian Captain and the Dublin Tailor: Commercial swindles, clothing, and domestic barter.',
    ipa: '/pæpæpˌpæpədɔːrˌmʌkˌmʌkˌpʌkˌpʌkˌbɪkˌbɪkˌflɪkˌflɪkˌpætərˌpætərˌoʊˌoʊ/',
    languages: [
      { language: 'Greek', syllable: 'pappas', meaning: 'Father / Patriarch' },
      { language: 'Irish / Gaelic', syllable: 'púca / muc', meaning: 'Goblin / Pig-filth' },
      { language: 'German', syllable: 'Flicker', meaning: 'Mender of clothes / Tailor' },
      { language: 'English Onomatopoeia', syllable: 'patter-flick-bick', meaning: 'Raindrops hitting the shop window' },
    ],
    commentary:
      'Set in HCE’s pub. The Norwegian sailor arrives in Dublin demanding a suit of clothes from the hunchback tailor Kersse, initiating a comedy of errors.',
  },
  {
    number: 9,
    letters: 100,
    page: 332,
    line: 5,
    word: 'husstenhasstencollenscrapindianshakespencervanevancolumbinecolombianclownclownclownclownclownclownclown!',
    age: 'Age of Heroes (Aristocratic Age)',
    book: 'Book II, Chapter 3',
    theme: 'How Buckley Shot the Russian General: The Crimean War, regicide, patricide, and the collapse of military imperialism.',
    ipa: '/ˈhʊstənˌhæsənˌkɒlənˌskræpˌɪndiːənˌʃeɪkspɛnˌsərvænˌvænˌkɒləmbaɪnˌkɒləmbiːənˌklaʊnˌklaʊn/',
    languages: [
      { language: 'German', syllable: 'husten / hassen', meaning: 'Coughing in the cold / Hatred' },
      { language: 'English Literature', syllable: 'shakespencer', meaning: 'Shakespeare & Edmund Spenser' },
      { language: 'American History', syllable: 'colombian', meaning: 'Christopher Columbus / New World' },
      { language: 'Commedia dell’arte', syllable: 'columbine / clown', meaning: 'The tragic harlequin pantomime' },
    ],
    commentary:
      'The death of the father at the hands of the son. The Irish private Buckley assassinates the Russian general as he defecates in the Crimean mud, ending the age of martial aristocracy.',
  },
  {
    number: 10,
    letters: 100,
    page: 424,
    line: 20,
    word: 'Ullhodturrok-muck-muck-muck-kuck-kuck-kuck-puck-puck-puck-luck-luck-luck-pluck-pluck-pluck-struck-struck!',
    age: 'Age of Men (Democratic) & The Ricorso',
    book: 'Book III, Chapter 1',
    theme: 'Shaun the Postman’s Backward Fall into the River: Sunset, exhaustion, and the cosmic recirculation into the sea.',
    ipa: '/ʊlˌhɒdtʊrɒkˌmʌkˌmʌkˌkʌkˌkʌkˌpʌkˌpʌkˌlʌkˌlʌkˌplʌkˌplʌkˌstrʌkˌstrʌk/',
    languages: [
      { language: 'Turkish', syllable: 'ulu tanrı', meaning: 'Almighty God' },
      { language: 'Irish / Gaelic', syllable: 'púca / muc', meaning: 'Spirit of the heath / swine' },
      { language: 'English Idiom', syllable: 'struck / luck / pluck', meaning: 'The chime of the midnight bell / struck clock' },
      { language: 'Cockney Rhyme', syllable: 'kuck-puck-muck', meaning: 'Slosh of muddy water in the barrel' },
    ],
    commentary:
      'The 10th and final thunderclap. It totals the grand sum to exactly 1,001 letters (echoing the 1,001 Arabian Nights). Shaun falls over backward into the Liffey inside a barrel, floating downstream into the sea, preparing for Book IV’s dawn and the riverrun ricorso.',
  },
];

export default function ThundersPage() {
  const [selectedThunder, setSelectedThunder] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const thunder = THUNDERWORDS.find((t) => t.number === selectedThunder) || THUNDERWORDS[0];
  const basePath = getBasePath();

  const playThunderRumble = () => {
    if (typeof window === 'undefined') return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 1.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);

      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 1500);
    } catch (err) {
      console.warn('[ThundersPage] Web Audio thunder warning:', err);
    }
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = (word: string) => {
    // Play physical acoustic thunder rumble
    playThunderRumble();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;

      activeUtteranceRef.current = utterance;
      (window as unknown as { __winnegansThunderUtterance: SpeechSynthesisUtterance }).__winnegansThunderUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      const irishOrBritish = voices.find(
        (v) => v.lang.toLowerCase().includes('ie') || v.lang.toLowerCase().includes('gb')
      );
      if (irishOrBritish) utterance.voice = irishOrBritish;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        activeUtteranceRef.current = null;
        setSpeaking(false);
      };
      utterance.onerror = () => {
        activeUtteranceRef.current = null;
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[ThundersPage] Speech synthesis error:', err);
      setSpeaking(false);
    }
  };

  const totalLetters = THUNDERWORDS.reduce((acc, curr) => acc + curr.letters, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Hero Header */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 via-slate-950 to-slate-950 overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>The 10 Hundred-Letter Thunderclaps (1,001 Letters Total)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-serif">
            The Joycean Thunderwords Laboratory
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-serif">
            Ten hundred-letter thunderclaps punctuate James Joyce&apos;s <em>Finnegans Wake</em>, totaling exactly{' '}
            <strong className="text-amber-300 font-mono">1,001 letters</strong> to echo <em>The Thousand and One Nights</em>.
            In Giambattista Vico’s philosophy, the divine thunderclap initiates human history, religion, marriage, and speech itself.
          </p>

          <div className="flex items-center justify-center flex-wrap gap-4 pt-2 text-xs font-mono text-slate-400">
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Corpus: <strong className="text-slate-200">10 Thunders</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Total Letters: <strong className="text-emerald-400">{totalLetters} Letters</strong>
            </span>
            <span className="px-3 py-1 rounded bg-slate-900 border border-slate-800">
              Viconian Cycle: <strong className="text-indigo-400">4 Ages</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Thunder Selector Carousel / List */}
        <aside className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span>Select Thunderword</span>
            <span className="text-[10px] text-slate-500 font-mono">1 to 10</span>
          </h2>

          <div className="space-y-2">
            {THUNDERWORDS.map((t) => {
              const isSelected = t.number === selectedThunder;
              return (
                <button
                  key={t.number}
                  onClick={() => setSelectedThunder(t.number)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/50 border-amber-500/60 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{t.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold text-slate-200">
                        FW {String(t.page).padStart(3, '0')}.{String(t.line).padStart(2, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                        {t.letters} letters
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate font-serif italic">
                      {t.word.slice(0, 32)}...
                    </p>
                    <span className="text-[10px] text-indigo-400 block mt-0.5">{t.book}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right: Detailed Analysis & Laboratory */}
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-bold font-serif text-white">
                    Thunderclap #{thunder.number}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {thunder.letters} Letters
                  </span>
                </div>
                <p className="text-xs text-indigo-400 font-mono mt-1">
                  FW Page {thunder.page}, Line {thunder.line} • {thunder.book} • {thunder.age}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(thunder.word)}
                  disabled={speaking}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    speaking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                  }`}
                  title="Pronounce this thunderword via Web Speech API"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{speaking ? 'Synthesizing...' : 'Pronounce'}</span>
                </button>

                <button
                  onClick={() => handleCopy(thunder.word)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <Link
                  href={`/reader?work=finneganswake&page=${thunder.page}#line-${thunder.line}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View in Reader</span>
                </Link>
              </div>
            </div>

            {/* Massive Word Block */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 block">The Hundred-Letter Word:</label>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-amber-200 font-mono text-sm sm:text-base leading-relaxed break-all select-all shadow-inner tracking-wider">
                {thunder.word}
              </div>
            </div>

            {/* IPA Phonetic Transcription */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">IPA Phonetic Guide:</span>
              <span className="text-indigo-300 select-all">{thunder.ipa}</span>
            </div>

            {/* Mythological & Viconian Theme */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Mythic & Thematic Archetype</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-serif leading-relaxed">
                {thunder.theme}
              </p>
            </div>

            {/* Multilingual Syllable Dissector */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multilingual Syllabic Decomposition</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {thunder.languages.map((l, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start justify-between space-x-2"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 font-sans block">{l.language}</span>
                      <span className="text-[11px] font-mono text-amber-400">&ldquo;{l.syllable}&rdquo;</span>
                    </div>
                    <span className="text-[11px] text-slate-400 text-right font-serif italic max-w-[130px]">
                      {l.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarly Commentary */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 text-xs">
              <span className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Scholarly Context & Viconian Function</span>
              </span>
              <p className="text-slate-300 font-serif leading-relaxed">{thunder.commentary}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
