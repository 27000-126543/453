export type Race = 'human' | 'elf' | 'orc' | 'dragon' | 'undead' | 'demon';

export type Element = 'fire' | 'water' | 'wind' | 'earth' | 'light' | 'dark' | 'chaos';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type IncubationStatus = 'idle' | 'configuring' | 'cultivating' | 'completed' | 'failed';

export interface Stats {
  strength: number;
  agility: number;
  magic: number;
  constitution: number;
  perception: number;
  willpower: number;
}

export interface GeneSample {
  id: string;
  name: string;
  race: Race;
  rarity: Rarity;
  statBonuses: Partial<Stats>;
  traitBonus?: string;
  description: string;
  icon: string;
}

export interface EnergyCore {
  id: string;
  name: string;
  element: Element;
  rarity: Rarity;
  energyConcentration: number;
  effects: {
    statBoost?: Partial<Stats>;
    talentBonus?: number;
    mutationRate?: number;
  };
  description: string;
  icon: string;
}

export interface Potion {
  id: string;
  name: string;
  type: 'growth' | 'sync' | 'awakening' | 'catalyst';
  rarity: Rarity;
  effects: {
    growthBoost?: number;
    syncBoost?: number;
    awakeningBoost?: number;
    eventAlteration?: number;
    talentBonus?: number;
  };
  quantity: number;
  description: string;
  icon: string;
}

export interface Talent {
  id: string;
  name: string;
  rarity: Rarity;
  isRare: boolean;
  effect: string;
  statModifiers?: Partial<Stats>;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  type: 'active' | 'passive' | 'mutation';
  power: number;
  cooldown: number;
  description: string;
  isMutated: boolean;
}

export interface IncubationEvent {
  id: string;
  type: 'gene_crash' | 'consciousness_binding' | 'energy_surge' | 'mutation_trigger' | 'stable';
  timestamp: number;
  message: string;
  impact: {
    growth?: number;
    syncRate?: number;
    awakening?: number;
    talentBonus?: number;
  };
}

export interface IncubationSession {
  id: string | null;
  status: IncubationStatus;
  geneSlots: [GeneSample | null, GeneSample | null, GeneSample | null];
  mainCore: EnergyCore | null;
  auxCore: EnergyCore | null;
  growth: number;
  syncRate: number;
  awakening: number;
  startTime: number | null;
  lastFeedTime: number | null;
  events: IncubationEvent[];
  estimatedStats: Stats | null;
  estimatedTalentChance: number;
  estimatedMutationChance: number;
}

export interface Clone {
  id: string;
  name: string;
  race: Race;
  element: Element;
  rarity: Rarity;
  stats: Stats;
  talents: Talent[];
  skills: Skill[];
  syncRate: number;
  awakeningLevel: number;
  createdAt: number;
  isFavorite: boolean;
}

export interface PlayerState {
  id: string;
  name: string;
  level: number;
  exp: number;
  skillLevel: number;
  gold: number;
  mana: number;
  geneSamples: GeneSample[];
  energyCores: EnergyCore[];
  potions: Potion[];
  clones: Clone[];
  currentSession: IncubationSession;
}
