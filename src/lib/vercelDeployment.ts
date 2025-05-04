/**
 * Utilities for tracking file modifications and affected pages in Vercel environment
 */

// Mapping pages to their corresponding files for analysis
export const pageFilesMap: Record<string, string[]> = {
    '/': [
        'src/app/page.tsx',
        'src/app/page.module.css',
        'src/data/personalInfo.ts',
        'src/data/professionalRoles.ts',
        'src/data/mediaMentions.ts'
    ],
    '/services/': [
        'src/app/services/page.tsx',
        'src/app/services/page.module.css',
        'src/data/services.ts',
    ],
    '/meet/': [
        'src/app/meet/page.tsx',
        'src/app/meet/page.module.css',
    ],
    '/meet/short/': [
        'src/app/meet/short/page.tsx',
        'src/app/meet/page.module.css',
    ],
    '/meet/all/': [
        'src/app/meet/all/page.tsx',
        'src/app/meet/page.module.css',
    ],
    '/pay/': [
        'src/app/pay/page.tsx',
        'src/app/pay/page.module.css',
    ],
    '/pay/stripe/': [
        'src/app/pay/stripe/page.tsx',
        'src/app/pay/page.module.css',
    ],
    '/articles/': [
        'src/app/articles/page.tsx',
        'src/app/articles/articles.module.css',
        'src/lib/articles.ts'
    ]
};

/**
 * Gets a list of files changed since the last deployment using Vercel deployment information
 * @returns Array of file paths that have been modified since the last deployment
 */
export async function getChangedFilesSinceLastDeployment(): Promise<string[]> {
    try {
        // Get deployment information from Vercel environment
        const currentDeploymentHash = process.env.VERCEL_GIT_COMMIT_SHA;
        const previousDeploymentHash = process.env.VERCEL_GIT_PREVIOUS_SHA;

        // Log for debugging (these will appear in Vercel deployment logs)
        console.warn(`Current deployment hash: ${currentDeploymentHash}`);
        console.warn(`Previous deployment hash: ${previousDeploymentHash}`);

        // If there's no current deployment hash, we're not in Vercel environment
        if (!currentDeploymentHash) {
            console.warn('Not in Vercel environment or missing deployment hash');
            return ['ALL_FILES_CHANGED'];
        }

        // If there's no previous hash (first deployment), consider all files changed
        if (!previousDeploymentHash) {
            console.warn('No previous deployment hash - first deployment');
            return ['ALL_FILES_CHANGED'];
        }

        // Get the list of files from Vercel deployment
        const teamId = process.env.VERCEL_TEAM_ID;
        const projectId = process.env.VERCEL_PROJECT_ID;
        const token = process.env.VERCEL_TOKEN;

        if (!teamId || !projectId || !token) {
            console.warn('Missing Vercel credentials, considering all files changed');
            return ['ALL_FILES_CHANGED'];
        }

        // Fetch deployment details from Vercel API
        const deploymentUrl = `https://api.vercel.com/v6/deployments/${currentDeploymentHash}`;
        const response = await fetch(deploymentUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('Failed to fetch deployment details from Vercel API');
            return ['ALL_FILES_CHANGED'];
        }

        const deployment = await response.json();

        // Extract changed files from the deployment
        const changedFiles = deployment.files?.map((file: { file: string }) => file.file) || [];

        if (changedFiles.length === 0) {
            console.warn('No changed files found in deployment, considering all files changed');
            return ['ALL_FILES_CHANGED'];
        }

        return changedFiles;
    } catch (error) {
        console.error('Error getting changed files:', error);
        // If there's an error, consider all files changed
        return ['ALL_FILES_CHANGED'];
    }
}

/**
 * Determines which pages were affected by the changed files
 * @param changedFiles List of files that changed in the deployment
 * @returns List of URL paths that were affected by the changes
 */
export function getAffectedPagesByChangedFiles(changedFiles: string[]): string[] {
    // If the special ALL_FILES_CHANGED marker is present, return all pages
    if (changedFiles.includes('ALL_FILES_CHANGED')) {
        return Object.keys(pageFilesMap);
    }

    const affectedPages = new Set<string>();

    // Map of file patterns to page paths
    const filePatternToPages: Record<string, string[]> = {
        // Content files
        '^src/content/articles/(.+)\\.md$': ['/articles/', '/articles/$1/'],
        // Component files
        '^src/components/(.+)\\.tsx$': ['/'], // Components can affect multiple pages
        // Data files
        '^src/data/services\\.ts$': ['/services/'],
        '^src/data/personalInfo\\.ts$': ['/'],
        '^src/data/mediaMentions\\.ts$': ['/'],
        '^src/data/professionalRoles\\.ts$': ['/'],
        '^src/data/socialLinks\\.ts$': ['/'],
        // Page files
        '^src/app/page\\.tsx$': ['/'],
        '^src/app/services/page\\.tsx$': ['/services/'],
        '^src/app/articles/page\\.tsx$': ['/articles/'],
        '^src/app/meet/page\\.tsx$': ['/meet/'],
        '^src/app/meet/short/page\\.tsx$': ['/meet/short/'],
        '^src/app/meet/all/page\\.tsx$': ['/meet/all/'],
        '^src/app/pay/page\\.tsx$': ['/pay/'],
        '^src/app/pay/stripe/page\\.tsx$': ['/pay/stripe/'],
        // CSS files
        '^src/app/page\\.module\\.css$': ['/'],
        '^src/app/services/page\\.module\\.css$': ['/services/'],
        '^src/app/articles/articles\\.module\\.css$': ['/articles/'],
        '^src/app/meet/page\\.module\\.css$': ['/meet/', '/meet/short/', '/meet/all/'],
        '^src/app/pay/page\\.module\\.css$': ['/pay/', '/pay/stripe/'],
    };

    // Check each changed file against the patterns
    changedFiles.forEach(file => {
        // For article files, extract the slug
        const articleMatch = file.match(/^src\/content\/articles\/(.+)\.md$/);
        if (articleMatch) {
            // Add both the articles index and the specific article page
            affectedPages.add('/articles/');
            affectedPages.add(`/articles/${articleMatch[1]}/`);
            return;
        }

        // Check each pattern
        for (const [pattern, pages] of Object.entries(filePatternToPages)) {
            if (new RegExp(pattern).test(file)) {
                pages.forEach(page => affectedPages.add(page));
            }
        }

        // If any global files changed, consider all pages affected
        if (file.match(/^src\/app\/layout\.tsx$/) || file.match(/^src\/app\/globals\.css$/)) {
            Object.keys(pageFilesMap).forEach(page => affectedPages.add(page));
        }
    });

    return Array.from(affectedPages);
}

/**
 * Gets the last modification date for a specific page path using Vercel deployment information
 * @param pagePath The page path to get the modification date for
 * @returns The last modification date of the page
 */
export async function getPageLastModifiedDate(pagePath: string): Promise<Date> {
    try {
        // Get deployment information from Vercel environment
        const currentDeploymentHash = process.env.VERCEL_GIT_COMMIT_SHA;
        const token = process.env.VERCEL_TOKEN;

        if (!currentDeploymentHash || !token) {
            console.warn('Missing Vercel environment variables, using current date');
            return new Date();
        }

        // Fetch deployment details from Vercel API
        const deploymentUrl = `https://api.vercel.com/v6/deployments/${currentDeploymentHash}`;
        const response = await fetch(deploymentUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.warn('Failed to fetch deployment details from Vercel API');
            return new Date();
        }

        const deployment = await response.json();

        // Get the files that affect this page
        const relevantFiles = pageFilesMap[pagePath] || [];

        // Get the deployment date for the most recently modified file
        let latestDate = new Date(deployment.createdAt);

        // If we have no files to check, return the deployment date
        if (relevantFiles.length === 0) {
            return latestDate;
        }

        // Check each file in the deployment
        const deploymentFiles = deployment.files || [];
        for (const file of deploymentFiles) {
            if (relevantFiles.includes(file.name)) {
                const fileDate = new Date(file.lastModified);
                if (fileDate > latestDate) {
                    latestDate = fileDate;
                }
            }
        }

        return latestDate;
    } catch (error) {
        console.error('Error getting page last modified date:', error);
        return new Date();
    }
} 