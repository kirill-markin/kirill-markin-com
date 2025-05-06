import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import ArticleContent from '@/components/ArticleContent';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import SocialShare from '@/components/SocialShare';
import AuthorBlock from '@/components/AuthorBlock';
import Footer from '@/components/Footer';
import styles from '@/app/articles/articles.module.css';
import { getPathSegmentByLanguage } from '@/lib/localization';

interface ArticlePageContentProps {
    article: Article;
    htmlContent: string;
    canonicalUrl: string;
    relatedArticles: Article[];
    language: string;
}

export default function ArticlePageContent({
    article,
    htmlContent,
    canonicalUrl,
    relatedArticles,
    language
}: ArticlePageContentProps) {
    const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

    // Determine the article link path based on language
    const getArticleLink = (slug: string, articleLanguage: string): string => {
        if (articleLanguage === 'en') {
            return `/articles/${slug}/`;
        } else {
            // Use getPathSegmentByLanguage to get the correct segment
            const segment = getPathSegmentByLanguage('articles', articleLanguage);
            return `/${articleLanguage}/${segment}/${slug}/`;
        }
    };

    // Also update tag link generation using getPathSegmentByLanguage
    const getTagLink = (tag: string): string => {
        if (language === 'en') {
            return `/articles/?tag=${tag}`;
        } else {
            const segment = getPathSegmentByLanguage('articles', language);
            return `/${language}/${segment}/?tag=${tag}`;
        }
    };

    return (
        <>
            <div className={styles.articlePageContainer}>
                <ArticleJsonLd article={article} url={canonicalUrl} />

                {/* Fixed social share buttons */}
                <SocialShare url={canonicalUrl} title={article.metadata.title} variant="fixed" />

                <article className={styles.articleContainer}>
                    <header className={styles.articleHeader}>
                        <div className={styles.articleMeta}>
                            <div className={styles.metaRow}>
                                <div className={styles.articleTags}>
                                    {article.metadata.tags && article.metadata.tags.length > 0 && (
                                        article.metadata.tags.map((tag) => (
                                            <Link
                                                key={tag}
                                                href={getTagLink(tag)}
                                            >
                                                <span className={styles.tag}>
                                                    {tag}
                                                </span>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                {article.metadata.date && (
                                    <time className={styles.articleDate} dateTime={article.metadata.date}>
                                        {new Date(article.metadata.date).toLocaleDateString(
                                            language === 'en' ? 'en-US' : language,
                                            {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }
                                        )}
                                    </time>
                                )}
                            </div>
                        </div>
                    </header>

                    <ArticleContent
                        htmlContent={htmlContent}
                        className={styles.articleContent}
                    />

                    {/* Related Articles Section */}
                    {relatedArticles.length > 0 && (
                        <div className={styles.relatedArticlesSection}>
                            <h2 className={styles.relatedArticlesTitle}>
                                {relatedArticles.every(relatedArticle =>
                                    relatedArticle.metadata.tags.some(tag => article.metadata.tags.includes(tag))
                                )
                                    ? (language === 'en' ? 'Related Articles' : 'Artículos Relacionados')
                                    : (language === 'en' ? 'Related & Recent Articles' : 'Artículos Relacionados y Recientes')
                                }
                            </h2>

                            <div className={styles.mediaMentions}>
                                {relatedArticles.map((relatedArticle, index) => {
                                    const isVideo = relatedArticle.metadata.isVideo ||
                                        relatedArticle.metadata.type?.toLowerCase() === 'video';

                                    return (
                                        <article
                                            key={relatedArticle.slug}
                                            className={`${styles.mediaMention} ${isVideo ? styles.video : ''}`}
                                        >
                                            <Link
                                                href={getArticleLink(relatedArticle.slug, relatedArticle.metadata.language)}
                                                className={styles.mentionLink}
                                            >
                                                <div className={styles.language}>
                                                    <div className={styles.text}>[{relatedArticle.metadata.language || 'en'}]</div>
                                                </div>

                                                {relatedArticle.metadata.type && (
                                                    <div className={styles.type}>
                                                        <div className={styles.text}>[{relatedArticle.metadata.type}]</div>
                                                    </div>
                                                )}

                                                <div className={styles.thumbnailContainer}>
                                                    <Image
                                                        className={styles.thumbnail}
                                                        src={relatedArticle.metadata.thumbnailUrl || PLACEHOLDER_IMAGE}
                                                        alt={relatedArticle.metadata.title}
                                                        width={640}
                                                        height={360}
                                                        sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
                                                        quality={75}
                                                        priority={index < 2}
                                                    />
                                                </div>

                                                <div className={styles.content}>
                                                    <h3 className={styles.title}>{relatedArticle.metadata.title}</h3>

                                                    {relatedArticle.metadata.description && (
                                                        <p className={styles.description}>{relatedArticle.metadata.description}</p>
                                                    )}

                                                    <div className={styles.footer}>
                                                        <div className={styles.date}>
                                                            {relatedArticle.metadata.date && (
                                                                <time dateTime={relatedArticle.metadata.date}>
                                                                    {new Date(relatedArticle.metadata.date).toLocaleDateString(
                                                                        relatedArticle.metadata.language === 'en' ? 'en-US' : relatedArticle.metadata.language,
                                                                        {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                        }
                                                                    )}
                                                                </time>
                                                            )}
                                                        </div>

                                                        {relatedArticle.metadata.achievementValue && relatedArticle.metadata.achievementLabel && (
                                                            <div className={styles.achievement}>
                                                                <div className={styles.value}>{relatedArticle.metadata.achievementValue}</div>
                                                                <div className={styles.label}>{relatedArticle.metadata.achievementLabel}</div>
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
                    )}

                    {/* Single AuthorBlock instance controlled by CSS */}
                    <AuthorBlock />

                    {/* Mobile social share buttons */}
                    <div className={styles.mobileShareContainer}>
                        <h3 className={styles.shareTitle}>
                            {language === 'en' ? 'Share this article' : 'Compartir este artículo'}
                        </h3>
                        <SocialShare url={canonicalUrl} title={article.metadata.title} variant="inline" />
                    </div>

                </article>
            </div>
            <Footer language={language} currentPath={canonicalUrl} translations={article.metadata.translations} />
        </>
    );
} 