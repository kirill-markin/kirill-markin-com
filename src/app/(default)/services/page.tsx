import { Metadata } from 'next';
import { DEFAULT_LANGUAGE } from '@/lib/localization';
import { generateServicesPageMetadata } from '@/lib/metadata';
import ServicesPageContent from '@/components/pages/ServicesPageContent';
import { servicesOtherData } from '@/data/servicesOther';

// Force static generation even with searchParams
export const dynamic = 'force-static';
export const revalidate = false;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
  // No category filtering on server - all categories are static
  return generateServicesPageMetadata({
    language: DEFAULT_LANGUAGE,
    category: undefined
  });
}

export default async function ServicesPage() {
  // Pass all services data to client component
  return <ServicesPageContent
    language={DEFAULT_LANGUAGE}
    services={servicesOtherData}
  />;
}