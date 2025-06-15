import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import ArticlesPageContent from '@/components/pages/ArticlesPageContent';
import { generateArticlesPageMetadata } from '@/lib/metadata';

// Force static generation even with searchParams
export const dynamic = 'force-static';

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Note: generateStaticParams not needed for searchParams - those are handled at runtime

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