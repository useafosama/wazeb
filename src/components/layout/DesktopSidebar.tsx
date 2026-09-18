'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CheckCircle2,
  BarChart3,
  Calendar,
  Settings2,
  Trophy,
  Plus,
  Moon,
  Sun,
  Palette,
  Bell,
  BellRing,
} from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { sounds } from '@/utils/sound';
import { getFormattedGregorianDate, getFormattedHijriDate } from '@/utils/date-helpers';
import ChickModeToggle from '@/components/chick/ChickModeToggle';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import InstallGuideModal from '@/components/pwa/InstallGuideModal';
import { Download, Check } from 'lucide-react';

export default function DesktopSidebar() {
  const pathname = usePathname();
  const { habits, settings, achievements, setTheme, setIsAddModalOpen, requestNotifications } = useHabits();
  const { isInstalled, canNativeInstall, platform, isGuideOpen, setIsGuideOpen, installApp } = usePWAInstall();

  const isChick = Boolean(settings.isChickMode);
  const hijriDate = getFormattedHijriDate(new Date(), settings.language);
  const gregorianDate = getFormattedGregorianDate(new Date(), settings.language);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: CheckCircle2,
      badge: habits.length > 0 ? habits.length : undefined,
    },
    {
      href: '/stats',
      label: 'الإحصائيات',
      icon: BarChart3,
    },
    {
      href: '/achievements',
      label: 'الأوسمة',
      icon: Trophy,
      badge: unlockedCount > 0 ? unlockedCount : undefined,
    },
    {
      href: '/calendar',
      label: 'التقويم',
      icon: Calendar,
    },
    {
      href: '/settings',
      label: 'الإعدادات',
      icon: Settings2,
    },
  ];

  const toggleTheme = () => {
    sounds.playTick();
    setTheme(settings.theme === 'dark' ? 'light' : 'dark');
  };

  const handleNotification = async () => {
    sounds.playTick();
    await requestNotifications();
  };

  const handleOpenAdd = () => {
    sounds.playTick();
    setIsAddModalOpen(true);
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-[calc(100vh-2rem)] sticky top-4 bg-card border border-border rounded-3xl p-5 shadow-soft justify-between flex-shrink-0 select-none transition-colors">
        {/* Top section: Logo & Nav */}
        <div className="flex flex-col gap-5">
          {/* Logo and Date */}
          <div className="flex flex-col gap-2 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-baseline gap-1 group">
                <span className="text-2xl xl:text-3xl font-black text-foreground tracking-tight">
                  واظب
                </span>
                <span className="text-xl font-bold text-muted-foreground">.</span>
                <span className="text-[11px] font-semibold text-muted-foreground mr-1.5 uppercase tracking-wider">
                  Wazeb
                </span>
              </Link>

              {/* Quick Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                title="تبديل المظهر"
              >
                {settings.theme === 'dark' ? <Palette className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>

            {/* Mode Toggle Button */}
            <div className="pt-1">
              <ChickModeToggle className="w-full justify-center" />
            </div>

            <div className="flex flex-col text-xs text-muted-foreground font-medium leading-relaxed mt-1">
              <span className="text-foreground/80 truncate">{hijriDate}</span>
              <span className="text-[11px] text-muted-foreground">{gregorianDate}</span>
            </div>
          </div>

          {/* Add Habit Primary Action Button */}
          <button
            onClick={handleOpenAdd}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft transition-all duration-200 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="text-sm font-extrabold">عادة جديدة</span>
          </button>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => sounds.playTick()}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-accent text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom PWA Install & Profile Card */}
        <div className="pt-4 border-t border-border flex flex-col gap-3">
          {/* PWA Install status or button */}
          {!isInstalled ? (
            <button
              onClick={installApp}
              className="w-full p-2.5 bg-secondary hover:bg-accent border border-border rounded-2xl flex items-center justify-between text-xs font-bold text-foreground transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>تثبيت واظب</span>
              </div>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-lg">
                PWA
              </span>
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-secondary/50 border border-border rounded-xl flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 font-bold text-foreground/80">
                <Check className="w-3 h-3 text-success" />
                <span>واظب مثبت على جهازك</span>
              </span>
              <span className="text-[10px]">✓</span>
            </div>
          )}

          <div className="bg-card-elevated border border-border rounded-2xl p-3.5 flex items-center justify-between shadow-soft">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-sm">
                {isChick ? '🐣' : '🌱'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">
                  {isChick ? 'أشطر كتكوت في الدنيا' : 'واظب، وخليها عادة'}
                </span>
                <span className="text-[10px] text-muted-foreground">الاستمرار سر النجاح</span>
              </div>
            </div>

            <button
              onClick={handleNotification}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                settings.notificationsEnabled
                  ? 'text-warning-foreground bg-warning-bg'
                  : 'text-muted-foreground hover:text-foreground bg-accent'
              }`}
              title="التنبيهات"
            >
              {settings.notificationsEnabled ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>

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
