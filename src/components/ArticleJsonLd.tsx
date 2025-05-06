'use client';

import { Article } from '@/lib/articles';
import { personalInfo } from '@/data/personalInfo';
import { getLocaleForLanguage, getPathSegmentByLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';

type ArticleJsonLdProps = {
  article: Article;
  url: string;
};

interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string | undefined;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
    url: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  keywords: string;
  inLanguage: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  isPartOf?: {
    '@type': string;
    name: string;
    url: string;
  };
  sameAs?: string[];
}

/**
 * Generate a URL for an article based on its language and slug
 */
function getArticleUrl(slug: string, language: string): string {
  const baseUrl = 'https://kirill-markin.com/';

  if (language === DEFAULT_LANGUAGE) {
    return `${baseUrl}articles/${slug}/`;
  } else {
    const articlesSegment = getPathSegmentByLanguage('articles', language);
    return `${baseUrl}${language}/${articlesSegment}/${slug}/`;
  }
}

/**
 * Component that renders JSON-LD structured data specifically for articles
 * Implements Schema.org Article type for better SEO
 */
export default function ArticleJsonLd({ article, url }: ArticleJsonLdProps) {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': article.metadata.type === 'Video' ? 'VideoObject' : 'Article',
    'headline': article.metadata.title,
    'description': article.metadata.description || '',
    'image': article.metadata.thumbnailUrl,
    'datePublished': article.metadata.date,
    'dateModified': article.metadata.lastmod,
    'author': {
      '@type': 'Person',
      'name': personalInfo.name,
      'url': 'https://kirill-markin.com/'
    },
    'publisher': {
      '@type': 'Person',
      'name': article.metadata.publisher || personalInfo.name,
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://kirill-markin.com/images/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    },
    'keywords': article.metadata.tags.join(', '),
    'inLanguage': getLocaleForLanguage(article.metadata.language)
  };

  // Add video-specific properties if it's a video
  if (article.metadata.type === 'Video') {
    schema.thumbnailUrl = article.metadata.thumbnailUrl;
    schema.uploadDate = article.metadata.date;
  }

  // Add translation information if this article is translated
  if (article.metadata.originalArticle) {
    const { slug, language } = article.metadata.originalArticle;
    const originalUrl = getArticleUrl(slug, language);

    schema.isPartOf = {
      '@type': 'CreativeWork',
      'name': article.metadata.title,
      'url': originalUrl
    };
    schema.sameAs = [originalUrl];
  }

  // Add translations if available
  if (article.metadata.translations && article.metadata.translations.length > 0) {
    const translationUrls = article.metadata.translations.map(translation => {
      const { slug, language } = translation;
      return getArticleUrl(slug, language);
    });

    if (!schema.sameAs) {
      schema.sameAs = [];
    }

    schema.sameAs.push(...translationUrls);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 