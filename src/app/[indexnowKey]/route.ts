import { NextRequest, NextResponse } from 'next/server';

// This instructs Next.js to generate this route statically
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate

// Function for pre-generating static routes
export async function generateStaticParams() {
    const indexnowKey = process.env.INDEXNOW_API_KEY;

    if (!indexnowKey) {
        return [];
    }

    return [
        { indexnowKey },
        { indexnowKey: `${indexnowKey}.txt` }
    ];
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ indexnowKey: string }> }
): Promise<NextResponse> {
    // В Next.js 15 параметры являются асинхронными и требуют await
    const { indexnowKey } = await context.params;
    const expectedKey = process.env.INDEXNOW_API_KEY;

    // Check if the file is requested with the correct key name
    if (!expectedKey || !indexnowKey.startsWith(expectedKey)) {
        // If the key doesn't match the expected one, return 404
        return NextResponse.json(
            { error: 'Not found' },
            { status: 404 }
        );
    }

    // If the key matches and this is a request for the .txt file
    if (indexnowKey === `${expectedKey}.txt`) {
        // Correct format for IndexNow key file - the key itself in the file content
        return new NextResponse(expectedKey, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', // Cache for 1 day
            },
        });
    }

    // If the request is for the key without .txt extension - redirect to the version with .txt
    if (indexnowKey === expectedKey) {
        return NextResponse.redirect(new URL(`/${expectedKey}.txt`, request.url));
    }

    // For other requests that start with the key but don't match exactly
    return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
    );
} 