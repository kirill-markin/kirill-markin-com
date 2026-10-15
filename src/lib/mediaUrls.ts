import { marketingMediaManifest, type MarketingMedia } from './marketingMedia';

const mediaByPath = new Map(marketingMediaManifest.map((media) => [media.publicPath, media]));
const mediaByUrl = new Map(marketingMediaManifest.map((media) => [media.url, media]));

export function getMarketingMedia(source: string): MarketingMedia | undefined {
  const asset = mediaByPath.get(source) ?? mediaByUrl.get(source);
  if (asset || !source.startsWith('https://kirill-markin.com/')) return asset;
  return mediaByPath.get(new URL(source).pathname);
}

export function resolveMediaUrl(source: string): string {
  return getMarketingMedia(source)?.url ?? source;
}

export function absoluteMediaUrl(source: string): string {
  return new URL(resolveMediaUrl(source), 'https://kirill-markin.com/').href;
}

export function mediaImageMetadata(
  source: string, dimensions: { width: number; height: number },
): { url: string; width: number; height: number } {
  const media = getMarketingMedia(source);
  return {
    url: resolveMediaUrl(source),
    width: media?.width ?? dimensions.width,
    height: media?.height ?? dimensions.height,
  };
}
