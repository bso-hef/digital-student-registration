import type { NextConfig } from "next";

/**
 * Parse URL from environment variable to extract components
 */
function parseAppUrl(urlString: string | undefined): {
  protocol: "http" | "https";
  hostname: string;
  port: string;
} {
  const defaultUrl = "http://localhost:3000";
  const url = urlString || defaultUrl;

  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
    };
  } catch (error) {
    console.warn(
      `Failed to parse NEXT_PUBLIC_APP_URL: ${url}. Using defaults.`,
    );
    return {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
    };
  }
}

// Get URL components from environment variable
const appUrl = parseAppUrl(process.env.NEXT_PUBLIC_APP_URL);

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
      // Dynamic configuration based on NEXT_PUBLIC_APP_URL
      {
        protocol: appUrl.protocol,
        hostname: appUrl.hostname,
        port: appUrl.port,
        pathname: "/images/**",
      },
      // Also allow the opposite protocol for flexibility (e.g., local dev with https, prod with http proxy)
      {
        protocol: appUrl.protocol === "https" ? "http" : "https",
        hostname: appUrl.hostname,
        port: appUrl.port,
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
