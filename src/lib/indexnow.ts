import { parseStringPromise } from 'xml2js';
import https from 'https';

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://kirill-markin.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const API_KEY = process.env.INDEXNOW_API_KEY || '35116a77dcdf431ab1887d663c7d388f';
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`;
const INDEXNOW_API_HOST = 'api.indexnow.org';

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
function filterRecentlyModifiedUrls(sitemapData: any, thresholdMinutes = 3): string[] {
    if (!sitemapData?.urlset?.url?.length) return [];

    const currentTime = new Date();
    const thresholdMs = thresholdMinutes * 60 * 1000;

    return sitemapData.urlset.url
        .filter((urlEntry: any) => {
            if (!urlEntry.lastmod?.[0]) return false;

            const lastmodTime = new Date(urlEntry.lastmod[0]);
            return (currentTime.getTime() - lastmodTime.getTime()) <= thresholdMs;
        })
        .map((urlEntry: any) => urlEntry.loc[0]);
}

/**
 * Submits URLs to IndexNow API
 */
async function submitToIndexNow(urls: string[]): Promise<any> {
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
export async function filterAndSubmitUrls(thresholdMinutes = 3): Promise<any> {
    try {
        console.log(`Fetching sitemap from ${SITEMAP_URL}`);
        const xmlData = await fetchSitemap(SITEMAP_URL);

        console.log('Parsing sitemap XML');
        const sitemap = await parseStringPromise(xmlData);

        console.log(`Filtering URLs modified in the last ${thresholdMinutes} minutes`);
        const recentUrls = filterRecentlyModifiedUrls(sitemap, thresholdMinutes);

        console.log(`Found ${recentUrls.length} recently modified URLs`);
        if (recentUrls.length === 0) {
            return { message: 'No recent changes found in sitemap' };
        }

        console.log('Submitting URLs to IndexNow');
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