'use client';

import { useEffect } from 'react';
import AppUpdateToast from './AppUpdateToast';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Wazeb SW registered with scope:', registration.scope);

          // Periodically check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        } catch (error) {
          console.error('Wazeb SW registration failed:', error);
        }
      };

      window.addEventListener('load', registerSW);
    }
  }, []);

  return <AppUpdateToast />;
}
