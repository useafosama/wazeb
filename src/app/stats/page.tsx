'use client';

import React from 'react';
import { Plus, BarChart3 } from 'lucide-react';
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
import { sounds } from '@/utils/sound';

export default function StatsPage() {
  const { habits, settings, recordStatsVisited, setIsAddModalOpen } = useHabits();

  React.useEffect(() => {
    recordStatsVisited();
  }, [recordStatsVisited]);

  const handleOpenAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

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

      {habits.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center text-center py-20 px-6 bg-card border border-border rounded-3xl gap-5 shadow-soft my-4">
          <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center text-4xl shadow-inner">
            📊
          </div>
          
          <div className="flex flex-col gap-1.5 max-w-sm">
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              إحصائياتك هتظهر هنا 📊
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ابدأ عادة واحدة وشوف تقدمك يومًا بعد يوم.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-soft mt-1"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>+ أضف أول عادة</span>
          </button>
        </div>
      ) : (
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
      )}
    </AppContainer>
  );
}
