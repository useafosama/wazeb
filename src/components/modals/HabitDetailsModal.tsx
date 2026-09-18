'use client';

import React, { useState } from 'react';
import { X, Trash2, Edit3, Flame, Trophy, Percent, CheckCircle, Bell, Moon } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { WeekDay } from '@/types/habit';
import { calculateHabitStats, formatStreakTextArabic, getTodayKey, getHabitDayStatus, ARABIC_DAY_LETTERS, getOrderedWeekDays } from '@/utils/date-helpers';
import HabitContributionGrid from '../home/HabitContributionGrid';
import { sounds } from '@/utils/sound';

export default function HabitDetailsModal() {
  const { selectedHabit, setSelectedHabit, updateHabit, deleteHabit, toggleHabitCompletion, toggleHabitRestDate, settings } = useHabits();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editReminder, setEditReminder] = useState('');
  const [editRestDays, setEditRestDays] = useState<WeekDay[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedHabit) return null;

  const stats = calculateHabitStats(selectedHabit);
  const todayKey = getTodayKey();
  const todayStatus = getHabitDayStatus(selectedHabit, todayKey);
  const isCompletedToday = todayStatus === 'COMPLETED';
  const isRestToday = todayStatus === 'REST';

  const handleClose = () => {
    sounds.playTick();
    setSelectedHabit(null);
    setIsEditing(false);
    setShowDeleteConfirm(false);
  };

  const handleStartEdit = () => {
    sounds.playTick();
    setEditName(selectedHabit.name);
    setEditIcon(selectedHabit.icon);
    setEditReminder(selectedHabit.reminderTime || '');
    setEditRestDays(selectedHabit.restDays || []);
    setIsEditing(true);
  };

  const handleToggleEditRestDay = (day: WeekDay) => {
    sounds.playTick();
    if (editRestDays.includes(day)) {
      setEditRestDays(editRestDays.filter((d) => d !== day));
    } else {
      setEditRestDays([...editRestDays, day]);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateHabit(selectedHabit.id, {
      name: editName.trim(),
      icon: editIcon || '✨',
      reminderTime: editReminder || undefined,
      restDays: editRestDays.length > 0 ? editRestDays : undefined,
    });
    setIsEditing(false);
  };

  const orderedDays = getOrderedWeekDays(settings.startOfWeek);

  const handleDelete = () => {
    deleteHabit(selectedHabit.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 max-h-[92vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-accent border border-border flex items-center justify-center text-2xl">
              {selectedHabit.icon}
            </span>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-foreground">
                {selectedHabit.name}
              </h2>
              {selectedHabit.reminderTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Bell className="w-3 h-3" />
                  <span>تذكير {selectedHabit.reminderTime}</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Normal details view */}
        {!isEditing ? (
          <div className="flex flex-col gap-6 pt-5">
            {/* Quick Today Toggle & Rest Day Option */}
            <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground">حالة اليوم</span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1.5 mt-0.5">
                  {isCompletedToday ? (
                    'تم إنجازها اليوم ✓'
                  ) : isRestToday ? (
                    <span className="flex items-center gap-1 text-primary">
                      <span>🌙</span>
                      <span>يوم راحة مخطط (لا يكسر السلسلة)</span>
                    </span>
                  ) : (
                    'لم تُنجز بعد اليوم'
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleHabitRestDate(selectedHabit.id, todayKey)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                    isRestToday
                      ? 'bg-primary/20 text-primary border-primary/40'
                      : 'bg-card text-muted-foreground border-border hover:text-foreground'
                  }`}
                  title="تفعيل أو إلغاء راحة اليوم"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{isRestToday ? 'إلغاء الراحة' : 'راحة اليوم 🌙'}</span>
                </button>

                <button
                  onClick={() => toggleHabitCompletion(selectedHabit.id, todayKey)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    isCompletedToday
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-card text-foreground border border-border hover:border-muted-foreground'
                  }`}
                >
                  {isCompletedToday ? 'تراجع' : 'تسجيل الإنجاز'}
                </button>
              </div>
            </div>

            {/* 4 Key Statistics Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Current Streak */}
              <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-warning-foreground">
                  <Flame className="w-4 h-4 text-warning" />
                  <span className="text-xs font-medium">سلسلتك الحالية</span>
                </div>
                <span className="text-2xl font-black text-foreground">
                  {stats.currentStreak}{' '}
                  <span className="text-xs font-normal text-muted-foreground">أيام</span>
                </span>
                <span className="text-[10px] text-muted-foreground">يوم الراحة لا يكسرها 🔥</span>
              </div>

              {/* Longest Streak */}
              <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-warning-foreground">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-xs font-medium">أطول سلسلة</span>
                </div>
                <span className="text-2xl font-black text-foreground">
                  {stats.longestStreak}{' '}
                  <span className="text-xs font-normal text-muted-foreground">أيام</span>
                </span>
              </div>

              {/* Completion Rate */}
              <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Percent className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">نسبة الإنجاز (30 يوم)</span>
                </div>
                <span className="text-2xl font-black text-foreground">
                  {stats.completionRate}%
                </span>
                {stats.restDaysCount !== undefined && stats.restDaysCount > 0 && (
                  <span className="text-[10px] text-primary font-medium">
                    {stats.restDaysCount} أيام راحة غير محسوبة بالسلب
                  </span>
                )}
              </div>

              {/* Total Completions */}
              <div className="bg-secondary border border-border rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-success-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium">إجمالي الإنجازات</span>
                </div>
                <span className="text-2xl font-black text-foreground">
                  {stats.totalCompletions}{' '}
                  <span className="text-xs font-normal text-muted-foreground">مرة</span>
                </span>
              </div>
            </div>

            {/* History Grid */}
            <div className="flex flex-col gap-2 bg-secondary border border-border rounded-2xl p-4">
              <span className="text-xs font-semibold text-muted-foreground">سجل النشاط</span>
              <HabitContributionGrid habit={selectedHabit} weeksCount={16} />
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleStartEdit}
                className="flex-1 bg-secondary hover:bg-muted text-foreground font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 text-sm border border-border"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل العادة</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-3.5 bg-destructive-bg hover:bg-destructive-bg/80 text-destructive-foreground border border-destructive/30 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف</span>
              </button>
            </div>

            {/* Delete Confirmation Sheet */}
            {showDeleteConfirm && (
              <div className="p-4 bg-destructive-bg border border-destructive/40 rounded-2xl flex flex-col gap-3 animate-fade-in">
                <p className="text-xs text-destructive-foreground font-semibold text-center">
                  هل أنت متأكد من حذف عادة &quot;{selectedHabit.name}&quot;؟ سيتم مسح كامل سجلها.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold py-2 rounded-xl text-xs shadow-sm"
                  >
                    نعم، احذف العادة
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-muted font-bold py-2 rounded-xl text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 pt-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">اسم العادة</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-input border border-input-border rounded-2xl px-4 py-3 text-foreground text-sm font-medium focus:outline-none focus:border-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">الأيقونة</label>
              <input
                type="text"
                value={editIcon}
                maxLength={4}
                onChange={(e) => setEditIcon(e.target.value)}
                className="w-20 bg-input border border-input-border rounded-2xl px-4 py-3 text-center text-2xl text-foreground focus:outline-none focus:border-ring"
              />
            </div>

            {/* Edit Rest Days */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">أيام الراحة الأسبوعية (اختياري 🌙)</label>
              <div className="flex justify-between gap-1.5">
                {orderedDays.map((d) => {
                  const isRest = editRestDays.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleToggleEditRestDay(d)}
                      className={`flex-1 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
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
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">وقت التذكير</label>
              <input
                type="time"
                value={editReminder}
                onChange={(e) => setEditReminder(e.target.value)}
                className="w-full bg-input border border-input-border rounded-2xl px-4 py-3 text-foreground text-sm font-medium focus:outline-none focus:border-ring"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl text-sm shadow-soft"
              >
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 bg-secondary text-secondary-foreground hover:bg-muted font-bold rounded-2xl text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
