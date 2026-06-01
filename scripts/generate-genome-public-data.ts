/**
 * Fetches the public genome artifacts and writes build-local static files.
 *
 * Usage: npx tsx scripts/generate-genome-public-data.ts
 */
import { generateGenomePublicData } from '../src/lib/generateGenomePublicData';

const main = async (): Promise<void> => {
  const metadata = await generateGenomePublicData();

  console.log('genome_public_data_generated', {
    rawOutputPath: metadata.rawOutputPath,
    manifestOutputPath: metadata.manifestOutputPath,
    rawFileSizeBytes: metadata.rawFileSizeBytes,
    manifestFileSizeBytes: metadata.manifestFileSizeBytes,
    rawSha256: metadata.rawSha256,
  });
};

main().catch((error: unknown) => {
  const errorName = error instanceof Error ? error.name : typeof error;
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('genome_public_data_generation_failed', {
    errorName,
    errorMessage,
  });
  process.exitCode = 1;
});
