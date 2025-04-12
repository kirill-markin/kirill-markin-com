import { MetadataRoute } from 'next';

/**
 * Generates robots.txt rules using Next.js Metadata API
 * @returns {MetadataRoute.Robots} Robots configuration
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://kirill-markin.com/sitemap.xml',
    host: 'https://kirill-markin.com/',
  };
} 