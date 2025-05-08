import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Translation } from '@/types/article';
import { DEFAULT_LANGUAGE } from './localization';

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');
const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

/**
 * Cleans markdown symbols from a description string
 */
function cleanDescription(description: string | undefined): string {
  if (!description) return '';

  // Remove markdown heading symbols (##)
  const withoutHeadingMarkers = description.replace(/^#+\s*/g, '');

  // Check if this is the beginning of the content which typically starts with an H1
  // And remove the entire H1 line if present
  return withoutHeadingMarkers.replace(/^(.*?)\n/, '');
}

export type ArticleMetadata = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  publish: boolean;
  lastmod: string;
  thumbnailUrl?: string;
  description?: string;
  type?: string;
  language: string;
  publisher?: string;
  achievementValue?: string;
  achievementLabel?: string;
  isVideo?: boolean;
  translations?: Translation[];
  originalArticle?: Translation;
};

export type Article = {
  slug: string;
  content: string;
  metadata: ArticleMetadata;
};

/**
 * Get all article slugs for the default language (English)
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  const fileNames = await fs.readdir(articlesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') && fileName !== 'index.md')
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get all article slugs for a specific language
 */
export async function getAllArticleSlugsByLanguage(language: string): Promise<string[]> {
  if (language === DEFAULT_LANGUAGE) {
    return getAllArticleSlugs();
  }

  try {
    const translationDir = path.join(articlesDirectory, 'translations', language);
    const fileNames = await fs.readdir(translationDir);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    // Directory might not exist yet
    console.error(`Error reading translations directory for ${language}:`, error);
    return [];
  }
}

/**
 * Get article by slug with language support
 */
export async function getArticleBySlug(
  slug: string,
  language: string = DEFAULT_LANGUAGE
): Promise<Article | null> {
  // Skip trying to load image files as articles
  if (slug.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)) {
    return null;
  }

  try {
    let fullPath;

    if (language === DEFAULT_LANGUAGE) {
      fullPath = path.join(articlesDirectory, `${slug}.md`);
    } else {
      fullPath = path.join(
        articlesDirectory,
        'translations',
        language,
        `${slug}.md`
      );
    }

    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate that this is a published article
    if (data.publish !== true) {
      return null;
    }

    // Get file's last modification date from the file system
    const fileStats = await fs.stat(fullPath);
    const lastModificationDate = fileStats.mtime;

    // Get first 160 characters of content for description if none exists in frontmatter
    const contentPreview = content.replace(/^# .*$/m, '').substring(0, 200).replace(/\n/g, ' ').trim();

    // Clean description if it exists by removing markdown symbols
    const cleanedDescription = data.description
      ? cleanDescription(data.description)
      : cleanDescription(contentPreview);

    const metadata: ArticleMetadata = {
      slug,
      title: data.title || '',
      date: data.date ? new Date(data.date).toISOString() : '',
      tags: (data.tags || []).map((tag: string) => tag.toLowerCase()),
      publish: data.publish || false,
      lastmod: lastModificationDate.toISOString(),
      thumbnailUrl: data.thumbnailUrl || PLACEHOLDER_IMAGE,
      description: cleanedDescription,
      type: data.type || 'Article',
      language: data.language || language,
      publisher: data.publisher || 'Kirill Markin',
      achievementValue: data.achievementValue,
      achievementLabel: data.achievementLabel,
      isVideo: data.isVideo || false,
      translations: data.translations || [],
      originalArticle: data.originalArticle,
    };

    // For non-English articles with original article reference, add the original English
    // article to translations for bidirectional language switching
    if (language !== DEFAULT_LANGUAGE && metadata.originalArticle) {
      // Add original English article to translations if not already there
      const hasEnglishTranslation = metadata.translations?.some(
        t => t.language === DEFAULT_LANGUAGE
      );

      if (!hasEnglishTranslation) {
        metadata.translations = [
          ...(metadata.translations || []),
          {
            language: DEFAULT_LANGUAGE,
            slug: metadata.originalArticle.slug
          }
        ];
      }
    }

    return {
      slug,
      content,
      metadata,
    };
  } catch (error) {
    // Only log errors that are not related to file not found
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Error getting article for slug ${slug} in language ${language}:`, error);
    }
    return null;
  }
}

/**
 * Get all articles with language support
 */
export async function getAllArticles(language: string = DEFAULT_LANGUAGE): Promise<Article[]> {
  if (language === DEFAULT_LANGUAGE) {
    return getEnglishArticles();
  } else {
    return getTranslatedArticles(language);
  }
}

/**
 * Get all English (default language) articles
 */
async function getEnglishArticles(): Promise<Article[]> {
  const slugs = await getAllArticleSlugs();
  const articlesPromises = slugs.map((slug) => getArticleBySlug(slug, DEFAULT_LANGUAGE));
  const articlesResults = await Promise.all(articlesPromises);

  const filteredArticles = articlesResults
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      if (a.metadata.date < b.metadata.date) {
        return 1;
      } else {
        return -1;
      }
    });

  // Apply bidirectional connections
  return buildArticleConnections(filteredArticles);
}

/**
 * Get translated articles for a specific language
 */
async function getTranslatedArticles(language: string): Promise<Article[]> {
  const translationDir = path.join(articlesDirectory, 'translations', language);

  try {
    // Check if directory exists before attempting to read it
    try {
      await fs.access(translationDir);
    } catch {
      // Directory doesn't exist, return empty array instead of throwing error
      return [];
    }

    const fileNames = await fs.readdir(translationDir);
    const slugs = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));

    const articlesPromises = slugs.map((slug) => getArticleBySlug(slug, language));
    const articlesResults = await Promise.all(articlesPromises);

    const filteredArticles = articlesResults
      .filter((article): article is Article => article !== null)
      .sort((a, b) => {
        if (a.metadata.date < b.metadata.date) {
          return 1;
        } else {
          return -1;
        }
      });

    // Apply bidirectional connections
    return buildArticleConnections(filteredArticles);
  } catch (error) {
    console.error(`Error reading translations for ${language}:`, error);
    return [];
  }
}

/**
 * Build connections between original and translated articles
 * Updates articles with translations and originalArticle references
 */
export async function buildArticleConnections(
  articles: Article[]
): Promise<Article[]> {
  // Group articles by their "real" slugs (original or translated)
  const articleGroups = new Map<string, Article[]>();

  // Map to track translated articles by their language and slug for reverse lookup
  const translationMap = new Map<string, Article>();

  // First pass: group original articles with their translations
  for (const article of articles) {
    const { metadata } = article;

    if (metadata.language === DEFAULT_LANGUAGE) {
      // Original article
      const group = articleGroups.get(article.slug) || [];
      group.push(article);
      articleGroups.set(article.slug, group);
    } else if (metadata.originalArticle) {
      // Translated article
      const originalSlug = metadata.originalArticle.slug;
      const group = articleGroups.get(originalSlug) || [];
      group.push(article);
      articleGroups.set(originalSlug, group);

      // Add to translation map for reverse lookup
      const key = `${metadata.language}:${article.slug}`;
      translationMap.set(key, article);
    }
  }

  // Second pass: update each article with its translation connections
  return articles.map(article => {
    const { metadata } = article;

    if (metadata.language === DEFAULT_LANGUAGE) {
      // Original article: find all its translations
      const group = articleGroups.get(article.slug) || [];
      const translations = group
        .filter(a => a.metadata.language !== DEFAULT_LANGUAGE)
        .map(a => ({
          language: a.metadata.language,
          slug: a.slug
        }));

      // Only update if we found translations
      if (translations.length > 0) {
        return {
          ...article,
          metadata: {
            ...metadata,
            translations
          }
        };
      }
    } else {
      // For non-English articles: Include the original article in translations if it exists
      if (metadata.originalArticle) {
        // Find the original English article to include in translations
        const originalArticle = {
          language: DEFAULT_LANGUAGE,
          slug: metadata.originalArticle.slug
        };

        // Create translations array if it doesn't exist, or add to existing
        const translations = metadata.translations || [];

        // Check if the English version is already included in translations
        const englishAlreadyIncluded = translations.some(
          t => t.language === DEFAULT_LANGUAGE
        );

        if (!englishAlreadyIncluded) {
          // Add the English version to translations
          return {
            ...article,
            metadata: {
              ...metadata,
              translations: [...translations, originalArticle]
            }
          };
        }
      }
    }

    return article;
  });
}

/**
 * Gets related articles based on tags with language support
 * @param currentArticleSlug Slug of the current article to exclude from results
 * @param tags Array of tags to match against
 * @param language Language to filter articles by
 * @param limit Maximum number of articles to return
 * @returns Promise with array of related articles
 */
export async function getRelatedArticlesByTags(
  currentArticleSlug: string,
  tags: string[],
  language: string = DEFAULT_LANGUAGE,
  limit: number = 5
): Promise<Article[]> {
  const allArticles = await getAllArticles(language);

  // Filter out the current article and find articles with matching tags
  const relatedArticles = allArticles
    .filter(article =>
      // Exclude current article
      article.slug !== currentArticleSlug &&
      // Must have at least one matching tag
      article.metadata.tags.some(tag => tags.includes(tag))
    )
    // Sort by the number of matching tags (most matches first)
    .sort((a, b) => {
      const aMatches = a.metadata.tags.filter(tag => tags.includes(tag)).length;
      const bMatches = b.metadata.tags.filter(tag => tags.includes(tag)).length;
      return bMatches - aMatches;
    });

  // If we have fewer related articles than the limit, add recent non-related articles
  if (relatedArticles.length < limit) {
    // Get non-related articles (excluding the current article and any already-included related articles)
    const relatedSlugs = new Set([currentArticleSlug, ...relatedArticles.map(article => article.slug)]);

    const nonRelatedArticles = allArticles
      .filter(article => !relatedSlugs.has(article.slug))
      // Sort by date (newest first)
      .sort((a, b) => {
        if (a.metadata.date < b.metadata.date) {
          return 1;
        } else {
          return -1;
        }
      })
      // Limit to the number needed to reach the total limit
      .slice(0, limit - relatedArticles.length);

    // Combine the related and non-related articles
    const combinedResults = [...relatedArticles, ...nonRelatedArticles];

    // Return combined results with limit applied
    return combinedResults.slice(0, limit);
  }

  // If we have enough or more related articles, just return up to the limit
  return relatedArticles.slice(0, limit);
} 