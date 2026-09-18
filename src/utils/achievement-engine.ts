import { Habit, Challenge, FailureReasonEntry, Achievement, AchievementStatsSummary } from '@/types/habit';
import { calculateHabitStats, getTodayKey, formatDateKey } from './date-helpers';

export interface AchievementEvaluationContext {
  habits: Habit[];
  challenges?: Challenge[];
  failureReasons?: FailureReasonEntry[];
  calendarVisited?: boolean;
  statsVisited?: boolean;
  unlockedTimestamps?: Record<string, string>;
}

export const BASE_ACHIEVEMENTS: Omit<Achievement, 'currentProgress' | 'unlocked' | 'unlockedAt'>[] = [
  // 1. البداية
  {
    id: 'first-habit',
    title: 'أول خطوة',
    description: 'إكمال أول عادة في مسيرتك.',
    icon: '🌱',
    category: 'البداية',
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'first-perfect-day',
    title: 'البداية',
    description: 'إكمال جميع العادات المجدولة في يوم واحد.',
    icon: '✨',
    category: 'البداية',
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'first-habit-created',
    title: 'صانع العادات',
    description: 'إنشاء وتخصيص 3 عادات في واظب.',
    icon: '📝',
    category: 'البداية',
    requirement: 3,
    rarity: 'common',
  },
  {
    id: 'first-goal',
    title: 'أول هدف',
    description: 'إنجاز عادة ذات هدف أسبوعي أو وقت محدد.',
    icon: '🎯',
    category: 'البداية',
    requirement: 1,
    rarity: 'uncommon',
  },

  // 2. الاستمرارية
  {
    id: 'streak-3',
    title: '3 أيام',
    description: 'الحفاظ على سلسلة استمرارية لـ 3 أيام متتالية.',
    icon: '🔥',
    category: 'الاستمرارية',
    requirement: 3,
    rarity: 'common',
  },
  {
    id: 'streak-7',
    title: '7 أيام',
    description: 'الحفاظ على سلسلة استمرارية لـ 7 أيام متتالية.',
    icon: '🔥🔥',
    category: 'الاستمرارية',
    requirement: 7,
    rarity: 'uncommon',
  },
  {
    id: 'streak-30',
    title: '30 يوم',
    description: 'الحفاظ على سلسلة استمرارية لـ 30 يوماً متتالياً.',
    icon: '🔥🔥🔥',
    category: 'الاستمرارية',
    requirement: 30,
    rarity: 'rare',
  },
  {
    id: 'streak-100',
    title: '100 يوم',
    description: 'الحفاظ على سلسلة استمرارية لـ 100 يوم متتالي.',
    icon: '💎',
    category: 'الاستمرارية',
    requirement: 100,
    rarity: 'epic',
  },
  {
    id: 'streak-365',
    title: 'سنة كاملة',
    description: 'الحفاظ على سلسلة استمرارية لـ 365 يوماً دون انقطاع.',
    icon: '👑',
    category: 'الاستمرارية',
    requirement: 365,
    rarity: 'legendary',
  },

  // 3. الإنجاز
  {
    id: 'completions-10',
    title: '10 إنجازات',
    description: 'تسجيل 10 إنجازات لعاداتك.',
    icon: '⭐',
    category: 'الإنجاز',
    requirement: 10,
    rarity: 'common',
  },
  {
    id: 'completions-50',
    title: '50 إنجاز',
    description: 'تسجيل 50 إنجازاً لعاداتك.',
    icon: '🏅',
    category: 'الإنجاز',
    requirement: 50,
    rarity: 'uncommon',
  },
  {
    id: 'completions-100',
    title: '100 إنجاز',
    description: 'تسجيل 100 إنجاز لعاداتك.',
    icon: '💎',
    category: 'الإنجاز',
    requirement: 100,
    rarity: 'rare',
  },
  {
    id: 'completions-500',
    title: '500 إنجاز',
    description: 'تسجيل 500 إنجاز في سجل عاداتك الأسطوري.',
    icon: '🏆',
    category: 'الإنجاز',
    requirement: 500,
    rarity: 'legendary',
  },

  // 4. الكمال
  {
    id: 'perfect-day-1',
    title: 'يوم كامل',
    description: 'إكمال كل العادات المجدولة في يوم واحد.',
    icon: '💯',
    category: 'الكمال',
    requirement: 1,
    rarity: 'uncommon',
  },
  {
    id: 'perfect-days-3',
    title: '3 أيام كاملة',
    description: 'إكمال جميع العادات المجدولة لـ 3 أيام كاملة.',
    icon: '🌟',
    category: 'الكمال',
    requirement: 3,
    rarity: 'rare',
  },
  {
    id: 'perfect-week',
    title: 'أسبوع كامل',
    description: 'إكمال جميع العادات المجدولة لـ 7 أيام متتالية.',
    icon: '💎',
    category: 'الكمال',
    requirement: 7,
    rarity: 'epic',
  },

  // 5. التحديات
  {
    id: 'first-challenge',
    title: 'أول تحدي',
    description: 'إكمال أول تحدي أسبوعي بنجاح.',
    icon: '🏆',
    category: 'التحديات',
    requirement: 1,
    rarity: 'uncommon',
  },
  {
    id: 'challenges-3',
    title: 'متحدي',
    description: 'إكمال 3 تحديات مختلفة.',
    icon: '⚡',
    category: 'التحديات',
    requirement: 3,
    rarity: 'rare',
  },
  {
    id: 'challenges-10',
    title: 'بطل التحديات',
    description: 'إكمال 10 تحديات أسبوعية واجتيازها.',
    icon: '👑',
    category: 'التحديات',
    requirement: 10,
    rarity: 'legendary',
  },

  // 6. الاستكشاف والأوسمة السرية
  {
    id: 'calendar-explorer',
    title: 'مستكشف التقويم',
    description: 'فتح التقويم واستكشاف سجل ومسار العادات.',
    icon: '🗓️',
    category: 'الاستكشاف',
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'weekly-review',
    title: 'أول مراجعة',
    description: 'الاطلاع على صفحة الإحصائيات وتحليل درجة اليوم.',
    icon: '📊',
    category: 'الاستكشاف',
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'habit-master',
    title: 'إتقان العادات',
    description: 'إدارة ومتابعة 5 عادات نشطة في نفس الوقت.',
    icon: '⚡',
    category: 'الاستكشاف',
    requirement: 5,
    rarity: 'uncommon',
    isSecret: true,
    hint: 'أضف ونظم عدة عادات يومية في آن واحد',
  },
  {
    id: 'night-owl',
    title: 'طائر الليل',
    description: 'إنجاز عادة في ساعات الليل المتأخرة.',
    icon: '🌙',
    category: 'الاستكشاف',
    requirement: 1,
    rarity: 'rare',
    isSecret: true,
    hint: 'أنجز عادة في وقت السكينة والهدوء',
  },
  {
    id: 'early-bird',
    title: 'بداية الفجر',
    description: 'إنجاز عادة في الصباح الباكر مع شروق الشمس.',
    icon: '🌅',
    category: 'الاستكشاف',
    requirement: 1,
    rarity: 'rare',
    isSecret: true,
    hint: 'أنجز عادة مبكراً مع نسمات الصباح',
  },
  {
    id: 'comeback-master',
    title: 'عودة قوية',
    description: 'تسجيل سبب التوقف والعودة للمواظبة بقوة.',
    icon: '🛡️',
    category: 'الاستكشاف',
    requirement: 1,
    rarity: 'epic',
    isSecret: true,
    hint: 'لا تيأس عندما تفوتك عادة، فالاستمرارية عودة',
  },
];

/**
 * Calculate full list of achievements with up-to-date progress and unlock status
 */
export function evaluateAchievements(context: AchievementEvaluationContext): Achievement[] {
  const { habits = [], challenges = [], failureReasons = [], calendarVisited = false, statsVisited = false, unlockedTimestamps = {} } = context;

  // 1. Total completions & max streak & goals
  let totalCompletions = 0;
  let maxStreak = 0;
  let goalCompletions = 0;

  habits.forEach((h) => {
    const stats = calculateHabitStats(h);
    totalCompletions += stats.totalCompletions;
    if (stats.currentStreak > maxStreak) maxStreak = stats.currentStreak;
    if (stats.longestStreak > maxStreak) maxStreak = stats.longestStreak;

    if (h.weeklyTarget || h.reminderTime) {
      goalCompletions += stats.totalCompletions;
    }
  });

  // 2. Count perfect days across past 365 days
  let perfectDaysCount = 0;
  let consecutivePerfectDays = 0;
  let maxConsecutivePerfectDays = 0;

  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = formatDateKey(d);

    if (habits.length > 0) {
      const allDone = habits.every((h) => h.completions[dateKey]);
      if (allDone) {
        perfectDaysCount++;
        consecutivePerfectDays++;
        if (consecutivePerfectDays > maxConsecutivePerfectDays) {
          maxConsecutivePerfectDays = consecutivePerfectDays;
        }
      } else {
        consecutivePerfectDays = 0;
      }
    }
  }

  // 3. Completed challenges count
  const completedChallenges = challenges.filter((c) => c.status === 'completed' || c.isClaimed).length;

  // 4. Failure recovery count
  const hasFailureRecorded = failureReasons.length > 0;
  const hasComeback = hasFailureRecorded && totalCompletions > 0;

  // 5. Time-based achievements (e.g. current completion hour)
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 23 || currentHour < 4;
  const isEarlyMorning = currentHour >= 5 && currentHour <= 7;

  return BASE_ACHIEVEMENTS.map((base) => {
    let progress = 0;

    switch (base.id) {
      case 'first-habit':
        progress = Math.min(base.requirement, totalCompletions);
        break;
      case 'first-perfect-day':
      case 'perfect-day-1':
        progress = Math.min(base.requirement, perfectDaysCount);
        break;
      case 'first-habit-created':
        progress = Math.min(base.requirement, habits.length);
        break;
      case 'first-goal':
        progress = Math.min(base.requirement, goalCompletions > 0 ? 1 : 0);
        break;
      case 'streak-3':
      case 'streak-7':
      case 'streak-30':
      case 'streak-100':
      case 'streak-365':
        progress = Math.min(base.requirement, maxStreak);
        break;
      case 'completions-10':
      case 'completions-50':
      case 'completions-100':
      case 'completions-500':
        progress = Math.min(base.requirement, totalCompletions);
        break;
      case 'perfect-days-3':
        progress = Math.min(base.requirement, perfectDaysCount);
        break;
      case 'perfect-week':
        progress = Math.min(base.requirement, maxConsecutivePerfectDays);
        break;
      case 'first-challenge':
      case 'challenges-3':
      case 'challenges-10':
        progress = Math.min(base.requirement, completedChallenges);
        break;
      case 'calendar-explorer':
        progress = calendarVisited ? 1 : 0;
        break;
      case 'weekly-review':
        progress = statsVisited ? 1 : 0;
        break;
      case 'habit-master':
        progress = Math.min(base.requirement, habits.length);
        break;
      case 'night-owl':
        // If already unlocked historically or triggered now
        progress = unlockedTimestamps[base.id] ? 1 : (isNightTime && totalCompletions > 0 ? 1 : 0);
        break;
      case 'early-bird':
        progress = unlockedTimestamps[base.id] ? 1 : (isEarlyMorning && totalCompletions > 0 ? 1 : 0);
        break;
      case 'comeback-master':
        progress = hasComeback ? 1 : 0;
        break;
      default:
        progress = 0;
    }

    const unlocked = progress >= base.requirement;
    const unlockedAt = unlockedTimestamps[base.id] || (unlocked ? new Date().toISOString() : undefined);

    return {
      ...base,
      currentProgress: progress,
      unlocked,
      unlockedAt,
    };
  });
}

/**
 * Get stats summary for achievements
 */
export function getAchievementStatsSummary(
  achievements: Achievement[],
  featuredIds: string[] = []
): AchievementStatsSummary {
  const totalCount = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  // Find last unlocked achievement sorted by unlockedAt
  const unlockedList = achievements
    .filter((a) => a.unlocked && a.unlockedAt)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());

  const lastUnlocked = unlockedList.length > 0 ? unlockedList[0] : null;

  // Featured badges
  const featuredBadges = achievements.filter((a) => featuredIds.includes(a.id));

  return {
    totalCount,
    unlockedCount,
    percentage,
    lastUnlocked,
    featuredBadges,
  };
}
