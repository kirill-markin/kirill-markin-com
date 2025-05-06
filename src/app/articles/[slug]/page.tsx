import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticlesByTags } from '@/lib/articles';
import { markdownToHtml } from '@/lib/markdown';
import styles from '../articles.module.css';
import ArticleContent from '@/components/ArticleContent';
import ArticleJsonLd from '@/components/ArticleJsonLd';
import SocialShare from '@/components/SocialShare';
import AuthorBlock from '@/components/AuthorBlock';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const canonicalUrl = `https://kirill-markin.com/articles/${slug}/`;

  return {
    title: `${article.metadata.title} - Kirill Markin`,
    description: article.metadata.description || '',
    keywords: article.metadata.tags,
    authors: [{ name: article.metadata.publisher || 'Kirill Markin' }],
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description || '',
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: article.metadata.thumbnailUrl || '/articles/placeholder.webp',
          width: 1200,
          height: 630,
          alt: article.metadata.title,
        }
      ],
      locale: article.metadata.language === 'ru' ? 'ru_RU' : 'en_US',
      publishedTime: article.metadata.date,
      modifiedTime: article.metadata.lastmod,
      tags: article.metadata.tags,
      siteName: 'Kirill Markin'
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metadata.title,
      description: article.metadata.description || '',
      images: [article.metadata.thumbnailUrl || '/articles/placeholder.webp'],
    },
    alternates: {
      canonical: canonicalUrl,
    }
  };
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';
  const htmlContent = await markdownToHtml(article.content);
  const canonicalUrl = `https://kirill-markin.com/articles/${slug}/`;

  // Get related articles based on tags
  const relatedArticles = await getRelatedArticlesByTags(
    article.slug,
    article.metadata.tags,
    article.metadata.language || 'en',
    5
  );

  return (
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
                    <Link key={tag} href={`/articles/?tag=${tag}`}>
                      <span className={styles.tag}>
                        {tag}
                      </span>
                    </Link>
                  ))
                )}
              </div>

              {article.metadata.date && (
                <time className={styles.articleDate} dateTime={article.metadata.date}>
                  {new Date(article.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
                ? 'Related Articles'
                : 'Related & Recent Articles'
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
                      href={`/articles/${relatedArticle.slug}/`}
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
                                {new Date(relatedArticle.metadata.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
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
          <h3 className={styles.shareTitle}>Share this article</h3>
          <SocialShare url={canonicalUrl} title={article.metadata.title} variant="inline" />
        </div>

      </article>
    </div>
  );
} 