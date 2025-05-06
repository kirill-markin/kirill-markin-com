import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { mediaMentions } from '@/data/mediaMentions';
import { getAllArticles } from '@/lib/articles';
import PersonalInfo from '@/components/PersonalInfo';
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
                        <h2 className={styles.articlesHeading}>
                            {t.title}
                        </h2>

                        <div className={styles.mediaMentions}>
                            {mediaMentions.map((mention, index) => {
                                const isLarge = index === 0 || index === 5;
                                const isVideo = mention.isVideo || mention.type.toLowerCase() === 'video';
                                const displayTitle = mention.language === language
                                    ? mention.title
                                    : (mention.alternativeTitle || mention.title);

                                return (
                                    <article key={index} className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}>
                                        <a href={mention.url} target="_blank" rel="noopener noreferrer" className={styles.mentionLink}>
                                            <div className={styles.language}>
                                                <div className={styles.text}>[{mention.language}]</div>
                                            </div>

                                            {mention.type && (
                                                <div className={styles.type}>
                                                    <div className={styles.text}>[{mention.type}]</div>
                                                </div>
                                            )}

                                            <div className={styles.thumbnailContainer}>
                                                <Image
                                                    className={styles.thumbnail}
                                                    src={mention.thumbnailUrl || PLACEHOLDER_IMAGE}
                                                    alt={displayTitle}
                                                    width={640}
                                                    height={360}
                                                    sizes="(max-width: 640px) 320px, (max-width: 1200px) 640px, 640px"
                                                    quality={75}
                                                    priority={index < 4}
                                                />
                                            </div>

                                            <div className={styles.content}>
                                                <h3 className={styles.title}>{displayTitle}</h3>
                                                {mention.description && isLarge && (
                                                    <div className={styles.description}>{mention.description}</div>
                                                )}

                                                {mention.websiteLogoUrl && (
                                                    <div className={styles.footer}>
                                                        <div className={styles.divider} />
                                                        <div className={styles.logoContainer}>
                                                            <Image
                                                                className={styles.logo}
                                                                src={mention.websiteLogoUrl || PLACEHOLDER_IMAGE}
                                                                alt="Website Logo"
                                                                width={100}
                                                                height={25}
                                                            />
                                                            {mention.achievementValue && (
                                                                <div className={styles.achievement}>
                                                                    <div className={styles.value}>{mention.achievementValue}</div>
                                                                    {mention.achievementLabel && (
                                                                        <div className={styles.label}>{mention.achievementLabel}</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    </article>
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