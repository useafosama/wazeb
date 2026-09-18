/**
 * Local analytics tracking for Sakinah cross-product integration
 */

export type SakinahEventType =
  | 'sakinah_card_view'
  | 'sakinah_card_click'
  | 'sakinah_contextual_view'
  | 'sakinah_contextual_click';

const STORAGE_KEY_SAKINAH_ANALYTICS = 'wazeb_sakinah_events_v1';

export function trackSakinahEvent(eventType: SakinahEventType, metadata?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    const event = {
      event: eventType,
      timestamp: new Date().toISOString(),
      metadata,
    };

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_SAKINAH_ANALYTICS) || '[]');
    existing.push(event);

    // Keep last 50 events locally
    if (existing.length > 50) {
      existing.shift();
    }

    localStorage.setItem(STORAGE_KEY_SAKINAH_ANALYTICS, JSON.stringify(existing));
  } catch {
    // Fail silently
  }
}
