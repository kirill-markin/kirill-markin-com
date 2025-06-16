import { DEFAULT_LANGUAGE, getSubPathSegmentByLanguage, SUB_PATH_SEGMENTS } from './localization';

/**
 * Get the internal tag key (English) from a localized tag value
 * @param localizedTag Localized tag value
 * @param language Current language
 * @returns Internal tag key or original tag if not found
 */
export function getInternalTagKey(localizedTag: string, language: string): string {
    // If it's already English, return as is
    if (language === DEFAULT_LANGUAGE) {
        return localizedTag;
    }

    // Check if we have tag translations for articles
    const articleTags = SUB_PATH_SEGMENTS['articles'];
    if (!articleTags) {
        return localizedTag;
    }

    // Find the internal key for this localized tag
    for (const [internalKey, translations] of Object.entries(articleTags)) {
        if (translations[language] === localizedTag) {
            return internalKey;
        }
    }

    // If not found, return the original tag
    return localizedTag;
}

/**
 * Get localized tag value from internal tag key
 * @param internalTag Internal tag key (English)
 * @param language Target language
 * @returns Localized tag value
 */
export function getLocalizedTag(internalTag: string, language: string): string {
    return getSubPathSegmentByLanguage('articles', internalTag, language);
}

/**
 * Get all localized tag values for display
 * @param internalTags Array of internal tag keys
 * @param language Target language
 * @returns Array of localized tag values
 */
export function getLocalizedTags(internalTags: string[], language: string): string[] {
    return internalTags.map(tag => getLocalizedTag(tag, language));
}

/**
 * Normalize tags to internal (English) keys
 * @param tags Array of tags (may be localized)
 * @param language Current language
 * @returns Array of internal tag keys
 */
export function normalizeTagsToEnglish(tags: string[], language: string): string[] {
    return tags.map(tag => getInternalTagKey(tag, language));
} 