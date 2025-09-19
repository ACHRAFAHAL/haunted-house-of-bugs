import { Puzzle } from '@/lib/puzzleEngine';
import MCQPuzzle from './MCQPuzzle';
import EditorPuzzle from './EditorPuzzle';

interface PuzzleRendererProps {
  puzzle: Puzzle;
  onCorrect: (score: number) => void;
  onHintUsed: () => void;
}

export default function PuzzleRenderer({ puzzle, onCorrect, onHintUsed }: PuzzleRendererProps) {
  const handleSuccess = (score: number) => {
    onCorrect(score);
  };

  return (
    <div className="bg-eerie-gray rounded-lg p-6 max-w-4xl mx-auto">
      {/* Puzzle Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-spooky-purple">
            Room {puzzle.room}: {puzzle.title}
          </h1>
          <div className="text-spooky-green font-semibold">
            {puzzle.points} points
          </div>
        </div>
        
        {/* Story Section */}
        {puzzle.story && (
          <div className="mb-4 p-4 bg-black bg-opacity-30 rounded-lg border border-spooky-purple border-opacity-30">
            <p className="text-spooky-purple italic text-lg leading-relaxed">
              {puzzle.story}
            </p>
          </div>
        )}
        
        <p className="text-gray-300 text-lg">
          {puzzle.description}
        </p>
      </div>

      {/* Puzzle Content */}
      <div className="min-h-[400px]">
        {puzzle.type === 'mcq' ? (
          <MCQPuzzle 
            puzzle={puzzle} 
            onCorrect={handleSuccess}
            onHintUsed={onHintUsed}
          />
        ) : (
          <EditorPuzzle 
            puzzle={puzzle} 
            onCorrect={handleSuccess}
            onHintUsed={onHintUsed}
          />
        )}
      </div>

      {/* Room Atmosphere */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <div className="flex items-center justify-center space-x-4 text-gray-400 text-sm">
          <span>🕯️ The candles flicker...</span>
          <span>👻 Something watches from the shadows...</span>
          <span>🔑 Find the key to escape!</span>
        </div>
      </div>
    </div>
  );
}