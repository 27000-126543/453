import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import type { Potion } from '@/types';
import { cn, getRarityBorder, getRarityColor, getRarityName } from '@/utils';

const effectLabels: Record<string, { label: string; color: string }> = {
  growthBoost: { label: '成长度', color: 'text-emerald-400' },
  syncBoost: { label: '同步率', color: 'text-blue-400' },
  awakeningBoost: { label: '觉醒度', color: 'text-magic-300' },
  eventAlteration: { label: '事件影响', color: 'text-fuchsia-400' },
  talentBonus: { label: '天赋概率', color: 'text-arcane-gold' },
};

export default function PotionInjector() {
  const { potions, injectPotion, currentSession } = useGameStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [injectingId, setInjectingId] = useState<string | null>(null);
  const isCultivating = currentSession.status === 'cultivating';

  const handleInject = (potion: Potion) => {
    if (!isCultivating || potion.quantity <= 0) return;
    setInjectingId(potion.id);
    injectPotion(potion.id);
    setTimeout(() => setInjectingId(null), 800);
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h3 className="font-display text-xl text-magic-300 text-shadow-purple tracking-widest mb-4 text-center">
        能量药剂
      </h3>

      {!isCultivating && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
          <span className="text-amber-400 text-sm">
            ⚠️ 仅在培养中可注入药剂
          </span>
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        {potions.map((potion) => {
          const isDisabled = !isCultivating || potion.quantity <= 0;
          const isInjecting = injectingId === potion.id;
          const isHovered = hoveredId === potion.id;

          return (
            <div
              key={potion.id}
              className="relative"
              onMouseEnter={() => setHoveredId(potion.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => handleInject(potion)}
                disabled={isDisabled}
                className={cn(
                  'relative w-full aspect-square rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-2 border-2',
                  getRarityBorder(potion.rarity),
                  isDisabled
                    ? 'opacity-40 cursor-not-allowed bg-gray-900/50'
                    : 'cursor-pointer hover:scale-105 bg-magic-950/60 hover:bg-magic-900/60'
                )}
              >
                {isInjecting && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                      style={{ backgroundSize: '200% 100%' }}
                    />
                    <div className="absolute inset-0 bg-arcane-gold/20 animate-pulse" />
                  </div>
                )}

                <span className="text-3xl mb-1 drop-shadow-lg">{potion.icon}</span>
                <span className={cn('text-xs font-display truncate w-full text-center', getRarityColor(potion.rarity))}>
                  {potion.name}
                </span>
                <span className={cn(
                  'absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-display',
                  potion.quantity > 0 ? 'bg-magic-600/60 text-white' : 'bg-gray-700/60 text-gray-400'
                )}>
                  x{potion.quantity}
                </span>
              </button>

              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-lg bg-magic-950/95 backdrop-blur-sm border border-magic-400/40 z-50 animate-fade-in">
                  <div className="mb-2">
                    <div className={cn('font-display text-sm', getRarityColor(potion.rarity))}>
                      {potion.name}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {getRarityName(potion.rarity)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{potion.description}</p>
                  <div className="space-y-1 pt-2 border-t border-magic-400/20">
                    {Object.entries(potion.effects).map(([key, value]) => {
                      const effect = effectLabels[key];
                      if (!effect || value === undefined) return null;
                      return (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-400">{effect.label}</span>
                          <span className={effect.color}>+{value}{key === 'talentBonus' || key === 'eventAlteration' ? '%' : ''}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
