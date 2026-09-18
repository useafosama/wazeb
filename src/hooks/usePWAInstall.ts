'use client';

import { useState, useEffect, useCallback } from 'react';
import { sounds } from '@/utils/sound';
import confetti from 'canvas-confetti';

export type PWAInstallPlatform =
  | 'ios'
  | 'android'
  | 'desktop-chrome'
  | 'desktop-edge'
  | 'desktop-safari'
  | 'desktop-other'
  | 'unknown';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [platform, setPlatform] = useState<PWAInstallPlatform>('unknown');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [installSuccessToast, setInstallSuccessToast] = useState<boolean>(false);

  // Platform and standalone detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect Standalone (Already Installed)
    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);
    const isAndroidApp = document.referrer.includes('android-app://');

    const installed = isStandaloneDisplay || isIOSStandalone || isAndroidApp;
    setIsInstalled(installed);

    // 2. Detect Platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(ua);
    const isEdge = /edg/.test(ua);
    const isChrome = /chrome/.test(ua) && !isEdge;
    const isSafari = /safari/.test(ua) && !isChrome && !isEdge;

    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else if (isChrome) {
      setPlatform('desktop-chrome');
    } else if (isEdge) {
      setPlatform('desktop-edge');
    } else if (isSafari) {
      setPlatform('desktop-safari');
    } else {
      setPlatform('desktop-other');
    }

    // 3. Listen to display-mode change
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener('change', handleDisplayChange);

    // 4. Capture beforeinstallprompt event for native installation
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 5. Listen to appinstalled event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsGuideOpen(false);
      setInstallSuccessToast(true);
      sounds.playCelebration();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => setInstallSuccessToast(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /**
   * Trigger install action
   * If native prompt available, prompts natively.
   * Otherwise opens the tailored visual guide modal.
   */
  const installApp = useCallback(async () => {
    sounds.playTick();

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstalled(true);
          setInstallSuccessToast(true);
          sounds.playCelebration();
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
          setTimeout(() => setInstallSuccessToast(false), 5000);
        }
      } catch (err) {
        console.warn('Native install prompt error:', err);
        setIsGuideOpen(true);
      }
    } else {
      // Manual guide modal for iOS Safari, Desktop instructions, etc.
      setIsGuideOpen(true);
    }
  }, [deferredPrompt]);

  return {
    isInstalled,
    canNativeInstall: Boolean(deferredPrompt),
    platform,
    isGuideOpen,
    setIsGuideOpen,
    installApp,
    installSuccessToast,
    setInstallSuccessToast,
  };
}
