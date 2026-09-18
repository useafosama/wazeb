'use client';

import React, { useState } from 'react';
import { ChickMood, ChickCosmeticId } from '@/types/habit';
import { CHICK_EASTER_EGG_QUOTES } from '@/utils/chick-engine';
import { sounds } from '@/utils/sound';

interface ChickAvatarProps {
  mood?: ChickMood;
  cosmetic?: ChickCosmeticId;
  size?: number;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ChickAvatar({
  mood = 'idle',
  cosmetic = 'none',
  size = 80,
  interactive = true,
  className = '',
  onClick,
}: ChickAvatarProps) {
  const [clickCount, setClickCount] = useState(0);
  const [easterEggBubble, setEasterEggBubble] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTick();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 400);

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount % 5 === 0) {
      const randomQuote = CHICK_EASTER_EGG_QUOTES[Math.floor(Math.random() * CHICK_EASTER_EGG_QUOTES.length)];
      setEasterEggBubble(randomQuote);
      setTimeout(() => setEasterEggBubble(null), 3500);
    }

    if (onClick) onClick();
  };

  return (
    <div
      onClick={interactive ? handleClick : undefined}
      className={`relative inline-flex items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Easter egg quote bubble */}
      {easterEggBubble && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-card border border-border text-foreground text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-soft-lg whitespace-nowrap animate-scale-in">
          {easterEggBubble}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border transform rotate-45" />
        </div>
      )}

      {/* Sparkles effect cosmetic */}
      {cosmetic === 'sparkles' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none chick-sparkle">
          <span className="absolute -top-1 -right-1 text-xs">✨</span>
          <span className="absolute -bottom-1 -left-1 text-xs">⭐</span>
          <span className="absolute top-1/2 -left-2 text-xs">🌟</span>
        </div>
      )}

      {/* SVG Chick */}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={`transition-transform duration-200 ${
          isJumping || mood === 'celebrating' || mood === 'happy' ? 'scale-110 -translate-y-2' : ''
        }`}
      >
        {/* Glow Behind */}
        <circle cx="50" cy="50" r="42" fill="#FDE047" opacity="0.2" className="chick-sparkle" />

        {/* Wings (Golden/Yellow) */}
        {cosmetic === 'wings' ? (
          <g className="chick-flap">
            {/* Left Golden Wing */}
            <path
              d="M 15 50 C 0 35, 5 20, 25 35 C 10 25, 15 10, 32 30"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Right Golden Wing */}
            <path
              d="M 85 50 C 100 35, 95 20, 75 35 C 90 25, 85 10, 68 30"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="2"
            />
          </g>
        ) : (
          <g className={mood === 'celebrating' ? 'chick-flap' : ''}>
            {/* Left Wing */}
            <ellipse cx="22" cy="54" rx="10" ry="14" fill="#FACC15" transform="rotate(-15 22 54)" />
            {/* Right Wing */}
            <ellipse cx="78" cy="54" rx="10" ry="14" fill="#FACC15" transform="rotate(15 78 54)" />
          </g>
        )}

        {/* Feet */}
        <ellipse cx="40" cy="85" rx="6" ry="4" fill="#F97316" />
        <ellipse cx="60" cy="85" rx="6" ry="4" fill="#F97316" />

        {/* Chick Body (Soft Fluffy Yellow) */}
        <circle cx="50" cy="52" r="34" fill="#FDE047" stroke="#FACC15" strokeWidth="2" />

        {/* Soft Tummy */}
        <ellipse cx="50" cy="58" rx="22" ry="20" fill="#FEF08A" />

        {/* Backpack Cosmetic */}
        {cosmetic === 'backpack' && (
          <rect x="35" y="60" width="30" height="20" rx="6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
        )}

        {/* Eyes & Mood Expressions */}
        {mood === 'sleeping' ? (
          <g stroke="#1F2937" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 36 44 Q 40 48 44 44" />
            <path d="M 56 44 Q 60 48 64 44" />
          </g>
        ) : mood === 'happy' || mood === 'celebrating' || mood === 'excited' ? (
          <g stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 36 45 Q 40 40 44 45" />
            <path d="M 56 45 Q 60 40 64 45" />
          </g>
        ) : (
          /* Normal Cute Black Eyes with Sparkle Highlights */
          <g>
            <circle cx="40" cy="44" r="4.5" fill="#1F2937" />
            <circle cx="38.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="44" r="4.5" fill="#1F2937" />
            <circle cx="58.5" cy="42.5" r="1.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Cute Blush Cheeks */}
        <circle cx="30" cy="52" r="4.5" fill="#F472B6" opacity="0.6" />
        <circle cx="70" cy="52" r="4.5" fill="#F472B6" opacity="0.6" />

        {/* Cute Orange Beak */}
        <polygon points="50,47 43,55 57,55" fill="#F97316" />

        {/* Head Feather Top (Default) */}
        {cosmetic === 'none' && (
          <path d="M 50 18 Q 54 8 50 4 Q 46 8 50 18" fill="#FACC15" />
        )}

        {/* Head Cosmetics */}
        {cosmetic === 'crown' && (
          <g transform="translate(30, 8) scale(0.8)">
            <polygon points="0,20 8,0 16,14 24,0 32,14 40,0 48,20" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="24" cy="18" r="3" fill="#EF4444" />
          </g>
        )}

        {cosmetic === 'bow' && (
          <g transform="translate(36, 12)">
            <ellipse cx="8" cy="8" rx="7" ry="5" fill="#EC4899" />
            <ellipse cx="20" cy="8" rx="7" ry="5" fill="#EC4899" />
            <circle cx="14" cy="8" r="3" fill="#BE185D" />
          </g>
        )}

        {cosmetic === 'flowers' && (
          <g transform="translate(26, 14)">
            <circle cx="8" cy="6" r="4" fill="#F43F5E" />
            <circle cx="16" cy="4" r="4" fill="#A855F7" />
            <circle cx="24" cy="4" r="4" fill="#EC4899" />
            <circle cx="32" cy="6" r="4" fill="#3B82F6" />
          </g>
        )}

        {cosmetic === 'cap' && (
          <g transform="translate(28, 12)">
            <path d="M 0 16 C 5 2, 38 2, 44 16 Z" fill="#3B82F6" />
            <path d="M 28 16 C 36 16, 48 18, 52 22 Z" fill="#1D4ED8" />
          </g>
        )}

        {cosmetic === 'glasses' && (
          <g transform="translate(26, 38)">
            <rect x="4" y="2" width="18" height="10" rx="3" fill="#111827" opacity="0.9" />
            <rect x="26" y="2" width="18" height="10" rx="3" fill="#111827" opacity="0.9" />
            <line x1="22" y1="6" x2="26" y2="6" stroke="#111827" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}
