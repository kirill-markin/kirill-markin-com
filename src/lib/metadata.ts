import { Metadata } from 'next';
import { getLocaleForLanguage, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, getPathSegmentByLanguage, getTranslation, getSubPathSegmentByLanguage } from '@/lib/localization';

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

    // Create title and description - prioritize SEO-optimized fields
    let title: string = articlesTranslations.metaTitle || `${articlesTranslations.title} | Kirill Markin`;
    let description: string = articlesTranslations.metaDescription || String(articlesTranslations.description);

    // Customize for tags
    if (tag) {
        const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
        title = `${formattedTag} ${articlesTranslations.title} | Kirill Markin`;
        description = `${tag}. ${articlesTranslations.metaDescription || articlesTranslations.description}`;
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

    // Create title and description - prioritize SEO-optimized fields
    let title: string = servicesTranslations.metaTitle || `${servicesTranslations.title} | Kirill Markin`;
    const description: string = servicesTranslations.metaDescription || String(servicesTranslations.description);

    // Customize for categories
    if (category && category !== 'all' && servicesTranslations.serviceCategories) {
        // Get category display name from translation
        let categoryDisplay: string = category.charAt(0).toUpperCase() + category.slice(1);

        // Use type assertion to safely access the category display name
        if (servicesTranslations.serviceCategories &&
            typeof servicesTranslations.serviceCategories === 'object' &&
            category in servicesTranslations.serviceCategories) {
            const categoryKey = category as keyof typeof servicesTranslations.serviceCategories;
            categoryDisplay = String(servicesTranslations.serviceCategories[categoryKey]);
        }

        title = `${categoryDisplay} ${servicesTranslations.title} | Kirill Markin`;
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

/**
 * Generate metadata for meeting booking pages
 * @param options Parameters for metadata generation
 * @returns Metadata object
 */
export function generateMeetPageMetadata(
    options: {
        language: string;
        type?: 'index' | 'short' | 'all';
    }
): Metadata {
    const { language, type = 'index' } = options;
    const meetTranslations = getTranslation('meet', language);
    const baseMetadata = getBaseMetadata(language);

    // Create title and description based on page type
    let title: string;
    let description: string;
    const imagePath: string = '/images/meeting-booking.webp';
    let canonicalPath: string;

    if (type === 'short') {
        // Use localized titles and descriptions optimized for SEO
        title = meetTranslations.shortMeeting?.metaTitle ||
            `${meetTranslations.shortMeeting?.title || '15-Minute Welcome Meeting'} | Kirill Markin`;
        description = String(meetTranslations.shortMeeting?.metaDescription ||
            meetTranslations.shortMeeting?.description ||
            'Schedule a free 15-minute introduction call with Kirill Markin to discuss your needs and how we can work together.');
        canonicalPath = '/meet/short/';
    } else if (type === 'all') {
        title = meetTranslations.allMeetings?.metaTitle ||
            `${meetTranslations.allMeetings?.title || 'All Meeting Options'} | Kirill Markin`;
        description = String(meetTranslations.allMeetings?.metaDescription ||
            meetTranslations.allMeetings?.description ||
            'Choose from all available consultation options and time slots with Kirill Markin.');
        canonicalPath = '/meet/all/';
    } else {
        title = meetTranslations.metaTitle ||
            `${meetTranslations.title || 'Meeting Booking Options'} | Kirill Markin`;
        description = String(meetTranslations.metaDescription ||
            meetTranslations.description ||
            'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.');
        canonicalPath = '/meet/';
    }

    // Create canonical URL
    const meetSegment = language === DEFAULT_LANGUAGE
        ? 'meet'
        : getPathSegmentByLanguage('meet', language);

    let meetTypeSegment = '';
    if (type === 'short') {
        meetTypeSegment = language === DEFAULT_LANGUAGE
            ? '/short'
            : `/${getSubPathSegmentByLanguage('meet', 'short', language)}`;
    } else if (type === 'all') {
        meetTypeSegment = language === DEFAULT_LANGUAGE
            ? '/all'
            : `/${getSubPathSegmentByLanguage('meet', 'all', language)}`;
    }

    const canonicalUrl = language === DEFAULT_LANGUAGE
        ? `https://kirill-markin.com${canonicalPath}`
        : `https://kirill-markin.com/${language}/${meetSegment}${meetTypeSegment}/`;

    // Generate hreflang alternates for all supported languages
    const languageAlternates: Record<string, string> = {};

    // Add current language to alternates
    languageAlternates[language] = canonicalUrl;

    // Generate alternates for other languages
    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === language) continue;

        const langMeetSegment = lang === DEFAULT_LANGUAGE
            ? 'meet'
            : getPathSegmentByLanguage('meet', lang);

        let langMeetTypeSegment = '';
        if (type === 'short') {
            langMeetTypeSegment = lang === DEFAULT_LANGUAGE
                ? '/short'
                : `/${getSubPathSegmentByLanguage('meet', 'short', lang)}`;
        } else if (type === 'all') {
            langMeetTypeSegment = lang === DEFAULT_LANGUAGE
                ? '/all'
                : `/${getSubPathSegmentByLanguage('meet', 'all', lang)}`;
        }

        const alternateUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/meet${langMeetTypeSegment}/`
            : `https://kirill-markin.com/${lang}/${langMeetSegment}${langMeetTypeSegment}/`;

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
                    url: imagePath,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            ...baseMetadata.twitter,
            title,
            description,
            images: [imagePath],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates
        },
    };
}

/**
 * Generate metadata for payment pages
 * @param options Parameters for metadata generation
 * @returns Metadata object
 */
export function generatePayPageMetadata(
    options: {
        language: string;
        type?: 'index' | 'stripe';
    }
): Metadata {
    const { language, type = 'index' } = options;
    const payTranslations = getTranslation('pay', language);
    const baseMetadata = getBaseMetadata(language);

    // Create title and description based on page type
    let title: string;
    let description: string;
    const imagePath: string = '/images/payment.webp';
    let canonicalPath: string;

    if (type === 'stripe') {
        // Use localized titles and descriptions optimized for SEO
        title = payTranslations.stripe?.metaTitle ||
            `${payTranslations.stripe?.title || 'Pay with Stripe'} | Kirill Markin`;
        description = String(payTranslations.stripe?.metaDescription ||
            payTranslations.stripe?.description ||
            'Secure payment with credit or debit card through Stripe payment system.');
        canonicalPath = '/pay/stripe/';
    } else {
        title = payTranslations.metaTitle ||
            `${payTranslations.title || 'Payment Options'} | Kirill Markin`;
        description = String(payTranslations.metaDescription ||
            payTranslations.description ||
            'Select your preferred payment method for services with Kirill Markin.');
        canonicalPath = '/pay/';
    }

    // Create canonical URL
    const paySegment = language === DEFAULT_LANGUAGE
        ? 'pay'
        : getPathSegmentByLanguage('pay', language);

    let payTypeSegment = '';
    if (type === 'stripe') {
        payTypeSegment = language === DEFAULT_LANGUAGE
            ? '/stripe'
            : `/${getSubPathSegmentByLanguage('pay', 'stripe', language)}`;
    }

    const canonicalUrl = language === DEFAULT_LANGUAGE
        ? `https://kirill-markin.com${canonicalPath}`
        : `https://kirill-markin.com/${language}/${paySegment}${payTypeSegment}/`;

    // Generate hreflang alternates for all supported languages
    const languageAlternates: Record<string, string> = {};

    // Add current language to alternates
    languageAlternates[language] = canonicalUrl;

    // Generate alternates for other languages
    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === language) continue;

        const langPaySegment = lang === DEFAULT_LANGUAGE
            ? 'pay'
            : getPathSegmentByLanguage('pay', lang);

        let langPayTypeSegment = '';
        if (type === 'stripe') {
            langPayTypeSegment = lang === DEFAULT_LANGUAGE
                ? '/stripe'
                : `/${getSubPathSegmentByLanguage('pay', 'stripe', lang)}`;
        }

        const alternateUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/pay${langPayTypeSegment}/`
            : `https://kirill-markin.com/${lang}/${langPaySegment}${langPayTypeSegment}/`;

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
                    url: imagePath,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            ...baseMetadata.twitter,
            title,
            description,
            images: [imagePath],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates
        },
    };
} 