import { easyPuzzles } from './puzzles-easy';
import { easyPuzzles45 } from './puzzles-age4-5';
import { easyPuzzles68 } from './puzzles-age6-8';
import { hardPuzzles911 } from './puzzles-age9-11';
import { hardPuzzles1215 } from './puzzles-age12-15';
import { hardPuzzles1518 } from './puzzles-age15-18';
import { hardPuzzles18Plus } from './puzzles-age18-plus';
import { mediumPuzzles } from './puzzles-medium';
import { hardPuzzles } from './puzzles-hard';
import type { Puzzle, AgeGroup } from '../types';

export const allPuzzles: Puzzle[] = [
  ...easyPuzzles,
  ...easyPuzzles45,
  ...easyPuzzles68,
  ...hardPuzzles911,
  ...hardPuzzles1215,
  ...hardPuzzles1518,
  ...hardPuzzles18Plus,
  ...mediumPuzzles,
  ...hardPuzzles
];

export function getPuzzlesForAgeGroup(ageGroup: AgeGroup): Puzzle[] {
  return allPuzzles.filter(p => p.ageGroup === ageGroup);
}



export const THEMES = [
  'Animals', 'Space', 'Food', 'Beach', 'Christmas', 'Thanksgiving',
  'Muslim Holidays', 'Seasons', 'Geography', 'Colors', 'Science', 'Mythology'
];

export const THEME_ICONS: Record<string, string> = {
  Animals: '🐾', Space: '🚀', Food: '🍓', Beach: '🏖️',
  Christmas: '🎄', Thanksgiving: '🦃', 'Muslim Holidays': '🌙',
  Seasons: '🌈', Geography: '🌍', Colors: '🎨', Science: '🔬', Mythology: '⚡',
};
