/**
 * Fetches the public AWS weight projection and writes build-local artifacts.
 *
 * Usage: npx tsx scripts/generate-weight-data.ts
 */
import { generateWeightCsv, WEIGHT_CSV_OUTPUT_PATH } from '../src/lib/generateWeightCsv';
import { fetchWeightSeriesFromAws } from '../src/lib/weight';

const main = async (): Promise<void> => {
  const series = await fetchWeightSeriesFromAws();
  const metadata = generateWeightCsv(series);

  console.log('weight_series_generated', {
    path: WEIGHT_CSV_OUTPUT_PATH,
    rowCount: metadata.rowCount,
    fileSizeBytes: metadata.fileSizeBytes,
  });
};

main().catch((error: unknown) => {
  const errorName = error instanceof Error ? error.name : typeof error;
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('weight_series_generation_failed', {
    errorName,
    errorMessage,
  });
  process.exitCode = 1;
});
