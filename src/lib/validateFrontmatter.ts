import { z } from 'zod';

const translationRefSchema = z.object({
    language: z.string(),
    slug: z.string(),
});

const baseSchema = z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]),
    description: z.string(),
    tags: z.array(z.string()),
    publish: z.boolean(),
    thumbnailUrl: z.string(),
    language: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    type: z.string().optional(),
    publisher: z.string().optional(),
    achievementValue: z.string().optional(),
    achievementLabel: z.string().optional(),
    isVideo: z.boolean().optional(),
    translations: z.array(translationRefSchema).optional(),
    originalArticle: translationRefSchema.optional(),
}).strict();

const translatedSchema = baseSchema.extend({
    language: z.string(),
    originalArticle: translationRefSchema,
});

export type Frontmatter = z.infer<typeof baseSchema>;

export function validateFrontmatter(data: unknown, isTranslation = false): Frontmatter {
    const schema = isTranslation ? translatedSchema : baseSchema;
    return schema.parse(data);
}
