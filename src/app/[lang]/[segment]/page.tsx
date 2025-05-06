import { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { servicesData } from '@/data/services';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, isValidLanguage } from '@/lib/localization';
import { redirect } from 'next/navigation';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import ServicesPageContent from '@/components/pages/ServicesPageContent';
import { generateArticlesPageMetadata, generateServicesPageMetadata } from '@/lib/metadata';
import { MeetPage } from '@/components/pages/meet';
import { PayPage } from '@/components/pages/pay';

interface SegmentPageProps {
    params: Promise<{ lang: string; segment: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static parameters for all supported languages
export function generateStaticParams() {
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
            params.push({
                lang,
                segment: servicesSegment,
                searchParams: { category }
            });
        }
    }

    return params;
}

// Get parameters for article tag paths
export async function generateStaticParamsArticlesTags() {
    const articles = await getAllArticles();

    // Get unique tags from all articles
    const allTags = articles.flatMap(article => article.metadata.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);

    const params = [];

    // For each non-default language, create entries for all tags
    for (const lang of ['es', 'zh', 'ar', 'hi']) {
        const articlesSegment = getPathSegmentByLanguage('articles', lang);

        // Pages for each tag
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
    const category = typeof searchParamsData.category === 'string' ? searchParamsData.category : undefined;

    // Generate metadata based on segment type
    if (segment === articlesSegment) {
        return generateArticlesPageMetadata({
            language: lang,
            tag: tag
        });
    } else if (segment === servicesSegment) {
        return generateServicesPageMetadata({
            language: lang,
            category: category
        });
    } else if (segment === meetSegment) {
        return {
            title: 'Meeting Booking Options with Kirill Markin',
            description: 'Select your preferred meeting option with Kirill Markin. Choose meeting timing and duration.',
            alternates: {
                canonical: `https://kirill-markin.com/${lang}/${segment}/`,
            },
        };
    } else if (segment === paySegment) {
        return {
            title: 'Payment Options | Kirill Markin',
            description: 'Choose your preferred payment method for Kirill Markin\'s services.',
            alternates: {
                canonical: `https://kirill-markin.com/${lang}/${segment}/`,
            },
        };
    }

    // If segment doesn't match any known type
    return {};
}

export default async function SegmentPage({ params, searchParams }: SegmentPageProps) {
    const { lang, segment } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang)) {
        redirect('/');
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
        return <ServicesPageContent language={lang} category={category} />;
    } else if (segment === meetSegment) {
        return <MeetPage language={lang} />;
    } else if (segment === paySegment) {
        return <PayPage language={lang} />;
    }

    // If segment doesn't match any known type, redirect to home
    redirect(`/${lang}/`);
}