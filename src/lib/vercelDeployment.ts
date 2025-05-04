/**
 * Utilities for tracking file modifications and affected pages using GitHub API
 * 
 * This module provides functions to:
 * 1. Determine which files have changed between deployments using GitHub's comparison API
 * 2. Map changed files to affected pages on the website
 * 3. Get last modification dates for files using GitHub commit history
 * 
 * All API calls use the GitHub API directly rather than Vercel's API for better reliability
 * and more detailed change information.
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

/**
 * Gets a list of files changed since the last deployment using GitHub API
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

        // Get GitHub credentials
        const token = process.env.GITHUB_TOKEN;
        const owner = process.env.VERCEL_GIT_REPO_OWNER;
        const repo = process.env.VERCEL_GIT_REPO_SLUG;

        if (!token || !owner || !repo) {
            console.warn('Missing GitHub credentials or repo info, considering all files changed');
            return ['ALL_FILES_CHANGED'];
        }

        // Fetch comparison between commits directly from GitHub API
        const compareUrl = `https://api.github.com/repos/${owner}/${repo}/compare/${previousDeploymentHash}...${currentDeploymentHash}`;

        console.warn(`Fetching GitHub comparison: ${compareUrl}`);

        const response = await fetch(compareUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            console.warn(`Failed to fetch comparison from GitHub API: ${response.status} - ${await response.text()}`);
            return ['ALL_FILES_CHANGED'];
        }

        const comparison = await response.json();

        // Extract changed files from the comparison
        const changedFiles = new Set<string>();

        // GitHub returns files with the status: "added", "modified", "removed", or "renamed"
        if (comparison.files && Array.isArray(comparison.files)) {
            for (const file of comparison.files) {
                changedFiles.add(file.filename);
            }
        }

        if (changedFiles.size === 0) {
            console.warn('No changed files found in GitHub comparison, considering all files changed');
            return ['ALL_FILES_CHANGED'];
        }

        return Array.from(changedFiles);
    } catch (error) {
        console.error('Error getting changed files from GitHub:', error);
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