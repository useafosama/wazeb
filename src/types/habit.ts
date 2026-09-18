export type HabitFrequency = 'daily' | 'specific_days' | 'weekly_target';

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

export type DayHabitStatus = 'COMPLETED' | 'MISSED' | 'REST' | 'UNSCHEDULED';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: HabitFrequency;
  selectedDays?: WeekDay[]; // e.g. [0, 1, 2, 3, 4] for Sun-Thu
  weeklyTarget?: number; // e.g. 3 times a week
  reminderTime?: string; // e.g. "08:00"
  color?: string;
  createdAt: string; // ISO string
  completions: Record<string, boolean>; // 'YYYY-MM-DD': true
  restDays?: WeekDay[]; // e.g. [4, 5] for Thursday, Friday
  restDates?: string[]; // e.g. ['2026-09-20'] for one-time rest dates
}

export type ThemeMode = 'dark' | 'light' | 'system';
export type StartOfWeek = 6 | 0 | 1; // 6: Saturday (السبت), 0: Sunday (الأحد), 1: Monday (الاثنين)
export type Language = 'ar' | 'en';

export interface NotificationSettings {
  enabled: boolean;
  habitReminders: boolean;
  progressAlerts: boolean;
  streakAlerts: boolean;
  challengeAlerts: boolean;
  recoveryAlerts: boolean;
  smartTimeSuggestions: boolean;
}

export interface UserSettings {
  theme: ThemeMode;
  startOfWeek: StartOfWeek;
  notificationsEnabled: boolean;
  notificationTime?: string;
  notificationSettings?: NotificationSettings;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  reducedMotion?: boolean;
  isChickMode?: boolean;
  chickXP?: number;
  chickLevel?: number;
  chickUnlockedCosmetics?: string[];
  chickEquippedCosmetic?: string;
  language: Language;
  featuredAchievements?: string[];
  unlockedAchievementTimestamps?: Record<string, string>;
}

export * from './achievement';
export * from './reflection';

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0 - 100 percentage
  completedToday: boolean;
  restDaysCount?: number;
  scheduledDaysCount?: number;
}

// 1. Failure Insights Types ("ليه وقعت؟")
export type FailureReasonType =
  | 'wrong_time'
  | 'too_hard'
  | 'forgot'
  | 'no_time'
  | 'low_motivation'
  | 'other';

export interface FailureReasonEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  reason: FailureReasonType;
  customNote?: string;
  createdAt: string;
}

export interface HabitInsightAction {
  type: 'change_time' | 'reduce_target' | 'change_frequency';
  label: string;
  value: any;
}

export interface HabitInsight {
  id: string;
  type: 'missed_pattern' | 'best_time' | 'frequency_suggestion';
  habitId?: string;
  title: string;
  description: string;
  suggestedAction?: HabitInsightAction;
  createdAt: string;
  isDismissed?: boolean;
}

// 2. Automatic Challenges Types
export type ChallengeStatus = 'active' | 'completed' | 'failed' | 'expired';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'weekly_target' | 'perfect_days' | 'total_count';
  target: number;
  currentProgress: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  relatedHabitIds?: string[];
  status: ChallengeStatus;
  rewardBadge: string;
  isClaimed?: boolean;
}

// 5. Day Score Types (درجة يومك / درجة شطارتك)
export interface DayScoreFactors {
  completion: number; // Max 50
  consistency: number; // Max 20
  goals: number; // Max 20
  streak: number; // Max 10
  total: number; // 0 - 100
  label: string;
  isAllRestDay?: boolean;
}

// 🐣 وضع أشطر كتكوت (Chick Mode Types)
export type ChickMood =
  | 'idle'
  | 'happy'
  | 'celebrating'
  | 'sleeping'
  | 'thinking'
  | 'excited'
  | 'sad-but-friendly'
  | 'level-up';

export type ChickCosmeticId =
  | 'none'
  | 'bow'
  | 'crown'
  | 'glasses'
  | 'backpack'
  | 'cap'
  | 'flowers'
  | 'wings'
  | 'sparkles';

export interface ChickCosmeticItem {
  id: ChickCosmeticId;
  name: string;
  icon: string;
  unlockLevel: number;
  description: string;
}

export interface ChickStats {
  xp: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  rankTitle: string;
  equippedCosmetic: ChickCosmeticId;
  unlockedCosmetics: ChickCosmeticId[];
}

export interface ChickAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
}
