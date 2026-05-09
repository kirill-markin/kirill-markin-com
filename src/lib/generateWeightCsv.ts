/**
 * Generates a CSV file from weight series data at build time.
 * The CSV is written to public/data/ and served as a static download.
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { WeightPoint } from '@/types/weight';

type CsvMetadata = Readonly<{
  rowCount: number;
  fileSizeBytes: number;
}>;

export const WEIGHT_CSV_PUBLIC_PATH = '/data/body-metrics-weight-series.csv';
export const WEIGHT_CSV_HEADER = 'date,weight_kg';
export const WEIGHT_CSV_OUTPUT_PATH = join(process.cwd(), 'public', 'data', 'body-metrics-weight-series.csv');

const weightPointsToCsv = (series: ReadonlyArray<WeightPoint>): string => {
  const rows = series.map((point) => `${point.date},${point.weightKg}`);
  return [WEIGHT_CSV_HEADER, ...rows].join('\n') + '\n';
};

const getCsvMetadata = (csv: string, rowCount: number): CsvMetadata => {
  return {
    rowCount,
    fileSizeBytes: Buffer.byteLength(csv, 'utf-8'),
  };
};

export const getWeightCsvMetadata = (series: ReadonlyArray<WeightPoint>): CsvMetadata => {
  return getCsvMetadata(weightPointsToCsv(series), series.length);
};

export const generateWeightCsv = (series: ReadonlyArray<WeightPoint>): CsvMetadata => {
  const csv = weightPointsToCsv(series);

  mkdirSync(dirname(WEIGHT_CSV_OUTPUT_PATH), { recursive: true });
  writeFileSync(WEIGHT_CSV_OUTPUT_PATH, csv, 'utf-8');

  return getCsvMetadata(csv, series.length);
};
