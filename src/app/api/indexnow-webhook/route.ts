import { NextResponse } from 'next/server';
import { filterAndSubmitChangedUrls } from '@/lib/indexnow';
import crypto from 'crypto';

// Vercel signature secret for security (stored in environment variables)
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || process.env.VERCEL_SIGNATURE_SECRET;

export async function POST(request: Request) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();

        console.log('Webhook received with body:', rawBody);

        let body;
        try {
            body = JSON.parse(rawBody);
            console.log('Successfully parsed JSON body:', body);
        } catch (parseError) {
            console.error('Failed to parse request body as JSON:', parseError);
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }

        // Verify Vercel signature
        const signature = request.headers.get('x-vercel-signature');
        console.log('Received signature:', signature);

        if (!verifyVercelSignature(signature, rawBody)) {
            console.warn('Invalid webhook signature');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only process successful deployment events
        if (body.type === 'deployment.succeeded') {
            console.warn('Processing successful deployment webhook');

            try {
                // Use the Git-based method to determine what changed
                const result = await filterAndSubmitChangedUrls();
                return NextResponse.json({ success: true, result });
            } catch (indexError) {
                console.error('Error in filterAndSubmitChangedUrls:', indexError);
                return NextResponse.json({
                    error: indexError instanceof Error ? indexError.message : 'Unknown error in processing',
                    stack: indexError instanceof Error ? indexError.stack : undefined
                }, { status: 500 });
            }
        }

        return NextResponse.json({ message: 'Event ignored' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

/**
 * Verifies the Vercel webhook signature
 */
function verifyVercelSignature(signature: string | null, rawBody: string): boolean {
    if (!signature || !WEBHOOK_SECRET) {
        console.warn('Missing signature or secret');
        console.log('Signature:', signature);
        console.log('Secret available:', !!WEBHOOK_SECRET);
        return false;
    }

    try {
        // Create HMAC using the secret
        const hmac = crypto.createHmac('sha1', WEBHOOK_SECRET);
        hmac.update(rawBody);
        const rawSignature = hmac.digest('hex');

        // Generate both signature formats for comparison
        const signatureWithPrefix = `sha1=${rawSignature}`;

        console.log('Computed raw signature:', rawSignature);
        console.log('Computed signature with prefix:', signatureWithPrefix);

        // Try both formats for maximum compatibility
        const matchesRaw = signature === rawSignature;
        const matchesWithPrefix = signature === signatureWithPrefix;

        console.log('Matches raw signature:', matchesRaw);
        console.log('Matches signature with prefix:', matchesWithPrefix);

        return matchesRaw || matchesWithPrefix;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
} 