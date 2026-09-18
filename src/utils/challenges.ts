import { Habit, Challenge } from '@/types/habit';
import { formatDateKey, getTodayKey, calculateHabitStats } from './date-helpers';

/**
 * Derives dynamic challenges tailored to user habits
 */
export function generateOrUpdateChallenges(habits: Habit[], existingChallenges: Challenge[] = []): Challenge[] {
  if (!habits || habits.length === 0) return [];

  const todayKey = getTodayKey();
  const today = new Date();

  // Find habit with highest active streak or first habit
  let leadHabit = habits[0];
  let maxStreak = 0;
  habits.forEach((h) => {
    const stats = calculateHabitStats(h);
    if (stats.currentStreak > maxStreak) {
      maxStreak = stats.currentStreak;
      leadHabit = h;
    }
  });

  // Calculate 100% days over last 3 days
  let perfectDaysCount = 0;
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const isPerfect = habits.every((h) => h.completions[key]);
    if (isPerfect) perfectDaysCount++;
  }

  // Calculate weekly target progress for a physical/active habit
  const physicalHabit = habits.find((h) => h.icon === '🏃' || h.icon === '💧' || h.name.includes('رياضة')) || habits[1] || habits[0];
  let weeklyPhysicalCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    if (physicalHabit.completions[key]) weeklyPhysicalCount++;
  }

  const defaultTemplates: Challenge[] = [
    {
      id: 'challenge-streak-7',
      title: 'تحدي 7 أيام من الاستمرارية',
      description: `واظب على «${leadHabit.name}» لمدة 7 أيام متتالية لبناء عادة راسخة.`,
      icon: leadHabit.icon || '🔥',
      type: 'streak',
      target: 7,
      currentProgress: Math.min(7, calculateHabitStats(leadHabit).currentStreak),
      startDate: formatDateKey(new Date(today.getTime() - 7 * 86400000)),
      endDate: formatDateKey(new Date(today.getTime() + 7 * 86400000)),
      relatedHabitIds: [leadHabit.id],
      status: calculateHabitStats(leadHabit).currentStreak >= 7 ? 'completed' : 'active',
      rewardBadge: '🏅 بطل الاستمرارية',
    },
    {
      id: 'challenge-perfect-3',
      title: 'تحدي الـ 100% لثلاثة أيام',
      description: 'أكمل جميع عاداتك اليومية دون استثناء لمدة 3 أيام.',
      icon: '✨',
      type: 'perfect_days',
      target: 3,
      currentProgress: perfectDaysCount,
      startDate: formatDateKey(new Date(today.getTime() - 3 * 86400000)),
      endDate: formatDateKey(new Date(today.getTime() + 4 * 86400000)),
      status: perfectDaysCount >= 3 ? 'completed' : 'active',
      rewardBadge: '🌟 الإنجاز الكامل',
    },
    {
      id: 'challenge-active-week',
      title: 'تحدي النشاط الأسبوعي',
      description: `أنجز «${physicalHabit.name}» 3 مرات خلال هذا الأسبوع.`,
      icon: physicalHabit.icon || '🏃',
      type: 'weekly_target',
      target: 3,
      currentProgress: Math.min(3, weeklyPhysicalCount),
      startDate: formatDateKey(new Date(today.getTime() - 7 * 86400000)),
      endDate: formatDateKey(new Date(today.getTime() + 3 * 86400000)),
      relatedHabitIds: [physicalHabit.id],
      status: weeklyPhysicalCount >= 3 ? 'completed' : 'active',
      rewardBadge: '⚡ طاقة متجددة',
    },
  ];

  // Merge with existing state so claimed badges remain claimed
  return defaultTemplates.map((tpl) => {
    const existing = existingChallenges.find((c) => c.id === tpl.id);
    if (existing && existing.isClaimed) {
      return { ...tpl, isClaimed: true };
    }
    return tpl;
  });
}
