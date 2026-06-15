import { useState } from 'react';
import CategoryTabs from '@/components/gene-bank/CategoryTabs';
import GeneCard from '@/components/gene-bank/GeneCard';
import CoreCard from '@/components/gene-bank/CoreCard';
import ItemDetailModal from '@/components/gene-bank/ItemDetailModal';
import { useGameStore } from '@/store/useGameStore';
import { cn, getRarityColor, getRarityBorder } from '@/utils';
import type { GeneSample, EnergyCore, Potion } from '@/types';

export default function GeneBank() {
  const { geneSamples, energyCores, potions } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<string>('genes');
  const [selectedItem, setSelectedItem] = useState<GeneSample | EnergyCore | Potion | null>(null);
  const [selectedType, setSelectedType] = useState<'gene' | 'core' | 'potion'>('gene');

  const handleGeneClick = (gene: GeneSample) => {
    setSelectedItem(gene);
    setSelectedType('gene');
  };

  const handleCoreClick = (core: EnergyCore) => {
    setSelectedItem(core);
    setSelectedType('core');
  };

  const handlePotionClick = (potion: Potion) => {
    setSelectedItem(potion);
    setSelectedType('potion');
  };

  const renderPotions = () => (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4')}>
      {potions.map((potion) => (
        <div
          key={potion.id}
          onClick={() => handlePotionClick(potion)}
          className={cn(
            'glass-card cursor-pointer p-4 transition-all duration-300 animate-slide-up border-2',
            getRarityBorder(potion.rarity),
            'hover:-translate-y-1 hover:shadow-lg'
          )}
        >
          <div className={cn('flex flex-col items-center text-center')}>
            <div className={cn('text-5xl mb-2')}>{potion.icon}</div>
            <h3 className={cn('font-display text-base mb-1', getRarityColor(potion.rarity))}>
              {potion.name}
            </h3>
            <span className={cn('inline-block px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-300 mb-3')}>
              数量: {potion.quantity}
            </span>
            <p className={cn('text-xs text-gray-400 leading-relaxed')}>
              {potion.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      <div className={cn('text-center mb-8')}>
        <h1 className={cn(
          'font-display text-3xl text-arcane-gold text-shadow-gold tracking-wider mb-3'
        )}>
          基因库
        </h1>
        <p className={cn('text-gray-400')}>
          收集各种族基因样本与魔力能量核心
        </p>
      </div>

      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className={cn('mt-6')}>
        {activeCategory === 'genes' && (
          <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4')}>
            {geneSamples.map((gene) => (
              <GeneCard
                key={gene.id}
                sample={gene}
                onClick={() => handleGeneClick(gene)}
              />
            ))}
          </div>
        )}

        {activeCategory === 'cores' && (
          <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4')}>
            {energyCores.map((core) => (
              <CoreCard
                key={core.id}
                core={core}
                onClick={() => handleCoreClick(core)}
              />
            ))}
          </div>
        )}

        {activeCategory === 'potions' && renderPotions()}
      </div>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          type={selectedType}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
