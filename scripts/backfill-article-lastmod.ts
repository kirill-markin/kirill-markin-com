import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import matter from 'gray-matter';

type ArticleFrontmatter = {
    lastmod?: string;
    publish?: boolean;
};

const execFileAsync = promisify(execFile);
const repositoryRootDirectory = process.cwd();
const articlesDirectory = path.join(repositoryRootDirectory, 'src', 'content', 'articles');

function toRepoRelativePath(filePath: string): string {
    return path.relative(repositoryRootDirectory, filePath).split(path.sep).join('/');
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

async function getLastCommitDate(filePath: string): Promise<string> {
    const repositoryRelativePath = toRepoRelativePath(filePath);
    const { stdout } = await execFileAsync(
        'git',
        ['log', '-1', '--format=%cI', '--', repositoryRelativePath],
        { cwd: repositoryRootDirectory }
    );

    const trimmedDate = stdout.trim();

    if (!trimmedDate) {
        throw new Error(`No git history found for file: ${repositoryRelativePath}`);
    }

    return trimmedDate.slice(0, 10);
}

function insertLastmod(frontmatterBlock: string, lastmod: string): string {
    const frontmatterLines = frontmatterBlock.split('\n');
    const dateLineIndex = frontmatterLines.findIndex((line) => line.startsWith('date:'));
    const insertIndex = dateLineIndex >= 0 ? dateLineIndex + 1 : 1;
    frontmatterLines.splice(insertIndex, 0, `lastmod: ${lastmod}`);
    return frontmatterLines.join('\n');
}

function withLastmod(content: string, lastmod: string): string {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);

    if (!frontmatterMatch) {
        throw new Error('Markdown file is missing frontmatter.');
    }

    const updatedFrontmatter = insertLastmod(frontmatterMatch[1], lastmod);
    return content.replace(frontmatterMatch[0], `---\n${updatedFrontmatter}\n---\n`);
}

async function main(): Promise<void> {
    const markdownFilePaths = await getMarkdownFilePaths(articlesDirectory);
    let updatedFiles = 0;

    for (const filePath of markdownFilePaths) {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const { data } = matter(fileContents);
        const frontmatter = data as ArticleFrontmatter;

        if (frontmatter.publish !== true || frontmatter.lastmod) {
            continue;
        }

        const lastmod = await getLastCommitDate(filePath);
        const updatedContents = withLastmod(fileContents, lastmod);
        await fs.writeFile(filePath, updatedContents, 'utf8');
        updatedFiles += 1;
    }

    console.log(`Backfilled lastmod in ${updatedFiles} published article files.`);
}

main().catch((error) => {
    console.error('Failed to backfill article lastmod.', error);
    process.exitCode = 1;
});
