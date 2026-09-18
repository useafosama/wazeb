'use client';

import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2 } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';

export default function ChallengesList() {
  const { challenges, claimChallengeReward } = useHabits();

  const handleClaim = (id: string) => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
      });
    } catch {
      // Ignore
    }
    claimChallengeReward(id);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning flex items-center justify-center">
          <Trophy className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            التحديات والأوسمة
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            تحديات ذكية مبنية على عاداتك الفعلية لتحفيزك
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {challenges.map((c) => {
          const isCompleted = c.status === 'completed';
          const progressPercent = Math.min(100, Math.round((c.currentProgress / c.target) * 100));

          return (
            <div
              key={c.id}
              className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-bold text-foreground">{c.title}</h4>
                    <span className="text-xs text-muted-foreground">{c.description}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-foreground bg-accent px-2.5 py-1 rounded-xl">
                  {c.currentProgress}/{c.target}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full transition-all ${
                    isCompleted ? 'bg-success' : 'bg-warning'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-warning" />
                  <span>الوسام: {c.rewardBadge}</span>
                </span>

                {isCompleted && (
                  <button
                    onClick={() => handleClaim(c.id)}
                    className={`text-xs font-bold py-1 px-3 rounded-xl transition-all ${
                      c.isClaimed
                        ? 'bg-success-bg text-success-foreground'
                        : 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90'
                    }`}
                  >
                    {c.isClaimed ? 'تم الاستلام ✓' : 'استلام الوسام 🏅'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
