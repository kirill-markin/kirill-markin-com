'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ArticlePreviewCard from '@/components/ArticlePreviewCard';
import ArticlesListJsonLd from '@/components/ArticlesListJsonLd';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/data/contacts';
import type { MarkdownArticleSummary } from '@/lib/articleIndex';
import { getPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import { getInternalTagKey, getLocalizedTag } from '@/lib/tagLocalization';
import styles from './ArticlesPageContent.module.css';

interface ArticlesPageContentProps {
    language: string;
    articles: MarkdownArticleSummary[];
}

export default function ArticlesPageContent({ language, articles }: ArticlesPageContentProps) {
    const searchParams = useSearchParams();
    const currentLocalizedTag = searchParams.get('tag')?.toLowerCase() || 'all';

    // Convert localized tag to internal key for filtering
    const currentInternalTag = currentLocalizedTag === 'all' ? 'all' : getInternalTagKey(currentLocalizedTag, language);

    // Get translations for the specified language
    const t = getTranslation('articles', language);

    // Filter articles by internal tag
    const filteredArticles = currentInternalTag === 'all'
        ? articles
        : articles.filter(article =>
            article.tags && article.tags.includes(currentInternalTag)
        );

    // Get all unique internal tags for the tags menu, then localize them
    const allInternalTags = articles.flatMap(article => article.tags || []);
    const uniqueInternalTags = Array.from(new Set(allInternalTags)).filter(tag => tag);

    // Convert internal tags to localized tags for display
    const uniqueLocalizedTags = uniqueInternalTags.map(internalTag => ({
        internal: internalTag,
        localized: getLocalizedTag(internalTag, language)
    }));

    // Form base paths for links
    const articlesBasePath = language === 'en'
        ? '/articles'
        : `/${language}/${getPathSegmentByLanguage('articles', language)}`;

    // Form full path including tag parameter if specified
    const fullPath = currentLocalizedTag === 'all'
        ? articlesBasePath
        : `${articlesBasePath}/?tag=${currentLocalizedTag}`;

    // Form canonical URL
    const canonicalUrl = currentLocalizedTag === 'all'
        ? `${SITE_URL}${articlesBasePath}/`
        : `${SITE_URL}${articlesBasePath}/?tag=${currentLocalizedTag}`;
    const articlesBaseUrl = `${SITE_URL}${articlesBasePath}/`;

    // Function to get tag description
    const getTagDescription = () => {
        if (currentInternalTag === 'all') {
            return t.description;
        }

        // Display localized tag with first letter capitalized
        const localizedTag = getLocalizedTag(currentInternalTag, language);
        const formattedTag = localizedTag.charAt(0).toUpperCase() + localizedTag.slice(1);

        // Get count of articles with this tag
        const tagArticlesCount = filteredArticles.length;

        return `"${formattedTag}" [${tagArticlesCount}]. ${t.description}`;
    };

    return (
        <>
            <div className={styles.pageContent}>
                <ArticlesListJsonLd
                    articles={filteredArticles}
                    baseUrl={articlesBaseUrl}
                    language={language}
                    url={canonicalUrl}
                    tag={currentInternalTag !== 'all' ? getLocalizedTag(currentInternalTag, language) : undefined}
                />

                <div className={styles.pageColumn}>
                    <div className={styles.pageHeader}>
                        <div className={styles.headerTitle}>
                            <h1 className={styles.pageTitle}>
                                {currentInternalTag === 'all' ? (
                                    <>{t.title}</>
                                ) : (
                                    <>{getLocalizedTag(currentInternalTag, language).charAt(0).toUpperCase() + getLocalizedTag(currentInternalTag, language).slice(1)} {t.title}</>
                                )}
                            </h1>
                            <div className={styles.categoryDescription}>
                                <p>{getTagDescription()}</p>
                            </div>
                        </div>
                    </div>

                    <nav className={styles.tagsMenu} aria-label="Article tags">
                        <span className={styles.tagsMenuLabel}>Tags:</span>
                        <div className={styles.tagsMenuItems}>
                            <Link
                                href={`${articlesBasePath}/`}
                                className={`${styles.tagMenuItem} ${currentLocalizedTag === 'all' ? styles.active : ''}`}
                            >
                                {t.all}
                            </Link>

                            {uniqueLocalizedTags
                                .map(({ internal, localized }) => ({
                                    internal,
                                    localized,
                                    count: articles.filter(article =>
                                        article.tags && article.tags.includes(internal)
                                    ).length
                                }))
                                .sort((a, b) => b.count - a.count)
                                .map(({ internal, localized, count }) => (
                                    <Link
                                        key={internal}
                                        href={`${articlesBasePath}/?tag=${localized}`}
                                        className={`${styles.tagMenuItem} ${currentLocalizedTag === localized ? styles.active : ''}`}
                                    >
                                        {localized} [{count}]
                                    </Link>
                                ))}
                        </div>
                    </nav>

                    <div className={styles.articleCardsGrid}>
                        {filteredArticles.map((article, index) => {
                            const isWide = index === 0 || index === 5;

                            return (
                                <ArticlePreviewCard
                                    key={article.slug}
                                    href={`${articlesBasePath}/${article.slug}/`}
                                    title={article.title}
                                    description={article.description}
                                    thumbnailUrl={article.thumbnailUrl}
                                    languageLabel={article.language || language}
                                    typeLabel={article.type}
                                    date={article.date}
                                    dateLocale={language}
                                    achievementValue={article.achievementValue}
                                    achievementLabel={article.achievementLabel}
                                    isWide={isWide}
                                    priority={index < 4}
                                    titleTag="h2"
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer language={language} currentPath={fullPath} />
        </>
    );
}
