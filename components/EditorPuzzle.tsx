import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Puzzle, validateCodeFill, validateCodeFix, TestResult } from '@/lib/puzzleEngine';
import Hints from './Hints';

interface EditorPuzzleProps {
  puzzle: Puzzle;
  onCorrect: (score: number) => void;
  onHintUsed: () => void;
}

export default function EditorPuzzle({ puzzle, onCorrect, onHintUsed }: EditorPuzzleProps) {
  // Use buggyCode for fix_code puzzles, starterCode for fill_code puzzles
  const initialCode = puzzle.type === 'fix_code' ? (puzzle.buggyCode || puzzle.starterCode || '') : (puzzle.starterCode || '');
  
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleRun = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setResult('');
    setTestResults([]);

    try {
      let validation;
      
      if (puzzle.type === 'fix_code') {
        validation = validateCodeFix(puzzle, code);
      } else {
        validation = validateCodeFill(puzzle, code);
      }

      setResult(validation.message);
      if (validation.testResults) {
        setTestResults(validation.testResults);
      }

      if (validation.correct) {
        setSubmitted(true);
        setTimeout(() => {
          onCorrect(puzzle.points);
        }, 2000);
      }
    } catch (error) {
      setResult(`⚠️ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
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
      {/* Bug Hint for fix_code puzzles */}
      {puzzle.type === 'fix_code' && puzzle.bugHint && (
        <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-400">
            <span>🐛</span>
            <span className="font-semibold">Bug Report:</span>
          </div>
          <p className="text-yellow-300 mt-2">{puzzle.bugHint}</p>
        </div>
      )}

      {/* Code Editor */}
      <div className="bg-shadow-black rounded-lg overflow-hidden border border-gray-600">
        <div className="bg-eerie-gray px-4 py-2 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm font-mono">
              {puzzle.type === 'fix_code' ? 'Fix the bug:' : 'Complete the code:'}
            </span>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>⚠️ Sandbox mode</span>
            </div>
          </div>
        </div>
        
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value: string | undefined) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-shadow-black rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Test Results:</h4>
          <div className="space-y-2">
            {testResults.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  test.passed
                    ? 'bg-green-600/20 border-green-600/50 text-green-400'
                    : 'bg-red-600/20 border-red-600/50 text-red-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">
                    Input: {test.input}
                  </span>
                  <span className="text-lg">
                    {test.passed ? '✅' : '❌'}
                  </span>
                </div>
                <div className="text-sm mt-1">
                  Expected: <span className="font-mono">{String(test.expected)}</span>
                  {!test.passed && (
                    <>
                      <br />
                      Got: <span className="font-mono">{String(test.actual)}</span>
                      {test.error && (
                        <>
                          <br />
                          Error: <span className="font-mono">{test.error}</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg text-center font-semibold ${
          result.includes('✅') || result.includes('All tests passed')
            ? 'bg-green-600/20 text-green-400 border border-green-600/50'
            : 'bg-red-600/20 text-red-400 border border-red-600/50'
        }`}>
          {result}
          {(result.includes('✅') || result.includes('All tests passed')) && (
            <div className="mt-2 text-sm">
              🚪 The mystical barrier dissolves... You may proceed to the next room!
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
          onClick={handleRun}
          disabled={isRunning || submitted}
          className="bg-spooky-green hover:bg-spooky-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          {isRunning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span>🏃‍♂️</span>
              <span>{submitted ? 'Solved!' : 'Run Code'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}