'use client';

import { Article } from '@/lib/articles';
import { personalInfo } from '@/data/personalInfo';

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
    'name': tag ? `${tag.charAt(0).toUpperCase() + tag.slice(1)} Articles - Kirill Markin` : 'Articles - Kirill Markin',
    'description': tag 
      ? `Articles tagged with "${tag}" from Kirill Markin - expert analysis and perspectives.`
      : 'Articles and insights from Kirill Markin on tech, business, and productivity.',
    'url': url,
    'author': {
      '@type': 'Person',
      'name': personalInfo.name,
      'url': 'https://kirill-markin.com/'
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': articles.map((article, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'url': `https://kirill-markin.com/articles/${article.slug}`,
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
        'item': 'https://kirill-markin.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Articles',
        'item': 'https://kirill-markin.com/articles/'
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