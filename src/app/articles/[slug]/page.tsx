import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticlesByTags } from '@/lib/articles';
import { markdownToHtml } from '@/lib/markdown';
import ArticlePageContent from '@/components/pages/ArticlePageContent';

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
    <ArticlePageContent
      article={article}
      htmlContent={htmlContent}
      canonicalUrl={canonicalUrl}
      relatedArticles={relatedArticles}
      language="en"
    />
  );
} 