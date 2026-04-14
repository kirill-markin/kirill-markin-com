# Configuration

## next.config.ts

- Image optimization (WebP/AVIF), cache headers, security headers
- IndexNow API rewrites, Russian redirects

## Environment (optional for email popup)

```bash
LEMLIST_API_KEY=your_lemlist_api_key
LEMLIST_SUBSCRIPTION_COMPANY_ID=your_company_id
```

## Environment (required for dashboards build)

```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON=<service account key JSON>
```

The service account only needs read access to public curated views — never to raw private data.
See [`src/lib/bigquery.ts`](../src/lib/bigquery.ts) for details.

Built-in: `SITE_URL=https://kirill-markin.com/`, `SITE_NAME=Kirill Markin`

## SEO & Performance

- Metadata via `generateMetadata()` per route, translations from `lib/localization.ts`, unique per language
- Sitemap emits article `lastmod` only from article frontmatter
- Server-side `lang` and `dir` attributes (RTL for Arabic)
- Images: WebP for photos, SVG for icons, specific dimensions (thumbnails 520x297, services 600x400)
- Validation: `npm run validate-metadata` checks titles (30-60 chars), descriptions (120-155 chars), duplicates

## Analytics & Events

- Direct integration with GA4 and Microsoft Clarity (no GTM dependency)
- Custom events via `trackEvent()` from `src/lib/analytics.ts`
- Events buffered in queues (`dataLayer` for GA4, `clarity.q` for Clarity) before scripts load
- Scripts load with `strategy="lazyOnload"` to not block page rendering
- Error tracking: Use Sentry (not analytics) for JS errors
- Configuration: Update `ANALYTICS_CONFIG` in `src/lib/analytics.ts` with GA4/Clarity IDs
