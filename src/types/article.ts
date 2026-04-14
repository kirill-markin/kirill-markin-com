export type Translation = {
    language: string;
    slug: string;
};

export type ArticleMetadata = {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    publish: boolean;
    lastmod?: string;
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
    lastmod?: string;
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
