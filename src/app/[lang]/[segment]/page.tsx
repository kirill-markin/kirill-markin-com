import { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { servicesData } from '@/data/services';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, isValidLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import ServicesPageContent from '@/components/pages/ServicesPageContent';
import { generateArticlesPageMetadata, generateServicesPageMetadata, generateMeetPageMetadata, generatePayPageMetadata } from '@/lib/metadata';
import { MeetPage } from '@/components/pages/meet';
import { PayPage } from '@/components/pages/pay';

interface SegmentPageProps {
    params: Promise<{ lang: string; segment: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static parameters for all supported languages
export async function generateStaticParams() {
    const params = [];

    // Get articles for tag generation
    const articles = await getAllArticles();

    // Get unique tags from all articles
    const allTags = articles.flatMap(article => article.metadata.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);

    // Create routes for each non-default language
    for (const lang of ['es', 'zh', 'ar', 'hi']) {
        // Segment for articles
        const articlesSegment = getPathSegmentByLanguage('articles', lang);

        // Segment for services
        const servicesSegment = getPathSegmentByLanguage('services', lang);

        // Segment for meet
        const meetSegment = getPathSegmentByLanguage('meet', lang);

        // Segment for pay
        const paySegment = getPathSegmentByLanguage('pay', lang);

        // Add base route for articles
        params.push({
            lang,
            segment: articlesSegment,
            searchParams: {}
        });

        // Add base route for services
        params.push({
            lang,
            segment: servicesSegment,
            searchParams: {}
        });

        // Add base route for meet
        params.push({
            lang,
            segment: meetSegment,
            searchParams: {}
        });

        // Add base route for pay
        params.push({
            lang,
            segment: paySegment,
            searchParams: {}
        });

        // Add routes for service categories
        const categories = Array.from(
            new Set(servicesData.map(service => service.categoryId))
        ).filter(category => category !== 'all');

        for (const category of categories) {
            // Use the localized category name in the URL
            const localizedCategoryName = getSubPathSegmentByLanguage('services', category, lang);

            params.push({
                lang,
                segment: servicesSegment,
                searchParams: { category: localizedCategoryName }
            });
        }

        // Add routes for article tags
        for (const tag of uniqueTags) {
            params.push({
                lang,
                segment: articlesSegment,
                searchParams: { tag }
            });
        }
    }

    return params;
}

// Helper function to resolve localized category name to internal category ID
function resolveInternalCategoryId(localizedCategory: string | undefined, language: string): string | null {
    if (!localizedCategory || localizedCategory === 'all' ||
        localizedCategory === getSubPathSegmentByLanguage('services', 'all', language)) {
        return 'all';
    }

    // Check against known categories
    const knownCategories = ['people', 'business', 'journalists'];

    // First check if it's already a known internal category (only for English)
    if (language === 'en' && knownCategories.includes(localizedCategory)) {
        return localizedCategory;
    }

    // Otherwise, check if it's a valid localized category for the CURRENT language only
    for (const internalCategory of knownCategories) {
        const localizedCategoryName = getSubPathSegmentByLanguage('services', internalCategory, language);
        if (localizedCategory === localizedCategoryName) {
            return internalCategory;
        }
    }

    // If we get here, the category is either:
    // 1. Not a valid category at all
    // 2. A valid category but from the wrong language
    // Either way, we should return null to trigger a 404
    return null;
}

export async function generateMetadata({ params, searchParams }: SegmentPageProps): Promise<Metadata> {
    const { lang, segment } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang)) {
        return {};
    }

    // Determine segment type
    const articlesSegment = getPathSegmentByLanguage('articles', lang);
    const servicesSegment = getPathSegmentByLanguage('services', lang);
    const meetSegment = getPathSegmentByLanguage('meet', lang);
    const paySegment = getPathSegmentByLanguage('pay', lang);

    // Get parameters from URL
    const searchParamsData = await searchParams;
    const tag = typeof searchParamsData.tag === 'string' ? searchParamsData.tag : undefined;
    const categoryParam = typeof searchParamsData.category === 'string' ? searchParamsData.category : undefined;

    // Generate metadata based on segment type
    if (segment === articlesSegment) {
        return generateArticlesPageMetadata({
            language: lang,
            tag: tag
        });
    } else if (segment === servicesSegment) {
        // Translate localized category name to internal category ID
        const internalCategoryId = resolveInternalCategoryId(categoryParam, lang);

        // If category is invalid, return empty metadata
        if (internalCategoryId === null) {
            return {};
        }

        return generateServicesPageMetadata({
            language: lang,
            category: internalCategoryId
        });
    } else if (segment === meetSegment) {
        return generateMeetPageMetadata({
            language: lang,
            type: 'index'
        });
    } else if (segment === paySegment) {
        return generatePayPageMetadata({
            language: lang,
            type: 'index'
        });
    }

    // If segment doesn't match any known type
    return {};
}

export default async function SegmentPage({ params, searchParams }: SegmentPageProps) {
    const { lang, segment } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang)) {
        notFound();
        return null;
    }

    // Determine segment type
    const articlesSegment = getPathSegmentByLanguage('articles', lang);
    const servicesSegment = getPathSegmentByLanguage('services', lang);
    const meetSegment = getPathSegmentByLanguage('meet', lang);
    const paySegment = getPathSegmentByLanguage('pay', lang);

    // Get parameters from URL
    const searchParamsData = await searchParams;
    const tag = typeof searchParamsData.tag === 'string' ? searchParamsData.tag : undefined;
    const category = typeof searchParamsData.category === 'string' ? searchParamsData.category : undefined;

    // For English language, redirect to main routes
    if (lang === DEFAULT_LANGUAGE) {
        if (segment === articlesSegment) {
            redirect(tag ? `/articles/?tag=${tag}` : '/articles/');
        } else if (segment === servicesSegment) {
            redirect(category ? `/services/?category=${category}` : '/services/');
        } else if (segment === meetSegment) {
            redirect('/meet/');
        } else if (segment === paySegment) {
            redirect('/pay/');
        }
    }

    // Return appropriate component based on segment type
    if (segment === articlesSegment) {
        return <ArticlesPageContent language={lang} tag={tag} />;
    } else if (segment === servicesSegment) {
        // If category is invalid, show 404
        if (category && resolveInternalCategoryId(category, lang) === null) {
            notFound();
            return null;
        }

        return <ServicesPageContent language={lang} category={category} />;
    } else if (segment === meetSegment) {
        return <MeetPage language={lang} />;
    } else if (segment === paySegment) {
        return <PayPage language={lang} />;
    }

    // If segment doesn't match any known type, show 404
    notFound();
    return null;
}