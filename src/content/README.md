# Content Directory

This directory contains the markdown content for articles displayed on the website.

## Directory Structure

- `src/content/articles/` - Contains markdown files for articles
- `public/articles/assets/` - Contains images and other assets referenced in articles

## Adding New Articles

1. Create a new markdown file in `src/content/articles/` with a descriptive filename (becomes the URL slug)
2. Add the required frontmatter (see template below)
3. Write your article content in markdown
4. Set `publish: true` when ready to publish

## Article Frontmatter Template

```markdown
---
title: Your Article Title
date: 2023-09-15
tags:
  - tag1
  - tag2
aliases:
  - alternative-name
related: []
publish: true
lastmod: 2023-09-16
thumbnailUrl: /articles/assets/your-article-folder/thumbnail.webp
description: A short description of your article (optional)
type: Article
language: en
publisher: Kirill Markin
achievementValue: 10k
achievementLabel: Views
isVideo: false
---

Your article content here...
```

## Asset Handling

When adding images or other assets:

1. Create a folder in `public/articles/assets/` named after your article slug
2. Place assets in this folder
3. Reference assets in markdown using absolute paths from the public directory:

```markdown
![Image description](/articles/assets/your-article-folder/image-name.webp)
```

## Notes

- Always use absolute paths starting with `/` for assets
- The `publish: true` flag is required for articles to appear on the site
- Articles are sorted by date (newest first)
- Set meaningful tags for better categorization 