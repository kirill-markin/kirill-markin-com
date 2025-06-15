#!/usr/bin/env npx tsx

import https from 'https';
import http from 'http';
import { parse } from 'url';
import xml2js from 'xml2js';

interface SitemapUrl {
    loc: string[];
    lastmod?: string[];
    changefreq?: string[];
    priority?: string[];
}

interface SitemapData {
    urlset: {
        url: SitemapUrl[];
    };
}

interface CacheTestResult {
    url: string;
    firstRequest: {
        status: number;
        cacheControl: string | undefined;
        vercelCache: string | undefined;
    };
    secondRequest: {
        status: number;
        cacheControl: string | undefined;
        vercelCache: string | undefined;
    };
    isProperlyCached: boolean;
    error?: string;
}

/**
 * Fetch a URL and return response headers
 */
function fetchHeaders(url: string): Promise<{ status: number; headers: Record<string, string> }> {
    return new Promise((resolve, reject) => {
        const parsedUrl = parse(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.path,
            method: 'HEAD', // Only fetch headers, not body
            timeout: 10000, // 10 second timeout
        };

        const req = client.request(options, (res) => {
            resolve({
                status: res.statusCode || 0,
                headers: Object.fromEntries(
                    Object.entries(res.headers).map(([key, value]) => [
                        key.toLowerCase(),
                        Array.isArray(value) ? value.join(', ') : (value || '')
                    ])
                )
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Request failed: ${err.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Check if cache headers indicate static cached content
 */
function isStaticCached(cacheControl: string | undefined, vercelCache: string | undefined): boolean {
    if (!cacheControl) return false;

    const cc = cacheControl.toLowerCase();

    // Bad cache control headers that indicate dynamic content
    if (cc.includes('private') || cc.includes('no-cache') || cc.includes('no-store')) {
        return false;
    }

    // Good cache control headers - our configured headers
    const hasPublic = cc.includes('public');
    const hasSMaxAge = cc.includes('s-maxage');
    const hasStaleWhileRevalidate = cc.includes('stale-while-revalidate');

    // Check Vercel cache status - these indicate successful caching/prerendering
    const isVercelCached = vercelCache === 'HIT' ||
        vercelCache === 'PRERENDER' ||
        vercelCache === 'STALE';

    return hasPublic && hasSMaxAge && hasStaleWhileRevalidate && isVercelCached;
}

/**
 * Check if caching is working properly (considers warmup scenario)
 */
function isCacheWorkingProperly(
    firstRequest: { cacheControl: string | undefined; vercelCache: string | undefined; },
    secondRequest: { cacheControl: string | undefined; vercelCache: string | undefined; }
): boolean {
    // Check if we have proper cache headers
    const firstHasGoodHeaders = firstRequest.cacheControl &&
        firstRequest.cacheControl.includes('public') &&
        firstRequest.cacheControl.includes('s-maxage');

    const secondHasGoodHeaders = secondRequest.cacheControl &&
        secondRequest.cacheControl.includes('public') &&
        secondRequest.cacheControl.includes('s-maxage');

    // At least one should have good headers
    if (!firstHasGoodHeaders && !secondHasGoodHeaders) {
        return false;
    }

    // First request can be PRERENDER (static), MISS (cache miss), or HIT (already cached)
    const firstIsValid = firstRequest.vercelCache === 'PRERENDER' ||
        firstRequest.vercelCache === 'MISS' ||
        firstRequest.vercelCache === 'HIT';

    // Second request should be cached (HIT or PRERENDER)
    const secondIsCached = secondRequest.vercelCache === 'HIT' ||
        secondRequest.vercelCache === 'PRERENDER';

    return firstIsValid && secondIsCached;
}

/**
 * Fetch and parse sitemap XML
 */
async function fetchSitemap(sitemapUrl: string): Promise<string[]> {
    try {
        console.log(`Fetching sitemap from: ${sitemapUrl}`);

        const response = await new Promise<{ data: string; status: number }>((resolve, reject) => {
            const parsedUrl = parse(sitemapUrl);
            const isHttps = parsedUrl.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (isHttps ? 443 : 80),
                path: parsedUrl.path,
                method: 'GET',
                timeout: 10000,
            };

            const req = client.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({ data, status: res.statusCode || 0 });
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Sitemap request timeout'));
            });

            req.end();
        });

        if (response.status !== 200) {
            throw new Error(`Sitemap fetch failed with status: ${response.status}`);
        }

        // Parse XML
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data) as SitemapData;

        // Extract URLs
        const urls = result.urlset.url.map(urlEntry => urlEntry.loc[0]);
        console.log(`Found ${urls.length} URLs in sitemap`);

        return urls;
    } catch (error) {
        console.error('Error fetching sitemap:', error);
        throw error;
    }
}

/**
 * Test cache headers for a single URL with cache warmup
 */
async function testUrl(url: string): Promise<CacheTestResult> {
    try {
        // First request - cache warmup
        const firstRequest = await fetchHeaders(url);

        // Small delay to allow cache to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        // Second request - should be cached
        const secondRequest = await fetchHeaders(url);

        const firstCacheControl = firstRequest.headers['cache-control'];
        const firstVercelCache = firstRequest.headers['x-vercel-cache'];
        const secondCacheControl = secondRequest.headers['cache-control'];
        const secondVercelCache = secondRequest.headers['x-vercel-cache'];

        const isProperlyCached = isCacheWorkingProperly(
            { cacheControl: firstCacheControl, vercelCache: firstVercelCache },
            { cacheControl: secondCacheControl, vercelCache: secondVercelCache }
        );

        return {
            url,
            firstRequest: {
                status: firstRequest.status,
                cacheControl: firstCacheControl,
                vercelCache: firstVercelCache,
            },
            secondRequest: {
                status: secondRequest.status,
                cacheControl: secondCacheControl,
                vercelCache: secondVercelCache,
            },
            isProperlyCached,
        };
    } catch (error) {
        return {
            url,
            firstRequest: {
                status: 0,
                cacheControl: undefined,
                vercelCache: undefined,
            },
            secondRequest: {
                status: 0,
                cacheControl: undefined,
                vercelCache: undefined,
            },
            isProperlyCached: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * Test cache headers for all URLs with progress reporting
 */
async function testAllUrls(urls: string[]): Promise<CacheTestResult[]> {
    const results: CacheTestResult[] = [];
    const total = urls.length;

    console.log(`\nTesting cache headers for ${total} URLs...\n`);

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const progress = Math.round(((i + 1) / total) * 100);

        process.stdout.write(`[${progress}%] Testing: ${url.replace('https://kirill-markin.com/', '')} `);

        const result = await testUrl(url);
        results.push(result);

        if (result.error) {
            console.log(`❌ ERROR: ${result.error}`);
        } else if (!result.isProperlyCached) {
            console.log(`⚠️  NOT CACHED - 1st: ${result.firstRequest.vercelCache || 'none'}, 2nd: ${result.secondRequest.vercelCache || 'none'}`);
        } else {
            console.log(`✅ CACHED - 1st: ${result.firstRequest.vercelCache || 'none'}, 2nd: ${result.secondRequest.vercelCache || 'none'}`);
        }
    }

    return results;
}

/**
 * Generate summary report
 */
function generateReport(results: CacheTestResult[]): void {
    const total = results.length;
    const successful = results.filter(r => r.firstRequest.status === 200);
    const cached = results.filter(r => r.isProperlyCached);
    const errors = results.filter(r => r.error);
    const notCached = results.filter(r => r.firstRequest.status === 200 && !r.isProperlyCached);

    console.log('\n=== CACHE TEST SUMMARY ===');
    console.log(`Total URLs tested: ${total}`);
    console.log(`Successful responses (200): ${successful.length}/${total} (${Math.round(successful.length / total * 100)}%)`);
    console.log(`Properly cached: ${cached.length}/${successful.length} (${Math.round(cached.length / successful.length * 100)}%)`);
    console.log(`Errors: ${errors.length}`);

    if (notCached.length > 0) {
        console.log('\n⚠️  URLs NOT PROPERLY CACHED:');
        notCached.forEach(result => {
            console.log(`  - ${result.url}`);
            console.log(`    1st Request - Cache-Control: ${result.firstRequest.cacheControl || 'none'}`);
            console.log(`    1st Request - Vercel-Cache: ${result.firstRequest.vercelCache || 'none'}`);
            console.log(`    2nd Request - Cache-Control: ${result.secondRequest.cacheControl || 'none'}`);
            console.log(`    2nd Request - Vercel-Cache: ${result.secondRequest.vercelCache || 'none'}`);
        });
    }

    if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(result => {
            console.log(`  - ${result.url}: ${result.error}`);
        });
    }

    if (cached.length === successful.length && errors.length === 0) {
        console.log('\n🎉 ALL TESTS PASSED! All URLs are properly cached.');
    } else {
        console.log('\n⚠️  Some issues found. Check the details above.');
    }
}

/**
 * Main function
 */
async function main(): Promise<void> {
    try {
        const sitemapUrl = 'https://kirill-markin.com/sitemap.xml';

        // Fetch sitemap and extract URLs
        const urls = await fetchSitemap(sitemapUrl);

        // Test all URLs
        const results = await testAllUrls(urls);

        // Generate report
        generateReport(results);

    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    main();
} 