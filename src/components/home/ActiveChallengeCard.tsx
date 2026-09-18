'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Check, Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';

export default function ActiveChallengeCard() {
  const { challenges, claimChallengeReward } = useHabits();

  if (!challenges || challenges.length === 0) return null;

  // Pick top active challenge
  const activeChallenge = challenges.find((c) => c.status === 'active') || challenges[0];

  const handleClaim = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore
    }
    claimChallengeReward(activeChallenge.id);
  };

  const progressPercent = Math.min(100, Math.round((activeChallenge.currentProgress / activeChallenge.target) * 100));
  const isCompleted = activeChallenge.status === 'completed';
  const remaining = Math.max(0, activeChallenge.target - activeChallenge.currentProgress);

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 shadow-soft transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-warning-bg text-warning flex items-center justify-center text-xl flex-shrink-0">
            {activeChallenge.icon || '🏆'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-muted-foreground uppercase">
                تحدي الأسبوع
              </span>
              {isCompleted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success-bg text-success-foreground">
                  مكتمل ✓
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-foreground">
              {activeChallenge.title}
            </h4>
          </div>
        </div>

        <div className="text-xs font-extrabold text-foreground bg-secondary px-2.5 py-1 rounded-xl">
          {activeChallenge.currentProgress}/{activeChallenge.target}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
        {activeChallenge.description}
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-3">
        <div
          style={{ width: `${progressPercent}%` }}
          className={`h-full rounded-full transition-all duration-500 ${
            isCompleted ? 'bg-success' : 'bg-warning'
          }`}
        />
      </div>

      {/* Footer message / action */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <span className="text-muted-foreground font-medium">
          {isCompleted ? (
            <span className="text-success-foreground font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أحسنت! أكملت التحدي بنجاح</span>
            </span>
          ) : remaining === 1 ? (
            'باقي خطوة واحدة لإكمال التحدي!'
          ) : (
            `باقي ${remaining} لإكمال التحدي`
          )}
        </span>

        {isCompleted && !activeChallenge.isClaimed && (
          <button
            onClick={handleClaim}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-1 px-3 rounded-xl transition-all text-xs active:scale-95 shadow-soft"
          >
            استلام الوسام 🏅
          </button>
        )}
      </div>
    </div>
  );
}
