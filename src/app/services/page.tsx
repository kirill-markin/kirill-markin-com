import { Metadata } from 'next';
import { servicesData } from '@/data/services';
import PersonalInfo from '@/components/PersonalInfo';
import ServerServices from '@/components/ServerServices';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Kirill Markin | Services',
  description: 'Explore the range of services offered by Kirill Markin, including AI consulting, analytics department audit, startup guidance, and more.',
  openGraph: {
    title: 'Kirill Markin | Services',
    description: 'Explore the range of services offered by Kirill Markin, including AI consulting, analytics department audit, startup guidance, and more.',
    url: 'https://kirill-markin.com/services/',
    images: [
      {
        url: '/services/services-hero.webp',
        width: 1200,
        height: 630,
        alt: 'Kirill Markin Services',
      }
    ],
  },
  twitter: {
    title: 'Kirill Markin | Services',
    description: 'Explore the range of services offered by Kirill Markin, including AI consulting, analytics department audit, startup guidance, and more.',
    images: ['/services/services-hero.webp'],
  },
  alternates: {
    canonical: 'https://kirill-markin.com/services/',
  },
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ServicesPage({ searchParams }: Props) {
  // Get the category from URL parameters
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : 'all';

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <aside className={styles.leftColumn}>
          <PersonalInfo />
        </aside>
        <div className={styles.rightColumn}>
          <ServerServices services={servicesData} currentCategory={categoryParam} />
        </div>
      </div>
    </main>
  );
} 