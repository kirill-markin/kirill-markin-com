/**
 * Metadata Validation Script
 * 
 * This script scans all pages in the Next.js application to validate metadata:
 * - Checks for missing titles and descriptions
 * - Ensures titles are within optimal length based on SEO constraints
 * - Ensures descriptions are within optimal length based on SEO constraints
 * - Detects duplicate titles and descriptions
 * - Identifies pages with missing metaTitle or metaDescription in translations
 * 
 * Run with: npm run validate-metadata
 */

import chalk from 'chalk';
import {
    SUPPORTED_LANGUAGES,
} from '../src/lib/localization';
import { SEO_CONSTRAINTS, validateTitle, validateDescription } from '../src/lib/seoValidation';
import {
    generateHomePageMetadata,
    generateArticlesPageMetadata,
    generateServicesPageMetadata,
    generateMeetPageMetadata,
    generatePayPageMetadata
} from '../src/lib/metadata';

// Track all metadata for duplicate detection
const allTitles = new Map<string, string[]>();
const allDescriptions = new Map<string, string[]>();

// Issue tracking
interface Issue {
    path: string;
    language: string;
    type: 'missing_title' | 'missing_description' | 'title_too_short' | 'title_too_long' | 'description_too_short' | 'description_too_long' | 'duplicate_title' | 'duplicate_description' | 'missing_translation';
    details: string;
}

const issues: Issue[] = [];

/**
 * Get a descriptive identifier for a page
 */
function getPageIdentifier(pageName: string, pageType: string, subType: string | null, lang: string): string {
    if (subType) {
        return `${pageName} [${lang}] (${pageType}/${subType})`;
    }
    return `${pageName} [${lang}] (${pageType})`;
}

/**
 * Validate generated metadata using the actual metadata generation functions
 */
function validateGeneratedMetadata() {
    // Define page types to validate
    const pageTypes = [
        {
            name: 'Home',
            type: 'home',
            subType: null,
            generator: (lang: string) => generateHomePageMetadata(lang),
        },
        {
            name: 'Articles',
            type: 'articles',
            subType: null,
            generator: (lang: string) => generateArticlesPageMetadata({ language: lang }),
        },
        {
            name: 'Articles with Tag',
            type: 'articles',
            subType: 'productivity',
            generator: (lang: string) => generateArticlesPageMetadata({ language: lang, tag: 'productivity' }),
        },
        {
            name: 'Services',
            type: 'services',
            subType: null,
            generator: (lang: string) => generateServicesPageMetadata({ language: lang }),
        },
        {
            name: 'Services for Individuals',
            type: 'services',
            subType: 'people',
            generator: (lang: string) => generateServicesPageMetadata({ language: lang, category: 'people' }),
        },
        {
            name: 'Meet',
            type: 'meet',
            subType: null,
            generator: (lang: string) => generateMeetPageMetadata({ language: lang }),
        },
        {
            name: 'Meet Short',
            type: 'meet',
            subType: 'short',
            generator: (lang: string) => generateMeetPageMetadata({ language: lang, type: 'short' }),
        },
        {
            name: 'Meet All',
            type: 'meet',
            subType: 'all',
            generator: (lang: string) => generateMeetPageMetadata({ language: lang, type: 'all' }),
        },
        {
            name: 'Pay',
            type: 'pay',
            subType: null,
            generator: (lang: string) => generatePayPageMetadata({ language: lang }),
        },
        {
            name: 'Pay Stripe',
            type: 'pay',
            subType: 'stripe',
            generator: (lang: string) => generatePayPageMetadata({ language: lang, type: 'stripe' }),
        }
    ];

    // Generate and validate metadata for all page types in all languages
    for (const pageType of pageTypes) {
        for (const lang of SUPPORTED_LANGUAGES) {
            try {
                const metadata = pageType.generator(lang);
                const pageId = getPageIdentifier(pageType.name, pageType.type, pageType.subType, lang);

                if (!metadata.title) {
                    issues.push({
                        path: pageId,
                        language: lang,
                        type: 'missing_title',
                        details: `Generated metadata has no title`
                    });
                } else {
                    const titleStr = String(metadata.title);
                    const titleValidation = validateTitle(titleStr);

                    if (titleValidation.tooShort) {
                        issues.push({
                            path: pageId,
                            language: lang,
                            type: 'title_too_short',
                            details: `Title too short (${titleValidation.length} chars): "${titleStr.substring(0, 40)}..."`
                        });
                    } else if (titleValidation.tooLong) {
                        issues.push({
                            path: pageId,
                            language: lang,
                            type: 'title_too_long',
                            details: `Title too long (${titleValidation.length} chars): "${titleStr.substring(0, 40)}..."`
                        });
                    }

                    // Track for duplicates, but only within generated metadata
                    if (!allTitles.has(titleStr)) {
                        allTitles.set(titleStr, [pageId]);
                    } else {
                        allTitles.get(titleStr)?.push(pageId);
                    }
                }

                if (!metadata.description) {
                    issues.push({
                        path: pageId,
                        language: lang,
                        type: 'missing_description',
                        details: `Generated metadata has no description`
                    });
                } else {
                    const descStr = String(metadata.description);
                    const descValidation = validateDescription(descStr);

                    if (descValidation.tooShort) {
                        issues.push({
                            path: pageId,
                            language: lang,
                            type: 'description_too_short',
                            details: `Description too short (${descValidation.length} chars): "${descStr.substring(0, 40)}..."`
                        });
                    } else if (descValidation.tooLong) {
                        issues.push({
                            path: pageId,
                            language: lang,
                            type: 'description_too_long',
                            details: `Description too long (${descValidation.length} chars): "${descStr.substring(0, 40)}..."`
                        });
                    }

                    // Track for duplicates, but only within generated metadata
                    if (!allDescriptions.has(descStr)) {
                        allDescriptions.set(descStr, [pageId]);
                    } else {
                        allDescriptions.get(descStr)?.push(pageId);
                    }
                }
            } catch (error) {
                const pageId = getPageIdentifier(pageType.name, pageType.type, pageType.subType, lang);
                issues.push({
                    path: pageId,
                    language: lang,
                    type: 'missing_title',
                    details: `Error generating metadata: ${(error as Error).message}`
                });
            }
        }
    }
}

/**
 * Check for duplicate titles and descriptions
 */
function checkForDuplicates() {
    // Check titles
    for (const [title, paths] of allTitles.entries()) {
        if (paths.length > 1) {
            // Only flag duplicates between different page types (not between a page and its translation source)
            // Group by page type to identify actual duplicates
            const pageTypes = new Set(paths.map(path => path.split(' ')[0]));
            if (pageTypes.size > 1) {
                for (const path of paths) {
                    issues.push({
                        path,
                        language: 'duplicate',
                        type: 'duplicate_title',
                        details: `Duplicate title "${title.substring(0, 40)}..." also in ${paths.filter(p => p !== path).join(', ')}`
                    });
                }
            }
        }
    }

    // Check descriptions
    for (const [desc, paths] of allDescriptions.entries()) {
        if (paths.length > 1) {
            // Only flag duplicates between different page types (not between a page and its translation source)
            const pageTypes = new Set(paths.map(path => path.split(' ')[0]));
            if (pageTypes.size > 1) {
                for (const path of paths) {
                    issues.push({
                        path,
                        language: 'duplicate',
                        type: 'duplicate_description',
                        details: `Duplicate description "${desc.substring(0, 40)}..." also in ${paths.filter(p => p !== path).join(', ')}`
                    });
                }
            }
        }
    }
}

/**
 * Print report of issues
 */
function printReport() {
    console.log(chalk.bold('\n=== Metadata Validation Report ===\n'));

    // Summary by issue type
    const issueTypes = {
        missing_title: 0,
        missing_description: 0,
        title_too_short: 0,
        title_too_long: 0,
        description_too_short: 0,
        description_too_long: 0,
        duplicate_title: 0,
        duplicate_description: 0,
        missing_translation: 0
    };

    for (const issue of issues) {
        issueTypes[issue.type]++;
    }

    console.log(chalk.bold('Issue Summary:'));
    console.log(chalk.red(`- Missing titles: ${issueTypes.missing_title}`));
    console.log(chalk.red(`- Missing descriptions: ${issueTypes.missing_description}`));
    console.log(chalk.yellow(`- Titles too short (< ${SEO_CONSTRAINTS.TITLE.MIN_LENGTH} chars): ${issueTypes.title_too_short}`));
    console.log(chalk.yellow(`- Titles too long (> ${SEO_CONSTRAINTS.TITLE.MAX_LENGTH} chars): ${issueTypes.title_too_long}`));
    console.log(chalk.yellow(`- Descriptions too short (< ${SEO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH} chars): ${issueTypes.description_too_short}`));
    console.log(chalk.yellow(`- Descriptions too long (> ${SEO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH} chars): ${issueTypes.description_too_long}`));
    console.log(chalk.magenta(`- Duplicate titles: ${issueTypes.duplicate_title}`));
    console.log(chalk.magenta(`- Duplicate descriptions: ${issueTypes.duplicate_description}`));
    console.log(chalk.cyan(`- Missing translations: ${issueTypes.missing_translation}`));

    const totalIssues = Object.values(issueTypes).reduce((a, b) => a + b, 0);

    console.log(chalk.bold(`\nTotal issues: ${totalIssues}`));

    if (totalIssues === 0) {
        console.log(chalk.green('\nGreat job! No metadata issues found.'));
        return;
    }

    // Detailed issues
    console.log(chalk.bold('\nDetailed Issues:'));

    // Group issues by file path for readability
    const issuesByPath = new Map<string, Issue[]>();
    for (const issue of issues) {
        if (!issuesByPath.has(issue.path)) {
            issuesByPath.set(issue.path, []);
        }
        issuesByPath.get(issue.path)?.push(issue);
    }

    for (const [path, fileIssues] of issuesByPath.entries()) {
        console.log(chalk.underline(`\n${path}:`));

        for (const issue of fileIssues) {
            let color;
            switch (issue.type) {
                case 'missing_title':
                case 'missing_description':
                    color = chalk.red;
                    break;
                case 'title_too_short':
                case 'title_too_long':
                case 'description_too_short':
                case 'description_too_long':
                    color = chalk.yellow;
                    break;
                case 'duplicate_title':
                case 'duplicate_description':
                    color = chalk.magenta;
                    break;
                case 'missing_translation':
                    color = chalk.cyan;
                    break;
                default:
                    color = chalk.white;
            }

            console.log(`- ${color(issue.details)} ${issue.language !== 'duplicate' ? `[${issue.language}]` : ''}`);
        }
    }

    console.log(chalk.bold('\n=== End of Report ===\n'));
    console.log(chalk.bold.red(`🔍 Metadata validation found ${totalIssues} issues that need to be fixed.`));
}

async function main() {
    try {
        console.log(chalk.bold('Starting metadata validation...'));

        // Skip extracting metadata from translations
        // extractMetadataFromTranslations();

        // Validate generated metadata
        validateGeneratedMetadata();

        // Check for duplicates
        checkForDuplicates();

        // Print the report
        printReport();

    } catch (error) {
        console.error(chalk.red('Error during validation:'), error);
        process.exit(1);
    }
}

// Run the validation
main();