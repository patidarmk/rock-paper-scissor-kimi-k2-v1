import { Card } from './ui/card';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';
import { GameStats } from '@/data/gameData';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  stats: GameStats;
  className?: string;
}

export default function StatsPanel({ stats, className }: StatsPanelProps) {
  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  const statItems = [
    {
      icon: Trophy,
      label: 'Total Games',
      value: stats.totalGames,
      color: 'text-blue-600'
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${winRate}%`,
      color: 'text-green-600'
    },
    {
      icon: Zap,
      label: 'Win Streak',
      value: stats.winStreak,
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Best Streak',
      value: stats.bestWinStreak,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className={cn('p-6 bg-white/90 backdrop-blur-sm', className)}>
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
        Your Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
              <Icon className={cn('w-8 h-8 mx-auto mb-2', item.color)} />
              <div className="text-2xl font-bold text-gray-800">{item.value}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Wins</span>
          <span>{stats.wins}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Losses</span>
          <span>{stats.losses}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Draws</span>
          <span>{stats.draws}</span>
        </div>
      </div>
    </Card>
  );
}