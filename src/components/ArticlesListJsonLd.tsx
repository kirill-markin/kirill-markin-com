'use client';

import { Article } from '@/lib/articles';
import { personalInfo } from '@/data/personalInfo';
import { SITE_URL } from '@/data/contacts';

type ArticlesListJsonLdProps = {
  articles: Article[];
  url: string;
  tag?: string;
};

/**
 * Component that renders JSON-LD structured data for articles listing page
 * Implements Schema.org ItemList and CollectionPage types for better SEO
 */
export default function ArticlesListJsonLd({ articles, url, tag }: ArticlesListJsonLdProps) {
  // Build collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': tag ? `${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles - ${personalInfo.name}` : `Articles - ${personalInfo.name}`,
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
        'url': `${SITE_URL}/articles/${article.slug}/`,
        'name': article.metadata.title
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
        'name': 'Home',
        'item': `${SITE_URL}/`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Articles',
        'item': `${SITE_URL}/articles/`
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