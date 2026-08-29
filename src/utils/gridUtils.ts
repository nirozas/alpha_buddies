import type { Puzzle, CrosswordCell } from '../types';

export function buildGrid(puzzle: Puzzle): CrosswordCell[][] {
  const size = puzzle.gridSize;
  // init all-black grid
  const grid: CrosswordCell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({
      row: r, col: c, letter: '', isBlack: true, wordIds: [], userInput: '', revealed: false, correct: false,
    }))
  );

  // carve white cells for each word
  for (const word of puzzle.words) {
    for (let i = 0; i < word.answer.length; i++) {
      const r = word.direction === 'across' ? word.row : word.row + i;
      const c = word.direction === 'across' ? word.col + i : word.col;
      if (r < size && c < size) {
        const cell = grid[r][c];
        cell.isBlack = false;
        cell.letter = word.answer[i];
        cell.wordIds.push(word.id);
        if (i === 0 && !cell.number) cell.number = word.number;
      }
    }
  }
  return grid;
}

export function getCellKey(row: number, col: number) {
  return `${row}-${col}`;
}

export function isWordComplete(
  wordId: string,
  puzzle: Puzzle,
  cellStates: Record<string, { userInput: string; revealed: boolean }>
): boolean {
  const word = puzzle.words.find(w => w.id === wordId);
  if (!word) return false;
  for (let i = 0; i < word.answer.length; i++) {
    const r = word.direction === 'across' ? word.row : word.row + i;
    const c = word.direction === 'across' ? word.col + i : word.col;
    const state = cellStates[getCellKey(r, c)];
    const val = state?.revealed ? word.answer[i] : state?.userInput ?? '';
    if (val.toUpperCase() !== word.answer[i]) return false;
  }
  return true;
}
