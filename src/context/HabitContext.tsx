'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Habit,
  UserSettings,
  ThemeMode,
  StartOfWeek,
  Language,
  FailureReasonEntry,
  FailureReasonType,
  HabitInsight,
  HabitInsightAction,
  Challenge,
  DayScoreFactors,
  NotificationSettings,
  Achievement,
  MonthlyReflectionSnapshot,
} from '@/types/habit';
import { getSampleHabits } from '@/utils/sample-data';
import { getTodayKey } from '@/utils/date-helpers';
import { calculateDayScore } from '@/utils/day-score';
import { generateOrUpdateChallenges } from '@/utils/challenges';
import { generateHabitInsights } from '@/utils/insights';
import { evaluateAchievements } from '@/utils/achievement-engine';
import { generateMonthlyReflection, getCurrentMonthKey } from '@/utils/monthly-reflection';
import { WazebStorage, WazebStoredState, DEFAULT_SETTINGS } from '@/utils/storage';
import { sounds } from '@/utils/sound';

interface HabitContextType {
  habits: Habit[];
  settings: UserSettings;
  isHydrated: boolean;
  isStorageCorrupted: boolean;
  hasLocalBackup: boolean;
  selectedHabit: Habit | null;
  isAddModalOpen: boolean;
  isQuickCompleteOpen: boolean;
  failureModalHabit: { habit: Habit; dateKey: string } | null;
  selectedDate: string;
  dayScore: DayScoreFactors;
  challenges: Challenge[];
  insights: HabitInsight[];
  failureReasons: FailureReasonEntry[];
  achievements: Achievement[];
  featuredAchievements: Achievement[];
  featuredAchievementIds: string[];
  unlockedAchievementToast: Achievement | null;
  monthlyReflections: Record<string, MonthlyReflectionSnapshot>;
  setSelectedDate: (date: string) => void;
  setSelectedHabit: (habit: Habit | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setIsQuickCompleteOpen: (open: boolean) => void;
  setFailureModalHabit: (data: { habit: Habit; dateKey: string } | null) => void;
  toggleHabitCompletion: (habitId: string, dateKey?: string) => void;
  toggleHabitRestDate: (habitId: string, dateKey?: string) => void;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => Habit;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  recordFailureReason: (habitId: string, dateKey: string, reason: FailureReasonType, note?: string) => void;
  applyInsightAction: (insightId: string, action: HabitInsightAction) => void;
  dismissInsight: (insightId: string) => void;
  claimChallengeReward: (challengeId: string) => void;
  toggleFeatureAchievement: (achievementId: string) => boolean;
  dismissUnlockToast: () => void;
  recordCalendarVisited: () => void;
  recordStatsVisited: () => void;
  saveMonthlyReflection: (snapshot: MonthlyReflectionSnapshot) => void;
  getMonthlyReflection: (monthKey?: string) => MonthlyReflectionSnapshot;
  applyReflectionSuggestion: (habitId: string, updates: Partial<Habit>) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  updateNotificationSettings: (newNotif: Partial<NotificationSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  setStartOfWeek: (start: StartOfWeek) => void;
  setLanguage: (lang: Language) => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => { success: boolean; error?: string };
  restoreLocalBackup: () => boolean;
  resetAllData: () => void;
  resetToSampleData: () => void;
  requestNotifications: () => Promise<boolean>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [failureReasons, setFailureReasons] = useState<FailureReasonEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [dismissedInsightIds, setDismissedInsightIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isStorageCorrupted, setIsStorageCorrupted] = useState(false);

  // Achievement state
  const [unlockedTimestamps, setUnlockedTimestamps] = useState<Record<string, string>>({});
  const [featuredAchievementIds, setFeaturedAchievementIds] = useState<string[]>([]);
  const [unlockedAchievementToast, setUnlockedAchievementToast] = useState<Achievement | null>(null);
  const [calendarVisited, setCalendarVisited] = useState(false);
  const [statsVisited, setStatsVisited] = useState(false);

  // Monthly Reflection state
  const [monthlyReflections, setMonthlyReflections] = useState<Record<string, MonthlyReflectionSnapshot>>({});
  
  // Modals state
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickCompleteOpen, setIsQuickCompleteOpen] = useState(false);
  const [failureModalHabit, setFailureModalHabit] = useState<{ habit: Habit; dateKey: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());

  const isInitialLoad = useRef(true);

  // Helper to apply theme class
  const applyThemeToDOM = useCallback((theme: ThemeMode, isChick: boolean = false) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    root.classList.remove('dark', 'light');

    if (theme === 'system') {
      const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDarkOS ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }

    if (isChick) {
      root.classList.add('chick-mode');
    } else {
      root.classList.remove('chick-mode');
    }
  }, []);

  // Hydrate from WazebStorage on mount
  useEffect(() => {
    try {
      const stored = WazebStorage.getState();
      setIsStorageCorrupted(WazebStorage.isCorrupted());

      setHabits(stored.habits || []);
      setSettings(stored.settings || DEFAULT_SETTINGS);
      setFailureReasons(stored.failureReasons || []);
      setChallenges(stored.challenges || []);
      setUnlockedTimestamps(stored.unlockedTimestamps || {});
      setFeaturedAchievementIds(stored.featuredAchievementIds || ['first_step', 'starter_streak', 'consistency_master']);
      setMonthlyReflections(stored.monthlyReflections || {});
      setDismissedInsightIds(stored.dismissedInsightIds || []);

      applyThemeToDOM(stored.settings?.theme || 'dark', Boolean(stored.settings?.isChickMode));
    } catch (e) {
      console.error('Failed to load Wazeb state from storage:', e);
      setIsStorageCorrupted(true);
    } finally {
      setIsHydrated(true);
      isInitialLoad.current = false;
    }
  }, [applyThemeToDOM]);

  // Check URL query parameters on mount (e.g. for PWA shortcuts)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'quick-complete') {
        setIsQuickCompleteOpen(true);
      }
    }
  }, []);

  // Sync theme & Chick Mode to document element
  useEffect(() => {
    if (!isHydrated) return;
    applyThemeToDOM(settings.theme, Boolean(settings.isChickMode));

    if (settings.theme === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyThemeToDOM('system', Boolean(settings.isChickMode));
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [settings.theme, settings.isChickMode, isHydrated, applyThemeToDOM]);

  // Persist full state immediately whenever any meaningful state changes
  useEffect(() => {
    if (!isHydrated || isInitialLoad.current) return;

    const fullState: WazebStoredState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      habits,
      settings,
      failureReasons,
      challenges,
      unlockedTimestamps,
      featuredAchievementIds,
      monthlyReflections,
      dismissedInsightIds,
    };

    WazebStorage.saveState(fullState);
  }, [
    habits,
    settings,
    failureReasons,
    challenges,
    unlockedTimestamps,
    featuredAchievementIds,
    monthlyReflections,
    dismissedInsightIds,
    isHydrated,
  ]);

  // Derive dynamic challenges whenever habits change
  useEffect(() => {
    if (isHydrated && habits.length > 0) {
      setChallenges((prev) => {
        return generateOrUpdateChallenges(habits, prev);
      });
    }
  }, [habits, isHydrated]);

  // Save settings helper
  const updateSettings = useCallback(
    (updates: Partial<UserSettings>) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateNotificationSettings = useCallback(
    (newNotif: Partial<NotificationSettings>) => {
      setSettings((prev) => {
        const baseNotifs: NotificationSettings = {
          enabled: true,
          habitReminders: true,
          progressAlerts: true,
          streakAlerts: true,
          challengeAlerts: true,
          recoveryAlerts: true,
          smartTimeSuggestions: true,
          ...(prev.notificationSettings || {}),
        };
        return {
          ...prev,
          notificationSettings: { ...baseNotifs, ...newNotif },
        };
      });
    },
    []
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => {
      applyThemeToDOM(theme, Boolean(settings.isChickMode));
      updateSettings({ theme });
    },
    [updateSettings, applyThemeToDOM, settings.isChickMode]
  );

  const setStartOfWeek = useCallback(
    (startOfWeek: StartOfWeek) => {
      updateSettings({ startOfWeek });
    },
    [updateSettings]
  );

  const setLanguage = useCallback(
    (language: Language) => {
      updateSettings({ language });
    },
    [updateSettings]
  );

  // Toggle habit completion
  const toggleHabitCompletion = useCallback(
    (habitId: string, dateKey: string = getTodayKey()) => {
      setHabits((prev) => {
        const next = prev.map((habit) => {
          if (habit.id === habitId) {
            const isCurrentlyCompleted = Boolean(habit.completions[dateKey]);
            const newCompletions = { ...habit.completions };

            if (isCurrentlyCompleted) {
              delete newCompletions[dateKey];
              sounds.playUndo();
            } else {
              newCompletions[dateKey] = true;
              sounds.playComplete();
            }

            return {
              ...habit,
              completions: newCompletions,
            };
          }
          return habit;
        });

        setSelectedHabit((curr) => {
          if (curr && curr.id === habitId) {
            const found = next.find((h) => h.id === habitId);
            return found || null;
          }
          return curr;
        });

        return next;
      });
    },
    []
  );

  // Toggle one-off rest day date for a habit
  const toggleHabitRestDate = useCallback(
    (habitId: string, dateKey: string = getTodayKey()) => {
      sounds.playTick();
      setHabits((prev) => {
        const next = prev.map((habit) => {
          if (habit.id === habitId) {
            const currentRestDates = habit.restDates || [];
            const isAlreadyRest = currentRestDates.includes(dateKey);
            const updatedRestDates = isAlreadyRest
              ? currentRestDates.filter((d) => d !== dateKey)
              : [...currentRestDates, dateKey];

            return {
              ...habit,
              restDates: updatedRestDates,
            };
          }
          return habit;
        });

        setSelectedHabit((curr) => {
          if (curr && curr.id === habitId) {
            const found = next.find((h) => h.id === habitId);
            return found || null;
          }
          return curr;
        });

        return next;
      });
    },
    []
  );

  // Add habit
  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>): Habit => {
      sounds.playComplete();
      const newHabit: Habit = {
        ...habitData,
        id: `habit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        completions: {},
        restDays: habitData.restDays || [],
        restDates: habitData.restDates || [],
      };

      setHabits((prev) => [newHabit, ...prev]);
      return newHabit;
    },
    []
  );

  // Update habit
  const updateHabit = useCallback(
    (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
      sounds.playTick();
      setHabits((prev) => {
        const next = prev.map((h) => (h.id === id ? { ...h, ...updates } : h));
        setSelectedHabit((curr) => {
          if (curr && curr.id === id) {
            return { ...curr, ...updates };
          }
          return curr;
        });
        return next;
      });
    },
    []
  );

  // Delete habit
  const deleteHabit = useCallback(
    (id: string) => {
      sounds.playUndo();
      setHabits((prev) => prev.filter((h) => h.id !== id));
      setSelectedHabit(null);
    },
    []
  );

  // Failure reasons
  const recordFailureReason = useCallback(
    (habitId: string, dateKey: string, reason: FailureReasonType, note?: string) => {
      sounds.playTick();
      const entry: FailureReasonEntry = {
        id: `fail_${Date.now()}`,
        habitId,
        date: dateKey,
        reason,
        customNote: note,
        createdAt: new Date().toISOString(),
      };
      setFailureReasons((prev) => [entry, ...prev]);
    },
    []
  );

  // Dynamic Insights
  const allInsights = generateHabitInsights(habits, failureReasons);
  const activeInsights = allInsights.filter((i) => !dismissedInsightIds.includes(i.id));

  // Insights actions
  const applyInsightAction = useCallback(
    (insightId: string, action: HabitInsightAction) => {
      sounds.playComplete();
      const targetInsight = allInsights.find((i) => i.id === insightId);
      if (targetInsight && targetInsight.habitId) {
        if (action.type === 'change_time' && action.value) {
          updateHabit(targetInsight.habitId, { reminderTime: action.value });
        } else if (action.type === 'change_frequency') {
          updateHabit(targetInsight.habitId, { frequency: 'weekly_target', weeklyTarget: 3 });
        }
      }

      setDismissedInsightIds((prev) => [...prev, insightId]);
    },
    [allInsights, updateHabit]
  );

  const dismissInsight = useCallback((insightId: string) => {
    sounds.playTick();
    setDismissedInsightIds((prev) => [...prev, insightId]);
  }, []);

  // Claim challenge reward
  const claimChallengeReward = useCallback(
    (challengeId: string) => {
      sounds.playCelebration();
      setChallenges((prev) => {
        return prev.map((c) => (c.id === challengeId ? { ...c, isClaimed: true } : c));
      });
    },
    []
  );

  // Calculate live Day Score
  const dayScore = calculateDayScore(habits, getTodayKey());

  // Evaluate Achievements
  const achievements = evaluateAchievements({
    habits,
    challenges,
    failureReasons,
    calendarVisited,
    statsVisited,
    unlockedTimestamps,
  });

  // Featured Achievements
  const featuredAchievements = achievements.filter((a) => featuredAchievementIds.includes(a.id));

  // Auto-detect newly unlocked achievements
  useEffect(() => {
    if (!isHydrated) return;

    const newlyUnlocked: Achievement[] = [];
    const updatedTimestamps = { ...unlockedTimestamps };
    let hasNew = false;

    achievements.forEach((ach) => {
      if (ach.unlocked && !unlockedTimestamps[ach.id]) {
        hasNew = true;
        const now = new Date().toISOString();
        updatedTimestamps[ach.id] = now;
        newlyUnlocked.push({ ...ach, unlockedAt: now });
      }
    });

    if (hasNew) {
      setUnlockedTimestamps(updatedTimestamps);
      if (newlyUnlocked.length > 0) {
        sounds.playComplete();
        setUnlockedAchievementToast(newlyUnlocked[0]);
      }
    }
  }, [achievements, isHydrated, unlockedTimestamps]);

  // Toggle Featured Achievement (Max 3)
  const toggleFeatureAchievement = useCallback(
    (achievementId: string): boolean => {
      sounds.playTick();
      if (featuredAchievementIds.includes(achievementId)) {
        setFeaturedAchievementIds((prev) => prev.filter((id) => id !== achievementId));
        return true;
      } else {
        if (featuredAchievementIds.length >= 3) {
          return false;
        }
        setFeaturedAchievementIds((prev) => [...prev, achievementId]);
        return true;
      }
    },
    [featuredAchievementIds]
  );

  const dismissUnlockToast = useCallback(() => {
    setUnlockedAchievementToast(null);
  }, []);

  const recordCalendarVisited = useCallback(() => {
    setCalendarVisited(true);
  }, []);

  const recordStatsVisited = useCallback(() => {
    setStatsVisited(true);
  }, []);

  // Save Monthly Reflection Snapshot
  const saveMonthlyReflection = useCallback(
    (snapshot: MonthlyReflectionSnapshot) => {
      sounds.playComplete();
      setMonthlyReflections((prev) => ({
        ...prev,
        [snapshot.monthKey]: snapshot,
      }));
    },
    []
  );

  // Get or Generate Monthly Reflection Snapshot
  const getMonthlyReflection = useCallback(
    (monthKey: string = getCurrentMonthKey()): MonthlyReflectionSnapshot => {
      if (monthlyReflections[monthKey]) {
        return monthlyReflections[monthKey];
      }
      return generateMonthlyReflection(habits, challenges, achievements, monthKey);
    },
    [monthlyReflections, habits, challenges, achievements]
  );

  // Apply Reflection Suggestion
  const applyReflectionSuggestion = useCallback(
    (habitId: string, updates: Partial<Habit>) => {
      sounds.playComplete();
      updateHabit(habitId, updates);
      const currentMonthKey = getCurrentMonthKey();
      const existing = monthlyReflections[currentMonthKey];
      if (existing && existing.suggestedAction) {
        saveMonthlyReflection({
          ...existing,
          suggestedAction: {
            ...existing.suggestedAction,
            applied: true,
          },
        });
      }
    },
    [updateHabit, monthlyReflections, saveMonthlyReflection]
  );

  // Export JSON
  const exportDataJSON = useCallback((): string => {
    return WazebStorage.exportData();
  }, []);

  // Import JSON
  const importDataJSON = useCallback(
    (jsonString: string): { success: boolean; error?: string } => {
      const result = WazebStorage.importData(jsonString);
      if (result.success && result.state) {
        setHabits(result.state.habits || []);
        setSettings(result.state.settings || DEFAULT_SETTINGS);
        setFailureReasons(result.state.failureReasons || []);
        setChallenges(result.state.challenges || []);
        setUnlockedTimestamps(result.state.unlockedTimestamps || {});
        setFeaturedAchievementIds(result.state.featuredAchievementIds || []);
        setMonthlyReflections(result.state.monthlyReflections || {});
        setDismissedInsightIds(result.state.dismissedInsightIds || []);
        setIsStorageCorrupted(false);
        sounds.playCelebration();
        return { success: true };
      }
      return { success: false, error: result.error || 'الملف غير صالح' };
    },
    []
  );

  // Restore local backup
  const restoreLocalBackup = useCallback((): boolean => {
    const restored = WazebStorage.restoreBackup();
    if (restored) {
      setHabits(restored.habits || []);
      setSettings(restored.settings || DEFAULT_SETTINGS);
      setFailureReasons(restored.failureReasons || []);
      setChallenges(restored.challenges || []);
      setUnlockedTimestamps(restored.unlockedTimestamps || {});
      setFeaturedAchievementIds(restored.featuredAchievementIds || []);
      setMonthlyReflections(restored.monthlyReflections || {});
      setDismissedInsightIds(restored.dismissedInsightIds || []);
      setIsStorageCorrupted(false);
      sounds.playCelebration();
      return true;
    }
    return false;
  }, []);

  // Reset all data
  const resetAllData = useCallback(() => {
    sounds.playUndo();
    const empty = WazebStorage.resetState();
    setHabits(empty.habits);
    setSettings(empty.settings);
    setFailureReasons(empty.failureReasons);
    setChallenges(empty.challenges);
    setUnlockedTimestamps(empty.unlockedTimestamps);
    setFeaturedAchievementIds(empty.featuredAchievementIds);
    setMonthlyReflections(empty.monthlyReflections);
    setSelectedHabit(null);
    setIsStorageCorrupted(false);
  }, []);

  // Reset to sample data
  const resetToSampleData = useCallback(() => {
    sounds.playComplete();
    const samples = getSampleHabits();
    setHabits(samples);
    setFailureReasons([]);
    setSelectedHabit(null);
  }, []);

  // Notifications
  const requestNotifications = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('الإشعارات غير مدعومة في هذا المتصفح');
      return false;
    }
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    updateSettings({ notificationsEnabled: granted });
    if (granted) {
      new Notification('واظب', {
        body: settings.isChickMode
          ? '🐣 تم تفعيل التنبيهات! جاهز تبقى أشطر كتكوت؟'
          : 'تم تفعيل التنبيهات بنجاح! واظب على عاداتك اليومية.',
        icon: '/icons/icon-192x192.png',
      });
    }
    return granted;
  }, [updateSettings, settings.isChickMode]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        settings,
        isHydrated,
        isStorageCorrupted,
        hasLocalBackup: WazebStorage.hasBackup(),
        selectedHabit,
        isAddModalOpen,
        isQuickCompleteOpen,
        failureModalHabit,
        selectedDate,
        dayScore,
        challenges,
        insights: activeInsights,
        failureReasons,
        achievements,
        featuredAchievements,
        featuredAchievementIds,
        unlockedAchievementToast,
        monthlyReflections,
        setSelectedDate,
        setSelectedHabit,
        setIsAddModalOpen,
        setIsQuickCompleteOpen,
        setFailureModalHabit,
        toggleHabitCompletion,
        toggleHabitRestDate,
        addHabit,
        updateHabit,
        deleteHabit,
        recordFailureReason,
        applyInsightAction,
        dismissInsight,
        claimChallengeReward,
        toggleFeatureAchievement,
        dismissUnlockToast,
        recordCalendarVisited,
        recordStatsVisited,
        saveMonthlyReflection,
        getMonthlyReflection,
        applyReflectionSuggestion,
        updateSettings,
        updateNotificationSettings,
        setTheme,
        setStartOfWeek,
        setLanguage,
        exportDataJSON,
        importDataJSON,
        restoreLocalBackup,
        resetAllData,
        resetToSampleData,
        requestNotifications,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
