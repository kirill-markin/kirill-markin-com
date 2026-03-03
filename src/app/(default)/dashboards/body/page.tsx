import { Metadata } from 'next';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import { getWeightSeries } from '@/lib/weight';
import { WeightDashboard } from '@/components/charts/WeightDashboard';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Body Dashboard | ${VCARD_DATA.fullName}`;
  const description = `Body metrics dashboard by ${VCARD_DATA.fullName}. Weight tracking over time with interactive D3.js charts — updated daily.`;
  const canonicalUrl = `${SITE_URL}/dashboards/body/`;

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

export default async function BodyDashboardPage() {
  const weightSeries = await getWeightSeries();

  return (
    <main style={{ padding: '2rem 1rem' }}>
      <h1>Body</h1>

      <section style={{ marginTop: '2rem' }}>
        <div className="dashboard-grid">
          <div className="dashboard-grid-item">
            <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600 }}>Weight</h2>
            <WeightDashboard series={weightSeries} />
          </div>
        </div>
      </section>
    </main>
  );
}
