'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  TrendingUp,
  Brain,
  Clock,
  Link2,
  Search,
  Moon,
  Trophy,
  Target,
  BookOpen,
  ShieldCheck,
  Rocket,
  Check,
} from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import ChickModeToggle from '@/components/chick/ChickModeToggle';
import { sounds } from '@/utils/sound';
import confetti from 'canvas-confetti';

const STORAGE_KEY_ONBOARDING_COMPLETED = 'wazeb_onboarding_completed_v1';
const STORAGE_KEY_ONBOARDING_STEP = 'wazeb_onboarding_step_v1';

const TOTAL_STEPS = 10;

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function OnboardingTourModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingTourModalProps) {
  const { settings, setTheme } = useHabits();

  // Load saved step progress or default to 0
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isChickActivating, setIsChickActivating] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem(STORAGE_KEY_ONBOARDING_STEP);
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum < TOTAL_STEPS) {
          setCurrentStep(stepNum);
        }
      }
    }
  }, [isOpen]);

  // Save step progress in localStorage
  const updateStep = useCallback((step: number) => {
    setCurrentStep(step);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ONBOARDING_STEP, step.toString());
      } catch {
        // Ignore
      }
    }
  }, []);

  const handleNext = useCallback(() => {
    sounds.playTick();
    if (currentStep < TOTAL_STEPS - 1) {
      updateStep(currentStep + 1);
    } else {
      handleFinish();
    }
  }, [currentStep, updateStep]);

  const handlePrev = useCallback(() => {
    sounds.playTick();
    if (currentStep > 0) {
      updateStep(currentStep - 1);
    }
  }, [currentStep, updateStep]);

  const handleSkip = useCallback(() => {
    sounds.playTick();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ONBOARDING_COMPLETED, 'true');
        localStorage.removeItem(STORAGE_KEY_ONBOARDING_STEP);
      } catch {}
    }
    onClose();
  }, [onClose]);

  const handleFinish = useCallback(() => {
    sounds.playCelebration();
    setShowCelebration(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
    });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ONBOARDING_COMPLETED, 'true');
        localStorage.removeItem(STORAGE_KEY_ONBOARDING_STEP);
      } catch {}
    }

    setTimeout(() => {
      setShowCelebration(false);
      onComplete();
    }, 2200);
  }, [onComplete]);

  // Keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // In RTL, left arrow moves forward
        handleNext();
      } else if (e.key === 'ArrowRight') {
        // In RTL, right arrow moves back
        handlePrev();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleSkip]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // In RTL: swipe left = next, swipe right = previous
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Chick Mode activation micro animation
  const handleToggleChickModeOnboarding = () => {
    sounds.playCelebration();
    setIsChickActivating(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#FBBF24', '#F59E0B', '#FCD34D'],
    });

    setTimeout(() => {
      setIsChickActivating(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-background/85 backdrop-blur-md animate-fade-in select-none">
      {/* Main Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-card border-0 sm:border border-border sm:rounded-3xl shadow-soft-lg flex flex-col justify-between overflow-hidden relative"
      >
        {/* Top Bar: Skip button & Progress Dots */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-foreground">واظب</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {currentStep + 1} / {TOTAL_STEPS}
            </span>
          </div>

          {/* Progress Dots Indicator */}
          <div className="flex items-center gap-1.5" dir="ltr">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sounds.playTick();
                  updateStep(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                    ? 'w-2 bg-primary/40'
                    : 'w-2 bg-muted'
                }`}
                aria-label={`انتقل إلى الشاشة ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 rounded-xl transition-colors"
          >
            تخطي
          </button>
        </div>

        {/* Screen Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-center animate-fade-in">
          {/* SCREEN 1 — WELCOME */}
          {currentStep === 0 && (
            <div className="flex flex-col items-center text-center gap-5 my-auto">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-4xl shadow-soft animate-bounce-short">
                🌱
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  أهلًا بك في واظب 👋
                </h2>
                <p className="text-sm sm:text-base font-bold text-primary">
                  مكانك الجديد عشان تبني عاداتك… وتفضل واظب عليها.
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  واظب مش مجرد Habit Tracker عادي. هو نظام شخصي متكامل يساعدك تفهم عاداتك، تتابع تقدمك بذكاء، وتبني الاستمرارية الحقيقية يومًا بعد يوم.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-sm pt-2">
                <div className="bg-secondary border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
                  <span className="text-lg">⚡</span>
                  <span className="text-[11px] font-bold text-foreground">سريع وخفيف</span>
                </div>
                <div className="bg-secondary border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
                  <span className="text-lg">🌙</span>
                  <span className="text-[11px] font-bold text-foreground">أيام راحة</span>
                </div>
                <div className="bg-secondary border border-border rounded-2xl p-3 flex flex-col items-center gap-1">
                  <span className="text-lg">🔐</span>
                  <span className="text-[11px] font-bold text-foreground">بياناتك محلية</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2 — DAILY HABITS */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-5 my-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center text-2xl flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    ابدأ بعاداتك اليومية
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    أضف عاداتك، حدد مواعيدها، وكل يوم سجل إنجازك بضغطة واحدة
                  </p>
                </div>
              </div>

              {/* Sample Habit Cards Preview */}
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: '🤲', name: 'أذكار الصباح', time: '07:00 ص', done: true },
                  { icon: '📖', name: 'قراءة القرآن', time: '08:00 ص', done: true },
                  { icon: '💧', name: 'شرب الماء (2 لتر)', time: 'طوال اليوم', done: false },
                  { icon: '🏃‍♂️', name: 'ممارسة الرياضة', time: '05:30 م', done: false },
                  { icon: '📚', name: 'قراءة 10 صفحات', time: '09:00 م', done: false },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-secondary border border-border rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-card flex items-center justify-center text-base">
                        {item.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.done ? 'bg-primary text-primary-foreground' : 'border border-border'
                      }`}
                    >
                      {item.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-center text-xs font-bold text-primary">
                💡 &quot;إنجاز واحد صغير كل يوم = فرق كبير مع الوقت.&quot;
              </div>
            </div>
          )}

          {/* SCREEN 3 — STREAKS */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-5 my-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-warning/15 text-warning flex items-center justify-center text-2xl flex-shrink-0">
                  🔥
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    خليك واظب
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    واظب بيحوّل الاستمرارية لحاجة تشوفها وتحتفل بيها قدامك
                  </p>
                </div>
              </div>

              {/* Streak Showcase Card */}
              <div className="p-5 bg-secondary border border-border rounded-3xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h4 className="text-base font-extrabold text-foreground">7 أيام متتالية!</h4>
                      <span className="text-xs text-muted-foreground">سلسلة مستمرة لا تنقطع</span>
                    </div>
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-warning/20 text-warning rounded-xl">
                    سلسلة قياسية
                  </span>
                </div>

                {/* Contribution Grid Preview */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="text-[11px] font-bold text-muted-foreground">سجل الالتزام (GitHub Style):</span>
                  <div className="grid grid-cols-12 gap-1.5 p-3 bg-card rounded-2xl border border-border">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-md transition-all ${
                          i % 5 === 0
                            ? 'bg-primary'
                            : i % 7 === 0
                            ? 'bg-primary/60'
                            : i % 3 === 0
                            ? 'bg-primary/30'
                            : 'bg-muted/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card border border-border rounded-2xl p-3 text-center">
                  <span className="text-xs text-muted-foreground">أطول سلسلة</span>
                  <p className="text-lg font-black text-foreground mt-0.5">24 يوم</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-3 text-center">
                  <span className="text-xs text-muted-foreground">نسبة الانتظام</span>
                  <p className="text-lg font-black text-foreground mt-0.5">94%</p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4 — DAY SCORE */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-5 my-auto items-center text-center">
              <div className="flex flex-col gap-1 max-w-md">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Wazeb Day Score
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  اعرف درجة يومك 🎯
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  واظب بيحسب درجة يومك بناءً على إنجازك واستمراريتك وأهدافك
                </p>
              </div>

              {/* Big Score Gauge Preview */}
              <div className="p-6 bg-secondary border border-border rounded-3xl flex flex-col items-center gap-3 w-full max-w-sm shadow-soft">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" strokeDasharray={301} strokeDashoffset={40} strokeLinecap="round" fill="transparent" className="text-primary" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-foreground">87</span>
                    <span className="text-[10px] text-muted-foreground">من 100</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-black text-foreground">87؟ يوم ممتاز 👏</span>
                  <p className="text-xs text-muted-foreground">
                    خطوات واثقة ومستوى استمرارية عالي. بكرة نقدر نخليه أفضل.
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-muted-foreground">
                الدرجة وسيلة تحفيز مرنة وليست حكمًا على أدائك.
              </span>
            </div>
          )}

          {/* SCREEN 5 — SMART FEATURES */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4 my-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  واظب بيفهم عاداتك 🧠
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  أدوات ذكية تقترح وتساعدك تبني روتين مناسب لجدولك
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-secondary border border-border rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base flex-shrink-0">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Wazeb Coach</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      يفهم نمط إنجازك ويقترح تحسينات مناسبة لروتينك.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary border border-border rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-base flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">التذكير الذكي</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      يقترح أوقات التنبيه بناءً على وقت إنجازك الفعلي.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary border border-border rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base flex-shrink-0">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Habit Stacking</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      اربط عاداتك الجديدة بعاداتك اليومية الراسخة.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary border border-border rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center text-base flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">رؤى &quot;ليه وقعت؟&quot;</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      لو عادة بتفوتك كتير، واظب يساعدك تعرف السبب بدون لوم.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center font-medium">
                &quot;واظب يقترح… وإنت صاحب القرار.&quot;
              </p>
            </div>
          )}

          {/* SCREEN 6 — REST DAYS */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-5 my-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl flex-shrink-0">
                  🌙
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    الراحة جزء من الاستمرارية
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    مش كل يوم لازم يكون يوم إنجاز ومجهود
                  </p>
                </div>
              </div>

              <div className="p-5 bg-secondary border border-border rounded-3xl flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌙</span>
                    <span className="text-sm font-bold text-foreground">يوم راحة مخطط (Rest Day)</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    راحة مستحقة
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  حدد أيام راحة أسبوعية أو استثنائية دون أي شعور بالذنب:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-card rounded-xl border border-border">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>لا يكسر السلسلة (Streak)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card rounded-xl border border-border">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>لا يقلل درجة اليوم</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card rounded-xl border border-border">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>لا يرسل إشعارات إزعاج</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-card rounded-xl border border-border">
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span>لا يخفض نسبة الالتزام</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 7 — ACHIEVEMENTS */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-5 my-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-warning/15 text-warning flex items-center justify-center text-2xl flex-shrink-0 animate-pulse">
                  🏆
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    كل خطوة ليها إنجاز
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    خزانة أوسمة وجوائز تتفتح تلقائياً مع التزامك
                  </p>
                </div>
              </div>

              {/* Badges Preview Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {[
                  { icon: '🌱', title: 'أول خطوة', tier: 'البداية' },
                  { icon: '🔥', title: '7 أيام', tier: 'الاستمرار' },
                  { icon: '🔥🔥', title: '30 يوم', tier: 'المواظبة' },
                  { icon: '💎', title: '100 يوم', tier: 'الأسطورة' },
                  { icon: '💯', title: 'يوم كامل', tier: 'الكمال' },
                  { icon: '🏆', title: 'أول تحدي', tier: 'التحديات' },
                  { icon: '👑', title: 'بطل التحدي', tier: 'الإنجاز' },
                  { icon: '🌙', title: 'راحة واعية', tier: 'التوازن' },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="p-3 bg-secondary border border-border rounded-2xl flex flex-col items-center text-center gap-1 hover:scale-105 transition-all"
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-[11px] font-bold text-foreground truncate w-full">{b.title}</span>
                    <span className="text-[9px] text-muted-foreground">{b.tier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 8 — CHALLENGES + REFLECTION */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-4 my-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  مش بس بتتابع… إنت بتتطور 🚀
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  تحديات أسبوعية ومراجعات شهرية هادئة تعكس نموك
                </p>
              </div>

              {/* Challenges Card */}
              <div className="p-4 bg-secondary border border-border rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning/10 text-warning flex items-center justify-center text-lg flex-shrink-0">
                  ⚡
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">التحديات التلقائية</span>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    تحديات ذكية (مثل 7 أيام متتالية، أو أسبوع كامل) تفتح لك XP وأوسمة خاصة.
                  </p>
                </div>
              </div>

              {/* Monthly Reflection Card */}
              <div className="p-4 bg-secondary border border-border rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg flex-shrink-0">
                  📊
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">المراجعة الشهرية (Reflection)</span>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    في نهاية كل شهر، راجع درجاتك وإنجازاتك وأجب عن 3 أسئلة تأمل ذاتي لحفظ مسارك.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 9 — 🐣 CHICK MODE (وضع أشطر كتكوت) */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-5 my-auto items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-warning/20 border border-warning/40 text-warning flex items-center justify-center text-4xl shadow-soft animate-bounce-short">
                🐣
              </div>

              <div className="flex flex-col gap-1.5 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  جاهز تقابل أشطر كتكوت؟ 🐣
                </h2>
                <p className="text-xs sm:text-sm text-primary font-bold">
                  وضع اختياري مبهج يحول واظب لتجربة مليئة بالمرح والتشجيع
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  الكتكوت يتفاعل مع تقدمك اليومي، يمنحك Chick XP، مستويات جديدة، أزياء وقبعات، ورسائل تشجيع لطيفة.
                </p>
              </div>

              {/* Chick Mode Live Interactive Toggle */}
              <div className="p-5 bg-secondary border border-border rounded-3xl flex flex-col items-center gap-3.5 w-full max-w-sm shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-sm font-black text-foreground">
                    {settings.isChickMode ? 'وضع الكتكوت مفعل حالياً! 🐣' : 'جرب وضع أشطر كتكوت'}
                  </span>
                </div>

                <div
                  onClick={handleToggleChickModeOnboarding}
                  className={`transition-all duration-300 ${isChickActivating ? 'scale-110' : ''}`}
                >
                  <ChickModeToggle className="w-full justify-center text-sm py-2 px-5" />
                </div>

                <span className="text-[11px] text-muted-foreground">
                  يمكنك تفعيله أو إيقافه في أي لحظة من الزاوية العلوية للتطبيق.
                </span>
              </div>
            </div>
          )}

          {/* SCREEN 10 — PRIVACY + FINISH */}
          {currentStep === 9 && (
            <div className="flex flex-col gap-5 my-auto items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-4xl shadow-soft">
                🔐
              </div>

              <div className="flex flex-col gap-2 max-w-md">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  بياناتك ملكك بالكامل 🔐
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  واظب يعمل محلياً بالكامل (Zero Backend). جميع عاداتك وسجلاتك محفوظة بأمان على جهازك وتعمل بدون إنترنت.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm text-xs">
                <div className="p-3 bg-secondary rounded-2xl border border-border flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>حفظ محلي فوري</span>
                </div>
                <div className="p-3 bg-secondary rounded-2xl border border-border flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>عمل بدون إنترنت</span>
                </div>
                <div className="p-3 bg-secondary rounded-2xl border border-border flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>تطبيق ويب PWA</span>
                </div>
                <div className="p-3 bg-secondary rounded-2xl border border-border flex items-center gap-2 font-bold text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>تصدير واستيراد JSON</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-1 max-w-sm">
                <p className="text-xs font-black text-foreground">
                  &quot;ابدأ بعادة واحدة… وخلي الاستمرارية تعمل الباقي.&quot;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Controls */}
        <div className="p-5 border-t border-border/40 flex items-center justify-between gap-3 bg-card/60 backdrop-blur-sm">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-3 bg-secondary hover:bg-muted text-foreground text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < TOTAL_STEPS - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-black rounded-2xl flex items-center gap-2 shadow-soft transition-all active:scale-98"
            >
              <span>{currentStep === 0 ? 'ابدأ الجولة' : 'التالي'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-7 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base font-black rounded-2xl flex items-center gap-2 shadow-soft-lg transition-all active:scale-98"
            >
              <span>ابدأ واظب 🚀</span>
            </button>
          )}
        </div>
      </div>

      {/* Celebration Finish Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-background/90 backdrop-blur-md animate-fade-in p-6 text-center">
          <div className="flex flex-col items-center gap-4 max-w-md animate-scale-up">
            <span className="text-6xl animate-bounce-short">🎉</span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              أهلًا بيك في واظب!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              أول خطوة في أي عادة عظيمة هي إنك تبدأ. رحلتك نحو الاستمرارية تبدأ الآن.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
