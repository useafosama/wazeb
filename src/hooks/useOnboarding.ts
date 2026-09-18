'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_ONBOARDING_COMPLETED = 'wazeb_onboarding_completed_v1';
const STORAGE_KEY_ONBOARDING_STEP = 'wazeb_onboarding_step_v1';

export function useOnboarding() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(true); // default true to prevent flash

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const isCompleted = localStorage.getItem(STORAGE_KEY_ONBOARDING_COMPLETED);
      if (isCompleted === 'true') {
        setHasCompleted(true);
      } else {
        setHasCompleted(false);
        // Automatically open onboarding for first-time users
        setIsOnboardingOpen(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const startTour = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_ONBOARDING_COMPLETED);
        localStorage.setItem(STORAGE_KEY_ONBOARDING_STEP, '0');
      } catch {}
    }
    setHasCompleted(false);
    setIsOnboardingOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsOnboardingOpen(false);
  }, []);

  const completeTour = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ONBOARDING_COMPLETED, 'true');
        localStorage.removeItem(STORAGE_KEY_ONBOARDING_STEP);
      } catch {}
    }
    setHasCompleted(true);
    setIsOnboardingOpen(false);
  }, []);

  return {
    isOnboardingOpen,
    hasCompleted,
    startTour,
    closeTour,
    completeTour,
  };
}
