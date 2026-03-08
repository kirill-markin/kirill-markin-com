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
export function getTranslation(section: 'common', language: string): typeof common.en;
export function getTranslation(section: 'navigation', language: string): typeof navigation.en;
export function getTranslation(section: 'personalInfo', language: string): typeof personalInfo.en;
export function getTranslation(section: 'footer', language: string): typeof footer.en;
export function getTranslation(section: 'home', language: string): typeof home.en;
export function getTranslation(section: 'articles', language: string): typeof articles.en;
export function getTranslation(section: 'services', language: string): typeof services.en;
export function getTranslation(section: 'meet', language: string): typeof meet.en;
export function getTranslation(section: 'pay', language: string): typeof pay.en;
export function getTranslation(section: 'subscribe', language: string): typeof subscribe.en;
export function getTranslation(section: 'emailPopup', language: string): typeof emailPopup.en;
export function getTranslation(section: 'notFound', language: string): typeof notFound.en;
export function getTranslation(section: TranslationSection, language: string) {
    if (!translations[section]) {
        return {};
    }

    const sectionTranslations = translations[section];
    const localizedTranslations = sectionTranslations as Record<string, unknown>;

    return localizedTranslations[language] || localizedTranslations[DEFAULT_LANGUAGE];
}
