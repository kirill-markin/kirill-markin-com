import { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/contacts';

/**
 * Generates robots.txt rules using Next.js Metadata API
 * This function runs at build time to determine whether to 
 * allow or disallow indexing based on the environment
 * @returns {MetadataRoute.Robots} Robots configuration
 */
export default function robots(): MetadataRoute.Robots {
  // Default host for production - can be overridden by environment variables
  const host = process.env.SITE_URL?.replace(/\/$/, '') || SITE_URL;

  // Check for production environment using Vercel's system environment variable
  const isProd = process.env.VERCEL_ENV === 'production';

  // Secret/hidden pages to block from all crawlers
  // NOTE: We use explicit paths instead of wildcards like '/*/police' or '/*?*category=police' because:
  // 1. Wildcard '*' in robots.txt is only supported by Google, not standardized across all crawlers
  // 2. Query parameter patterns ('?category=police') don't work in robots.txt - it only matches URL paths
  // 3. For blocking query parameters, use noindex meta tags or X-Robots-Tag headers instead
  const secretPaths = [
    '/services/police',
    '/services/police/',
    // Localized paths - explicit for each supported language
    '/es/servicios/police',
    '/es/servicios/police/',
    '/zh/zixun/police',
    '/zh/zixun/police/',
    '/ar/khadamat/police',
    '/ar/khadamat/police/',
    '/hi/sevaen/police',
    '/hi/sevaen/police/',
  ];

  // In Vercel, preview environments are protected through the X-Robots-Tag header automatically
  // For our custom domain, we protect using the robots.txt file by checking VERCEL_ENV
  if (isProd) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/search*',  // Block any potential search URLs
          ...secretPaths,
        ]
      },
      sitemap: `${host}/sitemap.xml`,
      // host directive removed as it's only used by Yandex
    };
  }

  // For all other environments (preview, development) - block indexing
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    // No host or sitemap for non-production environments
  };
} 