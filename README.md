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

## Migration Overview

This project is a complete migration from a Jekyll-based static site to a Next.js application. The migration preserves the original design and user experience while adding modern web features:

- Responsive design with improved performance
- Server-side rendering and static generation capabilities
- Enhanced SEO with metadata API
- Improved developer experience with TypeScript
- Modern asset optimization with Next.js Image component

## Project Configuration

This project was set up with the following configuration:

- **TypeScript**: Yes - For type safety and improved developer experience
- **ESLint**: Yes - For code quality and consistency
- **Tailwind CSS**: No - Custom styling approach with CSS Modules
- **Code organization**: Yes - Code is inside `src/` directory
- **Router**: Yes - Uses App Router for SEO benefits and modern routing
- **Image Optimization**: Yes - Using Next.js Image component
- **Metadata API**: Yes - For improved SEO with dynamic metadata generation
- **Import alias**: Yes - Using default import alias (`@/*`)
- **Static Optimization**: Yes - Using `generateStaticParams` for pre-rendering

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Recent Updates and Features

- **Server-side Services Page**: Implemented server rendering for the services page with category filters
- **Static Pre-rendering**: Added `generateStaticParams` to pre-render all category variations
- **Scroll Position Management**: Added client-side scroll position preservation when changing categories
- **SEO Optimization**: Implemented dynamic metadata for each category page
- **Performance Improvements**: Optimized images and CSS for faster loading
- **Improved UX**: Added descriptive texts for service categories

## Optimization Strategies

### Static Generation

The project uses static generation with `generateStaticParams` to pre-render all category pages at build time. This ensures all variations of the services page (with different category filters) are generated as static HTML during the build process and served directly from CDN.

### Server Components with Client Hydration

The architecture uses a hybrid approach:
- Server Components handle core rendering and data presentation
- Client Components provide interactive features like scroll position management
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
- **Vercel**: For deployment and hosting

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vercel Platform](https://vercel.com)
