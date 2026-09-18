'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { ChickCosmeticId } from '@/types/habit';
import { CHICK_COSMETICS } from '@/utils/chick-engine';
import ChickAvatar from './ChickAvatar';
import { sounds } from '@/utils/sound';

interface ChickWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
}

const STORAGE_KEY_EQUIPPED = 'wazeb_chick_equipped_v1';

export default function ChickWardrobeModal({
  isOpen,
  onClose,
  currentLevel,
}: ChickWardrobeModalProps) {
  const [equipped, setEquipped] = useState<ChickCosmeticId>('none');
  const [previewItem, setPreviewItem] = useState<ChickCosmeticId>('none');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EQUIPPED) as ChickCosmeticId;
      if (stored) {
        setEquipped(stored);
        setPreviewItem(stored);
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleEquip = (id: ChickCosmeticId) => {
    sounds.playComplete();
    setEquipped(id);
    setPreviewItem(id);
    try {
      localStorage.setItem(STORAGE_KEY_EQUIPPED, id);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-card border-t sm:border border-border rounded-t-3xl sm:rounded-3xl p-6 shadow-soft-lg z-10 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎀</span>
            <h3 className="text-lg font-bold text-foreground">
              خزانة الكتكوت
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Stage */}
        <div className="flex flex-col items-center justify-center py-4 my-3 bg-secondary rounded-2xl border border-border">
          <ChickAvatar size={90} cosmetic={previewItem} mood="happy" />
          <span className="text-xs font-bold text-muted-foreground mt-2">
            المستوى الحالي: {currentLevel} ⭐
          </span>
        </div>

        {/* Cosmetics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
          {CHICK_COSMETICS.map((item) => {
            const isUnlocked = currentLevel >= item.unlockLevel;
            const isSelected = equipped === item.id;

            return (
              <button
                key={item.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && handleEquip(item.id)}
                onMouseEnter={() => isUnlocked && setPreviewItem(item.id)}
                onMouseLeave={() => setPreviewItem(equipped)}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all relative ${
                  !isUnlocked
                    ? 'opacity-50 bg-secondary/50 border-border cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-soft'
                    : 'bg-card text-foreground border-border hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold truncate w-full">{item.name}</span>
                
                {isUnlocked ? (
                  <span className="text-[10px] font-semibold opacity-80">
                    {isSelected ? 'مفعّل ✓' : 'ارتداء'}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>مستوى {item.unlockLevel}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 rounded-2xl transition-all active:scale-98 text-xs shadow-soft mt-5"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
}
