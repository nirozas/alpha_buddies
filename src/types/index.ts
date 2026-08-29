export interface LetterData {
  letter: string;
  uppercase: string;
  lowercase: string;
  phoneme: string;
  exampleWord: string;
  exampleImage: string;
  exampleEmoji: string;
  funFact: string;
  color: string;
  bgColor: string;
  objects: { word: string; image: string }[];
}

export interface NumberData {
  digit: number;
  word: string;
  funFact: string;
  image: string;
  emoji?: string;
  color: string;
  bgColor: string;
  objects: { name: string; image: string }[];
}

export type ActivityGroup = 'recognition' | 'formation' | 'usage';

export type ActivityId =
  // Letter activities
  | 'letter-of-the-day'
  | 'trace-draw'
  | 'say-it-out-loud'
  | 'letter-match'
  | 'pop-the-bubble'
  | 'alphabet-song'
  | 'letter-sounds'
  | 'first-letter-sound'
  | 'memory-letters'
  | 'flip-find'
  | 'learn-my-letters'
  | 'colour-the-letter'
  | 'letter-caterpillar'
  | 'what-starts-with'
  | 'stamp-letter'
  | 'color-by-code'
  | 'find-in-paragraph'
  | 'alphabet-train'
  | 'mystery-reveal'
  | 'scavenger-hunt'
  | 'build-a-letter'
  | 'letter-dot-to-dot'
  | 'magic-trace'
  | 'missing-bridge'
  // Number activities
  | 'number-of-the-day'
  | 'trace-number'
  | 'count-tap'
  | 'number-match'
  | 'roll-count'
  | 'number-road'
  | 'fill-the-jar'
  | 'more-or-less'
  | 'counting-song'
  | 'number-sounds'
  | 'build-tower';

export interface ActivityMeta {
  id: ActivityId;
  name: string;
  description: string;
  icon: string;
  type: 'letter' | 'number';
  group: ActivityGroup;
  multiSelect?: boolean;
}

export interface ChildProgress {
  lettersCompleted: Record<string, boolean>;
  numbersCompleted: Record<number, boolean>;
  starsEarned: Record<string, 1 | 2 | 3>;
  activitiesCompleted: Record<string, number>;
  streakDays: number;
  totalPlaytime: number;
  lastPlayDate: string;
}

export type BuddyMood = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'idle' | 'sad' | 'neutral';

export interface AppSettings {
  volume: number;
  musicVolume: number;
  parentPin: string | null;
  childName: string;
  reducedMotion: boolean;
}

export interface SessionState {
  currentLetter: string | null;
  currentNumber: number | null;
  currentActivity: ActivityId | null;
  sessionStart: number;
}

export type MascotState = 'idle' | 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'surprised';

export type AgeGroup = '4-5' | '6-8' | '9-11' | '12-15' | '15-18' | '18+';

export type Screen = 'splash' | 'onboarding-name' | 'onboarding-age' | 'onboarding-welcome' | 'hub' | 'game' | 'progress' | 'letters' | 'numbers' | (string & {});

export interface Player {
  name: string;
  ageGroup: AgeGroup;
  starsTotal: number;
  wordsLearned: string[];
  streakDays: number;
  lastPlayedDate: string;
  completedPuzzleIds: string[];
}

export interface GameSession {
  puzzleId: string;
  startTime: number;
  endTime?: number;
  hintsUsed: { wordId: string; hintsUsed: number }[];
  starsEarned: number;
  wordsCompleted: string[];
  cellStates: Record<string, { revealed: boolean; correct: boolean; userInput: string }>;
}

export interface PathPoint { x: number; y: number; }
export interface LetterSong { letter: string; url: string; }
export interface CrosswordWord {
  id: string;
  number: number;
  direction: 'across' | 'down';
  answer: string;
  clue: string;
  row: number;
  col: number;
  imageHint: string;
  funFact: {
    word: string;
    emoji: string;
    funFact: string;
    didYouKnow: string;
    imageDescription: string;
    category: string;
    difficulty: string;
    criticalThinking?: string;
    formula?: string;
    deepDiveUrl?: string;
  };
}

export interface Puzzle {
  id: string;
  title: string;
  ageGroup: AgeGroup;
  difficulty: 'easy' | 'medium' | 'hard';
  gridSize: number;
  theme: string;
  themeEmoji: string;
  words: CrosswordWord[];
}

export interface CrosswordCell {
  row: number;
  col: number;
  letter: string;
  isBlack: boolean;
  wordIds: string[];
  userInput: string;
  revealed: boolean;
  correct: boolean;
  number?: number;
}

export interface PathPoint {
  x: number;
  y: number;
  type?: string;
  control1?: { x: number; y: number };
  control2?: { x: number; y: number };
}
