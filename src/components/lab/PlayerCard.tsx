import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export default function PlayerCard() {
  const { name, level, exp, skillLevel, gold, mana } = useGameStore();
  const expToLevel = level * 100;
  const expPercent = Math.min(100, (exp / expToLevel) * 100);

  return (
    <div className={cn('glass-card p-6 flex flex-col gap-5 animate-fade-in')}>
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          'relative w-24 h-24 rounded-full',
          'bg-gradient-to-br from-magic-400 via-magic-600 to-magic-800',
          'flex items-center justify-center text-5xl',
          'animate-pulse-glow'
        )}>
          <span className="drop-shadow-lg">🧙‍♂️</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className={cn(
            'font-display text-xl text-arcane-gold',
            'text-shadow-gold tracking-wide'
          )}>
            {name}
          </h2>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-magic-300 font-display">Lv.{level}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              技能等级 <span className="text-magic-300 font-semibold">{skillLevel}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-magic-400" />
            经验值
          </span>
          <span>{exp} / {expToLevel}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${expPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-around pt-2 border-t border-magic-500/20">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">💰</span>
          <span className={cn(
            'font-display text-arcane-gold text-shadow-gold text-lg',
            'tabular-nums'
          )}>
            {gold.toLocaleString()}
          </span>
        </div>
        <div className="w-px h-10 bg-magic-500/20" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🔮</span>
          <span className={cn(
            'font-display text-magic-300 text-shadow-purple text-lg',
            'tabular-nums'
          )}>
            {mana.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
