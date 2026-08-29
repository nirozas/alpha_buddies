export interface PathPoint { x: number; y: number; }
export interface StrokeSegment {
  points: PathPoint[];
  label?: string; // e.g. "1", "2"
}

export interface LetterPathData {
  strokes: StrokeSegment[];
}

export const LETTER_PATHS: Record<string, LetterPathData> = {
  'A': {
    strokes: [
      { label: '1', points: [{x: 50, y: 10}, {x: 40, y: 35}, {x: 30, y: 60}, {x: 20, y: 85}, {x: 10, y: 100}] },
      { label: '2', points: [{x: 50, y: 10}, {x: 60, y: 35}, {x: 70, y: 60}, {x: 80, y: 85}, {x: 90, y: 100}] },
      { label: '3', points: [{x: 30, y: 65}, {x: 50, y: 65}, {x: 70, y: 65}] }
    ]
  },
  'B': {
    strokes: [
      { label: '1', points: [{x: 25, y: 10}, {x: 25, y: 30}, {x: 25, y: 55}, {x: 25, y: 80}, {x: 25, y: 100}] },
      { label: '2', points: [{x: 25, y: 10}, {x: 55, y: 10}, {x: 75, y: 25}, {x: 55, y: 40}, {x: 25, y: 40}] },
      { label: '3', points: [{x: 25, y: 40}, {x: 65, y: 45}, {x: 80, y: 65}, {x: 65, y: 85}, {x: 25, y: 90}] }
    ]
  },
  'C': {
    strokes: [
      { label: '1', points: [{x: 80, y: 25}, {x: 65, y: 12}, {x: 45, y: 10}, {x: 25, y: 20}, {x: 15, y: 50}, {x: 25, y: 80}, {x: 45, y: 90}, {x: 65, y: 88}, {x: 80, y: 75}] }
    ]
  },
  'P': {
    strokes: [
      { label: '1', points: [{x: 30, y: 10}, {x: 30, y: 40}, {x: 30, y: 70}, {x: 30, y: 100}] },
      { label: '2', points: [{x: 30, y: 10}, {x: 60, y: 10}, {x: 80, y: 25}, {x: 60, y: 50}, {x: 30, y: 50}] }
    ]
  },
  'L': {
    strokes: [
      { label: '1', points: [{x: 30, y: 10}, {x: 30, y: 40}, {x: 30, y: 70}, {x: 30, y: 100}] },
      { label: '2', points: [{x: 30, y: 100}, {x: 50, y: 100}, {x: 75, y: 100}] }
    ]
  },
  'E': {
    strokes: [
      { label: '1', points: [{x: 30, y: 10}, {x: 30, y: 40}, {x: 30, y: 70}, {x: 30, y: 100}] },
      { label: '2', points: [{x: 30, y: 10}, {x: 55, y: 10}, {x: 80, y: 10}] },
      { label: '3', points: [{x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 55}] },
      { label: '4', points: [{x: 30, y: 100}, {x: 55, y: 100}, {x: 80, y: 100}] }
    ]
  },
  'D': {
    strokes: [
      { label: '1', points: [{x: 30, y: 10}, {x: 30, y: 100}] },
      { label: '2', points: [{x: 30, y: 10}, {x: 60, y: 10}, {x: 85, y: 35}, {x: 85, y: 75}, {x: 60, y: 100}, {x: 30, y: 100}] }
    ]
  },
  'G': {
    strokes: [
      { label: '1', points: [{x: 80, y: 25}, {x: 65, y: 12}, {x: 45, y: 10}, {x: 25, y: 20}, {x: 15, y: 50}, {x: 25, y: 80}, {x: 45, y: 90}, {x: 65, y: 88}, {x: 75, y: 75}] },
      { label: '2', points: [{x: 75, y: 55}, {x: 45, y: 55}] }
    ]
  },
  'O': {
    strokes: [
      { label: '1', points: [{x: 50, y: 10}, {x: 25, y: 20}, {x: 15, y: 50}, {x: 25, y: 80}, {x: 50, y: 90}, {x: 75, y: 80}, {x: 85, y: 50}, {x: 75, y: 20}, {x: 50, y: 10}] }
    ]
  },
  'T': {
    strokes: [
      { label: '1', points: [{x: 15, y: 10}, {x: 50, y: 10}, {x: 85, y: 10}] },
      { label: '2', points: [{x: 50, y: 10}, {x: 50, y: 100}] }
    ]
  },
  // ... more uppercase letters as needed
};

export const SMALL_LETTER_PATHS: Record<string, LetterPathData> = {
  'a': {
    strokes: [
      { label: '1', points: [{x: 80, y: 50}, {x: 70, y: 35}, {x: 50, y: 30}, {x: 35, y: 40}, {x: 30, y: 55}, {x: 35, y: 70}, {x: 50, y: 75}, {x: 70, y: 70}, {x: 80, y: 55}] },
      { label: '2', points: [{x: 80, y: 35}, {x: 80, y: 60}, {x: 80, y: 85}, {x: 80, y: 100}] }
    ]
  },
  'b': {
    strokes: [
      { label: '1', points: [{x: 30, y: 10}, {x: 30, y: 100}] },
      { label: '2', points: [{x: 30, y: 55}, {x: 50, y: 55}, {x: 70, y: 70}, {x: 70, y: 85}, {x: 50, y: 100}, {x: 30, y: 100}] }
    ]
  },
  'c': {
    strokes: [
      { label: '1', points: [{x: 75, y: 55}, {x: 60, y: 42}, {x: 40, y: 40}, {x: 25, y: 50}, {x: 25, y: 80}, {x: 40, y: 90}, {x: 60, y: 88}, {x: 75, y: 75}] }
    ]
  },
  'd': {
    strokes: [
      { label: '1', points: [{x: 70, y: 55}, {x: 55, y: 42}, {x: 35, y: 40}, {x: 20, y: 55}, {x: 20, y: 80}, {x: 35, y: 95}, {x: 55, y: 95}, {x: 70, y: 80}] },
      { label: '2', points: [{x: 70, y: 10}, {x: 70, y: 100}] }
    ]
  },
  'e': {
    strokes: [
      { label: '1', points: [{x: 25, y: 70}, {x: 75, y: 70}, {x: 75, y: 50}, {x: 60, y: 35}, {x: 40, y: 35}, {x: 25, y: 50}, {x: 25, y: 80}, {x: 45, y: 95}, {x: 70, y: 90}] }
    ]
  },
  't': {
    strokes: [
      { label: '1', points: [{x: 45, y: 10}, {x: 45, y: 100}] },
      { label: '2', points: [{x: 25, y: 45}, {x: 70, y: 45}] }
    ]
  }
};

export const getLetterPathData = (char: string): LetterPathData => {
  const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
  const found = isUpper ? LETTER_PATHS[char] : SMALL_LETTER_PATHS[char];
  
  if (found) return found;
  
  // Generic O-shape fallback
  const points: PathPoint[] = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    points.push({ x: 50 + Math.cos(angle) * 35, y: 50 + Math.sin(angle) * 35 });
  }
  return { strokes: [{ label: '1', points }] };
};
