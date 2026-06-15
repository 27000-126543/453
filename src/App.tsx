import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ParticleBackground from '@/components/layout/ParticleBackground';
import LabOverview from '@/pages/LabOverview';
import GeneBank from '@/pages/GeneBank';
import Incubator from '@/pages/Incubator';
import Collection from '@/pages/Collection';
import { useGameStore } from '@/store/useGameStore';
import { cn } from '@/lib/utils';

export default function App() {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const interval = setInterval(() => {
      tick(1);
    }, 1000);

    return () => clearInterval(interval);
  }, [tick]);

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
        </Routes>
      </div>
    </>
  );
}
