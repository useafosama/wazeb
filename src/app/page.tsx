'use client';

import React from 'react';
import { Plus, Sparkles, Lightbulb, ArrowLeft, X } from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import AppHeader from '@/components/layout/AppHeader';
import ProgressRingCard from '@/components/home/ProgressRingCard';
import DayScoreCard from '@/components/home/DayScoreCard';
import QuickActionWidget from '@/components/home/QuickActionWidget';
import ActiveChallengeCard from '@/components/home/ActiveChallengeCard';
import HabitCard from '@/components/home/HabitCard';
import EmptyState from '@/components/home/EmptyState';
import SakinahPromoCard from '@/components/sakinah/SakinahPromoCard';
import ChickHeroBanner from '@/components/chick/ChickHeroBanner';
import FeaturedBadgesSection from '@/components/achievements/FeaturedBadgesSection';
import InstallBannerCard from '@/components/pwa/InstallBannerCard';
import OnboardingTourModal from '@/components/onboarding/OnboardingTourModal';
import { useHabits } from '@/context/HabitContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { sounds } from '@/utils/sound';

export default function HomePage() {
  const {
    habits,
    settings,
    isHydrated,
    isStorageCorrupted,
    hasLocalBackup,
    restoreLocalBackup,
    resetAllData,
    setIsAddModalOpen,
    insights,
    applyInsightAction,
    dismissInsight,
  } = useHabits();

  const {
    isOnboardingOpen,
    closeTour,
    completeTour,
  } = useOnboarding();

  const handleOpenAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

  const topInsight = insights.length > 0 ? insights[0] : null;

  return (
    <AppContainer>
      {/* Onboarding Welcome Tour Modal for First-time Users */}
      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />

      {/* Header */}
      <AppHeader />

      {/* Data Corruption Banner (if any) */}
      {isStorageCorrupted && (
        <div className="mb-4 p-4 bg-destructive-bg border border-destructive/40 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 text-destructive-foreground animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span>⚠️</span>
            <span>تعذر قراءة بعض البيانات المحلية المحفوظة.</span>
          </div>
          <div className="flex items-center gap-2">
            {hasLocalBackup && (
              <button
                onClick={restoreLocalBackup}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-xs"
              >
                استعادة من النسخة الاحتياطية
              </button>
            )}
            <button
              onClick={resetAllData}
              className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold rounded-xl"
            >
              إعادة تعيين
            </button>
          </div>
        </div>
      )}

      {/* Main Container Stack */}
      <div className="flex flex-col gap-5 mb-6">
        {/* PWA Smart Installation Card */}
        <InstallBannerCard />

        {/* Chick Hero Banner */}
        {settings.isChickMode && <ChickHeroBanner />}

        {/* Active Habit Cards (only if user has habits) */}
        {habits.length > 0 && (
          <>
            {/* 1. Progress Ring Card */}
            <ProgressRingCard />

            {/* 2. Wazeb Day Score */}
            <DayScoreCard />

            {/* 3. Featured Badges (أوسمتي المميزة) */}
            <FeaturedBadgesSection isHomePage />

            {/* 4. Wazeb Today Quick Action Widget */}
            <QuickActionWidget />

            {/* 5. Active Challenge Card */}
            <ActiveChallengeCard />
          </>
        )}

        {/* Top Smart Insight (if available and habits exist) */}
        {habits.length > 0 && topInsight && (
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-warning-bg text-warning flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-foreground">
                  {topInsight.title}
                </span>
              </div>

              <button
                onClick={() => dismissInsight(topInsight.id)}
                className="text-muted-foreground hover:text-foreground p-1"
                title="تجاهل"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {topInsight.description}
            </p>

            {topInsight.suggestedAction && (
              <button
                onClick={() => applyInsightAction(topInsight.id, topInsight.suggestedAction!)}
                className="self-start bg-secondary hover:bg-muted text-foreground border border-border font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm mt-1"
              >
                <span>{topInsight.suggestedAction.label}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Habits Section */}
      <section className="flex flex-col gap-4 pb-8">
        {!isHydrated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-32 rounded-3xl bg-card animate-pulse border border-border"
              />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm sm:text-base font-bold text-muted-foreground tracking-wide">
                عاداتي اليومية
              </h2>
              <span className="text-xs font-semibold text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
                {habits.length} عادات
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Cross-Product Ecosystem Section: "اكتشف من واظب" */}
      <section className="flex flex-col gap-3 pb-16">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            اكتشف من واظب
          </h3>
        </div>
        <SakinahPromoCard />
      </section>

      {/* Mobile Floating Add Button (<1024px) */}
      {habits.length > 0 && (
        <div className="lg:hidden fixed bottom-20 left-0 right-0 z-30 flex justify-center pointer-events-none px-4">
          <div className="w-full max-w-[480px] sm:max-w-md">
            <button
              onClick={handleOpenAdd}
              className="pointer-events-auto w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft-lg transition-all duration-200 active:scale-[0.98] border border-border"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span className="text-sm sm:text-base font-extrabold">عادة جديدة</span>
            </button>
          </div>
        </div>
      )}
    </AppContainer>
  );
}
