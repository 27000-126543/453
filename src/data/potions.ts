import type { Potion } from '@/types';

export const potions: Potion[] = [
  {
    id: 'potion-growth-001',
    name: '基础成长药剂',
    type: 'growth',
    rarity: 'common',
    effects: { growthBoost: 8 },
    quantity: 20,
    description: '最基础的成长药剂，能够略微加速克隆体的发育速度。',
    icon: '🧪'
  },
  {
    id: 'potion-growth-002',
    name: '强效成长药剂',
    type: 'growth',
    rarity: 'rare',
    effects: { growthBoost: 18 },
    quantity: 12,
    description: '经过改良的成长药剂，加速效果显著提升。',
    icon: '⚗️'
  },
  {
    id: 'potion-growth-003',
    name: '龙血成长剂',
    type: 'growth',
    rarity: 'epic',
    effects: { growthBoost: 35, eventAlteration: -5 },
    quantity: 6,
    description: '融合了幼龙血液的珍稀药剂，大幅加速成长同时降低负面事件概率。',
    icon: '🐲'
  },
  {
    id: 'potion-growth-004',
    name: '时间之露',
    type: 'growth',
    rarity: 'legendary',
    effects: { growthBoost: 60, eventAlteration: -10 },
    quantity: 3,
    description: '凝固时间之力的神秘液体，能让克隆体在短时间内完成百年成长。',
    icon: '⏳'
  },
  {
    id: 'potion-sync-001',
    name: '基础同步药剂',
    type: 'sync',
    rarity: 'common',
    effects: { syncBoost: 6 },
    quantity: 18,
    description: '基础的意识同步药剂，帮助克隆体与本体建立精神链接。',
    icon: '🧪'
  },
  {
    id: 'potion-sync-002',
    name: '心灵共鸣剂',
    type: 'sync',
    rarity: 'rare',
    effects: { syncBoost: 15, eventAlteration: 3 },
    quantity: 10,
    description: '强化版同步药剂，有效提升意识同步率。',
    icon: '💙'
  },
  {
    id: 'potion-sync-003',
    name: '灵魂契合剂',
    type: 'sync',
    rarity: 'epic',
    effects: { syncBoost: 30, awakeningBoost: 5 },
    quantity: 5,
    description: '以灵魂魔法炼制的高级药剂，大幅加深意识绑定。',
    icon: '🔗'
  },
  {
    id: 'potion-sync-004',
    name: '双生之血',
    type: 'sync',
    rarity: 'legendary',
    effects: { syncBoost: 50, awakeningBoost: 15 },
    quantity: 2,
    description: '传说中用双生子生命炼制的药剂，能让克隆体与本体达到完全同步。',
    icon: '🩸'
  },
  {
    id: 'potion-awakening-001',
    name: '基础觉醒药剂',
    type: 'awakening',
    rarity: 'common',
    effects: { awakeningBoost: 5 },
    quantity: 15,
    description: '基础的觉醒药剂，刺激克隆体的潜能觉醒。',
    icon: '🧪'
  },
  {
    id: 'potion-awakening-002',
    name: '星尘觉醒剂',
    type: 'awakening',
    rarity: 'rare',
    effects: { awakeningBoost: 14, syncBoost: 4 },
    quantity: 8,
    description: '混合了星辰之力的觉醒药剂，效果稳定可靠。',
    icon: '⭐'
  },
  {
    id: 'potion-awakening-003',
    name: '贤者之石精华',
    type: 'awakening',
    rarity: 'epic',
    effects: { awakeningBoost: 28, talentBonus: 5 },
    quantity: 4,
    description: '从贤者之石中提取的精华液，有几率触发稀有天赋。',
    icon: '💎'
  },
  {
    id: 'potion-awakening-004',
    name: '创世之泉',
    type: 'awakening',
    rarity: 'legendary',
    effects: { awakeningBoost: 55, talentBonus: 12 },
    quantity: 2,
    description: '世界诞生之初的第一滴水，能让任何生命觉醒最深层的潜能。',
    icon: '🌊'
  },
  {
    id: 'potion-catalyst-001',
    name: '基础催化剂',
    type: 'catalyst',
    rarity: 'common',
    effects: { growthBoost: 3, syncBoost: 3, awakeningBoost: 3 },
    quantity: 16,
    description: '通用型催化剂，对成长、同步、觉醒均有微弱加成。',
    icon: '🧪'
  },
  {
    id: 'potion-catalyst-002',
    name: '魔力催化剂',
    type: 'catalyst',
    rarity: 'rare',
    effects: { growthBoost: 8, syncBoost: 8, awakeningBoost: 8 },
    quantity: 9,
    description: '富含魔力的催化剂，全面提升培养效率。',
    icon: '✨'
  },
  {
    id: 'potion-catalyst-003',
    name: '混沌诱变剂',
    type: 'catalyst',
    rarity: 'epic',
    effects: { growthBoost: 15, syncBoost: 10, awakeningBoost: 12, eventAlteration: 15 },
    quantity: 5,
    description: '蕴含混沌能量的诱变剂，大幅提升培养速度但增加随机事件概率。',
    icon: '🌀'
  },
  {
    id: 'potion-catalyst-004',
    name: '命运之钥',
    type: 'catalyst',
    rarity: 'legendary',
    effects: { growthBoost: 30, syncBoost: 25, awakeningBoost: 30, talentBonus: 15, eventAlteration: -5 },
    quantity: 1,
    description: '传说中能改变命运的神秘药剂，全方位提升且降低负面事件风险。',
    icon: '🗝️'
  }
];
