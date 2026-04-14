import { MeetingPageTemplate } from '@/components/pages/meet';
import { StripePaymentPage } from '@/components/pages/pay';
import {
    DEFAULT_LANGUAGE,
    getArticleLanguageAlternates,
    getArticleUrl,
    getLocaleForLanguage,
    getPathSegmentByLanguage,
    getSubPathSegmentByLanguage,
    isValidLanguage,
} from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticles, getArticleBySlug, getRelatedArticlesByTags } from '@/lib/articles';
import ArticlePageContent from '@/components/pages/ArticlePageContent';
import { markdownToHtml } from '@/lib/markdown';
import { generateMeetPageMetadata, generatePayPageMetadata, getMarkdownPath } from '@/lib/metadata';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

interface SubsegmentPageProps {
    params: Promise<{
        lang: string;
        segment: string;
        subsegment: string;
    }>;
}

// Generate static parameters for all supported languages
export async function generateStaticParams() {
    const params = [];

    // For each language
    for (const lang of ['es', 'zh', 'ar', 'hi']) {
        // Get segments
        const articlesSegment = getPathSegmentByLanguage('articles', lang);
        const meetSegment = getPathSegmentByLanguage('meet', lang);
        const paySegment = getPathSegmentByLanguage('pay', lang);

        // Get subsegments for meet
        const shortSubsegment = getSubPathSegmentByLanguage('meet', 'short', lang);
        const mediumSubsegment = getSubPathSegmentByLanguage('meet', 'medium', lang);
        const longSubsegment = getSubPathSegmentByLanguage('meet', 'long', lang);
        const allSubsegment = getSubPathSegmentByLanguage('meet', 'all', lang);

        // Add meet subsegments
        params.push({
            lang,
            segment: meetSegment,
            subsegment: shortSubsegment
        });

        params.push({
            lang,
            segment: meetSegment,
            subsegment: mediumSubsegment
        });

        params.push({
            lang,
            segment: meetSegment,
            subsegment: longSubsegment
        });

        params.push({
            lang,
            segment: meetSegment,
            subsegment: allSubsegment
        });

        // Add pay/stripe subsegment
        const stripeSubsegment = getSubPathSegmentByLanguage('pay', 'stripe', lang);
        params.push({
            lang,
            segment: paySegment,
            subsegment: stripeSubsegment
        });

        // Get articles for this language and add each article
        const languageArticles = await getAllArticles(lang);
        for (const article of languageArticles) {
            params.push({
                lang,
                segment: articlesSegment,
                subsegment: article.slug
            });
        }
    }

    return params;
}

// Generate metadata based on subsegment
export async function generateMetadata({ params }: SubsegmentPageProps): Promise<Metadata> {
    const { lang, segment, subsegment } = await params;

    // Check language validity
    if (!isValidLanguage(lang)) {
        return {};
    }

    // Get expected segment values
    const meetSegment = getPathSegmentByLanguage('meet', lang);
    const paySegment = getPathSegmentByLanguage('pay', lang);
    const articlesSegment = getPathSegmentByLanguage('articles', lang);

    // Get expected subsegment values
    const shortSubsegment = getSubPathSegmentByLanguage('meet', 'short', lang);
    const mediumSubsegment = getSubPathSegmentByLanguage('meet', 'medium', lang);
    const longSubsegment = getSubPathSegmentByLanguage('meet', 'long', lang);
    const allSubsegment = getSubPathSegmentByLanguage('meet', 'all', lang);
    const stripeSubsegment = getSubPathSegmentByLanguage('pay', 'stripe', lang);

    // For short meetings
    if (segment === meetSegment && subsegment === shortSubsegment) {
        return generateMeetPageMetadata({
            language: lang,
            type: 'short'
        });
    }

    // For medium meetings
    if (segment === meetSegment && subsegment === mediumSubsegment) {
        return generateMeetPageMetadata({
            language: lang,
            type: 'medium'
        });
    }

    // For long meetings
    if (segment === meetSegment && subsegment === longSubsegment) {
        return generateMeetPageMetadata({
            language: lang,
            type: 'long'
        });
    }

    // For all meetings
    if (segment === meetSegment && subsegment === allSubsegment) {
        return generateMeetPageMetadata({
            language: lang,
            type: 'all'
        });
    }

    // For Stripe payment
    if (segment === paySegment && subsegment === stripeSubsegment) {
        return generatePayPageMetadata({
            language: lang,
            type: 'stripe'
        });
    }

    // For articles
    if (segment === articlesSegment) {
        const article = await getArticleBySlug(subsegment, lang);

        if (!article) {
            return {};
        }

        const canonicalUrl = getArticleUrl(article.slug, article.metadata.language);
        const languageAlternates = getArticleLanguageAlternates(article.metadata);
        const openGraphModifiedTime = article.metadata.lastmod
            ? { modifiedTime: article.metadata.lastmod }
            : {};

        // Generate metadata for article
        return {
            title: article.metadata.title,
            description: article.metadata.description || '',
            keywords: article.metadata.tags,
            authors: [{ name: article.metadata.publisher || 'Kirill Markin' }],
            openGraph: {
                title: article.metadata.title,
                description: article.metadata.description || '',
                url: canonicalUrl,
                type: 'article',
                images: [
                    {
                        url: article.metadata.thumbnailUrl || '/articles/placeholder.webp',
                        width: 1200,
                        height: 630,
                        alt: article.metadata.title,
                    }
                ],
                locale: getLocaleForLanguage(article.metadata.language),
                publishedTime: article.metadata.date,
                ...openGraphModifiedTime,
                tags: article.metadata.tags,
                siteName: 'Kirill Markin',
            },
            twitter: {
                card: 'summary_large_image',
                title: article.metadata.title,
                description: article.metadata.description || '',
                images: [article.metadata.thumbnailUrl || '/articles/placeholder.webp'],
            },
            alternates: {
                canonical: canonicalUrl,
                languages: languageAlternates,
                types: { 'text/markdown': getMarkdownPath(canonicalUrl) },
            },
        };
    }

    // Default metadata
    return {};
}

export default async function SubsegmentPage({ params }: SubsegmentPageProps) {
    const { lang, segment, subsegment } = await params;

    // Check if language is valid
    if (!isValidLanguage(lang)) {
        notFound();
        return null;
    }

    // Get expected segment values
    const meetSegment = getPathSegmentByLanguage('meet', lang);
    const paySegment = getPathSegmentByLanguage('pay', lang);
    const articlesSegment = getPathSegmentByLanguage('articles', lang);

    // Get expected subsegment values
    const shortSubsegment = getSubPathSegmentByLanguage('meet', 'short', lang);
    const mediumSubsegment = getSubPathSegmentByLanguage('meet', 'medium', lang);
    const longSubsegment = getSubPathSegmentByLanguage('meet', 'long', lang);
    const allSubsegment = getSubPathSegmentByLanguage('meet', 'all', lang);
    const stripeSubsegment = getSubPathSegmentByLanguage('pay', 'stripe', lang);

    // For English language, redirect to main routes
    if (lang === DEFAULT_LANGUAGE) {
        if (segment === meetSegment) {
            if (subsegment === shortSubsegment) {
                redirect('/meet/short');
            } else if (subsegment === mediumSubsegment) {
                redirect('/meet/medium');
            } else if (subsegment === longSubsegment) {
                redirect('/meet/long');
            } else if (subsegment === allSubsegment) {
                redirect('/meet/all');
            }
        } else if (segment === paySegment && subsegment === stripeSubsegment) {
            redirect('/pay/stripe');
        } else if (segment === articlesSegment) {
            redirect(`/articles/${subsegment}/`);
        }
    }

    // Handle meet segment with subsegments
    if (segment === meetSegment) {
        if (subsegment === shortSubsegment) {
            return <MeetingPageTemplate language={lang} meetingType="short" />;
        } else if (subsegment === mediumSubsegment) {
            return <MeetingPageTemplate language={lang} meetingType="medium" />;
        } else if (subsegment === longSubsegment) {
            return <MeetingPageTemplate language={lang} meetingType="long" />;
        } else if (subsegment === allSubsegment) {
            return <MeetingPageTemplate language={lang} meetingType="all" />;
        }
    }

    // Handle pay segment with subsegments
    if (segment === paySegment) {
        if (subsegment === stripeSubsegment) {
            return <StripePaymentPage language={lang} />;
        }
    }

    // Handle articles segment with article slug as subsegment
    if (segment === articlesSegment) {
        const article = await getArticleBySlug(subsegment, lang);

        if (!article) {
            notFound();
        }

        // Convert Markdown to HTML
        const htmlContent = await markdownToHtml(article.content);

        const canonicalUrl = getArticleUrl(article.slug, article.metadata.language);

        // Get related articles
        const relatedArticles = await getRelatedArticlesByTags(
            article.slug,
            article.metadata.tags,
            lang,
            5
        );

        return (
            <ArticlePageContent
                article={article}
                htmlContent={htmlContent}
                canonicalUrl={canonicalUrl}
                relatedArticles={relatedArticles}
                language={lang}
            />
        );
    }

    // If no matching segment/subsegment, show 404
    notFound();
    return null;
} 
