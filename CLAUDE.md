# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Development server with ESLint and Turbopack
- `npm run build` - Production build
- `npm run lint` - ESLint linting
- `npm test` / `npm run test:watch` / `npm run test:coverage` - Jest tests
- `npm run validate-metadata` - Validate SEO metadata across all pages
- `npx tsx scripts/test-cache-headers.ts` - Test cache headers
- `npm run analyze` - Build with bundle analyzer (ANALYZE=true)

## Tech Stack

- Next.js 15 with App Router, TypeScript, React 19 Server Components
- Tailwind CSS + CSS Modules
- Markdown processing: gray-matter, remark, rehype
- Testing: Jest + ts-jest
- Path alias: `@/*` → `./src/*`

## Architecture

### Static Generation First
- Pre-render all content at build time with `generateStaticParams`
- Aggressive caching (86400s with stale-while-revalidate in next.config.ts)
- Server Components by default, Client Components only where needed
- Zero server-side computation at request time

### Next.js 15: Async Params
```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}
```

### Multilingual Route Groups
- `app/(default)/` - English static routes: `/articles/`, `/services/`, `/meet/short/`
- `app/(i18n)/[lang]/` - Localized dynamic routes: `/es/articulos/`, `/zh/zixun/`, `/ar/mawid/majani/`
- Complex path mapping per language (articles → articulos → zhishi → maqalat → gyan)
- RTL support for Arabic via `dir="rtl"` in `(i18n)` layout

**Key Files:**
- `lib/localization.ts` - Path segment mapping and translations
- `(i18n)/[lang]/[segment]/page.tsx` - Dynamic segment resolution
- `(i18n)/[lang]/[segment]/[subsegment]/page.tsx` - Nested routes

**⚠️ Before modifying routes**: Check segment mappings in `localization.ts`

## Content Structure

- **Articles**: `src/content/articles/` + `translations/[lang]/` - Markdown with frontmatter, bidirectional translation refs
- **Services**: `src/data/servicesOther.ts` - Category-based filtering
- **Media**: `src/data/mediaMentions.ts` - Thumbnails 520×297 (16:9), logos in `public/logos/`

## SEO & Performance

- Metadata via `generateMetadata()` per route, translations from `lib/localization.ts`, unique per language
- Sitemap with GitHub API for lastmod dates (update `pageFilesMap` in `lib/fileModification.ts` for new pages)
- Images: WebP for photos, SVG for icons, specific dimensions (thumbnails 520×297, services 600×400)
- Validation: `npm run validate-metadata` checks titles (30-60 chars), descriptions (120-155 chars), duplicates

## Configuration

**next.config.ts:**
- Image optimization (WebP/AVIF), cache headers, security headers
- IndexNow API rewrites, Russian redirects

**Environment (optional for email popup):**
```bash
LEMLIST_API_KEY=your_lemlist_api_key
LEMLIST_SUBSCRIPTION_COMPANY_ID=your_company_id
```

Built-in: `SITE_URL=https://kirill-markin.com/`, `SITE_NAME=Kirill Markin`

## Analytics & Events

- Direct integration with GA4 and Microsoft Clarity (no GTM dependency)
- Custom events via `trackEvent()` from `src/lib/analytics.ts`
- Events buffered in queues (`dataLayer` for GA4, `clarity.q` for Clarity) before scripts load
- Scripts load with `strategy="lazyOnload"` to not block page rendering
- Error tracking: Use Sentry (not analytics) for JS errors
- Configuration: Update `ANALYTICS_CONFIG` in `src/lib/analytics.ts` with GA4/Clarity IDs

## Development Patterns

**New Pages:**
1. Add route in `(default)` or `(i18n)` group
2. Update `lib/localization.ts` if multilingual
3. Add `generateStaticParams` for dynamic routes
4. Create `generateMetadata()` function
5. Update `pageFilesMap` in `lib/fileModification.ts` for sitemap

**New Content:**
1. Create markdown with frontmatter
2. Add translations with bidirectional refs
3. Run `npm run validate-metadata`

**Translation Workflow:**
- Structured process with key term discussion
- Chinese translations reviewed with DeepSeek V3
- SEO-friendly URLs with target language keywords
