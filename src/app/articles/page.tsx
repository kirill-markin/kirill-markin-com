import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { Metadata } from 'next';
import styles from './articles.module.css';

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// This function generates all possible tag routes at build time
export async function generateStaticParams() {
  const articles = await getAllArticles();
  
  // Get unique tags from all articles
  const allTags = articles.flatMap(article => article.metadata.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);
  
  // Generate params for 'all' and each specific tag
  return [
    { searchParams: {} }, // Default page (all)
    ...uniqueTags.map(tag => ({
      searchParams: { tag }
    }))
  ];
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // Get the tag from URL parameters
  const params = await searchParams;
  const tagParam = typeof params.tag === 'string' ? params.tag : 'all';
  
  // Base metadata
  const baseTitle = 'Articles | Kirill Markin';
  let title = baseTitle;
  let description = 'Articles and insights from Kirill Markin on tech, business, and productivity.';
  
  // Tag-specific metadata
  if (tagParam !== 'all') {
    const formattedTag = tagParam.charAt(0).toUpperCase() + tagParam.slice(1);
    
    // Count articles with this tag
    const articles = await getAllArticles();
    const tagArticles = articles.filter(article => 
      article.metadata.tags && article.metadata.tags.includes(tagParam)
    );
    const articlesCount = tagArticles.length;
    
    title = `${formattedTag} Articles (${articlesCount}) | Kirill Markin`;
    description = `Articles and insights about ${formattedTag} from Kirill Markin - expert analysis and perspectives.`;
  }
  
  // Images and other metadata
  const images = [
    {
      url: '/articles/articles-hero.webp',
      width: 1200,
      height: 630,
      alt: 'Kirill Markin Articles',
    }
  ];
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: tagParam === 'all' 
        ? 'https://kirill-markin.com/articles/'
        : `https://kirill-markin.com/articles/?tag=${tagParam}`,
      images,
    },
    twitter: {
      title,
      description,
      images: ['/articles/articles-hero.webp'],
    },
    alternates: {
      canonical: tagParam === 'all'
        ? 'https://kirill-markin.com/articles/'
        : `https://kirill-markin.com/articles/?tag=${tagParam}`,
    },
  };
}

const PLACEHOLDER_IMAGE = '/articles/placeholder.webp';

export default async function ArticlesPage({ searchParams }: Props) {
  const params = await searchParams;
  const tagParam = typeof params.tag === 'string' ? params.tag : 'all';
  
  const articles = await getAllArticles();
  
  // Filter articles based on tag if provided
  const filteredArticles = tagParam === 'all' 
    ? articles 
    : articles.filter(article => 
        article.metadata.tags && article.metadata.tags.includes(tagParam)
      );
  
  // Get all unique tags for the tag menu
  const allTags = articles.flatMap(article => article.metadata.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).filter(tag => tag);

  const getTagDescription = () => {
    if (tagParam === 'all') {
      return 'Browse articles and insights on tech, business, AI, and productivity. Filter by tags to find content on specific topics.';
    }
    
    const formattedTag = tagParam.charAt(0).toUpperCase() + tagParam.slice(1);
    
    // Get count of articles with this tag
    const tagArticlesCount = filteredArticles.length;
    
    return `Articles tagged with "${formattedTag}" (${tagArticlesCount}). These posts focus specifically on ${tagParam}-related topics and insights.`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.fullWidthColumn}>
          <div className={styles.articlesHeader}>
            <div className={styles.articlesHeaderTitle}>
              <h1 className={styles.articlesTitle}>
                Article<span className={styles.glitchLetter}>s</span>
              </h1>
              <div className={styles.categoryDescription}>
                <p>{getTagDescription()}</p>
              </div>
            </div>
            <Link href="/" className={styles.backLink}>
              ← Back to main
            </Link>
          </div>
          
          <nav className={styles.tagsMenu} aria-label="Article tags">
            <span>Tags</span>
            <div className={styles.tagsMenuItems}>
              <Link 
                href="/articles"
                className={`${styles.tagMenuItem} ${tagParam === 'all' ? styles.active : ''}`}
              >
                All
              </Link>
              
              {uniqueTags
                .map(tag => ({
                  tag,
                  count: articles.filter(article => 
                    article.metadata.tags && article.metadata.tags.includes(tag)
                  ).length
                }))
                .sort((a, b) => b.count - a.count)
                .map(({ tag, count }) => (
                  <Link 
                    key={tag}
                    href={`/articles?tag=${tag}`}
                    className={`${styles.tagMenuItem} ${tagParam === tag ? styles.active : ''}`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)} [{count}]
                  </Link>
                ))}
            </div>
          </nav>
          
          <div className={styles.mediaMentions}>
            {filteredArticles.map((article, index) => {
              const isLarge = index === 0 || index === 5;
              const isVideo = article.metadata.isVideo || article.metadata.type?.toLowerCase() === 'video';
              
              return (
                <article 
                  key={article.slug} 
                  className={`${styles.mediaMention} ${isLarge ? styles.wide : ''} ${isVideo ? styles.video : ''} ${isLarge ? styles.wideWithThumbnail : ''}`}
                >
                  <Link 
                    href={`/articles/${article.slug}`}
                    className={styles.mentionLink}
                  >
                    <div className={styles.language}>
                      <div className={styles.text}>[{article.metadata.language || 'en'}]</div>
                    </div>
                    
                    {article.metadata.type && (
                      <div className={styles.type}>
                        <div className={styles.text}>[{article.metadata.type}]</div>
                      </div>
                    )}
                    
                    <div className={styles.thumbnailContainer}>
                      <Image 
                        className={styles.thumbnail} 
                        src={article.metadata.thumbnailUrl || PLACEHOLDER_IMAGE} 
                        alt={article.metadata.title} 
                        width={640} 
                        height={360} 
                        priority={index < 4}
                      />
                    </div>
                    
                    <div className={styles.content}>
                      <h2 className={styles.title}>{article.metadata.title}</h2>
                      
                      {article.metadata.description && (
                        <p className={styles.description}>{article.metadata.description}</p>
                      )}
                      
                      <div className={styles.footer}>
                        <div className={styles.date}>
                          {article.metadata.date && (
                            <time dateTime={article.metadata.date}>
                              {new Date(article.metadata.date).toLocaleDateString('en-US', {
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
        </div>
      </div>
    </main>
  );
} 