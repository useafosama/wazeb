'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Sparkles,
  Calendar,
  Moon,
  Flame,
  CheckCircle2,
  TrendingUp,
  Target,
  Check,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import { useHabits } from '@/context/HabitContext';
import {
  getCurrentMonthKey,
  getAvailableReflectionMonths,
} from '@/utils/monthly-reflection';
import { sounds } from '@/utils/sound';
import confetti from 'canvas-confetti';

export default function MonthlyReflectionPage() {
  const {
    habits,
    getMonthlyReflection,
    monthlyReflections,
    saveMonthlyReflection,
    applyReflectionSuggestion,
  } = useHabits();

  // Current Month Snapshot
  const currentMonthKey = getCurrentMonthKey();
  const currentSnapshot = getMonthlyReflection(currentMonthKey);

  // Saved Reflection Data or defaults
  const savedReflection = monthlyReflections[currentMonthKey];

  const [proudOfAnswer, setProudOfAnswer] = useState(
    savedReflection?.answers?.proudOf || ''
  );
  const [needsAttentionAnswer, setNeedsAttentionAnswer] = useState(
    savedReflection?.answers?.needsAttention || ''
  );
  const [nextGoalAnswer, setNextGoalAnswer] = useState(
    savedReflection?.answers?.nextMonthGoal || ''
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if savedReflection updates
  useEffect(() => {
    if (savedReflection?.answers) {
      setProudOfAnswer(savedReflection.answers.proudOf || '');
      setNeedsAttentionAnswer(savedReflection.answers.needsAttention || '');
      setNextGoalAnswer(savedReflection.answers.nextMonthGoal || '');
    }
  }, [savedReflection]);

  // Handle Save Answers
  const handleSaveAnswers = () => {
    sounds.playLevelUp();
    saveMonthlyReflection({
      ...currentSnapshot,
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

  // History past months list
  const availableMonths = getAvailableReflectionMonths(habits);

  // Gauge calculation
  const gaugeSize = 120;
  const strokeWidth = 10;
  const center = gaugeSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentSnapshot.score / 100) * circumference;

  return (
    <AppContainer showSummaryPanel={false}>
      {/* Top Breadcrumb Header */}
      <div className="pt-2 pb-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/stats"
            onClick={() => sounds.playTick()}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة للإحصائيات</span>
          </Link>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-foreground flex items-center gap-1">
            <span>🗓️</span>
            <span>{currentSnapshot.monthName}</span>
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            المراجعة الشهرية لرحلتك
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
            تأمل هادئ ومدروس في خطواتك وإنجازاتك خلال شهر {currentSnapshot.monthName}
          </p>
        </div>

        {/* Past Months Nav Selector */}
        {availableMonths.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
            <span className="text-muted-foreground font-bold flex-shrink-0 text-[11px]">
              الشهور السابقة:
            </span>
            {availableMonths.slice(1).map((pm) => (
              <Link
                key={pm.monthKey}
                href={`/reflections/${pm.monthKey}`}
                onClick={() => sounds.playTick()}
                className="px-3 py-1.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground font-semibold flex-shrink-0 transition-colors border border-border"
              >
                {pm.monthName}
              </Link>
            ))}
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
                درجة الشهر
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {currentSnapshot.score >= 85
                ? 'شهر استثنائي ومبهر! 🌟'
                : currentSnapshot.score >= 70
                ? 'إنجاز رائع وخطوات واثقة! 🚀'
                : currentSnapshot.score >= 50
                ? 'استمرارية طيبة وتقدم مستمر! 🌱'
                : 'بداية مباركة وفرصة للتجديد! 💫'}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
              {currentSnapshot.score >= 85
                ? `لقد حققت أداءً مذهلاً خلال شهر ${currentSnapshot.monthName} بنسبة التزام بلغت ${currentSnapshot.completionRate}%. استمرارك يصنع الفارق الحقيقي في حياتك.`
                : currentSnapshot.score >= 50
                ? `حققت ${currentSnapshot.totalCompletions} إنجازاً بنسبة ${currentSnapshot.completionRate}% مع الاستفادة من ${currentSnapshot.restDaysCount} أيام راحة متوازنة.`
                : `كل خطوة قمت بها لها وزن وقيمة. الشهر القادم فرصة لتقليل العوائق وبناء روتين أكثر راحة وسلاسة.`}
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
                {currentSnapshot.score}
              </span>
              <span className="text-[10px] text-muted-text font-bold">من 100</span>
            </div>
          </div>
        </div>

        {/* 4 Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1 */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">الإنجازات المكتملة</span>
              <div className="w-8 h-8 rounded-xl bg-success/10 text-success flex items-center justify-center text-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {currentSnapshot.totalCompletions}
              </span>
              <span className="text-xs text-muted-foreground">مرة</span>
            </div>
            <span className="text-[11px] text-muted-text font-medium">خلال الشهر الحالي</span>
          </div>

          {/* Metric 2 */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">نسبة الالتزام</span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {currentSnapshot.completionRate}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <span className="text-[11px] text-muted-text font-medium">مستثنى منها أيام الراحة</span>
          </div>

          {/* Metric 3 */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">أيام الراحة المنضبطة</span>
              <div className="w-8 h-8 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-sm">
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {currentSnapshot.restDaysCount}
              </span>
              <span className="text-xs text-muted-foreground">يوم</span>
            </div>
            <span className="text-[11px] text-muted-text font-medium">استراحة حافظت على طاقتك</span>
          </div>

          {/* Metric 4 */}
          <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-soft flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">أطول سلسلة</span>
              <div className="w-8 h-8 rounded-xl bg-warning/15 text-warning flex items-center justify-center text-sm">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-foreground">
                {currentSnapshot.longestStreak}
              </span>
              <span className="text-xs text-muted-foreground">يوم متتالي</span>
            </div>
            <span className="text-[11px] text-muted-text font-medium">استمرارية لا تنقطع</span>
          </div>
        </div>

        {/* Habit-by-Habit Performance Breakdown */}
        <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                تفاصيل أداء عاداتك في {currentSnapshot.monthName}
              </h3>
            </div>
            <span className="text-xs text-muted-foreground font-semibold">
              {currentSnapshot.habitStats.length} عادات
            </span>
          </div>

          {currentSnapshot.habitStats.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              لم تتم إضافة عادات بعد لهذا الشهر.
            </p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {currentSnapshot.habitStats.map((h) => (
                <div
                  key={h.habitId}
                  className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-2.5 transition-all"
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
                        إنجاز مستقر
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${h.completionRate}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        h.completionRate >= 80
                          ? 'bg-success'
                          : h.completionRate >= 50
                          ? 'bg-primary'
                          : 'bg-warning'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Highlights / Insights */}
        {currentSnapshot.highlights.length > 0 && (
          <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <span className="text-lg">✨</span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                أبرز ومضات وإشارات الشهر
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentSnapshot.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-secondary border border-border rounded-2xl p-4 flex items-start gap-3"
                >
                  <span className="text-lg flex-shrink-0">🌟</span>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 Self-Reflection Questions ("وقفة مع النفس") */}
        <div className="w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft flex flex-col gap-6">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  وقفة تأمل ذاتي مع واظب
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  أجب بهدوء وصدق لترسيخ عاداتك وبناء وعيك الذاتي
                </p>
              </div>
            </div>

            {savedSuccess && (
              <span className="text-xs font-bold px-3 py-1 bg-success/15 text-success rounded-xl flex items-center gap-1 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>تم الحفظ!</span>
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {/* Question 1 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-black">
                  1
                </span>
                <span>ما هي العادة التي تركت الأثر الإيجابي الأكبر في يومك هذا الشهر؟</span>
              </label>
              <textarea
                value={proudOfAnswer}
                onChange={(e) => setProudOfAnswer(e.target.value)}
                placeholder="مثال: القراءة الصباحية ساعدتني على تصفية ذهني وبدء اليوم بتركيز عالٍ..."
                rows={3}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-text focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            {/* Question 2 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-black">
                  2
                </span>
                <span>ما هي التحديات أو العوائق التي تكررت معك؟ وكيف تنوي تفاديها؟</span>
              </label>
              <textarea
                value={needsAttentionAnswer}
                onChange={(e) => setNeedsAttentionAnswer(e.target.value)}
                placeholder="مثال: التأخر في النوم جعل عادة المشي الصباحي صعبة، سأحدد موعد نوم ثابت..."
                rows={3}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-text focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            {/* Question 3 */}
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-black">
                  3
                </span>
                <span>ما هو هدفك وتركيزك الأساسي للشهر القادم؟</span>
              </label>
              <textarea
                value={nextGoalAnswer}
                onChange={(e) => setNextGoalAnswer(e.target.value)}
                placeholder="مثال: الاستمرار على ورد الأذكار يومياً دون انقطاع وتثبيت يوم راحة للرياضة..."
                rows={3}
                className="w-full bg-secondary border border-border rounded-2xl p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-text focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
            </div>

            <button
              onClick={handleSaveAnswers}
              className="self-end bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-soft transition-all duration-200 active:scale-98 flex items-center gap-2 mt-2"
            >
              <Check className="w-4 h-4" />
              <span>حفظ تأملات الشهر</span>
            </button>
          </div>
        </div>

        {/* Smart Next-Month Recommendation */}
        {currentSnapshot.suggestedAction && (
          <div className="w-full bg-card border border-border rounded-3xl p-6 shadow-soft flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <span className="text-lg">💡</span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  توصية واظب للشهر القادم
                </h3>
                <p className="text-xs text-muted-foreground">
                  اقتراح مبني على مستوى إنجازك لتحسين روتينك بنقرة واحدة
                </p>
              </div>
            </div>

            <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    {currentSnapshot.suggestedAction.title}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {currentSnapshot.suggestedAction.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (currentSnapshot.suggestedAction) {
                    applyReflectionSuggestion(currentSnapshot.suggestedAction.habitId, {
                      restDays: [5, 6], // Add Friday & Saturday as rest days
                    });
                  }
                }}
                disabled={currentSnapshot.suggestedAction.applied}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all flex-shrink-0 self-end sm:self-center ${
                  currentSnapshot.suggestedAction.applied
                    ? 'bg-success/15 text-success cursor-default'
                    : 'bg-foreground text-background hover:bg-foreground/90 active:scale-98 shadow-xs'
                }`}
              >
                {currentSnapshot.suggestedAction.applied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم التطبيق</span>
                  </>
                ) : (
                  <span>تطبيق التوصية ⚡</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppContainer>
  );
}
