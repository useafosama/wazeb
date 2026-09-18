'use client';

import React from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getDailyProgress } from '@/utils/date-helpers';
import { sounds } from '@/utils/sound';

export default function QuickActionWidget() {
  const { habits, setIsQuickCompleteOpen } = useHabits();
  const progress = getDailyProgress(habits);

  const handleOpenQuick = () => {
    sounds.playTick();
    setIsQuickCompleteOpen(true);
  };

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-4 shadow-soft flex items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-foreground flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">واظب اليوم</span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {progress.completed} من {progress.total}
            </span>
          </div>
          <div className="w-28 sm:w-36 h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
            <div
              style={{ width: `${progress.percentage}%` }}
              className="h-full bg-primary rounded-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleOpenQuick}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-soft flex-shrink-0"
      >
        <Zap className="w-3.5 h-3.5 fill-current" />
        <span>إنجاز سريع</span>
      </button>
    </div>
  );
}
