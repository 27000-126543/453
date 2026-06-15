import { useState } from 'react';
import type { GeneSample } from '@/types';
import { cn, getRarityBorder, getRarityColor, getRaceName } from '@/utils';

interface GeneSlotProps {
  index: number;
  sample: GeneSample | null;
  onClick: () => void;
  disabled?: boolean;
  prevSample?: GeneSample | null;
}

const rarityGlow: Record<string, string> = {
  common: 'shadow-[0_0_15px_rgba(156,163,175,0.4)]',
  rare: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
  epic: 'shadow-[0_0_25px_rgba(139,92,246,0.6)]',
  legendary: 'shadow-[0_0_30px_rgba(251,191,36,0.7)]',
};

export default function GeneSlot({ index, sample, onClick, disabled, prevSample }: GeneSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasBeam = index > 0 && prevSample !== null && sample !== null;

  return (
    <div className="relative flex flex-col items-center">
      {hasBeam && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5">
          <div className="absolute inset-0 bg-gradient-to-r from-magic-500 via-magic-300 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>
      )}

      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative w-[100px] h-[100px] rounded-full transition-all duration-300 flex items-center justify-center',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105',
          sample
            ? cn(
                'border-2',
                getRarityBorder(sample.rarity),
                rarityGlow[sample.rarity],
                'bg-magic-950/80'
              )
            : cn(
                'border-2 border-dashed border-magic-400/50 bg-magic-900/30',
                'animate-pulse'
              )
        )}
      >
        {sample ? (
          <div className="flex flex-col items-center justify-center w-full h-full p-1">
            <span className="text-4xl drop-shadow-lg">{sample.icon}</span>
            {isHovered && !disabled && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm animate-fade-in">
                <span className="text-xs text-red-400 font-display tracking-wider">点击移除</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center px-2">
            <span className="text-xs text-magic-300/70 font-display tracking-wide">
              基因插槽
            </span>
            <div className="text-lg font-display text-magic-400">{index + 1}</div>
          </div>
        )}
      </button>

      {sample && (
        <div className="mt-2 text-center">
          <div className={cn('text-sm font-display', getRarityColor(sample.rarity))}>
            {sample.name}
          </div>
          <div className="text-xs text-gray-400">{getRaceName(sample.race)}</div>
        </div>
      )}
    </div>
  );
}
