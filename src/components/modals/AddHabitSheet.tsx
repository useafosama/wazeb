'use client';

import React, { useState } from 'react';
import { X, Check, Bell } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { HabitFrequency, WeekDay } from '@/types/habit';
import { ARABIC_DAY_LETTERS, getOrderedWeekDays } from '@/utils/date-helpers';
import { sounds } from '@/utils/sound';

const POPULAR_ICONS = [
  '☀️', '🌙', '📖', '🕌', '💧', '🏃', '📚', '🛌',
  '🧘', '🍎', '☕', '✍️', '🎯', '🌿', '🧠', '💪'
];

export default function AddHabitSheet() {
  const { isAddModalOpen, setIsAddModalOpen, addHabit, settings } = useHabits();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('☀️');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([6, 0, 1, 2, 3, 4, 5]);
  const [weeklyTarget, setWeeklyTarget] = useState<number>(3);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [restDays, setRestDays] = useState<WeekDay[]>([]);
  const [showCustomIconInput, setShowCustomIconInput] = useState(false);

  if (!isAddModalOpen) return null;

  const handleClose = () => {
    sounds.playTick();
    setIsAddModalOpen(false);
  };

  const handleToggleDay = (day: WeekDay) => {
    sounds.playTick();
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleToggleRestDay = (day: WeekDay) => {
    sounds.playTick();
    if (restDays.includes(day)) {
      setRestDays(restDays.filter((d) => d !== day));
    } else {
      setRestDays([...restDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      icon: icon || '✨',
      frequency,
      selectedDays: frequency === 'specific_days' ? selectedDays : undefined,
      weeklyTarget: frequency === 'weekly_target' ? weeklyTarget : undefined,
      reminderTime: reminderTime || undefined,
      restDays: restDays.length > 0 ? restDays : undefined,
    });

    // Reset & close
    setName('');
    setIcon('☀️');
    setFrequency('daily');
    setRestDays([]);
    setIsAddModalOpen(false);
  };

  const orderedDays = getOrderedWeekDays(settings.startOfWeek);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground">
              إضافة عادة جديدة
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5">
          {/* Habit Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">
              اسم العادة
            </label>
            <input
              type="text"
              required
              placeholder="مثال: قراءة ورد يومي، شرب الماء، رياضة..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input border border-input-border rounded-2xl px-4 py-3.5 text-foreground placeholder:text-muted-text focus:outline-none focus:border-ring transition-all text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Icon Selection */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground">
                الأيقونة
              </label>
              <button
                type="button"
                onClick={() => setShowCustomIconInput(!showCustomIconInput)}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCustomIconInput ? 'اختيار من القائمة' : 'رمز مخصص'}
              </button>
            </div>

            {showCustomIconInput ? (
              <input
                type="text"
                placeholder="اكتب إيموجي..."
                value={icon}
                maxLength={4}
                onChange={(e) => setIcon(e.target.value)}
                className="w-20 bg-input border border-input-border rounded-2xl px-4 py-3 text-center text-2xl text-foreground focus:outline-none focus:border-ring"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {POPULAR_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      sounds.playTick();
                      setIcon(emoji);
                    }}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      icon === emoji
                        ? 'bg-primary text-primary-foreground shadow-soft scale-110'
                        : 'bg-accent hover:bg-muted'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Frequency */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">
              التكرار
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'daily', label: 'يوميًا' },
                { id: 'specific_days', label: 'أيام محددة' },
                { id: 'weekly_target', label: 'مرات أسبوعيًا' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    sounds.playTick();
                    setFrequency(tab.id as HabitFrequency);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    frequency === tab.id
                      ? 'bg-secondary text-secondary-foreground border border-border shadow-sm'
                      : 'bg-input text-muted-foreground border border-transparent hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Specific Days Picker */}
            {frequency === 'specific_days' && (
              <div className="flex justify-between gap-1.5 pt-2">
                {orderedDays.map((d) => {
                  const isSelected = selectedDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleToggleDay(d)}
                      className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-soft'
                          : 'bg-input text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {ARABIC_DAY_LETTERS[d]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Weekly Target Picker */}
            {frequency === 'weekly_target' && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={weeklyTarget}
                  onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-sm font-bold text-foreground min-w-[60px] text-left">
                  {weeklyTarget} مرات
                </span>
              </div>
            )}
          </div>

          {/* Rest Days (أيام الراحة المخططة 🌙) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <span>🌙</span>
                <span>أيام الراحة الأسبوعية (اختياري)</span>
              </label>
              {restDays.length > 0 && (
                <span className="text-[10px] text-primary font-bold">
                  {restDays.length} أيام راحة
                </span>
              )}
            </div>

            <div className="flex justify-between gap-1.5">
              {orderedDays.map((d) => {
                const isRest = restDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleToggleRestDay(d)}
                    className={`flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
                      isRest
                        ? 'bg-secondary text-primary border-primary/50 shadow-soft'
                        : 'bg-input text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    {ARABIC_DAY_LETTERS[d]}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-muted-text">
              يوم الراحة المخطط لا يكسر سلسلتك ولا يخفض نسبة إنجازك.
            </span>
          </div>

          {/* Reminder Time */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>وقت التذكير (اختياري)</span>
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full bg-input border border-input-border rounded-2xl px-4 py-3 text-foreground text-sm font-medium focus:outline-none focus:border-ring"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-soft mt-2"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>حفظ العادة</span>
          </button>
        </form>
      </div>
    </div>
  );
}
