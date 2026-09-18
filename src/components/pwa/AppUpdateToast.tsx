'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X } from 'lucide-react';
import { sounds } from '@/utils/sound';

export default function AppUpdateToast() {
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    const handleServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (!registration) return;

        // Check if there's already a waiting worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowUpdateToast(true);
        }

        // Listen for new worker installed
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowUpdateToast(true);
            }
          });
        });
      } catch (err) {
        console.warn('Could not inspect ServiceWorker updates:', err);
      }
    };

    handleServiceWorker();
  }, []);

  const handleApplyUpdate = () => {
    sounds.playLevelUp();
    setIsUpdating(true);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    sounds.playTick();
    setShowUpdateToast(false);
  };

  if (!showUpdateToast) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-card border-2 border-primary/40 rounded-3xl p-4 sm:p-5 shadow-soft-lg flex flex-col gap-3 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                تحديث جديد لواظب 🚀
              </span>
              <h4 className="text-sm font-bold text-foreground">
                نسخة أحدث متوفرة الآن
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="إغلاق الإشعار"
            className="w-7 h-7 rounded-xl bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          تم نشر تحسينات جديدة للتطبيق. حدّث الآن للاستفادة منها، وبيانات عاداتك محفوظة بالكامل دون أي مساس.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-soft transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isUpdating ? 'جارٍ التحديث...' : 'تحديث الآن'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="px-3.5 py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground font-bold text-xs transition-colors"
          >
            لاحقًا
          </button>
        </div>
      </div>
    </div>
  );
}
