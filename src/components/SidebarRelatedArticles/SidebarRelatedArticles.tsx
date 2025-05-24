import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/articles';
import { getPathSegmentByLanguage } from '@/lib/localization';
import styles from './SidebarRelatedArticles.module.css';

interface SidebarRelatedArticlesProps {
    relatedArticles: Article[];
    language: string;
}

const SidebarRelatedArticles: React.FC<SidebarRelatedArticlesProps> = ({
    relatedArticles,
    language
}) => {
    // Function to generate article link based on language (same logic as in ArticlePageContent)
    const getArticleLink = (slug: string, articleLanguage: string): string => {
        if (articleLanguage === 'en') {
            return `/articles/${slug}/`;
        } else {
            // Use getPathSegmentByLanguage to get the correct segment
            const segment = getPathSegmentByLanguage('articles', articleLanguage);
            return `/${articleLanguage}/${segment}/${slug}/`;
        }
    };

    // Don't render if no related articles
    if (!relatedArticles || relatedArticles.length === 0) {
        return null;
    }

    return (
        <div className={styles.sidebarRelatedArticles}>
            <div className={styles.content}>
                <h3 className={styles.heading}>
                    {language === 'en' ? 'Related Articles' : 'Artículos Relacionados'}
                </h3>
                <ul className={styles.articlesList}>
                    {relatedArticles.map((article) => (
                        <li key={article.slug} className={styles.articleItem}>
                            <Link
                                href={getArticleLink(article.slug, article.metadata.language)}
                                className={styles.articleLink}
                            >
                                {article.metadata.title}
                            </Link>
                            {article.metadata.language !== 'en' && (
                                <span className={styles.languageIndicator}>
                                    [{article.metadata.language}]
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidebarRelatedArticles; 