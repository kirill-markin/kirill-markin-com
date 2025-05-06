import { Metadata } from 'next';
import { getAllArticles, getArticleBySlug, getRelatedArticlesByTags } from '@/lib/articles';
import { DEFAULT_LANGUAGE, getPathSegmentByLanguage, isValidLanguage } from '@/lib/localization';
import { redirect, notFound } from 'next/navigation';
import ArticlePageContent from '@/components/pages/ArticlePageContent';
import { markdownToHtml } from '@/lib/markdown';

interface SlugPageProps {
    params: Promise<{
        lang: string;
        segment: string;
        slug: string;
    }>;
}

// Generate static parameters for all supported languages
export async function generateStaticParams() {
    const params = [];

    // For each language and article
    for (const lang of ['es', 'zh', 'ar', 'hi']) {
        const articlesSegment = getPathSegmentByLanguage('articles', lang);

        // Get articles for this language
        const languageArticles = await getAllArticles(lang);

        // Add each article slug
        for (const article of languageArticles) {
            params.push({
                lang,
                segment: articlesSegment,
                slug: article.slug
            });
        }
    }

    return params;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
    const { lang, segment, slug } = await params;

    // Check language validity
    if (!isValidLanguage(lang)) {
        return {};
    }

    // Determine segment type
    const articlesSegment = getPathSegmentByLanguage('articles', lang);

    // Generate metadata based on segment type
    if (segment === articlesSegment) {
        const article = await getArticleBySlug(slug, lang);

        if (!article) {
            return {};
        }

        // Create canonical URL
        const canonicalUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/articles/${slug}/`
            : `https://kirill-markin.com/${lang}/${articlesSegment}/${slug}/`;

        return {
            title: `${article.metadata.title} | Kirill Markin`,
            description: article.metadata.description || '',
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
            },
            twitter: {
                card: 'summary_large_image',
                title: article.metadata.title,
                description: article.metadata.description || '',
                images: [article.metadata.thumbnailUrl || '/articles/placeholder.webp'],
            },
            alternates: {
                canonical: canonicalUrl,
            },
        };
    }

    return {};
}

export default async function SlugPage({ params }: SlugPageProps) {
    const { lang, segment, slug } = await params;

    // Check language validity
    if (!isValidLanguage(lang)) {
        redirect('/');
    }

    // Determine segment type
    const articlesSegment = getPathSegmentByLanguage('articles', lang);

    // For English language redirect to main route
    if (lang === DEFAULT_LANGUAGE) {
        if (segment === articlesSegment) {
            redirect(`/articles/${slug}/`);
        }
    }

    // Handle articles
    if (segment === articlesSegment) {
        const article = await getArticleBySlug(slug, lang);

        if (!article) {
            notFound();
        }

        // Convert Markdown to HTML
        const htmlContent = await markdownToHtml(article.content);

        // Create URL for JSON-LD
        const canonicalUrl = lang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/articles/${slug}/`
            : `https://kirill-markin.com/${lang}/${articlesSegment}/${slug}/`;

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

    // If segment doesn't match any known types
    notFound();
}