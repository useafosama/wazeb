'use client';

import React, { useState } from 'react';
import { X, Check, HeartHandshake } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { FailureReasonType } from '@/types/habit';
import { FAILURE_REASONS_LABELS } from '@/utils/insights';
import { sounds } from '@/utils/sound';

export default function FailureReasonModal() {
  const { failureModalHabit, setFailureModalHabit, recordFailureReason } = useHabits();
  const [selectedReason, setSelectedReason] = useState<FailureReasonType>('wrong_time');
  const [customNote, setCustomNote] = useState('');

  if (!failureModalHabit) return null;

  const { habit, dateKey } = failureModalHabit;

  const handleClose = () => {
    sounds.playTick();
    setFailureModalHabit(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordFailureReason(habit.id, dateKey, selectedReason, customNote || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-md bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-xl">
              {habit.icon}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>فهم واستمرار</span>
              </div>
              <h3 className="text-lg font-bold text-foreground">
                ليه وقعت في «{habit.name}»؟
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          الانقطاع جزء طبيعي من الرحلة. تحديد السبب بيساعدنا نقترح عليك تعديلات ذكية تناسب نمط حياتك.
        </p>

        {/* Reasons Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
          <div className="flex flex-col gap-2">
            {(Object.keys(FAILURE_REASONS_LABELS) as FailureReasonType[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  sounds.playTick();
                  setSelectedReason(key);
                }}
                className={`w-full p-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all text-right ${
                  selectedReason === key
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-secondary text-foreground hover:bg-muted border border-border'
                }`}
              >
                <span>{FAILURE_REASONS_LABELS[key]}</span>
                {selectedReason === key && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
            ))}
          </div>

          {selectedReason === 'other' && (
            <input
              type="text"
              placeholder="اكتب السبب باختصار..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-input border border-input-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-ring"
            />
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 text-xs shadow-soft mt-2"
          >
            <span>حفظ الملاحظة ومتابعة التقدم</span>
          </button>
        </form>
      </div>
    </div>
  );
}
