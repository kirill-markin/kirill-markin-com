import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { servicesData } from '@/data/services';
import { getPageLastModifiedDate } from '@/lib/vercelDeployment';

/**
 * Generates a sitemap.xml file for the website using Next.js Metadata API
 * Includes all routes with lastModified dates from Vercel deployment information
 * 
 * @returns {MetadataRoute.Sitemap} Sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kirill-markin.com/';

  // Get all articles for dynamic routes
  const articles = await getAllArticles();

  // Get unique service categories (excluding 'all')
  const serviceCategories = Array.from(
    new Set(servicesData.map(service => service.categoryId))
  ).filter(category => category !== 'all');

  // Get unique article tags
  const allTags = articles.flatMap(article => article.metadata.tags || []);
  const uniqueArticleTags = Array.from(new Set(allTags)).filter(tag => tag);

  // Define the routes we need to generate lastModified dates for
  const routePaths = [
    '/',
    '/services/',
    ...serviceCategories.map(category => `/services/?category=${category}`),
    '/meet/',
    '/meet/short/',
    '/meet/all/',
    '/pay/',
    '/pay/stripe/',
    '/articles/',
    ...uniqueArticleTags.map(tag => `/articles/?tag=${tag}`)
  ];

  // Generate the routes with their last modified dates from Vercel deployment
  const staticRoutesPromises = routePaths.map(async (routePath) => {
    const url = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;
    const lastModified = await getPageLastModifiedDate(routePath);

    // Define change frequency and priority based on page type
    let changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly';
    let priority = 0.7;

    if (routePath === '/') {
      changeFrequency = 'weekly';
      priority = 1.0;
    } else if (routePath.includes('/articles')) {
      changeFrequency = 'weekly';
      priority = routePath === '/articles/' ? 0.8 : 0.7;
    } else if (routePath.includes('/services')) {
      priority = routePath === '/services/' ? 0.8 : 0.7;
    } else if (routePath.includes('/meet')) {
      priority = routePath === '/meet/' ? 0.8 : 0.7;
    } else if (routePath.includes('/pay')) {
      priority = 0.6;
    }

    return {
      url,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  // Resolve all promises to get the static routes
  const staticRoutes = await Promise.all(staticRoutesPromises);

  // Generate article routes (using article metadata for lastmod)
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}articles/${article.slug}/`,
    lastModified: new Date(article.metadata.lastmod),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Combine static and dynamic routes
  return [...staticRoutes, ...articleRoutes];
} 