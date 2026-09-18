'use client';

import React from 'react';
import { Flame, Trophy, Percent, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { calculateHabitStats, getTodayKey, formatDateKey } from '@/utils/date-helpers';

export default function MetricCards() {
  const { habits } = useHabits();

  // Aggregate stats across all habits
  let maxCurrentStreak = 0;
  let maxLongestStreak = 0;
  let totalCompletionsAllTime = 0;
  let completionsThisWeek = 0;
  let completionsThisMonth = 0;

  const today = new Date();
  const todayKey = getTodayKey();

  // Calculate 7 days ago and start of month
  const past7Days = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    past7Days.add(formatDateKey(d));
  }

  const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  habits.forEach((habit) => {
    const stats = calculateHabitStats(habit);
    if (stats.currentStreak > maxCurrentStreak) maxCurrentStreak = stats.currentStreak;
    if (stats.longestStreak > maxLongestStreak) maxLongestStreak = stats.longestStreak;
    totalCompletionsAllTime += stats.totalCompletions;

    Object.keys(habit.completions).forEach((dateKey) => {
      if (habit.completions[dateKey]) {
        if (past7Days.has(dateKey)) completionsThisWeek++;
        if (dateKey.startsWith(currentYearMonth)) completionsThisMonth++;
      }
    });
  });

  // Overall rate over last 7 days
  const potentialCompletionsWeek = habits.length * 7;
  const weeklyRate = potentialCompletionsWeek > 0 ? Math.round((completionsThisWeek / potentialCompletionsWeek) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Current Streak */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">سلسلتك الحالية</span>
          <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning-foreground flex items-center justify-center">
            <Flame className="w-4 h-4 text-warning" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {maxCurrentStreak}
          </span>
          <span className="text-xs text-muted-foreground font-medium">أيام</span>
        </div>
      </div>

      {/* Longest Streak */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">أطول سلسلة</span>
          <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning-foreground flex items-center justify-center">
            <Trophy className="w-4 h-4 text-warning" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {maxLongestStreak}
          </span>
          <span className="text-xs text-muted-foreground font-medium">أيام</span>
        </div>
      </div>

      {/* Weekly Completion Rate */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">نسبة الإنجاز</span>
          <div className="w-8 h-8 rounded-xl bg-secondary text-foreground flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {weeklyRate}%
          </span>
          <span className="text-xs text-muted-foreground font-medium">هذا الأسبوع</span>
        </div>
      </div>

      {/* Total Lifetime Completions */}
      <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">إجمالي الإنجازات</span>
          <div className="w-8 h-8 rounded-xl bg-success-bg text-success-foreground flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {totalCompletionsAllTime}
          </span>
          <span className="text-xs text-muted-foreground font-medium">مرة</span>
        </div>
      </div>
    </div>
  );
}
