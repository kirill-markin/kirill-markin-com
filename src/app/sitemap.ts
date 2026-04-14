import { MetadataRoute } from 'next';
import { getPublishedArticleSitemapEntries } from '@/lib/articleIndex';
import { SUPPORTED_LANGUAGES, getArticleUrl, getPathSegmentByLanguage, getSubPathSegmentByLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';
import { SITE_URL } from '@/data/contacts';

/**
 * Generates a sitemap.xml file for the website using Next.js Metadata API
 * Includes article routes with lastModified dates from frontmatter
 * 
 * @returns {MetadataRoute.Sitemap} Sitemap configuration
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = `${SITE_URL}/`;
  const entries: MetadataRoute.Sitemap = [];

  const articleEntriesByLanguage = await Promise.all(
    SUPPORTED_LANGUAGES.map(async (lang) => {
      const articleEntries = await getPublishedArticleSitemapEntries(lang);
      return { articleEntries, lang };
    })
  );

  const allArticleEntries = articleEntriesByLanguage.flatMap(({ articleEntries }) => articleEntries);

  // Add static routes for default language (English)
  const defaultRoutes = [
    '/',
    '/services/',
    '/services/fractional-ai-cto-kirill-markin/',
    '/meet/',
    '/meet/short/',
    '/meet/medium/',
    '/meet/long/',
    '/meet/all/',
    '/pay/',
    '/pay/stripe/',
    '/articles/',
    '/subscribe/'
  ];

  const defaultRoutePromises = defaultRoutes.map(async (routePath) => {
    const url = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;

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
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'short', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'medium', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'long', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'all', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('pay', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('pay', lang)}/${getSubPathSegmentByLanguage('pay', 'stripe', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('articles', lang)}/`,
      ];

      return localizedRoutes.map(async (routePath) => {
        const url = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;
        // Lower priority for localized pages (but still important)
        const priority = routePath === `/${lang}/` ? 0.9 : 0.6;

        return {
          url,
          changeFrequency: 'monthly' as const,
          priority,
        };
      });
    });

  // Resolve all promises to get the static routes
  entries.push(...await Promise.all(defaultRoutePromises));
  entries.push(...await Promise.all(localizedRoutePromises));

  // Generate article routes with frontmatter lastmod dates
  for (const articleEntry of allArticleEntries) {
    const { language, lastmod, slug } = articleEntry;
    entries.push({
      url: getArticleUrl(slug, language),
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: language === DEFAULT_LANGUAGE ? 0.7 : 0.6,
    });
  }

  return entries;
} 
