import { useState, useMemo } from 'react';
import CloneCard from '@/components/collection/CloneCard';
import CloneDetailModal from '@/components/collection/CloneDetailModal';
import { useGameStore } from '@/store/useGameStore';
import { cn, getRarityName, getRaceName } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Filter, Star } from 'lucide-react';
import type { Clone, Rarity, Race } from '@/types';

type RarityFilter = 'all' | Rarity;
type RaceFilter = 'all' | Race;
type SortBy = 'newest' | 'oldest' | 'rarity' | 'awakening';

export default function Collection() {
  const { clones } = useGameStore();
  const navigate = useNavigate();
  const [selectedClone, setSelectedClone] = useState<Clone | null>(null);
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [raceFilter, setRaceFilter] = useState<RaceFilter>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const stats = useMemo(() => {
    return {
      total: clones.length,
      legendary: clones.filter((c) => c.rarity === 'legendary').length,
      epic: clones.filter((c) => c.rarity === 'epic').length,
      rare: clones.filter((c) => c.rarity === 'rare').length,
      common: clones.filter((c) => c.rarity === 'common').length,
    };
  }, [clones]);

  const filteredClones = useMemo(() => {
    let result = [...clones];

    if (rarityFilter !== 'all') {
      result = result.filter((c) => c.rarity === rarityFilter);
    }

    if (raceFilter !== 'all') {
      result = result.filter((c) => c.race === raceFilter);
    }

    if (showFavoritesOnly) {
      result = result.filter((c) => c.isFavorite);
    }

    const rarityOrder: Record<Rarity, number> = {
      legendary: 0,
      epic: 1,
      rare: 2,
      common: 3,
    };

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'rarity':
        result.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
        break;
      case 'awakening':
        result.sort((a, b) => b.awakeningLevel - a.awakeningLevel);
        break;
    }

    return result;
  }, [clones, rarityFilter, raceFilter, showFavoritesOnly, sortBy]);

  const races = useMemo(() => {
    const uniqueRaces = new Set(clones.map((c) => c.race));
    return Array.from(uniqueRaces);
  }, [clones]);

  if (clones.length === 0) {
    return (
      <div className={cn('pt-20 px-6 pb-6 animate-fade-in min-h-[80vh] flex items-center justify-center')}>
        <div className={cn('glass-card p-12 text-center max-w-md')}>
          <div className={cn('text-8xl mb-6 animate-float')}>🧬</div>
          <h2 className={cn(
            'font-display text-2xl text-magic-300 text-shadow-purple mb-4 tracking-wider'
          )}>
            暂无克隆体
          </h2>
          <p className={cn('text-gray-400 mb-8')}>
            前往培养舱培养第一个克隆体吧！
          </p>
          <button
            onClick={() => navigate('/incubator')}
            className={cn(
              'inline-flex items-center gap-2 px-8 py-4 rounded-xl',
              'bg-gradient-to-r from-magic-600 to-magic-500',
              'hover:from-magic-500 hover:to-magic-400',
              'transition-all duration-300',
              'font-display text-lg text-white tracking-wide',
              'shadow-[0_0_25px_rgba(139,92,246,0.4)]',
              'hover:shadow-[0_0_35px_rgba(139,92,246,0.6)]',
              'active:scale-[0.98]'
            )}
          >
            <FlaskConical className={cn('w-5 h-5')} />
            前往培养舱
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      <div className={cn('text-center mb-8')}>
        <h1 className={cn(
          'font-display text-3xl text-magic-300 text-shadow-purple tracking-wider mb-3'
        )}>
          克隆体图鉴
        </h1>
      </div>

      <div className={cn('glass-card p-5 mb-6')}>
        <div className={cn('grid grid-cols-2 md:grid-cols-5 gap-4')}>
          <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>总克隆体</span>
            <span className={cn('font-display text-2xl text-white tabular-nums')}>
              {stats.total}
            </span>
          </div>
          <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>传说</span>
            <span className={cn('font-display text-2xl text-yellow-400 tabular-nums')}>
              {stats.legendary}
            </span>
          </div>
          <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>史诗</span>
            <span className={cn('font-display text-2xl text-purple-400 tabular-nums')}>
              {stats.epic}
            </span>
          </div>
          <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>稀有</span>
            <span className={cn('font-display text-2xl text-blue-400 tabular-nums')}>
              {stats.rare}
            </span>
          </div>
          <div className={cn('flex flex-col items-center p-3 rounded-lg bg-magic-950/50')}>
            <span className={cn('text-xs text-gray-400 mb-1')}>普通</span>
            <span className={cn('font-display text-2xl text-gray-400 tabular-nums')}>
              {stats.common}
            </span>
          </div>
        </div>
      </div>

      <div className={cn('glass-card p-4 mb-6')}>
        <div className={cn('flex flex-wrap items-center gap-4')}>
          <div className={cn('flex items-center gap-2')}>
            <Filter className={cn('w-4 h-4 text-magic-300')} />
            <span className={cn('text-sm text-gray-300 font-display')}>筛选:</span>
          </div>

          <div className={cn('flex flex-wrap gap-2')}>
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
              className={cn(
                'px-3 py-1.5 rounded-lg bg-magic-950/60 border border-magic-500/30',
                'text-sm text-gray-300 font-display',
                'focus:outline-none focus:border-magic-400 transition-colors'
              )}
            >
              <option value="all">全部稀有度</option>
              <option value="legendary">{getRarityName('legendary')}</option>
              <option value="epic">{getRarityName('epic')}</option>
              <option value="rare">{getRarityName('rare')}</option>
              <option value="common">{getRarityName('common')}</option>
            </select>

            <select
              value={raceFilter}
              onChange={(e) => setRaceFilter(e.target.value as RaceFilter)}
              className={cn(
                'px-3 py-1.5 rounded-lg bg-magic-950/60 border border-magic-500/30',
                'text-sm text-gray-300 font-display',
                'focus:outline-none focus:border-magic-400 transition-colors'
              )}
            >
              <option value="all">全部种族</option>
              {races.map((race) => (
                <option key={race} value={race}>{getRaceName(race)}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300',
                showFavoritesOnly
                  ? 'bg-arcane-gold/20 border-arcane-gold/50 text-arcane-gold'
                  : 'bg-magic-950/60 border-magic-500/30 text-gray-300 hover:border-magic-400'
              )}
            >
              <Star className={cn(
                'w-4 h-4',
                showFavoritesOnly ? 'fill-arcane-gold' : ''
              )} />
              <span className={cn('text-sm font-display')}>收藏</span>
            </button>
          </div>

          <div className={cn('ml-auto flex items-center gap-2')}>
            <span className={cn('text-sm text-gray-300 font-display')}>排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className={cn(
                'px-3 py-1.5 rounded-lg bg-magic-950/60 border border-magic-500/30',
                'text-sm text-gray-300 font-display',
                'focus:outline-none focus:border-magic-400 transition-colors'
              )}
            >
              <option value="newest">最新</option>
              <option value="oldest">最早</option>
              <option value="rarity">稀有度</option>
              <option value="awakening">觉醒等级</option>
            </select>
          </div>
        </div>
      </div>

      {filteredClones.length === 0 ? (
        <div className={cn('glass-card p-12 text-center')}>
          <p className={cn('text-gray-400')}>没有符合条件的克隆体</p>
        </div>
      ) : (
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5')}>
          {filteredClones.map((clone) => (
            <CloneCard
              key={clone.id}
              clone={clone}
              onClick={() => setSelectedClone(clone)}
            />
          ))}
        </div>
      )}

      {selectedClone && (
        <CloneDetailModal
          clone={selectedClone}
          onClose={() => setSelectedClone(null)}
        />
      )}
    </div>
  );
}
