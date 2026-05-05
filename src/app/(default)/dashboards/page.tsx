import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import styles from './page.module.css';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Dashboards | ${VCARD_DATA.fullName}`;
  const description = `Public dashboards by ${VCARD_DATA.fullName} with personal metrics, health data, and product activity data updated daily.`;
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
        Kirill Markin publishes dashboards with personal metrics and product activity data here.
      </p>

      <nav className={styles.dashboardsList} aria-label="Available dashboards">
        <Link href="/dashboards/body/" className={styles.dashboardCard}>
          <div className={styles.dashboardCardDetails}>
            <h2>Kirill Markin: Body</h2>
            <p>Weight tracking, body measurements, and genome data</p>
          </div>
        </Link>
        <a
          href="https://flashcards-open-source-app.com/dashboards/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.dashboardCard}
        >
          <div className={styles.dashboardCardDetails}>
            <h2>Flashcards Open Source App: Public Activity</h2>
            <p>Daily unique reviewers and review events by platform from the public API</p>
          </div>
        </a>
      </nav>
    </section>
  );
}
