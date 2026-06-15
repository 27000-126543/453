import type { IncubationSession, IncubationStatus } from '@/types';
import { generateId } from '@/utils';

export function createNewSession(): IncubationSession {
  return {
    id: null,
    status: 'idle' as IncubationStatus,
    geneSlots: [null, null, null],
    mainCore: null,
    auxCore: null,
    growth: 0,
    syncRate: 0,
    awakening: 0,
    startTime: null,
    lastFeedTime: null,
    events: [],
    estimatedStats: null,
    estimatedTalentChance: 20,
    estimatedMutationChance: 5,
  };
}

export function startCultivation(session: IncubationSession): IncubationSession {
  return {
    ...session,
    id: generateId(),
    status: 'cultivating',
    growth: 0,
    syncRate: 10,
    awakening: 5,
    startTime: Date.now(),
    lastFeedTime: Date.now(),
    events: [],
  };
}

export function tickSession(session: IncubationSession, deltaTime: number): IncubationSession {
  if (session.status !== 'cultivating') return session;

  const growthIncrement = 0.5 * deltaTime;
  const syncIncrement = 0.3 * deltaTime;
  const awakeningIncrement = 0.2 * deltaTime;

  const newGrowth = Math.min(session.growth + growthIncrement, 100);
  const newSyncRate = Math.min(session.syncRate + syncIncrement, 100);
  const newAwakening = Math.min(session.awakening + awakeningIncrement, 100);

  let newStatus: IncubationStatus = session.status;
  if (newGrowth >= 100 && newSyncRate >= 80) {
    newStatus = 'completed';
  }

  return {
    ...session,
    growth: newGrowth,
    syncRate: newSyncRate,
    awakening: newAwakening,
    status: newStatus,
    lastFeedTime: Date.now(),
  };
}
