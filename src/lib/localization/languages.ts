/**
 * List of all supported languages
 */
export const SUPPORTED_LANGUAGES = ['en', 'zh', 'hi', 'es', 'ar'] as const;

export type Language = typeof SUPPORTED_LANGUAGES[number];

/**
 * Default language (used for fallbacks)
 */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Human-readable language names for UI
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    zh: '中文',
    ar: 'العربية',
    hi: 'हिन्दी',
};

/**
 * Check if a language is valid and supported
 * @param language Language code to check
 * @returns Whether the language is supported
 */
export function isValidLanguage(language: string): boolean {
    return SUPPORTED_LANGUAGES.includes(language as Language);
}

/**
 * Get locale string for a language (for HTML lang attribute and OpenGraph)
 * @param language Language code
 * @returns Locale string (e.g. 'en_US', 'es_ES')
 */
export function getLocaleForLanguage(language: string): string {
    const localeMap: Record<Language, string> = {
        en: 'en_US',
        es: 'es_ES',
        zh: 'zh_CN',
        ar: 'ar_SA',
        hi: 'hi_IN',
    };

    if (isValidLanguage(language)) {
        return localeMap[language];
    }

    return localeMap[DEFAULT_LANGUAGE];
}
