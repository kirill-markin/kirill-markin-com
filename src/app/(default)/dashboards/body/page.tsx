import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import { getWeightSeries } from '@/lib/weight';
import { WeightLineChart } from '@/components/charts/WeightLineChart';

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
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Body</h1>

      <section style={{ marginTop: '2rem' }}>
        <h2>
          <Link href="/dashboards/body/weight/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Weight
          </Link>
        </h2>
        <div style={{ width: '100%', aspectRatio: '16 / 8', minHeight: 240 }}>
          <WeightLineChart series={weightSeries} />
        </div>
      </section>
    </main>
  );
}
