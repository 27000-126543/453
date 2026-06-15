import type { GeneSample } from '@/types';
import { cn, getRarityColor, getRarityBorder, getRaceName } from '@/utils';

interface GeneCardProps {
  sample: GeneSample;
  onClick?: () => void;
  selected?: boolean;
}

const statNames: Record<string, string> = {
  strength: '力量',
  agility: '敏捷',
  magic: '魔力',
  constitution: '体质',
  perception: '感知',
  willpower: '意志',
};

export default function GeneCard({ sample, onClick, selected }: GeneCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card cursor-pointer p-4 transition-all duration-300 animate-slide-up border-2',
        getRarityBorder(sample.rarity),
        selected && 'ring-2 ring-arcane-gold magic-glow-gold scale-105',
        'hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className="text-5xl mb-2">{sample.icon}</div>
        <h3 className={cn('font-display text-base mb-1', getRarityColor(sample.rarity))}>
          {sample.name}
        </h3>
        <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300 mb-3">
          {getRaceName(sample.race)}
        </span>
        <div className="w-full space-y-1">
          {Object.entries(sample.statBonuses).map(([stat, value]) => (
            <div key={stat} className="flex justify-between items-center text-xs">
              <span className="text-gray-400">{statNames[stat] ?? stat}</span>
              <span className="text-arcane-gold">+{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
