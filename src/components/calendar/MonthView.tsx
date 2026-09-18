'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { formatDateKey, getOrderedWeekDays, ARABIC_DAY_LETTERS, getTodayKey, getHabitDayStatus } from '@/utils/date-helpers';
import { sounds } from '@/utils/sound';

const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function MonthView() {
  const { habits, settings, selectedDate, setSelectedDate } = useHabits();
  const [currentViewDate, setCurrentViewDate] = useState<Date>(new Date());

  const currentYear = currentViewDate.getFullYear();
  const currentMonth = currentViewDate.getMonth(); // 0 - 11

  const todayKey = getTodayKey();
  const orderedWeekDays = getOrderedWeekDays(settings.startOfWeek);

  const prevMonth = () => {
    sounds.playTick();
    setCurrentViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    sounds.playTick();
    setCurrentViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const jumpToToday = () => {
    sounds.playTick();
    setCurrentViewDate(new Date());
    setSelectedDate(todayKey);
  };

  // Generate calendar days for currentMonth
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();

  // Find padding days before month starts
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const startPadding = (firstDayOfWeek - settings.startOfWeek + 7) % 7;

  const calendarCells: { dateKey: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
    calendarCells.push({
      dateKey: formatDateKey(d),
      dayNum: d.getDate(),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    calendarCells.push({
      dateKey: formatDateKey(date),
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month trailing days to complete grid (multiples of 7)
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(currentYear, currentMonth + 1, i);
    calendarCells.push({
      dateKey: formatDateKey(d),
      dayNum: d.getDate(),
      isCurrentMonth: false,
    });
  }

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 shadow-soft">
      {/* Month Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">
            {ARABIC_MONTHS[currentMonth]} {currentYear}
          </h2>
          {currentMonth !== new Date().getMonth() && (
            <button
              onClick={jumpToToday}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground bg-secondary px-2 py-0.5 rounded-lg transition-colors"
            >
              اليوم
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 pt-3 pb-2 text-center select-none">
        {orderedWeekDays.map((dayIdx) => (
          <span key={dayIdx} className="text-xs font-bold text-muted-foreground">
            {ARABIC_DAY_LETTERS[dayIdx]}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-1">
        {calendarCells.map((cell) => {
          const isSelected = cell.dateKey === selectedDate;
          const isToday = cell.dateKey === todayKey;

          // Calculate completed & rest habits count for this day
          let completedCount = 0;
          let restCount = 0;
          habits.forEach((h) => {
            const status = getHabitDayStatus(h, cell.dateKey);
            if (status === 'COMPLETED') completedCount++;
            else if (status === 'REST') restCount++;
          });

          const totalHabits = Math.max(habits.length, 1);
          const completionRatio = completedCount / totalHabits;

          return (
            <button
              key={cell.dateKey}
              onClick={() => {
                sounds.playTick();
                setSelectedDate(cell.dateKey);
              }}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-150 ${
                isSelected
                  ? 'bg-primary text-primary-foreground font-black shadow-soft scale-105 z-10'
                  : isToday
                  ? 'bg-secondary text-foreground font-bold border border-border'
                  : cell.isCurrentMonth
                  ? 'hover:bg-accent text-foreground'
                  : 'text-muted-text hover:text-muted-foreground'
              }`}
            >
              <span className="text-xs font-semibold">{cell.dayNum}</span>

              {/* Completion Dot or Rest Moon */}
              {completedCount > 0 ? (
                <div className="mt-0.5 flex items-center justify-center gap-0.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected
                        ? 'bg-primary-foreground'
                        : completionRatio === 1
                        ? 'bg-success'
                        : 'bg-foreground/70'
                    }`}
                  />
                  {completedCount > 1 && (
                    <span
                      className={`text-[8px] font-bold leading-none ${
                        isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {completedCount}
                    </span>
                  )}
                </div>
              ) : restCount > 0 ? (
                <div className="mt-0.5 flex items-center justify-center">
                  <span className="text-[9px] leading-none opacity-80">🌙</span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
