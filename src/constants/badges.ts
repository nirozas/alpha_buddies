export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  category: 'mastery' | 'streak' | 'stars' | 'games';
}

export const BADGES_CATALOG: Badge[] = [
  {
    id: 'first-star',
    title: 'First Star',
    description: 'Earn your very first star in any activity!',
    icon: '⭐',
    imageUrl: '/badges/badge_first_star.svg',
    category: 'stars',
  },
  {
    id: 'perfect-score',
    title: 'Flawless Victory',
    description: 'Earn 3 stars with zero mistakes in any game!',
    icon: '🎯',
    imageUrl: '/badges/badge_perfect_score.svg',
    category: 'mastery',
  },
  {
    id: 'triple-perfect',
    title: 'Perfectionist',
    description: 'Earn 3 perfect 3-star scores across any games!',
    icon: '💎',
    imageUrl: '/badges/badge_triple_perfect.svg',
    category: 'mastery',
  },
  {
    id: 'streak-3',
    title: '3-Day Fire Streak',
    description: 'Play learn-and-play activities 3 days in a row!',
    icon: '🔥',
    imageUrl: '/badges/badge_streak_3.svg',
    category: 'streak',
  },
  {
    id: 'streak-7',
    title: 'Weekly Warrior',
    description: 'Play 7 days in a row - unstoppable momentum!',
    icon: '⚡',
    imageUrl: '/badges/badge_streak_7.svg',
    category: 'streak',
  },
  {
    id: 'letters-5',
    title: 'Letter Cadet',
    description: 'Master 5 letters of the alphabet!',
    icon: '🔤',
    imageUrl: '/badges/badge_letters_5.svg',
    category: 'mastery',
  },
  {
    id: 'letters-15',
    title: 'Letter Champion',
    description: 'Master 15 letters of the alphabet!',
    icon: '🦁',
    imageUrl: '/badges/badge_letters_15.svg',
    category: 'mastery',
  },
  {
    id: 'letters-all',
    title: 'Alphabet King / Queen',
    description: 'Master all 26 letters of the alphabet!',
    icon: '👑',
    imageUrl: '/badges/badge_letters_all.svg',
    category: 'mastery',
  },
  {
    id: 'numbers-5',
    title: 'Counting Star',
    description: 'Master 5 numbers!',
    icon: '🔢',
    imageUrl: '/badges/badge_numbers_5.svg',
    category: 'mastery',
  },
  {
    id: 'numbers-all',
    title: 'Math Explorer',
    description: 'Master all numbers from 0 to 10!',
    icon: '🚀',
    imageUrl: '/badges/badge_numbers_all.svg',
    category: 'mastery',
  },
  {
    id: 'games-explorer',
    title: 'Game Explorer',
    description: 'Play 5 different learning games!',
    icon: '🎮',
    imageUrl: '/badges/badge_games_explorer.svg',
    category: 'games',
  },
  {
    id: 'stars-50',
    title: 'Golden Starlight',
    description: 'Collect 50 stars total across all activities!',
    icon: '✨',
    imageUrl: '/badges/badge_stars_50.svg',
    category: 'stars',
  },
  {
    id: 'stars-100',
    title: 'Centurion Legend',
    description: 'Collect 100 stars total - true learning superstar!',
    icon: '🏆',
    imageUrl: '/badges/badge_stars_100.svg',
    category: 'stars',
  },
];

export interface PlayerAvatar {
  id: string;
  emoji: string;
  name: string;
  bgColor: string;
}

export const AVATARS_CATALOG: PlayerAvatar[] = [
  { id: 'lion', emoji: '🦁', name: 'Leo Lion', bgColor: 'bg-amber-400' },
  { id: 'bear', emoji: '🐻', name: 'Buddy Bear', bgColor: 'bg-orange-400' },
  { id: 'astronaut', emoji: '🚀', name: 'Astro Kid', bgColor: 'bg-blue-400' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle Unicorn', bgColor: 'bg-pink-400' },
  { id: 'fox', emoji: '🦊', name: 'Rusty Fox', bgColor: 'bg-rose-400' },
  { id: 'panda', emoji: '🐼', name: 'Pip Panda', bgColor: 'bg-emerald-400' },
  { id: 'dino', emoji: '🦖', name: 'Rex Dino', bgColor: 'bg-green-400' },
  { id: 'kitty', emoji: '🐱', name: 'Milo Kitty', bgColor: 'bg-purple-400' },
];
