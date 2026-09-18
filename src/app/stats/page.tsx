'use client';

import React from 'react';
import AppContainer from '@/components/layout/AppContainer';
import MetricCards from '@/components/stats/MetricCards';
import DayScoreTrendChart from '@/components/stats/DayScoreTrendChart';
import ActivityCharts from '@/components/stats/ActivityCharts';
import InsightsSection from '@/components/stats/InsightsSection';
import ChallengesList from '@/components/stats/ChallengesList';
import ChickAchievementsCard from '@/components/chick/ChickAchievementsCard';
import ChickWeeklyCard from '@/components/chick/ChickWeeklyCard';
import AchievementsStatsCard from '@/components/achievements/AchievementsStatsCard';
import MonthlyReflectionCard from '@/components/reflections/MonthlyReflectionCard';
import { useHabits } from '@/context/HabitContext';

export default function StatsPage() {
  const { settings, recordStatsVisited } = useHabits();

  React.useEffect(() => {
    recordStatsVisited();
  }, [recordStatsVisited]);

  return (
    <AppContainer showSummaryPanel={false}>
      <div className="pt-2 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {settings.isChickMode ? 'إحصائيات وإنجازات الكتكوت 🐣' : 'الإحصائيات والرؤى'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
          {settings.isChickMode
            ? 'مستويات الشطارة، الأوسمة، وخزانة الكتكوت'
            : 'تحليلات دقيقة لدرجة يومك، التحديات، وأنماط الاستمرارية'}
        </p>
      </div>

      <div className="flex flex-col gap-6 pb-16">
        {/* Monthly Reflection Review Card */}
        <MonthlyReflectionCard />

        {/* Achievements Cabinet Summary */}
        <AchievementsStatsCard />

        {/* Chick Mode Exclusive Cards */}
        {settings.isChickMode && (
          <>
            <ChickAchievementsCard />
            <ChickWeeklyCard />
          </>
        )}

        {/* Key Metrics Row */}
        <MetricCards />

        {/* Day Score 7-Day Trend Chart */}
        <DayScoreTrendChart />

        {/* Weekly Activity and Habit Breakdown */}
        <ActivityCharts />

        {/* Failure Insights & Suggestions ("ليه وقعت؟") */}
        <InsightsSection />

        {/* Challenges & Badges List */}
        <ChallengesList />
      </div>
    </AppContainer>
  );
}
