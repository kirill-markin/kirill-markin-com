/**
 * Generates a CSV file from weight series data at build time.
 * The CSV is written to public/data/ and served as a static download.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { WeightPoint } from '@/types/weight';

type CsvMetadata = Readonly<{
  rowCount: number;
  fileSizeBytes: number;
}>;

const CSV_FILENAME = 'body-metrics-weight-series.csv';
const CSV_HEADER = 'date,weight_kg';
const CSV_OUTPUT_PATH = join(process.cwd(), 'public', 'data', CSV_FILENAME);

const weightPointsToCsv = (series: ReadonlyArray<WeightPoint>): string => {
  const rows = series.map((point) => `${point.date},${point.weightKg}`);
  return [CSV_HEADER, ...rows].join('\n') + '\n';
};

export const generateWeightCsv = (series: ReadonlyArray<WeightPoint>): CsvMetadata => {
  const csv = weightPointsToCsv(series);

  mkdirSync(dirname(CSV_OUTPUT_PATH), { recursive: true });
  writeFileSync(CSV_OUTPUT_PATH, csv, 'utf-8');

  return {
    rowCount: series.length,
    fileSizeBytes: Buffer.byteLength(csv, 'utf-8'),
  };
};

export const removeWeightCsv = (): void => {
  if (!existsSync(CSV_OUTPUT_PATH)) {
    return;
  }

  rmSync(CSV_OUTPUT_PATH);
};
