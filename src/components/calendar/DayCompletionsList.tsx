'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { parseDateKey, getFormattedGregorianDate, getTodayKey, getHabitDayStatus } from '@/utils/date-helpers';
import { Moon } from 'lucide-react';

export default function DayCompletionsList() {
  const { habits, selectedDate, toggleHabitCompletion } = useHabits();

  const selectedDateObj = parseDateKey(selectedDate);
  const formattedDate = getFormattedGregorianDate(selectedDateObj);
  const isToday = selectedDate === getTodayKey();

  const completedHabits = habits.filter((h) => h.completions[selectedDate]);

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-foreground">
            {isToday ? 'إنجازات اليوم' : `إنجازات ${formattedDate}`}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedHabits.length} من أصل {habits.length} عادات منجزة
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 bg-secondary rounded-xl text-secondary-foreground">
          {habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0}%
        </span>
      </div>

      {/* Habit Items */}
      {habits.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">لا توجد عادات</p>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map((habit) => {
            const status = getHabitDayStatus(habit, selectedDate);
            const isCompleted = status === 'COMPLETED';
            const isRest = status === 'REST';

            return (
              <button
                key={habit.id}
                onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all duration-150 active:scale-[0.99] text-right ${
                  isCompleted
                    ? 'bg-secondary border border-border'
                    : isRest
                    ? 'bg-primary/5 border border-primary/20 hover:border-primary/40'
                    : 'bg-card border border-border/40 hover:border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-lg">
                    {habit.icon}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted
                            ? 'text-foreground'
                            : isRest
                            ? 'text-foreground/90'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {habit.name}
                      </span>
                      {isRest && !isCompleted && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                          <span>🌙</span>
                          <span>راحة</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-text">
                      {isCompleted
                        ? 'تم الإنجاز'
                        : isRest
                        ? 'يوم راحة مخطط — لا يكسر السلسلة'
                        : 'غير مكتمل'}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : isRest
                      ? 'border border-primary/40 text-primary/80 bg-primary/5'
                      : 'border border-border text-transparent'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3] opacity-100" />
                  ) : isRest ? (
                    <Moon className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3] opacity-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
