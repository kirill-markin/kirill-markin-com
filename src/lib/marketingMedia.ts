import manifest from "../content/media-manifest.json";

export interface MarketingMediaAsset {
  readonly url: string;
  readonly width?: number;
  readonly height?: number;
  readonly sha256: string;
  readonly bytes: number;
}

export interface MarketingMedia extends MarketingMediaAsset {
  readonly publicPath: string;
  readonly original?: MarketingMediaAsset;
}

export const MEDIA_ROOTS = [
  "articles", "avatars", "services", "images", "data",
  "samo-danni-eood/google-play-developer",
] as const;

export function validateMediaPublicPath(value: string): string {
  if (!MEDIA_ROOTS.some((root) => value.startsWith(`/${root}/`))
    || !/^\/(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+\.(png|jpe?g|webp|avif|gif|tiff?|pdf)$/i.test(value)
    || value.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Invalid media public path: ${value}. Use a managed root and a raster or PDF filename. See docs/media.md.`);
  }
  return value;
}

function parseAsset(value: unknown, context: string): MarketingMediaAsset {
  if (typeof value !== "object" || value === null) {
    throw new Error(`Invalid media asset at ${context}: expected an object.`);
  }
  const { url, width, height, sha256, bytes } = value as Record<string, unknown>;
  if (typeof sha256 !== "string" || !/^[a-f0-9]{64}$/.test(sha256)
    || typeof url !== "string") {
    throw new Error(`Invalid media URL or SHA-256 at ${context}.`);
  }
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== "https:"
    || !/^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/.test(parsedUrl.hostname)
    || parsedUrl.port || parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash
    || !new RegExp(`^/marketing/${sha256}\\.(png|jpg|webp|avif|gif|tiff|pdf)$`).test(parsedUrl.pathname)) {
    throw new Error(`Invalid immutable public Blob URL at ${context}: ${url}.`);
  }
  if (typeof bytes !== "number" || !Number.isSafeInteger(bytes) || bytes <= 0) {
    throw new Error(`Invalid byte count at ${context}: expected a positive integer.`);
  }
  if (parsedUrl.pathname.endsWith(".pdf") && width === undefined && height === undefined) {
    return { url, sha256, bytes };
  }
  if (typeof width !== "number" || !Number.isSafeInteger(width) || width <= 0
    || typeof height !== "number" || !Number.isSafeInteger(height) || height <= 0) {
    throw new Error(`Invalid dimensions at ${context}: expected positive integers; only PDFs may omit dimensions.`);
  }
  return { url, width, height, sha256, bytes };
}

export function parseMediaManifest(value: unknown): readonly MarketingMedia[] {
  if (!Array.isArray(value)) {
    throw new Error("Invalid media manifest: expected an array.");
  }
  const paths = new Set<string>();
  return value.map((entry: unknown, index: number): MarketingMedia => {
    const asset = parseAsset(entry, `entry ${index}`);
    const { publicPath, original } = entry as Record<string, unknown>;
    if (typeof publicPath !== "string") {
      throw new Error(`Missing media publicPath at entry ${index}.`);
    }
    validateMediaPublicPath(publicPath);
    if (publicPath.toLowerCase().endsWith(".pdf") !== asset.url.endsWith(".pdf")) {
      throw new Error(`PDF public paths must deliver PDF bytes: ${publicPath}.`);
    }
    if (paths.has(publicPath)) {
      throw new Error(`Duplicate media public path: ${publicPath}.`);
    }
    paths.add(publicPath);
    if (original === undefined) return { publicPath, ...asset };
    const originalAsset = parseAsset(original, `${publicPath}.original`);
    if (originalAsset.url === asset.url) {
      throw new Error(`Redundant original media URL for ${publicPath}.`);
    }
    return { publicPath, ...asset, original: originalAsset };
  });
}

export const marketingMediaManifest = parseMediaManifest(manifest);

