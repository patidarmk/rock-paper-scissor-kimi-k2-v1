import { Choice, choiceEmojis } from '@/data/gameData';
import { cn } from '@/lib/utils';

interface GameChoiceProps {
  choice: Choice;
  onClick: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export default function GameChoice({ 
  choice, 
  onClick, 
  isSelected, 
  isDisabled,
  size = 'md',
  showPulse 
}: GameChoiceProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-6xl'
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'relative rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95',
        'border-4 border-transparent hover:border-blue-400',
        'bg-gradient-to-br from-white to-gray-50',
        'shadow-lg hover:shadow-xl',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        isSelected && 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
        showPulse && 'animate-pulse'
      )}
    >
      <span className="block">{choiceEmojis[choice]}</span>
      <span className="block text-xs font-semibold text-gray-600 mt-1 capitalize">
        {choice}
      </span>
      
      {showPulse && (
        <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-20 animate-ping" />
      )}
    </button>
  );
}