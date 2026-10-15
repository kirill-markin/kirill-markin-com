import { execFile } from "node:child_process";
import { mkdir, open, readFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parseEnv, promisify } from "node:util";
import { setTimeout } from "node:timers/promises";
import { BlobNotFoundError, head, put } from "@vercel/blob";
import { parseMediaManifest, type MarketingMedia, type MarketingMediaAsset } from "../src/lib/marketingMedia";
import { checksum, type MediaFile } from "./mediaFiles";

async function loadMediaToken(): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN !== undefined) {
    if (!process.env.BLOB_READ_WRITE_TOKEN.trim()) {
      throw new Error("BLOB_READ_WRITE_TOKEN is present but empty.");
    }
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }
  const { stdout } = await promisify(execFile)("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"]);
  const path = join(dirname(stdout.trim()), ".env.media.local");
  const contents = await readFile(path, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") {
      throw new Error(`Missing media credentials: create ${path} with BLOB_READ_WRITE_TOKEN and permissions 0600. See docs/media.md.`);
    }
    throw error;
  });
  const values = parseEnv(contents);
  const token = values.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error(`Missing BLOB_READ_WRITE_TOKEN in ${path}. See docs/media.md.`);
  }
  return token;
}

async function withBlobRetry<T>(operation: () => Promise<T>, pathname: string): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof BlobNotFoundError || attempt === 3) throw error;
      process.stderr.write(`${JSON.stringify({ event: "media_blob_retry", pathname, attempt })}\n`);
      await setTimeout(attempt * 1000);
    }
  }
}

export async function uploadMedia(file: MediaFile, token: string): Promise<MarketingMediaAsset> {
  const pathname = `marketing/${file.sha256}.${file.extension}`;
  const result = await withBlobRetry(async () => {
    try {
      const existing = await head(pathname, { token });
      if (existing.size !== file.data.length || existing.contentType !== file.contentType) {
        throw new Error(`Blob metadata differs from local content: ${pathname}. Refusing to overwrite.`);
      }
      return existing;
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) throw error;
      return put(pathname, file.data, {
        token,
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: false,
        cacheControlMaxAge: 31536000,
        contentType: file.contentType,
      });
    }
  }, pathname);
  const asset = {
    url: result.url, width: file.width, height: file.height,
    sha256: file.sha256, bytes: file.data.length,
  };
  parseMediaManifest([{ publicPath: `/articles/verify.${file.extension}`, ...asset }]);
  await withBlobRetry(async () => {
    const response = await fetch(asset.url, { signal: AbortSignal.timeout(120000), redirect: "error" });
    if (!response.ok) {
      throw new Error(`Public media download failed: ${asset.url}; HTTP ${response.status}.`);
    }
    const downloaded = new Uint8Array(await response.arrayBuffer());
    if (downloaded.byteLength !== asset.bytes || checksum(downloaded) !== asset.sha256) {
      throw new Error(`Public Blob checksum mismatch: ${asset.url}. Refusing to record the manifest entry.`);
    }
  }, pathname);
  return asset;
}

export async function publishMedia(
  publicPath: string,
  original: MediaFile,
  delivery: MediaFile,
  token: string,
): Promise<MarketingMedia> {
  if (publicPath.toLowerCase().endsWith(".pdf") !== (delivery.extension === "pdf")) {
    throw new Error(`PDF public paths must deliver PDF bytes: ${publicPath}.`);
  }
  const originalAsset = await uploadMedia(original, token);
  const deliveryAsset = original.sha256 === delivery.sha256
    ? originalAsset : await uploadMedia(delivery, token);
  return {
    publicPath, ...deliveryAsset,
    ...(originalAsset.url === deliveryAsset.url ? {} : { original: originalAsset }),
  };
}

export function printMedia(entry: MarketingMedia): void {
  process.stdout.write(`${JSON.stringify(entry, null, 2)}\n`);
}

export async function runMediaCommand(command: (token: string) => Promise<void>): Promise<void> {
  let token: string | undefined;
  try {
    await mkdir(resolve(".generated"), { recursive: true });
    const lockPath = resolve(".generated/media-publishing.lock");
    const lock = await open(lockPath, "wx").catch((error: NodeJS.ErrnoException) => {
      if (error.code === "EEXIST") {
        throw new Error(`Another media command holds ${lockPath}. If that process has stopped, remove the stale lock and retry.`);
      }
      throw error;
    });
    try {
      token = await loadMediaToken();
      await command(token);
    } finally {
      await lock.close();
      await rm(lockPath);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${JSON.stringify({
      event: "media_publish_failed",
      error: token === undefined ? message : message.replaceAll(token, "[redacted]"),
    })}\n`);
    process.exitCode = 1;
  }
}
