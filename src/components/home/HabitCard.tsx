'use client';

import React from 'react';
import { Check, Moon } from 'lucide-react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';
import { calculateHabitStats, formatStreakTextArabic, getTodayKey, getHabitDayStatus } from '@/utils/date-helpers';
import HabitContributionGrid from './HabitContributionGrid';

interface HabitCardProps {
  habit: Habit;
}

export default function HabitCard({ habit }: HabitCardProps) {
  const { toggleHabitCompletion, setSelectedHabit } = useHabits();
  const todayKey = getTodayKey();
  const todayStatus = getHabitDayStatus(habit, todayKey);
  const isCompletedToday = todayStatus === 'COMPLETED';
  const isRestToday = todayStatus === 'REST';
  const stats = calculateHabitStats(habit);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHabitCompletion(habit.id, todayKey);
  };

  const handleOpenDetails = () => {
    setSelectedHabit(habit);
  };

  return (
    <div
      onClick={handleOpenDetails}
      className={`group w-full bg-card border rounded-3xl p-4 sm:p-5 lg:p-6 shadow-soft transition-all duration-200 cursor-pointer active:scale-[0.99] flex flex-col justify-between ${
        isRestToday && !isCompletedToday ? 'border-primary/30 bg-card/90' : 'border-border hover:border-muted-foreground/30'
      }`}
    >
      {/* Top row: Checkbox, Name + Streak, and Icon */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Check Completion Button */}
        <button
          onClick={handleToggle}
          aria-label={isCompletedToday ? 'إلغاء الإنجاز' : isRestToday ? 'راحة اليوم - تسجيل كإنجاز' : 'تسجيل الإنجاز'}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 flex-shrink-0 ${
            isCompletedToday
              ? 'bg-primary text-primary-foreground shadow-soft'
              : isRestToday
              ? 'bg-secondary border border-primary/40 text-primary hover:border-primary'
              : 'bg-card border-2 border-border text-transparent hover:border-muted-foreground'
          }`}
        >
          {isCompletedToday ? (
            <Check className="w-5 h-5 sm:w-6 sm:h-6 opacity-100 scale-100 stroke-[3]" />
          ) : isRestToday ? (
            <Moon className="w-4 h-4 text-primary fill-current opacity-80" />
          ) : (
            <Check className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 scale-75 stroke-[2]" />
          )}
        </button>

        {/* Habit Title & Streak Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground truncate tracking-tight">
              {habit.name}
            </h3>
            {isRestToday && !isCompletedToday && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-border flex items-center gap-0.5">
                <span>🌙</span>
                <span>راحة</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
            <span>
              {formatStreakTextArabic(stats.currentStreak)}
            </span>
            {isRestToday && (
              <span className="text-[10px] text-muted-text">
                • يوم الراحة لا يكسرها
              </span>
            )}
          </p>
        </div>

        {/* Habit Emoji / Icon Badge */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-accent border border-border flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 select-none">
          <span>{habit.icon || '✨'}</span>
        </div>
      </div>

      {/* GitHub-style history grid */}
      <HabitContributionGrid habit={habit} weeksCount={14} />
    </div>
  );
}
