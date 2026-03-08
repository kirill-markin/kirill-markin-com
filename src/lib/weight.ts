/**
 * Fetches weight series from the public.weight_series authorized view.
 * The view exposes only date + kg — no notes, IDs, or private metadata.
 * Source schema is managed in the analytics repository.
 */
import { getBigQueryClient, hasBigQueryCredentials, isVercelBuildEnvironment } from '@/lib/bigquery';
import type { WeightPoint } from '@/types/weight';

const QUERY = `
  SELECT entry_date, weight_kg
  FROM \`personal-analytics-km.public.weight_series\`
`;

type BigQueryWeightRow = Readonly<{
  entry_date: Readonly<{ value: string }>;
  weight_kg: number;
}>;

export const getWeightSeries = async (): Promise<ReadonlyArray<WeightPoint>> => {
  if (!hasBigQueryCredentials()) {
    if (isVercelBuildEnvironment()) {
      throw new Error(
        'GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is required for Vercel builds of the body dashboard.',
      );
    }

    return [];
  }

  const bigquery = getBigQueryClient();
  const [rows] = await bigquery.query({ query: QUERY });

  if (rows.length < 2) {
    throw new Error(`Expected at least 2 weight entries, got ${rows.length}`);
  }

  return rows.map((row: BigQueryWeightRow) => ({
    date: row.entry_date.value,
    weightKg: row.weight_kg,
  }));
};
