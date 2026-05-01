import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProgress, AppSettings } from '../types';

interface ProgressStore {
  progress: ChildProgress;
  settings: AppSettings;
  markLetterComplete: (letter: string) => void;
  markNumberComplete: (digit: number) => void;
  awardStars: (key: string, stars: 1 | 2 | 3) => void;
  incrementActivity: (key: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  resetProgress: () => void;
  addPlaytime: (seconds: number) => void;
}

const defaultProgress: ChildProgress = {
  lettersCompleted: {},
  numbersCompleted: {},
  starsEarned: {},
  activitiesCompleted: {},
  streakDays: 0,
  totalPlaytime: 0,
  lastPlayDate: '',
};

const defaultSettings: AppSettings = {
  volume: 0.7,
  musicVolume: 0.4,
  parentPin: null,
  childName: 'Explorer',
  reducedMotion: false,
};

export const useStore = create<ProgressStore>()(
  persist(
    (set) => ({
      progress: defaultProgress,
      settings: defaultSettings,

      markLetterComplete: (letter) =>
        set((s) => ({
          progress: { ...s.progress, lettersCompleted: { ...s.progress.lettersCompleted, [letter]: true } },
        })),

      markNumberComplete: (digit) =>
        set((s) => ({
          progress: { ...s.progress, numbersCompleted: { ...s.progress.numbersCompleted, [digit]: true } },
        })),

      awardStars: (key, stars) =>
        set((s) => ({
          progress: { ...s.progress, starsEarned: { ...s.progress.starsEarned, [key]: stars } },
        })),

      incrementActivity: (key) =>
        set((s) => ({
          progress: {
            ...s.progress,
            activitiesCompleted: {
              ...s.progress.activitiesCompleted,
              [key]: (s.progress.activitiesCompleted[key] || 0) + 1,
            },
          },
        })),

      addPlaytime: (seconds) =>
        set((s) => ({
          progress: { ...s.progress, totalPlaytime: s.progress.totalPlaytime + seconds },
        })),

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetProgress: () => set({ progress: defaultProgress }),
    }),
    { name: 'alphabuddies-store' }
  )
);
