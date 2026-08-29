import type { AgeGroup } from '../types';

export const AGE_THEMES: Record<AgeGroup, { cls: string; label: string; emoji: string; font: string }> = {
  '4-5':  { cls: 'theme-tiny',    label: 'Tiny Tots',    emoji: '🌈', font: 'Fredoka One' },
  '6-8':  { cls: 'theme-junior',  label: 'Junior',       emoji: '🌿', font: 'Baloo 2' },
  '9-11':  { cls: 'theme-explorer',label: 'Explorer',     emoji: '🧭', font: 'Nunito' },
  '12-15':{ cls: 'theme-cosmos',  label: 'Cosmos',       emoji: '🚀', font: 'Nunito' },
  '15-18':{ cls: 'theme-scholar', label: 'Scholar',      emoji: '📚', font: 'Nunito' },
  '18+':  { cls: 'theme-master',  label: 'Master',       emoji: '🎓', font: 'Nunito' },
};

export const CATEGORY_GRADIENTS: Record<string, string> = {
  Animals:         'from-green-400 to-emerald-600',
  Space:           'from-indigo-500 to-purple-700',
  Food:            'from-orange-400 to-red-500',
  Beach:           'from-cyan-400 to-blue-500',
  Christmas:       'from-red-500 to-green-600',
  Thanksgiving:    'from-amber-500 to-orange-700',
  'Muslim Holidays':'from-teal-500 to-emerald-700',
  Seasons:         'from-yellow-400 to-orange-500',
  Geography:       'from-blue-500 to-indigo-600',
  Colors:          'from-pink-400 to-violet-600',
  Science:         'from-sky-400 to-blue-600',
  Mythology:       'from-amber-600 to-yellow-400',
};
