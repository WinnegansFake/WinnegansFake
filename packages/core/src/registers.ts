/**
 * registers.ts
 * Flexible hermeneutic and analytical register registry for book annotations.
 */

import { AnalyticalRegister } from './types.js';

export class RegisterRegistry {
  private registers: Map<string, AnalyticalRegister> = new Map();

  constructor(initialRegisters?: AnalyticalRegister[]) {
    if (initialRegisters) {
      this.registerMany(initialRegisters);
    }
  }

  public register(reg: AnalyticalRegister): void {
    this.registers.set(reg.id, reg);
  }

  public registerMany(regs: AnalyticalRegister[]): void {
    for (const reg of regs) {
      this.register(reg);
    }
  }

  public get(id: string): AnalyticalRegister | undefined {
    return this.registers.get(id);
  }

  public has(id: string): boolean {
    return this.registers.has(id);
  }

  public getAll(): AnalyticalRegister[] {
    return Array.from(this.registers.values());
  }

  public getByCategory(category: string): AnalyticalRegister[] {
    return this.getAll().filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }

  public getCategories(): string[] {
    const cats = new Set<string>();
    for (const reg of this.registers.values()) {
      cats.add(reg.category);
    }
    return Array.from(cats);
  }
}

/**
 * Standard registers commonly utilized in modern literature and epic poetry commentary.
 */
export const STANDARD_LITERARY_REGISTERS: AnalyticalRegister[] = [
  {
    id: 'etymology',
    name: 'Etymology & Linguistic Origins',
    category: 'Linguistic',
    description: 'Archaic roots, loanwords, puns, and morphological derivations.',
    color: 'emerald',
  },
  {
    id: 'topography',
    name: 'Topography & Real-World Geography',
    category: 'Spatial',
    description: 'Historical streets, monuments, waterways, buildings, and maps.',
    color: 'amber',
  },
  {
    id: 'classical-mythology',
    name: 'Classical Mythology & Epic Archetypes',
    category: 'Mythological',
    description: 'Greco-Roman, Norse, Egyptian, or Celtic mythological allusions.',
    color: 'indigo',
  },
  {
    id: 'theological-religious',
    name: 'Theology & Religious Liturgy',
    category: 'Spiritual',
    description: 'Biblical references, sacred liturgies, scholastic philosophy, and heresies.',
    color: 'purple',
  },
  {
    id: 'literary-allusion',
    name: 'Intertextual Literary Allusion',
    category: 'Intertextual',
    description: 'Quotations, parodies, and echoes of other authors and literary canons.',
    color: 'blue',
  },
  {
    id: 'historical-events',
    name: 'Historical Chronicle & Realia',
    category: 'Historical',
    description: 'Specific historical battles, treaties, politicians, and contemporary events.',
    color: 'rose',
  },
  {
    id: 'musical-motifs',
    name: 'Musical & Operatic Leitmotifs',
    category: 'Acoustic',
    description: 'Operas, folk songs, musical structures, and rhythmic patterns.',
    color: 'teal',
  },
  {
    id: 'scientific-philosophical',
    name: 'Philosophy & Science',
    category: 'Theoretical',
    description: 'Philosophical systems, scientific principles, astronomy, and technologies.',
    color: 'cyan',
  },
];
