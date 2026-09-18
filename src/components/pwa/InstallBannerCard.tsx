'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { sounds } from '@/utils/sound';

const DISMISS_KEY = 'wazeb_install_banner_dismissed_at_v1';
const COOLDOWN_DAYS = 7;

interface InstallBannerCardProps {
  onOpenGuide?: () => void;
}

export default function InstallBannerCard({ onOpenGuide }: InstallBannerCardProps) {
  const { isInstalled, installApp } = usePWAInstall();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || isInstalled) {
      setIsVisible(false);
      return;
    }

    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const diffMs = Date.now() - parseInt(dismissedAt, 10);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays < COOLDOWN_DAYS) {
        setIsVisible(false);
        return;
      }
    }

    // Delay slight appearance so it's not jarring on initial render
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isInstalled]);

  const handleDismiss = () => {
    sounds.playTick();
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // Ignore
    }
  };

  const handleInstallClick = () => {
    sounds.playTick();
    if (onOpenGuide) {
      onOpenGuide();
    } else {
      installApp();
    }
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="w-full bg-card border border-border rounded-3xl p-5 shadow-soft transition-all duration-300 relative overflow-hidden animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Texts */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl flex-shrink-0">
            📱
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                خليك مع واظب في كل مكان
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                تطبيق الويب
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              ثبّت التطبيق عشان تفتحه بسرعة ويظل جاهز معاك كل يوم حتى بدون إنترنت.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-end sm:self-center flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2.5 rounded-xl transition-colors"
          >
            لاحقًا
          </button>

          <button
            onClick={handleInstallClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black px-4 py-2.5 rounded-xl shadow-soft flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>تثبيت واظب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
