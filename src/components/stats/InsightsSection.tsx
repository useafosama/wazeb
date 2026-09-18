'use client';

import React from 'react';
import { Sparkles, Lightbulb, ArrowLeft, X, HeartHandshake } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { FAILURE_REASONS_LABELS } from '@/utils/insights';

export default function InsightsSection() {
  const { insights, applyInsightAction, dismissInsight, failureReasons, habits } = useHabits();

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Dynamic Insights & Pattern Alerts */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-warning-bg text-warning flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              رؤى ذكية واقتراحات مخصصة
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              تحليل تلقائي لعاداتك لمساعدتك على الاستمرار بأقل مقاومة
            </p>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="p-4 bg-secondary rounded-2xl border border-border text-center text-xs text-muted-foreground">
            أنت في مسار ممتاز! لم نرصد أي أنماط انقطاع حالياً. استمر على نفس الوتيرة.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-2.5 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground">
                    {insight.title}
                  </h4>
                  <button
                    onClick={() => dismissInsight(insight.id)}
                    className="text-muted-foreground hover:text-foreground p-1"
                    title="تجاهل"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>

                {insight.suggestedAction && (
                  <button
                    onClick={() => applyInsightAction(insight.id, insight.suggestedAction!)}
                    className="self-start bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-soft mt-1"
                  >
                    <span>{insight.suggestedAction.label}</span>
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Failure Insights Log ("ليه وقعت؟") */}
      {failureReasons.length > 0 && (
        <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-bold text-foreground">
              سجل ملاحظات «ليه وقعت؟»
            </h4>
          </div>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {failureReasons.map((f) => {
              const habit = habits.find((h) => h.id === f.habitId);
              return (
                <div
                  key={f.id}
                  className="bg-secondary rounded-xl p-2.5 border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{habit?.icon || '🌱'}</span>
                    <span className="font-bold text-foreground">{habit?.name || 'عادة'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {FAILURE_REASONS_LABELS[f.reason] || f.reason}
                    </span>
                    <span className="text-[10px] text-muted-text">{f.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
