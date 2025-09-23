import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Zap, RotateCcw } from 'lucide-react';
import { GameStats } from '@/data/gameData';
import { showSuccess } from '@/utils/toast';

export default function Statistics() {
  const [playerStats, setPlayerStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestWinStreak: 0
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('rps-player-stats');
    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
  }, []);

  const winRate = playerStats.totalGames > 0 ? Math.round((playerStats.wins / playerStats.totalGames) * 100) : 0;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Statistics
          </h1>
          <p className="text-lg text-gray-600">
            Track your Rock Paper Scissors performance
          </p>
        </div>

        {/* Simple Stats Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800">{playerStats.totalGames}</div>
            <div className="text-sm text-gray-600">Total Games</div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-800">{winRate}%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-gray-800">{playerStats.winStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-gray-800">{playerStats.bestWinStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </Card>
        </div>

        {/* Simple Breakdown */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800 text-center">Game Results</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-700">Wins</span>
                <span className="font-bold text-green-600">{playerStats.wins}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="font-medium text-gray-700">Losses</span>
                <span className="font-bold text-red-600">{playerStats.losses}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-700">Draws</span>
                <span className="font-bold text-yellow-600">{playerStats.draws}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-2xl mx-auto flex justify-center space-x-4">
          <Button
            onClick={handleResetStats}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Stats
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Play Game
          </Button>
        </div>
      </div>
    </div>
  );
}