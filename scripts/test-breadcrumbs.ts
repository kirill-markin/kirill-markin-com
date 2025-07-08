import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

// Extract URLs from sitemap XML
const extractUrlsFromSitemap = async (sitemapUrl: string): Promise<string[]> => {
    try {
        const response = await fetch(sitemapUrl);
        const xml = await response.text();

        // Extract URLs using regex (simple approach)
        const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
        if (!urlMatches) return [];

        return urlMatches
            .map((match: string) => match.replace(/<\/?loc>/g, ''))
            .filter((url: string) => !url.endsWith('.pdf')) // Skip PDF files
            .map((url: string) => url.replace('https://kirill-markin.com', 'http://localhost:3000'));
    } catch (error) {
        console.error('Error fetching sitemap:', error);
        return [];
    }
};

interface BreadcrumbItem {
    '@type': string;
    name: string;
    position: string;
    item: string;
}

interface BreadcrumbList {
    '@type': string;
    itemListElement: BreadcrumbItem[];
}

// Extract breadcrumbs from HTML
const extractBreadcrumbs = (html: string): BreadcrumbList | null => {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Look for BreadcrumbList JSON-LD
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');

    for (const script of Array.from(scripts)) {
        try {
            const jsonLd = JSON.parse(script.textContent || '');
            if (jsonLd['@type'] === 'BreadcrumbList') {
                return jsonLd;
            }
        } catch {
            // Skip invalid JSON
        }
    }

    // Look for HTML breadcrumbs with microdata
    const breadcrumbNav = document.querySelector('[itemType="https://schema.org/BreadcrumbList"]');
    if (breadcrumbNav) {
        const items = Array.from(breadcrumbNav.querySelectorAll('[itemType="https://schema.org/ListItem"]'));
        return {
            '@type': 'BreadcrumbList',
            'itemListElement': items.map(item => {
                const nameElement = item.querySelector('[itemProp="name"]');
                const positionElement = item.querySelector('[itemProp="position"]');
                const itemElement = item.querySelector('[itemProp="item"]');

                return {
                    '@type': 'ListItem',
                    'name': nameElement?.textContent?.trim() || 'UNNAMED',
                    'position': positionElement?.getAttribute('content') || 'NO_POSITION',
                    'item': itemElement?.getAttribute('href') || 'NO_ITEM'
                };
            })
        };
    }

    return null;
};

interface TestResult {
    url: string;
    status: string;
    breadcrumbs: BreadcrumbList | null;
    error?: string;
}

// Test a single URL
const testUrl = async (url: string): Promise<TestResult> => {
    try {
        console.log(`Testing: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            return { url, status: 'ERROR', breadcrumbs: null, error: `HTTP ${response.status}` };
        }

        const html = await response.text();
        const breadcrumbs = extractBreadcrumbs(html);

        if (!breadcrumbs) {
            return { url, status: 'NO_BREADCRUMBS', breadcrumbs: null };
        }

        // Check for "unnamed" items
        const items = breadcrumbs.itemListElement || [];
        const hasUnnamed = items.some((item: BreadcrumbItem) =>
            !item.name || item.name === 'UNNAMED' || item.name.toString().toLowerCase().includes('unnamed')
        );

        const hasMissingData = items.some((item: BreadcrumbItem) =>
            !item.position || item.position === 'NO_POSITION' ||
            !item.item || item.item === 'NO_ITEM'
        );

        if (hasUnnamed) {
            return { url, status: 'HAS_UNNAMED', breadcrumbs };
        }

        if (hasMissingData) {
            return { url, status: 'MISSING_DATA', breadcrumbs };
        }

        return { url, status: 'OK', breadcrumbs };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { url, status: 'ERROR', breadcrumbs: null, error: errorMessage };
    }
};

// Main function
const main = async () => {
    console.log('🍞 Testing breadcrumbs on all sitemap URLs...\n');

    const sitemapUrl = 'http://localhost:3000/sitemap.xml';
    const urls = await extractUrlsFromSitemap(sitemapUrl);

    if (urls.length === 0) {
        console.log('❌ No URLs found in sitemap');
        return;
    }

    console.log(`Found ${urls.length} URLs to test\n`);

    const results = [];

    // Test URLs in chunks to avoid overwhelming the server
    const chunkSize = 5;
    for (let i = 0; i < urls.length; i += chunkSize) {
        const chunk = urls.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map(testUrl));
        results.push(...chunkResults);

        // Small delay between chunks
        if (i + chunkSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Summarize results
    const summary = {
        total: results.length,
        ok: results.filter(r => r.status === 'OK').length,
        hasUnnamed: results.filter(r => r.status === 'HAS_UNNAMED').length,
        missingData: results.filter(r => r.status === 'MISSING_DATA').length,
        noBreadcrumbs: results.filter(r => r.status === 'NO_BREADCRUMBS').length,
        errors: results.filter(r => r.status === 'ERROR').length
    };

    console.log('\n📊 SUMMARY:');
    console.log(`✅ OK: ${summary.ok}/${summary.total}`);
    console.log(`❌ Has unnamed: ${summary.hasUnnamed}`);
    console.log(`⚠️  Missing data: ${summary.missingData}`);
    console.log(`🚫 No breadcrumbs: ${summary.noBreadcrumbs}`);
    console.log(`💥 Errors: ${summary.errors}`);

    // Show detailed results for problematic pages
    const problematic = results.filter(r => r.status !== 'OK' && r.status !== 'NO_BREADCRUMBS');

    if (problematic.length > 0) {
        console.log('\n🔍 PROBLEMATIC PAGES:');
        problematic.forEach(result => {
            console.log(`\n${result.status}: ${result.url}`);
            if (result.error) {
                console.log(`  Error: ${result.error}`);
            }
            if (result.breadcrumbs && result.breadcrumbs.itemListElement) {
                console.log('  Breadcrumbs:');
                result.breadcrumbs.itemListElement.forEach((item: BreadcrumbItem, index: number) => {
                    console.log(`    ${index + 1}. "${item.name}" (pos: ${item.position}, item: ${item.item})`);
                });
            }
        });
    }

    // Show pages without breadcrumbs (this might be expected for home page)
    const noBreadcrumbs = results.filter(r => r.status === 'NO_BREADCRUMBS');
    if (noBreadcrumbs.length > 0) {
        console.log('\n📝 PAGES WITHOUT BREADCRUMBS:');
        noBreadcrumbs.forEach(result => {
            console.log(`  ${result.url}`);
        });
    }

    // Show some successful examples
    const successful = results.filter(r => r.status === 'OK').slice(0, 3);
    if (successful.length > 0) {
        console.log('\n✅ SUCCESSFUL EXAMPLES:');
        successful.forEach(result => {
            console.log(`\n${result.url}`);
            if (result.breadcrumbs && result.breadcrumbs.itemListElement) {
                result.breadcrumbs.itemListElement.forEach((item: BreadcrumbItem, index: number) => {
                    console.log(`  ${index + 1}. "${item.name}" → ${item.item}`);
                });
            }
        });
    }
};

// Run the script
main().catch(console.error); 