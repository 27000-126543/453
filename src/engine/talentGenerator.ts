import type { Talent, Stats, Skill, Clone, IncubationSession, Rarity, Race, Element } from '@/types';
import { talents as TALENTS } from '@/data/talents';
import { skills as SKILLS } from '@/data/skills';
import { generateId, weightedRandom } from '@/utils';

export function rollTalentRarity(): Rarity {
  const weights: Record<Rarity, number> = {
    common: 60,
    rare: 25,
    epic: 12,
    legendary: 3,
  };
  return weightedRandom(weights) as Rarity;
}

export function generateTalents(talentChance: number, awakening: number): Talent[] {
  const result: Talent[] = [];
  const selectedIds = new Set<string>();

  let talentCount = 0;
  const chance = talentChance / 100;

  if (Math.random() < chance * 0.3) talentCount = 3;
  else if (Math.random() < chance * 0.6) talentCount = 2;
  else if (Math.random() < chance * 0.9) talentCount = 1;
  else talentCount = 0;

  const rareBonus = awakening > 70 ? 0.15 : 0;

  for (let i = 0; i < talentCount; i++) {
    let rarity: Rarity;

    if (rareBonus > 0 && Math.random() < rareBonus) {
      const highRarityWeights: Record<Rarity, number> = {
        common: 20,
        rare: 35,
        epic: 30,
        legendary: 15,
      };
      rarity = weightedRandom(highRarityWeights) as Rarity;
    } else {
      rarity = rollTalentRarity();
    }

    const pool = TALENTS.filter((t) => t.rarity === rarity && !selectedIds.has(t.id));

    if (pool.length === 0) {
      const fallbackPool = TALENTS.filter((t) => !selectedIds.has(t.id));
      if (fallbackPool.length === 0) break;
      const fallback = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
      selectedIds.add(fallback.id);
      result.push(fallback);
    } else {
      const talent = pool[Math.floor(Math.random() * pool.length)];
      selectedIds.add(talent.id);
      result.push(talent);
    }
  }

  return result;
}

export function generateSkills(isMutated: boolean, count: number = 2): Skill[] {
  const result: Skill[] = [];
  const selectedIds = new Set<string>();

  const mutatedSkills = SKILLS.filter((s) => s.isMutated);

  let remaining = count;

  if (isMutated) {
    const mutationCount = Math.min(Math.ceil(count * 0.7), mutatedSkills.length);
    const shuffledMutated = [...mutatedSkills].sort(() => Math.random() - 0.5);

    for (let i = 0; i < mutationCount && remaining > 0; i++) {
      if (!selectedIds.has(shuffledMutated[i].id)) {
        selectedIds.add(shuffledMutated[i].id);
        result.push(shuffledMutated[i]);
        remaining--;
      }
    }
  }

  const remainingPool = [...SKILLS].filter((s) => !selectedIds.has(s.id)).sort(() => Math.random() - 0.5);

  for (let i = 0; i < remaining && i < remainingPool.length; i++) {
    result.push(remainingPool[i]);
  }

  return result;
}

const raceNames: Record<Race, string> = {
  human: '人类',
  elf: '精灵',
  orc: '兽人',
  dragon: '龙裔',
  undead: '亡灵',
  demon: '恶魔',
};

const elementNames: Record<Element, string> = {
  fire: '火焰',
  water: '水流',
  wind: '疾风',
  earth: '大地',
  light: '圣光',
  dark: '暗影',
  chaos: '混沌',
};

function calculateRarityFromStats(stats: Stats): Rarity {
  const total = stats.strength + stats.agility + stats.magic + stats.constitution + stats.perception + stats.willpower;

  if (total >= 500) return 'legendary';
  if (total >= 350) return 'epic';
  if (total >= 200) return 'rare';
  return 'common';
}

export function finalizeClone(session: IncubationSession): Clone {
  const multiplier = 0.8 + (session.awakening / 100) * 0.5;
  const baseStats = session.estimatedStats ?? {
    strength: 10,
    agility: 10,
    magic: 10,
    constitution: 10,
    perception: 10,
    willpower: 10,
  };

  const finalStats: Stats = {
    strength: Math.floor(baseStats.strength * multiplier),
    agility: Math.floor(baseStats.agility * multiplier),
    magic: Math.floor(baseStats.magic * multiplier),
    constitution: Math.floor(baseStats.constitution * multiplier),
    perception: Math.floor(baseStats.perception * multiplier),
    willpower: Math.floor(baseStats.willpower * multiplier),
  };

  const talents = generateTalents(session.estimatedTalentChance, session.awakening);

  const isMutated = session.estimatedMutationChance > 50 || Math.random() < session.estimatedMutationChance / 100;
  const skills = generateSkills(isMutated);

  const primaryGene = session.geneSlots.find((g) => g !== null);
  const race: Race = primaryGene?.race ?? 'human';
  const element: Element = session.mainCore?.element ?? 'light';

  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const name = `${elementNames[element]}${raceNames[race]}实验体#${randomNum}`;

  const rarity = calculateRarityFromStats(finalStats);
  const awakeningLevel = Math.floor(session.awakening / 20) + 1;

  return {
    id: generateId(),
    name,
    race,
    element,
    rarity,
    stats: finalStats,
    talents,
    skills,
    syncRate: session.syncRate,
    awakeningLevel,
    createdAt: Date.now(),
    isFavorite: false,
  };
}
