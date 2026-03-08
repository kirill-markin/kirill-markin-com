/**
 * BigQuery client for build-time data fetching.
 *
 * Used by dashboard pages to query curated public views at build time.
 * Data is baked into static HTML — no runtime queries.
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS_JSON env var (Vercel, production + preview)
 * with a service account key that has read access to the `public` dataset only.
 * The service account must NOT have access to `raw` or other private datasets.
 *
 * Daily redeploy (.github/workflows/daily-redeploy.yml) keeps data fresh.
 */
import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = 'personal-analytics-km';

export const hasBigQueryCredentials = (): boolean => (
  typeof process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON === 'string' &&
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON.length > 0
);

export const isVercelBuildEnvironment = (): boolean => (
  typeof process.env.VERCEL_ENV === 'string' && process.env.VERCEL_ENV.length > 0
);

const getCredentials = (): Record<string, string> => {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!raw) {
    throw new Error(
      'GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set. ' +
      'Set it to the JSON key of a service account with BigQuery Data Viewer on the public dataset.',
    );
  }

  return JSON.parse(raw) as Record<string, string>;
};

let instance: BigQuery | null = null;

export const getBigQueryClient = (): BigQuery => {
  if (instance !== null) {
    return instance;
  }

  instance = new BigQuery({
    projectId: PROJECT_ID,
    credentials: getCredentials(),
  });

  return instance;
};
