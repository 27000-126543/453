import type { EnergyCore } from '@/types';

export const energyCores: EnergyCore[] = [
  {
    id: 'core-fire-001',
    name: '火焰精华',
    element: 'fire',
    rarity: 'common',
    energyConcentration: 60,
    effects: { statBoost: { strength: 3, magic: 5 } },
    description: '蕴含基础火元素能量的结晶，能为克隆体注入炽热之力。',
    icon: '🔥'
  },
  {
    id: 'core-fire-002',
    name: '炎魔之心',
    element: 'fire',
    rarity: 'rare',
    energyConcentration: 110,
    effects: { statBoost: { magic: 12, strength: 8 }, mutationRate: 5 },
    description: '从炎魔尸体中提取的核心，火焰之力狂暴且危险。',
    icon: '❤️‍🔥'
  },
  {
    id: 'core-fire-003',
    name: '凤凰涅槃核',
    element: 'fire',
    rarity: 'epic',
    energyConcentration: 160,
    effects: { statBoost: { magic: 20, constitution: 10 }, talentBonus: 8, mutationRate: 8 },
    description: '传说中凤凰涅槃遗留的核心，拥有浴火重生的力量。',
    icon: '🦅'
  },
  {
    id: 'core-water-001',
    name: '水之精华',
    element: 'water',
    rarity: 'common',
    energyConcentration: 55,
    effects: { statBoost: { magic: 4, constitution: 4 } },
    description: '蕴含基础水元素能量的结晶，带来治愈与流动之力。',
    icon: '💧'
  },
  {
    id: 'core-water-002',
    name: '深海之心',
    element: 'water',
    rarity: 'rare',
    energyConcentration: 105,
    effects: { statBoost: { magic: 10, willpower: 10 }, mutationRate: 4 },
    description: '来自万米深海的神秘结晶，蕴含无尽的水压与魔力。',
    icon: '🌊'
  },
  {
    id: 'core-water-003',
    name: '海神泪滴',
    element: 'water',
    rarity: 'epic',
    energyConcentration: 170,
    effects: { statBoost: { magic: 22, willpower: 15, perception: 8 }, talentBonus: 10 },
    description: '海神流下的一滴眼泪，蕴含操纵海洋的伟力。',
    icon: '🔱'
  },
  {
    id: 'core-wind-001',
    name: '风之精华',
    element: 'wind',
    rarity: 'common',
    energyConcentration: 50,
    effects: { statBoost: { agility: 5, perception: 3 } },
    description: '蕴含基础风元素能量的结晶，赋予敏捷与灵动。',
    icon: '🌬️'
  },
  {
    id: 'core-wind-002',
    name: '疾风之核',
    element: 'wind',
    rarity: 'rare',
    energyConcentration: 100,
    effects: { statBoost: { agility: 12, perception: 8 }, mutationRate: 6 },
    description: '凝聚了风暴之力的核心，速度快如闪电。',
    icon: '🌪️'
  },
  {
    id: 'core-wind-003',
    name: '天空之翼',
    element: 'wind',
    rarity: 'epic',
    energyConcentration: 165,
    effects: { statBoost: { agility: 22, perception: 14 }, talentBonus: 7, mutationRate: 6 },
    description: '天空之王的羽翼精华，能让持有者自由翱翔于云端。',
    icon: '🪽'
  },
  {
    id: 'core-earth-001',
    name: '土之精华',
    element: 'earth',
    rarity: 'common',
    energyConcentration: 65,
    effects: { statBoost: { strength: 4, constitution: 5 } },
    description: '蕴含基础土元素能量的结晶，赋予坚韧与稳重。',
    icon: '🪨'
  },
  {
    id: 'core-earth-002',
    name: '山岳之核',
    element: 'earth',
    rarity: 'rare',
    energyConcentration: 115,
    effects: { statBoost: { strength: 10, constitution: 14 }, mutationRate: 3 },
    description: '从山脉深处采集的核心，坚如磐石不可撼动。',
    icon: '⛰️'
  },
  {
    id: 'core-earth-003',
    name: '泰坦之心',
    element: 'earth',
    rarity: 'legendary',
    energyConcentration: 195,
    effects: { statBoost: { strength: 28, constitution: 25, willpower: 15 }, talentBonus: 12, mutationRate: 5 },
    description: '远古泰坦遗落的心脏，蕴含大地的本源之力。',
    icon: '🗿'
  },
  {
    id: 'core-light-001',
    name: '光之精华',
    element: 'light',
    rarity: 'common',
    energyConcentration: 70,
    effects: { statBoost: { magic: 4, willpower: 5 } },
    description: '蕴含基础光元素能量的结晶，带来神圣与净化之力。',
    icon: '✨'
  },
  {
    id: 'core-light-002',
    name: '圣光之核',
    element: 'light',
    rarity: 'rare',
    energyConcentration: 120,
    effects: { statBoost: { magic: 12, willpower: 12, perception: 6 }, talentBonus: 5 },
    description: '从圣光教堂祭坛下取得的核心，散发温暖的神圣光芒。',
    icon: '🌟'
  },
  {
    id: 'core-light-003',
    name: '神之眼',
    element: 'light',
    rarity: 'legendary',
    energyConcentration: 200,
    effects: { statBoost: { magic: 25, willpower: 22, perception: 20 }, talentBonus: 15 },
    description: '传说中神明遗落的眼球，能看穿一切虚妄。',
    icon: '👁️'
  },
  {
    id: 'core-dark-001',
    name: '暗之精华',
    element: 'dark',
    rarity: 'common',
    energyConcentration: 65,
    effects: { statBoost: { magic: 5, agility: 3 } },
    description: '蕴含基础暗元素能量的结晶，带来隐匿与暗影之力。',
    icon: '🌑'
  },
  {
    id: 'core-dark-002',
    name: '暗影之核',
    element: 'dark',
    rarity: 'rare',
    energyConcentration: 110,
    effects: { statBoost: { magic: 11, agility: 10, perception: 7 }, mutationRate: 7 },
    description: '凝聚了纯粹黑暗的核心，能融入任何阴影之中。',
    icon: '🌙'
  },
  {
    id: 'core-dark-003',
    name: '虚空之眼',
    element: 'dark',
    rarity: 'epic',
    energyConcentration: 175,
    effects: { statBoost: { magic: 24, perception: 16, agility: 12 }, talentBonus: 9, mutationRate: 12 },
    description: '来自虚空深渊的神秘眼球，能窥见世界的黑暗面。',
    icon: '🦴'
  },
  {
    id: 'core-chaos-001',
    name: '混沌碎片',
    element: 'chaos',
    rarity: 'rare',
    energyConcentration: 130,
    effects: { statBoost: { magic: 10, strength: 8 }, mutationRate: 15 },
    description: '不稳定的混沌能量碎片，使用需冒极大风险。',
    icon: '🌀'
  },
  {
    id: 'core-chaos-002',
    name: '虚空核心',
    element: 'chaos',
    rarity: 'epic',
    energyConcentration: 180,
    effects: { statBoost: { magic: 18, willpower: 14 }, talentBonus: 12, mutationRate: 20 },
    description: '来自扭曲虚空的能量核心，蕴含毁天灭地的混沌之力。',
    icon: '💫'
  },
  {
    id: 'core-chaos-003',
    name: '创世原核',
    element: 'chaos',
    rarity: 'legendary',
    energyConcentration: 200,
    effects: { statBoost: { strength: 20, magic: 30, willpower: 20 }, talentBonus: 20, mutationRate: 25 },
    description: '宇宙诞生之初遗留的原初混沌核心，拥有创造与毁灭的至高力量。',
    icon: '🌌'
  }
];
