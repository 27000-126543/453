import { create } from 'zustand';
import type {
  PlayerState,
  GeneSample,
  EnergyCore,
  IncubationEvent,
  ArenaState,
  MarketState,
  GuildState,
  Clone,
  MarketListing,
  GuildRank,
  BattleLogEntry,
  BattleStatus,
} from '@/types';
import { geneSamples as GENE_SAMPLES } from '@/data/geneSamples';
import { energyCores as ENERGY_CORES } from '@/data/energyCores';
import { potions as POTIONS } from '@/data/potions';
import * as geneCalc from '@/engine/geneCalculator';
import * as incubationEngine from '@/engine/incubationEngine';
import * as eventSystem from '@/engine/eventSystem';
import * as talentGenerator from '@/engine/talentGenerator';
import * as battleEngine from '@/engine/battleEngine';
import * as tradeEngine from '@/engine/tradeEngine';
import * as guildEngine from '@/engine/guildEngine';
import { generateId } from '@/utils';

interface GameState extends PlayerState {
  arena: ArenaState;
  market: MarketState;
  guild: GuildState;

  updateEstimates: () => void;
  setGeneSlot: (index: number, sample: GeneSample | null) => void;
  setMainCore: (core: EnergyCore | null) => void;
  setAuxCore: (core: EnergyCore | null) => void;
  startCultivation: () => void;
  tick: (deltaTime: number) => void;
  injectPotion: (potionId: string) => void;
  addEvent: (event: IncubationEvent) => void;
  finalizeClone: () => void;
  addExp: (amount: number) => void;
  toggleFavorite: (cloneId: string) => void;
  addGold: (amount: number) => void;
  resetGame: () => void;
  loadState: (savedState: Partial<PlayerState>) => void;

  toggleArenaCloneSelection: (cloneId: string) => void;
  startMatch: () => void;
  battleTick: (deltaTime: number) => void;
  switchActiveUnit: (unitId: string) => void;
  useSkill: (skillId: string, targetId?: string) => void;
  useConsciousnessTransfer: () => void;
  useGeneBurst: (targetId: string) => void;
  claimReward: () => void;
  resetArena: () => void;

  createListing: (item: Clone | GeneSample, price: number, duration?: number) => void;
  cancelListing: (listingId: string) => void;
  buyListing: (listing: MarketListing) => void;

  createGuild: (name: string) => void;
  approveJoin: (requestId: string) => void;
  rejectJoin: (requestId: string) => void;
  contributeToGuild: (gold: number, materials: number) => void;
  upgradeBuilding: (buildingId: string) => void;
  setMemberRank: (memberId: string, rank: GuildRank) => void;
  kickMember: (memberId: string) => void;
  leaveGuild: () => void;
  getGuildSuccessRateBonus: () => number;
  getGuildSyncBonus: () => number;
}

const createInitialArenaState = (): ArenaState => ({
  status: 'idle',
  selectedCloneIds: [],
  myTeam: null,
  enemyTeam: null,
  battleLogs: [],
  currentRound: 0,
  winner: null,
  reward: null,
  totalPoints: 0,
  matchCount: 0,
  winCount: 0,
});

const createInitialMarketState = (): MarketState => ({
  listings: [],
  myListings: [],
  tradeHistory: [],
  announcements: [
    '欢迎来到克隆交易市场！快来发现稀有基因吧~',
    '限时活动：传说级克隆体交易免手续费！',
  ],
  geneRevolution: null,
});

const createInitialGuildState = (): GuildState => ({
  id: null,
  name: null,
  level: 1,
  announcement: '',
  members: [],
  buildings: [],
  joinRequests: [],
  myRank: null,
  myPermissions: null,
});

const createInitialPlayerState = (): PlayerState => ({
  id: generateId(),
  name: '神秘研究员',
  level: 1,
  exp: 0,
  skillLevel: 1,
  gold: 1000,
  mana: 500,
  geneSamples: GENE_SAMPLES.slice(0, 12),
  energyCores: ENERGY_CORES.slice(0, 10),
  potions: POTIONS.slice(0, 8),
  clones: [],
  currentSession: incubationEngine.createNewSession(),
});

const STORAGE_KEY = 'clone-lab-game-state-v2';

type FullState = PlayerState & { arena: ArenaState; market: MarketState; guild: GuildState };

const loadFromStorage = (): Partial<FullState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    return null;
  }
  return null;
};

const saveToStorage = (state: FullState) => {
  try {
    const toSave: FullState = {
      id: state.id,
      name: state.name,
      level: state.level,
      exp: state.exp,
      skillLevel: state.skillLevel,
      gold: state.gold,
      mana: state.mana,
      geneSamples: state.geneSamples,
      energyCores: state.energyCores,
      potions: state.potions,
      clones: state.clones,
      currentSession: state.currentSession,
      arena: state.arena,
      market: state.market,
      guild: state.guild,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
};

export const useGameStore = create<GameState>((set, get) => {
  const initialState: FullState = {
    ...createInitialPlayerState(),
    arena: createInitialArenaState(),
    market: createInitialMarketState(),
    guild: createInitialGuildState(),
    ...(loadFromStorage() ?? {}),
  };

  return {
    ...initialState,

    updateEstimates: () => {
      set((state) => {
        const updatedSession = geneCalc.updateSessionEstimates(state.currentSession);
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    setGeneSlot: (index: number, sample: GeneSample | null) => {
      set((state) => {
        if (index < 0 || index > 2) return state;
        const newSlots = [...state.currentSession.geneSlots] as [
          GeneSample | null,
          GeneSample | null,
          GeneSample | null
        ];
        newSlots[index] = sample;
        const updatedSession = geneCalc.updateSessionEstimates({
          ...state.currentSession,
          geneSlots: newSlots,
          status: state.currentSession.status === 'idle' ? 'configuring' : state.currentSession.status,
        });
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    setMainCore: (core: EnergyCore | null) => {
      set((state) => {
        const updatedSession = geneCalc.updateSessionEstimates({
          ...state.currentSession,
          mainCore: core,
          status: state.currentSession.status === 'idle' ? 'configuring' : state.currentSession.status,
        });
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    setAuxCore: (core: EnergyCore | null) => {
      set((state) => {
        const updatedSession = geneCalc.updateSessionEstimates({
          ...state.currentSession,
          auxCore: core,
          status: state.currentSession.status === 'idle' ? 'configuring' : state.currentSession.status,
        });
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    startCultivation: () => {
      set((state) => {
        if (state.currentSession.status === 'cultivating') return state;
        const updatedSession = incubationEngine.startCultivation(state.currentSession);
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    tick: (deltaTime: number) => {
      set((state) => {
        if (state.currentSession.status !== 'cultivating') return state;
        const updatedSession = incubationEngine.tickSession(state.currentSession, deltaTime);
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    injectPotion: (potionId: string) => {
      set((state) => {
        const potionIndex = state.potions.findIndex((p) => p.id === potionId);
        if (potionIndex === -1) return state;

        const potion = state.potions[potionIndex];
        if (potion.quantity <= 0) return state;

        const newPotions = [...state.potions];
        newPotions[potionIndex] = {
          ...potion,
          quantity: potion.quantity - 1,
        };

        const session = { ...state.currentSession };
        const effects = potion.effects;

        if (effects.growthBoost) {
          session.growth = Math.min(100, session.growth + effects.growthBoost);
        }
        if (effects.syncBoost) {
          session.syncRate = Math.min(100, session.syncRate + effects.syncBoost);
        }
        if (effects.awakeningBoost) {
          session.awakening = Math.min(100, session.awakening + effects.awakeningBoost);
        }
        if (effects.talentBonus) {
          session.estimatedTalentChance = Math.min(
            100,
            session.estimatedTalentChance + effects.talentBonus
          );
        }

        const newState = { ...state, potions: newPotions, currentSession: session };
        saveToStorage(newState);
        return newState;
      });
    },

    addEvent: (event: IncubationEvent) => {
      set((state) => {
        const updatedSession = eventSystem.applyEvent(state.currentSession, event);
        const newState = { ...state, currentSession: updatedSession };
        saveToStorage(newState);
        return { currentSession: updatedSession };
      });
    },

    finalizeClone: () => {
      set((state) => {
        if (state.currentSession.status !== 'completed') return state;
        const newClone = talentGenerator.finalizeClone(state.currentSession);
        const newClones = [...state.clones, newClone];
        const newSession = incubationEngine.createNewSession();
        const expGain = 50 + newClone.awakeningLevel * 20;
        const goldGain = 100 + (newClone.rarity === 'legendary' ? 500 : newClone.rarity === 'epic' ? 200 : newClone.rarity === 'rare' ? 100 : 0);

        const newExp = state.exp + expGain;
        const expToLevel = state.level * 100;
        const levelUp = newExp >= expToLevel;

        const newState = {
          ...state,
          clones: newClones,
          currentSession: newSession,
          exp: levelUp ? newExp - expToLevel : newExp,
          level: levelUp ? state.level + 1 : state.level,
          gold: state.gold + goldGain,
        };
        saveToStorage(newState);
        return newState;
      });
    },

    addExp: (amount: number) => {
      set((state) => {
        const newExp = state.exp + amount;
        const expToLevel = state.level * 100;
        if (newExp >= expToLevel) {
          const newState = {
            ...state,
            exp: newExp - expToLevel,
            level: state.level + 1,
          };
          saveToStorage(newState);
          return newState;
        }
        const newState = { ...state, exp: newExp };
        saveToStorage(newState);
        return newState;
      });
    },

    addGold: (amount: number) => {
      set((state) => {
        const newState = { ...state, gold: Math.max(0, state.gold + amount) };
        saveToStorage(newState);
        return newState;
      });
    },

    toggleFavorite: (cloneId: string) => {
      set((state) => {
        const newClones = state.clones.map((c) =>
          c.id === cloneId ? { ...c, isFavorite: !c.isFavorite } : c
        );
        const newState = { ...state, clones: newClones };
        saveToStorage(newState);
        return newState;
      });
    },

    resetGame: () => {
      const initial: FullState = {
        ...createInitialPlayerState(),
        arena: createInitialArenaState(),
        market: createInitialMarketState(),
        guild: createInitialGuildState(),
      };
      localStorage.removeItem(STORAGE_KEY);
      set(initial);
    },

    loadState: (savedState: Partial<PlayerState>) => {
      set((state) => {
        const newState = { ...state, ...savedState };
        saveToStorage(newState);
        return newState;
      });
    },

    toggleArenaCloneSelection: (cloneId: string) => {
      set((state) => {
        const selected = [...state.arena.selectedCloneIds];
        const idx = selected.indexOf(cloneId);
        if (idx >= 0) {
          selected.splice(idx, 1);
        } else {
          if (selected.length >= 2) {
            selected.shift();
          }
          selected.push(cloneId);
        }
        return {
          arena: {
            ...state.arena,
            selectedCloneIds: selected,
            status: selected.length > 0 ? 'team_setup' : 'idle',
          },
        };
      });
    },

    startMatch: () => {
      set((state) => {
        const selectedClones = state.clones.filter(c => state.arena.selectedCloneIds.includes(c.id));
        if (selectedClones.length === 0) return state;

        const myTeam = battleEngine.buildBattleTeam(
          { id: state.id, name: state.name, level: state.level, skillLevel: state.skillLevel },
          selectedClones
        );

        const enemyTeam = battleEngine.findMatch(myTeam);

        const log: BattleLogEntry = {
          id: generateId(),
          timestamp: Date.now(),
          type: 'system',
          source: 'system',
          target: 'all',
          message: `匹配成功！对手是 ${enemyTeam.player.name}，战力 ${enemyTeam.totalPower}`,
        };

        const newState = {
          ...state,
          arena: {
            ...state.arena,
            status: 'battle' as const,
            myTeam,
            enemyTeam,
            battleLogs: [log],
            currentRound: state.arena.currentRound + 1,
            winner: null,
            reward: null,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    battleTick: (deltaTime: number) => {
      set((state) => {
        if (state.arena.status !== 'battle' || !state.arena.myTeam || !state.arena.enemyTeam) return state;

        const result = battleEngine.processBattleTick(
          state.arena.myTeam,
          state.arena.enemyTeam,
          state.arena.battleLogs,
          deltaTime
        );

        let winner: 'player' | 'enemy' | null = state.arena.winner;
        let status: BattleStatus = state.arena.status;
        let reward = state.arena.reward;
        let matchCount = state.arena.matchCount;
        let winCount = state.arena.winCount;
        let totalPoints = state.arena.totalPoints;

        if (result.isFinished) {
          winner = battleEngine.getWinner(result.myTeam, result.enemyTeam);
          status = 'finished';
          matchCount += 1;
          if (winner) {
            winCount += winner === 'player' ? 1 : 0;
            reward = battleEngine.calculateReward(winner, result.myTeam, result.enemyTeam, state.arena.currentRound);
            totalPoints += reward.points;
          }
        }

        const newState = {
          ...state,
          arena: {
            ...state.arena,
            myTeam: result.myTeam,
            enemyTeam: result.enemyTeam,
            battleLogs: result.logs,
            status,
            winner,
            reward,
            matchCount,
            winCount,
            totalPoints,
          },
        };
        if (result.isFinished) {
          saveToStorage(newState);
        }
        return newState;
      });
    },

    switchActiveUnit: (unitId: string) => {
      set((state) => {
        if (!state.arena.myTeam) return state;
        const updatedTeam = battleEngine.switchActiveUnit(state.arena.myTeam, unitId);

        const units = [updatedTeam.player, ...updatedTeam.clones];
        const newActive = units.find(u => u.id === unitId);

        const log: BattleLogEntry = {
          id: generateId(),
          timestamp: Date.now(),
          type: 'switch',
          source: updatedTeam.activeUnitId,
          target: unitId,
          message: `切换主控至 ${newActive?.name || unitId}`,
        };

        return {
          arena: {
            ...state.arena,
            myTeam: updatedTeam,
            battleLogs: [...state.arena.battleLogs, log],
          },
        };
      });
    },

    useSkill: (skillId: string, targetId?: string) => {
      set((state) => {
        if (!state.arena.myTeam || !state.arena.enemyTeam) return state;

        const myUnits = [state.arena.myTeam.player, ...state.arena.myTeam.clones];
        const enemyUnits = [state.arena.enemyTeam.player, ...state.arena.enemyTeam.clones];
        const activeUnit = myUnits.find(u => u.id === state.arena.myTeam.activeUnitId);
        if (!activeUnit) return state;

        const skill = activeUnit.skills.find(s => s.id === skillId);
        if (!skill || activeUnit.cooldowns[skillId] > 0) return state;

        let target;
        if (targetId) {
          target = myUnits.find(u => u.id === targetId) || enemyUnits.find(u => u.id === targetId);
        }

        if (!target) {
          if (skill.name === '治愈术') {
            target = activeUnit;
          } else {
            target = enemyUnits.find(u => u.id === state.arena.enemyTeam.activeUnitId);
          }
        }
        if (!target) return state;

        const result = battleEngine.executeSkill(activeUnit, skill, target);

        const updatedMyTeam = JSON.parse(JSON.stringify(state.arena.myTeam));
        const updatedEnemyTeam = JSON.parse(JSON.stringify(state.arena.enemyTeam));

        const applyUnitUpdate = (unit: typeof result.updatedAttacker) => {
          const isEnemy = enemyUnits.some(u => u.id === unit.id);
          const team = isEnemy ? updatedEnemyTeam : updatedMyTeam;
          if (unit.type === 'player') {
            team.player = unit;
          } else {
            const idx = team.clones.findIndex((c: any) => c.id === unit.id);
            if (idx !== -1) {
              team.clones[idx] = unit;
            }
          }
        };

        applyUnitUpdate(result.updatedAttacker);
        applyUnitUpdate(result.updatedTarget);

        return {
          arena: {
            ...state.arena,
            myTeam: updatedMyTeam,
            enemyTeam: updatedEnemyTeam,
            battleLogs: [...state.arena.battleLogs, result.log],
          },
        };
      });
    },

    useConsciousnessTransfer: () => {
      set((state) => {
        if (!state.arena.myTeam) return state;
        const result = battleEngine.useConsciousnessTransfer(state.arena.myTeam);
        return {
          arena: {
            ...state.arena,
            myTeam: result.team,
            battleLogs: [...state.arena.battleLogs, result.log],
          },
        };
      });
    },

    useGeneBurst: (targetId: string) => {
      set((state) => {
        if (!state.arena.myTeam || !state.arena.enemyTeam) return state;

        const enemyUnits = [state.arena.enemyTeam.player, ...state.arena.enemyTeam.clones];
        const target = enemyUnits.find(u => u.id === targetId);
        if (!target) return state;

        const result = battleEngine.useGeneBurst(state.arena.myTeam, target);

        const updatedEnemyTeam = { ...state.arena.enemyTeam };
        if (result.updatedTarget.type === 'player') {
          updatedEnemyTeam.player = result.updatedTarget;
        } else {
          const idx = updatedEnemyTeam.clones.findIndex(c => c.id === result.updatedTarget.id);
          if (idx !== -1) {
            updatedEnemyTeam.clones[idx] = result.updatedTarget;
          }
        }

        return {
          arena: {
            ...state.arena,
            enemyTeam: updatedEnemyTeam,
            battleLogs: [...state.arena.battleLogs, ...result.logs],
          },
        };
      });
    },

    claimReward: () => {
      set((state) => {
        if (!state.arena.reward) return state;

        const reward = state.arena.reward;
        const newExp = state.exp + reward.exp;
        const expToLevel = state.level * 100;
        const levelUp = newExp >= expToLevel;

        const newGold = state.gold + reward.gold;

        let newGeneSamples = [...state.geneSamples];
        reward.geneFragments.forEach(fg => {
          newGeneSamples.push({ ...fg.sample, id: `${fg.sample.id}-${generateId()}` });
        });

        const newState = {
          ...state,
          exp: levelUp ? newExp - expToLevel : newExp,
          level: levelUp ? state.level + 1 : state.level,
          gold: newGold,
          geneSamples: newGeneSamples,
          arena: {
            ...state.arena,
            status: 'idle' as const,
            selectedCloneIds: [],
            myTeam: null,
            enemyTeam: null,
            battleLogs: [],
            winner: null,
            reward: null,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    resetArena: () => {
      set((state) => {
        const newState = {
          ...state,
          arena: {
            ...state.arena,
            status: 'idle' as const,
            selectedCloneIds: [],
            myTeam: null,
            enemyTeam: null,
            battleLogs: [],
            winner: null,
            reward: null,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    createListing: (item: Clone | GeneSample, price: number, duration: number = 24) => {
      set((state) => {
        const listing = tradeEngine.createListing(
          { id: state.id, name: state.name },
          item,
          price,
          duration
        );

        const isCloneItem = 'syncRate' in item;
        const newClones = isCloneItem
          ? state.clones.filter(c => c.id !== item.id)
          : state.clones;
        const newGeneSamples = !isCloneItem
          ? state.geneSamples.filter(g => g.id !== item.id)
          : state.geneSamples;

        const newState = {
          ...state,
          clones: newClones,
          geneSamples: newGeneSamples,
          market: {
            ...state.market,
            listings: [...state.market.listings, listing],
            myListings: [...state.market.myListings, listing],
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    cancelListing: (listingId: string) => {
      set((state) => {
        const listing = state.market.myListings.find(l => l.id === listingId);
        if (!listing) return state;

        const updatedListings = tradeEngine.cancelListing(listingId, state.id, state.market.listings);
        const updatedMyListings = tradeEngine.cancelListing(listingId, state.id, state.market.myListings);

        let newClones = state.clones;
        let newGeneSamples = state.geneSamples;

        if ('syncRate' in listing.item) {
          newClones = [...state.clones, listing.item as Clone];
        } else {
          newGeneSamples = [...state.geneSamples, listing.item as GeneSample];
        }

        const newState = {
          ...state,
          clones: newClones,
          geneSamples: newGeneSamples,
          market: {
            ...state.market,
            listings: updatedListings,
            myListings: updatedMyListings,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    buyListing: (listing: MarketListing) => {
      set((state) => {
        const result = tradeEngine.executeTrade(
          { id: state.id, name: state.name, gold: state.gold },
          listing
        );

        if (!result.success || !result.record) {
          alert(result.message);
          return state;
        }

        const updatedListings = state.market.listings.filter(l => l.id !== listing.id);
        const updatedMyListings = state.market.myListings.filter(l => l.id !== listing.id);

        let newClones = state.clones;
        let newGeneSamples = state.geneSamples;

        if ('syncRate' in listing.item) {
          newClones = [...state.clones, { ...(listing.item as Clone), id: `${listing.item.id}-${generateId()}` }];
        } else {
          newGeneSamples = [...state.geneSamples, { ...(listing.item as GeneSample), id: `${listing.item.id}-${generateId()}` }];
        }

        const newHistory = [...state.market.tradeHistory, result.record];
        const announcement = tradeEngine.generateAnnouncement(result.record);
        const newAnnouncements = [announcement, ...state.market.announcements].slice(0, 20);

        const geneRevolution = tradeEngine.checkGeneRevolution(newHistory, state.market.geneRevolution);

        const newState = {
          ...state,
          gold: result.remainingGold,
          clones: newClones,
          geneSamples: newGeneSamples,
          market: {
            ...state.market,
            listings: updatedListings,
            myListings: updatedMyListings,
            tradeHistory: newHistory,
            announcements: newAnnouncements,
            geneRevolution,
          },
        };
        saveToStorage(newState);

        if (geneRevolution && !state.market.geneRevolution) {
          setTimeout(() => {
            alert(`🎉 基因革命事件触发！${geneRevolution.triggeredBy}购买的${geneRevolution.itemName}引发了全服克隆热潮，成功率提升${Math.round(geneRevolution.successRateBonus * 100)}%，持续24小时！`);
          }, 100);
        }

        return newState;
      });
    },

    createGuild: (name: string) => {
      set((state) => {
        if (state.guild.id) return state;
        const guild = guildEngine.createGuild({ id: state.id, name: state.name }, name);
        const newState = { ...state, guild };
        saveToStorage(newState);
        return newState;
      });
    },

    approveJoin: (requestId: string) => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        const request = state.guild.joinRequests.find(r => r.id === requestId);
        if (!myMember || !request) return state;

        const result = guildEngine.approveJoin(request, myMember, state.guild.members);
        if (!result.success || !result.newMember) {
          alert(result.message);
          return state;
        }

        const newState = {
          ...state,
          guild: {
            ...state.guild,
            members: [...state.guild.members, result.newMember],
            joinRequests: state.guild.joinRequests.filter(r => r.id !== requestId),
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    rejectJoin: (requestId: string) => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        if (!myMember) return state;

        const result = guildEngine.rejectJoin(requestId, myMember);
        if (!result.success) {
          alert(result.message);
          return state;
        }

        return {
          guild: {
            ...state.guild,
            joinRequests: state.guild.joinRequests.filter(r => r.id !== requestId),
          },
        };
      });
    },

    contributeToGuild: (gold: number, materials: number) => {
      set((state) => {
        if (!state.guild.id) return state;
        if (state.gold < gold) {
          alert('金币不足');
          return state;
        }

        const result = guildEngine.contributeResources(
          state.id,
          gold,
          materials,
          state.guild.members,
          state.guild.buildings
        );

        const newState = {
          ...state,
          gold: state.gold - gold,
          guild: {
            ...state.guild,
            members: result.members,
            buildings: result.buildings,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    upgradeBuilding: (buildingId: string) => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        const building = state.guild.buildings.find(b => b.id === buildingId);
        if (!myMember || !building) return state;

        const result = guildEngine.upgradeBuilding(building, myMember);
        if (!result.success) {
          alert(result.message);
          return state;
        }

        const newBuildings = state.guild.buildings.map(b =>
          b.id === buildingId ? result.building : b
        );

        const newState = {
          ...state,
          guild: {
            ...state.guild,
            buildings: newBuildings,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    setMemberRank: (memberId: string, rank: GuildRank) => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        if (!myMember) return state;

        const result = guildEngine.setMemberRank(memberId, rank, myMember, state.guild.members);
        if (!result.success) {
          alert(result.message);
          return state;
        }

        let myRank = state.guild.myRank;
        let myPermissions = state.guild.myPermissions;
        if (memberId === state.id) {
          myRank = rank;
          myPermissions = guildEngine.getPermissionsByRank(rank);
        }

        const newState = {
          ...state,
          guild: {
            ...state.guild,
            members: result.members,
            myRank,
            myPermissions,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    kickMember: (memberId: string) => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        if (!myMember) return state;

        const result = guildEngine.kickMember(memberId, myMember, state.guild.members);
        if (!result.success) {
          alert(result.message);
          return state;
        }

        const newState = {
          ...state,
          guild: {
            ...state.guild,
            members: result.members,
          },
        };
        saveToStorage(newState);
        return newState;
      });
    },

    leaveGuild: () => {
      set((state) => {
        if (!state.guild.id) return state;
        const myMember = state.guild.members.find(m => m.id === state.id);
        if (myMember?.rank === 'president') {
          alert('会长不能直接退出公会，请先转让会长职位');
          return state;
        }

        const newMembers = state.guild.members.filter(m => m.id !== state.id);
        const newState = {
          ...state,
          guild: createInitialGuildState(),
        };
        saveToStorage(newState);
        alert('已退出公会');
        return newState;
      });
    },

    getGuildSuccessRateBonus: () => {
      const state = get();
      if (!state.guild.id) return 0;
      return guildEngine.getGuildBonuses(state.guild).successRateBonus;
    },

    getGuildSyncBonus: () => {
      const state = get();
      if (!state.guild.id) return 0;
      return guildEngine.getGuildBonuses(state.guild).syncBonus;
    },
  };
});
