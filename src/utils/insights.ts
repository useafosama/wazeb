import { Habit, FailureReasonEntry, HabitInsight } from '@/types/habit';
import { formatDateKey, getTodayKey, calculateHabitStats } from './date-helpers';

/**
 * Friendly label for failure reasons
 */
export const FAILURE_REASONS_LABELS: Record<string, string> = {
  wrong_time: 'الوقت مش مناسب',
  too_hard: 'العادة صعبة',
  forgot: 'بنسى باستمرار',
  no_time: 'مش عندي وقت كافي',
  low_motivation: 'مش محفز كفاية اليوم',
  other: 'سبب آخر',
};

/**
 * Analyzes habits and recorded failure reasons to generate supportive insights
 */
export function generateHabitInsights(
  habits: Habit[],
  failureReasons: FailureReasonEntry[] = []
): HabitInsight[] {
  if (!habits || habits.length === 0) return [];

  const insights: HabitInsight[] = [];
  const today = new Date();

  habits.forEach((habit) => {
    const stats = calculateHabitStats(habit);
    const habitFailures = failureReasons.filter((f) => f.habitId === habit.id);

    // 1. If user repeatedly gave "wrong_time" reason
    const wrongTimeCount = habitFailures.filter((f) => f.reason === 'wrong_time').length;
    if (wrongTimeCount >= 1 && habit.reminderTime) {
      insights.push({
        id: `insight-time-${habit.id}`,
        type: 'missed_pattern',
        habitId: habit.id,
        title: `تعديل موعد «${habit.name}»`,
        description: `لاحظنا أن الوقت الحالي (${habit.reminderTime}) قد لا يكون مناسباً لجدولك.`,
        suggestedAction: {
          type: 'change_time',
          label: 'تغيير موعد التذكير إلى 08:30 م',
          value: '20:30',
        },
        createdAt: new Date().toISOString(),
      });
    }

    // 2. If completion rate is low (< 50%) and frequency is daily, suggest simplifying to 3 days a week
    if (stats.completionRate < 50 && habit.frequency === 'daily') {
      insights.push({
        id: `insight-freq-${habit.id}`,
        type: 'frequency_suggestion',
        habitId: habit.id,
        title: `تخفيف الالتزام في «${habit.name}»`,
        description: `البداية بخطوات أسهل تضمن الاستمرارية وتمنع الانقطاع.`,
        suggestedAction: {
          type: 'change_frequency',
          label: 'تعديل التكرار إلى 3 أيام في الأسبوع',
          value: 'weekly_target',
        },
        createdAt: new Date().toISOString(),
      });
    }
  });

  // Global insight if user is on an active streak
  const bestHabit = habits.reduce((prev, curr) =>
    calculateHabitStats(curr).currentStreak > calculateHabitStats(prev).currentStreak ? curr : prev
  );
  const bestStats = calculateHabitStats(bestHabit);

  if (bestStats.currentStreak >= 3) {
    insights.push({
      id: `insight-streak-praise`,
      type: 'best_time',
      title: 'إيقاع رائع في الاستمرارية! 🔥',
      description: `أنت ملتزم بـ «${bestHabit.name}» منذ ${bestStats.currentStreak} أيام. الحفاظ على عادة واحدة يمهد لنجاح باقي العادات.`,
      createdAt: new Date().toISOString(),
    });
  }

  return insights;
}
