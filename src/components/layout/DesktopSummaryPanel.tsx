'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getDailyProgress, getTodayKey, formatDateKey, ARABIC_DAY_LETTERS } from '@/utils/date-helpers';
import SakinahPromoCard from '@/components/sakinah/SakinahPromoCard';
import ChickWeeklyCard from '@/components/chick/ChickWeeklyCard';
import { sounds } from '@/utils/sound';

export default function DesktopSummaryPanel() {
  const { habits, settings } = useHabits();
  const progress = getDailyProgress(habits);
  const todayKey = getTodayKey();
  const isChick = Boolean(settings.isChickMode);

  // Weekly mini sparkline
  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = formatDateKey(d);
    let count = 0;
    habits.forEach((h) => {
      if (h.completions[key]) count++;
    });
    weekDays.push({
      dateKey: key,
      dayNum: d.getDate(),
      dayLetter: ARABIC_DAY_LETTERS[d.getDay()],
      count,
      isToday: i === 0,
    });
  }

  const maxDaily = Math.max(habits.length, 1);

  return (
    <aside className="hidden xl:flex flex-col w-80 2xl:w-88 h-[calc(100vh-2rem)] sticky top-4 gap-4 flex-shrink-0 select-none overflow-y-auto no-scrollbar pb-6">
      {/* 1. Chick Weekly Card (if Chick mode is active) */}
      {isChick && <ChickWeeklyCard />}

      {/* 2. Quick Streak & Stats Card */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">
            {isChick ? 'ملخص شطارتك' : 'ملخص اليوم'}
          </span>
          <Link
            href="/stats"
            onClick={() => sounds.playTick()}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <span>التفاصيل</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-secondary rounded-2xl p-3.5 flex flex-col gap-1 border border-border">
            <div className="flex items-center gap-1.5 text-warning-foreground text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-warning" />
              <span>أعلى سلسلة</span>
            </div>
            <span className="text-xl font-extrabold text-foreground">
              {progress.longestCurrentStreak} <span className="text-xs font-normal text-muted-foreground">أيام</span>
            </span>
          </div>

          <div className="bg-secondary rounded-2xl p-3.5 flex flex-col gap-1 border border-border">
            <div className="flex items-center gap-1.5 text-success-foreground text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
              <span>المنجز اليوم</span>
            </div>
            <span className="text-xl font-extrabold text-foreground">
              {progress.completed}/{progress.total}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Mini Weekly Trend Sparkline */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3">
        <span className="text-xs font-bold text-muted-foreground">نشاط الأسبوع</span>

        <div className="flex items-end justify-between gap-1.5 h-24 pt-2 px-1">
          {weekDays.map((day) => {
            const heightPercent = Math.max(Math.round((day.count / maxDaily) * 100), day.count > 0 ? 15 : 6);
            return (
              <div key={day.dateKey} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[18px] h-full flex items-end bg-accent rounded-md overflow-hidden p-0.5">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-sm transition-all duration-300 ${
                      day.isToday
                        ? 'bg-primary'
                        : day.count > 0
                        ? 'bg-muted-foreground'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-bold ${day.isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {day.dayLetter}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Cross-Product Ecosystem Card: Sakinah */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-muted-foreground px-1">اكتشف من واظب</span>
        <SakinahPromoCard />
      </div>

      {/* 5. Daily Tip / Motivational Quote */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <span>{isChick ? '🐣' : '💡'}</span>
          <span>{isChick ? 'همسة الكتكوت' : 'فكرة اليوم'}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {isChick
            ? 'خطوة واحدة صغيرة كل يوم هي اللي بتبني بطل حقيقي. خليك واثق في نفسك! 💛'
            : '«أحب الأعمال إلى الله أدومها وإن قل». ابدأ بخطوات بسيطة وواظب عليها يومياً لبناء عادات تدوم.'}
        </p>
      </div>
    </aside>
  );
}
