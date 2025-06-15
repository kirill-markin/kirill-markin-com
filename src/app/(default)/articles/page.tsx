import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import { generateArticlesPageMetadata } from '@/lib/metadata';
import { getAllArticles } from '@/lib/articles';

// Force static generation even with searchParams
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  // No tag filtering on server - all tags are static
  return generateArticlesPageMetadata({
    language: DEFAULT_LANGUAGE,
    tag: undefined
  });
}

export default async function ArticlesPage() {
  // Load all articles on server and pass to client component
  const articles = await getAllArticles(DEFAULT_LANGUAGE);

  return <ArticlesPageContent language={DEFAULT_LANGUAGE} articles={articles} />;
} 