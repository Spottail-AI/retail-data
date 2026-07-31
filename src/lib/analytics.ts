/**
 * Central GA4 analytics helper.
 *
 * All product events are fired through trackEvent() so there is a single,
 * greppable source of truth for event names and params. This replaces the old
 * approach of relying on GTM triggers matching element IDs (e.g.
 * id="analyze_trends_button_click"), which broke silently whenever a component
 * was refactored.
 *
 * GA4 (gtag.js, G-EZK488JRW8) is loaded directly in index.html, so we push
 * straight to gtag when available and fall back to the dataLayer otherwise.
 */

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

/** Canonical event names. Keep this list in sync with the GA4 / Ads config. */
export type AnalyticsEvent =
  | "sign_up"
  | "source_page_created"
  | "purchase"
  | "begin_checkout"
  | "subscription_renewal"
  | "cancellation_requested"
  | "subscription_canceled"
  | "retailer_search_started"
  | "trend_search_started";

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {}
): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (Array.isArray(window.dataLayer)) {
      // Fallback: push a GTM-style event so a GTM trigger can still pick it up.
      window.dataLayer.push({ event, ...params });
    }
  } catch {
    // Analytics must never break the app.
  }
}
