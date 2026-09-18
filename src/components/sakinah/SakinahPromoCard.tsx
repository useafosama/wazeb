'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useHabits } from '@/context/HabitContext';
import { getTodayKey } from '@/utils/date-helpers';
import { trackSakinahEvent } from '@/utils/sakinah-analytics';
import { sounds } from '@/utils/sound';

interface SakinahPromoCardProps {
  compact?: boolean;
  className?: string;
}

export default function SakinahPromoCard({ compact = false, className = '' }: SakinahPromoCardProps) {
  const { habits } = useHabits();
  const [isContextual, setIsContextual] = useState(false);
  const [timeCopy, setTimeCopy] = useState({
    title: 'لحظتك الهادئة مع الأذكار',
    desc: 'أذكار وأحاديث نبوية شريفة في تجربة بسيطة وهادئة.',
  });

  const SAKINAH_URL = 'https://sakinah-3ps.pages.dev';

  useEffect(() => {
    const todayKey = getTodayKey();
    const currentHour = new Date().getHours();

    // Check if an Azkar habit was completed today
    const azkarHabitCompletedToday = habits.some(
      (h) =>
        (h.name.includes('أذكار') || h.name.includes('ذكر') || h.name.includes('قرآن')) &&
        Boolean(h.completions[todayKey])
    );

    // Check session storage so we don't spam contextual mode
    const hasSeenContextual = typeof window !== 'undefined' && sessionStorage.getItem('wazeb_sakinah_contextual_shown');

    if (azkarHabitCompletedToday && !hasSeenContextual) {
      setIsContextual(true);
      if (currentHour >= 4 && currentHour < 12) {
        setTimeCopy({
          title: '🌤️ وقت هادئ لبداية يومك',
          desc: 'ابدأ يومك مع أذكارك في سكينة.',
        });
      } else if (currentHour >= 17 || currentHour < 4) {
        setTimeCopy({
          title: '🌙 خذ لحظتك',
          desc: 'اختم يومك مع أذكارك في سكينة.',
        });
      } else {
        setTimeCopy({
          title: '🌙 خلصت أذكارك؟',
          desc: 'كمّل لحظتك مع سكينة.',
        });
      }

      sessionStorage.setItem('wazeb_sakinah_contextual_shown', 'true');
      trackSakinahEvent('sakinah_contextual_view');
    } else {
      setIsContextual(false);
      trackSakinahEvent('sakinah_card_view');
    }
  }, [habits]);

  const handleClick = () => {
    sounds.playTick();
    if (isContextual) {
      trackSakinahEvent('sakinah_contextual_click', { url: SAKINAH_URL });
    } else {
      trackSakinahEvent('sakinah_card_click', { url: SAKINAH_URL });
    }
  };

  return (
    <div
      className={`w-full bg-card border border-border rounded-3xl p-5 shadow-soft transition-all duration-300 relative overflow-hidden group ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
            🌿
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-foreground tracking-tight">
                سكينة
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                من واظب
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              {isContextual ? timeCopy.title : 'لحظتك الهادئة مع الأذكار'}
            </span>
          </div>
        </div>

        <a
          href={SAKINAH_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-soft flex-shrink-0"
        >
          <span>افتح سكينة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Description */}
      {!compact && (
        <p className="text-xs text-muted-foreground leading-relaxed pr-12">
          {isContextual ? timeCopy.desc : 'أذكار وأحاديث نبوية شريفة في تجربة بسيطة وهادئة.'}
        </p>
      )}
    </div>
  );
}
