export type GtmEvent = {
    event: string;
    [key: string]: unknown;
};

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}

export function trackGtmEvent(eventData: GtmEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push(eventData);
    } else {
        console.error('GTM is not available');
    }
} 