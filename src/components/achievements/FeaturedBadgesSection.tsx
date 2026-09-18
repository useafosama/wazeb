'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, Plus, Sparkles, Pin } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { Achievement } from '@/types/habit';
import AchievementDetailModal from './AchievementDetailModal';
import { sounds } from '@/utils/sound';

interface FeaturedBadgesSectionProps {
  isHomePage?: boolean;
}

export default function FeaturedBadgesSection({ isHomePage = false }: FeaturedBadgesSectionProps) {
  const { featuredAchievements, achievements } = useHabits();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleCardClick = (ach: Achievement) => {
    sounds.playTick();
    setSelectedAchievement(ach);
  };

  return (
    <>
      <div className="w-full bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <Pin className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                أوسمتي المميزة
              </h3>
            </div>
          </div>

          <Link
            href="/achievements"
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <span>دولاب الأوسمة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Badges Grid or Empty State */}
        {featuredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featuredAchievements.map((ach) => (
              <button
                key={ach.id}
                onClick={() => handleCardClick(ach)}
                className="p-3.5 rounded-2xl bg-secondary hover:bg-muted/70 border border-border flex items-center gap-3 transition-all active:scale-[0.98] text-right"
              >
                <div className="w-11 h-11 rounded-xl bg-card border border-border flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                  {ach.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-extrabold text-foreground truncate">
                    {ach.title}
                  </h4>
                  <span className="text-[10px] text-muted-foreground line-clamp-1">
                    {ach.category}
                  </span>
                </div>
              </button>
            ))}

            {/* Empty slots indicator if less than 3 */}
            {Array.from({ length: 3 - featuredAchievements.length }).map((_, i) => (
              <Link
                key={i}
                href="/achievements"
                className="p-3.5 rounded-2xl border border-dashed border-border/80 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>تثبيت وسام</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-secondary/60 border border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  ابدأ بجمع وتثبيت أوسمتك المميزة
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {unlockedCount > 0
                    ? `لديك ${unlockedCount} وسام مفتوح، اختر 3 أوسمة مفضلة لتثبيتها هنا.`
                    : 'واظب على عاداتك لتفتح أوسمة حصرية ومميزة.'}
                </span>
              </div>
            </div>

            <Link
              href="/achievements"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-soft flex items-center gap-1.5 flex-shrink-0"
            >
              <span>استكشف الأوسمة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      <AchievementDetailModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </>
  );
}
