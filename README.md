# Kirill Markin - Personal Website

This is a modern, responsive personal website for Kirill Markin, built with Next.js. The site was migrated from Jekyll to Next.js for improved performance, developer experience, and modern web capabilities.

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
- **Metadata API**: Yes - For improved SEO
- **Import alias**: Yes - Using default import alias (`@/*`)

## Project Structure

```
website-next-js/
├── public/           # Static assets (favicons, images)
│   ├── icons/        # SVG icons
│   ├── images/       # Website images
│   └── ...           # Other static assets
├── src/
│   ├── app/          # App router pages and layouts
│   │   ├── page.tsx  # Home page
│   │   ├── services/ # Services pages
│   │   ├── meet/     # Meeting booking pages
│   │   │   ├── short/# Short meeting booking
│   │   │   └── all/  # All meeting options
│   │   ├── pay/      # Payment pages
│   │   │   └── stripe/# Stripe payment
│   │   ├── not-found.tsx # 404 page
│   │   ├── layout.tsx
│   │   └── page.module.css
│   ├── components/   # Reusable UI components
│   ├── data/         # Data files for content
│   ├── lib/          # Utility functions
│   ├── styles/       # Global styles
│   └── types/        # TypeScript definitions
├── next.config.ts    # Next.js configuration
└── ...               # Other configuration files
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migration Details

The migration from Jekyll to Next.js involved:

1. Converting Jekyll layouts to Next.js layouts and pages
2. Converting Jekyll includes to React components
3. Moving Jekyll data to TypeScript data files
4. Implementing CSS modules for styling
5. Setting up proper metadata for SEO
6. Optimizing assets and routing

## Deployment

This project is configured for deployment on Vercel. See the [DEPLOYMENT.md](./DEPLOYMENT.md) file for detailed deployment instructions.

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
