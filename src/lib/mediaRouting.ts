import { marketingMediaManifest } from './marketingMedia';

export const mediaRedirects = marketingMediaManifest.map((media) => ({
  source: media.publicPath,
  destination: (media.original ?? media).url,
  permanent: false as const,
}));

export const mediaHeaders = marketingMediaManifest.map((media) => ({
  source: media.publicPath,
  headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
}));

export const mediaRemotePatterns = [...new Set(marketingMediaManifest.map((media) => new URL(media.url).hostname))]
  .map((hostname) => ({ protocol: 'https' as const, hostname, port: '', pathname: '/marketing/**', search: '' }));
