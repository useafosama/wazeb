'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, ArrowLeft, Award, Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getAchievementStatsSummary } from '@/utils/achievement-engine';

export default function AchievementsStatsCard() {
  const { achievements, featuredAchievementIds } = useHabits();
  const summary = getAchievementStatsSummary(achievements, featuredAchievementIds);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              دولاب الأوسمة والإنجازات
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              سجل أوسمتك المكتسبة ومسار التحديات
            </p>
          </div>
        </div>

        <Link
          href="/achievements"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>عرض كل الأوسمة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Count & Progress */}
        <div className="bg-secondary rounded-2xl p-4 flex flex-col justify-between gap-3 border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">الأوسمة المكتسبة</span>
            <span className="text-sm font-black text-foreground">
              {summary.unlockedCount} / {summary.totalCount}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                style={{ width: `${summary.percentage}%` }}
                className="h-full bg-primary rounded-full transition-all duration-500"
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold">
              تم إنجاز {summary.percentage}% من إجمالي الأوسمة
            </span>
          </div>
        </div>

        {/* Last Unlocked Badge */}
        <div className="bg-secondary rounded-2xl p-4 flex flex-col justify-between gap-2 border border-border">
          <span className="text-xs font-bold text-muted-foreground">آخر وسام حصلت عليه</span>

          {summary.lastUnlocked ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-2xl flex-shrink-0">
                {summary.lastUnlocked.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-foreground truncate">
                  {summary.lastUnlocked.title}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  {summary.lastUnlocked.description}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              واظب على عاداتك لتفتح أول وسام في مسيرتك! 🌱
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
