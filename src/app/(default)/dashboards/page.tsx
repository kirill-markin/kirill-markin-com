import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import styles from './page.module.css';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Dashboards | ${VCARD_DATA.fullName}`;
  const description = `Public personal dashboards by ${VCARD_DATA.fullName}. Body metrics, health data, and more — updated daily.`;
  const canonicalUrl = `${SITE_URL}/dashboards/`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: VCARD_DATA.fullName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
      types: { 'text/markdown': `${canonicalUrl.replace(/\/+$/, '')}.md` },
    },
  };
}

export default function DashboardsPage() {
  return (
    <section className={styles.dashboardsContainer}>
      <h1>Dashboards</h1>
      <p>Public personal metrics and data visualizations.</p>
      <p>
        Kirill Markin plans to publish links to dashboards with different datasets here. There
        are not many of them yet, but more are planned in the future.
      </p>

      <nav className={styles.dashboardsList} aria-label="Available dashboards">
        <Link href="/dashboards/body/" className={styles.dashboardCard}>
          <div className={styles.dashboardCardDetails}>
            <h2>Kirill Markin: Body</h2>
            <p>Weight tracking, body measurements, and genome data</p>
          </div>
        </Link>
      </nav>
    </section>
  );
}
