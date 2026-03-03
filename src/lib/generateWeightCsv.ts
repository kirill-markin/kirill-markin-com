/**
 * Generates a CSV file from weight series data at build time.
 * The CSV is written to public/data/ and served as a static download.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { WeightPoint } from '@/types/weight';

type CsvMetadata = Readonly<{
  rowCount: number;
  fileSizeBytes: number;
}>;

const CSV_FILENAME = 'body-metrics-weight-series.csv';
const CSV_HEADER = 'date,weight_kg';

const weightPointsToCsv = (series: ReadonlyArray<WeightPoint>): string => {
  const rows = series.map((point) => `${point.date},${point.weightKg}`);
  return [CSV_HEADER, ...rows].join('\n') + '\n';
};

export const generateWeightCsv = (series: ReadonlyArray<WeightPoint>): CsvMetadata => {
  const csv = weightPointsToCsv(series);
  const outputPath = join(process.cwd(), 'public', 'data', CSV_FILENAME);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, csv, 'utf-8');

  return {
    rowCount: series.length,
    fileSizeBytes: Buffer.byteLength(csv, 'utf-8'),
  };
};
