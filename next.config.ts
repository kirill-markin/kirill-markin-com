import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel will handle the deployment - no need for static export
  trailingSlash: true,  // Appends trailing slashes to URLs like Jekyll does
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kirill-markin.com',
        port: '',
        pathname: '/**',
      },
      // Add localhost for development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Enable dangerouslyAllowSVG for SVG support
    dangerouslyAllowSVG: true,
    // Apply content security policy
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Set unoptimized to false to enable image optimization
    unoptimized: false,
  },
  reactStrictMode: true,  // Enable React strict mode for better code quality
  poweredByHeader: false,  // Remove X-Powered-By header for security
  env: {
    // Site-wide environment variables
    SITE_URL: 'https://kirill-markin.com/',
    SITE_NAME: 'Kirill Markin',
  },
  // Add optimization settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Add redirect for /ru/
  async redirects() {
    return [
      {
        source: '/ru/',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ru',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ru/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  // Add headers configuration for SEO
  async headers() {
    // Set X-Robots-Tag: noindex for all non-production environments
    // This ensures custom domains used for preview/staging are also not indexed
    if (process.env.VERCEL_ENV !== 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
        },
      ];
    }

    return [];
  },
  // swcMinify has been removed as it's no longer recognized in Next.js 15.3.0
};

export default nextConfig;
