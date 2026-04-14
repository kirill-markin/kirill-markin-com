import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { bigMediaMentions, smallMediaMentions, buildWallItems } from '@/data/mediaMentions';
import { getPublishedMarkdownArticles } from '@/lib/articleIndex';
import PersonalInfo from '@/components/PersonalInfo';
import { MediaMentionCard } from '@/components/MediaMentionCard';
import { getTranslation, getPathSegmentByLanguage } from '@/lib/localization';
import Footer from '@/components/Footer';
import styles from '@/app/page.module.css';

// Update placeholder image constant
const PLACEHOLDER_IMAGE = '/articles/preview-main.webp';

interface HomePageContentProps {
    language: string;
}

export default async function HomePageContent({ language }: HomePageContentProps) {
    // Get translations for the specified language
    const t = getTranslation('home', language);

    // Get articles for the specified language
    const articles = await getPublishedMarkdownArticles(language);

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
                            {buildWallItems(bigMediaMentions, smallMediaMentions).map((wallItem) => {
                                const displayTitle = wallItem.mention.language === language
                                    ? wallItem.mention.title
                                    : (wallItem.mention.alternativeTitle || wallItem.mention.title);

                                return (
                                    <MediaMentionCard
                                        key={wallItem.position}
                                        mention={wallItem.mention}
                                        isLarge={wallItem.isLarge}
                                        displayTitle={displayTitle}
                                        index={wallItem.position}
                                    />
                                );
                            })}

                            {/* Adding articles to the end of the list */}
                            {articles.map((article) => {
                                const isVideo = article.type?.toLowerCase() === 'video';

                                return (
                                    <article
                                        key={`article-${article.slug}`}
                                        className={`${styles.mediaMention} ${isVideo ? styles.video : ''}`}
                                    >
                                        <Link href={`${articlesBasePath}/${article.slug}/`} className={styles.mentionLink}>
                                            <div className={styles.language}>
                                                <div className={styles.text}>[{article.language}]</div>
                                            </div>

                                            {article.type && (
                                                <div className={styles.type}>
                                                    <div className={styles.text}>[{article.type}]</div>
                                                </div>
                                            )}

                                            <div className={styles.thumbnailContainer}>
                                                <Image
                                                    className={styles.thumbnail}
                                                    src={article.thumbnailUrl || PLACEHOLDER_IMAGE}
                                                    alt={article.title}
                                                    width={640}
                                                    height={360}
                                                    sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
                                                    quality={75}
                                                    priority={false}
                                                />
                                            </div>

                                            <div className={styles.content}>
                                                <h3 className={styles.title}>{article.title}</h3>

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
                                                        {article.achievementValue && (
                                                            <div className={styles.achievement}>
                                                                <div className={styles.value}>{article.achievementValue}</div>
                                                                {article.achievementLabel && (
                                                                    <div className={styles.label}>{article.achievementLabel}</div>
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
