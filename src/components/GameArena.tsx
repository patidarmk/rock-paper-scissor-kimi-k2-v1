import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Choice, Player, GameTheme } from '@/data/gameData';
import { GameRound, determineWinner, getAIChoice, updatePlayerStats } from '@/lib/gameLogic';
import GameChoice from './GameChoice';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Trophy, RotateCcw, Zap } from 'lucide-react';

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
          <p className="text-gray-600">Choose your weapon wisely!</p>
        </div>

        {/* Game Area */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Player Side */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">You</h3>
              <AnimatePresence mode="wait">
                {playerChoice ? (
                  <motion.div
                    key="player-choice"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    <GameChoice
                      choice={playerChoice}
                      onClick={() => {}}
                      isSelected={result === 'win'}
                      size="lg"
                      isDisabled
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="player-waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300"
                  >
                    <span className="text-gray-400 text-6xl">❓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* VS Indicator */}
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: gameState === 'finished' ? [1, 1.2, 1] : 1,
                  rotate: gameState === 'playing' ? [0, 360] : 0
                }}
                transition={{ duration: 0.5 }}
                className="text-6xl font-bold text-gray-400"
              >
                {gameState === 'finished' && result === 'win' && '🏆'}
                {gameState === 'finished' && result === 'loss' && '💔'}
                {gameState === 'finished' && result === 'draw' && '⚖️'}
                {gameState !== 'finished' && 'VS'}
              </motion.div>
              {showResult && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('text-2xl font-bold mt-4', getResultColor())}
                >
                  {getResultText()}
                </motion.p>
              )}
            </div>

            {/* AI Side */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">{opponent.name}</h3>
              <AnimatePresence mode="wait">
                {aiChoice ? (
                  <motion.div
                    key="ai-choice"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.5, type: "spring", delay: 0.3 }}
                  >
                    <GameChoice
                      choice={aiChoice}
                      onClick={() => {}}
                      isSelected={result === 'loss'}
                      size="lg"
                      isDisabled
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-32 h-32 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300"
                  >
                    <span className="text-gray-400 text-6xl">❓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>

        {/* Choice Buttons */}
        {gameState === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-4 mb-8"
          >
            {(['rock', 'paper', 'scissors'] as Choice[]).map((choice) => (
              <GameChoice
                key={choice}
                choice={choice}
                onClick={() => handleChoice(choice)}
                size="lg"
                showPulse={gameState === 'waiting'}
              />
            ))}
          </motion.div>
        )}

        {/* Play Again Button */}
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={resetGame}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </motion.div>
        )}

        {/* Game State Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className={cn(
              'w-3 h-3 rounded-full',
              gameState === 'waiting' && 'bg-green-500 animate-pulse',
              gameState === 'playing' && 'bg-yellow-500 animate-bounce',
              gameState === 'revealing' && 'bg-blue-500 animate-pulse',
              gameState === 'finished' && 'bg-purple-500'
            )} />
            <span className="text-sm font-medium text-gray-600">
              {gameState === 'waiting' && 'Choose your move'}
              {gameState === 'playing' && 'Opponent is thinking...'}
              {gameState === 'revealing' && 'Revealing choices...'}
              {gameState === 'finished' && 'Round complete'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}