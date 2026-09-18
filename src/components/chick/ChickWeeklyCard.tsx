'use client';

import React from 'react';
import { Sparkles, Trophy, Zap, Flame, Award } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { calculateChickLevel, calculateInitialXP } from '@/utils/chick-engine';
import { calculateHabitStats, formatDateKey } from '@/utils/date-helpers';
import ChickAvatar from './ChickAvatar';

export default function ChickWeeklyCard() {
  const { habits, settings } = useHabits();

  if (!settings.isChickMode) return null;

  const totalXP = calculateInitialXP(habits);
  const { level, rankTitle } = calculateChickLevel(totalXP);

  // Weekly completions
  const today = new Date();
  let weeklyCompletions = 0;
  let maxStreak = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    habits.forEach((h) => {
      if (h.completions[key]) weeklyCompletions++;
    });
  }

  habits.forEach((h) => {
    const stats = calculateHabitStats(h);
    if (stats.currentStreak > maxStreak) maxStreak = stats.currentStreak;
  });

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐣</span>
          <div>
            <h4 className="text-sm font-black text-foreground">أسبوع الكتكوت</h4>
            <span className="text-[11px] text-muted-foreground">{rankTitle}</span>
          </div>
        </div>

        <ChickAvatar size={42} mood="happy" interactive={false} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-0.5 border border-border">
          <div className="flex items-center gap-1 text-[11px] text-warning font-semibold">
            <Zap className="w-3 h-3 fill-current" />
            <span>XP الأسبوع</span>
          </div>
          <span className="text-base font-extrabold text-foreground">
            +{weeklyCompletions * 10} XP
          </span>
        </div>

        <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-0.5 border border-border">
          <div className="flex items-center gap-1 text-[11px] text-primary font-semibold">
            <Flame className="w-3 h-3 text-warning" />
            <span>أعلى سلسلة</span>
          </div>
          <span className="text-base font-extrabold text-foreground">
            {maxStreak} أيام
          </span>
        </div>
      </div>
    </div>
  );
}
