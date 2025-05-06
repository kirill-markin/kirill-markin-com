import { getAllArticles } from '@/lib/articles';
import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import { generateArticlesPageMetadata } from '@/lib/metadata';

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
  const tagParam = typeof params.tag === 'string' ? params.tag.toLowerCase() : undefined;

  return generateArticlesPageMetadata({
    language: DEFAULT_LANGUAGE,
    tag: tagParam
  });
}

export default async function ArticlesPage({ searchParams }: Props) {
  // Get the tag from URL parameters
  const params = await searchParams;
  const tagParam = typeof params.tag === 'string' ? params.tag.toLowerCase() : undefined;

  return <ArticlesPageContent language={DEFAULT_LANGUAGE} tag={tagParam} />;
} 