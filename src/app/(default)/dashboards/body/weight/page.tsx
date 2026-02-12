import { Metadata } from 'next';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import { getWeightSeries } from '@/lib/weight';
import { WeightLineChart } from '@/components/charts/WeightLineChart';

export const dynamic = 'force-static';
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const title = `Weight Chart | ${VCARD_DATA.fullName}`;
  const description = `Weight tracking chart by ${VCARD_DATA.fullName}. Interactive D3.js visualization of body weight over time — updated daily.`;
  const canonicalUrl = `${SITE_URL}/dashboards/body/weight/`;

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

export default async function WeightChartPage() {
  const weightSeries = await getWeightSeries();

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>Weight</h1>
      <div style={{ width: '100%', aspectRatio: '16 / 8', minHeight: 240 }}>
        <WeightLineChart series={weightSeries} />
      </div>
    </main>
  );
}
