import { getBigQueryClient } from '@/lib/bigquery';
import type { WeightPoint } from '@/types/weight';

const QUERY = `
  SELECT entry_date, weight_kg
  FROM \`personal-analytics-km.public.weight_series\`
`;

export const getWeightSeries = async (): Promise<ReadonlyArray<WeightPoint>> => {
  const bigquery = getBigQueryClient();
  const [rows] = await bigquery.query({ query: QUERY });

  if (rows.length < 2) {
    throw new Error(`Expected at least 2 weight entries, got ${rows.length}`);
  }

  return rows.map((row: { entry_date: { value: string }; weight_kg: number }) => ({
    date: row.entry_date.value,
    weightKg: row.weight_kg,
  }));
};
