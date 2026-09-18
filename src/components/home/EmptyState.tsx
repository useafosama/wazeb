'use client';

import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';

export default function EmptyState() {
  const { setIsAddModalOpen, resetToSampleData } = useHabits();

  const handleAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

  const handleRestoreSamples = () => {
    sounds.playTick();
    resetToSampleData();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-16 px-4 bg-card border border-border rounded-3xl gap-4 shadow-soft">
      <div className="w-16 h-16 rounded-3xl bg-accent flex items-center justify-center text-3xl mb-1 shadow-inner">
        🌱
      </div>
      
      <div className="flex flex-col gap-1 max-w-xs">
        <h3 className="text-xl font-bold text-foreground">
          ابدأ بعادة صغيرة
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          أضف أول عادة لك وابدأ ببناء سلسلة جديدة من الإنجازات اليومية.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full max-w-xs">
        <button
          onClick={handleAdd}
          className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 shadow-soft"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>إضافة عادة</span>
        </button>

        <button
          onClick={handleRestoreSamples}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>استعادة النماذج</span>
        </button>
      </div>
    </div>
  );
}
