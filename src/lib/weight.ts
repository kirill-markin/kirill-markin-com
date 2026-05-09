/**
 * Weight-series data helpers.
 *
 * AWS is fetched only by the build-data script. Runtime rendering reads the
 * generated CSV artifact from public/data/ so markdown routes do not depend on
 * the external endpoint.
 */
import { readFileSync } from 'fs';
import { WEIGHT_CSV_HEADER, WEIGHT_CSV_OUTPUT_PATH } from '@/lib/generateWeightCsv';
import type { WeightPoint } from '@/types/weight';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue;
}

type IndexedWeightPoint = Readonly<{
  point: WeightPoint;
  index: number;
}>;

class WeightSeriesFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeightSeriesFetchError';
  }
}

class WeightSeriesValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeightSeriesValidationError';
  }
}

class WeightSeriesArtifactError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeightSeriesArtifactError';
  }
}

const WEIGHT_SERIES_URL = 'https://auto.kirill-markin.com/api/v1/public/personal-metrics/weight-series.json';
const WEIGHT_SERIES_FETCH_ATTEMPTS = 3;
const WEIGHT_SERIES_FETCH_TIMEOUT_MS = 10_000;
const WEIGHT_SERIES_RETRY_DELAY_MS = 1_000;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isJsonObject = (value: JsonValue): value is JsonObject => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
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

  return new Error(`${context}. errorType=${typeof error} errorMessage=${String(error)}`);
};

const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const parseIsoDate = (date: string, index: number, source: string): string => {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new WeightSeriesValidationError(
      `Invalid weight series date format. source=${source} index=${index} date=${date} expectedFormat=YYYY-MM-DD`,
    );
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    throw new WeightSeriesValidationError(
      `Invalid weight series calendar date. source=${source} index=${index} date=${date}`,
    );
  }

  return date;
};

const parseWeightKg = (weightKg: number, index: number, source: string): number => {
  if (!Number.isFinite(weightKg)) {
    throw new WeightSeriesValidationError(
      `Invalid weight series weight. source=${source} index=${index} weightKg=${weightKg}`,
    );
  }

  return weightKg;
};

const sortWeightSeries = (points: ReadonlyArray<WeightPoint>): ReadonlyArray<WeightPoint> => {
  const indexedPoints: ReadonlyArray<IndexedWeightPoint> = points.map((point, index) => ({
    point,
    index,
  }));

  return [...indexedPoints]
    .sort((left, right) => {
      const dateComparison = left.point.date.localeCompare(right.point.date);
      return dateComparison !== 0 ? dateComparison : left.index - right.index;
    })
    .map((indexedPoint) => indexedPoint.point);
};

const validateWeightSeriesLength = (points: ReadonlyArray<WeightPoint>, source: string): void => {
  if (points.length < 2) {
    throw new WeightSeriesValidationError(
      `Expected at least 2 weight entries. source=${source} count=${points.length}`,
    );
  }
};

const parseWeightPoint = (value: JsonValue, index: number, source: string): WeightPoint => {
  if (!isJsonObject(value)) {
    throw new WeightSeriesValidationError(
      `Weight series item must be an object. source=${source} index=${index}`,
    );
  }

  const date = value.date;
  const weightKg = value.weightKg;
  if (typeof date !== 'string' || typeof weightKg !== 'number') {
    throw new WeightSeriesValidationError(
      `Weight series item has invalid fields. source=${source} index=${index} dateType=${typeof date} weightKgType=${typeof weightKg}`,
    );
  }

  return {
    date: parseIsoDate(date, index, source),
    weightKg: parseWeightKg(weightKg, index, source),
  };
};

const parseWeightSeriesPayload = (payload: JsonValue, source: string): ReadonlyArray<WeightPoint> => {
  if (!isJsonObject(payload)) {
    throw new WeightSeriesValidationError(`Weight series response must be a JSON object. source=${source}`);
  }

  const series = payload.series;
  const rowCount = payload.rowCount;
  if (!Array.isArray(series) || typeof rowCount !== 'number' || !Number.isInteger(rowCount)) {
    throw new WeightSeriesValidationError(
      `Weight series response has invalid top-level fields. source=${source} hasSeriesArray=${Array.isArray(series)} rowCountType=${typeof rowCount} rowCount=${String(rowCount)}`,
    );
  }

  if (series.length !== rowCount) {
    throw new WeightSeriesValidationError(
      `Weight series rowCount mismatch. source=${source} rowCount=${rowCount} seriesLength=${series.length}`,
    );
  }

  const points = series.map((point, index) => parseWeightPoint(point, index, source));
  validateWeightSeriesLength(points, source);

  return sortWeightSeries(points);
};

const parseWeightSeriesJson = (responseBody: string, source: string): ReadonlyArray<WeightPoint> => {
  try {
    return parseWeightSeriesPayload(JSON.parse(responseBody) as JsonValue, source);
  } catch (error: unknown) {
    if (error instanceof WeightSeriesValidationError) {
      throw error;
    }

    throw new WeightSeriesValidationError(
      `Failed to parse weight series JSON. source=${source} body=${responseBody} errorName=${getErrorName(error)} errorMessage=${getErrorMessage(error)}`,
    );
  }
};

const fetchWeightSeriesBody = async (url: string, timeoutMs: number): Promise<string> => {
  const controller = new AbortController();
  const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    const responseBody = await response.text();

    if (!response.ok) {
      throw new WeightSeriesFetchError(
        `Failed to fetch AWS weight series. url=${url} status=${response.status} body=${responseBody}`,
      );
    }

    return responseBody;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new WeightSeriesFetchError(`Timed out fetching AWS weight series. url=${url} timeoutMs=${timeoutMs}`);
    }

    throw toError(error, `Failed to fetch AWS weight series. url=${url} timeoutMs=${timeoutMs}`);
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchWeightSeriesFromAws = async (): Promise<ReadonlyArray<WeightPoint>> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= WEIGHT_SERIES_FETCH_ATTEMPTS; attempt += 1) {
    try {
      const responseBody = await fetchWeightSeriesBody(WEIGHT_SERIES_URL, WEIGHT_SERIES_FETCH_TIMEOUT_MS);
      return parseWeightSeriesJson(responseBody, WEIGHT_SERIES_URL);
    } catch (error: unknown) {
      const normalizedError = toError(error, `Failed to fetch AWS weight series. url=${WEIGHT_SERIES_URL}`);
      lastError = normalizedError;

      if (attempt < WEIGHT_SERIES_FETCH_ATTEMPTS) {
        const retryDelayMs = WEIGHT_SERIES_RETRY_DELAY_MS * attempt;
        console.warn('weight_series_fetch_retry', {
          url: WEIGHT_SERIES_URL,
          attempt,
          maxAttempts: WEIGHT_SERIES_FETCH_ATTEMPTS,
          retryDelayMs,
          errorName: normalizedError.name,
          errorMessage: normalizedError.message,
        });
        await sleep(retryDelayMs);
      }
    }
  }

  if (lastError === null) {
    throw new WeightSeriesFetchError(
      `Failed to fetch AWS weight series. url=${WEIGHT_SERIES_URL} attempts=${WEIGHT_SERIES_FETCH_ATTEMPTS}`,
    );
  }

  throw lastError;
};

const parseWeightCsv = (csv: string, source: string): ReadonlyArray<WeightPoint> => {
  const lines = csv.trim().split(/\r?\n/u);
  const header = lines[0];

  if (header !== WEIGHT_CSV_HEADER) {
    throw new WeightSeriesValidationError(
      `Generated weight CSV has invalid header. source=${source} header=${String(header)} expectedHeader=${WEIGHT_CSV_HEADER}`,
    );
  }

  const points = lines.slice(1).map((line, index) => {
    const columns = line.split(',');
    if (columns.length !== 2) {
      throw new WeightSeriesValidationError(
        `Generated weight CSV row has invalid column count. source=${source} row=${index + 2} columnCount=${columns.length}`,
      );
    }

    const date = columns[0].trim();
    const rawWeightKg = columns[1].trim();
    const weightKg = Number(rawWeightKg);

    return {
      date: parseIsoDate(date, index, source),
      weightKg: parseWeightKg(weightKg, index, source),
    };
  });

  validateWeightSeriesLength(points, source);

  return sortWeightSeries(points);
};

export const getWeightSeries = async (): Promise<ReadonlyArray<WeightPoint>> => {
  try {
    return parseWeightCsv(readFileSync(WEIGHT_CSV_OUTPUT_PATH, 'utf-8'), WEIGHT_CSV_OUTPUT_PATH);
  } catch (error: unknown) {
    if (error instanceof WeightSeriesValidationError) {
      throw error;
    }

    throw new WeightSeriesArtifactError(
      `Generated weight CSV is unavailable. path=${WEIGHT_CSV_OUTPUT_PATH} runCommand="npm run generate-weight-data" errorName=${getErrorName(error)} errorMessage=${getErrorMessage(error)}`,
    );
  }
};
