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

