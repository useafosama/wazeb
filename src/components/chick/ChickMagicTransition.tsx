'use client';

import React from 'react';
import ChickAvatar from './ChickAvatar';

interface ChickMagicTransitionProps {
  isActivating: boolean;
  onFinish?: () => void;
}

export default function ChickMagicTransition({ isActivating, onFinish }: ChickMagicTransitionProps) {
  if (!isActivating) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in pointer-events-none select-none">
      <div className="flex flex-col items-center gap-3 animate-scale-in">
        <ChickAvatar size={120} mood="celebrating" cosmetic="crown" interactive={false} />
        
        <div className="bg-card border border-border text-foreground px-5 py-2.5 rounded-full shadow-soft-lg text-sm font-black flex items-center gap-2">
          <span>✨</span>
          <span>جاهز نبقى أشطر كتكوت؟</span>
          <span>🐣</span>
        </div>
      </div>
    </div>
  );
}
