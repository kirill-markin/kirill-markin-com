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