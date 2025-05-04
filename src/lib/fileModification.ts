import fs from 'fs/promises';
import path from 'path';

// Path to the project's working directory
const workingDir = process.cwd();

/**
 * Gets the last modification date of a file
 * @param filePath Path to the file relative to the project root
 * @returns Last modification date of the file
 */
export async function getFileLastModifiedDate(filePath: string): Promise<Date> {
    try {
        const fullPath = path.join(workingDir, filePath);
        const stats = await fs.stat(fullPath);
        return stats.mtime;
    } catch (error) {
        console.error(`Error getting file modification date for ${filePath}:`, error);
        return new Date(); // Return current date in case of error
    }
}

/**
 * Gets the latest modification date from an array of files
 * @param filePaths Array of file paths relative to the project root
 * @returns The latest modification date among all files
 */
export async function getLatestModificationDate(filePaths: string[]): Promise<Date> {
    try {
        const modificationDates = await Promise.all(
            filePaths.map(filePath => getFileLastModifiedDate(filePath))
        );

        // Return the latest modification date
        return new Date(Math.max(...modificationDates.map(date => date.getTime())));
    } catch (error) {
        console.error('Error getting latest modification date:', error);
        return new Date(); // Return current date in case of error
    }
}

/**
 * Gets the last modification date of a page
 * Analyzes all files associated with this page
 * @param pagePath Page path in URL format (e.g., '/services/')
 * @returns Last modification date of the page
 */
export async function getPageLastModifiedDate(pagePath: string): Promise<Date> {
    // Mapping pages to their corresponding files for analysis
    const pageFilesMap: Record<string, string[]> = {
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

    // Check for mapping for the current page
    let filesToCheck: string[];
    if (pagePath.includes('?tag=')) {
        // For tag pages, use the same files as for the articles page
        filesToCheck = pageFilesMap['/articles/'] || [];
    } else if (pagePath.includes('?category=')) {
        // For category pages, use the same files as for the services page
        filesToCheck = pageFilesMap['/services/'] || [];
    } else {
        // For regular pages, take files from the mapping
        filesToCheck = pageFilesMap[pagePath] || [];
    }

    // If there's no mapping for the page, return the current date
    if (filesToCheck.length === 0) {
        return new Date();
    }

    // Get the latest modification date among all related files
    return getLatestModificationDate(filesToCheck);
}

/**
 * Gets a list of files changed since the last deployment using Git
 * @returns Array of file paths that have been modified since the last deployment tag
 */
export async function getChangedFilesSinceLastDeployment(): Promise<string[]> {
    try {
        // Use git to get changed files since the last deployment
        const { execSync } = require('child_process');

        // Get the most recent deployed commit hash from Vercel environment
        const currentDeploymentHash = process.env.VERCEL_GIT_COMMIT_SHA || '';
        // Get the previous successful deployment hash
        const previousDeploymentHash = process.env.VERCEL_GIT_PREVIOUS_SHA || '';

        // Log for debugging
        console.warn(`Current deployment hash: ${currentDeploymentHash}`);
        console.warn(`Previous deployment hash: ${previousDeploymentHash}`);

        // If there's no current deployment hash, something is wrong
        if (!currentDeploymentHash) {
            console.warn('Missing current deployment hash, will consider all files as changed');
            return ['ALL_FILES_CHANGED'];
        }

        // If there's no previous hash (first deployment of a branch), we need to get all files
        if (!previousDeploymentHash) {
            console.warn('No previous deployment hash available (likely first deployment of branch)');
            console.warn('Considering all files in the project as changed');
            return ['ALL_FILES_CHANGED'];
        }

        // Get list of changed files between the previous deployment and the current one
        const gitCommand = `git diff --name-only ${previousDeploymentHash} ${currentDeploymentHash}`;
        console.warn(`Running git command: ${gitCommand}`);

        const changedFiles = execSync(gitCommand, { encoding: 'utf-8' })
            .trim()
            .split('\n')
            .filter(Boolean);

        return changedFiles;
    } catch (error) {
        console.error('Error getting changed files:', error);
        // If there's an error, return a special marker to indicate all files should be considered changed
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

// Mapping pages to their corresponding files for analysis
// Make this available outside the function for reuse
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