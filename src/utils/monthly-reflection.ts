import { Habit, Challenge, Achievement, MonthlyReflectionSnapshot, MonthlyHabitStat } from '@/types/habit';
import { formatDateKey, parseDateKey, getHabitDayStatus } from './date-helpers';

const ARABIC_MONTH_NAMES = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

/**
 * Format month key YYYY-MM to Arabic name e.g. "سبتمبر 2026"
 */
export function formatMonthNameArabic(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const monthName = ARABIC_MONTH_NAMES[monthIdx] || monthKey;
  return `${monthName} ${year}`;
}

/**
 * Get current month key in YYYY-MM format
 */
export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Generate a complete monthly reflection snapshot from real habit logs
 */
export function generateMonthlyReflection(
  habits: Habit[],
  challenges: Challenge[] = [],
  achievements: Achievement[] = [],
  monthKey: string = getCurrentMonthKey()
): MonthlyReflectionSnapshot {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  // Number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const evaluatedDays = isCurrentMonth ? today.getDate() : daysInMonth;

  let totalMonthCompletions = 0;
  let totalScheduledDaysAllHabits = 0;
  let totalRestDaysAllHabits = 0;
  let perfectDaysCount = 0;

  // 1. Calculate per-habit statistics for this month
  const habitStats: MonthlyHabitStat[] = habits.map((habit) => {
    let habitCompletions = 0;
    let habitScheduled = 0;
    let habitRest = 0;

    for (let day = 1; day <= evaluatedDays; day++) {
      const date = new Date(year, month, day);
      const dateKey = formatDateKey(date);
      const status = getHabitDayStatus(habit, date);

      if (status === 'COMPLETED') {
        habitCompletions++;
        habitScheduled++;
      } else if (status === 'REST') {
        habitRest++;
      } else if (status === 'MISSED') {
        habitScheduled++;
      }
    }

    const rate = habitScheduled > 0 ? Math.round((habitCompletions / habitScheduled) * 100) : 100;

    totalMonthCompletions += habitCompletions;
    totalScheduledDaysAllHabits += habitScheduled;
    totalRestDaysAllHabits += habitRest;

    return {
      habitId: habit.id,
      habitName: habit.name,
      habitIcon: habit.icon,
      totalCompletions: habitCompletions,
      scheduledDays: habitScheduled,
      restDays: habitRest,
      completionRate: rate,
    };
  });

  // 2. Calculate perfect days in this month
  for (let day = 1; day <= evaluatedDays; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);

    if (habits.length > 0) {
      const activeHabitsOnDate = habits.filter((h) => {
        const s = getHabitDayStatus(h, date);
        return s !== 'REST' && s !== 'UNSCHEDULED';
      });

      if (activeHabitsOnDate.length > 0) {
        const allDone = activeHabitsOnDate.every((h) => h.completions && h.completions[dateKey]);
        if (allDone) {
          perfectDaysCount++;
        }
      }
    }
  }

  // 3. Calculate longest streak achieved in this month
  let longestMonthStreak = 0;
  habits.forEach((h) => {
    let currentStreak = 0;
    for (let day = 1; day <= evaluatedDays; day++) {
      const date = new Date(year, month, day);
      const status = getHabitDayStatus(h, date);
      if (status === 'COMPLETED') {
        currentStreak++;
        if (currentStreak > longestMonthStreak) longestMonthStreak = currentStreak;
      } else if (status === 'REST' || status === 'UNSCHEDULED') {
        // Continue streak
      } else {
        currentStreak = 0;
      }
    }
  });

  // 4. Overall completion rate
  const completionRate =
    totalScheduledDaysAllHabits > 0
      ? Math.round((totalMonthCompletions / totalScheduledDaysAllHabits) * 100)
      : 100;

  // 5. Unlocked badges and completed challenges in this month
  const unlockedBadgesCount = achievements.filter((a) => {
    if (!a.unlocked || !a.unlockedAt) return false;
    return a.unlockedAt.startsWith(monthKey);
  }).length;

  const completedChallengesCount = challenges.filter((c) => {
    return c.status === 'completed' || c.isClaimed;
  }).length;

  // 6. Calculate transparent Monthly Score (0 - 100)
  // - Completion Rate (max 50)
  // - Streak stability (max 25)
  // - Perfect days (max 15)
  // - Rest day adherence (max 10)
  const scoreFromCompletion = Math.round((completionRate / 100) * 50);
  const scoreFromStreak = Math.min(25, Math.round((longestMonthStreak / 14) * 25));
  const scoreFromPerfect = Math.min(15, perfectDaysCount * 3);
  const scoreFromRest = Math.min(10, totalRestDaysAllHabits > 0 ? 10 : 5);
  const score = Math.min(100, scoreFromCompletion + scoreFromStreak + scoreFromPerfect + scoreFromRest);

  // 7. Generate real supported highlights
  const highlights: string[] = [];
  if (longestMonthStreak >= 3) {
    highlights.push(`🔥 أطول سلسلة لك هذا الشهر كانت ${longestMonthStreak} أيام متتالية دون انقطاع.`);
  }
  if (perfectDaysCount > 0) {
    highlights.push(`💯 حققت يومًا كاملًا بنسبة 100% لـ ${perfectDaysCount} مرات هذا الشهر.`);
  }
  if (totalRestDaysAllHabits > 0) {
    highlights.push(`🌙 أخذت ${totalRestDaysAllHabits} أيام راحة مخططة للحفاظ على طاقتك واستمراريتك.`);
  }
  if (unlockedBadgesCount > 0) {
    highlights.push(`🏆 حصدت ${unlockedBadgesCount} أوسمة جديدة أضيفت لدولاب إنجازاتك.`);
  }
  if (completionRate >= 80) {
    highlights.push(`✨ حققت نسبة مواظبة ممتازة بلغت ${completionRate}% عبر كافة عاداتك.`);
  } else if (totalMonthCompletions > 0) {
    highlights.push(`🌱 أنجزت ${totalMonthCompletions} تكرارًا للعادات بنجاح وخطوت خطوات واثقة.`);
  }

  // 8. Suggestion for next month
  let suggestedAction;
  const lowestHabit = [...habitStats].sort((a, b) => a.completionRate - b.completionRate)[0];
  if (lowestHabit && lowestHabit.completionRate < 70) {
    suggestedAction = {
      habitId: lowestHabit.habitId,
      title: `تعديل عادة ${lowestHabit.habitName}`,
      description: `لو حسيت إن عادة ${lowestHabit.habitName} صعبة شويه، جرب تقلل الهدف أو تحدد لها يوم راحة إضافي لضمان الاستمرارية.`,
      applied: false,
    };
  }

  return {
    monthKey,
    monthName: formatMonthNameArabic(monthKey),
    score: habits.length === 0 ? 0 : score,
    totalCompletions: totalMonthCompletions,
    completionRate,
    longestStreak: longestMonthStreak,
    restDaysCount: totalRestDaysAllHabits,
    perfectDaysCount,
    unlockedBadgesCount,
    completedChallengesCount,
    habitStats,
    highlights,
    suggestedAction,
  };
}

/**
 * Get available past months list for history overview
 */
export function getAvailableReflectionMonths(habits: Habit[]): { monthKey: string; monthName: string }[] {
  const months: { monthKey: string; monthName: string }[] = [];
  const today = new Date();

  // Show up to the last 6 months
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    months.push({
      monthKey,
      monthName: formatMonthNameArabic(monthKey),
    });
  }

  return months;
}
