import { NavLink } from 'react-router-dom';
import { FlaskConical, Dna, Beaker, BookOpen, Coins, Sparkles, Star } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/utils';

const navItems = [
  { to: '/', label: '实验室总览', Icon: FlaskConical },
  { to: '/gene-bank', label: '基因库', Icon: Dna },
  { to: '/incubator', label: '培养舱', Icon: Beaker },
  { to: '/collection', label: '克隆图鉴', Icon: BookOpen },
];

export default function Navbar() {
  const { gold, mana, level } = useGameStore();

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16 glass-card',
        'rounded-none border-x-0 border-t-0'
      )}
    >
      <div className={cn('h-full max-w-7xl mx-auto px-4 flex items-center justify-between')}>
        <div className={cn('flex items-center gap-2')}>
          <span className="text-2xl">⚗️</span>
          <h1
            className={cn(
              'font-display text-xl md:text-2xl',
              'text-arcane-gold text-shadow-gold',
              'tracking-wider'
            )}
          >
            魔法克隆实验室
          </h1>
        </div>

        <div className={cn('flex items-center gap-1 md:gap-2')}>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative px-3 py-2 rounded-lg',
                  'flex items-center gap-2',
                  'transition-all duration-300',
                  'hover:bg-magic-500/10',
                  isActive
                    ? 'text-arcane-gold'
                    : 'text-slate-300 hover:text-magic-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isActive && 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    )}
                  />
                  <span className={cn('hidden md:inline font-display text-sm')}>
                    {label}
                  </span>
                  {isActive && (
                    <span
                      className={cn(
                        'absolute bottom-0 left-1/2 -translate-x-1/2',
                        'w-3/4 h-0.5 rounded-full',
                        'bg-arcane-gold',
                        'shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                      )}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className={cn('flex items-center gap-3 md:gap-4')}>
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'bg-arcane-gold/10 border border-arcane-gold/30'
            )}
            title="金币"
          >
            <Coins className="w-4 h-4 text-arcane-gold" />
            <span
              className={cn(
                'font-display text-sm text-arcane-gold tabular-nums',
                'hidden sm:inline'
              )}
            >
              {gold.toLocaleString()}
            </span>
          </div>

          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'bg-magic-500/10 border border-magic-500/30'
            )}
            title="魔力值"
          >
            <Sparkles className="w-4 h-4 text-magic-300" />
            <span
              className={cn(
                'font-display text-sm text-magic-300 tabular-nums',
                'hidden sm:inline'
              )}
            >
              {mana.toLocaleString()}
            </span>
          </div>

          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'bg-gradient-to-r from-magic-500/10 to-arcane-gold/10',
              'border border-magic-500/30'
            )}
            title="等级"
          >
            <Star className="w-4 h-4 text-arcane-gold fill-arcane-gold" />
            <span
              className={cn(
                'font-display text-sm text-arcane-gold tabular-nums'
              )}
            >
              Lv.{level}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
