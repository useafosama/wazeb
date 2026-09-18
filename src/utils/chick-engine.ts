import { Habit, ChickCosmeticItem, ChickCosmeticId, ChickStats, ChickAchievement } from '@/types/habit';
import { getTodayKey, calculateHabitStats, formatDateKey } from './date-helpers';

export const CHICK_COSMETICS: ChickCosmeticItem[] = [
  { id: 'none', name: 'طبيعي', icon: '🐣', unlockLevel: 1, description: 'الكتكوت بشكله اللطيف المعتاد' },
  { id: 'bow', name: 'فيونكة وردية', icon: '🎀', unlockLevel: 2, description: 'فيونكة ناعمة وأنيقة' },
  { id: 'flowers', name: 'أطواق الورد', icon: '🌸', unlockLevel: 4, description: 'تاج من الزهور الربيعية' },
  { id: 'cap', name: 'كاب المغامر', icon: '🧢', unlockLevel: 6, description: 'كاب أزرق للأيام النشيطة' },
  { id: 'glasses', name: 'نظارة الشطارة', icon: '🕶️', unlockLevel: 8, description: 'نظارة سوداء للمواظبة الذكية' },
  { id: 'backpack', name: 'شنطة الإنجازات', icon: '🎒', unlockLevel: 12, description: 'حقيبة لجمع كل العادات' },
  { id: 'sparkles', name: 'هالة البريق', icon: '⭐', unlockLevel: 15, description: 'نجوم تلمع حول الكتكوت' },
  { id: 'crown', name: 'تاج أشطر كتكوت', icon: '👑', unlockLevel: 20, description: 'تاج ذهبي لملوك الاستمرارية' },
  { id: 'wings', name: 'أجنحة أسطورية', icon: '🪽', unlockLevel: 30, description: 'أجنحة ذهبية للكتكوت الأسطوري' },
];

/**
 * Calculate Level, Rank and XP requirements
 */
export function calculateChickLevel(totalXP: number): {
  level: number;
  rankTitle: string;
  currentLevelXP: number;
  nextLevelXP: number;
} {
  // Level threshold curve: base 100 XP per level with gentle scaling
  let level = 1;
  let requiredXP = 100;
  let accumulatedXP = 0;

  while (totalXP >= accumulatedXP + requiredXP) {
    accumulatedXP += requiredXP;
    level++;
    requiredXP = Math.round(100 * Math.pow(1.15, level - 1));
  }

  const currentLevelXP = totalXP - accumulatedXP;
  const nextLevelXP = requiredXP;

  let rankTitle = '🐣 كتكوت جديد';
  if (level >= 50) {
    rankTitle = '🪽 كتكوت أسطوري';
  } else if (level >= 25) {
    rankTitle = '👑 أشطر كتكوت';
  } else if (level >= 10) {
    rankTitle = '⭐ كتكوت شاطر';
  } else if (level >= 5) {
    rankTitle = '🌱 كتكوت بيتعلم';
  } else if (level >= 2) {
    rankTitle = '✨ كتكوت مجتهد';
  }

  return {
    level,
    rankTitle,
    currentLevelXP,
    nextLevelXP,
  };
}

/**
 * Calculate overall user XP based on historical completions
 */
export function calculateInitialXP(habits: Habit[]): number {
  if (!habits || habits.length === 0) return 50;

  let xp = 50; // Welcome starter bonus
  const today = new Date();

  // +10 XP per completion
  habits.forEach((h) => {
    const completionsCount = Object.keys(h.completions).filter((k) => h.completions[k]).length;
    xp += completionsCount * 10;
  });

  // +100 XP for every active 7-day streak
  habits.forEach((h) => {
    const stats = calculateHabitStats(h);
    if (stats.currentStreak >= 7) {
      xp += 100;
    }
  });

  return xp;
}

/**
 * Contextual friendly quotes from the Chick
 */
export function getChickContextualQuote(completedCount: number, totalCount: number): string {
  if (totalCount === 0) {
    return 'يلا نبدأ نضيف أول عادة؟ 🐣';
  }

  if (completedCount === 0) {
    return 'يلا نبدأ بحاجة صغيرة النهارده؟ 🐣💛';
  }

  const percentage = Math.round((completedCount / totalCount) * 100);

  if (percentage === 100) {
    return 'كده أنت أشطر كتكوت النهارده! 👑🐣🎉';
  } else if (percentage >= 90 || totalCount - completedCount === 1) {
    return 'باقي واحدة بس ونبقى خلصنا كل حاجة! 🐣✨';
  } else if (percentage >= 75) {
    return 'إحنا قربنا نوصل! خطوة كمان! 👀💛';
  } else if (percentage >= 50) {
    return 'نص الطريق خلص! كمل يا بطل! 🔥🐣';
  } else if (completedCount === 1) {
    return 'أول واحدة في الجيب! 💛 كمل!';
  } else {
    return 'ماشي بخطوات ممتازة، كمل يومك! 🐣🌱';
  }
}

/**
 * Fun secret quotes when user clicks the Chick multiple times
 */
export const CHICK_EASTER_EGG_QUOTES = [
  'إنت بتدوس عليا ليه؟ 😂💛',
  'أنا شايف الـ streak بتاعك ده ومبسوط بيك! 👀🔥',
  'عادة واحدة ونطير سوا! 🪽✨',
  'جاهز نبقى أشطر كتكوت في الدنيا؟ 🐣👑',
  'زغزغة! 😂 يلا نروح نخلص عادة كمان!',
];

/**
 * Calculate Chick achievements
 */
export function calculateChickAchievements(habits: Habit[]): ChickAchievement[] {
  let totalCompletions = 0;
  let maxStreak = 0;

  habits.forEach((h) => {
    const stats = calculateHabitStats(h);
    totalCompletions += stats.totalCompletions;
    if (stats.currentStreak > maxStreak) maxStreak = stats.currentStreak;
  });

  const todayKey = getTodayKey();
  const allTodayDone = habits.length > 0 && habits.every((h) => h.completions[todayKey]);

  return [
    {
      id: 'first-habit',
      title: 'أول خطوة',
      description: 'إنجاز أول عادة في رحلتك',
      icon: '🐣',
      isUnlocked: totalCompletions >= 1,
      progress: Math.min(1, totalCompletions),
      maxProgress: 1,
    },
    {
      id: 'streak-7',
      title: 'سلسلة 7 أيام',
      description: 'الحفاظ على سلسلة استمرارية لـ 7 أيام',
      icon: '🔥',
      isUnlocked: maxStreak >= 7,
      progress: Math.min(7, maxStreak),
      maxProgress: 7,
    },
    {
      id: 'completions-30',
      title: '30 إنجاز',
      description: 'تسجيل 30 إنجاز في سجل عاداتك',
      icon: '⭐',
      isUnlocked: totalCompletions >= 30,
      progress: Math.min(30, totalCompletions),
      maxProgress: 30,
    },
    {
      id: 'perfect-day',
      title: 'يوم كامل 100%',
      description: 'إكمال جميع عادات اليوم بنجاح',
      icon: '👑',
      isUnlocked: allTodayDone,
      progress: allTodayDone ? 1 : 0,
      maxProgress: 1,
    },
    {
      id: 'completions-100',
      title: '100 إنجاز أسطوري',
      description: 'بلوغ 100 إنجاز في مسيرة الكتكوت',
      icon: '💎',
      isUnlocked: totalCompletions >= 100,
      progress: Math.min(100, totalCompletions),
      maxProgress: 100,
    },
  ];
}
