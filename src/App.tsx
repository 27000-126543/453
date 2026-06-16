import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ParticleBackground from '@/components/layout/ParticleBackground';
import LabOverview from '@/pages/LabOverview';
import GeneBank from '@/pages/GeneBank';
import Incubator from '@/pages/Incubator';
import Collection from '@/pages/Collection';
import Arena from '@/pages/Arena';
import Market from '@/pages/Market';
import Guild from '@/pages/Guild';
import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/utils';

export default function App() {
  const tick = useGameStore((state) => state.tick);
  const battleTick = useGameStore((state) => state.battleTick);
  const arenaStatus = useGameStore((state) => state.arena.status);

  useEffect(() => {
    const interval = setInterval(() => {
      tick(1);
      if (arenaStatus === 'battle') {
        battleTick(0.5);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tick, battleTick, arenaStatus]);

  return (
    <>
      <ParticleBackground />
      <div className={cn('min-h-screen relative z-10')}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LabOverview />} />
          <Route path="/gene-bank" element={<GeneBank />} />
          <Route path="/incubator" element={<Incubator />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/market" element={<Market />} />
          <Route path="/guild" element={<Guild />} />
        </Routes>
      </div>
    </>
  );
}
