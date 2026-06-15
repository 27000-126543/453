import { useState } from 'react';
import type { EnergyCore } from '@/types';
import { cn, getRarityBorder, getRarityColor, getElementName } from '@/utils';

interface CoreSlotProps {
  core: EnergyCore | null;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isAux?: boolean;
}

const rarityGlow: Record<string, string> = {
  common: 'shadow-[0_0_15px_rgba(156,163,175,0.4)]',
  rare: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  epic: 'shadow-[0_0_25px_rgba(139,92,246,0.6)]',
  legendary: 'shadow-[0_0_30px_rgba(251,191,36,0.7)]',
};

const elementColors: Record<string, string> = {
  fire: 'from-red-500/30 to-orange-500/30',
  water: 'from-blue-500/30 to-cyan-500/30',
  wind: 'from-cyan-500/30 to-teal-500/30',
  earth: 'from-amber-600/30 to-yellow-700/30',
  light: 'from-yellow-400/30 to-amber-300/30',
  dark: 'from-purple-700/30 to-indigo-900/30',
  chaos: 'from-fuchsia-600/30 to-pink-500/30',
};

export default function CoreSlot({ core, label, onClick, disabled, isAux }: CoreSlotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn('flex flex-col items-center gap-2')}>
      <span className={cn(
        'font-display text-sm',
        isAux ? 'text-arcane-cyan' : 'text-arcane-gold'
      )}>
        {label}
      </span>

      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative w-[120px] h-[120px] rounded-2xl transition-all duration-300 flex items-center justify-center',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105',
          core
            ? cn(
                'border-2',
                getRarityBorder(core.rarity),
                rarityGlow[core.rarity],
                'bg-gradient-to-br',
                elementColors[core.element] ?? 'from-magic-900/50 to-magic-950/50'
              )
            : cn(
                'border-2 border-dashed',
                isAux ? 'border-arcane-cyan/50' : 'border-magic-400/50',
                'bg-magic-900/30 animate-pulse'
              )
        )}
      >
        {core ? (
          <div className={cn('flex flex-col items-center justify-center w-full h-full p-2')}>
            <span className={cn('text-5xl drop-shadow-lg')}>{core.icon}</span>
            {isHovered && !disabled && (
              <div className={cn(
                'absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm animate-fade-in'
              )}>
                <span className={cn('text-xs text-red-400 font-display tracking-wider')}>
                  点击移除
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className={cn('text-center')}>
            <span className={cn(
              'text-xs font-display tracking-wide',
              isAux ? 'text-arcane-cyan/70' : 'text-magic-300/70'
            )}>
              点击选择
            </span>
          </div>
        )}
      </button>

      {core && (
        <div className={cn('text-center')}>
          <div className={cn('text-sm font-display', getRarityColor(core.rarity))}>
            {core.name}
          </div>
          <div className={cn('text-xs text-gray-400')}>
            {getElementName(core.element)}
          </div>
        </div>
      )}
    </div>
  );
}
