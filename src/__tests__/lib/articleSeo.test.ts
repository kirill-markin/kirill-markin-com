import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { validateMetadata } from '@/lib/seoValidation';

// Mock file system functions
jest.mock('fs', () => ({
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
    existsSync: jest.fn(() => true),
    statSync: jest.fn(() => ({ isDirectory: () => true }))
}));

describe('Article Metadata SEO Tests', () => {
    // Sample article metadata for testing
    const sampleArticles = [
        // Valid article (title: 65 chars, description: 155 chars)
        {
            path: 'src/content/articles/cursor-ide-rules-for-ai.md',
            content: `---
title: "${'A'.repeat(65)}"
date: 2023-05-06
slug: "cursor-ide-rules-for-ai"
language: "en"
description: "${'A'.repeat(155)}"
tags: ["productivity", "cursor-ide", "ai", "llm"]
---`,
        },
        // Article with too long title (80 chars)
        {
            path: 'src/content/articles/too-long-title.md',
            content: `---
title: "${'A'.repeat(80)}"
date: 2023-05-07
slug: "too-long-title"
language: "en"
description: "${'A'.repeat(155)}"
tags: ["seo", "examples"]
---`,
        },
        // Article with too short description (120 chars)
        {
            path: 'src/content/articles/short-description.md',
            content: `---
title: "${'A'.repeat(65)}"
date: 2023-05-08
slug: "short-description"
language: "en"
description: "${'A'.repeat(120)}"
tags: ["seo", "examples"]
---`,
        },
        // Article with too long description (170 chars)
        {
            path: 'src/content/articles/long-description.md',
            content: `---
title: "${'A'.repeat(65)}"
date: 2023-05-09
slug: "long-description"
language: "en"
description: "${'A'.repeat(170)}"
tags: ["seo", "examples"]
---`,
        },
        // Spanish article (valid - title: 65 chars, description: 155 chars)
        {
            path: 'src/content/articles/translations/es/reglas-cursor-ide-para-ia.md',
            content: `---
title: "${'A'.repeat(65)}"
date: 2023-05-06
slug: "reglas-cursor-ide-para-ia"
language: "es"
description: "${'A'.repeat(155)}"
tags: ["productividad", "cursor-ide", "ia", "llm"]
---`,
        }
    ];

    beforeEach(() => {
        // Set up file system mocks
        (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
            if (dir.includes('translations/es')) {
                return ['reglas-cursor-ide-para-ia.md'];
            }
            return ['cursor-ide-rules-for-ai.md', 'too-long-title.md', 'short-description.md', 'long-description.md'];
        });

        (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
            const article = sampleArticles.find(a => filePath.includes(path.basename(a.path)));
            if (article) {
                return article.content;
            }
            return '';
        });
    });

    describe('Article Frontmatter SEO Validation', () => {
        it('should validate SEO for article with correct metadata', () => {
            const filePath = 'src/content/articles/cursor-ide-rules-for-ai.md';
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const validation = validateMetadata(data.title, data.description);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should detect article with title that is too long', () => {
            const filePath = 'src/content/articles/too-long-title.md';
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const validation = validateMetadata(data.title, data.description);

            expect(validation.valid).toBe(false);
            expect(validation.title.valid).toBe(false);
            expect(validation.title.tooLong).toBe(true);
            expect(validation.description.valid).toBe(true);
        });

        it('should detect article with description that is too short', () => {
            const filePath = 'src/content/articles/short-description.md';
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const validation = validateMetadata(data.title, data.description);

            expect(validation.valid).toBe(false);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(false);
            expect(validation.description.tooShort).toBe(true);
        });

        it('should detect article with description that is too long', () => {
            const filePath = 'src/content/articles/long-description.md';
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const validation = validateMetadata(data.title, data.description);

            expect(validation.valid).toBe(false);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(false);
            expect(validation.description.tooLong).toBe(true);
        });

        it('should validate Spanish article metadata', () => {
            const filePath = 'src/content/articles/translations/es/reglas-cursor-ide-para-ia.md';
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(fileContent);

            const validation = validateMetadata(data.title, data.description);

            expect(validation.valid).toBe(true);
            expect(validation.title.valid).toBe(true);
            expect(validation.description.valid).toBe(true);
        });
    });

    describe('Process all articles', () => {
        it('should report articles with SEO issues', () => {
            // This test simulates a comprehensive check of all articles
            const checkArticleSeo = (filePath: string) => {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data } = matter(fileContent);
                return {
                    file: path.basename(filePath),
                    validation: validateMetadata(data.title, data.description)
                };
            };

            const results = [
                checkArticleSeo('src/content/articles/cursor-ide-rules-for-ai.md'),
                checkArticleSeo('src/content/articles/too-long-title.md'),
                checkArticleSeo('src/content/articles/short-description.md'),
                checkArticleSeo('src/content/articles/long-description.md'),
                checkArticleSeo('src/content/articles/translations/es/reglas-cursor-ide-para-ia.md')
            ];

            const invalidArticles = results.filter(r => !r.validation.valid);

            // We expect 3 articles to have SEO issues (too long title, short desc, long desc)
            expect(invalidArticles.length).toBe(3);
            expect(invalidArticles.map(a => a.file)).toContain('too-long-title.md');
            expect(invalidArticles.map(a => a.file)).toContain('short-description.md');
            expect(invalidArticles.map(a => a.file)).toContain('long-description.md');

            // Check the valid articles
            const validArticles = results.filter(r => r.validation.valid);
            expect(validArticles.length).toBe(2);
            expect(validArticles.map(a => a.file)).toContain('cursor-ide-rules-for-ai.md');
            expect(validArticles.map(a => a.file)).toContain('reglas-cursor-ide-para-ia.md');
        });
    });
}); 