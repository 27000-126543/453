import type { GeneSample } from '@/types';

export const geneSamples: GeneSample[] = [
  {
    id: 'gene-human-001',
    name: '普通市民基因',
    race: 'human',
    rarity: 'common',
    statBonuses: { strength: 5, constitution: 5 },
    description: '来自普通人类市民的基因样本，属性均衡但潜力有限。',
    icon: '🧬'
  },
  {
    id: 'gene-human-002',
    name: '骑士基因',
    race: 'human',
    rarity: 'rare',
    statBonuses: { strength: 12, constitution: 10, willpower: 8 },
    description: '来自皇家骑士团的精英基因，拥有出色的战斗意志。',
    icon: '⚔️'
  },
  {
    id: 'gene-human-003',
    name: '大法师基因',
    race: 'human',
    rarity: 'epic',
    statBonuses: { magic: 20, perception: 15, willpower: 12 },
    description: '传说中大法师的珍贵基因，蕴含强大的魔力潜能。',
    icon: '🔮'
  },
  {
    id: 'gene-human-004',
    name: '圣者基因',
    race: 'human',
    rarity: 'legendary',
    statBonuses: { magic: 25, perception: 20, willpower: 20, constitution: 15 },
    description: '远古圣者留下的神圣基因，拥有突破凡人极限的力量。',
    icon: '✨'
  },
  {
    id: 'gene-elf-001',
    name: '森林精灵基因',
    race: 'elf',
    rarity: 'common',
    statBonuses: { agility: 6, perception: 5 },
    description: '普通森林精灵的基因，天生敏捷且感知敏锐。',
    icon: '🧬'
  },
  {
    id: 'gene-elf-002',
    name: '月光射手基因',
    race: 'elf',
    rarity: 'rare',
    statBonuses: { agility: 14, perception: 12, magic: 6 },
    description: '月光神殿精锐射手的基因，箭术精准如神。',
    icon: '🏹'
  },
  {
    id: 'gene-elf-003',
    name: '高等精灵基因',
    race: 'elf',
    rarity: 'epic',
    statBonuses: { magic: 18, agility: 15, perception: 14 },
    description: '高等精灵王室的纯正血脉，魔力与优雅并存。',
    icon: '🌙'
  },
  {
    id: 'gene-elf-004',
    name: '远古精灵王基因',
    race: 'elf',
    rarity: 'legendary',
    statBonuses: { magic: 28, agility: 22, perception: 20, willpower: 15 },
    description: '第一位精灵王的不朽基因，蕴含森林的本源力量。',
    icon: '👑'
  },
  {
    id: 'gene-orc-001',
    name: '兽人战士基因',
    race: 'orc',
    rarity: 'common',
    statBonuses: { strength: 7, constitution: 6 },
    description: '普通兽人战士的基因，体魄强健且好战。',
    icon: '🧬'
  },
  {
    id: 'gene-orc-002',
    name: '狂战士基因',
    race: 'orc',
    rarity: 'rare',
    statBonuses: { strength: 16, constitution: 12, agility: 6 },
    description: '部落狂战士的基因，战斗中能激发狂暴之力。',
    icon: '🪓'
  },
  {
    id: 'gene-orc-003',
    name: '兽人酋长基因',
    race: 'orc',
    rarity: 'epic',
    statBonuses: { strength: 22, constitution: 18, willpower: 12 },
    description: '兽人部落大酋长的基因，拥有统御万军的气魄。',
    icon: '🛡️'
  },
  {
    id: 'gene-orc-004',
    name: '战神后裔基因',
    race: 'orc',
    rarity: 'legendary',
    statBonuses: { strength: 30, constitution: 25, agility: 15, willpower: 18 },
    description: '兽人战神直系后裔的基因，力量足以撼动山岳。',
    icon: '🔥'
  },
  {
    id: 'gene-dragon-001',
    name: '龙人基因',
    race: 'dragon',
    rarity: 'rare',
    statBonuses: { strength: 10, constitution: 10, magic: 8 },
    description: '拥有稀薄龙族血脉的龙人基因，鳞片坚硬且魔力充沛。',
    icon: '🐉'
  },
  {
    id: 'gene-dragon-002',
    name: '幼龙基因',
    race: 'dragon',
    rarity: 'epic',
    statBonuses: { strength: 18, magic: 16, constitution: 14, perception: 10 },
    description: '幼年巨龙的珍贵基因，潜力无穷。',
    icon: '🐲'
  },
  {
    id: 'gene-dragon-003',
    name: '上古巨龙基因',
    race: 'dragon',
    rarity: 'legendary',
    statBonuses: { strength: 26, magic: 28, constitution: 24, willpower: 18 },
    description: '沉睡万年的上古巨龙基因，蕴含毁天灭地的力量。',
    icon: '💎'
  },
  {
    id: 'gene-undead-001',
    name: '骷髅战士基因',
    race: 'undead',
    rarity: 'common',
    statBonuses: { constitution: 6, willpower: 5 },
    description: '不死骷髅战士的基因，不知疲倦且无惧死亡。',
    icon: '🧬'
  },
  {
    id: 'gene-undead-002',
    name: '巫妖基因',
    race: 'undead',
    rarity: 'rare',
    statBonuses: { magic: 15, willpower: 12, perception: 8 },
    description: '巫妖的灵魂精华，掌握死灵魔法的奥秘。',
    icon: '💀'
  },
  {
    id: 'gene-undead-003',
    name: '死亡骑士基因',
    race: 'undead',
    rarity: 'epic',
    statBonuses: { strength: 16, magic: 14, willpower: 18, constitution: 14 },
    description: '堕落圣骑士转化的死亡骑士基因，剑术与死灵魔法双修。',
    icon: '⚰️'
  },
  {
    id: 'gene-undead-004',
    name: '巫妖王基因',
    race: 'undead',
    rarity: 'legendary',
    statBonuses: { magic: 30, willpower: 26, constitution: 20, perception: 16 },
    description: '统御亡灵大军的巫妖王基因，死亡之力的极致。',
    icon: '👑'
  },
  {
    id: 'gene-demon-001',
    name: '低阶恶魔基因',
    race: 'demon',
    rarity: 'common',
    statBonuses: { strength: 6, magic: 5 },
    description: '来自深渊的低阶恶魔基因，带有混沌的气息。',
    icon: '🧬'
  },
  {
    id: 'gene-demon-002',
    name: '炎魔基因',
    race: 'demon',
    rarity: 'rare',
    statBonuses: { magic: 16, strength: 10, willpower: 10 },
    description: '深渊炎魔的基因，体内燃烧着永恒的地狱之火。',
    icon: '🔥'
  },
  {
    id: 'gene-demon-003',
    name: '梦魇女妖基因',
    race: 'demon',
    rarity: 'epic',
    statBonuses: { magic: 20, perception: 16, agility: 14, willpower: 12 },
    description: '梦魇女妖的基因，擅长操控梦境与心灵。',
    icon: '😈'
  },
  {
    id: 'gene-demon-004',
    name: '深渊领主基因',
    race: 'demon',
    rarity: 'legendary',
    statBonuses: { magic: 32, strength: 22, willpower: 24, perception: 18 },
    description: '深渊第七层领主的基因，混沌与毁灭的化身。',
    icon: '🦇'
  }
];
