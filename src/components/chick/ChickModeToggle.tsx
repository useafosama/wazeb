'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';

interface ChickModeToggleProps {
  className?: string;
}

export default function ChickModeToggle({ className = '' }: ChickModeToggleProps) {
  const { settings, updateSettings } = useHabits();
  const isChick = Boolean(settings.isChickMode);

  const handleToggle = () => {
    sounds.playTick();
    const nextState = !isChick;
    
    if (nextState) {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.2 },
          colors: ['#FDE047', '#FACC15', '#F97316', '#F472B6', '#FFFFFF'],
        });
      } catch {
        // Ignore
      }
    }

    updateSettings({ isChickMode: nextState });
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-soft border ${
        isChick
          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse'
          : 'bg-card text-muted-foreground hover:text-foreground border-border'
      } ${className}`}
      title={isChick ? 'إيقاف وضع أشطر كتكوت' : 'تفعيل وضع أشطر كتكوت'}
      aria-label={isChick ? 'إيقاف وضع أشطر كتكوت' : 'تفعيل وضع أشطر كتكوت'}
    >
      <span>🐣</span>
      <span>أشطر كتكوت</span>
      {isChick && <Sparkles className="w-3.5 h-3.5 fill-current" />}
    </button>
  );
}
