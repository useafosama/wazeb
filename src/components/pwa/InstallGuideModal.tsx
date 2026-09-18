'use client';

import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Share2,
  PlusSquare,
  Sparkles,
  Download,
  MoreVertical,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { PWAInstallPlatform } from '@/hooks/usePWAInstall';
import { sounds } from '@/utils/sound';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PWAInstallPlatform;
  canNativeInstall: boolean;
  onNativeInstall: () => void;
}

export default function InstallGuideModal({
  isOpen,
  onClose,
  platform,
  canNativeInstall,
  onNativeInstall,
}: InstallGuideModalProps) {
  const initialTab =
    platform === 'ios'
      ? 'ios'
      : platform === 'android'
      ? 'android'
      : 'desktop';

  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'desktop'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-lg bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-soft-lg flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl">
              📱
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-foreground">
                ثبّت واظب على جهازك
              </h2>
              <p className="text-xs text-muted-foreground">
                افتح التطبيق بنقرة واحدة وبدون شريط المتصفح
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex p-1 bg-secondary rounded-2xl border border-border gap-1 text-xs font-bold">
          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('ios');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'ios'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('android');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'android'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('desktop');
            }}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'desktop'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>كمبيوتر / ماك</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'ios' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl text-xs text-primary font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span>لأفضل تجربة على iPhone، ثبّت واظب من متصفح Safari.</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">افتح واظب من متصفح Safari</span>
                  <p className="text-[11px] text-muted-foreground">
                    تأكد من فتح الرابط مباشرة في Safari وليس من داخل تطبيق آخر.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span>اضغط زر المشاركة</span>
                    <span className="px-1.5 py-0.5 bg-card border border-border rounded text-sm">⬆️</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    موجود في الشريط السفلي في Safari على الآيفون أو في الأعلى على الآيباد.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <span>اختر: &quot;إضافة إلى الشاشة الرئيسية&quot;</span>
                    <PlusSquare className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    مرر القائمة لأسفل حتى تجد &quot;Add to Home Screen&quot;.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">اضغط &quot;إضافة&quot; (Add)</span>
                  <p className="text-[11px] text-muted-foreground">
                    موجود في أعلى يمين الشاشة لتأكيد تثبيت الأيقونة.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  5
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">افتح واظب من الشاشة الرئيسية</span>
                  <p className="text-[11px] text-muted-foreground">
                    ستحصل على تجربة تطبيق كاملة وسلسة تعمل بدون اتصال.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'android' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {canNativeInstall ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-secondary rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-foreground">متصفحك يدعم التثبيت المباشر</h3>
                  <p className="text-xs text-muted-foreground">
                    اضغط الزر أدناه لتثبيت واظب فوراً على هاتفك
                  </p>
                </div>
                <button
                  onClick={onNativeInstall}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-soft transition-all active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت واظب الآن</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <span>اضغط على قائمة المتصفح</span>
                      <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      الأيقونة الثلاثية النقاط في أعلى يمين المتصفح (Chrome أو متصفحك المفضل).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground">
                      اختر &quot;إضافة إلى الشاشة الرئيسية&quot; أو &quot;تثبيت التطبيق&quot;
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      قد تختلف التسمية باختلاف متصفحك (Add to Home Screen / Install app).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground">وافق على التثبيت</span>
                    <p className="text-[11px] text-muted-foreground">
                      ستظهر أيقونة واظب مع تطبيقاتك لتفتحه في أي وقت بدون إنترنت.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'desktop' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {canNativeInstall && (
              <button
                onClick={onNativeInstall}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-soft transition-all active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت واظب على الكمبيوتر ⚡</span>
              </button>
            )}

            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">
                    شريط العنوان في المتصفح (Chrome / Edge / Safari)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    ابحث عن أيقونة التثبيت (⊕ أو رمز الشاشة مع سهم) في نهاية شريط العنوان أعلى المتصفح.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">
                    اضغط &quot;تثبيت واظب&quot; (Install Wazeb)
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    أو من قائمة المتصفح (⋮) اختر &quot;تثبيت التطبيق&quot;.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-secondary rounded-2xl border border-border">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">
                    نافذة مخصصة سريعة
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    يفتح واظب في نافذة نظيفة وخفيفة كبرنامج أصيل في شريط المهام / الـ Dock.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>بياناتك محفوظة محلياً على جهازك</span>
          </span>
          <button
            onClick={() => {
              sounds.playTick();
              onClose();
            }}
            className="text-foreground font-bold hover:underline"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
