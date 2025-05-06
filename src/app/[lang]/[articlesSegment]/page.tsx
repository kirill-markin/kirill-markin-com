import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { SUPPORTED_LANGUAGES, getPathSegmentByLanguage, getLocaleForLanguage, DEFAULT_LANGUAGE } from '@/lib/localization';
import styles from '@/app/articles/articles.module.css';

interface ArticlesPageProps {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ tag?: string }>;
}

// Translations for static text
const translations = {
    title: {
        'en': 'Articles',
        'es': 'Artículos',
        'zh': '文章',
        'ar': 'المقالات',
        'hi': 'लेख',
    },
    description: {
        'en': 'Browse curated insights on technology, strategy, and personal development.',
        'es': 'Explore artículos sobre tecnología, estrategia y desarrollo personal.',
        'zh': '浏览关于技术、战略和个人发展的精选见解。',
        'ar': 'تصفح الرؤى المنسقة حول التكنولوجيا والاستراتيجية والتنمية الشخصية.',
        'hi': 'प्रौद्योगिकी, रणनीति और व्यक्तिगत विकास पर क्यूरेटेड अंतर्दृष्टि ब्राउज़ करें।',
    },
    noArticlesFound: {
        'en': 'No articles found',
        'es': 'No se encontraron artículos',
        'zh': '未找到文章',
        'ar': 'لم يتم العثور على مقالات',
        'hi': 'कोई लेख नहीं मिला',
    },
    allArticles: {
        'en': 'All Articles',
        'es': 'Todos los Artículos',
        'zh': '所有文章',
        'ar': 'جميع المقالات',
        'hi': 'सभी लेख',
    },
    filteredBy: {
        'en': 'Filtered by tag:',
        'es': 'Filtrado por etiqueta:',
        'zh': '按标签筛选:',
        'ar': 'تمت التصفية حسب العلامة:',
        'hi': 'टैग द्वारा फ़िल्टर किया गया:',
    },
};

// Generate static parameters for all supported languages
export async function generateStaticParams() {
    const params = [];

    // For each non-default language, create an articles page
    for (const lang of SUPPORTED_LANGUAGES) {
        if (lang === DEFAULT_LANGUAGE) continue; // Skip default language (handled by /articles)

        const articlesSegment = getPathSegmentByLanguage('articles', lang);
        params.push({
            lang,
            articlesSegment,
        });
    }

    return params;
}

export async function generateMetadata({ params, searchParams }: ArticlesPageProps): Promise<Metadata> {
    const { lang } = await params;
    const { tag } = await searchParams;

    // Generate language-specific metadata
    const articlesTitle = translations.title[lang as keyof typeof translations.title] || translations.title.en;
    let title = `${articlesTitle} | Kirill Markin`;
    let description = translations.description[lang as keyof typeof translations.description] || translations.description.en;

    // Customize title and description for tag filter
    if (tag) {
        title = `${tag} ${articlesTitle} | Kirill Markin`;
        const filteredBy = translations.filteredBy[lang as keyof typeof translations.filteredBy] || translations.filteredBy.en;
        description = `${filteredBy} ${tag}. ${description}`;
    }

    // Generate canonical URL
    const canonicalUrl = lang === DEFAULT_LANGUAGE
        ? `https://kirill-markin.com/articles/${tag ? `?tag=${tag}` : ''}`
        : `https://kirill-markin.com/${lang}/${getPathSegmentByLanguage('articles', lang)}/${tag ? `?tag=${tag}` : ''}`;

    // Prepare language alternates
    const alternateLanguages: Record<string, string> = {};

    for (const altLang of SUPPORTED_LANGUAGES) {
        if (altLang === lang) continue;

        const altSegment = altLang === DEFAULT_LANGUAGE ? 'articles' : getPathSegmentByLanguage('articles', altLang);
        const altUrl = altLang === DEFAULT_LANGUAGE
            ? `https://kirill-markin.com/articles/${tag ? `?tag=${tag}` : ''}`
            : `https://kirill-markin.com/${altLang}/${altSegment}/${tag ? `?tag=${tag}` : ''}`;

        alternateLanguages[altLang] = altUrl;
    }

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: canonicalUrl,
            locale: getLocaleForLanguage(lang),
        },
        alternates: {
            canonical: canonicalUrl,
            languages: alternateLanguages,
        }
    };
}

export default async function ArticlesPage({ params, searchParams }: ArticlesPageProps) {
    const { lang } = await params;
    const { tag } = await searchParams;

    // Construct current path including query parameters
    const currentPath = tag
        ? `/${lang}/${getPathSegmentByLanguage('articles', lang)}/?tag=${tag}`
        : `/${lang}/${getPathSegmentByLanguage('articles', lang)}/`;

    // Get articles in the requested language
    const allArticles = await getAllArticles(lang);

    // Filter by tag if provided
    const articles = tag
        ? allArticles.filter(article => article.metadata.tags.includes(tag.toLowerCase()))
        : allArticles;

    // Get translations
    const allArticlesText = translations.allArticles[lang as keyof typeof translations.allArticles] || translations.allArticles.en;
    const filteredByText = translations.filteredBy[lang as keyof typeof translations.filteredBy] || translations.filteredBy.en;
    const noArticlesFoundText = translations.noArticlesFound[lang as keyof typeof translations.noArticlesFound] || translations.noArticlesFound.en;

    return (
        <div className={styles.articlesContainer}>
            <div className={styles.articlesHeader}>
                <h1 className={styles.title}>
                    {tag ? (
                        <>
                            <span className={styles.tagPrefix}>{filteredByText} </span>
                            <span className={styles.tagHighlight}>{tag}</span>
                        </>
                    ) : (
                        allArticlesText
                    )}
                </h1>

                {tag && (
                    <Link href={currentPath} className={styles.viewAllLink}>
                        {allArticlesText}
                    </Link>
                )}
            </div>

            {articles.length === 0 ? (
                <p className={styles.noArticles}>{noArticlesFoundText}</p>
            ) : (
                <div className={styles.articlesList}>
                    {articles.map((article) => {
                        // Check if this is a video
                        const isVideo = article.metadata.isVideo ||
                            article.metadata.type?.toLowerCase() === 'video';

                        return (
                            <article key={article.slug} className={`${styles.articleCard} ${isVideo ? styles.video : ''}`}>
                                <Link href={`/${lang}/${getPathSegmentByLanguage('articles', lang)}/${article.slug}/`} className={styles.articleLink}>
                                    <div className={styles.language}>
                                        <div className={styles.text}>[{article.metadata.language || lang}]</div>
                                    </div>

                                    {article.metadata.type && (
                                        <div className={styles.type}>
                                            <div className={styles.text}>[{article.metadata.type}]</div>
                                        </div>
                                    )}

                                    <div className={styles.thumbnailContainer}>
                                        <Image
                                            className={styles.thumbnail}
                                            src={article.metadata.thumbnailUrl || '/articles/placeholder.webp'}
                                            alt={article.metadata.title}
                                            width={640}
                                            height={360}
                                            sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            quality={75}
                                            priority={articles.indexOf(article) < 4}
                                        />
                                    </div>

                                    <div className={styles.content}>
                                        <h2 className={styles.articleTitle}>{article.metadata.title}</h2>

                                        {article.metadata.description && (
                                            <p className={styles.description}>{article.metadata.description}</p>
                                        )}

                                        <div className={styles.footer}>
                                            <div className={styles.date}>
                                                {article.metadata.date && (
                                                    <time dateTime={article.metadata.date}>
                                                        {new Date(article.metadata.date).toLocaleDateString(lang === 'en' ? 'en-US' : lang, {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                )}
                                            </div>

                                            {article.metadata.achievementValue && article.metadata.achievementLabel && (
                                                <div className={styles.achievement}>
                                                    <div className={styles.value}>{article.metadata.achievementValue}</div>
                                                    <div className={styles.label}>{article.metadata.achievementLabel}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 