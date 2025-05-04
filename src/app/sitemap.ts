import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { servicesData } from '@/data/services';

/**
 * Generates a sitemap.xml file for the website using Next.js Metadata API
 * Includes all routes with lastModified dates, changeFrequency, and priority settings
 * 
 * @returns {MetadataRoute.Sitemap} Sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kirill-markin.com/';
  const currentDate = new Date();

  // Get all articles for dynamic routes
  const articles = await getAllArticles();

  // Get unique service categories (excluding 'all')
  const serviceCategories = Array.from(
    new Set(servicesData.map(service => service.categoryId))
  ).filter(category => category !== 'all');

  // Get unique article tags
  const allTags = articles.flatMap(article => article.metadata.tags || []);
  const uniqueArticleTags = Array.from(new Set(allTags)).filter(tag => tag);

  // Define common routes with their metadata
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}services/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    // Add service category URLs
    ...serviceCategories.map(category => ({
      url: `${baseUrl}services/?category=${category}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}meet/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}meet/short/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}meet/all/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}pay/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}pay/stripe/`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}articles/`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    // Add article tag URLs
    ...uniqueArticleTags.map(tag => ({
      url: `${baseUrl}articles/?tag=${tag}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  ];

  // Generate article routes
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}articles/${article.slug}/`,
    lastModified: article.metadata.lastmod ? new Date(article.metadata.lastmod) : new Date(article.metadata.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Combine static and dynamic routes
  return [...staticRoutes, ...articleRoutes];
} 