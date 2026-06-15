import type { Clone } from '@/types';
import { cn, getRarityColor, getRarityBorder, getRaceName, getElementName, getRarityName } from '@/utils';
import { Star } from 'lucide-react';

interface CloneCardProps {
  clone: Clone;
  onClick?: () => void;
}

const raceEmoji: Record<string, string> = {
  human: '👤',
  elf: '🧝',
  orc: '👹',
  dragon: '🐉',
  undead: '💀',
  demon: '👿',
};

export default function CloneCard({ clone, onClick }: CloneCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card cursor-pointer p-5 transition-all duration-300 animate-slide-up border-2 relative',
        getRarityBorder(clone.rarity),
        'hover:-translate-y-1 hover:shadow-lg'
      )}
    >
      {clone.isFavorite && (
        <Star className={cn(
          'absolute top-3 right-3 w-5 h-5 text-arcane-gold fill-arcane-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]'
        )} />
      )}

      <div className={cn('flex flex-col items-center text-center')}>
        <div className={cn(
          'relative w-20 h-20 rounded-full mb-3 flex items-center justify-center',
          'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40',
          'border-2',
          getRarityBorder(clone.rarity)
        )}>
          <span className={cn('text-4xl')}>{raceEmoji[clone.race] ?? '🧬'}</span>
        </div>

        <h3 className={cn('font-display text-lg mb-1', getRarityColor(clone.rarity))}>
          {clone.name}
        </h3>

        <div className={cn('flex items-center gap-2 mb-3')}>
          <span className={cn(
            'inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300'
          )}>
            {getRaceName(clone.race)}
          </span>
          <span className={cn(
            'inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300'
          )}>
            {getElementName(clone.element)}
          </span>
        </div>

        <div className={cn('w-full space-y-1.5')}>
          <div className={cn('flex justify-between text-xs')}>
            <span className={cn('text-gray-400')}>同步率</span>
            <span className={cn('text-blue-400 font-display')}>{Math.round(clone.syncRate)}%</span>
          </div>
          <div className={cn('flex justify-between text-xs')}>
            <span className={cn('text-gray-400')}>觉醒等级</span>
            <span className={cn('text-magic-300 font-display')}>Lv.{clone.awakeningLevel}</span>
          </div>
          <div className={cn('flex justify-between text-xs')}>
            <span className={cn('text-gray-400')}>天赋数</span>
            <span className={cn('text-fuchsia-400 font-display')}>{clone.talents.length}</span>
          </div>
          <div className={cn('flex justify-between text-xs')}>
            <span className={cn('text-gray-400')}>技能数</span>
            <span className={cn('text-arcane-gold font-display')}>{clone.skills.length}</span>
          </div>
        </div>

        <div className={cn('mt-3 pt-3 border-t border-magic-500/20 w-full')}>
          <span className={cn(
            'text-xs font-display',
            getRarityColor(clone.rarity)
          )}>
            {getRarityName(clone.rarity)}
          </span>
        </div>
      </div>
    </div>
  );
}
