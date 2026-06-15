import type { Skill } from '@/types';

export const skills: Skill[] = [
  {
    id: 'skill-001',
    name: '基础斩击',
    type: 'active',
    power: 25,
    cooldown: 3,
    description: '最基础的近战攻击，用武器进行一次普通斩击。',
    isMutated: false
  },
  {
    id: 'skill-002',
    name: '火球术',
    type: 'active',
    power: 35,
    cooldown: 5,
    description: '凝聚火元素形成一颗火球，向目标发射造成火焰伤害。',
    isMutated: false
  },
  {
    id: 'skill-003',
    name: '快速移动',
    type: 'active',
    power: 0,
    cooldown: 8,
    description: '在短时间内大幅提升移动速度，可用于追击或撤退。',
    isMutated: false
  },
  {
    id: 'skill-004',
    name: '治愈术',
    type: 'active',
    power: 30,
    cooldown: 10,
    description: '引导光元素之力，恢复自身或友方目标的生命值。',
    isMutated: false
  },
  {
    id: 'skill-005',
    name: '冰霜新星',
    type: 'active',
    power: 40,
    cooldown: 12,
    description: '在自身周围释放冰霜冲击波，对范围内敌人造成冰冻伤害。',
    isMutated: false
  },
  {
    id: 'skill-006',
    name: '雷霆一击',
    type: 'active',
    power: 55,
    cooldown: 15,
    description: '召唤雷电之力附于武器之上，造成强力的雷电伤害。',
    isMutated: false
  },
  {
    id: 'skill-007',
    name: '武器精通',
    type: 'passive',
    power: 10,
    cooldown: 0,
    description: '被动提升武器使用熟练度，永久增加10%物理攻击伤害。',
    isMutated: false
  },
  {
    id: 'skill-008',
    name: '魔力增幅',
    type: 'passive',
    power: 12,
    cooldown: 0,
    description: '被动增强魔力回路效率，永久提升12%魔法伤害。',
    isMutated: false
  },
  {
    id: 'skill-009',
    name: '生命汲取',
    type: 'passive',
    power: 8,
    cooldown: 0,
    description: '攻击时附带吸血效果，将造成伤害的8%转化为自身生命值。',
    isMutated: false
  },
  {
    id: 'skill-010',
    name: '坚韧皮肤',
    type: 'passive',
    power: 0,
    cooldown: 0,
    description: '被动强化皮肤防御，永久减少受到的物理伤害10%。',
    isMutated: false
  },
  {
    id: 'skill-011',
    name: '烈焰爆裂',
    type: 'mutation',
    power: 80,
    cooldown: 20,
    description: '【变异技能】将体内火焰魔力压缩后引爆，造成大范围毁灭性爆炸，自身也会受到少量伤害。',
    isMutated: true
  },
  {
    id: 'skill-012',
    name: '虚空吞噬',
    type: 'mutation',
    power: 65,
    cooldown: 25,
    description: '【变异技能】打开小型虚空裂缝，吞噬目标的魔力与生命力，同时恢复自身状态。',
    isMutated: true
  },
  {
    id: 'skill-013',
    name: '龙化·狂暴',
    type: 'mutation',
    power: 100,
    cooldown: 30,
    description: '【变异技能】觉醒龙族血脉，短时间内化作半龙形态，全属性大幅提升但理智会受到影响。',
    isMutated: true
  },
  {
    id: 'skill-014',
    name: '亡灵支配',
    type: 'mutation',
    power: 45,
    cooldown: 18,
    description: '【变异技能】召唤亡灵之力，可操纵战场上的尸体为己方作战。',
    isMutated: true
  },
  {
    id: 'skill-015',
    name: '混沌触手',
    type: 'mutation',
    power: 70,
    cooldown: 22,
    description: '【变异技能】从异次元召唤混沌触手进行多段攻击，有几率使目标陷入混乱状态。',
    isMutated: true
  },
  {
    id: 'skill-016',
    name: '暗夜潜行',
    type: 'active',
    power: 0,
    cooldown: 20,
    description: '融入周围的阴影之中，短时间内进入隐身状态，攻击或受到伤害后显形。',
    isMutated: false
  },
  {
    id: 'skill-017',
    name: '圣光庇护',
    type: 'passive',
    power: 0,
    cooldown: 0,
    description: '被动获得圣光庇佑，有15%概率免疫一次致命伤害。',
    isMutated: false
  },
  {
    id: 'skill-018',
    name: '大地护盾',
    type: 'active',
    power: 0,
    cooldown: 15,
    description: '召唤土元素形成一面坚固的护盾，在短时间内大幅提升防御力。',
    isMutated: false
  },
  {
    id: 'skill-019',
    name: '基因重组·修复',
    type: 'mutation',
    power: 0,
    cooldown: 28,
    description: '【变异技能】临时重组自身基因序列，瞬间清除所有负面状态并恢复50%生命值。',
    isMutated: true
  },
  {
    id: 'skill-020',
    name: '魔力暴走',
    type: 'mutation',
    power: 120,
    cooldown: 30,
    description: '【变异技能】释放体内所有魔力进行无差别攻击，威力巨大但使用后会陷入虚弱状态。',
    isMutated: true
  }
];
