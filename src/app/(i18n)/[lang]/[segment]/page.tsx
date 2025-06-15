import { Metadata } from 'next';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, isValidLanguage } from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import ServicesPageContent from '@/components/pages/ServicesPageContent';
import { generateArticlesPageMetadata, generateServicesPageMetadata, generateMeetPageMetadata, generatePayPageMetadata } from '@/lib/metadata';
import { MeetPage } from '@/components/pages/meet';
import { PayPage } from '@/components/pages/pay';
import { getAllArticles } from '@/lib/articles';
import { servicesData } from '@/data/services';

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

export async function generateMetadata({ params }: { params: Promise<{ lang: string; segment: string }> }): Promise<Metadata> {
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

    // For articles and services, generate static metadata without filtering
    if (segment === articlesSegment) {
        return generateArticlesPageMetadata({
            language: lang,
            tag: undefined
        });
    } else if (segment === servicesSegment) {
        return generateServicesPageMetadata({
            language: lang,
            category: undefined
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
    } else if (segment === articlesSegment) {
        // Load articles on server and pass to client component
        const articles = await getAllArticles(lang);
        return <ArticlesPageContent language={lang} articles={articles} />;
    } else if (segment === servicesSegment) {
        // Pass services data to client component
        return <ServicesPageContent language={lang} services={servicesData} />;
    }

    // If segment doesn't match any known type, show 404
    notFound();
    return null;
}