import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { Metadata } from 'next';
import styles from './articles.module.css';

export const metadata: Metadata = {
  title: 'Articles - Kirill Markin',
  description: 'Articles and insights from Kirill Markin on tech, business, and productivity.',
};

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className={styles.articlesHeading}>
        Article<span className={styles.glitchLetter}>s</span>
      </h1>
      
      <div className={styles.mediaMentions}>
        {articles.map((article, index) => {
          const isLarge = index === 0 || index === 5;
          const isVideo = article.metadata.isVideo || article.metadata.type?.toLowerCase() === 'video';
          
          return (
            <article 
              key={article.slug} 
              className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}
            >
              <Link 
                href={`/articles/${article.slug}`}
                className={styles.mentionLink}
              >
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
                          {new Date(article.metadata.date).toLocaleDateString('en-US', {
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
  );
} 