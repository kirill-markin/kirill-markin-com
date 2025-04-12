'use client';

import { Article } from '@/lib/articles';
import { personalInfo } from '@/data/personalInfo';

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
    'description': article.metadata.description || article.content.substring(0, 160).replace(/\n/g, ' ') + '...',
    'image': article.metadata.thumbnailUrl,
    'datePublished': article.metadata.date,
    'dateModified': article.metadata.lastmod || article.metadata.date,
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
    'inLanguage': article.metadata.language || 'en'
  };

  // Add video-specific properties if it's a video
  if (article.metadata.type === 'Video') {
    schema.thumbnailUrl = article.metadata.thumbnailUrl;
    schema.uploadDate = article.metadata.date;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 