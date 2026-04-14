export type Translation = {
    language: string;
    slug: string;
};

export type ArticleModifiedDateSource = 'frontmatter' | 'none';

export type ArticleMetadata = {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    publish: boolean;
    lastmod?: string;
    modifiedDateSource: ArticleModifiedDateSource;
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

export type ArticleFrontmatter = {
    title?: string;
    date?: string;
    dateModified?: string;
    lastmod?: string;
    updated?: string;
    tags?: string[];
    publish?: boolean;
    thumbnailUrl?: string;
    description?: string;
    type?: string;
    language?: string;
    publisher?: string;
    achievementValue?: string;
    achievementLabel?: string;
    isVideo?: boolean;
    translations?: Translation[];
    originalArticle?: Translation;
};
