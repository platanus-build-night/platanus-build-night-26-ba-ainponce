import type { AttemptRecord, UserProgress, AppSettings, GeneratedPhrase } from '@/types';

const STORAGE_KEY = 'pronounce-app-progress';
const SETTINGS_KEY = 'pronounce-app-settings';
const PHRASE_KEY = 'pronounce-app-current-phrase';

function getDefaultProgress(): UserProgress {
  return {
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    history: [],
    streakDays: 0,
    lastPracticeDate: null,
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return getDefaultProgress();
  }
}

export function saveAttempt(attempt: AttemptRecord): UserProgress {
  const progress = getProgress();
  progress.history.unshift(attempt);
  progress.totalAttempts += 1;

  const totalScore = progress.history.reduce((sum, a) => sum + a.score, 0);
  progress.averageScore = Math.round(totalScore / progress.history.length);

  if (attempt.score > progress.bestScore) {
    progress.bestScore = attempt.score;
  }

  const today = new Date().toISOString().split('T')[0];
  if (progress.lastPracticeDate) {
    const lastDate = new Date(progress.lastPracticeDate);
    const diff = Math.floor(
      (new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      progress.streakDays += 1;
    } else if (diff > 1) {
      progress.streakDays = 1;
    }
  } else {
    progress.streakDays = 1;
  }
  progress.lastPracticeDate = today;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getSettings(): AppSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppSettings;
  } catch {
    return null;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SETTINGS_KEY);
}

export function getCurrentPhrase(): GeneratedPhrase | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PHRASE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedPhrase;
  } catch {
    return null;
  }
}

export function saveCurrentPhrase(phrase: GeneratedPhrase): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PHRASE_KEY, JSON.stringify(phrase));
}

export function clearCurrentPhrase(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PHRASE_KEY);
}

export function hasCompletedOnboarding(): boolean {
  return getSettings() !== null;
}
