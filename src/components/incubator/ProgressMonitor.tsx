import { useEffect, useState } from 'react';
import { cn } from '@/utils';
import type { IncubationStatus } from '@/types';

interface ProgressMonitorProps {
  growth: number;
  syncRate: number;
  awakening: number;
  status: string;
}

interface ProgressBarConfig {
  label: string;
  value: number;
  color: string;
  glow: string;
  textColor: string;
  icon: string;
}

const statusConfig: Record<IncubationStatus, { label: string; color: string; bg: string }> = {
  idle: { label: '空闲', color: 'text-slate-400', bg: 'bg-slate-500/30' },
  configuring: { label: '配置中', color: 'text-amber-400', bg: 'bg-amber-500/30' },
  cultivating: { label: '培养中', color: 'text-emerald-400', bg: 'bg-emerald-500/30' },
  completed: { label: '完成', color: 'text-magic-300', bg: 'bg-magic-500/30' },
  failed: { label: '失败', color: 'text-red-400', bg: 'bg-red-500/30' },
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const diff = value - display;
    if (Math.abs(diff) < 0.01) {
      setDisplay(value);
      return;
    }
    const step = diff * 0.1;
    const timer = setInterval(() => {
      setDisplay((prev) => {
        const newDiff = value - prev;
        if (Math.abs(newDiff) < 0.01) {
          clearInterval(timer);
          return value;
        }
        return prev + newDiff * 0.1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [value, display]);

  return <span>{Math.round(display)}%</span>;
}

export default function ProgressMonitor({ growth, syncRate, awakening, status }: ProgressMonitorProps) {
  const currentStatus = statusConfig[status as IncubationStatus] || statusConfig.idle;
  const isCultivating = status === 'cultivating';

  const progressBars: ProgressBarConfig[] = [
    {
      label: '成长度',
      value: growth,
      color: 'from-emerald-500 to-green-400',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]',
      textColor: 'text-emerald-400',
      icon: '🌱',
    },
    {
      label: '同步率',
      value: syncRate,
      color: 'from-blue-500 to-cyan-400',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      textColor: 'text-blue-400',
      icon: '🔗',
    },
    {
      label: '觉醒度',
      value: awakening,
      color: 'from-magic-500 to-purple-400',
      glow: 'shadow-[0_0_12px_rgba(139,92,246,0.5)]',
      textColor: 'text-magic-300',
      icon: '✨',
    },
  ];

  return (
    <div
      className={cn(
        'glass-card p-5 animate-fade-in',
        isCultivating && 'animate-pulse-glow'
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-xl text-magic-300 text-shadow-purple tracking-widest">
          进度监控
        </h3>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-display tracking-wide',
            currentStatus.bg,
            currentStatus.color,
            isCultivating && 'animate-pulse'
          )}
        >
          {currentStatus.label}
        </span>
      </div>

      <div className="space-y-5">
        {progressBars.map((bar) => (
          <div key={bar.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-2">
                <span
                  className={cn(
                    'text-xl',
                    isCultivating && 'animate-float'
                  )}
                  style={{ animationDelay: `${progressBars.indexOf(bar) * 0.2}s` }}
                >
                  {bar.icon}
                </span>
                {bar.label}
              </span>
              <span
                className={cn(
                  'font-display text-lg tabular-nums',
                  bar.textColor
                )}
              >
                <AnimatedNumber value={bar.value} />
              </span>
            </div>
            <div className="h-3 rounded-full bg-magic-950/60 overflow-hidden relative">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  'bg-gradient-to-r',
                  bar.color,
                  bar.glow,
                  isCultivating && 'relative overflow-hidden'
                )}
                style={{ width: `${bar.value}%` }}
              >
                {isCultivating && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                    style={{ backgroundSize: '200% 100%' }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
