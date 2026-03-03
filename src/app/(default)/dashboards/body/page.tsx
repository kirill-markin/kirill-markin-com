import { Metadata } from 'next';
import { SITE_URL, VCARD_DATA } from '@/data/contacts';
import { getWeightSeries } from '@/lib/weight';
import { generateWeightCsv } from '@/lib/generateWeightCsv';
import { getGenomeCircosData } from '@/lib/genome';
import { BodyFacts } from '@/components/charts/BodyFacts';
import { WeightDashboard } from '@/components/charts/WeightDashboard';
import { GenomeCircos } from '@/components/charts/GenomeCircos';
import { ChartFullscreen } from '@/components/charts/ChartFullscreen';
import { RawDataSection } from '@/components/charts/RawDataSection';

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
  const csvMeta = generateWeightCsv(weightSeries);
  const csvSizeKb = Math.round(csvMeta.fileSizeBytes / 1024);
  const genomeData = getGenomeCircosData();

  return (
    <main style={{ padding: '2rem 1rem' }}>
      <h1>Body</h1>

      <section style={{ marginTop: '2rem' }}>
        <div className="dashboard-grid">
          <div className="dashboard-grid-item">
            <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600 }}>Facts</h2>
            <BodyFacts />
          </div>
          <div className="dashboard-grid-item">
            <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600 }}>Weight</h2>
            <ChartFullscreen title="Weight">
              <WeightDashboard series={weightSeries} />
            </ChartFullscreen>
          </div>
          <div className="dashboard-grid-item">
            <h2 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 600 }}>Genome</h2>
            <ChartFullscreen title="Genome">
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#898989', lineHeight: 1.5 }}>
                Circular genome map of {genomeData.totalSnps.toLocaleString()} genotyped SNPs across 23 chromosomes.
                Outer ring: SNP density per 1 Mb window. Inner ring: heterozygosity rate.
              </p>
              <GenomeCircos data={genomeData} />
            </ChartFullscreen>
          </div>
        </div>
      </section>

      <RawDataSection
        cards={[
          {
            title: 'Body Metrics — Weight Series',
            subtitle: `Daily weight measurements in kilograms. ${csvMeta.rowCount} data points, updated daily.`,
            format: 'CSV',
            size: `~${csvSizeKb} KB`,
            url: '/data/body-metrics-weight-series.csv',
          },
          {
            title: 'Full Genome — SNP Genotyping Data',
            subtitle: 'Complete SNP genotyping results from Atlas Biomed (atlas.ru), February 2022. Contains rsID, chromosome, position, and genotype for each variant.',
            format: 'TSV',
            size: '~16 MB',
            url: 'https://storage.googleapis.com/personal-public-data-km/raw/genome_snps-kirill_markin-atlas_ru-2022_02_22.txt',
          },
        ]}
      />
    </main>
  );
}
