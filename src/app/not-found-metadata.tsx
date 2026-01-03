import type { Metadata } from 'next';
import { getTranslation, getLocaleForLanguage } from '@/lib/localization';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';

/**
 * Generate metadata for the 404 page
 * Note: This function is used by layout.tsx to set static metadata for the 404 page
 * 
 * @param language Language code
 * @returns Metadata object for the 404 page
 */
export function generateNotFoundMetadata(language: string = 'en'): Metadata {
    const translations = getTranslation('notFound', language);
    const locale = getLocaleForLanguage(language);

    return {
        title: translations.title,
        description: translations.message,
        openGraph: {
            title: translations.title,
            description: translations.message,
            url: `${SITE_URL}/404/`,
            images: [
                {
                    url: '/images/404.webp',
                    width: 1200,
                    height: 630,
                    alt: translations.title,
                }
            ],
            type: 'website',
            siteName: VCARD_DATA.fullName,
            locale: locale,
        },
        twitter: {
            title: translations.title,
            description: translations.message,
            images: ['/images/404.webp'],
        },
        robots: {
            index: false,
            follow: false,
        },
    };
}

// Default metadata for English (fallback)
export const notFoundMetadata: Metadata = generateNotFoundMetadata('en'); 