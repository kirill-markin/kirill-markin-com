import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel will handle the deployment - no need for static export
  trailingSlash: true,  // Appends trailing slashes to URLs like Jekyll does
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kirill-markin.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,  // Enable React strict mode for better code quality
  poweredByHeader: false,  // Remove X-Powered-By header for security
  env: {
    // Site-wide environment variables
    SITE_URL: 'https://kirill-markin.com',
    SITE_NAME: 'Kirill Markin',
  },
  // Add optimization settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
