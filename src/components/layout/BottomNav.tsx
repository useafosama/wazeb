'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, BarChart3, Trophy, Calendar, Settings2 } from 'lucide-react';
import { sounds } from '@/utils/sound';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/',
      label: 'الرئيسية',
      icon: CheckCircle2,
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

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe pointer-events-none">
      <div className="w-full max-w-[480px] sm:max-w-md px-4 pb-3 pt-2">
        <div className="pointer-events-auto bg-navigation backdrop-blur-xl border border-navigation-border rounded-3xl p-1.5 shadow-soft-lg flex items-center justify-around transition-colors">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => sounds.playTick()}
                className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-2xl transition-all duration-200 flex-1 ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-secondary rounded-2xl -z-10 animate-fade-in" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[11px] mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
