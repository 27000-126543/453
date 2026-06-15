import { create } from 'zustand';
import type {
  PlayerState,
  GeneSample,
  EnergyCore,
  IncubationEvent,
} from '@/types';
import { geneSamples as GENE_SAMPLES } from '@/data/geneSamples';
import { energyCores as ENERGY_CORES } from '@/data/energyCores';
import { potions as POTIONS } from '@/data/potions';
import * as geneCalc from '@/engine/geneCalculator';
import * as incubationEngine from '@/engine/incubationEngine';
import * as eventSystem from '@/engine/eventSystem';
import * as talentGenerator from '@/engine/talentGenerator';
import { generateId } from '@/utils';

interface GameState extends PlayerState {
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
  resetGame: () => void;
  loadState: (savedState: Partial<PlayerState>) => void;
}

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

const STORAGE_KEY = 'clone-lab-game-state';

const loadFromStorage = (): Partial<PlayerState> | null => {
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

const saveToStorage = (state: PlayerState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const useGameStore = create<GameState>((set) => ({
  ...createInitialPlayerState(),
  ...(loadFromStorage() ?? {}),

  updateEstimates: () => {
    set((state) => {
      const updatedSession = geneCalc.updateSessionEstimates(state.currentSession);
      saveToStorage({ ...state, currentSession: updatedSession });
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
      saveToStorage({ ...state, currentSession: updatedSession });
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
      saveToStorage({ ...state, currentSession: updatedSession });
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
      saveToStorage({ ...state, currentSession: updatedSession });
      return { currentSession: updatedSession };
    });
  },

  startCultivation: () => {
    set((state) => {
      if (state.currentSession.status === 'cultivating') return state;
      const updatedSession = incubationEngine.startCultivation(state.currentSession);
      saveToStorage({ ...state, currentSession: updatedSession });
      return { currentSession: updatedSession };
    });
  },

  tick: (deltaTime: number) => {
    set((state) => {
      if (state.currentSession.status !== 'cultivating') return state;
      const updatedSession = incubationEngine.tickSession(state.currentSession, deltaTime);
      saveToStorage({ ...state, currentSession: updatedSession });
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
      saveToStorage({ ...state, currentSession: updatedSession });
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
    const initial = createInitialPlayerState();
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
}));
