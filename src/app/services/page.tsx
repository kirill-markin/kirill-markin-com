import { Metadata } from 'next';
import Services from '@/components/Services';
import { servicesData } from '@/data/services';
import PersonalInfo from '@/components/PersonalInfo';
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

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <aside className={styles.leftColumn}>
          <PersonalInfo />
        </aside>
        <div className={styles.rightColumn}>
          <Services services={servicesData} />
        </div>
      </div>
    </main>
  );
} 