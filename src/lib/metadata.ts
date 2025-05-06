import { Metadata } from 'next';
import { getLocaleForLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getPathSegmentByLanguage, getTranslation } from '@/lib/localization';

/**
 * Generate base metadata for all pages
 * @param language Language code
 * @returns Metadata object
 */
function getBaseMetadata(language: string): Metadata {
    const homeTranslations = getTranslation('home', language);

    return {
        title: homeTranslations.title,
        description: homeTranslations.description,
        openGraph: {
            locale: getLocaleForLanguage(language),
            siteName: 'Kirill Markin',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
        },
    };
}

/**
 * Generate language alternates for all pages
 * @param currentLanguage Current language
 * @param basePath Base path of the page (without language)
 * @param slug Additional URL parameter (optional)
 * @returns Object with language alternate links
 */
function getLanguageAlternates(
    currentLanguage: string,
    basePath: string,
    slug?: string
): Record<string, string> {
    const alternates: Record<string, string> = {};

    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === currentLanguage) continue;

        let path = '';

        // For English (default)
        if (lang === DEFAULT_LANGUAGE) {
            path = `/${basePath}${slug ? `/${slug}` : ''}`;
        }
        // For other languages
        else {
            const localizedBasePath = getPathSegmentByLanguage(basePath, lang);
            path = `/${lang}/${localizedBasePath}${slug ? `/${slug}` : ''}`;
        }

        alternates[lang] = `https://kirill-markin.com${path}`;
    }

    return alternates;
}

/**
 * Generate metadata for the home page
 * @param language Language code
 * @returns Metadata object
 */
export function generateHomePageMetadata(language: string): Metadata {
    const homeTranslations = getTranslation('home', language);
    const baseMetadata = getBaseMetadata(language);

    const canonicalUrl = language === DEFAULT_LANGUAGE
        ? 'https://kirill-markin.com/'
        : `https://kirill-markin.com/${language}`;

    // Get language alternates
    const alternates = getLanguageAlternates(language, '', '');

    // Add current language to alternates
    alternates[language] = canonicalUrl;

    return {
        ...baseMetadata,
        title: homeTranslations.title,
        description: homeTranslations.description,
        openGraph: {
            ...baseMetadata.openGraph,
            title: homeTranslations.title,
            description: homeTranslations.description,
            url: canonicalUrl,
            images: [
                {
                    url: '/articles/preview-main.webp',
                    width: 1200,
                    height: 630,
                    alt: homeTranslations.title,
                }
            ],
        },
        twitter: {
            ...baseMetadata.twitter,
            title: homeTranslations.title,
            description: homeTranslations.description,
            images: ['/articles/preview-main.webp'],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: alternates,
        },
    };
}

/**
 * Generate metadata for the articles page
 * @param options Parameters for metadata generation
 * @returns Metadata object
 */
export function generateArticlesPageMetadata(
    options: {
        language: string;
        tag?: string;
    }
): Metadata {
    const { language, tag } = options;
    const articlesTranslations = getTranslation('articles', language);
    const baseMetadata = getBaseMetadata(language);

    // Create title and description
    let title = `${articlesTranslations.title} | Kirill Markin`;
    let description = String(articlesTranslations.description);

    // Customize for tags
    if (tag) {
        const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        title = `${formattedTag} ${articlesTranslations.title} | Kirill Markin`;
        description = `${tag}. ${description}`;
    }

    // Create canonical URL
    const articlesSegment = language === DEFAULT_LANGUAGE
        ? 'articles'
        : getPathSegmentByLanguage('articles', language);

    const canonicalUrl = language === DEFAULT_LANGUAGE
        ? `https://kirill-markin.com/articles${tag ? `?tag=${tag}` : ''}`
        : `https://kirill-markin.com/${language}/${articlesSegment}${tag ? `?tag=${tag}` : ''}`;

    // Generate hreflang alternates for all supported languages
    const languageAlternates: Record<string, string> = {};

    // Add current language to alternates
    languageAlternates[language] = canonicalUrl;

    // Generate alternates for other languages
    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === language) continue;

        const langArticlesSegment = lang === DEFAULT_LANGUAGE
            ? 'articles'
            : getPathSegmentByLanguage('articles', lang);

        const alternateUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/articles${tag ? `?tag=${tag}` : ''}`
            : `https://kirill-markin.com/${lang}/${langArticlesSegment}${tag ? `?tag=${tag}` : ''}`;

        languageAlternates[lang] = alternateUrl;
    }

    return {
        ...baseMetadata,
        title,
        description,
        openGraph: {
            ...baseMetadata.openGraph,
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: '/articles/articles-hero.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Kirill Markin Articles',
                }
            ],
        },
        twitter: {
            ...baseMetadata.twitter,
            title,
            description,
            images: ['/articles/articles-hero.webp'],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates
        },
    };
}

/**
 * Generate metadata for the services page
 * @param options Parameters for metadata generation
 * @returns Metadata object
 */
export function generateServicesPageMetadata(
    options: {
        language: string;
        category?: string;
    }
): Metadata {
    const { language, category } = options;
    const servicesTranslations = getTranslation('services', language);
    const baseMetadata = getBaseMetadata(language);

    // Create title and description
    let title = `${servicesTranslations.title} | Kirill Markin`;
    const description = servicesTranslations.description;

    // Customize for categories
    if (category && category !== 'all' && servicesTranslations.serviceCategories) {
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        title = `${formattedCategory} ${servicesTranslations.title} | Kirill Markin`;
    }

    // Create canonical URL
    const servicesSegment = language === DEFAULT_LANGUAGE
        ? 'services'
        : getPathSegmentByLanguage('services', language);

    const canonicalUrl = language === DEFAULT_LANGUAGE
        ? `https://kirill-markin.com/services${category && category !== 'all' ? `?category=${category}` : ''}`
        : `https://kirill-markin.com/${language}/${servicesSegment}${category && category !== 'all' ? `?category=${category}` : ''}`;

    // Generate hreflang alternates for all supported languages
    const languageAlternates: Record<string, string> = {};

    // Add current language to alternates
    languageAlternates[language] = canonicalUrl;

    // Generate alternates for other languages
    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === language) continue;

        const langServicesSegment = lang === DEFAULT_LANGUAGE
            ? 'services'
            : getPathSegmentByLanguage('services', lang);

        const alternateUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/services${category && category !== 'all' ? `?category=${category}` : ''}`
            : `https://kirill-markin.com/${lang}/${langServicesSegment}${category && category !== 'all' ? `?category=${category}` : ''}`;

        languageAlternates[lang] = alternateUrl;
    }

    return {
        ...baseMetadata,
        title,
        description,
        openGraph: {
            ...baseMetadata.openGraph,
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: '/services/services-hero.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Kirill Markin Services',
                }
            ],
        },
        twitter: {
            ...baseMetadata.twitter,
            title,
            description,
            images: ['/services/services-hero.webp'],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates
        },
    };
} 