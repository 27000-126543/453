import type {
  BattleUnit,
  BattleTeam,
  BattleLogEntry,
  BattleReward,
  Stats,
  Skill,
  GeneSample,
  Rarity,
  Race,
  Element,
  Clone,
  PlayerState,
} from '@/types';
import { generateId, randomRange, weightedRandom, clamp } from '@/utils';
import { geneSamples as GENE_SAMPLES } from '@/data/geneSamples';
import { skills } from '@/data/skills';

export function calculateUnitPower(unit: BattleUnit): number {
  const statsTotal = Object.values(unit.stats).reduce((sum, stat) => sum + stat, 0);
  const skillsPower = unit.skills.reduce((sum, skill) => sum + skill.power, 0);
  const talentBonus = unit.talents.reduce((sum, talent) => {
    if (talent.statModifiers) {
      const values = Object.values(talent.statModifiers) as number[];
      return sum + values.reduce((s, v) => s + v, 0);
    }
    return sum;
  }, 0);
  const syncRateBonus = (unit.syncRate / 100) * statsTotal;

  return Math.floor(statsTotal + skillsPower + talentBonus + syncRateBonus);
}

export function calculateTeamPower(team: BattleTeam): number {
  let totalPower = calculateUnitPower(team.player) * 0.6;
  team.clones.forEach((clone) => {
    totalPower += calculateUnitPower(clone) * 0.2;
  });
  return Math.floor(totalPower);
}

function getTeamUnits(team: BattleTeam): BattleUnit[] {
  return [team.player, ...team.clones];
}

export function createPlayerBattleUnit(player: {
  id: string;
  name: string;
  level: number;
  skillLevel: number;
}): BattleUnit {
  const baseStats: Stats = {
    strength: 10 + player.level * 2 + player.skillLevel,
    agility: 10 + player.level * 2 + player.skillLevel,
    magic: 10 + player.level * 2 + player.skillLevel,
    constitution: 10 + player.level * 2 + player.skillLevel,
    perception: 10 + player.level + Math.floor(player.skillLevel / 2),
    willpower: 10 + player.level + Math.floor(player.skillLevel / 2),
  };

  const maxHp = 500 + player.level * 50;

  const basicAttack: Skill = {
    id: 'skill-basic-attack',
    name: '普通攻击',
    type: 'active',
    power: 15 + player.skillLevel * 2,
    cooldown: 1,
    description: '基础物理攻击',
    isMutated: false,
  };

  const healSkill: Skill = {
    id: 'skill-heal',
    name: '治愈术',
    type: 'active',
    power: 30 + player.skillLevel * 3,
    cooldown: 8,
    description: '恢复自身生命值',
    isMutated: false,
  };

  const unitSkills = [basicAttack, healSkill];

  const cooldowns: { [skillId: string]: number } = {};
  unitSkills.forEach((skill) => {
    cooldowns[skill.id] = 0;
  });

  return {
    id: player.id,
    name: player.name,
    type: 'player',
    race: 'human',
    element: 'light',
    maxHp,
    currentHp: maxHp,
    stats: baseStats,
    talents: [],
    skills: unitSkills,
    cooldowns,
    syncRate: 100,
    isActive: false,
  };
}

export function createCloneBattleUnit(clone: Clone): BattleUnit {
  const maxHp = 300 + clone.stats.constitution * 5;

  const cooldowns: { [skillId: string]: number } = {};
  clone.skills.forEach((skill) => {
    cooldowns[skill.id] = 0;
  });

  return {
    id: clone.id,
    name: clone.name,
    type: 'clone',
    race: clone.race,
    element: clone.element,
    maxHp,
    currentHp: maxHp,
    stats: { ...clone.stats },
    talents: [...clone.talents],
    skills: [...clone.skills],
    cooldowns,
    syncRate: clone.syncRate,
    isActive: false,
  };
}

export function buildBattleTeam(
  player: Pick<PlayerState, 'id' | 'name' | 'level' | 'skillLevel'>,
  selectedClones: Clone[]
): BattleTeam {
  const playerUnit = createPlayerBattleUnit({
    id: player.id,
    name: player.name,
    level: player.level,
    skillLevel: player.skillLevel,
  });
  playerUnit.isActive = true;

  const cloneUnits = selectedClones.map((clone) => createCloneBattleUnit(clone));

  const team: BattleTeam = {
    player: playerUnit,
    clones: cloneUnits,
    activeUnitId: playerUnit.id,
    totalPower: 0,
    specialCooldowns: {
      consciousnessTransfer: 0,
      geneBurst: 0,
    },
  };

  team.totalPower = calculateTeamPower(team);

  return team;
}

export function findMatch(myTeam: BattleTeam, _allPlayers?: unknown[]): BattleTeam {
  const targetPower = myTeam.totalPower;
  const minPower = Math.floor(targetPower * 0.9);
  const maxPower = Math.floor(targetPower * 1.1);

  const aiNames = ['暗影猎手', '烈焰法师', '冰霜骑士', '风暴游侠', '大地守护者'];
  const aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
  const myLevel = Math.max(1, Math.floor(myTeam.player.syncRate / 10));
  const aiLevel = Math.max(1, myLevel + Math.floor(randomRange(-2, 2)));

  const aiPlayer = {
    id: 'ai-player-' + generateId(),
    name: aiName,
    level: aiLevel,
    skillLevel: Math.max(1, aiLevel - 5 + Math.floor(randomRange(0, 10))),
  };

  const aiPlayerUnit = createPlayerBattleUnit(aiPlayer);

  const aiClones: BattleUnit[] = [];
  const races: Race[] = ['human', 'elf', 'orc', 'dragon', 'undead', 'demon'];
  const elements: Element[] = ['fire', 'water', 'wind', 'earth', 'light', 'dark', 'chaos'];

  for (let i = 0; i < 2; i++) {
    const rarityWeights: Record<Rarity, number> = {
      common: 50,
      rare: 35,
      epic: 12,
      legendary: 3,
    };
    const rarity = weightedRandom(rarityWeights) as Rarity;

    const cloneLevel = Math.max(1, aiLevel + Math.floor(randomRange(-3, 3)));
    const baseStat = 8 + cloneLevel * 2;

    const cloneStats: Stats = {
      strength: baseStat + Math.floor(randomRange(0, 10)),
      agility: baseStat + Math.floor(randomRange(0, 10)),
      magic: baseStat + Math.floor(randomRange(0, 10)),
      constitution: baseStat + Math.floor(randomRange(0, 10)),
      perception: Math.floor(baseStat * 0.7) + Math.floor(randomRange(0, 5)),
      willpower: Math.floor(baseStat * 0.7) + Math.floor(randomRange(0, 5)),
    };

    const cloneSkills = [skills[Math.floor(Math.random() * 6)]];
    if (Math.random() > 0.5) {
      cloneSkills.push(skills[6 + Math.floor(Math.random() * 4)]);
    }

    const cooldowns: { [skillId: string]: number } = {};
    cloneSkills.forEach((skill) => {
      cooldowns[skill.id] = 0;
    });

    const maxHp = 300 + cloneStats.constitution * 5;

    aiClones.push({
      id: 'ai-clone-' + generateId(),
      name: `AI克隆体${i + 1}`,
      type: 'clone',
      race: races[Math.floor(Math.random() * races.length)],
      element: elements[Math.floor(Math.random() * elements.length)],
      maxHp,
      currentHp: maxHp,
      stats: cloneStats,
      talents: [],
      skills: cloneSkills,
      cooldowns,
      syncRate: clamp(60 + Math.floor(randomRange(0, 40)), 0, 100),
      isActive: false,
    });
  }

  aiPlayerUnit.isActive = true;

  const enemyTeam: BattleTeam = {
    player: aiPlayerUnit,
    clones: aiClones,
    activeUnitId: aiPlayerUnit.id,
    totalPower: 0,
    specialCooldowns: {
      consciousnessTransfer: 0,
      geneBurst: 0,
    },
  };

  enemyTeam.totalPower = calculateTeamPower(enemyTeam);

  let adjustment = 1;
  const enemyAllUnits = getTeamUnits(enemyTeam);

  while (enemyTeam.totalPower < minPower && adjustment < 2) {
    adjustment += 0.1;
    enemyAllUnits.forEach((unit) => {
      unit.stats.strength = Math.floor(unit.stats.strength * adjustment);
      unit.stats.agility = Math.floor(unit.stats.agility * adjustment);
      unit.stats.magic = Math.floor(unit.stats.magic * adjustment);
      unit.stats.constitution = Math.floor(unit.stats.constitution * adjustment);
      unit.stats.perception = Math.floor(unit.stats.perception * adjustment);
      unit.stats.willpower = Math.floor(unit.stats.willpower * adjustment);
    });
    enemyTeam.totalPower = calculateTeamPower(enemyTeam);
  }

  while (enemyTeam.totalPower > maxPower && adjustment > 0.5) {
    adjustment -= 0.1;
    enemyAllUnits.forEach((unit) => {
      unit.stats.strength = Math.floor(unit.stats.strength * adjustment);
      unit.stats.agility = Math.floor(unit.stats.agility * adjustment);
      unit.stats.magic = Math.floor(unit.stats.magic * adjustment);
      unit.stats.constitution = Math.floor(unit.stats.constitution * adjustment);
      unit.stats.perception = Math.floor(unit.stats.perception * adjustment);
      unit.stats.willpower = Math.floor(unit.stats.willpower * adjustment);
    });
    enemyTeam.totalPower = calculateTeamPower(enemyTeam);
  }

  return enemyTeam;
}

export function processBattleTick(
  myTeam: BattleTeam,
  enemyTeam: BattleTeam,
  logs: BattleLogEntry[],
  deltaTime: number
): {
  myTeam: BattleTeam;
  enemyTeam: BattleTeam;
  logs: BattleLogEntry[];
  isFinished: boolean;
} {
  const updatedMyTeam = JSON.parse(JSON.stringify(myTeam)) as BattleTeam;
  const updatedEnemyTeam = JSON.parse(JSON.stringify(enemyTeam)) as BattleTeam;
  const updatedLogs = [...logs];

  const myUnits = getTeamUnits(updatedMyTeam);
  const enemyUnits = getTeamUnits(updatedEnemyTeam);

  const myActive = myUnits.find((u) => u.id === updatedMyTeam.activeUnitId);
  const enemyActive = enemyUnits.find((u) => u.id === updatedEnemyTeam.activeUnitId);

  myUnits.forEach((unit) => {
    Object.keys(unit.cooldowns).forEach((skillId) => {
      if (unit.cooldowns[skillId] > 0) {
        unit.cooldowns[skillId] = Math.max(0, unit.cooldowns[skillId] - deltaTime);
      }
    });
  });

  enemyUnits.forEach((unit) => {
    Object.keys(unit.cooldowns).forEach((skillId) => {
      if (unit.cooldowns[skillId] > 0) {
        unit.cooldowns[skillId] = Math.max(0, unit.cooldowns[skillId] - deltaTime);
      }
    });
  });

  updatedMyTeam.specialCooldowns.consciousnessTransfer = Math.max(
    0,
    updatedMyTeam.specialCooldowns.consciousnessTransfer - deltaTime
  );
  updatedMyTeam.specialCooldowns.geneBurst = Math.max(
    0,
    updatedMyTeam.specialCooldowns.geneBurst - deltaTime
  );
  updatedEnemyTeam.specialCooldowns.consciousnessTransfer = Math.max(
    0,
    updatedEnemyTeam.specialCooldowns.consciousnessTransfer - deltaTime
  );
  updatedEnemyTeam.specialCooldowns.geneBurst = Math.max(
    0,
    updatedEnemyTeam.specialCooldowns.geneBurst - deltaTime
  );

  if (myActive && myActive.currentHp > 0 && enemyActive && enemyActive.currentHp > 0) {
    const basicAttackSkill = myActive.skills.find((s) => s.id === 'skill-basic-attack');
    if (basicAttackSkill && myActive.cooldowns[basicAttackSkill.id] <= 0) {
      const critChance = myActive.syncRate / 200;
      const isCritical = Math.random() < critChance;

      let damage =
        (basicAttackSkill.power + myActive.stats.strength) *
        (1 + myActive.syncRate / 200) *
        deltaTime;

      if (isCritical) {
        damage *= 1.5;
      }

      damage = Math.floor(damage);
      enemyActive.currentHp = Math.max(0, enemyActive.currentHp - damage);

      myActive.cooldowns[basicAttackSkill.id] = basicAttackSkill.cooldown;

      updatedLogs.push({
        id: generateId(),
        timestamp: Date.now(),
        type: 'attack',
        source: myActive.name,
        target: enemyActive.name,
        damage,
        isCritical,
        message: isCritical
          ? `${myActive.name} 暴击了 ${enemyActive.name}，造成 ${damage} 点伤害！`
          : `${myActive.name} 攻击了 ${enemyActive.name}，造成 ${damage} 点伤害。`,
      });
    }
  }

  if (enemyActive && enemyActive.currentHp > 0 && myActive && myActive.currentHp > 0) {
    const enemyBasicAttack =
      enemyActive.skills.find((s) => s.id === 'skill-basic-attack') || enemyActive.skills[0];
    if (enemyBasicAttack && enemyActive.cooldowns[enemyBasicAttack.id] <= 0) {
      const critChance = enemyActive.syncRate / 200;
      const isCritical = Math.random() < critChance;

      let damage =
        (enemyBasicAttack.power + enemyActive.stats.strength) *
        (1 + enemyActive.syncRate / 200) *
        deltaTime;

      if (isCritical) {
        damage *= 1.5;
      }

      damage = Math.floor(damage);
      myActive.currentHp = Math.max(0, myActive.currentHp - damage);

      enemyActive.cooldowns[enemyBasicAttack.id] = enemyBasicAttack.cooldown;

      updatedLogs.push({
        id: generateId(),
        timestamp: Date.now(),
        type: 'attack',
        source: enemyActive.name,
        target: myActive.name,
        damage,
        isCritical,
        message: isCritical
          ? `${enemyActive.name} 暴击了 ${myActive.name}，造成 ${damage} 点伤害！`
          : `${enemyActive.name} 攻击了 ${myActive.name}，造成 ${damage} 点伤害。`,
      });
    }
  }

  const checkAutoSwitch = (team: BattleTeam, teamName: string) => {
    const units = getTeamUnits(team);
    const active = units.find((u) => u.id === team.activeUnitId);
    if (active && active.currentHp <= 0) {
      const nextUnit = units.find((u) => u.currentHp > 0);
      if (nextUnit) {
        active.isActive = false;
        nextUnit.isActive = true;
        team.activeUnitId = nextUnit.id;

        updatedLogs.push({
          id: generateId(),
          timestamp: Date.now(),
          type: 'switch',
          source: active.name,
          target: nextUnit.name,
          message: `${active.name} 已被击败！${teamName}切换至 ${nextUnit.name}。`,
        });
      }
    }
  };

  checkAutoSwitch(updatedMyTeam, '我方');
  checkAutoSwitch(updatedEnemyTeam, '敌方');

  const myAllDead = myUnits.every((u) => u.currentHp <= 0);
  const enemyAllDead = enemyUnits.every((u) => u.currentHp <= 0);
  const isFinished = myAllDead || enemyAllDead;

  if (isFinished) {
    updatedLogs.push({
      id: generateId(),
      timestamp: Date.now(),
      type: 'system',
      source: 'system',
      target: 'all',
      message: myAllDead ? '战斗结束，我方战败...' : '战斗结束，我方胜利！',
    });
  }

  return {
    myTeam: updatedMyTeam,
    enemyTeam: updatedEnemyTeam,
    logs: updatedLogs,
    isFinished,
  };
}

export function executeSkill(
  attacker: BattleUnit,
  skill: Skill,
  target: BattleUnit
): {
  damage: number;
  log: BattleLogEntry;
  updatedAttacker: BattleUnit;
  updatedTarget: BattleUnit;
} {
  const updatedAttacker = JSON.parse(JSON.stringify(attacker)) as BattleUnit;
  const updatedTarget = JSON.parse(JSON.stringify(target)) as BattleUnit;

  const damage = Math.floor(
    (skill.power + updatedAttacker.stats.magic) * (1 + updatedAttacker.syncRate / 200)
  );

  if (skill.name === '治愈术') {
    const healAmount = damage;
    updatedAttacker.currentHp = Math.min(updatedAttacker.maxHp, updatedAttacker.currentHp + healAmount);

    updatedAttacker.cooldowns[skill.id] = skill.cooldown;

    const log: BattleLogEntry = {
      id: generateId(),
      timestamp: Date.now(),
      type: 'heal',
      source: updatedAttacker.name,
      target: updatedAttacker.name,
      heal: healAmount,
      message: `${updatedAttacker.name} 使用了 ${skill.name}，恢复了 ${healAmount} 点生命值。`,
    };

    return {
      damage: 0,
      log,
      updatedAttacker,
      updatedTarget,
    };
  }

  updatedTarget.currentHp = Math.max(0, updatedTarget.currentHp - damage);
  updatedAttacker.cooldowns[skill.id] = skill.cooldown;

  const log: BattleLogEntry = {
    id: generateId(),
    timestamp: Date.now(),
    type: 'skill',
    source: updatedAttacker.name,
    target: updatedTarget.name,
    damage,
    message: `${updatedAttacker.name} 使用了 ${skill.name}，对 ${updatedTarget.name} 造成 ${damage} 点伤害！`,
  };

  return {
    damage,
    log,
    updatedAttacker,
    updatedTarget,
  };
}

export function switchActiveUnit(team: BattleTeam, newUnitId: string): BattleTeam {
  const updatedTeam = JSON.parse(JSON.stringify(team)) as BattleTeam;
  const units = getTeamUnits(updatedTeam);

  const currentActive = units.find((u) => u.id === updatedTeam.activeUnitId);
  const newActive = units.find((u) => u.id === newUnitId);

  if (!newActive || newActive.currentHp <= 0) {
    return updatedTeam;
  }

  if (currentActive) {
    currentActive.isActive = false;
  }

  newActive.isActive = true;
  updatedTeam.activeUnitId = newUnitId;

  return updatedTeam;
}

export function useConsciousnessTransfer(team: BattleTeam): {
  team: BattleTeam;
  log: BattleLogEntry;
} {
  const updatedTeam = JSON.parse(JSON.stringify(team)) as BattleTeam;

  if (updatedTeam.specialCooldowns.consciousnessTransfer > 0) {
    return {
      team: updatedTeam,
      log: {
        id: generateId(),
        timestamp: Date.now(),
        type: 'system',
        source: 'system',
        target: 'all',
        message: '意识转移冷却中，无法使用。',
      },
    };
  }

  const aliveUnits = getTeamUnits(updatedTeam).filter((u) => u.currentHp > 0);

  aliveUnits.forEach((unit) => {
    const hpCost = Math.floor(unit.currentHp * 0.2);
    unit.currentHp = Math.max(1, unit.currentHp - hpCost);
    unit.syncRate = clamp(unit.syncRate + 15, 0, 100);
  });

  updatedTeam.specialCooldowns.consciousnessTransfer = 30;

  const log: BattleLogEntry = {
    id: generateId(),
    timestamp: Date.now(),
    type: 'special',
    source: '我方全队',
    target: '我方全队',
    message: '意识转移发动！所有单位消耗20%当前HP，同步率提升15%！',
  };

  return {
    team: updatedTeam,
    log,
  };
}

export function useGeneBurst(
  attackerTeam: BattleTeam,
  target: BattleUnit
): {
  damage: number;
  logs: BattleLogEntry[];
  updatedTarget: BattleUnit;
} {
  const logs: BattleLogEntry[] = [];
  const updatedAttackerTeam = JSON.parse(JSON.stringify(attackerTeam)) as BattleTeam;
  const updatedTarget = JSON.parse(JSON.stringify(target)) as BattleUnit;

  if (updatedAttackerTeam.specialCooldowns.geneBurst > 0) {
    logs.push({
      id: generateId(),
      timestamp: Date.now(),
      type: 'system',
      source: 'system',
      target: 'all',
      message: '基因爆发冷却中，无法使用。',
    });
    return {
      damage: 0,
      logs,
      updatedTarget,
    };
  }

  const attackerUnits = getTeamUnits(updatedAttackerTeam);
  const activeUnit = attackerUnits.find((u) => u.id === updatedAttackerTeam.activeUnitId);

  if (!activeUnit || activeUnit.currentHp <= 0) {
    logs.push({
      id: generateId(),
      timestamp: Date.now(),
      type: 'system',
      source: 'system',
      target: 'all',
      message: '没有可用的活跃单位。',
    });
    return {
      damage: 0,
      logs,
      updatedTarget,
    };
  }

  const syncCost = activeUnit.syncRate * 0.2;
  activeUnit.syncRate = Math.max(0, activeUnit.syncRate - syncCost);

  const statsTotal = Object.values(activeUnit.stats).reduce((sum, stat) => sum + stat, 0);
  const damage = Math.floor(statsTotal * 0.8);

  updatedTarget.currentHp = Math.max(0, updatedTarget.currentHp - damage);

  updatedAttackerTeam.specialCooldowns.geneBurst = 45;

  logs.push({
    id: generateId(),
    timestamp: Date.now(),
    type: 'special',
    source: activeUnit.name,
    target: updatedTarget.name,
    damage,
    message: `基因爆发！${activeUnit.name} 消耗20%同步率，对 ${updatedTarget.name} 造成 ${damage} 点巨额伤害！`,
  });

  return {
    damage,
    logs,
    updatedTarget,
  };
}

export function calculateReward(
  winner: 'player' | 'enemy',
  myTeam: BattleTeam,
  enemyTeam: BattleTeam,
  round: number
): BattleReward {
  let points: number;
  let gold: number;
  let exp: number;
  const geneFragments: { sample: GeneSample; quantity: number }[] = [];

  const powerRatio = enemyTeam.totalPower / Math.max(1, myTeam.totalPower);
  const roundBonus = 1 + round * 0.1;

  if (winner === 'player') {
    points = Math.floor(randomRange(100, 300) * powerRatio * roundBonus);
    gold = Math.floor(randomRange(50, 200) * powerRatio * roundBonus);
    exp = Math.floor(randomRange(20, 50) * powerRatio * roundBonus);

    const dropChance = powerRatio * 0.3;
    if (Math.random() < dropChance) {
      const rarityWeights: Record<Rarity, number> = {
        common: 60,
        rare: 30,
        epic: 8,
        legendary: 2,
      };

      const selectedRarity = weightedRandom(rarityWeights) as Rarity;
      const availableGenes = GENE_SAMPLES.filter((g) => g.rarity === selectedRarity);

      if (availableGenes.length > 0) {
        const selectedGene = availableGenes[Math.floor(Math.random() * availableGenes.length)];
        geneFragments.push({ sample: selectedGene, quantity: 1 });
      }
    }

    if (Math.random() < dropChance * 0.3) {
      const epicOrHigher = GENE_SAMPLES.filter(
        (g) => g.rarity === 'epic' || g.rarity === 'legendary'
      );
      if (epicOrHigher.length > 0) {
        const selectedGene = epicOrHigher[Math.floor(Math.random() * epicOrHigher.length)];
        geneFragments.push({ sample: selectedGene, quantity: 1 });
      }
    }
  } else {
    points = Math.floor(randomRange(30, 80) * roundBonus);
    gold = Math.floor(randomRange(10, 30) * roundBonus);
    exp = Math.floor(randomRange(5, 15) * roundBonus);

    if (Math.random() < 0.1) {
      const commonGenes = GENE_SAMPLES.filter((g) => g.rarity === 'common');
      if (commonGenes.length > 0) {
        const selectedGene = commonGenes[Math.floor(Math.random() * commonGenes.length)];
        geneFragments.push({ sample: selectedGene, quantity: 1 });
      }
    }
  }

  return {
    points: clamp(points, winner === 'player' ? 100 : 30, 9999),
    gold: clamp(gold, winner === 'player' ? 50 : 10, 9999),
    exp: clamp(exp, winner === 'player' ? 20 : 5, 9999),
    geneFragments,
  };
}

export function getWinner(
  myTeam: BattleTeam,
  enemyTeam: BattleTeam
): 'player' | 'enemy' | null {
  const myAllDead = getTeamUnits(myTeam).every((u) => u.currentHp <= 0);
  const enemyAllDead = getTeamUnits(enemyTeam).every((u) => u.currentHp <= 0);

  if (myAllDead && enemyAllDead) {
    return null;
  }

  if (enemyAllDead) {
    return 'player';
  }

  if (myAllDead) {
    return 'enemy';
  }

  return null;
}
