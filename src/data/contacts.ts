// =============================================================================
// CONTACT INFORMATION - Single source of truth for all contact data
// =============================================================================

// Phone number for calls (with + prefix)
export const PHONE_NUMBER = '+359879906085';

// WhatsApp phone number (without + prefix, as required by WhatsApp API)
// Note: Usually same as PHONE_NUMBER but can differ
export const WHATSAPP_PHONE = '359879906085';

// Telegram username (without @)
export const TELEGRAM_USERNAME = 'kirmark';

// Email address
export const EMAIL = 'markinkirill@gmail.com';

// Website URL and domain
export const SITE_URL = 'https://kirill-markin.com';
export const SITE_DOMAIN = 'kirill-markin.com';

// =============================================================================
// SOCIAL LINKS - URLs for social profiles
// =============================================================================

export const SOCIAL_URLS = {
    linkedin: 'https://www.linkedin.com/in/kirill-markin/',
    twitter: 'https://x.com/kirill_markin_',
    github: 'https://github.com/kirill-markin',
    youtube: 'https://www.youtube.com/@kirill-markin',
    medium: 'https://kirill-markin.medium.com/',
    reddit: 'https://www.reddit.com/user/Kirmark',
    bluesky: 'https://bsky.app/profile/kirill-markin.bsky.social',
    // Legacy social links (for vCard compatibility)
    instagram: 'https://www.instagram.com/kirill.markin.kira/',
    facebook: 'https://www.facebook.com/kirill.markin.kira',
} as const;

// =============================================================================
// VCARD DATA - Additional data for contact card generation
// =============================================================================

export const VCARD_DATA = {
    firstName: 'Kirill',
    lastName: 'Markin',
    fullName: 'Kirill Markin',
    organization: 'ozma.io',
    title: 'Founder',
    birthday: '1993-01-02', // ISO format YYYY-MM-DD
    photoUrl: 'https://kirill-markin.com/data/kirill-200x200.jpg',
    note: 'Startup, SMB, SaaS, CRM, ERP, Data Science, Data Engineer',
    address: {
        city: 'London',
        postalCode: 'E14 4PA',
        country: 'GB',
    },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate WhatsApp URL with optional pre-filled message
 */
export function getWhatsAppUrl(message?: string): string {
    if (message) {
        return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
    }
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`;
}

/**
 * Generate Telegram URL
 */
export function getTelegramUrl(): string {
    return `https://t.me/${TELEGRAM_USERNAME}`;
}

/**
 * Generate mailto URL
 */
export function getEmailUrl(): string {
    return `mailto:${EMAIL}`;
}
