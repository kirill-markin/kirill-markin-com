import { NextResponse } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/localization';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Extract language from the URL path
    const { pathname } = request.nextUrl;
    const pathParts = pathname.split('/').filter(Boolean);

    let lang = DEFAULT_LANGUAGE;

    // If the first part of the path is a supported language, use it
    if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
        lang = pathParts[0];
    }

    // Create a new response and add the language header
    const response = NextResponse.next();
    response.headers.set('x-language', lang);

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