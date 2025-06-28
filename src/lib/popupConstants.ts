/**
 * Configuration constants for email popup
 */

// Timing constants
export const POPUP_DELAY = 180000; // 3 minutes in milliseconds
export const EXIT_INTENT_THRESHOLD = 20; // pixels from top to trigger exit intent

// Scroll-based exit intent constants
export const SCROLL_UP_THRESHOLD = 150; // pixels scrolled up to trigger exit intent
export const SCROLL_DEBOUNCE_MS = 100; // debounce scroll events to avoid excessive triggers

// Cookie and storage constants  
export const POPUP_COOKIE_NAME = 'email_popup_dismissed';
export const POPUP_SUBSCRIBED_COOKIE_NAME = 'email_popup_subscribed';
export const POPUP_SESSION_KEY = 'email_popup_shown';
export const POPUP_COOLDOWN_DAYS = 3; // days before showing popup again after dismissal
export const POPUP_SUBSCRIBED_DAYS = 365 * 10; // 10 years - essentially forever

// Email validation constants
export const EMAIL_MIN_LENGTH = 5;
export const EMAIL_MAX_LENGTH = 254;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Check if Lemlist integration is properly configured
 * @returns {boolean} True if both API key and company ID are available
 */
export function isLemlistConfigured(): boolean {
    // Only check on server side (Node.js environment)
    if (typeof window !== 'undefined') {
        // Client side - assume not configured to disable popup
        return false;
    }

    const apiKey = process.env.LEMLIST_API_KEY;
    const companyId = process.env.LEMLIST_SUBSCRIPTION_COMPANY_ID;

    return !!(apiKey && companyId);
}

/**
 * Get Lemlist configuration status for logging
 * @returns {object} Configuration status details
 */
export function getLemlistConfigStatus(): {
    configured: boolean;
    hasApiKey: boolean;
    hasCompanyId: boolean;
} {
    // Only check on server side (Node.js environment)
    if (typeof window !== 'undefined') {
        // Client side - return false status
        return {
            configured: false,
            hasApiKey: false,
            hasCompanyId: false
        };
    }

    const hasApiKey = !!process.env.LEMLIST_API_KEY;
    const hasCompanyId = !!process.env.LEMLIST_SUBSCRIPTION_COMPANY_ID;

    return {
        configured: hasApiKey && hasCompanyId,
        hasApiKey,
        hasCompanyId
    };
} 