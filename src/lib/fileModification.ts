/**
 * Utilities for determining file modification dates using GitHub API
 * 
 * This module provides functions to:
 * 1. Get last modification dates for files using GitHub commit history
 * 2. Map pages to their source files for lastmod calculation in sitemap
 */

// Common files that affect all pages
const commonFiles = [
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/app/not-found.tsx',
    'src/app/not-found.module.css',
    'src/app/not-found-metadata.tsx'
];

// Mapping pages to their corresponding files for analysis
export const pageFilesMap: Record<string, string[]> = {
    '/': [
        'src/app/(default)/page.tsx',
        'src/app/page.module.css',
        'src/data/personalInfo.ts',
        'src/data/professionalRoles.ts',
        'src/data/mediaMentions.ts',
        ...commonFiles
    ],
    '/services/': [
        'src/app/(default)/services/page.tsx',
        'src/app/(default)/services/page.module.css',
        'src/data/servicesOther.ts',
        'src/data/servicesFractionalCTO.ts',
        ...commonFiles
    ],
    '/services/fractional-ai-cto-kirill-markin/': [
        'src/app/(default)/services/fractional-ai-cto-kirill-markin/page.tsx',
        'src/app/(default)/services/page.module.css',
        'src/data/servicesFractionalCTO.ts',
        ...commonFiles
    ],
    '/meet/': [
        'src/app/(default)/meet/page.tsx',
        'src/app/(default)/meet/page.module.css',
        ...commonFiles
    ],
    '/meet/short/': [
        'src/app/(default)/meet/short/page.tsx',
        'src/app/(default)/meet/page.module.css',
        ...commonFiles
    ],
    '/meet/all/': [
        'src/app/(default)/meet/all/page.tsx',
        'src/app/(default)/meet/page.module.css',
        ...commonFiles
    ],
    '/pay/': [
        'src/app/(default)/pay/page.tsx',
        'src/app/(default)/pay/page.module.css',
        ...commonFiles
    ],
    '/pay/stripe/': [
        'src/app/(default)/pay/stripe/page.tsx',
        'src/app/(default)/pay/page.module.css',
        ...commonFiles
    ],
    '/articles/': [
        'src/app/(default)/articles/page.tsx',
        'src/app/(default)/articles/articles.module.css',
        'src/app/(default)/articles/layout.tsx',
        'src/lib/articles.ts',
        ...commonFiles
    ],
    '/subscribe/': [
        'src/app/(default)/subscribe/page.tsx',
        'src/components/pages/SubscribePageContent.tsx',
        'src/components/pages/SubscribePageContent.module.css',
        'src/app/api/subscribe/route.ts',
        ...commonFiles
    ],
    // Add search page
    '/search/': [
        'src/app/(default)/search/page.tsx',
        ...commonFiles
    ],
    // Add llms.txt route
    '/llms.txt': [
        'src/app/llms.txt/route.ts',
        'src/lib/articles.ts',
        'src/data/servicesOther.ts',
        'src/data/servicesFractionalCTO.ts',
        'src/data/personalInfo.ts',
        'src/data/professionalRoles.ts',
        ...commonFiles
    ],
    // Add CV.pdf file (CTO version only)
    '/data/cv-kirill-markin-cto.pdf': [
        'public/data/cv-kirill-markin-cto.pdf'
    ],
    // Add article slug page (for generic article page template)
    '/articles/[slug]/': [
        'src/app/(default)/articles/[slug]/page.tsx',
        'src/app/(default)/articles/articles.module.css',
        'src/app/(default)/articles/layout.tsx',
        'src/lib/articles.ts',
        ...commonFiles
    ],
    // Add localized main page
    '/[lang]/': [
        'src/app/(i18n)/[lang]/page.tsx',
        'src/app/(i18n)/[lang]/layout.tsx',
        'src/app/page.module.css',
        'src/data/personalInfo.ts',
        'src/data/professionalRoles.ts',
        'src/data/mediaMentions.ts',
        ...commonFiles
    ],
    // Add localized segment page
    '/[lang]/[segment]/': [
        'src/app/(i18n)/[lang]/[segment]/page.tsx',
        'src/app/(i18n)/[lang]/layout.tsx',
        ...commonFiles
    ],
    // Add localized subsegment page
    '/[lang]/[segment]/[subsegment]/': [
        'src/app/(i18n)/[lang]/[segment]/[subsegment]/page.tsx',
        'src/app/(i18n)/[lang]/[segment]/page.tsx',
        'src/app/(i18n)/[lang]/layout.tsx',
        ...commonFiles
    ]
};

/**
 * Gets the last Git commit date for a file using GitHub API
 * @param filePath Path to the file
 * @returns The date of the last commit that modified the file
 */
export async function getFileLastCommitDate(filePath: string): Promise<Date> {
    try {
        // Get GitHub token and repo info from environment
        const token = process.env.GITHUB_TOKEN;
        const owner = process.env.VERCEL_GIT_REPO_OWNER;
        const repo = process.env.VERCEL_GIT_REPO_SLUG;

        if (!token || !owner || !repo) {
            console.warn('Missing GitHub credentials or repo info, using current date');
            return new Date();
        }

        // Fetch commit history for the file from GitHub API
        const githubUrl = `https://api.github.com/repos/${owner}/${repo}/commits?path=${filePath}&page=1&per_page=1`;

        console.warn('Fetching GitHub commit info:', { githubUrl, filePath });

        const response = await fetch(githubUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            console.warn(`Failed to fetch git information for ${filePath} from GitHub API: ${response.status} - ${await response.text()}`);
            return new Date();
        }

        const commits = await response.json();

        if (!Array.isArray(commits) || commits.length === 0) {
            console.warn(`No commit history found for ${filePath}`);
            return new Date();
        }

        // GitHub API returns ISO date string
        return new Date(commits[0].commit.committer.date);
    } catch (error) {
        console.error(`Error getting last commit date for ${filePath}:`, error);
        return new Date();
    }
}

/**
 * Gets the last modification date for a specific page path using Git commit history
 * @param pagePath The page path to get the modification date for
 * @returns The last modification date of the page
 */
export async function getPageLastModifiedDate(pagePath: string): Promise<Date> {
    try {
        // Get the files that affect this page
        const relevantFiles = pageFilesMap[pagePath] || [];

        // If we have no files to check, return current date
        if (relevantFiles.length === 0) {
            return new Date();
        }

        // Get the latest commit date for each file
        const fileDates = await Promise.all(
            relevantFiles.map(file => getFileLastCommitDate(file))
        );

        // Return the most recent date
        return new Date(Math.max(...fileDates.map(date => date.getTime())));
    } catch (error) {
        console.error('Error getting page last modified date:', error);
        return new Date();
    }
} 