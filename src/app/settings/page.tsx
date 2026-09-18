'use client';

import React, { useRef, useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  CalendarDays,
  Globe,
  Download,
  Upload,
  Trash2,
  Sparkles,
  AlertTriangle,
  Zap,
  Flame,
  Trophy,
  Clock,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import AppContainer from '@/components/layout/AppContainer';
import SakinahPromoCard from '@/components/sakinah/SakinahPromoCard';
import ChickModeToggle from '@/components/chick/ChickModeToggle';
import InstallGuideModal from '@/components/pwa/InstallGuideModal';
import OnboardingTourModal from '@/components/onboarding/OnboardingTourModal';
import { useHabits } from '@/context/HabitContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ThemeMode, StartOfWeek, Language } from '@/types/habit';
import { sounds } from '@/utils/sound';

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    setTheme,
    setStartOfWeek,
    setLanguage,
    requestNotifications,
    updateNotificationSettings,
    exportDataJSON,
    importDataJSON,
    hasLocalBackup,
    restoreLocalBackup,
    resetAllData,
  } = useHabits();

  const {
    isInstalled,
    canNativeInstall,
    platform,
    isGuideOpen,
    setIsGuideOpen,
    installApp,
    installSuccessToast,
  } = usePWAInstall();

  const {
    isOnboardingOpen,
    startTour,
    closeTour,
    completeTour,
  } = useOnboarding();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRestoreBackupConfirm, setShowRestoreBackupConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pendingImportContent, setPendingImportContent] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleExport = () => {
    sounds.playTick();
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wazeb-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showStatus('تم تصدير نسخة احتياطية كاملة بنجاح 💾');
  };

  const handleSelectImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setPendingImportContent(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!pendingImportContent) return;
    const result = importDataJSON(pendingImportContent);
    setPendingImportContent(null);
    if (result.success) {
      showStatus('تم استيراد واستعادة بياناتك بنجاح! ✅');
    } else {
      alert(result.error || 'حدث خطأ أثناء قراءة الملف، تأكد من صحة التنسيق.');
    }
  };

  const handleRestoreBackup = () => {
    const ok = restoreLocalBackup();
    setShowRestoreBackupConfirm(false);
    if (ok) {
      showStatus('تمت استعادة البيانات من النسخة الاحتياطية المحلية بنجاح! 🔄');
    } else {
      alert('لم يتم العثور على نسخة احتياطية صالحة.');
    }
  };

  const handleNotificationsToggle = async () => {
    sounds.playTick();
    const granted = await requestNotifications();
    showStatus(granted ? 'تم تفعيل الإشعارات بنجاح 🔔' : 'لم يتم تفعيل الإشعارات');
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    showStatus('تم مسح جميع البيانات بنجاح');
  };

  const notifs = settings.notificationSettings || {
    enabled: true,
    habitReminders: true,
    progressAlerts: true,
    streakAlerts: true,
    challengeAlerts: true,
    recoveryAlerts: true,
    smartTimeSuggestions: true,
  };

  return (
    <AppContainer showSummaryPanel={false}>
      {/* Onboarding Tour Modal */}
      <OnboardingTourModal
        isOpen={isOnboardingOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />

      <div className="pt-2 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          الإعدادات
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
          تخصيص المظهر، إدارة التطبيق PWA، وحفظ بياناتك المحلية بأمان
        </p>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3.5 bg-secondary border border-border text-foreground text-xs font-bold rounded-2xl text-center animate-fade-in shadow-soft">
          {statusMessage}
        </div>
      )}

      {/* Install Success Toast */}
      {installSuccessToast && (
        <div className="mb-4 p-3.5 bg-success-bg border border-success/40 text-success-foreground text-xs font-bold rounded-2xl text-center animate-fade-in shadow-soft flex items-center justify-center gap-2">
          <span>🎉</span>
          <span>تم تثبيت واظب بنجاح على جهازك!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pb-16">
        {/* Left Column: PWA & Appearance & Preferences & Notifications */}
        <div className="flex flex-col gap-5">
          {/* Section: Wazeb Tour (جولة واظب) */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-black text-foreground">جولة واظب الترحيبية</h3>
                <p className="text-[11px] text-muted-foreground">تعرف على كل أفكار ومميزات واظب من البداية</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTick();
                startTour();
              }}
              className="px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl transition-all active:scale-95 self-start sm:self-center border border-primary/20"
            >
              عرض الجولة من جديد
            </button>
          </div>

          {/* Section: PWA Installation App Status */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-soft flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg">
                  📱
                </div>
                <div>
                  <h3 className="text-sm font-black text-foreground">تطبيق واظب (PWA)</h3>
                  <p className="text-[11px] text-muted-foreground">يعمل دون اتصال وسريع الاستجابة</p>
                </div>
              </div>

              {isInstalled ? (
                <span className="text-[11px] font-bold px-3 py-1 bg-success/15 text-success rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مثبت على جهازك</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold px-3 py-1 bg-secondary text-muted-foreground rounded-xl">
                  متوفر للتثبيت
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {!isInstalled && (
                <button
                  onClick={installApp}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft transition-all active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>تثبيت واظب</span>
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playTick();
                  setIsGuideOpen(true);
                }}
                className={`text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                  isInstalled
                    ? 'w-full bg-secondary hover:bg-accent text-foreground border border-border'
                    : 'bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>دليل التثبيت (iPhone / Android / PC)</span>
              </button>
            </div>
          </div>

          {/* Section: Chick Mode (أشطر كتكوت) */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐣</span>
                <div>
                  <h3 className="text-sm font-black text-foreground">وضع أشطر كتكوت</h3>
                  <span className="text-[11px] text-muted-foreground">تجربة لطيفة ومبهجة مع مستويات وخزانة ملابس</span>
                </div>
              </div>
              <ChickModeToggle />
            </div>
          </div>

          {/* Section: Appearance */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3">
            <span className="text-xs font-bold text-muted-foreground">المظهر</span>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', label: 'داكن', icon: Moon },
                { id: 'light', label: 'فاتح', icon: Sun },
                { id: 'system', label: 'تلقائي', icon: Laptop },
              ].map((themeOpt) => {
                const Icon = themeOpt.icon;
                const isSelected = settings.theme === themeOpt.id;

                return (
                  <button
                    key={themeOpt.id}
                    onClick={() => {
                      sounds.playTick();
                      setTheme(themeOpt.id as ThemeMode);
                    }}
                    className={`py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-soft scale-100'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{themeOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Smart Notifications */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">التنبيهات الذكية</span>
              <button
                onClick={handleNotificationsToggle}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  settings.notificationsEnabled
                    ? 'bg-success-bg border border-success/40 text-success-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {settings.notificationsEnabled ? 'مفعلة ✓' : 'طلب الإذن'}
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-1 text-xs">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-foreground flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>تذكير بمواعيد العادات</span>
                </span>
                <input
                  type="checkbox"
                  checked={notifs.habitReminders}
                  onChange={(e) => updateNotificationSettings({ habitReminders: e.target.checked })}
                  className="rounded accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-foreground flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>تنبيهات الاقتراب من إكمال اليوم (100%)</span>
                </span>
                <input
                  type="checkbox"
                  checked={notifs.progressAlerts}
                  onChange={(e) => updateNotificationSettings({ progressAlerts: e.target.checked })}
                  className="rounded accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-foreground flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-warning" />
                  <span>احتفالات السلاسل المستمرة</span>
                </span>
                <input
                  type="checkbox"
                  checked={notifs.streakAlerts}
                  onChange={(e) => updateNotificationSettings({ streakAlerts: e.target.checked })}
                  className="rounded accent-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-foreground flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-warning" />
                  <span>متابعة تقدم التحديات الأسبوعية</span>
                </span>
                <input
                  type="checkbox"
                  checked={notifs.challengeAlerts}
                  onChange={(e) => updateNotificationSettings({ challengeAlerts: e.target.checked })}
                  className="rounded accent-primary w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Section: Preferences */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-4">
            <span className="text-xs font-bold text-muted-foreground">التفضيلات</span>

            {/* Start of Week */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">
                  بداية الأسبوع
                </span>
              </div>

              <div className="flex gap-1 bg-secondary p-1 rounded-xl border border-border">
                {[
                  { id: 6, label: 'السبت' },
                  { id: 0, label: 'الأحد' },
                  { id: 1, label: 'الاثنين' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      sounds.playTick();
                      setStartOfWeek(opt.id as StartOfWeek);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.startOfWeek === opt.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">
                  اللغة
                </span>
              </div>

              <div className="flex gap-1 bg-secondary p-1 rounded-xl border border-border">
                {[
                  { id: 'ar', label: 'العربية' },
                  { id: 'en', label: 'English' },
                ].map((langOpt) => (
                  <button
                    key={langOpt.id}
                    onClick={() => {
                      sounds.playTick();
                      setLanguage(langOpt.id as Language);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      settings.language === langOpt.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {langOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Data Management, Privacy, Ecosystem & Info */}
        <div className="flex flex-col gap-5">
          {/* Section: Local Privacy Notice */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>خصوصية تامة — بياناتك على جهازك فقط</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              جميع عاداتك وسجل إنجازاتك وأوسمتك محفوظة محلياً داخل متصفحك. لو فتحت واظب من جهاز أو متصفح مختلف، بياناتك المحلية لن تنتقل تلقائيًا. استخدم زر التصدير أدناه لإنشاء نسخة احتياطية ونقلها بسهولة.
            </p>
          </div>

          {/* Section: Data Management */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col gap-3">
            <span className="text-xs font-bold text-muted-foreground">إدارة البيانات والنسخ الاحتياطي</span>

            {/* Export JSON */}
            <button
              onClick={handleExport}
              className="w-full p-3.5 bg-secondary hover:bg-muted border border-border rounded-2xl flex items-center justify-between text-xs font-bold text-foreground transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-primary" />
                <span>تصدير بياناتي (ملف JSON كامل)</span>
              </div>
              <span className="text-[11px] text-muted-foreground">تنزيل نسخة</span>
            </button>

            {/* Import JSON */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleSelectImportFile}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => {
                sounds.playTick();
                fileInputRef.current?.click();
              }}
              className="w-full p-3.5 bg-secondary hover:bg-muted border border-border rounded-2xl flex items-center justify-between text-xs font-bold text-foreground transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span>استيراد بيانات من نسخة سابقة</span>
              </div>
              <span className="text-[11px] text-muted-foreground">اختيار ملف</span>
            </button>

            {/* Restore from automatic local backup */}
            {hasLocalBackup && (
              <button
                onClick={() => setShowRestoreBackupConfirm(true)}
                className="w-full p-3.5 bg-secondary hover:bg-muted border border-border rounded-2xl flex items-center justify-between text-xs font-bold text-foreground transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-success" />
                  <span>استعادة من النسخة الاحتياطية التلقائية</span>
                </div>
                <span className="text-[11px] text-muted-foreground">استرجاع</span>
              </button>
            )}


            {/* Reset All Data */}
            {!showResetConfirm ? (
              <button
                onClick={() => {
                  sounds.playTick();
                  setShowResetConfirm(true);
                }}
                className="w-full p-3.5 bg-destructive-bg border border-destructive/30 hover:bg-destructive-bg/80 rounded-2xl flex items-center justify-between text-xs font-bold text-destructive-foreground transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4" />
                  <span>مسح جميع البيانات</span>
                </div>
              </button>
            ) : (
              <div className="p-4 bg-destructive-bg border border-destructive/40 rounded-2xl flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center gap-2 text-destructive-foreground text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>هل أنت متأكد؟ سيتم حذف جميع عاداتك وسجل إنجازاتك.</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm"
                  >
                    نعم، احذف كل شيء
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 bg-secondary text-secondary-foreground hover:bg-muted font-bold py-2.5 rounded-xl text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section: Ecosystem - Sakinah */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground px-1">عائلة واظب</span>
            <SakinahPromoCard />
          </div>

          {/* Brand Footer */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft flex flex-col items-center justify-center text-center gap-1.5">
            <h4 className="text-base font-extrabold text-foreground">
              واظب<span className="text-muted-foreground">.</span>
            </h4>
            <p className="text-xs text-muted-foreground font-medium">
              &quot;واظب، وخليها عادة.&quot;
            </p>
            <span className="text-[10px] text-muted-text mt-1">تطبيق ويب تقدمي (PWA) فائق السرعة وبدون تكلفة</span>
          </div>
        </div>
      </div>

      {/* Import Confirmation Dialog */}
      {pendingImportContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-soft-lg flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-foreground font-extrabold text-base">
              <Upload className="w-5 h-5 text-primary" />
              <span>تأكيد استيراد البيانات</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              سيتم استبدال العادات والإنجازات الحالية بالبيانات الموجودة داخل ملف النسخة الاحتياطية. هل ترغب بالمتابعة؟
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmImport}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl text-xs shadow-soft"
              >
                تأكيد الاستيراد
              </button>
              <button
                onClick={() => setPendingImportContent(null)}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-muted font-bold py-3 rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Backup Confirmation Dialog */}
      {showRestoreBackupConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-soft-lg flex flex-col gap-4">
            <div className="flex items-center gap-2.5 text-foreground font-extrabold text-base">
              <RefreshCw className="w-5 h-5 text-success" />
              <span>استعادة النسخة الاحتياطية التلقائية</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              سيتم استرجاع آخر حالة صالحة تم حفظها تلقائياً على هذا الجهاز. هل ترغب بالاستمرار؟
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRestoreBackup}
                className="flex-1 bg-success hover:bg-success/90 text-white font-bold py-3 rounded-xl text-xs shadow-soft"
              >
                استعادة الآن
              </button>
              <button
                onClick={() => setShowRestoreBackupConfirm(false)}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-muted font-bold py-3 rounded-xl text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        platform={platform}
        canNativeInstall={canNativeInstall}
        onNativeInstall={installApp}
      />
    </AppContainer>
  );
}
