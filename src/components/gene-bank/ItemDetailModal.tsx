import type { GeneSample, EnergyCore, Potion } from '@/types';
import { cn, getRarityColor, getRarityBorder, getRarityName, getRaceName, getElementName } from '@/utils';

interface ItemDetailModalProps {
  item: any;
  type: 'gene' | 'core' | 'potion';
  onClose: () => void;
}

const statNames: Record<string, string> = {
  strength: '力量',
  agility: '敏捷',
  magic: '魔力',
  constitution: '体质',
  perception: '感知',
  willpower: '意志',
};

const elementColors: Record<string, string> = {
  fire: 'bg-red-500/30 text-red-300 border-red-500/50',
  water: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
  wind: 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50',
  earth: 'bg-amber-600/30 text-amber-300 border-amber-600/50',
  light: 'bg-yellow-400/30 text-yellow-200 border-yellow-400/50',
  dark: 'bg-purple-700/30 text-purple-300 border-purple-700/50',
  chaos: 'bg-fuchsia-600/30 text-fuchsia-300 border-fuchsia-600/50',
};

const potionTypeNames: Record<string, string> = {
  growth: '成长药剂',
  sync: '同步药剂',
  awakening: '觉醒药剂',
  catalyst: '催化剂',
};

export default function ItemDetailModal({ item, type, onClose }: ItemDetailModalProps) {
  const renderGeneDetails = (gene: GeneSample) => (
    <>
      <span className="inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300">
        {getRaceName(gene.race)}
      </span>
      <div className="w-full space-y-2 mt-2">
        <h4 className="font-display text-sm text-gray-300">属性加成</h4>
        {Object.entries(gene.statBonuses).map(([stat, value]) => (
          <div key={stat} className="flex justify-between items-center text-sm">
            <span className="text-gray-400">{statNames[stat] ?? stat}</span>
            <span className="text-arcane-gold">+{value}</span>
          </div>
        ))}
        {gene.traitBonus && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">特性加成</span>
            <span className="text-magic-300">{gene.traitBonus}</span>
          </div>
        )}
      </div>
    </>
  );

  const renderCoreDetails = (core: EnergyCore) => {
    const concentrationPercent = Math.min((core.energyConcentration / 200) * 100, 100);
    return (
      <>
        <span
          className={cn(
            'inline-block px-3 py-1 text-sm rounded-full border',
            elementColors[core.element]
          )}
        >
          {getElementName(core.element)}
        </span>
        <div className="w-full mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">能量浓度</span>
            <span className="text-arcane-gold">{core.energyConcentration}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${concentrationPercent}%` }}
            />
          </div>
        </div>
        <div className="w-full space-y-2 mt-2">
          <h4 className="font-display text-sm text-gray-300">效果</h4>
          {core.effects.statBoost &&
            Object.entries(core.effects.statBoost).map(([stat, value]) => (
              <div key={stat} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{statNames[stat] ?? stat}</span>
                <span className="text-arcane-gold">+{value}</span>
              </div>
            ))}
          {core.effects.talentBonus !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">天赋加成</span>
              <span className="text-magic-300">+{core.effects.talentBonus}%</span>
            </div>
          )}
          {core.effects.mutationRate !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">突变几率</span>
              <span className="text-fuchsia-400">+{core.effects.mutationRate}%</span>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderPotionDetails = (potion: Potion) => (
    <>
      <span className="inline-block px-3 py-1 text-sm rounded-full bg-white/10 text-gray-300">
        {potionTypeNames[potion.type] ?? potion.type}
      </span>
      <div className="flex justify-between items-center text-sm mt-2">
        <span className="text-gray-400">数量</span>
        <span className="text-arcane-gold">{potion.quantity}</span>
      </div>
      <div className="w-full space-y-2 mt-2">
        <h4 className="font-display text-sm text-gray-300">效果</h4>
        {potion.effects.growthBoost !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">成长加速</span>
            <span className="text-green-400">+{potion.effects.growthBoost}%</span>
          </div>
        )}
        {potion.effects.syncBoost !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">同步提升</span>
            <span className="text-blue-400">+{potion.effects.syncBoost}%</span>
          </div>
        )}
        {potion.effects.awakeningBoost !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">觉醒提升</span>
            <span className="text-purple-400">+{potion.effects.awakeningBoost}%</span>
          </div>
        )}
        {potion.effects.eventAlteration !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">事件概率</span>
            <span className={potion.effects.eventAlteration > 0 ? 'text-red-400' : 'text-green-400'}>
              {potion.effects.eventAlteration > 0 ? '+' : ''}{potion.effects.eventAlteration}%
            </span>
          </div>
        )}
        {potion.effects.talentBonus !== undefined && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">天赋加成</span>
            <span className="text-magic-300">+{potion.effects.talentBonus}%</span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'glass-card relative w-full max-w-lg p-6 mx-4 animate-slide-up border-2',
          getRarityBorder(item.rarity)
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="text-7xl mb-3">{item.icon}</div>
          <h2 className={cn('font-display text-2xl mb-2', getRarityColor(item.rarity))}>
            {item.name}
          </h2>
          <div className="flex items-center gap-2 mb-4">
            <span
              className={cn(
                'inline-block px-3 py-1 text-sm rounded-full border',
                elementColors[item.element] ?? 'bg-white/10 text-gray-300 border-white/20'
              )}
            >
              {getRarityName(item.rarity)}
            </span>
            {type === 'gene' && renderGeneDetails(item as GeneSample)}
            {type === 'core' && renderCoreDetails(item as EnergyCore)}
            {type === 'potion' && renderPotionDetails(item as Potion)}
          </div>

          <div className="w-full mt-4 pt-4 border-t border-white/10">
            <h4 className="font-display text-sm text-gray-300 mb-2 text-left">描述</h4>
            <p className="text-gray-400 text-sm leading-relaxed text-left">{item.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
