'use client';

import React from 'react';
import { X, Lock, Pin, PinOff, Calendar, Award, CheckCircle2, Sparkles } from 'lucide-react';
import { Achievement } from '@/types/habit';
import { useHabits } from '@/context/HabitContext';

interface AchievementDetailModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementDetailModal({ achievement, onClose }: AchievementDetailModalProps) {
  const { featuredAchievementIds, toggleFeatureAchievement } = useHabits();

  if (!achievement) return null;

  const { id, title, description, icon, category, rarity, requirement, currentProgress, unlocked, unlockedAt, isSecret, hint } = achievement;
  const isFeatured = featuredAchievementIds.includes(id);
  const isLockedSecret = !unlocked && isSecret;
  const percent = Math.min(100, Math.round((currentProgress / requirement) * 100));

  const formatArabicDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-EG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleTogglePin = () => {
    const success = toggleFeatureAchievement(id);
    if (!success) {
      alert('يمكنك تثبيت 3 أوسمة كحد أقصى في المميزة. قم بإزالة وسام آخر أولاً.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            تفاصيل الوسام
          </span>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center Stage */}
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-soft ${
              unlocked
                ? 'bg-secondary border-2 border-border animate-fade-in'
                : 'bg-muted/40 border border-border/40 grayscale opacity-60'
            }`}
          >
            {isLockedSecret ? '🔒' : icon}
          </div>

          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-secondary text-foreground border border-border">
                {category}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {rarity === 'legendary'
                  ? 'أسطوري 👑'
                  : rarity === 'epic'
                  ? 'ملحمي 💎'
                  : rarity === 'rare'
                  ? 'نادر ⭐'
                  : rarity === 'uncommon'
                  ? 'مميز ✨'
                  : 'شائع 🌱'}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-foreground tracking-tight mt-1">
              {isLockedSecret ? 'وسام سري غير مكتشف' : title}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mt-1">
              {isLockedSecret
                ? 'أكمل بعض الإنجازات واكتشف أسرار واظب لتفتح هذا الوسام النادر.'
                : description}
            </p>

            {isLockedSecret && hint && (
              <div className="mt-2 p-2.5 bg-secondary/60 rounded-xl border border-border text-[11px] text-muted-foreground">
                <span className="font-bold text-foreground">💡 تلميح: </span>
                <span>{hint}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status / Requirement Details */}
        <div className="bg-secondary/60 border border-border rounded-2xl p-4 flex flex-col gap-3">
          {unlocked ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم فتح هذا الوسام بنجاح!</span>
              </div>
              {unlockedAt && (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>تم الحصول عليه في {formatArabicDate(unlockedAt)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>متطلبات الفتح</span>
                </span>
                <span className="text-foreground">
                  {currentProgress} / {requirement}
                </span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  style={{ width: `${percent}%` }}
                  className="h-full bg-primary rounded-full transition-all duration-500"
                />
              </div>

              <span className="text-[10px] text-muted-foreground">
                متبقي {Math.max(0, requirement - currentProgress)} لإتمام هذا الوسام
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
          {unlocked && (
            <button
              onClick={handleTogglePin}
              className={`flex-1 font-bold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] border shadow-soft ${
                isFeatured
                  ? 'bg-secondary hover:bg-muted text-foreground border-border'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground border-primary'
              }`}
            >
              {isFeatured ? (
                <>
                  <PinOff className="w-4 h-4 text-muted-foreground" />
                  <span>إزالة من الأوسمة المميزة</span>
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4 fill-current" />
                  <span>تثبيت في الأوسمة المميزة (3 أوسمة)</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-secondary hover:bg-muted text-foreground border border-border font-bold text-xs py-3.5 px-6 rounded-2xl transition-all active:scale-[0.98]"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
