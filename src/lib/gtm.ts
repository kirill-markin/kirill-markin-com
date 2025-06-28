export type GtmEvent = {
    event: string;
    [key: string]: unknown;
};

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}

/**
 * Check if Google Tag Manager is available
 */
export function isGtmAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.dataLayer;
}

/**
 * Track an event with Google Tag Manager
 * Gracefully handles missing GTM with warnings instead of errors
 */
export function trackGtmEvent(eventData: GtmEvent): void {
    if (isGtmAvailable()) {
        window.dataLayer.push(eventData);
    } else {
        // Use warning instead of error - this is normal in development
        const isDev = process.env.NODE_ENV === 'development';

        // Set to false to disable GTM warnings in development (if they become too noisy)
        const enableDevWarnings = true;

        if (isDev && enableDevWarnings) {
            console.warn(`⚠️ GTM not available (normal in development): ${eventData.event}`, eventData);
        } else if (!isDev) {
            console.warn(`⚠️ GTM not available: ${eventData.event}`, eventData);
        }
        // In dev with disabled warnings, silently skip
    }
} 