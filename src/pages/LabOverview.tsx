import PlayerCard from '@/components/lab/PlayerCard';
import IncubatorStatus from '@/components/lab/IncubatorStatus';
import ResourcePanel from '@/components/lab/ResourcePanel';
import { cn } from '@/lib/utils';

export default function LabOverview() {
  return (
    <div className={cn('pt-20 px-6 pb-6 animate-fade-in')}>
      <div className={cn('grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6')}>
        <div>
          <PlayerCard />
        </div>

        <div className={cn('flex flex-col gap-6')}>
          <IncubatorStatus />
          <div className={cn('glass-card p-4 text-center')}>
            <p className={cn('text-sm text-slate-400')}>
              💡 提示：在培养舱中搭配不同种族的基因样本，可以获得更强大的克隆体！
            </p>
          </div>
        </div>

        <div>
          <ResourcePanel />
        </div>
      </div>
    </div>
  );
}
