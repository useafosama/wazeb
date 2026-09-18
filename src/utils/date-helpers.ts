import { Habit, HabitStats, StartOfWeek, WeekDay } from '@/types/habit';

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets today's key formatted as YYYY-MM-DD
 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

/**
 * Parse YYYY-MM-DD string to local Date object
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Returns formatted Gregorian Date in Arabic
 * Example: 19 سبتمبر 2026 م
 */
export function getFormattedGregorianDate(date: Date = new Date(), lang: 'ar' | 'en' = 'ar'): string {
  if (lang === 'en') {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const day = date.getDate();
  const monthsAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  const month = monthsAr[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year} م`;
}

/**
 * Returns formatted Hijri Date in Arabic
 * Example: السبت، ٨ ربيع الآخر ١٤٤٨ هـ
 */
export function getFormattedHijriDate(date: Date = new Date(), lang: 'ar' | 'en' = 'ar'): string {
  try {
    const weekdayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(date);
    
    // Use islamic-umalqura calendar formatter
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    
    const formatted = hijriFormatter.format(date);
    if (lang === 'en') {
      const weekdayEn = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
      return `${weekdayEn}, ${formatted} AH`;
    }
    return `${weekdayName}، ${formatted} هـ`;
  } catch (e) {
    // Fallback if Intl calendar fails
    const weekdayName = new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(date);
    return `${weekdayName}`;
  }
}

/**
 * Convert numbers to Arabic numerals or standard
 */
export function toArabicNumerals(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

/**
 * Returns Arabic day single-letter abbreviations
 * Sunday=ح, Monday=ن, Tuesday=ث, Wednesday=ر, Thursday=خ, Friday=ج, Saturday=س
 */
export const ARABIC_DAY_LETTERS: Record<number, string> = {
  0: 'ح', // الأحد (Sunday)
  1: 'ن', // الاثنين (Monday)
  2: 'ث', // الثلاثاء (Tuesday)
  3: 'ر', // الأربعاء (Wednesday)
  4: 'خ', // الخميس (Thursday)
  5: 'ج', // الجمعة (Friday)
  6: 'س', // السبت (Saturday)
};

export const ARABIC_DAY_NAMES: Record<number, string> = {
  0: 'الأحد',
  1: 'الاثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

/**
 * Order days according to StartOfWeek preference
 */
export function getOrderedWeekDays(startOfWeek: StartOfWeek = 6): WeekDay[] {
  if (startOfWeek === 6) {
    return [6, 0, 1, 2, 3, 4, 5]; // Saturday to Friday
  } else if (startOfWeek === 0) {
    return [0, 1, 2, 3, 4, 5, 6]; // Sunday to Saturday
  } else {
    return [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday
  }
}

/**
 * Determines the status of a habit on a given date (COMPLETED | MISSED | REST | UNSCHEDULED)
 */
export function getHabitDayStatus(habit: Habit, dateInput: Date | string): 'COMPLETED' | 'MISSED' | 'REST' | 'UNSCHEDULED' {
  const date = typeof dateInput === 'string' ? parseDateKey(dateInput) : dateInput;
  const dateKey = typeof dateInput === 'string' ? dateInput : formatDateKey(dateInput);
  const dayOfWeek = date.getDay() as WeekDay;

  // 1. Completed
  if (habit.completions && habit.completions[dateKey]) {
    return 'COMPLETED';
  }

  // 2. Rest Day (weekly scheduled rest day or one-off rest date)
  if (
    (habit.restDates && habit.restDates.includes(dateKey)) ||
    (habit.restDays && habit.restDays.includes(dayOfWeek))
  ) {
    return 'REST';
  }

  // 3. Unscheduled Day (for specific_days frequency)
  if (habit.frequency === 'specific_days' && habit.selectedDays && !habit.selectedDays.includes(dayOfWeek)) {
    return 'UNSCHEDULED';
  }

  // 4. Default: Missed (for past/today scheduled days)
  return 'MISSED';
}

/**
 * Calculates current streak and longest streak for a single habit, with full Rest Day and Unscheduled Day support
 */
export function calculateHabitStats(habit: Habit): HabitStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);
  const todayStatus = getHabitDayStatus(habit, today);
  const completedToday = todayStatus === 'COMPLETED';

  let currentStreak = 0;
  let checkDate = new Date(today);
  
  // If today is not completed yet, but today is REST or UNSCHEDULED or still pending today:
  // Check from yesterday to see if active streak carries over
  if (!completedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards for current streak
  // REST and UNSCHEDULED days do NOT break streak!
  let consecutiveRestDays = 0;
  while (true) {
    const status = getHabitDayStatus(habit, checkDate);
    if (status === 'COMPLETED') {
      currentStreak++;
      consecutiveRestDays = 0;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (status === 'REST' || status === 'UNSCHEDULED') {
      // Neutral bridge: keep streak alive without counting as a completion
      consecutiveRestDays++;
      // Stop infinite back-check if checking before habit creation
      const habitCreated = new Date(habit.createdAt || '2020-01-01');
      if (checkDate.getTime() < habitCreated.getTime() - 7 * 86400000 || consecutiveRestDays > 60) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // MISSED: Streak ends
      break;
    }
  }

  // Calculate longest streak, total completions, and rest days count
  const completionDates = Object.keys(habit.completions || {})
    .filter((k) => habit.completions[k])
    .sort();

  const totalCompletions = completionDates.length;

  // Calculate stats over the last 30 days (or since creation)
  const created = new Date(habit.createdAt || Date.now());
  const now = new Date();
  const diffDays = Math.max(1, Math.round((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const daysToCount = Math.min(diffDays, 30);

  let scheduledActiveDays = 0;
  let completionsInPeriod = 0;
  let restDaysInPeriod = 0;

  for (let i = 0; i < daysToCount; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const status = getHabitDayStatus(habit, d);
    
    if (status === 'COMPLETED') {
      completionsInPeriod++;
      scheduledActiveDays++;
    } else if (status === 'REST') {
      restDaysInPeriod++;
    } else if (status === 'MISSED') {
      scheduledActiveDays++;
    }
  }

  const completionRate = scheduledActiveDays > 0 ? Math.round((completionsInPeriod / scheduledActiveDays) * 100) : 100;
  const longestStreak = Math.max(currentStreak, totalCompletions > 0 ? currentStreak : 0);

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionRate,
    completedToday,
    restDaysCount: restDaysInPeriod,
    scheduledDaysCount: scheduledActiveDays,
  };
}

/**
 * Format streak wording in Arabic
 */
export function formatStreakTextArabic(streak: number): string {
  if (streak === 0) return 'ابدأ اليوم';
  if (streak === 1) return 'سلسلة يوم';
  if (streak === 2) return 'سلسلة يومين متتالية';
  if (streak >= 3 && streak <= 10) return `سلسلة ${streak} أيام`;
  return `سلسلة ${streak} يومًا`;
}

/**
 * Generates matrix of dates for GitHub-style mini grid
 * Returns array of columns (weeks), each containing 7 day slots
 */
export function generateContributionGrid(
  habit: Habit,
  weeksCount: number = 14,
  startOfWeek: StartOfWeek = 6
): {
  dateKey: string;
  isCompleted: boolean;
  isToday: boolean;
  isFuture: boolean;
  isRest: boolean;
  status: 'COMPLETED' | 'MISSED' | 'REST' | 'UNSCHEDULED';
  dayOfWeek: number;
}[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = formatDateKey(today);
  const todayDay = today.getDay(); // 0-6

  const orderedDays = getOrderedWeekDays(startOfWeek);
  
  // Find index of today in orderedDays
  const todayIndexInWeek = orderedDays.indexOf(todayDay as WeekDay);

  // Total days to display = (weeksCount - 1) * 7 + (todayIndexInWeek + 1)
  const totalDays = weeksCount * 7;
  
  // Calculate start date: End of the current week column corresponds to the last day of week or today
  const gridEndDate = new Date(today);
  const daysUntilEndOfWeek = 6 - todayIndexInWeek;
  gridEndDate.setDate(today.getDate() + daysUntilEndOfWeek);

  const gridStartDate = new Date(gridEndDate);
  gridStartDate.setDate(gridEndDate.getDate() - totalDays + 1);

  const weeks: {
    dateKey: string;
    isCompleted: boolean;
    isToday: boolean;
    isFuture: boolean;
    isRest: boolean;
    status: 'COMPLETED' | 'MISSED' | 'REST' | 'UNSCHEDULED';
    dayOfWeek: number;
  }[][] = [];
  let currentWeek: {
    dateKey: string;
    isCompleted: boolean;
    isToday: boolean;
    isFuture: boolean;
    isRest: boolean;
    status: 'COMPLETED' | 'MISSED' | 'REST' | 'UNSCHEDULED';
    dayOfWeek: number;
  }[] = [];

  const runner = new Date(gridStartDate);
  for (let i = 0; i < totalDays; i++) {
    const key = formatDateKey(runner);
    const isToday = key === todayKey;
    const isFuture = runner.getTime() > today.getTime();
    const dayOfWeek = runner.getDay();
    const status = getHabitDayStatus(habit, runner);
    const isCompleted = status === 'COMPLETED';
    const isRest = status === 'REST';

    currentWeek.push({
      dateKey: key,
      isCompleted,
      isToday,
      isFuture,
      isRest,
      status,
      dayOfWeek,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    runner.setDate(runner.getDate() + 1);
  }

  return weeks;
}

/**
 * Returns overall habits progress for today
 */
export function getDailyProgress(habits: Habit[]): {
  total: number;
  completed: number;
  percentage: number;
  longestCurrentStreak: number;
} {
  if (habits.length === 0) {
    return { total: 0, completed: 0, percentage: 0, longestCurrentStreak: 0 };
  }

  const todayKey = getTodayKey();
  let completedCount = 0;
  let maxStreak = 0;

  for (const habit of habits) {
    const stats = calculateHabitStats(habit);
    if (habit.completions[todayKey]) {
      completedCount++;
    }
    if (stats.currentStreak > maxStreak) {
      maxStreak = stats.currentStreak;
    }
  }

  const percentage = Math.round((completedCount / habits.length) * 100);

  return {
    total: habits.length,
    completed: completedCount,
    percentage,
    longestCurrentStreak: maxStreak,
  };
}
