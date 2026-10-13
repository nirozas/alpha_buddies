/**
 * Standard performance-based scoring for all games
 * 0 mistakes = 3 stars (Perfect ⭐⭐⭐)
 * 1-2 mistakes = 2 stars (Great Job ⭐⭐)
 * 3+ mistakes = 1 star (Good Effort ⭐)
 */
export function calculateStars(mistakes: number): 1 | 2 | 3 {
  if (mistakes <= 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

export function getStarLabel(stars: 1 | 2 | 3): string {
  if (stars === 3) return 'Perfect! ⭐⭐⭐';
  if (stars === 2) return 'Great Job! ⭐⭐';
  return 'Good Effort! ⭐';
}
