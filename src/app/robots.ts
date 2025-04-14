import { MetadataRoute } from 'next';

/**
 * Generates robots.txt rules using Next.js Metadata API
 * @returns {MetadataRoute.Robots} Robots configuration
 */
export default function robots(): MetadataRoute.Robots {
  const host = 'https://kirill-markin.com';
  
  // Check for production environment - Vercel sets these variables
  const isProd = process.env.VERCEL_ENV === 'production' || 
                 process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
                 (process.env.NODE_ENV === 'production' && process.env.VERCEL_URL?.includes('kirill-markin.com'));
  
  // For production domain - allow indexing
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
  
  // For all other domains (staging, etc.) - block indexing
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    // Host is removed for non-production environments
  };
} 