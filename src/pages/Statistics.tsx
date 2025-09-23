import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  PieChart, 
  Clock,
  Award,
  RotateCcw
} from 'lucide-react';
import { GameStats, Player, aiOpponents } from '@/data/gameData';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

export default function Statistics() {
  const [playerStats, setPlayerStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestWinStreak: 0
  });
  const [opponentStats, setOpponentStats] = useState<Player[]>(aiOpponents);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    // Load saved data from localStorage
    const savedStats = localStorage.getItem('rps-player-stats');
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
  }, []);

  const winRate = playerStats.totalGames > 0 ? Math.round((playerStats.wins / playerStats.totalGames) * 100) : 0;
  const lossRate = playerStats.totalGames > 0 ? Math.round((playerStats.losses / playerStats.totalGames) * 100) : 0;
  const drawRate = playerStats.totalGames > 0 ? Math.round((playerStats.draws / playerStats.totalGames) * 100) : 0;

  const handleResetStats = () => {
    const resetStats: GameStats = {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      bestWinStreak: 0
    };
    setPlayerStats(resetStats);
    localStorage.setItem('rps-player-stats', JSON.stringify(resetStats));
    showSuccess('Statistics have been reset!');
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <Card className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </Card>
  );

  const statCards = [
    {
      icon: Trophy,
      label: 'Total Games',
      value: playerStats.totalGames,
      color: 'text-blue-600'
    },
    {
      icon: Target,
      label: 'Win Rate',
      value: `${winRate}%`,
      color: 'text-green-600',
      trend: 5
    },
    {
      icon: Zap,
      label: 'Current Streak',
      value: playerStats.winStreak,
      color: 'text-yellow-600'
    },
    {
      icon: TrendingUp,
      label: 'Best Streak',
      value: playerStats.bestWinStreak,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Game Statistics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your performance and become a Rock Paper Scissors champion!
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            {['all', 'week', 'month'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Time
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Win/Loss/Draw Chart */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-500" />
              Game Results Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Wins</span>
                  <span>{playerStats.wins} ({winRate}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${winRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Losses</span>
                  <span>{playerStats.losses} ({lossRate}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${lossRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Draws</span>
                  <span>{playerStats.draws} ({drawRate}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${drawRate}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">Average Win Rate</span>
                <span className="font-bold text-blue-600">{winRate}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Best Win Streak</span>
                <span className="font-bold text-green-600">{playerStats.bestWinStreak}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Play Time</span>
                <span className="font-bold text-purple-600">
                  {Math.round(playerStats.totalGames * 2.5)} min
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-gray-700">Win Streak Bonus</span>
                <span className="font-bold text-orange-600">
                  {playerStats.winStreak > 5 ? '🔥 On Fire!' : playerStats.winStreak > 0 ? '🎯 Hot!' : '❄️ Cold'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Opponent Performance */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm mb-8">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            AI Opponent Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiOpponents.map((opponent) => (
              <div key={opponent.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{opponent.avatar}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{opponent.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{opponent.difficulty}</div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wins:</span>
                    <span className="font-medium text-green-600">{opponent.stats.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium">
                      {opponent.stats.totalGames > 0 
                        ? Math.round((opponent.stats.wins / opponent.stats.totalGames) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleResetStats}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Statistics
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}