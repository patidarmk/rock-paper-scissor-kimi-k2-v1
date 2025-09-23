export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  stats: GameStats;
}

export interface GameTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  icon: string;
}

export const choices = ['rock', 'paper', 'scissors'] as const;
export type Choice = typeof choices[number];

export const gameRules: Record<Choice, Choice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

export const aiOpponents: Player[] = [
  {
    id: 'ai-1',
    name: 'Beginner Bot',
    avatar: '🤖',
    difficulty: 'easy',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-2',
    name: 'Smart Bot',
    avatar: '🧠',
    difficulty: 'medium',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-3',
    name: 'Master Bot',
    avatar: '👑',
    difficulty: 'hard',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-4',
    name: 'Legend Bot',
    avatar: '⚡',
    difficulty: 'expert',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  }
];

export const themes: GameTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: 'from-blue-500 to-purple-600',
    secondaryColor: 'from-gray-100 to-gray-200',
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
    icon: '🎮'
  },
  {
    id: 'neon',
    name: 'Neon',
    primaryColor: 'from-pink-500 to-cyan-500',
    secondaryColor: 'from-gray-900 to-black',
    backgroundColor: 'bg-gradient-to-br from-gray-900 to-black',
    icon: '⚡'
  },
  {
    id: 'nature',
    name: 'Nature',
    primaryColor: 'from-green-500 to-emerald-600',
    secondaryColor: 'from-green-100 to<applaa-write path="src/data/gameData.ts" description="Complete game data with themes and tournament data">
export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestWinStreak: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  stats: GameStats;
}

export interface GameTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  icon: string;
}

export interface TournamentMatch {
  id: string;
  player1: Player;
  player2: Player;
  winner?: Player;
  round: number;
}

export const choices = ['rock', 'paper', 'scissors'] as const;
export type Choice = typeof choices[number];

export const gameRules: Record<Choice, Choice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

export const choiceEmojis: Record<Choice, string> = {
  rock: '🗿',
  paper: '📄',
  scissors: '✂️'
};

export const aiOpponents: Player[] = [
  {
    id: 'ai-1',
    name: 'Beginner Bot',
    avatar: '🤖',
    difficulty: 'easy',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-2',
    name: 'Smart Bot',
    avatar: '🧠',
    difficulty: 'medium',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-3',
    name: 'Master Bot',
    avatar: '👑',
    difficulty: 'hard',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  },
  {
    id: 'ai-4',
    name: 'Legend Bot',
    avatar: '⚡',
    difficulty: 'expert',
    stats: { totalGames: 0, wins: 0, losses: 0, draws: 0, winStreak: 0, bestWinStreak: 0 }
  }
];

export const themes: GameTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: 'from-blue-500 to-purple-600',
    secondaryColor: 'from-gray-100 to-gray-200',
    backgroundColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
    icon: '🎮'
  },
  {
    id: 'neon',
    name: 'Neon',
    primaryColor: 'from-pink-500 to-cyan-500',
    secondaryColor: 'from-gray-900 to-black',
    backgroundColor: 'bg-gradient-to-br from-gray-900 to-black',
    icon: '⚡'
  },
  {
    id: 'nature',
    name: 'Nature',
    primaryColor: 'from-green-500 to-emerald-600',
    secondaryColor: 'from-green-100 to-emerald-100',
    backgroundColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
    icon: '🌿'
  },
  {
    id: 'fire',
    name: 'Fire',
    primaryColor: 'from-red-500 to-orange-600',
    secondaryColor: 'from-red-100 to-orange-100',
    backgroundColor: 'bg-gradient-to-br from-red-50 to-orange-50',
    icon: '🔥'
  }
];

export const defaultStats: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  winStreak: 0,
  bestWinStreak: 0
};