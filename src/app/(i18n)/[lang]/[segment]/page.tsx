import { Metadata } from 'next';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, isValidLanguage, getSubPathSegmentByLanguage } from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import ServicesPageContent from '@/components/pages/ServicesPageContent';
import { generateArticlesPageMetadata, generateServicesPageMetadata, generateMeetPageMetadata, generatePayPageMetadata } from '@/lib/metadata';
import { MeetPage } from '@/components/pages/meet';
import { PayPage } from '@/components/pages/pay';

// Force static generation even with searchParams
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

interface SegmentPageProps {
    params: Promise<{ lang: string; segment: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static parameters for all supported languages and segments
export async function generateStaticParams() {
    const params = [];

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

        // Add base routes (searchParams are handled at runtime with force-static)
        params.push({ lang, segment: articlesSegment });
        params.push({ lang, segment: servicesSegment });
        params.push({ lang, segment: meetSegment });
        params.push({ lang, segment: paySegment });
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

    // For meet and pay segments, don't access searchParams at all (keep them static)
    if (segment === meetSegment) {
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

    // Only access searchParams for articles and services (which need dynamic filtering)
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

    // For English language, redirect to main routes
    if (lang === DEFAULT_LANGUAGE) {
        if (segment === meetSegment) {
            redirect('/meet/');
        } else if (segment === paySegment) {
            redirect('/pay/');
        } else if (segment === articlesSegment || segment === servicesSegment) {
            // Only access searchParams for articles and services
            const searchParamsData = await searchParams;
            const tag = typeof searchParamsData.tag === 'string' ? searchParamsData.tag : undefined;
            const category = typeof searchParamsData.category === 'string' ? searchParamsData.category : undefined;

            if (segment === articlesSegment) {
                redirect(tag ? `/articles/?tag=${tag}` : '/articles/');
            } else if (segment === servicesSegment) {
                redirect(category ? `/services/?category=${category}` : '/services/');
            }
        }
    }

    // Return appropriate component based on segment type - handle static segments first
    if (segment === meetSegment) {
        return <MeetPage language={lang} />;
    } else if (segment === paySegment) {
        return <PayPage language={lang} />;
    }

    // Only access searchParams for articles and services (dynamic segments)
    const searchParamsData = await searchParams;
    const tag = typeof searchParamsData.tag === 'string' ? searchParamsData.tag : undefined;
    const category = typeof searchParamsData.category === 'string' ? searchParamsData.category : undefined;

    if (segment === articlesSegment) {
        return <ArticlesPageContent language={lang} tag={tag} />;
    } else if (segment === servicesSegment) {
        // If category is invalid, show 404
        if (category && resolveInternalCategoryId(category, lang) === null) {
            notFound();
            return null;
        }

        return <ServicesPageContent language={lang} category={category} />;
    }

    // If segment doesn't match any known type, show 404
    notFound();
    return null;
}