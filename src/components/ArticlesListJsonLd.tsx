'use client';

import type { MarkdownArticleSummary } from '@/lib/articleIndex';
import { personalInfo } from '@/data/personalInfo';
import { SITE_URL } from '@/data/contacts';
import { DEFAULT_LANGUAGE, getArticleUrl, getTranslation } from '@/lib/localization';

type ArticlesListJsonLdProps = {
  articles: MarkdownArticleSummary[];
  baseUrl: string;
  language: string;
  url: string;
  tag?: string;
};

/**
 * Component that renders JSON-LD structured data for articles listing page
 * Implements Schema.org ItemList and CollectionPage types for better SEO
 */
export default function ArticlesListJsonLd({
  articles,
  baseUrl,
  language,
  url,
  tag
}: ArticlesListJsonLdProps) {
  const navigationTranslations = getTranslation('navigation', language);
  const articlesTranslations = getTranslation('articles', language);
  const homeUrl = language === DEFAULT_LANGUAGE
    ? `${SITE_URL}/`
    : `${SITE_URL}/${language}/`;

  // Build collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': tag
      ? `${tag.charAt(0).toUpperCase() + tag.slice(1)} - ${articlesTranslations.title}`
      : articlesTranslations.title,
    'description': tag
      ? `Articles tagged with "${tag}" from Kirill Markin - expert analysis and perspectives.`
      : 'Welcome to my digital garden – a curated collection of interconnected notes, thoughts, and insights made available for public access. Unlike a traditional blog, this space represents a subset of my personal knowledge management system, with content organized through natural connections between ideas.',
    'url': url,
    'author': {
      '@type': 'Person',
      'name': personalInfo.name,
      'url': `${SITE_URL}/`
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': articles.map((article, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': getArticleUrl(article.slug, article.language),
        'name': article.title
      }))
    }
  };

  // Build BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': navigationTranslations.home,
        'item': homeUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': navigationTranslations.articles,
        'item': baseUrl
      },
      ...(tag ? [
        {
          '@type': 'ListItem',
          'position': 3,
          'name': tag.charAt(0).toUpperCase() + tag.slice(1),
          'item': url
        }
      ] : [])
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
} 
