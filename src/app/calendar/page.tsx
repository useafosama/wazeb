'use client';

import React, { useEffect } from 'react';
import AppContainer from '@/components/layout/AppContainer';
import MonthView from '@/components/calendar/MonthView';
import DayCompletionsList from '@/components/calendar/DayCompletionsList';
import { useHabits } from '@/context/HabitContext';

export default function CalendarPage() {
  const { recordCalendarVisited } = useHabits();

  useEffect(() => {
    recordCalendarVisited();
  }, [recordCalendarVisited]);

  return (
    <AppContainer showSummaryPanel={false}>
      <div className="pt-2 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          التقويم
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
          استعرض أيام التزامك وإنجازاتك اليومية عبر الشهر وتفاصيل كل يوم
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pb-12 items-start">
        <div className="lg:col-span-7">
          <MonthView />
        </div>
        <div className="lg:col-span-5">
          <DayCompletionsList />
        </div>
      </div>
    </AppContainer>
  );
}
