'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Shirt, Award, Zap } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { calculateChickLevel, calculateInitialXP, getChickContextualQuote } from '@/utils/chick-engine';
import ChickAvatar from './ChickAvatar';
import ChickWardrobeModal from './ChickWardrobeModal';
import { getTodayKey } from '@/utils/date-helpers';
import { sounds } from '@/utils/sound';

export default function ChickHeroBanner() {
  const { habits, settings } = useHabits();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [equippedCosmetic, setEquippedCosmetic] = useState<any>('none');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('wazeb_chick_equipped_v1');
      if (stored) {
        setEquippedCosmetic(stored);
      }
    } catch {
      // Ignore
    }
  }, [isWardrobeOpen]);

  if (!settings.isChickMode) return null;

  const todayKey = getTodayKey();
  const completedToday = habits.filter((h) => h.completions[todayKey]).length;
  const quote = getChickContextualQuote(completedToday, habits.length);

  const totalXP = calculateInitialXP(habits);
  const { level, rankTitle, currentLevelXP, nextLevelXP } = calculateChickLevel(totalXP);
  const xpPercent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

  // Determine chick mood based on today's progress
  let mood: 'idle' | 'happy' | 'celebrating' | 'sleeping' = 'idle';
  if (habits.length > 0 && completedToday === habits.length) {
    mood = 'celebrating';
  } else if (completedToday > 0) {
    mood = 'happy';
  }

  const handleOpenWardrobe = () => {
    sounds.playTick();
    setIsWardrobeOpen(true);
  };

  return (
    <>
      <div className="w-full bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft transition-all duration-300 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Chick Avatar & Interaction */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <ChickAvatar
              size={84}
              mood={mood}
              cosmetic={equippedCosmetic}
              className="flex-shrink-0"
            />

            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-primary px-2.5 py-0.5 rounded-full bg-secondary border border-border">
                  المستوى {level} • {rankTitle}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-foreground mt-1 tracking-tight leading-snug">
                {quote}
              </h3>

              {/* XP Progress Bar */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
                  <div
                    style={{ width: `${xpPercent}%` }}
                    className="h-full bg-primary rounded-full transition-all duration-500"
                  />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-0.5">
                  <Zap className="w-3 h-3 text-warning fill-current" />
                  <span>{currentLevelXP}/{nextLevelXP} XP</span>
                </span>
              </div>
            </div>
          </div>

          {/* Wardrobe Shortcut Button */}
          <button
            onClick={handleOpenWardrobe}
            className="bg-secondary hover:bg-muted text-foreground border border-border font-bold text-xs py-2 px-3.5 rounded-2xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm self-end sm:self-center flex-shrink-0"
          >
            <Shirt className="w-3.5 h-3.5 text-primary" />
            <span>خزانة الكتكوت</span>
          </button>
        </div>
      </div>

      <ChickWardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        currentLevel={level}
      />
    </>
  );
}
