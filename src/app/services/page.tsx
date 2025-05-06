import { Metadata } from 'next';
import { servicesData } from '@/data/services';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateServicesPageMetadata } from '@/lib/metadata';
import ServicesPageContent from '@/components/pages/ServicesPageContent';

type Props = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// This function generates all possible category routes at build time
export function generateStaticParams() {
  // Get unique categories from data
  const categories = Array.from(
    new Set(servicesData.map(service => service.categoryId))
  ).filter(category => category !== 'all');

  // Generate params for 'all' and each specific category
  return [
    { searchParams: {} }, // Default page (all)
    ...categories.map(category => ({
      searchParams: { category }
    }))
  ];
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // Get the category from URL parameters
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;

  return generateServicesPageMetadata({
    language: DEFAULT_LANGUAGE,
    category: categoryParam
  });
}

export default async function ServicesPage({ searchParams }: Props) {
  // Get the category from URL parameters
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;

  return <ServicesPageContent language={DEFAULT_LANGUAGE} category={categoryParam} />;
}