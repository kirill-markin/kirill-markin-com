import { NextRequest, NextResponse } from 'next/server';
import { EMAIL_REGEX, EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH } from '@/lib/popupConstants';

// CORS configuration
function getCorsHeaders(origin: string | null): Record<string, string> {
    const allowedOrigins = process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'https://kirill-markin.com', 'https://www.kirill-markin.com']
        : ['https://kirill-markin.com', 'https://www.kirill-markin.com'];

    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    return {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
    };
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
        // Reset or create new record
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return false;
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return true;
    }

    record.count++;
    return false;
}

function validateEmail(email: string): boolean {
    const trimmedEmail = email.trim();
    return (
        trimmedEmail.length >= EMAIL_MIN_LENGTH &&
        trimmedEmail.length <= EMAIL_MAX_LENGTH &&
        EMAIL_REGEX.test(trimmedEmail)
    );
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            // Calculate delay with exponential backoff + jitter
            const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
            console.warn(`🔄 Retry attempt ${attempt + 1}/${maxRetries + 1} after ${Math.round(delay)}ms:`, {
                error: lastError.message,
                attempt: attempt + 1,
                nextDelay: Math.round(delay)
            });

            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError!;
}

async function addToLemlist(email: string, metadata: Record<string, string>): Promise<void> {
    const apiKey = process.env.LEMLIST_API_KEY;
    const campaignId = process.env.LEMLIST_SUBSCRIPTION_COMPANY_ID;

    if (!apiKey || !campaignId) {
        const missingVars = [];
        if (!apiKey) missingVars.push('LEMLIST_API_KEY');
        if (!campaignId) missingVars.push('LEMLIST_SUBSCRIPTION_COMPANY_ID');

        throw new Error(`Lemlist integration not configured. Missing environment variables: ${missingVars.join(', ')}`);
    }

    // Use Campaign API endpoint to add lead directly to campaign
    const lemlistData = {
        source: 'website_subscriptions',
        pageUrl: metadata.pageUrl || '',
        subscriptionDate: new Date().toISOString(),
        userAgent: metadata.userAgent || '',
        referrer: metadata.referrer || ''
    };

    // Retry the Lemlist API call with exponential backoff
    await retryWithBackoff(async () => {
        const campaignUrl = `https://api.lemlist.com/api/campaigns/${campaignId}/leads/${encodeURIComponent(email)}?deduplicate=true`;

        const response = await fetch(campaignUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`:${apiKey}`).toString('base64')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lemlistData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Lemlist API error: ${response.status} - ${errorText}`);

            // Special case: Lead already in campaign is considered success
            if (response.status === 400 && errorText.includes('Lead already in the campaign')) {
                console.warn('✅ Lead already in campaign - treating as success:', {
                    status: response.status,
                    message: 'Lead already subscribed'
                });
                return { _id: 'existing', campaignName: 'existing', status: 'already_subscribed' };
            }

            // Don't retry client errors (4xx), only server errors (5xx) and network issues
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Lemlist API client error: ${response.status} - ${errorText}`);
            }

            throw new Error(`Lemlist API server error: ${response.status} - ${errorText}`);
        }

        // Parse JSON response (Campaign API should return lead data)
        const result = await response.json();

        // Log success without sensitive data
        console.warn('✅ Lead successfully added to campaign:', {
            status: response.status,
            campaignName: result.campaignName,
            leadId: result._id,
        });

        return result;
    }, 3, 1000); // 3 retries, starting with 1 second delay
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    try {
        // Get client IP for rate limiting
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

        // Check rate limiting
        if (isRateLimited(ip)) {
            console.warn(`Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429, headers: corsHeaders }
            );
        }

        // Parse request body
        const { email } = await request.json();

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Prepare metadata
        const metadata = {
            pageUrl: request.headers.get('referer') || '',
            userAgent: request.headers.get('user-agent') || '',
            referrer: request.headers.get('referer') || ''
        };

        // Add to Lemlist
        await addToLemlist(email.trim(), metadata);

        console.warn('Email subscription successful:', {
            domain: email.split('@')[1],
            pageUrl: metadata.pageUrl
        });

        return NextResponse.json({ success: true }, { headers: corsHeaders });

    } catch (error) {
        console.error('Subscription error:', error);

        // Check if this is a configuration error
        if (error instanceof Error && error.message.includes('Lemlist integration not configured')) {
            return NextResponse.json(
                { error: 'Email subscription service is temporarily unavailable.' },
                { status: 503, headers: corsHeaders }
            );
        }

        // Return generic error to client for security
        return NextResponse.json(
            { error: 'Subscription failed. Please try again.' },
            { status: 500, headers: corsHeaders }
        );
    }
}

// Handle preflight OPTIONS request
export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    });
}

// Handle other HTTP methods
export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
}

export async function PUT(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
}

export async function DELETE(request: NextRequest) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
} 