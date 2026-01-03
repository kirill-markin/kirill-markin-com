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

  // In Vercel, preview environments are protected through the X-Robots-Tag header automatically
  // For our custom domain, we protect using the robots.txt file by checking VERCEL_ENV
  if (isProd) {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/search*'  // Block any potential search URLs
          ]
        }
      ],
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