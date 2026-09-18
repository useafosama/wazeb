/**
 * Wazeb Centralized Storage & Persistence Engine
 * Versioned LocalStorage with Automatic Backups, Schema Validation, and Migration
 */

import { Habit, UserSettings, FailureReasonEntry, Challenge, MonthlyReflectionSnapshot } from '@/types/habit';

export const WAZEB_DATA_VERSION = 1;

export const STORAGE_KEYS = {
  MAIN: 'wazeb_state_v1',
  BACKUP: 'wazeb_state_backup_v1',
  INSTALL_DISMISSED: 'wazeb_install_dismissed_v1',
  // Legacy keys for automatic migration
  LEGACY_HABITS: 'wazeb_habits_v1',
  LEGACY_SETTINGS: 'wazeb_settings_v1',
  LEGACY_FAILURES: 'wazeb_failures_v1',
  LEGACY_CHALLENGES: 'wazeb_challenges_v1',
  LEGACY_UNLOCKED: 'wazeb_unlocked_achievements_v1',
  LEGACY_FEATURED: 'wazeb_featured_achievements_v1',
  LEGACY_REFLECTIONS: 'wazeb_monthly_reflections_v1',
};

export interface WazebStoredState {
  version: number;
  updatedAt: string;
  habits: Habit[];
  settings: UserSettings;
  failureReasons: FailureReasonEntry[];
  challenges: Challenge[];
  unlockedTimestamps: Record<string, string>;
  featuredAchievementIds: string[];
  monthlyReflections: Record<string, MonthlyReflectionSnapshot>;
  dismissedInsightIds: string[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  isChickMode: false,
  chickXP: 0,
  chickLevel: 1,
  chickUnlockedCosmetics: ['classic_egg'],
  chickEquippedCosmetic: 'classic_egg',
  notificationsEnabled: false,
  notificationTime: '20:00',
  startOfWeek: 6, // Saturday
  language: 'ar',
  soundEnabled: true,
  hapticEnabled: true,
  reducedMotion: false,
  notificationSettings: {
    enabled: true,
    habitReminders: true,
    progressAlerts: true,
    streakAlerts: true,
    challengeAlerts: true,
    recoveryAlerts: true,
    smartTimeSuggestions: true,
  },
};

export function getDefaultState(): WazebStoredState {
  return {
    version: WAZEB_DATA_VERSION,
    updatedAt: new Date().toISOString(),
    habits: [],
    settings: { ...DEFAULT_SETTINGS },
    failureReasons: [],
    challenges: [],
    unlockedTimestamps: {},
    featuredAchievementIds: [],
    monthlyReflections: {},
    dismissedInsightIds: [],
  };
}

/**
 * Validates whether an object conforms to the expected Wazeb state structure
 */
export function validateState(obj: unknown): obj is WazebStoredState {
  if (!obj || typeof obj !== 'object') return false;
  const s = obj as Partial<WazebStoredState>;
  if (!Array.isArray(s.habits)) return false;
  if (!s.settings || typeof s.settings !== 'object') return false;
  return true;
}

export interface StorageAdapter {
  getState(): WazebStoredState;
  saveState(state: WazebStoredState): boolean;
  createBackup(state: WazebStoredState): void;
  restoreBackup(): WazebStoredState | null;
  exportData(): string;
  importData(jsonString: string): { success: boolean; error?: string; state?: WazebStoredState };
  resetState(): WazebStoredState;
  hasBackup(): boolean;
  isCorrupted(): boolean;
}

class LocalWazebStorage implements StorageAdapter {
  private corruptedFlag = false;

  public isCorrupted(): boolean {
    return this.corruptedFlag;
  }

  public hasBackup(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem(STORAGE_KEYS.BACKUP));
  }

  /**
   * Migrate legacy fragmented LocalStorage keys if present
   */
  private migrateLegacyKeys(): WazebStoredState | null {
    if (typeof window === 'undefined') return null;

    try {
      const storedHabits = localStorage.getItem(STORAGE_KEYS.LEGACY_HABITS);
      if (!storedHabits) return null;

      const habits: Habit[] = JSON.parse(storedHabits);
      const settings: UserSettings = localStorage.getItem(STORAGE_KEYS.LEGACY_SETTINGS)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_SETTINGS)!)
        : { ...DEFAULT_SETTINGS };

      const failureReasons = localStorage.getItem(STORAGE_KEYS.LEGACY_FAILURES)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_FAILURES)!)
        : [];

      const challenges = localStorage.getItem(STORAGE_KEYS.LEGACY_CHALLENGES)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_CHALLENGES)!)
        : [];

      const unlockedTimestamps = localStorage.getItem(STORAGE_KEYS.LEGACY_UNLOCKED)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_UNLOCKED)!)
        : {};

      const featuredAchievementIds = localStorage.getItem(STORAGE_KEYS.LEGACY_FEATURED)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_FEATURED)!)
        : [];

      const monthlyReflections = localStorage.getItem(STORAGE_KEYS.LEGACY_REFLECTIONS)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.LEGACY_REFLECTIONS)!)
        : {};

      const migratedState: WazebStoredState = {
        version: WAZEB_DATA_VERSION,
        updatedAt: new Date().toISOString(),
        habits,
        settings: { ...DEFAULT_SETTINGS, ...settings },
        failureReasons,
        challenges,
        unlockedTimestamps,
        featuredAchievementIds,
        monthlyReflections,
        dismissedInsightIds: [],
      };

      // Save to unified key and backup
      this.saveState(migratedState);
      return migratedState;
    } catch (e) {
      console.error('Error during legacy data migration:', e);
      return null;
    }
  }

  /**
   * Get current state with error boundary and automatic backup restoration
   */
  public getState(): WazebStoredState {
    if (typeof window === 'undefined') {
      return getDefaultState();
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MAIN);

      if (!raw) {
        // Check for legacy data to migrate
        const legacy = this.migrateLegacyKeys();
        if (legacy) return legacy;

        // Fresh install
        const defaultState = getDefaultState();
        this.saveState(defaultState);
        return defaultState;
      }

      const parsed = JSON.parse(raw);
      if (validateState(parsed)) {
        this.corruptedFlag = false;
        // Merge missing fields safely if any
        return {
          version: parsed.version || WAZEB_DATA_VERSION,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
          habits: parsed.habits || [],
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          failureReasons: parsed.failureReasons || [],
          challenges: parsed.challenges || [],
          unlockedTimestamps: parsed.unlockedTimestamps || {},
          featuredAchievementIds: parsed.featuredAchievementIds || [],
          monthlyReflections: parsed.monthlyReflections || {},
          dismissedInsightIds: parsed.dismissedInsightIds || [],
        };
      } else {
        throw new Error('Data validation failed');
      }
    } catch (e) {
      console.error('LocalStorage data corruption detected:', e);
      this.corruptedFlag = true;

      // Try restore from backup
      const restored = this.restoreBackup();
      if (restored) {
        this.corruptedFlag = false;
        return restored;
      }

      // Safe fallback
      return getDefaultState();
    }
  }

  /**
   * Save state with immediate automatic backup
   */
  public saveState(state: WazebStoredState): boolean {
    if (typeof window === 'undefined') return false;

    try {
      // 1. Create backup of previous state if valid
      const currentRaw = localStorage.getItem(STORAGE_KEYS.MAIN);
      if (currentRaw) {
        localStorage.setItem(STORAGE_KEYS.BACKUP, currentRaw);
      }

      // 2. Write new state immediately
      const stateToSave: WazebStoredState = {
        ...state,
        version: WAZEB_DATA_VERSION,
        updatedAt: new Date().toISOString(),
      };

      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem(STORAGE_KEYS.MAIN, serialized);

      // Keep legacy keys in sync for backward compatibility
      try {
        localStorage.setItem(STORAGE_KEYS.LEGACY_HABITS, JSON.stringify(state.habits));
        localStorage.setItem(STORAGE_KEYS.LEGACY_SETTINGS, JSON.stringify(state.settings));
        localStorage.setItem(STORAGE_KEYS.LEGACY_CHALLENGES, JSON.stringify(state.challenges));
        localStorage.setItem(STORAGE_KEYS.LEGACY_FAILURES, JSON.stringify(state.failureReasons));
        localStorage.setItem(STORAGE_KEYS.LEGACY_UNLOCKED, JSON.stringify(state.unlockedTimestamps));
        localStorage.setItem(STORAGE_KEYS.LEGACY_FEATURED, JSON.stringify(state.featuredAchievementIds));
        localStorage.setItem(STORAGE_KEYS.LEGACY_REFLECTIONS, JSON.stringify(state.monthlyReflections));
      } catch {
        // Ignore legacy sync errors
      }

      return true;
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
      return false;
    }
  }

  /**
   * Save a designated backup
   */
  public createBackup(state: WazebStoredState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(state));
    } catch (e) {
      console.error('Error creating backup:', e);
    }
  }

  /**
   * Restore from backup copy
   */
  public restoreBackup(): WazebStoredState | null {
    if (typeof window === 'undefined') return null;
    try {
      const rawBackup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!rawBackup) return null;
      const parsed = JSON.parse(rawBackup);
      if (validateState(parsed)) {
        localStorage.setItem(STORAGE_KEYS.MAIN, rawBackup);
        return parsed;
      }
      return null;
    } catch (e) {
      console.error('Error restoring from backup:', e);
      return null;
    }
  }

  /**
   * Export all Wazeb data as formatted JSON
   */
  public exportData(): string {
    const state = this.getState();
    const exportPayload = {
      app: 'Wazeb',
      exportedAt: new Date().toISOString(),
      version: WAZEB_DATA_VERSION,
      state,
    };
    return JSON.stringify(exportPayload, null, 2);
  }

  /**
   * Import data with strict schema validation
   */
  public importData(jsonString: string): { success: boolean; error?: string; state?: WazebStoredState } {
    try {
      const parsed = JSON.parse(jsonString);

      let targetState: unknown = parsed;
      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        targetState = parsed.state;
      }

      if (!validateState(targetState)) {
        return {
          success: false,
          error: 'الملف لا يحتوي على بيانات واظب صالحة.',
        };
      }

      const validatedState: WazebStoredState = {
        version: WAZEB_DATA_VERSION,
        updatedAt: new Date().toISOString(),
        habits: (targetState as WazebStoredState).habits || [],
        settings: { ...DEFAULT_SETTINGS, ...((targetState as WazebStoredState).settings || {}) },
        failureReasons: (targetState as WazebStoredState).failureReasons || [],
        challenges: (targetState as WazebStoredState).challenges || [],
        unlockedTimestamps: (targetState as WazebStoredState).unlockedTimestamps || {},
        featuredAchievementIds: (targetState as WazebStoredState).featuredAchievementIds || [],
        monthlyReflections: (targetState as WazebStoredState).monthlyReflections || {},
        dismissedInsightIds: (targetState as WazebStoredState).dismissedInsightIds || [],
      };

      this.saveState(validatedState);
      return { success: true, state: validatedState };
    } catch {
      return {
        success: false,
        error: 'تعذر قراءة ملف النسخة الاحتياطية. تأكد من صحة التنسيق.',
      };
    }
  }

  /**
   * Safe Reset to defaults
   */
  public resetState(): WazebStoredState {
    const emptyState: WazebStoredState = {
      version: WAZEB_DATA_VERSION,
      updatedAt: new Date().toISOString(),
      habits: [],
      settings: { ...DEFAULT_SETTINGS },
      failureReasons: [],
      challenges: [],
      unlockedTimestamps: {},
      featuredAchievementIds: [],
      monthlyReflections: {},
      dismissedInsightIds: [],
    };
    this.saveState(emptyState);
    return emptyState;
  }
}

export const WazebStorage = new LocalWazebStorage();
