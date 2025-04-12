# Deployment Guide

This document outlines the deployment process for the Next.js website to Vercel.

## Deployment Options

### 1. Vercel Deployment (Recommended)

The website is configured for optimal deployment on Vercel, which provides:
- Automatic CI/CD pipeline
- Preview deployments for pull requests
- SSL certificates
- Global CDN
- Serverless functions support
- Analytics

#### Steps for Vercel Deployment:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub/GitLab/Bitbucket account

2. **Import the Repository**
   - Click "Import Project"
   - Select "Import Git Repository"
   - Choose this repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure the Project**
   - **Build Command**: Vercel will automatically use `next build`
   - **Output Directory**: Vercel will automatically detect this
   - **Environment Variables**: Add any required environment variables (see below)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy the site
   - A production URL will be provided

5. **Set up Custom Domain**
   - In Vercel dashboard, go to Project Settings > Domains
   - Add your domain (e.g., kirill-markin.com)
   - Follow the instructions to configure DNS
   - Consider enabling both www and non-www versions

### 2. Manual Deployment (Alternative)

If you prefer to deploy to a different hosting provider:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Hosting Requirements**
   - Node.js environment (v18+)
   - Support for server-side rendering
   - Support for API routes
   - SSL certificate

3. **Start the Production Server**
   ```bash
   npm start
   ```

## Environment Variables

The following environment variables should be set in your production environment:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | The full URL of the site | Yes |
| `NODE_ENV` | Set to "production" for production builds | Yes |

## Post-Deployment Checks

After deployment, verify the following:

1. **Performance**
   - Run Lighthouse tests on critical pages
   - Check Core Web Vitals in Google Search Console

2. **Functionality**
   - Test navigation on all pages
   - Test forms and interactive elements
   - Test responsive behavior on mobile devices

3. **SEO**
   - Verify meta tags are properly rendered
   - Check that robots.txt is accessible
   - Submit sitemap to search engines

## Continuous Deployment

The project is set up for continuous deployment on Vercel:

- Each push to the main branch triggers a production deployment
- Each pull request creates a preview deployment
- Environment variables are securely stored in Vercel

## Troubleshooting

Common deployment issues and their solutions:

1. **Build Failures**
   - Check build logs for errors
   - Ensure all dependencies are properly installed
   - Verify environment variables are correctly set

2. **Performance Issues**
   - Enable Vercel Analytics to identify bottlenecks
   - Consider implementing ISR (Incremental Static Regeneration) for frequently changing pages
   - Optimize image sizes and formats

3. **404 Errors**
   - Verify the routing configuration in `next.config.ts`
   - Check that `vercel.json` rewrites are correctly set up
   - Ensure all required pages are included in the build

## Support

For deployment assistance, contact the development team or refer to:
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs) 