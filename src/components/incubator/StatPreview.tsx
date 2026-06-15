import type { Stats } from '@/types';
import { cn } from '@/lib/utils';

interface StatPreviewProps {
  stats: Stats | null;
  talentChance?: number;
  mutationChance?: number;
}

const statNames: Record<keyof Stats, string> = {
  strength: '力量',
  agility: '敏捷',
  magic: '魔力',
  constitution: '体质',
  perception: '感知',
  willpower: '意志',
};

const statColors: Record<keyof Stats, string> = {
  strength: 'text-red-400',
  agility: 'text-green-400',
  magic: 'text-purple-400',
  constitution: 'text-amber-400',
  perception: 'text-cyan-400',
  willpower: 'text-blue-400',
};

export default function StatPreview({ stats, talentChance = 0, mutationChance = 0 }: StatPreviewProps) {
  const statKeys = Object.keys(statNames) as (keyof Stats)[];

  return (
    <div className={cn('glass-card p-5 flex flex-col gap-4')}>
      <h3 className={cn(
        'font-display text-lg text-magic-300 text-shadow-purple tracking-wider text-center'
      )}>
        预估属性
      </h3>

      <div className={cn('grid grid-cols-3 gap-3')}>
        {statKeys.map((key) => (
          <div key={key} className={cn(
            'flex flex-col items-center p-3 rounded-lg bg-magic-950/50'
          )}>
            <span className={cn('text-xs text-gray-400 mb-1')}>{statNames[key]}</span>
            <span className={cn(
              'font-display text-xl tabular-nums',
              stats ? statColors[key] : 'text-gray-500'
            )}>
              {stats ? Math.round(stats[key]) : '--'}
            </span>
          </div>
        ))}
      </div>

      {(talentChance > 0 || mutationChance > 0) && (
        <div className={cn('pt-3 border-t border-magic-500/20 grid grid-cols-2 gap-3')}>
          <div className={cn('flex flex-col items-center p-2 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>天赋几率</span>
            <span className={cn('font-display text-lg text-arcane-gold tabular-nums')}>
              {talentChance.toFixed(1)}%
            </span>
          </div>
          <div className={cn('flex flex-col items-center p-2 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>突变几率</span>
            <span className={cn('font-display text-lg text-fuchsia-400 tabular-nums')}>
              {mutationChance.toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
