import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { Metadata } from 'next';
import styles from './articles.module.css';

export const metadata: Metadata = {
  title: 'Articles - Kirill Markin',
  description: 'Articles and insights from Kirill Markin on tech, business, and productivity.',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>
      
      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <article key={article.slug} className={styles.articleCard}>
            <Link 
              href={`/articles/${article.slug}`}
              className={styles.articleLink}
            >
              <h2 className={styles.articleTitle}>{article.metadata.title}</h2>
              
              <div className={styles.articleDate}>
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
              
              {article.metadata.tags && article.metadata.tags.length > 0 && (
                <div className={styles.articleTags}>
                  {article.metadata.tags.map((tag) => (
                    <span key={tag} className={styles.articleTag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
} 