import type { Talent } from '@/types';
import { cn, getRarityColor, getRarityBorder, getRarityName } from '@/utils';

interface TalentDisplayProps {
  talents: Talent[];
}

export default function TalentDisplay({ talents }: TalentDisplayProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-display text-lg text-magic-300 mb-4 text-shadow-purple">
        天赋技能
      </h3>

      {talents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无天赋
        </div>
      ) : (
        <div className="space-y-3">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className={cn(
                'relative p-3 rounded-lg border transition-all duration-300 overflow-hidden',
                getRarityBorder(talent.rarity),
                'bg-black/30 backdrop-blur-sm',
                talent.rarity === 'legendary' && 'animate-pulse-glow'
              )}
            >
              {talent.isRare && (
                <div
                  className="absolute inset-0 pointer-events-none animate-shimmer"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.15), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                />
              )}

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={cn(
                      'font-display text-sm',
                      getRarityColor(talent.rarity)
                    )}
                  >
                    {talent.isRare && (
                      <span className="text-yellow-400 mr-1">🌟</span>
                    )}
                    {talent.name}
                  </h4>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border',
                      getRarityColor(talent.rarity),
                      getRarityBorder(talent.rarity).replace(
                        'border-',
                        'border-opacity-50 border-'
                      ),
                      'bg-white/5'
                    )}
                  >
                    {getRarityName(talent.rarity)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {talent.effect}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
