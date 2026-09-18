'use client';

import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { formatDateKey, ARABIC_DAY_LETTERS, calculateHabitStats } from '@/utils/date-helpers';

export default function ActivityCharts() {
  const { habits } = useHabits();

  // Generate 7-day activity data
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysData: { dateKey: string; dayLetter: string; dayNum: number; completedCount: number; isToday: boolean }[] = [];
  
  // Last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    const dayOfWeek = d.getDay();
    
    let count = 0;
    habits.forEach((h) => {
      if (h.completions[key]) count++;
    });

    daysData.push({
      dateKey: key,
      dayLetter: ARABIC_DAY_LETTERS[dayOfWeek],
      dayNum: d.getDate(),
      completedCount: count,
      isToday: i === 0,
    });
  }

  const maxDailyPossible = Math.max(habits.length, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      {/* Weekly Activity Bar Chart */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              نشاط آخر ٧ أيام
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">عدد العادات المنجزة يوميًا</p>
          </div>
        </div>

        {/* Minimal Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-44 pt-4 pb-2 px-1">
          {daysData.map((day) => {
            const heightPercent = Math.max(
              Math.round((day.completedCount / maxDailyPossible) * 100),
              day.completedCount > 0 ? 14 : 4
            );

            return (
              <div key={day.dateKey} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Count Badge */}
                <span
                  className={`text-[10px] font-bold transition-all ${
                    day.completedCount > 0
                      ? 'text-foreground opacity-100'
                      : 'text-muted-text opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {day.completedCount}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[32px] h-full flex items-end bg-accent rounded-xl overflow-hidden p-1">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-500 ${
                      day.isToday
                        ? 'bg-primary shadow-soft'
                        : day.completedCount > 0
                        ? 'bg-muted-foreground'
                        : 'bg-transparent'
                    }`}
                  />
                </div>

                {/* Day Label */}
                <div className="flex flex-col items-center">
                  <span
                    className={`text-xs font-bold ${
                      day.isToday
                        ? 'text-foreground font-extrabold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.dayLetter}
                  </span>
                  <span className="text-[10px] text-muted-text">{day.dayNum}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Breakdown List */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between">
        <h3 className="text-base font-bold text-foreground mb-4">
          أداء العادات (آخر ٣٠ يومًا)
        </h3>

        {habits.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">لا توجد عادات لعرضها</p>
        ) : (
          <div className="flex flex-col gap-3.5 max-h-64 overflow-y-auto pr-1">
            {habits.map((habit) => {
              const stats = calculateHabitStats(habit);
              return (
                <div key={habit.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span>{habit.icon}</span>
                      <span className="font-semibold text-foreground truncate">
                        {habit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-muted-foreground font-medium">{stats.totalCompletions} إنجاز</span>
                      <span className="font-bold text-foreground min-w-[34px] text-left">
                        {stats.completionRate}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stats.completionRate}%` }}
                      className="h-full bg-primary rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
