import type { Clone } from '@/types';
import { cn, getRarityColor, getRarityBorder, getRaceName, getElementName, getRarityName } from '@/utils';
import { Star } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import StatRadar from '@/components/collection/StatRadar';

interface CloneDetailModalProps {
  clone: Clone;
  onClose: () => void;
}

const raceEmoji: Record<string, string> = {
  human: '👤',
  elf: '🧝',
  orc: '👹',
  dragon: '🐉',
  undead: '💀',
  demon: '👿',
};

const statNames: Record<string, string> = {
  strength: '力量',
  agility: '敏捷',
  magic: '魔力',
  constitution: '体质',
  perception: '感知',
  willpower: '意志',
};

const statColors: Record<string, string> = {
  strength: 'text-red-400',
  agility: 'text-green-400',
  magic: 'text-purple-400',
  constitution: 'text-amber-400',
  perception: 'text-cyan-400',
  willpower: 'text-blue-400',
};

export default function CloneDetailModal({ clone, onClose }: CloneDetailModalProps) {
  const { toggleFavorite } = useGameStore();

  return (
    <div
      className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in')}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'glass-card relative w-full max-w-3xl max-h-[90vh] p-6 mx-4 animate-slide-up border-2 overflow-y-auto',
          getRarityBorder(clone.rarity)
        )}
      >
        <div className={cn('flex justify-between items-start mb-6')}>
          <div className={cn('flex items-center gap-4')}>
            <div className={cn(
              'relative w-20 h-20 rounded-full flex items-center justify-center',
              'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40',
              'border-2',
              getRarityBorder(clone.rarity)
            )}>
              <span className={cn('text-4xl')}>{raceEmoji[clone.race] ?? '🧬'}</span>
            </div>
            <div>
              <h2 className={cn('font-display text-2xl mb-1', getRarityColor(clone.rarity))}>
                {clone.name}
              </h2>
              <div className={cn('flex items-center gap-2')}>
                <span className={cn(
                  'inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300'
                )}>
                  {getRaceName(clone.race)}
                </span>
                <span className={cn(
                  'inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300'
                )}>
                  {getElementName(clone.element)}
                </span>
                <span className={cn(
                  'inline-block px-3 py-1 text-sm rounded-full border',
                  getRarityBorder(clone.rarity),
                  getRarityColor(clone.rarity)
                )}>
                  {getRarityName(clone.rarity)}
                </span>
              </div>
            </div>
          </div>

          <div className={cn('flex items-center gap-2')}>
            <button
              onClick={() => toggleFavorite(clone.id)}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full transition-all',
                'hover:bg-white/10'
              )}
            >
              <Star className={cn(
                'w-6 h-6 transition-all',
                clone.isFavorite
                  ? 'text-arcane-gold fill-arcane-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-gray-400'
              )} />
            </button>
            <button
              onClick={onClose}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors'
              )}
            >
              ✕
            </button>
          </div>
        </div>

        <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
          <div className={cn('flex flex-col items-center')}>
            <StatRadar stats={clone.stats} />
          </div>

          <div className={cn('flex flex-col gap-4')}>
            <div className={cn('grid grid-cols-2 gap-2')}>
              {Object.entries(clone.stats).map(([stat, value]) => (
                <div key={stat} className={cn(
                  'flex justify-between items-center p-2 rounded-lg bg-magic-950/50'
                )}>
                  <span className={cn('text-sm text-gray-400')}>{statNames[stat] ?? stat}</span>
                  <span className={cn('font-display text-lg tabular-nums', statColors[stat])}>
                    {Math.round(value)}
                  </span>
                </div>
              ))}
            </div>

            <div className={cn('grid grid-cols-2 gap-2')}>
              <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
                <span className={cn('text-xs text-gray-400 mb-1')}>同步率</span>
                <span className={cn('font-display text-xl text-blue-400 tabular-nums')}>
                  {Math.round(clone.syncRate)}%
                </span>
              </div>
              <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
                <span className={cn('text-xs text-gray-400 mb-1')}>觉醒等级</span>
                <span className={cn('font-display text-xl text-magic-300 tabular-nums')}>
                  Lv.{clone.awakeningLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {clone.talents.length > 0 && (
          <div className={cn('mt-6')}>
            <h4 className={cn(
              'font-display text-lg text-arcane-gold text-shadow-gold mb-3'
            )}>
              ✨ 天赋 ({clone.talents.length})
            </h4>
            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-2')}>
              {clone.talents.map((talent) => (
                <div
                  key={talent.id}
                  className={cn(
                    'p-3 rounded-lg bg-magic-950/50 border',
                    getRarityBorder(talent.rarity)
                  )}
                >
                  <div className={cn('flex items-center justify-between mb-1')}>
                    <span className={cn('font-display', getRarityColor(talent.rarity))}>
                      {talent.name}
                    </span>
                    {talent.isRare && (
                      <span className={cn('text-xs text-fuchsia-400')}>稀有</span>
                    )}
                  </div>
                  <p className={cn('text-xs text-gray-400')}>{talent.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {clone.skills.length > 0 && (
          <div className={cn('mt-6')}>
            <h4 className={cn(
              'font-display text-lg text-magic-300 text-shadow-purple mb-3'
            )}>
              ⚔️ 技能 ({clone.skills.length})
            </h4>
            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-2')}>
              {clone.skills.map((skill) => (
                <div
                  key={skill.id}
                  className={cn(
                    'p-3 rounded-lg bg-magic-950/50 border',
                    skill.isMutated ? 'border-fuchsia-500' : 'border-magic-500/30'
                  )}
                >
                  <div className={cn('flex items-center justify-between mb-1')}>
                    <span className={cn(
                      'font-display',
                      skill.isMutated ? 'text-fuchsia-400' : 'text-magic-300'
                    )}>
                      {skill.name}
                      {skill.isMutated && ' (突变)'}
                    </span>
                    <span className={cn('text-xs text-gray-400')}>
                      威力 {skill.power} | CD {skill.cooldown}s
                    </span>
                  </div>
                  <p className={cn('text-xs text-gray-400')}>{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn('mt-6 pt-4 border-t border-magic-500/20 text-center')}>
          <span className={cn('text-xs text-gray-500')}>
            培养时间: {new Date(clone.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
