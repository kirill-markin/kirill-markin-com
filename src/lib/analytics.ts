// Analytics Configuration
// These IDs should match what was configured in GTM

export const ANALYTICS_CONFIG = {
    // GA4 Measurement ID
    GA4_MEASUREMENT_ID: 'G-K7E02MSKP0',

    // Microsoft Clarity Project ID
    CLARITY_PROJECT_ID: 'reewt1qszh',

    // Ahrefs Analytics data-key
    AHREFS_DATA_KEY: 'u5Yzn778hzBC6F+ZzQw5QQ',
} as const;

/**
 * GA4 Custom Dimensions (registered in GA4 Admin → Custom definitions)
 *
 * These event parameters are registered as Custom Dimensions in GA4
 * to enable filtering, comparison, and breakdown in reports.
 *
 * | Dimension name | Scope | Event parameter | Used in event  | Description                                    |
 * |----------------|-------|-----------------|----------------|------------------------------------------------|
 * | service_type   | Event | service_type    | service_click  | Type of service: mentorship or fractional_cto  |
 * | plan_id        | Event | plan_id         | service_click  | Pricing plan: free, lite, standard, premium... |
 *
 * Note: Other event attributes (like service cards) use dynamic event names
 * (e.g., card_click_ai_mentorship) instead of dimensions to save the 50 dimension limit.
 */

// Type definitions
export type EventParams = Record<string, string | number | boolean>;

declare global {
    interface Window {
        dataLayer: Array<Record<string, unknown>>;
        clarity: {
            (command: string, ...args: unknown[]): void;
            q?: IArguments[];
        };
        gtag: (...args: unknown[]) => void;
    }
}

/**
 * Initialize analytics queues before scripts load
 * This ensures events are captured even before analytics scripts are ready
 * Must be called in <head> before any tracking calls
 */
export function getAnalyticsInitScript(): string {
    return `
        // Initialize dataLayer and gtag for GA4
        window.dataLayer = window.dataLayer || [];
        window.gtag = function(){window.dataLayer.push(arguments);};
        window.gtag('js', new Date());

        // Initialize Clarity queue
        window.clarity = window.clarity || function() {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };
    `.trim();
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

/**
 * Track an event to all analytics services
 * Events are queued if scripts haven't loaded yet
 */
export function trackEvent(eventName: string, params?: EventParams): void {
    if (!isBrowser()) {
        return;
    }

    const isDev = process.env.NODE_ENV === 'development';

    // GA4: Push to dataLayer
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...params,
        });
    } else if (isDev) {
        console.warn(`[Analytics] dataLayer not available: ${eventName}`, params);
    }

    // Clarity: Send only event name (Clarity API does not support event parameters)
    // Session replay provides full context, detailed params are tracked in GA4
    if (window.clarity) {
        try {
            window.clarity('event', eventName);
        } catch (e) {
            if (isDev) {
                console.warn(`[Analytics] Clarity event failed: ${eventName}`, e);
            }
        }
    } else if (isDev) {
        console.warn(`[Analytics] Clarity not available: ${eventName}`);
    }
}

