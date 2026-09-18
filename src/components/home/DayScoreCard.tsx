'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, TrendingUp, Target, Flame, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';

export default function DayScoreCard() {
  const { dayScore, settings } = useHabits();
  const [isExpanded, setIsExpanded] = useState(false);

  const size = 80;
  const strokeWidth = 7;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (dayScore.total / 100) * circumference;

  const toggleExpand = () => {
    sounds.playTick();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 shadow-soft transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Texts */}
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {settings.isChickMode ? 'درجة شطارتك 🐣' : 'درجة يومك'}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-foreground">
              {settings.isChickMode ? 'Chick Score' : 'Wazeb Score'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            {dayScore.label}
          </h3>

          {dayScore.isAllRestDay && (
            <p className="text-xs text-primary font-medium mt-0.5 flex items-center gap-1.5">
              <span>🌙</span>
              <span>يوم راحة مخطط لجميع العادات — استمتع بيومك الهادئ.</span>
            </p>
          )}

          <button
            onClick={toggleExpand}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground pt-1 transition-colors self-start"
          >
            <span>تفاصيل الحساب</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
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
            <span className="text-lg font-black text-foreground tracking-tight">
              {dayScore.total}
            </span>
            <span className="text-[9px] text-muted-text font-bold">من 100</span>
          </div>
        </div>
      </div>

      {/* Expanded Factor Breakdown */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2.5 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Factor 1 */}
            <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-1 border border-border">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-success" />
                  <span>إنجاز اليوم</span>
                </span>
                <span className="font-bold text-foreground">{dayScore.completion}/50</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${(dayScore.completion / 50) * 100}%` }}
                  className="h-full bg-success rounded-full"
                />
              </div>
            </div>

            {/* Factor 2 */}
            <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-1 border border-border">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3 text-warning" />
                  <span>الاستمرارية</span>
                </span>
                <span className="font-bold text-foreground">{dayScore.consistency}/20</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${(dayScore.consistency / 20) * 100}%` }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </div>

            {/* Factor 3 */}
            <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-1 border border-border">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold">
                  <Target className="w-3 h-3 text-primary" />
                  <span>الأهداف</span>
                </span>
                <span className="font-bold text-foreground">{dayScore.goals}/20</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${(dayScore.goals / 20) * 100}%` }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>

            {/* Factor 4 */}
            <div className="bg-secondary rounded-2xl p-2.5 flex flex-col gap-1 border border-border">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold">
                  <Flame className="w-3 h-3 text-warning" />
                  <span>الانتظام</span>
                </span>
                <span className="font-bold text-foreground">{dayScore.streak}/10</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${(dayScore.streak / 10) * 100}%` }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
