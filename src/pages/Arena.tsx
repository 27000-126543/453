import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { cn, getRaceName, getRarityColor, getRarityBorder } from '@/utils';
import {
  Swords,
  Trophy,
  Skull,
  Heart,
  Zap,
  Coins,
  Star,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import type {
  BattleUnit,
  BattleLogEntry,
  BattleLogType,
  Clone,
} from '@/types';

const raceEmoji: Record<string, string> = {
  human: '🧙',
  elf: '🧝',
  orc: '👹',
  dragon: '🐉',
  undead: '💀',
  demon: '👿',
};

const getLogColor = (type: BattleLogType): string => {
  switch (type) {
    case 'attack':
      return 'text-red-400';
    case 'skill':
      return 'text-purple-400';
    case 'heal':
      return 'text-green-400';
    case 'switch':
      return 'text-blue-400';
    case 'special':
      return 'text-yellow-400';
    case 'system':
    default:
      return 'text-gray-400';
  }
};

function UnitCard({
  unit,
  isActive,
  side,
  onSkillClick,
}: {
  unit: BattleUnit;
  isActive: boolean;
  side: 'my' | 'enemy';
  onSkillClick?: (skillId: string) => void;
}) {
  const hpPercent = Math.max(0, (unit.currentHp / unit.maxHp) * 100);
  const syncPercent = Math.max(0, Math.min(100, unit.syncRate));
  const isDead = unit.currentHp <= 0;

  return (
    <div
      className={cn(
        'glass-card p-4 transition-all duration-300 relative',
        isActive && 'border-2 border-yellow-400 magic-glow-gold',
        isDead && 'opacity-50 grayscale'
      )}
    >
      {isActive && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
          主控
        </div>
      )}
      {isDead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
          <Skull className="w-12 h-12 text-red-500" />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center text-3xl',
            'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40 border-2',
            getRarityBorder(unit.race === 'human' && unit.type === 'player' ? 'legendary' : 'rare')
          )}
        >
          {raceEmoji[unit.race] ?? '🧬'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                'font-display text-base truncate',
                side === 'my' ? 'text-green-400' : 'text-red-400'
              )}
            >
              {unit.name}
            </h3>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                unit.type === 'player'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
              )}
            >
              {unit.type === 'player' ? '本体' : '克隆体'}
            </span>
          </div>
          <p className="text-xs text-gray-400">{getRaceName(unit.race)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" /> HP
            </span>
            <span className="text-red-400 font-display">
              {Math.floor(unit.currentHp)}/{unit.maxHp} ({Math.round(hpPercent)}%)
            </span>
          </div>
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                hpPercent > 50
                  ? 'bg-gradient-to-r from-green-600 to-green-400'
                  : hpPercent > 25
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400'
              )}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-400" /> 同步率
            </span>
            <span className="text-blue-400 font-display">{Math.round(syncPercent)}%</span>
          </div>
          <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${syncPercent}%` }}
            />
          </div>
        </div>
      </div>

      {side === 'my' && !isDead && (
        <div className="flex flex-wrap gap-1.5">
          {unit.skills.map((skill) => {
            const cd = unit.cooldowns[skill.id] ?? 0;
            const onCd = cd > 0;
            return (
              <button
                key={skill.id}
                onClick={() => !onCd && onSkillClick?.(skill.id)}
                disabled={onCd}
                className={cn(
                  'relative px-2 py-1 text-xs rounded-lg transition-all duration-200',
                  onCd
                    ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600/60 to-magic-500/60 text-white hover:from-purple-500/80 hover:to-magic-400/80 border border-purple-400/30'
                )}
              >
                <span className="flex items-center gap-1">
                  {skill.isMutated && <Sparkles className="w-3 h-3 text-yellow-400" />}
                  {skill.name}
                </span>
                {onCd && (
                  <span className="ml-1 text-yellow-400 font-mono">{cd.toFixed(1)}s</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {side === 'enemy' && !isDead && (
        <div className="flex flex-wrap gap-1.5">
          {unit.skills.map((skill) => {
            const cd = unit.cooldowns[skill.id] ?? 0;
            const onCd = cd > 0;
            return (
              <div
                key={skill.id}
                className={cn(
                  'relative px-2 py-1 text-xs rounded-lg',
                  onCd
                    ? 'bg-gray-700/50 text-gray-500'
                    : 'bg-gradient-to-r from-red-600/60 to-orange-500/60 text-red-200 border border-red-400/30'
                )}
              >
                <span className="flex items-center gap-1">
                  {skill.isMutated && <Sparkles className="w-3 h-3 text-yellow-400" />}
                  {skill.name}
                </span>
                {onCd && (
                  <span className="ml-1 text-yellow-400 font-mono">{cd.toFixed(1)}s</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function BattleLog({ logs }: { logs: BattleLogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <h3 className="font-display text-lg text-arcane-gold mb-3 flex items-center gap-2">
        <Swords className="w-5 h-5" /> 战斗日志
      </h3>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1.5 pr-2 text-sm max-h-[300px] min-h-[200px]"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn('animate-fade-in', getLogColor(log.type))}
          >
            <span className="text-gray-500 text-xs mr-2">
              [{formatTime(log.timestamp)}]
            </span>
            {log.message}
            {log.isCritical && (
              <span className="ml-2 text-yellow-400 animate-pulse">⚡暴击!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CloneCard({
  clone,
  isSelected,
  disabled,
  onClick,
}: {
  clone: Clone;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const power = React.useMemo(() => {
    const statsTotal = Object.values(clone.stats).reduce((sum, s) => sum + s, 0);
    const skillsPower = clone.skills.reduce((sum, s) => sum + s.power, 0);
    return Math.floor(statsTotal + skillsPower + clone.syncRate);
  }, [clone]);

  return (
    <div
      onClick={() => !disabled && onClick()}
      className={cn(
        'glass-card p-4 cursor-pointer transition-all duration-300 border-2 relative',
        getRarityBorder(clone.rarity),
        isSelected
          ? 'magic-glow-gold border-yellow-400 scale-[1.02]'
          : 'hover:-translate-y-1 hover:shadow-lg',
        disabled && !isSelected && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
          ✓
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center text-3xl',
            'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40 border-2',
            getRarityBorder(clone.rarity)
          )}
        >
          {raceEmoji[clone.race] ?? '🧬'}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'font-display text-lg truncate',
              getRarityColor(clone.rarity)
            )}
          >
            {clone.name}
          </h3>
          <p className="text-xs text-gray-400">{getRaceName(clone.race)}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">同步率</span>
          <span className="text-blue-400 font-display">
            {Math.round(clone.syncRate)}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">战力</span>
          <span className="text-arcane-gold font-display">{power}</span>
        </div>
      </div>
    </div>
  );
}

export default function Arena() {
  const {
    clones,
    arena,
    toggleArenaCloneSelection,
    startMatch,
    battleTick,
    switchActiveUnit,
    useSkill,
    useConsciousnessTransfer,
    useGeneBurst,
    claimReward,
    resetArena,
    name,
    level,
  } = useGameStore();

  const [matchingDots, setMatchingDots] = useState(0);

  useEffect(() => {
    if (arena.status !== 'matching') return;
    const interval = setInterval(() => {
      setMatchingDots((d) => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, [arena.status]);

  useEffect(() => {
    if (arena.status !== 'battle') return;
    const interval = setInterval(() => {
      battleTick(0.5);
    }, 500);
    return () => clearInterval(interval);
  }, [arena.status, battleTick]);

  const selectedClones = clones.filter((c) => arena.selectedCloneIds.includes(c.id));
  const myTeamUnits = arena.myTeam
    ? [arena.myTeam.player, ...arena.myTeam.clones]
    : [];
  const enemyTeamUnits = arena.enemyTeam
    ? [arena.enemyTeam.player, ...arena.enemyTeam.clones]
    : [];
  const aliveMyUnits = myTeamUnits.filter((u) => u.currentHp > 0);
  const myActiveUnit = myTeamUnits.find((u) => u.id === arena.myTeam?.activeUnitId);
  const enemyActiveUnit = enemyTeamUnits.find((u) => u.id === arena.enemyTeam?.activeUnitId);

  const calculateTeamPower = () => {
    let total = 500 + level * 50;
    selectedClones.forEach((c) => {
      const statsTotal = Object.values(c.stats).reduce((sum, s) => sum + s, 0);
      const skillsPower = c.skills.reduce((sum, s) => sum + s.power, 0);
      const power = Math.floor(statsTotal + skillsPower + c.syncRate);
      total += power * 0.4;
    });
    return Math.floor(total);
  };

  const handleSkillClick = (skillId: string) => {
    useSkill(skillId);
  };

  const handleGeneBurst = () => {
    if (enemyActiveUnit) {
      useGeneBurst(enemyActiveUnit.id);
    }
  };

  const renderHeader = () => (
    <div className="glass-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/30 via-amber-600/20 to-orange-500/30 flex items-center justify-center border-2 border-yellow-500/50 magic-glow-gold">
            <Trophy className="w-10 h-10 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-arcane-gold text-shadow-gold">
              竞技大赛
            </h1>
            <p className="text-gray-400 text-sm mt-1">击败对手，赢取丰厚奖励</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-yellow-400 font-display text-xl">
              <Star className="w-5 h-5 fill-yellow-400" />
              {arena.totalPoints}
            </div>
            <p className="text-xs text-gray-400">总积分</p>
          </div>
          <div className="h-10 w-px bg-magic-500/30" />
          <div className="text-center">
            <div className="font-display text-xl">
              <span className="text-green-400">{arena.winCount}</span>
              <span className="text-gray-500"> / </span>
              <span className="text-gray-300">{arena.matchCount}</span>
            </div>
            <p className="text-xs text-gray-400">胜场/总场次</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamSetup = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-display text-xl text-arcane-gold mb-4 flex items-center gap-2">
          <Swords className="w-5 h-5" /> 我的克隆体
          <span className="text-sm text-gray-400 font-normal">
            (已选择 {arena.selectedCloneIds.length}/2)
          </span>
        </h2>

        {clones.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">暂无克隆体</p>
            <p className="text-sm">前往培养舱培育你的第一个克隆体吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clones.map((clone) => (
              <CloneCard
                key={clone.id}
                clone={clone}
                isSelected={arena.selectedCloneIds.includes(clone.id)}
                disabled={arena.selectedCloneIds.length >= 2 && !arena.selectedCloneIds.includes(clone.id)}
                onClick={() => toggleArenaCloneSelection(clone.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-xl text-arcane-gold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" /> 已选择战队
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 rounded-xl border border-yellow-500/30">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br from-yellow-500/40 to-orange-500/30 border-2 border-yellow-400">
              🧙
            </div>
            <div>
              <p className="font-display text-yellow-400">
                {name}
              </p>
              <p className="text-xs text-gray-400">本体</p>
            </div>
          </div>

          {selectedClones.map((clone) => (
            <div
              key={clone.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border',
                'bg-gradient-to-r from-magic-500/20 to-purple-500/10',
                getRarityBorder(clone.rarity)
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2',
                  'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40',
                  getRarityBorder(clone.rarity)
                )}
              >
                {raceEmoji[clone.race] ?? '🧬'}
              </div>
              <div>
                <p className={cn('font-display', getRarityColor(clone.rarity))}>
                  {clone.name}
                </p>
                <p className="text-xs text-gray-400">克隆体</p>
              </div>
            </div>
          ))}

          {Array.from({ length: 2 - selectedClones.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/20"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gray-700/30 border-2 border-dashed border-gray-600 text-gray-500">
                +
              </div>
              <div>
                <p className="text-gray-500">空位</p>
                <p className="text-xs text-gray-600">克隆体</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-400">总战力：</span>
            <span className="font-display text-2xl text-arcane-gold text-shadow-gold ml-2">
              {calculateTeamPower()}
            </span>
          </div>
          <button
            onClick={startMatch}
            disabled={arena.selectedCloneIds.length === 0}
            className={cn(
              'px-8 py-3 rounded-xl font-display text-lg transition-all duration-300',
              arena.selectedCloneIds.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-500/40 active:scale-95 magic-glow-gold'
            )}
          >
            <span className="flex items-center gap-2">
              <Swords className="w-5 h-5" /> 开始匹配
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMatching = () => (
    <div className="glass-card p-16 flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-magic-500/30 border-t-yellow-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Swords className="w-10 h-10 text-arcane-gold animate-pulse" />
        </div>
      </div>
      <h2 className="font-display text-2xl text-arcane-gold mb-2">正在寻找对手</h2>
      <p className="text-gray-400 mb-6">
        匹配中
        {'.'.repeat(matchingDots)}
      </p>
      <button
        onClick={resetArena}
        className="px-6 py-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors"
      >
        取消匹配
      </button>
    </div>
  );

  const renderBattle = () => {
    if (!arena.myTeam || !arena.enemyTeam) return null;

    const consCd = arena.myTeam.specialCooldowns.consciousnessTransfer;
    const burstCd = arena.myTeam.specialCooldowns.geneBurst;

    return (
      <div className="space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center">
                🛡️
              </div>
              <div>
                <p className="font-display text-green-400">我方战队</p>
                <p className="text-xs text-gray-400">综合战力</p>
              </div>
              <p className="font-display text-2xl text-green-400 text-shadow-purple">
                {arena.myTeam.totalPower}
              </p>
            </div>

            <div className="flex-1 mx-8">
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden relative">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{
                    width: `${(arena.myTeam.totalPower / (arena.myTeam.totalPower + arena.enemyTeam.totalPower)) * 100}%`,
                  }}
                />
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-400 transition-all duration-500"
                  style={{
                    width: `${(arena.enemyTeam.totalPower / (arena.myTeam.totalPower + arena.enemyTeam.totalPower)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">战力对比</p>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-display text-2xl text-red-400 text-shadow-purple">
                {arena.enemyTeam.totalPower}
              </p>
              <div>
                <p className="font-display text-red-400 text-right">
                  {arena.enemyTeam.player.name}
                </p>
                <p className="text-xs text-gray-400 text-right">综合战力</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                ⚔️
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px_1fr] gap-4">
          <div className="space-y-3">
            <h3 className="font-display text-lg text-green-400 flex items-center gap-2">
              <Swords className="w-5 h-5" /> 我方单位
            </h3>
            {myTeamUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isActive={unit.id === arena.myTeam?.activeUnitId}
                side="my"
                onSkillClick={handleSkillClick}
              />
            ))}
          </div>

          <BattleLog logs={arena.battleLogs} />

          <div className="space-y-3">
            <h3 className="font-display text-lg text-red-400 flex items-center gap-2">
              <Skull className="w-5 h-5" /> 敌方单位
            </h3>
            {enemyTeamUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isActive={unit.id === arena.enemyTeam?.activeUnitId}
                side="enemy"
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="relative">
              <span className="text-gray-400 text-sm mr-2">切换主控：</span>
              <select
                value={arena.myTeam?.activeUnitId ?? ''}
                onChange={(e) => switchActiveUnit(e.target.value)}
                className="bg-gray-800/80 border border-magic-500/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 appearance-none pr-8 cursor-pointer"
              >
                {aliveMyUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.type === 'player' ? '本体' : '克隆体'})
                </option>
              ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={useConsciousnessTransfer}
              disabled={consCd > 0}
              className={cn(
                'px-5 py-2.5 rounded-xl font-display transition-all duration-300 flex items-center gap-2',
                consCd > 0
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600/70 to-blue-600/70 text-white hover:from-cyan-500/80 hover:to-blue-500/80 border border-cyan-400/30 active:scale-95'
              )}
            >
              <Sparkles className="w-5 h-5" />
              意识转移
              {consCd > 0 && (
                <span className="text-yellow-400 font-mono text-sm">
                  {consCd.toFixed(1)}s
                </span>
              )}
            </button>

            <button
              onClick={handleGeneBurst}
              disabled={burstCd > 0}
              className={cn(
                'px-5 py-2.5 rounded-xl font-display transition-all duration-300 flex items-center gap-2',
                burstCd > 0
                  ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600/70 via-orange-500/70 to-yellow-500/70 text-white hover:from-red-500/80 hover:via-orange-400/80 hover:to-yellow-400/80 border border-red-400/30 active:scale-95 magic-glow-gold'
              )}
            >
              <Zap className="w-5 h-5" />
              基因爆发
              {burstCd > 0 && (
                <span className="text-yellow-400 font-mono text-sm">
                  {burstCd.toFixed(1)}s
                </span>
              )}
            </button>
          </div>

          <div className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center gap-6">
            <span>意识转移：消耗全队20%当前HP，同步率+15%（冷却30s）</span>
            <span>基因爆发：消耗主控20%同步率，对敌主控造成巨额伤害（冷却45s）</span>
          </div>
        </div>
      </div>
    );
  };

  const renderFinished = () => {
    const isWin = arena.winner === 'player';
    const reward = arena.reward;

    return (
      <div className="glass-card p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div
            className={cn(
              'w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center',
              isWin
                ? 'bg-gradient-to-br from-yellow-500/30 to-amber-500/20 border-2 border-yellow-400 magic-glow-gold'
                : 'bg-gradient-to-br from-gray-600/30 to-gray-700/20 border-2 border-gray-500'
            )}
          >
            {isWin ? (
              <Trophy className="w-14 h-14 text-yellow-400" />
            ) : (
              <Skull className="w-14 h-14 text-gray-400" />
            )}
          </div>
          <h2
            className={cn(
              'font-display text-4xl mb-2',
              isWin ? 'text-arcane-gold text-shadow-gold' : 'text-gray-400'
            )}
          >
            {isWin ? '胜利！' : '失败...'}
          </h2>
          <p className="text-gray-400">
            {isWin
              ? '恭喜你击败了对手！'
              : '再接再厉，下次一定能赢！'}
          </p>
        </div>

        {reward && (
          <div className="mb-8">
            <h3 className="font-display text-lg text-arcane-gold mb-4 text-center">
              奖励列表
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
                <p className="font-display text-xl text-yellow-400">{reward.points}</p>
                <p className="text-xs text-gray-400">积分</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <p className="font-display text-xl text-amber-400">{reward.gold}</p>
                <p className="text-xs text-gray-400">金币</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <p className="font-display text-xl text-cyan-400">{reward.exp}</p>
                <p className="text-xs text-gray-400">经验</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="font-display text-xl text-purple-400">
                  {reward.geneFragments.length}
                </p>
                <p className="text-xs text-gray-400">基因片段</p>
              </div>
            </div>

            {reward.geneFragments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm text-gray-400 mb-2 text-center">基因片段详情：</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {reward.geneFragments.map((gf, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'px-3 py-1.5 rounded-lg border flex items-center gap-2',
                        getRarityBorder(gf.sample.rarity),
                        'bg-magic-500/10'
                      )}
                    >
                      <span>{gf.sample.icon}</span>
                      <span className={cn('font-display text-sm', getRarityColor(gf.sample.rarity))}>
                        {gf.sample.name}
                      </span>
                      <span className="text-gray-500 text-xs">x{gf.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={claimReward}
            className={cn(
              'px-10 py-4 rounded-xl font-display text-xl transition-all duration-300 active:scale-95',
              isWin
                ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-500/40 magic-glow-gold'
                : 'bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 text-white hover:shadow-lg hover:shadow-gray-500/30'
            )}
          >
            <span className="flex items-center gap-2">
              <Trophy className="w-6 h-6" /> 领取奖励
            </span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      {renderHeader()}

      {(arena.status === 'idle' || arena.status === 'team_setup') && renderTeamSetup()}
      {arena.status === 'matching' && renderMatching()}
      {arena.status === 'battle' && renderBattle()}
      {arena.status === 'finished' && renderFinished()}
    </div>
  );
}
