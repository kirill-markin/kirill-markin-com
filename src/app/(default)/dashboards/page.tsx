import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';

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
    },
  };
}

export default function DashboardsPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Dashboards</h1>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
        <li>
          <Link href="/dashboards/body/" style={{ fontSize: '1.1rem' }}>
            Body
          </Link>
          <p style={{ color: '#898989', margin: '0.25rem 0 1rem' }}>
            Weight tracking and body measurements
          </p>
        </li>
      </ul>
    </main>
  );
}
