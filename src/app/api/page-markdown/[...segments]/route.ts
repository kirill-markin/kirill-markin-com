import { NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, PATH_SEGMENTS, isValidLanguage } from '@/lib/localization';
import { SITE_URL } from '@/data/contacts';
import {
  renderHomeMarkdown,
  renderArticlesListingMarkdown,
  renderArticleMarkdown,
  renderServicesListingMarkdown,
  renderMeetMarkdown,
  renderDashboardsBodyMarkdown,
  renderDashboardsListingMarkdown,
} from '@/lib/markdownServe';

const CACHE_HEADERS = {
  'Content-Type': 'text/markdown; charset=utf-8',
  'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
};

function markdownFooter(pagePath: string[], language: string): string {
  const langPrefix = language === DEFAULT_LANGUAGE ? '' : `/${language}`;
  const pathSuffix = pagePath.length > 0 ? `/${pagePath.join('/')}` : '';
  const originalUrl = `${SITE_URL}${langPrefix}${pathSuffix}`;
  return `\n\n---\n*[View the styled HTML version of this page](${originalUrl})*\n\n*Tip: Append \`.md\` to any URL on ${SITE_URL} to get a clean Markdown version of that page.*`;
}

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
  if (pathParts.length > 0 && isValidLanguage(pathParts[0])) {
    language = pathParts[0];
    pathParts = pathParts.slice(1);
  }

  // Route: home
  if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'home')) {
    const result = await renderHomeMarkdown(language);
    return new NextResponse(result.markdown + markdownFooter([], language), { status: result.status, headers: CACHE_HEADERS });
  }

  // Resolve the first segment to canonical name
  const canonical = resolveSegmentType(pathParts[0]);

  if (canonical === 'articles') {
    if (pathParts.length === 1) {
      const result = await renderArticlesListingMarkdown(language);
      return new NextResponse(result.markdown + markdownFooter([pathParts[0]], language), { status: result.status, headers: CACHE_HEADERS });
    }
    // pathParts[1] is the article slug
    const result = await renderArticleMarkdown(pathParts[1], language);
    return new NextResponse(result.markdown + markdownFooter([pathParts[0], pathParts[1]], language), { status: result.status, headers: CACHE_HEADERS });
  }

  if (canonical === 'services') {
    const result = await renderServicesListingMarkdown(language);
    return new NextResponse(result.markdown + markdownFooter([pathParts[0]], language), { status: result.status, headers: CACHE_HEADERS });
  }

  if (canonical === 'meet') {
    const result = await renderMeetMarkdown(language);
    return new NextResponse(result.markdown + markdownFooter([pathParts[0]], language), { status: result.status, headers: CACHE_HEADERS });
  }

  // Route: dashboards
  if (pathParts[0] === 'dashboards') {
    if (pathParts.length === 1) {
      const result = await renderDashboardsListingMarkdown();
      return new NextResponse(result.markdown + markdownFooter(['dashboards'], language), { status: result.status, headers: CACHE_HEADERS });
    }
    if (pathParts[1] === 'body') {
      const result = await renderDashboardsBodyMarkdown();
      return new NextResponse(result.markdown + markdownFooter(['dashboards', 'body'], language), { status: result.status, headers: CACHE_HEADERS });
    }
  }

  // 404 for unrecognized paths
  const notFound = `# 404\n\nPage not found: /${segments.join('/')}`;
  return new NextResponse(notFound, { status: 404, headers: CACHE_HEADERS });
}
