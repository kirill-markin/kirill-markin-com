# Content Directory

This directory contains the markdown content for articles displayed on the website.

## Directory Structure

- `src/content/articles/` - Contains markdown files for English articles
- `src/content/articles/translations/` - Contains translations organized by language code
- `public/articles/` - Contains images and other assets for articles

## Adding New Articles

1. Create a new markdown file in `src/content/articles/` with a descriptive filename (becomes the URL slug)
2. Add the required frontmatter (see template below)
3. Write your article content in markdown
4. Set `publish: true` when ready to publish

## Adding Translations

1. Create the appropriate language subdirectory in `src/content/articles/translations/` (e.g., `es/`, `zh/`)
2. Add the translated article with its own slug in that directory
3. Include the `originalArticle` field in the frontmatter to link back to the English version
4. Update the English article's frontmatter to include this translation in its `translations` array

## Article Frontmatter Template

### English Article

```markdown
---
title: Your Article Title
date: 2023-09-15
description: A concise description (120-155 chars) for SEO
tags: [tag1, tag2]
publish: true
thumbnailUrl: /articles/your-article-slug.webp
language: en
translations:
  - language: es
    slug: tu-articulo-titulo
  - language: zh
    slug: ni-de-wenzhang-biaoti
---

Your article content here...
```

### Translated Article

```markdown
---
title: Tu Título del Artículo
date: 2023-09-15
description: Una descripción concisa (120-155 caracteres) para SEO
tags: [etiqueta1, etiqueta2]
publish: true
thumbnailUrl: /articles/your-article-slug.webp
language: es
originalArticle:
  language: en
  slug: your-article-title
---

El contenido de tu artículo aquí...
```

## Asset Handling

When adding images:

1. Place article images in the `public/articles/` directory
2. Use descriptive filenames that include the article slug
3. Reference assets using absolute paths:

```markdown
![Image description](/articles/your-article-image.webp)
```

## Important Notes

- The `description` field is critical for SEO (120-155 characters)
- `publish: true` is required for articles to appear on the site
- Use the `language` field to specify the article's language
- Always maintain bidirectional references between originals and translations
- Images should use the `.webp` format for optimal performance
- Only the documented frontmatter keys are allowed; extra keys will cause the validation script to fail

## Notes

- Always use absolute paths starting with `/` for assets
- Articles are sorted by date (newest first)
- Set meaningful tags for better categorization 

## Supported Languages

The website supports the following languages that together represent the top 5 most spoken languages in the world:

| Language | Code | Native Name | Approx. Speakers | % of World Population |
|----------|------|-------------|------------------|------------------------|
| English  | en   | English     | 1.5 billion      | 18.7%                  |
| Chinese  | zh   | 中文        | 1.1 billion      | 14.1%                  |
| Hindi    | hi   | हिन्दी      | 600 million      | 7.5%                   |
| Spanish  | es   | Español     | 550 million      | 6.9%                   |
| Arabic   | ar   | العربية     | 420 million      | 5.2%                   |

These five languages allow the website to reach approximately 52% of the world's population, making content accessible to a diverse global audience. All website UI elements and navigation are translated into these languages, with article content being progressively translated as resources permit. 