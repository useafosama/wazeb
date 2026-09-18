'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getCurrentMonthKey } from '@/utils/monthly-reflection';
import { sounds } from '@/utils/sound';

export default function MonthlyReflectionCard() {
  const { getMonthlyReflection, monthlyReflections } = useHabits();

  const currentMonthKey = getCurrentMonthKey();
  const currentSnapshot = getMonthlyReflection(currentMonthKey);
  const savedReflection = monthlyReflections[currentMonthKey];

  const hasReflectionAnswers = Boolean(
    savedReflection?.answers?.proudOf ||
    savedReflection?.answers?.needsAttention ||
    savedReflection?.answers?.nextMonthGoal
  );

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Texts & Month Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl flex-shrink-0">
            🗓️
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                المراجعة الشهرية
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground">
                {currentSnapshot.monthName}
              </span>
              {hasReflectionAnswers && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
                  تمت المراجعة ✓
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              رحلتك وأداؤك في شهر {currentSnapshot.monthName}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-1">
              {currentSnapshot.score >= 80
                ? 'أداء رائع ومبهر يعكس التزاماً استثنائياً!'
                : currentSnapshot.score >= 50
                ? 'تقدم مستمر وخطوات ثابتة نحو أهدافك.'
                : 'فرصة هادئة لمراجعة مسارك وتجديد طاقتك.'}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill & Action */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="flex items-center gap-3 px-3 py-2 bg-secondary rounded-2xl border border-border">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground">درجة الشهر</span>
              <span className="text-base font-black text-foreground">{currentSnapshot.score}</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground">إنجاز</span>
              <span className="text-base font-black text-foreground">{currentSnapshot.completionRate}%</span>
            </div>
          </div>

          <Link
            href="/reflections"
            onClick={() => sounds.playTick()}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-extrabold px-4 py-3 rounded-2xl shadow-soft transition-all duration-200 active:scale-98 flex-shrink-0"
          >
            <span>راجع شهرك</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
