import { Choice, gameRules, choices, Player } from '@/data/gameData';

export type GameResult = 'win' | 'loss' | 'draw';

export interface GameRound {
  playerChoice: Choice;
  aiChoice: Choice;
  result: GameResult;
}

export function determineWinner(playerChoice: Choice, aiChoice: Choice): GameResult {
  if (playerChoice === aiChoice) return 'draw';
  return gameRules[playerChoice] === aiChoice ? 'win' : 'loss';
}

export function getRandomChoice(): Choice {
  return choices[Math.floor(Math.random() * choices.length)];
}

export function getAIChoice(difficulty: string, playerHistory: Choice[] = []): Choice {
  switch (difficulty) {
    case 'easy':
      // Simple random with slight bias towards rock
      return Math.random() < 0.4 ? 'rock' : getRandomChoice();
    
    case 'medium':
      // Analyze player patterns
      if (playerHistory.length >= 3) {
        const lastChoices = playerHistory.slice(-3);
        const mostFrequent = getMostFrequentChoice(lastChoices);
        // Counter the player's most frequent choice
        return gameRules[mostFrequent];
      }
      return getRandomChoice();
    
    case 'hard':
      // More sophisticated pattern recognition
      if (playerHistory.length >= 5) {
        const patterns = findPatterns(playerHistory);
        if (patterns.length > 0) {
          const predictedChoice = predictNextChoice(patterns, playerHistory);
          return gameRules[predictedChoice];
        }
      }
      // Fallback with some randomness
      return Math.random() < 0.7 ? getRandomChoice() : getRandomChoice();
    
    case 'expert':
      // Advanced AI with learning and adaptation
      if (playerHistory.length >= 7) {
        const patterns = findAdvancedPatterns(playerHistory);
        const predictedChoice = predictAdvancedChoice(patterns, playerHistory);
        return gameRules[predictedChoice];
      }
      // Use psychological patterns
      return getPsychologicalChoice(playerHistory);
    
    default:
      return getRandomChoice();
  }
}

function getMostFrequentChoice(history: Choice[]): Choice {
  const counts = history.reduce((acc, choice) => {
    acc[choice] = (acc[choice] || 0) + 1;
    return acc;
  }, {} as Record<Choice, number>);
  
  return Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0] as Choice;
}

function findPatterns(history: Choice[]): string[] {
  const patterns: string[] = [];
  for (let i = 2; i < history.length; i++) {
    const pattern = history.slice(i - 2, i + 1).join('-');
    patterns.push(pattern);
  }
  return patterns;
}

function findAdvancedPatterns(history: Choice[]): string[] {
  const patterns: string[] = [];
  for (let i = 3; i < history.length; i++) {
    const pattern = history.slice(i - 3, i + 1).join('-');
    patterns.push(pattern);
  }
  return patterns;
}

function predictNextChoice(patterns: string[], history: Choice[]): Choice {
  const patternCounts: Record<string, number> = {};
  patterns.forEach(pattern => {
    patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
  });
  
  const mostCommonPattern = Object.entries(patternCounts)
    .sort(([,a], [,b]) => b - a)[0][0];
  
  const parts = mostCommonPattern.split('-');
  return parts[parts.length - 1] as Choice;
}

function predictAdvancedChoice(patterns: string[], history: Choice[]): Choice {
  // More sophisticated prediction logic
  const recentPattern = history.slice(-4).join('-');
  const similarPatterns = patterns.filter(p => p.includes(recentPattern.slice(-2)));
  
  if (similarPatterns.length > 0) {
    return predictNextChoice(similarPatterns, history);
  }
  
  return getRandomChoice();
}

function getPsychologicalChoice(history: Choice[]): Choice {
  // Psychological patterns: people tend to avoid repeating the same choice 3 times
  if (history.length >= 2) {
    const lastTwo = history.slice(-2);
    if (lastTwo[0] === lastTwo[1]) {
      // Player likely won't choose the same thing again
      const remainingChoices = choices.filter(c => c !== lastTwo[0]);
      return remainingChoices[Math.floor(Math.random() * remainingChoices.length)];
    }
  }
  
  // Default to countering rock (most common first choice)
  return 'paper';
}

export function updatePlayerStats(player: Player, result: GameResult): Player {
  const newStats = { ...player.stats };
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
  
  return {
    ...player,
    stats: newStats
  };
}