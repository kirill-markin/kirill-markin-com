import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mediaMentions } from '@/data/mediaMentions';
import { getAllArticles } from '@/lib/articles';
import PersonalInfo from '@/components/PersonalInfo';
import { MediaMentionCard } from '@/components/MediaMentionCard';
import { getTranslation, getPathSegmentByLanguage } from '@/lib/localization';
import Footer from '@/components/Footer';
import styles from '@/app/page.module.css';

// Update placeholder image constant
const PLACEHOLDER_IMAGE = '/articles/preview-main.webp';

// Indices of cards that should be large (span 2 grid columns)
const LARGE_CARD_INDICES = [
    0, // First row, first entry (top left)
    5, // Second row, last entry (bottom right)
    6  // Third row, first entry (first entry of second screen)
];

interface HomePageContentProps {
    language: string;
}

export default async function HomePageContent({ language }: HomePageContentProps) {
    // Get translations for the specified language
    const t = getTranslation('home', language);

    // Get articles for the specified language
    const articles = await getAllArticles(language);

    // Get localized URL segment for articles
    const articlesSegment = getPathSegmentByLanguage('articles', language);

    // Form base path for article links
    const articlesBasePath = language === 'en'
        ? '/articles'
        : `/${language}/${articlesSegment}`;

    // Form path for footer
    const currentPath = language === 'en' ? '/' : `/${language}/`;

    return (
        <>
            <div className={styles.mainPageContent}>
                <aside className={styles.leftColumn}>
                    <PersonalInfo language={language} />
                </aside>

                <div className={styles.rightColumn}>
                    <section className={styles.articles}>
                        <h1 className={styles.articlesHeading}>
                            {t.title}
                        </h1>

                        <div className={styles.mediaMentions}>
                            {mediaMentions.map((mention, index) => {
                                const isLarge = LARGE_CARD_INDICES.includes(index);
                                const displayTitle = mention.language === language
                                    ? mention.title
                                    : (mention.alternativeTitle || mention.title);

                                return (
                                    <MediaMentionCard
                                        key={index}
                                        mention={mention}
                                        isLarge={isLarge}
                                        displayTitle={displayTitle}
                                        index={index}
                                    />
                                );
                            })}

                            {/* Adding articles to the end of the list */}
                            {articles.map((article) => {
                                const isVideo = article.metadata.isVideo || article.metadata.type?.toLowerCase() === 'video';

                                return (
                                    <article
                                        key={`article-${article.slug}`}
                                        className={`${styles.mediaMention} ${isVideo ? styles.video : ''}`}
                                    >
                                        <Link href={`${articlesBasePath}/${article.slug}/`} className={styles.mentionLink}>
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
                                                    priority={false}
                                                />
                                            </div>

                                            <div className={styles.content}>
                                                <h3 className={styles.title}>{article.metadata.title}</h3>

                                                <div className={styles.footer}>
                                                    <div className={styles.divider} />
                                                    <div className={styles.logoContainer}>
                                                        <Image
                                                            className={styles.logo}
                                                            src={'/avatars/Kirill-Markin.webp'}
                                                            alt="Kirill Markin"
                                                            width={25}
                                                            height={25}
                                                        />
                                                        {article.metadata.achievementValue && (
                                                            <div className={styles.achievement}>
                                                                <div className={styles.value}>{article.metadata.achievementValue}</div>
                                                                {article.metadata.achievementLabel && (
                                                                    <div className={styles.label}>{article.metadata.achievementLabel}</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </div>
            <Footer language={language} currentPath={currentPath} />
        </>
    );
} 