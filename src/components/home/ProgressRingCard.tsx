'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getDailyProgress } from '@/utils/date-helpers';

export default function ProgressRingCard() {
  const { habits } = useHabits();
  const progress = getDailyProgress(habits);
  const prevPercentageRef = useRef(progress.percentage);

  // Trigger celebration confetti when hitting 100%
  useEffect(() => {
    if (progress.percentage === 100 && progress.total > 0 && prevPercentageRef.current < 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFFFFF', '#D1D5DB', '#9CA3AF', '#6B7280', '#E5E7EB'],
        });
      } catch {
        // Confetti fallback
      }
    }
    prevPercentageRef.current = progress.percentage;
  }, [progress.percentage, progress.total]);

  // SVG Circular progress calculations
  const size = 96;
  const strokeWidth = 9;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.percentage / 100) * circumference;

  const streakText = progress.longestCurrentStreak > 0
    ? (progress.longestCurrentStreak === 1
        ? 'يوم واحد'
        : progress.longestCurrentStreak === 2
        ? 'يومين'
        : `${progress.longestCurrentStreak} أيام`)
    : 'لا توجد';

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
        {/* Texts & Secondary stats */}
        <div className="flex flex-col gap-3 flex-1 w-full text-right">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
              {progress.total > 0 ? (
                <>
                  أنجزت{' '}
                  <span className="text-foreground font-extrabold">
                    {progress.completed}
                  </span>{' '}
                  من{' '}
                  <span>
                    {progress.total}
                  </span>{' '}
                  اليوم
                </>
              ) : (
                'لا توجد عادات مضافة بعد'
              )}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-1.5">
              <span>أطول سلسلة حالية:</span>
              <span className="text-foreground font-bold">
                {streakText}
              </span>
            </p>
          </div>

          {/* Desktop/Tablet extra badge chips */}
          {progress.total > 0 && (
            <div className="hidden sm:flex items-center gap-2 pt-1 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary text-xs font-semibold text-secondary-foreground">
                <Flame className="w-3.5 h-3.5 text-warning" />
                <span>سلسلة متواصلة</span>
              </div>

              {progress.percentage === 100 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-success-bg border border-success/40 text-xs font-semibold text-success-foreground animate-fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-success" />
                  <span>اكتملت جميع عادات اليوم! 🎉</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center flex-shrink-0 self-center sm:self-auto">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-muted"
            />
            {/* Active Progress */}
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

          {/* Percentage text in center */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tighter">
              {progress.percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
