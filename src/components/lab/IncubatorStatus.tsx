import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Play, ArrowRight } from 'lucide-react';
import type { IncubationStatus } from '@/types';

export default function IncubatorStatus() {
  const { currentSession } = useGameStore();
  const navigate = useNavigate();
  const { growth, syncRate, awakening, status } = currentSession;

  const getStageEmoji = () => {
    if (growth >= 90) return '✨';
    if (growth >= 60) return '👤';
    if (growth >= 30) return '🧬';
    return '🥚';
  };

  const statusConfig: Record<IncubationStatus, { label: string; color: string; bg: string }> = {
    idle: { label: '空闲', color: 'text-slate-400', bg: 'bg-slate-500/20' },
    configuring: { label: '配置中', color: 'text-amber-400', bg: 'bg-amber-500/20' },
    cultivating: { label: '培养中', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    completed: { label: '完成', color: 'text-magic-300', bg: 'bg-magic-500/20' },
    failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/20' },
  };

  const currentStatus = statusConfig[status];

  const progressBars = [
    { label: '🌱 成长度', value: growth, color: 'from-emerald-500 to-green-400', glow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    { label: '🔗 同步率', value: syncRate, color: 'from-blue-500 to-cyan-400', glow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]' },
    { label: '✨ 觉醒度', value: awakening, color: 'from-magic-500 to-purple-400', glow: 'shadow-[0_0_10px_rgba(139,92,246,0.5)]' },
  ];

  const isCultivating = status === 'cultivating';
  const isIdle = status === 'idle';
  const showButton = isCultivating || isIdle;

  return (
    <div className={cn('glass-card p-6 flex flex-col gap-6 animate-fade-in')}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-magic-400" />
          <h2 className={cn(
            'font-display text-2xl text-magic-300',
            'text-shadow-purple tracking-widest'
          )}>
            培养舱状态
          </h2>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-xs font-display tracking-wide',
          currentStatus.bg,
          currentStatus.color
        )}>
          {currentStatus.label}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="relative w-48 h-56">
          <div className={cn(
            'absolute inset-0 rounded-[2.5rem]',
            'border-2 border-magic-400/50',
            'shadow-[0_0_30px_rgba(139,92,246,0.3),inset_0_0_30px_rgba(139,92,246,0.1)]',
            'overflow-hidden bg-magic-950/50'
          )}>
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out',
                'bg-gradient-to-t from-magic-600/60 via-magic-400/40 to-transparent'
              )}
              style={{ height: `${growth}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-float drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]">
                {getStageEmoji()}
              </span>
            </div>
          </div>

          <div className={cn(
            'absolute -inset-3 rounded-[3rem]',
            'border border-magic-400/30',
            'animate-spin-slow pointer-events-none'
          )}
            style={{
              clipPath: 'polygon(50% 0%, 52% 5%, 48% 5%, 50% 0%, 100% 50%, 95% 48%, 95% 52%, 100% 50%, 50% 100%, 48% 95%, 52% 95%, 50% 100%, 0% 50%, 5% 52%, 5% 48%, 0% 50%)',
            }}
          />

          <div className={cn(
            'absolute -inset-6 rounded-[3.5rem]',
            'border border-magic-400/20',
            'animate-spin-slow pointer-events-none'
          )}
            style={{
              animationDirection: 'reverse',
              animationDuration: '12s',
              clipPath: 'polygon(50% 0%, 52% 5%, 48% 5%, 50% 0%, 100% 50%, 95% 48%, 95% 52%, 100% 50%, 50% 100%, 48% 95%, 52% 95%, 50% 100%, 0% 50%, 5% 52%, 5% 48%, 0% 50%)',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {progressBars.map((bar) => (
          <div key={bar.label} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{bar.label}</span>
              <span className={cn(
                'font-display tabular-nums',
                bar.label.includes('成长') ? 'text-emerald-400' :
                bar.label.includes('同步') ? 'text-blue-400' : 'text-magic-300'
              )}>
                {Math.round(bar.value)}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-magic-950/60 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  'bg-gradient-to-r',
                  bar.color,
                  bar.glow
                )}
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {showButton && (
        <button
          onClick={() => navigate('/incubator')}
          className={cn(
            'flex items-center justify-center gap-2',
            'py-3.5 px-6 rounded-xl',
            'bg-gradient-to-r from-magic-600 to-magic-500',
            'hover:from-magic-500 hover:to-magic-400',
            'transition-all duration-300',
            'font-display text-base text-white tracking-wide',
            'shadow-[0_0_25px_rgba(139,92,246,0.4)]',
            'hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]',
            'active:scale-[0.98]'
          )}
        >
          {isCultivating ? (
            <>
              前往培养舱
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              开始培养
            </>
          )}
        </button>
      )}
    </div>
  );
}
