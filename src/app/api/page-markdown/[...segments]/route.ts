import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, PATH_SEGMENTS } from '@/lib/localization';
import { SITE_URL } from '@/data/contacts';
import {
  renderHomeMarkdown,
  renderArticlesListingMarkdown,
  renderArticleMarkdown,
  renderServicesListingMarkdown,
  renderMeetMarkdown,
} from '@/lib/markdownServe';

const CACHE_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
};

const MARKDOWN_FOOTER = `\n\n---\n*Tip: Append \`.md\` to any URL on ${SITE_URL} to get a clean Markdown version of that page.*`;

/**
 * Resolve a localized path segment back to its canonical English name.
 * For example, 'articulos' -> 'articles', 'servicios' -> 'services'.
 */
function resolveSegmentType(segment: string): string | null {
  for (const [canonical, locales] of Object.entries(PATH_SEGMENTS)) {
    for (const localizedValue of Object.values(locales)) {
      if (localizedValue === segment) {
        return canonical;
      }
    }
  }
  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> }
): Promise<NextResponse> {
  const { segments } = await params;

  let language = DEFAULT_LANGUAGE;
  let pathParts = [...segments];

  // Detect language prefix
  if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
    language = pathParts[0];
    pathParts = pathParts.slice(1);
  }

  // Route: home
  if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'home')) {
    const result = await renderHomeMarkdown(language);
    return new NextResponse(result.markdown + MARKDOWN_FOOTER, { status: result.status, headers: CACHE_HEADERS });
  }

  // Resolve the first segment to canonical name
  const canonical = resolveSegmentType(pathParts[0]);

  if (canonical === 'articles') {
    if (pathParts.length === 1) {
      const result = await renderArticlesListingMarkdown(language);
      return new NextResponse(result.markdown + MARKDOWN_FOOTER, { status: result.status, headers: CACHE_HEADERS });
    }
    // pathParts[1] is the article slug
    const result = await renderArticleMarkdown(pathParts[1], language);
    return new NextResponse(result.markdown + MARKDOWN_FOOTER, { status: result.status, headers: CACHE_HEADERS });
  }

  if (canonical === 'services') {
    const result = await renderServicesListingMarkdown(language);
    return new NextResponse(result.markdown + MARKDOWN_FOOTER, { status: result.status, headers: CACHE_HEADERS });
  }

  if (canonical === 'meet') {
    const result = await renderMeetMarkdown(language);
    return new NextResponse(result.markdown + MARKDOWN_FOOTER, { status: result.status, headers: CACHE_HEADERS });
  }

  // 404 for unrecognized paths
  const notFound = `# 404\n\nPage not found: /${segments.join('/')}`;
  return new NextResponse(notFound, { status: 404, headers: CACHE_HEADERS });
}
