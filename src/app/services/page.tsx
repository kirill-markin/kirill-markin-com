import { Metadata } from 'next';
import Services from '@/components/Services';
import { servicesData } from '@/data/services';
import PersonalInfo from '@/components/PersonalInfo';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Kirill Markin | Services',
  description: 'Explore the range of services offered by Kirill Markin, including AI consulting, analytics department audit, startup guidance, and more.',
};

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <PersonalInfo />
        </div>
        <div className={styles.rightColumn}>
          <Services services={servicesData} />
        </div>
      </div>
    </main>
  );
} 