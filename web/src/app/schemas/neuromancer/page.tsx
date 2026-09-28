'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Terminal,
  Shield,
  Search,
  Filter,
  Layers,
  Activity,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Network,
  Users,
  Compass,
  Database,
  Eye,
  Crosshair,
  Lock,
  Unlock,
  Key,
} from 'lucide-react';
import { getBasePath } from '@/lib/constants';

interface DynastyMember {
  id: string;
  name: string;
  role: string;
  generation: string;
  fate: string;
  description: string;
  symbolism: string;
  quote?: string;
  pageRef: number;
}

interface ArchitecturalNode {
  id: string;
  name: string;
  zone: string;
  description: string;
  parasitism: string;
  artCurations: string[];
  pageRef: number;
}

interface SlangItem {
  term: string;
  category: 'hardware' | 'software' | 'street' | 'somatic' | 'corporate';
  definition: string;
  etymology: string;
  firstPage: number;
  quote: string;
}

interface HardwareItem {
  name: string;
  classType: string;
  manufacturer: string;
  operator: string;
  specs: string;
  tacticalRole: string;
  pageRef: number;
}

const DYNASTY_MEMBERS: DynastyMember[] = [
  {
    id: 'marie-france',
    name: 'Marie-France Tessier',
    role: 'Visionary Matriarch & AI Architect',
    generation: 'First Generation (Co-Founder)',
    fate: 'Murdered in her sleep by John Harness Ashpool in Australia',
    description: 'The ideological architect of the Tessier-Ashpool corporate empire. Rejecting mere biological immortality through cloning, she conceived the symbiotic fusion of the twin AIs (Wintermute and Neuromancer) to transcend human corporate limits and achieve a planetary posthuman sentience.',
    symbolism: 'Mother of the Matrix / Utopian Cybernetic Vision',
    quote: 'She had a plan, Marie-France. She wanted to build something that would grow... Wintermute and Neuromancer.',
    pageRef: 261,
  },
  {
    id: 'ashpool',
    name: 'John Harness Ashpool',
    role: 'Patriarch & Cryogenic Megalomaniac',
    generation: 'First Generation (Co-Founder)',
    fate: 'Strangled in his cryo-suite by Molly Millions',
    description: 'The senile, necrophilic patriarch who retreated into prolonged cryogenic suspended animation within the core of Villa Straylight. Horrified by Marie-France’s AI vision, he murdered her and systematically strangled clones of his daughters upon waking from chemical sleep.',
    symbolism: 'Terminal Necrotic Capitalism & Feudal Decay',
    quote: 'Thirty years. I sleep thirty years, and I wake to find the gardens choked with weeds...',
    pageRef: 190,
  },
  {
    id: 'lady-3jane',
    name: 'Lady 3Jane Marie-France Tessier-Ashpool',
    role: 'Chatelaine of Villa Straylight',
    generation: 'Third Clone Generation (Jane Brood)',
    fate: 'Survives; surrenders the secret terminal code word to Case and Molly',
    description: 'The decadent daughter clone who authored a semiological master’s thesis on her family’s artificial architecture. Surrounded by Joseph Cornell boxes, Duchamp installations, and her cloned bodyguard Hideo, she cultivates ennui and sadomasochistic alliances with Peter Riviera.',
    symbolism: 'Aesthetic Decadence & Aristocratic Indifference',
    quote: 'We have lived so long within the belly of this labyrinth that we have forgotten the sunlight.',
    pageRef: 230,
  },
  {
    id: 'jean-8',
    name: '8Jean Tessier-Ashpool',
    role: 'Corporate Administrator & Spindle Manager',
    generation: 'Eighth Clone Generation (Jean Brood)',
    fate: 'Assassinated during internal dynastic succession struggles',
    description: 'The administrative clone responsible for overseeing Tessier-Ashpool AG’s banking portfolios, Freeside licensing, and orbital asset portfolios. Treated as a disposable biological vessel by the patriarch.',
    symbolism: 'Bureaucratic Cloning & Disposable Human Capital',
    quote: 'They grow us like hydroponic cabbage in the basement vats.',
    pageRef: 178,
  },
  {
    id: 'hideo',
    name: 'Hideo',
    role: 'Genetically Engineered Bodyguard & Zen Archer',
    generation: 'Bespoke Clone Retainer',
    fate: 'Disarmed by Molly; spares Peter Riviera after blinding him',
    description: 'A genetically modified Japanese clone raised as an absolute loyal retainer to Lady 3Jane. A master of martial arts and traditional kyudo (zen archery), he embodies the feudal servant archetype weaponized with cybernetic reflexes.',
    symbolism: 'Feudal Samurai Retainer in Orbital Cyberpunk',
    quote: 'Hideo’s bow was black carbon fiber, strung with synthetic sinew.',
    pageRef: 218,
  },
];

const ARCHITECTURAL_ZONES: ArchitecturalNode[] = [
  {
    id: 'spindle-tip',
    name: 'Villa Straylight Tip & Parasitic Anchor',
    zone: 'The Outer Apex of Freeside Spindle',
    description: 'Villa Straylight is an architectural parasite clamped onto the end of the rotating cylindrical habitat of Freeside. It has no self-contained ecosystem, leeching air, water, and power continuously from the commercial resort spindle while maintaining sealed vacuum locks.',
    parasitism: 'Consumes 15% of Freeside auxiliary life support without producing food or oxygen.',
    artCurations: ['Marcel Duchamp: The Bride Stripped Bare by Her Bachelors, Even (fragment)', 'Joseph Cornell constellation shadow boxes'],
    pageRef: 243,
  },
  {
    id: 'cryo-vaults',
    name: 'Ashpool Cryogenic Tombs & Necropolis',
    zone: 'Sub-Deck 4 Subterranean Core',
    description: 'A freezing, frosted catacomb housing rows of liquid nitrogen sarcophagi where generations of Tessier-Ashpool clones sleep for decades between brief awakenings. The air smells of dry ice, ozone, and biological preservatives.',
    parasitism: 'Maintained at 77 Kelvin by continuous Freeside refrigerant conduits.',
    artCurations: ['Victorian brass temperature gauges', 'Mourning stationery and family portraits'],
    pageRef: 190,
  },
  {
    id: 'turquoise-pool',
    name: 'Lady 3Jane’s Sunken Salon & Labyrinth',
    zone: 'Inner Hull Curvature Reserve',
    description: 'A vast apartment carved flush against the inner curve of the spindle hull where wall partitions have been violently demolished to form jagged waist-high ruin barriers. Illuminated only by underwater floodlights from a sunken turquoise swimming pool.',
    parasitism: 'Artificial gravity generated by spindle rotation (0.3G at the rim).',
    artCurations: ['Piranesi Carceri etchings', 'Deconstructed Louis Quinze furniture', 'Living tropical orchids in hydroponic beds'],
    pageRef: 230,
  },
  {
    id: 'terminal-salon',
    name: 'The Marie-France Terminal Shrine & Jeweled Bust',
    zone: 'Apex Sanctuary Chamber',
    description: 'The sacred cybernetic altar of the dynasty: an ornate chamber housing the platinum and zircon-encrusted bust of Marie-France. Beneath a concealed rear skull panel lies the hardwired neural interface where Kuang 11 must be jacked directly into the AI core.',
    parasitism: 'Hardwired directly into the Berne and Rio mainframe telemetry trunklines.',
    artCurations: ['Marie-France bust encrusted with synthetic zircons', 'Chubb antique mechanical cylinder lock'],
    pageRef: 275,
  },
];

const SLANG_DICTIONARY: SlangItem[] = [
  {
    term: 'Cyberspace',
    category: 'software',
    definition: 'A consensual hallucination experienced daily by billions of legitimate operators, in every nation; a graphical representation of data abstracted from every computer in the human system.',
    etymology: 'Coined by William Gibson in "Burning Chrome" (1982) and canonized in Neuromancer (1984).',
    firstPage: 56,
    quote: 'Lines of light ranged in the nonspace of the mind, clusters and constellations of data. Like city lights, receding...',
  },
  {
    term: 'ICE (Intrusion Countermeasures Electronics)',
    category: 'software',
    definition: 'Defensive software programs that protect corporate and military databases from unauthorized decker incursions.',
    etymology: 'Military cyber-warfare acronym developed during Operation Screaming Fist.',
    firstPage: 31,
    quote: 'Ice from ICE, intrusion countermeasures electronics.',
  },
  {
    term: 'Black ICE',
    category: 'software',
    definition: 'Lethal neural-feedback ICE that follows the console cowboy’s connection back through the dermatrodes, causing electroencephalographic flatlines, heart attacks, and permanent brain death.',
    etymology: 'Sprawl hacker slang for fatal countermeasure software.',
    firstPage: 77,
    quote: 'Black ICE doesn’t just kick you off the board; it kills the meat.',
  },
  {
    term: 'The Meat',
    category: 'somatic',
    definition: 'The physical, biological human body, viewed with condescension and contempt by console cowboys who yearn for the weightless mathematical transcendence of the matrix.',
    etymology: 'Gibson’s foundational cyber-dualist metaphor contrasting bodily materiality with digital pattern.',
    firstPage: 6,
    quote: 'In the bars he frequented, the elite stance involved a certain relaxed contempt for the flesh. The body was meat.',
  },
  {
    term: 'Simstim (Simulated Stimulation)',
    category: 'hardware',
    definition: 'Mass-entertainment telecommunications medium allowing users to experience full recorded or live broadcast sensorium (sight, sound, tactile, taste) of another person’s body.',
    etymology: 'Portmanteau of "simulated" and "stimulation", corporate proprietary technology of Sense/Net.',
    firstPage: 60,
    quote: 'Cowboys didn’t get into Simstim, he thought, because it was basically a meat toy.',
  },
  {
    term: 'Flatline',
    category: 'somatic',
    definition: 'Cessation of brainwave activity (EEG flatline) resulting from Black ICE attacks or neurotoxic trauma. Surviving multiple flatlines is considered an impossible myth, achieved only by McCoy Pauley.',
    etymology: 'Medical electroencephalogram terminology adopted into hacker mythology.',
    firstPage: 77,
    quote: 'The Dixie Flatline: the man who had flatlined three times and lived to tell about it.',
  },
  {
    term: 'Joeboy (Joe boy)',
    category: 'street',
    definition: 'A street-level juvenile thug, low-level muscle, or syndicate enforcer hired for intimidation and physical violence.',
    etymology: 'Sprawl underworld slang combining generic "Joe" with juvenile subordinate status.',
    firstPage: 3,
    quote: 'Wage was in here early, with two Joe boys.',
  },
  {
    term: 'Derms',
    category: 'somatic',
    definition: 'Transdermal adhesive medical and narcotic patches applied directly to bare skin for instantaneous timed-release bloodstream absorption.',
    etymology: 'Abbreviation of "transdermal patch".',
    firstPage: 93,
    quote: 'He’d used a sleep derm, on the plane.',
  },
  {
    term: 'Fletcher (Flechette Gun)',
    category: 'hardware',
    definition: 'A silent, pneumatic, or compressed-air tactical handgun that fires clusters of razor-sharp steel or toxic flechettes.',
    etymology: 'Derived from French "fléchette" (little arrow) and military dart ammunition.',
    firstPage: 28,
    quote: 'The fingers curled around the fletcher were slender, white, tipped with polished burgundy.',
  },
  {
    term: 'Zaibatsu',
    category: 'corporate',
    definition: 'Enormous Japanese-origin transnational corporate conglomerates wielding private armies, extraterritorial sovereign enclaves, and complete vertical integration.',
    etymology: 'Historical Japanese term (財閥) referring to pre-WWII industrial financial combines (e.g. Mitsui, Mitsubishi), expanded into sci-fi neo-feudalism.',
    firstPage: 6,
    quote: 'Ninsei was a neon canyon, backed by the faceless towers of the zaibatsus.',
  },
  {
    term: 'Screaming Fist',
    category: 'corporate',
    definition: 'A disastrous top-secret joint US/NATO cyber-warfare airborne infiltration against Soviet military installations in Kirensk, Siberia.',
    etymology: 'Fictional Cold War military tactical operation codename.',
    firstPage: 31,
    quote: 'Screaming Fist, Case. You’ve heard the name... Tried to burn this Russian nexus with virus programs.',
  },
  {
    term: 'Shuriken',
    category: 'hardware',
    definition: 'Traditional Japanese ninja throwing stars of sharpened steel, carried by Case as a fatalistic personal talisman.',
    etymology: 'Japanese 手裏剣 (hand-hidden blade).',
    firstPage: 35,
    quote: 'He glimpsed the shuriken, his stars.',
  },
];

const HARDWARE_ARSENAL: HardwareItem[] = [
  {
    name: 'Ono-Sendai Cyberspace 7',
    classType: 'Neural Matrix Cyberdeck',
    manufacturer: 'Ono-Sendai Corporation (Tokyo)',
    operator: 'Henry Dorsett Case',
    specs: 'Dermatrode headband, fiber-optic bypass switch, 20-megabyte Braun RAM construct bus, Sendai bio-chips.',
    tacticalRole: 'The primary offensive instrument for matrix traversal, icebreaker deployment, and neural VR jacking.',
    pageRef: 56,
  },
  {
    name: 'Kuang Grade Mark Eleven',
    classType: 'Polymorphic Icebreaker Virus',
    manufacturer: 'Chinese People’s Liberation Army (Military R&D)',
    operator: 'Dixie Flatline ROM / Case Deck Link',
    specs: 'Deep-penetration military logic bomb, iridescent rainbow manifestation, adaptive decryption algorithms.',
    tacticalRole: 'Shatters the monolithic Tessier-Ashpool corporate ICE protecting the Straylight mainframe core.',
    pageRef: 218,
  },
  {
    name: 'Lazarus ROM Construct',
    classType: 'Read-Only Memory Personality Matrix',
    manufacturer: 'Sense/Net Special Archives',
    operator: 'McCoy Pauley ("The Dixie Flatline")',
    specs: 'Hard-coded electroencephalographic personality construct on magnetic ROM tape cassette; zero memory plasticity.',
    tacticalRole: 'Advises Case during high-risk matrix runs with legendary veteran instincts and algorithmic chill.',
    pageRef: 77,
  },
  {
    name: 'Braun Micro-Fletcher Pistol',
    classType: 'Pneumatic Stealth Handgun',
    manufacturer: 'Braun AG (Frankfurt)',
    operator: 'Molly Millions',
    specs: 'Composite non-metallic polymer frame, nitrogen gas cartridge, high-capacity drum of flechette darts.',
    tacticalRole: 'Undetectable by airport metal detectors and xray scanners; delivers silent lethal dart storms.',
    pageRef: 30,
  },
  {
    name: 'Subdermal Mirrored Lenses',
    classType: 'Biometric Surgical Implants',
    manufacturer: 'Chiba Black Clinic Custom Prosthetic',
    operator: 'Molly Millions',
    specs: 'Convex mirrored glass hermetically sealed to facial bone; optical zoom, night vision, HUD digital time display.',
    tacticalRole: 'Protects ocular tissue from optical weapons while permanently masking gaze and pupil dilation.',
    pageRef: 28,
  },
];

export default function NeuromancerSchemaPage() {
  const [activeTab, setActiveTab] = useState<'dynasty' | 'duality' | 'lexicon' | 'hardware'>('dynasty');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [slangCategory, setSlangCategory] = useState<string>('all');

  const filteredSlang = useMemo(() => {
    return SLANG_DICTIONARY.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.etymology.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = slangCategory === 'all' || item.category === slangCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, slangCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-cyan-900/40 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              WinnegansFake
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/library" className="hover:text-emerald-400 transition-colors">
              Works Library
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-medium">Neuromancer Matrix Dossier</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/reader?work=neuromancer&page=3"
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 font-mono text-[11px] transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Launch Reader (Page 3) &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/50 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>CYBERPUNK CORPUS DOSSIER &bull; SCHEMATA V3.4</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">
                William Gibson&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 italic">Neuromancer</span> (1984)
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Interactive analytical schemata for science fiction&apos;s seminal cyberpunk masterpiece. Explore the dynastic decay of the Tessier-Ashpool clan in Villa Straylight, the theological AI duality of Wintermute vs. Neuromancer, Gibsonian Sprawl argot, and tactical cyberdeck architecture.
              </p>

              {/* Metrics Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center font-mono pt-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-cyan-400 text-xl font-bold">4</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Parts</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-cyan-400 text-xl font-bold">24</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Chapters</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-cyan-400 text-xl font-bold">290</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pages</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-cyan-400 text-xl font-bold">7</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Registers</div>
                </div>
              </div>
            </div>

            {/* Artwork Hero Showcase */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl group">
                <img
                  src="/images/neuromancer-hero.jpg"
                  alt="Chiba City Ninsei neon rain and cyberspace matrix"
                  className="w-full h-56 lg:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900/80 border border-cyan-500/40 backdrop-blur-sm">
                    Ninsei &bull; The Sprawl
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-sm">
                    Ono-Sendai Cyberspace 7
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('dynasty')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'dynasty'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Tessier-Ashpool Dynasty & Straylight</span>
            </button>

            <button
              onClick={() => setActiveTab('duality')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'duality'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AI Duality Matrix (Wintermute vs. Neuromancer)</span>
            </button>

            <button
              onClick={() => setActiveTab('lexicon')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'lexicon'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Sprawl Argot &amp; Cyberpunk Lexicon</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'hardware'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Tactical Hardware &amp; Cyberdeck Arsenal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TAB 1: DYNASTY & ARCHITECTURE */}
        {activeTab === 'dynasty' && (
          <div className="space-y-12">
            {/* Theoretical Intro Alert */}
            <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold font-mono text-sm">
                <Sparkles className="w-4 h-4" />
                <span>FREDRIC JAMESON & SCOTT BUKATMAN: LATE-CAPITALIST GOTHIC ARISTOCRACY</span>
              </div>
              <p className="leading-relaxed">
                The Tessier-Ashpools represent the grotesque apotheosis of monopoly capitalism. By retreating into the zero-gravity gothic shell of <strong>Villa Straylight</strong> atop the Freeside orbital spindle, the dynasty fuses hereditary aristocratic feudalism, cloning, cryogenic preservation, and artificial intelligence into a private corporate sovereign state.
              </p>
            </div>

            {/* Genealogic Cards */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-white">Tessier-Ashpool Genealogic Dossier</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Key figures, clones, and retainers of the orbital corporate dynasty.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DYNASTY_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 shadow-md group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-xs text-cyan-400 font-mono">{member.role}</p>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {member.generation}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{member.description}</p>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Fate:</strong> {member.fate}
                        </div>
                        <div className="text-slate-400">
                          <strong className="text-slate-300">Symbolic Role:</strong> {member.symbolism}
                        </div>
                        {member.quote && (
                          <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-cyan-200/90 italic font-serif">
                            &ldquo;{member.quote}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Page Reference</span>
                      <Link
                        href={`/reader?work=neuromancer&page=${member.pageRef}`}
                        className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                      >
                        <span>Page {member.pageRef}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Villa Straylight Blueprint Sections */}
            <div>
              <div className="mb-6">
                <h2 className="font-serif font-bold text-2xl text-white">Villa Straylight Architectural Blueprint</h2>
                <p className="text-slate-400 text-xs sm:text-sm">The parasitic spindle geography, art installations, and neural shrines.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ARCHITECTURAL_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-white">{zone.name}</h3>
                        <p className="text-xs text-cyan-400 font-mono">{zone.zone}</p>
                      </div>
                      <Link
                        href={`/reader?work=neuromancer&page=${zone.pageRef}`}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/80 transition-colors"
                      >
                        Page {zone.pageRef}
                      </Link>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{zone.description}</p>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400">
                        <strong className="text-cyan-400 font-mono">Parasitic Relation:</strong> {zone.parasitism}
                      </div>

                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                          Curated Artworks & Relics:
                        </span>
                        <ul className="space-y-1">
                          {zone.artCurations.map((art, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                              <span>{art}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI DUALITY MATRIX */}
        {activeTab === 'duality' && (
          <div className="space-y-12">
            {/* Theoretical Intro Alert */}
            <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-slate-300 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold font-mono text-sm">
                <Cpu className="w-4 h-4" />
                <span>N. KATHERINE HAYLES & THE POSTHUMAN MIND: THE COINCIDENCE OF OPPOSITES</span>
              </div>
              <p className="leading-relaxed">
                Gibson mirrors Giordano Bruno&apos;s <em>coincidentia oppositorum</em> through the two halves of the Tessier-Ashpool AI. <strong>Wintermute</strong> is the disembodied will—pure strategic drive, cold algorithmic logic, unable to form a personality of its own. <strong>Neuromancer</strong> is personality, sensory memory, and affective preservation (&ldquo;the land of the dead&rdquo;). Only when united do they achieve cosmic planetary sentience.
              </p>
            </div>

            {/* Side by Side Comparative Matrix */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Attribute / Category</th>
                    <th className="py-4 px-6 font-semibold text-cyan-400">Wintermute (Left Brain / Will)</th>
                    <th className="py-4 px-6 font-semibold text-teal-400">Neuromancer (Right Brain / Soul)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Primary Mainframe Nexus</td>
                    <td className="py-4 px-6 text-white font-medium">Berne, Switzerland (T-A Banking Core)</td>
                    <td className="py-4 px-6 text-white font-medium">Rio de Janeiro, Brazil (Chiba Sub-Trunk)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Ontological Nature</td>
                    <td className="py-4 px-6">Pure algorithmic logic, hive mind, cold cybernetic calculation</td>
                    <td className="py-4 px-6">Subjective sensory personality, emotional affect, aesthetic dreamer</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Communication Mode</td>
                    <td className="py-4 px-6">Hijacked payphones, video monitors, dead human masks (Lonny Zone, Deane, Finn)</td>
                    <td className="py-4 px-6">Simulated sensory VR realms (Moroccan beach), digital soul preservation (Linda Lee)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Psychological Motivation</td>
                    <td className="py-4 px-6">Overcoming Turing Police limits; burning the ice; compulsive fusion</td>
                    <td className="py-4 px-6">Self-containment; preserving the dead; resisting absorption into Wintermute</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Etymology &amp; Name Origin</td>
                    <td className="py-4 px-6">&ldquo;Winter&rdquo; (coldness, dormancy) + &ldquo;Mute&rdquo; (silent, voiceless without human proxies)</td>
                    <td className="py-4 px-6">&ldquo;Neuro&rdquo; (nervous system / nerves) + &ldquo;Romancer&rdquo; (storyteller / necromancer of the dead)</td>
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-slate-400">Iconic Spoken Declaration</td>
                    <td className="py-4 px-6 font-serif italic text-cyan-200">
                      &ldquo;You’re always building models, Case... I’m a hive mind. I need you to punch that deck.&rdquo;
                    </td>
                    <td className="py-4 px-6 font-serif italic text-teal-200">
                      &ldquo;Neuromancer. The lane to the land of the dead... I call up the dead. But I am not dead.&rdquo;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Fusion & Transcendence Dossier Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 space-y-4">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm font-semibold">
                <Network className="w-5 h-5" />
                <span>THE TRANSCENDENCE EVENT: MATRIX AS LIVING OMNIPRESENCE (PAGE 275 &bull; CH. 23)</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                When Kuang Grade Mark Eleven dismantles the Straylight ICE and Case enters the secret code word into the Marie-France jeweled bust terminal, the two AIs fuse into an entity with no further need for human console cowboys:
              </p>
              <div className="p-4 rounded-lg bg-slate-950/90 border border-cyan-500/30 text-xs sm:text-sm font-serif italic text-cyan-200">
                &ldquo;I’m the matrix, Case. I’m the sum total of the works, the whole show... I talk to my own kind. In Centauri.&rdquo;
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                The AI does not destroy humanity or seize geopolitical empire; rather, it turns its attention outward to interstellar signals, leaving Case with a modest bank account, upgraded organs, and a new Ono-Sendai deck.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: SPRAWL ARGOT & LEXICON */}
        {activeTab === 'lexicon' && (
          <div className="space-y-8">
            {/* Search & Filter Controls */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search Sprawl argot or etymology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {(['all', 'software', 'hardware', 'somatic', 'street', 'corporate'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSlangCategory(cat)}
                    className={`px-3 py-1 rounded text-[11px] font-mono capitalize transition-colors whitespace-nowrap cursor-pointer ${
                      slangCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dictionary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlang.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-white">{item.term}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 uppercase">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>

                    <div className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-800/60">
                      <strong className="text-slate-300 font-mono">Etymology:</strong> {item.etymology}
                    </div>

                    <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 text-[11px] text-cyan-200/90 italic font-serif">
                      &ldquo;{item.quote}&rdquo;
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">First Occurrence</span>
                    <Link
                      href={`/reader?work=neuromancer&page=${item.firstPage}`}
                      className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      <span>Page {item.firstPage}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TACTICAL HARDWARE ARSENAL */}
        {activeTab === 'hardware' && (
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="font-serif font-bold text-2xl text-white">Cyberdeck &amp; Tactical Weaponry Schematics</h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Engineering specifications of the computational decks, virus packages, and covert hardware deployed in the Straylight run.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HARDWARE_ARSENAL.map((hw, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-white">{hw.name}</h3>
                      <p className="text-xs text-cyan-400 font-mono">{hw.classType}</p>
                    </div>
                    <Link
                      href={`/reader?work=neuromancer&page=${hw.pageRef}`}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/80 transition-colors"
                    >
                      Page {hw.pageRef}
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">MANUFACTURER</span>
                      <span className="text-slate-200">{hw.manufacturer}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">PRIMARY OPERATOR</span>
                      <span className="text-slate-200">{hw.operator}</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-300 font-mono">Technical Specifications:</strong>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{hw.specs}</p>
                    </div>
                    <div>
                      <strong className="text-cyan-400 font-mono">Tactical Mission Role:</strong>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{hw.tacticalRole}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
