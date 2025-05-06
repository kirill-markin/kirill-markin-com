/**
 * Localization utilities for multilingual support
 */

import { Translation } from '@/types/article';

/**
 * List of all supported languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'es', 'zh', 'ar', 'hi'];

/**
 * Default language (used for fallbacks)
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Human-readable language names for UI
 */
export const LANGUAGE_NAMES: Record<string, string> = {
    'en': 'English',
    'es': 'Español',
    'zh': '中文',
    'ar': 'العربية',
    'hi': 'हिन्दी',
};

/**
 * Path segment mapping for URLs in different languages
 */
export const PATH_SEGMENTS: Record<string, Record<string, string>> = {
    'articles': {
        'en': 'articles',
        'es': 'articulos',
        'zh': 'wenzhang',
        'ar': 'maqalat',
        'hi': 'lekh',
    },
    'services': {
        'en': 'services',
        'es': 'servicios',
        'zh': 'fuwu',
        'ar': 'khadamat',
        'hi': 'sevaen',
    },
    'meet': {
        'en': 'meet',
        'es': 'reunirse',
        'zh': 'huijian',
        'ar': 'liqaa',
        'hi': 'milna',
    },
    'pay': {
        'en': 'pay',
        'es': 'pagar',
        'zh': 'zhifu',
        'ar': 'dafa',
        'hi': 'bhugtan',
    },
};

/**
 * Get the localized path segment for a specific language
 * @param segment Original segment in English
 * @param language Target language code
 * @returns Localized path segment
 */
export function getPathSegmentByLanguage(
    segment: string,
    language: string
): string {
    // Return original segment for English or if mapping doesn't exist
    if (language === DEFAULT_LANGUAGE || !PATH_SEGMENTS[segment]) {
        return segment;
    }

    return PATH_SEGMENTS[segment]?.[language] || segment;
}

/**
 * Get URL for the current page in a different language
 * @param targetLanguage Language to translate URL to
 * @param currentLanguage Current language
 * @param currentPath Current path
 * @param translations Available translations (for articles)
 * @returns URL for the current page in the target language
 */
export function getUrlForLanguage(
    targetLanguage: string,
    currentLanguage: string,
    currentPath: string,
    translations?: Translation[]
): string {
    // For default language
    if (targetLanguage === DEFAULT_LANGUAGE) {
        // If we're on a specific article page with translations
        if (currentPath.includes('/articulos/') ||
            currentPath.includes('/wenzhang/') ||
            currentPath.includes('/maqalat/') ||
            currentPath.includes('/lekh/')) {

            if (translations) {
                const defaultTranslation = translations.find(t => t.language === DEFAULT_LANGUAGE);
                if (defaultTranslation) {
                    return `/articles/${defaultTranslation.slug}/`;
                }
            }
        }

        // For other pages, remove language prefix and replace segments
        let path = currentPath;

        // Remove language prefix if present
        if (currentLanguage !== DEFAULT_LANGUAGE) {
            path = path.replace(`/${currentLanguage}`, '');
        }

        // Replace all localized segments with English ones
        Object.keys(PATH_SEGMENTS).forEach(englishSegment => {
            const localizedSegments = Object.values(PATH_SEGMENTS[englishSegment]);
            localizedSegments.forEach(localizedSegment => {
                path = path.replace(`/${localizedSegment}/`, `/${englishSegment}/`);
            });
        });

        return path.startsWith('/') ? path : `/${path}`;
    }

    // For non-default languages
    else {
        // If we're on a specific article page with translations
        if (currentPath.includes('/articles/')) {
            if (translations) {
                const targetTranslation = translations.find(t => t.language === targetLanguage);
                if (targetTranslation) {
                    const articlesSegment = getPathSegmentByLanguage('articles', targetLanguage);
                    return `/${targetLanguage}/${articlesSegment}/${targetTranslation.slug}/`;
                }
            }
        }

        // For other pages, add language prefix and localize segments
        let path = currentPath;

        // Remove existing language prefix if any
        if (currentLanguage !== DEFAULT_LANGUAGE) {
            path = path.replace(`/${currentLanguage}`, '');
        }

        // Replace all English segments with localized ones
        Object.keys(PATH_SEGMENTS).forEach(englishSegment => {
            if (path.includes(`/${englishSegment}/`)) {
                const localizedSegment = getPathSegmentByLanguage(englishSegment, targetLanguage);
                path = path.replace(`/${englishSegment}/`, `/${localizedSegment}/`);
            }
        });

        // Add language prefix for non-default languages
        return `/${targetLanguage}${path}`;
    }

    // Fallback to homepage in target language
    return targetLanguage === DEFAULT_LANGUAGE ? '/' : `/${targetLanguage}/`;
}

/**
 * Check if a language is valid and supported
 * @param language Language code to check
 * @returns Whether the language is supported
 */
export function isValidLanguage(language: string): boolean {
    return SUPPORTED_LANGUAGES.includes(language);
}

/**
 * Get locale string for a language (for HTML lang attribute and OpenGraph)
 * @param language Language code
 * @returns Locale string (e.g. 'en_US', 'es_ES')
 */
export function getLocaleForLanguage(language: string): string {
    const localeMap: Record<string, string> = {
        'en': 'en_US',
        'es': 'es_ES',
        'zh': 'zh_CN',
        'ar': 'ar_SA',
        'hi': 'hi_IN',
    };

    return localeMap[language] || 'en_US';
} 