# AGENTS.md

Guidance for working with this repository.

Modern personal website built with Next.js 15, migrated from Jekyll for performance.

**Git Workflow**: commit directly to `main`; deploy is automatic after push.

## Development Commands

- `npm run dev`: development server with ESLint and Turbopack
- `npm run build`: production build
- `npm run lint`: ESLint
- `npm run validate-metadata`: validate SEO metadata across all pages
- `npx tsx scripts/test-cache-headers.ts`: test cache headers
- `npm run analyze`: build with bundle analyzer (`ANALYZE=true`)

## Stack

- Next.js 15 App Router, TypeScript, React 19 Server Components
- Tailwind CSS + CSS Modules
- Markdown via `gray-matter`, `remark`, `rehype`
- Path alias: `@/*` -> `./src/*`

## Core Principles

- Static generation first: pre-render content with `generateStaticParams`, keep aggressive caching (`86400` with `stale-while-revalidate` in `next.config.ts`), and avoid request-time server computation except for rare dynamic pages.
- Server Components first: use client components only where interactivity is required and keep browser JavaScript minimal.

## Project Structure

- `src/app/(default)/`: English static routes such as `/articles/`, `/services/`, `/meet/`, `/pay/`, `/dashboards/`
- `src/app/(i18n)/[lang]/`: localized dynamic routes
- `src/components/`: UI components
- `src/components/charts/`: client-side D3 chart components
- `src/content/articles/`: markdown articles plus `translations/[lang]/`
- `src/data/`: structured data (`services`, `media`)
- `src/lib/`: utilities including `localization.ts`, `bigquery.ts`, `weight.ts`
- `src/types/`: TypeScript types

## Multilingual Architecture

- In Next.js 15, route `params` are async: type them as `Promise<...>` and `await` them inside the page.
- Route groups:
  - `app/(default)/` for English static routes such as `/articles/`, `/services/`, `/meet/short/`
  - `app/(i18n)/[lang]/` for localized dynamic routes such as `/es/articulos/`, `/zh/zixun/`, `/ar/mawid/majani/`
- Arabic uses RTL via `dir="rtl"` in the `(i18n)` layout.
- Path mapping keeps logical routes aligned across languages:
  - `articles -> articulos -> zhishi -> maqalat -> gyan`
  - `services -> servicios -> zixun -> khadamat -> sevaen`
  - `meet/short -> reservar/breve -> yuyue/mianfei -> mawid/majani`
- Do not change existing localized route segments or URL slugs unless the user explicitly requests it; changing them can hurt SEO and break already indexed URLs.
- Key files:
  - `lib/localization.ts`: path segment mapping and translations
  - `(i18n)/[lang]/[segment]/page.tsx`: dynamic segment resolution
  - `(i18n)/[lang]/[segment]/[subsegment]/page.tsx`: nested routes
  - `(default)/*/page.tsx`: static English routes
- Before changing routes, check segment mappings in `localization.ts`.

## Content Structure

- Articles: `src/content/articles/` plus `translations/[lang]/`; markdown with frontmatter and bidirectional translation references
- Services: `src/data/servicesOther.ts`; category-based filtering
- Media: `src/data/mediaMentions.ts`; thumbnails are `520x297` (`16:9`), logos live in `public/logos/`
- Languages: `en`, `es`, `zh`, `ar`, `hi`; routes are pre-generated with `generateStaticParams`

## Development Patterns

- New pages:
  1. add the route in `(default)` or `(i18n)`
  2. update `lib/localization.ts` if the page is multilingual
  3. add `generateStaticParams` for dynamic routes
  4. implement `generateMetadata()`
- New content:
  1. create markdown with frontmatter
  2. add translations with bidirectional refs
  3. run `npm run validate-metadata`
- Before committing, run `npm run lint`, `npm run build`, and `npm run validate-metadata` and fix failures.
- Best practices: default to Server Components, use CSS Modules for styling, and keep article `lastmod` explicit in frontmatter when content is materially updated.
- Translation workflow: use a structured process with key-term discussion; Chinese translations are reviewed with DeepSeek V3; keep URLs SEO-friendly in the target language.

## Dashboards

Pages under `/dashboards/` render personal metrics as D3 charts. Data is fetched from BigQuery at build time and baked into static HTML. A daily GitHub Actions cron plus a Vercel Deploy Hook keeps the data fresh. See `src/lib/bigquery.ts` and `src/lib/weight.ts`.

## Reference

- [docs/writing-style.md](docs/writing-style.md) - writing style guide
- [docs/configuration.md](docs/configuration.md) - env vars, SEO, analytics, `next.config`
