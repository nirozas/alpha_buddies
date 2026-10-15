import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChildProgress, AppSettings, Sticker } from '../types';
import { STICKERS_CATALOG } from '../constants/stickers';
import { BADGES_CATALOG } from '../constants/badges';
import { LETTER_ACTIVITIES, NUMBER_ACTIVITIES } from '../constants/activities';

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
  stickerAwardedGames: {},
};

const defaultSettings: AppSettings = {
  volume: 0.7,
  musicVolume: 0.4,
  parentPin: null,
  childName: 'Explorer',
  reducedMotion: false,
};

// Module-level timestamp to guarantee at most one sticker is granted per play
// and prevent rapid back-to-back alias calls within the same game completion.
let lastStickerAwardedTimestamp = 0;

export function normalizeActivityName(act: string): string {
  if (act === 'color-the-letter') return 'colour-the-letter';
  if (act.startsWith('find-in-paragraph')) return 'find-in-paragraph';
  if (act.startsWith('trace-draw')) return 'trace-draw';
  if (act.startsWith('magic-trace')) return 'magic-trace';
  if (act.startsWith('say-it-out-loud')) return 'say-it-out-loud';
  if (act.startsWith('what-starts-with')) return 'what-starts-with';
  if (act.startsWith('memory-letters')) return 'memory-letters';
  if (act.startsWith('letter-sounds')) return 'letter-sounds';
  if (act.startsWith('number-sounds')) return 'number-sounds';
  return act;
}

export function getCanonicalGameKey(key: string): string {
  if (!key) return 'global:activity';
  const parts = key.split('-');
  if (parts.length >= 2) {
    const first = parts[0].toUpperCase();
    const last = parts[parts.length - 1].toUpperCase();
    if (first.length === 1 && first >= 'A' && first <= 'Z') {
      const act = parts.slice(1).join('-');
      return `${first}:${normalizeActivityName(act)}`;
    } else if (last.length === 1 && last >= 'A' && last <= 'Z') {
      const act = parts.slice(0, -1).join('-');
      return `${last}:${normalizeActivityName(act)}`;
    } else if (/^\d+$/.test(parts[0])) {
      const act = parts.slice(1).join('-');
      return `num_${parts[0]}:${normalizeActivityName(act)}`;
    } else if (/^\d+$/.test(parts[parts.length - 1])) {
      const act = parts.slice(0, -1).join('-');
      return `num_${parts[parts.length - 1]}:${normalizeActivityName(act)}`;
    }
  }
  const underscoreParts = key.split('_');
  if (underscoreParts.length >= 3 && underscoreParts[0] === 'build' && underscoreParts[1] === 'letter') {
    return `${underscoreParts[2].toUpperCase()}:build-a-letter`;
  }
  return `global:${normalizeActivityName(key)}`;
}

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
  streakDays: number = 1,
  activitiesCompleted: Record<string, number> = {},
  totalPlaytimeSeconds: number = 0,
  perfectScores: number = 0
): string[] {
  const totalStars = calculateDistinctStars(starsEarned);
  const lettersCount = Object.keys(lettersCompleted).length;
  const numbersCount = Object.keys(numbersCompleted).length;
  const totalPlays = Object.values(activitiesCompleted || {}).reduce((sum, n) => sum + (n || 0), 0);

  // Games count per letter and per number
  const letterGamesMap: Record<string, Set<string>> = {};
  const letterStarsMap: Record<string, number> = {};
  const numberGamesMap: Record<number, Set<string>> = {};
  const numberStarsMap: Record<number, number> = {};
  const allGames = new Set<string>();

  for (const [k, v] of Object.entries(starsEarned)) {
    if (!v || v <= 0) continue;
    const parts = k.split('-');
    if (parts.length >= 2) {
      const first = parts[0].toUpperCase();
      const last = parts[parts.length - 1].toUpperCase();
      const numFirst = parseInt(parts[0], 10);
      const numLast = parseInt(parts[parts.length - 1], 10);

      if (first.length === 1 && first >= 'A' && first <= 'Z') {
        const act = parts.slice(1).join('-');
        if (!letterGamesMap[first]) letterGamesMap[first] = new Set();
        letterGamesMap[first].add(act);
        letterStarsMap[first] = (letterStarsMap[first] || 0) + v;
        allGames.add(act);
      } else if (last.length === 1 && last >= 'A' && last <= 'Z') {
        const act = parts.slice(0, -1).join('-');
        if (!letterGamesMap[last]) letterGamesMap[last] = new Set();
        letterGamesMap[last].add(act);
        letterStarsMap[last] = (letterStarsMap[last] || 0) + v;
        allGames.add(act);
      } else if (!isNaN(numFirst) && numFirst >= 0 && numFirst <= 10) {
        const act = parts.slice(1).join('-');
        if (!numberGamesMap[numFirst]) numberGamesMap[numFirst] = new Set();
        numberGamesMap[numFirst].add(act);
        numberStarsMap[numFirst] = (numberStarsMap[numFirst] || 0) + v;
        allGames.add(act);
      } else if (!isNaN(numLast) && numLast >= 0 && numLast <= 10) {
        const act = parts.slice(0, -1).join('-');
        if (!numberGamesMap[numLast]) numberGamesMap[numLast] = new Set();
        numberGamesMap[numLast].add(act);
        numberStarsMap[numLast] = (numberStarsMap[numLast] || 0) + v;
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

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 1: BRONZE (STARTER DISCOVERIES) ─────────────────────
  // ══════════════════════════════════════════════════════════════
  if (allGames.size >= 1 || totalPlays >= 1) unlocked.add('first-game');
  if (lettersCount >= 1) unlocked.add('first-letter');
  if (numbersCount >= 1) unlocked.add('first-number');
  if (Object.values(starsEarned).some((v) => v === 3)) unlocked.add('first-gold-star');
  if (totalStars >= 3) unlocked.add('stars-3');
  if (totalStars >= 5) unlocked.add('stars-5');
  if (totalStars >= 5 || lettersCount >= 2 || totalPlays >= 2) unlocked.add('buddy-favorite');
  if (totalPlaytimeSeconds >= 300 || totalPlays >= 3) unlocked.add('time-5m');
  if (totalPlays >= 2 || totalStars >= 3 || lettersCount >= 1) unlocked.add('mystic-mochi-seal');
  if (totalPlays >= 4 || totalStars >= 5 || numbersCount >= 1) unlocked.add('mystic-honey-bee');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 2: BRONZE (NOVICE EXPLORATIONS) ─────────────────────
  // ══════════════════════════════════════════════════════════════
  if (allGames.size >= 5 || totalPlays >= 5) unlocked.add('games-5');
  if (['A', 'E', 'I', 'O', 'U'].filter((v) => lettersCompleted[v]).length >= 2 || lettersCount >= 4) {
    unlocked.add('letters-vowels');
  }
  if ([2, 4, 6, 8, 10].some((n) => numbersCompleted[n]) && numbersCount >= 2) {
    unlocked.add('numbers-even');
  }
  if ([1, 3, 5, 7, 9].some((n) => numbersCompleted[n]) && numbersCount >= 2) {
    unlocked.add('numbers-odd');
  }
  if (perfectScores >= 5 || totalStars >= 15) unlocked.add('perfect-5');
  if (totalPlaytimeSeconds >= 900 || totalPlays >= 8) unlocked.add('time-15m');
  if (totalStars >= 8 || lettersCount >= 2 || totalPlays >= 5) unlocked.add('crystal-pegasus');
  if (totalStars >= 10 || numbersCount >= 2 || totalPlays >= 6) unlocked.add('glitter-axolotl');
  if (allGames.size >= 3 || totalStars >= 12 || totalPlays >= 7) unlocked.add('bubble-turtle');
  if (totalStars >= 14 || lettersCount >= 3 || totalPlays >= 8) unlocked.add('stardust-hamster');
  if (lettersCount >= 3 || totalStars >= 15 || totalPlays >= 9) unlocked.add('sunflower-sprout');
  if (numbersCount >= 3 || totalStars >= 16 || totalPlays >= 10) unlocked.add('berry-dragon');
  if (totalPlays >= 7 || totalStars >= 12 || lettersCount >= 2) unlocked.add('mystic-cotton-bunny');
  if (totalPlays >= 10 || totalStars >= 14 || numbersCount >= 2) unlocked.add('mystic-glitter-hedgehog');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 3: SILVER (EARLY EXPLORERS) ─────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (lettersCount >= 5) unlocked.add('letters-5');
  if (numbersCount >= 5) unlocked.add('numbers-5');
  if (totalStars >= 10) unlocked.add('star-10');
  if (streakDays >= 3) unlocked.add('streak-3');
  if (totalPlaytimeSeconds >= 1800 || totalPlays >= 16) unlocked.add('time-30m');
  if (allGames.size >= 15 || totalPlays >= 15) unlocked.add('games-15');
  if (lettersCount >= 4 || allGames.size >= 4 || totalPlays >= 12) unlocked.add('letter-artist');
  if (totalStars >= 18 || lettersCount >= 6 || totalPlays >= 15) unlocked.add('cosmic-koala');
  if (totalStars >= 22 || numbersCount >= 4 || totalPlays >= 18) unlocked.add('cloud-sheep');
  if (allGames.size >= 4 || totalStars >= 24 || totalPlays >= 19) unlocked.add('glimmer-panda');
  if (totalPlays >= 13 || totalStars >= 20 || lettersCount >= 4) unlocked.add('mystic-star-llama');
  if (totalPlays >= 17 || totalStars >= 22 || numbersCount >= 4) unlocked.add('mystic-marshmallow-yeti');

  // Letter Explorer Stickers (3+ games for Letter A-Z)
  for (let c = 65; c <= 90; c++) {
    const l = String.fromCharCode(c);
    const count = letterGamesMap[l]?.size || 0;
    const stars = letterStarsMap[l] || 0;
    if (count >= 3 || stars >= 6) {
      unlocked.add(`letter-${l.toLowerCase()}-3games`);
    }
  }

  // Number Explorer Stickers (3+ games for Number 0-10)
  for (let n = 0; n <= 10; n++) {
    const count = numberGamesMap[n]?.size || 0;
    const stars = numberStarsMap[n] || 0;
    if (count >= 3 || stars >= 6) {
      unlocked.add(`number-${n}-3games`);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 4: SILVER (MIDWAY HEROES) ───────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (lettersCount >= 10) unlocked.add('letters-10');
  if (lettersCount >= 13) unlocked.add('letters-halfway');
  if (totalStars >= 20) unlocked.add('star-20');
  if (lettersCount >= 7 || allGames.size >= 7 || totalPlays >= 20) unlocked.add('letter-detective');
  if (perfectScores >= 10 || totalStars >= 30) unlocked.add('perfect-10');
  if (totalPlaytimeSeconds >= 2700 || totalPlays >= 25) unlocked.add('time-45m');
  if (allGames.size >= 20 || totalPlays >= 20) unlocked.add('games-20');
  if (streakDays >= 2 || totalStars >= 26 || totalPlays >= 22) unlocked.add('aurora-penguin');
  if (lettersCount >= 8 || totalStars >= 28 || totalPlays >= 24) unlocked.add('ember-cheetah');
  if (totalStars >= 30 || maxGamesForLetter >= 2 || totalPlays >= 26) unlocked.add('gem-otter');
  if (totalPlays >= 21 || totalStars >= 28 || lettersCount >= 6) unlocked.add('mystic-cupcake-raccoon');
  if (totalPlays >= 25 || totalStars >= 30 || numbersCount >= 5) unlocked.add('mystic-lotus-deer');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 5: GOLD (CHAMPION ACHIEVERS) ────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (totalStars >= 30) unlocked.add('star-30');
  if (numbersCount >= 8 || totalStars >= 35) unlocked.add('numbers-counting-champ');
  if (numbersCount >= 10) unlocked.add('numbers-all');
  if (streakDays >= 5 || totalPlays >= 28) unlocked.add('streak-5');
  if (totalPlaytimeSeconds >= 3600 || totalPlays >= 35) unlocked.add('time-60m');
  if (totalPlays >= 30) unlocked.add('games-30');
  if (totalStars >= 35 || lettersCount >= 12 || totalPlays >= 32) unlocked.add('prism-chameleon');
  if (totalStars >= 38 || numbersCount >= 6 || totalPlays >= 34) unlocked.add('sugar-bat');
  if (lettersCount >= 12 || totalStars >= 40 || totalPlays >= 36) unlocked.add('blossom-deer');
  if (totalPlays >= 29 || totalStars >= 36 || lettersCount >= 8) unlocked.add('mystic-comet-corgi');
  if (totalPlays >= 33 || totalStars >= 40 || streakDays >= 3) unlocked.add('mystic-aurora-fox');
  if (totalPlays >= 37 || totalStars >= 44 || numbersCount >= 7) unlocked.add('mystic-jelly-octopus');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 6: GOLD (SWIFT PROFICIENCY) ─────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (lettersCount >= 18) unlocked.add('letters-speedy');
  if (lettersCount >= 20) unlocked.add('letters-20');
  if (totalStars >= 50) unlocked.add('star-50');
  if (perfectScores >= 25 || totalStars >= 60) unlocked.add('perfect-25');
  if (totalPlaytimeSeconds >= 5400 || totalPlays >= 50) unlocked.add('time-90m');
  if (streakDays >= 4 || totalStars >= 50 || totalPlays >= 42) unlocked.add('lightning-fox');
  if (totalStars >= 55 || allGames.size >= 6 || totalPlays >= 46) unlocked.add('celestial-whale');
  if (totalStars >= 58 || lettersCount >= 16 || totalPlays >= 48) unlocked.add('lunar-moth');
  if (totalPlays >= 41 || totalStars >= 52 || lettersCount >= 11) unlocked.add('mystic-sun-chinchilla');
  if (totalPlays >= 45 || totalStars >= 56 || maxGamesForLetter >= 2) unlocked.add('mystic-bamboo-red-panda');
  if (totalPlays >= 49 || totalStars >= 60 || lettersCount >= 13) unlocked.add('mystic-crystal-firefly');

  // Letter Crown Master Stickers (all games / 24+ stars for Letter A-Z)
  for (let c = 65; c <= 90; c++) {
    const l = String.fromCharCode(c);
    const count = letterGamesMap[l]?.size || 0;
    const stars = letterStarsMap[l] || 0;
    if (count >= LETTER_ACTIVITIES.length || stars >= 24) {
      unlocked.add(`letter-${l.toLowerCase()}-all`);
    }
  }

  // Number Crown Master Stickers (all games / 15+ stars for Number 0-10)
  for (let n = 0; n <= 10; n++) {
    const count = numberGamesMap[n]?.size || 0;
    const stars = numberStarsMap[n] || 0;
    if (count >= NUMBER_ACTIVITIES.length || stars >= 15) {
      unlocked.add(`number-${n}-all`);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 7: DIAMOND (SCHOLASTIC MASTERS) ─────────────────────
  // ══════════════════════════════════════════════════════════════
  if (totalStars >= 65 || perfectScores >= 15) unlocked.add('mastery-scholar');
  if (totalPlays >= 50) unlocked.add('games-50');
  if (totalPlaytimeSeconds >= 7200 || totalPlays >= 65) unlocked.add('time-120m');
  if (totalStars >= 65 || numbersCount >= 8 || totalPlays >= 54) unlocked.add('firefly-frog');
  if (lettersCount >= 18 || totalStars >= 68 || totalPlays >= 56) unlocked.add('nebula-cat');
  if (totalStars >= 70 || streakDays >= 5 || totalPlays >= 58) unlocked.add('golden-scarab');
  if (totalPlays >= 53 || totalStars >= 70 || numbersCount >= 8) unlocked.add('mystic-peppermint-penguin');
  if (totalPlays >= 57 || totalStars >= 74 || lettersCount >= 15) unlocked.add('mystic-sugar-squirrel');
  if (totalPlays >= 61 || totalStars >= 78 || allGames.size >= 8) unlocked.add('mystic-bubble-platypus');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 8: DIAMOND (GRAND GUARDIANS) ────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (totalStars >= 100) unlocked.add('star-100');
  if (totalStars >= 80 || lettersCount >= 22 || totalPlays >= 68) unlocked.add('frost-wolf');
  if (numbersCount >= 10 || totalStars >= 85 || totalPlays >= 72) unlocked.add('tidal-narwhal');
  if (totalStars >= 90 || allGames.size >= 8 || totalPlays >= 75) unlocked.add('candy-bear');
  if (totalPlays >= 65 || totalStars >= 85 || streakDays >= 4) unlocked.add('mystic-nebula-sloth');
  if (totalPlays >= 70 || totalStars >= 92 || lettersCount >= 18) unlocked.add('mystic-starlight-pegacorn');
  if (totalPlays >= 75 || totalStars >= 98 || numbersCount >= 9) unlocked.add('mystic-diamond-dragonfly');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 9: MYTHIC (ASTRAL HEROES) ───────────────────────────
  // ══════════════════════════════════════════════════════════════
  if (totalStars >= 110 || perfectScores >= 30) unlocked.add('mastery-grandmaster');
  if (totalPlaytimeSeconds >= 10800 || totalPlays >= 80) unlocked.add('time-180m');
  if (totalStars >= 105 || lettersCount >= 24 || totalPlays >= 82) unlocked.add('phoenix-hatchling');
  if (totalStars >= 110 || (lettersCount >= 20 && numbersCount >= 8) || totalPlays >= 85) unlocked.add('coral-seahorse');
  if (totalPlays >= 80 || totalStars >= 110 || lettersCount >= 21) unlocked.add('mystic-spark-hamster');
  if (totalPlays >= 85 || totalStars >= 120 || streakDays >= 5) unlocked.add('mystic-twilight-panther');
  if (totalPlays >= 92 || totalStars >= 130 || lettersCount >= 24) unlocked.add('mystic-galaxy-phoenix');

  // ══════════════════════════════════════════════════════════════
  // ── LEVEL 10: MYTHIC (SUPREME LEGENDARIES) ────────────────────
  // ══════════════════════════════════════════════════════════════
  if (lettersCount >= 26) unlocked.add('letters-all');
  if (totalStars >= 125 || (lettersCount >= 26 && numbersCount >= 10) || totalPlays >= 95) unlocked.add('time-dragon');
  if (totalStars >= 135 || streakDays >= 7 || totalPlays >= 100) unlocked.add('rainbow-serpent');
  if (totalStars >= 145 || maxGamesForLetter >= 3 || totalPlays >= 105) unlocked.add('diamond-golem');
  if (totalStars >= 160 || (lettersCount >= 26 && numbersCount >= 10 && totalStars >= 100) || totalPlays >= 115) {
    unlocked.add('astral-lion');
  }
  if (totalPlays >= 120 || totalStars >= 175 || (lettersCount >= 26 && numbersCount >= 10)) {
    unlocked.add('mystic-infinity-dragon');
  }

  // Return strictly in STICKERS_CATALOG order to ensure clean milestone progression from easy to hard
  return STICKERS_CATALOG.map((st) => st.id).filter((id) => unlocked.has(id));
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
          const totalStars = calculateDistinctStars(s.progress.starsEarned);
          const badges = checkUnlockedBadges(
            {
              ...s.progress,
              lettersCompleted,
            },
            totalStars
          );

          return {
            progress: {
              ...s.progress,
              lettersCompleted,
              badges,
            },
          };
        });
      },

      markNumberComplete: (digit) =>
        set((s) => {
          const numbersCompleted = { ...s.progress.numbersCompleted, [digit]: true };
          const totalStars = calculateDistinctStars(s.progress.starsEarned);
          const badges = checkUnlockedBadges(
            {
              ...s.progress,
              numbersCompleted,
            },
            totalStars
          );

          return {
            progress: {
              ...s.progress,
              numbersCompleted,
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
          const unlockedIds = checkUnlockedStickers(
            allStars,
            lettersCompleted,
            numbersCompleted,
            streakDays,
            s.progress.activitiesCompleted,
            s.progress.totalPlaytime || 0,
            perfectScores
          );
          const currentStickers = s.progress.stickers || [];

          // Single-sticker-per-play gatekeeper:
          // 1. One play = one game on one letter/number.
          // 2. Multiple rapid alias calls (e.g. within 3.5s) cannot award duplicate stickers.
          // 3. If a sticker modal is currently pending, wait until it is processed.
          // 4. If this game on this letter has already awarded a sticker, do not award several stickers for the same game.
          const canonicalGameKey = getCanonicalGameKey(key);
          const alreadyAwardedForThisGame = Boolean(s.progress.stickerAwardedGames?.[canonicalGameKey]);
          const recentlyAwardedSticker = Date.now() - lastStickerAwardedTimestamp < 3500;
          const hasPendingStickerModal = s.newStickerUnlocked !== null;

          let newlyUnlocked: Sticker | null = null;
          let updatedStickers = currentStickers;
          const updatedStickerAwardedGames = { ...(s.progress.stickerAwardedGames || {}) };

          if (!recentlyAwardedSticker && !hasPendingStickerModal && !alreadyAwardedForThisGame) {
            const nextEligibleId = unlockedIds.find((id) => !currentStickers.includes(id));
            if (nextEligibleId) {
              const candidate = STICKERS_CATALOG.find((st) => st.id === nextEligibleId) || null;
              if (candidate) {
                lastStickerAwardedTimestamp = Date.now();
                newlyUnlocked = candidate;
                // Strictly award ONLY ONE sticker
                updatedStickers = [...currentStickers, candidate.id];
                updatedStickerAwardedGames[canonicalGameKey] = true;
              }
            }
          }

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
              stickers: updatedStickers,
              badges: updatedBadges,
              dailyStars,
              perfectScores,
              streakDays,
              lastPlayDate: today,
              stickerAwardedGames: updatedStickerAwardedGames,
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

      resetProgress: () => {
        lastStickerAwardedTimestamp = 0;
        set({
          progress: defaultProgress,
          masteredLetters: [],
          masteredLetter: null,
          newStickerUnlocked: null,
        });
      },
    }),
    { name: 'alphabuddies-store' }
  )
);
