import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  registerables,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { Stats } from '@/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ...registerables
);

interface StatRadarProps {
  stats: Stats;
}

const statLabels = ['力量', '敏捷', '魔力', '体质', '感知', '意志'];

const statKeys: (keyof Stats)[] = [
  'strength',
  'agility',
  'magic',
  'constitution',
  'perception',
  'willpower',
];

export default function StatRadar({ stats }: StatRadarProps) {
  const chartRef = useRef<ChartJS<'radar'>>(null);

  const data = {
    labels: statLabels,
    datasets: [
      {
        label: '属性值',
        data: statKeys.map((key) => stats[key]),
        backgroundColor: 'rgba(139, 92, 246, 0.35)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(251, 191, 36, 1)',
        pointBorderColor: 'rgba(251, 191, 36, 1)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(251, 191, 36, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(26, 10, 46, 0.9)',
        titleColor: '#fbbf24',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        angleLines: {
          color: 'rgba(156, 163, 175, 0.3)',
          lineWidth: 1,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
          borderDash: [4, 4],
          circular: true,
        },
        pointLabels: {
          color: '#e2e8f0',
          font: {
            family: "'Cinzel', serif",
            size: 13,
            weight: 600 as const,
          },
          padding: 12,
        },
        ticks: {
          display: false,
          stepSize: 20,
        },
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      chart.update();
    }
  }, [stats]);

  return (
    <div
      className="relative"
      style={{ width: '280px', height: '280px', maxWidth: '100%' }}
    >
      <Radar ref={chartRef} data={data} options={options} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
