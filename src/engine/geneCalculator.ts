import type { Stats, GeneSample, EnergyCore, IncubationSession } from '@/types';

const BASE_STATS: Stats = {
  strength: 10,
  agility: 10,
  magic: 10,
  constitution: 10,
  perception: 10,
  willpower: 10,
};

export function calculateStats(
  geneSlots: (GeneSample | null)[],
  mainCore: EnergyCore | null,
  auxCore: EnergyCore | null
): Stats {
  const stats: Stats = { ...BASE_STATS };

  for (const gene of geneSlots) {
    if (!gene) continue;
    for (const key of Object.keys(gene.statBonuses) as (keyof Stats)[]) {
      stats[key] += gene.statBonuses[key] ?? 0;
    }
  }

  if (mainCore?.effects.statBoost) {
    for (const key of Object.keys(mainCore.effects.statBoost) as (keyof Stats)[]) {
      stats[key] += mainCore.effects.statBoost[key] ?? 0;
    }
  }

  if (auxCore?.effects.statBoost) {
    for (const key of Object.keys(auxCore.effects.statBoost) as (keyof Stats)[]) {
      stats[key] += Math.floor((auxCore.effects.statBoost[key] ?? 0) * 0.5);
    }
  }

  return stats;
}

export function calculateTalentChance(
  mainCore: EnergyCore | null,
  auxCore: EnergyCore | null
): number {
  let chance = 20;
  if (mainCore?.effects.talentBonus) chance += mainCore.effects.talentBonus;
  if (auxCore?.effects.talentBonus) chance += Math.floor(auxCore.effects.talentBonus * 0.5);
  return Math.min(chance, 100);
}

export function calculateMutationChance(
  mainCore: EnergyCore | null,
  auxCore: EnergyCore | null
): number {
  let chance = 5;
  if (mainCore?.effects.mutationRate) chance += mainCore.effects.mutationRate;
  if (auxCore?.effects.mutationRate) chance += Math.floor(auxCore.effects.mutationRate * 0.5);
  return Math.min(chance, 100);
}

export function updateSessionEstimates(session: IncubationSession): IncubationSession {
  return {
    ...session,
    estimatedStats: calculateStats(session.geneSlots, session.mainCore, session.auxCore),
    estimatedTalentChance: calculateTalentChance(session.mainCore, session.auxCore),
    estimatedMutationChance: calculateMutationChance(session.mainCore, session.auxCore),
  };
}
