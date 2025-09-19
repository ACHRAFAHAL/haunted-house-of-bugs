import { useState } from 'react';
import { Puzzle, validateMCQ } from '@/lib/puzzleEngine';
import Hints from './Hints';

interface MCQPuzzleProps {
  puzzle: Puzzle;
  onCorrect: (score: number) => void;
  onHintUsed: () => void;
}

export default function MCQPuzzle({ puzzle, onCorrect, onHintUsed }: MCQPuzzleProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<string>('');
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const validation = validateMCQ(puzzle, selectedOption);
    setResult(validation.message);
    setSubmitted(true);

    if (validation.correct) {
      setTimeout(() => {
        onCorrect(puzzle.points);
      }, 2000);
    }
  };

  const handleHintToggle = () => {
    if (!showHint) {
      onHintUsed();
    }
    setShowHint(!showHint);
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="bg-shadow-black rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          {puzzle.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {puzzle.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => !submitted && setSelectedOption(index)}
            disabled={submitted}
            className={`p-4 rounded-lg text-left transition-all ${
              selectedOption === index
                ? 'bg-spooky-purple text-white border-2 border-spooky-purple'
                : 'bg-shadow-black text-gray-300 border-2 border-gray-600 hover:border-spooky-purple/50'
            } ${
              submitted
                ? index === puzzle.correctIndex
                  ? 'bg-green-600 border-green-600'
                  : selectedOption === index
                  ? 'bg-red-600 border-red-600'
                  : ''
                : ''
            } disabled:cursor-not-allowed`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === index ? 'border-white' : 'border-gray-400'
              }`}>
                {selectedOption === index && (
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                )}
              </div>
              <span className="text-lg">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg text-center font-semibold ${
          result.includes('Correct') 
            ? 'bg-green-600/20 text-green-400 border border-green-600/50' 
            : 'bg-red-600/20 text-red-400 border border-red-600/50'
        }`}>
          {result}
          {result.includes('Correct') && (
            <div className="mt-2 text-sm">
              🚪 The door creaks open... You may proceed to the next room!
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center">
        <Hints 
          hint={puzzle.hint || ''}
          showHint={showHint}
          onToggle={handleHintToggle}
        />
        
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || submitted}
          className="bg-spooky-green hover:bg-spooky-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {submitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>
    </div>
  );
}