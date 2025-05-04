import { NextResponse } from 'next/server';
import { filterAndSubmitChangedUrls } from '@/lib/indexnow';
import crypto from 'crypto';

// Vercel signature secret for security (stored in environment variables)
const VERCEL_SIGNATURE_SECRET = process.env.VERCEL_SIGNATURE_SECRET;

export async function POST(request: Request) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();
        const body = JSON.parse(rawBody);

        // Verify Vercel signature
        const signature = request.headers.get('x-vercel-signature');
        if (!verifyVercelSignature(signature, rawBody)) {
            console.warn('Invalid webhook signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only process successful deployment events
        if (body.type === 'deployment.succeeded') {
            console.warn('Processing successful deployment webhook');

            // Use the Git-based method to determine what changed
            const result = await filterAndSubmitChangedUrls();
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

/**
 * Verifies the Vercel webhook signature
 */
function verifyVercelSignature(signature: string | null, rawBody: string): boolean {
    if (!signature || !VERCEL_SIGNATURE_SECRET) {
        console.warn('Missing signature or secret');
        return false;
    }

    try {
        // Create HMAC using the secret
        const hmac = crypto.createHmac('sha1', VERCEL_SIGNATURE_SECRET);
        hmac.update(rawBody);
        const computedSignature = `sha1=${hmac.digest('hex')}`;

        // Use constant time comparison to prevent timing attacks
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(computedSignature)
        );
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
} 