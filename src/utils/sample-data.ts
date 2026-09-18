import { Habit } from '@/types/habit';
import { formatDateKey } from './date-helpers';

/**
 * Generate dates relative to today
 */
function getPastDateKey(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDateKey(d);
}

/**
 * Sample / demo habits preloaded for initial experience
 * Matches the user requirements and reference design
 */
export function getSampleHabits(): Habit[] {
  const today = getPastDateKey(0);
  const yesterday = getPastDateKey(1);
  const day2Ago = getPastDateKey(2);
  const day3Ago = getPastDateKey(3);
  const day4Ago = getPastDateKey(4);
  const day5Ago = getPastDateKey(5);
  const day6Ago = getPastDateKey(6);
  const day7Ago = getPastDateKey(7);

  const nowISO = new Date().toISOString();

  return [
    {
      id: 'habit-1',
      name: 'أذكار الصباح',
      icon: '☀️',
      frequency: 'daily',
      reminderTime: '06:30',
      createdAt: nowISO,
      completions: {
        [today]: true,
        [yesterday]: true,
        [day2Ago]: true,
        [day4Ago]: true,
        [day5Ago]: true,
        [day6Ago]: true,
      },
    },
    {
      id: 'habit-2',
      name: 'أذكار المساء',
      icon: '🌙',
      frequency: 'daily',
      reminderTime: '17:30',
      createdAt: nowISO,
      completions: {
        [today]: true,
        [yesterday]: true,
        [day3Ago]: true,
        [day4Ago]: true,
      },
    },
    {
      id: 'habit-3',
      name: 'قراءة القرآن',
      icon: '📖',
      frequency: 'daily',
      reminderTime: '20:00',
      createdAt: nowISO,
      completions: {
        [today]: true,
        [yesterday]: true,
        [day2Ago]: true,
        [day3Ago]: true,
        [day6Ago]: true,
        [day7Ago]: true,
      },
    },
    {
      id: 'habit-4',
      name: 'الصلاة في وقتها',
      icon: '🕌',
      frequency: 'daily',
      reminderTime: '05:00',
      createdAt: nowISO,
      completions: {
        [today]: true,
        [yesterday]: true,
        [day2Ago]: true,
        [day3Ago]: true,
        [day4Ago]: true,
        [day5Ago]: true,
      },
    },
    {
      id: 'habit-5',
      name: 'شرب ٢ لتر ماء',
      icon: '💧',
      frequency: 'daily',
      reminderTime: '12:00',
      createdAt: nowISO,
      completions: {
        [yesterday]: true,
        [day2Ago]: true,
        [day3Ago]: true,
      },
    },
    {
      id: 'habit-6',
      name: 'الرياضة والنشاط',
      icon: '🏃',
      frequency: 'specific_days',
      selectedDays: [6, 0, 1, 2, 3], // Sat-Wed
      reminderTime: '18:00',
      createdAt: nowISO,
      completions: {
        [yesterday]: true,
        [day3Ago]: true,
        [day5Ago]: true,
      },
    },
    {
      id: 'habit-7',
      name: 'قراءة كتاب نافع',
      icon: '📚',
      frequency: 'daily',
      reminderTime: '21:30',
      createdAt: nowISO,
      completions: {
        [yesterday]: true,
        [day2Ago]: true,
      },
    },
    {
      id: 'habit-8',
      name: 'النوم المبكر',
      icon: '🛌',
      frequency: 'daily',
      reminderTime: '22:30',
      createdAt: nowISO,
      completions: {
        [day2Ago]: true,
        [day3Ago]: true,
      },
    },
  ];
}
