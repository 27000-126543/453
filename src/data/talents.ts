import type { Talent } from '@/types';

export const talents: Talent[] = [
  {
    id: 'talent-001',
    name: '力量强化',
    rarity: 'common',
    isRare: false,
    effect: '力量属性永久+10%',
    statModifiers: { strength: 10 },
    description: '基础天赋，通过后天锻炼获得的肌肉力量强化。'
  },
  {
    id: 'talent-002',
    name: '敏捷身手',
    rarity: 'common',
    isRare: false,
    effect: '敏捷属性永久+10%',
    statModifiers: { agility: 10 },
    description: '基础天赋，灵活的身体能够更快速地躲避攻击。'
  },
  {
    id: 'talent-003',
    name: '魔力亲和',
    rarity: 'common',
    isRare: false,
    effect: '魔力属性永久+10%',
    statModifiers: { magic: 10 },
    description: '基础天赋，对魔法元素天生有着不错的亲和力。'
  },
  {
    id: 'talent-004',
    name: '强健体魄',
    rarity: 'common',
    isRare: false,
    effect: '体质属性永久+10%',
    statModifiers: { constitution: 10 },
    description: '基础天赋，拥有比常人更加强健的体格。'
  },
  {
    id: 'talent-005',
    name: '敏锐直觉',
    rarity: 'common',
    isRare: false,
    effect: '感知属性永久+10%',
    statModifiers: { perception: 10 },
    description: '基础天赋，直觉比一般人要敏锐一些。'
  },
  {
    id: 'talent-006',
    name: '钢铁意志',
    rarity: 'common',
    isRare: false,
    effect: '意志属性永久+10%',
    statModifiers: { willpower: 10 },
    description: '基础天赋，拥有不屈不挠的精神力量。'
  },
  {
    id: 'talent-007',
    name: '战斗本能',
    rarity: 'rare',
    isRare: false,
    effect: '力量+15%，敏捷+10%',
    statModifiers: { strength: 15, agility: 10 },
    description: '在战斗中能够本能地做出最优反应，攻防一体。'
  },
  {
    id: 'talent-008',
    name: '元素感知',
    rarity: 'rare',
    isRare: false,
    effect: '魔力+15%，感知+10%',
    statModifiers: { magic: 15, perception: 10 },
    description: '能够感知周围元素的流动，施法更加精准。'
  },
  {
    id: 'talent-009',
    name: '不屈之魂',
    rarity: 'rare',
    isRare: false,
    effect: '体质+15%，意志+10%',
    statModifiers: { constitution: 15, willpower: 10 },
    description: '即使面临绝境也绝不放弃，越战越勇。'
  },
  {
    id: 'talent-010',
    name: '快速恢复',
    rarity: 'rare',
    isRare: false,
    effect: '体质+20%，受伤后恢复速度提升30%',
    statModifiers: { constitution: 20 },
    description: '身体的新陈代谢远超常人，伤口能够快速愈合。'
  },
  {
    id: 'talent-011',
    name: '魔法天赋',
    rarity: 'rare',
    isRare: false,
    effect: '魔力+20%，魔法学习效率提升25%',
    statModifiers: { magic: 20 },
    description: '在魔法方面展现出过人的天赋，学习新法术事半功倍。'
  },
  {
    id: 'talent-012',
    name: '鹰眼',
    rarity: 'rare',
    isRare: false,
    effect: '感知+20%，远程攻击命中率提升15%',
    statModifiers: { perception: 20 },
    description: '视力远超常人，能够清晰看到数公里外的目标。'
  },
  {
    id: 'talent-013',
    name: '双倍感知',
    rarity: 'epic',
    isRare: true,
    effect: '感知属性永久+50%，可同时感知多个目标',
    statModifiers: { perception: 50 },
    description: '传说级稀有天赋，拥有者的感知能力是常人的数倍，能够同时捕捉周围数十个目标的动向，甚至能预判对手的下一步行动。'
  },
  {
    id: 'talent-014',
    name: '同步超载',
    rarity: 'epic',
    isRare: true,
    effect: '与本体同步率上限突破至150%，同步率超过100%时全属性额外+20%',
    statModifiers: { strength: 20, agility: 20, magic: 20, constitution: 20, perception: 20, willpower: 20 },
    description: '极其罕见的稀有天赋，能够突破意识同步的极限。当同步率超过100%时，克隆体与本体的力量产生共振，爆发出远超常规的战力。'
  },
  {
    id: 'talent-015',
    name: '基因共鸣',
    rarity: 'legendary',
    isRare: true,
    effect: '所有基因插槽的属性加成效果提升50%，触发隐藏种族组合概率+30%',
    description: '传说中的稀有天赋，拥有者的基因序列能够与所有插槽产生完美共鸣，大幅强化基因组合的效果，甚至能激活传说中的隐藏种族特性。'
  },
  {
    id: 'talent-016',
    name: '魔力虹吸',
    rarity: 'epic',
    isRare: true,
    effect: '魔力属性+40%，攻击时吸取目标10%魔力转化为自身魔力',
    statModifiers: { magic: 40 },
    description: '恐怖的稀有天赋，能够在战斗中直接抽取对手的魔力为己所用，让敌人在绝望中看着自己的魔力被掏空。'
  },
  {
    id: 'talent-017',
    name: '灵魂链接',
    rarity: 'legendary',
    isRare: true,
    effect: '与本体建立灵魂链接，本体可共享克隆体的感知与技能，克隆体受到的伤害减免30%',
    description: '最顶级的稀有天赋之一，克隆体与本体之间建立起超越物质的灵魂羁绊。两者能够共享五感、共享技能，甚至在危急时刻互相传递力量。'
  },
  {
    id: 'talent-018',
    name: '不死之身',
    rarity: 'legendary',
    isRare: true,
    effect: '体质+50%，致命伤害有40%概率触发复活，保留30%生命值',
    statModifiers: { constitution: 50 },
    description: '传说中只有神明才能拥有的天赋，即便受到致命伤害也能涅槃重生，是真正意义上的不死不灭。'
  },
  {
    id: 'talent-019',
    name: '时空行者',
    rarity: 'legendary',
    isRare: true,
    effect: '敏捷+50%，有20%概率完全闪避任何攻击，技能冷却时间减少25%',
    statModifiers: { agility: 50 },
    description: '能够短暂地穿梭于时空裂缝之中，在敌人眼中其身影忽隐忽现，几乎无法被命中。'
  },
  {
    id: 'talent-020',
    name: '龙威',
    rarity: 'epic',
    isRare: true,
    effect: '全属性+25%，对非龙族目标造成额外30%伤害',
    statModifiers: { strength: 25, agility: 25, magic: 25, constitution: 25, perception: 25, willpower: 25 },
    description: '觉醒了远古龙族的血脉威压，低等生物在其面前会不由自主地颤抖，战力大打折扣。'
  },
  {
    id: 'talent-021',
    name: '元素掌控',
    rarity: 'epic',
    isRare: true,
    effect: '魔力+35%，所有元素魔法伤害提升40%，元素抗性+20%',
    statModifiers: { magic: 35 },
    description: '能够自由操控火、水、风、土、光、暗六大元素，是天生的元素使者。'
  },
  {
    id: 'talent-022',
    name: '先知之眼',
    rarity: 'legendary',
    isRare: true,
    effect: '感知+60%，能够预知对手3秒内的行动，暴击率提升25%',
    statModifiers: { perception: 60 },
    description: '拥有洞察未来的神秘力量，能够窥视命运的丝线，在战斗中永远快人一步。'
  }
];
