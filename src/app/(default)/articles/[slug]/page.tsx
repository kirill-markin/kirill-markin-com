import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllArticleSlugs, getArticleBySlug, getRelatedArticlesByTags } from '@/lib/articles';
import { markdownToHtml } from '@/lib/markdown';
import ArticlePageContent from '@/components/pages/ArticlePageContent';
import { getPathSegmentByLanguage } from '@/lib/localization';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const canonicalUrl = `https://kirill-markin.com/articles/${slug}`;

  // Создаем объект для языковых альтернатив
  const languageAlternates: Record<string, string> = {};

  // Добавляем текущую страницу в альтернативы
  languageAlternates[article.metadata.language] = canonicalUrl;

  // Добавляем все доступные переводы
  if (article.metadata.translations && article.metadata.translations.length > 0) {
    for (const translation of article.metadata.translations) {
      const translatedUrl = translation.language === 'en'
        ? `https://kirill-markin.com/articles/${translation.slug}`
        : `https://kirill-markin.com/${translation.language}/${getPathSegmentByLanguage('articles', translation.language)}/${translation.slug}`;

      languageAlternates[translation.language] = translatedUrl;
    }
  }

  // Если это перевод, добавляем ссылку на оригинальную статью
  if (article.metadata.originalArticle) {
    const { language, slug: originalSlug } = article.metadata.originalArticle;
    const originalUrl = language === 'en'
      ? `https://kirill-markin.com/articles/${originalSlug}`
      : `https://kirill-markin.com/${language}/${getPathSegmentByLanguage('articles', language)}/${originalSlug}`;

    languageAlternates[language] = originalUrl;
  }

  return {
    title: `${article.metadata.title}`,
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
      languages: languageAlternates
    }
  };
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const htmlContent = await markdownToHtml(article.content);
  const canonicalUrl = `https://kirill-markin.com/articles/${slug}`;

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