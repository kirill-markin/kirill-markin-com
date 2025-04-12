import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel will handle the deployment - no need for static export
  trailingSlash: true,  // Appends trailing slashes to URLs like Jekyll does
  images: {
    domains: ['kirill-markin.com'],  // Allowed image domains
  },
  reactStrictMode: true,  // Enable React strict mode for better code quality
  poweredByHeader: false,  // Remove X-Powered-By header for security
  env: {
    // Site-wide environment variables
    SITE_URL: 'https://kirill-markin.com',
    SITE_NAME: 'Kirill Markin',
  }
};

export default nextConfig;
