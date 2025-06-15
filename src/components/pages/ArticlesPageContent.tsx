'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import styles from '@/app/(default)/articles/articles.module.css';
import ArticlesListJsonLd from '@/components/ArticlesListJsonLd';
import { getPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';
import { Article } from '@/lib/articles';

interface ArticlesPageContentProps {
    language: string;
    articles: Article[]; // Articles passed from server as props
}

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

export default function ArticlesPageContent({ language, articles }: ArticlesPageContentProps) {
    const searchParams = useSearchParams();
    const currentTag = searchParams.get('tag')?.toLowerCase() || 'all';

    // Get translations for the specified language
    const t = getTranslation('articles', language);

    // Filter articles by tag
    const filteredArticles = currentTag === 'all'
        ? articles
        : articles.filter(article =>
            article.metadata.tags && article.metadata.tags.includes(currentTag)
        );

    // Get all unique tags for the tags menu
    const allTags = articles.flatMap(article => article.metadata.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);

    // Form base paths for links
    const articlesBasePath = language === 'en'
        ? '/articles'
        : `/${language}/${getPathSegmentByLanguage('articles', language)}`;

    // Form full path including tag parameter if specified
    const fullPath = currentTag === 'all'
        ? articlesBasePath
        : `${articlesBasePath}/?tag=${currentTag}`;

    // Form canonical URL
    const canonicalUrl = currentTag === 'all'
        ? `https://kirill-markin.com${articlesBasePath}/`
        : `https://kirill-markin.com${articlesBasePath}/?tag=${currentTag}`;

    // Function to get tag description
    const getTagDescription = () => {
        if (currentTag === 'all') {
            return t.description;
        }

        // Display tag with first letter capitalized
        const formattedTag = currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

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
                    tag={currentTag !== 'all' ? currentTag : undefined}
                />

                <div className={styles.fullWidthColumn}>
                    <div className={styles.articlesHeader}>
                        <div className={styles.articlesHeaderTitle}>
                            <h1 className={styles.articlesTitle}>
                                {currentTag === 'all' ? (
                                    <>{t.title}<span className={styles.glitchLetter}>s</span></>
                                ) : (
                                    <>{currentTag.charAt(0).toUpperCase() + currentTag.slice(1)} {t.title}<span className={styles.glitchLetter}>s</span></>
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
                                className={`${styles.tagMenuItem} ${currentTag === 'all' ? styles.active : ''}`}
                            >
                                All
                            </Link>

                            {uniqueTags
                                .map(tag => ({
                                    tag,
                                    count: articles.filter(article =>
                                        article.metadata.tags && article.metadata.tags.includes(tag)
                                    ).length
                                }))
                                .sort((a, b) => b.count - a.count)
                                .map(({ tag, count }) => (
                                    <Link
                                        key={tag}
                                        href={`${articlesBasePath}/?tag=${tag}`}
                                        className={`${styles.tagMenuItem} ${currentTag === tag ? styles.active : ''}`}
                                    >
                                        {tag} [{count}]
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