import { parseStringPromise } from 'xml2js';
import https from 'https';
import { getChangedFilesSinceLastDeployment, getAffectedPagesByChangedFiles } from './vercelDeployment';

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://kirill-markin.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const API_KEY = process.env.INDEXNOW_API_KEY || '35116a77dcdf431ab1887d663c7d388f';
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`;
const INDEXNOW_API_HOST = 'api.indexnow.org';

// Define types for sitemap data
interface SitemapUrlEntry {
    loc: string[];
    lastmod?: string[];
    changefreq?: string[];
    priority?: string[];
}

// This interface is used for parsing the sitemap XML
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
 * Filters and submits only URLs affected by the files changed in this deployment
 * Uses Git to determine which files have changed
 */
export async function filterAndSubmitChangedUrls(): Promise<ApiResponse> {
    try {
        console.warn('Getting list of files changed since last deployment');
        const changedFiles = await getChangedFilesSinceLastDeployment();

        console.warn(`Found ${changedFiles.length} changed files`);

        console.warn('Determining affected pages');
        const affectedPages = getAffectedPagesByChangedFiles(changedFiles);

        console.warn(`Found ${affectedPages.length} affected pages`);
        if (affectedPages.length === 0) {
            return { message: 'No pages affected by the changes' };
        }

        console.warn(`Fetching sitemap from ${SITEMAP_URL}`);
        const xmlData = await fetchSitemap(SITEMAP_URL);

        console.warn('Parsing sitemap XML');
        const sitemap = await parseStringPromise(xmlData) as SitemapData;

        if (!sitemap?.urlset?.url?.length) {
            return { message: 'No URLs found in sitemap' };
        }

        console.warn('Filtering URLs based on affected pages');
        const urlsToSubmit = sitemap.urlset.url
            .filter((urlEntry: SitemapUrlEntry) => {
                const urlPath = new URL(urlEntry.loc[0]).pathname;

                // Check if this URL path corresponds to any of the affected pages
                return affectedPages.some((affectedPage: string) => {
                    // Handle special case for individual articles
                    if (affectedPage.startsWith('/articles/') &&
                        affectedPage !== '/articles/' &&
                        urlPath.startsWith('/articles/')) {
                        return urlPath.includes(affectedPage);
                    }

                    // For regular pages, check exact match (with trailing slash handling)
                    const normalizedUrlPath = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
                    const normalizedAffectedPage = affectedPage.endsWith('/') ? affectedPage : `${affectedPage}/`;
                    return normalizedUrlPath === normalizedAffectedPage;
                });
            })
            .map((urlEntry: SitemapUrlEntry) => urlEntry.loc[0]);

        console.warn(`Found ${urlsToSubmit.length} URLs to submit to IndexNow`);
        if (urlsToSubmit.length === 0) {
            return { message: 'No matching URLs found for affected pages' };
        }

        console.warn('Submitting URLs to IndexNow');
        const result = await submitToIndexNow(urlsToSubmit);

        return {
            success: result.statusCode === 200,
            recentUrls: urlsToSubmit,
            apiResponse: result
        };
    } catch (error) {
        console.error('Error in filterAndSubmitChangedUrls:', error);
        throw error;
    }
} 