import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'obsidian-vault/public');

export type ArticleMetadata = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  publish: boolean;
  lastmod?: string;
  related?: string[];
  aliases?: string[];
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
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Validate that this is a published article
    if (data.publish !== true) {
      return null;
    }
    
    const metadata: ArticleMetadata = {
      slug,
      title: data.title || '',
      date: data.date ? new Date(data.date).toISOString() : '',
      tags: data.tags || [],
      publish: data.publish || false,
      lastmod: data.lastmod ? new Date(data.lastmod).toISOString() : undefined,
      related: data.related || [],
      aliases: data.aliases || [],
    };
    
    return {
      slug,
      content,
      metadata,
    };
  } catch (error) {
    console.error(`Error getting article for slug ${slug}:`, error);
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