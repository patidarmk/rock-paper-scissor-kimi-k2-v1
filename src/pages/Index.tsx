import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GameArena from '@/components/GameArena';
import { MadeWithApplaa } from '@/components/made-with-applaa';
import { 
  GameTheme, 
  themes, 
  defaultStats, 
  aiOpponents, 
  Player,
  GameStats 
} from '@/data/gameData';
import { GameRound } from '@/lib/gameLogic';
import { showSuccess, showError } from '@/utils/toast';

export default function Index() {
  const [currentTheme, setCurrentTheme] = useState<GameTheme>(themes[0]);
  const [selectedOpponent, setSelectedOpponent] = useState<Player>(aiOpponents[0]);
  const [playerStats, setPlayerStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
    // Load saved data from localStorage
    const savedStats = localStorage.getItem('rps-player-stats');
    const savedTheme = localStorage.getItem('rps-theme');
    const savedOpponent = localStorage.getItem('rps-opponent');

    if (savedStats) {
      setPlayerStats(JSON.parse(savedStats));
    }
    if (savedTheme) {
      setCurrentTheme(JSON.parse(savedTheme));
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

  const handleThemeChange = (theme: GameTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('rps-theme', JSON.stringify(theme));
    showSuccess(`Theme changed to ${theme.name}!`);
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Rock Paper Scissors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Challenge AI opponents and become the ultimate champion!
          </p>
        </div>

        {/* Game Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Opponent Selection */}
          <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">🎯</span>
              Choose Opponent
            </h3>
            <div className="space-y-3">
              {aiOpponents.map((opponent) => (
                <button
                  key={opponent.id}
                  onClick={() => handleOpponentChange(opponent)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    selectedOpponent.id === opponent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{opponent.avatar}</span>
                      <div className="text-left">
                        <div className="font-semibold">{opponent.name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {opponent.difficulty} difficulty
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Wins: {opponent.stats.wins}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">✨</span>
              Choose Theme
            </h3>
            <div className="space-y-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{theme.icon}</span>
                      <div className="font-semibold">{theme.name}</div>
                    </div>
                    {currentTheme.id === theme.id && (
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Arena */}
        <GameArena
          theme={currentTheme}
          opponent={selectedOpponent}
          onGameEnd={handleGameEnd}
        />
      </main>

      <MadeWithApplaa />
    </div>
  );
}