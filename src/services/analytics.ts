/**
 * Analytics Service — lightweight event tracker
 * Silently posts events to our backend. Never throws or disrupts UX.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Generate/persist a session ID per browser session
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("bb_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem("bb_session_id", sessionId);
  }
  return sessionId;
}

export type AnalyticsEvent =
  | "pageView"
  | "propertyView"
  | "search"
  | "whatsappClick"
  | "callClick"
  | "propertyFavorite"
  | "registration"
  | "filterUsed";

interface TrackOptions {
  propertyId?: string;
  metadata?: Record<string, any>;
}

/**
 * Track an analytics event.
 * Fire-and-forget — never awaited, never breaks UX.
 */
export function trackEvent(event: AnalyticsEvent, options: TrackOptions = {}): void {
  // Skip in test/SSR environments
  if (typeof window === "undefined") return;

  const payload = {
    event,
    propertyId: options.propertyId,
    metadata: options.metadata || {},
    sessionId: getSessionId(),
    referrer: document.referrer,
  };

  // Use sendBeacon when available (non-blocking, survives page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon(`${API_URL}/api/analytics/track`, blob);
  } else {
    // Fallback: fire-and-forget fetch
    fetch(`${API_URL}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {}); // Silently swallow errors
  }
}
