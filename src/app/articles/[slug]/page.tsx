import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { markdownToHtml } from '@/lib/markdown';
import styles from '../articles.module.css';

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

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
  
  return {
    title: `${article.metadata.title} - Kirill Markin`,
    description: article.metadata.description || article.content.slice(0, 160) + '...',
    keywords: article.metadata.tags,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.description || article.content.slice(0, 160) + '...',
      type: 'article',
      publishedTime: article.metadata.date,
      modifiedTime: article.metadata.lastmod,
      tags: article.metadata.tags,
    },
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
  
  const htmlContent = await markdownToHtml(article.content);
  
  return (
    <div className={styles.articlePageContainer}>
      <div className={styles.articleNavigation}>
      </div>
      
      <article className={styles.articleContainer}>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{article.metadata.title}</h1>
          
          <div className={styles.articleMeta}>
            {article.metadata.date && (
              <time dateTime={article.metadata.date}>
                {new Date(article.metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            
            <div className={styles.articleTags}>
              {article.metadata.type && (
                <span className={styles.tag}>{article.metadata.type}</span>
              )}
              
              {article.metadata.tags && article.metadata.tags.length > 0 && (
                article.metadata.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))
              )}
            </div>
          </div>
          
          {article.metadata.thumbnailUrl && (
            <div className={styles.articleFeaturedImage}>
              <Image 
                src={article.metadata.thumbnailUrl || PLACEHOLDER_IMAGE} 
                alt={article.metadata.title}
                width={1200}
                height={675}
                className={styles.featuredImage}
                priority
              />
            </div>
          )}
        </header>
        
        <div 
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </div>
  );
} 