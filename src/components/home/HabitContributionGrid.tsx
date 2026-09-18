'use client';

import React from 'react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';
import { generateContributionGrid, ARABIC_DAY_LETTERS, getOrderedWeekDays } from '@/utils/date-helpers';

interface HabitContributionGridProps {
  habit: Habit;
  weeksCount?: number;
}

export default function HabitContributionGrid({ habit, weeksCount = 14 }: HabitContributionGridProps) {
  const { settings } = useHabits();
  const orderedDays = getOrderedWeekDays(settings.startOfWeek);
  
  // Matrix of weeks [ [day0, day1, ... day6], ... ]
  const weeks = generateContributionGrid(habit, weeksCount, settings.startOfWeek);

  return (
    <div className="w-full flex items-center gap-2 pt-3 pb-1 overflow-x-auto select-none no-scrollbar">
      {/* Day Labels Column (ح، ن، ث، ر، خ، ج، س) */}
      <div className="flex flex-col justify-between gap-[3px] py-[1px] flex-shrink-0">
        {orderedDays.map((dayIndex) => (
          <span
            key={dayIndex}
            className="text-[9px] font-medium leading-none h-[10px] w-3 flex items-center text-muted-text"
          >
            {ARABIC_DAY_LETTERS[dayIndex]}
          </span>
        ))}
      </div>

      {/* Grid columns (weeks) */}
      <div className="flex gap-[3px] flex-1 justify-between min-w-[190px]">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[3px] flex-1 max-w-[14px]">
            {week.map((day) => {
              let cellClasses = 'w-full aspect-square rounded-[3px] transition-colors duration-150 ';

              if (day.isFuture) {
                cellClasses += 'bg-transparent opacity-0';
              } else if (day.isCompleted) {
                // Semantic completed day
                cellClasses += 'bg-habit-completed shadow-sm';
              } else if (day.isRest) {
                // Semantic rest day
                cellClasses += 'bg-primary/20 border border-primary/40';
              } else if (day.isToday) {
                // Semantic today outline
                cellClasses += 'bg-habit-today border border-habit-todayBorder';
              } else {
                // Semantic empty past day
                cellClasses += 'bg-habit-empty';
              }

              const statusText = day.isCompleted ? '✓ مكتمل' : day.isRest ? '🌙 يوم راحة' : 'غير مكتمل';

              return (
                <div
                  key={day.dateKey}
                  title={`${day.dateKey} (${statusText})`}
                  className={cellClasses}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
