export type Language = 'en' | 'pt' | 'es';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  phrase: string;
  phonetic: string;
  difficulty: Level;
  category: string;
  tips: string;
  language: Language;
}

export interface WordAnalysis {
  target: string;
  spoken: string | null;
  score: number;
  issue: string;
  tip: string;
}

export interface ScoringResult {
  score: number;
  overallFeedback: string;
  wordAnalysis: WordAnalysis[];
  encouragement: string;
  focusArea: string;
}

export interface AttemptRecord {
  id: string;
  exerciseId: string;
  language: Language;
  level: Level;
  targetPhrase: string;
  userTranscription: string;
  score: number;
  timestamp: number;
}

export interface UserProgress {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  history: AttemptRecord[];
  streakDays: number;
  lastPracticeDate: string | null;
  xp: number;
  level: number;
}

export interface LevelUpEvent {
  previousLevel: number;
  newLevel: number;
  previousTier: Level | null;
  newTier: Level | null;
}

export interface SaveAttemptResult {
  progress: UserProgress;
  levelUp: LevelUpEvent | null;
}

export interface ScoringRequest {
  targetPhrase: string;
  userTranscription: string;
  language: Language;
  level: Level;
}

export interface AppSettings {
  language: Language;
  level: Level;
  topic: string;
  apiKey: string;
}

export interface GeneratedPhrase {
  phrase: string;
  phonetic: string;
  tips: string;
  context: string;
}

export interface ConversationContext {
  topic: string;
  previousPhrases: string[];
  weakAreas: string[];
  lastScore: number | null;
}

export type AppView = 'onboarding' | 'practice';
export type OrbState = 'idle' | 'listening' | 'processing' | 'score';
export type ModalState = 'none' | 'feedback' | 'progress' | 'settings' | 'shortcuts';
