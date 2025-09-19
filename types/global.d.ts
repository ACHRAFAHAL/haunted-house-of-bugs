// Types for Haunted House of Bugs

declare module '@/data/puzzles.json' {
  const value: Array<{
    id: string;
    room: number;
    title: string;
    type: 'mcq' | 'fill_code' | 'fix_code';
    description: string;
    starterCode?: string;
    solution?: string;
    hint: string;
    tests?: { input: string; expected: string | number }[];
    points: number;
    question?: string;
    options?: string[];
    correctIndex?: number;
    bugHint?: string;
  }>;
  export default value;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};