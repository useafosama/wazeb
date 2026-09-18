'use client';

import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import MonthView from '@/components/calendar/MonthView';
import DayCompletionsList from '@/components/calendar/DayCompletionsList';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';

export default function CalendarPage() {
  const { habits, recordCalendarVisited, setIsAddModalOpen } = useHabits();

  useEffect(() => {
    recordCalendarVisited();
  }, [recordCalendarVisited]);

  const handleOpenAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

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

      {habits.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-card border border-border rounded-3xl gap-5 shadow-soft my-4">
          <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center text-4xl shadow-inner">
            🗓️
          </div>
          
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              لسه مفيش سجل
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              لما تبدأ إنجاز عاداتك، رحلتك هتظهر هنا.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-soft mt-1"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>+ أضف أول عادة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pb-12 items-start">
          <div className="lg:col-span-7">
            <MonthView />
          </div>
          <div className="lg:col-span-5">
            <DayCompletionsList />
          </div>
        </div>
      )}
    </AppContainer>
  );
}
