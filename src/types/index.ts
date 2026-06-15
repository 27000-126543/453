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

// === 竞技大赛类型 ===
export type BattleStatus = 'idle' | 'team_setup' | 'matching' | 'battle' | 'finished';
export type BattleUnitType = 'player' | 'clone';
export type BattleLogType = 'attack' | 'skill' | 'heal' | 'switch' | 'special' | 'system';

export interface BattleUnit {
  id: string;
  type: BattleUnitType;
  name: string;
  race: Race;
  element: Element;
  maxHp: number;
  currentHp: number;
  stats: Stats;
  talents: Talent[];
  skills: Skill[];
  cooldowns: { [skillId: string]: number };
  syncRate: number;
  isActive: boolean;
}

export interface BattleTeam {
  player: BattleUnit;
  clones: BattleUnit[];
  activeUnitId: string;
  totalPower: number;
  specialCooldowns: {
    consciousnessTransfer: number;
    geneBurst: number;
  };
}

export interface BattleLogEntry {
  id: string;
  timestamp: number;
  type: BattleLogType;
  source: string;
  target: string;
  message: string;
  damage?: number;
  heal?: number;
  isCritical?: boolean;
}

export interface BattleReward {
  points: number;
  geneFragments: { sample: GeneSample; quantity: number }[];
  gold: number;
  exp: number;
}

export interface ArenaState {
  status: BattleStatus;
  selectedCloneIds: string[];
  myTeam: BattleTeam | null;
  enemyTeam: BattleTeam | null;
  battleLogs: BattleLogEntry[];
  currentRound: number;
  winner: 'player' | 'enemy' | null;
  reward: BattleReward | null;
  totalPoints: number;
  matchCount: number;
  winCount: number;
}

// === 交易市场类型 ===
export type ListingType = 'clone' | 'gene';

export interface MarketListing {
  id: string;
  sellerId: string;
  sellerName: string;
  type: ListingType;
  item: Clone | GeneSample;
  price: number;
  createdAt: number;
  expiresAt: number;
}

export interface TradeRecord {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  type: ListingType;
  itemName: string;
  itemRarity: Rarity;
  price: number;
  timestamp: number;
}

export interface PriceSuggestion {
  min: number;
  max: number;
  average: number;
  sevenDayAvg: number;
  trend: 'up' | 'down' | 'stable';
}

export interface GeneRevolutionEvent {
  id: string;
  startTime: number;
  endTime: number;
  successRateBonus: number;
  triggeredBy: string;
  itemName: string;
}

export interface MarketState {
  listings: MarketListing[];
  myListings: MarketListing[];
  tradeHistory: TradeRecord[];
  announcements: string[];
  geneRevolution: GeneRevolutionEvent | null;
}

// === 公会系统类型 ===
export type GuildRank = 'president' | 'vice_president' | 'tech_officer' | 'member';

export interface GuildPermissions {
  canApproveJoin: boolean;
  canKickMember: boolean;
  canEditInfo: boolean;
  canUpgradeBuilding: boolean;
  canManagePermissions: boolean;
}

export interface GuildMember {
  id: string;
  name: string;
  rank: GuildRank;
  permissions: GuildPermissions;
  contribution: {
    gold: number;
    materials: number;
    total: number;
  };
  joinDate: number;
  lastActive: number;
}

export interface GuildBuilding {
  id: 'cloning_workshop' | 'sync_tower';
  name: string;
  level: number;
  currentExp: number;
  requiredExp: number;
  bonus: {
    successRate: number;
    syncEfficiency: number;
  };
  description: string;
}

export interface GuildJoinRequest {
  id: string;
  playerId: string;
  playerName: string;
  playerLevel: number;
  message: string;
  timestamp: number;
}

export interface GuildState {
  id: string | null;
  name: string | null;
  level: number;
  announcement: string;
  members: GuildMember[];
  buildings: GuildBuilding[];
  joinRequests: GuildJoinRequest[];
  myRank: GuildRank | null;
  myPermissions: GuildPermissions | null;
}
