import { Metadata } from 'next';
import { servicesData } from '@/data/services';
import Link from 'next/link';
import ServerServices from '@/components/ServerServices';
import styles from './page.module.css';

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
  const categoryParam = typeof params.category === 'string' ? params.category : 'all';
  
  // Base metadata
  const baseTitle = 'Services | Kirill Markin';
  let title = baseTitle;
  let description = 'Explore the full range of services offered by Kirill Markin, including AI consulting, analytics department audit, startup guidance, and more.';
  
  // Category-specific metadata
  if (categoryParam !== 'all') {
    const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
    
    // Count services in this category
    const categoryServices = servicesData.filter(service => service.categoryId === categoryParam);
    const servicesCount = categoryServices.length;
    
    title = `Services for ${formattedCategory} (${servicesCount}) | Kirill Markin`;
    
    // Generate category-specific description
    switch (categoryParam) {
      case 'people':
        description = 'Personal consultations, career coaching, and services for individuals. Get personalized support from an expert in AI and data.';
        break;
      case 'business':
        description = 'Professional services for businesses — from analytics department audits to AI product development and database optimization.';
        break;
      case 'journalists':
        description = 'Services for journalists and media — conference appearances, interviews, expert comments on AI, data, and technology topics.';
        break;
      default:
        description = `Services in the ${formattedCategory} category from Kirill Markin — an expert in AI, data, and technology.`;
    }
  }
  
  // Images and other metadata
  const images = [
    {
      url: '/services/services-hero.webp',
      width: 1200,
      height: 630,
      alt: 'Kirill Markin Services',
    }
  ];
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: categoryParam === 'all' 
        ? 'https://kirill-markin.com/services/'
        : `https://kirill-markin.com/services/?category=${categoryParam}`,
      images,
    },
    twitter: {
      title,
      description,
      images: ['/services/services-hero.webp'],
    },
    alternates: {
      canonical: categoryParam === 'all'
        ? 'https://kirill-markin.com/services/'
        : `https://kirill-markin.com/services/?category=${categoryParam}`,
    },
  };
}

export default async function ServicesPage({ searchParams }: Props) {
  // Get the category from URL parameters
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : 'all';

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.fullWidthColumn}>
          <div className={styles.backLinkContainer}>
            <Link href="/" className={styles.backLink}>← Back to main</Link>
          </div>
          <ServerServices services={servicesData} currentCategory={categoryParam} />
        </div>
      </div>
    </main>
  );
} 