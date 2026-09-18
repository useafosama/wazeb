'use client';

import React, { useState, useEffect } from 'react';
import { Award, Lock, Sparkles, Shirt, Zap, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import {
  calculateChickLevel,
  calculateInitialXP,
  calculateChickAchievements,
} from '@/utils/chick-engine';
import ChickAvatar from './ChickAvatar';
import ChickWardrobeModal from './ChickWardrobeModal';
import { sounds } from '@/utils/sound';

export default function ChickAchievementsCard() {
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

  const totalXP = calculateInitialXP(habits);
  const { level, rankTitle, currentLevelXP, nextLevelXP } = calculateChickLevel(totalXP);
  const achievements = calculateChickAchievements(habits);

  const handleOpenWardrobe = () => {
    sounds.playTick();
    setIsWardrobeOpen(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-5">
        {/* Header with Avatar & Rank */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <ChickAvatar
              size={64}
              mood="happy"
              cosmetic={equippedCosmetic}
              className="flex-shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-foreground">{rankTitle}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary border border-border">
                  المستوى {level}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-warning fill-current" />
                <span>إجمالي الخبرة: {totalXP} XP ({currentLevelXP}/{nextLevelXP} للمستوى القادم)</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenWardrobe}
            className="w-full sm:w-auto bg-secondary hover:bg-muted text-foreground border border-border font-bold text-xs py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <Shirt className="w-4 h-4 text-primary" />
            <span>خزانة الكتكوت</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              أوسمة وإنجازات الكتكوت
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              افتح أوسمة حصرية ومستويات جديدة مع كل مواظبة
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex flex-col gap-2.5 transition-all ${
                  ach.isUnlocked
                    ? 'bg-secondary border-border'
                    : 'bg-secondary/40 border-border/60 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold text-foreground">{ach.title}</h4>
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        {ach.description}
                      </span>
                    </div>
                  </div>

                  {ach.isUnlocked ? (
                    <span className="text-[10px] font-bold text-success-foreground bg-success-bg px-2 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>مكتمل</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 flex-shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>{ach.progress}/{ach.maxProgress}</span>
                    </span>
                  )}
                </div>

                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`h-full rounded-full transition-all ${
                      ach.isUnlocked ? 'bg-success' : 'bg-primary'
                    }`}
                  />
                </div>
              </div>
            );
          })}
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
