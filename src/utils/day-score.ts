import { Habit, DayScoreFactors } from '@/types/habit';
import { formatDateKey, getTodayKey, getHabitDayStatus, parseDateKey } from './date-helpers';

/**
 * Calculates Wazeb Day Score for a given date, respecting Rest Days and Unscheduled Days
 */
export function calculateDayScore(habits: Habit[], targetDateKey: string = getTodayKey()): DayScoreFactors {
  if (!habits || habits.length === 0) {
    return {
      completion: 0,
      consistency: 0,
      goals: 0,
      streak: 0,
      total: 0,
      label: 'ابدأ بإضافة أول عادة 🌱',
    };
  }

  const targetDate = parseDateKey(targetDateKey);

  // Check which habits are actively scheduled today (excluding REST and UNSCHEDULED)
  const activeScheduledHabits = habits.filter((h) => {
    const status = getHabitDayStatus(h, targetDate);
    return status !== 'REST' && status !== 'UNSCHEDULED';
  });

  const restingHabitsCount = habits.filter((h) => getHabitDayStatus(h, targetDate) === 'REST').length;

  // If ALL habits are resting today or unscheduled
  if (activeScheduledHabits.length === 0 && habits.length > 0) {
    return {
      completion: 50,
      consistency: 20,
      goals: 20,
      streak: 10,
      total: 100,
      label: restingHabitsCount > 0 ? 'يوم راحة مخطط 🌙' : 'يوم غير مجدول 🍃',
      isAllRestDay: true,
    };
  }

  // 1. Daily Completion (Weight: 50%) - Based on active scheduled habits only
  const completedToday = activeScheduledHabits.filter((h) => h.completions && h.completions[targetDateKey]).length;
  const completionRatio = activeScheduledHabits.length > 0 ? completedToday / activeScheduledHabits.length : 1;
  const completionScore = Math.round(completionRatio * 50);

  // 2. Weekly Consistency (Weight: 20%) - Average completions over past 7 scheduled active days
  let totalCompletionsWeek = 0;
  let totalScheduledSlotsWeek = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(targetDate);
    d.setDate(targetDate.getDate() - i);
    const key = formatDateKey(d);

    habits.forEach((h) => {
      const s = getHabitDayStatus(h, d);
      if (s !== 'REST' && s !== 'UNSCHEDULED') {
        totalScheduledSlotsWeek++;
        if (h.completions && h.completions[key]) {
          totalCompletionsWeek++;
        }
      }
    });
  }

  const consistencyRatio = totalScheduledSlotsWeek > 0 ? totalCompletionsWeek / totalScheduledSlotsWeek : 1;
  const consistencyScore = Math.round(consistencyRatio * 20);

  // 3. Goal Adherence (Weight: 20%)
  let goalComplyCount = 0;
  habits.forEach((h) => {
    const status = getHabitDayStatus(h, targetDate);
    if (status === 'COMPLETED' || status === 'REST' || status === 'UNSCHEDULED') {
      goalComplyCount++;
    } else if (h.frequency === 'weekly_target') {
      goalComplyCount += 0.8;
    }
  });
  const goalRatio = habits.length > 0 ? goalComplyCount / habits.length : 1;
  const goalScore = Math.min(20, Math.round(goalRatio * 20));

  // 4. Streak Score (Weight: 10%)
  let maxStreak = 0;
  habits.forEach((h) => {
    let s = 0;
    let checkDate = new Date(targetDate);
    const st = getHabitDayStatus(h, targetDate);
    if (st !== 'COMPLETED') {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const daySt = getHabitDayStatus(h, checkDate);
      if (daySt === 'COMPLETED') {
        s++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (daySt === 'REST' || daySt === 'UNSCHEDULED') {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    if (s > maxStreak) maxStreak = s;
  });
  const streakScore = Math.min(10, Math.round((maxStreak / 7) * 10));

  const total = Math.min(100, completionScore + consistencyScore + goalScore + streakScore);

  // Encouraging label based on score
  let label = 'لسه اليوم ما خلصش.';
  if (total >= 90) {
    label = 'يوم ممتاز 🔥';
  } else if (total >= 75) {
    label = 'يوم قوي جدًا.';
  } else if (total >= 50) {
    label = 'خطوة كويسة.';
  }

  return {
    completion: completionScore,
    consistency: consistencyScore,
    goals: goalScore,
    streak: streakScore,
    total,
    label,
    isAllRestDay: false,
  };
}

/**
 * Get 7-day score trend history
 */
export function get7DayScoreTrend(habits: Habit[]): {
  dateKey: string;
  dayLetter: string;
  score: number;
  isToday: boolean;
}[] {
  const arabicLetters: Record<number, string> = {
    0: 'ح', 1: 'ن', 2: 'ث', 3: 'ر', 4: 'خ', 5: 'ج', 6: 'س',
  };

  const today = new Date();
  const list = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const factors = calculateDayScore(habits, key);

    list.push({
      dateKey: key,
      dayLetter: arabicLetters[d.getDay()],
      score: factors.total,
      isToday: i === 0,
    });
  }

  return list;
}
