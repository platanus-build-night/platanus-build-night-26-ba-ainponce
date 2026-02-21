import type { AttemptRecord, Level } from '@/types';

/** XP needed to go from level (n-1) to level n */
export function xpForLevel(n: number): number {
  return 100 + (n - 1) * 50;
}

/** Total accumulated XP needed to reach level n */
export function totalXpForLevel(n: number): number {
  let total = 0;
  for (let i = 1; i < n; i++) {
    total += xpForLevel(i + 1);
  }
  return total;
}

/** Given total XP, return the current level (1-based) */
export function calculateLevel(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = xpForLevel(level + 1);
    if (accumulated + needed > totalXp) break;
    accumulated += needed;
    level++;
  }
  return level;
}

/** Progress within the current level */
export function xpProgress(totalXp: number): { current: number; needed: number; fraction: number } {
  const level = calculateLevel(totalXp);
  const accumulatedForLevel = totalXpForLevel(level);
  const current = totalXp - accumulatedForLevel;
  const needed = xpForLevel(level + 1);
  return { current, needed, fraction: Math.min(current / needed, 1) };
}

/** Map level number to difficulty tier */
export function tierForLevel(level: number): Level {
  if (level <= 5) return 'beginner';
  if (level <= 10) return 'intermediate';
  return 'advanced';
}

/** Migration helper: calculate total XP from attempt history */
export function calculateXpFromHistory(history: AttemptRecord[]): number {
  return history.reduce((sum, a) => sum + a.score, 0);
}
