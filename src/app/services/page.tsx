import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicesData } from '@/data/services';
import { DEFAULT_LANGUAGE, getSubPathSegmentByLanguage } from '@/lib/localization';
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
      // Use the English category name in the URL (which is the same as the internal ID)
      searchParams: { category: getSubPathSegmentByLanguage('services', category, DEFAULT_LANGUAGE) }
    }))
  ];
}

// Helper function to validate category parameter
function isValidCategory(category: string | undefined): boolean {
  if (!category || category === 'all') {
    return true;
  }

  const knownCategories = ['people', 'business', 'journalists'];

  // For English page, the category must be an internal category ID
  return knownCategories.includes(category);
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // Get the category from URL parameters
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;

  // If category is invalid, return empty metadata
  if (categoryParam && !isValidCategory(categoryParam)) {
    return {};
  }

  return generateServicesPageMetadata({
    language: DEFAULT_LANGUAGE,
    category: categoryParam
  });
}

export default async function ServicesPage({ searchParams }: Props) {
  // Get the category from URL parameters
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;

  // If category is invalid, return 404
  if (categoryParam && !isValidCategory(categoryParam)) {
    notFound();
  }

  return <ServicesPageContent language={DEFAULT_LANGUAGE} category={categoryParam} />;
}