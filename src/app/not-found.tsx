import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-soft text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">خطأ 404</span>
          <h1 className="text-2xl font-black text-foreground">الصفحة غير موجودة</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            يبدو أن الرابط المطلوب غير متوفر، لكن لا تقلق؛ عاداتك وبياناتك محفوظة بأمان.
          </p>
        </div>

        <Link
          href="/"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-soft transition-all duration-200 active:scale-98 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
