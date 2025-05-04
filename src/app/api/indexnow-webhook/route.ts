import { NextResponse } from 'next/server';
import { filterAndSubmitUrls, DEFAULT_THRESHOLD_MINUTES } from '@/lib/indexnow';

// Webhook secret for security
const WEBHOOK_SECRET = process.env.INDEXNOW_WEBHOOK_SECRET;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Verify webhook secret
        const authHeader = request.headers.get('authorization');
        if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only process successful deployment events
        if (body.type === 'deployment.succeeded') {
            const result = await filterAndSubmitUrls(DEFAULT_THRESHOLD_MINUTES);
            return NextResponse.json({ success: true, result });
        }

        return NextResponse.json({ message: 'Event ignored' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
} 