import { useState, useEffect } from 'react';
import { Choice, Player, GameTheme } from '@/data/gameData';
import { GameRound, determineWinner, getAIChoice } from '@/lib/gameLogic';
import GameChoice from './GameChoice';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameArenaProps {
  theme: GameTheme;
  opponent: Player;
  onGameEnd: (result: GameRound) => void;
}

export default function GameArena({ theme, opponent, onGameEnd }: GameArenaProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'revealing' | 'finished'>('waiting');
  const [result, setResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = async (choice: Choice) => {
    if (gameState !== 'waiting') return;
    
    setPlayerChoice(choice);
    setGameState('playing');
    
    // Add to history
    setPlayerHistory(prev => [...prev, choice]);
    
    // AI makes choice after delay
    setTimeout(() => {
      const aiMove = getAIChoice(opponent.difficulty || 'medium', playerHistory);
      setAiChoice(aiMove);
      setGameState('revealing');
      
      // Determine winner after reveal animation
      setTimeout(() => {
        const gameResult = determineWinner(choice, aiMove);
        setResult(gameResult);
        setGameState('finished');
        setShowResult(true);
        
        // Notify parent
        onGameEnd({
          playerChoice: choice,
          aiChoice: aiMove,
          result: gameResult
        });
      }, 1500);
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setAiChoice(null);
    setGameState('waiting');
    setResult(null);
    setShowResult(false);
  };

  const getResultText = () => {
    switch (result) {
      case 'win': return 'You Win!';
      case 'loss': return 'You Lose!';
      case 'draw': return "It's a Draw!";
      default: return '';
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'win': return 'text-green-500';
      case 'loss': return 'text-red-500';
      case 'draw': return 'text-yellow-500';
      default: return '';
    }
  };

  return (
    <div className={cn('min-h-screen p-8', theme.backgroundColor)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Battle Arena
          </h1>
          <p className="text-gray-600">Choose your weapon to battle {opponent.name}</p>
        </div>

        {/* Game Area */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Player Side */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">You</h3>
              {playerChoice ? (
                <div className="transform transition-all duration-500 scale-100 rotate-0">
                  <GameChoice
                    choice={playerChoice}
                    onClick={() => {}}
                    isSelected={result === 'win'}
                    size="lg"
                    isDisabled
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                  <span className="text-gray-400 text-6xl">❓</span>
                </div>
              )}
            </div>

            {/* VS Indicator */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-400 transform transition-all duration-500">
                {gameState === 'finished' && result === 'win' && '🏆'}
                {gameState === 'finished' && result === 'loss' && '💔'}
                {gameState === 'finished' && result === 'draw' && '⚖️'}
                {gameState !== 'finished' && 'VS'}
              </div>
              {showResult && (
                <p className={cn('text-2xl font-bold mt-4 transition-all duration-300', getResultColor())}>
                  {getResultText()}
                </p>
              )}
            </div>

            {/* AI Side */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">{opponent.name}</h3>
              {aiChoice ? (
                <div className="transform transition-all duration-500 scale-100 rotate-0">
                  <GameChoice
                    choice={aiChoice}
                    onClick={() => {}}
                    isSelected={result === 'loss'}
                    size="lg"
                    isDisabled
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                  <span className="text-gray-400 text-6xl">❓</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Choice Buttons */}
        {gameState === 'waiting' && (
          <div className="flex justify-center space-x-4 mb-8">
            {(['rock', 'paper', 'scissors'] as Choice[]).map((choice) => (
              <GameChoice
                key={choice}
                choice={choice}
                onClick={() => handleChoice(choice)}
                size="lg"
                showPulse={gameState === 'waiting'}
              />
            ))}
          </div>
        )}

        {/* Play Again Button */}
        {gameState === 'finished' && (
          <div className="text-center">
            <Button
              onClick={resetGame}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}