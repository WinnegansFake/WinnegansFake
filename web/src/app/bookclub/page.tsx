'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Play,
  BookOpen,
  Calendar,
  Sparkles,
  Clock,
  Compass,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Flame,
  Coffee,
  HeartHandshake,
  Glasses,
  Printer
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/constants';

const TIKTOK_URL = 'https://www.tiktok.com/@lily76412/video/7661924549893655839?_r=1&_t=ZN-99VlBXRExiY';

export default function BookClubPage() {
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [selectedPace, setSelectedPace] = useState<'venice' | 'year' | 'seasons' | 'micro'>('venice');

  const inviteText = `Hey friends! I'm starting a reading circle for James Joyce's Finnegans Wake using WinnegansFake (https://winnegansfake.com/bookclub). 

Instead of reading alone, we'll read aloud, decode the multilingual puns, and explore the dream of history together—inspired by the famous California book club that spent 28 years on it!

No literature degree or prior knowledge needed. Check out our plan and join the circle!`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 1. Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_50%)]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wide">
            <Users className="w-4 h-4" />
            <span>COMMUNAL JOYCEAN SCHOLARSHIP &bull; START A BOOK CLUB</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 italic">Finnegans Wake</span> Reading Circle
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            James Joyce’s nocturnal masterpiece was never designed to be suffered alone in silent isolation.
            It is a raucous choral wake—written to be read aloud, laughed over, shared, and unlocked together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href="#inspiration"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch the TikTok Inspiration</span>
            </a>
            <a
              href="#blueprint"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:scale-105"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>How to Organize Your Club</span>
            </a>
            <Link
              href="/reader?page=3"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Begin at Page 3</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. The TikTok Inspiration & Author's Note */}
      <section id="inspiration" className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Feature Card: Why You Should Watch This TikTok Video */}
          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* Left Column: Visual Callout & Direct Link */}
              <div className="w-full md:w-5/12 flex-shrink-0 text-center space-y-4">
                <div className="relative group mx-auto max-w-[280px] rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-slate-950 p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/10 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                      Viral BookTok Chronicle
                    </span>
                    <h4 className="font-serif font-bold text-white text-base leading-tight">
                      &ldquo;After 28 Years, This California Book Club Finished Its First Book&rdquo;
                    </h4>
                    <p className="text-slate-400 text-xs mt-1 font-mono">
                      @lily76412 on TikTok
                    </p>
                  </div>
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition-all group-hover:shadow-emerald-500/20"
                  >
                    <span>Watch Video on TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  Reported by <span className="text-slate-400">The Guardian</span> &bull; 1995–2023
                </p>
              </div>

              {/* Right Column: Narrative & The Author's Connection */}
              <div className="w-full md:w-7/12 space-y-4">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                  <Flame className="w-3.5 h-3.5 text-indigo-400" />
                  <span>The Spark That Started WinnegansFake</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                  Why Watch This Video? <br className="hidden sm:inline" />
                  <span className="text-emerald-400 text-xl sm:text-2xl font-normal italic">
                    (As I, the original author of this repository, did too)
                  </span>
                </h2>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
                  <p>
                    The viral TikTok video by <strong className="text-white">@lily76412</strong> recounts the legendary true story of the
                    Venice Public Library reading circle in California, organized by filmmaker Gerry Fialka in 1995.
                    For <strong className="text-emerald-300">28 years</strong>, this intrepid band of ordinary readers met every single month to
                    read <em>Finnegans Wake</em> at the unhurried pace of <strong className="text-white">one to two pages per meeting</strong>.
                  </p>
                  <p>
                    They argued over single syllables, laughed at bawdy puns, looked up Norse gods and Dublin tramlines, and became lifelong friends.
                    In October 2023, after 28 years (the exact 28-year leap-year cycle and the 28 Rainbow Girls of the Wake!), they finally turned
                    page 628. And true to Joyce&apos;s circular structure, their immediate unanimous vote was to <strong className="text-emerald-300">turn right back to page 3 and start again</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-emerald-300 font-serif italic text-sm">
                      &ldquo;When I watched this video, everything clicked.&rdquo;
                    </p>
                    <p className="text-slate-400">
                      I realized that modern digital tools were failing Joycean readers by treating books as solitary PDF downloads.
                      WinnegansFake was built directly out of that revelation: to provide the collaborative coordinates, zero-copyright legal protection,
                      and community apparatus so anyone, anywhere on Earth, can gather a few curious minds and embark on this glorious journey together.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. The 4 Big Reasons to Read Together */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white">
                Four Reasons Joyce Demands a Collective Brain
              </h3>
              <p className="text-xs text-slate-400">
                Why reading in a group is actually vastly easier and more delightful than reading alone:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-semibold text-white text-sm">60+ Languages Combined</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No single person speaks Gaelic, Danish, Sanskrit, Latin, and Dublin street cant. In a group, each reader spots different linguistic threads.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-semibold text-white text-sm">Sound Over Sight</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sentences that look like scrambled code on paper transform into rollicking music, jokes, and Dublin brogue the moment someone reads them aloud.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-semibold text-white text-sm">No Single &ldquo;Right Answer&rdquo;</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Joyce practiced Giordano Bruno’s <em>coincidentia oppositorum</em>: contradictory interpretations are intentionally both true simultaneously.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                  4
                </div>
                <h4 className="font-semibold text-white text-sm">Collective Discovery</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When your group discovers a new pun or historical connection, you can submit an annotation to WinnegansFake to help future circles world-wide.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. The Reading Cadences / Pace Selector */}
      <section id="blueprint" className="py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>STEP 1: SELECT YOUR CADENCE</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Choose the Pace for Your Circle
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              There is no single correct speed. Select the cadence that best fits your group&apos;s curiosity and schedule:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Venice Cadence */}
            <button
              type="button"
              onClick={() => setSelectedPace('venice')}
              className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${
                selectedPace === 'venice'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">The Venice Pace</span>
                <Coffee className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">1–2 Pages / Month</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                The Gerry Fialka 28-year meditation. Examine every word, reference, and hidden language without rushing.
              </p>
            </button>

            {/* 1-Year Sprint */}
            <button
              type="button"
              onClick={() => setSelectedPace('year')}
              className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${
                selectedPace === 'year'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase">The 1-Year Flow</span>
                <Flame className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">12 Pages / Week</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Focus on the acoustic tide and major narrative arcs across ~50 weekly sessions. Don&apos;t get stuck on single words.
              </p>
            </button>

            {/* 4 Seasons */}
            <button
              type="button"
              onClick={() => setSelectedPace('seasons')}
              className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${
                selectedPace === 'seasons'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">The Four Seasons</span>
                <Compass className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">1 Book per Season</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Map the 4 books to Vico&apos;s 4 cyclical ages: Fall (Book I), Winter (Book II), Spring (Book III), Summer (Book IV).
              </p>
            </button>

            {/* Micro-Circle */}
            <button
              type="button"
              onClick={() => setSelectedPace('micro')}
              className={`p-5 rounded-xl text-left border transition-all cursor-pointer ${
                selectedPace === 'micro'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-teal-400 uppercase">Micro-Circle</span>
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <h3 className="font-serif font-bold text-white text-base">Pages 3–29 (4 Wks)</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Test the waters! Read Book I Chapter 1 (The Fall of Tim Finnegan & the 100-letter Thunder) over 4 friendly meetings.
              </p>
            </button>
          </div>

          {/* Dynamic Pace Details Box */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            {selectedPace === 'venice' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The Venice Cadence: Total Dedication to the Microcosm</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Meeting once a month to tackle 1 or 2 pages means every participant can dig into the etymological dictionaries,
                  examine the Buffalo Notebook sigla (∐ HCE, Δ ALP, ⊏ Shem), and explore cross-references. Nobody ever feels overwhelmed
                  by homework, and each meeting is a deep, joyful philosophical symposium.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Duration: ~25-28 Years</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Homework: 0 Pages</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Meeting: 90 Minutes Monthly</span>
                </div>
              </div>
            )}

            {selectedPace === 'year' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The 1-Year Flow: Experiencing the River Liffey&apos;s Current</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Best for readers who want to finish the book in a calendar year without agonizing over every obscure reference.
                  At 12 pages a week, the group reads key paragraphs aloud, notes recurring motifs (the Wellington monument, the letter in the midden heap, the washerwomen),
                  and lets the music of the language carry them along.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Duration: 52 Weeks</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Homework: ~12 Pages/Week</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Meeting: 1 Hour Weekly</span>
                </div>
              </div>
            )}

            {selectedPace === 'seasons' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The Four Seasons: Aligning with Viconian Historical Cycles</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Joyce explicitly mapped the 4 books to Giambattista Vico’s four ages of civilization.
                  Tackle Book I (The Age of Gods / Parents) in Autumn, Book II (The Age of Heroes / Children at School) in Winter,
                  Book III (The Age of Men / Shaun&apos;s sermons) in Spring, and Book IV (The Ricorso / Dawn & ALP&apos;s dying soliloquy) in Summer.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Duration: 1–2 Years</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Homework: 1 Chapter Bi-Weekly</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Meeting: 2 Hours Bi-Weekly</span>
                </div>
              </div>
            )}

            {selectedPace === 'micro' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-teal-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>The Micro-Circle: The 4-Week Starter Pack</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Start small before committing to a multi-year epic. Book I, Chapter 1 (pages 3–29) introduces all the main themes:
                  the fall of Tim Finnegan from the scaffold, the 100-letter thunderclap, the battle of Waterloo in the Wellington museum,
                  and the giant slumbering across the hills of Dublin. If your circle loves it, keep going!
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-400 pt-1">
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Duration: 4 Weeks</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Homework: ~7 Pages/Week</span>
                  <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Meeting: 1 Hour Weekly</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. The Golden Rules & 90-Minute First Meeting Agenda */}
      <section className="py-16 sm:py-20 border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: The Golden Rules */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                <Glasses className="w-3.5 h-3.5" />
                <span>STEP 2: GROUND RULES</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                The 5 Golden Rules of a Joycean Reading Circle
              </h3>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Volume2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">1. Always Read Out Loud:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Pass the paragraph around the table. Do not worry about stumbles—Joyce intended the reader&apos;s tongue to tumble.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <HeartHandshake className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">2. No Gatekeeping Allowed:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">You do not need a degree in literature or knowledge of 19th-century Irish politics. Anyone with ears and humor can participate.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">3. Laugh at the Dirty Jokes:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Underneath the Catholic liturgy and Viconian cosmology, the Wake is packed with schoolboy puns, pub gossip, and toilet humor.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Compass className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">4. Use WinnegansFake as Your Compass:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">Look up line coordinates (<code className="text-emerald-300">003.01</code>) on your phones or laptops to see the 19 analytical registers without spoiling the flow.</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <Share2 className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">5. Contribute What You Find:</strong>
                    <p className="text-slate-400 text-xs mt-0.5">When your circle decodes an allusion that isn&apos;t in our notes, click &ldquo;Contribute Annotation&rdquo; and submit a pull request!</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right: Meeting 1 Agenda Blueprint */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>STEP 3: FIRST MEETING BLUEPRINT</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white">
                The 90-Minute First Meeting Agenda
              </h3>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">00:00 – 00:15 &bull; WELCOME &amp; DRINKS</span>
                  <h5 className="font-medium text-white text-xs">Pints, Tea &amp; The Ground Rules</h5>
                  <p className="text-[11px] text-slate-400">Pour beverages, establish rule #2 (no gatekeeping), and explain that the book begins mid-sentence from page 628.</p>
                </div>

                <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
                  <span className="text-[11px] font-mono text-indigo-400 font-semibold">00:15 – 00:35 &bull; THE CHORAL READING</span>
                  <h5 className="font-medium text-white text-xs">Read Page 3 Aloud Twice</h5>
                  <p className="text-[11px] text-slate-400">Have 3 or 4 people take turns reading page 3 out loud. First pass for the rhythm; second pass to catch words that jump out.</p>
                </div>

                <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">00:35 – 00:60 &bull; THE THUNDERCLAP DECODER</span>
                  <h5 className="font-medium text-white text-xs">Analyze the 100-Letter Word (3.15–17)</h5>
                  <p className="text-[11px] text-slate-400">Open WinnegansFake on line 3.15. Listen to the roar of thunder that terrifies primitive man into caves to invent marriage and religion.</p>
                </div>

                <div className="border-l-2 border-teal-500 pl-4 space-y-1">
                  <span className="text-[11px] font-mono text-teal-400 font-semibold">00:60 – 00:80 &bull; OPEN ROUNDTABLE</span>
                  <h5 className="font-medium text-white text-xs">What Did Everyone Notice?</h5>
                  <p className="text-[11px] text-slate-400">Share favorite words: &ldquo;commodius vicus&rdquo;, &ldquo;penisolate war&rdquo;, &ldquo;aquaface&rdquo;. Explore the geography of Howth and the River Liffey.</p>
                </div>

                <div className="border-l-2 border-slate-600 pl-4 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">00:80 – 00:90 &bull; NEXT TARGET &amp; GOODBYES</span>
                  <h5 className="font-medium text-white text-xs">Set Date for Meeting #2 (Pages 4–5)</h5>
                  <p className="text-[11px] text-slate-400">Confirm next meeting date. Assign zero required homework so everyone arrives eager and relaxed.</p>
                </div>
              </div>
            </div>

            {/* Printable Meeting Worksheet Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-semibold">
                  <Printer className="w-4 h-4" />
                  <span>OFFLINE FACILITATOR TOOLKIT</span>
                </div>
                <h4 className="text-base font-serif font-bold text-white">Print Official Meeting Worksheet</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Generates a clean, distraction-free PDF/printable session sheet with attendee roles, discussion prompts, 19-register checklist, and note spaces.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs font-medium transition-all cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span>Print Meeting Sheet (PDF)</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Invite Generator & Community Links */}
      <section className="py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
              <Share2 className="w-3.5 h-3.5" />
              <span>STEP 4: RECRUIT YOUR CREW</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-white">
              Invite Friends to Your Reading Group
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Copy this ready-made invitation message to post on WhatsApp, Discord, Slack, Reddit (r/jamesjoyce), or your local library board:
            </p>
          </div>

          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                Invitation Message Template
              </span>
              <button
                type="button"
                onClick={handleCopyInvite}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all cursor-pointer"
              >
                {copiedInvite ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Invitation</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {inviteText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Need a reading buddy? Post in our GitHub Discussions!</span>
              </div>
              <a
                href={`${GITHUB_REPO_URL}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <span>Browse Community Discussions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-16 sm:py-24 bg-gradient-to-t from-emerald-950/30 to-slate-950 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <BookOpen className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            &ldquo;riverrun, past Eve and Adam&apos;s...&rdquo;
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your 28-year (or 28-week) adventure begins with a single word.
            Open the reader, gather your fellow wake-watchers, and let the great circular song commence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/reader?page=3"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <span>Launch Reader at Page 3</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all hover:scale-105"
            >
              <span>EPUB &amp; Text Setup Guide</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
