import { createHash } from "node:crypto";
import { lstat, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";
import {
  parseMediaManifest,
  validateMediaPublicPath,
  type MarketingMedia,
} from "../src/lib/marketingMedia";

export interface MediaFile {
  readonly data: Buffer;
  readonly extension: string;
  readonly contentType: string;
  readonly width?: number;
  readonly height?: number;
  readonly sha256: string;
}

const FORMATS: Readonly<Record<string, { extension: string; contentType: string }>> = {
  png: { extension: "png", contentType: "image/png" },
  jpeg: { extension: "jpg", contentType: "image/jpeg" },
  webp: { extension: "webp", contentType: "image/webp" },
  avif: { extension: "avif", contentType: "image/avif" },
  heif: { extension: "avif", contentType: "image/avif" },
  gif: { extension: "gif", contentType: "image/gif" },
  tiff: { extension: "tiff", contentType: "image/tiff" },
};

export function checksum(data: Uint8Array): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function inspectMedia(data: Buffer): Promise<MediaFile> {
  if (data.subarray(0, 5).toString("ascii") === "%PDF-") {
    return { data, extension: "pdf", contentType: "application/pdf", sha256: checksum(data) };
  }
  const metadata = await sharp(data).metadata();
  const format = metadata.format === undefined ? undefined : FORMATS[metadata.format];
  if (format === undefined || metadata.width === undefined || metadata.height === undefined
    || (metadata.format === "heif" && metadata.compression !== "av1")) {
    throw new Error("Unsupported raster image. Use PNG, JPEG, WebP, AVIF, GIF or TIFF.");
  }
  return {
    data, ...format,
    width: metadata.autoOrient.width,
    height: metadata.autoOrient.height,
    sha256: checksum(data),
  };
}

export async function prepareMedia(filePath: string): Promise<{
  readonly original: MediaFile;
  readonly delivery: MediaFile;
}> {
  const data = await readFile(filePath);
  const original = await inspectMedia(data);
  if (original.extension === "pdf") return { original, delivery: original };
  const metadata = await sharp(data).metadata();
  if (metadata.pages !== undefined && metadata.pages > 1) {
    throw new Error(`Animated or multipage input is not supported by media:add or media:replace: ${filePath}.`);
  }
  const optimized = await sharp(data).autoOrient().webp({ quality: 85, effort: 6 }).toBuffer();
  return { original, delivery: await inspectMedia(optimized) };
}

export function sourceChecksum(entry: MarketingMedia): string {
  return entry.original?.sha256 ?? entry.sha256;
}

export function assertAvailablePath(
  manifest: readonly MarketingMedia[],
  publicPath: string,
  sha256: string,
): MarketingMedia | undefined {
  const existing = manifest.find((entry) => entry.publicPath === publicPath);
  if (existing !== undefined && sourceChecksum(existing) !== sha256) {
    throw new Error(`Media already exists with different content: ${publicPath}. Choose a new path or use media:replace explicitly.`);
  }
  return existing;
}

export async function assertUnoccupiedLocalPath(publicRoot: string, publicPath: string): Promise<void> {
  const path = join(publicRoot, validateMediaPublicPath(publicPath));
  const existing = await lstat(path).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return undefined;
    throw error;
  });
  if (existing !== undefined) {
    throw new Error(`Local media already occupies ${publicPath}. Run npm run media:migrate before adding media at this path.`);
  }
}

export async function readMediaManifest(): Promise<readonly MarketingMedia[]> {
  return parseMediaManifest(JSON.parse(await readFile(resolve("src/content/media-manifest.json"), "utf8")));
}

export async function writeMediaManifest(manifest: readonly MarketingMedia[]): Promise<void> {
  const sorted = [...parseMediaManifest(manifest)].sort((a, b) =>
    a.publicPath < b.publicPath ? -1 : a.publicPath > b.publicPath ? 1 : 0);
  const path = resolve("src/content/media-manifest.json");
  const temporaryPath = `${path}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(sorted, null, 2)}\n`, { flag: "wx" });
  await rename(temporaryPath, path);
}

export async function listMediaFiles(directory: string): Promise<readonly string[]> {
  const files: string[] = [];
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listMediaFiles(path));
    else if (/\.(png|jpe?g|webp|avif|gif|tiff?|pdf)$/i.test(entry.name)) {
      if (!entry.isFile()) throw new Error(`Migration requires regular files: ${path}.`);
      files.push(path);
    }
  }
  return files.sort();
}
