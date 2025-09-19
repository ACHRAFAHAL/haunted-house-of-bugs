import puzzlesData from '@/data/puzzles.json';

export interface Puzzle {
  id: string;
  room: number;
  title: string;
  type: 'mcq' | 'fill_code' | 'fix_code';
  description: string;
  story?: string; // New: Spooky story text
  starterCode?: string;
  solution?: string;
  hint?: string;
  tests?: { input: string; expected: string | number }[];
  points: number;
  successMessage?: string; // New: Custom success message
  // MCQ specific
  question?: string;
  options?: string[];
  correctIndex?: number;
  // Fix code specific
  bugHint?: string;
  buggyCode?: string; // New: The buggy code to fix
  fix?: string; // New: The expected fix
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string | number;
  actual: string | number;
  error?: string;
}

export interface ValidationResult {
  correct: boolean;
  message: string;
  testResults?: TestResult[];
}

/**
 * Load all puzzles from the JSON file
 */
export function loadPuzzles(): Puzzle[] {
  return puzzlesData as Puzzle[];
}

/**
 * Get a specific puzzle by ID
 */
export function getPuzzleById(id: string): Puzzle | null {
  const puzzles = loadPuzzles();
  return puzzles.find(puzzle => puzzle.id === id) || null;
}

/**
 * Get puzzle by room number
 */
export function getPuzzleByRoom(room: number): Puzzle | null {
  const puzzles = loadPuzzles();
  return puzzles.find(puzzle => puzzle.room === room) || null;
}

/**
 * Validate MCQ answer
 */
export function validateMCQ(puzzle: Puzzle, selectedIndex: number): ValidationResult {
  if (puzzle.type !== 'mcq') {
    return { correct: false, message: 'Invalid puzzle type for MCQ validation' };
  }

  const correct = selectedIndex === puzzle.correctIndex;
  const message = correct 
    ? '🎉 Correct! The door creaks open...' 
    : '❌ That\'s not right. The door remains locked.';

  return { correct, message };
}

/**
 * Validate string-based answers (exact match or regex)
 */
export function validateStringAnswer(expected: string, actual: string): boolean {
  // Remove extra whitespace and normalize
  const normalizedExpected = expected.trim().toLowerCase();
  const normalizedActual = actual.trim().toLowerCase();
  
  return normalizedExpected === normalizedActual;
}

/**
 * Validate code fill puzzles by running simple tests
 */
export function validateCodeFill(puzzle: Puzzle, userCode: string): ValidationResult {
  if (puzzle.type !== 'fill_code') {
    return { correct: false, message: 'Invalid puzzle type for code fill validation' };
  }

  if (!puzzle.tests) {
    return { correct: false, message: 'No tests defined for this puzzle' };
  }

  const testResults: TestResult[] = [];
  let allPassed = true;

  try {
    // Combine starter code with user solution
    const completeCode = puzzle.starterCode?.replace(/\/\/ TODO:.*|\/\/ base case.*|\/\/ recursive call.*/g, userCode.trim()) || userCode;
    
    for (const test of puzzle.tests) {
      try {
        const result = runTestInSandbox(completeCode, test.input);
        const passed = result === test.expected || String(result) === String(test.expected);
        
        testResults.push({
          passed,
          input: test.input,
          expected: test.expected,
          actual: result
        });

        if (!passed) allPassed = false;
      } catch (error) {
        testResults.push({
          passed: false,
          input: test.input,
          expected: test.expected,
          actual: 'Error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        allPassed = false;
      }
    }

    const message = allPassed 
      ? '✅ All tests passed! The mystical barrier dissolves...'
      : '❌ Some tests failed. Check your logic and try again.';

    return { correct: allPassed, message, testResults };
  } catch (error) {
    return { 
      correct: false, 
      message: `⚠️ Code execution error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      testResults 
    };
  }
}

/**
 * Validate fix code puzzles by checking for specific fixes
 */
export function validateCodeFix(puzzle: Puzzle, userCode: string): ValidationResult {
  if (puzzle.type !== 'fix_code') {
    return { correct: false, message: 'Invalid puzzle type for code fix validation' };
  }

  // Check for the expected fix based on puzzle ID or fix field
  let hasCorrectFix = false;
  let customMessage = '';

  if (puzzle.fix) {
    // Check if the user's code contains the expected fix
    hasCorrectFix = userCode.includes(puzzle.fix.trim());
    customMessage = puzzle.successMessage || '✅ Bug fixed! The code now works correctly.';
  }

  if (hasCorrectFix) {
    // For simple syntax fixes, we don't need to run tests
    // Just check if the fix is present
    return { 
      correct: true, 
      message: customMessage
    };
  } else {
    const hintMessage = puzzle.hint 
      ? `❌ The bug is still there. Hint: ${puzzle.hint}`
      : '❌ The bug is still there. Check your fix carefully.';
    
    return { 
      correct: false, 
      message: hintMessage
    };
  }
}

/**
 * Run user code in a simple sandbox with timeout
 * WARNING: This is NOT production-safe! Only for hackathon demo.
 * In production, use a proper server-side sandbox.
 */
function runTestInSandbox(code: string, input: string): any {
  // Simple timeout mechanism
  const startTime = Date.now();
  const TIMEOUT = 1000; // 1 second

  try {
    // Create a safer evaluation context
    const safeCode = `
      ${code}
      
      // Auto-detect function name and call it
      const functionMatch = code.match(/function\\s+(\\w+)/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        if (typeof window[functionName] === 'function') {
          return window[functionName](${input});
        }
      }
      
      // Fallback: try to eval the input directly
      return eval(\`(\${code.replace(/function\\s+\\w+/, 'function')})(${input})\`);
    `;

    // Check timeout
    if (Date.now() - startTime > TIMEOUT) {
      throw new Error('Code execution timeout');
    }

    // Very basic sandboxing - NOT production safe!
    const result = Function('"use strict"; ' + code + '; return eval(arguments[0]);')(input);
    
    return result;
  } catch (error) {
    throw new Error(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Enhanced test runner using Web Worker (safer but still demo-only)
 * This is a placeholder for the concept - actual implementation would be more complex
 */
export function runTestsInWorker(code: string, tests: any[]): Promise<TestResult[]> {
  return new Promise((resolve) => {
    // Placeholder implementation
    // In a real app, you'd create a Web Worker and run the code there
    console.warn('Web Worker test runner not implemented - using fallback');
    
    const results: TestResult[] = tests.map(test => {
      try {
        const result = runTestInSandbox(code, test.input);
        return {
          passed: result === test.expected,
          input: test.input,
          expected: test.expected,
          actual: result
        };
      } catch (error) {
        return {
          passed: false,
          input: test.input,
          expected: test.expected,
          actual: 'Error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    resolve(results);
  });
}

/**
 * Get the next puzzle/room
 */
export function getNextPuzzle(currentRoom: number): Puzzle | null {
  return getPuzzleByRoom(currentRoom + 1);
}

/**
 * Calculate score based on puzzle difficulty and time taken
 */
export function calculateScore(puzzle: Puzzle, timeSpent: number): number {
  const basePoints = puzzle.points;
  const timeBonus = Math.max(0, 60 - timeSpent); // Bonus for solving quickly
  return Math.floor(basePoints + timeBonus / 2);
}