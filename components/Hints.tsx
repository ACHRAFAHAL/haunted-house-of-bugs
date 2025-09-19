import { useState } from 'react';

interface HintsProps {
  hint: string;
  showHint: boolean;
  onToggle: () => void;
}

export default function Hints({ hint, showHint, onToggle }: HintsProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 text-spooky-purple hover:text-spooky-green transition-colors"
      >
        <span className="font-semibold">
          {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </span>
      </button>
      
      {showHint && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-spooky-purple/90 backdrop-blur border border-spooky-purple rounded-lg p-4 z-10 animate-fade-in">
          <div className="flex items-start space-x-2">
            <span className="text-xl flex-shrink-0">🔮</span>
            <div>
              <div className="text-white font-semibold text-sm mb-1">
                Mystical Hint:
              </div>
              <div className="text-gray-200 text-sm">
                {hint}
              </div>
            </div>
          </div>
          
          {/* Arrow pointing down */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-spooky-purple/90"></div>
        </div>
      )}
    </div>
  );
}