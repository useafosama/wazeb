'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';

export default function EmptyState() {
  const { setIsAddModalOpen } = useHabits();

  const handleAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-16 px-6 bg-card border border-border rounded-3xl gap-5 shadow-soft transition-all">
      <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center text-4xl shadow-inner animate-float">
        🌱
      </div>
      
      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-2xl font-black text-foreground tracking-tight">
          لسه البداية
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          أضف أول عادة وابدأ رحلتك مع واظب.
        </p>
      </div>

      <button
        onClick={handleAdd}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-soft mt-1"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
        <span>أضف عادة</span>
      </button>
    </div>
  );
}
