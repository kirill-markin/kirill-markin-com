# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Development server with ESLint checks and Turbopack
- `npm run build` - Production build
- `npm run lint` - ESLint linting
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Validation & Quality Assurance
- `npm run validate-metadata` - Validate SEO metadata across all pages and articles
- `npx tsx scripts/test-cache-headers.ts` - Test cache headers for all pages in sitemap

### Analysis
- `npm run analyze` - Build with bundle analyzer enabled (ANALYZE=true)

## Project Architecture

### Core Framework
- **Next.js 15** with App Router
- **TypeScript** throughout
- **React 19** with Server Components
- **Tailwind CSS** for styling
- **CSS Modules** for component-specific styles

### Key Architectural Principles

#### 1. Static Generation First
- Pre-render all content at build time using `generateStaticParams`
- Minimize server-side computation at request time
- Use aggressive caching strategies (configured in next.config.ts)
- All routes and variations are pre-rendered for optimal performance

#### 2. Multilingual Architecture with Route Groups
The application uses Next.js Route Groups for sophisticated multilingual support:

- `app/(default)/` - English content with static routes (no language prefix)
- `app/(i18n)/[lang]/` - Dynamic language routes with localized segments

**Path Structure:**
- English: `/articles/`, `/services/`, `/meet/short/`
- Localized: `/es/articulos/`, `/zh/zixun/`, `/ar/mawid/majani/`

**Key Files:**
- `lib/localization.ts` - Path segment mapping and translations
- `(i18n)/[lang]/[segment]/page.tsx` - Dynamic segment resolution
- `(i18n)/[lang]/[segment]/[subsegment]/page.tsx` - Nested routes

#### 3. Server Components with Strategic Client Islands
- Server Components by default for performance
- Client Components only where interactivity is required
- Minimal JavaScript sent to browser

#### 4. Dynamic Params Handling (Next.js 15)
All params in dynamic routes are asynchronous:
```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
}
```

### Content Management

#### Articles
- Markdown files in `src/content/articles/`
- Translations in `src/content/articles/translations/[lang]/`
- Frontmatter metadata with bidirectional translation references
- SEO validation via `validate-metadata` script

#### Services
- Structured data in `src/data/` directory
- Category-based filtering system
- Pre-rendered category pages

#### Media Mentions
- Configured in `src/data/mediaMentions.ts`
- Thumbnail optimization with specific dimensions (520×297 for 16:9 ratio)
- Logo handling in `public/logos/`

### SEO & Performance

#### Metadata Generation
- Route-specific metadata via `generateMetadata()` functions
- Language-specific translations from `lib/localization.ts`
- No metadata reuse across languages - each generates unique content
- Comprehensive validation via `scripts/validate-metadata.ts`

#### Image Optimization
- WebP format preferred for photos
- SVG for icons and logos
- Specific dimensions for thumbnails (520×297) and service images (600×400)
- Next.js Image component with optimized loading

#### Caching Strategy
- Static pages with aggressive caching (86400s with stale-while-revalidate)
- CDN-optimized delivery
- Build-time pre-rendering for all routes

### Key Libraries & Dependencies

#### Content Processing
- `gray-matter` - Frontmatter parsing
- `remark` & `rehype` - Markdown processing
- `rehype-autolink-headings` & `rehype-slug` - Header linking
- `remark-gfm` - GitHub Flavored Markdown

#### Development Tools
- `eslint` with Next.js config
- `jest` with jsdom environment
- `ts-jest` for TypeScript testing
- `chalk` for colored CLI output

### Important Configuration Files

#### next.config.ts
- Image optimization settings with WebP/AVIF support
- Security headers (removes X-Powered-By)
- Cache control headers
- URL rewrites for IndexNow API integration
- Russian language redirects

#### Path Alias
- `@/*` maps to `./src/*` for clean imports

### Development Workflow

#### Code Quality
- ESLint runs automatically in dev mode
- TypeScript strict mode enabled
- Jest tests with coverage reporting
- Metadata validation before deployment

#### Static Generation
- All pages use `generateStaticParams` where applicable
- Sitemap generation with GitHub API integration for lastmod dates
- Robots.txt generation

#### Translation Workflow
- Structured translation process with key term discussion
- Bidirectional references between original and translated content
- Chinese translations get additional review with DeepSeek V3
- SEO-friendly URLs with target language keywords

### Environment Configuration

#### Required for Email Popup (Optional)
```bash
LEMLIST_API_KEY=your_lemlist_api_key
LEMLIST_SUBSCRIPTION_COMPANY_ID=your_company_id
```

#### Built-in Environment Variables
- `SITE_URL=https://kirill-markin.com/`
- `SITE_NAME=Kirill Markin`

### Special Features

#### IndexNow Integration
- Automatic search engine notification
- URL rewrite handling in next.config.ts
- API route in `app/api/indexnow/[key]/route.ts`

#### Analytics & Monitoring
- Vercel Speed Insights integration
- Google Tag Manager with automatic event forwarding to analytics systems
- Custom events via `trackGtmEvent()` from `src/lib/gtm.ts` → GTM auto-forwards all to connected systems
- Events buffered in `dataLayer` until GTM loads, no GTM config changes needed for new events

### Testing Strategy

#### Unit Testing
- Jest with jsdom environment
- Coverage reporting available
- SEO validation tests in `__tests__/lib/`

#### Metadata Validation
- Comprehensive metadata validation script
- Checks for missing titles/descriptions
- Validates SEO constraints (title 30-60 chars, description 120-155 chars)
- Duplicate content detection
- Translation reference validation

### Performance Considerations

#### Static Optimization
- All routes pre-rendered at build time
- Aggressive caching with stale-while-revalidate
- Image optimization with next/image
- Minimal client-side JavaScript

#### Bundle Optimization
- Tree shaking enabled
- Console.log removal in production
- Bundle analyzer available via `npm run analyze`

### Common Development Patterns

#### Creating New Pages
1. Add route in appropriate route group (`(default)` or `(i18n)`)
2. Update path mappings in `lib/localization.ts` if multilingual
3. Add `generateStaticParams` for dynamic routes
4. Create metadata generation function
5. Update sitemap generation if needed

#### Adding New Content
1. Create markdown file with proper frontmatter
2. Add translations with bidirectional references
3. Run `npm run validate-metadata` to check SEO compliance
4. Update related content links as needed

#### Image Handling
1. Optimize images with specific dimensions per use case
2. Use WebP format for photos, SVG for icons
3. Place in appropriate public directory
4. Use Next.js Image component for automatic optimization