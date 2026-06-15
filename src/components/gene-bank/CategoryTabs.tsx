import { cn } from '@/utils';

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const categories = [
  { key: 'genes', label: '基因样本', icon: '🧬' },
  { key: 'cores', label: '能量核心', icon: '💎' },
  { key: 'potions', label: '能量药剂', icon: '🧪' },
];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 border-b border-magic-500/30">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.key)}
            className={cn(
              'relative flex items-center gap-2 px-6 py-3 font-display text-sm transition-all duration-300',
              isActive
                ? 'text-arcane-gold text-shadow-gold magic-glow-gold'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <span className="text-lg">{cat.icon}</span>
            <span>{cat.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-arcane-gold to-transparent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
