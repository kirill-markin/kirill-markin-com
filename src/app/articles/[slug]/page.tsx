import { notFound } from 'next/navigation';
import Link from 'next/link';
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
    <div className="container mx-auto px-4 py-8">
      <Link href="/articles" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Articles
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{article.metadata.title}</h1>
          
          <div className="text-gray-600 mb-4 flex items-center">
            {article.metadata.date && (
              <time dateTime={article.metadata.date}>
                {new Date(article.metadata.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {article.metadata.lastmod && article.metadata.lastmod !== article.metadata.date && (
              <span> (Updated: {new Date(article.metadata.lastmod).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })})</span>
            )}
            
            {article.metadata.type && (
              <span className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-sm">{article.metadata.type}</span>
            )}
            
            {article.metadata.language && (
              <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm">[{article.metadata.language}]</span>
            )}
          </div>
          
          {article.metadata.thumbnailUrl && (
            <div className="mb-6 overflow-hidden rounded border border-gray-200">
              <Image 
                src={article.metadata.thumbnailUrl || PLACEHOLDER_IMAGE} 
                alt={article.metadata.title}
                width={1200}
                height={675}
                className="w-full object-cover"
              />
            </div>
          )}
          
          {article.metadata.tags && article.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.metadata.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {article.metadata.description && (
            <p className="text-xl text-gray-700 italic mb-4">
              {article.metadata.description}
            </p>
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