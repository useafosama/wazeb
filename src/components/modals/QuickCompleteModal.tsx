'use client';

import React from 'react';
import { X, Check, Zap } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getTodayKey } from '@/utils/date-helpers';
import { sounds } from '@/utils/sound';

export default function QuickCompleteModal() {
  const { habits, isQuickCompleteOpen, setIsQuickCompleteOpen, toggleHabitCompletion } = useHabits();
  const todayKey = getTodayKey();

  if (!isQuickCompleteOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsQuickCompleteOpen(false);
  };

  const completedCount = habits.filter((h) => h.completions[todayKey]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-md bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center text-primary">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                إنجاز سريع
              </h3>
              <p className="text-xs text-muted-foreground">
                {completedCount} من {habits.length} مكتملة اليوم
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick checklist */}
        <div className="flex flex-col gap-2.5 mt-4">
          {habits.map((habit) => {
            const isCompleted = Boolean(habit.completions[todayKey]);

            return (
              <button
                key={habit.id}
                onClick={() => toggleHabitCompletion(habit.id, todayKey)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all duration-150 active:scale-[0.99] text-right ${
                  isCompleted
                    ? 'bg-secondary border border-border'
                    : 'bg-card border border-border/40 hover:border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.icon}</span>
                  <span
                    className={`text-sm font-bold ${
                      isCompleted ? 'text-foreground line-through opacity-80' : 'text-foreground'
                    }`}
                  >
                    {habit.name}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border text-transparent'
                  }`}
                >
                  <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl transition-all active:scale-98 text-xs shadow-soft mt-5"
        >
          تم
        </button>
      </div>
    </div>
  );
}
