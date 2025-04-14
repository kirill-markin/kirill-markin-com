import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { mediaMentions } from '../data/mediaMentions';
import { getAllArticles } from '../lib/articles';
import PersonalInfo from '../components/PersonalInfo';
import type { Metadata } from 'next';

// Update placeholder image constant
const PLACEHOLDER_IMAGE = '/articles/articles-screen-saver-1.png';

export const metadata: Metadata = {
  title: "Kirill Markin - Consultant and Software Architect",
  description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
  openGraph: {
    title: "Kirill Markin - Consultant and Software Architect",
    description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
    url: 'https://kirill-markin.com/',
    images: [
      {
        url: '/avatars/Kirill-Markin.webp',
        width: 300,
        height: 300,
        alt: 'Kirill Markin',
      }
    ],
  },
  twitter: {
    title: "Kirill Markin - Consultant and Software Architect",
    description: "Professional services by Kirill Markin - Software Architecture, Tech Consulting, and more",
    images: ['/avatars/Kirill-Markin.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/',
  },
};

export default async function Home() {
  const articles = await getAllArticles();

  return (
    <div className={styles.mainPageContent}>
      <aside className={styles.leftColumn}>
        <PersonalInfo />
      </aside>

      <div className={styles.rightColumn}>
        <section className={styles.articles}>
          <h2 className={styles.articlesHeading}>
            Article<span className={styles.glitchLetter}>s</span> and mention<span className={styles.glitchLetter}>s</span>
          </h2>

          <div className={styles.mediaMentions}>
            {mediaMentions.map((mention, index) => {
              const isLarge = index === 0 || index === 5;
              const isVideo = mention.isVideo || mention.type.toLowerCase() === 'video';
              const displayTitle = mention.language === 'en' ? mention.title : (mention.alternativeTitle || mention.title);

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

            {/* Add articles at the end of media mentions */}
            {articles.map((article) => {
              const isVideo = article.metadata.isVideo || article.metadata.type?.toLowerCase() === 'video';

              return (
                <article
                  key={`article-${article.slug}`}
                  className={`${styles.mediaMention} ${isVideo ? styles.video : ''}`}
                >
                  <Link href={`/articles/${article.slug}`} className={styles.mentionLink}>
                    <div className={styles.language}>
                      <div className={styles.text}>[{article.metadata.language || 'en'}]</div>
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
  );
}
