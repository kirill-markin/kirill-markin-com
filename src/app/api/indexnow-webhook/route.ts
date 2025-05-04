import { NextResponse } from 'next/server';
import { filterAndSubmitChangedUrls } from '@/lib/indexnow';
import crypto from 'crypto';

// Vercel signature secret for security (stored in environment variables)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.VERCEL_SIGNATURE_SECRET;

export async function POST(request: Request) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (parseError) {
            console.error('Failed to parse request body as JSON');
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }

        // Verify Vercel signature
        const signature = request.headers.get('x-vercel-signature');

        if (!verifyVercelSignature(signature, rawBody)) {
            console.warn('Invalid webhook signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only process successful deployment events
        if (body.type === 'deployment.succeeded') {
            console.log('Processing successful deployment webhook');

            try {
                // Use the Git-based method to determine what changed
                const result = await filterAndSubmitChangedUrls();
                return NextResponse.json({ success: true, result });
            } catch (indexError) {
                console.error('Error in filterAndSubmitChangedUrls:', indexError);
                return NextResponse.json({
                    error: indexError instanceof Error ? indexError.message : 'Unknown error in processing'
                }, { status: 500 });
            }
        }

        return NextResponse.json({ message: 'Event ignored' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * Verifies the Vercel webhook signature
 */
function verifyVercelSignature(signature: string | null, rawBody: string): boolean {
    if (!signature || !WEBHOOK_SECRET) {
        console.warn('Missing signature or secret');
        return false;
    }

    try {
        // Create HMAC using the secret
        const hmac = crypto.createHmac('sha1', WEBHOOK_SECRET);
        hmac.update(rawBody);
        const computedSignature = hmac.digest('hex');

        // Vercel uses the raw hex digest without prefix
        return signature === computedSignature;
    } catch (error) {
        console.error('Error verifying signature');
        return false;
    }
} 