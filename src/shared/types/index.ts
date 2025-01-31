import {Moment} from 'moment';

export enum Routes {
  splash = 'splash',
  login = 'login',
  home = 'home',
}

export type ColorVariant = 'primary' | 'secondary' | 'info';

export type Size = 'sm' | 'md' | 'lg' | 'xl';

export enum ReactionType {
  SAD = 1,
  NEUTRAL = 2,
  HAPPY = 3,
}

export interface ReactionInfo {
  type: ReactionType;
  name: string;
  icon: string;
}

export interface InsightMetric {
  id: number;
  value: number;
  label: string;
  icon: React.ReactElement<any, any> | null;
  bgClass: string;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: Date;
  settings: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface MoodEntry {
  id: string;
  mood: ReactionType;
  score: number;
  note?: string;
  timestamp: Date;
}

export interface StoreState {
  // User Profile
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUserSettings: (settings: Partial<UserProfile['settings']>) => void;

  // Mood Entries
  moodEntries: MoodEntry[];
  setMoodEntries: (entries: MoodEntry[]) => void;
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  deleteMoodEntry: (id: string) => void;
  getMoodEntriesForDateRange: (startDate: Moment, endDate: Moment) => MoodEntry[];

  // App State
  theme: ThemeMode;
  lastSyncTimestamp: Date | null;
  setTheme: (theme: ThemeMode) => void;
  resetState: () => void;
}

export type DivPeriod = 'daily' | 'weekly' | 'monthly';

export interface MoodTrendData {
  date: Date;
  score: number;
}

export enum AppEventType {
  MOOD_SYNC = 'MOOD_SYNC',
  ERROR_OCCURRED = 'ERROR_OCCURRED',
}

export type AppEventMap = {
  [AppEventType.MOOD_SYNC]: (payload: {
    timestamp: Date;
    success: boolean;
    entries?: number;
  }) => void;
  [AppEventType.ERROR_OCCURRED]: (payload: {error: Error; context: string}) => void;
};

export type EventPayload<T extends AppEventType> = Parameters<AppEventMap[T]>[0];

export type ThemeMode = 'light' | 'dark' | 'system';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ErrorResponse {
  status: number;
  statusText: string;
  data: any;
  error?: Error;
  internal: boolean;
}

export interface MoodTrendAnalysis {
  message: string;
  trend: 'improving' | 'declining' | 'stable' | 'variable';
  severity: 'positive' | 'neutral' | 'concern';
  fluctuationRate: number;
}
