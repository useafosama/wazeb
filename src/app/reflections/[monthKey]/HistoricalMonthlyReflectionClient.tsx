'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  Moon,
  Flame,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Check,
} from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import { useHabits } from '@/context/HabitContext';
import {
  getAvailableReflectionMonths,
} from '@/utils/monthly-reflection';
import { sounds } from '@/utils/sound';
import confetti from 'canvas-confetti';

export default function HistoricalMonthlyReflectionClient() {
  const params = useParams();
  const monthKey = (params?.monthKey as string) || '';
  const { habits, getMonthlyReflection, saveMonthlyReflection } = useHabits();

  // Snapshot from context
  const snapshot = getMonthlyReflection(monthKey);

  const [proudOfAnswer, setProudOfAnswer] = useState(
    snapshot.answers?.proudOf || ''
  );
  const [needsAttentionAnswer, setNeedsAttentionAnswer] = useState(
    snapshot.answers?.needsAttention || ''
  );
  const [nextGoalAnswer, setNextGoalAnswer] = useState(
    snapshot.answers?.nextMonthGoal || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (snapshot.answers) {
      setProudOfAnswer(snapshot.answers.proudOf || '');
      setNeedsAttentionAnswer(snapshot.answers.needsAttention || '');
      setNextGoalAnswer(snapshot.answers.nextMonthGoal || '');
    }
  }, [snapshot]);

  const handleSaveAnswers = () => {
    sounds.playLevelUp();
    saveMonthlyReflection({
      ...snapshot,
      answers: {
        proudOf: proudOfAnswer,
        needsAttention: needsAttentionAnswer,
        nextMonthGoal: nextGoalAnswer,
      },
      completedAt: new Date().toISOString(),
    });
    setSavedSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899'],
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const availableMonths = getAvailableReflectionMonths(habits);

  const gaugeSize = 120;
  const strokeWidth = 10;
  const center = gaugeSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (snapshot.score / 100) * circumference;

  return (
    <AppContainer showSummaryPanel={false}>
      {/* Top Breadcrumb Header */}
      <div className="pt-2 pb-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/reflections"
            onClick={() => sounds.playTick()}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>المراجعة الحالية</span>
          </Link>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground flex items-center gap-1">
            <span>🗓️</span>
            <span>{snapshot.monthName}</span>
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            أرشيف رحلة {snapshot.monthName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
            سجل محفوظ لأدائك وتأملاتك خلال هذا الشهر
          </p>
        </div>

        {/* Past Months Nav Selector */}
        {availableMonths.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
            <Link
              href="/reflections"
              onClick={() => sounds.playTick()}
              className="px-3 py-1.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground font-semibold flex-shrink-0 transition-colors border border-border"
            >
              الشهر الحالي
            </Link>
            {availableMonths.slice(1).map((pm) => {
              const isCurrentSelected = pm.monthKey === monthKey;
              return (
                <Link
                  key={pm.monthKey}
                  href={`/reflections/${pm.monthKey}`}
                  onClick={() => sounds.playTick()}
                  className={`px-3 py-1.5 rounded-xl font-semibold flex-shrink-0 transition-colors border ${
                    isCurrentSelected
                      ? 'bg-primary text-primary-foreground border-primary font-bold'
                      : 'bg-secondary text-muted-foreground hover:text-foreground border-border'
                  }`}
                >
                  {pm.monthName}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 pb-20">
        {/* Month Score Hero Banner */}
        <div className="w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col gap-2 text-center sm:text-right z-10 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Wazeb Monthly Score
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                درجة شهر {snapshot.monthName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {snapshot.score >= 85
                ? 'شهر استثنائي ومبهر! 🌟'
                : snapshot.score >= 70
                ? 'إنجاز رائع وخطوات واثقة! 🚀'
                : snapshot.score >= 50
                ? 'استمرارية طيبة وتقدم مستمر! 🌱'
                : 'محطة من محطات رحلتك! 💫'}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
              سجلت في هذا الشهر {snapshot.totalCompletions} إنجازاً بنسبة التزام {snapshot.completionRate}%، مع الاستفادة من {snapshot.restDaysCount} أيام راحة مجدولة.
            </p>
          </div>

          {/* Big Gauge */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            <svg width={gaugeSize} height={gaugeSize} className="transform -rotate-90">
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-muted"
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="text-primary progress-ring-circle"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-foreground tracking-tight">
                {snapshot.score}
              </span>
              <span className="text-[10px] text-muted-text font-bold">من 100</span>
            </div>
          </div>
        </div>

        {/* 4 Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">الإنجازات المكتملة</span>
              <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center text-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {snapshot.totalCompletions}
              </span>
              <span className="text-xs text-muted-foreground">مرة</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">نسبة الالتزام</span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {snapshot.completionRate}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">أيام الراحة المنضبطة</span>
              <div className="w-8 h-8 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-sm">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {snapshot.restDaysCount}
              </span>
              <span className="text-xs text-muted-foreground">يوم</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">أطول سلسلة</span>
              <div className="w-8 h-8 rounded-xl bg-warning/15 text-warning flex items-center justify-center text-sm">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {snapshot.longestStreak}
              </span>
              <span className="text-xs text-muted-foreground">يوم</span>
            </div>
          </div>
        </div>

        {/* Habit Performance List */}
        <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                تفاصيل عادات {snapshot.monthName}
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              {snapshot.habitStats.length} عادات
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {snapshot.habitStats.map((h) => (
              <div
                key={h.habitId}
                className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-xl shadow-xs">
                      {h.habitIcon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{h.habitName}</span>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{h.totalCompletions} من أصل {h.scheduledDays} يوم مجدول</span>
                        {h.restDays > 0 && (
                          <span className="text-primary font-medium flex items-center gap-1">
                            <span>•</span>
                            <span>🌙 {h.restDays} راحة</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-foreground">{h.completionRate}%</span>
                    <span className="text-[10px] text-muted-foreground">
                      مكتمل
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    style={{ width: `${h.completionRate}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Self-Reflection Answers */}
        <div className="w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                تأملات هذا الشهر
              </h3>
            </div>

            {savedSuccess && (
              <span className="text-xs font-bold px-3 py-1 bg-success/15 text-success rounded-xl flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>تم الحفظ!</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                1. العادة التي تركت الأثر الإيجابي الأكبر:
              </label>
              <textarea
                value={proudOfAnswer}
                onChange={(e) => setProudOfAnswer(e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                2. التحديات والعوائق:
              </label>
              <textarea
                value={needsAttentionAnswer}
                onChange={(e) => setNeedsAttentionAnswer(e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground">
                3. الهدف والتركيز:
              </label>
              <textarea
                value={nextGoalAnswer}
                onChange={(e) => setNextGoalAnswer(e.target.value)}
                rows={2}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <button
              onClick={handleSaveAnswers}
              className="self-end bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-soft transition-all duration-200 active:scale-98 flex items-center gap-2 mt-2"
            >
              <Check className="w-4 h-4" />
              <span>تحديث التأملات</span>
            </button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
}
