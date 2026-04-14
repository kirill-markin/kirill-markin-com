'use client';

import { Article } from '@/lib/articles';
import { personalInfo } from '@/data/personalInfo';
import { SITE_URL } from '@/data/contacts';
import { getArticleUrl, getLocaleForLanguage } from '@/lib/localization';

const DEFAULT_ARTICLE_IMAGE_PATH = '/articles/placeholder.webp';
const PUBLISHER_LOGO_PATH = '/favicons/apple-touch-icon.png';

type ArticleJsonLdProps = {
  article: Article;
  url: string;
};

interface ImageObjectSchema {
  '@type': string;
  url: string;
}

interface PersonSchema {
  '@type': string;
  name: string;
  url: string;
}

interface OrganizationSchema {
  '@type': string;
  name: string;
  url: string;
  logo?: ImageObjectSchema;
}

interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  publisher: OrganizationSchema;
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

function toAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  if (pathOrUrl.startsWith('/')) {
    return `${SITE_URL}${pathOrUrl}`;
  }

  return `${SITE_URL}/${pathOrUrl}`;
}

/**
 * Component that renders JSON-LD structured data specifically for articles
 * Implements Schema.org Article type for better SEO
 */
export default function ArticleJsonLd({ article, url }: ArticleJsonLdProps) {
  const imageUrl = toAbsoluteUrl(article.metadata.thumbnailUrl || DEFAULT_ARTICLE_IMAGE_PATH);
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': article.metadata.type === 'Video' ? 'VideoObject' : 'Article',
    'headline': article.metadata.title,
    'description': article.metadata.description || '',
    'image': imageUrl,
    'datePublished': article.metadata.date,
    'author': {
      '@type': 'Person',
      'name': personalInfo.name,
      'url': `${SITE_URL}/`
    },
    'publisher': {
      '@type': 'Organization',
      'name': article.metadata.publisher || personalInfo.name,
      'url': `${SITE_URL}/`,
      'logo': {
        '@type': 'ImageObject',
        'url': toAbsoluteUrl(PUBLISHER_LOGO_PATH)
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
    schema.thumbnailUrl = imageUrl;
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
