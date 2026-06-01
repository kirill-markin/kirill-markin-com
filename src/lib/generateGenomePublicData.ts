/**
 * Generates public genome download artifacts at build time.
 * The raw file and rewritten manifest are written to public/data/ and served statically.
 */
import { createHash } from 'crypto';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { SITE_URL } from '@/data/contacts';
import {
  GENOME_MANIFEST_PUBLIC_PATH,
  GENOME_MANIFEST_SOURCE_URL,
  GENOME_RAW_PUBLIC_PATH,
  GENOME_RAW_SOURCE_URL,
} from '@/lib/genomeUrls';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue;
}

type GenomeManifest = Readonly<{
  datasetKey: string;
  source: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  importedAt: string;
  publicRawUrl: string;
}>;

type GenomePublicDataMetadata = Readonly<{
  rawOutputPath: string;
  manifestOutputPath: string;
  rawFileSizeBytes: number;
  manifestFileSizeBytes: number;
  rawSha256: string;
}>;

class GenomePublicDataFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenomePublicDataFetchError';
  }
}

class GenomePublicDataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenomePublicDataValidationError';
  }
}

const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 60_000;
const FETCH_RETRY_DELAY_MS = 1_000;
const ERROR_BODY_MAX_LENGTH = 2_000;
const SHA256_PATTERN = /^[0-9a-f]{64}$/u;

export const GENOME_RAW_OUTPUT_PATH = join(
  process.cwd(),
  'public',
  ...GENOME_RAW_PUBLIC_PATH.split('/').filter(Boolean),
);
export const GENOME_MANIFEST_OUTPUT_PATH = join(
  process.cwd(),
  'public',
  ...GENOME_MANIFEST_PUBLIC_PATH.split('/').filter(Boolean),
);

const getErrorName = (error: unknown): string => {
  return error instanceof Error ? error.name : typeof error;
};

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const toError = (error: unknown, context: string): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new GenomePublicDataFetchError(`${context}. errorType=${typeof error} errorMessage=${String(error)}`);
};

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const isJsonObject = (value: JsonValue): value is JsonObject => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getStringField = (object: JsonObject, fieldName: string, source: string): string => {
  const value = object[fieldName];

  if (typeof value !== 'string') {
    throw new GenomePublicDataValidationError(
      `Genome manifest field must be a string. source=${source} field=${fieldName} valueType=${typeof value}`,
    );
  }

  return value;
};

const getIntegerField = (object: JsonObject, fieldName: string, source: string): number => {
  const value = object[fieldName];

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new GenomePublicDataValidationError(
      `Genome manifest field must be an integer. source=${source} field=${fieldName} value=${String(value)} valueType=${typeof value}`,
    );
  }

  return value;
};

const parseGenomeManifestPayload = (payload: JsonValue, source: string): GenomeManifest => {
  if (!isJsonObject(payload)) {
    throw new GenomePublicDataValidationError(`Genome manifest response must be a JSON object. source=${source}`);
  }

  const manifest: GenomeManifest = {
    datasetKey: getStringField(payload, 'datasetKey', source),
    source: getStringField(payload, 'source', source),
    fileName: getStringField(payload, 'fileName', source),
    contentType: getStringField(payload, 'contentType', source),
    sizeBytes: getIntegerField(payload, 'sizeBytes', source),
    sha256: getStringField(payload, 'sha256', source),
    importedAt: getStringField(payload, 'importedAt', source),
    publicRawUrl: getStringField(payload, 'publicRawUrl', source),
  };

  if (manifest.sizeBytes <= 0) {
    throw new GenomePublicDataValidationError(
      `Genome manifest sizeBytes must be positive. source=${source} sizeBytes=${manifest.sizeBytes}`,
    );
  }

  if (!SHA256_PATTERN.test(manifest.sha256)) {
    throw new GenomePublicDataValidationError(
      `Genome manifest sha256 is invalid. source=${source} sha256=${manifest.sha256}`,
    );
  }

  return manifest;
};

const parseGenomeManifestJson = (responseBody: Buffer, source: string): GenomeManifest => {
  const responseText = responseBody.toString('utf-8');

  try {
    return parseGenomeManifestPayload(JSON.parse(responseText) as JsonValue, source);
  } catch (error: unknown) {
    if (error instanceof GenomePublicDataValidationError) {
      throw error;
    }

    throw new GenomePublicDataValidationError(
      `Failed to parse genome manifest JSON. source=${source} body=${responseText} errorName=${getErrorName(error)} errorMessage=${getErrorMessage(error)}`,
    );
  }
};

const fetchBody = async (url: string, accept: string, timeoutMs: number): Promise<Buffer> => {
  const controller = new AbortController();
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept,
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      const responseBody = (await response.text()).slice(0, ERROR_BODY_MAX_LENGTH);
      throw new GenomePublicDataFetchError(
        `Failed to fetch genome public data. url=${url} status=${response.status} statusText=${response.statusText} body=${responseBody}`,
      );
    }

    return Buffer.from(await response.arrayBuffer());
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new GenomePublicDataFetchError(`Timed out fetching genome public data. url=${url} timeoutMs=${timeoutMs}`);
    }

    throw toError(error, `Failed to fetch genome public data. url=${url} timeoutMs=${timeoutMs}`);
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchBodyWithRetries = async (url: string, accept: string): Promise<Buffer> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt += 1) {
    try {
      return await fetchBody(url, accept, FETCH_TIMEOUT_MS);
    } catch (error: unknown) {
      const normalizedError = toError(error, `Failed to fetch genome public data. url=${url}`);
      lastError = normalizedError;

      if (attempt < FETCH_ATTEMPTS) {
        const retryDelayMs = FETCH_RETRY_DELAY_MS * attempt;
        console.warn('genome_public_data_fetch_retry', {
          url,
          attempt,
          maxAttempts: FETCH_ATTEMPTS,
          retryDelayMs,
          errorName: normalizedError.name,
          errorMessage: normalizedError.message,
        });
        await sleep(retryDelayMs);
      }
    }
  }

  if (lastError === null) {
    throw new GenomePublicDataFetchError(
      `Failed to fetch genome public data. url=${url} attempts=${FETCH_ATTEMPTS}`,
    );
  }

  throw lastError;
};

const getSha256 = (buffer: Buffer): string => {
  return createHash('sha256').update(buffer).digest('hex');
};

const validateRawGenome = (rawGenome: Buffer, manifest: GenomeManifest): string => {
  if (rawGenome.byteLength !== manifest.sizeBytes) {
    throw new GenomePublicDataValidationError(
      `Genome raw file size mismatch. url=${GENOME_RAW_SOURCE_URL} actualBytes=${rawGenome.byteLength} expectedBytes=${manifest.sizeBytes}`,
    );
  }

  const sha256 = getSha256(rawGenome);
  if (sha256 !== manifest.sha256) {
    throw new GenomePublicDataValidationError(
      `Genome raw file sha256 mismatch. url=${GENOME_RAW_SOURCE_URL} actualSha256=${sha256} expectedSha256=${manifest.sha256}`,
    );
  }

  return sha256;
};

const rewriteManifest = (manifest: GenomeManifest): GenomeManifest => {
  return {
    ...manifest,
    publicRawUrl: `${SITE_URL}${GENOME_RAW_PUBLIC_PATH}`,
  };
};

const serializeManifest = (manifest: GenomeManifest): string => {
  return `${JSON.stringify(manifest, null, 2)}\n`;
};

export const generateGenomePublicData = async (): Promise<GenomePublicDataMetadata> => {
  const manifestBody = await fetchBodyWithRetries(GENOME_MANIFEST_SOURCE_URL, 'application/json');
  const manifest = parseGenomeManifestJson(manifestBody, GENOME_MANIFEST_SOURCE_URL);
  const rawGenome = await fetchBodyWithRetries(GENOME_RAW_SOURCE_URL, manifest.contentType);
  const rawSha256 = validateRawGenome(rawGenome, manifest);
  const rewrittenManifest = serializeManifest(rewriteManifest(manifest));

  mkdirSync(dirname(GENOME_RAW_OUTPUT_PATH), { recursive: true });
  writeFileSync(GENOME_RAW_OUTPUT_PATH, rawGenome);
  writeFileSync(GENOME_MANIFEST_OUTPUT_PATH, rewrittenManifest, 'utf-8');

  return {
    rawOutputPath: GENOME_RAW_OUTPUT_PATH,
    manifestOutputPath: GENOME_MANIFEST_OUTPUT_PATH,
    rawFileSizeBytes: rawGenome.byteLength,
    manifestFileSizeBytes: Buffer.byteLength(rewrittenManifest, 'utf-8'),
    rawSha256,
  };
};
