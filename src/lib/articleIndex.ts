import fs from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';
import type { ArticleFrontmatter } from '@/types/article';
import { DEFAULT_LANGUAGE } from '@/lib/localization';

export type PublishedArticleReference = {
    language: string;
    slug: string;
};

export type PublishedArticleSitemapEntry = {
    language: string;
    lastmod?: string;
    slug: string;
};

export type MarkdownArticleSummary = {
    achievementLabel?: string;
    achievementValue?: string;
    date: string;
    description: string;
    language: string;
    slug: string;
    tags: string[];
    thumbnailUrl?: string;
    title: string;
    type?: string;
};

export type MarkdownArticle = MarkdownArticleSummary & {
    content: string;
};

export type LlmsArticleSummary = {
    description: string;
    slug: string;
    title: string;
};

type LlmsArticleCandidate = LlmsArticleSummary & {
    publishedAt: number;
};

function getArticlesDirectory(): string {
    return path.join(process.cwd(), 'src', 'content', 'articles');
}

function getArticlesDirectoryByLanguage(language: string): string {
    if (language === DEFAULT_LANGUAGE) {
        return getArticlesDirectory();
    }

    return path.join(getArticlesDirectory(), 'translations', language);
}

function getArticleFilePath(slug: string, language: string): string {
    return path.join(getArticlesDirectoryByLanguage(language), `${slug}.md`);
}

function toIsoDate(dateValue: string | undefined): string {
    if (!dateValue) {
        return '';
    }

    const publishedAt = new Date(dateValue);

    if (Number.isNaN(publishedAt.getTime())) {
        return '';
    }

    return publishedAt.toISOString();
}

function getPublishedAt(frontmatter: ArticleFrontmatter): number {
    if (!frontmatter.date) {
        return Number.NEGATIVE_INFINITY;
    }

    const publishedAt = new Date(frontmatter.date).getTime();

    if (Number.isNaN(publishedAt)) {
        return Number.NEGATIVE_INFINITY;
    }

    return publishedAt;
}

function toArticleDescription(frontmatter: ArticleFrontmatter, content: string): string {
    if (frontmatter.description) {
        return frontmatter.description.trim();
    }

    return content
        .replace(/^# .*$/m, '')
        .replace(/\n/g, ' ')
        .trim()
        .slice(0, 200);
}

function toMarkdownArticle(
    content: string,
    frontmatter: ArticleFrontmatter,
    slug: string
): MarkdownArticle | null {
    if (frontmatter.publish !== true || !frontmatter.title) {
        return null;
    }

    return {
        achievementLabel: frontmatter.achievementLabel,
        achievementValue: frontmatter.achievementValue,
        content,
        date: toIsoDate(frontmatter.date),
        description: toArticleDescription(frontmatter, content),
        language: frontmatter.language || DEFAULT_LANGUAGE,
        slug,
        tags: (frontmatter.tags ?? []).map((tag) => tag.toLowerCase()),
        thumbnailUrl: frontmatter.thumbnailUrl,
        title: frontmatter.title,
        type: frontmatter.type || 'Article',
    };
}

function toLlmsArticleCandidate(
    slug: string,
    frontmatter: ArticleFrontmatter,
    content: string
): LlmsArticleCandidate | null {
    if (frontmatter.publish !== true || !frontmatter.title) {
        return null;
    }

    return {
        description: toArticleDescription(frontmatter, content),
        publishedAt: getPublishedAt(frontmatter),
        slug,
        title: frontmatter.title,
    };
}

export async function getPublishedArticleReferencesByLanguage(
    language: string
): Promise<PublishedArticleReference[]> {
    const articlesDirectory = getArticlesDirectoryByLanguage(language);
    const fileNames = await fs.readdir(articlesDirectory);

    return fileNames
        .filter((fileName) => fileName.endsWith('.md') && fileName !== 'index.md')
        .map((fileName) => ({
            language,
            slug: fileName.replace(/\.md$/, ''),
        }));
}

export async function getPublishedMarkdownArticleBySlug(
    slug: string,
    language: string
): Promise<MarkdownArticle | null> {
    try {
        const fileContents = await fs.readFile(getArticleFilePath(slug, language), 'utf8');
        const { content, data } = matter(fileContents);
        return toMarkdownArticle(content, data as ArticleFrontmatter, slug);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return null;
        }

        throw error;
    }
}

export async function getPublishedMarkdownArticles(language: string): Promise<MarkdownArticleSummary[]> {
    const articleReferences = await getPublishedArticleReferencesByLanguage(language);
    const articles = await Promise.all(
        articleReferences.map(async ({ slug }) => getPublishedMarkdownArticleBySlug(slug, language))
    );

    return articles
        .filter((article): article is MarkdownArticle => article !== null)
        .sort((leftArticle, rightArticle) => {
            if (leftArticle.date < rightArticle.date) {
                return 1;
            }

            return -1;
        })
        .map((article) => ({
            achievementLabel: article.achievementLabel,
            achievementValue: article.achievementValue,
            date: article.date,
            description: article.description,
            language: article.language,
            slug: article.slug,
            tags: article.tags,
            thumbnailUrl: article.thumbnailUrl,
            title: article.title,
            type: article.type,
        }));
}

export async function getPublishedArticleSitemapEntries(
    language: string
): Promise<PublishedArticleSitemapEntry[]> {
    const articleReferences = await getPublishedArticleReferencesByLanguage(language);
    const sitemapEntries = await Promise.all(
        articleReferences.map(async ({ slug }) => {
            const fileContents = await fs.readFile(getArticleFilePath(slug, language), 'utf8');
            const { data } = matter(fileContents);
            const frontmatter = data as ArticleFrontmatter;

            if (frontmatter.publish !== true) {
                return null;
            }

            return {
                language,
                lastmod: toIsoDate(frontmatter.lastmod) || undefined,
                slug,
            };
        })
    );

    return sitemapEntries.reduce<PublishedArticleSitemapEntry[]>((entries, entry) => {
        if (entry) {
            entries.push(entry);
        }

        return entries;
    }, []);
}

export async function getRecentLlmsArticleSummaries(limit: number): Promise<LlmsArticleSummary[]> {
    const articleReferences = await getPublishedArticleReferencesByLanguage(DEFAULT_LANGUAGE);
    const articleCandidates = await Promise.all(
        articleReferences.map(async ({ slug }) => {
            const fileContents = await fs.readFile(getArticleFilePath(slug, DEFAULT_LANGUAGE), 'utf8');
            const { content, data } = matter(fileContents);
            return toLlmsArticleCandidate(slug, data as ArticleFrontmatter, content);
        })
    );

    return articleCandidates
        .filter((article): article is LlmsArticleCandidate => article !== null)
        .sort((leftArticle, rightArticle) => rightArticle.publishedAt - leftArticle.publishedAt)
        .slice(0, limit)
        .map(({ description, slug, title }) => ({
            description,
            slug,
            title,
        }));
}
