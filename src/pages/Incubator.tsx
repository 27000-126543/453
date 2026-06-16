import { useState } from 'react';
import GeneSlot from '@/components/incubator/GeneSlot';
import CoreSlot from '@/components/incubator/CoreSlot';
import StatPreview from '@/components/incubator/StatPreview';
import ProgressMonitor from '@/components/incubator/ProgressMonitor';
import PotionInjector from '@/components/incubator/PotionInjector';
import EventNotification from '@/components/incubator/EventNotification';
import IncubatorStatus from '@/components/lab/IncubatorStatus';
import GeneCard from '@/components/gene-bank/GeneCard';
import CoreCard from '@/components/gene-bank/CoreCard';
import { useGameStore } from '@/store/useGameStore';
import { cn, getRarityColor, getRaceName, getElementName } from '@/utils';
import { Play, Sparkles, FlaskConical } from 'lucide-react';
import type { GeneSample, EnergyCore } from '@/types';

type SelectionPanel = 'gene-0' | 'gene-1' | 'gene-2' | 'main-core' | 'aux-core' | null;

export default function Incubator() {
  const {
    currentSession,
    geneSamples,
    energyCores,
    skillLevel,
    market,
    setGeneSlot,
    setMainCore,
    setAuxCore,
    startCultivation,
    finalizeClone,
    getGuildSuccessRateBonus,
    getGuildSyncBonus,
  } = useGameStore();

  const guildSuccessBonus = getGuildSuccessRateBonus();
  const guildSyncBonus = getGuildSyncBonus();
  const hasGeneRevolution = market.geneRevolution !== null;
  const geneRevoBonus = hasGeneRevolution ? (market.geneRevolution!.successRateBonus * 100) : 0;
  const totalSuccessBonus = guildSuccessBonus + geneRevoBonus;

  const [activePanel, setActivePanel] = useState<SelectionPanel>(null);
  const isConfiguring = currentSession.status === 'idle' || currentSession.status === 'configuring';
  const isCultivating = currentSession.status === 'cultivating';
  const isCompleted = currentSession.status === 'completed';

  const handleGeneSlotClick = (index: number) => {
    if (currentSession.status !== 'idle' && currentSession.status !== 'configuring') return;
    if (currentSession.geneSlots[index]) {
      setGeneSlot(index, null);
    } else {
      setActivePanel(`gene-${index}` as SelectionPanel);
    }
  };

  const handleCoreSlotClick = (slot: 'main' | 'aux') => {
    if (currentSession.status !== 'idle' && currentSession.status !== 'configuring') return;
    if (slot === 'main') {
      if (currentSession.mainCore) {
        setMainCore(null);
      } else {
        setActivePanel('main-core');
      }
    } else {
      if (currentSession.auxCore) {
        setAuxCore(null);
      } else {
        setActivePanel('aux-core');
      }
    }
  };

  const handleSelectGene = (gene: GeneSample) => {
    if (activePanel === 'gene-0') setGeneSlot(0, gene);
    else if (activePanel === 'gene-1') setGeneSlot(1, gene);
    else if (activePanel === 'gene-2') setGeneSlot(2, gene);
    setActivePanel(null);
  };

  const handleSelectCore = (core: EnergyCore) => {
    if (activePanel === 'main-core') setMainCore(core);
    else if (activePanel === 'aux-core') setAuxCore(core);
    setActivePanel(null);
  };

  const canStart = () => {
    const hasAtLeastOneGene = currentSession.geneSlots.some((s) => s !== null);
    const hasMainCore = currentSession.mainCore !== null;
    return hasAtLeastOneGene && hasMainCore && (currentSession.status === 'idle' || currentSession.status === 'configuring');
  };

  const renderSelectionPanel = () => {
    if (!activePanel) return null;

    const isGeneSelection = activePanel.startsWith('gene-');

    return (
      <div
        className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in')}
        onClick={() => setActivePanel(null)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn('glass-card w-full max-w-4xl max-h-[80vh] p-6 mx-4 animate-slide-up flex flex-col')}
        >
          <div className={cn('flex justify-between items-center mb-4')}>
            <h3 className={cn(
              'font-display text-xl text-magic-300 text-shadow-purple'
            )}>
              {isGeneSelection ? '选择基因样本' : '选择能量核心'}
            </h3>
            <button
              onClick={() => setActivePanel(null)}
              className={cn(
                'w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors'
              )}
            >
              ✕
            </button>
          </div>
          <div className={cn('flex-1 overflow-y-auto pr-2')}>
            {isGeneSelection ? (
              <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3')}>
                {geneSamples.map((gene) => (
                  <GeneCard
                    key={gene.id}
                    sample={gene}
                    onClick={() => handleSelectGene(gene)}
                  />
                ))}
              </div>
            ) : (
              <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3')}>
                {energyCores.map((core) => (
                  <CoreCard
                    key={core.id}
                    core={core}
                    onClick={() => handleSelectCore(core)}
                    isAux={activePanel === 'aux-core'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      <div className={cn('text-center mb-8')}>
        <div className={cn('flex items-center justify-center gap-2 mb-2')}>
          <FlaskConical className={cn('w-8 h-8 text-magic-400')} />
          <h1 className={cn(
            'font-display text-3xl text-magic-300 text-shadow-purple tracking-wider'
          )}>
            克隆培养舱
          </h1>
        </div>
      </div>

      <div className={cn('grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6')}>
        <div className={cn('flex flex-col gap-6')}>
          {isConfiguring && (
            <>
              <div className={cn('glass-card p-6 flex flex-col gap-6')}>
                <h3 className={cn(
                  'font-display text-lg text-arcane-gold text-shadow-gold text-center tracking-wider'
                )}>
                  基因插槽
                </h3>
                <div className={cn('flex items-center justify-center gap-8 flex-wrap')}>
                  {currentSession.geneSlots.map((slot, index) => (
                    <GeneSlot
                      key={index}
                      index={index}
                      sample={slot}
                      onClick={() => handleGeneSlotClick(index)}
                      disabled={!isConfiguring}
                      prevSample={index > 0 ? currentSession.geneSlots[index - 1] : null}
                    />
                  ))}
                </div>
              </div>

              <div className={cn('glass-card p-6 flex flex-col gap-6')}>
                <h3 className={cn(
                  'font-display text-lg text-arcane-gold text-shadow-gold text-center tracking-wider'
                )}>
                  能量核心
                </h3>
                <div className={cn('flex items-center justify-center gap-16 flex-wrap')}>
                  <CoreSlot
                    core={currentSession.mainCore}
                    label="主核心"
                    onClick={() => handleCoreSlotClick('main')}
                    disabled={!isConfiguring}
                  />
                  <CoreSlot
                    core={currentSession.auxCore}
                    label="辅助核心"
                    onClick={() => handleCoreSlotClick('aux')}
                    disabled={!isConfiguring}
                    isAux
                  />
                </div>
              </div>

              <StatPreview
                stats={currentSession.estimatedStats}
                talentChance={currentSession.estimatedTalentChance}
                mutationChance={currentSession.estimatedMutationChance}
              />

              <button
                onClick={startCultivation}
                disabled={!canStart()}
                className={cn(
                  'flex items-center justify-center gap-3 py-5 px-8 rounded-2xl',
                  'font-display text-xl text-white tracking-wider',
                  'transition-all duration-300',
                  canStart()
                    ? cn(
                        'bg-gradient-to-r from-arcane-gold via-amber-400 to-arcane-gold',
                        'hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400',
                        'shadow-[0_0_40px_rgba(251,191,36,0.5)]',
                        'hover:shadow-[0_0_60px_rgba(251,191,36,0.7)]',
                        'active:scale-[0.98]',
                        'animate-pulse-glow'
                      )
                    : cn(
                        'bg-gray-700 opacity-50 cursor-not-allowed'
                      )
                )}
              >
                <Play className={cn('w-6 h-6')} />
                <Sparkles className={cn('w-6 h-6')} />
                开始培养
              </button>
            </>
          )}

          {(isCultivating || isCompleted) && (
            <>
              <ProgressMonitor
                growth={currentSession.growth}
                syncRate={currentSession.syncRate}
                awakening={currentSession.awakening}
                status={currentSession.status}
              />
              <IncubatorStatus />
              <PotionInjector />
              <EventNotification events={currentSession.events} />

              {isCompleted && (
                <button
                  onClick={finalizeClone}
                  className={cn(
                    'flex items-center justify-center gap-3 py-5 px-8 rounded-2xl',
                    'font-display text-xl text-white tracking-wider',
                    'transition-all duration-300',
                    'bg-gradient-to-r from-magic-600 via-fuchsia-500 to-magic-600',
                    'hover:from-fuchsia-500 hover:via-purple-400 hover:to-fuchsia-500',
                    'shadow-[0_0_40px_rgba(139,92,246,0.5)]',
                    'hover:shadow-[0_0_60px_rgba(139,92,246,0.7)]',
                    'active:scale-[0.98]',
                    'animate-pulse-glow'
                  )}
                >
                  <Sparkles className={cn('w-6 h-6')} />
                  生成克隆体
                </button>
              )}
            </>
          )}
        </div>

        <div className={cn('flex flex-col gap-6')}>
          {(totalSuccessBonus > 0 || guildSyncBonus > 0 || hasGeneRevolution) && (
            <div className={cn('glass-card p-5 flex flex-col gap-3')}>
              <h3 className={cn(
                'font-display text-lg text-arcane-gold text-shadow-gold tracking-wider text-center border-b border-magic-500/20 pb-3'
              )}>
                ✨ 生效加成
              </h3>

              {guildSuccessBonus > 0 && (
                <div className={cn('flex justify-between items-center p-2 rounded-lg bg-magic-950/50')}>
                  <span className={cn('text-sm text-gray-300')}>🏭 联合克隆工坊</span>
                  <span className={cn('text-sm text-green-400 font-display')}>+{guildSuccessBonus.toFixed(1)}% 成功率</span>
                </div>
              )}

              {guildSyncBonus > 0 && (
                <div className={cn('flex justify-between items-center p-2 rounded-lg bg-magic-950/50')}>
                  <span className={cn('text-sm text-gray-300')}>🗼 意识同步塔</span>
                  <span className={cn('text-sm text-cyan-400 font-display')}>+{guildSyncBonus.toFixed(1)}% 同步效率</span>
                </div>
              )}

              {hasGeneRevolution && (
                <div className={cn('flex justify-between items-center p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30')}>
                  <span className={cn('text-sm text-amber-300')}>🔥 基因革命</span>
                  <span className={cn('text-sm text-amber-400 font-display')}>+{geneRevoBonus.toFixed(1)}% 成功率</span>
                </div>
              )}

              {totalSuccessBonus > 0 && (
                <div className={cn('pt-2 border-t border-magic-500/20 flex justify-between items-center')}>
                  <span className={cn('text-xs text-gray-400')}>总成功率加成</span>
                  <span className={cn('text-sm text-arcane-gold font-display')}>+{totalSuccessBonus.toFixed(1)}%</span>
                </div>
              )}
            </div>
          )}

          <div className={cn('glass-card p-5 flex flex-col gap-4')}>
            <h3 className={cn(
              'font-display text-lg text-magic-300 text-shadow-purple tracking-wider text-center border-b border-magic-500/20 pb-3'
            )}>
              当前配置
            </h3>

            <div className={cn('flex flex-col gap-2')}>
              <span className={cn('text-sm text-gray-400 font-display')}>基因样本</span>
              {currentSession.geneSlots.every((s) => s === null) ? (
                <span className={cn('text-sm text-gray-500')}>未选择</span>
              ) : (
                currentSession.geneSlots.map((slot, index) => (
                  slot && (
                    <div key={index} className={cn('flex items-center gap-2 p-2 rounded-lg bg-magic-950/50')}>
                      <span className={cn('text-xl')}>{slot.icon}</span>
                      <div>
                        <div className={cn('text-sm font-display', getRarityColor(slot.rarity))}>
                          {slot.name}
                        </div>
                        <div className={cn('text-xs text-gray-400')}>
                          {getRaceName(slot.race)}
                        </div>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>

            <div className={cn('flex flex-col gap-2')}>
              <span className={cn('text-sm text-gray-400 font-display')}>能量核心</span>
              {currentSession.mainCore && (
                <div className={cn('flex items-center gap-2 p-2 rounded-lg bg-magic-950/50')}>
                  <span className={cn('text-xl')}>{currentSession.mainCore.icon}</span>
                  <div>
                    <div className={cn('text-sm font-display', getRarityColor(currentSession.mainCore.rarity))}>
                      {currentSession.mainCore.name} (主)
                    </div>
                    <div className={cn('text-xs text-gray-400')}>
                      {getElementName(currentSession.mainCore.element)}
                    </div>
                  </div>
                </div>
              )}
              {currentSession.auxCore && (
                <div className={cn('flex items-center gap-2 p-2 rounded-lg bg-magic-950/50')}>
                  <span className={cn('text-xl')}>{currentSession.auxCore.icon}</span>
                  <div>
                    <div className={cn('text-sm font-display text-arcane-cyan')}>
                      {currentSession.auxCore.name} (辅)
                    </div>
                    <div className={cn('text-xs text-gray-400')}>
                      {getElementName(currentSession.auxCore.element)}
                    </div>
                  </div>
                </div>
              )}
              {!currentSession.mainCore && !currentSession.auxCore && (
                <span className={cn('text-sm text-gray-500')}>未选择</span>
              )}
            </div>
          </div>

          <div className={cn('glass-card p-5 flex flex-col gap-4')}>
            <h3 className={cn(
              'font-display text-lg text-arcane-gold text-shadow-gold tracking-wider text-center border-b border-magic-500/20 pb-3'
            )}>
              研究员技能
            </h3>
            <div className={cn('space-y-3')}>
              <div className={cn('flex justify-between items-center')}>
                <span className={cn('text-sm text-gray-300')}>技能等级</span>
                <span className={cn('font-display text-arcane-gold text-lg')}>Lv.{skillLevel}</span>
              </div>
              <div className={cn('flex justify-between items-center')}>
                <span className={cn('text-sm text-gray-300')}>属性加成</span>
                <span className={cn('text-green-400 text-sm')}>+{skillLevel * 2}%</span>
              </div>
              <div className={cn('flex justify-between items-center')}>
                <span className={cn('text-sm text-gray-300')}>同步率加成</span>
                <span className={cn('text-blue-400 text-sm')}>+{skillLevel * 1.5}%</span>
              </div>
              <div className={cn('flex justify-between items-center')}>
                <span className={cn('text-sm text-gray-300')}>天赋几率</span>
                <span className={cn('text-fuchsia-400 text-sm')}>+{skillLevel * 1}%</span>
              </div>
            </div>
          </div>

          <div className={cn('glass-card p-5 flex flex-col gap-3')}>
            <h3 className={cn(
              'font-display text-lg text-magic-300 text-shadow-purple tracking-wider text-center border-b border-magic-500/20 pb-3'
            )}>
              💡 培养提示
            </h3>
            <ul className={cn('space-y-2 text-sm text-gray-400')}>
              <li>• 定时注入成长药剂可加速培养</li>
              <li>• 同步药剂能提高克隆体的意识同步率</li>
              <li>• 觉醒药剂有几率触发稀有天赋</li>
              <li>• 混合不同种族的基因可能产生突变</li>
              <li>• 高稀有度核心能大幅提升属性</li>
            </ul>
          </div>
        </div>
      </div>

      {renderSelectionPanel()}
    </div>
  );
}
