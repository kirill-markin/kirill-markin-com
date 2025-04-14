import { MetadataRoute } from 'next';

/**
 * Generates robots.txt rules using Next.js Metadata API
 * This function runs at build time based on the VERCEL_ENV
 * to determine whether to allow or disallow indexing
 * @returns {MetadataRoute.Robots} Robots configuration
 */
export default function robots(): MetadataRoute.Robots {
  // Default host for production - can be overridden by environment variables
  const host = process.env.SITE_URL?.replace(/\/$/, '') || 'https://kirill-markin.com';
  
  // Check for production environment using Vercel's system environment variable
  // VERCEL_ENV will be 'production' only in the production environment
  const isProd = process.env.VERCEL_ENV === 'production';
  
  // For production environment - allow indexing
  if (isProd) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${host}/sitemap.xml`,
      host,
    };
  }
  
  // For all other environments (preview, development) - block indexing
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    // Host is removed for non-production environments
  };
} 