import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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
  lastmod?: string;
  related?: string[];
  aliases?: string[];
  thumbnailUrl?: string;
  description?: string;
  type?: string;
  language?: string;
  publisher?: string;
  achievementValue?: string;
  achievementLabel?: string;
  isVideo?: boolean;
};

export type Article = {
  slug: string;
  content: string;
  metadata: ArticleMetadata;
};

export async function getAllArticleSlugs(): Promise<string[]> {
  const fileNames = await fs.readdir(articlesDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md') && fileName !== 'index.md')
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // Skip trying to load image files as articles
  if (slug.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)) {
    return null;
  }

  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate that this is a published article
    if (data.publish !== true) {
      return null;
    }

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
      lastmod: data.lastmod ? new Date(data.lastmod).toISOString() : undefined,
      related: data.related || [],
      aliases: data.aliases || [],
      thumbnailUrl: data.thumbnailUrl || PLACEHOLDER_IMAGE,
      description: cleanedDescription,
      type: data.type || 'Article',
      language: data.language || 'en',
      publisher: data.publisher || 'Kirill Markin',
      achievementValue: data.achievementValue,
      achievementLabel: data.achievementLabel,
      isVideo: data.isVideo || false,
    };

    return {
      slug,
      content,
      metadata,
    };
  } catch (error) {
    // Only log errors that are not related to file not found
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error(`Error getting article for slug ${slug}:`, error);
    }
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  const slugs = await getAllArticleSlugs();
  const articlesPromises = slugs.map((slug) => getArticleBySlug(slug));
  const articlesResults = await Promise.all(articlesPromises);

  const articles = articlesResults
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      if (a.metadata.date < b.metadata.date) {
        return 1;
      } else {
        return -1;
      }
    });

  return articles;
}

/**
 * Gets related articles based on tags
 * @param currentArticleSlug Slug of the current article to exclude from results
 * @param tags Array of tags to match against
 * @param limit Maximum number of articles to return
 * @returns Promise with array of related articles
 */
export async function getRelatedArticlesByTags(
  currentArticleSlug: string,
  tags: string[],
  limit: number = 5
): Promise<Article[]> {
  const allArticles = await getAllArticles();

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
    return [...relatedArticles, ...nonRelatedArticles];
  }

  // If we have enough or more related articles, just return up to the limit
  return relatedArticles.slice(0, limit);
} 