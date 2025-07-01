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
        { key: indexnowKey },
        { key: `${indexnowKey}.txt` },
    ];
}

export async function GET(
    request: NextRequest,
    context: { params: { key: string } }
): Promise<NextResponse> {
    const { key } = context.params;
    const expectedKey = process.env.INDEXNOW_API_KEY;

    if (!expectedKey) {
        return NextResponse.json(
            { error: 'Not configured' },
            { status: 404 }
        );
    }

    // Удаляем расширение .txt из ключа для проверки
    const cleanKey = key.endsWith('.txt') ? key.slice(0, -4) : key;

    // Проверяем, соответствует ли ключ ожидаемому
    if (cleanKey !== expectedKey) {
        return NextResponse.json(
            { error: 'Not found' },
            { status: 404 }
        );
    }

    // Для запроса с .txt возвращаем содержимое файла
    if (key.endsWith('.txt')) {
        return new NextResponse(expectedKey, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800', // Cache for 1 day
            },
        });
    }

    // Для запроса без .txt перенаправляем на версию с .txt
    const url = new URL(request.url);
    return NextResponse.redirect(new URL(`/${expectedKey}.txt`, url.origin));
} 