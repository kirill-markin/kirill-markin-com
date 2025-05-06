import { MetadataRoute } from 'next';
import { getAllArticles, buildArticleConnections } from '@/lib/articles';
import { servicesData } from '@/data/services';
import { getPageLastModifiedDate, getFileLastCommitDate } from '@/lib/fileModification';
import { SUPPORTED_LANGUAGES, getPathSegmentByLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';

/**
 * Generates a sitemap.xml file for the website using Next.js Metadata API
 * Includes all routes with lastModified dates from Git commit history
 * 
 * @returns {MetadataRoute.Sitemap} Sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kirill-markin.com/';
  const entries: MetadataRoute.Sitemap = [];

  // Get all articles for all languages
  const articlesByLanguage = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => {
      const articles = await getAllArticles(lang);
      return { lang, articles };
    })
  );

  // Flatten articles from all languages
  const allArticles = articlesByLanguage.flatMap(({ articles }) => articles);

  // Build connections between original and translated articles
  const connectedArticles = await buildArticleConnections(allArticles);

  // Get unique service categories (excluding 'all')
  const serviceCategories = Array.from(
    new Set(servicesData.map(service => service.categoryId))
  ).filter(category => category !== 'all');

  // Get unique article tags by language
  const tagsByLanguage: Record<string, string[]> = {};

  articlesByLanguage.forEach(({ lang, articles }) => {
    const allTags = articles.flatMap(article => article.metadata.tags || []);
    tagsByLanguage[lang] = Array.from(new Set(allTags)).filter(tag => tag);
  });

  // Add static routes for default language (English)
  const defaultRoutes = [
    '/',
    '/services/',
    ...serviceCategories.map(category => `/services/?category=${category}`),
    '/meet/',
    '/meet/short/',
    '/meet/all/',
    '/pay/',
    '/pay/stripe/',
    '/articles/',
    ...tagsByLanguage[DEFAULT_LANGUAGE].map(tag => `/articles/?tag=${tag}`)
  ];

  const defaultRoutePromises = defaultRoutes.map(async (routePath) => {
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

  // Add localized routes for non-default languages
  const localizedRoutePromises = SUPPORTED_LANGUAGES
    .filter(lang => lang !== DEFAULT_LANGUAGE)
    .flatMap(lang => {
      const localizedRoutes = [
        `/${lang}/`,
        `/${lang}/${getPathSegmentByLanguage('services', lang)}/`,
        // Skip service categories for now
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/short/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/all/`,
        `/${lang}/${getPathSegmentByLanguage('pay', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('articles', lang)}/`,
      ];

      // Add tag pages for this language
      if (tagsByLanguage[lang]) {
        const articlesSegment = getPathSegmentByLanguage('articles', lang);
        localizedRoutes.push(
          ...tagsByLanguage[lang].map(tag => `/${lang}/${articlesSegment}/?tag=${tag}`)
        );
      }

      return localizedRoutes.map(async (routePath) => {
        const url = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;
        // For now, use the same last modified date as the English equivalent
        const englishPath = routePath
          .replace(`/${lang}/`, '/')
          .replace(`/${getPathSegmentByLanguage('services', lang)}/`, '/services/')
          .replace(`/${getPathSegmentByLanguage('articles', lang)}/`, '/articles/')
          .replace(`/${getPathSegmentByLanguage('meet', lang)}/`, '/meet/')
          .replace(`/${getPathSegmentByLanguage('pay', lang)}/`, '/pay/');

        const lastModified = await getPageLastModifiedDate(englishPath);

        // Lower priority for localized pages (but still important)
        const priority = routePath === `/${lang}/` ? 0.9 : 0.6;

        return {
          url,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority,
        };
      });
    });

  // Resolve all promises to get the static routes
  entries.push(...await Promise.all(defaultRoutePromises));
  entries.push(...await Promise.all(localizedRoutePromises));

  // Generate article routes with Git commit dates
  for (const article of connectedArticles) {
    const { slug, metadata } = article;
    const { language } = metadata;

    let filePath;
    let url;

    if (language === DEFAULT_LANGUAGE) {
      filePath = `src/content/articles/${slug}.md`;
      url = `${baseUrl}articles/${slug}/`;
    } else {
      filePath = `src/content/articles/translations/${language}/${slug}.md`;
      const articlesSegment = getPathSegmentByLanguage('articles', language);
      url = `${baseUrl}${language}/${articlesSegment}/${slug}/`;
    }

    const lastModified = await getFileLastCommitDate(filePath);

    entries.push({
      url,
      lastModified,
      changeFrequency: 'monthly',
      priority: language === DEFAULT_LANGUAGE ? 0.7 : 0.6,
    });
  }

  return entries;
} 