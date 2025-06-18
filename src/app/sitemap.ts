import { MetadataRoute } from 'next';
import { getAllArticles, buildArticleConnections } from '@/lib/articles';
import { getPageLastModifiedDate, getFileLastCommitDate } from '@/lib/fileModification';
import { SUPPORTED_LANGUAGES, getPathSegmentByLanguage, getSubPathSegmentByLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';

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



  // Add static routes for default language (English)
  const defaultRoutes = [
    '/',
    '/services/',
    '/services/fractional-ai-cto-kirill-markin/',
    '/meet/',
    '/meet/short/',
    '/meet/all/',
    '/pay/',
    '/pay/stripe/',
    '/articles/'
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
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'short', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'all', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('pay', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('pay', lang)}/${getSubPathSegmentByLanguage('pay', 'stripe', lang)}/`,
        `/${lang}/${getPathSegmentByLanguage('articles', lang)}/`,
      ];

      return localizedRoutes.map(async (routePath) => {
        const url = `${baseUrl}${routePath.startsWith('/') ? routePath.substring(1) : routePath}`;
        // For now, use the same last modified date as the English equivalent
        const englishPath = routePath
          .replace(`/${lang}/`, '/')
          .replace(`/${getPathSegmentByLanguage('services', lang)}/`, '/services/')
          .replace(`/${getPathSegmentByLanguage('articles', lang)}/`, '/articles/')
          .replace(`/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'short', lang)}/`, '/meet/short/')
          .replace(`/${getPathSegmentByLanguage('meet', lang)}/${getSubPathSegmentByLanguage('meet', 'all', lang)}/`, '/meet/all/')
          .replace(`/${getPathSegmentByLanguage('meet', lang)}/`, '/meet/')
          .replace(`/${getPathSegmentByLanguage('pay', lang)}/${getSubPathSegmentByLanguage('pay', 'stripe', lang)}/`, '/pay/stripe/')
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

  // Add CV.pdf file
  const cvLastModified = await getFileLastCommitDate('public/data/cv-kirill-markin-data-engineer.pdf');
  entries.push({
    url: `${baseUrl}data/cv-kirill-markin-data-engineer.pdf`,
    lastModified: cvLastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  });

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