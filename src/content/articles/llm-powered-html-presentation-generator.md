---
title: "LLM-Powered HTML Presentation Generator: How to Build a Simple Web App"
date: 2024-11-10
tags: [development, ai, tutorial]
aliases: [html-presentation-generator, llm-app-tutorial]
related: []
publish: true
lastmod: 2025-04-14
---

# LLM-Powered HTML Presentation Generator: How to Build a Simple Web App

## Concept

A minimalist approach to creating presentations using plain HTML files and AI assistance in Cursor IDE. Instead of complex presentation software, use simple HTML files for each slide, letting AI help with content and styling. Perfect for developers who prefer working in their IDE and want version control for their presentations.

## Why This Approach?

1. **IDE-First Development**
   - Create and edit slides directly in Cursor IDE
   - Use AI commands to generate or modify slide content
   - Preview changes instantly with Live Server
   - Version control your presentations with Git

2. **Simple File Structure**
   - Each slide is a separate HTML file
   - Self-contained styles within each slide
   - No build tools or complex dependencies
   - Easy to understand and modify

3. **AI-Powered Creation**
   - Generate slide content using natural language
   - Get styling suggestions from AI
   - Convert bullet points to beautiful layouts
   - Optimize for PDF export automatically

## How to Use with Cursor

1. **Create New Slides**
   ```
   /new slide about project overview
   ```
   AI generates a new HTML file with appropriate content and styling

2. **Modify Existing Slides**
   ```
   /improve slide-02.html with more visual hierarchy
   ```
   AI suggests style improvements while maintaining structure

3. **Generate PDF**
   ```
   /build pdf from slides/*
   ```
   AI helps combine slides and optimize for PDF output

## Project Structure

```
slides-html-pdf/
├── src/                      # Source files
│   ├── slides/              # Individual slide files
│   │   ├── slide-01.html    # Title slide
│   │   ├── slide-02.html    # Introduction
│   │   ├── slide-03.html    # Content slides...
│   │   └── slide-XX.html    # More slides
│   └── assets/             # Shared assets
│       ├── styles/              
│       │   └── base.css     # Common styles for all slides
│       └── images/          # Images used in slides
├── scripts/                 # Build and utility scripts
│   ├── build.sh            # Combines slides into single HTML
│   └── pdf.sh              # Converts HTML to PDF
├── dist/                    # Distribution/output files
│   ├── presentation.html    # Combined presentation
│   └── presentation.pdf     # Generated PDF
└── README.md               # Project documentation
```

## Slide Structure

Each slide is a self-contained HTML file that includes its own styles. Slides are designed in landscape orientation (16:9) for optimal presentation view:

```html
<!-- slide-01.html -->
<div class="slide" id="slide-1">
  <h1>Presentation Title</h1>
  <p>Subtitle or additional info</p>
  <style>
    /* Base slide styles (from base.css) */
    .slide {
      width: 1280px;          /* 16:9 aspect ratio */
      height: 720px;
      margin: 0;
      padding: 40px;
      box-sizing: border-box;
      page-break-after: always;  /* Force page break in PDF */
      position: relative;
      overflow: hidden;
    }

    /* Slide-specific styles */
    #slide-1 {
      background: linear-gradient(45deg, #1a1a1a, #4a4a4a);
      color: white;
    }
  </style>
</div>
```

The `base.css` contains common slide layout settings:

```css
/* src/assets/styles/base.css */
@page {
  size: 1280px 720px;  /* Landscape 16:9 */
  margin: 0;
}

body {
  margin: 0;
  padding: 0;
}

.slide {
  /* Base slide styles as shown above */
}

/* Print-specific optimizations */
@media print {
  .slide {
    page-break-after: always;
    break-after: page;
  }
}
```

This structure ensures that:
- Each slide is exactly 16:9 (1280x720px)
- Slides are properly oriented in landscape mode
- Content is correctly paginated in PDF export
- Each slide starts on a new page in the PDF

## Benefits

1. **Developer Experience**
   - Work in your favorite IDE
   - Use familiar tools (Git, Live Server)
   - AI assistance for content and styling
   - Quick iterations with instant preview

2. **Maintainability**
   - Each slide is a separate file
   - Easy to reorder or modify slides
   - Version control friendly
   - Simple to share and collaborate

3. **Output Quality**
   - Clean, semantic HTML
   - Modern CSS layouts
   - Optimized PDF export
   - Consistent styling across slides

## Getting Started

1. Clone the repository structure
2. Open in Cursor IDE
3. Create your first slide with AI assistance
4. Preview with Live Server
5. Export to PDF when ready

The focus is on simplicity and developer experience - no complex build tools, no framework lock-in, just plain HTML files with AI-powered assistance in your IDE.

## Example Implementation

<https://github.com/kirill-markin/slides-html-pdf> - here is an example implementation of this approach.

