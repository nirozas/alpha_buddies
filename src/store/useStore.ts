import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Screen, GameSession, AgeGroup, Puzzle, CrosswordWord } from '../types';


interface AppState {
  screen: Screen;
  player: Player | null;
  currentPuzzle: Puzzle | null;
  session: GameSession | null;
  selectedWordId: string | null;
  completedWordIds: string[];
  showFunFact: CrosswordWord | null;
  reducedMotion: boolean;
  soundEnabled: boolean;

  setScreen: (s: Screen) => void;
  setPlayer: (name: string, ageGroup: AgeGroup) => void;
  updatePlayer: (patch: Partial<Player>) => void;
  resetPlayer: () => void;
  startPuzzle: (puzzle: Puzzle) => void;
  setSelectedWord: (id: string | null) => void;
  updateCell: (key: string, input: string) => void;
  revealLetter: (wordId: string, letterIndex: number) => void;
  revealWord: (wordId: string) => void;
  completeWord: (wordId: string) => void;
  closeFunFact: () => void;
  endPuzzle: () => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
}

const DEFAULT_PLAYER = (name: string, ageGroup: AgeGroup): Player => ({
  name,
  ageGroup,
  starsTotal: 0,
  wordsLearned: [],
  streakDays: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  completedPuzzleIds: [],
});

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      screen: 'splash',
      player: null,
      currentPuzzle: null,
      session: null,
      selectedWordId: null,
      completedWordIds: [],
      showFunFact: null,
      reducedMotion: false,
      soundEnabled: true,

      setScreen: (screen) => set({ screen }),

      setPlayer: (name, ageGroup) => {
        const player = DEFAULT_PLAYER(name, ageGroup);
        set({ player, screen: 'onboarding-welcome' });
      },

      updatePlayer: (patch) => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, ...patch } });
      },

      resetPlayer: () => set({ player: null, screen: 'onboarding-name', session: null, currentPuzzle: null }),

      startPuzzle: (puzzle) => {
        const session: GameSession = {
          puzzleId: puzzle.id,
          startTime: Date.now(),
          hintsUsed: [],
          starsEarned: 5,
          wordsCompleted: [],
          cellStates: {},
        };
        set({ currentPuzzle: puzzle, session, selectedWordId: puzzle.words[0]?.id ?? null, completedWordIds: [], screen: 'game' });
      },

      setSelectedWord: (id) => set({ selectedWordId: id }),

      updateCell: (key, input) => {
        const { session } = get();
        if (!session) return;
        const cellStates = { ...session.cellStates, [key]: { ...(session.cellStates[key] ?? { revealed: false, correct: false }), userInput: input } };
        set({ session: { ...session, cellStates } });
      },

      revealLetter: (wordId, _letterIndex) => {
        const { session, player } = get();
        if (!session || !player) return;
        const cost = 1;
        const hints = session.hintsUsed.find(h => h.wordId === wordId);
        const hintsUsed = hints
          ? session.hintsUsed.map(h => h.wordId === wordId ? { ...h, hintsUsed: h.hintsUsed | 4 } : h)
          : [...session.hintsUsed, { wordId, hintsUsed: 4 }];
        set({
          session: { ...session, hintsUsed, starsEarned: Math.max(0, session.starsEarned - cost) },
          player: { ...player, starsTotal: Math.max(0, player.starsTotal - cost) },
        });
      },

      revealWord: (wordId) => {
        const { session, player } = get();
        if (!session || !player) return;
        const cost = 3;
        const hints = session.hintsUsed.find(h => h.wordId === wordId);
        const hintsUsed = hints
          ? session.hintsUsed.map(h => h.wordId === wordId ? { ...h, hintsUsed: h.hintsUsed | 8 } : h)
          : [...session.hintsUsed, { wordId, hintsUsed: 8 }];
        set({
          session: { ...session, hintsUsed, starsEarned: Math.max(0, session.starsEarned - cost) },
          player: { ...player, starsTotal: Math.max(0, player.starsTotal - cost) },
        });
      },

      completeWord: (wordId) => {
        const { session, player, currentPuzzle } = get();
        if (!session || !player || !currentPuzzle) return;
        const word = currentPuzzle.words.find(w => w.id === wordId);
        if (!word) return;
        const wordsCompleted = [...session.wordsCompleted, wordId];
        const wordsLearned = player.wordsLearned.includes(word.answer)
          ? player.wordsLearned
          : [...player.wordsLearned, word.answer];
        set({
          session: { ...session, wordsCompleted },
          player: { ...player, wordsLearned, starsTotal: player.starsTotal + 1 },
          completedWordIds: [...get().completedWordIds, wordId],
          showFunFact: word,
        });
      },

      closeFunFact: () => set({ showFunFact: null }),

      endPuzzle: () => {
        const { session, player, currentPuzzle } = get();
        if (!session || !player || !currentPuzzle) return;
        const completedPuzzleIds = player.completedPuzzleIds.includes(currentPuzzle.id)
          ? player.completedPuzzleIds
          : [...player.completedPuzzleIds, currentPuzzle.id];
        set({
          session: { ...session, endTime: Date.now() },
          player: { ...player, completedPuzzleIds, starsTotal: player.starsTotal + session.starsEarned },
        });
      },

      toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),
      toggleReducedMotion: () => set(s => ({ reducedMotion: !s.reducedMotion })),
    }),
    { name: 'my-crossword-store', partialize: (s) => ({ player: s.player, reducedMotion: s.reducedMotion, soundEnabled: s.soundEnabled }) }
  )
);
