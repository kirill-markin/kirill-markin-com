import { NextResponse } from 'next/server';
import { DEFAULT_LANGUAGE, PATH_SEGMENTS, isValidLanguage } from '@/lib/localization';
import type { NextRequest } from 'next/server';

/** All known page names across all languages (articles, articulos, zhishi, services, etc.) */
const KNOWN_PAGE_NAMES: Set<string> = new Set(
    Object.values(PATH_SEGMENTS).flatMap(locales => Object.values(locales))
);
const PUBLIC_ASSET_PATH_PREFIXES: ReadonlyArray<string> = [
    '/api/',
    '/data/',
    '/articles/assets/',
    '/samo-danni-eood/',
];
const FILE_EXTENSION_PATTERN = /\/[^/]+\.[^/]+$/u;
const MARKDOWN_EXTENSION_PATTERN = /\.(?:md|txt)$/u;

const hasFileExtension = (pathname: string): boolean => {
    return FILE_EXTENSION_PATTERN.test(pathname);
};

const hasMarkdownExtension = (pathname: string): boolean => {
    return MARKDOWN_EXTENSION_PATTERN.test(pathname);
};

const isPublicAssetPath = (pathname: string): boolean => {
    return PUBLIC_ASSET_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const shouldBypassProxy = (pathname: string): boolean => {
    if (pathname === '/llms.txt' || pathname === '/robots.txt') {
        return true;
    }

    if (isPublicAssetPath(pathname)) {
        return true;
    }

    return hasFileExtension(pathname) && !hasMarkdownExtension(pathname);
};

const shouldAdvertiseMarkdown = (pathname: string): boolean => {
    return !shouldBypassProxy(pathname) && !hasFileExtension(pathname);
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.endsWith('.md/') || pathname.endsWith('.txt/')) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = pathname.replace(/\/+$/, '');
        return NextResponse.redirect(redirectUrl, 308);
    }

    if (shouldBypassProxy(pathname)) {
        return NextResponse.next();
    }

    // --- Markdown serving: .md / .txt extension ---
    if (pathname.endsWith('.md') || pathname.endsWith('.txt')) {
        const ext = pathname.endsWith('.md') ? '.md' : '.txt';
        const stripped = pathname.slice(1, -ext.length); // remove leading / and extension

        // For single-segment .txt paths (e.g. /something.txt), only rewrite known page names
        // to avoid intercepting IndexNow key files
        if (ext === '.txt') {
            const segments = stripped.split('/').filter(Boolean);
            const effectiveSegments = segments.length > 0 && isValidLanguage(segments[0])
                ? segments.slice(1)
                : segments;

            if (effectiveSegments.length === 1 && !KNOWN_PAGE_NAMES.has(effectiveSegments[0])) {
                return NextResponse.next();
            }
        }

        const rewriteUrl = request.nextUrl.clone();
        rewriteUrl.pathname = `/api/page-markdown/${stripped || 'home'}`;
        return NextResponse.rewrite(rewriteUrl);
    }

    // --- Markdown serving: Accept header ---
    const accept = request.headers.get('accept') || '';
    if (
        accept.includes('text/markdown') &&
        shouldAdvertiseMarkdown(pathname) &&
        !pathname.startsWith('/api/') &&
        !pathname.startsWith('/_next/')
    ) {
        const stripped = pathname.replace(/^\//, '').replace(/\/$/, '');
        const rewriteUrl = request.nextUrl.clone();
        rewriteUrl.pathname = `/api/page-markdown/${stripped || 'home'}`;
        return NextResponse.rewrite(rewriteUrl);
    }

    // --- Existing language extraction logic ---
    const pathParts = pathname.split('/').filter(Boolean);

    let lang = DEFAULT_LANGUAGE;

    if (pathParts.length > 0 && isValidLanguage(pathParts[0])) {
        lang = pathParts[0];
    }

    const response = NextResponse.next();
    response.headers.set('x-language', lang);
    response.headers.set('Vary', 'Accept');

    if (shouldAdvertiseMarkdown(pathname)) {
        // Advertise Markdown alternate via standard Link header
        const cleanPath = pathname.replace(/\/+$/, '');
        const mdPath = cleanPath === '' ? '/.md' : `${cleanPath}.md`;
        response.headers.set('Link', `<${mdPath}>; rel="alternate"; type="text/markdown"`);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (e.g. robots.txt)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|robots\\.txt).*)',
    ],
};
