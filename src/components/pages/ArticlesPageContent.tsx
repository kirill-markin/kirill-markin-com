'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from '@/app/(default)/articles/articles.module.css';
import ArticlesListJsonLd from '@/components/ArticlesListJsonLd';
import { getPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';
import { Article } from '@/lib/articles';
import { getInternalTagKey, getLocalizedTag } from '@/lib/tagLocalization';

interface ArticlesPageContentProps {
    language: string;
    articles: Article[]; // Articles passed from server as props
}

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

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
            article.metadata.tags && article.metadata.tags.includes(currentInternalTag)
        );

    // Get all unique internal tags for the tags menu, then localize them
    const allInternalTags = articles.flatMap(article => article.metadata.tags || []);
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
        ? `https://kirill-markin.com${articlesBasePath}/`
        : `https://kirill-markin.com${articlesBasePath}/?tag=${currentLocalizedTag}`;

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
            <div className={styles.content}>
                <ArticlesListJsonLd
                    articles={filteredArticles}
                    url={canonicalUrl}
                    tag={currentInternalTag !== 'all' ? getLocalizedTag(currentInternalTag, language) : undefined}
                />

                <div className={styles.fullWidthColumn}>
                    <div className={styles.articlesHeader}>
                        <div className={styles.articlesHeaderTitle}>
                            <h1 className={styles.articlesTitle}>
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
                        <span>Tags:</span>
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
                                        article.metadata.tags && article.metadata.tags.includes(internal)
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

                    <div className={styles.mediaMentions}>
                        {filteredArticles.map((article, index) => {
                            const isLarge = index === 0 || index === 5;
                            const isVideo = article.metadata.isVideo || article.metadata.type?.toLowerCase() === 'video';

                            return (
                                <article
                                    key={article.slug}
                                    className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}
                                >
                                    <Link
                                        href={`${articlesBasePath}/${article.slug}/`}
                                        className={styles.mentionLink}
                                    >
                                        <div className={styles.language}>
                                            <div className={styles.text}>[{article.metadata.language || language}]</div>
                                        </div>

                                        {article.metadata.type && (
                                            <div className={styles.type}>
                                                <div className={styles.text}>[{article.metadata.type}]</div>
                                            </div>
                                        )}

                                        <div className={styles.thumbnailContainer}>
                                            <Image
                                                className={styles.thumbnail}
                                                src={article.metadata.thumbnailUrl || PLACEHOLDER_IMAGE}
                                                alt={article.metadata.title}
                                                width={640}
                                                height={360}
                                                sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
                                                quality={75}
                                                priority={index < 4}
                                            />
                                        </div>

                                        <div className={styles.content}>
                                            <h2 className={styles.title}>{article.metadata.title}</h2>

                                            {article.metadata.description && (
                                                <p className={styles.description}>{article.metadata.description}</p>
                                            )}

                                            <div className={styles.footer}>
                                                <div className={styles.date}>
                                                    {article.metadata.date && (
                                                        <time dateTime={article.metadata.date}>
                                                            {new Date(article.metadata.date).toLocaleDateString(language === 'en' ? 'en-US' : language, {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </time>
                                                    )}
                                                </div>

                                                {article.metadata.achievementValue && article.metadata.achievementLabel && (
                                                    <div className={styles.achievement}>
                                                        <div className={styles.value}>{article.metadata.achievementValue}</div>
                                                        <div className={styles.label}>{article.metadata.achievementLabel}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer language={language} currentPath={fullPath} />
        </>
    );
} 