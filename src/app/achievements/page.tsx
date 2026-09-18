'use client';

import React, { useState } from 'react';
import { Trophy, Award, Filter, Sparkles } from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import { useHabits } from '@/context/HabitContext';
import { Achievement, AchievementCategory } from '@/types/habit';
import AchievementCard from '@/components/achievements/AchievementCard';
import AchievementDetailModal from '@/components/achievements/AchievementDetailModal';
import FeaturedBadgesSection from '@/components/achievements/FeaturedBadgesSection';
import { getAchievementStatsSummary } from '@/utils/achievement-engine';
import { sounds } from '@/utils/sound';

const CATEGORIES: ('الكل' | AchievementCategory)[] = [
  'الكل',
  'البداية',
  'الاستمرارية',
  'الإنجاز',
  'التحديات',
  'الكمال',
  'الاستكشاف',
];

export default function AchievementsPage() {
  const { achievements, featuredAchievementIds } = useHabits();
  const [activeCategory, setActiveCategory] = useState<'الكل' | AchievementCategory>('الكل');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const summary = getAchievementStatsSummary(achievements, featuredAchievementIds);

  const filteredAchievements = achievements.filter((ach) => {
    if (activeCategory === 'الكل') return true;
    return ach.category === activeCategory;
  });

  const handleSelectBadge = (ach: Achievement) => {
    sounds.playTick();
    setSelectedAchievement(ach);
  };

  const handleFilterChange = (cat: 'الكل' | AchievementCategory) => {
    sounds.playTick();
    setActiveCategory(cat);
  };

  return (
    <AppContainer showSummaryPanel={false}>
      {/* Page Title & Stats */}
      <div className="pt-2 pb-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
              <span>دولاب الأوسمة</span>
              <span className="text-xl">🏆</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
              سجل أوسمتك المكتسبة ومسار التحديات والأسرار
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center bg-secondary px-3.5 py-1.5 rounded-2xl border border-border">
            <span className="text-xs font-bold text-muted-foreground">تم إنجاز:</span>
            <span className="text-sm font-black text-foreground">
              {summary.unlockedCount} / {summary.totalCount} وسام
            </span>
            <span className="text-xs font-extrabold text-primary mr-1">
              ({summary.percentage}%)
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border">
          <div
            style={{ width: `${summary.percentage}%` }}
            className="h-full bg-primary rounded-full transition-all duration-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 pb-16">
        {/* Section 1: Featured Badges */}
        <FeaturedBadgesSection />

        {/* Section 2: Category Filter Tabs */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              const count =
                cat === 'الكل'
                  ? achievements.length
                  : achievements.filter((a) => a.category === cat).length;
              const unlockedInCat =
                cat === 'الكل'
                  ? summary.unlockedCount
                  : achievements.filter((a) => a.category === cat && a.unlocked).length;

              return (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0 border ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-soft'
                      : 'bg-card text-muted-foreground hover:text-foreground border-border'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {unlockedInCat}/{count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section 3: Responsive Badges Grid */}
          {/* Mobile: 2 cols | Tablet: 3-4 cols | Desktop: 4-6 cols */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredAchievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                isFeatured={featuredAchievementIds.includes(ach.id)}
                onClick={() => handleSelectBadge(ach)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AchievementDetailModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </AppContainer>
  );
}
