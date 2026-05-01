export interface LetterData {
  letter: string;
  uppercase: string;
  lowercase: string;
  phoneme: string;
  exampleWord: string;
  exampleEmoji: string;
  funFact: string;
  color: string;
  bgColor: string;
  objects: string[];  // 3 objects starting with this letter for activities
}

export interface NumberData {
  digit: number;
  word: string;
  funFact: string;
  emoji: string;
  color: string;
  bgColor: string;
  objects: string[];  // objects to display for counting
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
  | 'flip-find'
  | 'colour-the-letter'
  | 'letter-caterpillar'
  | 'what-starts-with'
  | 'stamp-letter'
  | 'color-by-code'
  | 'find-in-paragraph'
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

export type BuddyMood = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'idle';

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
