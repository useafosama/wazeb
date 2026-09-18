import type { Metadata, Viewport } from 'next';
import './globals.css';
import { HabitProvider } from '@/context/HabitContext';
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://wazeb.pages.dev'),
  title: 'واظب | Wazeb — عاداتك، يومًا بعد يوم',
  description: 'واظب يساعدك على بناء عاداتك اليومية، تتبع سلاسل استمراريتك، وتطوير أسلوب حياتك ببساطة وخصوصية تامة.',
  applicationName: 'واظب | Wazeb',
  authors: [{ name: 'Wazeb Team' }],
  keywords: ['واظب', 'تتبع العادات', 'Wazeb', 'Habit Tracker', 'عادات يومية', 'إنتاجية', 'استمرارية', 'PWA'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'واظب',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    url: 'https://wazeb.pages.dev',
    title: 'واظب | Wazeb — عاداتك، يومًا بعد يوم',
    description: 'واظب يساعدك على بناء عاداتك اليومية، تتبع سلاسل استمراريتك، وتطوير أسلوب حياتك ببساطة وخصوصية تامة.',
    siteName: 'واظب | Wazeb',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'شعار واظب | Wazeb',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'واظب | Wazeb — عاداتك، يومًا بعد يوم',
    description: 'واظب يساعدك على بناء عاداتك اليومية والاستمرار عليها ببساطة.',
    images: ['/icon.svg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-muted selection:text-foreground">
        <HabitProvider>
          <ServiceWorkerRegister />
          {children}
        </HabitProvider>
      </body>
    </html>
  );
}
