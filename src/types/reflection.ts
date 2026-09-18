export interface MonthlyHabitStat {
  habitId: string;
  habitName: string;
  habitIcon: string;
  totalCompletions: number;
  scheduledDays: number;
  restDays: number;
  completionRate: number;
}

export interface MonthlyReflectionSnapshot {
  monthKey: string; // 'YYYY-MM', e.g. '2026-09'
  monthName: string; // e.g. 'سبتمبر 2026'
  score: number; // 0 - 100
  totalCompletions: number;
  completionRate: number;
  longestStreak: number;
  restDaysCount: number;
  perfectDaysCount: number;
  unlockedBadgesCount: number;
  completedChallengesCount: number;
  habitStats: MonthlyHabitStat[];
  highlights: string[];
  answers?: {
    proudOf?: string;
    needsAttention?: string;
    nextMonthGoal?: string;
  };
  suggestedAction?: {
    habitId: string;
    title: string;
    description: string;
    applied?: boolean;
  };
  completedAt?: string;
}
