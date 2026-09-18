'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, Trophy, Bell, BellRing, Moon, Sun, Plus, Download } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getFormattedGregorianDate, getFormattedHijriDate } from '@/utils/date-helpers';
import ChickModeToggle from '@/components/chick/ChickModeToggle';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import InstallGuideModal from '@/components/pwa/InstallGuideModal';
import { sounds } from '@/utils/sound';

export default function AppHeader() {
  const { settings, setTheme, requestNotifications, setIsAddModalOpen } = useHabits();
  const { isInstalled, canNativeInstall, platform, isGuideOpen, setIsGuideOpen, installApp, installSuccessToast } = usePWAInstall();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isChick = Boolean(settings.isChickMode);
  const hijriStr = getFormattedHijriDate(new Date(), settings.language);
  const gregorianStr = getFormattedGregorianDate(new Date(), settings.language);

  const toggleThemeQuick = () => {
    sounds.playTick();
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const handleNotificationClick = async () => {
    sounds.playTick();
    const granted = await requestNotifications();
    setToastMessage(granted ? 'تم تفعيل التنبيهات اليومية بنجاح 🔔' : 'تم رفض إذن التنبيهات');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleOpenAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

  return (
    <>
      <header className="pt-1 pb-4 flex flex-col gap-2 relative">
        {/* Mobile / Tablet Header (<1024px) */}
        <div className="flex lg:hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              واظب<span className="text-muted-foreground">.</span>
            </h1>
            <ChickModeToggle />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick PWA Install button on mobile/tablet */}
            {!isInstalled && (
              <button
                onClick={installApp}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shadow-soft"
                title="تثبيت واظب"
                aria-label="تثبيت واظب"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
              </button>
            )}

            {/* Theme switcher */}
            <button
              onClick={toggleThemeQuick}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95 shadow-soft"
              title="تبديل المظهر"
              aria-label="تبديل المظهر"
            >
              {settings.theme === 'dark' ? (
                <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Statistics shortcut */}
            <Link
              href="/stats"
              onClick={() => sounds.playTick()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95 shadow-soft"
              title="الإحصائيات"
              aria-label="الإحصائيات"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Notifications button */}
            <button
              onClick={handleNotificationClick}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 shadow-soft ${
                settings.notificationsEnabled
                  ? 'bg-warning-bg border-warning/40 text-warning-foreground'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground'
              }`}
              title="تفعيل التنبيهات"
              aria-label="تفعيل التنبيهات"
            >
              {settings.notificationsEnabled ? (
                <BellRing className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              ) : (
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Top Greeting Banner (>=1024px) */}
        <div className="hidden lg:flex items-center justify-between pb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-foreground">
                {isChick ? 'صباح الخير يا أشطر كتكوت! 🐣' : 'مرحبًا بك، استمر في بناء عاداتك 🌱'}
              </h2>
              <ChickModeToggle />
            </div>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              {hijriStr} • {gregorianStr}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isInstalled && (
              <button
                onClick={installApp}
                className="bg-secondary hover:bg-accent border border-border text-foreground font-bold py-2.5 px-4 rounded-2xl flex items-center gap-2 shadow-soft transition-all active:scale-98 text-xs"
              >
                <Download className="w-4 h-4 text-primary stroke-[2.2]" />
                <span>تثبيت واظب</span>
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2.5 px-5 rounded-2xl flex items-center gap-2 shadow-soft transition-all active:scale-98 text-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة عادة جديدة</span>
            </button>
          </div>
        </div>

        {/* Date Subtitle on Mobile/Tablet */}
        <div className="flex lg:hidden flex-col text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
          <span className="text-foreground/80">{hijriStr}</span>
          <span className="text-[11px] text-muted-foreground">{gregorianStr}</span>
        </div>

        {/* Toast popup */}
        {showToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-card border border-border text-foreground text-xs font-medium px-4 py-2 rounded-full shadow-soft-lg animate-fade-in whitespace-nowrap">
            {toastMessage}
          </div>
        )}

        {/* Install Success Toast */}
        {installSuccessToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-success-bg border border-success/40 text-success-foreground font-black text-xs sm:text-sm px-5 py-3 rounded-full shadow-soft-lg animate-fade-in flex items-center gap-2">
            <span>🎉</span>
            <span>تم تثبيت واظب بنجاح! التطبيق جاهز دائمًا على جهازك.</span>
          </div>
        )}
      </header>

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        platform={platform}
        canNativeInstall={canNativeInstall}
        onNativeInstall={installApp}
      />
    </>
  );
}
