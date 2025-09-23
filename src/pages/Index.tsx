import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GameArena from '@/components/GameArena';
import { MadeWithApplaa } from '@/components/made-with-applaa';
import { 
  defaultStats, 
  aiOpponents, 
  Player,
  GameStats,
  GameTheme,
  themes
} from '@/data/gameData';
import { GameRound } from '@/lib/gameLogic';
import { showSuccess, showError } from '@/utils/toast';

export default function Index() {
  const [selectedOpponent, setSelectedOpponent] = useState<Player>(aiOpponents[0]);
  const [playerStats, setPlayerStats] = useState<GameStats>(defaultStats);
  const [currentTheme] = useState<GameTheme>(themes[0]); // Fixed classic theme

  useEffect(() => {
    // Load saved data from localStorage
    const savedStats = localStorage.getItem('rps-player-stats');
    const savedOpponent = localStorage.getItem('rps-opponent');

    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
    if (savedOpponent) {
      const opponent = aiOpponents.find(o => o.id === savedOpponent);
      if (opponent) setSelectedOpponent(opponent);
    }
  }, []);

  const handleGameEnd = (result: GameRound) => {
    const updatedStats = updatePlayerStatsHelper(playerStats, result.result);
    setPlayerStats(updatedStats);
    localStorage.setItem('rps-player-stats', JSON.stringify(updatedStats));
    
    switch (result.result) {
      case 'win':
        showSuccess('Victory! You won this round!');
        break;
      case 'loss':
        showError('Defeat! Better luck next time!');
        break;
      case 'draw':
        showSuccess("It's a draw! Well played!");
        break;
    }
  };

  const updatePlayerStatsHelper = (stats: GameStats, result: 'win' | 'loss' | 'draw'): GameStats => {
    const newStats = { ...stats };
    newStats.totalGames++;
    
    switch (result) {
      case 'win':
        newStats.wins++;
        newStats.winStreak++;
        newStats.bestWinStreak = Math.max(newStats.bestWinStreak, newStats.winStreak);
        break;
      case 'loss':
        newStats.losses++;
        newStats.winStreak = 0;
        break;
      case 'draw':
        newStats.draws++;
        break;
    }
    
    return newStats;
  };

  const handleOpponentChange = (opponent: Player) => {
    setSelectedOpponent(opponent);
    localStorage.setItem('rps-opponent', opponent.id);
    showSuccess(`Opponent changed to ${opponent.name}!`);
  };

  return (
    <div className={currentTheme.backgroundColor}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Game Arena - Always at top */}
        <div className="mb-8">
          <GameArena
            theme={currentTheme}
            opponent={selectedOpponent}
            onGameEnd={handleGameEnd}
          />
        </div>

        {/* Simple Opponent Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Choose Your Opponent
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {aiOpponents.map((opponent) => (
                <button
                  key={opponent.id}
                  onClick={() => handleOpponentChange(opponent)}
                  className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selectedOpponent.id === opponent.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{opponent.avatar}</div>
                    <div className="font-semibold text-gray-800">{opponent.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{opponent.difficulty}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Wins: {opponent.stats.wins}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MadeWithApplaa />
    </div>
  );
}