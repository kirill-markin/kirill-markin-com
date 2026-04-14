import Link from 'next/link';
import ArticleContent from '@/components/ArticleContent';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import ArticlePreviewCard from '@/components/ArticlePreviewCard';
import AuthorBlock from '@/components/AuthorBlock';
import CopyMarkdownButton from '@/components/CopyMarkdownButton/CopyMarkdownButton';
import Footer from '@/components/Footer';
import SidebarRelatedArticles from '@/components/SidebarRelatedArticles';
import SidebarVisibilityWrapper from '@/components/SidebarRelatedArticles/SidebarVisibilityWrapper';
import SocialShare from '@/components/SocialShare';
import { personalInfo } from '@/data/personalInfo';
import { Article } from '@/lib/articles';
import { DEFAULT_LANGUAGE, getArticlePath, getPathSegmentByLanguage, getSubPathSegmentByLanguage, getTranslation } from '@/lib/localization';
import { getLocalizedTag } from '@/lib/tagLocalization';
import styles from './ArticlePageContent.module.css';

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
    const commonTranslations = getTranslation('common', language);
    const authorLink = language === DEFAULT_LANGUAGE ? '/' : `/${language}/`;
    const publicationLocale = language === DEFAULT_LANGUAGE ? 'en-US' : language;
    const publishedDate = article.metadata.date
        ? new Date(article.metadata.date).toLocaleDateString(publicationLocale, commonTranslations.dateFormat)
        : null;
    const modifiedDate = article.metadata.lastmod
        ? new Date(article.metadata.lastmod).toLocaleDateString(publicationLocale, commonTranslations.dateFormat)
        : null;

    const getTagLink = (tag: string): string => {
        const localizedTag = getSubPathSegmentByLanguage('articles', tag, language);
        if (language === DEFAULT_LANGUAGE) {
            return `/articles/?tag=${localizedTag}`;
        } else {
            const segment = getPathSegmentByLanguage('articles', language);
            return `/${language}/${segment}/?tag=${localizedTag}`;
        }
    };

    return (
        <>
            <div className={styles.pageContainer}>
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
                                                <span className={styles.articleTag}>
                                                    {getLocalizedTag(tag, language)}
                                                </span>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                <div className={styles.metaRight}>
                                    <CopyMarkdownButton content={article.content} />
                                </div>
                            </div>

                            <div className={styles.bylineRow}>
                                <div className={styles.byline}>
                                    <span className={styles.bylineLabel}>{commonTranslations.by}</span>
                                    <Link href={authorLink} className={styles.bylineAuthor}>
                                        {personalInfo.name}
                                    </Link>
                                </div>

                                <div className={styles.publicationMeta}>
                                    {publishedDate && (
                                        <span className={styles.publicationMetaItem}>
                                            <span className={styles.publicationLabel}>{commonTranslations.published}</span>
                                            <time className={styles.articleDate} dateTime={article.metadata.date}>
                                                {publishedDate}
                                            </time>
                                        </span>
                                    )}

                                    {modifiedDate && (
                                        <span className={styles.publicationMetaItem}>
                                            <span className={styles.publicationLabel}>{commonTranslations.updated}</span>
                                            <time className={styles.articleDate} dateTime={article.metadata.lastmod}>
                                                {modifiedDate}
                                            </time>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    <ArticleContent htmlContent={htmlContent} className={styles.articleContentWrapper} />

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

                            <div className={styles.relatedArticlesGrid}>
                                {relatedArticles.map((relatedArticle, index) => (
                                    <ArticlePreviewCard
                                        key={relatedArticle.slug}
                                        href={getArticlePath(relatedArticle.slug, relatedArticle.metadata.language)}
                                        title={relatedArticle.metadata.title}
                                        description={relatedArticle.metadata.description}
                                        thumbnailUrl={relatedArticle.metadata.thumbnailUrl}
                                        languageLabel={relatedArticle.metadata.language || 'en'}
                                        typeLabel={relatedArticle.metadata.type}
                                        date={relatedArticle.metadata.date}
                                        dateLocale={relatedArticle.metadata.language || 'en'}
                                        achievementValue={relatedArticle.metadata.achievementValue}
                                        achievementLabel={relatedArticle.metadata.achievementLabel}
                                        isWide={false}
                                        priority={index < 2}
                                        titleTag="h3"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Single AuthorBlock instance controlled by CSS */}
                    <AuthorBlock language={language} />

                    {/* Sidebar Related Articles for Desktop */}
                    <SidebarVisibilityWrapper>
                        <SidebarRelatedArticles relatedArticles={relatedArticles} language={language} />
                    </SidebarVisibilityWrapper>

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
