import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { BigQuery } from "@google-cloud/bigquery";

const keyFileEnvironmentVariable = "KIRILL_MARKIN_BIGQUERY_KEY_FILE";
const projectIdEnvironmentVariable = "KIRILL_MARKIN_BIGQUERY_PROJECT_ID";
const locationEnvironmentVariable = "KIRILL_MARKIN_BIGQUERY_LOCATION";
const maximumBytesBilledEnvironmentVariable =
  "KIRILL_MARKIN_BIGQUERY_MAXIMUM_BYTES_BILLED";

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (value === undefined || value.length === 0) {
    throw new Error(`Required environment variable is missing: ${name}.`);
  }

  return value;
}

function parseMaximumBytesBilled(value: string): string {
  if (!/^[1-9]\d*$/.test(value)) {
    throw new Error(
      `${maximumBytesBilledEnvironmentVariable} must be a positive integer, received: ${value}.`,
    );
  }

  return value;
}

async function readQuery(): Promise<string> {
  const chunks: string[] = [];

  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) {
    if (typeof chunk !== "string") {
      throw new Error("BigQuery SQL input must be UTF-8 text.");
    }

    chunks.push(chunk);
  }

  const query = chunks.join("").trim();

  if (query.length === 0) {
    throw new Error("BigQuery SQL must be provided through standard input.");
  }

  return query;
}

async function main(): Promise<void> {
  const keyFilename = getRequiredEnvironmentVariable(
    keyFileEnvironmentVariable,
  );
  const projectId = getRequiredEnvironmentVariable(
    projectIdEnvironmentVariable,
  );
  const location = getRequiredEnvironmentVariable(locationEnvironmentVariable);
  const maximumBytesBilled = parseMaximumBytesBilled(
    getRequiredEnvironmentVariable(maximumBytesBilledEnvironmentVariable),
  );
  const query = await readQuery();

  await access(keyFilename, constants.R_OK);

  const bigQuery = new BigQuery({
    keyFilename,
    location,
    projectId,
    retryOptions: {
      autoRetry: true,
      maxRetries: 3,
    },
  });
  const [rows, job] = await bigQuery.query({
    labels: {
      source: "repository_cli",
    },
    location,
    maximumBytesBilled,
    query,
    useLegacySql: false,
  });

  process.stdout.write(`${JSON.stringify({
    jobId: job.id ?? null,
    location,
    projectId,
    rows,
  }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  process.stderr.write(`${JSON.stringify({
    error: message,
    event: "bigquery_query_failed",
    location: process.env[locationEnvironmentVariable] ?? null,
    projectId: process.env[projectIdEnvironmentVariable] ?? null,
  })}\n`);
  process.exitCode = 1;
});
