import type { NextConfig } from "next";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  // This creates a minimal Node.js server with all dependencies
  output: "standalone",

  // Remove "Powered by Next.js" header for production
  poweredByHeader: false,

  // Enable compression for better performance
  compress: true,

  // TypeScript checking enabled - all errors have been fixed
  typescript: {
    ignoreBuildErrors: false,
  },

  // The rewrites configuration allows you to proxy requests to another server.
  // In this case, we are proxying all requests made to '/api/:path*' to the backend server
  // running on 'https://localhost:3000/api/:path*'.
  // This is useful in development to avoid CORS issues.
  async rewrites() {
    return [];
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
