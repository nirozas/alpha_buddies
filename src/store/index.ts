import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProgress, AppSettings, Sticker } from '../types';
import { STICKERS_CATALOG } from '../constants/stickers';
import { BADGES_CATALOG } from '../constants/badges';

interface ProgressStore {
  progress: ChildProgress;
  settings: AppSettings;
  masteredLetters: string[];
  setMasteredLetters: (letters: string[]) => void;
  masteredLetter: string | null;
  setMasteredLetter: (letter: string | null) => void;
  setAvatar: (avatar: string) => void;
  markLetterComplete: (letter: string) => void;
  markNumberComplete: (digit: number) => void;
  awardStars: (key: string, stars: 1 | 2 | 3) => void;
  incrementActivity: (key: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  resetProgress: () => void;
  addPlaytime: (seconds: number) => void;
  newStickerUnlocked: Sticker | null;
  clearNewSticker: () => void;
}

const defaultProgress: ChildProgress = {
  lettersCompleted: {},
  numbersCompleted: {},
  starsEarned: {},
  activitiesCompleted: {},
  stickers: [],
  streakDays: 1,
  totalPlaytime: 0,
  lastPlayDate: new Date().toISOString().slice(0, 10),
  avatar: '🦁',
  dailyStars: {},
  badges: [],
  perfectScores: 0,
};

const defaultSettings: AppSettings = {
  volume: 0.7,
  musicVolume: 0.4,
  parentPin: null,
  childName: 'Explorer',
  reducedMotion: false,
};

// Helper: Calculate total distinct stars earned across canonical (item:activity) pairs
export function calculateDistinctStars(starsEarned: Record<string, 1 | 2 | 3>): number {
  const canonical: Record<string, number> = {};
  for (const [key, val] of Object.entries(starsEarned)) {
    if (!val) continue;
    const parts = key.split('-');
    if (parts.length >= 2) {
      const first = parts[0].toUpperCase();
      const last = parts[parts.length - 1].toUpperCase();
      if (first.length === 1 && first >= 'A' && first <= 'Z') {
        const act = parts.slice(1).join('-');
        canonical[`${first}:${act}`] = Math.max(canonical[`${first}:${act}`] || 0, val);
      } else if (last.length === 1 && last >= 'A' && last <= 'Z') {
        const act = parts.slice(0, -1).join('-');
        canonical[`${last}:${act}`] = Math.max(canonical[`${last}:${act}`] || 0, val);
      } else if (/^\d+$/.test(parts[0])) {
        const act = parts.slice(1).join('-');
        canonical[`num_${parts[0]}:${act}`] = Math.max(canonical[`num_${parts[0]}:${act}`] || 0, val);
      } else if (/^\d+$/.test(parts[parts.length - 1])) {
        const act = parts.slice(0, -1).join('-');
        canonical[`num_${parts[parts.length - 1]}:${act}`] = Math.max(canonical[`num_${parts[parts.length - 1]}:${act}`] || 0, val);
      } else {
        canonical[key] = Math.max(canonical[key] || 0, val);
      }
    } else {
      canonical[key] = Math.max(canonical[key] || 0, val);
    }
  }
  return Object.values(canonical).reduce((sum, score) => sum + score, 0);
}

// Helper: Evaluate which stickers are unlocked based on progress
export function checkUnlockedStickers(
  starsEarned: Record<string, 1 | 2 | 3>,
  lettersCompleted: Record<string, boolean>,
  numbersCompleted: Record<number, boolean>,
  streakDays: number = 1
): string[] {
  const totalStars = calculateDistinctStars(starsEarned);
  const lettersCount = Object.keys(lettersCompleted).length;
  const numbersCount = Object.keys(numbersCompleted).length;

  // Games count per letter
  const letterGamesMap: Record<string, Set<string>> = {};
  const allGames = new Set<string>();

  for (const [k, v] of Object.entries(starsEarned)) {
    if (!v || v <= 0) continue;
    const parts = k.split('-');
    if (parts.length >= 2) {
      const first = parts[0].toUpperCase();
      const last = parts[parts.length - 1].toUpperCase();
      if (first.length === 1 && first >= 'A' && first <= 'Z') {
        const act = parts.slice(1).join('-');
        if (!letterGamesMap[first]) letterGamesMap[first] = new Set();
        letterGamesMap[first].add(act);
        allGames.add(act);
      } else if (last.length === 1 && last >= 'A' && last <= 'Z') {
        const act = parts.slice(0, -1).join('-');
        if (!letterGamesMap[last]) letterGamesMap[last] = new Set();
        letterGamesMap[last].add(act);
        allGames.add(act);
      } else {
        allGames.add(k);
      }
    } else {
      allGames.add(k);
    }
  }

  const maxGamesForLetter = Math.max(
    0,
    ...Object.values(letterGamesMap).map((set) => set.size)
  );

  const unlocked = new Set<string>();

  // ── EASIER / STARTER MILESTONES ──
  if (lettersCount >= 1) unlocked.add('first-letter');
  if (numbersCount >= 1) unlocked.add('first-number');
  if (allGames.size >= 1) unlocked.add('first-game');
  if (Object.values(starsEarned).some((v) => v === 3)) unlocked.add('first-gold-star');
  if (totalStars >= 3) unlocked.add('stars-3');
  if (totalStars >= 5) unlocked.add('stars-5');
  if (streakDays >= 3) unlocked.add('streak-3');

  // ── ADVANCED STARS MILESTONES ──
  if (totalStars >= 10) unlocked.add('star-10');
  if (totalStars >= 20) unlocked.add('star-20');
  if (totalStars >= 30) unlocked.add('star-30');
  if (totalStars >= 50) unlocked.add('star-50');
  if (totalStars >= 100) unlocked.add('star-100');

  // ── LETTERS MILESTONES ──
  if (lettersCount >= 5) unlocked.add('letters-5');
  if (lettersCount >= 10) unlocked.add('letters-10');
  if (lettersCount >= 20) unlocked.add('letters-20');
  if (lettersCount >= 26) unlocked.add('letters-all');

  // ── NUMBERS & GAMES MILESTONES ──
  if (numbersCount >= 5) unlocked.add('numbers-5');
  if (numbersCount >= 10) unlocked.add('numbers-all');
  if (allGames.size >= 5) unlocked.add('games-5');
  if (allGames.size >= 10) unlocked.add('games-10');

  // Buddy's special favorite
  if (totalStars >= 5 || lettersCount >= 2) unlocked.add('buddy-favorite');

  // ── TIER 1 NOVICE MYSTIC CREATURES (LEVELS 1-2) ──
  if (totalStars >= 2 || lettersCount >= 1) unlocked.add('crystal-pegasus');
  if (totalStars >= 4 || numbersCount >= 1) unlocked.add('glitter-axolotl');
  if (allGames.size >= 2 || totalStars >= 6) unlocked.add('bubble-turtle');
  if (totalStars >= 8 || lettersCount >= 3) unlocked.add('stardust-hamster');
  if (lettersCount >= 4 || totalStars >= 12) unlocked.add('sunflower-sprout');
  if (numbersCount >= 3 || totalStars >= 15) unlocked.add('berry-dragon');

  // ── TIER 2 EXPLORER MYSTIC CREATURES (LEVELS 3-4) ──
  if (totalStars >= 18 || lettersCount >= 6) unlocked.add('cosmic-koala');
  if (totalStars >= 22 || numbersCount >= 4) unlocked.add('cloud-sheep');
  if (allGames.size >= 4 || totalStars >= 25) unlocked.add('glimmer-panda');
  if (streakDays >= 2 || totalStars >= 28) unlocked.add('aurora-penguin');
  if (lettersCount >= 8 || totalStars >= 32) unlocked.add('ember-cheetah');
  if (totalStars >= 35 || maxGamesForLetter >= 2) unlocked.add('gem-otter');

  // ── TIER 3 CHAMPION MYSTIC CREATURES (LEVELS 5-6) ──
  if (totalStars >= 40 || lettersCount >= 12) unlocked.add('prism-chameleon');
  if (totalStars >= 45 || numbersCount >= 6) unlocked.add('sugar-bat');
  if (lettersCount >= 14 || totalStars >= 48) unlocked.add('blossom-deer');
  if (streakDays >= 4 || totalStars >= 52) unlocked.add('lightning-fox');
  if (totalStars >= 55 || allGames.size >= 6) unlocked.add('celestial-whale');
  if (totalStars >= 60 || lettersCount >= 16) unlocked.add('lunar-moth');

  // ── TIER 4 MASTER MYSTIC CREATURES (LEVELS 7-8) ──
  if (totalStars >= 65 || numbersCount >= 8) unlocked.add('firefly-frog');
  if (lettersCount >= 18 || totalStars >= 70) unlocked.add('nebula-cat');
  if (totalStars >= 75 || streakDays >= 5) unlocked.add('golden-scarab');
  if (totalStars >= 80 || lettersCount >= 22) unlocked.add('frost-wolf');
  if (numbersCount >= 10 || totalStars >= 85) unlocked.add('tidal-narwhal');
  if (totalStars >= 90 || allGames.size >= 8) unlocked.add('candy-bear');

  // ── TIER 5 MYTHIC LEGENDARY CREATURES (LEVELS 9-10+) ──
  if (totalStars >= 95 || lettersCount >= 24) unlocked.add('phoenix-hatchling');
  if (totalStars >= 105 || (lettersCount >= 20 && numbersCount >= 8)) unlocked.add('coral-seahorse');
  if (totalStars >= 115 || (lettersCount >= 26 && numbersCount >= 10)) unlocked.add('time-dragon');
  if (totalStars >= 125 || streakDays >= 7) unlocked.add('rainbow-serpent');
  if (totalStars >= 135 || maxGamesForLetter >= 3) unlocked.add('diamond-golem');
  if (totalStars >= 150 || (lettersCount >= 26 && numbersCount >= 10 && totalStars >= 100)) unlocked.add('astral-lion');

  return Array.from(unlocked);
}

// Helper: Evaluate which badges are unlocked
export function checkUnlockedBadges(
  progress: ChildProgress,
  totalStars: number
): string[] {
  const lettersCount = Object.keys(progress.lettersCompleted || {}).length;
  const numbersCount = Object.keys(progress.numbersCompleted || {}).length;
  const gamesCount = Object.keys(progress.activitiesCompleted || {}).length;
  const perfectCount = progress.perfectScores || 0;
  const streak = progress.streakDays || 0;

  const unlocked = new Set<string>(progress.badges || []);

  if (totalStars >= 1) unlocked.add('first-star');
  if (perfectCount >= 1) unlocked.add('perfect-score');
  if (perfectCount >= 3) unlocked.add('triple-perfect');
  if (streak >= 3) unlocked.add('streak-3');
  if (streak >= 7) unlocked.add('streak-7');
  if (lettersCount >= 5) unlocked.add('letters-5');
  if (lettersCount >= 15) unlocked.add('letters-15');
  if (lettersCount >= 26) unlocked.add('letters-all');
  if (numbersCount >= 5) unlocked.add('numbers-5');
  if (numbersCount >= 10) unlocked.add('numbers-all');
  if (gamesCount >= 5) unlocked.add('games-explorer');
  if (totalStars >= 50) unlocked.add('stars-50');
  if (totalStars >= 100) unlocked.add('stars-100');

  return Array.from(unlocked);
}

// Helper: Calculate streak day difference
export function getUpdatedStreak(lastPlayDate: string, currentStreak: number, today: string): number {
  if (!lastPlayDate) return 1;
  if (lastPlayDate === today) return currentStreak || 1;
  const last = new Date(lastPlayDate);
  const cur = new Date(today);
  const diffTime = cur.getTime() - last.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
  if (diffDays === 1) return (currentStreak || 0) + 1;
  if (diffDays > 1) return 1;
  return currentStreak || 1;
}

export const useStore = create<ProgressStore>()(
  persist(
    (set) => ({
      progress: defaultProgress,
      settings: defaultSettings,
      masteredLetters: [],
      masteredLetter: null,
      newStickerUnlocked: null,

      clearNewSticker: () => set({ newStickerUnlocked: null }),

      setAvatar: (avatar) =>
        set((s) => ({
          progress: {
            ...s.progress,
            avatar,
          },
        })),

      setMasteredLetters: (letters) => {
        const sliced = letters.slice(0, 4);
        set({ masteredLetters: sliced, masteredLetter: sliced[0] || null });
      },

      setMasteredLetter: (letter) =>
        set({
          masteredLetters: letter ? [letter] : [],
          masteredLetter: letter,
        }),

      markLetterComplete: (letter) => {
        const upper = letter.toUpperCase();
        set((s) => {
          const lettersCompleted = { ...s.progress.lettersCompleted, [upper]: true };
          const unlockedIds = checkUnlockedStickers(
            s.progress.starsEarned,
            lettersCompleted,
            s.progress.numbersCompleted
          );
          const currentStickers = s.progress.stickers || [];
          const newlyUnlockedId = unlockedIds.find((id) => !currentStickers.includes(id));
          const newlyUnlocked = newlyUnlockedId
            ? STICKERS_CATALOG.find((st) => st.id === newlyUnlockedId) || null
            : null;

          const totalStars = calculateDistinctStars(s.progress.starsEarned);
          const badges = checkUnlockedBadges(
            {
              ...s.progress,
              lettersCompleted,
            },
            totalStars
          );

          return {
            newStickerUnlocked: newlyUnlocked || s.newStickerUnlocked,
            progress: {
              ...s.progress,
              lettersCompleted,
              stickers: Array.from(new Set([...currentStickers, ...unlockedIds])),
              badges,
            },
          };
        });
      },

      markNumberComplete: (digit) =>
        set((s) => {
          const numbersCompleted = { ...s.progress.numbersCompleted, [digit]: true };
          const unlockedIds = checkUnlockedStickers(
            s.progress.starsEarned,
            s.progress.lettersCompleted,
            numbersCompleted
          );
          const currentStickers = s.progress.stickers || [];
          const newlyUnlockedId = unlockedIds.find((id) => !currentStickers.includes(id));
          const newlyUnlocked = newlyUnlockedId
            ? STICKERS_CATALOG.find((st) => st.id === newlyUnlockedId) || null
            : null;

          const totalStars = calculateDistinctStars(s.progress.starsEarned);
          const badges = checkUnlockedBadges(
            {
              ...s.progress,
              numbersCompleted,
            },
            totalStars
          );

          return {
            newStickerUnlocked: newlyUnlocked || s.newStickerUnlocked,
            progress: {
              ...s.progress,
              numbersCompleted,
              stickers: Array.from(new Set([...currentStickers, ...unlockedIds])),
              badges,
            },
          };
        }),

      awardStars: (key, stars) =>
        set((s) => {
          const updates: Record<string, 1 | 2 | 3> = {};
          const prevScore = s.progress.starsEarned[key] || 0;
          const bestScore = (Math.max(prevScore, stars)) as 1 | 2 | 3;
          updates[key] = bestScore;

          const lettersCompleted = { ...s.progress.lettersCompleted };
          const numbersCompleted = { ...s.progress.numbersCompleted };

          // Canonical alias generation:
          const parts = key.split('-');
          if (parts.length >= 2) {
            const first = parts[0].toUpperCase();
            const last = parts[parts.length - 1].toUpperCase();

            // Format: 'A-activity-name'
            if (first.length === 1 && first >= 'A' && first <= 'Z') {
              const act = parts.slice(1).join('-');
              updates[`${act}-${first}`] = bestScore;
              updates[`${first}-${act}`] = bestScore;
              lettersCompleted[first] = true;

              if (act === 'letter-of-the-day') {
                updates[`${first}-learn-my-letters`] = bestScore;
                updates[`learn-my-letters-${first}`] = bestScore;
              } else if (act === 'learn-my-letters') {
                updates[`${first}-letter-of-the-day`] = bestScore;
                updates[`letter-of-the-day-${first}`] = bestScore;
              } else if (act === 'dot-to-dot') {
                updates[`${first}-letter-dot-to-dot`] = bestScore;
                updates[`letter-dot-to-dot-${first}`] = bestScore;
              }
            }
            // Format: 'activity-name-A'
            else if (last.length === 1 && last >= 'A' && last <= 'Z') {
              const act = parts.slice(0, -1).join('-');
              updates[`${last}-${act}`] = bestScore;
              updates[`${act}-${last}`] = bestScore;
              lettersCompleted[last] = true;

              if (act === 'letter-of-the-day') {
                updates[`${last}-learn-my-letters`] = bestScore;
                updates[`learn-my-letters-${last}`] = bestScore;
              } else if (act === 'learn-my-letters') {
                updates[`${last}-letter-of-the-day`] = bestScore;
                updates[`letter-of-the-day-${last}`] = bestScore;
              } else if (act === 'dot-to-dot') {
                updates[`${last}-letter-dot-to-dot`] = bestScore;
                updates[`letter-dot-to-dot-${last}`] = bestScore;
              }
            }
            // Number format: '1-count-tap' or 'count-tap-1'
            else if (/^\d+$/.test(parts[0])) {
              const digit = parseInt(parts[0], 10);
              numbersCompleted[digit] = true;
            } else if (/^\d+$/.test(parts[parts.length - 1])) {
              const digit = parseInt(parts[parts.length - 1], 10);
              numbersCompleted[digit] = true;
            }
          }

          const today = new Date().toISOString().slice(0, 10);
          const dailyStars = { ...(s.progress.dailyStars || {}) };
          dailyStars[today] = (dailyStars[today] || 0) + stars;

          const perfectScores = (s.progress.perfectScores || 0) + (stars === 3 ? 1 : 0);
          const streakDays = getUpdatedStreak(s.progress.lastPlayDate, s.progress.streakDays, today);

          const allStars = { ...s.progress.starsEarned, ...updates };
          const totalStars = calculateDistinctStars(allStars);
          const unlockedIds = checkUnlockedStickers(allStars, lettersCompleted, numbersCompleted, streakDays);
          const currentStickers = s.progress.stickers || [];
          const newlyUnlockedId = unlockedIds.find((id) => !currentStickers.includes(id));
          const newlyUnlocked = newlyUnlockedId
            ? STICKERS_CATALOG.find((st) => st.id === newlyUnlockedId) || null
            : null;

          const updatedBadges = checkUnlockedBadges(
            {
              ...s.progress,
              lettersCompleted,
              numbersCompleted,
              perfectScores,
              streakDays,
              activitiesCompleted: s.progress.activitiesCompleted,
            },
            totalStars
          );

          return {
            newStickerUnlocked: newlyUnlocked || s.newStickerUnlocked,
            progress: {
              ...s.progress,
              starsEarned: allStars,
              lettersCompleted,
              numbersCompleted,
              stickers: Array.from(new Set([...currentStickers, ...unlockedIds])),
              badges: updatedBadges,
              dailyStars,
              perfectScores,
              streakDays,
              lastPlayDate: today,
            },
          };
        }),

      incrementActivity: (key) =>
        set((s) => {
          const count = (s.progress.activitiesCompleted[key] || 0) + 1;
          const updates: Record<string, number> = { [key]: count };
          const parts = key.split('-');
          if (parts.length >= 2) {
            const first = parts[0].toUpperCase();
            const last = parts[parts.length - 1].toUpperCase();
            if (first.length === 1 && first >= 'A' && first <= 'Z') {
              const act = parts.slice(1).join('-');
              updates[`${act}-${first}`] = count;
              updates[`${first}-${act}`] = count;
              if (act === 'letter-of-the-day') updates[`${first}-learn-my-letters`] = count;
              if (act === 'learn-my-letters') updates[`${first}-letter-of-the-day`] = count;
            } else if (last.length === 1 && last >= 'A' && last <= 'Z') {
              const act = parts.slice(0, -1).join('-');
              updates[`${last}-${act}`] = count;
              updates[`${act}-${last}`] = count;
              if (act === 'letter-of-the-day') updates[`${last}-learn-my-letters`] = count;
              if (act === 'learn-my-letters') updates[`${last}-letter-of-the-day`] = count;
            }
          }
          const totalStars = calculateDistinctStars(s.progress.starsEarned);
          const updatedBadges = checkUnlockedBadges(
            {
              ...s.progress,
              activitiesCompleted: {
                ...s.progress.activitiesCompleted,
                ...updates,
              },
            },
            totalStars
          );
          return {
            progress: {
              ...s.progress,
              activitiesCompleted: {
                ...s.progress.activitiesCompleted,
                ...updates,
              },
              badges: updatedBadges,
            },
          };
        }),

      addPlaytime: (seconds) =>
        set((s) => ({
          progress: { ...s.progress, totalPlaytime: s.progress.totalPlaytime + seconds },
        })),

      updateSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetProgress: () =>
        set({
          progress: defaultProgress,
          masteredLetters: [],
          masteredLetter: null,
          newStickerUnlocked: null,
        }),
    }),
    { name: 'alphabuddies-store' }
  )
);
