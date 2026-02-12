import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = 'personal-analytics-km';

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
