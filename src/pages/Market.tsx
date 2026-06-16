import React, { useState, useEffect, useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { cn, getRaceName, getElementName, getRarityColor, getRarityBorder, getRarityName } from '@/utils';
import { getPriceSuggestion } from '@/engine/tradeEngine';
import { ShoppingCart, Tag, TrendingUp, TrendingDown, Minus, Clock, Coins, AlertTriangle, Flame, X } from 'lucide-react';
import type { Clone, GeneSample, MarketListing, Rarity, ListingType, PriceSuggestion as PriceSuggestionType } from '@/types';

type TabType = 'hall' | 'myListings' | 'sell';
type TypeFilter = 'all' | ListingType;
type RarityFilter = 'all' | Rarity;

const raceEmoji: Record<string, string> = {
  human: '👤',
  elf: '🧝',
  orc: '👹',
  dragon: '🐉',
  undead: '💀',
  demon: '👿',
};

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return '已结束';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) return `${hours}时${minutes}分`;
  if (minutes > 0) return `${minutes}分${seconds}秒`;
  return `${seconds}秒`;
}

function isClone(item: Clone | GeneSample): item is Clone {
  return 'race' in item && 'element' in item && 'syncRate' in item;
}

export default function Market() {
  const {
    clones,
    geneSamples,
    gold,
    market,
    createListing,
    cancelListing,
    buyListing,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('hall');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSellItem, setSelectedSellItem] = useState<Clone | GeneSample | null>(null);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [sellDuration, setSellDuration] = useState<number>(24);
  const [timeNow, setTimeNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTimeNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const listings = useMemo(() => {
    let result = [...market.listings];
    if (typeFilter !== 'all') {
      result = result.filter((l) => l.type === typeFilter);
    }
    if (rarityFilter !== 'all') {
      result = result.filter((l) => l.item.rarity === rarityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.item.name.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q));
    }
    return result;
  }, [market.listings, typeFilter, rarityFilter, searchQuery]);

  const priceSuggestion: PriceSuggestionType | null = useMemo(() => {
    if (!selectedSellItem) return null;
    return getPriceSuggestion(selectedSellItem, market.tradeHistory);
  }, [selectedSellItem, market.tradeHistory]);

  useEffect(() => {
    if (priceSuggestion) {
      setSellPrice(priceSuggestion.average);
    }
  }, [priceSuggestion]);

  const handleBuyListing = (listing: MarketListing) => {
    buyListing(listing);
  };

  const handleCancelListing = (listingId: string) => {
    cancelListing(listingId);
  };

  const handleCreateListing = () => {
    if (!selectedSellItem || sellPrice <= 0) return;
    createListing(selectedSellItem, sellPrice, sellDuration);
    setSelectedSellItem(null);
    setSellPrice(0);
  };

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className={cn('w-5 h-5 text-green-400')} />;
    if (trend === 'down') return <TrendingDown className={cn('w-5 h-5 text-red-400')} />;
    return <Minus className={cn('w-5 h-5 text-gray-400')} />;
  };

  const renderListingCard = (listing: MarketListing, showCancel: boolean = false) => {
    const item = listing.item;
    const isCloneItem = isClone(item);
    const icon = isCloneItem ? raceEmoji[item.race] ?? '🧬' : '🧬';

    return (
      <div
        key={listing.id}
        className={cn(
          'glass-card p-4 transition-all duration-300 animate-slide-up border-2',
          getRarityBorder(item.rarity),
          'hover:-translate-y-1 hover:shadow-lg'
        )}
      >
        <div className={cn('flex items-center gap-2 mb-3')}>
          <div className={cn(
            'w-8 h-8 rounded-full bg-gradient-to-br from-magic-600/40 to-magic-800/40',
            'flex items-center justify-center text-sm font-display text-magic-200 border border-magic-500/30'
          )}>
            {listing.sellerName.charAt(0)}
          </div>
          <span className={cn('text-sm text-gray-300 font-display')}>{listing.sellerName}</span>
        </div>

        <div className={cn('flex flex-col items-center text-center mb-3')}>
          <div className={cn(
            'relative w-16 h-16 rounded-full mb-2 flex items-center justify-center',
            'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40',
            'border-2',
            getRarityBorder(item.rarity)
          )}>
            <span className={cn('text-3xl')}>{icon}</span>
          </div>

          <h3 className={cn('font-display text-base mb-1', getRarityColor(item.rarity))}>
            {item.name}
          </h3>

          <span className={cn(
            'inline-block px-2 py-0.5 text-xs rounded-full mb-2',
            isCloneItem ? 'bg-magic-600/20 text-magic-300' : 'bg-arcane-gold/20 text-arcane-gold'
          )}>
            {isCloneItem ? '克隆体' : '基因样本'}
          </span>

          <div className={cn('flex items-center gap-2 mb-1')}>
            <span className={cn(
              'inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300'
            )}>
              {getRaceName(item.race)}
            </span>
            {isCloneItem && (
              <span className={cn(
                'inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300'
              )}>
                {getElementName(item.element)}
              </span>
            )}
          </div>

          {isCloneItem ? (
            <div className={cn('text-xs text-blue-400 font-display')}>
              同步率 {Math.round(item.syncRate)}%
            </div>
          ) : (
            <div className={cn('text-xs text-gray-400 font-display')}>
              {getRarityName(item.rarity)}
            </div>
          )}
        </div>

        <div className={cn(
          'flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r from-arcane-gold/10 to-arcane-gold/5 mb-3'
        )}>
          <Coins className={cn('w-4 h-4 text-arcane-gold')} />
          <span className={cn('font-display text-lg text-arcane-gold tabular-nums')}>
            {listing.price.toLocaleString()}
          </span>
        </div>

        <div className={cn('flex gap-2')}>
          {!showCancel ? (
            <button
              onClick={() => handleBuyListing(listing)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg',
                'bg-gradient-to-r from-magic-600 to-magic-500',
                'hover:from-magic-500 hover:to-magic-400',
                'transition-all duration-300',
                'font-display text-sm text-white',
                'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
                'hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]',
                'active:scale-[0.98]'
              )}
            >
              <ShoppingCart className={cn('w-4 h-4')} />
              购买
            </button>
          ) : (
            <>
              <div className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg',
                'bg-magic-950/50 text-gray-400 font-display text-sm'
              )}>
                <Clock className={cn('w-4 h-4')} />
                {formatTimeRemaining(listing.expiresAt - timeNow)}
              </div>
              <button
                onClick={() => handleCancelListing(listing.id)}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg',
                  'bg-gradient-to-r from-red-600/80 to-red-500/80',
                  'hover:from-red-500 hover:to-red-400',
                  'transition-all duration-300',
                  'font-display text-sm text-white',
                  'active:scale-[0.98]'
                )}
              >
                <X className={cn('w-4 h-4')} />
                撤销
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderSelectableItemCard = (item: Clone | GeneSample, isSelected: boolean) => {
    const isCloneItem = isClone(item);
    const icon = isCloneItem ? raceEmoji[item.race] ?? '🧬' : '🧬';

    return (
      <div
        key={item.id}
        onClick={() => setSelectedSellItem(item)}
        className={cn(
          'glass-card cursor-pointer p-3 transition-all duration-300 animate-slide-up border-2',
          getRarityBorder(item.rarity),
          isSelected && 'ring-2 ring-arcane-gold magic-glow-gold scale-[1.02]',
          'hover:-translate-y-0.5 hover:shadow-md'
        )}
      >
        <div className={cn('flex flex-col items-center text-center')}>
          <div className={cn(
            'relative w-14 h-14 rounded-full mb-2 flex items-center justify-center',
            'bg-gradient-to-br from-magic-600/40 via-magic-400/30 to-magic-800/40',
            'border-2',
            getRarityBorder(item.rarity)
          )}>
            <span className={cn('text-2xl')}>{icon}</span>
          </div>

          <h3 className={cn('font-display text-sm mb-1', getRarityColor(item.rarity))}>
            {item.name}
          </h3>

          <span className={cn(
            'inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300 mb-1'
          )}>
            {getRaceName(item.race)}
          </span>

          {isCloneItem ? (
            <div className={cn('text-xs text-blue-400 font-display')}>
              {getElementName(item.element)} · {Math.round(item.syncRate)}%
            </div>
          ) : (
            <div className={cn('text-xs text-gray-400 font-display')}>
              {getRarityName(item.rarity)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      <div className={cn('text-center mb-6')}>
        <h1 className={cn(
          'font-display text-3xl text-arcane-gold text-shadow-gold tracking-wider mb-2'
        )}>
          交易市场
        </h1>
        <p className={cn('text-gray-400')}>
          买卖克隆体与基因样本，发现珍稀宝物
        </p>
      </div>

      <div className={cn(
        'glass-card overflow-hidden mb-5 border-2 border-magic-500/30'
      )}>
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-magic-900/50 to-magic-800/30 border-b border-magic-500/20'
        )}>
          <AlertTriangle className={cn('w-4 h-4 text-arcane-gold animate-pulse')} />
          <span className={cn('text-sm font-display text-magic-200')}>最新成交</span>
        </div>
        <div className={cn('relative overflow-hidden py-3')}>
          <div className={cn(
            'flex animate-marquee whitespace-nowrap gap-12'
          )} style={{ animation: 'marquee 30s linear infinite' }}>
            {[...market.announcements, ...market.announcements].map((msg, idx) => (
              <span key={idx} className={cn(
                'text-sm text-gray-300 font-display',
                'px-4 py-1 rounded-full bg-magic-950/50 border border-magic-500/20'
              )}>
                💰 {msg}
              </span>
            ))}
          </div>
        </div>
      </div>

      {market.geneRevolution && timeNow < market.geneRevolution.endTime && (
        <div className={cn(
          'glass-card p-5 mb-5 border-2',
          'bg-gradient-to-r from-arcane-gold/20 via-yellow-600/10 to-arcane-gold/20',
          'border-arcane-gold/50 magic-glow-gold animate-pulse-slow'
        )}>
          <div className={cn('flex flex-col md:flex-row md:items-center md:justify-between gap-4')}>
            <div className={cn('flex items-center gap-3')}>
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-arcane-gold to-yellow-600 shadow-lg'
              )}>
                <Flame className={cn('w-6 h-6 text-white')} />
              </div>
              <div>
                <div className={cn(
                  'font-display text-xl text-arcane-gold text-shadow-gold tracking-wide'
                )}>
                  ⚡ 基因革命事件触发！
                </div>
                <div className={cn('text-sm text-gray-300 mt-1')}>
                  由 <span className={cn('text-magic-300 font-bold')}>{market.geneRevolution.triggeredBy}</span> 购买
                  <span className={cn('text-arcane-gold font-bold')}> [{market.geneRevolution.itemName}] </span>
                  引发全服基因革命热潮！
                </div>
              </div>
            </div>
            <div className={cn('flex items-center gap-6')}>
              <div className={cn('text-center')}>
                <div className={cn('text-xs text-gray-400 mb-1')}>成功率加成</div>
                <div className={cn('font-display text-2xl text-green-400 tabular-nums')}>
                  +{(market.geneRevolution.successRateBonus * 100).toFixed(0)}%
                </div>
              </div>
              <div className={cn('text-center')}>
                <div className={cn('text-xs text-gray-400 mb-1')}>剩余时间</div>
                <div className={cn('font-display text-2xl text-arcane-gold tabular-nums')}>
                  {formatTimeRemaining(market.geneRevolution.endTime - timeNow)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={cn('glass-card p-1.5 mb-6 inline-flex gap-1.5')}>
        {([
          { key: 'hall', label: '市场大厅', icon: ShoppingCart },
          { key: 'myListings', label: '我的挂单', icon: Tag },
          { key: 'sell', label: '出售物品', icon: Flame },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 font-display',
              activeTab === key
                ? 'bg-gradient-to-r from-magic-600 to-magic-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-magic-950/50'
            )}
          >
            <Icon className={cn('w-4 h-4')} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'hall' && (
        <div className={cn('space-y-5')}>
          <div className={cn('glass-card p-4')}>
            <div className={cn('flex flex-wrap items-center gap-4')}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索物品或卖家..."
                className={cn(
                  'flex-1 min-w-[200px] px-4 py-2 rounded-lg bg-magic-950/60 border border-magic-500/30',
                  'text-sm text-gray-200 font-display placeholder:text-gray-500',
                  'focus:outline-none focus:border-magic-400 transition-colors'
                )}
              />

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                className={cn(
                  'px-3 py-2 rounded-lg bg-magic-950/60 border border-magic-500/30',
                  'text-sm text-gray-300 font-display',
                  'focus:outline-none focus:border-magic-400 transition-colors'
                )}
              >
                <option value="all">全部类型</option>
                <option value="clone">克隆体</option>
                <option value="gene">基因样本</option>
              </select>

              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
                className={cn(
                  'px-3 py-2 rounded-lg bg-magic-950/60 border border-magic-500/30',
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
            </div>
          </div>

          {listings.length === 0 ? (
            <div className={cn('glass-card p-12 text-center')}>
              <div className={cn('text-6xl mb-4 opacity-50')}>🏪</div>
              <p className={cn('text-gray-400 font-display')}>当前市场暂无挂单</p>
            </div>
          ) : (
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5')}>
              {listings.map((listing) => renderListingCard(listing))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'myListings' && (
        <div>
          {market.myListings.length === 0 ? (
            <div className={cn('glass-card p-12 text-center')}>
              <div className={cn('text-6xl mb-4 opacity-50')}>📋</div>
              <p className={cn('text-gray-400 font-display mb-2')}>暂无挂单</p>
              <p className={cn('text-sm text-gray-500')}>前往「出售物品」上架你的商品吧</p>
            </div>
          ) : (
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5')}>
              {market.myListings.map((listing) => renderListingCard(listing, true))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sell' && (
        <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-5')}>
          <div className={cn('lg:col-span-2 space-y-5')}>
            <div className={cn('glass-card p-5')}>
              <h2 className={cn(
                'font-display text-lg text-magic-300 mb-4 flex items-center gap-2'
              )}>
                <span>🧬</span> 我的克隆体
              </h2>
              {clones.length === 0 ? (
                <p className={cn('text-sm text-gray-500 text-center py-8')}>暂无克隆体</p>
              ) : (
                <div className={cn('grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3')}>
                  {clones.map((clone) => renderSelectableItemCard(clone, selectedSellItem?.id === clone.id))}
                </div>
              )}
            </div>

            <div className={cn('glass-card p-5')}>
              <h2 className={cn(
                'font-display text-lg text-arcane-gold mb-4 flex items-center gap-2'
              )}>
                <span>🧪</span> 我的基因样本
              </h2>
              {geneSamples.length === 0 ? (
                <p className={cn('text-sm text-gray-500 text-center py-8')}>暂无基因样本</p>
              ) : (
                <div className={cn('grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3')}>
                  {geneSamples.map((sample) => renderSelectableItemCard(sample, selectedSellItem?.id === sample.id))}
                </div>
              )}
            </div>
          </div>

          <div className={cn('lg:col-span-1')}>
            <div className={cn('glass-card p-5 sticky top-24')}>
              <h2 className={cn(
                'font-display text-lg text-magic-300 mb-4 flex items-center gap-2'
              )}>
                <Tag className={cn('w-5 h-5')} /> 定价信息
              </h2>

              {!selectedSellItem ? (
                <div className={cn('text-center py-12')}>
                  <div className={cn('text-5xl mb-3 opacity-50')}>👈</div>
                  <p className={cn('text-gray-400 font-display text-sm')}>请从左侧选择要出售的物品</p>
                </div>
              ) : (
                <div className={cn('space-y-4')}>
                  <div className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    'bg-gradient-to-r from-magic-900/40 to-magic-800/20 border border-magic-500/20'
                  )}>
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      'bg-gradient-to-br from-magic-600/40 to-magic-800/40 border-2',
                      getRarityBorder(selectedSellItem.rarity)
                    )}>
                      <span className={cn('text-2xl')}>
                        {isClone(selectedSellItem) ? raceEmoji[selectedSellItem.race] ?? '🧬' : '🧬'}
                      </span>
                    </div>
                    <div className={cn('flex-1')}>
                      <h3 className={cn('font-display text-base', getRarityColor(selectedSellItem.rarity))}>
                        {selectedSellItem.name}
                      </h3>
                      <p className={cn('text-xs text-gray-400')}>
                        {getRaceName(selectedSellItem.race)}
                        {isClone(selectedSellItem) && ` · ${getElementName(selectedSellItem.element)}`}
                      </p>
                    </div>
                  </div>

                  {priceSuggestion && (
                    <div className={cn(
                      'p-4 rounded-lg bg-magic-950/50 border border-magic-500/20 space-y-3'
                    )}>
                      <div className={cn('flex items-center justify-between')}>
                        <span className={cn('text-sm text-gray-400')}>近7天均价</span>
                        <div className={cn('flex items-center gap-1.5')}>
                          <Coins className={cn('w-3.5 h-3.5 text-arcane-gold')} />
                          <span className={cn('font-display text-arcane-gold tabular-nums')}>
                            {priceSuggestion.sevenDayAvg.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className={cn('flex items-center justify-between')}>
                        <span className={cn('text-sm text-gray-400')}>建议区间</span>
                        <span className={cn('font-display text-magic-300 tabular-nums text-sm')}>
                          {priceSuggestion.min.toLocaleString()} - {priceSuggestion.max.toLocaleString()}
                        </span>
                      </div>

                      <div className={cn('flex items-center justify-between')}>
                        <span className={cn('text-sm text-gray-400')}>价格趋势</span>
                        <div className={cn('flex items-center gap-1')}>
                          {renderTrendIcon(priceSuggestion.trend)}
                          <span className={cn(
                            'font-display text-sm',
                            priceSuggestion.trend === 'up' ? 'text-green-400' :
                            priceSuggestion.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                          )}>
                            {priceSuggestion.trend === 'up' ? '上涨' : priceSuggestion.trend === 'down' ? '下跌' : '稳定'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={cn('block text-sm text-gray-400 mb-2 font-display')}>
                      出售价格（金币）
                    </label>
                    <div className={cn('relative')}>
                      <Coins className={cn('absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-arcane-gold')} />
                      <input
                        type="number"
                        min={1}
                        value={sellPrice}
                        onChange={(e) => setSellPrice(Math.max(0, parseInt(e.target.value) || 0))}
                        className={cn(
                          'w-full pl-11 pr-4 py-3 rounded-lg bg-magic-950/60 border border-magic-500/30',
                          'font-display text-lg text-arcane-gold tabular-nums',
                          'focus:outline-none focus:border-magic-400 transition-colors'
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={cn('block text-sm text-gray-400 mb-2 font-display')}>
                      <Clock className={cn('w-4 h-4 inline mr-1')} />
                      挂单时长
                    </label>
                    <div className={cn('grid grid-cols-3 gap-2')}>
                      {[24, 48, 72].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setSellDuration(hours)}
                          className={cn(
                            'py-2.5 rounded-lg font-display text-sm transition-all duration-300',
                            sellDuration === hours
                              ? 'bg-gradient-to-r from-magic-600 to-magic-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                              : 'bg-magic-950/50 text-gray-400 hover:text-gray-200 border border-magic-500/20'
                          )}
                        >
                          {hours}小时
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateListing}
                    disabled={sellPrice <= 0}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3.5 rounded-lg',
                      'bg-gradient-to-r from-arcane-gold via-yellow-500 to-arcane-gold',
                      'hover:from-yellow-400 hover:via-arcane-gold hover:to-yellow-400',
                      'transition-all duration-300',
                      'font-display text-base text-gray-900 font-bold',
                      'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
                      'hover:shadow-[0_0_35px_rgba(251,191,36,0.6)]',
                      'active:scale-[0.98]',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
                    )}
                  >
                    <Flame className={cn('w-5 h-5')} />
                    上架出售
                  </button>

                  <p className={cn('text-xs text-gray-500 text-center')}>
                    当前金币余额: <span className={cn('text-arcane-gold font-bold')}>{gold.toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
