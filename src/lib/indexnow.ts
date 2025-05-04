import { parseStringPromise } from 'xml2js';
import https from 'https';

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://kirill-markin.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const API_KEY = process.env.INDEXNOW_API_KEY || '35116a77dcdf431ab1887d663c7d388f';
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`;
const INDEXNOW_API_HOST = 'api.indexnow.org';
export const DEFAULT_THRESHOLD_MINUTES = 5;

// Define types for sitemap data
interface SitemapUrlEntry {
    loc: string[];
    lastmod?: string[];
    changefreq?: string[];
    priority?: string[];
}

interface SitemapData {
    urlset?: {
        url?: SitemapUrlEntry[];
    };
}

interface ApiResponse {
    statusCode?: number;
    statusMessage?: string;
    data?: string;
    message?: string;
    success?: boolean;
    recentUrls?: string[];
    apiResponse?: ApiResponse;
}

/**
 * Fetches the sitemap.xml content
 */
async function fetchSitemap(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => { resolve(data); });
        }).on('error', reject);
    });
}

/**
 * Filters URLs based on last modification time
 */
function filterRecentlyModifiedUrls(sitemapData: SitemapData, thresholdMinutes = DEFAULT_THRESHOLD_MINUTES): string[] {
    if (!sitemapData?.urlset?.url?.length) return [];

    const currentTime = new Date();
    const thresholdMs = thresholdMinutes * 60 * 1000;

    return sitemapData.urlset.url
        .filter((urlEntry: SitemapUrlEntry) => {
            if (!urlEntry.lastmod?.[0]) return false;

            const lastmodTime = new Date(urlEntry.lastmod[0]);
            return (currentTime.getTime() - lastmodTime.getTime()) <= thresholdMs;
        })
        .map((urlEntry: SitemapUrlEntry) => urlEntry.loc[0]);
}

/**
 * Submits URLs to IndexNow API
 */
async function submitToIndexNow(urls: string[]): Promise<ApiResponse> {
    if (urls.length === 0) {
        return { message: 'No URLs to submit' };
    }

    const data = JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: API_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls
    });

    const options = {
        hostname: INDEXNOW_API_HOST,
        port: 443,
        path: '/IndexNow',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    data: responseData
                });
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Main function to process and submit URLs
 */
export async function filterAndSubmitUrls(thresholdMinutes = DEFAULT_THRESHOLD_MINUTES): Promise<ApiResponse> {
    try {
        console.warn(`Fetching sitemap from ${SITEMAP_URL}`);
        const xmlData = await fetchSitemap(SITEMAP_URL);

        console.warn('Parsing sitemap XML');
        const sitemap = await parseStringPromise(xmlData);

        console.warn(`Filtering URLs modified in the last ${thresholdMinutes} minutes`);
        const recentUrls = filterRecentlyModifiedUrls(sitemap, thresholdMinutes);

        console.warn(`Found ${recentUrls.length} recently modified URLs`);
        if (recentUrls.length === 0) {
            return { message: 'No recent changes found in sitemap' };
        }

        console.warn('Submitting URLs to IndexNow');
        const result = await submitToIndexNow(recentUrls);

        return {
            success: result.statusCode === 200,
            recentUrls,
            apiResponse: result
        };
    } catch (error) {
        console.error('Error in filterAndSubmitUrls:', error);
        throw error;
    }
} 