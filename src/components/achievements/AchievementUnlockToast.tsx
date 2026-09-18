'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, X, ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useHabits } from '@/context/HabitContext';

export default function AchievementUnlockToast() {
  const router = useRouter();
  const { unlockedAchievementToast, dismissUnlockToast } = useHabits();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (unlockedAchievementToast) {
      setIsVisible(true);

      // Trigger refined celebratory confetti
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.15 },
          colors: ['#F59E0B', '#EAB308', '#6366F1', '#EC4899', '#FFFFFF'],
          disableForReducedMotion: true,
        });
      } catch {
        // Ignore
      }

      // Auto-dismiss after 6 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(dismissUnlockToast, 300);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [unlockedAchievementToast, dismissUnlockToast]);

  if (!unlockedAchievementToast || !isVisible) return null;

  const { title, description, icon, category, rarity } = unlockedAchievementToast;

  const handleOpenCabinet = () => {
    setIsVisible(false);
    dismissUnlockToast();
    router.push('/achievements');
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(dismissUnlockToast, 300);
  };

  return (
    <div className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-slide-down">
      <div className="pointer-events-auto w-full max-w-md bg-card/95 backdrop-blur-md border-2 border-primary/40 rounded-3xl p-4 sm:p-5 shadow-soft-lg flex items-center justify-between gap-4">
        {/* Left icon with celebration badge */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center text-2xl sm:text-3xl shadow-sm animate-pulse">
            {icon}
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shadow-soft">
            <Trophy className="w-3 h-3 fill-current" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-primary uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>وسام جديد!</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold px-2 py-0.2 rounded-full bg-secondary">
              {category}
            </span>
          </div>

          <h4 className="text-sm font-extrabold text-foreground tracking-tight truncate mt-0.5">
            {title}
          </h4>

          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
            {description}
          </p>

          <button
            onClick={handleOpenCabinet}
            className="self-start text-[11px] font-bold text-primary hover:underline flex items-center gap-1 mt-1"
          >
            <span>عرض في دولاب الأوسمة</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
