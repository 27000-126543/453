import type { IncubationEvent } from '@/types';
import { cn } from '@/utils';

interface EventNotificationProps {
  events: IncubationEvent[];
}

const eventConfig: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  gene_crash: {
    icon: '⚠️',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  consciousness_binding: {
    icon: '💚',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  energy_surge: {
    icon: '⚡',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  mutation_trigger: {
    icon: '🧬',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/30',
  },
  stable: {
    icon: '✅',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
};

const impactLabels: Record<string, string> = {
  growth: '成长度',
  syncRate: '同步率',
  awakening: '觉醒度',
  talentBonus: '天赋',
};

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export default function EventNotification({ events }: EventNotificationProps) {
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="glass-card p-5 animate-fade-in flex flex-col h-full">
      <h3 className="font-display text-xl text-magic-300 text-shadow-purple tracking-widest mb-4 text-center">
        培养日志
      </h3>

      {sortedEvents.length > 0 ? (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {sortedEvents.map((event, index) => {
            const config = eventConfig[event.type] || eventConfig.stable;
            const isNewest = index === 0;
            const impactEntries = Object.entries(event.impact).filter(
              ([, v]) => v !== undefined && v !== 0
            );

            return (
              <div
                key={event.id}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-300',
                  config.bg,
                  config.border,
                  isNewest && 'animate-slide-up ring-1 ring-magic-400/40'
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      'text-xl flex-shrink-0 mt-0.5',
                      isNewest && 'animate-pulse'
                    )}
                  >
                    {config.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={cn('text-sm leading-snug', config.color)}>
                        {event.message}
                      </p>
                      <span className="text-[10px] text-gray-500 flex-shrink-0">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    {impactEntries.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {impactEntries.map(([key, value]) => {
                          const isPositive = (value as number) > 0;
                          return (
                            <span
                              key={key}
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded',
                                isPositive
                                  ? 'text-emerald-400 bg-emerald-500/20'
                                  : 'text-red-400 bg-red-500/20'
                              )}
                            >
                              {impactLabels[key] || key} {isPositive ? '+' : ''}
                              {value}
                              {key === 'talentBonus' ? '%' : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
          <div className="text-4xl mb-3 opacity-50">📜</div>
          <p className="text-gray-400 text-sm">暂无事件记录</p>
          <p className="text-gray-500 text-xs mt-1">
            开始培养后将显示培养过程中的事件
          </p>
        </div>
      )}
    </div>
  );
}
