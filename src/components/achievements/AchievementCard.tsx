'use client';

import React from 'react';
import { Lock, Pin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Achievement, AchievementRarity } from '@/types/habit';

interface AchievementCardProps {
  achievement: Achievement;
  isFeatured?: boolean;
  onClick: () => void;
}

const RARITY_CONFIG: Record<AchievementRarity, { label: string; tagClass: string; cardBorder: string }> = {
  common: {
    label: 'شائع',
    tagClass: 'bg-secondary text-muted-foreground border-border',
    cardBorder: 'border-border hover:border-foreground/20',
  },
  uncommon: {
    label: 'مميز',
    tagClass: 'bg-secondary text-foreground border-border',
    cardBorder: 'border-border hover:border-foreground/30',
  },
  rare: {
    label: 'نادر',
    tagClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    cardBorder: 'border-blue-500/30 hover:border-blue-500/60',
  },
  epic: {
    label: 'ملحمي',
    tagClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cardBorder: 'border-purple-500/30 hover:border-purple-500/60',
  },
  legendary: {
    label: 'أسطوري',
    tagClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    cardBorder: 'border-amber-500/40 hover:border-amber-500/80',
  },
};

export default function AchievementCard({ achievement, isFeatured = false, onClick }: AchievementCardProps) {
  const { unlocked, isSecret, currentProgress, requirement, rarity, category, title, icon } = achievement;
  const rarityInfo = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;

  const isLockedSecret = !unlocked && isSecret;
  const percent = Math.min(100, Math.round((currentProgress / requirement) * 100));

  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-right p-4 sm:p-5 rounded-3xl border bg-card shadow-soft transition-all duration-200 active:scale-[0.98] flex flex-col justify-between gap-3.5 ${
        unlocked
          ? `${rarityInfo.cardBorder} hover:shadow-soft-lg`
          : 'border-border/60 bg-card/60 opacity-75 hover:opacity-90'
      }`}
    >
      {/* Top Header: Badges & Pin */}
      <div className="flex items-center justify-between w-full">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rarityInfo.tagClass}`}>
          {rarityInfo.label}
        </span>

        <div className="flex items-center gap-1.5">
          {isFeatured && (
            <span
              className="p-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              title="وسام مميز مثبت"
            >
              <Pin className="w-3 h-3 fill-current" />
            </span>
          )}

          {unlocked ? (
            <span className="text-success p-0.5" title="تم الحصول عليه">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="text-muted-foreground p-0.5" title="مقفل">
              <Lock className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Center: Icon & Title */}
      <div className="flex flex-col items-center text-center gap-2 my-1">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-transform group-hover:scale-105 ${
            unlocked
              ? 'bg-secondary border border-border/80'
              : 'bg-muted/40 border border-border/40 grayscale opacity-60'
          }`}
        >
          {isLockedSecret ? '🔒' : icon}
        </div>

        <div className="flex flex-col gap-0.5 items-center">
          <h4 className="text-xs sm:text-sm font-black text-foreground tracking-tight line-clamp-1">
            {isLockedSecret ? 'وسام مخفي' : title}
          </h4>
          <span className="text-[10px] font-semibold text-muted-foreground">
            {category}
          </span>
        </div>
      </div>

      {/* Bottom: Progress bar or completion status */}
      <div className="w-full pt-1">
        {unlocked ? (
          <div className="w-full bg-secondary/80 rounded-xl py-1 px-2 text-center text-[10px] font-bold text-muted-foreground">
            مكتمل ✓
          </div>
        ) : isLockedSecret ? (
          <div className="w-full bg-secondary/50 rounded-xl py-1 px-2 text-center text-[10px] font-semibold text-muted-foreground">
            سر غير مكتشف
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
              <span>التقدم</span>
              <span className="font-bold text-foreground">
                {currentProgress} / {requirement}
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                style={{ width: `${percent}%` }}
                className="h-full bg-primary rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
