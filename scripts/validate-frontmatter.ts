/**
 * Article Frontmatter Validation Script
 *
 * Validates the frontmatter of every article markdown file so malformed
 * metadata breaks the build instead of silently dropping or mis-dating an
 * article:
 * - Rejects unknown frontmatter keys, such as a typo in `publish`
 * - Checks required keys, value types and `YYYY-MM-DD` dates
 * - Checks `language` against the directory the article lives in
 * - Checks that translation and original-article references exist on disk
 *
 * Drafts in `src/content/articles/drafts/` are checked for unknown keys and
 * value types only, because the site never renders them.
 *
 * Run with: npm run validate-frontmatter
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import matter from 'gray-matter';
import {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    isValidLanguage,
} from '../src/lib/localization/languages';

const ALLOWED_KEYS = [
    'title',
    'date',
    'lastmod',
    'description',
    'tags',
    'publish',
    'thumbnailUrl',
    'language',
    'translations',
    'originalArticle',
    'slug',
    'keywords',
    'type',
    'publisher',
    'achievementValue',
    'achievementLabel',
    'isVideo',
] as const;

type AllowedKey = (typeof ALLOWED_KEYS)[number];

const ALLOWED_KEY_SET: ReadonlySet<string> = new Set(ALLOWED_KEYS);
const REQUIRED_KEYS: readonly AllowedKey[] = ['title', 'date', 'description', 'tags', 'publish', 'language'];
const STRING_KEYS: readonly AllowedKey[] = [
    'title',
    'description',
    'thumbnailUrl',
    'language',
    'slug',
    'type',
    'publisher',
    'achievementValue',
    'achievementLabel',
];
const NON_EMPTY_STRING_KEYS: readonly AllowedKey[] = ['title', 'description'];
const BOOLEAN_KEYS: readonly AllowedKey[] = ['publish', 'isVideo'];
const STRING_ARRAY_KEYS: readonly AllowedKey[] = ['tags', 'keywords'];
const DATE_KEYS: readonly AllowedKey[] = ['date', 'lastmod'];
const REFERENCE_KEYS: readonly string[] = ['language', 'slug'];

const repositoryRootDirectory = process.cwd();
const articlesDirectory = path.join(repositoryRootDirectory, 'src', 'content', 'articles');
const draftsDirectoryName = 'drafts';
const translationsDirectoryName = 'translations';

type FrontmatterIssue = {
    filePath: string;
    message: string;
};

type TranslationReference = {
    language: string;
    slug: string;
};

type ArticleLocation =
    | { kind: 'published'; language: string }
    | { kind: 'draft' }
    | { kind: 'unexpected' };

type ParsedFrontmatter = {
    frontmatter: Record<string, unknown>;
    rawFrontmatter: string;
};

function parseFrontmatter(fileContents: string): ParsedFrontmatter {
    const parsedFile = matter(fileContents);

    return { frontmatter: { ...parsedFile.data }, rawFrontmatter: parsedFile.matter };
}

function toIssue(filePath: string, message: string): FrontmatterIssue {
    return { filePath, message };
}

function toRepoRelativePath(filePath: string): string {
    return path.relative(repositoryRootDirectory, filePath).split(path.sep).join('/');
}

function describeValue(value: unknown): string {
    if (value === null) {
        return 'null';
    }

    if (Array.isArray(value)) {
        return 'an array';
    }

    if (value instanceof Date) {
        return 'a date';
    }

    return `a ${typeof value}`;
}

async function getMarkdownFilePaths(directoryPath: string): Promise<string[]> {
    const directoryEntries = await fs.readdir(directoryPath, { withFileTypes: true });
    const nestedFileGroups = await Promise.all(
        directoryEntries
            .filter((entry) => entry.isDirectory())
            .map((entry) => getMarkdownFilePaths(path.join(directoryPath, entry.name)))
    );

    const localMarkdownFiles = directoryEntries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
        .map((entry) => path.join(directoryPath, entry.name));

    return [...localMarkdownFiles, ...nestedFileGroups.flat()];
}

function resolveArticleLocation(pathRelativeToArticles: string): ArticleLocation {
    const segments = pathRelativeToArticles.split('/');

    if (segments.length === 1) {
        return { kind: 'published', language: DEFAULT_LANGUAGE };
    }

    if (segments[0] === draftsDirectoryName) {
        return { kind: 'draft' };
    }

    if (segments[0] === translationsDirectoryName && segments.length === 3) {
        // No loader reads translations/<DEFAULT_LANGUAGE>/, so such a file would be silently dropped.
        if (segments[1] === DEFAULT_LANGUAGE) {
            return { kind: 'unexpected' };
        }

        return { kind: 'published', language: segments[1] };
    }

    return { kind: 'unexpected' };
}

/**
 * Mirrors `getArticleFilePath` in src/lib/articles.ts: English articles live in
 * the articles root, every other language in its translations subdirectory.
 */
function getReferencedFilePath(reference: TranslationReference): string {
    if (reference.language === DEFAULT_LANGUAGE) {
        return path.join(articlesDirectory, `${reference.slug}.md`);
    }

    return path.join(articlesDirectory, translationsDirectoryName, reference.language, `${reference.slug}.md`);
}

function readReference(value: unknown): TranslationReference | null {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || value instanceof Date) {
        return null;
    }

    const reference = value as Record<string, unknown>;
    const referenceLanguage = reference.language;
    const referenceSlug = reference.slug;

    if (typeof referenceLanguage !== 'string' || referenceLanguage.trim() === '') {
        return null;
    }

    if (typeof referenceSlug !== 'string' || referenceSlug.trim() === '') {
        return null;
    }

    return { language: referenceLanguage, slug: referenceSlug };
}

function collectReferenceShapeIssues(value: unknown, keyLabel: string, relativePath: string): FrontmatterIssue[] {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || value instanceof Date) {
        return [toIssue(relativePath, `\`${keyLabel}\` must be an object with \`language\` and \`slug\`, got ${describeValue(value)}`)];
    }

    const reference = value as Record<string, unknown>;
    const unknownKeyIssues = Object.keys(reference)
        .filter((key) => !REFERENCE_KEYS.includes(key))
        .map((key) => toIssue(relativePath, `\`${keyLabel}\` has unknown key \`${key}\`, only \`language\` and \`slug\` are allowed`));

    const missingValueIssues = REFERENCE_KEYS
        .filter((key) => typeof reference[key] !== 'string' || (reference[key] as string).trim() === '')
        .map((key) => toIssue(relativePath, `\`${keyLabel}.${key}\` must be a non-empty string, got ${describeValue(reference[key])}`));

    return [...unknownKeyIssues, ...missingValueIssues];
}

function isCalendarDate(year: number, month: number, day: number): boolean {
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    return parsedDate.getUTCFullYear() === year
        && parsedDate.getUTCMonth() === month - 1
        && parsedDate.getUTCDate() === day;
}

function readRawDateSpelling(rawFrontmatter: string, key: AllowedKey): string | null {
    const keyLine = rawFrontmatter.split('\n').find((line) => line.startsWith(`${key}:`));

    if (keyLine === undefined) {
        return null;
    }

    return keyLine
        .slice(key.length + 1)
        .replace(/\s+#.*$/, '')
        .trim()
        .replace(/^["']|["']$/g, '');
}

/**
 * `gray-matter` parses an unquoted `date: 2025-09-27` into a Date and a quoted
 * one into a string, and an impossible day such as `2025-02-31` silently rolls
 * over into the next month, so dates are validated as they are written.
 */
function collectDateIssues(
    frontmatter: Record<string, unknown>,
    rawFrontmatter: string,
    relativePath: string
): FrontmatterIssue[] {
    const issues: FrontmatterIssue[] = [];

    for (const key of DATE_KEYS) {
        if (frontmatter[key] === undefined) {
            continue;
        }

        const spelling = readRawDateSpelling(rawFrontmatter, key);

        if (spelling === null) {
            issues.push(toIssue(relativePath, `\`${key}\` must be written as a top-level \`${key}: YYYY-MM-DD\` line`));
            continue;
        }

        const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(spelling);

        if (!dateParts || !isCalendarDate(Number(dateParts[1]), Number(dateParts[2]), Number(dateParts[3]))) {
            issues.push(toIssue(relativePath, `\`${key}\` must be a calendar date in YYYY-MM-DD form, got "${spelling}"`));
        }
    }

    return issues;
}

function collectUnknownKeyIssues(frontmatter: Record<string, unknown>, relativePath: string): FrontmatterIssue[] {
    return Object.keys(frontmatter)
        .filter((key) => !ALLOWED_KEY_SET.has(key))
        .map((key) => toIssue(relativePath, `unknown frontmatter key \`${key}\``));
}

function collectValueTypeIssues(
    frontmatter: Record<string, unknown>,
    rawFrontmatter: string,
    relativePath: string
): FrontmatterIssue[] {
    const issues: FrontmatterIssue[] = [...collectDateIssues(frontmatter, rawFrontmatter, relativePath)];

    for (const key of STRING_KEYS) {
        const value = frontmatter[key];

        if (value === undefined) {
            continue;
        }

        if (typeof value !== 'string') {
            issues.push(toIssue(relativePath, `\`${key}\` must be a string, got ${describeValue(value)}`));
            continue;
        }

        if (NON_EMPTY_STRING_KEYS.includes(key) && value.trim() === '') {
            issues.push(toIssue(relativePath, `\`${key}\` must not be empty`));
        }
    }

    for (const key of BOOLEAN_KEYS) {
        const value = frontmatter[key];

        if (value !== undefined && typeof value !== 'boolean') {
            issues.push(toIssue(relativePath, `\`${key}\` must be a boolean, got ${describeValue(value)}`));
        }
    }

    for (const key of STRING_ARRAY_KEYS) {
        const value = frontmatter[key];

        if (value === undefined) {
            continue;
        }

        if (!Array.isArray(value)) {
            issues.push(toIssue(relativePath, `\`${key}\` must be an array of non-empty strings, got ${describeValue(value)}`));
            continue;
        }

        const invalidEntries = value.filter((entry) => typeof entry !== 'string' || entry.trim() === '');

        if (invalidEntries.length > 0) {
            issues.push(toIssue(relativePath, `\`${key}\` must contain only non-empty strings`));
        }
    }

    const translations = frontmatter.translations;

    if (translations !== undefined) {
        if (!Array.isArray(translations)) {
            issues.push(toIssue(relativePath, `\`translations\` must be an array of objects with \`language\` and \`slug\`, got ${describeValue(translations)}`));
        } else {
            translations.forEach((entry, index) => {
                issues.push(...collectReferenceShapeIssues(entry, `translations[${index}]`, relativePath));
            });
        }
    }

    if (frontmatter.originalArticle !== undefined) {
        issues.push(...collectReferenceShapeIssues(frontmatter.originalArticle, 'originalArticle', relativePath));
    }

    return issues;
}

function collectPublishedIssues(
    frontmatter: Record<string, unknown>,
    relativePath: string,
    expectedLanguage: string,
    expectedSlug: string
): FrontmatterIssue[] {
    const issues: FrontmatterIssue[] = REQUIRED_KEYS
        .filter((key) => frontmatter[key] === undefined)
        .map((key) => toIssue(relativePath, `missing required frontmatter key \`${key}\``));

    const language = frontmatter.language;

    if (typeof language === 'string') {
        if (!isValidLanguage(language)) {
            issues.push(toIssue(relativePath, `\`language\` must be one of ${SUPPORTED_LANGUAGES.join(', ')}, got "${language}"`));
        } else if (language !== expectedLanguage) {
            issues.push(toIssue(relativePath, `\`language\` must be "${expectedLanguage}" for an article in this directory, got "${language}"`));
        }
    }

    const slug = frontmatter.slug;

    if (typeof slug === 'string' && slug !== expectedSlug) {
        issues.push(toIssue(relativePath, `\`slug\` must match the file name "${expectedSlug}", got "${slug}"`));
    }

    return issues;
}

function collectCrossReferenceIssues(
    frontmatter: Record<string, unknown>,
    relativePath: string,
    existingArticlePaths: ReadonlySet<string>
): FrontmatterIssue[] {
    const issues: FrontmatterIssue[] = [];
    const translations = Array.isArray(frontmatter.translations) ? frontmatter.translations : [];

    for (const entry of translations) {
        const reference = readReference(entry);

        if (!reference) {
            continue;
        }

        const referencedFilePath = getReferencedFilePath(reference);

        if (!existingArticlePaths.has(referencedFilePath)) {
            issues.push(toIssue(relativePath, `translation "${reference.language}/${reference.slug}" points at missing file ${toRepoRelativePath(referencedFilePath)}`));
        }
    }

    const originalArticle = readReference(frontmatter.originalArticle);

    if (originalArticle) {
        if (originalArticle.language !== DEFAULT_LANGUAGE) {
            issues.push(toIssue(relativePath, `\`originalArticle.language\` must be "${DEFAULT_LANGUAGE}", got "${originalArticle.language}"`));
        } else {
            const referencedFilePath = getReferencedFilePath(originalArticle);

            if (!existingArticlePaths.has(referencedFilePath)) {
                issues.push(toIssue(relativePath, `\`originalArticle\` "${originalArticle.slug}" points at missing file ${toRepoRelativePath(referencedFilePath)}`));
            }
        }
    }

    return issues;
}

function collectFileIssues(
    filePath: string,
    fileContents: string,
    existingArticlePaths: ReadonlySet<string>
): FrontmatterIssue[] {
    const relativePath = toRepoRelativePath(filePath);
    let parsedFile: ParsedFrontmatter;

    try {
        parsedFile = parseFrontmatter(fileContents);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return [toIssue(relativePath, `frontmatter is not valid YAML: ${errorMessage.split('\n')[0]}`)];
    }

    const { frontmatter, rawFrontmatter } = parsedFile;
    const location = resolveArticleLocation(path.relative(articlesDirectory, filePath).split(path.sep).join('/'));
    const sharedIssues = [
        ...collectUnknownKeyIssues(frontmatter, relativePath),
        ...collectValueTypeIssues(frontmatter, rawFrontmatter, relativePath),
    ];

    if (location.kind === 'draft') {
        return sharedIssues;
    }

    if (location.kind === 'unexpected') {
        return [
            ...sharedIssues,
            toIssue(relativePath, `unexpected article location, articles live in src/content/articles/ for ${DEFAULT_LANGUAGE}, src/content/articles/${translationsDirectoryName}/<lang>/ for every other language, or src/content/articles/${draftsDirectoryName}/`),
        ];
    }

    return [
        ...sharedIssues,
        ...collectPublishedIssues(frontmatter, relativePath, location.language, path.basename(filePath, '.md')),
        ...collectCrossReferenceIssues(frontmatter, relativePath, existingArticlePaths),
    ];
}

function printReport(issues: readonly FrontmatterIssue[], fileCount: number): void {
    if (issues.length === 0) {
        console.log(chalk.green(`No frontmatter issues found in ${fileCount} article files.`));
        return;
    }

    console.log(chalk.bold.red(`\nFound ${issues.length} frontmatter issues in ${fileCount} article files:\n`));

    for (const frontmatterIssue of issues) {
        console.log(`${chalk.underline(frontmatterIssue.filePath)}: ${chalk.red(frontmatterIssue.message)}`);
    }

    console.log(chalk.bold(`\nAllowed keys: ${ALLOWED_KEYS.join(', ')}`));
    console.log(chalk.bold(`Required keys: ${REQUIRED_KEYS.join(', ')}`));
}

async function main(): Promise<void> {
    console.log(chalk.bold('Validating article frontmatter...'));

    const markdownFilePaths = (await getMarkdownFilePaths(articlesDirectory)).sort();
    const existingArticlePaths: ReadonlySet<string> = new Set(markdownFilePaths);
    const issues: FrontmatterIssue[] = [];

    for (const filePath of markdownFilePaths) {
        const fileContents = await fs.readFile(filePath, 'utf8');
        issues.push(...collectFileIssues(filePath, fileContents, existingArticlePaths));
    }

    printReport(issues, markdownFilePaths.length);

    if (issues.length > 0) {
        process.exitCode = 1;
    }
}

main().catch((error: unknown) => {
    console.error(chalk.red('Failed to validate article frontmatter.'), error);
    process.exitCode = 1;
});
