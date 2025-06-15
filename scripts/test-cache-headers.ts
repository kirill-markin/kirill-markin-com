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
    status: number;
    cacheControl: string | undefined;
    vercelCache: string | undefined;
    isStaticCached: boolean;
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

    // Bad cache control headers
    if (cc.includes('private') || cc.includes('no-cache') || cc.includes('no-store')) {
        return false;
    }

    // Good cache control headers
    if (cc.includes('public') && cc.includes('max-age')) {
        return true;
    }

    return false;
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
 * Test cache headers for a single URL
 */
async function testUrl(url: string): Promise<CacheTestResult> {
    try {
        const { status, headers } = await fetchHeaders(url);
        const cacheControl = headers['cache-control'];
        const vercelCache = headers['x-vercel-cache'];

        return {
            url,
            status,
            cacheControl,
            vercelCache,
            isStaticCached: isStaticCached(cacheControl, vercelCache),
        };
    } catch (error) {
        return {
            url,
            status: 0,
            cacheControl: undefined,
            vercelCache: undefined,
            isStaticCached: false,
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
        } else if (!result.isStaticCached) {
            console.log(`⚠️  NOT CACHED (${result.status}) - ${result.cacheControl || 'no cache-control'}`);
        } else {
            console.log(`✅ CACHED (${result.status}) - ${result.vercelCache || 'unknown'}`);
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
}

/**
 * Generate summary report
 */
function generateReport(results: CacheTestResult[]): void {
    const total = results.length;
    const successful = results.filter(r => r.status === 200);
    const cached = results.filter(r => r.isStaticCached);
    const errors = results.filter(r => r.error);
    const notCached = results.filter(r => r.status === 200 && !r.isStaticCached);

    console.log('\n=== CACHE TEST SUMMARY ===');
    console.log(`Total URLs tested: ${total}`);
    console.log(`Successful responses (200): ${successful.length}/${total} (${Math.round(successful.length / total * 100)}%)`);
    console.log(`Properly cached: ${cached.length}/${successful.length} (${Math.round(cached.length / successful.length * 100)}%)`);
    console.log(`Errors: ${errors.length}`);

    if (notCached.length > 0) {
        console.log('\n⚠️  URLs NOT PROPERLY CACHED:');
        notCached.forEach(result => {
            console.log(`  - ${result.url}`);
            console.log(`    Cache-Control: ${result.cacheControl || 'none'}`);
            console.log(`    Vercel-Cache: ${result.vercelCache || 'none'}`);
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