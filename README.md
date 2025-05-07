# Kirill Markin - Personal Website

This is a modern, responsive personal website for Kirill Markin, built with Next.js. The site was migrated from Jekyll to Next.js for improved performance, developer experience, and modern web capabilities.

## Key Architecture Principles

### Static Generation First Approach

This project follows a **"static generation first"** approach:

- All pages should be statically generated at build time whenever possible
- Use `generateStaticParams` for dynamic routes to pre-render all known path variations
- Even server-side rendered (SSR) pages should use static optimization when the content is predictable
- Aim for zero server-side computation at request time in production

Benefits of this approach:
- Blazing fast page loads with content served directly from CDN
- Excellent SEO as search engines receive complete HTML
- Reduced server load and hosting costs
- Better reliability and offline capabilities

### Server Components with Client Islands

The application architecture uses React Server Components with selective client hydration:
- Most UI is rendered as server components for performance
- Client components ("islands") are used only when interactivity is required
- Minimal JavaScript is sent to the browser

### Multilingual Support

The website supports multiple languages with a language-in-path approach:
- English (default) - no language prefix in URL: `/articles/slug/`
- Non-default languages - language prefix with localized segments: `/es/articulos/slug/`
- Content is organized with translations in dedicated subdirectories
- Path segments are localized for each language using a mapping system
- All routes are pre-rendered at build time for all supported languages

## Migration Overview

This project is a complete migration from a Jekyll-based static site to a Next.js application. The migration preserves the original design and user experience while adding modern web features:

- Responsive design with improved performance
- Server-side rendering and static generation capabilities
- Enhanced SEO with metadata API
- Improved developer experience with TypeScript
- Modern asset optimization with Next.js Image component

## Project Configuration

This project uses:

- **TypeScript**: For type safety and improved developer experience
- **Next.js App Router**: For file-based routing and metadata API
- **CSS Modules**: For component-scoped styling
- **Markdown**: For content management with frontmatter
- **Image Optimization**: Using Next.js Image component
- **Static Optimization**: Using `generateStaticParams` for pre-rendering all routes

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To run tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Key Features

- **Multilingual Support**: Full localization with 5 supported languages
- **Server Components**: Optimized rendering with minimal client-side JavaScript
- **Static Pre-rendering**: All routes and variations pre-rendered at build time
- **SEO Optimization**: Dynamic metadata generation and structured data
- **Content Management**: Markdown-based article system with translations
- **Responsive Design**: Optimized for all device sizes

## Optimization Strategies

### Static Generation

The project uses static generation with `generateStaticParams` to pre-render all path variations at build time. This ensures all pages (including filtered views and translations) are generated as static HTML and served directly from CDN.

### Server Components with Client Hydration

The architecture uses a hybrid approach:
- Server Components handle core rendering and data presentation
- Client Components provide interactive features only where needed
- This minimizes client-side JavaScript while preserving interactive functionality

## Deployment

This project is configured for deployment on Vercel. See the [DEPLOYMENT.md](./DEPLOYMENT.md) file for detailed deployment instructions.

The deployment process automatically:
- Builds and optimizes the application
- Pre-renders all static pages
- Deploys to global CDN network
- Provides analytics and monitoring

## Technologies Used

- **Next.js**: For server-side rendering and static site generation
- **React**: For component-based UI development
- **TypeScript**: For type safety
- **CSS Modules**: For component-scoped styling
- **ESLint**: For code quality
- **Jest**: For unit testing and SEO validation
- **Vercel**: For deployment and hosting

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vercel Platform](https://vercel.com)
