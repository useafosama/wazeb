'use client';

import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { get7DayScoreTrend } from '@/utils/day-score';

export default function DayScoreTrendChart() {
  const { habits } = useHabits();
  const trend = get7DayScoreTrend(habits);

  const averageScore = Math.round(
    trend.reduce((sum, item) => sum + item.score, 0) / Math.max(1, trend.length)
  );

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            تطور درجة اليوم (آخر ٧ أيام)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            متوسط التزامك هذا الأسبوع: <span className="font-bold text-foreground">{averageScore} / 100</span>
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-40 pt-4 pb-2 px-1">
        {trend.map((day) => {
          const heightPercent = Math.max(day.score, day.score > 0 ? 12 : 4);

          return (
            <div key={day.dateKey} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              {/* Score */}
              <span
                className={`text-[10px] font-bold transition-all ${
                  day.score > 0
                    ? 'text-foreground opacity-100'
                    : 'text-muted-text opacity-0 group-hover:opacity-100'
                }`}
              >
                {day.score}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[32px] h-full flex items-end bg-accent rounded-xl overflow-hidden p-1">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-lg transition-all duration-500 ${
                    day.isToday
                      ? 'bg-primary shadow-soft'
                      : day.score >= 75
                      ? 'bg-success'
                      : day.score >= 50
                      ? 'bg-warning'
                      : 'bg-muted-foreground'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-xs font-bold ${
                  day.isToday ? 'text-foreground font-extrabold' : 'text-muted-foreground'
                }`}
              >
                {day.dayLetter}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
