import { DEFAULT_LANGUAGE } from '../languages';

import { articles } from './articles';
import { common } from './common';
import { emailPopup } from './emailPopup';
import { footer } from './footer';
import { home } from './home';
import { meet } from './meet';
import { navigation } from './navigation';
import { notFound } from './notFound';
import { pay } from './pay';
import { personalInfo } from './personalInfo';
import { services } from './services';
import { subscribe } from './subscribe';

/**
 * All translations for the website
 */
export const translations = {
    common,
    navigation,
    personalInfo,
    footer,
    home,
    articles,
    services,
    meet,
    pay,
    subscribe,
    emailPopup,
    notFound,
} as const;

/**
 * Type for translation section keys
 */
export type TranslationSection = keyof typeof translations;

/**
 * Get translations for a specific section and language
 * @param section Section name (e.g. 'common', 'home', 'articles')
 * @param language Language code
 * @returns Translation object for the requested section, falling back to default language
 */
export function getTranslation<T extends TranslationSection>(
    section: T,
    language: string
): typeof translations[T][typeof DEFAULT_LANGUAGE] {
    if (!translations[section]) {
        return {} as typeof translations[T][typeof DEFAULT_LANGUAGE];
    }

    const sectionTranslations = translations[section];

    return (
        sectionTranslations[language as keyof typeof sectionTranslations] ||
        sectionTranslations[DEFAULT_LANGUAGE]
    ) as typeof translations[T][typeof DEFAULT_LANGUAGE];
}
