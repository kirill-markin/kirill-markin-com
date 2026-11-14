import { marketingMediaManifest } from './marketingMedia';

const cvPaths = new Set([
  '/data/cv-kirill-markin-cto.pdf',
  '/data/cv-kirill-markin-staff-software-engineer.pdf',
]);

const mediaRoutes = marketingMediaManifest.map((media) => ({
  source: media.publicPath,
  destination: (media.original ?? media).url,
}));

export const mediaRewrites = mediaRoutes.filter(({ source }) => cvPaths.has(source));

export const mediaRedirects = mediaRoutes
  .filter(({ source }) => !cvPaths.has(source))
  .map((route) => ({ ...route, permanent: false as const }));

export const mediaHeaders = marketingMediaManifest.map((media) => ({
  source: media.publicPath,
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
    ...(cvPaths.has(media.publicPath) ? [{ key: 'x-vercel-enable-rewrite-caching', value: '0' }] : []),
  ],
}));

export const mediaRemotePatterns = [...new Set(marketingMediaManifest.map((media) => new URL(media.url).hostname))]
  .map((hostname) => ({ protocol: 'https' as const, hostname, port: '', pathname: '/marketing/**', search: '' }));
