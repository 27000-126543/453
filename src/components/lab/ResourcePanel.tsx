import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Database, ChevronRight } from 'lucide-react';

export default function ResourcePanel() {
  const { geneSamples, energyCores, potions, clones } = useGameStore();
  const navigate = useNavigate();

  const totalPotions = potions.reduce((sum, p) => sum + p.quantity, 0);

  const resources = [
    { icon: '🧬', name: '基因样本', count: geneSamples.length, color: 'text-emerald-400' },
    { icon: '💎', name: '能量核心', count: energyCores.length, color: 'text-cyan-400' },
    { icon: '🧪', name: '能量药剂', count: totalPotions, color: 'text-purple-400' },
    { icon: '👥', name: '克隆体', count: clones.length, color: 'text-amber-400' },
  ];

  return (
    <div className={cn('glass-card p-5 flex flex-col gap-4 animate-fade-in')}>
      <div className="flex items-center gap-2 pb-3 border-b border-magic-500/20">
        <Database className="w-5 h-5 text-magic-400" />
        <h3 className={cn(
          'font-display text-lg text-magic-300',
          'text-shadow-purple tracking-wider'
        )}>
          资源仓库
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        {resources.map((resource) => (
          <div
            key={resource.name}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg',
              'transition-all duration-300',
              'hover:bg-magic-500/10',
              'hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]',
              'cursor-default group'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {resource.icon}
              </span>
              <span className="text-slate-300">{resource.name}</span>
            </div>
            <span className={cn(
              'font-display text-lg tabular-nums',
              resource.color,
              'group-hover:scale-110 transition-transform duration-300'
            )}>
              {resource.count}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/gene-bank')}
        className={cn(
          'mt-2 flex items-center justify-center gap-2',
          'py-3 px-4 rounded-lg',
          'bg-gradient-to-r from-magic-600/80 to-magic-500/80',
          'hover:from-magic-500 hover:to-magic-400',
          'transition-all duration-300',
          'font-display text-sm text-white tracking-wide',
          'hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]',
          'active:scale-[0.98]'
        )}
      >
        前往基因库
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
