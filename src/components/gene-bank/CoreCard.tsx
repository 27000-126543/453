import type { EnergyCore } from '@/types';
import { cn, getRarityColor, getRarityBorder, getElementName } from '@/utils';

interface CoreCardProps {
  core: EnergyCore;
  onClick?: () => void;
  selected?: boolean;
  isAux?: boolean;
}

const statNames: Record<string, string> = {
  strength: '力量',
  agility: '敏捷',
  magic: '魔力',
  constitution: '体质',
  perception: '感知',
  willpower: '意志',
};

const elementColors: Record<string, string> = {
  fire: 'bg-red-500/30 text-red-300 border-red-500/50',
  water: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
  wind: 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50',
  earth: 'bg-amber-600/30 text-amber-300 border-amber-600/50',
  light: 'bg-yellow-400/30 text-yellow-200 border-yellow-400/50',
  dark: 'bg-purple-700/30 text-purple-300 border-purple-700/50',
  chaos: 'bg-fuchsia-600/30 text-fuchsia-300 border-fuchsia-600/50',
};

export default function CoreCard({ core, onClick, selected, isAux }: CoreCardProps) {
  const concentrationPercent = Math.min((core.energyConcentration / 200) * 100, 100);

  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card cursor-pointer p-4 transition-all duration-300 animate-slide-up border-2 relative',
        getRarityBorder(core.rarity),
        selected && 'ring-2 ring-arcane-gold magic-glow-gold scale-105',
        isAux && 'ring-2 ring-arcane-cyan/70',
        'hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      {isAux && (
        <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs rounded-full bg-arcane-cyan/80 text-white font-display">
          辅助
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        <div className="text-5xl mb-2">{core.icon}</div>
        <h3 className={cn('font-display text-base mb-1', getRarityColor(core.rarity))}>
          {core.name}
        </h3>
        <span
          className={cn(
            'inline-block px-2 py-0.5 text-xs rounded-full border mb-3',
            elementColors[core.element]
          )}
        >
          {getElementName(core.element)}
        </span>

        <div className="w-full mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">能量浓度</span>
            <span className="text-arcane-gold">{core.energyConcentration}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${concentrationPercent}%` }}
            />
          </div>
        </div>

        <div className="w-full space-y-1">
          {core.effects.statBoost &&
            Object.entries(core.effects.statBoost).map(([stat, value]) => (
              <div key={stat} className="flex justify-between items-center text-xs">
                <span className="text-gray-400">{statNames[stat] ?? stat}</span>
                <span className="text-arcane-gold">+{value}</span>
              </div>
            ))}
          {core.effects.talentBonus !== undefined && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">天赋加成</span>
              <span className="text-magic-300">+{core.effects.talentBonus}%</span>
            </div>
          )}
          {core.effects.mutationRate !== undefined && (
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">突变几率</span>
              <span className="text-fuchsia-400">+{core.effects.mutationRate}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
