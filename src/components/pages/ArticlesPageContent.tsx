import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import styles from '@/app/articles/articles.module.css';
import ArticlesListJsonLd from '@/components/ArticlesListJsonLd';
import { getPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import Footer from '@/components/Footer';

interface ArticlesPageContentProps {
    language: string;
    tag?: string;
}

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

export default async function ArticlesPageContent({ language, tag }: ArticlesPageContentProps) {
    // Get translations for the specified language
    const t = getTranslation('articles', language);

    // Get articles for the specified language (or all articles for English)
    const articles = await getAllArticles(language);

    // Filter articles by tag if specified
    const tagParam = tag?.toLowerCase() || 'all';
    const filteredArticles = tagParam === 'all'
        ? articles
        : articles.filter(article =>
            article.metadata.tags && article.metadata.tags.includes(tagParam)
        );

    // Get all unique tags for the tags menu
    const allTags = articles.flatMap(article => article.metadata.tags || []);
    const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);

    // Form base paths for links
    const articlesBasePath = language === 'en'
        ? '/articles'
        : `/${language}/${getPathSegmentByLanguage('articles', language)}`;

    // Form full path including tag parameter if specified
    const fullPath = tagParam === 'all'
        ? articlesBasePath
        : `${articlesBasePath}/?tag=${tagParam}`;

    // Form canonical URL
    const canonicalUrl = tagParam === 'all'
        ? `https://kirill-markin.com${articlesBasePath}/`
        : `https://kirill-markin.com${articlesBasePath}/?tag=${tagParam}`;

    // Function to get tag description
    const getTagDescription = () => {
        if (tagParam === 'all') {
            return t.description;
        }

        // Display tag with first letter capitalized
        const formattedTag = tagParam.charAt(0).toUpperCase() + tagParam.slice(1);

        // Get count of articles with this tag
        const tagArticlesCount = filteredArticles.length;

        // Note: filteredBy removed in consolidated translations, would need to be added back if needed
        return `"${formattedTag}" [${tagArticlesCount}]. ${t.description}`;
    };

    return (
        <>
            <div className={styles.content}>
                <ArticlesListJsonLd
                    articles={filteredArticles}
                    url={canonicalUrl}
                    tag={tagParam !== 'all' ? tagParam : undefined}
                />

                <div className={styles.fullWidthColumn}>
                    <div className={styles.articlesHeader}>
                        <div className={styles.articlesHeaderTitle}>
                            <h1 className={styles.articlesTitle}>
                                {tagParam === 'all' ? (
                                    <>{t.title}<span className={styles.glitchLetter}>s</span></>
                                ) : (
                                    <>{tagParam.charAt(0).toUpperCase() + tagParam.slice(1)} {t.title}<span className={styles.glitchLetter}>s</span></>
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
                                className={`${styles.tagMenuItem} ${tagParam === 'all' ? styles.active : ''}`}
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
                                        className={`${styles.tagMenuItem} ${tagParam === tag ? styles.active : ''}`}
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